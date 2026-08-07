import { test, expect } from '../support/fixtures';

test.describe('homepage', () => {
  test('hero renders with title and primary CTA', async ({ openHome, page }) => {
    await openHome();

    await expect(page).toHaveTitle(/MATx/);
    // Hero headline is the only h1; the "MATx" logo is an SVG, not text.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Nav + main are the two structural landmarks above the fold.
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('nav links point at existing section anchors', async ({ openHome, page }) => {
    await openHome();

    const links = page.locator('nav a[href^="#"]');
    const hrefs = await links.evaluateAll((els) =>
      els
        .map((el) => el.getAttribute('href'))
        .filter((href): href is string => Boolean(href)),
    );

    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      await expect(page.locator(`#${href.slice(1)}`).first()).toBeAttached();
    }
  });
});
