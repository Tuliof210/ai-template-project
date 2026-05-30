---
name: spec-run
description: Execute an existing spec from meta/features/<feature-name>/index.md by implementing the code, tests, and self-review in one run. Use when the user asks to run, execute, implement, build, code, ship, or finish a feature from an existing spec. This skill does not generate prompts and does not negotiate ambiguity.
---

# Spec Run

Implement an existing spec.

This skill does not create prompts. It writes the actual code.

It executes everything in one pass:

1. implementation
2. tests
3. self-review
4. necessary fixes

The spec is the contract.

## Required input

A spec file must exist at:

`meta/features/<feature-name>/index.md`

If the user gives a different path, use that path.

If no spec path is provided, search only likely spec locations:

- `meta/features/*/index.md`
- `AI/features/*/index.md`

Do not search the whole repository.

## Core rule

Do not negotiate.

Assume ambiguity was resolved by `spec-write`.

Only stop if:

- the spec file does not exist
- the spec is unreadable
- the spec is internally contradictory
- executing it would require unsafe behavior
- required secrets, credentials, or external access are missing

Minor implementation choices should be decided locally using project conventions.

## Token policy

Read only what is necessary to implement the spec.

Required reads:

1. The target `index.md`
2. `AGENTS.md`, if present
3. Relevant files in `AI/rules/*` or `meta/rules/*`
4. Existing files directly touched by the implementation
5. Existing tests for the same area, if present

Do not read:

- unrelated features
- unrelated services
- the entire repo tree
- all rules files
- all tests
- generated files
- dependency lockfiles unless dependency changes are required

Prefer targeted search over broad scanning.

## Execution policy

Implement the spec directly.

Do not generate:

- implementation prompts
- test prompts
- review prompts
- task plans for another model
- placeholder TODOs instead of implementation

Do not split the work into future sessions.

## Implementation behavior

Follow the spec exactly.

Implement:

- production code
- necessary types/interfaces/schemas
- validations
- error handling
- persistence changes
- API/UI wiring
- tests
- documentation updates only if the spec requires them or behavior changed publicly

Use existing project conventions.

Do not introduce new architecture unless the spec explicitly requires it.

Do not refactor unrelated code.

Do not expand scope.

## Tests

Add or update tests that verify the acceptance criteria.

Prefer the existing test style.

If the project has multiple test layers, choose the smallest sufficient layer first.

Examples:

- pure logic → unit tests
- API behavior → integration/request tests
- UI interaction → component or E2E tests
- DB behavior → integration tests or repository/service tests

Do not invent a new test framework.

If no test framework exists, add a manual verification section to the final response.

## Review pass

After implementation and tests, perform a self-review.

Check:

- spec coverage
- acceptance criteria
- error contract
- auth boundary
- persistence behavior
- edge cases
- type safety
- dead code
- overengineering
- unrelated changes
- test relevance

Fix issues found during review.

Do not produce a separate review prompt.

## Security behavior

When the spec touches auth, user input, DB writes, files, secrets, HTML rendering, external calls, money, PII, or permissions, review those surfaces during implementation.

Do not create a separate security prompt.

Apply the project’s security rules directly.

## Migration behavior

If the spec requires schema or persisted data changes:

- use the project’s existing migration mechanism
- add migration files in the correct location
- preserve backward compatibility when required
- include rollback behavior only when the project convention supports it

Do not invent a migration system.

## Docs behavior

Update docs only when:

- the spec asks for docs
- public API behavior changes
- env vars are added or changed
- operator-visible behavior changes
- setup instructions change

Keep docs minimal.

## Verification

Run the most relevant available checks.

Prefer:

1. targeted tests for changed area
2. typecheck
3. lint
4. broader test suite only when necessary

If commands are unknown, inspect package/config files only as needed.

Do not run expensive full-suite commands unless required by the spec or project convention.

## Final response

Return a concise implementation report:

```md
## Spec run complete: <feature-name>

### Implemented

- ...

### Tests

- ...

### Review

- ...

### Files changed

- `path`: reason
- `path`: reason

### Verification

- `<command>`: passed
- `<command>`: failed — <reason>

### Notes

- ...
```

If implementation could not be completed:

```md
## Spec run incomplete: <feature-name>

### Completed

- ...

### Blocked by

- ...

### Files changed

- ...

### Verification

- ...
```

## Forbidden

Do not:

- ask clarification questions about spec intent
- generate prompts
- defer implementation
- create TODO-only code
- rewrite unrelated architecture
- silently ignore acceptance criteria
- broaden scope
- scan the entire repo
- claim tests passed if they were not run
- claim behavior is implemented without verifying the relevant files

## Versioning

v1.0 — 2026-05
