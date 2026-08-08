import { NextRequest, NextResponse } from 'next/server';

// Nonce-based CSP, chosen over static hashes: Next.js emits multiple inline
// scripts per page (theme bootstrap, RSC flight payload) and any edit to them
// invalidates a hash. Trade-offs, kept deliberate:
//  - reading x-nonce in the root layout forces dynamic rendering (no ISR);
//  - responses must not be cached — a cached document would carry a stale
//    nonce and inline scripts would be blocked. Do not add CDN/ISR HTML
//    caching for routes under this proxy.
const isDev = process.env.NODE_ENV === 'development';

export function proxy(request: NextRequest) {
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
  ],
};
