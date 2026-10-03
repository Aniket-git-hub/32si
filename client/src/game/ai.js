/**
 * Computer opponent for 32 Beads.
 *
 * Negamax search with alpha-beta pruning, iterative deepening, a transposition table and a
 * capture-only quiescence search. The search works on whole turns: a multi-capture chain is
 * expanded into one "turn" per possible stopping point, so the AI understands chains fully.
 */
import {
    BLUE,
    DRAW_TURNS,
    EMPTY,
    JUMPS,
    NEIGHBORS,
    POINTS,
    RED,
    ROWS,
    COLS,
    opponent,
} from './engine.js';

const WIN = 1_000_000;
const WIN_THRESHOLD = WIN - 1000;
const CELLS = ROWS * COLS;

export const DIFFICULTIES = {
    easy: { label: 'Easy', maxDepth: 1, timeMs: 300, quiescence: false, noise: 120 },
    medium: { label: 'Medium', maxDepth: 3, timeMs: 800, quiescence: true, noise: 25 },
    hard: { label: 'Hard', maxDepth: 30, timeMs: 2000, quiescence: true, noise: 0 },
};

// ---------------------------------------------------------------------------------------------
// Precomputed tables
// ---------------------------------------------------------------------------------------------

// Shortest path length (in steps) between every pair of points.
const DIST = (() => {
    const dist = Array.from({ length: CELLS }, () => new Array(CELLS).fill(99));
    for (const s of POINTS) {
        dist[s][s] = 0;
        const queue = [s];
        while (queue.length) {
            const a = queue.shift();
            for (const b of NEIGHBORS[a]) {
                if (dist[s][b] === 99) {
                    dist[s][b] = dist[s][a] + 1;
                    queue.push(b);
                }
            }
        }
    }
    return dist;
})();

// Points with more connections are stronger (more ways to move, attack and escape).
const POINT_VALUE = (() => {
    const v = new Array(CELLS).fill(0);
    for (const p of POINTS) {
        const degree = NEIGHBORS[p].length;
        v[p] = degree >= 8 ? 6 : degree >= 5 ? 3 : degree >= 4 ? 2 : degree >= 3 ? 0 : -3;
    }
    return v;
})();

// Zobrist keys (two 32-bit halves so collisions are practically impossible).
const ZOBRIST = (() => {
    let seed = 0x9e3779b9;
    const rand = () => {
        seed ^= seed << 13;
        seed ^= seed >>> 17;
        seed ^= seed << 5;
        return seed >>> 0;
    };
    const keys = { [RED]: [], [BLUE]: [], side: [rand(), rand()] };
    for (let p = 0; p < CELLS; p++) {
        keys[RED].push([rand(), rand()]);
        keys[BLUE].push([rand(), rand()]);
    }
    return keys;
})();

const hashBoard = (board, player) => {
    let h1 = 0;
    let h2 = 0;
    for (const p of POINTS) {
        const v = board[p];
        if (v !== EMPTY) {
            h1 ^= ZOBRIST[v][p][0];
            h2 ^= ZOBRIST[v][p][1];
        }
    }
    if (player === BLUE) {
        h1 ^= ZOBRIST.side[0];
        h2 ^= ZOBRIST.side[1];
    }
    return (h1 >>> 0) * 0x200000 + ((h2 >>> 0) & 0x1fffff);
};

// ---------------------------------------------------------------------------------------------
// Turn generation
// ---------------------------------------------------------------------------------------------

const count = (board, player) => {
    let n = 0;
    for (const p of POINTS) if (board[p] === player) n++;
    return n;
};

const jumpTargets = (board, from, player) => {
    const out = [];
    for (const { over, to } of JUMPS[from]) {
        if (board[to] === EMPTY && board[over] !== EMPTY && board[over] !== player) out.push({ over, to });
    }
    return out;
};

/**
 * Every complete turn for `player`: [{ board, actions, captures }].
 * `actions` is the exact sequence of engine actions that plays the turn.
 */
