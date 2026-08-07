import { defineConfig, devices } from '@playwright/test';

/**
 * MATx landing page — Playwright E2E config.
 *
 * - Base URL from BASE_URL env, falls back to the local webServer (port 3200 —
 *   kept off 3000/3100 to avoid clashing with other dev servers on the machine).
 * - Two projects: desktop Chromium + mobile viewport emulation (the repo's
 *   mobile-performance work is the main regression surface).
 * - Reduced-motion is NOT forced globally: individual tests opt in via the
 *   `openHome` fixture so animation behaviour can still be asserted where it
 *   matters. Most smoke tests use it to keep GSAP entrance tweens out of the
 *   way.
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3200',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure-and-retries',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    command: 'pnpm dev --port 3200',
    port: 3200,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
