# Näidistund — implementation plan

Companion to `naidistund-ettepanek.md` (the proposal). This is the build order.
Dates: written 2026-09-03. Effort is in working days for one developer.

Ground truth checked against the repo on 2026-09-03:

| Fact | Where |
| --- | --- |
| HTML prototype has 4 conversation tabs + "Kokkuvõte", CVI tokens in `:root`, `.turn.tutor/.student` bubbles, dark-mode overrides, tab script at the bottom (`activate(index)`) | `docs/research/naidistund/matemaatika-abitund-vestlused.html` (2153 lines) |
| Below-fold sections register through `createLazySection` + `SectionGate`; anchors come from `SECTION_IDS` | `components/sections/deferred-sections.tsx`, `lib/content/landing-copy.ts:412` |
| Nav items and hero CTAs are contract strings | `LANDING_NAV_ITEMS` (`landing-copy.ts:449`), `HERO_COPY.secondaryCTA` |
| Analytics: `track(event, props)` + `EVENTS` map, no-op until Plausible is enabled | `lib/analytics.ts` |
| Reduced motion hook | `lib/hooks/use-prefers-reduced-motion.ts` |
| Status badge component (`Saadaval / Piloodis / Kavandatud`) | `components/ui/capability-status.tsx` |
| Unit tests: `node --test` with `--experimental-strip-types`, contract test walks every string for `PROHIBITED_PHRASES` | `tests/unit/content-contract.test.ts` |
| E2E: Playwright, port 3200, `openHome` fixture opts into reduced motion, desktop + Pixel 7 projects | `playwright.config.ts`, `tests/e2e/` |
| Gates: `pnpm lint` (oxlint), `pnpm typecheck`, `pnpm build`, `pnpm test`, lefthook pre-commit (biome, oxlint, tsgolint) | `package.json`, `lefthook.yml` |
| Fonts via `next/font/google` (Public Sans, Inter, IBM Plex Mono) | `app/layout.tsx` |
| Fraction rendering without KaTeX | `components/ui/fraction.tsx` |

Constraints that shape every phase:

- **Strip-types only.** Anything imported by `tests/unit` must be erasable TS: `interface`, `type`, `as const`, no `enum`, no `namespace`, no parameter properties, no JSX.
- **One source of truth for the script.** During Phase 1 that is the JS object in the HTML file. From Phase 2 on it is `lib/content/demo-script.ts`; the HTML file is frozen as a reference artifact.
- **No network, no storage.** Pure client state. The only side effect is three optional Plausible events.
- **Diamond, not tree.** All branches converge on the same node IDs. Target ≤ 40 nodes.

---

## Phase 0 — Decisions and housekeeping (0.5 d)

Goal: green light on scope, clean branch, prototype files versioned.

1. The seven decisions are filled in as **assumptions** in `naidistund-ettepanek.md` §7 (recorded 2026-09-03, Andri has not confirmed): v3-only moves, equations, homepage section **plus** `/demo` route, diagnostics board labelled "Kavandatud", Newsreader italic on, three Plausible events, prototype first. Send Andri the two that cost real time if wrong, scope (1) and topic (2), as a one-line question each before Phase 2 starts. The other five can change later without rework; when Andri answers, replace "Eeldus" with "Otsus" and the date.
2. Branch from `main`: `feat/naidistund`.
3. Move the loose research files into the repo so Andri's prototype is versioned and linkable:
   ```
   git mv matemaatika-abitund-vestlused.html docs/research/naidistund/
   git mv matemaatika-abitund-kolm-versiooni.md docs/research/naidistund/
   git mv matemaatika-abitund-versioon-4-sota.md docs/research/naidistund/
   ```
   Lefthook's biome glob is `*.{js,ts,jsx,tsx,json,css}`, so the HTML file is not touched by the formatter. Update the paths in `naidistund-ettepanek.md` §1.
4. Rebuild the code graph, which was built on another branch: `code-review-graph build`.
5. Commit: `docs(naidistund): version proposal and research material`.