export const generateTurns = (board, player, capturesOnly = false) => {
    const turns = [];
    const opp = opponent(player);
    let oppLeft = count(board, opp);

    const extendChain = (b, at, actions, captures) => {
        for (const { over, to } of jumpTargets(b, at, player)) {
            const nb = b.slice();
            nb[to] = player;
            nb[at] = EMPTY;
            nb[over] = EMPTY;
            const nextActions = [...actions, { type: 'move', from: at, to }];
            const left = oppLeft - captures - 1;
            const canContinue = left > 0 && jumpTargets(nb, to, player).length > 0;
            // Stopping here is always an option; the engine needs an explicit endChain if more jumps exist.
            turns.push({
                board: nb,
                actions: canContinue ? [...nextActions, { type: 'endChain' }] : nextActions,
                captures: captures + 1,
                to,
            });
            if (canContinue) extendChain(nb, to, nextActions, captures + 1);
        }
    };

    for (const p of POINTS) {
        if (board[p] !== player) continue;
        extendChain(board, p, [], 0);
        if (capturesOnly) continue;
        for (const to of NEIGHBORS[p]) {
            if (board[to] !== EMPTY) continue;
            const nb = board.slice();
            nb[to] = player;
            nb[p] = EMPTY;
            turns.push({ board: nb, actions: [{ type: 'move', from: p, to }], captures: 0, to });
        }
    }
    return turns;
};

// ---------------------------------------------------------------------------------------------
// Evaluation
// ---------------------------------------------------------------------------------------------

const mobility = (board, player) => {
    let n = 0;
    for (const p of POINTS) {
        if (board[p] !== player) continue;
        for (const to of NEIGHBORS[p]) if (board[to] === EMPTY) n++;
    }
    return n;
};

/** Static evaluation from `player`'s point of view (player is the side to move). */
export const evaluate = (board, player) => {
    const opp = opponent(player);
    let mine = 0;
    let theirs = 0;
    let positional = 0;
    for (const p of POINTS) {
        if (board[p] === player) {
            mine++;
            positional += POINT_VALUE[p];
        } else if (board[p] === opp) {
            theirs++;
            positional -= POINT_VALUE[p];
        }
    }
    if (theirs === 0) return WIN;
    if (mine === 0) return -WIN;

    // Material is everything; an advantage is worth more as the board empties.
    const diff = mine - theirs;
    let score = diff * 100 + diff * (32 - mine - theirs) * 4;
    score += positional;
    score += (mobility(board, player) - mobility(board, opp)) * 2;

    // The side that is ahead should close in on the enemy and force the win instead of shuffling.
    if (diff !== 0) {
        const leader = diff > 0 ? player : opp;
        const trailer = opponent(leader);
        let total = 0;
        let n = 0;
        for (const a of POINTS) {
            if (board[a] !== leader) continue;
            let best = 99;
            for (const b of POINTS) if (board[b] === trailer && DIST[a][b] < best) best = DIST[a][b];
            total += best;
            n++;
        }
        const closeness = n ? 10 - total / n : 0;
        score += (diff > 0 ? 1 : -1) * closeness * 6;
    }
    return score;
};

// ---------------------------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------------------------

class Timeout extends Error {}

const EXACT = 0;
const LOWER = 1;
const UPPER = 2;

const toTT = (score, ply) => (score > WIN_THRESHOLD ? score + ply : score < -WIN_THRESHOLD ? score - ply : score);
const fromTT = (score, ply) => (score > WIN_THRESHOLD ? score - ply : score < -WIN_THRESHOLD ? score + ply : score);

