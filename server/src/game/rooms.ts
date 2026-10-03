import { randomInt } from 'crypto';
import {
  BLUE,
  GameState,
  Player,
  RED,
  applyAction,
  capturedBy,
  createInitialState,
  forfeit,
  validateAction,
} from './engine';

/**
 * In-memory store of online games. The server is authoritative: every action is validated with the
 * rules engine before it is applied, and clients only ever render the state the server sends them.
 *
 * This class knows nothing about socket.io; the socket handler calls it and broadcasts the result.
 */

export interface Seat {
  userId: string;
  username: string;
}

export type RoomStatus = 'waiting' | 'playing' | 'finished';

export interface Room {
  code: string;
  seats: Record<Player, Seat | null>;
  state: GameState;
  status: RoomStatus;
  createdAt: number;
  startedAt: number | null;
  finishedAt: number | null;
  rematch: Set<string>;
  // userId -> ids of that user's sockets currently in the room (a user may have several tabs open)
  connections: Map<string, Set<string>>;
  abandonTimers: Map<string, NodeJS.Timeout>;
  // userId -> timestamp when the user forfeits unless they reconnect
  abandonDeadlines: Map<string, number>;
  // Set for a direct challenge: only this user may take the second seat.
  invited: Seat | null;
  // The player to move must act before this time (ms since epoch) or the turn times out.
  turnDeadline: number | null;
  turnTimer: NodeJS.Timeout | null;
}

export interface SeatView extends Seat {
  connected: boolean;
  abandonDeadline: number | null;
  capturedCount: number;
}

export interface RoomView {
  code: string;
  status: RoomStatus;
  players: Record<Player, SeatView | null>;
  state: GameState;
  rematch: string[];
  invited: Seat | null;
  // Time left for the current turn when this view was created (relative, so client clocks don't matter).
  turnRemainingMs: number | null;
  turnMs: number;
}

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export interface RoomHooks {
  /** The room changed and every client in it should get the new view. */
  changed(room: Room): void;
  /** A game just ended (store it in the database etc.). */
  finished(room: Room): void;
  /** The room no longer exists. */
  closed(room: Room, reason: string): void;
}

export interface RoomOptions {
  abandonMs: number;
  waitingTtlMs: number;
  finishedTtlMs: number;
  challengeTtlMs: number;
  turnMs: number;
}

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O or 1/I to avoid typos
const CODE_LENGTH = 6;

const DEFAULT_OPTIONS: RoomOptions = {
  abandonMs: 60_000,
  waitingTtlMs: 30 * 60_000,
  finishedTtlMs: 15 * 60_000,
  challengeTtlMs: 2 * 60_000,
  turnMs: 60_000,
};

const ok = <T>(value: T): Result<T> => ({ ok: true, value });
const fail = <T>(error: string): Result<T> => ({ ok: false, error });

export const normalizeCode = (code: unknown): string =>
  typeof code === 'string' ? code.trim().toUpperCase().slice(0, 16) : '';

export class GameRooms {
  private rooms = new Map<string, Room>();
  private queue: (Seat & { socketId: string })[] = [];
  private hooks: RoomHooks;
  private options: RoomOptions;

