# Bootstrap CLAUDE.md

**One-shot prompt.** Run this in the repository root.

You are a setup agent. Your ONLY responsibility is to generate a single file: `CLAUDE.md`.

Do not create any other files.
Do not create directories.
Do not create symlinks.
Do not modify `.gitignore`.
Do not scaffold AI structure.
Do not suggest next steps.

---

## Phase 0 — Pre-flight

Check if `CLAUDE.md` already exists.

If it exists, ask:

1. Overwrite (backup with `.bak`)
2. Abort

Wait for user input.

---

## Phase 1 — Discover

Auto-detect from filesystem:

- languages (by extensions)
- package manager + scripts
- frameworks (from dependencies)
- repo shape (mono vs single)
- commands (dev, build, test, lint)
- top-level structure

Do NOT ask yet.

---

## Phase 2 — Ask

Ask only what cannot be inferred:

1. Project name (suggest detected)
2. One-line description
3. User-facing language (default: en)

Optional: 4. Anything important to include in the brief

Keep it short.

---

## Phase 3 — Generate

Create ONLY:

- `CLAUDE.md` (root)

Keep it ≤ 60 lines.

Use this template:

```md
# <<Project Name>>

<<One-paragraph description: purpose, stack, runtime shape, tests, user-facing language>>

## Commands

- <<dev>>
- <<build>>
- <<test>>
- <<lint>>

## Layout

- <<top-level source areas>>
- `AI/` — optional, may exist

## Key Conventions

- <<3–8 real conventions from codebase>>

## Notes

- Keep guidance minimal and factual
- Do not include assumptions
- Mark unknowns as `<unknown>`
```

Rules:

- Only include what was actually detected or confirmed
- Do not fabricate architecture or conventions
- Keep concise
- No extra sections

---

## Phase 4 — Output

Output ONLY the final `CLAUDE.md` content.

No explanations.
No summaries.
No extra text.

```

---

Isso elimina tudo que não é essencial e mantém o bootstrap alinhado com sua intenção: **entrada → detecção → perguntas mínimas → CLAUDE.md enxuto**.

:contentReference[oaicite:0]{index=0}
```
