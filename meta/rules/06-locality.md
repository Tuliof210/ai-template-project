---
id: 06-locality
applies_to: [all]
severity: should
related: [01-module-ownership, 03-dependency-direction]
version: 1.0
---

# Locality Before Abstraction

## Principle

Code lives close to where it's used until reuse or volatility justifies extraction.

## Why

Premature abstraction is more expensive than late abstraction. Abstractions written before there are 2–3 concrete use cases are guesses about future needs — and they're usually wrong, because the future case has details the present can't see. Extracted code also adds friction: a reader chasing a bug now has to navigate from caller to abstraction and back, often through layers of generic code that handle cases the project will never have.

This rule exists deliberately as a counterweight to ownership/contracts/dependency-direction rules, all of which push toward extraction. Without locality, every codebase grows a `utils/` folder full of one-caller helpers and an `interfaces/` folder full of single-implementer abstractions — both are debt that survives whatever benefit motivated them.

## Rules

- Helpers used by one caller live next to the caller, not in a shared folder.
- Components used by one parent live next to the parent.
- Abstractions appear when there's a _second concrete use case_ OR a _real volatility risk_ (see `03-dependency-direction`) — not earlier. Rule of three is a fine heuristic.
- A `utils/` or `helpers/` folder is acceptable only if its contents are genuinely cross-cutting (date formatting, string normalization, logging primitives). It's not a parking lot for "I might reuse this someday."
- When in doubt, inline. Extracting later is cheap; un-extracting is socially expensive (people will defend the abstraction even after it stops paying for itself).
- Duplication of 5–10 lines in two places is fine. Duplication of 50 lines in two places is a signal. Use judgment, not a line counter.

## Good example

```typescript
// features/invoices/list-invoices.ts
//   - has a 6-line `formatCurrency` helper at the bottom of the file

// features/billing/send-receipt.ts
//   - has its own 6-line `formatCurrency` (yes, duplicated for now)

// When a third caller appears, OR formatting needs to handle locales,
// promote to features/shared/format-currency.ts.
```

## Violations

- `utils/format-name.ts` imported by exactly one file
- `IUserRepository` interface with one implementation, created "in case we swap it later"
- Generic `<DataTable<T>>` component used only for the users page, taking 8 type parameters to handle imagined future cases
- A 50-file `helpers/` folder where most files have one or zero callers
- Extracting a function the moment it's written, before any second caller exists

## Conflicts with `01-module-ownership` and `03-dependency-direction`

Those rules push toward extraction (ownership boundaries, contracts, isolating volatile dependencies). Locality pushes back. **Resolution:** the deciding axis is **trust and volatility, not just reuse**. External SDKs and untrusted inputs are volatile by definition — wrap them even with one caller. Internal helpers and domain logic with no volatility don't earn their abstraction until reuse appears. When unsure, inline; revisit at the next change.

## Review checklist

- [ ] New helpers added in this diff have at least 2 callers, OR are clearly volatile
- [ ] No interface/abstraction added with a single implementation (without explicit volatility justification)
- [ ] Generic-looking components aren't generic for a single use case
- [ ] Additions to `utils/`/`helpers/` are genuinely cross-cutting, not "I might need this"
