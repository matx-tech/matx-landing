import { expect, test } from '@playwright/test';

test.describe('tehniline status badges', () => {
  test('@p0 all three status badges render', async ({ page }) => {
    await page.goto('/tehniline');

    await expect(page.getByRole('img', { name: 'Staatus: Saadaval' }).first()).toBeVisible();
    await expect(page.getByRole('img', { name: 'Staatus: Piloodis' }).first()).toBeVisible();
    await expect(page.getByRole('img', { name: 'Staatus: Kavandatud' }).first()).toBeVisible();
  });

  test('@p0 no fourth status badge exists', async ({ page }) => {
    await page.goto('/tehniline');

    await expect(page.getByRole('img', { name: 'Staatus: Saadaval' }).first()).toBeVisible();
    await expect(page.getByRole('img', { name: 'Staatus: Piloodis' }).first()).toBeVisible();
    await expect(page.getByRole('img', { name: 'Staatus: Kavandatud' }).first()).toBeVisible();
    await expect(page.getByRole('img', { name: 'Staatus: Müüdud' })).toHaveCount(0);
  });

  test('@p0 status legend section lists all three statuses', async ({ page }) => {
    await page.goto('/tehniline');

    const legend = page.getByRole('region', { name: 'Staatuste legend' });
    await expect(legend).toBeVisible();
    await expect(legend.getByRole('img', { name: 'Staatus: Saadaval' })).toBeVisible();
    await expect(legend.getByRole('img', { name: 'Staatus: Piloodis' })).toBeVisible();
    await expect(legend.getByRole('img', { name: 'Staatus: Kavandatud' })).toBeVisible();
  });

  test('@p0 Kavandatud badge is visible (FR-3)', async ({ page }) => {
    await page.goto('/tehniline');

    await expect(page.getByRole('img', { name: 'Staatus: Kavandatud' }).first()).toBeVisible();
  });
});
