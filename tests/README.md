# E2E Tests — MATx Landing Page

Playwright end-to-end tests for the landing page, covering the flows that
matter for a marketing site: hero render, navigation (desktop + mobile menu),
FAQ accordion, and the registration dialog.

## Setup

```bash
pnpm install
pnpm exec playwright install chromium   # one-time browser download
```

## Running

```bash
pnpm test:e2e            # all projects (desktop + mobile viewport)
pnpm test:e2e -- --headed
pnpm test:e2e -- --debug
pnpm exec playwright show-report        # HTML report from last run
```

The Playwright config auto-starts `next dev` on port **3200** (kept off
3000/3100 so it never collides with other dev servers). Set `BASE_URL` to
point at a deployed preview instead:

```bash
BASE_URL=https://preview.example.com pnpm test:e2e
```

## Architecture

```
tests/
  e2e/                       # spec files — one file per user-facing area
  support/
    fixtures/index.ts        # shared fixtures (openHome: reduced-motion + hydration wait)
    helpers/reveal.ts        # revealSection(): opens SectionGate-deferred sections
```

### Fixtures

- `openHome` — navigates to `/` with **reduced motion emulated** so GSAP
  entrance tweens don't race assertions, and waits for the nav island to
  hydrate. Use it instead of raw `page.goto` in every spec.

### Helpers

- `revealSection(page, id, signal)` — below-fold sections are deferred by
  `SectionGate` (they render only when a scroll brings them within 600px of
  the viewport). This scrolls to the anchor and waits for the real section
  content. Always pass the section's anchor id (`#kkk`, `#piloot`, …) from
  `lib/content/landing-copy.ts` → `SECTION_IDS`.

## Best practices

- **Role-based selectors** (`getByRole`) over CSS — the page is Estonian and
  Radix-based; roles + accessible names are the stable contract.
- **Reduced motion in smoke tests** — opt in via `openHome`. Tests that
  assert animation behaviour should *not* use it.
- **No `waitForTimeout`** — deterministic waits only (`toBeVisible`,
  `waitFor`).
- **Deferred sections** — never assert on a below-fold section without
  `revealSection`; the gate won't open otherwise and the assertion hangs
  until the 10s expect timeout.
- **Isolation** — Playwright gives each test a fresh context; don't share
  state between tests.

## CI

`.github/workflows/e2e.yml` runs the suite on push/PR: pnpm install →
`playwright install --with-deps chromium` → `pnpm test:e2e` (2 workers,
2 retries, `--forbid-only`). Report artifacts upload on failure.

## Known gaps (ponytail)

- Chromium only — add `firefox`/`webkit` projects to
  `playwright.config.ts` when cross-browser coverage is wanted.
- No visual regression tests — revisit with Playwright toMatchScreenshot
  once the design is stable (GSAP entrance states make them noisy today).
- The registration dialog's exact close-button label was verified against
  the live DOM — if Radix Dialog markup changes, re-check
  `registration.spec.ts`.
