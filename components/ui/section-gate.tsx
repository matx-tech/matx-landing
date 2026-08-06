'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      if (visible) return;
      const rect = el.getBoundingClientRect();
      // Open when the placeholder's top is at/below the reveal line
      // (viewport bottom + lookahead) — i.e. near, visible, or scrolled past.
      if (rect.top <= window.innerHeight + REVEAL_MARGIN_PX) {
        setVisible(true);
      }
    };

    check(); // sections already near the viewport at load
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [visible]);

  if (visible) return <>{children}</>;

  return <div ref={ref} id={id} className={placeholderClassName} aria-hidden="true" />;
}