const createSearch = ({ deadline, quiescence }) => {
    const tt = new Map();
    let nodes = 0;

    const tick = () => {
        nodes++;
        if ((nodes & 1023) === 0 && Date.now() > deadline) throw new Timeout();
    };

    const orderTurns = (turns, bestHash, player) => {
        const opp = opponent(player);
        for (const t of turns) {
            t.hash = hashBoard(t.board, opp);
            t.order = t.hash === bestHash ? 1e9 : t.captures * 1000 + POINT_VALUE[t.to];
        }
        turns.sort((a, b) => b.order - a.order);
        return turns;
    };

    const quiesce = (board, player, alpha, beta, ply, qdepth) => {
        tick();
        const stand = evaluate(board, player);
        if (!quiescence || qdepth <= 0 || Math.abs(stand) >= WIN_THRESHOLD) return stand;
        if (stand >= beta) return stand;
        if (stand > alpha) alpha = stand;
        const captures = generateTurns(board, player, true).sort((a, b) => b.captures - a.captures);
        for (const t of captures) {
            const score = -quiesce(t.board, opponent(player), -beta, -alpha, ply + 1, qdepth - 1);
            if (score >= beta) return score;
            if (score > alpha) alpha = score;
        }
        return alpha;
    };

    const negamax = (board, player, depth, alpha, beta, ply, quietTurns) => {
        tick();
        if (count(board, player) === 0) return -WIN + ply;
        if (quietTurns >= DRAW_TURNS) return 0;

        const turns = generateTurns(board, player);
        if (turns.length === 0) return -WIN + ply; // blocked: the side to move loses
        if (depth <= 0) return quiesce(board, player, alpha, beta, ply, 8);

        const key = hashBoard(board, player);
        const entry = tt.get(key);
        if (entry && entry.depth >= depth) {
            const s = fromTT(entry.score, ply);
            if (entry.flag === EXACT) return s;
            if (entry.flag === LOWER && s >= beta) return s;
            if (entry.flag === UPPER && s <= alpha) return s;
        }

        const alphaOrig = alpha;
        let best = -Infinity;
        let bestHash = null;
        for (const t of orderTurns(turns, entry?.best, player)) {
            const score = -negamax(
                t.board,
                opponent(player),
                depth - 1,
                -beta,
                -alpha,
                ply + 1,
                t.captures ? 0 : quietTurns + 1,
            );
            if (score > best) {
                best = score;
                bestHash = t.hash;
            }
            if (score > alpha) alpha = score;
            if (alpha >= beta) break;
        }

        tt.set(key, {
            depth,
            score: toTT(best, ply),
            flag: best <= alphaOrig ? UPPER : best >= beta ? LOWER : EXACT,
            best: bestHash,
        });
        return best;
    };

    /** Scores every root turn at the given depth (needed for difficulty noise). */
    // `margin` keeps the window open below the best score so every turn that could still be chosen
    // with difficulty noise gets an exact score instead of a bound.
    const searchRoot = (board, player, depth, quietTurns, turns, bestHash, margin) => {
        let alpha = -Infinity;
        const scored = [];
        for (const t of orderTurns(turns, bestHash, player)) {
            const score = -negamax(
                t.board,
                opponent(player),
                depth - 1,
                -Infinity,
                -(alpha - margin),
                1,
                t.captures ? 0 : quietTurns + 1,
            );
            scored.push({ turn: t, score });
            if (score > alpha) alpha = score;
        }
        return scored.sort((a, b) => b.score - a.score);
    };

    return { searchRoot, nodes: () => nodes };
};

/**
 * Picks the computer's turn.
 * @param {object} state engine state (state.turn is the computer's colour, state.chain must be null)
 * @param {'easy'|'medium'|'hard'} level
 * @param {() => number} random source of randomness for the difficulty noise
 * @param {object} overrides optional settings overrides, e.g. { timeMs }
 * @returns {{ actions: object[], score: number, depth: number, nodes: number } | null}
 */
export const chooseTurn = (state, level = 'medium', random = Math.random, overrides = {}) => {
    const settings = { ...(DIFFICULTIES[level] ?? DIFFICULTIES.medium), ...overrides };
    const player = state.turn;
    const turns = generateTurns(state.board, player);
    if (turns.length === 0) return null;
    if (turns.length === 1) return { actions: turns[0].actions, score: 0, depth: 0, nodes: 0 };

    const deadline = Date.now() + settings.timeMs;
    const search = createSearch({ deadline, quiescence: settings.quiescence });
    let results = null;
    let depthReached = 0;
    for (let depth = 1; depth <= settings.maxDepth; depth++) {
        try {
            const bestHash = results ? results[0].turn.hash : null;
            results = search.searchRoot(
                state.board,
                player,
                depth,
                state.quietTurns ?? 0,
                turns,
                bestHash,
                settings.noise * 2,
            );
            depthReached = depth;
        } catch (e) {
            if (!(e instanceof Timeout)) throw e;
            break;
        }
        // A forced win or loss has been found - deeper search will not change the decision.
        if (Math.abs(results[0].score) >= WIN_THRESHOLD) break;
    }
    if (!results) {
        // Not even depth 1 finished in time: fall back to the greediest turn.
        results = turns.map((turn) => ({ turn, score: turn.captures })).sort((a, b) => b.score - a.score);
    }

    let pick = results[0];
    if (settings.noise > 0 && Math.abs(pick.score) < WIN_THRESHOLD) {
        let bestNoisy = -Infinity;
        for (const r of results) {
            const noisy = r.score + (random() * 2 - 1) * settings.noise;
            if (noisy > bestNoisy) {
                bestNoisy = noisy;
                pick = r;
            }
        }
    }
    return { actions: pick.turn.actions, score: pick.score, depth: depthReached, nodes: search.nodes() };
};
