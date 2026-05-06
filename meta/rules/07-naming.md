---
id: 07-naming
applies_to: [all]
severity: should
related: [04-flow-clarity]
version: 1.0
---

# Naming

## Principle

Names describe purpose, not implementation. A reader infers behavior from the name without opening the file.

## Why

Names are the primary interface between human and code — far more than types, comments, or docs. Bad names force readers to open every file, every function, every variable to understand what's going on. Names also outlast implementations: `processData` survives three rewrites and tells you nothing each time. Naming is also where domain knowledge gets encoded; a codebase whose names match the business is one a new dev can read fluently within a week.

## Rules

### Functions

- Verbs that describe the **outcome** (`chargeCard`, `validateInvoice`, `loadUser`, `expireSession`).
- Avoid `handleX`, `doX`, `processX`, `manageX`, `executeX` — they describe activity, not result.
- If the function returns a value, the name often matches what it returns: `getActiveUsers`, `findOrderById`, `computeTotal`.

### Variables

- Nouns that describe content. Plurals for collections (`users`, not `userList` or `userArray`).
- No type encoding (`strName`, `arrItems`, `objConfig`). The type system already knows.
- No Hungarian-style prefixes.

### Booleans

- Read as predicates: `isReady`, `hasPermission`, `canEdit`, `shouldRetry`.
- Avoid negative names (`isNotReady`). Invert the meaning to `isReady` and negate at the call site.

### Files

- Match what they export. A file exporting one function is named after that function (`charge-card.ts`). A file exporting a module is named for the module.
- Use the project's case convention consistently (kebab vs camel vs snake).

### General

- **Avoid abbreviations** unless they're domain-standard. `usr`, `ctx`, `cfg`, `mgr` — all noise. `URL`, `HTTP`, `JSON`, `ID` — fine, they're standard.
- **Length tracks scope.** A loop variable can be `i`. A module-level constant can't.
- **Domain language wins.** If the business calls them "shipments", don't call them "packages" in code. If accountants call it "accrual", don't call it "delayed entry".
- **No marketing words.** "smart", "simple", "powerful", "robust", "advanced" don't belong in code names.
- **No "Manager" / "Helper" / "Util" suffixes** unless the role is genuinely that vague (and if it is, the design probably needs work).

## Good example

```typescript
// reads naturally from left to right
const overdueInvoices = await loadOverdueInvoices(customerId);
const reminderResult = await sendPaymentReminder(overdueInvoices);
if (reminderResult.failed) {
  await escalateToCollections(customerId);
}
```

## Violations

- `function processData(d: any)` — both name and signature say nothing
- `const flag = true` at module scope
- `const userArr: User[]` — type encoded in name
- `function handleClick()` for a function that submits a form — call it `submitForm`
- `class SmartUserManager` — marketing + manager suffix, almost always vague
- `function checkUser(u)` — check what? returns what?
- `const isNotEmpty = !arr.length` — invert: `const hasItems = arr.length > 0`

## Naming during refactor

A name that's wrong is worse than a name that's old. If a function's behavior has drifted from its name across edits, rename it in the same diff. Stale names are debt that compounds — every reader who trusts the old name pays interest on it.

## Review checklist

- [ ] Function names describe outcomes, not "handle/process/do"
- [ ] No type encoding in variable names
- [ ] Booleans read as positive predicates
- [ ] Domain language matches the business vocabulary
- [ ] No marketing words, no vague "Manager"/"Helper" suffixes
- [ ] Renamed when behavior changed, not left stale
