/**
 * Näidistund replay engine — pure functions over `lib/content/demo-script.ts`.
 *
 * Ported from the frozen prototype's `res`/`replay`/`deriveTeacher`
 * (`docs/research/naidistund/naidistund.html` lines 356–385), plus
 * `walkAllPaths`, new for story 1.3's exhaustive graph test.
 *
 * Erasable TypeScript — no enum/namespace/decorators — so it imports directly
 * under `node --experimental-strip-types` with no build step. No React, DOM,
 * storage or network access.
 */

import {
  DEMO_COPY,
  DEMO_FLAG_DOMAINS,
  DEMO_SCRIPT,
  type DemoChoice,
  type DemoFlags,
  type DemoNode,
  type DemoSkillStates,
  type Resolvable,
} from './content/demo-script.ts';

// ---- resolve -------------------------------------------------------------

/** The general form of the prototype's `res`: calls `value` with `flags` when it is a function, else returns it unchanged. */
export function resolve<T>(value: Resolvable<T>, flags: DemoFlags): T {
  return typeof value === 'function' ? (value as (flags: DemoFlags) => T)(flags) : value;
}

// ---- replay ----------------------------------------------------------------

/** Never push a `teacher: true` choice into history — mirror the prototype (naidistund.html:431), where that choice opens the teacher view directly from the click handler instead of going through history; call `deriveTeacherView` with the current flags instead. */
export type DemoHistoryEntry = { node: string; choice: number | null };

export type DemoReplayStep = {
  id: string;
  node: DemoNode;
  flags: DemoFlags;
  choice: DemoChoice | null;
};

export type DemoReplayState = {
  flags: DemoFlags;
  steps: DemoReplayStep[];
  currentId: string;
  /** True when currentId's node has `next` and no `choices` — awaiting an explicit advance. */
  awaitingAdvance: boolean;
};

/**
 * Deterministic, prefix-correct: same `history` in, identical output every
 * call; replaying `history.slice(0, n)` reproduces exactly the state that
 * prefix produced during a full replay. Never mutates `history`.
 */
export function replay(history: DemoHistoryEntry[]): DemoReplayState {
  let flags: DemoFlags = {};
  const steps: DemoReplayStep[] = [];
  let currentId = 's0';

  for (const entry of history) {
    const node = DEMO_SCRIPT[entry.node];
    const before = { ...flags };
    const choice = entry.choice == null ? null : resolve(node.choices ?? [], flags)[entry.choice];
    if (choice?.set) flags = { ...flags, ...choice.set };
    steps.push({ id: entry.node, node, flags: before, choice: choice ?? null });
    currentId = choice
      ? (choice.next ?? currentId)
      : node.next
        ? resolve(node.next, flags)
        : currentId;
  }

  const currentNode = DEMO_SCRIPT[currentId];
  const awaitingAdvance = Boolean(currentNode?.next && !currentNode.choices);
  return { flags, steps, currentId, awaitingAdvance };
}

// ---- walkAllPaths ----------------------------------------------------------

export type DemoEdge = { from: string; to: string };

export type DemoPathWalk = {
  /** Every node id reached from `s0` across all 64 flag combinations. */
  visitedIds: string[];
  edges: DemoEdge[];
  /** Edges whose `to` id has no matching node in `script`. */
  dangling: DemoEdge[];
  /** Each detected cycle, as the node ids from the repeated node back to itself. */
  cycles: string[][];
};

function flagCombinations(): DemoFlags[] {
  const keys = Object.keys(DEMO_FLAG_DOMAINS) as (keyof typeof DEMO_FLAG_DOMAINS)[];
  let combos: DemoFlags[] = [{}];
  for (const key of keys) {
    const next: DemoFlags[] = [];
    for (const combo of combos) {
      for (const value of DEMO_FLAG_DOMAINS[key]) {
        next.push({ ...combo, [key]: value });
      }
    }
    combos = next;
  }
  return combos;
}

/**
 * Walks every reachable node from `s0` across all 64 flag combinations,
 * recording edges. Enough structure (visited ids, edges, dangling, cycles) for
 * story 1.3 to assert full reachability and detect dangling `next`/`choice.next`
 * targets or cycles without reimplementing traversal.
 */
export function walkAllPaths(script: Record<string, DemoNode>): DemoPathWalk {
  const visitedIds = new Set<string>();
  const edgeKeys = new Set<string>();
  const edges: DemoEdge[] = [];
  const danglingKeys = new Set<string>();
  const dangling: DemoEdge[] = [];
  const cycleKeys = new Set<string>();
  const cycles: string[][] = [];

  const addEdge = (from: string, to: string) => {
    const key = `${from}->${to}`;
    if (!edgeKeys.has(key)) {
      edgeKeys.add(key);
      edges.push({ from, to });
    }
    if (!script[to] && !danglingKeys.has(key)) {
      danglingKeys.add(key);
      dangling.push({ from, to });
    }
  };

  for (const flags of flagCombinations()) {
    const stack: string[] = [];
    // Without this memo, diamond joins (multiple paths reconverging on one
    // node, e.g. s4-kontroll) get re-walked from scratch on every path in,
    // blowing up combinatorially across 64 flag combos. Same id + same combo
    // always explores the same subtree, so walk it once per combo.
    const visitedThisCombo = new Set<string>();
    const walk = (id: string) => {
      const cycleStart = stack.indexOf(id);
      if (cycleStart !== -1) {
        const cyclePath = [...stack.slice(cycleStart), id];
        const key = cyclePath.join('>');
        if (!cycleKeys.has(key)) {
          cycleKeys.add(key);
          cycles.push(cyclePath);
        }
        return;
      }
      if (visitedThisCombo.has(id)) return;
      visitedThisCombo.add(id);
      const node = script[id];
      if (!node) return; // dangling target, already recorded by the caller's addEdge
      visitedIds.add(id);
      stack.push(id);
      if (node.choices) {
        for (const choice of resolve(node.choices, flags)) {
          if (choice.next) {
            addEdge(id, choice.next);
            walk(choice.next);
          }
        }
      } else if (node.next) {
        const target = resolve(node.next, flags);
        addEdge(id, target);
        walk(target);
      }
      stack.pop();
    };
    walk('s0');
  }

  return { visitedIds: [...visitedIds], edges, dangling, cycles };
}

// ---- deriveTeacherView ------------------------------------------------------

export type DemoTeacherView = {
  sten: DemoSkillStates;
  /** Strengths, blocker, hint — in that order. */
  card: [string, string, string];
  inCluster: boolean;
};

/** Ports `deriveTeacher` verbatim — reads copy from `DEMO_COPY.teacher`, never inlines new Estonian text. */
export function deriveTeacherView(flags: DemoFlags): DemoTeacherView {
  const sten = [
    flags.eq === 'käsklus' ? 's' : 'l',
    'l',
    flags.sulud === 'vale' ? 'k' : 'l',
    flags.neg === 'ei-saa' ? 's' : 'l',
    'p',
  ].join('') as DemoSkillStates;
  const card: [string, string, string] = [
    DEMO_COPY.teacher.cardStrengths,
    flags.sulud === 'vale'
      ? DEMO_COPY.teacher.cardBlockerSulud
      : flags.neg === 'ei-saa'
        ? DEMO_COPY.teacher.cardBlockerNoneNegWeak
        : DEMO_COPY.teacher.cardBlockerNoneNegOk,
    flags.hintAsked === 'jah' ? DEMO_COPY.teacher.cardHintAsked : DEMO_COPY.teacher.cardHintNone,
  ];
  return { sten, card, inCluster: flags.sulud === 'vale' };
}