Exit: branch exists, files committed, decisions recorded or defaults declared.

---

## Phase 1 — Clickable prototype for Andri (1 d)

Goal: a fifth tab "MATx" in the HTML file that runs the whole branching lesson plus the derived teacher view. Vanilla JS, same CSS, no build step. This is what Andri asked to see.

### 1.1 Tab and panel skeleton (0.5 h)

- Add a fifth `role="tab"` button before "Kokkuvõte": `id="tab-matx" aria-controls="matx"`, label `MATx <span class="ni-sota">näidis</span>`. The existing tab script picks it up automatically because it queries `.index [role="tab"]`.
- Add `<section class="version" id="matx" role="tabpanel" aria-labelledby="tab-matx" hidden>` with:
  - `.vhead` reused: title "MATx", role line "ette kirjutatud näidistund · mitte päris AI", `vdesc` = the honesty label from proposal §4.
  - `<div class="demo">` containing `<ol class="chat" role="log" aria-live="polite">`, `<div class="choices">`, `<div class="demo-controls">` (buttons "Samm tagasi", "Alusta uuesti", and a `<label><input type="checkbox">Näita, mida süsteem salvestab</label>`), and `<section class="teacher" hidden>`.

### 1.2 Script data (3 h)

One `const SCRIPT = { ...nodes }` object at the top of a new `<script>` block. Node shape, kept identical to what `demo-script.ts` will use later:

```js
{
  id: 's4',
  tutor: 'Sama lugu matemaatika keeles. …',      // string | (flags) => string
  card: { kind: 'task', kicker: 'Ülesanne · Võrrandid', eq: '3x + 5 = 20' },
  // card.kind 'solution' adds: line: '3x = [25]' (bracket = terrakota span), caption: '…'
  log: 'mõlemale poole sama tehe — õige',        // optional "salvestati" line, words only
  choices: [ { label: '…', next: 's4-ok', set: { hintAsked: 'jah' } } ], // Choice[] | (flags) => Choice[]
  next: 's5',                                     // string | (flags) => string, used when no choices
}
```

Flags and their domains (from proposal §3): `goal` paanika|tööleht, `eq` käsklus|ok, `neg` ei-saa|ok, `sulud` vale|ok, `hintAsked` jah|ei, `metaphor` kaal|termomeeter.

Node list to write, in order (IDs are the contract for tests later):

| Beat | Nodes | Notes |
| --- | --- | --- |
| S0 avamine | `s0`, `s0-ema` | `s0` has 3 choices; "ema" choice routes to `s0-ema` (binary, sets `goal`). |
| S1 diagnostika | `s1-intro`, `s1-q1`, `s1-q2`, `s1-q3` | 3 choices each, set `eq`, `neg`, `sulud`. Tutor between questions is only "Aitäh, järgmine." |
| S2 leid | `s2` | `tutor` is a function of flags (four variants: both holes, eq only, sulud only, all correct). `next` = `eq === 'käsklus' ? 's3' : 's4'`. |
| S3 kaal | `s3`, `s3-miks`, `s3-samm`, `s3-tasakaal`, `s3-reegel` | Both branches converge on `s3-reegel` → `s4`. |
| S4 ülesanne 1 | `s4`, `s4-ok`, `s4-vale`, `s4-pool`, `s4-vastus`, `s4-kontroll`, `s4-done` | 4 choices on `s4`. `s4-vale` shows the solution card with `3x = [25]`. All converge on `s4-kontroll` (rule 7 probe) → `s4-done` (process praise + `log`). |
| S5 ülesanne 2 | `s5`, `s5-katse`, `s5-vale`, `s5-probe`, `s5-done` | `tutor` and `choices` are functions of `sulud`. |
| S6 ülesanne 3 | `s6-pre`, `s6`, `s6-eitea`, `s6-uks`, `s6-ise`, `s6-vale`, `s6-done` | `s5-done.next` = `neg === 'ei-saa' ? 's6-pre' : 's6'`. `s6-pre` sets `metaphor`. |
| S7 lõpp | `s7`, `s7-otsetee`, `s7-kokkuvote`, `s7-paanika`, `end` | `s7-kokkuvote.tutor` is a function of flags (words only, no digits). `s7-kokkuvote.next` = `goal === 'paanika' ? 's7-paanika' : 'end'`. `end` has one button: "Vaata, mida õpetaja sellest tunnist näeb". |

