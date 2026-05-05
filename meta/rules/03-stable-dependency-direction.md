# Stable Dependency Direction Rule

## Principle

Stable logic must not depend directly on volatile details.

## Rules

- Core decisions should not be tightly coupled to frameworks, SDKs, transport, storage, browser APIs, or runtime-specific APIs.
- Depend on stable contracts when volatility creates risk.
- Do not create abstractions unless they reduce real coupling or clarify ownership.
- Stable visual decisions should live in the design token layer, and volatile implementation details should consume those tokens.
- Colors, typography, semantic surfaces, shared shadows, and shared shell dimensions should come from tokens rather than ad hoc values in components.
- Tailwind utilities may be used directly for local layout implementation details such as spacing, gap, flex behavior, alignment, and small one-off sizing when those values are not shared semantic decisions.
- Promote a visual value to a token when it is reused, user-visible as part of the product language, or important to consistency across screens.

## Violations

- Pure logic imports external SDKs directly.
- A small provider/runtime change forces business logic rewrites.
- Interfaces exist only for ceremony.
- Components duplicate brand or semantic visual values outside the token layer.
- Teams create tokens for every local Tailwind spacing or sizing utility even when no shared semantic value exists.
