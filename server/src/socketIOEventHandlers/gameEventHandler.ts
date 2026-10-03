import { isValidObjectId } from 'mongoose';
import { isRated, rateGame, START_RATING } from '../game/elo';
import { DRAW, RED, BLUE, capturedBy } from '../game/engine';
import { GameRooms, Result, Room } from '../game/rooms';
import { AuthenticatedSocket as Socket, getIO } from '../initializeSocket';
import GAME from '../models/game';
import USER from '../models/user';

/**
 * Online multiplayer events. The client sends intents, the server validates them with the rules
 * engine and broadcasts the authoritative room state to everyone in the game.
 *
 *  client -> server (all take an ack callback that receives { ok, error?, ... })
 *    game:create                      create a game, you play RED          -> { code, room }
 *    game:join        { code }        join / rejoin a game                 -> { room }
 *    game:action      { code, action } play a move ({type:'move',from,to}) or stop a capture chain ({type:'endChain'})
 *    game:resign      { code }
 *    game:rematch     { code }        both players must ask; colours are swapped
 *    game:leave       { code }        leaving a running game forfeits it
 *    game:quickMatch                  find a random opponent              -> { code } or { waiting: true }
 *    game:cancelQuickMatch
 *    game:challenge   { userId }      challenge another (online) player   -> { code }
 *    game:declineChallenge { code }
 *
 *  server -> client
 *    game:state       room view       sent after every change
 *    game:closed      { code, reason }
 *    game:matched     { code }        quick match found an opponent
 *    game:challenged  { code, from }  someone challenged you
 *    game:challengeCancelled { code, reason }  a challenge to you was withdrawn, declined or expired
 *    game:rated       { code, gameId, changes }  rating changes once a finished game is saved
 */

const channel = (code: string) => `game:${code}`;
const userChannel = (userId: string) => `user:${userId}`;

type Ack = (response: Record<string, unknown>) => void;
const safeAck = (ack: unknown): Ack => (typeof ack === 'function' ? (ack as Ack) : () => undefined);

/**
 * Stores a finished game, updates both players' ratings and tells the room the rating changes
 * ('game:rated' { code, changes: { [userId]: { change, rating } } }).
 */
const saveFinishedGame = async (room: Room) => {
  const red = room.seats[RED];
  const blue = room.seats[BLUE];
  if (!red || !blue) return;
  // Copy everything now: a rematch can reset the room while we wait for the database.
  const { winner, reason, moveNumber } = room.state;
  const history = [...room.history];
  const score = `${capturedBy(room.state, RED)}-${capturedBy(room.state, BLUE)}`;
  const startTime = room.startedAt ? new Date(room.startedAt) : undefined;
  const endTime = new Date(room.finishedAt ?? Date.now());
  const rated = isRated(moveNumber);
  try {
    let ratingChanges: { red: number; blue: number } | undefined;
    let newRatings: { red: number; blue: number } | undefined;
    if (rated) {
      const players = await USER.find({ _id: { $in: [red.userId, blue.userId] } }).select('rating ratedGames');
      const find = (id: string) => players.find((p) => String(p._id) === id);
      const r = find(red.userId);
      const b = find(blue.userId);
      if (r && b) {
        const redScore = winner === RED ? 1 : winner === BLUE ? 0 : 0.5;
        const result = rateGame(
          { rating: r.rating ?? START_RATING, ratedGames: r.ratedGames ?? 0 },
          { rating: b.rating ?? START_RATING, ratedGames: b.ratedGames ?? 0 },
          redScore,
        );
        ratingChanges = { red: result.a.change, blue: result.b.change };
        newRatings = { red: result.a.rating, blue: result.b.rating };
      }
    }

    const game = await GAME.create({
      code: room.code,
      players: [red.userId, blue.userId],
      winner: winner === RED ? red.userId : winner === BLUE ? blue.userId : undefined,
      result: winner === DRAW ? 'draw' : winner === RED ? 'red' : 'blue',
      reason,
      score,
      moves: moveNumber,
      history,
      rated: Boolean(ratingChanges),
      ratingChanges,
      startTime,
      endTime,
    });

    const update = async (userId: string, change?: number, rating?: number) => {
      if (change !== undefined) {
        // Accounts created before ratings existed have no rating fields; $inc would start them at 0.
        await USER.updateOne(
          { _id: userId, rating: { $exists: false } },
          { $set: { rating: START_RATING, ratedGames: 0, peakRating: START_RATING } },
        );
      }
      return USER.updateOne(
        { _id: userId },
        change === undefined
          ? { $push: { gamesPlayed: game._id } }
          : // $inc (not $set) so two games finishing at once can't overwrite each other.
            { $push: { gamesPlayed: game._id }, $inc: { rating: change, ratedGames: 1 }, $max: { peakRating: rating } },
      );
    };
    await Promise.all([
      update(red.userId, ratingChanges?.red, newRatings?.red),
      update(blue.userId, ratingChanges?.blue, newRatings?.blue),
    ]);

    if (ratingChanges && newRatings) {
      getIO()
        .to(channel(room.code))
        .emit('game:rated', {
          code: room.code,
          gameId: String(game._id),
          changes: {
            [red.userId]: { change: ratingChanges.red, rating: newRatings.red },
            [blue.userId]: { change: ratingChanges.blue, rating: newRatings.blue },
          },
        });
    }
  } catch (error) {
    console.error('[game] could not save finished game', room.code, error);
  }
};

