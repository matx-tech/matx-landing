import { test, expect } from '../support/fixtures';
import { revealSection } from '../support/helpers/reveal';

test.describe('FAQ accordion', () => {
  test('expands and collapses an entry', async ({ openHome, page }) => {
    await openHome();

    // FAQ is below the fold and SectionGate-deferred — scroll to open the gate.
    const question = page.getByRole('button', { name: 'Kellele MATx on mõeldud?' });
    await revealSection(page, 'kkk', question);

    // Collapse state is a grid-template-rows 0fr/1fr toggle (the answer text
    // stays in the DOM, so assert the collapse mechanism, not visibility).
    // Browsers resolve 0fr to the computed value 0px.
    const panel = page.locator('#faq-panel-0');
    await expect(panel).toHaveCSS('grid-template-rows', '0px');

    await question.click();
    await expect(panel).not.toHaveCSS('grid-template-rows', '0px');

    await question.click();
    await expect(panel).toHaveCSS('grid-template-rows', '0px');
  });

  test('first FAQ entry is not open by default', async ({ openHome, page }) => {
    await openHome();

    const question = page.getByRole('button', { name: 'Kellele MATx on mõeldud?' });
    await revealSection(page, 'kkk', question);

    await expect(question).toHaveAttribute('aria-expanded', 'false');
  });
});
