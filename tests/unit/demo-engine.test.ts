import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { popLastChoice, replay } from '../../lib/demo-engine.ts';

void describe('popLastChoice', () => {
  void test("drops the trailing choice entry, re-offering that node's choices", () => {
    const history = [
      { node: 's0', choice: 1 },
      { node: 's1-intro', choice: 2 },
    ];
    assert.deepEqual(popLastChoice(history), [{ node: 's0', choice: 1 }]);
    // never mutates the input
    assert.equal(history.length, 2);
  });

  void test('drops trailing choice:null entries and the choice entry beneath them', () => {
    const history = [
      { node: 's0', choice: 1 },
      { node: 's1-intro', choice: null },
    ];
    assert.deepEqual(popLastChoice(history), []);
  });

  void test('returns [] (no-op) for an empty history', () => {
    assert.deepEqual(popLastChoice([]), []);
  });

  void test('returns [] (no-op, never throws) when only choice:null entries exist', () => {
    const history = [
      { node: 's1-intro', choice: null },
      { node: 's1-q1', choice: null },
    ];
    assert.deepEqual(popLastChoice(history), []);
  });

  void test('round-trips through replay: popping the only choice returns to s0 with empty flags', () => {
    const history = [{ node: 's0', choice: 1 }]; // sets flags.goal = 'paanika'
    const before = replay(history);
    assert.equal(before.currentId, 's1-intro');
    assert.deepEqual(before.flags, { goal: 'paanika' });

    const after = replay(popLastChoice(history));
    assert.equal(after.currentId, 's0');
    assert.deepEqual(after.flags, {});
  });
});
