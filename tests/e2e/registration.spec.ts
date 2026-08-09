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

  test('accepts submission with consent (delivers to test webhook)', async ({ openHome, page }) => {
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

    // Deterministic: webServer.env points the webhook at the local test
    // capture, so delivery always succeeds locally. Against a deployed server
    // (BASE_URL set) a non-200 must fail loudly — an unconfigured webhook
    // means registrations are silently lost, and the old [200, 503] tolerance
    // masked exactly that.
    expect(response.status()).toBe(200);
    await expect(dialog.getByText(/registreerimine on edastatud!/i)).toBeVisible();
  });

  test('shows a visible error when the webhook fails (RISK-004)', async ({ openHome, page }) => {
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
    await dialog.getByRole('checkbox').check();

    // Simulate an upstream webhook failure (server-side 502 path).
    await page.route('**/api/registration', (route) =>
      route.fulfill({
        status: 502,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Slack webhook failed' }),
      }),
    );

    await dialog.getByRole('button', { name: /esita registreering/i }).click();

    // The error must be visible on screen (role=alert), not only announced
    // to screen readers via the sr-only live region.
    await expect(dialog.getByRole('alert')).toContainText(/ebaõnnestus/i);
  });
});
