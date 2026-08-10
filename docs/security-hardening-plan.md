# matx.ee — Security Hardening Plan

Source: SiteSecurityScore scans of 2026-08-09 (4 files, 2 unique scans) + repo audit
- `SiteSecurityScore_matx.ee_2026-08-09.pdf.md` / `-2.pdf.md` / `-2-1.pdf.md` — **identical** (08:19, **Score 74 / Grade B**)
- `SiteSecurityScore_matx.ee_2026-08-09-1.pdf.md` + `report.md` — same scan in two export formats (08:25, **Score 68 / Grade C**)

---

## 0. What the two scans actually measured (read this first)

| | Scan A (74/B, ×3 files) | Scan B (68/C, `-1.pdf.md` + `report.md`) |
|---|---|---|
| What it hit | **The real origin** (matx.ee via Cloudflare) | **A Cloudflare challenge interstitial** (`cf-mitigated: challenge` in raw headers, CSP = Cloudflare's own challenge CSP: `script-src 'nonce-…' 'unsafe-eval' https://challenges.cloudflare.com`, `form-action http: https:`) |
| Meaning | True baseline | **Not a measurement of the app.** Every finding unique to this scan is an artifact of probing the challenge page, which Cloudflare serves for *any* path — including the "admin" paths |

**Consequences for Scan B artifacts — do NOT "fix" these in code:**
- `unsafe-eval` + missing `object-src` → that is Cloudflare's interstitial CSP, not ours
- "7 admin endpoints reachable" (`/wp-login.php`, `/cpanel`, `/manager`, `/dashboard`, `/server-status`, `/server-info`, `/_profiler`) → the scanner got the challenge page at each path. Origin returns Next.js 404s
- "3 risky methods enabled" (PUT/DELETE/PATCH) → challenge page's OPTIONS response
- "prototype pollution vector: `__proto__`/`constructor` reflected" → the challenge page reflects query params; our app is React SSR with no untrusted object merges
- "no active bot protection detected" → the challenge *is* the bot protection; detector was confused by the interstitial
- "HSTS is not enabled" / "Strict-Transport-Security missing" (in TLS + compliance sections of BOTH scans) → raw headers of Scan A show `strict-transport-security: max-age=63072000; includeSubDomains; preload`. The scanner's TLS probe sees the CF edge, which does not emit the origin's HSTS on non-origin responses

**Real baseline (Scan A):** strong CSP (nonce + `strict-dynamic`), HSTS preload, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, TLS 1.3, DMARC `p=reject`, SPF, DKIM (many selectors), DANE TLSA 3/3, security.txt present. Score limited by: 8 missing headers, 2 info-disclosure headers, DNSSEC off, no CAA, no MTA-STS/TLS-RPT/BIMI, deprecated `report-uri` in CSP, and org-level compliance gaps.

**Repo drift found during audit:** deployed CSP (per Scan A) contains `strict-dynamic` and `report-to`/`Reporting-Endpoints` pointing at `/api/csp-report` — the repo `proxy.ts` has neither, and **no `/api/csp-report` route exists in the repo**. The repo is behind what is deployed on the VPS.

---

## 1. Finding inventory (deduped)

| # | Finding | Scan | Verdict | Severity | Fixed in |
|---|---|---|---|---|---|
| 1 | `x-powered-by: Next.js` leaks framework | A (+B compliance) | **REAL** | Medium | Phase 1 |
| 2 | `via: 1.1 Caddy` leaks reverse proxy | A | **REAL** | Low | Phase 2 |
| 3 | COOP / COEP / CORP missing | A | **REAL** (COEP: see 3.1) | Medium | Phase 1 |
| 4 | X-Permitted-Cross-Domain-Policies missing | A | **REAL** | Low | Phase 1 |
| 5 | CSP `report-uri` deprecated (use `report-to`) | A | **REAL** (repo: reporting absent entirely) | Medium | Phase 1 |
| 6 | `/api/csp-report` referenced but no route in repo | A (drift) | **REAL** | Medium | Phase 1 |
| 7 | DNSSEC disabled | both | **REAL** | Medium | Phase 3 |
| 8 | No CAA records | both | **REAL** | Medium | Phase 3 |
| 9 | No TLS-RPT record | A (report.md) | **REAL** | Low | Phase 4 |
| 10 | No MTA-STS policy | A (report.md) | **REAL** (inbound-only) | Low | Phase 4 (optional) |
| 11 | No BIMI | A (report.md) | **REAL** (cosmetic) | Info | Phase 4 (optional) |
| 12 | security.txt: add Encryption/Policy/Preferred-Languages | A (report.md) | **REAL** | Low | Phase 5 |
| 13 | Privacy policy states "no analytics" but Plausible is live (docs/kernel.md landmine) | compliance | **REAL** | Medium | Phase 5 |
| 14 | HSTS "not enabled" (TLS sections) | both | **FALSE** — HSTS preload is on; scanner measures CF edge | — | Phase 2 (edge HSTS) |
| 15 | ECDSA P-256 "weak 256-bit key" | B | **FALSE** — P-256 ≈ RSA-3072 strength | — | none |
| 16 | OCSP stapling "not enabled" | B | **FALSE** — CF edge property, CF staples; not origin-configurable | — | none |
| 17 | `server: cloudflare` info disclosure | B | Expected — version hidden; that IS the genericization | — | none |
| 18 | unsafe-eval CSP / missing object-src | B | **ARTIFACT** — challenge page CSP | — | none |
| 19 | 7 admin endpoints reachable | B | **ARTIFACT** (but see Phase 2 §10 for a cheap edge rule) | — | Phase 2 |
| 20 | PUT/DELETE/PATCH enabled | B | **ARTIFACT** | — | none |
| 21 | Prototype pollution reflection | B | **ARTIFACT** | — | none |
| 22 | No bot protection detected | B | **ARTIFACT** (challenge = bot protection, active) | — | none |
| 23 | No rate limiting headers | B | **Informational** — in-app limiter exists (5/10 min on registration) | — | Phase 2 (edge rule) |
| 24 | Single-provider nameservers | A (report.md) | Real, but dual-DNS not worth it here | Info | none |
| 25 | SPF softfail `~all` | A (report.md) | Real, but DMARC `p=reject` covers spoofing | Info | Phase 4 (optional) |
| 26 | Compliance (PCI/GDPR/ISO/HIPAA) "Weak" | both | Mostly org-level; code-side items = HSTS (✓ on), CSP reporting (Phase 1), Referrer-Policy (✓ on), CORS (✓ none), .env (✓ not public) | — | Phase 5 |

---

## 2. Phase 1 — Repo code changes (this session, no server access needed)

### 1.1 Kill `x-powered-by: Next.js`
`next.config.js`:
```js
// Redact framework disclosure (SiteSecurityScore info-disclosure finding)
poweredByHeader: false,
```

### 1.2 Add the missing headers (COOP, CORP, X-Permitted-Cross-Domain-Policies, Origin-Agent-Cluster)
`next.config.js` → existing `headers()` block:
```js
{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
{ key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
{ key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
{ key: 'Origin-Agent-Cluster', value: '?1' },
```
**Deliberately NOT added:** `Cross-Origin-Embedder-Policy: require-corp` — breaks any cross-origin resource that doesn't send CORP (hotlinked images via `img-src https:`); zero user benefit on a marketing page. Add later only if the site ever isolates sensitive data. `Clear-Site-Data` — destructive on every response; only ever used on logout. `Document-Policy` / `Integrity-Policy` — experimental, negligible browser support.

### 1.3 Sync CSP with deployed version + wire reporting (repo is behind VPS)
`proxy.ts` CSP:
- add `'strict-dynamic'` to `script-src` (deployed CSP already has it; keeps nonce enforcement, allows nonce'd scripts to load further scripts — the modern form)
- replace nothing else; keep `object-src 'none'` etc.
- add reporting directives and the header:
```ts
const csp = [
  "default-src 'self'",
  `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
  // ...existing directives...
  "report-to csp-endpoint",
].join('; ');
// after response creation:
response.headers.set('Reporting-Endpoints', 'csp-endpoint="/api/csp-report"');
```
Do NOT keep `report-uri` — deprecated per CSP3 (the scanner's own Medium finding); `report-to` covers Chromium/Firefox, and the endpoint is same-origin so Safari's lack of support costs nothing.

### 1.4 Create the missing report receiver
`app/api/csp-report/route.ts` (POST only; same-origin reports; log + 204):
```ts
// CSP violation report receiver (PCI 11.6.1 / ISO A.8.16 monitoring).
// Same-origin only (report-to enforces it). Logs to stdout; returns 204.
export async function POST(request: Request) {
  const body = await request.text(); // reports are JSON, may be large arrays
  console.error(`[csp-violation] ${body.slice(0, 2000)}`);
  return new Response(null, { status: 204 });
}
export function GET() {
  return new Response(null, { status: 404 });
}
```
(Proxy matcher already excludes `/api/*`, so no proxy change needed for this route.)

### 1.5 Extend the e2e security-header test
`tests/e2e/security-headers.spec.ts` — add:
- assert CSP contains `report-to csp-endpoint` and `'strict-dynamic'`
- assert `reporting-endpoints` response header contains `csp-endpoint="/api/csp-report"`
- assert response has **no** `x-powered-by` header

### 1.6 Verify
```sh
pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e
```

---

## 3. Phase 2 — Deploy + Cloudflare edge (needs VPS + CF dashboard)

1. **Deploy Phase 1** to VPS (`root@45.134.39.239`).
2. **Enable HSTS at the Cloudflare edge** (SSL/TLS → Edge Certificates → HSTS): `max-age=63072000`, include subdomains, preload. This makes HSTS consistent on *every* edge response (challenge pages included) — eliminates the "HSTS not enabled" false finding in both scans at its root, and is the CF-recommended place for HSTS anyway.
3. **Strip the remaining disclosure headers at the edge:**
   - CF transform rule: remove `x-powered-by` (belt; the app fix already landed)
   - Caddyfile: `header_down -Via` on the site block (kills `via: 1.1 Caddy`)
4. **CF WAF custom rule** — challenge/block the false-positive admin paths so scanners stop counting challenge pages as "reachable" (and so real scanners see 404, which is the truth):
   URI path contains any of: `/wp-login.php`, `/cpanel`, `/manager`, `/dashboard`, `/server-status`, `/server-info`, `/_profiler` → **Block**.
5. **CF rate limiting rule** on `/api/registration` (e.g. 20 req / 10 min / IP, challenge or block). Defense in depth — the in-app limiter (5/10 min) already protects the origin; this also answers the "no rate limiting headers" informational finding.

---

## 4. Phase 3 — DNS (CF dashboard, ~5 min, highest score-per-effort)

1. **Enable DNSSEC:** Cloudflare → DNS → Settings → DNSSEC → Enable; copy the DS record to the `.ee` registrar. (Prerequisite for DANE later.)
2. **Add CAA records** (CF Universal SSL issues via Let's Encrypt *and* Google Trust Services):
   ```
   matx.ee.  CAA  0 issue "letsencrypt.org"
   matx.ee.  CAA  0 issue "pki.goog"
   ```
   DNS section: 4/7 → 6/7.

---

## 5. Phase 4 — Email records (DNS, ~10 min)

1. **TLS-RPT** (trivial, real):
   `_smtp._tls.matx.ee. TXT "v=TLSRPTv1; rua=mailto:tls@matx.ee"`
2. **MTA-STS** (optional — inbound-mail hardening only): TXT `_mta-sts.matx.ee` + a small host serving `https://mta-sts.matx.ee/.well-known/mta-sts.txt` (`mode: enforce`). Defer until inbound mail matters; Cloudflare Email Routing already encrypts opportunistically.
3. **BIMI** (optional): needs the SVG logo asset + `default._bimi.matx.ee` TXT; DMARC is already `p=reject` so it would work. Cosmetic.
4. **SPF `~all` → `-all`** (optional): DMARC `p=reject` already neutralizes spoofing; `-all` can silently break legitimate forwarding. Leave as-is.

---

## 6. Phase 5 — security.txt + compliance docs

1. **security.txt** (served from the VPS/Caddy, not the repo): add
   ```
   Encryption: https://…/pgp-key.asc
   Policy: https://matx.ee/security-policy
   Preferred-Languages: en, et
   Canonical: https://matx.ee/.well-known/security.txt
   ```
   Roll `Expires` annually (RFC 9116). security@proksiabel.ee stays.
2. **Privacy policy** — kernel landmine: repo currently states *no analytics*, but Plausible is live on the VPS. Update the `[legal]` privacy page to reflect first-party Plausible analytics (cookieless; `doNotTrack` honored per lib/analytics.ts). This is the one GDPR-relevant code/doc item; the scan's other compliance failures (full GDPR text, processor agreements) are org-level, not code.

---

## 7. Phase 6 — Re-scan and verify

1. Re-run SiteSecurityScore after deploy. Expected: headers 7→~12 present, DNS 4/7→6/7, email 7/10→8–9/10, no info disclosure → **~85+/A**.
2. Caveat: if the re-scan again hits the challenge interstitial it will report C with the same artifact list. To get a true origin measurement, temporarily set Cloudflare Security Level → "Essentially off" for the scan window, then restore.

---

## 8. Explicitly not doing (and why)

- **COEP `require-corp`** — breaks cross-origin resources lacking CORP; no benefit for a static marketing page.
- **Clear-Site-Data** — destructive on every response.
- **Document-Policy / Integrity-Policy** — experimental, near-zero support.
- **X-XSS-Protection** — deprecated/removed from Chrome; CSP supersedes it.
- **ECDSA P-256 "weak key"** — false finding (P-256 ≈ RSA-3072); Let's Encrypt 3-month cert auto-renews at the CF edge.
- **OCSP stapling** — CF edge property, already stapled by CF; not origin-configurable.
- **Scan B artifact set** (unsafe-eval CSP, admin endpoints, PUT/DELETE/PATCH, prototype pollution, "no bot protection") — challenge-page measurement noise; no code change (edge rule in §3.4 handles the one residue).
- **Dual-DNS / second NS provider** — resilience theater for this site's traffic; revisit only if matx.ee becomes availability-critical.
- **BIMI / MTA-STS / SPF -all** — optional, low value today; revisit when outbound mail becomes business-critical.

---

## 9. Execution order summary

| Phase | Effort | Score impact | Owner |
|---|---|---|---|
| 1. Repo: x-powered-by, 4 headers, CSP sync + reporting, csp-report route, tests | ~30 min | Headers 7→11, kills 2 disclosures | Agent (no server access needed) |
| 2. Deploy + CF edge: HSTS, transform rule, WAF admin-path rule, rate limit | ~30 min | Kills HSTS/`via`/admin false positives | Tom (VPS+CF) |
| 3. DNS: DNSSEC + CAA | ~10 min | DNS 4/7→6/7 | Tom (CF dashboard) |
| 4. Email: TLS-RPT (+optional MTA-STS/BIMI/SPF) | ~10 min | Email 7/10→8–9/10 | Tom |
| 5. security.txt fields + privacy policy update | ~30 min | Compliance/legal | Agent + Tom review |
| 6. Re-scan | 5 min | Verify B→A | Agent |

Phase 1 is self-contained and can be executed immediately from this repo. Phases 2–4 need CF/VPS access.
