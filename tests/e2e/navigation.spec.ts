import { expect, test } from '../support/fixtures';

test.describe('navigation', () => {
  test('desktop nav: clicking a link scrolls to the section', async ({ openHome, page }) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) < 1280,
      'desktop nav is hidden below the xl breakpoint',
    );
    await openHome();

    const link = page.locator('nav').getByRole('link', { name: 'KKK' });
    await link.click();
    // Lenis intercepts anchor clicks and scrolls without setting location.hash,
    // so assert the scroll outcome, not the URL.
    // Section content renders once the SectionGate opens on scroll.
    await expect(page.getByRole('heading', { name: /KKK/i }).first()).toBeVisible();
  });
});

test.describe('mobile menu', () => {
  test('opens and closes the menu dialog', async ({ openHome, page }) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) >= 1280,
      'mobile menu button is hidden at the xl breakpoint',
    );
    await openHome();

    const trigger = page.getByRole('button', { name: 'Ava menüü' });
    await trigger.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    // Menu items are rendered inside the dialog.
    await expect(dialog.getByRole('link', { name: 'KKK' })).toBeVisible();

    await dialog.getByRole('button', { name: 'Sulge menüü' }).click();
    await expect(dialog).not.toBeVisible();
  });

  test('menu link closes the dialog and jumps to the section', async ({ openHome, page }) => {
    test.skip(
      (page.viewportSize()?.width ?? 0) >= 1280,
      'mobile menu button is hidden at the xl breakpoint',
    );
    await openHome();

    await page.getByRole('button', { name: 'Ava menüü' }).click();
    await page.getByRole('dialog').getByRole('link', { name: 'KKK' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Regression guard: the heading must appear WITHOUT any explicit scroll —
    // only the fix's delayed hash jump (650ms, after the scroll lock releases)
    // opens the SectionGate. Pre-fix, navigation was cancelled by the dialog
    // unmount and this assertion timed out. The desktop test above relies on
    // the native/lenis click path; this one proves the mobile handler works.
    await expect(page.getByRole('heading', { name: /KKK/i }).first()).toBeVisible();
  });
});
