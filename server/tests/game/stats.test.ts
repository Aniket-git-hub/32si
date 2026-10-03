import { SavedGame, summarize, toHistory } from '../../src/game/stats';

const me = { _id: 'me', username: 'me' };
const bob = { _id: 'bob', username: 'bob' };
const carol = { _id: 'carol', username: 'carol' };
let t = 0;
const game = (players: SavedGame['players'], result: SavedGame['result'], score: string, reason = 'captured-all'): SavedGame => ({
  _id: `g${++t}`,
  players,
  result,
  score,
  reason,
  moves: 40,
  endTime: new Date(2026, 0, t),
});

describe('game stats', () => {
  // Oldest first: W L W W D(…) then newest last
  const games = [
    game([me, bob], 'red', '16-3'), // win as red, wipeout
    game([bob, me], 'red', '10-4', 'resigned'), // loss as blue
    game([me, carol], 'red', '9-2', 'blocked'), // win
    game([carol, me], 'blue', '5-16'), // win as blue, wipeout
    game([me, bob], 'draw', '3-3', 'no-captures'), // draw (newest)
  ];

  it('builds history newest first from the player point of view', () => {
    const history = toHistory(games, 'me');
    expect(history.map((h) => h.outcome)).toEqual(['draw', 'win', 'win', 'loss', 'win']);
    expect(history[1]).toMatchObject({ color: 'blue', captured: 16, lost: 5, opponent: carol });
    expect(toHistory(games, 'nobody')).toEqual([]);
  });

  it('summarises record, streaks and head-to-head', () => {
    const stats = summarize(toHistory(games, 'me'));
    expect(stats).toMatchObject({ played: 5, wins: 3, losses: 1, draws: 1, winRate: 60, wipeouts: 2, bestWinStreak: 2 });
    expect(stats.currentStreak).toEqual({ outcome: 'draw', length: 1 });
    expect(stats.beadsCaptured).toBe(16 + 4 + 9 + 16 + 3);
    expect(stats.opponents[0]).toMatchObject({ opponent: bob, played: 3, wins: 1, losses: 1, draws: 1 });
  });

  it('handles a player with no games', () => {
    expect(summarize([])).toMatchObject({ played: 0, winRate: 0, averageMoves: 0, currentStreak: { outcome: null, length: 0 } });
  });
});
