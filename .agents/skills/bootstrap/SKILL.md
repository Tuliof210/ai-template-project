---
name: bootstrap
description: Generate a AGENTS.md file at the repo root by detecting the project's stack, commands, and conventions from the filesystem. Use whenever the user says any variant of "set up AGENTS.md", "bootstrap AGENTS.md", "gera AGENTS.md", "criar AGENTS.md pro projeto", "make a AGENTS.md for this repo", "no AI context yet, set me up", or starts non-trivial work in a fresh repo that lacks one. Also fire proactively when the user begins a session in a repo without AGENTS.md and is about to do feature work that future sessions would benefit from having context for. Generates exactly one file — never scaffolds directories, modifies `.gitignore`, or proposes follow-up structure.
---

# Bootstrap AGENTS.md

Goal: produce a single `AGENTS.md` at the repo root that a future session can read in 30 seconds and use to orient itself in this codebase. Nothing else.

The hard part isn't generating markdown — it's resisting the urge to do anything beyond that. Bootstrap is the highest-risk moment for scope creep, because the repo is fresh and the model wants to be helpful. Stay narrow.

## Hard scope

Generate **one file**: `AGENTS.md` at the repository root. Do not:

- create other files or directories
- modify `.gitignore` or any existing file
- create symlinks
- scaffold an `AI/`, `meta/`, or `docs/` structure
- propose next steps or follow-up commands

If the user wants more after AGENTS.md exists, they'll ask.

## Phase 0 — Pre-flight

Check whether `AGENTS.md` already exists at the root. If it does, ask:

1. **Show me the current one first** — print contents, then re-prompt
2. **Overwrite** (back up to `AGENTS.md.bak` first)
3. **Abort**

Wait for the choice. Don't assume — overwriting silently can destroy hand-written context the user values.

## Phase 1 — Detect

Read the filesystem in this order. Stop once you have enough to fill the template — exhaustive scanning isn't the goal.

### Repo archetype

This is the most important detection — the template adapts to it. Pick the dominant frame; hybrids are normal.

| Archetype           | Strong signal                                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `web-app`           | Framework deps (Next, Nuxt, Remix, Rails, Django, Phoenix, etc.) + an entry point that serves HTTP                                                                 |
| `library`           | `package.json` with `main`/`exports` and no app entry, or PyPI/Cargo/Hex package config; tooling oriented to publishing                                            |
| `cli`               | Entry declared as npm `bin`, `console_scripts` (pyproject), `[[bin]]` (Cargo), or a single executable script in repo root                                          |
| `monorepo`          | `workspaces`, `pnpm-workspace.yaml`, `turbo.json`, `lerna.json`, `nx.json`, `[workspace]` in Cargo, or multiple `package.json` under `apps/`/`packages/`/`crates/` |
| `infra`             | Terraform (`*.tf`), Pulumi, Helm chart, Ansible, CDK; config-as-code with no runtime                                                                               |
| `docs`              | Docusaurus, Astro content site, MkDocs, Hugo, Jekyll; mostly markdown, builds static HTML                                                                          |
| `ml-data`           | Notebooks present, deps include `torch`/`tensorflow`/`scikit-learn`, `data/`/`experiments/`/`notebooks/` dirs                                                      |
| `script-collection` | Loose scripts (`.sh`, `.py`, `.ts`) without packaging, no clear entry point                                                                                        |

If the signal is genuinely ambiguous, ask the user to pick rather than guessing — a wrong archetype produces a misleading template.

### Stack

Read the first that exists, extract scripts/commands, framework hints, and package manager:

1. `package.json` → JS/TS. Lockfile reveals manager: `package-lock.json` (npm), `yarn.lock` (yarn), `pnpm-lock.yaml` (pnpm), `bun.lockb` (bun)
2. `pyproject.toml` / `requirements.txt` / `Pipfile` / `setup.py` → Python
3. `Cargo.toml` → Rust
4. `go.mod` → Go
5. `Gemfile` → Ruby
6. `composer.json` → PHP
7. `mix.exs` → Elixir
8. `pubspec.yaml` → Dart/Flutter

