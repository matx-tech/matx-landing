/**
 * DemoSection — the näidistund product window.
 *
 * Renders the scripted, no-API sample lesson (`lib/content/demo-script.ts`)
 * over the pure replay engine (`lib/demo-engine.ts`). One piece of React
 * state (`history`) drives everything derivable; `revealedCount` is the one
 * exception, a presentation-timing value for the typing/reveal pacing (see
 * `_bmad-output/implementation-artifacts/spec-2-3-demosection-component.md`
 * Design Notes).
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import {
  DEMO_BEAT_ORDER,
  DEMO_BEATS,
  DEMO_COPY,
  DEMO_SCRIPT,
  type DemoCard,
} from '@/lib/content/demo-script';
import { SECTION_IDS } from '@/lib/content/landing-copy';
import {
  type DemoHistoryEntry,
  type DemoReplayStep,
  popLastChoice,
  replay,
  resolve,
} from '@/lib/demo-engine';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import styles from './demo.module.css';
import { newsreaderTutor } from './fonts';

/** Renders a task/solution card; `[bracketed]` text becomes the terracotta error span. */
function DemoCardView({ card }: { card: DemoCard }) {
  if (card.kind === 'task') {
    return (
      <div className={styles.card}>
        <p className={styles.kicker}>{card.kicker}</p>
        <p className={styles.eq}>{card.eq}</p>
      </div>
    );
  }
  const parts = card.line.split(/(\[[^\]]+\])/g);
  return (
    <div className={`${styles.card} ${styles.solution}`}>
      <p className={styles.kicker}>{card.kicker}</p>
      <p className={styles.eq}>
        {parts.map((part, i) => {
          const bracketed = part.match(/^\[([^\]]+)\]$/);
          return bracketed ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: parts come from a fixed split of a static string, order never changes
            <span key={`${i}-err`} className={styles.err}>
              {bracketed[1]}
            </span>
          ) : (
            // biome-ignore lint/suspicious/noArrayIndexKey: parts come from a fixed split of a static string, order never changes
            <span key={`${i}-text`}>{part}</span>
          );
        })}
      </p>
      <p className={styles.caption}>{card.caption}</p>
    </div>
  );
}

const TYPING_DELAY_MS = 600;

