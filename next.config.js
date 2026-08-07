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
  // Disable source maps in production — saves ~40% JS transfer size
  productionBrowserSourceMaps: false,
  // Compress responses (gzip/brotli) — Cloudflare handles this but
  // Next.js built-in compression catches dev/preview deploys.
  compress: true,
  // Tree-shake unused code from barrel imports (stable top-level option
  // since Next 15 — the old `experimental` key is silently ignored in 16).
  optimizePackageImports: [
    'lucide-react',
    '@radix-ui/react-accordion',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-popover',
    '@radix-ui/react-progress',
    '@radix-ui/react-scroll-area',
    '@radix-ui/react-separator',
    '@radix-ui/react-tabs',
    '@radix-ui/react-toast',
    '@radix-ui/react-tooltip',
  ],
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
