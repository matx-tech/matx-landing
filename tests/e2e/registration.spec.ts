import { expect, test } from '../support/fixtures';
import { revealSection } from '../support/helpers/reveal';

test.describe('registration dialog', () => {
  test('opens from the pilot CTA and can be closed', async ({ openHome, page }) => {
    await openHome();

    // Pilot (adoption) section: "Registreeru piloodile" opens the dialog.
    const trigger = page.getByRole('button', { name: 'Registreeru piloodile' });
    await revealSection(page, 'piloot', trigger);

    await trigger.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    // Registration form is lazy-loaded — the chunk mounts with the dialog.
    await expect(dialog.getByRole('heading').first()).toBeVisible();

    await dialog.getByRole('button', { name: 'Sulge' }).first().click();
    await expect(dialog).not.toBeVisible();
  });

  test('rejects submission without consent', async ({ openHome, page }) => {
    await openHome();

    const trigger = page.getByRole('button', { name: 'Registreeru piloodile' });
    await revealSection(page, 'piloot', trigger);
    await trigger.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Fill required fields
    await dialog.getByLabel(/kooli nimi/i).fill('Test Gümnaasium');
    await dialog.getByLabel(/kontaktisiku nimi/i).fill('Mari Tamm');
    await dialog.getByLabel(/roll/i).selectOption('Matemaatikaõpetaja');
    await dialog.getByLabel(/asutuse e-post/i).fill('mari@testkooli.ee');
    await dialog.getByLabel(/telefon/i).fill('5551234');
    await dialog.getByLabel(/klassirühmad/i).fill('7.-9. klass (3 rühma)');

    // Try submit without consent checkbox
    await dialog.getByRole('button', { name: /esita registreering/i }).click();

    // Should show consent error
    await expect(dialog.getByText(/nõusolek/i)).toBeVisible();
  });

  test('rejects an email containing a pipe', async ({ openHome, page }) => {
    await openHome();

    const trigger = page.getByRole('button', { name: 'Registreeru piloodile' });
    await revealSection(page, 'piloot', trigger);
    await trigger.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Fill required fields
    await dialog.getByLabel(/kooli nimi/i).fill('Test Gümnaasium');
    await dialog.getByLabel(/kontaktisiku nimi/i).fill('Mari Tamm');
    await dialog.getByLabel(/roll/i).selectOption('Matemaatikaõpetaja');
    await dialog.getByLabel(/asutuse e-post/i).fill('mari|tamm@testkooli.ee');
    await dialog.getByLabel(/telefon/i).fill('5551234');
    await dialog.getByLabel(/klassirühmad/i).fill('7.-9. klass (3 rühma)');
    await dialog.getByRole('checkbox').check();

    await dialog.getByRole('button', { name: /esita registreering/i }).click();

    await expect(dialog.getByText(/kehtiv e-posti aadress/i)).toBeVisible();
  });

  test('accepts submission with consent when webhook configured', async ({ openHome, page }) => {
    await openHome();

    const trigger = page.getByRole('button', { name: 'Registreeru piloodile' });
    await revealSection(page, 'piloot', trigger);
    await trigger.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Fill required fields
    await dialog.getByLabel(/kooli nimi/i).fill('Test Gümnaasium');
    await dialog.getByLabel(/kontaktisiku nimi/i).fill('Mari Tamm');
    await dialog.getByLabel(/roll/i).selectOption('Matemaatikaõpetaja');
    await dialog.getByLabel(/asutuse e-post/i).fill('mari@testkooli.ee');
    await dialog.getByLabel(/telefon/i).fill('5551234');
    await dialog.getByLabel(/klassirühmad/i).fill('7.-9. klass (3 rühma)');

    // Check consent
    await dialog.getByRole('checkbox').check();

    // Intercept API call
    const responsePromise = page.waitForResponse((resp) =>
      resp.url().includes('/api/registration'),
    );

    await dialog.getByRole('button', { name: /esita registreering/i }).click();

    const response = await responsePromise;

    // Either success (200) or webhook not configured (503) are valid outcomes
    expect([200, 503]).toContain(response.status());

    if (response.status() === 200) {
      // Success state should appear
      await expect(dialog.getByText(/registreerimine on edastatud!/i)).toBeVisible();
    }
    // 503 means SLACK_WEBHOOK_URL not set (expected in test env without secrets)
  });
});
