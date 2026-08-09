import { expect, test } from '../support/fixtures';

test.describe('reduced motion', () => {
  test('@p0 gsap-animate-on-mount class is removed after hydration', async ({ openHome, page }) => {
    await openHome();
    await expect(page.locator('.gsap-animate-on-mount')).toHaveCount(0);
  });

  test('@p0 hero headline is visible and fully opaque', async ({ openHome, page }) => {
    await openHome();
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    expect(await h1.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  });

  test('@p0 nav is visible and not animated off-screen', async ({ openHome, page }) => {
    await openHome();
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    // Reduced motion: the nav must rest at the top of the viewport (identity
    // transform). GSAP still writes an identity transform inline, so assert
    // the resting position rather than the absence of the style attribute.
    await expect.poll(async () => (await nav.boundingBox())?.y ?? -1, { timeout: 5_000 }).toBe(0);
  });
});
