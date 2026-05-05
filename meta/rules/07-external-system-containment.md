# External System Containment Rule

## Principle

External systems must be isolated behind controlled boundaries.

## External Systems Include

- databases
- APIs
- SDKs
- browser APIs
- filesystem
- queues
- analytics
- payment/email/AI providers
- environment/config

## Rules

- Access external systems through dedicated modules, services, adapters, or utilities.
- Handle failure at the boundary.
- Do not leak provider-specific details across the codebase.
- Keep secrets and sensitive config out of public/runtime-exposed surfaces.

## Violations

- SDK calls scattered across unrelated files.
- Raw provider errors leaking to users.
- Direct environment reads spread throughout business logic.
