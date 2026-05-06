---
id: 03-dependency-direction
applies_to: [all]
severity: must
related: [01-module-ownership, 02-boundary-contracts, 06-locality]
version: 1.0
---

# Dependency Direction

## Principle

Stable code doesn't depend on volatile code; core logic doesn't depend on external systems.

## Why

Frameworks change, SDKs deprecate, providers go down, runtimes have quirks. If your business logic imports them directly, every external change radiates outward. Pointing dependencies inward — toward stable abstractions — means the volatile parts can be swapped without rewrites. This is also what makes core logic testable without spinning up a database, a browser, or a mock framework.

## Volatile (don't depend on these from core)

- External SDKs (Stripe, Firebase, OpenAI, AWS clients)
- Frameworks (Next.js, Rails, Django specifics — beyond what they require)
- Browser/Node/runtime APIs (`window`, `fs`, `process`)
- Network, filesystem, environment variables, processes
- Time, randomness, system locale (effectively external — they vary by environment)

## Stable (core can depend on these)

- Plain language primitives (strings, numbers, dates as values)
- Project's own domain types
- Pure utility functions

## Rules

- Core logic (calculations, decisions, transformations, policies) does not import SDKs, framework code, or IO directly.
- External access happens through dedicated adapter modules (`adapters/stripe.ts`, `services/email.ts`, `repositories/user.ts`). Adapters know about the provider; core doesn't.
- Pass dependencies in (parameters, constructor args, function arguments) rather than reaching for globals (`process.env`, singletons, `Date.now()` mid-function).
- If you find yourself mocking 5 things to test a function, the dependencies are flowing the wrong direction — fix the design, not the test.
- **Don't create an abstraction without a second concrete use case OR a real volatility risk.** Premature interfaces are their own coupling. (See `06-locality`.)
- Failure handling for external systems happens at the adapter — the adapter translates provider errors into domain errors. The rest of the codebase doesn't catch `StripeCardError` or `AWS.S3.NoSuchKey`.

## Good example

```typescript
// core/pricing.ts — pure, depends on nothing volatile
export function computeOrderTotal(items: Item[], discount: Discount): Money { ... }

// adapters/stripe.ts — knows about Stripe
export async function chargeCard(amount: Money, token: string): Promise<Receipt> { ... }

// app/checkout.ts — orchestrates
const total = computeOrderTotal(cart, discount);     // core
await chargeCard(total, paymentToken);                // adapter
```

`computeOrderTotal` tests run with no setup. Swapping Stripe for Adyen touches `adapters/`, not `core/`.

## Violations

- `import Stripe from 'stripe'` inside a domain module
- A pricing function that needs a database connection to test
- `process.env.X` read from inside business logic instead of injected
- Validation rules duplicated in HTTP handler + queue worker because core was framework-coupled
- An interface created "for testability" with one implementation that will never have a second
- `Date.now()` called mid-calculation (untestable, non-deterministic) — pass a clock instead

## Exception: where IO is the operation itself

A syscall wrapper, a stream pipe, a file copy utility — the IO _is_ the work. These don't need to be wrapped in adapters; they're already at the right layer. The rule is about keeping IO out of _business logic_, not about banning IO everywhere.

## Conflicts with `06-locality`

Locality discourages premature abstraction; this rule encourages adapters at boundaries. **Resolution:** the line is _trust and volatility, not reuse_. An external SDK is volatile by definition — wrap it even with one caller. An internal helper used by 1 caller is not volatile — leave it inline.

## Review checklist

- [ ] Core/domain modules don't import SDKs, framework internals, or IO
- [ ] External services accessed through named adapter modules
- [ ] Dependencies are passed in, not reached for via globals
- [ ] Pure logic is testable without runtime setup (no DB, no HTTP, no filesystem)
- [ ] Provider-specific error types don't escape the adapter
