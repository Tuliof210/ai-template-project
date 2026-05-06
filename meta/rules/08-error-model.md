---
id: 08-error-model
applies_to: [all]
severity: must
related: [02-boundary-contracts, 03-dependency-direction, 05-entry-thinness]
version: 1.0
---

# Error Model

## Principle

The project has one error philosophy, applied everywhere.

## Why

Mixed error models are the most expensive form of inconsistency in a codebase. When some code throws, some returns `Result<T, E>`, some returns `null`, and some logs and continues — every caller has to know which is which, and the error path becomes invisible. A single, explicit model means errors are predictable, the type system can help catch missing handlers, and operators can reason about what production failures actually mean.

## Rules

### Pick one model

Pick one model per project — **throw + catch**, **`Result<T, E>` returns**, **error tuples** (`[err, value]`), or **option types**. Document the choice in `CLAUDE.md` so every contributor (human and AI) follows it. Mixing models within a project is the failure mode this rule exists to prevent.

### Type your errors

- Errors carry **type**, not just **message**. A typed error class or tagged union (`UserNotFound`, `PaymentDeclined`, `RateLimited`) lets callers handle specific cases. String-only errors force string matching, which silently breaks.
- Construct errors with the data callers will need to act on them: `new PaymentDeclined({ reason: 'insufficient_funds', retryable: false })`.

### Handle at the right layer

- **Domain code propagates.** A pricing function that hits a validation error throws/returns the typed domain error and stops. It doesn't decide what HTTP status to return.
- **Entry surfaces translate.** A `PaymentDeclined` becomes a 402 in HTTP, a non-zero exit code in CLI, a retry decision in a worker. The translation is the entry's job (see `05-entry-thinness`).
- **Adapters map external errors.** A `Stripe.errors.CardError` becomes your `PaymentDeclined` at the adapter boundary (see `03-dependency-direction`). The rest of the codebase doesn't know about Stripe's error types.

### Don't swallow

- A caught error that's not handled, logged, _or_ rethrown is a future debugging session. If you genuinely want to ignore an error, do it explicitly with a comment explaining why (and ideally a typed `IgnorableError` check).
- `catch (e) {}` is never acceptable in production code. `catch (e) { /* ignore: file may not exist yet */ }` is.

### Distinguish expected from unexpected

- **Expected errors** (validation failure, business rule violation, auth denied) are part of the domain. They get typed errors, deliberate handling, and user-friendly translations.
- **Unexpected errors** (DB down, third party 500, OOM) are operational. They get logged, may trigger retries or alerts, and bubble up to a global handler that returns a generic failure to the user.
- Treating the two the same way leaks operational details to users (bad) or buries real bugs in user-facing error paths (worse).

## Good example

```typescript
// domain — typed errors, propagated
class PaymentDeclined extends DomainError {
  constructor(public reason: 'insufficient_funds' | 'fraud_block' | 'unknown') { super(); }
}

// adapter — maps external to domain
async function chargeViaStripe(order: Order): Promise<Receipt> {
  try {
    return await stripe.charges.create({ ... });
  } catch (e) {
    if (e instanceof Stripe.errors.StripeCardError) {
      throw new PaymentDeclined(mapReason(e.code));
    }
    throw e; // unexpected — let it propagate to global handler
  }
}

// entry — translates
app.post('/orders/:id/charge', async (req, res, next) => {
  try {
    const receipt = await chargeOrder(orderId);
    res.json(receipt);
  } catch (e) {
    if (e instanceof PaymentDeclined) {
      return res.status(402).json({ reason: e.reason });
    }
    next(e); // global handler logs + returns 500
  }
});
```

## Violations

- `catch (e) {}` (silent swallow)
- `throw new Error('something went wrong')` (untyped string error in domain code)
- A Stripe error object surfacing in an HTTP response body
- Half the codebase throws; the other half returns `Result` — caller never knows which to expect
- An expected validation failure handled by a global 500 handler
- Domain code that returns `null` to mean "not found", "denied", and "validation failed" — three failure modes collapsed into one

## Conflicts with `06-locality`

Locality says don't add ceremony. Error typing adds a class per failure mode. **Resolution:** for a function with one trivial failure mode local to one caller, throwing a generic error is fine. For anything that crosses a module boundary or is part of the public surface, errors get types — the cost is small and the leverage is large.

## Review checklist

- [ ] Errors are typed (classes or tagged unions), not raw strings
- [ ] No silent catches (`catch (e) {}`)
- [ ] External library errors are mapped at adapters, not propagated raw
- [ ] HTTP/CLI/worker translates domain errors at the entry, not in domain code
- [ ] Project's chosen error model is followed (throw or Result, not both arbitrarily)
- [ ] Expected and unexpected errors are handled differently
