# Explicit Boundary Contracts Rule

## Principle

Crossing a boundary must be explicit, validated when needed, and stable.

## Boundaries Include

- user input
- module APIs
- package exports
- network requests
- persistence
- generated data
- third-party providers
- UI/component interfaces
- public functions

## Rules

- Define expected input and output shapes.
- Validate untrusted data before use.
- Transform data intentionally between boundaries.
- Do not silently change public contracts.
- Preserve backwards compatibility unless the task explicitly allows breaking changes.

## Violations

- Passing raw unvalidated data across layers.
- Changing response/event/export shapes without noting impact.
- Relying on implicit object structure from another module.
