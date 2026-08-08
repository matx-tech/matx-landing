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
