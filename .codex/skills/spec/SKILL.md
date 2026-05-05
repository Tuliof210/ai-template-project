---
name: spec
description: Creates ready-to-run implementation prompts from a clarified feature request. Outputs prompts only, never code. Uses minimal context and repository rules.
---

# Spec-Driven Development

Produce prompts, not code.

## Language

- 100% English

## Token Policy

- Minimal reads only
- No full repo scan
- Do not restate rules unless needed

## Context

Read only if needed:

- `CLAUDE.md`
- relevant `meta/rules/*`

## Phase 1 — Clarify

Ask only blocking questions:

- goal
- scope / exclusions
- flow
- I/O
- edge cases
- acceptance criteria
- testing
- security surface

Skip questions if already clear.

## Phase 2 — Spec

```md
## Feature: [name]

### Goal

[one sentence]

### Scope

- Included:
- Excluded:

### Flow

1. ...

### I/O

- ...

### Edge Cases

- ...

### Boundaries

- ...

### Acceptance Criteria

- [ ] ...
```

Wait for approval unless told otherwise.

## Phase 3 — Prompt Generation

### Output Location

- `meta/features/<feature-name>/`

### Naming Convention

- `index.md` — human-readable overview (always generated first)
- `<index>.<step>.prompt.md` — LLM-executable prompts

Examples:

- `index.md`
- `1.implementation.prompt.md`
- `2.tests.prompt.md`
- `3.review.prompt.md`
- `4.security.prompt.md`

### index.md Rules

Always generate `index.md` before the numbered prompts. It must:

- be written for a human reader, not an LLM
- summarize the feature in plain language (2–4 sentences)
- list what will be built and what is explicitly excluded
- list the generated prompt files in order with a one-line description of each
- include a **Recommended Model** line (see below)
- never contain implementation instructions or code

### Recommended Model

Pick the lowest tier that can handle the feature reliably:

| Tier    | Thinking |
| ------- | -------- |
| low     | off      |
| low+    | on       |
| medium  | off      |
| medium+ | on       |
| high    | off      |
| max     | on       |

Reserve `max` for security-critical or hard-to-reverse work.

Format: `**Recommended model:** <tier> — <model> (thinking <on|off>) — [one-sentence reason]`

### Prompt Rules

Each numbered prompt must:

- be self-contained
- embed the approved spec
- reference `CLAUDE.md` and only necessary `meta/rules/*`
- include file placement plan
- include verification steps or mark as project-dependent
- avoid implementation code
- avoid framework assumptions unless confirmed

## Steps

Generate only what applies:

1. implementation
2. tests
3. review
4. security (only if needed)

## Security Trigger

Generate security prompt only if touching:

- auth / permissions
- user input
- external integrations
- file handling
- HTML rendering
- DB writes
- secrets / env

Else:
`Security prompt skipped: no sensitive surface.`

## Output Format

```md
## SDD Output: [feature-name]

### Spec

[approved spec]

### Files

- meta/features/[feature-name]/index.md
- meta/features/[feature-name]/1.implementation.prompt.md
- meta/features/[feature-name]/2.tests.prompt.md
- meta/features/[feature-name]/3.review.prompt.md
- meta/features/[feature-name]/4.security.prompt.md (if applicable)

## Constraints

- never output code, only expected files
- never modify files, only create expected ones
- never assume architecture
- never over-explain
- state assumptions if any
```
