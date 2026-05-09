# AI Template News

## 0.2.5

- Added `spec-fix` skill to fix implementations that fail validation, tests, or runtime behavior after `spec-run`.

## 0.2.0

- Split the old `spec` skill into `spec-write` and `spec-run` so planning and execution can be used independently in both bundled Claude and Codex skill sets.

## 0.1.3

- Expanded the package documentation with clearer README guidance for installation, commands, managed files, and publishing workflows.

## 0.1.2

- Polished the CLI package docs and packaging metadata for a smoother npm publishing flow.

## 0.1.1

- Refined the initial package setup and bundled project scaffolding after the first release.

## 0.1.0

- Added the `ai-template` CLI for `npx ai-template init`, `npx ai-template sync`, and `npx ai-template news`.
- `init` installs the bundled Claude/Codex skills, architecture rules, model guidance, and `meta/features/.gitkeep` into the current project without overwriting existing files.
- `sync` updates the bundled Claude/Codex skills, `meta/rules`, and `meta/models.md` in the current project.
- `news` prints this package news directly in the terminal.
