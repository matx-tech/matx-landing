# matx.ee — Recommended Cloudflare Cache Rules

*Generated: 2026-08-09 | Sources: 9 (Cloudflare docs, Next.js docs, CDN guides) + live measurements of matx.ee | Confidence: High*

## Executive summary

matx.ee is already in near-optimal caching state by Cloudflare defaults — and one deliberate
architectural constraint (nonce-based CSP in `proxy.ts`) makes the "cache everything" template
that tops the dashboard actively dangerous for this site. The correct ruleset is small:

1. **Bypass `/api/*`** (health, registration, Plausible event beacon).
2. **Cache Everything `/_next/static/*`** — 1-year immutable, ignore query string. Formalizes
   what default behavior already does; the only real change is query-string hardening.
3. **Cache Everything `/llms.txt`, `/robots.txt`, `/sitemap.xml`** — 1 h Edge TTL. The only rule
   with actual load impact: today every hit from AI crawlers and search bots reaches the VPS.

Do **not** cache HTML. The nonce-CSP proxy makes it wrong (below).

The origin reverse proxy (Caddy) already stamps the correct immutable header on
`/_next/static` and passes HTML and `/api/*` through untouched — this ruleset is
complementary to the deployment layer, not corrective of it.

## Measured current state (curl, 2026-08-09)

| Path | Origin Cache-Control | cf-cache-status | Edge cached? |
| --- | --- | --- | --- |
| `/` (HTML) | `no-store` | DYNAMIC | no — correct |
| `/tehniline`, `/legal/*` | `no-store` | DYNAMIC | no — correct |
| `/llms.txt`, `/robots.txt`, `/sitemap.xml` | `no-store` | DYNAMIC / BYPASS | no — every crawler hit → VPS |
| `/_next/static/*.js/.css` | `public, max-age=31536000, immutable` | HIT (age ≈ 7 h) | yes — correct |
| `/opengraph-image` | `no-store` | DYNAMIC | no (tiny traffic; fine) |
| `/api/health` | — | DYNAMIC | no — correct (must be live) |

Cloudflare respects origin `Cache-Control` on Free/Pro/Business (Origin Cache Control is on by
default and cannot be disabled), so the 1-year immutable headers Next.js emits for content-hashed
`/_next/static` assets already produce edge HITs with the correct TTL. The site's static-asset
caching needs **no fix** — only hardening.

On the post-migration stack (docker-compose.yml / Caddyfile candidate) the immutable header is
also stamped by the Caddy reverse proxy (`@assets` block), so the 1-year guarantee holds at the
proxy layer even if Next.js's header output ever changes. Caddy sets no Cache-Control on HTML or
`/api/*` — the origin `no-store` passes through intact.

## The hard constraint: do not cache HTML

`proxy.ts` (Next 16 request interception) generates a **per-request CSP nonce** for every HTML
page, and the module comment is explicit: *"responses must not be cached — a cached document
would carry a stale nonce and inline scripts would be blocked. Do not add CDN/ISR HTML caching
for routes under this proxy."* (proxy.ts:3-9)

Mechanically a cached page would still *run* (Cloudflare caches headers and body together, so the
nonce stays internally consistent) — but:

- **Security:** a cached nonce becomes a public, replayable constant. Any attacker who can inject
  markup into one cached response gets a working nonce for every visitor. Per-request nonces
  exist precisely to prevent this.
- **Deploy staleness:** cached HTML would survive deploys and require a purge discipline that
  content-hashed assets don't.
- The origin's `no-store` already enforces bypass; Cloudflare's default behavior (no HTML caching
  without an explicit rule) matches. Leave it alone.

Rocket Loader (see `docs/cloudflare-rocket-loader.md`) rewrites HTML per request at the edge and
is applied after cache lookup — a cache rule caching HTML would interact badly with it too.

Note: the Caddyfile comment and `docs/cloudflare-rocket-loader.md` disagree. The doc proposes
keeping RL on with an `ajax.cloudflare.com` CSP allowlist; the Caddyfile mandates RL disabled —
correct, since the loader's host is not in the CSP (the Caddyfile cites a `strict-dynamic`
policy; current `proxy.ts` is nonce + `'self'`, and either way `ajax.cloudflare.com` is not
allowlisted, so RL is blocked before it initializes). Decision: RL stays off; the doc's CSP
allowlist step is moot unless RL is deliberately re-enabled.

## Deployment-layer facts (docker-compose.yml / Caddyfile, post-migration candidate)

Verified against the candidate files (2026-08-09). Cache-relevant facts only; the compose/
Caddyfile P0/P1 fixes are in the deployment delta, not this report.

- **Assets:** Caddy stamps `public, max-age=31536000, immutable` on `/_next/static/*` — and also
  on `/images/*`, `/assets/*`, which don't exist in the app and return 404s. Trim the matcher to
  `/_next/static/*` + `/favicon.ico`.
