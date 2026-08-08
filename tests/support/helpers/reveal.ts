import type { Page } from '@playwright/test';

/**
 * Scrolls the window to a section anchor and waits for the section's content
 * to actually render.
 *
 * Below-fold sections are deferred by SectionGate: they mount a placeholder
 * carrying the anchor id and only render the real section once a scroll event
 * brings the placeholder within 600px of the viewport. So scrolling to the id
 * is the trigger — then wait for a signal that the gate has opened.
 */
export async function revealSection(
  page: Page,
  id: string,
  signalLocator: ReturnType<Page['locator']>,
) {
  await page.evaluate((anchorId) => {
    document.getElementById(anchorId)?.scrollIntoView({ block: 'start' });
  }, id);
  await signalLocator.waitFor({ state: 'visible' });
}
