---
id: 05-entry-thinness
applies_to: [web-app, cli, monorepo]
severity: should
related: [01-module-ownership, 03-dependency-direction, 08-error-model]
version: 1.0
---

# Entry Thinness

## Principle

Entry surfaces adapt input/output and delegate. They don't own logic.

## What counts as an entry surface

- HTTP route handlers / controllers
- CLI command definitions
- Background job handlers
- Event/webhook handlers
- Page or screen components in a UI framework

## Why

Entry surfaces are coupled to a transport (HTTP, CLI, queue, framework). Logic that lives in them can only be reused by other code on the same transport. Pulling logic into the appropriate domain module means the same logic serves the HTTP API, the CLI, the worker, and the test — with no duplication. A 500-line route handler is also impossible to test without spinning up the framework.

## Rules

- An entry surface does: parse input → call domain function(s) → format output. That's the shape.
- "Substantial logic" — anything more than 1–2 lines of orchestration, or any decision the domain would care about — moves into a domain module. As a rough quantitative anchor: if the entry handler is more than ~30 lines excluding parsing/formatting, look hard at what should leave.
- If the same logic appears in two entry surfaces (HTTP route + CLI command both compute pricing), it belongs in a shared domain module, not copy-pasted.
- Entry surfaces _translate_ domain errors to transport errors (a `NotFound` becomes 404; a `ValidationError` becomes 400). They don't _invent_ error semantics — that's the domain's job. (See `08-error-model`.)
- Authentication and authorization checks at the entry are orchestration, not domain — they're allowed inline.

## Good example

```typescript
// HTTP route — thin
export async function POST(req: Request) {
  const input = CreateOrderRequest.parse(await req.json());
  const order = await createOrder(input); // domain function
  return Response.json(order, { status: 201 });
}

// CLI — also thin, calls the same domain function
program.command("create-order").action(async (opts) => {
  const order = await createOrder(opts);
  console.log(JSON.stringify(order, null, 2));
});
```

## Violations

- A 200-line route handler with validation, DB queries, business rules, and email sending inline
- Pricing calculation that lives in `routes/checkout.ts` and is unreachable from a CLI tool that needs the same calculation
- Auth logic implemented separately in 4 controllers
- An event handler that owns business state instead of delegating to a domain module
- HTTP status codes invented inside the domain (`throw new HttpError(409, ...)` from a pure function)

## Exception: trivially simple entries

A health-check endpoint, a CLI command that echoes a config value, a route that returns a static page — these don't need domain modules behind them. The thinness rule is about avoiding misplaced complexity, not about adding ceremony to genuinely trivial cases. If the whole behavior fits in 5 lines, leave it inline.

## Review checklist

- [ ] Entry surface is roughly < 30 lines of orchestration, not business logic
- [ ] No domain logic appears in more than one entry surface
- [ ] Errors are translated, not invented, at the entry boundary
- [ ] The same domain function is callable from any entry (HTTP, CLI, worker, test)
- [ ] Auth checks are at the entry, not buried inside domain functions
