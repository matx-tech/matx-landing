# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Põhikooli matemaatikaõpetaja** — primary user and decision-maker. Situation: sees results, but doesn't know which exercise would most help a student next; recurring errors go unnoticed across tasks. Job: decide the next step for each student, with control over the outcome.
- **Õpilane (põhikool, pilootkatsetuses 7.–9. klass)** — practices digitally or on paper; needs a clear, understandable next step, not just a right/wrong mark.
- **Koolijuht** — evaluates fit for school curriculum and support systems; books demo calls.
- **Hankija / riigihanke osapool** — needs transparent, evidence-backed technical and compliance information to purchase under Estonian procurement rules.
- **Kooli IT** — needs architecture, security, and compliance status on one page.

## Product Purpose

MATx (matx.ee) binds student practice, understandable feedback, and the teacher's action recommendation into one trackable workflow: every answer helps find the next step. Success means the teacher makes better-informed next-step decisions per student while retaining full control, and the student always knows what to practice next. The product is in pilot phase with selected schools.

## Positioning

The mechanism a neighboring product could not truthfully copy: a per-answer **evidence loop** — student answer → verifiable error-pattern signal (explicitly a hypothesis, not a final diagnosis) → targeted next exercise → teacher decides (accept / modify / ignore). Claims are honest by construction: every capability carries a status (Saadaval / Piloodis / Kavandatud) and a source, and a published prohibited-phrases list forbids fabricated statistics, guarantees, and compliance overclaims.

## Operating Context

- Estonian basic-school math curriculum; teachers work both digitally and on paper (paper-work scanning is in pilot).
- Pilot phase with selected schools; onboarding via registration form and Calendly demo call (15 min).
- Sales into schools via procurement: below-threshold purchases (under €30,000; from 01.11.2026 under €50,000) and lihthange bands (30,000–59,999 €; from 01.11.2026 50,000–139,999 € state, 50,000–215,999 € municipalities). Per-student annual price; price list and terms still under preparation.
- Site language: Estonian (et_EE), domain matx.ee. Public surfaces: landing page, Tehniline ülevaade (/tehniline), legal pages.

## Capabilities and Constraints

- Capabilities (status in parentheses): digital exercises (Saadaval), paper-work scanning (Piloodis; handwriting recognition has limited accuracy), error-pattern detection (Saadaval; rule-based, verifiable signal — not final diagnosis), targeted exercise recommendation (Saadaval; skill-graph based, teacher reviews), teacher overview (Saadaval), real-time monitoring (Kavandatud), parent report generation (Kavandatud).
- Topic areas (pilot curriculum, 7.–9. klass, Piloodis): korrutamise abivalemid, protsentarvutus, ühe tundmatuga võrrandid — each with 3 competencies.
- Exact error-pattern count is under refinement during the pilot — public copy must not state a precise number.
- GDPR applies from pilot phase; roles depend on each processing activity (school/municipality = controller; MATx = processor under documented instructions, otherwise independent/co-controller). Art. 8 minors' protection: Estonia's age-13 threshold and parental-consent rule apply only to consent-based information-society services offered directly to a child; below 13, legal-representative consent is required. For pilot/student processing, the lawful basis is recorded per activity — Article 8 is not a general student-data basis. Pseudonymisation via HMAC gateway is planned (Kavandatud); DSR de-pseudonymisation.
- NIS2: education not in annexes I/II — no direct obligation; NIS2-based baseline adopted as good practice in pilot (Piloodis status reflects readiness, not formal compliance).
- EU AI Act posture documented on the technical overview page (citation and criteria verified).
- Accessibility target: EN 301 549 / WCAG 2.1 AA; accessibility statement and audit date published with the procurement package.
- Public copy constraints: status vocabulary (Saadaval / Piloodis / Kavandatud) is the single source of truth; prohibited phrases list must not appear in public copy.
- **Undecided:** EU expansion timeline (Estonia first, expansion planned; timeline open).

## Brand Commitments

- Name: MATx; domain matx.ee; site metadata locale et_EE.
- Voice: honest, evidence-first, teacher-respectful Estonian. Core promise: "Soovitused toetavad õpetaja otsust. Õpetaja kontroll säilib."
- National-context claims (PISA 2022, Haridus- ja Teadusministeerium 2023, EHIS 2024) are labeled as context only — MATx is neither cause nor effect.
- No testimonials, fabricated customers, benchmarks, or pricing claims. Real funder endorsements with a public source URL are allowed (quoted, attributed, not testimonials).
- **Time-bounded exception (pilot phase):** free-pilot claims ("Tasuta", "Kohustusteta", "100% tasuta", "Alusta tasuta") are permitted in registration/CTA copy while the TTF-funded pilot phase is open — participation is free for schools during the pilot. No price list, per-student fees, or post-pilot pricing claims until the price list is published.

## Evidence on Hand

- Product fixtures labeled "Näidisandmed": `lib/content/landing-evidence.ts` (synthetic student answers, signals, recommendations — must never be presented as real results).
- Procurement evidence base: `docs/hanked-teadmusbaas-2026-08.md`.
- National context sources (context-only, with limitation labels): PISA 2022; Haridus- ja Teadusministeerium 2023; Eesti Hariduse Infosüsteem 2024.
- Lighthouse audit reports: `.audits/` (mobile + desktop baselines and final reports).
- TTF Phase-1 program (07/2026, €30k): milestones 5/8/7/10 k€; target ≥80% teacher blind agreement with recommendations; ≥70 students; pseudonymised data. Source repo: `MATx-TTF-*` (repo root).
- **Absences (must not fabricate):** published pilot outcome statistics, public test results, customer testimonials, pricing list.

## Product Principles

1. Teacher control is non-negotiable — recommendations support the decision, never replace it.
2. Every claim carries a status and a source; fabricated or unverifiable numbers never ship.
3. Signals are verifiable, not diagnostic — error patterns are hypotheses to confirm, not labels on students.
4. Data protection by design — pseudonymisation and minors' data protection are pilot priorities, not afterthoughts.
5. Evidence first, scale later — a capability is marked Saadaval only after pilot validation.

## Accessibility & Inclusion

- Committed target: EN 301 549 / WCAG 2.1 AA (published on the technical overview page; oversight by TTJA).
- Motion respects `prefers-reduced-motion` (`lib/hooks/use-prefers-reduced-motion.ts`).
- Lighthouse audits run on both mobile and desktop presets as the performance/accessibility gate.
