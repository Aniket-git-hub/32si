// Offline games (Pass & Play, vs Computer) are not sent to the server; they are remembered in this browser.

const HISTORY_KEY = '32beads.recentGames';
const TUTORIAL_KEY = '32beads.tutorialDone';
const REPLAYS_KEY = '32beads.replays';
const MAX_REPLAYS = 20;
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

export const isTutorialDone = () => read(TUTORIAL_KEY, false) === true;
export const markTutorialDone = () => write(TUTORIAL_KEY, true);

/** Saved offline games for the replay viewer (newest first). */
export const loadLocalReplays = () => read(REPLAYS_KEY, []);
export const getLocalReplay = (id) => loadLocalReplays().find((r) => String(r.id) === String(id)) ?? null;

/** replay: { id, mode, level, red, blue, result: 'red'|'blue'|'draw', reason, history, at } */
export const saveLocalReplay = (replay) => {
    if (!replay.history?.length) return;
    write(REPLAYS_KEY, [replay, ...loadLocalReplays().filter((r) => r.id !== replay.id)].slice(0, MAX_REPLAYS));
};
