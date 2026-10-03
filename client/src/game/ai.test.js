import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { chooseTurn, generateTurns } from './ai.js';
import { BLUE, EMPTY, RED, applyAction, createInitialState, idx, legalActions } from './engine.js';

const p = (key) => idx(Number(key[0]), Number(key[1]));
const emptyState = (pieces, turn = RED) => {
    const s = createInitialState();
    s.board = s.board.map(() => EMPTY);
    for (const [key, v] of Object.entries(pieces)) s.board[p(key)] = v;
    s.turn = turn;
    return s;
};

// Small deterministic PRNG so the self-play tests are reproducible.
const rng = (seed) => () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2 ** 32;
};

const playTurn = (state, actions) => actions.reduce((s, a) => applyAction(s, a), state);

const randomTurn = (state, random) => {
    let s = state;
    const actions = [];
    do {
        const options = legalActions(s);
        const a = options[Math.floor(random() * options.length)];
        actions.push(a);
        s = applyAction(s, a);
    } while (s.chain !== null);
    return actions;
};

describe('turn generation', () => {
    it('produces action sequences the engine accepts and that reach the predicted board', () => {
        const random = rng(7);
        let state = createInitialState();
        for (let ply = 0; ply < 120 && state.winner === null; ply++) {
            for (const turn of generateTurns(state.board, state.turn)) {
                const after = playTurn(state, turn.actions);
                assert.deepEqual(after.board, turn.board);
                assert.notEqual(after.turn, state.turn);
            }
            state = playTurn(state, randomTurn(state, random));
        }
    });

    it('includes every stopping point of a capture chain', () => {
        const s = emptyState({ 40: RED, 41: BLUE, 43: BLUE, 82: BLUE });
        const chainTurns = generateTurns(s.board, RED).filter((t) => t.captures > 0);
        assert.deepEqual(chainTurns.map((t) => t.captures).sort(), [1, 2]);
    });
});

describe('AI', () => {
    it('takes the longest capture chain when it is free', () => {
        const s = emptyState({ 40: RED, 41: BLUE, 43: BLUE, 81: BLUE, 82: BLUE });
        const { actions } = chooseTurn(s, 'hard');
        const after = playTurn(s, actions);
        assert.equal(after.board[p('41')], EMPTY);
        assert.equal(after.board[p('43')], EMPTY);
    });

    it('does not walk into a capture', () => {
        // Moving 32 -> 42 would let blue's 52 jump it (52 over 42 to 32). Every other step is safe.
        const s = emptyState({ 32: RED, 20: RED, 52: BLUE, 83: BLUE });
        for (let i = 0; i < 5; i++) {
            const { actions } = chooseTurn(s, 'medium', rng(i));
            assert.notDeepEqual(actions, [{ type: 'move', from: p('32'), to: p('42') }]);
        }
    });

    it('finds a forced win', () => {
        // Red to move can capture blue's last bead.
        const s = emptyState({ 20: RED, 31: RED, 42: BLUE }, RED);
        const result = chooseTurn(s, 'hard');
        assert.equal(playTurn(s, result.actions).winner, RED);
    });

    const playGame = (players, random, maxTurns = 300) => {
        let state = createInitialState();
        for (let turn = 0; turn < maxTurns && state.winner === null; turn++) {
            const who = players[state.turn];
            const actions =
                who === 'random' ? randomTurn(state, random) : chooseTurn(state, who, random, { timeMs: 250 }).actions;
            state = playTurn(state, actions);
        }
        return state;
    };

    it('beats a random player every time, as either colour', { timeout: 120_000 }, () => {
        for (let g = 0; g < 4; g++) {
            const aiColour = g % 2 === 0 ? RED : BLUE;
            const players = { [aiColour]: 'easy', [aiColour === RED ? BLUE : RED]: 'random' };
            const end = playGame(players, rng(100 + g));
            assert.equal(end.winner, aiColour, `game ${g} ended ${end.winner} (${end.reason})`);
        }
    });

    it('hard beats easy (with a short thinking time to keep the test fast)', { timeout: 300_000 }, () => {
        let hardWins = 0;
        for (let g = 0; g < 2; g++) {
            const hardColour = g === 0 ? RED : BLUE;
            const players = { [hardColour]: 'hard', [hardColour === RED ? BLUE : RED]: 'easy' };
            const end = playGame(players, rng(200 + g));
            if (end.winner === hardColour) hardWins++;
        }
        assert.equal(hardWins, 2);
    });
});
