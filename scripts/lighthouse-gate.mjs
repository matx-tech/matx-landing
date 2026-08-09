#!/usr/bin/env node
/**
 * Lighthouse score gate (TC-003). Runs one audit and exits non-zero when any
 * category score is below its threshold, so `pnpm audit:mobile` /
 * `pnpm audit:desktop` can gate CI instead of just writing a report.
 *
 * Usage:
 *   node scripts/lighthouse-gate.mjs [--mobile|--desktop]
 *       [--perf=90] [--a11y=95] [--bp=90] [--seo=95]
 *
 * Env overrides: BASE_URL (audit target, default http://localhost:3000),
 * LH_PERF / LH_A11Y / LH_BP / LH_SEO.
 *
 * Reports are written to .audits/<mode>-<timestamp>.report.{html,json}.
 *
 * The Lighthouse CLI is spawned rather than using the programmatic API:
 * the programmatic `lighthouse()` connects to a Chrome DevTools port instead
 * of launching a browser, and spawning the CLI keeps Chrome discovery,
 * sandbox flags and reporting in the tool's supported path.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const mode = args.includes('--desktop') ? 'desktop' : 'mobile';

const flag = (name, fallback) => {
  const cli = args.find((arg) => arg.startsWith(`--${name}=`))?.split('=')[1];
  const env = process.env[`LH_${name.toUpperCase()}`];
  const value = Number(cli ?? env ?? fallback);
  if (Number.isNaN(value)) {
    console.error(`[lighthouse-gate] invalid --${name}=${cli ?? env}`);
    process.exit(1);
  }
  return value;
};

const THRESHOLDS = {
  performance: flag('perf', 90),
  accessibility: flag('a11y', 95),
  'best-practices': flag('bp', 90),
  seo: flag('seo', 95),
};

const url = process.env.BASE_URL ?? 'http://localhost:3000';
mkdirSync('.audits', { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportBase = path.join('.audits', `${mode}-${stamp}`);

// Match the previous audit scripts: mobile = simulate + the explicit throttling
// values (no --preset=perf — that restricts the run to one category), desktop =
// the shipped desktop preset (scores all categories).
const modeFlags =
  mode === 'desktop'
    ? ['--preset=desktop']
    : [
        '--throttling-method=simulate',
        '--throttling.rttMs=150',
        '--throttling.throughputKbps=1638.4',
        '--throttling.uploadThroughputKbps=750',
        '--throttling.cpuSlowdownMultiplier=4',
      ];

const cliArgs = [
  url,
  ...modeFlags,
  '--output=html,json',
  `--output-path=${reportBase}`,
  // Containers/VMs often lack user namespaces — Chrome refuses to start
  // without this there. Audit-only risk: the browser renders a public page.
  '--chrome-flags=--no-sandbox',
  '--no-enable-error-reporting',
  '--quiet',
];

const { status, stderr } = spawnSync(
  path.join(process.cwd(), 'node_modules/.bin/lighthouse'),
  cliArgs,
  { stdio: ['ignore', 'inherit', 'pipe'], encoding: 'utf8' },
);
if (status !== 0) {
  if (stderr) process.stderr.write(stderr);
  console.error(`[lighthouse-gate] audit of ${url} failed (server up?)`);
  process.exit(1);
}

const lhr = JSON.parse(readFileSync(`${reportBase}.report.json`, 'utf8'));
const scores = Object.fromEntries(
  Object.keys(THRESHOLDS).map((category) => [
    category,
    Math.round((lhr.categories[category]?.score ?? 0) * 100),
  ]),
);

console.log(`[lighthouse-gate] ${mode} @ ${url}`);
for (const [category, threshold] of Object.entries(THRESHOLDS)) {
  const mark = scores[category] >= threshold ? 'ok ' : 'FAIL';
  console.log(`  ${mark} ${category}: ${scores[category]}/100 (threshold ${threshold})`);
}

const failures = Object.entries(THRESHOLDS).filter(
  ([category, threshold]) => scores[category] < threshold,
);
if (failures.length > 0) {
  console.error(
    `[lighthouse-gate] FAIL: ${failures
      .map(([category, threshold]) => `${category} ${scores[category]} < ${threshold}`)
      .join(', ')} — full reports in .audits/`,
  );
  process.exit(1);
}
console.log('[lighthouse-gate] PASS');
