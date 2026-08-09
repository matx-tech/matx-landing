import { HERO_COPY, PROHIBITED_PHRASES, REGISTRATION_COPY } from '@/lib/content/landing-copy';
import { expect, test } from '../support/fixtures';

test.describe('content contract', () => {
  test('@p0 hero headline matches HERO_COPY.headline', async ({ openHome, page }) => {
    await openHome();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(HERO_COPY.headline);
  });

  test('@p0 hero primary CTA is visible', async ({ openHome, page }) => {
    await openHome();
    // Default persona is 'teacher', so the primary CTA is the registration
    // button (HERO_COPY.primaryCTA). getByRole('button') — it is not a link.
    await expect(page.getByRole('button', { name: HERO_COPY.primaryCTA })).toBeVisible();
  });

  test('@p0 body text contains no PROHIBITED_PHRASES', async ({ openHome, page }) => {
    await openHome();
    const bodyText = await page.locator('body').innerText();
    for (const phrase of PROHIBITED_PHRASES) {
      expect(bodyText).not.toContain(phrase);
    }
  });

  test('@p0 footer contains contact email link', async ({ openHome, page }) => {
    await openHome();
    // The footer is SectionGate-deferred — scroll to the bottom to trigger
    // its chunk to mount, then assert the mailto link is present.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // Two mailto links share the address (CTA section + footer) — scope to
    // the footer's contentinfo landmark.
    await expect(
      page.getByRole('contentinfo').getByRole('link', { name: REGISTRATION_COPY.contactEmail }),
    ).toBeVisible();
  });
});
