# matx-landing

Landing site for **MATx** — Estonian adaptive math practice for põhikool (`matx.ee`). Production code for the public surface: marketing landing, technical overview (`/tehniline`), legal pages, registration intake, and the machine-readable files (`llms.txt`, `sitemap.xml`, `robots.txt`).

## Product

MATx binds student practice, understandable feedback, and the teacher's action recommendation into one trackable workflow: every answer helps find the next step. The product is in **pilot phase** with selected schools.

The site is deliberately honest-by-construction:

- every capability carries a status (**Saadaval / Piloodis / Kavandatud**) and a source;
- a published **prohibited-phrases list** forbids fabricated statistics, guarantees, and compliance overclaims;
- fixture/demo data is always labeled `Näidisandmed` and never presented as real results.

See [`PRODUCT.md`](./PRODUCT.md) for the full product spec and [`docs/hanked-teadmusbaas-2026-08.md`](./docs/hanked-teadmusbaas-2026-08.md) for the procurement evidence base.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Motion | GSAP + Lenis (smooth scroll) |
| UI | Radix UI primitives, lucide-react |
| Package manager | pnpm (see `packageManager` in `package.json`) |
| Runtime | Node.js ≥ 24 |

Request interception lives in [`proxy.ts`](./proxy.ts) — the Next 16 replacement for `middleware.ts`. It applies a per-request nonce-based CSP and proxies Plausible analytics first-party.

## Getting started

Prerequisites: Node.js ≥ 24 and corepack (bundled with Node).

```sh
corepack enable          # activates pnpm from package.json (frozen via devEngines)
pnpm install --frozen-lockfile
pnpm dev                 # http://localhost:3000
```

Tool versioning is centralized: `package.json` declares `engines`, `packageManager`, and `devEngines`, and both CI and the devcontainer read from it. `.mise.toml` pins the same pnpm for local `mise` users (Node falls through to `.nvmrc`).

## Scripts

