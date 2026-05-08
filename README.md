# AI Template

`@spideru/ai-template` is a small Node.js CLI that installs and syncs shared AI-agent project scaffolding.

It packages reusable Claude and Codex skills, architecture rules, and model-selection guidance so a project can be bootstrapped with one command and kept in sync over time.

## Requirements

- Node.js `>=18`

## Quick Start

Run the CLI in the root of the project you want to configure:

```bash
npx @spideru/ai-template init
```

Update previously managed files later with:

```bash
npx @spideru/ai-template sync
```

Read package release notes with:

```bash
npx @spideru/ai-template news
```

## Commands

### `init`

Installs the managed template files into the target project.

- Copies bundled skills for both `.claude` and `.codex`
- Copies `meta/rules` and `meta/models.md`
- Creates `meta/features/.gitkeep`
- Leaves existing files untouched by default

Examples:

```bash
npx @spideru/ai-template init
npx @spideru/ai-template init --cwd ../my-project
npx @spideru/ai-template init --force
```

### `sync`

Refreshes managed files from the package bundle.

- Overwrites managed files with the packaged versions
- Does not create `meta/features/.gitkeep`

Examples:

```bash
npx @spideru/ai-template sync
npx @spideru/ai-template sync --cwd ../my-project
```

### `news`

Prints `NEWS.md` to stdout.

```bash
npx @spideru/ai-template news
```

## Managed Files

The CLI manages these paths:

- `.claude/skills`
- `.codex/skills`
- `meta/rules`
- `meta/models.md`

Additionally, `init` creates:

- `meta/features/.gitkeep`

## CLI Behavior

- `--cwd <path>` changes the target project directory
- `--cwd=<path>` is also supported
- `--force` is supported by `init` and allows overwriting existing files
- `-h`, `--help`, or `help` print usage

After `init` or `sync`, the CLI prints a summary with counts for created, updated, unchanged, and skipped files.
