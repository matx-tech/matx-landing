---
title: Stack, framework, language and hosting — technical research
created: 2026-09-04
type: technical-research
status: final
decision: keep Next.js 16 + TypeScript on the existing VPS (Caddy) behind Cloudflare; no migration
---

# Technical research: stack, framework, language, hosting

The brief asked for this research as if the target were greenfield. It is not,
and the honest answer matters more than the thorough one: **the correct move is
to keep the current stack and the current hosting, and to spend the saved days on
the näidistund itself.** What follows is the evidence for that, including the one
finding that would have made a Cloudflare migration actively break the site.

## 1. What is actually deployed today

Measured from the repo, not assumed:

| Layer | Reality | Evidence |
| --- | --- | --- |
| Framework | Next.js 16.3, App Router | `package.json` |
| Language | TypeScript 7, React 19.2 | `package.json`, `tsconfig.json` |
| Runtime | Node 24 (`engines`, `devEngines`, `.nvmrc`) | `package.json` |
| Package manager | pnpm 11.21 (corepack) | `packageManager` |
| Styling | Tailwind 4 via `@tailwindcss/postcss` + CSS modules | `postcss.config.js` |
| Lint / format | oxlint (+ tsgolint type-aware), biome as formatter — **no eslint** | `CLAUDE.md`, `biome.json` |
| Tests | `node:test` with `--experimental-strip-types`; Playwright e2e, 4 shards | `package.json`, `playwright.config.ts` |
| Perf gate | Lighthouse via `scripts/lighthouse-gate.mjs` | `package.json` |
| Hosting | **Own VPS**, Caddy reverse proxy, behind Cloudflare | `docs/cf-cache-rules-recommendation.md` ("every crawler hit → VPS", "the origin reverse proxy (Caddy) already stamps…"), `.github/workflows/ci.yml` (`verify-live-headers`: "deploy follows from the VPS") |
| CDN | Cloudflare zone; static assets cached, HTML deliberately **not** | same doc |
| CI | GitHub Actions: quality → e2e (4 shards) → burn-in → post-deploy header verification | `.github/workflows/ci.yml` |
| Analytics | Self-proxied cookieless Plausible via `/api/event` | `proxy.ts`, `docs/analytics.md` |

`netlify.toml` exists in the repo root and is **vestigial** — two lines pointing
at `@netlify/plugin-nextjs`. Nothing in CI or the docs deploys to Netlify. It
should be deleted so the next reader does not believe it.

## 2. The constraint that decides hosting

`proxy.ts` implements a **nonce-based CSP**. Its own header comment states the
consequences, and they are load-bearing:

> reading `x-nonce` in the root layout forces dynamic rendering (no ISR);
> responses must not be cached — a cached document would carry a stale nonce and
> inline scripts would be blocked.

So the site is: dynamic HTML, uncacheable at the edge, Node runtime middleware,
plus a first-party analytics proxy route. That combination is what any hosting
candidate has to serve.

## 3. Hosting options, assessed

### 3.1 Cloudflare Pages / Workers (the option the brief named)

Two adapters exist and both were checked against Next.js 16:

