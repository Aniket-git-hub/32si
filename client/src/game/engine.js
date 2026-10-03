/**
 * 32 Beads (Sholo Guti) rules engine.
 *
 * The board is stored as a flat array of 45 cells (9 rows x 5 columns, index = row * 5 + col).
 * Eight of those cells are not on the board (the corners next to the two triangles), leaving
 * the 37 playable points of the traditional board:
 *
 *              01 - 02 - 03          <- RED's triangle (row 0)
 *                11 - 12 - 13        <- row 1
 *                  \  |  /
 *      20 - 21 - 22 - 23 - 24       <- 22 is the triangle's apex
 *      30 - 31 - 32 - 33 - 34
 *      40 - 41 - 42 - 43 - 44       <- 5x5 square, diagonals through every point where row+col is even
 *      50 - 51 - 52 - 53 - 54
 *      60 - 61 - 62 - 63 - 64       <- 62 is the apex of BLUE's triangle
 *                  /  |  \
 *                71 - 72 - 73
 *              81 - 82 - 83          <- BLUE's triangle (row 8)
 *
 * The triangle sides continue the square's diagonals, so e.g. 01-11-22-33-44 is one straight line.
 *
 * Rules implemented:
 *  - Each player starts with 16 beads. RED (1) starts at the top and moves first, BLUE (2) at the bottom.
 *  - A turn is either a step (one bead moves along a line to an adjacent empty point) or a capture
 *    (a bead jumps over an adjacent enemy bead, in a straight line, to the empty point right behind it).
 *  - After a capture the same bead may keep capturing (multi-jump). The player may stop the chain at any time.
 *  - Captures are optional.
 *  - A player wins by capturing every enemy bead, or by leaving the opponent without a legal move.
 *  - The game is drawn after DRAW_TURNS consecutive turns without a capture.
 *
 * NOTE: server/src/game/engine.ts is a TypeScript copy of this file. Keep the two in sync
 * (scripts/engine-parity.test.mjs checks they behave identically).
 */

export const ROWS = 9;
export const COLS = 5;
export const EMPTY = 0;
export const RED = 1;
export const BLUE = 2;
export const DRAW = 3;
export const PIECES_PER_PLAYER = 16;
export const DRAW_TURNS = 50;

export const idx = (i, j) => i * COLS + j;
export const rowOf = (p) => Math.floor(p / COLS);
export const colOf = (p) => p % COLS;
export const opponent = (player) => (player === RED ? BLUE : RED);
export const playerName = (player) => (player === RED ? 'RED' : player === BLUE ? 'BLUE' : 'DRAW');

// Adjacency of the traditional board, keyed by "<row><col>".
const RELATIONS = {
    '01': ['02', '11'],
    '02': ['01', '03', '12'],
    '03': ['02', '13'],
    '11': ['01', '12', '22'],
    '12': ['02', '11', '13', '22'],
    '13': ['03', '12', '22'],
    '20': ['21', '30', '31'],
    '21': ['20', '22', '31'],
    '22': ['21', '31', '32', '33', '23', '12', '11', '13'],
    '23': ['22', '24', '33'],
    '24': ['23', '33', '34'],
    '30': ['20', '31', '40'],
    '31': ['20', '21', '22', '32', '42', '41', '40', '30'],
    '32': ['22', '31', '42', '33'],
    '33': ['22', '23', '24', '34', '44', '43', '42', '32'],
    '34': ['24', '33', '44'],
    '40': ['30', '31', '41', '51', '50'],
    '41': ['31', '40', '51', '42'],
    '42': ['41', '31', '32', '33', '43', '53', '52', '51'],
    '43': ['42', '33', '44', '53'],
    '44': ['33', '34', '43', '53', '54'],
    '50': ['40', '51', '60'],
    '51': ['40', '41', '42', '50', '52', '60', '61', '62'],
    '52': ['51', '42', '53', '62'],
    '53': ['42', '43', '44', '52', '54', '62', '63', '64'],
    '54': ['44', '53', '64'],
    '60': ['50', '51', '61'],
    '61': ['51', '60', '62'],
    '62': ['51', '52', '53', '61', '63', '71', '72', '73'],
    '63': ['62', '53', '64'],
    '64': ['53', '54', '63'],
    '71': ['62', '72', '81'],
    '72': ['62', '71', '73', '82'],
    '73': ['62', '72', '83'],
    '81': ['71', '82'],
    '82': ['72', '81', '83'],
    '83': ['73', '82'],
};

