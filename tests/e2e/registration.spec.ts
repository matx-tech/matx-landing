import { test, expect } from '../support/fixtures';
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
});
