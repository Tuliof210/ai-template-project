# AI Template

Reusable Claude/Codex skills, architecture rules, and model guidance distributed as an npm CLI package.

## Usage

Run the package with `npx` from the root of the project you want to configure:

```bash
npx ai-template init
npx ai-template sync
npx ai-template news
```

## Commands

- `init` installs the bundled `.claude/skills`, `.codex/skills`, `meta/rules`, `meta/models.md`, and `meta/features/.gitkeep` into the current project. Existing files are left untouched unless `--force` is passed.
- `sync` updates `.claude/skills`, `.codex/skills`, `meta/rules`, and `meta/models.md` from the package bundle.
- `news` prints the package news in the terminal.

Both `init` and `sync` accept `--cwd <path>` for automation or tests.

## Local Development

```bash
npm test
npm run pack:check
node bin/ai-template.js init --cwd /path/to/project
node bin/ai-template.js sync --cwd /path/to/project
node bin/ai-template.js news
```

## Contents

- `.claude/skills` - Claude-compatible skills.
- `.codex/skills` - Codex-compatible skills.
- `meta/rules` - architecture rules consumed by humans and AI tools.
- `meta/models.md` - practical model and effort selection guide.
- `meta/features/.gitkeep` - placeholder for generated feature specs.
