// Health check endpoint (TC-002). Force-dynamic: a route handler GET is
// statically optimized at build time unless it touches a dynamic API, and a
// build-time-cached health endpoint would report a frozen snapshot forever.
export const dynamic = 'force-dynamic';

/**
 * Service health for monitoring. `webhook` reports *configured* status, not
 * live reachability, deliberately: Slack incoming-webhook URLs are write-only
 * POST endpoints — probing one requires posting a message, which would spam
 * the channel on every health poll. A health check must be cheap and
 * side-effect-free; config presence is the honest signal here (the
 * registration route already fails loudly with 503 when the webhook is
 * unset). Live probing belongs in a separate on-demand tool, not a polled
 * endpoint.
 */
export function GET() {
  const webhookConfigured = Boolean(process.env.SLACK_WEBHOOK_URL);
  return Response.json({
    status: webhookConfigured ? 'healthy' : 'degraded',
    services: {
      webhook: webhookConfigured ? 'up' : 'down',
    },
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
