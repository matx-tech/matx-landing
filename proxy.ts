import { type NextRequest, NextResponse } from 'next/server';

// Nonce-based CSP, chosen over static hashes: Next.js emits multiple inline
// scripts per page (theme bootstrap, RSC flight payload) and any edit to them
// invalidates a hash. Trade-offs, kept deliberate:
//  - reading x-nonce in the root layout forces dynamic rendering (no ISR);
//  - responses must not be cached — a cached document would carry a stale
//    nonce and inline scripts would be blocked. Do not add CDN/ISR HTML
//    caching for routes under this proxy.
const isDev = process.env.NODE_ENV === 'development';

// Plausible analytics — first-party proxy (docs: proxy/introduction,
// events-api). The tracker script and event endpoint are served from our own
// origin, which bypasses adblockers and keeps the strict CSP above valid
// (script-src/connect-src 'self' still cover both paths). On a self-hosted
// VPS nobody adds X-Forwarded-For for us (unlike Netlify/Vercel edges), and
// without the real visitor IP Plausible's bot filter silently drops every
// event — so the header is set explicitly here, per the docs.
// Unset = analytics fully disabled (no interception, paths 404).
const plausibleScriptUrl = process.env.PLAUSIBLE_SCRIPT_URL;

async function proxyPlausible(
  request: NextRequest,
  pathname: string,
  scriptUrl: string,
): Promise<NextResponse> {
  const destination = pathname === '/js/script.js' ? scriptUrl : 'https://plausible.io/api/event';

  // Forward only what Plausible needs: User-Agent (drives unique-visitor
  // counting + device reports), Content-Type and the client IP. Never forward
  // the full header set — cookies/authorization on our origin must not leak
  // to plausible.io.
  const headers = new Headers();
  const userAgent = request.headers.get('user-agent');
  if (userAgent) headers.set('user-agent', userAgent);
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  // First valid IP from a comma chain is used by Plausible; passing the chain
  // through unchanged is correct whether we're bare, behind nginx or behind a
  // CDN. On self-hosted Node the header is guaranteed present — Next seeds it
  // from the socket address when nothing upstream set it (base-server.js).
  const clientIp = request.headers.get('x-forwarded-for');
  if (clientIp) headers.set('x-forwarded-for', clientIp);

  try {
    const upstream = await fetch(destination, {
      method: request.method,
      headers,
      // Event payloads are small JSON; buffering keeps the edge-runtime
      // fetch simple (no stream duplex dance).
      body: request.method === 'POST' ? await request.arrayBuffer() : undefined,
      signal: AbortSignal.timeout(10_000),
    });
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: {
        'content-type':
          upstream.headers.get('content-type') ??
          (pathname === '/js/script.js'
            ? 'application/javascript; charset=utf-8'
            : 'application/json'),
      },
    });
  } catch (error) {
    console.error(`[plausible] proxy to ${destination} failed`, error);
    return new NextResponse(null, { status: 502 });
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (plausibleScriptUrl && (pathname === '/js/script.js' || pathname === '/api/event')) {
    return proxyPlausible(request, pathname, plausibleScriptUrl);
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
    // The Plausible event endpoint sits under /api — explicitly re-included
    // here so the proxy above can intercept it (the first matcher excludes
    // the api namespace so API responses never get nonce/CSP headers).
    '/api/event',
  ],
};