export function DemoSection() {
  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState<DemoHistoryEntry[]>([]);
  const [showLog, setShowLog] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const prevLenRef = useRef(0);
  const shouldFocusChoiceRef = useRef(false);
  const chatRef = useRef<HTMLOListElement>(null);
  const choicesGroupRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { flags, steps, currentId, awaitingAdvance } = replay(history);
  const currentNode = DEMO_SCRIPT[currentId];
  // The current node hasn't been chosen from yet, so it isn't in `steps` —
  // it still needs to be shown (and typed/revealed) as the newest turn.
  const displayTurns: DemoReplayStep[] = [
    ...steps,
    { id: currentId, node: currentNode, flags, choice: null },
  ];
  const isTyping = started && revealedCount < displayTurns.length;
  const revealed = displayTurns.slice(0, revealedCount);

  // Keep each choice's index into the raw (unfiltered) array `replay`
  // resolves against — filtering here must never shift the index a click
  // sends to `handleChoice`, or a future node mixing a `teacher` choice
  // alongside real choices would silently misroute history playback.
  const resolvedChoices = currentNode.choices
    ? resolve(currentNode.choices, flags)
        .map((choice, rawIndex) => ({ choice, rawIndex }))
        .filter(({ choice }) => !choice.teacher)
    : [];
  const showChoices = started && !isTyping && resolvedChoices.length > 0;

  // Reveal pacing: delay showing a newly-added turn by the typing duration;
  // reveal instantly when history shrinks (back/reset). Also drives
  // auto-advance — once the delay for the current node elapses, push the
  // next history entry if it's still awaiting one.
  useEffect(() => {
    if (!started) return;
    const len = displayTurns.length;
    if (len === prevLenRef.current) return;
    const grew = len > prevLenRef.current;
    prevLenRef.current = len;
    if (!grew) {
      setRevealedCount(len);
      return;
    }
    const delay = prefersReducedMotion ? 0 : TYPING_DELAY_MS;
    const timer = setTimeout(() => {
      setRevealedCount(len);
      if (awaitingAdvance) {
        setHistory((h) => [...h, { node: currentId, choice: null }]);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [started, displayTurns.length, prefersReducedMotion, awaitingAdvance, currentId]);

  // Focus the first new choice button — armed only by a choice click, never on mount.
  useEffect(() => {
    if (!shouldFocusChoiceRef.current || isTyping) return;
    shouldFocusChoiceRef.current = false;
    choicesGroupRef.current?.querySelector<HTMLButtonElement>('button')?.focus({
      preventScroll: true,
    });
  }, [isTyping]);

  // The newest turn scrolls into view whenever the log grows.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-run on every reveal/turn change, not on values read in the body
  useEffect(() => {
    chatRef.current?.lastElementChild?.scrollIntoView({ block: 'nearest' });
  }, [revealedCount, history.length]);

  function handleChoice(index: number) {
    shouldFocusChoiceRef.current = true;
    setHistory((h) => [...h, { node: currentId, choice: index }]);
  }

  function handleBack() {
    setHistory((h) => popLastChoice(h));
  }

  function handleReset() {
    setHistory([]);
  }

  const currentBeatName = DEMO_BEATS[currentId.split('-')[0]] ?? DEMO_BEATS.s0;
  const beatIndex = (DEMO_BEAT_ORDER as readonly string[]).indexOf(currentBeatName);
  const progressRatio = beatIndex >= 0 ? (beatIndex + 1) / DEMO_BEAT_ORDER.length : 0;

  let lastBeat: string | null = null;
  const items: React.ReactNode[] = [];
  revealed.forEach((turn, index) => {
    const beat = DEMO_BEATS[turn.id.split('-')[0]] ?? '';
    if (beat !== lastBeat) {
      lastBeat = beat;
      items.push(
        // biome-ignore lint/suspicious/noArrayIndexKey: DEMO_SCRIPT is acyclic (Story 1.3's graph-integrity test), so index+node id is stable per playthrough
        <li key={`${index}-${turn.id}-chapter`} className={styles.chapter}>
          {beat}
        </li>,
      );
    }
    const tutorText = resolve(turn.node.tutor, turn.flags);
    const log = turn.node.log ? resolve(turn.node.log, turn.flags) : undefined;
    items.push(
      // biome-ignore lint/suspicious/noArrayIndexKey: DEMO_SCRIPT is acyclic (Story 1.3's graph-integrity test), so index+node id is stable per playthrough
      <li key={`${index}-${turn.id}`} className={`${styles.turn} ${styles.tutor}`}>
        <div className={styles.avatar} aria-hidden='true'>
          {DEMO_COPY.lesson.tutorInitial}
        </div>
        <div className={styles.stack}>
          <div className={styles.who}>{DEMO_COPY.lesson.tutorName}</div>
          <div className={styles.bubble}>
            {tutorText}
            {turn.node.card && <DemoCardView card={turn.node.card} />}
          </div>
        </div>
      </li>,
    );
    if (showLog && log) {
      items.push(
        // biome-ignore lint/suspicious/noArrayIndexKey: DEMO_SCRIPT is acyclic (Story 1.3's graph-integrity test), so index+node id is stable per playthrough
        <li key={`${index}-${turn.id}-log`} className={styles.logLine}>
          {DEMO_COPY.controls.logPrefix}
          {log}
        </li>,
      );
    }
    if (turn.choice) {
      items.push(
        // biome-ignore lint/suspicious/noArrayIndexKey: DEMO_SCRIPT is acyclic (Story 1.3's graph-integrity test), so index+node id is stable per playthrough
        <li key={`${index}-${turn.id}-choice`} className={`${styles.turn} ${styles.student}`}>
          <div className={styles.avatar} aria-hidden='true'>
            {DEMO_COPY.lesson.studentInitial}
          </div>
          <div className={styles.stack}>
            <div className={styles.who}>{DEMO_COPY.lesson.studentName}</div>
            <div className={styles.bubble}>{turn.choice.label}</div>
          </div>
        </li>,
      );
    }
  });
  if (isTyping) {
    items.push(
      <li
        key='typing'
        aria-hidden='true'
        className={`${styles.turn} ${styles.tutor} ${styles.typing}`}
      >
        <div className={styles.avatar} aria-hidden='true'>
          {DEMO_COPY.lesson.tutorInitial}
        </div>
        <div className={styles.stack}>
          <div className={styles.who}>{DEMO_COPY.lesson.tutorName}</div>
          <div className={styles.bubble}>
            <i />
            <i />
            <i />
          </div>
        </div>
      </li>,
    );
  }

  return (
    <section id={SECTION_IDS.demo} className={`${styles.demo} ${newsreaderTutor.variable}`}>
      {started && (
        <div className={styles.top}>
          <div className={styles.in}>
            <button type='button' className={styles.ctl} onClick={handleBack}>
              {DEMO_COPY.controls.back}
            </button>
            <button type='button' className={styles.ctl} onClick={handleReset}>
              {DEMO_COPY.controls.reset}
            </button>
            <label className={styles.ctl}>
              <input
                type='checkbox'
                checked={showLog}
                onChange={(e) => setShowLog(e.target.checked)}
              />{' '}
              {DEMO_COPY.controls.showLog}
            </label>
            <span className={styles.beat} aria-live='polite'>
              {currentBeatName}
            </span>
          </div>
          <div className={styles.progress} aria-hidden='true'>
            <span style={{ transform: `scaleX(${progressRatio})` }} />
          </div>
        </div>
      )}

      {!started ? (
        <div>
          <p>{DEMO_COPY.cover.eyebrow}</p>
          <h2>{DEMO_COPY.cover.title}</h2>
          <p>{DEMO_COPY.cover.sub}</p>
          <p>
            <strong>{DEMO_COPY.cover.briefEmphasis}</strong> {DEMO_COPY.cover.brief}
          </p>
          <p>{DEMO_COPY.cover.honest}</p>
          <button type='button' onClick={() => setStarted(true)}>
            {DEMO_COPY.cover.start}
          </button>
        </div>
      ) : (
        <div>
          <ol ref={chatRef} role='log' aria-live='polite' className={styles.chat}>
            {items}
          </ol>
          {showChoices && (
            // biome-ignore lint/a11y/useSemanticElements: intent-contract requires <div role="group"> for this choice list — not a native form's <fieldset>
            <div
              ref={choicesGroupRef}
              role='group'
              aria-label={DEMO_COPY.lesson.choicesLabel}
              className={styles.choices}
            >
              {resolvedChoices.map(({ choice, rawIndex }) => (
                <button
                  key={`${rawIndex}-${choice.label}`}
                  type='button'
                  onClick={() => handleChoice(rawIndex)}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