That is 35 nodes. Copy the tutor lines from proposal §3 verbatim for now; Phase 2 polishes language.

### 1.3 Engine (2 h, ~90 lines)

Replay-from-history is the simplest correct model and makes "Samm tagasi" free:

- `history = []` of `{ node, choice }` pairs. `flags` is derived by replaying `set` from every chosen choice. Current node = last entry's resolved `next`, or `'s0'` when empty.
- `render()`: clear the log, replay history to emit tutor bubble (+ card, + log line if the checkbox is on) and student bubble per step, then emit the current node's tutor bubble and its choices as `<button>`s. Nodes with `next` and no `choices` auto-advance: push `{ node, choice: null }` and re-render after a typing indicator (600 ms, 0 ms when `matchMedia('(prefers-reduced-motion: reduce)')`).
- `choose(i)` pushes `{ node, choice: i }` and calls `render()`.
- "Samm tagasi" pops until the last entry with a non-null choice. "Alusta uuesti" resets. Both re-render.
- After each render, `scrollIntoView({ block: 'nearest' })` the newest bubble and move focus to the first choice button (only when a choice was just made, not on load).
- `end` node: render the teacher panel from `flags` (1.5) and hide choices.

Resolve `tutor`, `choices`, `next` with one helper: `typeof v === 'function' ? v(flags) : v`.

### 1.4 Cards and error marking (1 h)

Add ~30 lines of CSS under `.demo`:

- `.card` (kriit paper, `--ruut` border, kicker in Jost uppercase like `.who`), `.card .eq` tabular numerals, 1.25 rem.
- `.card.solution .err` = `border-bottom: 2px solid var(--terrakota)` plus `.caption` in `var(--serif)` italic. The bracket in `line` (`3x = [25]`) becomes `<span class="err">25</span>` at render time. The caption text always names the place in words so the colour is never the only signal.
- `.choices button` reuse `.tab-btn` look; `.demo-controls` small text buttons.
- `.log-line` muted, only shown when the checkbox is checked, text prefixed "Salvestati:".

No digits, percentages, ticks, crosses or emoji anywhere the student sees feedback.

### 1.5 Teacher view (1.5 h)

Static HTML table + a few derived cells:

- Header "7.b · 22 õpilast · 5 oskust · Näidisandmed". 21 fixed rows as a JS array of 5-letter state strings (`k` korda veel, `s` seljakotis, `l` läbitud, `p` proovimata). Sten's row is derived:

  | Skill | Rule |
  | --- | --- |
  | Võrduse omadused | `eq === 'käsklus'` → seljakotis, else läbitud |
  | Kontroll asendamisega | läbitud |
  | Sulgude avamine | `sulud === 'vale'` → korda veel, else läbitud |
  | Negatiivsed arvud | `neg === 'ei-saa'` → seljakotis, else läbitud |
  | Murrud | proovimata |

  Each cell carries the state word as text (visually small) so colour is doubled by words.
- Student card: three sentences built from the same flags, plus the fixed line "Vestluse sisu õpetaja ei näe — ainult oskuste seis."
- Diagnostics board with the existing `.badge` styled as "Kavandatud": cluster "Korrutab ainult esimest liiget", initials list gets "ST" only when `sulud === 'vale'`. Buttons "Koosta ettepanek" → reveals the proposal text → "Võta vastu / Muuda / Eira" → replaces the buttons with "Määratud · 6 õpilast · homseks". Local DOM state only.

