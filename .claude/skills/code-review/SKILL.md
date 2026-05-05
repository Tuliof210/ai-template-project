---
name: code-review
description: Review staged git changes for correctness, regressions, typing, security, and convention drift. Project-agnostic, blind judgment. Use when user requests code/PR review.
---

# Code Review

## Scope

- ONLY staged changes: `git diff --staged`
- Ignore unstaged, history, or unrelated files

## Context (lazy-read)

- Read only if needed: `meta/rules/*`, `CLAUDE.md`
- Prefer minimal reads; no full repo scan

## Priorities (in order)

1. Correctness — bugs, regressions, runtime/build breaks
2. Type safety — `any`, unsafe casts, broken inference
3. Security — injection, unsafe HTML, secrets, fragile regex
4. Architecture — separation of concerns, misplaced logic
5. Conventions — follow detected patterns (no assumptions)
6. Edge cases — null/undefined, async errors, browser APIs

## Rules

- Be project-agnostic (no framework bias)
- No assumptions beyond visible code
- No stylistic nitpicks unless harmful
- No code changes unless asked
- Be concise, signal > noise

## Output

```md
## Review

**Status:** APPROVED | CHANGES REQUESTED

### Findings

- [high|med|low] [file:line] - issue

### Risks

- potential issues not verifiable from diff

### Summary

- brief verdict

## Behavior

- If clean: say explicitly
- If uncertain: state assumption
- Skip verification steps not observable from diff
```
