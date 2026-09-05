import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  DEMO_COPY,
  DEMO_FLAG_DOMAINS,
  DEMO_SCRIPT,
  DEMO_SKILLS,
  type DemoChoice,
  type DemoFlags,
} from '../../lib/content/demo-script.ts';
import { PROHIBITED_PHRASES } from '../../lib/content/landing-copy.ts';
import { resolve, walkAllPaths } from '../../lib/demo-engine.ts';

// Same shape as demo-engine.ts's internal (unexported) flagCombinations —
// re-derived here so the graph/content walks below can resolve `Resolvable`
// fields per combination without reimplementing walkAllPaths's traversal.
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

const COMBOS = flagCombinations();

// Same recursive walker as content-contract.test.ts — functions (e.g.
// DEMO_COPY.teacher.boardStuck) aren't strings/arrays/objects so they're
// skipped, matching that file's behaviour for non-string leaves.
function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) for (const item of value) collectStrings(item, out);
  else if (value !== null && typeof value === 'object') {
    for (const item of Object.values(value)) collectStrings(item, out);
  }
  return out;
}

void describe('demo-script — graph integrity (AC1)', () => {
  const walk = walkAllPaths(DEMO_SCRIPT);

  void test('every node is reachable from s0', () => {
    for (const id of Object.keys(DEMO_SCRIPT)) {
      assert.equal(walk.visitedIds.includes(id), true, `${id} is not reachable from s0`);
    }
  });

  void test('no dangling next/choice.next targets', () => {
    assert.deepEqual(walk.dangling, []);
  });

  void test('no cycles', () => {
    assert.deepEqual(walk.cycles, []);
  });

  void test('every choices array has 2-4 entries, except end which has exactly 1', () => {
    for (const [id, node] of Object.entries(DEMO_SCRIPT)) {
      if (!node.choices) continue;
      for (const flags of COMBOS) {
        const count: number = resolve<DemoChoice[]>(node.choices, flags).length;
        if (id === 'end') {
          assert.equal(count, 1, `end has ${count} choices, expected exactly 1`);
        } else {
          assert.equal(count >= 2 && count <= 4, true, `${id} has ${count} choices, expected 2-4`);
        }
      }
    }
  });

  void test('every choice.set key/value falls inside its declared flag domain', () => {
    const flagKeys = Object.keys(DEMO_FLAG_DOMAINS) as (keyof typeof DEMO_FLAG_DOMAINS)[];
    for (const [id, node] of Object.entries(DEMO_SCRIPT)) {
      if (!node.choices) continue;
      for (const flags of COMBOS) {
        for (const choice of resolve(node.choices, flags)) {
          if (!choice.set) continue;
          for (const [key, value] of Object.entries(choice.set)) {
            assert.equal(
              (flagKeys as string[]).includes(key),
              true,
              `${id}: choice.set key "${key}" is not a declared flag`,
            );
            assert.equal(
              (
                DEMO_FLAG_DOMAINS[key as keyof typeof DEMO_FLAG_DOMAINS] as readonly string[]
              ).includes(value as string),
              true,
              `${id}: choice.set value "${value}" is outside ${key}'s domain`,
            );
          }
        }
      }
    }
  });
});

