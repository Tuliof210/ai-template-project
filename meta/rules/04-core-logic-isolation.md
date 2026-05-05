# Core Logic Isolation Rule

## Principle

Important project logic should be testable without unrelated runtime dependencies.

## Rules

- Keep calculations, decisions, transformations, and policies separate from IO when practical.
- Do not require network, storage, UI runtime, or framework bootstrapping to test core behavior.
- Runtime-specific code should call core logic, not be embedded inside it.

## Violations

- Data transformation requires a browser, server, database, or framework instance.
- Validation rules are duplicated across runtime-specific layers.
- Core behavior is only testable through full end-to-end execution.
