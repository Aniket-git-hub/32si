import assert from 'node:assert/strict';
import { it } from 'node:test';
import { applyAction, idx, legalActions } from './engine.js';
import { LESSONS, lessonState } from './lessons.js';

const at = (k) => idx(Number(k[0]), Number(k[1]));
const play = (state, moves) => moves.reduce((s, [a, b]) => applyAction(s, b === 'end' ? { type: 'endChain' } : { type: 'move', from: at(a), to: at(b) }), state);

// The intended solution of each lesson, and a move that should not solve it.
const solutions = [
    { good: [['32', '42']], bad: null },
    { good: [['32', '52']], bad: [['32', '31']] },
    { good: [['30', '50'], ['50', '52']], bad: [['30', '50'], ['50', 'end']] },
    { good: [['42', '62']], bad: [['42', '51']] },
    { good: [['31', '32']], bad: [['42', '41']] },
    { good: [['72', '71']], bad: [['62', '71']] },
    { good: [['31', '53']], bad: [['22', '21']] },
];

it('every lesson is solvable and rejects the wrong idea', () => {
    LESSONS.forEach((lesson, i) => {
        const start = lessonState(lesson.position);
        assert.ok(legalActions(start).length > 0, lesson.title);
        assert.equal(lesson.check(play(start, solutions[i].good)), true, `${lesson.title}: solution`);
        if (solutions[i].bad) assert.equal(typeof lesson.check(play(start, solutions[i].bad)), 'string', `${lesson.title}: wrong move`);
    });
});
