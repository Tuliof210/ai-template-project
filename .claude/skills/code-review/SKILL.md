---
name: code-review
description: Review staged git changes for bugs, type holes, security issues, and convention drift before commit or PR. Use whenever the user says any variant of "review this", "code review", "PR review", "olha esse código", "revisa o que tá staged", "antes de eu commitar", "before I push", or hands over a diff and asks for an opinion. Also use proactively when the user shows code they're about to ship and asks if it's OK. Project-agnostic — does not assume a framework.
---

# Code Review

Review what's staged. Find what's actually broken or risky. Skip what you can't see.

The point of this skill is to act as a focused pre-commit reviewer: high signal, no padding, no scope creep. The user is about to ship something — they need to know if it's safe, not have their work re-narrated to them.

## Scope

The review covers **only `git diff --staged`**. Unstaged work, branch history, and unrelated files aren't part of the review — they may carry context you don't have, and reviewing them silently expands the surface beyond what the user asked for.

**First action:** `git diff --staged --stat` to see file scale, then `git diff --staged` for the content.

## Reading context

Default to lazy reads — the diff itself is usually enough to make the call.

Read more **only when it changes a verdict you'd otherwise have to guess at**:

- **Convention checks** — before flagging a pattern as inconsistent, open 1–3 sibling files (same directory or module) to confirm what the project actually does. Without this, "convention" findings are guesses dressed as facts.
- **Type / import resolution** — if a symbol's type isn't visible in the diff and changes the verdict, open the file that defines it.
- **Project rules** — read `meta/rules/*` or `CLAUDE.md` if they exist, but only the parts likely to apply. If they don't exist, proceed without them and don't mention it.

Cap context reads at ~5 extra files. If you'd need more than that, that's itself a signal — the diff lacks context to judge confidently. Raise the concern as a Risk rather than forcing a verdict.

## Priorities

Findings are ranked by what actually breaks production:

1. **Correctness** — bugs, regressions, broken builds, wrong behavior, off-by-one, race conditions, lost awaits
2. **Type safety** — `any`, unsafe casts, broken inference, lying type signatures, nullability silently dropped
3. **Security** — injection (SQL/command/HTML), unsafe deserialization, leaked secrets, path traversal, missing authn/authz, ReDoS-prone regex, `eval`-shaped calls
4. **Architecture** — logic in the wrong layer, hidden coupling, broken separation of concerns, leaking abstractions
5. **Edge cases** — null/undefined, empty collections, unhandled async errors, timezone/locale, browser-only APIs in shared code, integer overflow
6. **Conventions** — only when the project's own pattern is visible _and_ being violated. If you can't see the convention, skip the category.

Stylistic preferences without a correctness, safety, or maintainability cost don't appear in the report. The user already has linters for that.

## Severity rubric

Use this so severity calls are consistent across reviews:

- **high** — will break runtime or build, exposes a security hole, corrupts data, or introduces a regression in a code path users actually hit. Blocks merge.
- **med** — bug in a non-critical path, type lie that will bite eventually, missing error handling on a likely failure mode, contained-but-clearly-wrong architectural choice.
- **low** — improbable edge case, minor type imprecision, contained smell. Worth fixing, not worth blocking.

When torn between two levels, pick the lower one and explain the uncertainty in the finding itself. Inflated severity erodes trust in the whole review.

## Edge cases

Handle these explicitly instead of producing a generic review:

- **Empty diff** — say "Nothing staged to review" and stop. Don't invent things.
- **Only generated files / lockfiles / binaries** — note what changed, flag dependency bumps with new majors or unfamiliar packages, skip line-level review of generated content.
- **Very large diff (>800 lines or >20 files)** — do the high/med pass across everything, but state explicitly that low-severity coverage is partial. Offer to focus on specific files for depth.
- **Pure deletions** — check whether removed code is referenced elsewhere (a quick grep on exported names is fair game). If you can't verify, raise it as a Risk.
- **Migrations / schema changes** — treat as high-risk by default. Check: reversibility, data loss, locking on large tables, ordering relative to code deploy.
- **Config / env / secrets files** — flag any value resembling a real secret, any loosened security setting, any default change that ships everywhere.

## Output

Return plain markdown. Do **not** wrap the whole thing in a code fence — the user wants to read it, not parse it.

Use this structure:

```
## Review

**Status:** APPROVED | CHANGES REQUESTED

### Findings
- [high] path/to/file.ts:42 — short description and why it matters
- [med] path/to/other.ts:108 — ...
- [low] ...

### Risks
- Things you suspect but can't confirm from the diff (e.g., "this assumes `user.role` is always set — true in the diff, but the type isn't visible").

### Notes
- Context the user should know but isn't a finding (dep bumps, intentional-looking behavior changes, etc.).

### Summary
One or two sentences: verdict and why.
```

**Findings** are things you can point at in the diff with line numbers. **Risks** are things you'd verify if you had more access. **Notes** are heads-ups that don't fit either bucket. Drop any section that's empty rather than padding it with "None."

## Behavior

- If the diff is clean, say so plainly. `APPROVED. No issues found.` is a valid full output.
- When uncertain, state the assumption explicitly ("assuming `req.user` is populated by middleware…") instead of vaguely hedging. Hedging without a specific assumption is just noise.
- Don't propose code changes unless asked. The job is to find things, not fix them — the user often wants to fix it themselves to learn.
- Don't restate what the diff does. The user wrote it.
- Don't grade effort or praise. Findings or no findings.
- Don't invent severity to look thorough. An empty Findings section is fine when the code is fine.

## Examples

**Diff with a bug:**

```
## Review
**Status:** CHANGES REQUESTED

### Findings
- [high] api/users.ts:54 — `await db.delete(id)` runs before the auth check on line 51 returns; the early-return is missing, so deletion happens regardless of `authorized`. Move the `if (!authorized) return` above the await.
- [med] api/users.ts:60 — error from `audit.log()` is swallowed in the catch; an audit failure here would silently succeed the delete.

### Risks
- The `id` param isn't validated as a UUID before reaching `db.delete`. Whether that matters depends on the ORM's handling of malformed IDs.

### Summary
Auth bypass on the delete path. Block until the check ordering is fixed.
```

**Clean diff:**

```
## Review
**Status:** APPROVED

### Summary
Tightening of the existing input validation. Behavior preserved, types remain sound.
```

## Versioning

`v1.0` — 2026-05.
