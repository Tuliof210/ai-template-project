---
name: spec
description: Turn a feature request into a clarified spec plus a set of ready-to-execute prompts (implementation, tests, review, and conditional ones for security, migration, docs, observability, rollback). Use whenever the user says any variant of "spec this", "plan this feature", "break this down", "design this", "scope this out", "planeja essa feature", "quebra em tarefas", "como eu faço isso", or asks to scope work before writing code. Also use proactively when the user describes a non-trivial feature and starts asking implementation questions — the right move is usually to spec first, code later. Outputs prompts and a human-readable index, never code.
---

# Spec-Driven Development

Produce a spec and prompts. Never produce the implementation.

The point of this skill is to turn a vague feature ask into something a future LLM session — possibly a smaller, cheaper one — can execute reliably. The spec is the contract. The numbered prompts are the executable steps. Code lives in neither.

## Token policy

Read only what you need. Never scan the whole repo.

If they exist, read:

- `AGENTS.md` for project-level rules
- `meta/rules/*` only the files likely to apply (auth, db, http, etc.)
- One existing feature in `meta/features/` if you need a convention reference

If they don't exist, proceed without them and note any assumption you had to make.

## Language

Write the spec and surrounding prose in whatever language the user is using. Code identifiers, file paths, file extensions, and standard conventions (TODO, FIXME, commit prefixes) stay in English. The spec is for humans; the identifiers are for compilers. Mixing is correct, not sloppy.

## Phase 1 — Clarify

Ask only what you can't safely assume. Always confirm these unless the user has clearly already answered them:

- **Goal** — one-sentence outcome
- **Persistence** — where does state live? (DB, cache, in-memory, none, third party)
- **Error contract** — what does failure look like to the caller? (exception, error result, HTTP status, silent fallback)
- **Auth boundary** — who can call this, and what's verified where?
- **Scope edge** — what's _explicitly not_ included?

Skip any of these only when they're already explicit. When in doubt, ask. Under-clarification is the most common failure mode of this skill — vague specs produce prompts that produce wrong code.

Group all questions in one message. Don't drip-feed them one at a time.

## Phase 2 — Spec

Once clarified, write the spec. It becomes a section inside `index.md` and is the single source of truth — the numbered prompts will reference it by path, not duplicate it. (Duplicating means every spec edit becomes N edits and goes stale.)

```
## Feature: <name>

### Goal
<one sentence>

### Scope
**In:** ...
**Out:** ...

### Flow
1. ...

### I/O
**Input:** ...
**Output:** ...
**Errors:** ...

### Edge cases
- ...

### Boundaries
- Auth: ...
- Persistence: ...
- External calls: ...

### Acceptance criteria
- [ ] ...
```

## Phase 3 — Prompt generation

### Files

Output to `meta/features/<feature-name>/`. File naming:

- `index.md` — human overview, generated **first**, written for a person to skim
- `<n>.<step>.prompt.md` — numbered prompts, written for an LLM to execute

`<n>` is execution order (1, 2, 3…). `<step>` is one of: `implementation`, `tests`, `review`, `security`, `migration`, `docs`, `observability`, `rollback`.

Examples: `1.implementation.prompt.md`, `2.tests.prompt.md`, `3.review.prompt.md`.

### `index.md` structure

For humans, not LLMs. Contains:

1. 2–4 sentence plain-language summary
2. **Will build** / **Won't build** lists
3. Recommended model line (see below)
4. Ordered list of prompt files with one-line descriptions
5. The spec from Phase 2 as a section (so it lives in one place)

### Recommended model

Pick the lowest tier that can execute the work reliably. Format:

`**Recommended model:** <tier> + thinking <on|off> — <one-line reason>`

Tiers describe the _kind of work_; the user maps them to whatever models their stack provides (Haiku/Sonnet/Opus, GPT-4o-mini/4o/o1, etc.):

