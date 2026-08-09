import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import * as contract from '../../lib/content/landing-copy.ts';

// Recursively collect every string in the exported contract so prohibited
// phrases cannot hide in nested objects (FAQs, stories, awards, llms.txt).
function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) for (const item of value) collectStrings(item, out);
  else if (value !== null && typeof value === 'object') {
    for (const item of Object.values(value)) collectStrings(item, out);
  }
  return out;
}

void describe('content contract — status vocabulary (AD-3, RISK-010)', () => {
  void test('CAPABILITY_STATUSES is exactly the three allowed statuses', () => {
    assert.deepEqual([...contract.CAPABILITY_STATUSES], ['Saadaval', 'Piloodis', 'Kavandatud']);
  });
});

void describe('content contract — prohibited phrases (AD-2, RISK-007)', () => {
  void test('PROHIBITED_PHRASES does not appear in any contract string', () => {
    // Exclude the PROHIBITED_PHRASES export itself — the check walks the
    // copy that ships to users (headlines, FAQs, stories, llms.txt), not the
    // ban list that defines it.
    const { PROHIBITED_PHRASES: _banned, ...copy } = contract;
    const all = collectStrings(copy);
    for (const phrase of contract.PROHIBITED_PHRASES) {
      for (const s of all) {
        assert.equal(
          s.toLowerCase().includes(phrase.toLowerCase()),
          false,
          `prohibited phrase "${phrase}" found in contract string: ${s.slice(0, 80)}`,
        );
      }
    }
  });
});
