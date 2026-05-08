<!-- Generated 2026-05 by bootstrap skill. Re-run if the project structure changes substantially. -->
# ai-template

Npm CLI package that installs and syncs reusable Claude/Codex skills, architecture rules, and model guidance into another project. Runtime code is plain CommonJS on Node 18+ with no external dependencies. Tests live in `test/` and run with Node's built-in test runner.

## Commands
- `npm test` - run `node --test`.
- `npm run pack:check` - run `npm pack --dry-run`.
- `node bin/ai-template.js init --cwd /path/to/project` - install bundled files locally without overwriting existing files.
- `node bin/ai-template.js sync --cwd /path/to/project` - update managed bundled files locally.
- `node bin/ai-template.js news` - print package news.

## Entry Point
- `bin/ai-template.js` - executable npm bin that delegates to `src/cli.js`.
- `src/cli.js` - command parsing, file copy behavior, summaries, and exports used by tests.

## Layout
- `.claude/skills/` - Claude-compatible skill payload copied by `init` and `sync`.
- `.codex/skills/` - Codex-compatible skill payload copied by `init` and `sync`.
- `meta/rules/` - architecture rule payload copied by `init` and `sync`.
- `meta/models.md` - model and effort selection guide copied by `init` and `sync`.
- `meta/features/.gitkeep` - placeholder copied only by `init`.
- `test/` - Node test files for CLI behavior.

## Public API Surface
- Npm bin: `ai-template`.
- Supported commands: `init`, `sync`, `news`.
- `init` skips existing files unless `--force` is passed.
- `sync` overwrites changed managed files and leaves unrelated files alone.

## Conventions
- JavaScript files use CommonJS (`require`, `module.exports`) and start with `"use strict"`.
- CLI behavior stays in `src/cli.js`; `bin/ai-template.js` remains a thin adapter.
- Tests use `node:test` plus `node:assert/strict`.
- Skill payload files are named `SKILL.md` under `.claude/skills/<skill>/` and `.codex/skills/<skill>/`.
- Rule files in `meta/rules/` use numeric prefixes to preserve reading order.
- Package contents are controlled by `package.json#files`; verify hidden payload directories with `npm pack --dry-run`.

## Notes
- Project archetype: `cli`.
- The package name is currently `ai-template`; verify availability before publishing to npm.
- Local npm cache permissions can affect `npm pack`; a temporary cache works for verification when needed.