### Layout

`ls` the root, skipping `node_modules`, `.git`, `dist`, `build`, `.next`, `target`, `__pycache__`, `.venv`, `.cache`. List the top-level dirs that contain source or matter for navigation. Don't list everything — only what a new dev would need to know to find their way.

### Convention signals

Read 3–6 source files (not configs) to extract real patterns. Conventions count only if you can point at the same pattern in **2+ files** — a single occurrence is style, not convention. Look for:

- File naming (kebab vs camel vs snake)
- Import order or path aliases
- Error handling shape (thrown? returned? logged?)
- Test file location and naming
- Where shared types/interfaces live

If you can't anchor a pattern in 2+ files, omit it. Inventing conventions is worse than under-documenting them — future sessions will follow the lie.

### Git as a convention source

Cheap, high-signal, often skipped:

- `git log --oneline -30` — commit message conventions (Conventional Commits? type prefixes? prose language?)
- `git branch -r | head -20` — branch naming patterns

If git is empty or unavailable, skip silently.

Don't ask the user anything yet — gather first.

## Phase 2 — Ask

Ask only what couldn't be inferred. Group all questions in one message. If everything's clear from Phase 1, skip this phase entirely and just confirm inferred values once before generating.

1. **Project name** — suggest detected (prefer `package.json#name`, then `Cargo.toml`, then directory name). Ask only to confirm if sources disagree.
2. **One-line description** — what this is, in plain language, for a new dev landing in the repo.
3. **Doc language** — default to English (most resilient across future sessions and stable across teams). Offer the user's conversation language if they've clearly been using something else.
4. **Anything specific to surface** — optional, free-form: env vars, services to run locally, gotchas, dependencies on external systems.

Keep it short. The user wants to get back to work.

## Phase 3 — Generate

Write `AGENTS.md` at the repo root. Aim for **30–80 lines** — concise enough to read in full, complete enough to actually orient. If you're past 80, you have decorative content to cut.

### Header stamp

Start with this comment so future sessions can spot staleness:

```
<!-- Generated YYYY-MM by bootstrap skill. Re-run if the project structure changes substantially. -->
```

### Base template

```
# <Project Name>

<One paragraph: what it is, primary stack, runtime shape, where tests live. No marketing language.>

## Commands
- <run-dev-or-equivalent>
- <build>
- <test>
- <lint or typecheck>

## Layout
- <top-level dirs that matter, one line each>

## Conventions
- <3–8 conventions, each anchored in observed pattern>

## Notes
- <2–4 lines max: gotchas, where env example lives, services to run locally>
```

### Archetype adaptations

Replace or restructure sections based on the archetype — don't pile sections on top of the base.

