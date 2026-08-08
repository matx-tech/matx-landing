# Project Kernel — matx-landing

## Commands
- Dev: `pnpm dev`
- Build: `pnpm build` (verify with `pnpm lint` + `pnpm typecheck` first)
- Lint: `pnpm lint` (oxlint only — eslint removed, do NOT re-add)
- Type-check: `pnpm typecheck`
- Type-aware lint: `pnpm exec oxlint --type-aware --type-check`
- E2E tests: `pnpm test:e2e` (no unit test framework)
- Bundle analysis: `ANALYZE=true pnpm build`

## Conventions that differ from defaults
- Next.js 16 uses `proxy.ts` instead of `middleware.ts` for request interception
- Plausible analytics disabled when `PLAUSIBLE_SCRIPT_URL` env var missing — docs/analytics.md
- Biome ignore comments: `// biome-ignore lint/<group>/<rule>: <reason>` directly above diagnostic line (element-level rules: above `<tag>` line, not attribute)

## Landmines
- **Dual linting:** Biome errors fail commits even when `pnpm lint` passes (biome runs in pre-commit hook)
- **pnpm build scripts:** New deps with build scripts need `allowBuilds: <pkg>: true` in `pnpm-workspace.yaml` or every pnpm command fails with `ERR_PNPM_IGNORED_BUILDS`
- **Type-check warnings:** 8 `no-duplicate-type-constituents` warnings in icon maps are benign — leave them
- **Plausible bot filter:** Without `X-Forwarded-For` header in proxy, Plausible silently rejects events — docs/analytics.md:31-33
- **Plausible goals:** Custom Events must be added as Goals in dashboard after event name definition; events don't count retroactively — docs/analytics.md:53-55
- **Privacy policy:** Currently states no analytics; requires update after Plausible activation — docs/analytics.md:68-70

## Project requirements
- Accessibility: EN 301 549 V3.2.1 / WCAG 2.1 AA mandatory (Estonian public sector requirement since 2019-09-23)
- Identity: HarID/TAAT OIDC standard for Estonian schools
- Domain knowledge: docs/hanked-teadmusbaas-2026-08.md
