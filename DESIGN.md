---
name: MATx
description: Estonian adaptive math practice for põhikool — rigorous, honest, and exact; every claim checkable, every answer traced.
colors:
  baltic-blue: "#1e5a8a"
  baltic-blue-hover: "#184e78"
  baltic-blue-deep: "#12324d"
  baltic-blue-sky: "#63a0d6"
  baltic-blue-mist: "#e7f0f8"
  fjord-teal: "#0e6f68"
  fjord-teal-light: "#3fa69d"
  fjord-teal-mist: "#e7f2f1"
  success: "#18794e"
  success-light: "#3fb07a"
  success-mist: "#e6f4ed"
  warning: "#b45309"
  warning-light: "#e9963f"
  warning-mist: "#fffbeb"
  danger: "#b42318"
  danger-light: "#ec6a5e"
  info: "#0b6fa4"
  info-light: "#4fb0e5"
  info-mist: "#e4f1f8"
  paper-canvas: "#f8fafc"
  paper-surface: "#ffffff"
  paper-border: "#d9e2ec"
  paper-text: "#111827"
  paper-text-muted: "#374151"
  ink-canvas: "#0b1220"
  ink-surface: "#131c2b"
  ink-elevated: "#1b2740"
  ink-border: "#26324a"
  ink-text: "#e6ebf2"
  ink-text-muted: "#97a4ba"
typography:
  display:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.6
  mono:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "1rem"
    fontWeight: 400
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  xxl: "20px"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
  "16": "64px"
components:
  button-primary:
    backgroundColor: "{colors.baltic-blue}"
    textColor: "{colors.paper-surface}"
    rounded: "{rounded.lg}"
    padding: "8px 24px"
    typography: "Inter 500, 1.125rem"
  button-primary-hover:
    backgroundColor: "{colors.baltic-blue-hover}"
  button-primary-active:
    backgroundColor: "{colors.baltic-blue-deep}"
  button-secondary:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.paper-text}"
    rounded: "{rounded.lg}"
    padding: "8px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.baltic-blue-mist}"
  button-teal:
    backgroundColor: "{colors.fjord-teal}"
    textColor: "{colors.paper-surface}"
    rounded: "{rounded.lg}"
    padding: "8px 24px"
  button-teal-hover:
    backgroundColor: "{colors.fjord-teal-light}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.paper-surface}"
    rounded: "{rounded.lg}"
    padding: "8px 24px"
  card:
    backgroundColor: "{colors.paper-surface}"
    rounded: "{rounded.xl}"
    padding: "20px"
  input:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.paper-text}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  status-badge-saadaval:
    backgroundColor: "{colors.success-mist}"
    textColor: "{colors.success}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  status-badge-piloodis:
    backgroundColor: "{colors.warning-mist}"
    textColor: "{colors.warning}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  status-badge-kavandatud:
    backgroundColor: "transparent"
    textColor: "{colors.paper-text-muted}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  chip:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.paper-text-muted}"
    rounded: "{rounded.md}"
    padding: "4px 8px"
---

# Design System: MATx

## Overview

**Creative North Star: "The Proof Notebook"**

MATx looks like a mathematician's proof notebook: every claim is written down, every answer can be traced to the reasoning that produced it, and nothing is asserted that cannot be checked. The structure is engineered and exact — a blueprint grid behind the hero, a large, deliberate type scale, mono accents wherever a fact is cited — and the whole system is built on a single trust mechanism: the three-status vocabulary (Saadaval / Piloodis / Kavandatud) that labels every capability the way a notebook labels a proven lemma. Green, amber, and neutral are the verdicts; a claim without a status does not exist.

Density is allowed where it serves the reader: the Tehniline ülevaade packs status cards, ratio bars, and compliance tables into a two-column ledger, technical tokens always render in IBM Plex Mono so paths and standards read as code, and every fixture panel is marked "Näidisandmed" because a proof notebook never passes off a scratch example as a result. The system is flat-first — surfaces separate by color and quiet section fades, cards sit flat at rest and lift gently under the cursor.

Two surfaces share this system: the landing page (Persuade — present the proof, earn the decision) and the Tehniline ülevaade (Read — the ledger itself, where every status has a source and every control a status).