const keyToIdx = (key) => idx(Number(key[0]), Number(key[1]));

// Geometric position of every point (centre of the board is 0,0; one square cell is 2 units).
// Used to find straight lines for jumps and by the UI to draw the board.
export const POSITIONS = (() => {
    const pos = new Array(ROWS * COLS).fill(null);
    const triangleX = { 0: [-2, 0, 2], 1: [-1, 0, 1], 7: [-1, 0, 1], 8: [-2, 0, 2] };
    const triangleY = { 0: -6, 1: -5, 7: 5, 8: 6 };
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (i >= 2 && i <= 6) {
                pos[idx(i, j)] = { x: (j - 2) * 2, y: (i - 4) * 2 };
            } else if (j >= 1 && j <= 3) {
                pos[idx(i, j)] = { x: triangleX[i][j - 1], y: triangleY[i] };
            }
        }
    }
    return pos;
})();

export const POINTS = Object.keys(RELATIONS).map(keyToIdx).sort((a, b) => a - b);
export const isPoint = (p) => p >= 0 && p < ROWS * COLS && POSITIONS[p] !== null && RELATIONS[`${rowOf(p)}${colOf(p)}`] !== undefined;

// NEIGHBORS[p] = adjacent points of p.
export const NEIGHBORS = (() => {
    const n = Array.from({ length: ROWS * COLS }, () => []);
    for (const [key, list] of Object.entries(RELATIONS)) {
        n[keyToIdx(key)] = list.map(keyToIdx);
    }
    return n;
})();

// JUMPS[p] = [{ over, to }] for every straight line p -> over -> to on the board.
export const JUMPS = (() => {
    const jumps = Array.from({ length: ROWS * COLS }, () => []);
    for (const a of POINTS) {
        for (const b of NEIGHBORS[a]) {
            for (const c of NEIGHBORS[b]) {
                if (c === a) continue;
                const pa = POSITIONS[a];
                const pb = POSITIONS[b];
                const pc = POSITIONS[c];
                const v1x = pb.x - pa.x;
                const v1y = pb.y - pa.y;
                const v2x = pc.x - pb.x;
                const v2y = pc.y - pb.y;
                const cross = v1x * v2y - v1y * v2x;
                const dot = v1x * v2x + v1y * v2y;
                if (cross === 0 && dot > 0) jumps[a].push({ over: b, to: c });
            }
        }
    }
    return jumps;
})();

export const createInitialBoard = () => {
    const board = new Array(ROWS * COLS).fill(EMPTY);
    for (const p of POINTS) {
        const i = rowOf(p);
        if (i <= 3) board[p] = RED;
        else if (i >= 5) board[p] = BLUE;
    }
    return board;
};

export const createInitialState = () => ({
    board: createInitialBoard(),
    turn: RED,
    // Point of the bead that is in the middle of a capture chain (it may keep capturing or stop).
    chain: null,
    // Consecutive completed turns without a capture (for the draw rule).
    quietTurns: 0,
    moveNumber: 0,
    winner: null, // null | RED | BLUE | DRAW
    reason: null, // 'captured-all' | 'blocked' | 'no-captures' | 'resigned' | 'abandoned'
    lastMove: null, // { from, to, captured, player }
});

export const countPieces = (board, player) => {
    let n = 0;
    for (const p of POINTS) if (board[p] === player) n++;
    return n;
};

export const capturedBy = (state, player) => PIECES_PER_PLAYER - countPieces(state.board, opponent(player));

/** Jump moves available to the bead on `from`. */
export const jumpsFrom = (board, from) => {
    const player = board[from];
    const out = [];
    for (const { over, to } of JUMPS[from]) {
        if (board[to] === EMPTY && board[over] !== EMPTY && board[over] !== player) out.push({ from, to, over });
    }
    return out;
};

/** Step moves available to the bead on `from`. */
export const stepsFrom = (board, from) => {
    const out = [];
    for (const to of NEIGHBORS[from]) if (board[to] === EMPTY) out.push({ from, to, over: null });
    return out;
};

/** Every move (step or jump) the given player could make on this board, ignoring chain state. */
export const movesForPlayer = (board, player) => {
    const out = [];
    for (const p of POINTS) {
        if (board[p] !== player) continue;
        out.push(...jumpsFrom(board, p), ...stepsFrom(board, p));
    }
    return out;
};

