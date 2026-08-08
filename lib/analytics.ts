/**
 * Plausible analytics — thin typed wrapper around window.plausible.
 *
 * The queue function and init options are injected server-side in
 * app/layout.tsx (nonce'd inline script); this helper only fires events, so
 * it works whether or not the tracker script has finished loading (calls are
 * buffered by the queue) and is a no-op when analytics is disabled (no
 * PLAUSIBLE_SCRIPT_URL env — no script, no queue).
 */

// Event names are the goal names in the Plausible dashboard — keep them in
// one place so the code and the Goals tab can't drift.
export const EVENTS = {
  /** Registration dialog opened (any CTA). */
  dialogOpen: 'Dialog Open',
  /** Successful pilot registration submission. Props: role. */
  pilotSignup: 'Pilot Signup',
  /** A gated section was revealed ("Laadi sisu" / scroll). Props: section. */
  sectionReveal: 'Section Reveal',
  /** Theme switched. Props: theme. */
  themeToggle: 'Theme Toggle',
  /** 404 page visit (fired from app/not-found.tsx). */
  notFound: '404',
} as const;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

/**
 * Fires a Plausible custom event with optional custom properties.
 *
 * @param event - Event/goal name (must match the dashboard goal exactly)
 * @param props - Optional key-value custom properties (strings only)
 */
export function track(event: string, props?: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  window.plausible?.(event, props === undefined ? undefined : { props });
}
