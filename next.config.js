const withBundleAnalyzer =
  process.env.ANALYZE === 'true'
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports -- next.config.js is CJS by design
      require('@next/bundle-analyzer')({ enabled: true })
    : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Modern image formats for all browsers (Baseline 2024)
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Redact framework disclosure (SiteSecurityScore info-disclosure finding)
  poweredByHeader: false,
  async headers() {
    // Defense headers shared by every response type (documents, assets, API).
    const common = [
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        // Deny every feature the site does not use. `clipboard-write` is
        // deliberately NOT denied: the copy buttons
        // (components/ui/copy-button.tsx) call navigator.clipboard.writeText
        // and would break under clipboard-write=().
        value:
          'accelerometer=(), camera=(), clipboard-read=(), geolocation=(), gyroscope=(), hid=(), magnetometer=(), microphone=(), payment=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), sync-xhr=(), usb=(), xr-spatial-tracking=()',
      },
      { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
      { key: 'X-DNS-Prefetch-Control', value: 'off' },
      { key: 'Origin-Agent-Cluster', value: '?1' },
      // Belt-and-braces: the CSP already carries the upgrade-insecure-requests
      // directive (proxy.ts); the standalone header satisfies header scanners.
      { key: 'Upgrade-Insecure-Requests', value: '1' },
    ];
    // Cross-origin isolation — HTML documents only. These must NOT appear on
    // static assets: `CORP: same-origin` blocks cross-origin embeds (fonts,
    // images, social cards) and COEP/COOP are document policies that header
    // scanners flag on asset responses. Static assets get the overrides below.
    const documentIsolation = [
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Embedder-Policy', value: 'same-origin' },
    ];
    // Public static assets: embeddable and CORS-readable from any origin.
    const asset = [
      { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
      { key: 'Access-Control-Allow-Origin', value: '*' },
      { key: 'Vary', value: 'Origin' },
    ];
    return [
      { source: '/(.*)', headers: common },
      // Documents: browser top-level navigations send `Accept: text/html`.
      // Requests without it (e.g. a plain curl to an HTML path) are covered
      // by the Caddy edge layer, which enforces isolation on all non-asset
      // paths — see the Caddyfile `handle` fallback block.
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'accept', value: 'text/html' }],
        headers: documentIsolation,
      },
      // Static assets by path extension (incl. 4xx responses on asset paths).
      // Listed last: later rules override earlier ones for duplicate keys, so
      // this replaces CORP for asset paths. The extension-less og:image route
      // is a generated public image and gets the same treatment.
      {
        source: '/:path(.*\\.(?:jpe?g|png|gif|webp|avif|svg|ico|woff2?|ttf|otf|mp4|webm|pdf))',
        headers: asset,
      },
      { source: '/opengraph-image', headers: asset },
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
