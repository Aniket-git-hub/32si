import { BLUE, RED, idx } from '../../src/game/engine';
import { GameRooms, Room } from '../../src/game/rooms';

const p = (key: string) => idx(Number(key[0]), Number(key[1]));
const alice = { userId: 'a', username: 'alice' };
const bob = { userId: 'b', username: 'bob' };
const carol = { userId: 'c', username: 'carol' };

const setup = (options = {}) => {
  const events = { changed: 0, finished: [] as Room[], closed: [] as string[] };
  const rooms = new GameRooms(
    {
      changed: () => events.changed++,
      finished: (room) => events.finished.push(room),
      closed: (_room, reason) => events.closed.push(reason),
    },
    options,
  );
  return { rooms, events };
};

const startGame = () => {
  const ctx = setup({ abandonMs: 1000 });
  const room = ctx.rooms.create(alice, 's-alice');
  const joined = ctx.rooms.join(room.code.toLowerCase(), bob, 's-bob');
  if (!joined.ok) throw new Error(joined.error);
  return { ...ctx, room, code: room.code };
};

afterEach(() => jest.useRealTimers());

describe('GameRooms', () => {
  it('creates a game with a short code and lets a second player join as BLUE', () => {
    const { rooms, room } = startGame();
    expect(room.code).toMatch(/^[A-Z2-9]{6}$/);
    expect(room.status).toBe('playing');
    expect(rooms.colorOf(room, 'a')).toBe(RED);
    expect(rooms.colorOf(room, 'b')).toBe(BLUE);
    const view = rooms.view(room);
    expect(view.players[RED]?.connected).toBe(true);
    expect(view.players[BLUE]?.username).toBe('bob');
  });

  it('rejects unknown codes and a third player', () => {
    const { rooms, code } = startGame();
    expect(rooms.join('NOPE42', carol, 's-carol').ok).toBe(false);
    expect(rooms.join(code, carol, 's-carol')).toEqual({ ok: false, error: 'This game already has two players.' });
  });

  it('lets a player rejoin their own game (refresh / reconnect)', () => {
    const { rooms, code } = startGame();
    rooms.disconnect('b', 's-bob');
    expect(rooms.view(rooms.get(code)!).players[BLUE]?.connected).toBe(false);
    expect(rooms.join(code, bob, 's-bob-2').ok).toBe(true);
    expect(rooms.view(rooms.get(code)!).players[BLUE]?.connected).toBe(true);
  });

  it('only accepts legal moves from the player whose turn it is', () => {
    const { rooms, code } = startGame();
    const move = (from: string, to: string) => ({ type: 'move', from: p(from), to: p(to) });
    expect(rooms.act(code, 'b', move('52', '42'))).toEqual({ ok: false, error: 'It is not your turn.' });
    expect(rooms.act(code, 'c', move('32', '42'))).toEqual({ ok: false, error: 'You are not playing in this game.' });
    expect(rooms.act(code, 'a', move('32', '43'))).toEqual({ ok: false, error: 'Illegal move' });
    expect(rooms.act(code, 'a', { type: 'hack' }).ok).toBe(false);
    expect(rooms.act(code, 'a', move('32', '42')).ok).toBe(true);
    expect(rooms.get(code)!.state.turn).toBe(BLUE);
  });

  it('ends the game on resignation and saves it once', () => {
    const { rooms, code, events } = startGame();
    expect(rooms.resign(code, 'a').ok).toBe(true);
    const room = rooms.get(code)!;
    expect(room.status).toBe('finished');
    expect(room.state.winner).toBe(BLUE);
    expect(room.state.reason).toBe('resigned');
    expect(events.finished).toHaveLength(1);
    expect(rooms.resign(code, 'b').ok).toBe(false);
  });

  it('starts a rematch with swapped colours once both players ask', () => {
    const { rooms, code } = startGame();
    rooms.resign(code, 'a');
    rooms.rematch(code, 'a');
    expect(rooms.get(code)!.status).toBe('finished');
    rooms.rematch(code, 'b');
    const room = rooms.get(code)!;
    expect(room.status).toBe('playing');
    expect(rooms.colorOf(room, 'b')).toBe(RED);
    expect(room.state.moveNumber).toBe(0);
  });

  it('forfeits a player who stays disconnected, but not one who comes back', () => {
    jest.useFakeTimers();
    const { rooms, code } = startGame();
    rooms.disconnect('a', 's-alice');
    expect(rooms.view(rooms.get(code)!).players[RED]?.abandonDeadline).not.toBeNull();
    jest.advanceTimersByTime(500);
    rooms.join(code, alice, 's-alice-2');
    jest.advanceTimersByTime(1000);
    expect(rooms.get(code)!.status).toBe('playing');

    rooms.disconnect('b', 's-bob');
    jest.advanceTimersByTime(1001);
    const room = rooms.get(code)!;
    expect(room.status).toBe('finished');
    expect(room.state.winner).toBe(RED);
    expect(room.state.reason).toBe('abandoned');
  });

  it('closes a waiting game when the host leaves; a player leaving a running game forfeits unless they return', () => {
    jest.useFakeTimers();
    const { rooms, events } = setup();
    const waiting = rooms.create(alice, 's-alice');
    rooms.leave(waiting.code, 'a', 's-alice');
    expect(rooms.get(waiting.code)).toBeUndefined();
    expect(events.closed).toHaveLength(1);

    const game = startGame();
    game.rooms.leave(game.code, 'b', 's-bob');
    expect(game.rooms.get(game.code)!.status).toBe('playing');
    jest.advanceTimersByTime(1001);
    expect(game.rooms.get(game.code)!.state.winner).toBe(RED);
  });

  it('pairs two players looking for a quick match', () => {
    const { rooms } = setup();
    expect(rooms.quickMatch(alice, 's-alice')).toBeNull();
    expect(rooms.quickMatch(alice, 's-alice-2')).toBeNull(); // same user twice does not match itself
    const room = rooms.quickMatch(bob, 's-bob')!;
    expect(room.status).toBe('playing');
    expect([rooms.colorOf(room, 'a'), rooms.colorOf(room, 'b')].sort()).toEqual([RED, BLUE]);
    expect(rooms.quickMatch(carol, 's-carol')).toBeNull();
    rooms.disconnect('c', 's-carol');
    expect(rooms.quickMatch(alice, 's-alice')).toBeNull(); // carol left the queue
  });

  it('forfeits a quick-match opponent who never opens the game', () => {
    jest.useFakeTimers();
    const { rooms } = setup({ abandonMs: 1000 });
    rooms.quickMatch(alice, 's-alice');
    const room = rooms.quickMatch(bob, 's-bob')!;
    rooms.join(room.code, bob, 's-bob');
    jest.advanceTimersByTime(1001);
    expect(room.status).toBe('finished');
    expect(room.state.winner).toBe(rooms.colorOf(room, 'b'));
  });

  it('lets only the challenged player join a challenge', () => {
    const { rooms } = setup();
    const result = rooms.challenge(alice, bob, 's-alice');
    if (!result.ok) throw new Error(result.error);
    const code = result.value.code;
    expect(rooms.view(result.value).invited?.username).toBe('bob');
    expect(rooms.join(code, carol, 's-carol').ok).toBe(false);
    expect(rooms.join(code, bob, 's-bob').ok).toBe(true);
    expect(rooms.get(code)!.status).toBe('playing');
  });

  it('reuses a pending challenge instead of creating duplicates', () => {
    const { rooms } = setup();
    const a = rooms.challenge(alice, bob, 's-alice');
    const b = rooms.challenge(alice, bob, 's-alice');
    expect(a.ok && b.ok && a.value.code === b.value.code).toBe(true);
    expect(rooms.challenge(alice, alice, 's-alice').ok).toBe(false);
  });

  it('closes a challenge when it is declined or expires', () => {
    const { rooms, events } = setup({ challengeTtlMs: 10 });
    const declined = rooms.challenge(alice, bob, 's-alice');
    if (!declined.ok) throw new Error(declined.error);
    expect(rooms.decline(declined.value.code, 'c').ok).toBe(false);
    rooms.decline(declined.value.code, 'b');
    expect(rooms.get(declined.value.code)).toBeUndefined();
    expect(events.closed).toContain('bob declined your challenge.');

    const expired = rooms.challenge(alice, carol, 's-alice');
    if (!expired.ok) throw new Error(expired.error);
    rooms.sweep(Date.now() + 20);
    expect(rooms.get(expired.value.code)).toBeUndefined();
    expect(events.closed).toContain("carol didn't answer the challenge.");
  });

  it('runs a turn clock: a capture chain ends on time, otherwise the player to move loses', () => {
    jest.useFakeTimers();
    const ctx = setup({ turnMs: 1000 });
    const room = ctx.rooms.create(alice, 's-alice');
    expect(ctx.rooms.view(room).turnRemainingMs).toBeNull(); // no clock while waiting
    ctx.rooms.join(room.code, bob, 's-bob');
    expect(ctx.rooms.view(room).turnRemainingMs).toBe(1000);

    jest.advanceTimersByTime(600);
    ctx.rooms.act(room.code, 'a', { type: 'move', from: p('32'), to: p('42') });
    expect(ctx.rooms.view(room).turnRemainingMs).toBe(1000); // a move gives the opponent a full turn

    jest.advanceTimersByTime(1001);
    expect(room.status).toBe('finished');
    expect(room.state.winner).toBe(RED);
    expect(room.state.reason).toBe('timeout');
    expect(ctx.events.finished).toHaveLength(1);
  });

  it('ends an unfinished capture chain instead of forfeiting', () => {
    jest.useFakeTimers();
    const ctx = setup({ turnMs: 1000 });
    const room = ctx.rooms.create(alice, 's-alice');
    ctx.rooms.join(room.code, bob, 's-bob');
    room.state = { ...room.state, chain: p('42'), board: room.state.board.slice() };
    jest.advanceTimersByTime(1001);
    expect(room.status).toBe('playing');
    expect(room.state.chain).toBeNull();
    expect(room.state.turn).toBe(BLUE);
  });

  it('removes stale rooms', () => {
    const { rooms } = setup({ waitingTtlMs: 10 });
    const room = rooms.create(alice, 's-alice');
    rooms.sweep(Date.now() + 20);
    expect(rooms.get(room.code)).toBeUndefined();
  });
});
