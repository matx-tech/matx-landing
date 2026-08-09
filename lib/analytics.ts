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
 * Enables analytics and sends events recorded before initialization.
 *
 * @param config - Plausible tracker configuration
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
 * Records an analytics event when analytics has been initialized.
 *
 * Events recorded before initialization are buffered, and calls made during server-side execution are ignored.
 *
 * @param event - The name of the event to record
 * @param props - Optional properties associated with the event
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