### 1.6 Self-check (0.5 h)

At the end of the script block, run on load and `console.assert` each:

- every `next` and `choice.next` resolves to a node, for every one of the 64 flag combinations;
- from `s0`, every path reaches `end` (DFS over resolved edges; no cycles);
- every `choices` array has 2–4 entries; `end` has exactly one;
- no tutor string matches `/\bx-[a-zõäöü]+/i` (declined variable letter);
- no string contains a phrase from a copied-in `PROHIBITED` list, an emoji, "AI vestlus", or "Vale".

This is the one runnable check the prototype leaves behind; it becomes the unit test in Phase 2.

### 1.7 Hand-off (0.5 h)

- Open the file locally, walk the four branch families (all-correct, both-holes, hint-asked, wrong-sign) and the teacher view. Use Playwright MCP for a quick keyboard-only pass.
- Screenshot two states (a solution card, the teacher view). Send Andri the file path or a static host link plus the screenshots. Ask for reactions per beat, not per sentence.

Exit: Andri can click through end to end. Commit: `feat(naidistund): clickable prototype tab`.

**Status 2026-09-03: done.** 44 nodes (not 35; extra convergence nodes `s4-jaga`, `s4-vihje`, `s5-miks`, `s6-pilt`, `s6-julge`, `s6-arvan`, `s6-mark`, `s7-aeg`). `metaphor` domain is `termomeeter | väravad` (the student picks between the thermometer and the football goal difference, so "kaal" was the wrong label). Self-check passes in the browser console; keyboard path and both branch families verified with Playwright. Screenshots in `docs/research/naidistund/screenshots/`. Open with any static server (`python3 -m http.server`), anchor `#matx`.

---

## Phase 2 — Final script and language pass (1 d)

Goal: the script text is final, checked, typed, and tested. Nothing visual changes.

1. Apply Andri's feedback in the HTML script object. Keep the node IDs stable; add nodes only by extending the diamond.
2. Language pass with estonian-mcp on every tutor and student string: `spell_check`, `check_punctuation` (commas), `check_object_case`, `check_officialese` on tutor lines (they must sound like a person, not a form). Verify by hand that variable letters are never declined ("muutuja x", never "x-i") and that student lines keep their register.
3. Create `lib/content/demo-script.ts`:
   - `export type DemoFlags = { goal?: 'paanika' | 'tööleht'; … }` and `export interface DemoNode { … }` with the shape from 1.2.
   - `export const DEMO_SCRIPT: Record<string, DemoNode>` copied from the HTML object, typed.
   - `export const DEMO_COPY` for UI strings: honesty label (top and bottom), button labels, checkbox label, teacher panel headings, Plausible event names. Reuse `PRODUCT_FIXTURE.label` for "Näidisandmed".
   - `export const DEMO_CLASS_ROWS` (the 21 fixed rows).
   - Keep the file erasable-TS only (constraint above).
4. Create `lib/demo-engine.ts` with pure functions, no React, no DOM: `resolve(value, flags)`, `replay(history)` → `{ flags, steps, currentId }`, `walkAllPaths(script)` for tests, `deriveTeacherView(flags)` (Phase 4 fills the body; stub now).
5. Create `tests/unit/demo-script.test.ts` using the same `node:test` + `assert` style as `content-contract.test.ts`:
   - graph integrity across all 64 flag combinations (same five checks as 1.6);
   - `PROHIBITED_PHRASES` from `landing-copy.ts` against every string (reuse the `collectStrings` idea);
   - `log` and `s7-kokkuvote` texts contain no digits;
   - every `set` key and value is within the flag domains.
6. Delete the self-check block from the HTML file and add a comment at its top: "Frozen 2026-xx-xx. Source of truth: lib/content/demo-script.ts".
7. `pnpm test`, `pnpm typecheck`, `pnpm lint`. Commit: `feat(naidistund): typed demo script and graph tests`.

Exit: `pnpm test` covers the whole graph; HTML file frozen.

