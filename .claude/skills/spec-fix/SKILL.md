---
name: spec-fix
description: Fix an implementation that was produced by spec-run but failed validation, tests, review, or runtime behavior. Use after spec-run when the original spec is still valid but the implementation has bugs, regressions, incomplete behavior, failed tests, incorrect edge cases, or does not satisfy the acceptance criteria. This skill identifies the failure and corrects the code so the original spec is fulfilled.
---

# Spec Fix

Fix a failed or incomplete `spec-run`.

This skill is used after an implementation exists but does not correctly satisfy the original spec.

The original spec remains the source of truth.

Do not rewrite the spec unless the user explicitly asks.

## Required input

A spec must exist at:

`meta/features/<feature-name>/index.md`

The user may also provide:

- failed test output
- validation notes
- review notes
- runtime error logs
- bug description
- screenshots
- broken behavior description
- CI failure output

Use those as failure evidence.

## Core rule

Fix the implementation so it satisfies the original spec.

Do not renegotiate the feature.

Do not broaden the scope.

Do not create prompts.

Do not restart from scratch unless the current implementation is clearly unsalvageable.

## Token policy

Read only what is needed.

Required reads:

1. The original spec
2. The failure evidence provided by the user
3. The files changed by the previous `spec-run`
4. Relevant tests
5. Relevant project rules from `CLAUDE.md`, `AI/rules/*`, or `meta/rules/*`

Do not scan the whole repository.

Do not read unrelated features.

Do not re-review untouched systems unless the failure points there.

## Failure classification

Before changing code, classify the failure internally as one or more of:

- incomplete implementation
- wrong interpretation of spec
- failed acceptance criterion
- broken test
- missing test coverage
- incorrect error handling
- auth/permission bug
- persistence bug
- data migration bug
- API contract mismatch
- UI behavior mismatch
- race/concurrency issue
- environment/config issue
- type/lint/build failure
- regression in existing behavior
- overengineering or unrelated change

Use this classification to guide the fix.

## Execution behavior

Fix the smallest safe surface.

Prefer surgical changes over rewrites.

Allowed actions:

- edit production code
- edit or add tests
- fix incorrect tests if they contradict the spec
- adjust types/interfaces
- fix validation
- fix error handling
- fix persistence logic
- fix API/UI wiring
- remove unrelated changes introduced by `spec-run`
- update docs only if the original spec required docs or the fix changes public behavior

Forbidden actions:

- changing the original spec to match the broken implementation
- generating prompt files
- adding TODO-only fixes
- ignoring failing tests
- deleting tests to make the suite pass
- broad refactors unrelated to the failure
- changing architecture without need
- introducing new libraries unless unavoidable
- claiming the fix works without verification

## Spec priority

When there is conflict:

1. explicit user correction in the current request
2. original spec acceptance criteria
3. original spec behavior sections
4. project rules
5. existing project conventions
6. previous implementation

The previous implementation has the lowest authority.

## Tests

Add or update tests for the failure.

A good `spec-fix` should usually include a regression test proving the bug is fixed.

If a failing test already captures the problem, fix the code rather than rewriting the test.

Only change a test when:

- the test contradicts the original spec
- the test asserts implementation details not required by the spec
- the test is obsolete due to the correct spec behavior

## Verification

Run the smallest relevant verification first.

Prefer:

1. the specific failing test
2. related tests for the changed area
3. typecheck
4. lint
5. broader test suite only if needed

If verification cannot be run, state why.

Never claim a command passed unless it was run and passed.

## Review pass

After fixing, perform a focused self-review.

Check:

- Does the fix satisfy the original spec?
- Does it address the reported failure?
- Is there a regression test?
- Were unrelated changes avoided?
- Were acceptance criteria preserved?
- Were auth, persistence, and error contracts respected?
- Did the fix introduce new risk?

Fix any issue found.

## Final response

Return only a concise fix report:

```md
## Spec fix complete: <feature-name>

### Failure found

- ...

### Fixed

- ...

### Tests

- ...

### Files changed

- `path`: reason

### Verification

- `<command>`: passed
- `<command>`: failed — <reason>

### Notes

- ...
```

If the fix cannot be completed:

```md
## Spec fix incomplete: <feature-name>

### Failure found

- ...

### Completed

- ...

### Blocked by

- ...

### Files changed

- ...

### Verification

- ...
```

## Versioning

v1.0 — 2026-05
