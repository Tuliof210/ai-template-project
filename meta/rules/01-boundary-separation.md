# Boundary Separation Rule

## Principle

Different responsibilities must live behind clear boundaries.

## Rules

- Do not mix unrelated responsibilities in the same unit.
- Keep input handling, core logic, side effects, and output formatting separable.
- A file/module may combine responsibilities only when the result stays simple and cohesive.
- Boundaries must follow the project’s existing architecture, not a generic template.

## Violations

- One file handles UI, validation, persistence, analytics, and formatting.
- Core logic depends on unstable external details.
- A change in one concern forces unrelated concerns to change.
