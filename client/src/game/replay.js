import { COLS, ROWS, applyAction, createInitialState } from './engine.js';

const CELLS = ROWS * COLS;

/** Encodes an action for storage: a move is from * 45 + to, ending a capture chain early is -1. */
export const encodeAction = (action) => (action.type === 'endChain' ? -1 : action.from * CELLS + action.to);

/** applyAction that also keeps a move log on the state (`state.log`), for replays. Undo restores it too. */
export const playAction = (state, action) => {
    const next = applyAction(state, action);
    next.log = [...(state.log ?? []), encodeAction(action)];
    return next;
};

/** Decodes a stored action (from * 45 + to, or -1 for ending a capture chain early). */
export const decodeAction = (value) =>
    value === -1 ? { type: 'endChain' } : { type: 'move', from: Math.floor(value / CELLS), to: value % CELLS };

/**
 * Every position of a recorded game: states[0] is the start, states[i] is after the i-th action.
 * Stops at the first action that doesn't apply (corrupt data) instead of throwing.
 */
export const replayStates = (history) => {
    const states = [createInitialState()];
    for (const value of history) {
        try {
            states.push(applyAction(states[states.length - 1], decodeAction(value)));
        } catch {
            break;
        }
    }
    return states;
};