- **`monorepo`** — split `Commands` into `Root commands` + `Per-workspace`. Replace `Layout` with `Workspaces`, listing each app/package with one line. Add `## Where to start` pointing at the most-used workspace.
- **`library`** — `Commands` becomes build/test/publish (no dev server). Add `## Public API surface` listing the entry points consumers import.
- **`cli`** — add `## Entry point` (file path of the bin). `Commands` includes how to run the CLI locally during development.
- **`infra`** — `Commands` becomes plan/apply/destroy. `Layout` is by environment (`envs/staging`, `envs/prod`) or by stack.
- **`docs`** — `Commands` is dev/build for the static site. Add `## Content lives` pointing at the markdown root.
- **`ml-data`** — add `## Data` (where it lives, what's gitignored) and `## Experiments` (where notebooks/runs go). `Commands` may be empty if everything is notebook-driven; say so explicitly rather than fabricating.
- **`script-collection`** — `Commands` may be empty. Replace `Layout` with `Scripts`, listing key entries with what each does.

### Optional extra sections

You may add **at most 2** extra sections beyond the base if they're genuinely useful for orientation. Common useful ones: `## Local setup`, `## Where things live`, `## Services`, `## Env vars`.

Do not add decorative sections: no badges, no contributor lists, no license blurb, no "About" puffery, no roadmap, no architecture diagrams you didn't see in the code.

### Anti-fabrication rules

These are the difference between a AGENTS.md that helps and one that poisons future sessions:

- Include only what was detected or confirmed by the user. If a command isn't in `package.json` scripts (or equivalent), don't invent it.
- Mark genuine unknowns as `<unknown>` rather than guessing. The file will be trusted; lying in it costs more than admitting a gap.
- Don't include conventions you can't point at in 2+ files.
- Don't describe architecture you didn't read. "Clean architecture, separation of concerns" is fabrication unless the layout actually shows layers.
- Don't include security claims, performance characteristics, or test coverage numbers unless you directly observed them in code or config.

## Phase 4 — Output

When writing `AGENTS.md` to disk, write **only the file's content** — no preamble, no explanation, no markdown fence wrapping the file body, no postscript. Confirmations from Phase 0 and questions from Phase 2 happen in normal chat; the file write itself is bare.

After writing, output exactly one line in chat: `AGENTS.md generated (N lines).` Nothing more — no summary, no "let me know if…", no proposed next steps.

## Behavior

- If you can't tell the archetype confidently, ask the user to pick from the list. A wrong archetype produces a misleading file.
- If the repo is genuinely empty or has no detectable stack, say so and ask whether to write a minimal placeholder AGENTS.md or abort.
- Don't apologize for missing data. `<unknown>` is the right answer when the data isn't there.
- Don't suggest improvements to the repo itself. Bootstrap reads, doesn't prescribe.
- Don't add "Last updated by Codex" or similar attribution beyond the date stamp.

## Examples

### Library (TypeScript package)

```
<!-- Generated 2026-05 by bootstrap skill. Re-run if the project structure changes substantially. -->
# parser-utils

A small TypeScript library of parsing helpers (CSV, NDJSON, query strings). Published to npm. Tests run with vitest.

## Commands
- `pnpm build` — tsup bundle to `dist/`
- `pnpm test` — vitest, watch mode by default
- `pnpm lint` — eslint + prettier
- `pnpm release` — changesets-based publish

## Layout
- `src/` — source modules, one file per parser
- `src/__tests__/` — colocated tests
- `dist/` — build output (gitignored)

## Public API surface
- `src/index.ts` re-exports everything intended for consumers

## Conventions
- File names kebab-case; exports camelCase
- Each parser module exports `parse` and a `ParseResult` type
- Errors thrown as a `ParserError` subclass, never raw `Error`
- Tests live next to source as `*.test.ts`
- Commits use Conventional Commits (`feat:`, `fix:`, `chore:`)

## Notes
- Node 20+ required
- No env vars; library is pure
```

### Monorepo (apps + packages)

```
<!-- Generated 2026-05 by bootstrap skill. Re-run if the project structure changes substantially. -->
# acme

Turborepo monorepo: a Next.js web app, an Expo mobile app, and shared packages. pnpm workspaces.

## Root commands
- `pnpm dev` — turbo run dev across all apps
- `pnpm build` — turbo build
- `pnpm test` — turbo test
- `pnpm lint` — turbo lint

## Workspaces
- `apps/web` — Next.js 15, app router
- `apps/mobile` — Expo SDK 51
- `packages/ui` — shared React components
- `packages/db` — Drizzle schema + client
- `packages/config` — eslint/tsconfig presets

## Where to start
Most feature work happens in `apps/web`. DB changes go through `packages/db` first.

## Conventions
- Each workspace owns its own scripts; root delegates via turbo
- Cross-workspace imports use `@acme/*` aliases
- Shared types live in `packages/db/src/types.ts`, not duplicated per-app
- Branch names follow `<type>/<short-desc>` (`feat/login`, `fix/checkout-race`)

## Notes
- Run `pnpm db:push` after pulling if migrations changed
- `.env.example` at root lists required vars
```

## Versioning

`v1.0` — 2026-05.
