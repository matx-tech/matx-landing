# Cloudflare Rocket Loader + Next.js 16 — keeping it enabled without breaking the app

*Status: researched Aug 2026 from Cloudflare docs/blog, CF community threads, and this repo's
proxy.ts/layout.tsx. Where behavior is not documented, the guide says "verify" — do the curl
checks in §6 before trusting it.*

## 1. What Rocket Loader actually does (and doesn't)

Rocket Loader rewrites the HTML of proxied pages at the edge (streaming parser, works with
Next.js streaming responses):

- Every `<script>` tag (inline **and** external) gets its `type` attribute prefixed with a
  per-request random nonce, making it inert for the browser: `type="text/javascript"` →
  `type="<nonce>-text/javascript"`.
- Cloudflare injects its own loader: `<script src="https://ajax.cloudflare.com/rocket-loader.js"
  data-cf-nonce="<nonce>" defer>`.
- After the page loads, the loader re-inserts the original scripts **in their original order**,
  restoring the real `type`. Scripts tagged `data-cfasync="false"` are never touched.
- Browsers/conditions Cloudflare can't support get RL silently disabled.

Net effect: all JS runs after first paint. For a page built like this repo (Next.js App Router +
Turbopack, everything already deferred/module-split), **RL is mostly redundant** — it earns its
keep on classic blocking third-party scripts, not on Next's own output. What it *adds* is risk:
deferred inline bootstrap, cancelled/re-fetched chunks, delayed hydration, theme FOUC.

## 2. Why Next.js 16 + RL breaks (the actual failure modes)

