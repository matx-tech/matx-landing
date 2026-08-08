# MATx Landing — Agent Guide

Next.js 16 (App Router; request interception lives in `proxy.ts`, the Next 16 replacement for `middleware.ts`) + TypeScript strict + Tailwind v4 + GSAP/Lenis. Package manager: pnpm.

**Context system:** Load `docs/kernel.md` for commands, conventions, landmines, and project requirements.

## Scripts

| Command | What |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Next dev / build / start |
| `pnpm lint` | oxlint — the lint gate (respects .gitignore) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test:e2e` | Playwright |
| `pnpm audit:mobile` / `pnpm audit:desktop` | Lighthouse against a running `localhost:3000` |

## Toolchain (eslint intentionally removed — do not re-add)

- **oxlint** = lint gate (`pnpm lint`). Type-aware pass: `pnpm exec oxlint --type-aware --type-check` (backs onto `oxlint-tsgolint`, the tsgo compiler; whole project, ~1s).
- **biome** = formatter + safe fixes: `pnpm exec biome check --write <files>`. Config `biome.json`: single quotes, recommended rules, `.gitignore` honored via `vcs.useIgnoreFile` (biome 2.x has no `files.ignore`).
- **Both lint.** Biome's linter also runs in the pre-commit hook — a biome lint error fails the commit even when `pnpm lint` passes.
- Ignore comments: oxlint honors legacy `eslint-disable` comments. Biome needs `// biome-ignore lint/<group>/<rule>: <reason>` on the line directly above where the diagnostic starts (attribute-level rules: above the attribute; element-level rules like `a11y/*`: above the `<tag>` line — above the attribute does NOT suppress).
- Known benign output: `oxlint --type-aware --type-check` emits 8 `no-duplicate-type-constituents` warnings in the icon maps (structurally identical lucide components) — leave them.
- New dependency with a build script: approve it in `pnpm-workspace.yaml` → `allowBuilds: <pkg>: true`, otherwise every pnpm command fails with `ERR_PNPM_IGNORED_BUILDS`.

## Verify before committing

```sh
pnpm lint && pnpm typecheck && pnpm build
```

## Pre-commit (lefthook, `lefthook.yml`)

Auto-wired via the `prepare` script after `pnpm install` (`pnpm lefthook install` to re-sync). Runs in parallel on staged files:

- `biome check --write --no-errors-on-unmatched` (`stage_fixed`) on `*.{js,ts,jsx,tsx,json,css}`
- `oxlint` on staged `*.{js,ts,jsx,tsx}`
- `oxlint --type-aware --type-check` (whole project)
- `code-review-graph update` + `detect-changes` (MCP knowledge graph)

Nothing staged → the hook no-ops entirely (commands report "skip").

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
