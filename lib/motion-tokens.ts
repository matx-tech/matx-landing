/**
 * Motion Foundation Tokens
 *
 * Every animation duration, easing, distance, and scale value used by GSAP
 * tweens and CSS transitions MUST come from this module.  Inline numeric
 * durations and magic-string easings are banned.
 *
 * This is consumed by every animated component. It replaces ~40 hardcoded
 * values spread across 15 files.
 */

export const motionTokens = {
  /** Durations in seconds — paired with GSAP `duration` or CSS `transition-duration`. */
  duration: {
    instant: 0.08,
    fast: 0.18,
    normal: 0.3, // most common — button feedback, card entrance, scroll fades
    slow: 0.5, // heavier sections, context cards, staged reveals
    crawl: 1.2, // deliberate storytelling — scroll indicator bounce, connector lines
  } as const,

  /** GSAP / CSS-compatible easing curves.  Prefer the cubic-bezier forms so they
   *  work across GSAP, CSS transitions, and inline styles without translation. */
  easing: {
    /** Emphasized decelerate — most common (Hero word/character reveals, nav, problem beats). */
    emphasized: [0.2, 0, 0, 1] as [number, number, number, number],
    /** Standard Material decelerate — scroll indicators, topic transitions. */
    standard: [0, 0, 0.2, 1] as [number, number, number, number],
    /** Accelerate — exit / leave-back animations. */
    accelerate: [0.4, 0, 1, 1] as [number, number, number, number],
    /** Standard ease-out — generic section reveals (teacher, student, adoption, context). */
    smooth: [0.22, 1, 0.36, 1] as [number, number, number, number],
    /** Linear — scrubbed/continuous motion (marquee, motion-path, gradient lines). */
    linear: [0, 0, 1, 1] as [number, number, number, number],
    /** Bounce — playful moments (empty states, hover pop). */
    bounce: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  } as const,

  /** Pixel distances for translate/offset animations. */
  distance: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 48,
    xxl: 100, // nav hide-offscreen
  } as const,

  /** Scale factors for hover/tap/pop interactions. */
  scale: {
    subtle: 0.98,
    press: 0.95,
    pop: 1.04,
    ripple: 2.5, // ripple effect expansion
  } as const,
} as const;

/** Shared stagger values used across word/character/item reveals. */
export const staggers = {
  word: 0.08,
  character: 0.025,
  card: 0.1,
  menuItem: 0.06,
  menuItemExit: 0.04,
} as const;

/** GSAP-compatible spring-like presets — currently unused but available for future adoption. */
export const springs = {
  /** Snappy: 'back.out(1.7)' — overshoot and settle quickly. */
  snappy: 'back.out(1.7)',
  /** Gentle: 'power2.out' — smooth deceleration. */
  gentle: 'power2.out',
  /** Bouncy: 'elastic.out(1, 0.3)' — playful elastic bounce. */
  bouncy: 'elastic.out(1, 0.3)',
  /** Instant: 'expo.out' — near-instant settling. */
  instant: 'expo.out',
  /** Release: 'power3.out' — floaty release. */
  release: 'power3.out',
} as const;

/**
 * Pre-created CustomEase instances for expressive curves not expressible as
 * cubic-bezier.  Created lazily so they work after `gsap.registerPlugin(CustomEase)`.
 * Use these directly as `ease: customEases.bounce` in GSAP tweens.
 */
export const customEases = {
  get bounce() {
    return CustomEase.create('motion-bounce', 'M0,0 C0.34,1.56 0.64,1 1,1');
  },
  get elastic() {
    return CustomEase.create(
      'motion-elastic',
      'M0,0 C0.22,0.5 0.35,1.1 0.45,1 C0.55,0.9 0.65,0.9 0.75,1 C0.85,1.1 1,0.5 1,1',
    );
  },
  get snappy() {
    return CustomEase.create('motion-snappy', 'M0,0 C0.2,0 0,1 0.4,1 C0.8,1 1,0 1,1');
  },
};

// Lazy import for CustomEase — only needed for customEases
import { CustomEase } from 'gsap/CustomEase';

/** Helper: returns a cubic-bezier CSS string from a tuple. */
export function cubicBezier(tuple: readonly [number, number, number, number]): string {
  return `cubic-bezier(${tuple.join(', ')})`;
}

/** Helper: returns a GSAP-compatible ease string from a tuple. */
export function gsapEase(tuple: readonly [number, number, number, number]): string {
  return cubicBezier(tuple);
}
