---
id: 04-flow-clarity
applies_to: [all]
severity: should
related: [01-module-ownership, 05-entry-thinness]
version: 1.0
---

# Flow Clarity

## Principle

A reader can trace where data enters, how it transforms, and where it leaves.

## Why

Code that's hard to trace is code that's hard to debug, hard to change safely, and hard to onboard new people into. Most "spooky action at a distance" bugs come from flow opacity — a value changes and you can't tell why. Reactive systems (signals, observables, event buses) are powerful but trade flow clarity for ergonomics; they need to be used intentionally, not as a workaround for poorly-defined module boundaries.

## Rules

- Prefer explicit orchestration: a function calls A, then B, then C, with values passed between them. The flow is on the page.
- State mutations live close to what triggers them. A button click that mutates state on the other side of the app is suspect — the trigger and the effect should be discoverable from each other.
- No circular imports. They're almost always a sign that two modules want to be one — or that a third module wants to extract.
- No hidden bidirectional coupling: module A imports B, and B reaches A through an indirect path (event bus, global store, callback). One of those imports needs to go.
- Reactive primitives (signals, observers, event handlers) are fine when the framework expects them and the dependency direction is documented. They're not fine as a way to avoid drawing module boundaries.
- Async flow follows the same rule: a reader should be able to follow a Promise/Future from creation to resolution without spelunking. Fire-and-forget patterns need a clear reason.

## Good example

```typescript
// orchestrator — the flow is visible end-to-end
async function processOrder(orderId: string): Promise<Order> {
  const order = await loadOrder(orderId);
  const validated = validateOrder(order);
  const priced = applyPricing(validated);
  const charged = await chargePayment(priced);
  await persistResult(charged);
  await notifyCustomer(charged);
  return charged;
}
```

## Violations

- Circular imports (A → B → A, even through 3 hops)
- Business behavior split across 4 unrelated event handlers in 4 files, with no entry point that names the whole flow
- A function that mutates global state as a side effect with no indication in its name
- A signal/observable updated from 6 unrelated places, with no clear owner and no audit trail
- An async chain where errors are swallowed silently and the caller can't tell what failed
- A `useEffect`/watcher that triggers another `useEffect`/watcher in a chain — flow becomes a graph instead of a line

## Conflicts with `06-locality`

Locality favors short, in-place code. Flow clarity sometimes favors named intermediate steps. **Resolution:** if the in-place version is shorter than the orchestrator and equally readable, leave it. If naming the steps makes the flow obvious, extract them — even for one caller. Naming things you can't see is a real cost.

## Review checklist

- [ ] No circular imports
- [ ] State mutations are traceable to a clear trigger
- [ ] Async flow has a single visible chain or orchestrator
- [ ] Behavior for one user action lives in one place, not scattered across handlers
- [ ] Reactive updates have a documented owner, not just "whoever needs them"
