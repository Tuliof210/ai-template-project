---
id: 01-module-ownership
applies_to: [all]
severity: must
related: [02-boundary-contracts, 03-dependency-direction]
version: 1.0
---

# Module Ownership

## Principle

Each module owns its internals; outsiders use only its public surface.

## Why

Without ownership, every file becomes everyone's problem. Refactors break unrelated code, conventions drift, and the same logic gets reimplemented because nobody knows where it lives. Ownership is the foundation that makes every other architectural rule possible — you can't enforce contracts on a boundary that doesn't exist.

## Rules

- A module is the smallest unit with a public surface — typically a folder with an `index.{ts,js,py,...}`, a package, or a clearly-named file group.
- Public surface = what's re-exported from the module's entry file. Anything not exported is private.
- External code imports from the entry file, never from internal paths. `@features/login` ✓, `@features/login/internal/jwt-helper` ✗.
- One module is the single source of truth for its concern. If two modules need the same logic, promote it to a shared module rather than copying.
- Folder structure mirrors ownership. A change to feature X should touch files inside `features/X/` and rarely outside it.

## Good example

```
features/checkout/
  index.ts              ← exports startCheckout, CheckoutResult
  start-checkout.ts     ← internal, uses validate, computeTotal
  validate.ts           ← internal
  compute-total.ts      ← internal
  __tests__/
```

Outside code does `import { startCheckout } from '@features/checkout'`. Renaming `compute-total.ts` is safe — no one outside can reach it.

## Violations

- `import { jwtSign } from '@features/login/internal/jwt-helper'` from another feature
- Same validation logic copy-pasted in `features/checkout/` and `features/billing/`
- A single bug fix touches files in 5 unrelated feature folders
- A `utils/` or `helpers/` folder used by everyone, owned by nobody, where new files land when the author isn't sure where they belong

## Conflicts with `06-locality`

Locality says don't promote to shared until reuse justifies it. Ownership says don't reach into other modules. **Resolution:** if you need behavior that lives in another module's internals, either (a) ask that module to expose it through its public surface, or (b) duplicate locally and promote later. Reaching into internals is never the right answer.

## Review checklist

- [ ] All cross-module imports go through entry files (no deep imports into internals)
- [ ] The same logic doesn't appear in two modules
- [ ] Changes are concentrated in one module, not scattered across many
- [ ] New files land in the module that owns the concern, not in a global folder
