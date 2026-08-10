# matx.ee — Application-Layer Security Audit Plan

Method: `addyosmani/agent-skills` → `security-and-hardening` skill (threat-model-first process, OWASP Top 10 + dependency/SSRF/error-handling checklists).
Scope: repo code, CI, supply chain, runtime trust boundaries. **Infra/edge/DNS findings live in `docs/security-hardening-plan.md`** (SiteSecurityScore-driven) — this plan covers the app layer and cross-references it; the consolidated backlog (§9) merges both.

---

## 1. Threat model (skill process: trust boundaries → assets → STRIDE → abuse cases)

### Trust boundaries (untrusted data crossing into the system)
| Boundary | Surface | Data |
|---|---|---|
| `POST /api/registration` | public form → Slack webhook (external) | schoolName, contactName, role, email, phone, classGroups, consent |
| `POST /api/event` | Plausible beacon → plausible.io (external) | UA, content-type, client IP, event body |
| `GET /api/health`, `/api/test-webhook`, `/llms.txt` | public read | uptime, webhook-configured flag; test route is env-gated |
| All HTML routes | visitor browser | static marketing copy; theme via localStorage (no auth tokens) |
| Env (VPS) | operator | `SLACK_WEBHOOK_URL`, `PLAUSIBLE_SCRIPT_URL` |
| CI / GitHub | third-party actions + Dependabot | repo code, workflow tokens |

### Assets
Slack webhook (spam → channel noise), visitor IPs (analytics integrity), registration PII (school/contact names, emails, phones — passed to Slack, never stored server-side), VPS access.

### STRIDE per boundary
| Threat | Status |
|---|---|
| Spoofing | No auth/sessions in app (public form). Forwarded-IP headers trusted only behind trusted proxy (`PLAUSIBLE_TRUST_PROXY`), else shared fallback bucket — attacker cannot rotate buckets. ✓ |
| Tampering | Input validated (types, required fields, email, consent); Slack mrkdwn escaped (`& < >`, `\|` in mailto); field length capped ≤2,000 pre-composition. ✓ |
| Repudiation | No security-event audit log; CSP violation reports not collected yet → **scanner plan Phase 1.3/1.4** (`report-to` + `/api/csp-report`). |
| Info disclosure | `x-powered-by: Next.js`, `via: Caddy` → **scanner plan Phase 1.1 + Phase 2.3**. Health endpoint leaks uptime/webhook flag → §5.6 (skipped, low). Error bodies are generic (`'Slack webhook failed'`), no stack traces. ✓ |
| DoS | Registration: in-app 5/10 min limiter (bounded map, O(1) hot path) + CF edge rule → **scanner plan Phase 2.5**. Fetch timeouts 10s. Input size caps. `/api/event` unlimited → §5.7 (skipped, low). |
| Elevation of privilege | No roles/permissions in app. N/A. |

### Abuse cases (written next to use cases)
1. Bot floods registration → throttled (in-app + edge planned). Idempotency dedupes identical payloads (SHA-256 key, bounded map). ✓
2. Hostile field content (`<a href=...>`, `&`, pipes) → mrkdwn-escaped before Slack; rendered as text, not markup. ✓
3. Forged `cf-connecting-ip` to rotate rate-limit buckets → ignored without `PLAUSIBLE_TRUST_PROXY=true`. ✓
4. Oversized body → field-length cap rejects >2,000-char composed fields. ✓
5. Replay of a legit registration → dedupe returns `ok:true, deduplicated:true` without re-posting. ✓
6. Scanner/probe of admin-looking paths → CF challenge serves; origin 404s → **scanner plan Phase 2.4** edge block. ✓ (planned)

---

## 2. Verified-good inventory (checked 2026-08-09 — no action needed)

