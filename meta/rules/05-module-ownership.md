# Module Ownership Rule

## Principle

Each module, feature, or package owns its internal implementation.

## Rules

- External code should use public exports/contracts, not internal files.
- Do not reach into another module’s private structure.
- Shared behavior must be intentionally promoted, not copied through hidden imports.
- Ownership boundaries must match the project’s existing structure.

## Violations

- Importing deep private files from another feature/package.
- Multiple modules modifying the same internal state.
- Shared logic duplicated because ownership is unclear.
