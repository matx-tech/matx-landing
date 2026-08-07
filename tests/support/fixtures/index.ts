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
    await page.locator('nav').waitFor({ state: 'visible' });
    await use(async () => page);
  },
});

export { expect };