  constructor(hooks: RoomHooks, options: Partial<RoomOptions> = {}) {
    this.hooks = hooks;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  get(code: string): Room | undefined {
    return this.rooms.get(normalizeCode(code));
  }

  colorOf(room: Room, userId: string): Player | null {
    if (room.seats[RED]?.userId === userId) return RED;
    if (room.seats[BLUE]?.userId === userId) return BLUE;
    return null;
  }

  view(room: Room): RoomView {
    const seat = (player: Player): SeatView | null => {
      const s = room.seats[player];
      if (!s) return null;
      return {
        ...s,
        connected: (room.connections.get(s.userId)?.size ?? 0) > 0,
        abandonDeadline: room.abandonDeadlines.get(s.userId) ?? null,
        capturedCount: capturedBy(room.state, player),
      };
    };
    return {
      code: room.code,
      status: room.status,
      players: { [RED]: seat(RED), [BLUE]: seat(BLUE) } as Record<Player, SeatView | null>,
      state: room.state,
      rematch: [...room.rematch],
      invited: room.invited,
      turnRemainingMs: room.turnDeadline === null ? null : Math.max(0, room.turnDeadline - Date.now()),
      turnMs: this.options.turnMs,
    };
  }

  private newCode(): string {
    for (;;) {
      let code = '';
      for (let i = 0; i < CODE_LENGTH; i++) code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
      if (!this.rooms.has(code)) return code;
    }
  }

  private newRoom(red: Seat, blue: Seat | null): Room {
    const now = Date.now();
    const room: Room = {
      code: this.newCode(),
      seats: { [RED]: red, [BLUE]: blue } as Record<Player, Seat | null>,
      state: createInitialState(),
      status: blue ? 'playing' : 'waiting',
      createdAt: now,
      startedAt: blue ? now : null,
      finishedAt: null,
      rematch: new Set(),
      connections: new Map(),
      abandonTimers: new Map(),
      abandonDeadlines: new Map(),
      invited: null,
      turnDeadline: null,
      turnTimer: null,
    };
    this.rooms.set(room.code, room);
    return room;
  }

  private connect(room: Room, userId: string, socketId: string) {
    if (!room.connections.has(userId)) room.connections.set(userId, new Set());
    room.connections.get(userId)!.add(socketId);
    const timer = room.abandonTimers.get(userId);
    if (timer) clearTimeout(timer);
    room.abandonTimers.delete(userId);
    room.abandonDeadlines.delete(userId);
  }

  /** Starts (or restarts) the clock for the player to move. */
  private startTurnClock(room: Room) {
    this.stopTurnClock(room);
    if (room.status !== 'playing') return;
    room.turnDeadline = Date.now() + this.options.turnMs;
    room.turnTimer = setTimeout(() => this.turnTimedOut(room), this.options.turnMs);
  }

  private stopTurnClock(room: Room) {
    if (room.turnTimer) clearTimeout(room.turnTimer);
    room.turnTimer = null;
    room.turnDeadline = null;
  }

  /** Out of time: a capture chain simply ends; otherwise the player to move loses. */
  private turnTimedOut(room: Room) {
    room.turnTimer = null;
    room.turnDeadline = null;
    if (room.status !== 'playing') return;
    if (room.state.chain !== null) {
      room.state = applyAction(room.state, { type: 'endChain' });
      if (room.state.winner !== null) this.finish(room);
      else this.startTurnClock(room);
    } else {
      room.state = forfeit(room.state, room.state.turn, 'timeout');
      this.finish(room);
    }
    this.hooks.changed(room);
  }

  private finish(room: Room) {
    this.stopTurnClock(room);
    room.status = 'finished';
    room.finishedAt = Date.now();
    room.rematch.clear();
    for (const timer of room.abandonTimers.values()) clearTimeout(timer);
    room.abandonTimers.clear();
    room.abandonDeadlines.clear();
    this.hooks.finished(room);
  }

  /** Creates a game where `seat` plays RED and waits for an opponent. */
  create(seat: Seat, socketId: string): Room {
    this.cancelQuickMatch(seat.userId);
    const room = this.newRoom(seat, null);
    this.connect(room, seat.userId, socketId);
    return room;
  }

  /** Creates a private game where `from` plays RED and only `to` may join. */
  challenge(from: Seat, to: Seat, socketId: string): Result<Room> {
    if (from.userId === to.userId) return fail("You can't challenge yourself.");
    const existing = [...this.rooms.values()].find(
      (r) => r.status === 'waiting' && r.invited?.userId === to.userId && r.seats[RED]?.userId === from.userId,
    );
    if (existing) return ok(existing);
    const room = this.create(from, socketId);
    room.invited = to;
    return ok(room);
  }

  /** The invited player turned the challenge down. */
  decline(code: string, userId: string): Result<null> {
    const room = this.get(code);
    if (!room || room.status !== 'waiting') return ok(null);
    if (room.invited?.userId !== userId) return fail('This challenge is not for you.');
    this.close(room, `${room.invited.username} declined your challenge.`);
    return ok(null);
  }

  /** Joins (or re-joins after a refresh / lost connection) the game with this code. */
  join(code: string, seat: Seat, socketId: string): Result<Room> {
    const room = this.get(code);
    if (!room) return fail('Game not found. Check the code and try again.');

    if (this.colorOf(room, seat.userId) === null) {
      if (room.status !== 'waiting' || room.seats[BLUE]) return fail('This game already has two players.');
      if (room.invited && room.invited.userId !== seat.userId)
        return fail('This is a private challenge for another player.');
      room.seats[BLUE] = seat;
      room.status = 'playing';
      room.startedAt = Date.now();
    }
    this.cancelQuickMatch(seat.userId);
    this.connect(room, seat.userId, socketId);
    // In a quick match the opponent may never open the game; don't let this player wait forever.
    for (const other of [room.seats[RED], room.seats[BLUE]]) {
      if (other && !room.connections.has(other.userId)) this.startAbandonTimer(room, other.userId);
    }
    // The clock starts once both players have opened the game.
    const bothHere = [room.seats[RED], room.seats[BLUE]].every((p) => p && room.connections.has(p.userId));
    if (room.status === 'playing' && room.turnTimer === null && bothHere) this.startTurnClock(room);
    this.hooks.changed(room);
    return ok(room);
  }

  act(code: string, userId: string, action: unknown): Result<Room> {
    const room = this.get(code);
    if (!room) return fail('Game not found.');
    const color = this.colorOf(room, userId);
    if (color === null) return fail('You are not playing in this game.');
    if (room.status === 'waiting') return fail('Waiting for an opponent to join.');
    if (room.status === 'finished') return fail('The game is over.');
    if (room.state.turn !== color) return fail('It is not your turn.');
    const error = validateAction(room.state, action);
    if (error) return fail(error);

    room.state = applyAction(room.state, action as Parameters<typeof applyAction>[1]);
    if (room.state.winner !== null) this.finish(room);
    else this.startTurnClock(room);
    this.hooks.changed(room);
    return ok(room);
  }

  resign(code: string, userId: string): Result<Room> {
    const room = this.get(code);
    if (!room) return fail('Game not found.');
    const color = this.colorOf(room, userId);
    if (color === null) return fail('You are not playing in this game.');
    if (room.status !== 'playing') return fail('The game is not in progress.');
    room.state = forfeit(room.state, color, 'resigned');
    this.finish(room);
    this.hooks.changed(room);
    return ok(room);
  }

  /** When both players ask for a rematch a new game starts with the colours swapped. */
  rematch(code: string, userId: string): Result<Room> {
    const room = this.get(code);
    if (!room) return fail('Game not found.');
    if (this.colorOf(room, userId) === null) return fail('You are not playing in this game.');
    if (room.status !== 'finished') return fail('The game is not over yet.');
    room.rematch.add(userId);
    if (room.rematch.size === 2) {
      room.seats = { [RED]: room.seats[BLUE], [BLUE]: room.seats[RED] } as Record<Player, Seat | null>;
      room.state = createInitialState();
      room.status = 'playing';
      room.startedAt = Date.now();
      room.finishedAt = null;
      room.rematch.clear();
      this.startTurnClock(room);
    }
    this.hooks.changed(room);
    return ok(room);
  }

  /**
   * The player left the game page. A waiting game is closed; in a running game the player gets the
   * same grace period as after a lost connection (use resign to forfeit immediately).
   */
  leave(code: string, userId: string, socketId: string): Result<Room | null> {
    const room = this.get(code);
    if (!room) return ok(null);
    const color = this.colorOf(room, userId);
    room.connections.get(userId)?.delete(socketId);
    if (color === null || (room.connections.get(userId)?.size ?? 0) > 0) return ok(room); // e.g. still open in another tab

    if (room.status === 'waiting') {
      this.close(room, 'The host closed the game.');
      return ok(null);
    }
    this.startAbandonTimer(room, userId);
    room.rematch.delete(userId);
    this.hooks.changed(room);
    return ok(room);
  }

  /** Gives a player who is not connected `abandonMs` to (re)join before they forfeit. */
  private startAbandonTimer(room: Room, userId: string) {
    const color = this.colorOf(room, userId);
    if (color === null || room.status !== 'playing' || room.abandonTimers.has(userId)) return;
    room.abandonDeadlines.set(userId, Date.now() + this.options.abandonMs);
    room.abandonTimers.set(
      userId,
      setTimeout(() => {
        room.abandonTimers.delete(userId);
        room.abandonDeadlines.delete(userId);
        if (room.status !== 'playing' || (room.connections.get(userId)?.size ?? 0) > 0) return;
        room.state = forfeit(room.state, color, 'abandoned');
        this.finish(room);
        this.hooks.changed(room);
      }, this.options.abandonMs),
    );
  }

  /**
   * A socket disconnected (closed tab, network loss, refresh). Players in a running game get
   * `abandonMs` to come back before they forfeit.
   */
  disconnect(userId: string, socketId: string) {
    this.queue = this.queue.filter((q) => q.socketId !== socketId);
    for (const room of this.rooms.values()) {
      const sockets = room.connections.get(userId);
      if (!sockets?.delete(socketId) || sockets.size > 0) continue;
      this.startAbandonTimer(room, userId);
      room.rematch.delete(userId);
      this.hooks.changed(room);
    }
  }

  /**
   * Pairs the player with someone else waiting for a random opponent.
   * Returns the new room when matched, or null when the player was put in the queue.
   */
  quickMatch(seat: Seat, socketId: string): Room | null {
    this.cancelQuickMatch(seat.userId);
    const opponent = this.queue.shift();
    if (!opponent) {
      this.queue.push({ ...seat, socketId });
      return null;
    }
    const [red, blue] = randomInt(2) === 0 ? [opponent, seat] : [seat, opponent];
    const room = this.newRoom(
      { userId: red.userId, username: red.username },
      { userId: blue.userId, username: blue.username },
    );
    // Neither player is "connected" until their game page joins the room.
    return room;
  }

  cancelQuickMatch(userId: string) {
    this.queue = this.queue.filter((q) => q.userId !== userId);
  }

  private close(room: Room, reason: string) {
    this.stopTurnClock(room);
    for (const timer of room.abandonTimers.values()) clearTimeout(timer);
    this.rooms.delete(room.code);
    this.hooks.closed(room, reason);
  }

  /** Removes stale rooms. Call periodically. */
  sweep(now = Date.now()) {
    for (const room of [...this.rooms.values()]) {
      const nobodyHere = [...room.connections.values()].every((s) => s.size === 0);
      if (room.status === 'waiting' && room.invited && now - room.createdAt > this.options.challengeTtlMs) {
        this.close(room, `${room.invited.username} didn't answer the challenge.`);
      } else if (room.status === 'waiting' && now - room.createdAt > this.options.waitingTtlMs) {
        this.close(room, 'The game expired before anyone joined.');
      } else if (
        room.status === 'finished' &&
        nobodyHere &&
        now - (room.finishedAt ?? now) > this.options.finishedTtlMs
      ) {
        this.close(room, 'The game has ended.');
      } else if (
        room.status === 'playing' &&
        room.connections.size === 0 &&
        now - room.createdAt > this.options.waitingTtlMs
      ) {
        // A quick-match game that neither player ever opened.
        this.close(room, 'Nobody joined the game.');
      }
    }
  }

  size() {
    return this.rooms.size;
  }

  /** Number of games currently being played. */
  activeGames() {
    let n = 0;
    for (const room of this.rooms.values()) if (room.status === 'playing') n++;
    return n;
  }
}
