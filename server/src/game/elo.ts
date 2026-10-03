/**
 * Elo ratings for online games.
 *
 * New players start at 1200. The K-factor is higher for a player's first games so their rating
 * settles quickly, then drops for stability.
 */

export const START_RATING = 1200;
const PROVISIONAL_GAMES = 20;
const K_PROVISIONAL = 40;
const K_ESTABLISHED = 24;

export interface RatedPlayer {
  rating: number;
  ratedGames: number;
}

/** Expected score of A against B (0..1). */
export const expectedScore = (ratingA: number, ratingB: number) => 1 / (1 + 10 ** ((ratingB - ratingA) / 400));

const kFactor = (player: RatedPlayer) => (player.ratedGames < PROVISIONAL_GAMES ? K_PROVISIONAL : K_ESTABLISHED);

/**
 * New ratings after a game. `scoreA` is 1 if A won, 0.5 for a draw, 0 if A lost.
 * Returns rounded ratings and the change for each player.
 */
export const rateGame = (a: RatedPlayer, b: RatedPlayer, scoreA: 0 | 0.5 | 1) => {
  const expectedA = expectedScore(a.rating, b.rating);
  const deltaA = Math.round(kFactor(a) * (scoreA - expectedA));
  const deltaB = Math.round(kFactor(b) * (1 - scoreA - (1 - expectedA)));
  return {
    a: { rating: Math.max(100, a.rating + deltaA), change: deltaA },
    b: { rating: Math.max(100, b.rating + deltaB), change: deltaB },
  };
};

/** Only games where both players actually played count (no rating from resigning at move 0). */
export const isRated = (moveNumber: number) => moveNumber >= 2;

// Compact move history for replays: a move is from * 45 + to, ending a capture chain early is -1.
export type EncodedAction = number;
export const encodeAction = (action: { type: string; from?: number; to?: number }): EncodedAction =>
  action.type === 'endChain' ? -1 : (action.from as number) * 45 + (action.to as number);
