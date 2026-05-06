---
id: 02-boundary-contracts
applies_to: [all]
severity: must
related: [01-module-ownership, 03-dependency-direction, 08-error-model]
version: 1.0
---

# Boundary Contracts

## Principle

What crosses a boundary is explicit, validated when untrusted, and stable.

## Why

Modules can have perfect ownership and still corrupt each other if their interfaces are sloppy. The contract is what one module _promises_ and another _relies on_. Implicit contracts (passing raw objects, returning loosely-typed shapes, changing signatures silently) make every boundary a guessing game and turn every refactor into a hunt for callers that depended on undocumented behavior. Explicit contracts let modules evolve independently.

## Boundaries

- User input (HTTP body, CLI args, form data, file uploads)
- Module exports
- Network calls (yours or theirs)
- Persistence reads (DB rows, cache values, files on disk)
- Third-party SDKs and webhooks
- Public functions in shared modules

## Rules

- Define input and output shapes explicitly: TypeScript types, Pydantic models, Zod schemas, dataclasses, structs — whatever the stack uses. `any`/`object`/`dict[str, Any]` on a public surface is a contract violation.
- **Validate at the trust boundary, exactly once.** Untrusted data (user, network, persistence) gets validated where it enters the system; downstream code relies on the validated type and doesn't re-check.
- **Pick one validation tool per project** and use it consistently. Mixing zod + joi + hand-written guards is its own bug source.
- Transformations between boundaries are intentional and named. No implicit shape morphing — if data shape changes, there's a function with a name doing it.
- Public contracts (exports, API responses, event payloads) follow semver-like discipline: additive changes are safe, removals/renames/type-narrowings are breaking and need explicit acknowledgment.

## Good example

```typescript
// At HTTP boundary — validate once
const CreateUserRequest = z.object({
  email: z.string().email(),
  age: z.number().int().min(13),
});

export async function POST(req: Request) {
  const body = CreateUserRequest.parse(await req.json()); // validated type
  return createUser(body); // downstream relies on the type, no re-validation
}
```

## Violations

- `function createUser(data: any)` exposed from a public module
- The same payload validated in 3 places along the call chain
- A field renamed in the API response without a deprecation path
- `JSON.parse(rawBody)` passed directly to business logic
- A type widened from `User` to `User | null` in a published library without a major version bump
- DB rows used as domain objects without a parsing/transformation step (drift between schema and runtime expectation)

## Conflicts with `06-locality`

Locality says don't add ceremony for one caller. Contracts say be explicit at boundaries. **Resolution:** if the boundary is internal to one module and one caller, types alone are enough — skip the schema. If the boundary is between modules, between trust zones, or published, validate explicitly regardless of caller count.

## Review checklist

- [ ] Public function signatures use named types, not `any`/`object`/loose dicts
- [ ] Untrusted input is validated at the entry, not downstream
- [ ] One validation tool used across the project
- [ ] Breaking changes to public contracts are flagged in the diff or commit message
- [ ] DB rows / external responses are parsed into domain types, not used raw
