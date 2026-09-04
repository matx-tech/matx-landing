---
title: Andri's feedback on the näidistund proposal — analysis
created: 2026-09-04
source: Slack, Tom ↔ Andri Suga, 2026-09-04 07:00–07:31
status: final
---

# Andri's feedback — what was said, what it changes

Andri is the owner. This log is the first owner reaction to the Phase 1 prototype
(`docs/research/naidistund/naidistund.html` + demo video) and to the proposal
`docs/naidistund-ettepanek.md`. Six statements, four of which change scope.

## 1. Verbatim, in order

| # | Speaker | Statement | Type |
| --- | --- | --- | --- |
| A1 | Andri | "Väga hea. Ilus stiilne, selge ja puhas." | Approval — visual direction |
| A2 | Andri | "Lovable versioonis on see mate klaviatuur ka. See voiks ka sisse jaada. Siin näite videos ei pea olema aga testitavas tootes võiks" | New requirement — math keyboard |
| T1 | Tom | "seal klaviatuuril oli ka muid nuppe ja sümboleid mida teemad reaalselt ei käsitle ka? vajaks see ka checki?" | Question — key set scope |
| A3 | Andri | "Oli jah. Selle mottega, et kui gymni laieneda. Ja ka keemia ja fysa juurde votta kunagi. Aga voib praeguses kontekstis ka vahemdada. Hetkel III kooliastme mate on pohiline. Ma votsin samad nupud, mis opiqus on" | Constraint + permission to narrow |
| T2 | Tom | "imo selline tutvustus ja interaktiivne journey on päris hea lahendus ja nišš … lahendaks mitu probleemi … ala registreerimine enne kasutamist et tutvuda asjaga" | Rationale |
| A4 | Andri | "mhm" | Assent to T2 |
| A5 | Andri | "kas sa kasutad seda mikrooskuste taksonoomiat ka?" | New requirement — taxonomy |
| T3 | Tom | "peaks olema" | Commitment |

## 2. What each statement decides

### A1 — the design direction is settled
"Ilus stiilne, selge ja puhas" is approval of the standalone light-theme story
page as built: chalk paper, chapter markers, progress bar, typing indicator,
terracotta error underline, the two-act structure. **Nothing in the visual
language is reopened.** In particular the open decision from
`naidistund-plaan.md` §3.2 — light "paper" product window under the landing's
dark theme — is now settled by approval of the artifact, not by argument.

Note what A1 does *not* cover: Andri approved the prototype's *look*. He gave no
line-level reaction to the script, and none of the seven decisions in
`naidistund-ettepanek.md` §7 were answered explicitly. Those seven assumptions
stand as written; the two that cost real time if wrong (scope = v3-only,
topic = linear equations) were never contradicted, and A5 in fact pushes further
into the equations material, which raises confidence in topic. Treat scope and
topic as **confirmed by non-objection**, not by statement.

### A2 — the math keyboard becomes a requirement, with a boundary
Read the sentence exactly: *"Siin näite videos ei pea olema aga testitavas
tootes võiks."* Two different surfaces:

- **the demo/näidistund** — keyboard *not required*;
- **the testable product** — keyboard *should be there*.

The keyboard exists already: `matxteacher/src/components/MathKeyboard.tsx`,
MathLive-backed, inserts LaTeX at the cursor, Opiq-derived key set, four
categories starting with `kiirvalikud`. It is product code, not landing code.

The tension this creates is the single most important thing in the whole log: a
keyboard is an affordance for **typing**, and the näidistund is deliberately
**choice-based, pre-scripted, no-API, no user data**. Wiring a live keyboard into
the demo would break the honesty label and the "no Anthropic API call" property
that the whole concept rests on.

Resolution taken forward (recorded as an assumption, flagged to Andri):
**the keyboard appears in the demo as visible, non-interactive product chrome** —
rendered under the choice buttons in the demo window, with the real grades 7–9
key set, marked as part of the real product and not usable in the scripted
lesson. The visitor sees what the product gives a student; nobody is misled into
thinking the demo accepts free input. Cost: ~half a day, no change to the engine.
If Andri wants it fully live, that is a different product (real input parsing,
real API) and is out of scope for this landing page.

### A3 — key set: narrow to grades 7–9, keep the wide set in the product
Three facts:

