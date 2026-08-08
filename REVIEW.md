# REVIEW.md

## What matters in this repository

Static Next.js 16 (App Router) marketing landing page for MATx, an Estonian
ed-tech product (matx.ee). Estonian copy, GSAP 3 + Lenis scroll animations,
Tailwind, Radix primitives. Review with two lenses first, in order: (1)
Estonian content accuracy and honesty, (2) animation/mobile performance.
Both have consumed most past review cycles and produced the most real bugs.

### 1. Content: single source of truth, honest claims

All public-facing copy, URLs, and narrative data come from the content
contract `lib/content/landing-copy.ts` (SITE_META, HERO_COPY, EVIDENCE_STAGES,
PROBLEM_BEATS, STUDENT_STORY, TEACHER_STORY, TRUST_PILLARS, ADOPTION_ROUTES,
FAQ_ENTRIES, SECTION_IDS, CALENDLY_URL, NAV_LABELS) and the fixtures in
`lib/content/landing-evidence.ts` (PRODUCT_FIXTURE). Past reviews repeatedly
flagged and fixed: duplicated title/description literals instead of SITE_META,
hardcoded fraction examples instead of PRODUCT_FIXTURE, hardcoded
"22 õpilast / 9 oskust" counts, magic-number conditionals (stage.number === 2)
instead of data-driven caveats, icons keyed by Estonian display strings
instead of stable ids, and FAQ "[link]" placeholders instead of real hrefs.
Flag any new hardcoded copy, URL, count, or example that duplicates a value
already in the contract — it will drift silently.

PROHIBITED_PHRASES in landing-copy.ts is a trust/legal boundary: no new copy
may contain overpromises (guarantees, uptime claims, "täielik kooskõla",
fabricated metrics). Copy must be honest about capability state
(Saadaval/Piloodis/Kavandatud). Procurement/technical CTAs must point to real
destinations or say honestly what the action does — no dead "#piloot" anchors
or inert cards.

### 2. GSAP animation correctness (top source of silent bugs)

- Per-section GSAP plugins are registered at module scope on the client
  (`if (typeof window !== 'undefined') gsap.registerPlugin(...)`) in the
  section that uses them. An unregistered plugin fails SILENTLY — the tween
  never runs (past bug: ScrambleTextPlugin tree-shaken, CTA stat scramble
  broken with no error).
- Lazy plugin chunks (`import('gsap/MotionPathPlugin')`) must have a
  `.catch()` — decorative animations fail silently; an unhandled rejection on
  a flaky mobile connection is a bug.
- House pattern: animated elements are visible by default and hidden only by
  JS right before the tween (`.gsap-animate-on-mount` CSS fallback). Never
  set inline `opacity: 0` on server-rendered content without the fallback
  class — navigation/hero must not be able to stay invisible if the effect
  never runs.
- Every effect cleans up everything it creates: revert the gsap.context(),
  kill owned tweens, store and kill owned ScrollTrigger instances (never kill
  all ScrollTriggers), fully cancel deferred work (rAF + setTimeout IDs).
  Past bug: scheduleIdle cancellation race — cb fired after cleanup.
- Use motion tokens from `lib/motion-tokens.ts` (motionTokens, gsapEase,
  staggers) instead of ad-hoc durations/eases. No index-based delays in
  scroll-triggered animations.
- Use `gsap.set` (or quick setters) in ScrollTrigger onUpdate callbacks,
  never `gsap.to` per frame (past bug: overlapping tweens on every scroll).

### 3. prefers-reduced-motion: live, not mount-only

Use `usePrefersReducedMotion()` from `lib/hooks/use-prefers-reduced-motion.ts`
(a live media-query subscription) and include it in effect dependency arrays.
Do NOT read `window.matchMedia(...)` once at mount. Reduced-motion branches
must set the final visible state (opacity 1, no hidden transforms) before
returning — hidden workflow content for reduced-motion users is a functional
bug. Anything reading window/matchMedia/device size needs SSR-safe defaults
(window-guarded, false initial state) or it breaks hydration.

### 4. Accessibility

- `aria-label` only on elements with a role that supports it (decorative
  indicators need `role="img"`).
- `type="button"` on every button.
- Inert demo controls (product fixture): aria-disabled + title, NOT native
  `disabled` — they stay keyboard-focusable.
- Interactive grids (teacher heatmap) need roving focus — tabIndex
  management + arrow keys — and real names in aria-labels, not indices.
- No duplicated sr-only lists that double-announce visible lists.
- Keep static content server-rendered: below-the-fold sections may use
  next/dynamic but NOT `ssr: false` (exception: decorative visuals with an
  aria-hidden loading fallback, e.g. the hero ProductFixture at
  components/sections/hero/index.tsx) — dropping content from server HTML
  removes story copy and anchors for no-JS users.

### 5. Performance (mobile is the primary audience)

- Below-the-fold sections load via next/dynamic; above-the-fold stays
  static. GSAP plugins and heavy libraries lazy-load.
- Lenis context value is memoized (useMemo with scrollTo as the dependency) —
  scrollTo is stable via useCallback, so the value object is created once and
  consumers re-render only if scrollTo changes.
- .browserslistrc intentionally uses rolling "last 2 versions"; comments
  there must keep matching reality (rolling releases are NOT Baseline Widely
  Available).

### 6. Dependencies

- next / react / react-dom move together on a supported
  release line (Next.js 14 is EOL — never regress to it). Keep Node engines
  >= 20.9 declared.
- Build-only tools belong in devDependencies, not dependencies.
- Keep Dependabot `insecure-external-code-execution` at deny.

### 7. Lint / TypeScript discipline

- Rule overrides are scoped to specific files with an explanatory comment
  (biome-ignore / eslint-disable). No repository-wide rule disables.
- Satisfy exhaustive-deps: capture ref values, include live hook values.
- Use Estonian quotes „…" in JSX text (project convention — no lint rule
  currently enforces this).

## Severity calibration

- CRITICAL: content violating PROHIBITED_PHRASES or misleading capability
  claims; broken primary CTAs/navigation; silently broken animation features.
- WARNING: SSR/hydration issues (unguarded window/matchMedia, ssr:false
  content loss), reduced-motion content left hidden, a11y regressions,
  animation cleanup races, unhandled promise rejections, hardcoded copy or
  values that duplicate the content contract.
- SUGGESTION: perf micro-optimizations, memoization, comment accuracy.
- DO NOT FLAG: formatting (lint/prettier enforces), generated files
  (pnpm-lock.yaml, .next/**, out/**), missing docstrings or unit tests on
  presentational components (marketing site; visual + Lighthouse verification
  applies), the rolling browserslist policy itself, build artifacts in the
  repo root (lighthouse-*.html, screenshots).

## Verification expectations

- `pnpm run lint` and `pnpm run typecheck` pass; `pnpm run build` succeeds.
- Animation changes: verify both prefers-reduced-motion states, verify on a
  mobile viewport, verify the animation triggers when scrolled into view.
- Content changes: check PROHIBITED_PHRASES; confirm strings come from the
  content contract unless intentionally new.
- Commit style: conventional commits (fix(scope): …, refactor: …, perf: …).
  PR body: what was broken / what was done / what to know.
