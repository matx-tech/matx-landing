import { expect, test } from '@playwright/test';
import { OLD_REGIME_EXPIRY } from '../../lib/procurement-expiry';

// Old-regime procurement data (PROCUREMENT_ROUTES and its "Kehtib kuni
// 31.10.2026" header on /tehniline) must be deleted when the RHS amendment
// takes effect. This assertion fails the pipeline after the expiry date —
// deliberately NOT a runtime check, so a stale deployment keeps serving
// instead of 500-ing the route.
test('old-regime procurement data is removed before the expiry date', () => {
  expect(Date.now()).toBeLessThan(new Date(OLD_REGIME_EXPIRY).getTime());
});
