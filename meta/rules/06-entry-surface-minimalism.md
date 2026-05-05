# Entry Surface Minimalism Rule

## Principle

Entry surfaces should receive input, delegate work, and return/output results.

## Applies To

- UI routes/pages
- API handlers/controllers
- CLI commands
- background jobs
- event handlers
- scripts

## Rules

- Keep entry surfaces thin.
- Move substantial logic into the appropriate project layer/module.
- Entry surfaces may adapt inputs/outputs, but should not own complex behavior.

## Violations

- Large business workflows inside route/page/handler files.
- Parsing, validation, transformation, persistence, and output all mixed in one entry file.
- Repeated logic across multiple entry surfaces.
