// Lessons for the interactive tutorial. Positions use "<row><col>" keys; the learner plays RED.
import { BLUE, EMPTY, RED, countPieces, createInitialState, idx, movesForPlayer } from './engine.js';

const at = (key) => idx(Number(key[0]), Number(key[1]));

export const lessonState = ({ red, blue }) => {
    const state = createInitialState();
    state.board = state.board.map(() => EMPTY);
    for (const key of red) state.board[at(key)] = RED;
    for (const key of blue) state.board[at(key)] = BLUE;
    state.turn = RED;
    return state;
};

const turnOver = (s) => s.turn === BLUE || s.winner !== null;
const blueCaptures = (s) => movesForPlayer(s.board, BLUE).some((m) => m.over !== null);

export const LESSONS = [
    {
        title: 'Moving',
        text: 'Tap your red bead, then tap a green dot to move it one step along a line.',
        position: { red: ['32'], blue: ['72'] },
        // Returns null while the lesson is still in progress, true when solved, or a message when it went wrong.
        check: (s) => (turnOver(s) ? true : null),
        success: 'Beads move one step at a time, along any line drawn on the board.',
    },
    {
        title: 'Capturing',
        text: 'A blue bead is right in front of yours, with an empty point behind it. Jump over it to capture it.',
        position: { red: ['32'], blue: ['42', '83'] },
        check: (s) => {
            if (!turnOver(s)) return null;
            return countPieces(s.board, BLUE) === 1 ? true : 'That was a plain move. Look for the yellow dot behind the blue bead.';
        },
        success: 'To capture, jump over an enemy bead in a straight line onto the empty point behind it.',
    },
    {
        title: 'Chain captures',
        text: 'After a capture, the same bead may keep jumping. Capture both blue beads in one turn.',
        position: { red: ['30'], blue: ['40', '51', '83'] },
        check: (s) => {
            if (!turnOver(s)) return null;
            return countPieces(s.board, BLUE) === 1 ? true : 'Only one capture. Keep jumping with the same bead before your turn ends.';
        },
        success: 'Chains can be long. You may also stop early by pressing End turn.',
    },
    {
        title: 'Danger!',
        text: 'Blue can jump over your bead. Move it to safety, or capture the attacker first.',
        position: { red: ['42'], blue: ['52', '64'] },
        check: (s) => {
            if (!turnOver(s)) return null;
            return blueCaptures(s) ? 'Blue can still capture you. Find a move that leaves no jump for blue.' : true;
        },
        success: 'Before every move, check whether your bead lands where it can be jumped.',
    },
    {
        title: 'Winning',
        text: 'Capture the last blue bead to win the game.',
        position: { red: ['22', '31'], blue: ['42'] },
        check: (s) => {
            if (!turnOver(s)) return null;
            return s.winner === RED ? true : 'Not yet. Which of your beads can jump the blue one?';
        },
        success: 'You win by capturing every enemy bead, or by leaving your opponent with no legal move.',
    },
];
