/**
 * Turns a player's saved games into history rows and summary statistics.
 * Kept free of database access so it can be unit tested.
 */

export interface PlayerRef {
  _id: string;
  username?: string;
  name?: string;
  profilePhoto?: string;
}

/** A saved game; `players` is [RED, BLUE]. */
export interface SavedGame {
  _id: string;
  code?: string;
  players: (PlayerRef | string)[];
  result?: 'red' | 'blue' | 'draw';
  reason?: string;
  score?: string; // "<captured by RED>-<captured by BLUE>"
  moves?: number;
  startTime?: Date;
  endTime?: Date;
}

export type Outcome = 'win' | 'loss' | 'draw';

export interface HistoryRow {
  id: string;
  opponent: PlayerRef | null;
  color: 'red' | 'blue';
  outcome: Outcome;
  reason: string | null;
  captured: number; // beads this player captured
  lost: number; // beads this player lost
  moves: number;
  startTime: Date | null;
  endTime: Date | null;
}

export interface HeadToHead {
  opponent: PlayerRef;
  played: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface PlayerStats {
  played: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number; // 0..100, wins / played
  currentStreak: { outcome: Outcome | null; length: number };
  bestWinStreak: number;
  beadsCaptured: number;
  beadsLost: number;
  averageMoves: number;
  wipeouts: number; // wins by capturing every bead
  opponents: HeadToHead[];
}

const idOf = (p: PlayerRef | string): string => (typeof p === 'string' ? p : String(p._id));

/** History rows for `userId`, newest first. Games the user did not play in are skipped. */
export const toHistory = (games: SavedGame[], userId: string): HistoryRow[] =>
  games
    .map((game): HistoryRow | null => {
      const index = game.players.findIndex((p) => idOf(p) === userId);
      if (index === -1) return null;
      const color = index === 0 ? 'red' : 'blue';
      const other = game.players[1 - index];
      const [byRed, byBlue] = (game.score ?? '0-0').split('-').map((n) => Number(n) || 0);
      const outcome: Outcome = game.result === 'draw' || !game.result ? 'draw' : game.result === color ? 'win' : 'loss';
      return {
        id: String(game._id),
        opponent: other ? (typeof other === 'string' ? { _id: other } : other) : null,
        color,
        outcome,
        reason: game.reason ?? null,
        captured: color === 'red' ? byRed : byBlue,
        lost: color === 'red' ? byBlue : byRed,
        moves: game.moves ?? 0,
        startTime: game.startTime ?? null,
        endTime: game.endTime ?? null,
      };
    })
    .filter((row): row is HistoryRow => row !== null)
    .sort((a, b) => (b.endTime?.getTime() ?? 0) - (a.endTime?.getTime() ?? 0));

export const summarize = (history: HistoryRow[]): PlayerStats => {
  const stats: PlayerStats = {
    played: history.length,
    wins: 0,
    losses: 0,
    draws: 0,
    winRate: 0,
    currentStreak: { outcome: null, length: 0 },
    bestWinStreak: 0,
    beadsCaptured: 0,
    beadsLost: 0,
    averageMoves: 0,
    wipeouts: 0,
    opponents: [],
  };
  const byOpponent = new Map<string, HeadToHead>();
  let moves = 0;

  for (const row of history) {
    if (row.outcome === 'win') stats.wins++;
    else if (row.outcome === 'loss') stats.losses++;
    else stats.draws++;
    if (row.outcome === 'win' && row.reason === 'captured-all') stats.wipeouts++;
    stats.beadsCaptured += row.captured;
    stats.beadsLost += row.lost;
    moves += row.moves;

    if (row.opponent) {
      const key = String(row.opponent._id);
      const h2h = byOpponent.get(key) ?? { opponent: row.opponent, played: 0, wins: 0, losses: 0, draws: 0 };
      h2h.played++;
      if (row.outcome === 'win') h2h.wins++;
      else if (row.outcome === 'loss') h2h.losses++;
      else h2h.draws++;
      byOpponent.set(key, h2h);
    }
  }

  // History is newest first: the current streak runs from the start, the best one is found oldest -> newest.
  for (const row of history) {
    if (stats.currentStreak.outcome === null) stats.currentStreak.outcome = row.outcome;
    if (row.outcome !== stats.currentStreak.outcome) break;
    stats.currentStreak.length++;
  }
  let run = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    run = history[i].outcome === 'win' ? run + 1 : 0;
    stats.bestWinStreak = Math.max(stats.bestWinStreak, run);
  }

  stats.winRate = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;
  stats.averageMoves = stats.played ? Math.round(moves / stats.played) : 0;
  stats.opponents = [...byOpponent.values()].sort((a, b) => b.played - a.played).slice(0, 10);
  return stats;
};
