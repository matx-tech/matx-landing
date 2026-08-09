import { expect, test } from '@playwright/test';

test.describe('security headers', () => {
  test('GET / returns CSP with required directives @p0', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).toBe(200);
    const csp = res.headers()['content-security-policy'];
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self' 'nonce-");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  test('CSP nonce is unique per request @p0', async ({ request }) => {
    const res1 = await request.get('/');
    const res2 = await request.get('/');
    const csp1 = res1.headers()['content-security-policy'];
    const csp2 = res2.headers()['content-security-policy'];
    const nonce1 = csp1.match(/'nonce-([^']+)'/)?.[1];
    const nonce2 = csp2.match(/'nonce-([^']+)'/)?.[1];
    expect(nonce1).toBeDefined();
    expect(nonce2).toBeDefined();
    expect(nonce1).not.toBe(nonce2);
  });

  test('inline script nonce matches the response CSP nonce @p0', async ({ request }) => {
    const res = await request.get('/');
    const csp = res.headers()['content-security-policy'];
    const nonce = csp.match(/'nonce-([^']+)'/)?.[1];
    expect(nonce).toBeDefined();
    const html = await res.text();
    const scriptNonce = html.match(
      /<script\b(?![^>]*\bsrc\s*=)[^>]*\snonce="([^"]+)"/,
    );
    expect(scriptNonce).not.toBeNull();
    expect(scriptNonce?.[1]).toBe(nonce);
  });
});
