/**
 * Runtime motion gate — consumed by every animated component via the shared
 * `usePrefersReducedMotion` hook and this module's `shouldAnimate()` guard.
 *
 * Priority (highest to lowest):
 *  1. prefers-reduced-motion: reduce → all non-essential motion disabled
 *  2. Low-end device (≤4 logical cores) → duration capped, non-essential dropped
 *  3. Design preference → everything else
 */

import { motionTokens } from './motion-tokens';

/** Check whether the current device is a low-end classification. */
export function isLowEnd(): boolean {
  if (typeof navigator === 'undefined') return false;
  return navigator.hardwareConcurrency <= 4;
}

/** Read the OS-level reduced-motion preference (one-shot, no subscription). */
export function prefersReduced(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * The central gate.  Returns `false` when animations should be skipped
 * (reduced-motion, non-essential on low-end, or decorative-only).
 *
 * Pass `{ essential: true }` to override the low-end gate for animations
 * that convey critical UX state (focus rings, error indicators, etc.).
 */
export function shouldAnimate({ essential = false } = {}): boolean {
  if (prefersReduced()) return false;
  if (!essential && isLowEnd()) return false;
  return true;
}

/**
 * Returns a sane duration that degrades on constrained hardware:
 *  - reduced-motion → `instant`
 *  - low-end device → `fast`
 *  - otherwise → `normal`
 */
export function adaptiveDuration(): number {
  if (prefersReduced()) return motionTokens.duration.instant;
  if (isLowEnd()) return motionTokens.duration.fast;
  return motionTokens.duration.normal;
}
