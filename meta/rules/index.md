# Architecture Rules

These are project rules for how code should be structured. They're consumed by humans and by AI tools (`spec`, `code-review`, etc.). Each rule file is self-contained.

## Rules

| File                         | Severity | Applies to             | What it covers                                                |
| ---------------------------- | -------- | ---------------------- | ------------------------------------------------------------- |
| `01-module-ownership.md`     | must     | all                    | What's a module, who owns it, public vs private               |
| `02-boundary-contracts.md`   | must     | all                    | What crosses a module boundary (types, validation, evolution) |
| `03-dependency-direction.md` | must     | all                    | Stable doesn't depend on volatile; IO/external contained      |
| `04-flow-clarity.md`         | should   | all                    | Data and control flow are traceable                           |
| `05-entry-thinness.md`       | should   | web-app, cli, monorepo | HTTP/CLI/event entries are thin adapters                      |
| `06-locality.md`             | should   | all                    | Don't abstract until reuse justifies it                       |
| `07-naming.md`               | should   | all                    | Names describe purpose, not implementation                    |
| `08-error-model.md`          | must     | all                    | Single, explicit error philosophy per project                 |
| `09-testing-strategy.md`     | should   | all                    | What to test, where, with what kind of test                   |

## How to read these

- **Filter by `applies_to` first.** Don't load rules irrelevant to the project archetype. The frontmatter on each rule lists which archetypes it applies to.
- **Severity guides priority in code review.** `must` violations block; `should` violations warrant a finding; `prefer` violations are notes.
- **`related` field at the top of each rule** points to rules likely to apply together.
- **`Conflicts with` sections** inside each rule resolve precedence with adjacent rules — important because several rules push toward extraction while `06-locality` pushes back.
- **`Review checklist` sections** are written for mechanical consumption. The `code-review` skill can apply these directly.

## Project archetype

Set the project's archetype in `CLAUDE.md` so consumers know which rules apply. Archetypes: `web-app`, `library`, `cli`, `monorepo`, `infra`, `ml-data`, `script-collection`. If unset, assume `web-app` and note the assumption in the output.

## What's deliberately not here

- **Design tokens / Tailwind / visual systems** — frontend-specific, lives in `frontend/` if you have it. Mixing it into the general architecture rules confuses non-frontend repos.
- **Async patterns, logging, observability, performance** — important but project-and-stack-specific. Add as separate rules when the project's choices stabilize.
- **Comments and docstrings** — closer to style than architecture; covered by linters or style guides.

## Updating

When changing a rule, bump its `version` in the frontmatter and add a one-line note at the bottom describing what changed and why. Past sessions may reference old behavior; the version makes drift visible.