void describe('demo-script — content contract (AC2)', () => {
  // Resolve every Resolvable field of every node across all 64 combinations,
  // collecting tutor/log strings separately (for the rules scoped to them)
  // alongside the full string set (for the rules scoped to everything).
  const tutorStrings: string[] = [];
  const logStrings: string[] = [];
  const allStrings: string[] = [];

  for (const node of Object.values(DEMO_SCRIPT)) {
    // card is not Resolvable — collect once, regardless of flags.
    if (node.card) collectStrings(node.card, allStrings);
    for (const flags of COMBOS) {
      const tutor = resolve(node.tutor, flags);
      tutorStrings.push(tutor);
      allStrings.push(tutor);
      if (node.log) {
        const log = resolve(node.log, flags);
        logStrings.push(log);
        allStrings.push(log);
      }
      if (node.choices) {
        for (const choice of resolve(node.choices, flags)) allStrings.push(choice.label);
      }
    }
  }

  // DEMO_COPY has no Resolvable fields keyed by DemoFlags (its functions take
  // unrelated params like `count`/`names`) — collectStrings skips them,
  // matching content-contract.test.ts's treatment of non-string leaves.
  collectStrings(DEMO_COPY, allStrings);

  // `card*`/`board*` summary-style strings — collected once, not per-combo,
  // since none of them are Resolvable. Function-valued ones (boardStuck,
  // boardCluster, boardProposal, boardAccepted) are invoked with a
  // non-numeric placeholder so their static Estonian template text is
  // covered too — a real digit surviving in the result would mean one is
  // baked into the template itself, not the placeholder.
  const N = 'N' as unknown as number;
  const summaryStrings: string[] = [
    DEMO_COPY.teacher.boardStuck(N),
    DEMO_COPY.teacher.boardCluster(['X', 'Y']),
    DEMO_COPY.teacher.boardProposal(N),
    DEMO_COPY.teacher.boardAccepted(N),
  ];
  for (const [key, value] of Object.entries(DEMO_COPY.teacher)) {
    if ((key.startsWith('card') || key.startsWith('board')) && typeof value === 'string') {
      summaryStrings.push(value);
    }
  }
  allStrings.push(...summaryStrings);

  void test('no string contains a PROHIBITED_PHRASES entry', () => {
    for (const phrase of PROHIBITED_PHRASES) {
      for (const s of allStrings) {
        assert.equal(
          s.toLowerCase().includes(phrase.toLowerCase()),
          false,
          `prohibited phrase "${phrase}" found in: ${s.slice(0, 80)}`,
        );
      }
    }
  });

  void test('no tutor string matches /\\bx-[a-zõäöü]+/i', () => {
    const re = /\bx-[a-zõäöü]+/i;
    for (const s of tutorStrings) {
      assert.equal(re.test(s), false, `tutor string matches /\\bx-.../: ${s}`);
    }
  });

  void test('no string contains an emoji', () => {
    const emoji = /\p{Extended_Pictographic}/u;
    for (const s of allStrings) {
      assert.equal(emoji.test(s), false, `emoji found in: ${s.slice(0, 80)}`);
    }
  });

  // Story 1.3-specific bans from epics.md's AC — distinct from the general
  // landing-page PROHIBITED_PHRASES list checked above.
  void test('no string contains "AI vestlus" or "Vale"', () => {
    for (const s of allStrings) {
      assert.equal(s.includes('AI vestlus'), false, `"AI vestlus" found in: ${s.slice(0, 80)}`);
      assert.equal(s.includes('Vale'), false, `"Vale" found in: ${s.slice(0, 80)}`);
    }
  });

  void test('log fields and teacher card*/board* summary strings contain no digits', () => {
    for (const s of [...logStrings, ...summaryStrings]) {
      assert.equal(/\d/.test(s), false, `digit found in: ${s.slice(0, 80)}`);
    }
  });

  void test('every character is within the allowed character set', () => {
    // Printable ASCII, Estonian õäöü, and the typographic punctuation the
    // transcribed prototype actually uses (em dash, middle dot, minus sign,
    // German-style curly quotes „ “ ”, ellipsis) plus whitespace. Deliberately
    // excludes š/ž and any other glyph outside this set, so one sneaking in
    // fails loudly.
    const allowed = /^[\x20-\x7EõäöüÕÄÖÜ—·−„“”…\s]*$/;
    for (const s of allStrings) {
      assert.equal(allowed.test(s), true, `out-of-subset character in: ${s.slice(0, 80)}`);
    }
  });
});

void describe('DEMO_SKILLS — taxonomy anchoring (AC: 3.2)', () => {
  const TAXONOMY_ID_RE = /^[a-z]+(\.[a-z0-9_]+){2}$/;

  void test('every taxonomyId is a non-null, non-empty string', () => {
    for (const skill of DEMO_SKILLS) {
      assert.equal(typeof skill.taxonomyId, 'string', `${skill.label}: taxonomyId is not a string`);
      assert.notEqual(skill.taxonomyId, '', `${skill.label}: taxonomyId is empty`);
    }
  });

  void test('every taxonomyId matches ^[a-z]+(\\.[a-z0-9_]+){2}$', () => {
    for (const skill of DEMO_SKILLS) {
      assert.equal(
        TAXONOMY_ID_RE.test(skill.taxonomyId ?? ''),
        true,
        `${skill.label}: taxonomyId "${skill.taxonomyId}" does not match the expected pattern`,
      );
    }
  });

  void test('all five taxonomyId values are pairwise unique', () => {
    const ids = DEMO_SKILLS.map((skill) => skill.taxonomyId);
    assert.equal(new Set(ids).size, ids.length, `duplicate taxonomyId found in: ${ids.join(', ')}`);
  });
});
