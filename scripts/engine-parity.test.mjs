/**
 * The rules engine exists twice: client/src/game/engine.js (local play, AI, move hints) and
 * server/src/game/engine.ts (validates online moves). This test plays random games through both and
 * checks they agree on every legal action and every resulting state.
 *
 * Run from the repository root: node --experimental-strip-types --test scripts/engine-parity.test.mjs
 */
import assert from 'node:assert/strict';
import { it } from 'node:test';
import * as client from '../client/src/game/engine.js';
import * as server from '../server/src/game/engine.ts';

const rng = (seed) => () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 2 ** 32;
};

it('client and server engines behave identically', () => {
  assert.deepEqual(server.POINTS, client.POINTS);
  assert.deepEqual(server.NEIGHBORS, client.NEIGHBORS);
  assert.deepEqual(server.JUMPS, client.JUMPS);

  for (let game = 0; game < 200; game++) {
    const random = rng(game + 1);
    let c = client.createInitialState();
    let s = server.createInitialState();
    for (let ply = 0; ply < 400 && c.winner === null; ply++) {
      const actions = client.legalActions(c);
      assert.deepEqual(server.legalActions(s), actions);
      const action = actions[Math.floor(random() * actions.length)];
      c = client.applyAction(c, action);
      s = server.applyAction(s, action);
      assert.deepEqual(s, c);
    }
    assert.equal(server.describeResult(s), client.describeResult(c));
  }
});