- **Input validation** (`app/api/registration/route.ts`): unknown→object parse, non-string rejection, required fields, ReDoS-safe linear email check (`lib/validation.ts`, RFC 5321 254-char cap, `\|` rejected), `consent === true` enforced, otherRole type-checked.
- **Rate limiting**: fixed-window 5/10 min, key rotation safe, `MAX_LOG_ENTRIES` 10k cap, one prune per window (O(1) hot path).
- **Idempotent delivery**: SHA-256 payload key, pending/completed states, retention pruning, bounded.
- **Slack injection defenses**: `escapeMrkdwn` on every user value (both blocks and text fallback), `%7C` in mailto target, section-field ≤2,000 chars enforced on composed markup.
- **Secrets**: `pnpm audit` clean (0 known vulns); no secret values in tracked files (only placeholder `pa-XXXXX.js` documented format in `docs/analytics.md:18`); git history scan clean; `.env`/`.env*.local`/`*.pem` ignored; `.env.example` placeholders only; `git ls-files` shows only `.env.example` tracked.
- **Headers**: HSTS (max-age 63072000, includeSubDomains, preload), X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy (`next.config.js`); CSP nonce + `object-src 'none'` + `frame-ancestors 'none'` + `base-uri` + `form-action` (`proxy.ts`); unique nonce/request, e2e-asserted (`tests/e2e/security-headers.spec.ts`).
- **SSRF**: no user-influenced server fetches. Plausible URL hardcoded; Slack URL from env (operator-controlled). Proxy forwards only UA/content-type/IP — never cookies (no credential leak to third party).
- **Error handling**: generic 4xx/5xx, no internals, no stack traces. `TEST_WEBHOOK_CAPTURE` gate makes `/api/test-webhook` inert (404) without the env var.
- **Supply chain**: single committed `pnpm-lock.yaml`; CI `pnpm install --frozen-lockfile` + corepack; `allowBuilds` committed (`pnpm-workspace.yaml`); `minimumReleaseAgeExclude` for new deps; `dependency-review-action` on PRs; Dependabot with install-scripts **denied** by default + grouped updates; GH Actions pinned to GitHub-created actions, workflow `permissions: contents: read`.
- **XSS**: only two `dangerouslySetInnerHTML` sites — static theme bootstrap + static JSON-LD, both nonce'd, biome-annotated; no `eval`/`innerHTML`/`document.write` on user data anywhere.

---

## 3. Findings — NEW (this audit; not in the scanner plan)

