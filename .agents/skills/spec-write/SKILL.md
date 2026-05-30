---
name: spec-write
description: Turn a feature request into a clear, executable spec saved as meta/features/<feature-name>/index.md. Use when the user asks to spec, plan, scope, design, clarify, or break down a feature before coding. This skill writes the spec only. It never writes implementation code and never generates execution prompts.
---

# Spec Write

Create a clear feature spec. Do not implement code. Do not generate prompt files.

This skill exists to reduce token waste and prevent complex specs from failing due to excessive prompt generation. Its only durable output is one canonical spec file:

`meta/features/<feature-name>/index.md`

The spec must be clear enough that `spec-run` can execute it later without negotiating ambiguity.

## Core rule

Write the smallest complete spec that can safely guide implementation.

Do not create:

- implementation prompts
- test prompts
- review prompts
- security prompts
- migration prompts
- docs prompts
- observability prompts
- rollback prompts

Those were intentionally removed. `spec-run` executes the spec directly.

## Token policy

Read only what is needed.

Prefer this order:

1. User request
2. `AGENTS.md`, if present
3. Relevant files in `AI/rules/*` or `meta/rules/*`, only if directly related
4. One nearby feature/spec only if needed for convention

Never scan the whole repository.

Never read unrelated architecture, services, routes, tests, or components just to “understand the project.”

If rules or examples do not exist, proceed and state the assumption.

## Language

Write the spec in the same language as the user.

Keep code identifiers, file names, paths, extensions, package names, HTTP methods, env vars, and technical conventions in English.

## Clarification phase

Ask only what cannot be safely assumed.

Clarification belongs here, not in `spec-run`.

Always resolve these before writing the final spec unless already explicit:

- Goal — the one-sentence outcome
- Scope — what is included and excluded
- Persistence — DB, cache, files, local state, none, third party
- Error contract — exception, result object, HTTP status, fallback, validation message
- Auth boundary — who can call it and where access is verified
- Inputs and outputs — request shape, response shape, UI state, file shape, or equivalent
- Acceptance criteria — how success is verified

Group questions in one message.

Do not drip-feed questions.

If the user already answered enough, do not ask again.

## Spec file path

Create or update:

`meta/features/<feature-name>/index.md`

Use a kebab-case feature name.

Examples:

- `meta/features/user-password-reset/index.md`
- `meta/features/scene-prompts-async-job/index.md`
- `meta/features/billing-webhook-retry/index.md`

## Existing spec behavior

If `meta/features/<feature-name>/index.md` already exists, do not overwrite silently.

Use one of these modes:

### Amend

Use when the request is a small change.

Update `index.md` and add:

```md
## Changes

### <YYYY-MM-DD>

- ...
```

### Version

Use when the request changes the feature substantially.

Create:

`meta/features/<feature-name>-v2/index.md`

Then mention that the older version remains unchanged.

If the correct mode is unclear, ask.

## Required `index.md` structure

The file must follow this structure exactly:

```md
# <Feature Name>

## Summary

<2–4 sentences explaining the feature in plain language.>

## Status

Spec ready for implementation.

## Goal

<One sentence describing the desired outcome.>

## Scope

### In

- ...

### Out

- ...

## User Flow / System Flow

1. ...
2. ...
3. ...

## Inputs

- ...

## Outputs

- ...

## Error Contract

- ...

## Boundaries

### Auth

- ...

### Persistence

- ...

### External Calls

- ...

### Security / Trust Boundaries

- ...

## Data Model / State

- ...

## Files Likely Affected

- `path/or/area`: reason
- `path/or/area`: reason

Use areas when exact files are unknown.

## Acceptance Criteria

- [ ] ...
- [ ] ...
- [ ] ...

## Test Expectations

- Unit:
  - ...
- Integration:
  - ...
- E2E/UI:
  - ...
- Manual:
  - ...

Use only the categories that apply.

## Implementation Notes

- ...

These notes describe constraints and decisions, not code.

## Risks

- ...

## Assumptions

- ...

## Non-Goals

- ...
```

## Quality bar

A good spec is executable by another model without needing the original conversation.

It must make clear:

- what to build
- what not to build
- where the work likely belongs
- what behavior must exist
- what errors look like
- what tests are expected
- what assumptions were made

## Forbidden

Do not:

- write implementation code
- generate prompt files
- split the work into future prompts
- recommend a model tier unless the user explicitly asks
- include long duplicated context
- invent project architecture
- scan the full repository
- hide assumptions
- leave acceptance criteria vague
- say “decide during implementation” for core behavior

## Final response

Return only:

```md
## Spec created: <feature-name>

- Path: `meta/features/<feature-name>/index.md`
- Status: ready for `spec-run`

### Notes

- ...
```

If you cannot write a safe spec, return:

```md
## Spec not ready

Missing required decisions:

- ...
```

## Versioning

v1.0 — 2026-05