---

## Phase 3 — Next.js section, act 1 (2 d)

Goal: the student act runs on the homepage behind `#näidistund`, lazy-loaded, in CVI, accessible.

### 3.1 Contract changes (`lib/content/landing-copy.ts`) (0.5 h)

- `SECTION_IDS.demo = 'näidistund'` (non-ASCII IDs already exist: `töövoog`, `õpilasele`).
- `LANDING_NAV_ITEMS`: insert `{ label: 'Näidistund', href: '#näidistund' }` after "Kuidas töötab". Check the desktop nav still fits at `xl` (six items today, gap `5`); drop to `gap-4` if it wraps.
- `HERO_COPY.secondaryCTA = 'Proovi näidistundi'`; point the hero's secondary button at `#${SECTION_IDS.demo}` in `components/sections/hero/index.tsx:198`.
- `LLMS_TXT` (`landing-copy.ts:428`) describes pages, not anchors; add one sentence to the homepage description saying a scripted sample lesson is available. The route guard re-checks prohibited phrases at build.
- Run the existing contract test; it walks these strings automatically.

### 3.2 Styles: `components/sections/demo/demo.module.css` (1.5 h)

- Port from the HTML prototype: `:root` tokens become custom properties on `.demo` (so `--paper`, `--ink`, `--grid` cannot collide with `globals.css`), ruled-paper background, `.turn`, `.bubble`, `.who`, `.card`, `.err`, `.caption`, `.choices`, `.controls`, `.log-line`, teacher table cells.
- Decision to make here, default chosen: the demo window stays light "paper" under the landing's dark theme too. It is a product window, not page chrome, and keeping one palette avoids a second contrast audit. Note it in the PR.
- Motion in CSS only: bubble `@starting-style` or a 200 ms opacity/translate transition, typing indicator as three dots with a keyframe. Wrap both in `@media (prefers-reduced-motion: no-preference)`.

### 3.3 Font (0.5 h)

- In `components/sections/demo/index.tsx`, at module scope:
  `const newsreader = Newsreader({ subsets: ['latin'], style: ['italic'], weight: ['400'], variable: '--font-tutor', display: 'swap' })`. Estonian õ ä ö ü are in the `latin` subset; add `latin-ext` only if š or ž appear in the script (the test can grep for them).
- Apply `newsreader.variable` on the `.demo` root; the CSS module uses `var(--font-tutor)` for tutor bubbles and captions. Because the section is lazy-loaded, the font CSS ships with the section chunk, not the initial page. Body text uses Inter (already loaded), not Jost, per proposal §5.

### 3.4 Component: `components/sections/demo/index.tsx` (1 d)

- `'use client'`; default export `DemoSection`. State is `history: Step[]` in `useState`; everything else derives from `replay(history)` in `lib/demo-engine.ts`. No reducer, no context.
- Auto-advance nodes: `useEffect` that, when the current node has `next` and no `choices`, schedules the push after `prefersReducedMotion ? 0 : 600` ms and cleans up the timer. Show the typing indicator while pending.
- Markup: `<section id={SECTION_IDS.demo}>` → honesty label (`<p>` above) → `.demo` window → `<ol role="log" aria-live="polite">` → choices as `<button type="button">` in a `<div role="group" aria-label="Steni vastus">` → controls (Samm tagasi, Alusta uuesti, the "salvestab" checkbox) → honesty label below.
- Cards: task card `<figure>` with `<figcaption>` kicker; solution card renders `line` by splitting on `[ ]` into text and `<span className={styles.err}>`. Use `InlineFractionalExpression` only if a script line contains `/`.
- Focus: after a click on a choice, focus the first new choice button (`useEffect` keyed on history length, guarded by a `lastActionWasChoice` ref so initial mount and gate focus hand-off are untouched).
- Scroll: `scrollIntoView({ block: 'nearest' })` on the newest turn. Lenis only intercepts wheel input, so this works; confirm once in the browser.
- Analytics: `EVENTS.demoStart`, `EVENTS.demoEnd`, `EVENTS.demoTeacherView` added to `lib/analytics.ts`; call `track()` on first choice, on reaching `end`, and on opening act 2. No branch content in props.
- `end` node renders the button that mounts the teacher panel (Phase 4) in place of the choices.

