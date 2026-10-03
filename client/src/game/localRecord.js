// Offline games (Pass & Play, vs Computer) are not sent to the server; they are remembered in this browser.

const HISTORY_KEY = '32beads.recentGames';
const AI_RECORD_KEY = '32beads.aiRecord';

const read = (key, fallback) => {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
};

const write = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Storage can be unavailable (private mode); the data just won't persist.
    }
};

export const loadRecentGames = () => read(HISTORY_KEY, []);

/** { easy: { wins, losses, draws }, medium: {...}, hard: {...} } */
export const loadAiRecord = () => read(AI_RECORD_KEY, {});

/** Stores a finished offline game and returns the updated recent-games list (newest first, max 5). */
export const recordOfflineGame = (entry) => {
    const recent = [entry, ...loadRecentGames()].slice(0, 5);
    write(HISTORY_KEY, recent);
    if (entry.mode === 'ai' && entry.level) {
        const record = loadAiRecord();
        const r = record[entry.level] ?? { wins: 0, losses: 0, draws: 0 };
        if (entry.outcome === 'win') r.wins++;
        else if (entry.outcome === 'loss') r.losses++;
        else r.draws++;
        record[entry.level] = r;
        write(AI_RECORD_KEY, record);
    }
    return recent;
};