| # | Finding | Severity | Fix | Where |
|---|---|---|---|---|
| N1 | **No `pnpm audit` gate in CI** — skill requires native audit against the committed lockfile before every release; audit exists only ad hoc | Medium | §4.1 | `.github/workflows/ci.yml` |
| N2 | **Rocket Loader decision unrecorded** — `rocket-loader.min.js` (untracked copy) at repo root; RL at the CF edge injects a third-party script (`ajax.cloudflare.com`) that the strict nonce CSP currently **blocks** (site breakage risk + extra third-party script surface). `docs/cloudflare-rocket-loader.md` documents both paths but no decision is made | Medium | §4.2 | CF dashboard (ask-first) + `proxy.ts` if kept |
| N3 | **`.hermes/` not gitignored** — untracked agent dir (plans/, skills/) could be committed accidentally with local notes | Low | §4.3 | `.gitignore` |
| N4 | **`SLACK_WEBHOOK_URL` unvalidated at startup** — SSRF-hygiene: a misconfigured env (http:// or internal host) would receive registrations; the skill's checklist asks for allowlisted scheme+host on every server fetch | Low | §4.4 | `app/api/registration/route.ts` |
| N5 | **e2e header test gaps** — asserts CSP presence/uniqueness/nonce-match but not absence of `x-powered-by` nor the Phase-1 headers (COOP/CORP/XPC) | Low | §4.5 (after scanner plan Phase 1 lands) | `tests/e2e/security-headers.spec.ts` |

## 4. Findings — already planned in `docs/security-hardening-plan.md` (do not duplicate)

x-powered-by (P1.1), COOP/COEP/CORP/XPC/OAC headers (P1.2), CSP `'strict-dynamic'` + `report-to` + `/api/csp-report` route (P1.3–1.4), edge HSTS (P2.2), disclosure-header stripping at edge (P2.3), admin-path WAF block (P2.4), CF rate limit on registration (P2.5), DNSSEC + CAA (P3), TLS-RPT/MTA-STS/BIMI (P4), security.txt fields (P5.1), privacy-policy analytics statement (P5.2), re-scan verification (P6).

---

## 5. Fixes — NEW items (minimal patches)

### 4.1 CI: add the audit gate
`ci.yml` → `quality` job, after `pnpm install --frozen-lockfile`:
```yaml
      - run: pnpm audit --prod
```
`--prod` because dev-only advisories are triaged per the skill's decision tree; the full tree is in §8. If a future audit fails, triage reachability (see scanner plan §0 for the artifact-vs-real discipline) rather than blanket-`audit fix --force`.

### 4.2 Rocket Loader: decide and record (ask-first — CF dashboard)
- **Recommended (lazy + secure): disable Rocket Loader** at CF (Speed → Optimization → Content Optimization). It is redundant for Next.js App Router output (all scripts already deferred/module-split — `docs/cloudflare-rocket-loader.md` §1) and removes the `ajax.cloudflare.com` third-party script from every page. Then delete the stray `rocket-loader.min.js` from the repo root (untracked, no `git rm` needed).
- **If kept**: one token in `proxy.ts:103` — `script-src 'self' 'nonce-${nonce}' https://ajax.cloudflare.com${isDev ? " 'unsafe-eval'" : ''}`, add `data-cfasync="false"` to both inline scripts in `app/layout.tsx` (theme bootstrap + JSON-LD), then run the §3 Step-4 curl checks from the doc.
- Either way: purge CF cache after the toggle; no ISR/CDN HTML caching (proxy.ts:3-9 already forbids it).

### 4.3 .gitignore: cover the agent dir
```gitignore
# local agent tooling
.hermes/
```
(next to the existing `.claude/` / `.codex/` lines).

### 4.4 Registration: validate the webhook URL once
`app/api/registration/route.ts` — replace the unconfigured guard:
```ts
const webhookUrl = process.env.SLACK_WEBHOOK_URL;
const webhookValid =
  webhookUrl !== undefined &&
  /^https:\/\/hooks\.slack\.com\/services\//.test(webhookUrl);
if (!webhookValid) {
  if (webhookUrl) console.error('[registration] SLACK_WEBHOOK_URL must be an https://hooks.slack.com/services/… URL');
  return Response.json({ error: 'SLACK_WEBHOOK_URL not configured' }, { status: 503 });
}
```
SSRF-hygiene only (the URL is operator-controlled, not user-controlled); also turns a typo'd env into a loud 503 instead of silently POSTing registrations somewhere wrong. `hooks.slack.com` allowlisted because Slack's webhook host is fixed; keep the regex tight so a `@`-tricked host can't pass.

### 4.5 Extend the header e2e test (after scanner plan Phase 1 lands)
In `tests/e2e/security-headers.spec.ts`, alongside the existing three tests:
- `x-powered-by` header is absent
- `cross-origin-opener-policy: same-origin` and `cross-origin-resource-policy: same-origin` present
- CSP contains `'strict-dynamic'` and `report-to csp-endpoint`; `reporting-endpoints` header contains `csp-endpoint="/api/csp-report"`

---

## 6. Ask-first items (skill tier 2 — need human approval / CF+VPS access)

- Rocket Loader toggle + cache purge (N2) — **Tom** (CF dashboard) EDIT: Rocket Loader is not enabled and Development mode (no cache) is enabled
- Edge HSTS, disclosure-header transform rule, admin-path WAF rule, registration rate-limit rule — scanner plan Phase 2 — **Tom**
- DNSSEC/CAA/TLS-RPT DNS records — scanner plan Phase 3–4 — **Tom**
- Privacy-policy analytics wording — scanner plan Phase 5.2 — **Agent + Tom review**
- CF rate-limit thresholds on `/api/registration` — confirm 20/10min suits the pilot intake before enabling

---

## 7. Verification (after any fix)

```sh
pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e
pnpm audit --prod          # N1 gate, locally too
```
Then the scanner-plan Phase 6 re-scan for the header/DNS items.

---

## 8. Explicitly not doing (and why)

- **Rate limit / size cap on `/api/event`** — Plausible validates events upstream and is the party that pays for abuse; our egress is negligible. Add if analytics traffic ever becomes measurable.
- **Health-endpoint info gating** (uptime/webhook flag) — trivial disclosure, no exploitable path; the flag is already the honest config signal (route comment).
- **`X-XSS-Protection`** — deprecated/removed from Chrome; CSP supersedes it (scanner plan §8 agrees).
- **robots.txt disallow of `/api`** — not a security control; POST-only surface is rate-limited and gated.
- **CSP `upgrade-insecure-requests`** — HSTS preload already forces HTTPS.
- **`/api/csp-report` request-size/rate cap** — reports are same-origin (report-to enforced), low volume; the route logs a 2,000-char slice and returns 204.
- **Registering an `npm audit` fail-fast on dev-only advisories** — triage per skill decision tree; only reachable critical/high blocks the release.

---

## 9. Consolidated backlog (both plans, execution order)

| # | Item | Effort | Depends on | Owner |
|---|---|---|---|---|
| 1 | N1: `pnpm audit --prod` in CI | 1 line | — | Agent |
| 2 | N3: `.gitignore` + `.hermes/` | 1 line | — | Agent |
| 3 | N4: webhook URL validation | 5 lines | — | Agent |
| 4 | N2: Rocket Loader decision (disable recommended; else CSP token + `data-cfasync`) | 5 min CF / 3 lines code | — | Tom (CF) |
| 5 | Scanner P1: headers, x-powered-by, CSP reporting, route, tests | ~30 min | — | Agent |
| 6 | N5: extend header e2e test | ~10 min | #5 | Agent |
| 7 | Scanner P2: deploy + CF edge rules | ~30 min | #5 | Tom |
| 8 | Scanner P3–4: DNS/email records | ~20 min | — | Tom |
| 9 | Scanner P5: security.txt + privacy policy | ~30 min | — | Agent + Tom |
| 10 | Scanner P6: re-scan | 5 min | #7–9 | Agent |

Items 1–4 are safe to do immediately in this repo (no server access); #4's code path only if RL is kept.