- **HTML / API:** no Cache-Control overrides → Next's `no-store` reaches Cloudflare intact; the
  nonce-CSP constraint holds end-to-end (Caddy → CF).
- **Analytics chain:** Caddy `trusted_proxies` = Cloudflare ranges, `cf-connecting-ip` passes
  through untouched → `PLAUSIBLE_TRUST_PROXY=true` is valid and `/api/event` forwarding works.
  Rule 1's bypass keeps it uncached.
- **well-known:** `/.well-known/security.txt` + `mta-sts.txt` served directly by Caddy (reachable
  with the app down). Caveat: RFC 8461 MTA-STS discovery happens on the `mta-sts.matx.ee`
  subdomain, which has no site block — verify DNS or the policy file is dead weight.
- **Availability:** Caddy waits on `landing-page` health (120 s start_period + 5×15 s retries ≈
  3.25 min). A cold first boot (pnpm install + `next build` on a small VPS) can exceed that →
  Caddy never starts → site down. Build during deploy (deploy-migration.sh) or raise the window.

## Recommended ruleset (3 rules)

Order matters — bypass rules first. All three are free-plan compatible.

### Rule 1 — Bypass cache: API

- **When:** `starts_with(http.request.uri.path, "/api/")`
- **Cache eligibility:** Bypass cache
- **Why:** `/api/health` must report live origin state (a cached 200 hides outages), and
  `/api/registration` POSTs to Slack — never cacheable anyway. The Plausible beacon
  (`/api/event`, intercepted by `proxy.ts` and forwarded to plausible.io) must also stay uncached
  or analytics break.

### Rule 2 — Cache everything: build assets

- **When:** `starts_with(http.request.uri.path, "/_next/static/")`
- **Cache eligibility:** Eligible for cache
- **Edge TTL:** *Use cache-control header if present, cache with Cloudflare's default TTL if not*
  — the origin already sends `public, max-age=31536000, immutable`; keep the origin headers as
  the single source of truth. (Pinning "ignore cache-control, 1 year" is equivalent today; the
  header-following mode self-corrects if Next.js ever changes the TTL.)
- **Browser TTL:** Respect origin (→ 1 year immutable; filenames are content-hashed, so a long
  browser TTL is safe and correct).
- **Cache key:** Ignore query string (prevents `?v=`-style cache fragmentation; hashed names are
  already unique). Keep **Cache deception armor ON** (default).
- **Why:** currently this works via default behavior; the rule documents intent, hardens against
  query-string fragmentation, and makes the setup explicit for the next person.

### Rule 3 — Cache everything: machine-readable text routes