1. The extra symbols are **intentional** — the platform is meant to extend to
   gymnasium, and later to chemistry and physics.
2. "Aga voib praeguses kontekstis ka vahemdada" — permission, not instruction, to
   reduce the set for the current context.
3. "Hetkel III kooliastme mate on pohiline" — grades 7–9 math is the priority.
4. "Ma votsin samad nupud, mis opiqus on" — the key set has a provenance
   (Opiq); it is not arbitrary and should not be redesigned casually.

For the landing page this means: show the **grades 7–9 subset** (arithmetic
operators, fraction, root, power, comparison relations, parentheses, absolute
value), omit the geometry/chemistry/physics categories from the landing copy of
the key data, and do not touch the product's own key set. The reduction is a
landing-page presentation choice, reversible in one data file.

### A4 — the concept is endorsed
"mhm" answers Tom's framing: an interactive introduction is a niche no AI would
invent for itself, and it removes the "register before you can look at anything"
barrier. This confirms the strategic purpose of the conversion — matx.ee stops
being a redirect and becomes a place where a visitor can try something without
handing over data. It also confirms that the registration form stays *after* the
experience, never in front of it.

### A5 + T3 — the teacher view must speak the real taxonomy
Andri's only substantive question. The micro-skill taxonomy is a real, frozen
artifact: `matxteacher/docs/plaan/taksonoomia.md` (ID scheme
`domeen.teema.oskus`, ASCII-folded, class as an attribute rather than part of the
ID; zones `sihtala` / `remediaal` / `pohivara`), plus
`LISA_3_Kulmutatud_taksonoomia.xlsx` and the Supabase migrations.

The prototype's teacher view uses invented labels ("Võrduse omadused", "Sulgude
avamine", …). Andri is asking whether those are the real nodes. Tom's "peaks
olema" commits to making them real. Concretely, the five skill columns should
map onto existing node IDs:

| Prototype column | Taxonomy node |
| --- | --- |
| Võrduse omadused | `algebra.vorrand.omadus_liitmine_lahutamine` (+ `algebra.vorrand.omadus_3`) |
| Kontroll asendamisega | `algebra.vorrand.lahendi_moiste` |
| Sulgude avamine | `algebra.avaldis.sulgude_avamine` |
| Negatiivsed arvud | `arv.negatiivne.moiste` / `arvutus.margireegel.liitmine_lahutamine` |
| Murrud | `algebra.vorrand.murdkordajaga_lihtne` |

These IDs are read off `taksonoomia.md` and **must be verified against the frozen
taxonomy (LISA_3 / the Supabase migrations) before shipping** — the plan doc is a
proposal document and some rows are marked `UUS`. The verification is a story of
its own, not a footnote.

Why this matters beyond correctness: the demo is a shop window for the product's
central claim — that MATx tracks discrete micro-skills, not grades. Displaying
labels that do not exist in the taxonomy would make the shop window a lie in
exactly the dimension the owner cares about.

## 3. Net effect on the plan

| Change | Where it lands | Cost |
| --- | --- | --- |
| Visual direction locked, light window confirmed | removes an open decision from `naidistund-plaan.md` §3.2 | −0 d (removes risk) |
| Math keyboard as non-interactive product chrome, grades 7–9 subset | new epic | +0.5 d |
| Teacher view columns carry real taxonomy node IDs, verified | teacher-view epic gains a story | +0.5 d |
| Scope (v3-only) and topic (equations) confirmed by non-objection | assumptions in `ettepanek.md` §7 hold | 0 |
| Registration stays behind the experience, never in front | already the design | 0 |

Revised total: **6.5 d → 7.5 d.**

## 4. Questions still open for Andri

1. **Keyboard interactivity.** Non-interactive chrome (assumed) or does he want
   the visitor to actually type? The second is a different product.
2. **Taxonomy IDs.** Are the five node IDs above the right ones, and is
   `taksonoomia.md` or LISA_3 the authority when they disagree?
3. **Keyboard placement.** In the demo window only, or also as a static
   screenshot elsewhere on the page (e.g. the `#õpilasele` section)?

None of the three blocks the start of work: 1 and 3 are presentation-layer and
reversible in a day, 2 is verifiable against the repo without Andri.
