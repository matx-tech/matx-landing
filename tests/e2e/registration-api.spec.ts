import { expect, test } from '@playwright/test';

/**
 * API integration tests for the registration intake (TC-001/TC-002,
 * RISK-001/RISK-004). These hit the real server — no page.route mocks.
 *
 * State robustness: /api/registration keeps an in-memory delivery map and the
 * test capture keeps a payload buffer — both shared server state that
 * survives across runs when the dev server is reused. Every test therefore
 * posts a UNIQUE payload (uuid in the school name) and filters the captured
 * buffer by that marker; it never assumes a pristine server or buffer.
 *
 * Preview runs (BASE_URL set) target a deployed server and skip the
 * capture-dependent tests; the health test asserts shape only and runs
 * everywhere.
 */
const VALID = {
  schoolName: 'API Test Kool',
  contactName: 'Test Kontakt',
  role: 'Matemaatikaõpetaja',
  email: 'api@testkooli.ee',
  phone: '5551234',
  classGroups: '7.-9. klass (3 rühma)',
  consent: true,
};

const skipWithoutCapture = () =>
  test.skip(!!process.env.BASE_URL, 'test-webhook capture only exists in local webServer mode');

test.describe('registration intake API', () => {
  test('GET /api/health reports consistent service status (TC-002)', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.services?.webhook).toMatch(/^(up|down)$/);
    expect(body.status).toBe(body.services.webhook === 'up' ? 'healthy' : 'degraded');
  });

  test('delivers to the webhook and mrkdwn-escapes user input (TC-001, RISK-001)', async ({
    request,
  }) => {
    skipWithoutCapture();

    const marker = `xss-${crypto.randomUUID()}`;
    const res = await request.post('/api/registration', {
      data: {
        ...VALID,
        schoolName: `${marker} <script>alert(1)</script>`,
        contactName: '<a href="https://evil.example">x</a>',
        classGroups: 'A & B',
      },
    });
    expect(res.status()).toBe(200);

    // Filter by the unique marker — the buffer is shared across parallel
    // tests and may hold payloads from earlier runs of this spec.
    const captured = await (await request.get('/api/test-webhook')).json();
    const mine = captured.payloads.filter((p: unknown) => JSON.stringify(p).includes(marker));
    expect(mine).toHaveLength(1);

    const fields = mine[0].blocks[1].fields.map((field: { text: string }) => field.text).join('\n');
    expect(fields).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(fields).not.toContain('<script>');
    expect(fields).toContain('&lt;a href="https://evil.example"&gt;x&lt;/a&gt;');
    expect(fields).not.toContain('<a href');
    expect(fields).toContain('A &amp; B');
    expect(fields).not.toContain('A & B');
  });

  test('webhook failure surfaces as 502 (RISK-004)', async ({ request }) => {
    skipWithoutCapture();

    // Unique name: a previous failed delivery (502) leaves a 5-minute pending
    // marker in the server's delivery map — a deterministic name would answer
    // 202 on the next run instead of exercising the failure path.
    const res = await request.post('/api/registration', {
      data: { ...VALID, schoolName: `FAILWEBHOOK-${crypto.randomUUID()}` },
    });
    expect(res.status()).toBe(502);
    expect((await res.json()).error).toBe('Slack webhook failed');
  });

  test('identical payloads are delivered once (idempotency)', async ({ request }) => {
    skipWithoutCapture();

    const data = { ...VALID, schoolName: `Dedupe-${crypto.randomUUID()}` };
    const first = await request.post('/api/registration', { data });
    expect(first.status()).toBe(200);
    expect((await first.json()).ok).toBe(true);

    const second = await request.post('/api/registration', { data });
    expect(second.status()).toBe(200);
    expect((await second.json()).deduplicated).toBe(true);

    const captured = await (await request.get('/api/test-webhook')).json();
    const mine = captured.payloads.filter((p: unknown) =>
      JSON.stringify(p).includes(data.schoolName),
    );
    expect(mine).toHaveLength(1);
  });
});