- **When:** `any(http.request.uri.path in {"/llms.txt", "/robots.txt", "/sitemap.xml"})`
- **Cache eligibility:** Eligible for cache
- **Edge TTL:** **Ignore cache-control header and use this TTL → 1 hour** (this is the one place
  we deliberately override the origin's `no-store`).
- **Browser TTL:** Respect origin.
- **Cache key:** Ignore query string.
- **Why:** these are build-time static (`llms.txt` is `force-static`; robots/sitemap are static
  content), yet today every request — including aggressive AI crawlers that fetch `llms.txt` and
  bots that poll `sitemap.xml` — hits the VPS. A 1 h edge TTL absorbs crawler bursts while
  bounding deploy staleness to ≤ 1 h. If a purge-on-deploy step is added later, the TTL can rise
  to 1 day.

### Advanced settings per rule (Vary / Cache Reserve / SWR / ETags / error pages)

Nothing here needs configuring — defaults are correct for all three rules. The matrix is for
the person reading the dashboard:

| Setting | Rule 1 (Bypass `/api/*`) | Rule 2 (`/_next/static/*`) | Rule 3 (txt routes) |
| --- | --- | --- | --- |
| **Vary** | n/a — bypassed | Leave default (Normalize values). Origin sends no `Vary` on assets. | Leave default (Normalize values). Next emits `Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch` on these routes; normalizing collapses them into one cache bucket — no real client sends those headers on a plain GET. |
| **Cache Reserve** | n/a | Off | Off — paid add-on; the files are KBs. |
| **Serve stale while revalidating** | n/a | Off — 1-year immutable, nothing to revalidate. | Off — 1 origin request/hour/file is nothing. Flip on only if origin blips start mattering (one checkbox). |
| **Respect strong ETags** | n/a | Leave default (on). Assets carry weak ETags (`W/"…"`); CF keeps them, 304-revalidates after TTL expiry. | Leave default — no ETag on these routes. |
| **Origin error page pass-through** | n/a | Leave default (off). | Leave default (off) — error pages aren't cached anyway. |

## What NOT to enable (and why)

| Setting / template | Verdict | Reason |
| --- | --- | --- |
| "Cache everything" template (site-wide or HTML) | **Never** | Overrides `no-store` → cached HTML with a shared nonce breaks the CSP security model (and per proxy.ts, breaks inline scripts). This is the one rule that would actually break the site. |
| Edge TTL override on HTML/ISR | Never | No ISR on this site; HTML is dynamic by design. Overriding just creates stale pages. |
| Cache Reserve | Off | Paid add-on; content is small and low-traffic — zero benefit. |
| Device type / Country / Language in cache key | Off | No per-device/geo content; fragments the cache for nothing. |
| Cookie / User / extra headers in cache key | Off | No personalization exists. |
| Serve stale content while revalidating | Off | Immutable assets don't need it; it only makes future HTML caching mistakes worse. |
| Browser TTL override | Off | "Respect origin" already yields 1 year for hashed assets, no-store elsewhere. |
| Vary configuration | Leave default | No `Vary` on `/_next/static`; the text routes carry Next's RSC `Vary` — Normalize (default) collapses it into one bucket. No per-header config needed. |

## Deploy-day behavior

- `/_next/static/*`: content-hashed filenames → new deploys are automatically cache-correct; **no
  purge needed**.
- HTML: never cached → changes are live immediately.
- llms.txt/robots/sitemap: ≤ 1 h staleness, self-healing. Optional: purge those three URLs after
  content deploys.

## Verification (after applying)

```sh
# static asset → HIT with long age; cache-control intact
curl -sI https://matx.ee/_next/static/chunks/$(curl -s https://matx.ee/ | grep -oE '/_next/static/[^"]+\.js' | head -1 | sed 's|.*/||')
# expect: cache-control: public, max-age=31536000, immutable + cf-cache-status: HIT

# llms.txt → now HIT (was DYNAMIC), age < 3600
curl -sI https://matx.ee/llms.txt | grep -iE 'cf-cache-status|age|cache-control'

# HTML still uncached
curl -sI https://matx.ee/ | grep -iE 'cf-cache-status|cache-control'   # expect DYNAMIC + no-store

# API still uncached
curl -sI https://matx.ee/api/health | grep -iE 'cf-cache-status'       # expect DYNAMIC
```

## Methodology

Measured live headers for all route types (HTML, static assets, llms.txt, robots, sitemap,
opengraph-image, health, www host) with curl; read `proxy.ts`, `next.config.js`, the
`cf-cache-rules.md` dashboard dump, and the post-migration docker-compose.yml / Caddyfile
candidates; researched current Cloudflare Cache Rules behavior and Next.js CDN guidance.
Sub-questions: (1) Cloudflare default cache behavior vs origin headers,
(2) recommended Edge/Browser TTL for `/_next/static`, (3) whether/how to cache sitemap/robots/
llms.txt, (4) cache-key best practices, (5) what must never be cached (API, HTML w/ nonce CSP,
analytics beacon).

**Gaps:** no origin-side request logs, so the crawler-load claim on llms.txt/sitemap is reasoned
inference, not measured traffic. "AI crawlers hammer llms.txt" is the standard behavior for
sites that publish it, but if origin load was never a problem, Rule 3 can be skipped entirely —
the site would still be correct, just with every bot request reaching the VPS. Also unverified
against the live VPS: MTA-STS subdomain routing, and the actual certificate state (the
checked-in `cert.pem` is expired and for a dev domain — the VPS copy may differ).

## Sources

1. Cloudflare Docs — Default Cache Behavior (origin Cache-Control respected; no-store/private/no-cache not cached) — developers.cloudflare.com/cache/concepts/default-cache-behavior/
2. Cloudflare Docs — Origin Cache Control (on by default for Free/Pro/Business) — developers.cloudflare.com/cache/concepts/cache-control/
3. Cloudflare Docs — Cache Rules settings (Edge TTL modes, Browser TTL, Cache Key, Cache deception armor, Vary, Cache Reserve, SWR) — developers.cloudflare.com/cache/how-to/cache-rules/settings/
4. Cloudflare Docs — Cache by status code / Edge TTL defaults — developers.cloudflare.com/cache/how-to/configure-cache-status-code/
5. Next.js Docs — CDN Caching guide (static assets `public, max-age=31536000, immutable`) — nextjs.org/docs/app/guides/cdn-caching
6. DebugBear — How to Cache Your Website on Cloudflare (best practices, respect-existing-headers) — debugbear.com/docs/cloudflare-caching
7. blazingcdn — Cloudflare × Next.js edge caching playbook (never override Edge TTL on ISR; Cache Everything for /_next/static) — blog.blazingcdn.com/en-us/cloudflare-vercel-workflow-deploying-nextjs-edge-caching
8. FocusReactive — Configure CDN caching for self-hosted Next.js (per-route Cache-Control strategies) — focusreactive.com/configure-cdn-caching-for-self-hosted-next-js-websites/
9. webkernelai — Cloudflare Cache Rules Guide (SEO/crawl-budget angle; ignore query string for tracking params) — webkernelai.com/guides/cloudflare-cache-rules
