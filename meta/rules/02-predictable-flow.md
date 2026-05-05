# Predictable Flow Rule

## Principle

Control flow and data flow must be easy to trace.

## Rules

- A reader must be able to follow where data enters, how it changes, and where it leaves.
- Avoid hidden bidirectional coupling.
- Avoid circular dependencies.
- Prefer explicit orchestration over implicit side effects.

## Violations

- Circular imports.
- State changes triggered from unexpected places.
- Business behavior spread across disconnected callbacks/files.
