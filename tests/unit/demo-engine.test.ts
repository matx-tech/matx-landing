import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  DEMO_COPY,
  DEMO_FLAG_DOMAINS,
  DEMO_SKILLS,
  type DemoFlags,
} from '../../lib/content/demo-script.ts';
import { deriveTeacherView, popLastChoice, replay } from '../../lib/demo-engine.ts';

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

// Same shape as demo-engine.ts's internal (unexported) flagCombinations.
function flagCombinations(): DemoFlags[] {
  const keys = Object.keys(DEMO_FLAG_DOMAINS) as (keyof typeof DEMO_FLAG_DOMAINS)[];
  let combos: DemoFlags[] = [{}];
  for (const key of keys) {
    const next: DemoFlags[] = [];
    for (const combo of combos) {
      for (const value of DEMO_FLAG_DOMAINS[key]) next.push({ ...combo, [key]: value });
    }
    combos = next;
  }
  return combos;
}

void describe('deriveTeacherView', () => {
  const COMBOS = flagCombinations();
  // Widened to unknown[] first: DEMO_COPY is `as const`, so Object.values yields a
  // literal union that a `value is string` predicate cannot narrow.
  const TEACHER_STRINGS = new Set(
    (Object.values(DEMO_COPY.teacher) as unknown[]).filter(
      (value): value is string => typeof value === 'string',
    ),
  );

  void test('enumerates all 64 flag combinations', () => {
    assert.equal(COMBOS.length, 64);
  });

  void test('returns exactly stenRow, studentCard, inCluster', () => {
    for (const flags of [{} as DemoFlags, ...COMBOS]) {
      assert.deepEqual(Object.keys(deriveTeacherView(flags)).sort(), [
        'inCluster',
        'stenRow',
        'studentCard',
      ]);
    }
  });

  void test('full happy path: everything läbitud, not in the cluster', () => {
    const view = deriveTeacherView({
      goal: 'tööleht',
      eq: 'ok',
      neg: 'ok',
      sulud: 'ok',
      hintAsked: 'ei',
      metaphor: 'väravad',
    });
    // Murrud (column 5) is always 'p' — the spec matrix's 'lllll' contradicts its own
    // AC ("column 5 is always p"); the AC and the frozen derivation win.
    assert.equal(view.stenRow, 'llllp');
    assert.equal(view.inCluster, false);
  });

  void test('struggled everywhere: slksp, in the cluster', () => {
    const view = deriveTeacherView({
      eq: 'käsklus',
      neg: 'ei-saa',
      sulud: 'vale',
      hintAsked: 'jah',
    });
    assert.equal(view.stenRow, 'slksp');
    assert.equal(view.inCluster, true);
  });

  void test('empty flags (mid-lesson) derive llllp without throwing', () => {
    const view = deriveTeacherView({});
    // Murrud (column 5) is always 'p' — the spec matrix's 'lllll' contradicts its own
    // AC ("column 5 is always p"); the AC and the frozen derivation win.
    assert.equal(view.stenRow, 'llllp');
    assert.equal(view.inCluster, false);
  });

  void test('maps every column per DEMO_SKILLS order across all 64 combinations', () => {
    for (const flags of COMBOS) {
      const { stenRow } = deriveTeacherView(flags);
      const where = JSON.stringify(flags);
      assert.equal(stenRow.length, DEMO_SKILLS.length, `stenRow width for ${where}`);
      for (const [index, letter] of [...stenRow].entries()) {
        assert.ok(
          ['k', 's', 'l', 'p'].includes(letter),
          `${DEMO_SKILLS[index].label}: invalid state '${letter}' for ${where}`,
        );
      }
      assert.equal(stenRow[0], flags.eq === 'käsklus' ? 's' : 'l', `Võrduse omadused ${where}`);
      assert.equal(stenRow[1], 'l', `Kontroll asendamisega ${where}`);
      assert.equal(stenRow[2], flags.sulud === 'vale' ? 'k' : 'l', `Sulgude avamine ${where}`);
      assert.equal(stenRow[3], flags.neg === 'ei-saa' ? 's' : 'l', `Negatiivsed arvud ${where}`);
      assert.equal(stenRow[4], 'p', `Murrud ${where}`);
    }
  });

  void test('inCluster tracks sulud === vale across all 64 combinations', () => {
    for (const flags of COMBOS) {
      assert.equal(
        deriveTeacherView(flags).inCluster,
        flags.sulud === 'vale',
        JSON.stringify(flags),
      );
    }
  });

  void test('studentCard is 3 non-empty DEMO_COPY.teacher sentences across all 64 combinations', () => {
    for (const flags of COMBOS) {
      const { studentCard } = deriveTeacherView(flags);
      const where = JSON.stringify(flags);
      assert.equal(studentCard.length, 3, `card length for ${where}`);
      for (const sentence of studentCard) {
        assert.ok(sentence.length > 0, `empty card sentence for ${where}`);
        assert.ok(
          TEACHER_STRINGS.has(sentence),
          `card sentence not in DEMO_COPY.teacher: ${where}`,
        );
      }
      assert.equal(studentCard[0], DEMO_COPY.teacher.cardStrengths, `strengths for ${where}`);
      assert.equal(
        studentCard[1],
        flags.sulud === 'vale'
          ? DEMO_COPY.teacher.cardBlockerSulud
          : flags.neg === 'ei-saa'
            ? DEMO_COPY.teacher.cardBlockerNoneNegWeak
            : DEMO_COPY.teacher.cardBlockerNoneNegOk,
        `blocker for ${where}`,
      );
      assert.equal(
        studentCard[2],
        flags.hintAsked === 'jah'
          ? DEMO_COPY.teacher.cardHintAsked
          : DEMO_COPY.teacher.cardHintNone,
        `hint for ${where}`,
      );
    }
  });
});
