// Test-only webhook capture (TC-001). In test runs Playwright's webServer.env
// points SLACK_WEBHOOK_URL at this route (and sets TEST_WEBHOOK_CAPTURE=true),
// so the registration endpoint delivers to local memory instead of the real
// Slack webhook. That makes registration tests deterministic and lets them
// assert the exact Slack payload (RISK-001). Gated: without the env var every
// method 404s, so the route is inert in production.
export const dynamic = 'force-dynamic';

// A payload containing this marker anywhere makes the route respond 500 —
// the registration endpoint turns that into its 502 webhook-failed error, so
// tests can exercise the failure path without touching Slack. Stateless per
// request (parallel-safe), unlike a toggle endpoint that shares mutable state
// across tests.
const FAIL_MARKER = 'FAILWEBHOOK';
const CAPTURE_LIMIT = 50; // bounded; tests clear via DELETE between runs

const captured: unknown[] = [];

const enabled = () => process.env.TEST_WEBHOOK_CAPTURE === 'true';

export async function POST(request: Request) {
  if (!enabled()) return Response.json({ error: 'Not found' }, { status: 404 });

  const text = await request.text();
  if (text.includes(FAIL_MARKER)) {
    return Response.json({ error: 'simulated webhook failure' }, { status: 500 });
  }

  let payload: unknown = null;
  if (text.length > 0) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }
  captured.push(payload);
  if (captured.length > CAPTURE_LIMIT) captured.shift();
  return Response.json({ ok: true });
}

export function GET() {
  if (!enabled()) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ payloads: captured });
}

export function DELETE() {
  if (!enabled()) return Response.json({ error: 'Not found' }, { status: 404 });
  captured.length = 0;
  return Response.json({ ok: true });
}
