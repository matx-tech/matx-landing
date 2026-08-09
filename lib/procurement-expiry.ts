// Old-regime procurement data (PROCUREMENT_ROUTES, the "Kehtib kuni
// 31.10.2026" table header) expires when the Riigihangete seaduse ja teiste
// seaduste muutmise seadus takes effect on 2026-11-01.
//
// The expiry is enforced by a CI/test assertion (tests/e2e/procurement-expiry.spec.ts),
// NOT by a runtime throw: a deployment built before the date and still serving
// after it must keep serving correct content, not 500 the /tehniline route.
export const OLD_REGIME_EXPIRY = '2026-11-01T00:00:00+02:00' as const;