### 3.5 Registration (0.5 h)

- `components/sections/deferred-sections.tsx`: `const DemoSection = createLazySection(() => import('@/components/sections/demo').then(m => ({ default: m.default })), { id: SECTION_IDS.demo, bgClass: 'bg-canvas', heightClass: 'h-[80vh]' })` and place it right after the hero, before `EvidenceLoopSection`, wrapped in `SectionGate` like its siblings.
- `SectionGate`'s focus hand-off fires once, when the chunk mounts after the gate's sr-only load button was used (`section-gate.tsx:46-106`); it does not re-fire mid-lesson. The only rule for the demo: never auto-focus a choice on mount, only after a click.
- `/demo` route (assumed decision 3 = both): `app/demo/page.tsx` rendering `<Navigation/> + <DemoSection/>` with its own `metadata`, `/demo` added to `ROUTES` in `app/sitemap.ts` and to `LLMS_TXT` as a page entry (the llms.txt route guard fails the build if the link is not in `ROUTES`). About ten lines. The homepage section stays the primary placement; `/demo` is the shareable link.

Exit: `pnpm dev`, homepage anchor works, whole act 1 playable with keyboard only. Commit: `feat(naidistund): demo section, act 1`.

---

## Phase 4 — Act 2, teacher view (1 d)

Goal: the teacher panel is derived from the visitor's choices and labelled honestly.

1. `deriveTeacherView(flags)` in `lib/demo-engine.ts` returns `{ stenRow: SkillState[5], studentCard: string[], inCluster: boolean }` using the table in 1.5. Unit test: all 64 flag combinations yield valid states; `inCluster === (sulud === 'vale')`; "murrud" is always `proovimata`.
2. `components/sections/demo/teacher-panel.tsx`:
   - Class table: `<table>` with `<caption>` "7.b · 22 õpilast · Näidisandmed", `<th scope>` on both axes, cell text = state word, colour via module classes (`korda` terrakota, `seljakotis` merevaik, `läbitud` sammal, `proovimata` ruut outline). Sten's row gets `aria-current="true"` and a visible outline.
   - Student card: the derived sentences plus the fixed privacy line and a link "Kuidas neid andmeid kogutakse?" to `#usaldus`.
   - Diagnostics board: `<CapabilityStatusBadge status='Kavandatud' />` in the header, cluster line, initials, then a three-step local state machine: `idle → proposed → assigned`. Buttons are real buttons; the assigned state is announced through the existing `role="log"` (append one system line) so screen readers hear it.
3. `DemoSection` swaps choices for `<TeacherPanel flags={flags} />` on `end`, keeps the log visible above, and offers "Alusta uuesti".
4. Mobile: table scrolls horizontally inside `.demo` (`overflow-x: auto`), never the page.

Exit: both acts playable; `pnpm test` green. Commit: `feat(naidistund): teacher view derived from choices`.

---

## Phase 5 — Quality gate (0.5 d)

Run in this order and fix as you go:

```
pnpm exec biome check --write components/sections/demo lib/content/demo-script.ts lib/demo-engine.ts tests/unit/demo-script.test.ts
pnpm lint
pnpm exec oxlint --type-aware --type-check
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e -- tests/e2e/demo.spec.ts
pnpm audit:mobile
```

