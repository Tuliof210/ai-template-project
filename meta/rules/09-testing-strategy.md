---
id: 09-testing-strategy
applies_to: [all]
severity: should
related: [03-dependency-direction, 02-boundary-contracts, 06-locality]
version: 1.0
---

# Testing Strategy

## Principle

Test the things that change behavior. Don't test the framework, don't test the obvious.

## Why

Tests are leverage when they catch regressions and friction when they don't. A codebase with 1000 tests that all break on every refactor is worse than one with 100 tests that survive — the high-test-count codebase loses developers' trust in the suite, and broken tests get muted instead of fixed. The goal is _high signal per test_, not high count or high coverage percentage.

Coverage as a target is a trap: it pushes teams to write tests for trivial code (getters, passthroughs, framework calls) just to hit a number, while the real business logic stays under-tested because it's harder to set up.

## Rules

### What to test

- **Pure logic** (calculations, decisions, transformations, validation rules) — fast unit tests, no setup. These are the highest-ROI tests in any codebase.
- **Boundary contracts** (`02-boundary-contracts`) — validation, serialization, public function signatures. Catches breakage that affects callers.
- **Critical user flows end-to-end** — checkout, login, payment, anything where a regression equals revenue or trust loss. One per critical flow is usually enough.
- **Bugs you fix** — every bug fix gets a test that would have caught the bug. Otherwise the bug returns at the next refactor and the cycle repeats.

### What not to test

- **Framework behavior** (React rendering, Express routing, ORM query building). Trust the framework; if you don't, switch frameworks.
- **Trivial getters/setters/passthroughs.** Testing `id => id` adds noise that hides the real signal.
- **Implementation details.** Testing that function A calls function B couples tests to the internal structure — every refactor breaks tests without behavior changing.
- **Things you can read.** A type-only assertion is a worse type than the type itself.

### How to test

- **Pure logic:** unit tests, no mocks. If you need to mock to test a pure function, the function isn't pure — fix the design (`03-dependency-direction`), don't paper over it with mocks.
- **Adapters:** integration tests against real services in CI when feasible, or contract tests against recorded responses. Mocks lie about provider behavior in ways that only show up in production.
- **End-to-end:** a few, slow, fragile but high-value. Use them sparingly — every E2E test is a tax on every CI run.
- **Snapshot tests:** only for output you'd manually check anyway (rendered components, generated files, formatted output). Snapshots of internal data structures are noise — when they diff, no one reads them and they get rubber-stamped.

### Where tests live

- Co-located with the code they test (`feature/__tests__/` or `feature/x.test.ts`). Avoid mirror-tree `tests/` folders unless the project already uses one — colocation reduces friction to add tests when changing code.

## Good example

```typescript
// pricing.ts — pure logic
export function applyDiscount(total: Money, code: string): Money { ... }

// pricing.test.ts — fast, no setup, high signal
test('applies percent discount', () => {
  expect(applyDiscount(money(100), 'SAVE10')).toEqual(money(90));
});

test('rejects expired code', () => {
  expect(() => applyDiscount(money(100), 'EXPIRED')).toThrow(InvalidDiscount);
});

test('SAVE100 cannot reduce total below zero', () => {  // edge case worth pinning
  expect(applyDiscount(money(50), 'SAVE100')).toEqual(money(0));
});
```

## Violations

- A unit test that needs a database, an HTTP server, and 200 lines of mocks
- 90% coverage on getters and 0% on the actual business logic
- Tests that break on every refactor without ever catching a real regression
- A snapshot of a 500-line internal data structure that nobody reads when it diffs
- A bug fix shipped without a test, then the bug returns 6 months later
- `expect(myFn).toHaveBeenCalledWith(x)` as the only assertion — testing the call, not the result

## Conflicts with `06-locality`

Locality discourages early extraction. But pure logic that's hard to test inline is a signal that it should be extracted into a testable module — the test friction is information about the design. When extracting solely for testability, the new module should still earn its keep by being the natural home for that logic, not just a test target.

## Review checklist

- [ ] New pure logic has unit tests
- [ ] Bug fixes ship with a test that would have caught the bug
- [ ] No tests added solely to drive coverage numbers
- [ ] Mocks are limited to true external boundaries (DBs, networks, time, randomness)
- [ ] No snapshot tests of internal data structures
- [ ] Tests assert results, not call patterns
