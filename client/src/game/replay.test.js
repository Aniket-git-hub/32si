import assert from 'node:assert/strict';
import { it } from 'node:test';
import { applyAction, createInitialState, legalActions } from './engine.js';
import { decodeAction, replayStates } from './replay.js';

const encode = (a) => (a.type === 'endChain' ? -1 : a.from * 45 + a.to);

it('rebuilds every position of a recorded game', () => {
    let seed = 11;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
    let state = createInitialState();
    const history = [];
    const expected = [state];
    while (state.winner === null && history.length < 300) {
        const actions = legalActions(state);
        const a = actions[Math.floor(rnd() * actions.length)];
        history.push(encode(a));
        state = applyAction(state, a);
        expected.push(state);
    }
    assert.deepEqual(replayStates(history), expected);
    assert.deepEqual(decodeAction(-1), { type: 'endChain' });
});

it('stops at corrupt data instead of crashing', () => {
    assert.equal(replayStates([17 * 45 + 22, 999]).length, 2);
});
