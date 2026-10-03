import { encodeAction, expectedScore, isRated, rateGame, START_RATING } from '../../src/game/elo';

const fresh = { rating: START_RATING, ratedGames: 0 };
const veteran = (rating: number) => ({ rating, ratedGames: 100 });

describe('elo', () => {
  it('gives equal players a 50% expectation and symmetric changes', () => {
    expect(expectedScore(1200, 1200)).toBe(0.5);
    const r = rateGame(fresh, fresh, 1);
    expect(r.a).toEqual({ rating: 1220, change: 20 });
    expect(r.b).toEqual({ rating: 1180, change: -20 });
  });

  it('rewards upsets more than expected wins', () => {
    const upset = rateGame(veteran(1200), veteran(1600), 1).a.change;
    const expected = rateGame(veteran(1600), veteran(1200), 1).a.change;
    expect(upset).toBeGreaterThan(20);
    expect(expected).toBeLessThan(4);
  });

  it('moves ratings towards each other on a draw', () => {
    const r = rateGame(veteran(1500), veteran(1300), 0.5);
    expect(r.a.change).toBeLessThan(0);
    expect(r.b.change).toBeGreaterThan(0);
  });

  it('settles new players faster than established ones', () => {
    expect(rateGame(fresh, veteran(1200), 1).a.change).toBeGreaterThan(rateGame(veteran(1200), fresh, 1).a.change);
  });

  it('only rates games where both sides moved, and encodes moves compactly', () => {
    expect(isRated(1)).toBe(false);
    expect(isRated(2)).toBe(true);
    expect(encodeAction({ type: 'move', from: 17, to: 22 })).toBe(17 * 45 + 22);
    expect(encodeAction({ type: 'endChain' })).toBe(-1);
  });
});
