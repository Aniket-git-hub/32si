// Situations worth pointing out to the player to move. Shared by the board highlights and the coach.
import { EMPTY, POINTS, jumpsFrom, opponent } from './engine.js';

/** Beads of the player to move that can capture right now. */
export const capturingBeads = (state) =>
    new Set(POINTS.filter((p) => state.board[p] === state.turn && jumpsFrom(state.board, p).length > 0));

/** Beads of the player to move that the opponent could capture if it were their turn. */
export const endangeredBeads = (state) => {
    const them = opponent(state.turn);
    const out = new Set();
    for (const q of POINTS) {
        if (state.board[q] !== them) continue;
        for (const { over } of jumpsFrom(state.board, q)) if (state.board[over] !== EMPTY) out.add(over);
    }
    return out;
};