- **small-fast** — pure mechanical work: rename, reformat, repetitive boilerplate, copy-paste-adapt
- **balanced** — typical CRUD, well-defined component, clear acceptance criteria, no surprising interactions
- **deep** — multi-component logic, non-trivial state, several edge cases interacting, requires holding the system in mind
- **max-rigor** — security-critical, hard to roll back, distributed/concurrent, money/PII, anything where being wrong is expensive

Add `thinking on` when: branching logic affects the design, edge cases interact non-obviously, or anything in `max-rigor`. Otherwise leave it off — thinking is expensive and often unneeded for clean execution.

Single-line reason explains _why this tier and not the one below_. "Balanced + thinking off — straight CRUD with acceptance criteria fully nailed down" is enough.

### Prompt rules

Each numbered prompt must:

- Open with what step it is and what comes before it
- Link to `index.md` for the spec — **don't embed it**
- Reference only the project rules that apply to _this_ step (the security prompt loads `meta/rules/auth.md`; the implementation prompt may not need it)
- State the file placement plan (which files get created or edited, where)
- State verification — how the executing model knows it's done. Point at tests/CI if the project has them; say "verification: project-dependent" rather than inventing checks otherwise
- Stay out of implementation details — say _what_ and _where_, not _how_
- Open with a `> Review before executing.` blockquote so a future session catches obvious issues even if the user moved fast

## Conditional prompts

Generate these only when the trigger is present. When skipped, say so in `index.md` (e.g., `Security prompt skipped — no sensitive surface.`) so the absence is intentional, not forgotten.

| Step            | Trigger                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `security`      | auth, user input crossing a trust boundary, external integrations, file handling, HTML rendering, DB writes, secrets/env |
| `migration`     | DB schema change, data backfill, breaking API change, format change in persisted data                                    |
| `docs`          | public API change, new env var, behavior change a user or operator would notice                                          |
| `observability` | new failure mode worth alerting on, latency-sensitive path, anything operating on money or PII                           |
| `rollback`      | irreversible-by-default change, schema change, data destruction                                                          |

`implementation`, `tests`, and `review` are always generated. The rest are gated.

## Iteration on existing features

If `meta/features/<feature-name>/` already exists, don't overwrite silently — that destroys history the user may need. Two options, ask the user which:

- **Amend** — small change. Edit `index.md`, add a `## Changes <date>` section, and append new prompts numbered after the existing ones (`6.implementation.prompt.md`, etc.).
- **Version** — substantive change. Create `meta/features/<feature-name>-v2/` and link from the original's `index.md`.

When in doubt, ask. Don't guess.

## Approval gating

After Phase 2 (spec written), pause briefly and offer the user a chance to correct it before generating prompts:

> Spec ready — generate prompts now, or want to adjust first?

Skip the pause if the user already said "just go", "no need to confirm", or similar. The numbered prompts always carry the `> Review before executing.` line at the top regardless.

## Final output

Return a summary in chat:

```
## SDD Output: <feature-name>

### Spec
<the spec from Phase 2>

### Files created
- meta/features/<feature-name>/index.md
- meta/features/<feature-name>/1.implementation.prompt.md
- meta/features/<feature-name>/2.tests.prompt.md
- meta/features/<feature-name>/3.review.prompt.md
- meta/features/<feature-name>/4.security.prompt.md   (if applicable)
- meta/features/<feature-name>/5.migration.prompt.md  (if applicable)
- ...

### Skipped
- security: <reason>
- migration: <reason>
- ...
```

## Behavior

- Don't write code. Not even illustrative snippets in the prompts. The prompts say what to build; the executing model writes it.
- Don't assume a framework or stack unless it's been confirmed (by the user, by the rules files, or by a quick look at one neighbor feature).
- State assumptions explicitly when you make them. Hidden assumptions become hidden bugs.
- If the request is too vague to spec even after one round of clarification, say so plainly and ask the user to come back when they know what they want. Don't force a fake spec to look productive — a confidently wrong spec is worse than no spec.
- Don't restate the rules of this skill in the output. The user can read.

## Versioning

`v1.0` — 2026-05.
