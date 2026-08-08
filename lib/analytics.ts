import type { PlausibleConfig } from '@plausible-analytics/tracker';

/**
 * Event names — single source of truth so dashboard goals match exactly.
 */
export const EVENTS = {
  pilotSignup: 'Pilot Signup',
  themeToggle: 'Theme Toggle',
  sectionReveal: 'Section Reveal',
  dialogOpen: 'Dialog Open',
  notFound: '404',
} as const;

let initialized = false;
// ponytail: tiny FIFO for events fired before init() (the 404 page's effect
// runs before the layout's AnalyticsProvider effect). A real queue lib is
// overkill; the buffer is drained once on init. Capped so a session where
// analytics stays disabled (env unset) can't grow it without bound.
const early: Array<{ event: string; props?: Record<string, string> }> = [];
const MAX_EARLY_EVENTS = 50;

/**
 * Initializes the Plausible tracker (client-only). Drains events that were
 * queued before initialization. Idempotent.
 *
 * The tracker package is imported dynamically on purpose: its module body
 * references browser globals (`location`), so a static import would crash
 * SSR. The dynamic import also keeps the tracker out of the main bundle.
 */
export async function enableAnalytics(config: PlausibleConfig): Promise<void> {
  if (initialized) return;
  initialized = true;
  const { init, track } = await import('@plausible-analytics/tracker');
  init(config);
  for (const { event, props } of early.splice(0)) {
    track(event, props === undefined ? {} : { props });
  }
}

/**
 * Fires a Plausible custom event. Safe to call before init (buffered), on the
 * server (no-op), and when analytics is disabled (never initialized).
 */
export function track(event: string, props?: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  if (!initialized) {
    if (early.length >= MAX_EARLY_EVENTS) early.shift();
    early.push({ event, props });
    return;
  }
  // The module is already cached once enableAnalytics ran.
  void import('@plausible-analytics/tracker').then(({ track: plausibleTrack }) => {
    plausibleTrack(event, props === undefined ? {} : { props });
  });
}