- **OpenNext Cloudflare adapter** — *does not build this app today.*
  Next.js 16 renamed `middleware.ts` to `proxy.ts`, and `proxy.ts` is forced onto
  the Node.js runtime; `export const config = { runtime: 'edge' }` is rejected by
  the compiler with "Proxy does not support Edge runtime". The adapter still
  requires edge middleware and fails the build with "Node.js middleware is not
  currently supported."
  ([opennextjs-cloudflare#1213](https://github.com/opennextjs/opennextjs-cloudflare/issues/1213),
  [workers-sdk#13755](https://github.com/cloudflare/workers-sdk/issues/13755),
  [workers-sdk#13937](https://github.com/cloudflare/workers-sdk/issues/13937)).
  Node-middleware support is in flight
  ([#617](https://github.com/opennextjs/opennextjs-cloudflare/issues/617),
  PR [#1320](https://github.com/opennextjs/opennextjs-cloudflare/issues/1309)),
  not shipped. The workaround people are using in the wild is to rename `proxy.ts`
  back to a deprecated `middleware.ts` on the edge runtime — which for this site
  would mean rewriting the CSP/analytics proxy against a deprecated API.
- **vinext** — Cloudflare's current recommended path (a Vite plugin
  reimplementing the Next.js API surface), and it *does* list `proxy.ts` as
  supported. It is **beta**, with a compatibility dashboard you are told to check
  before adopting for production
  ([Cloudflare Next.js framework guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)).
  Swapping the toolchain of a working production site onto a beta Vite
  reimplementation, to save a VPS that already works, is a bad trade.

Verdict: **not now.** Revisit when OpenNext ships Node middleware support and it
has been stable for a release or two. Cloudflare stays where it already earns its
keep — DNS, TLS, WAF, and static-asset caching in front of the VPS.

### 3.2 Netlify

`@netlify/plugin-nextjs` v5 supports App Router and middleware; support for the
Next.js 16 `proxy.ts` convention specifically was **not verified** in this
research and should not be assumed. Even if it works, Netlify buys nothing this
site lacks (Cloudflare already fronts it) and costs the `/api/event` first-party
analytics path a hop plus a per-request pricing model. Delete `netlify.toml`.

### 3.3 Vercel

Native support, zero friction, and the highest cost per unit of nothing-gained.
The site is a marketing page with a static demo; there is no ISR to orchestrate
and no serverless fan-out. Also a data-residency conversation the project does
not need to have — this is an Estonian school product with a DPA and a DPIA in
the sibling repo.

### 3.4 Static export (`output: 'export'`) to any CDN

Tempting for a landing page, and impossible here without removing the nonce CSP,
the `/api/event` analytics proxy, and the `/api/health` route. The näidistund
itself would be fine — it is pure client state, no network. The rest of the site
is not. Filed under Deferred in the architecture spine.

### 3.5 Current VPS + Caddy behind Cloudflare — the recommendation

It serves the exact shape the app needs (Node runtime, dynamic HTML, no edge
caching of documents), it is already measured and tuned
(`docs/cf-cache-rules-recommendation.md` shows correct `cf-cache-status` on every
path), CI already asserts the live header policy after each deploy, and it costs
one VPS. The näidistund adds **zero** server-side load: no API, no storage, no
cookies. The section is lazy-loaded, so it does not even enter the initial
bundle.

**Decision: no migration. Delete `netlify.toml`. Revisit Cloudflare Workers when
OpenNext supports Node middleware.**

## 4. Framework and language — anything better for this workload?

The näidistund is a deterministic state machine over a ~44-node script graph plus
a chat-shaped renderer. That is a few hundred lines of any framework. The
question is therefore not "what is best for a branching dialogue widget" but
"what is best for the site that hosts it", and that site exists, passes its
gates, and has a design system, a copy contract with prohibited-phrase tests, a
lazy-section mechanism, an analytics wrapper, and legal pages already built.

- **React 19 / Next.js 16** — keep. The demo is one lazy client component.
- **TypeScript** — keep, with the existing project constraint: anything imported
  by `tests/unit` must be **erasable** TS (no `enum`, no `namespace`, no
  parameter properties, no JSX), because the unit runner is
  `node --experimental-strip-types`. This directly shapes `demo-script.ts`.
- **No new runtime dependency is needed.** Specifically:
  - *KaTeX / MathJax* — not needed. Linear equations are plain text; the existing
    `InlineFractionalExpression` covers `x/3`; the error mark is a `<span>`.
    Revisit only if the script grows fraction equations.
  - *MathLive* — the product's keyboard uses it. The landing keyboard is
    **non-interactive chrome** (see the feedback analysis), so it renders as
    plain buttons with Unicode labels and ships **no** MathLive. This is the
    single biggest bundle decision in the whole conversion: MathLive is ~300 KB+
    and would blow the Lighthouse mobile gate for a widget nobody can type into.
  - *State libraries* — no. `useState` over a `history: Step[]` array, everything
    else derived by replay. Undo is free.
  - *GSAP / Lenis* — already present for the page; the demo uses CSS only.
- **Fonts** — one addition: Newsreader italic (400) for the tutor voice, loaded
  inside the lazy section chunk via `next/font`, so the initial page load is
  unchanged. Estonian õ ä ö ü are in the `latin` subset; add `latin-ext` only if
  the script contains š or ž (the unit test can assert this).

## 5. Risks this research surfaces

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Someone "fixes" the deploy by trusting `netlify.toml` | broken/duplicate deploy | delete the file in this conversion (story 5.4) |
| A future Cloudflare Workers migration silently drops the nonce CSP | XSS surface regression | recorded as AD-6 in the architecture spine; the CI header check would catch it |
| MathLive leaks into the landing bundle via a copy-paste of the product component | Lighthouse mobile gate fails | landing keyboard is its own component with its own key data; no import from `matxteacher` |
| Newsreader font leaks into the shared chunk | initial-load regression | font declared inside the lazy section module; bundle check in the quality gate |
| `latin-ext` needed after all (š/ž in the script) | missing glyphs | unit test asserts the script's character set |