**Key Characteristics:**
- Engineered, exact structure: blueprint grid, deliberate scale, density where it serves the reader
- High-trust by construction: the three-status vocabulary is the backbone, always with an icon
- Flat-first depth: tonal surface alternation with soft fades, cards flat at rest, ambient shadow lift on hover
- Mono as a first-class detail: every technical token (path, standard, paragraph, email) renders in IBM Plex Mono
- Estonian-native typesetting: auto hyphenation in prose, manual in headings, scale sized for long words
- Calm, brief motion from a single token module; reduced-motion is a first-class override

## Colors

A cool, trustworthy palette: a confident blue leads, a fjord teal supports, and a restrained status family (green/amber/red/info) carries the verdicts — always paired with an icon so color is never the only channel.

### Primary
- **Baltic Blue** (#1e5a8a): the action color — primary buttons, links, the "MAT" in the logo, focus rings, nav underline. Deeper steps handle interaction (hover #184e78, active #12324d); the sky step (#63a0d6) takes over as the action color in dark mode.
- **Baltic Blue Mist** (#e7f0f8): hover wash for secondary buttons and subtle primary-tinted fills.

### Secondary
- **Fjord Teal** (#0e6f68): the supporting accent — the "x" in the logo, teal variant buttons, secondary icons, topic color for percentages. Lightens to #3fa69d on hover and in dark mode; **Fjord Teal Mist** (#e7f2f1) is its fill.

### Status
- **Meadow Green** (#18794e) + **Mist** (#e6f4ed): Saadaval — live and working, with a pulsing dot.
- **Amber** (#b45309) + **Mist** (#fffbeb): Piloodis — in pilot, in testing.
- **Clay Red** (#b42318): errors, danger actions, exercise error signals.
- **Info Blue** (#0b6fa4) + **Mist** (#e4f1f8): informational notes.
- **Status Mist + Light Border + Strong Text** triads (e.g. #e6f4ed / #3fb07a / #18794e) are the fixed recipe for status badges — never mixed across statuses.

### Neutral
- **Paper** (light theme): canvas #f8fafc, surface #ffffff, border #d9e2ec, primary text #111827, muted text #374151.
- **Ink** (dark theme): canvas #0b1220, surface #131c2b, elevated #1b2740, border #26324a, primary text #e6ebf2, muted text #97a4ba. Dark mode is selected by the saved `matx-theme` preference or system preference; tokens remap, not duplicate.

### Named Rules
**The Three-Status Rule.** Green, amber, and neutral mean Saadaval, Piloodis, and Kavandatud — everywhere, on every surface. No fourth status color exists; a capability that doesn't fit one of the three is not shown as a capability.

**The Colorblind-Safe Status Rule.** No status is carried by color alone. Saadaval has a pulsing dot and a check icon, Piloodis a rocket, Kavandatud a clock; the heatmap uses stripe and dot patterns per level. Color is the garnish, never the message.

## Typography

**Display Font:** Public Sans (600–700, with system-ui fallback)
**Body Font:** Inter (400/500/600, with system-ui fallback)
**Label/Mono Font:** IBM Plex Mono (400)

**Character:** An engineered pairing — Public Sans' open geometrics give display sizes a confident, modern presence; Inter carries dense prose and doc text without fatigue; IBM Plex Mono is a first-class detail, reserved for technical tokens (file paths, standards like ML-DSA-65, RHS § references, emails) so they read as code, never as prose.

### Hierarchy
- **Display** (Public Sans 700, 4.5rem top, 1.2 line-height): hero logo and headline only — the one moment of presence on the page.
- **Headline** (Public Sans 600, 3–3.75rem, 1.2): section-leading statements and mobile menu items (3xl at 3rem).
- **Title** (Public Sans 600, 2.25rem, 1.2): section headings on both surfaces, card titles.
- **Body** (Inter 400, 1.25rem base / 1.0625rem at 1.6 line-height): prose, captions, dense doc text on /tehniline (1.125rem).
- **Label** (Inter 500, 1rem): badges, chips, form labels, nav links.
- **Mono** (IBM Plex Mono 400, 0.85em relative): technical tokens via the TechText pattern.

The scale is remapped marketing-large: `text-xs` is 1rem and `text-base` is 1.25rem — captions read as captions, not as shrunken text. Body copy hyphenates with Estonian rules (hyphens auto, 7-3-3 limits); doc pages use a stricter 8-3-3 via `.prose-et`.

### Named Rules
**The Unbroken Heading Rule.** Headings never hyphenate and never wrap mid-word (hyphens manual, overflow-wrap normal). An Estonian heading like "Tehniline ülevaade" must never render as "Tehnili-ne üle-vaade" — long words are the norm, and the type scale is sized for them.

**The Scale-Is-Deliberate Rule.** The remapped type scale is load-bearing across both surfaces. Do not "fix" text-xs back to 0.75rem or text-base back to 1rem — the large scale is the system.

## Layout

A calm 8px grid (4/8/16/24/32/48/64px) on a max-w-7xl (1280px) container, with section-level vertical rhythm at py-24/32/40. Sections alternate between canvas and surface backgrounds; each transition is softened by a 6rem top-edge gradient fade that melts the previous section's color into the next (`.section-fade-from-canvas` / `-from-surface`), so the page reads as one continuous surface, not stacked blocks.

Breakpoints follow Tailwind defaults: sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536. The nav pads px-4 → px-8 → px-12; the hero grid splits lg:grid-cols-2 with a 3rem (12) gap; status cards run in two columns from lg; the hero sits min-h-screen with content centered.

Density is generous where the reader works — cards use 20px padding, status lists gap 12px, the technical ledger packs rows into two columns — and every interactive element keeps a 44px minimum touch target (buttons, nav links, menu items) per WCAG 2.5.5.

**The 44-Pixel Rule.** Every interactive element — button, link, menu item, close button — keeps a 44px minimum height. Comfort on a school tablet is not optional.

## Elevation & Depth

Depth is **flat-first**: surfaces separate by color (paper vs canvas, ink vs elevated) and by the section fades, and cards sit flat at rest. Shadows are ambient — they exist to say "this is yours to click," never to stack surfaces. A card lifts gently under the cursor; a floating dialog detaches with a soft drop shadow; everything else stays flat.

### Shadow Vocabulary
- **Card at rest** (`0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)`): barely-there grounding on interactive cards.
- **Card hover** (`0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)`): the lift that says "this one is yours to click."
- **Elevated / dialog** (`0 8px 24px rgba(0,0,0,0.12)`): detached layers — dialogs, modals.
- **Dropdown** (`0 4px 16px rgba(0,0,0,0.1)`): menus and floating controls.

### Named Rules
**The Flat-First Rule.** Cards rest flat. Depth comes from tone and fades; shadows only mark interaction (hover lift) or detachment (floating layers). A shadow that stacks two static surfaces is a bug, not a feature.

## Shapes

Crisp geometry with gently curved edges: the radius scale is 4/8/12/16/20px plus full pills. Defaults favor the tighter end — inputs and buttons at 12px, chips and small controls at 8px — with cards and dialogs at 16px and status badges as pills (9999px). Edges stay sharp where the content is technical: 1px borders, square heatmap cells, straight table rules on the technical page.

The heatmap is the one patterned shape in the system: level cells are squares (full cells) carrying stripe/dot overlays (white at 25–35% opacity) so levels read in print and for color-blind users.

## Components

### Buttons
- **Shape:** crisp, gently curved edges (12px radius); hero CTAs step up to 16px at text-lg.
- **Primary:** Baltic Blue fill, white text, Inter 500–600, padding 8px 24px (hero: 16px 32px), 200ms background transition on the standard ease. Hover deepens to #184e78, active to #12324d; disabled turns neutral border-gray with muted text and not-allowed.
- **Hover / Focus:** color transitions only (200ms); focus shows the surface-gapped ring (2px surface + 4px Baltic Blue, inverted on brand surfaces).
- **Secondary:** paper surface, 1px strong-border stroke, primary text; hover washes Baltic Blue Mist and the stroke turns Baltic Blue.
- **Teal:** Fjord Teal fill for the supporting call-to-action (pilot joins); hover #3fa69d.
- **Danger:** Clay Red fill, hover #8f1d14 — reserved for destructive actions.

### Chips
- **Style:** pill or 8px-radius chip on surface with 1px border and muted-to-primary text; the FELLIN HÄKK award chip carries an amber icon.
- **Status badges:** the three-status system — success mist fill + green border + green strong text with pulsing dot and check (Saadaval); amber mist + amber border + amber text with rocket (Piloodis); transparent fill + neutral border + muted text with clock (Kavandatud). Fixed recipe, never remixed.

### Cards / Containers
- **Corner Style:** 16px radius.
- **Background:** surface (white / ink-800); interactive cards lift with the card-hover shadow, static ones stay flat.
- **Border:** 1px border token; planned-state cards ("Kavandatud") deliberately mute the whole card — muted text, flat shadow — so the ledger reads at a glance.
- **Internal Padding:** 20px (p-5), 24px for feature panels.

### Inputs / Fields
- **Style:** surface fill, 1px border stroke, gently curved edges (12px), padding 12px 16px, placeholder at muted/50%.
- **Focus:** the surface-gapped 4px ring in Baltic Blue; error state swaps stroke and ring to Clay Red with an inline AlertCircle message.
- **Disabled / Draft:** registration form drafts persist to localStorage and restore on reopen — fields are never blank on a returning teacher.

### Navigation
Fixed bar on surface with a 1px bottom border. Desktop links are muted text with an animated 2px Baltic Blue underline (grows on hover, 300ms); CTAs sit right. On scroll-down the whole bar retreats 100px and fades to 50% (180ms quickTo), returning on scroll-up. Mobile collapses into a full-screen Radix dialog: 3xl display links staggered in at 60ms, exit at 40ms, overlay canvas/95. The logo is "MAT" in Baltic Blue + "x" in Fjord Teal — the whole brand in one wordmark.

### Signature Component: Status Card (the ledger row)
The /tehniline building block: a rounded-xl bordered card (16px) with title, one-line detail, optional "Märkus" note, and a status badge — rendered as a list in two columns. Planned-state cards mute entirely. Technical tokens inside any text are auto-wrapped in IBM Plex Mono via TechText (file paths, ML-DSA-65, RHS § refs, emails), and every claim carries a source. This is the Read-mode surface of the Proof Notebook: claims you can verify.

### Signature Component: Product Fixture
The recurring animated workflow — student answer → verifiable signal → targeted retry → teacher action — reused across hero, evidence, student, and teacher sections. Four panels stagger in at 300ms with the smooth ease, labeled "Näidisandmed": a demo of the evidence loop, never a claim of real results.

## Do's and Don'ts

### Do:
- **Do** use the three-status colors with their fixed icons and badges (Saadaval green+dot+check, Piloodis amber+rocket, Kavandatud neutral+clock) — on both surfaces, every time.
- **Do** alternate canvas and surface section backgrounds with the 6rem fade utilities.
- **Do** keep cards flat at rest; use the card-hover shadow only for interactive lift.
- **Do** keep every interactive target at 44px minimum height.
- **Do** honor `prefers-reduced-motion`: instant visibility, no tweens (the global CSS override plus per-animation guards).
- **Do** render technical tokens (paths, standards, paragraphs, emails) in IBM Plex Mono via the TechText pattern.
- **Do** keep headings un-hyphenated and prose auto-hyphenated with Estonian limits (7-3-3; 8-3-3 in doc prose).
- **Do** put the surface-gapped focus ring on every interactive element.
- **Do** label fixture data "Näidisandmed" whenever the workflow panels render.

### Don't:
- **Don't** invent a fourth status color, restyle the badges, or carry status by color alone.
- **Don't** add structural shadows to stack surfaces — flat at rest, ambient on hover, soft on detached layers only.
- **Don't** use text sizes outside the remapped scale (xs 1rem → 5xl 4.5rem) or reintroduce Tailwind defaults.
- **Don't** hardcode animation durations or easings — every value comes from the motion token module.
- **Don't** hyphenate headings or let them break mid-word, in Estonian or any language.
- **Don't** justify Estonian prose text.
- **Don't** present product-fixture panels or synthetic evidence as real student results.
