import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    BLUE,
    DRAW,
    DRAW_TURNS,
    EMPTY,
    NEIGHBORS,
    POINTS,
    RED,
    applyAction,
    countPieces,
    createInitialState,
    destinationsFrom,
    idx,
    legalActions,
    validateAction,
} from './engine.js';

const p = (key) => idx(Number(key[0]), Number(key[1]));
const emptyState = (pieces, turn = RED) => {
    const s = createInitialState();
    s.board = s.board.map(() => EMPTY);
    for (const [key, v] of Object.entries(pieces)) s.board[p(key)] = v;
    s.turn = turn;
    return s;
};
const move = (from, to) => ({ type: 'move', from: p(from), to: p(to) });

describe('board', () => {
    it('has 37 points, symmetric adjacency and 16 beads a side', () => {
        assert.equal(POINTS.length, 37);
        for (const a of POINTS) for (const b of NEIGHBORS[a]) assert.ok(NEIGHBORS[b].includes(a));
        const s = createInitialState();
        assert.equal(countPieces(s.board, RED), 16);
        assert.equal(countPieces(s.board, BLUE), 16);
        assert.equal(countPieces(s.board, EMPTY), 5); // the middle row
    });

    it('red moves first with 9 possible steps', () => {
        const s = createInitialState();
        assert.equal(s.turn, RED);
        assert.equal(legalActions(s).length, 9);
    });
});

describe('moves', () => {
    it('steps to an adjacent empty point and passes the turn', () => {
        const s = applyAction(createInitialState(), move('32', '42'));
        assert.equal(s.board[p('42')], RED);
        assert.equal(s.board[p('32')], EMPTY);
        assert.equal(s.turn, BLUE);
    });

    it('rejects moves that are not on a line, moving the wrong colour, and moving onto beads', () => {
        const s = createInitialState();
        assert.ok(validateAction(s, move('32', '43'))); // 32 has no diagonals
        assert.ok(validateAction(s, move('52', '42'))); // blue bead on red's turn
        assert.ok(validateAction(s, move('31', '32'))); // occupied
        assert.equal(validateAction(s, move('31', '40')), null);
    });

    it('captures by jumping over an adjacent enemy bead in a straight line', () => {
        const s = emptyState({ 42: RED, 52: BLUE, 81: BLUE });
        assert.deepEqual(
            destinationsFrom(s, p('42')).find((d) => d.to === p('62')),
            { to: p('62'), capture: p('52') },
        );
        const next = applyAction(s, move('42', '62'));
        assert.equal(next.board[p('52')], EMPTY);
        assert.equal(next.board[p('62')], RED);
        assert.deepEqual(next.lastMove.captured, [p('52')]);
    });

    it('jumps along the triangle lines (33 over 22 lands on 11)', () => {
        const s = emptyState({ 33: BLUE, 22: RED, 83: RED }, BLUE);
        const next = applyAction(s, move('33', '11'));
        assert.equal(next.board[p('22')], EMPTY);
        assert.equal(next.board[p('11')], BLUE);
    });

    it('cannot jump where the line bends (21 over 22 to 12 is not straight)', () => {
        const s = emptyState({ 21: RED, 22: BLUE, 81: BLUE });
        assert.ok(validateAction(s, move('21', '12')));
    });

    it('lets the same bead keep capturing, and only that bead', () => {
        const s = emptyState({ 40: RED, 41: BLUE, 43: BLUE, 82: BLUE, 20: RED });
        const mid = applyAction(s, move('40', '42'));
        assert.equal(mid.turn, RED);
        assert.equal(mid.chain, p('42'));
        assert.ok(validateAction(mid, move('20', '21'))); // other beads are frozen during a chain
        assert.ok(validateAction(mid, move('42', '32'))); // steps are not allowed during a chain
        const end = applyAction(mid, move('42', '44'));
        assert.equal(end.turn, BLUE);
        assert.equal(end.chain, null);
        assert.equal(countPieces(end.board, BLUE), 1);
    });

    it('allows stopping a capture chain early', () => {
        const s = emptyState({ 40: RED, 41: BLUE, 43: BLUE, 82: BLUE });
        const mid = applyAction(s, move('40', '42'));
        assert.ok(legalActions(mid).some((a) => a.type === 'endChain'));
        const end = applyAction(mid, { type: 'endChain' });
        assert.equal(end.turn, BLUE);
        assert.equal(end.board[p('43')], BLUE);
    });
});

describe('game end', () => {
    it('wins by capturing every enemy bead', () => {
        const s = emptyState({ 42: RED, 52: BLUE });
        const next = applyAction(s, move('42', '62'));
        assert.equal(next.winner, RED);
        assert.equal(next.reason, 'captured-all');
        assert.deepEqual(legalActions(next), []);
    });

    it('wins when the opponent has no legal move', () => {
        // Blue's only bead is stuck in the corner of its triangle: 82 and 71 are red and cannot be jumped.
        const s = emptyState({ 81: BLUE, 82: RED, 83: RED, 71: RED, 62: RED, 72: RED, 30: RED });
        const next = applyAction(s, move('30', '40'));
        assert.equal(next.winner, RED);
        assert.equal(next.reason, 'blocked');
    });

    it('is a draw after many turns without a capture', () => {
        let s = emptyState({ 20: RED, 64: BLUE });
        s.quietTurns = DRAW_TURNS - 1;
        s = applyAction(s, move('20', '21'));
        assert.equal(s.winner, DRAW);
    });
});
