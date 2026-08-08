const withBundleAnalyzer =
  process.env.ANALYZE === 'true'
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports -- next.config.js is CJS by design
      require('@next/bundle-analyzer')({ enabled: true })
    : (config) => config;

// Plausible analytics proxy target — the site's personalized script URL from
// the Plausible dashboard (Site Installation → snippet → the
// https://plausible.io/js/pa-XXXXX.js part). Unset = analytics fully disabled
// (no rewrites, no script tag rendered).
const plausibleScriptUrl = process.env.PLAUSIBLE_SCRIPT_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Modern image formats for all browsers (Baseline 2024)
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  // Plausible first-party proxy (docs: proxy/guides/vercel | netlify).
  // Serving the tracker and the event endpoint from our own origin bypasses
  // adblockers (docs: 5–25% of visits otherwise) and keeps the strict CSP in
  // proxy.ts untouched — script-src 'self' and connect-src 'self' still cover
  // both. Paths are the doc-recommended neutral names; the docs warn against
  // 'analytics'/'stats'/'plausible' in paths.
  async rewrites() {
    if (!plausibleScriptUrl) return [];
    return [
      { source: '/js/script.js', destination: plausibleScriptUrl },
      { source: '/api/event', destination: 'https://plausible.io/api/event' },
    ];
  },
  // Disable source maps in production — saves ~40% JS transfer size
  productionBrowserSourceMaps: false,
  // Compress responses (gzip/brotli) — Cloudflare handles this but
  // Next.js built-in compression catches dev/preview deploys.
  compress: true,
  // Tree-shake unused code from barrel imports
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog'],
  },
  compiler: {
    // removeConsole is deliberately left disabled — console.error/warn in
    // the lazy chunk paths (registration, Lenis, thumbhash) reach
    // telemetry in production. If stripping is ever wanted, the exclusion
    // form is:
    //   removeConsole:
    //     process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
