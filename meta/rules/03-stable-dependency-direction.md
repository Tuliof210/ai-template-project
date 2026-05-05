# Stable Dependency Direction Rule

## Principle

Stable logic must not depend directly on volatile details.

## Rules

- Core decisions should not be tightly coupled to frameworks, SDKs, transport, storage, browser APIs, or runtime-specific APIs.
- Depend on stable contracts when volatility creates risk.
- Do not create abstractions unless they reduce real coupling or clarify ownership.

## Violations

- Pure logic imports external SDKs directly.
- A small provider/runtime change forces business logic rewrites.
- Interfaces exist only for ceremony.