1. **Strict CSP kills the site outright (the big one).** RL's injected loader must load, and the
   rewritten scripts must re-execute. This repo's `proxy.ts` sets a nonce-based
   `script-src 'self' 'nonce-…'` with **no** `ajax.cloudflare.com`. Result if RL is enabled
   without a CSP change: loader blocked → rewritten scripts never restored → **page JS dead**
   (blank interactions, no hydration, GSAP/Lenis never start). Cloudflare's own docs require
   adding `ajax.cloudflare.com` to `script-src` ([docs](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/content-security-policies/#product-requirements)).
2. **Inline bootstrap scripts get deferred.** Next App Router ships RSC payload as inline
   classic scripts (`self.__next_f.push([1,…])`). RL defers them → hydration starts after load.
   Usually survivable, but community reports for Next.js + RL show cancelled JS files and React
   hydration errors (#418/#423) on some loads
   ([CF community](https://community.cloudflare.com/t/rocket-loader-and-next-js/665576)).
3. **Theme bootstrap FOUC.** The `data-theme` script in `layout.tsx:101-107` must run before
   first paint. RL defers it → light flash → dark theme users get a flash of the wrong theme.
   Fixable with `data-cfasync="false"` (you control that tag).
4. **JSON-LD risk.** RL's rewrite touches script tags broadly; a rewritten
   `type="application/ld+json"` that isn't restored correctly would silently kill the
   `EducationalOrganization` structured data from `layout.tsx`. Whether modern RL skips it is
   not documented — verify (§6).
5. **Preload/cancel churn.** RL replaces script elements, so browser preloads/modulepreloads
   of `/_next/static/*` chunks can be wasted or cancelled while RL re-fetches. Not fatal, but it
   eats the "free" benefit RL is supposed to give.

## 3. The method — keep RL on, in order

### Step 1 — Enable + purge
Dashboard → Speed → Optimization → Content Optimization → Rocket Loader → **On**.
After toggling, **Purge Cache** (`Caching → Purge Everything`) — stale edge-cached HTML can
carry or lack the rewrite and cause exactly the "can't get rid of / doesn't apply" symptoms
([thread](https://community.cloudflare.com/t/cant-get-rid-off-rocket-loader/576282)).
This repo sets `Cache-Control`-unfriendly HTML via proxy (no ISR/CDN HTML cache per
`proxy.ts:3-9`), so future toggles won't need purges.

### Step 2 — Fix the CSP (mandatory, one token in `proxy.ts`)
`proxy.ts:103` currently:
```
script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ''}
```
becomes:
```
script-src 'self' 'nonce-${nonce}' https://ajax.cloudflare.com${isDev ? " 'unsafe-eval'" : ''}
```
Without this, RL-enabled = broken site. The rewritten scripts keep their original per-request
nonce, so the nonce-based policy keeps working; only the loader's host needs allowlisting.

### Step 3 — `data-cfasync="false"` on the two scripts you control (`layout.tsx`)
1. **Theme bootstrap** (`layout.tsx:101-107`): add `data-cfasync="false"`. It must run before
   paint; excluding it from RL eliminates the dark-mode FOUC.
2. **JSON-LD** (`layout.tsx:108-137`): add `data-cfasync="false"`. Cheap insurance so RL never
   touches the structured data regardless of its `application/ld+json` handling.
   (`data-cfasync="false"` must precede `src` per CF docs; for these no-`src` inline scripts
   placement is free.)
3. Future third-party snippets (if any): same attribute, on a plain `<script>` tag — don't rely
   on `next/script` passthrough, hand-write the tag like this repo already does.

### Step 4 — Verify on the live page (evidence, not vibes)
```sh
# RL is actually engaged: injected loader present + scripts rewritten
curl -s https://<domain> | grep -c 'ajax.cloudflare.com/rocket-loader.js'
curl -s https://<domain> | grep -o 'type="[^"]*"' | sort | uniq -c   # expect <nonce>- prefixed JS types

# theme bootstrap excluded correctly
curl -s https://<domain> | grep -c 'data-cfasync="false"'
```
Browser checks (hard-refresh, incognito):
- Console: no React hydration errors (#418/#423), no `rocket-loader` activation errors, no
  cancelled `/_next/static/*` chunk loads in Network.
- Dark mode: no light flash on load; `data-theme` applied before paint.
- GSAP/Lenis: hero animations and smooth scroll still fire.
- Plausible: events still arrive (dashboard → realtime); `/api/event` still 2xx through proxy.
- Structured data: Rich Results test or view-source still shows the JSON-LD block intact.
- Compare before/after with `pnpm audit:desktop` (Lighthouse). If LCP/TBT are unchanged or
  worse, RL bought nothing — see §4.

### Step 5 — If Next's own bootstrap breaks anyway
RL gives no per-path or per-script-type exclusion for Next's own emitted scripts (you can't tag
`self.__next_f` inline chunks or Turbopack module scripts from app code). The honest ladder:
1. Accept delayed hydration — app still works, LCP unaffected (scripts were deferred anyway).
2. If hydration errors/cancelled chunks persist: disable RL. This is Cloudflare's own
   documented guidance for JS issues, and for a Next.js app the measurable loss is ~zero
   (its scripts are already async/deferred; RL is legacy tooling that CF itself is steering
   away from toward Zaraz/early hints).

## 4. Next.js 16 / Cloudflare-specific notes

- **proxy.ts, not middleware.ts** — this repo already uses the Next 16 rename; nothing else
  changes for RL. (The opennextjs/cloudflare Workers adapter separately needs
  `proxy.ts` support — [wrangler#13937](https://github.com/cloudflare/workers-sdk/issues/13937)
  — that's a Workers-deployment concern, not this VPS+proxy setup.)
- RL rewrites per request at the edge; it doesn't care whether the origin is VPS, Pages, or
  Workers. Streaming HTML is fine (CF-HTML is a streaming parser).
- Turbopack `/_next/static` chunks are served as-is; only HTML is rewritten.
- Do not add ISR/CDN HTML caching for proxied routes while RL is on — the proxy comment
  (`proxy.ts:3-9`) already forbids it for nonce reasons; RL's rewrite is applied after cache
  lookup and stale cached HTML is a known source of "RL isn't doing anything" confusion.

## 5. Sources

1. Rocket Loader docs (what it is, CSP requirement) — developers.cloudflare.com/speed/optimization/content/rocket-loader/
2. Ignore JavaScripts (`data-cfasync="false"`, must precede `src`) — developers.cloudflare.com/speed/optimization/content/rocket-loader/ignore-javascripts/
3. CSP + Cloudflare product requirements table — developers.cloudflare.com/fundamentals/reference/policies-compliances/content-security-policies/
4. Cloudflare blog: "Too Old To Rocket Load, Too Young To Die" (rewrite mechanics, nonce-prefix, two-pass activation) — blog.cloudflare.com/too-old-to-rocket-load-too-young-to-die/
5. CF community: "Rocket Loader and Next JS" (faster loads but errors/cancelled files) — community.cloudflare.com/t/rocket-loader-and-next-js/665576
6. CF community: Next.js SSR incompatibility thread — community.cloudflare.com/t/…/445832
7. CF community: purge cache after toggling RL — community.cloudflare.com/t/cant-get-rid-off-rocket-loader/576282
8. Wordpress/GA threads corroborating `data-cfasync="false"` and tracker flicker fixes — stackoverflow.com/questions/42079773, blog.blazingcdn.com (Rocket Loader conflict pattern)
9. OpenNext: Next.js 16 supported on Workers (deployment context, not needed for VPS+proxy) — opennext.js.org/cloudflare

## 6. Confidence & gaps

- High confidence: RL rewrite mechanics, CSP requirement, data-cfasync exclusion, purge-on-toggle.
- Medium: exact behavior with `type="module"` chunks and `application/ld+json` — Cloudflare
  doesn't document it; ajax.cloudflare.com was unreachable from the dev box (error 522) so the
  loader source could not be inspected. Resolve with the §3 Step-4 curl/console checks.
- Note: Cloudflare documents RL as incompatible-with-CSP-unless-updated and says "if you observe
  JS issues, disable and retest" — the default answer from CF is to turn it off; the method
  above is how to keep it on safely.