| Command | What |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Next dev / build / start |
| `ANALYZE=true pnpm build` | Production build with bundle analyzer |
| `pnpm lint` | oxlint (the lint gate) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Unit tests (Node's built-in runner, `tests/unit`) |
| `pnpm test:e2e` | Playwright E2E (desktop + mobile Chromium) |
| `pnpm audit:mobile` / `pnpm audit:desktop` | Lighthouse gate against a running server |
| `pnpm exec biome check --write <files>` | Format + safe fixes (biome) |

### Toolchain

- **oxlint** is the lint gate (`pnpm lint`); `pnpm exec oxlint --type-aware --type-check` adds a TS-compiler-backed pass (tsgolint).
- **biome** is the formatter (`biome.json`), and biome's linter runs in the pre-commit hook — a biome lint error fails the commit even when `pnpm lint` passes.
- **lefthook** wires the pre-commit hooks (see [`lefthook.yml`](./lefthook.yml)).
- eslint is intentionally not used; do not re-add it.

New dependencies with build scripts must be approved in `pnpm-workspace.yaml` → `allowBuilds`, otherwise every pnpm command fails with `ERR_PNPM_IGNORED_BUILDS`.

## Environment variables

All documented in [`.env.example`](./.env.example):

| Variable | Purpose |
| --- | --- |
| `PLAUSIBLE_SCRIPT_URL` | Enables first-party Plausible analytics (unset = analytics off) |
| `PLAUSIBLE_TRUST_PROXY` | Set `true` **only** behind a trusted reverse proxy (client-IP headers) |
| `SLACK_WEBHOOK_URL` | Slack incoming webhook for pilot registration notifications |
| `TEST_WEBHOOK_CAPTURE` | Test-only: routes registration deliveries to local memory (never set in prod) |
| `BASE_URL` | Playwright: point E2E at a deployed preview instead of a local server |

Analytics details and the client-IP trust model are in [`docs/analytics.md`](./docs/analytics.md).

## Project structure

```
app/
  page.tsx                      # landing page
  tehniline/page.tsx            # technical overview (status vocabulary, compliance)
  [legal]/page.tsx              # static legal docs (privaatsus, tingimused, gdpr)
  api/health/route.ts           # health endpoint (webhook config status, uptime)
  api/registration/route.ts     # pilot registration intake → Slack
  api/test-webhook/route.ts     # test-only webhook capture (gated by env var)
  llms.txt / sitemap.ts / robots.ts
  proxy.ts                      # nonce CSP + first-party Plausible proxy
components/
  sections/                     # landing sections (SectionGate-deferred below the fold)
  ui/                           # registration form, navigation, theme toggle, …
  providers/                    # analytics, lenis (smooth scroll), registration
lib/
  content/landing-copy.ts       # single source of truth for all copy + constraints
  content/landing-evidence.ts   # synthetic demo fixtures (Näidisandmed)
  content/legal-content.tsx     # legal document body content
  hooks/                        # use-prefers-reduced-motion, …
scripts/lighthouse-gate.mjs     # Lighthouse score gate
tests/
  unit/                         # Node test runner (strip-types)
  e2e/                          # Playwright specs
```

## Testing

Unit tests run on Node's built-in test runner:

```sh
pnpm test
```

E2E uses Playwright (Chromium, desktop + mobile viewports). The config boots `next dev` on port **3200** and wires `SLACK_WEBHOOK_URL` to the local test capture so registration tests are deterministic:

```sh
pnpm test:e2e                       # local (spins up the dev server)
BASE_URL=https://preview.example.com pnpm test:e2e   # against a deployed preview
pnpm exec playwright show-report    # HTML report from the last run
```

See [`tests/README.md`](./tests/README.md) for the architecture, fixtures, and best practices.

### Lighthouse gates

```sh
pnpm dev &                          # start the app first
pnpm audit:mobile                   # mobile preset, threshold-based gate
pnpm audit:desktop                  # desktop preset
```

Reports land in `.audits/`. Thresholds can be overridden per-run (`--perf=90`, `LH_PERF` env, …) — see the script header.

## CI / CD

`.github/workflows/ci.yml` runs on push to `main` and on PRs:

- **quality** — lint, typecheck, build
- **e2e** — unit tests + Playwright, sharded across 4 workers; JUnit + HTML artifacts uploaded
- **burn-in** — runs the `@p0` suite 5× to catch flaky tests before they merge
- **report** — aggregates the shard JUnit results into the job summary
- **dependency-review** — supply-chain check on every PR

All jobs use `--frozen-lockfile`, least-privilege permissions, `persist-credentials: false`, and pinned action refs.

Deployment is **Netlify** via the Next.js plugin ([`netlify.toml`](./netlify.toml)).

## Architecture notes

### Security

- **Nonce-based CSP** applied in `proxy.ts` with a fresh nonce per request. Because the document carries a request-scoped nonce, responses must not be cached — do not add CDN/ISR HTML caching for routes under the proxy.
- **Security headers** (HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) set in `next.config.js`.
- **Registration intake** (`/api/registration`): validated and normalized server-side, rate-limited (bounded, in-memory), idempotent delivery (SHA-256 dedupe key), mrkdwn-escaped before reaching Slack, and capped field lengths. Consent is required.

### Analytics

Plausible is served **first-party** via `proxy.ts`. Only User-Agent, Content-Type, and (behind a trusted proxy) the client IP are forwarded — cookies never leak upstream. Events are dropped if no client IP is forwarded and `PLAUSIBLE_TRUST_PROXY` is unset; see [`docs/analytics.md`](./docs/analytics.md).

### Content contract

All copy lives in [`lib/content/landing-copy.ts`](./lib/content/landing-copy.ts) — the single source of truth. The status vocabulary and `PROHIBITED_PHRASES` are enforced by unit and E2E tests, so a marketing overclaim can't be merged.

## Docs

- [`PRODUCT.md`](./PRODUCT.md) — product spec, positioning, brand commitments
- [`DESIGN.md`](./DESIGN.md) — design system (colors, type, components, rules)
- [`AGENTS.md`](./AGENTS.md) — agent/contributor guide (toolchain, landmines)
- [`docs/analytics.md`](./docs/analytics.md) — analytics setup and privacy model
- [`docs/hanked-teadmusbaas-2026-08.md`](./docs/hanked-teadmusbaas-2026-08.md) — procurement evidence base
- [`tests/README.md`](./tests/README.md) — E2E architecture and best practices