let rooms: GameRooms | null = null;

/** Number of distinct users with at least one connected socket. */
export const countOnlineUsers = (): number => {
  let n = 0;
  for (const name of getIO().of('/').adapter.rooms.keys()) if (name.startsWith('user:')) n++;
  return n;
};

export const getRooms = (): GameRooms => {
  if (rooms) return rooms;
  const io = getIO();
  const created = new GameRooms({
    changed: (room) => {
      io.to(channel(room.code)).emit('game:state', created.view(room));
    },
    finished: (room) => {
      void saveFinishedGame(room);
    },
    closed: (room, reason) => {
      io.to(channel(room.code)).emit('game:closed', { code: room.code, reason });
      if (room.invited && room.status === 'waiting') {
        io.to(userChannel(room.invited.userId)).emit('game:challengeCancelled', { code: room.code, reason });
      }
      io.in(channel(room.code)).socketsLeave(channel(room.code));
    },
  });
  setInterval(() => created.sweep(), 15_000).unref();
  rooms = created;
  return created;
};

export const gameEventHandler = (socket: Socket) => {
  const store = getRooms();
  const userId = socket.userId;
  if (!userId) return;
  const seat = { userId, username: socket.username ?? 'Player' };
  socket.join(userChannel(userId));

  const reply = (ack: Ack, result: Result<Room | null>) => {
    if (!result.ok) ack({ ok: false, error: result.error });
    else ack({ ok: true, room: result.value ? store.view(result.value) : null });
  };

  socket.on('game:create', (_payload: unknown, ackFn?: unknown) => {
    const ack = safeAck(typeof _payload === 'function' ? _payload : ackFn);
    const room = store.create(seat, socket.id);
    socket.join(channel(room.code));
    ack({ ok: true, code: room.code, room: store.view(room) });
  });

  socket.on('game:join', (payload: { code?: unknown } = {}, ackFn?: unknown) => {
    const ack = safeAck(ackFn);
    const result = store.join(String(payload?.code ?? ''), seat, socket.id);
    if (result.ok) socket.join(channel(result.value.code));
    reply(ack, result);
  });

  socket.on('game:action', (payload: { code?: unknown; action?: unknown } = {}, ackFn?: unknown) => {
    reply(safeAck(ackFn), store.act(String(payload?.code ?? ''), userId, payload?.action));
  });

  socket.on('game:resign', (payload: { code?: unknown } = {}, ackFn?: unknown) => {
    reply(safeAck(ackFn), store.resign(String(payload?.code ?? ''), userId));
  });

  socket.on('game:rematch', (payload: { code?: unknown } = {}, ackFn?: unknown) => {
    reply(safeAck(ackFn), store.rematch(String(payload?.code ?? ''), userId));
  });

  socket.on('game:leave', (payload: { code?: unknown } = {}, ackFn?: unknown) => {
    const code = String(payload?.code ?? '');
    const room = store.get(code);
    if (room) socket.leave(channel(room.code));
    reply(safeAck(ackFn), store.leave(code, userId, socket.id));
  });

  socket.on('game:quickMatch', (_payload: unknown, ackFn?: unknown) => {
    const ack = safeAck(typeof _payload === 'function' ? _payload : ackFn);
    const room = store.quickMatch(seat, socket.id);
    if (!room) return ack({ ok: true, waiting: true });
    const io = getIO();
    for (const player of [room.seats[RED], room.seats[BLUE]]) {
      if (player) io.to(userChannel(player.userId)).emit('game:matched', { code: room.code });
    }
    ack({ ok: true, code: room.code });
  });

  socket.on('game:cancelQuickMatch', (_payload: unknown, ackFn?: unknown) => {
    store.cancelQuickMatch(userId);
    safeAck(typeof _payload === 'function' ? _payload : ackFn)({ ok: true });
  });

  socket.on('game:challenge', async (payload: { userId?: unknown } = {}, ackFn?: unknown) => {
    const ack = safeAck(ackFn);
    const targetId = String(payload?.userId ?? '');
    if (!isValidObjectId(targetId)) return ack({ ok: false, error: 'Player not found.' });
    try {
      const target = await USER.findById(targetId).select('username');
      if (!target) return ack({ ok: false, error: 'Player not found.' });
      const io = getIO();
      const online = (await io.in(userChannel(targetId)).fetchSockets()).length > 0;
      if (!online) return ack({ ok: false, error: `${target.username} is offline right now.` });
      const result = store.challenge(seat, { userId: targetId, username: target.username }, socket.id);
      if (!result.ok) return ack({ ok: false, error: result.error });
      socket.join(channel(result.value.code));
      io.to(userChannel(targetId)).emit('game:challenged', { code: result.value.code, from: seat });
      ack({ ok: true, code: result.value.code });
    } catch (error) {
      console.error('[game] challenge failed', error);
      ack({ ok: false, error: 'Could not send the challenge.' });
    }
  });

  socket.on('game:declineChallenge', (payload: { code?: unknown } = {}, ackFn?: unknown) => {
    const result = store.decline(String(payload?.code ?? ''), userId);
    safeAck(ackFn)(result.ok ? { ok: true } : { ok: false, error: result.error });
  });

  socket.on('disconnect', () => store.disconnect(userId, socket.id));
};
