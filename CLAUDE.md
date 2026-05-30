# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@spideru/ai-template` is a zero-dependency Node.js CLI that installs and syncs shared AI-agent scaffolding (skills, architecture rules, model guides) into other projects.

Published to npm; downstream teams use `npx @spideru/ai-template init` to bootstrap their repos.

## Commands

```bash
# Run all tests
npm test                    # node --test

# Run a single test file
node --test test/cli.test.js

# Validate before publishing (tests + pack dry-run)
npm run check

# Publish
npm run publish:patch       # bump patch + publish
npm run publish:minor
npm run publish:major
```

## Architecture

The project is intentionally simple — a single implementation file with no build step.

```
bin/ai-template.js   → thin shebang wrapper, delegates to src/cli.js
src/cli.js           → all logic: argument parsing, file copy, command routing
test/cli.test.js     → Node.js native test runner, uses temp dirs for isolation
```

**`src/cli.js` key exports:**
- `run(argv, io)` — command router (`init`, `sync`, `news`, `help`)
- `parseArgs(argv)` — supports `--cwd`, `--force`, `-h/--help`
- `copyManagedFiles(entries, cwd, overwrite)` — recursive copy with diff checking; returns `{created, updated, skipped}` counts
- `main(argv, io)` — wraps `run` with top-level error handling

**Managed file entries** (`syncEntries`, `initEntries` in cli.js): define which source paths in this package map to which target paths in a consumer project. `init` adds `.gitkeep`, `sync` does not.

**Command semantics:**
- `init` — installs files, skips existing (use `--force` to overwrite)
- `sync` — always overwrites managed files (intended for updates)
- `news` — prints the latest `## version` block from `NEWS.md`

## Bundled Content

What gets published and installed into consumer projects:

| Path | Purpose |
|------|---------|
| `.claude/skills/` | Claude Code skill definitions (bootstrap, spec-write, spec-run, spec-fix, code-review, frontend, choose-model, design-system) |
| `.codex/skills/` | Mirror of the above for Codex/OpenAI agents |
| `meta/rules/` | 9 architecture rules (module ownership, boundary contracts, dependency direction, etc.) |
| `meta/models.md` | Model selection guide (Claude + Codex tiers, in Portuguese) |

## Testing Pattern

Tests use `fs.mkdtemp` for isolated temp directories and mock `io` (stdout/stderr streams). No external test framework — native `node --test` only.

## Publishing Gate

`prepublishOnly` runs `npm run check`, which runs tests and a pack dry-run. All must pass before npm will publish.
