'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SectionGateProps {
  children: ReactNode;
  /**
   * Section anchor id, forwarded to the placeholder so nav links to
   * below-fold sections keep working before the section has rendered.
   * Once the section mounts (with its own id), the placeholder is removed.
   */
  id?: string;
  /** Placeholder height before render — reserves layout so reveal doesn't shift CLS. */
  placeholderClassName?: string;
}

const REVEAL_MARGIN_PX = 600;

/**
 * Defers a below-fold section until the user scrolls near it (600px lookahead).
 * The section is not rendered during SSR, so its chunk is never preloaded —
 * the next/dynamic import fires on demand when the gate opens, keeping the
 * section's GSAP/ScrollTrigger setup out of the initial main-thread work.
 *
 * Scroll-listener based (not IntersectionObserver): IO never delivers entries
 * for elements that are jumped past without ever intersecting (anchor links,
 * PageDown, scrollTo), so those gates would stay closed forever. A scroll
 * listener re-reads the placeholder rect on every scroll — including instant
 * jumps — and opens anything at or above the reveal line.
 */
export function SectionGate({
  children,
  id,
  placeholderClassName = 'min-h-[50vh]',
}: SectionGateProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Revealed-content wrapper for gates without an id: the placeholder (and
  // its ref) unmounts once the gate opens, so this is the stable target for
  // focus hand-off when the sr-only load button opens an id-less gate.
  const revealedRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // Set when the sr-only load button (not a scroll) opened the gate — the
  // button unmounts with the placeholder, so focus must be handed off to the
  // section once it exists or keyboard focus would drop to <body>.
  const openedByButtonRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId: number | null = null;

    const check = () => {
      if (visible) return;
      const rect = el.getBoundingClientRect();
      // Open when the placeholder's top is at/below the reveal line
      // (viewport bottom + lookahead) — i.e. near, visible, or scrolled past.
      if (rect.top <= window.innerHeight + REVEAL_MARGIN_PX) {
        setVisible(true);
      }
    };

    // Coalesce scroll/resize into one layout read per frame — a rect read
    // per event per still-closed gate is main-thread work on the throttled
    // mobile CPUs this page targets.
    const scheduleCheck = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        check();
      });
    };

    check(); // sections already near the viewport at load
    window.addEventListener('scroll', scheduleCheck, { passive: true });
    window.addEventListener('resize', scheduleCheck);
    return () => {
      window.removeEventListener('scroll', scheduleCheck);
      window.removeEventListener('resize', scheduleCheck);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [visible]);

  // Focus hand-off when the sr-only load button opened the gate: the button
  // unmounts with the placeholder, so without this keyboard focus drops to
  // <body>. Poll for the real section — the loading skeleton also carries
  // the id but is aria-hidden and transient, so only stop on the mounted
  // section (or the error/retry state), which can take seconds on slow
  // connections. Gates without an id can't be found by lookup, so poll the
  // revealed wrapper for its first heading and fall back to the wrapper
  // itself (tabIndex -1) so focus never drops to <body>. preventScroll
  // keeps the viewport where the user is.
  useEffect(() => {
    if (!visible || !openedByButtonRef.current) return;
    let cancelled = false;
    const poll = (remaining: number) => {
      const target = id
        ? document.getElementById(id)
        : revealedRef.current?.querySelector('h1, h2, h3, h4, h5, h6');
      if (
        target instanceof HTMLElement &&
        target.getAttribute('aria-hidden') !== 'true' &&
        target.closest('[aria-hidden="true"]') === null
      ) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        return;
      }
      if (remaining <= 0) {
        if (!id) revealedRef.current?.focus({ preventScroll: true });
        return;
      }
      setTimeout(() => {
        if (!cancelled) poll(remaining - 1);
      }, 200);
    };
    poll(25); // ~5s cap — covers a slow chunk fetch, then gives up quietly
    return () => {
      cancelled = true;
    };
  }, [visible, id]);

  // The mounted section is taller/shorter than the placeholder; refresh
  // scroll math (ScrollTrigger triggers, Lenis limit) once the frame
  // settles and again after a typical chunk fetch.
  // ponytail: heuristic timer; swap for a MutationObserver on children if
  // gate reveals drift again with slower chunks.
  useEffect(() => {
    if (!visible) return;
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    const timer = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [visible]);

  if (visible) {
    // id-less gates (CTA, footer) get a stable wrapper for focus hand-off:
    // it replaces the unmounted placeholder, and tabIndex -1 makes it a
    // programmatic focus fallback if the chunk never resolves.
    return id ? <>{children}</> : (
      <div ref={revealedRef} tabIndex={-1}>
        {children}
      </div>
    );
  }

  // The placeholder keeps the anchor id and a visually-hidden load button
  // so keyboard-only users can open gated content without scrolling.
  return (
    <div ref={ref} id={id} className={`relative ${placeholderClassName} scroll-mt-20`}>
      <button
        type="button"
        onClick={() => {
          openedByButtonRef.current = true;
          setVisible(true);
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 rounded-lg bg-surface px-4 py-2 text-sm font-semibold text-text-primary shadow-card focus-ring-target"
      >
        Laadi sisu
      </button>
    </div>
  );
}