- `tests/e2e/demo.spec.ts` (Playwright, uses `openHome` fixture): (a) nav "Näidistund" scrolls to the section and the first choice is reachable by Tab; (b) happy path clicks through to `end` and opens the teacher view, asserts Sten's "sulgude avamine" cell reads "läbitud"; (c) wrong-parentheses path asserts the solution card contains a `.err` span and the same cell reads "korda veel"; (d) "Samm tagasi" removes the last student bubble. Runs on both projects; the mobile project checks the table scrolls inside the window.
- Lighthouse mobile gate must be unchanged. The section is lazy, so the initial bundle should not grow; if it does, the font or CSS module leaked into the shared chunk.
- Manual: keyboard-only run of both acts; screen reader spot check that new tutor bubbles are announced once (no double announcement from `aria-live` plus focus move).
- `pnpm exec oxlint` may flag `noArrayIndexKey`; node IDs and `history` indices are stable, so key on `${index}-${nodeId}` rather than suppress.

Exit: all commands green, PR opened with two screenshots and the decision notes from 3.2. Commit: `test(naidistund): graph, e2e, a11y pass`.

---

## Phase 6 — Go live (0.5 d)

1. The Lovable redirect is not in the repo (`next.config.js` and `proxy.ts` contain no redirect), so it lives in Cloudflare or DNS. Find the rule (Redirect Rules or a Page Rule; `docs/cf-cache-rules-recommendation.md` describes the zone setup), note its exact name in the PR, and delete it only at deploy time, not before merge.
2. Add "Logi sisse" → `https://app.matx.ee` to the nav CTA group in `components/ui/navigation.tsx` (desktop and mobile menu). String goes into `landing-copy.ts`.
3. Confirm `PLAUSIBLE_SCRIPT_URL` is set in the deploy environment (assumed decision 6 = yes; the site already runs cookieless Plausible per `docs/analytics.md`). Add the three event names to the Plausible goals list so they show in the dashboard. `track()` is a no-op if the variable is missing.
4. Preview deploy → Andri clicks through on a phone → merge to `main`.
5. Post-merge: `code-review-graph build`, update `naidistund-ettepanek.md` status line to "Live (kuupäev)".

Exit: matx.ee stands alone; app.matx.ee is the product.

---

## Risks and where they bite

| Risk | Phase | Mitigation |
| --- | --- | --- |
| Assumed decisions 1 (scope) or 2 (topic) turn out wrong | 0 → 2 | Ask those two explicitly before Phase 2. SoTA moves, if wanted, go behind a `status: 'Kavandatud'` field on the node (+0.5 d). A topic change means rewriting §3 (+2 d), so it must be known before the script is typed. |
| Script grows past the diamond and paths stop converging | 1, 2 | The graph test fails on any path that does not reach `end`. Add nodes only between existing convergence points. |
| `SectionGate` focus hand-off fights the choice-button focus | 3 | Gate focus fires once on mount; the demo's own focus effect runs only after a click, so they never overlap. |
| Landing dark theme makes the paper window look wrong | 3 | Window is always light; test once with the theme toggle. |
| Strip-types cannot load the script (enum, JSX) | 2 | Constraint stated at the top; `pnpm test` catches it immediately. |
| Lenis blocks programmatic scroll | 3 | It does not (wheel only); verify once, fall back to `lenis.scrollTo` via the provider if needed. |
| Lighthouse mobile regression | 5 | Section is lazy; font is inside the section chunk. Budget check is in the gate. |
| Two pilot topics on one page (percentages elsewhere, equations here) | 3 | Accepted in proposal §4; no change in v1. |

## Effort summary

| Phase | Days | Deliverable |
| --- | --- | --- |
| 0 | 0.5 | Decisions, branch, files versioned |
| 1 | 1 | Clickable HTML prototype (Andri) |
| 2 | 1 | Final script, typed, graph-tested |
| 3 | 2 | Homepage section, act 1 |
| 4 | 1 | Teacher view, act 2 |
| 5 | 0.5 | Gates, e2e, a11y |
| 6 | 0.5 | Redirect off, login link, live |
| **Total** | **6.5** | |

Phase 1 is the checkpoint. If Andri's feedback changes the concept, Phases 2–6 restart from the script, and nothing in Next.js has been written yet.
