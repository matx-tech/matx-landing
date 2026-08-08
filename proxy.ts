import { type NextRequest, NextResponse } from 'next/server';

// Nonce-based CSP, chosen over static hashes: Next.js emits multiple inline
// scripts per page (theme bootstrap, RSC flight payload) and any edit to them
// invalidates a hash. Trade-offs, kept deliberate:
//  - reading x-nonce in the root layout forces dynamic rendering (no ISR);
//  - responses must not be cached — a cached document would carry a stale
//    nonce and inline scripts would be blocked. Do not add CDN/ISR HTML
//    caching for routes under this proxy.
const isDev = process.env.NODE_ENV === 'development';

// Plausible analytics enable gate — set PLAUSIBLE_SCRIPT_URL (the site's
// personalized script URL from the dashboard) to turn analytics on. The npm
// tracker (@plausible-analytics/tracker) is bundled client-side and posts to
// /api/event, which this proxy forwards to Plausible first-party. The events
// API uses User-Agent for unique-visitor counting and X-Forwarded-For for the
// client IP — without the real visitor IP Plausible's bot filter silently
// drops every event (docs: events-api.md). Next 16 seeds the header from the
// socket when nothing upstream set it (base-server.js), so this works bare on
// a VPS, behind nginx/Caddy/Cloudflare, or on serverless.
const analyticsEnabled = Boolean(process.env.PLAUSIBLE_SCRIPT_URL);

const PLAUSIBLE_API_URL = 'https://plausible.io/api/event';

async function proxyPlausibleEvent(request: NextRequest): Promise<NextResponse> {
  // Forward only what Plausible needs: User-Agent, Content-Type and the
  // client IP. Never forward the request headers wholesale — cookies and
  // other site headers must not leak to Plausible.
  const headers = new Headers();
  const userAgent = request.headers.get('user-agent');
  if (userAgent) headers.set('user-agent', userAgent);
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  // Trust CF-Connecting-IP when behind Cloudflare (set by the CDN, not
  // spoofable by the client). Otherwise take the first hop of the chain —
  // Next 16 seeds it from the socket when nothing upstream set it, so the
  // first entry is the real visitor either way.
  const clientIp =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (clientIp) headers.set('x-forwarded-for', clientIp);

  try {
    const upstream = await fetch(PLAUSIBLE_API_URL, {
      method: request.method,
      headers,
      body: request.method === 'POST' ? await request.arrayBuffer() : undefined,
      signal: AbortSignal.timeout(10_000),
    });
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (error) {
    console.error(`[plausible] proxy to ${PLAUSIBLE_API_URL} failed`, error);
    return new NextResponse(null, { status: 502 });
  }
}

export async function proxy(request: NextRequest) {
  if (analyticsEnabled && request.nextUrl.pathname === '/api/event') {
    return proxyPlausibleEvent(request);
  }

  const nonce = btoa(crypto.randomUUID());

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    // No client fetch/WebSocket/EventSource/sendBeacon destinations today —
    // 'self' suffices; dev keeps ws: for HMR.
    `connect-src 'self'${isDev ? ' ws:' : ''}`,
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
    // Analytics beacon — intercepted by the proxy, excluded from the CSP
    // matcher above (no nonce/CSP headers needed on proxied responses).
    { source: '/api/event' },
  ],
};
