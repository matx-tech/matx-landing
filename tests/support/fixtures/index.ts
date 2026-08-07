/* eslint-disable react-hooks/rules-of-hooks -- Playwright fixture `use` callback is not a React hook. */
import { test as base, expect, type Page } from '@playwright/test';

type Fixtures = {
  /** Navigate to the homepage with reduced motion emulated and hydration waited on. */
  openHome: () => Promise<Page>;
};

/**
 * `openHome`: GSAP entrance tweens are skipped under reduced motion, which
 * makes smoke tests deterministic. Waits for a client island (nav) so the
 * test doesn't race hydration.
 *
 * ponytail: single fixture file — mergeTests composition only becomes
 * necessary when a second fixture file appears; add it then.
 */
export const test = base.extend<Fixtures>({
  openHome: async ({ page, baseURL }, use) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(baseURL ?? '/', { waitUntil: 'domcontentloaded' });
    // True hydration signal: the nav SSR's with the `gsap-animate-on-mount`
    // class, which its useGSAP layout effect removes during hydration commit —
    // only JS can remove it, so its absence means React listeners are attached.
    await page.waitForFunction(() => {
      const nav = document.querySelector('nav');
      return nav !== null && !nav.classList.contains('gsap-animate-on-mount');
    });
    await use(async () => page);
  },
});

export { expect };
