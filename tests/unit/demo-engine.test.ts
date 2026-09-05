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

// Murrud (column 5) is always 'p', so a "perfect" row is 'llllp', never 'lllll'.
void describe('deriveTeacherView', () => {
  const COMBOS = flagCombinations();
  /** The six sentences the derivation may select from — not every string in DEMO_COPY.teacher. */
  const CARD_SENTENCES: ReadonlySet<string> = new Set([
    DEMO_COPY.teacher.cardStrengths,
    DEMO_COPY.teacher.cardBlockerSulud,
    DEMO_COPY.teacher.cardBlockerNoneNegOk,
    DEMO_COPY.teacher.cardBlockerNoneNegWeak,
    DEMO_COPY.teacher.cardHintAsked,
    DEMO_COPY.teacher.cardHintNone,
  ]);
  /** The alphabet is whatever the copy table can render — not a hardcoded copy of it. */
  const STATE_LETTERS = Object.keys(DEMO_COPY.teacher.stateLabels);

  /**
   * Every stenRow the derivation can emit, written out as a literal so the assertions
   * cannot mirror the implementation's own ternaries. Keyed by `eq|sulud|neg`; the
   * remaining flags (goal, metaphor, hintAsked) are absent because they must not matter.
   */
  const GOLDEN_ROWS: Record<string, string> = {
    'käsklus|vale|ei-saa': 'slksp',
    'käsklus|vale|ok': 'slklp',
    'käsklus|ok|ei-saa': 'sllsp',
    'käsklus|ok|ok': 'slllp',
    'ok|vale|ei-saa': 'llksp',
    'ok|vale|ok': 'llklp',
    'ok|ok|ei-saa': 'lllsp',
    'ok|ok|ok': 'llllp',
  };

  void test('enumerates all 64 flag combinations', () => {
    assert.equal(COMBOS.length, 64);
  });

  void test('DEMO_SKILLS column order is frozen — stenRow positions are bound to it', () => {
    assert.deepEqual(
      DEMO_SKILLS.map((skill) => skill.label),
      [
        'Võrduse omadused',
        'Kontroll asendamisega',
        'Sulgude avamine',
        'Negatiivsed arvud',
        'Murrud',
      ],
    );
  });

  void test('returns exactly stenRow, studentCard, inCluster', () => {
    for (const flags of [{}, ...COMBOS]) {
      assert.deepEqual(Object.keys(deriveTeacherView(flags)).sort(), [
        'inCluster',
        'stenRow',
        'studentCard',
      ]);
    }
  });

  void test('full happy path: everything läbitud except murrud, not in the cluster', () => {
    const view = deriveTeacherView({
      goal: 'tööleht',
      eq: 'ok',
      neg: 'ok',
      sulud: 'ok',
      hintAsked: 'ei',
      metaphor: 'väravad',
    });
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
    assert.equal(view.stenRow, 'llllp');
    assert.equal(view.inCluster, false);
  });

  void test('matches the golden stenRow for its (eq, sulud, neg) triple, all 64 combinations', () => {
    for (const flags of COMBOS) {
      const { stenRow } = deriveTeacherView(flags);
      const where = JSON.stringify(flags);
      assert.equal(stenRow.length, DEMO_SKILLS.length, `stenRow width for ${where}`);
      for (const [index, letter] of [...stenRow].entries()) {
        assert.ok(
          STATE_LETTERS.includes(letter),
          `${DEMO_SKILLS[index].label}: state '${letter}' has no stateLabels entry, for ${where}`,
        );
      }
      assert.equal(stenRow, GOLDEN_ROWS[`${flags.eq}|${flags.sulud}|${flags.neg}`], where);
    }
  });

  void test('goal, metaphor and hintAsked never affect stenRow', () => {
    for (const flags of COMBOS) {
      const skillFlagsOnly = { eq: flags.eq, sulud: flags.sulud, neg: flags.neg };
      assert.equal(
        deriveTeacherView(flags).stenRow,
        deriveTeacherView(skillFlagsOnly).stenRow,
        JSON.stringify(flags),
      );
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

  void test('card sentences carry the text that distinguishes their branch', () => {
    assert.match(deriveTeacherView({ neg: 'ei-saa' }).studentCard[1], /vajavad kordamist/);
    assert.match(deriveTeacherView({ neg: 'ok' }).studentCard[1], /on paigas/);
    // sulud wins over neg: the blocker names the parentheses, not the negatives.
    assert.match(
      deriveTeacherView({ sulud: 'vale', neg: 'ei-saa' }).studentCard[1],
      /sulgude avamine/i,
    );
    assert.match(deriveTeacherView({ hintAsked: 'jah' }).studentCard[2], /küsis ise/);
    assert.match(deriveTeacherView({ hintAsked: 'ei' }).studentCard[2], /ei küsinud/);
  });

  void test('studentCard is 3 non-empty selectable card sentences across all 64 combinations', () => {
    for (const flags of COMBOS) {
      const { studentCard } = deriveTeacherView(flags);
      const where = JSON.stringify(flags);
      assert.equal(studentCard.length, 3, `card length for ${where}`);
      for (const sentence of studentCard) {
        assert.ok(sentence.length > 0, `empty card sentence for ${where}`);
        assert.ok(
          CARD_SENTENCES.has(sentence),
          `card sentence is not one of the six selectable ones: ${where}`,
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