export const hasAnyMove = (board, player) => {
    for (const p of POINTS) {
        if (board[p] !== player) continue;
        for (const to of NEIGHBORS[p]) if (board[to] === EMPTY) return true;
        if (jumpsFrom(board, p).length > 0) return true;
    }
    return false;
};

/**
 * All legal actions in the current state.
 * Actions are { type: 'move', from, to } or { type: 'endChain' }.
 */
export const legalActions = (state) => {
    if (state.winner !== null) return [];
    if (state.chain !== null) {
        return [
            ...jumpsFrom(state.board, state.chain).map(({ from, to }) => ({ type: 'move', from, to })),
            { type: 'endChain' },
        ];
    }
    return movesForPlayer(state.board, state.turn).map(({ from, to }) => ({ type: 'move', from, to }));
};

/** Legal destinations for the bead on `from` in this state: [{ to, capture }] */
export const destinationsFrom = (state, from) => {
    if (state.winner !== null || state.board[from] !== state.turn) return [];
    if (state.chain !== null && state.chain !== from) return [];
    const jumps = jumpsFrom(state.board, from).map(({ to, over }) => ({ to, capture: over }));
    if (state.chain !== null) return jumps;
    return [...jumps, ...stepsFrom(state.board, from).map(({ to }) => ({ to, capture: null }))];
};

const finishTurn = (state, hadCapture) => {
    const next = opponent(state.turn);
    state.turn = next;
    state.chain = null;
    state.quietTurns = hadCapture ? 0 : state.quietTurns + 1;
    if (countPieces(state.board, next) === 0) {
        state.winner = opponent(next);
        state.reason = 'captured-all';
    } else if (!hasAnyMove(state.board, next)) {
        state.winner = opponent(next);
        state.reason = 'blocked';
    } else if (state.quietTurns >= DRAW_TURNS) {
        state.winner = DRAW;
        state.reason = 'no-captures';
    }
    return state;
};

/** Returns an error message if the action is illegal, otherwise null. */
export const validateAction = (state, action) => {
    if (!action || typeof action !== 'object') return 'Invalid action';
    if (state.winner !== null) return 'The game is over';
    if (action.type === 'endChain') return state.chain === null ? 'No capture in progress' : null;
    if (action.type !== 'move') return 'Invalid action';
    const { from, to } = action;
    if (!Number.isInteger(from) || !Number.isInteger(to) || !isPoint(from) || !isPoint(to)) return 'Invalid point';
    if (state.board[from] !== state.turn) return 'That is not your bead';
    if (!destinationsFrom(state, from).some((d) => d.to === to)) return 'Illegal move';
    return null;
};

/** Applies a legal action and returns the new state (the input state is not modified). */
export const applyAction = (state, action) => {
    const error = validateAction(state, action);
    if (error) throw new Error(error);

    const s = { ...state, board: state.board.slice() };
    s.moveNumber = state.moveNumber + 1;

    if (action.type === 'endChain') {
        return finishTurn(s, true);
    }

    const { from, to } = action;
    const jump = jumpsFrom(s.board, from).find((m) => m.to === to);
    s.board[to] = s.board[from];
    s.board[from] = EMPTY;
    s.lastMove = { from, to, captured: [], player: state.turn };

    if (!jump) return finishTurn(s, false);

    s.board[jump.over] = EMPTY;
    s.lastMove.captured = [jump.over];
    if (countPieces(s.board, opponent(state.turn)) === 0) return finishTurn(s, true);
    if (jumpsFrom(s.board, to).length > 0) {
        s.chain = to;
        return s;
    }
    return finishTurn(s, true);
};

/** Ends the game because a player resigned or abandoned it. */
export const forfeit = (state, loser, reason = 'resigned') => ({
    ...state,
    chain: null,
    winner: opponent(loser),
    reason,
});

/** Human readable explanation of how a finished game ended. */
export const describeResult = (state) => {
    if (state.winner === null) return '';
    if (state.winner === DRAW) return `Draw - ${DRAW_TURNS} turns in a row without a capture.`;
    const w = playerName(state.winner);
    const l = playerName(opponent(state.winner));
    switch (state.reason) {
        case 'captured-all':
            return `${w} captured all of ${l}'s beads.`;
        case 'blocked':
            return `${l} has no legal move left.`;
        case 'resigned':
            return `${l} resigned.`;
        case 'abandoned':
            return `${l} left the game.`;
        default:
            return `${w} wins.`;
    }
};
