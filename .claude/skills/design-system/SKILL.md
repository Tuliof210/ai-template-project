---
name: design-system
description: Audit a project's frontend codebase and extract a coherent design token system from the values already in use — colors, typography, spacing, sizing, and effects. Use whenever the user says any variant of "create a design system", "audit our design tokens", "extract design tokens", "consolidate our colors/spacing/typography", "cria um design system", "extrai os tokens", "auditoria de design", or notes visual inconsistency like "tem mil azuis diferentes" / "the colors are all over the place". Also fire proactively when the user explicitly mentions visual inconsistency or starts a deliberate styling consolidation pass — not just because they're touching frontend code. Produces token files in the project's idiomatic format, contrast-risk flags for color consolidations, and a `DESIGN-DECISIONS.md` explaining what was consolidated and why. Does NOT redesign, generate brand identity, build components, migrate existing components to the new tokens, or make aesthetic choices — those are separate concerns.
---

# Designer

Audit, consolidate, and codify the design decisions already present in the codebase. This skill is a **structural auditor** — it surfaces and organizes the visual language already living in your code. It is not a design adviser and does not make aesthetic, brand, or hierarchy decisions.

The user already has a visual language. The job is to surface it, deduplicate it where safe, name it, check it for accessibility regressions, and put it in one place.

## What this skill produces

- Token files in the project's existing format (CSS variables, theme object, Tailwind config, JSON, etc.)
- Contrast-risk flags for any color consolidation that may regress WCAG compliance
- A `DESIGN-DECISIONS.md` documenting what was consolidated, what was kept distinct, and what the user needs to decide
- A short audit report in chat

## What this skill explicitly does NOT produce

- New colors, fonts, or scales not derivable from the codebase (no inventing brand)
- Components or Storybook entries (separate concern)
- Migrations of existing components to use the tokens (separate refactor task)
- Visual mockups, screens, or marketing assets
- Aesthetic recommendations, hierarchy decisions, or brand voice

If the user asks for any of the above, redirect — this skill is structural only.

## Phase 0 — Pre-flight

Verify the project has frontend code:

- `package.json` with a UI framework dep (React, Vue, Svelte, Solid, Angular, Astro, etc.)
- OR `*.css`, `*.scss`, `*.tailwind.css`, or styled-components/emotion usage
- OR HTML/CSS files at root in a clearly visual codebase

If none of these exist, say so and ask whether the user actually wants this skill.

If the project already has a tokens file (`tokens/`, `theme/`, `design-tokens.{json,ts,js}`, a populated `tailwind.config` theme), don't replace it. Read it as the canonical existing state and augment from values discovered in the rest of the code. Treating it as the starting point makes the audit additive rather than destructive.

## Phase 1 — Detect stack and current state

Identify how design values are currently expressed. The patterns below are listed in no order of preference:

| Pattern                            | Where to look                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| Component library theme            | MUI/Chakra/Mantine/Ant Design theme files (`createTheme`, `extendTheme`, etc.)                   |
| CSS-in-JS                          | styled-components, emotion, vanilla-extract, stitches — theme objects + inline `${props => ...}` |
| CSS variables / vanilla CSS / Sass | `:root { --... }` declarations, hex/rgb/hsl literals in `.css`/`.scss`                           |
| Existing tokens file               | `tokens/`, `theme/`, `design-tokens.json`, populated `theme.extend`                              |
| Inline styles                      | `style={{ ... }}` props, `:style="{ ... }"` in templates                                         |
| Tailwind utilities                 | `tailwind.config.{js,ts,mjs}`, classes in JSX/HTML, arbitrary values like `bg-[#3b82f6]`         |

Identify the **primary** pattern (most usage). A project may have several — note all relevant ones, but the primary determines output format. Don't ask the user yet.

Also detect the project's **identifier language**: scan existing token names, CSS variable names, and theme keys. If they're consistently in English (`color-action`, `--surface-primary`), default to English. If they're in another language (`cor-acao`, `--superficie-primaria`), match that. If unclear or no existing tokens, ask in Phase 3.

## Phase 2 — Audit

Scan the codebase for actual values in use. Build an internal inventory; don't dump raw data on the user.

For each category, record: value (canonicalized), frequency, top 3 locations (file:line), apparent role from context.

### Categories

**Colors** — every literal (hex, rgb, rgba, hsl, named) and every theme color reference.

**Typography**

- Font families
- Font sizes (px, rem, em)
- Font weights
- Line heights
- Letter spacing — only if used as a deliberate decision

**Spacing** — padding, margin, gap values. Group by raw value to detect any implicit base.

**Sizing**

- Border radius
- Border widths
- Container widths / max-widths
- Breakpoints

**Effects**

- Shadows
- Opacity (only if used as design decision, not just for disabled states)

**Z-index** — explicit values, especially if they hint at a layering system.

**Ignore for now**: transition curves (often per-component), component-level sizes (button heights — derivable from spacing + sizing).

### Size assessment (off-ramp for small projects)

After the inventory, check size thresholds:

- Colors < ~15 distinct values
- Font sizes < ~6
- Spacing < ~8 distinct values

If **all** are below threshold, the codebase is likely too small for consolidation to add value. Output the inventory as a brief report and ask whether to:

1. **Stop here** — the project doesn't need a token layer yet
2. **Generate tokens anyway** — codify what's there for future growth
3. **Wait until growth** — re-run the audit when surfaces multiply

Only proceed to Phase 3 if the user picks option 2 or any single category exceeds threshold.

## Phase 3 — Consolidate

This is the judgment phase. Apply confidence levels — never merge across them silently.

### Color consolidation

- **High-confidence merge** (same hex, OR within 2 units across all RGB channels — `#3b82f6` and `#3b82f5`): consolidate, note in report.
- **Medium-confidence merge** (visually similar but distinct, e.g., `#3b82f6` and `#3a83f7`): propose to user, don't merge without confirmation.
- **Low-confidence merge** (different hues sharing a role — two greens both used for "success"): never merge without explicit confirmation. May be intentional (success vs active state).
- Identify a **scale per hue** when 3+ shades exist (50, 100, …, 900). Don't fabricate shades not present in the code.

### Contrast check (mandatory for any color consolidation)

Before finalizing a merge of colors used as text or background, verify WCAG contrast does not regress:

- For each merge target: check contrast ratio against common backgrounds in the codebase (white, the project's main dark background, light/dark surfaces if both exist).
- WCAG AA thresholds: **4.5:1** for normal text, **3:1** for large text and UI components.
- If any merged variant passed AA against a real codebase background and the consolidated value fails, flag the merge as a **contrast risk** and require user confirmation. Don't silently degrade accessibility for the sake of consolidation.
- Record results in `DESIGN-DECISIONS.md` under a Contrast section.

This is automated AA checking against detected backgrounds — full accessibility audit (focus indicators, color-blind variants, AAA compliance, motion sensitivity) is a separate concern.

### Typography consolidation

- Cluster sizes into a scale based on what's actually present. Sizes 12, 14, 16, 18, 20, 24, 32 → that's the scale; don't add 36 to "complete a ratio."
- Sizes 13, 14, 15, 16, 17, 18 → describe as outliers, ask the user whether they're deliberate or worth rounding.
- Font families: count is project-dependent. A SaaS app rarely has more than 3; an editorial site or design tool may legitimately have 5+. Don't assume "too many" — describe what's there.

### Spacing consolidation

- Detect the implicit base unit if one exists (4px, 8px, golden ratio, t-shirt sizing). If no base is visible, say so — not every project has a numerical scale.
- Values appearing once in the codebase get listed as **outliers — your call**: the user decides whether they're accidents to consolidate or deliberate one-offs to preserve.

### Sizing and effects consolidation

- Border radius and shadow counts vary widely by design language. Brutalist designs may have 0 radii; soft-UI may have 10. Material has 24 elevations on purpose. Describe what's in the code; don't flatten on assumption.

### State and gap analysis (optional, opt-in only)

After consolidation, identify whether the system has obvious **state gaps** the codebase may not exercise yet:

- Interactive color used (e.g., `color-action`) but no hover/active/focus/disabled variant present
- Semantic colors with one role but missing adjacent ones (only `success` exists, no `warning`/`danger`/`info`)
- Single elevation but no contrast levels for layered surfaces

Don't auto-add. Surface them explicitly: "The codebase uses a primary action color but has no hover or disabled variant. Want me to propose them by shifting one shade in your existing scale, or leave the system as-is?"

The proposals are **derived** from the existing scale (e.g., one shade darker for hover), not invented. The user explicitly opts in or out per gap. If they decline, the system stays as the codebase has it.

### Naming convention

Three approaches, presented neutrally — pick one based on the project's needs:

**1. Foundational only** (Tailwind, Open Props philosophy)

- Tokens are raw values: `blue-500`, `gray-900`, `space-4`, `radius-md`
- Components encode semantics inline: `<button className="bg-blue-500 hover:bg-blue-600">`
- Trade-off: simpler mental model and grepability; rebrand requires editing components.

**2. Semantic only** (Material 3, Radix Colors philosophy)

- Tokens describe intent: `color-action`, `color-surface`, `color-text-primary`
- Raw values aren't surfaced to consumers
- Trade-off: clean intent everywhere; debugging requires resolving the alias; intents may proliferate (`color-text-link-hover-disabled-on-dark`).

**3. Two-layer**

- Foundational layer (`blue-500: #3b82f6`) plus semantic layer referencing it (`color-action: blue-500`)
- Both are exported; consumers usually use semantic, debuggers can drop to foundational
- Trade-off: most flexible; two places to maintain; verbose for small projects.

If the project's existing tokens (or theme) clearly follow one of these, match it. If not, ask the user — none is universally better.

## Phase 4 — Generate

Write tokens to the project's idiomatic location and format. Each stack gets equivalent treatment.

### Where to write, by stack

- **Component library theme** — extend the library's existing theme file in place (`createTheme`/`extendTheme`/etc.). Don't introduce a parallel tokens file.
- **CSS-in-JS** — write a `theme.ts` exporting a typed theme object. If the app doesn't already use a `<ThemeProvider>`, instruct in `DESIGN-DECISIONS.md` how to wrap.
- **CSS variables / vanilla CSS / Sass** — write `tokens.css` with `:root { --color-action: ...; }`, or `_tokens.scss` with Sass variables, depending on the project's existing style.
- **Existing tokens file** — augment in place. Preserve original structure. Add `// added by designer audit YYYY-MM` comments next to additions.
- **Inline styles project** — write `tokens.ts` exporting plain object/maps. Instruct where to import.
- **Tailwind** — write a `tokens.ts` exporting the theme structure, then instruct in `DESIGN-DECISIONS.md` how to import it into `tailwind.config.ts` at `theme.extend`. Don't auto-modify the config — it may have plugins, custom utilities, or layers that an automatic edit could break.

### What NOT to do

- Don't modify component code. Tokens are produced; using them is a separate task.
- Don't introduce a second token mechanism alongside an existing one (no CSS variables alongside an established Tailwind config "for completeness").
- Don't auto-edit complex config files (Tailwind, MUI theme, etc.) — produce the tokens module, document the wiring step.

### `DESIGN-DECISIONS.md` structure

```
<!-- Generated YYYY-MM by `designer` skill. Re-run if values accumulate. -->

# Design Decisions

## Token categories included
<list — explicitly note any excluded category and why>

## How to wire tokens up
<stack-specific instructions: how to import into tailwind.config.ts, how to wrap with ThemeProvider, etc.>

## Foundational tokens
| Name | Value | Derived from |
|------|-------|--------------|
| `blue-500` | `#3b82f6` | 23 occurrences across components |

## Semantic tokens (if applicable for chosen layering)
| Name | References | Intent |
|------|-----------|--------|
| `color-action` | `blue-500` | Primary buttons, links, active states |

## Consolidations applied (high-confidence)
- 5 distinct blues collapsed into `blue-500`: `#3b82f6` (23×), `#3b82f5` (4×), `#3c83f7` (2×), `#3a82f5` (1×), `#3b81f6` (1×). Differences below visual perception threshold; contrast ratios verified equivalent.

## Consolidations awaiting your decision
- `green-500` (success contexts) and `green-600` (active states): visually similar but used for distinct intents. Confirm: merge or keep distinct?

## Contrast (WCAG AA)
- Verified consolidated colors against the codebase's main backgrounds at AA (4.5:1 for text, 3:1 for UI).
- Risks flagged: <none / list>
- This is automated AA checking only. Full accessibility audit (focus indicators, color-blind variants, AAA, motion) is a separate concern.

## Outliers — your call
Values appearing once or rarely in the codebase. The audit doesn't assume these are accidents. You decide:
- `padding: 17px` in `legacy/old-modal.tsx:42` — keep distinct (rename to a token), consolidate to `space-4` (16px), or treat as one-off (no token).

## State gaps surfaced
<surfaced gaps the user opted into filling, with derivation notes; or "user opted to leave the system as-is">

## Conventions
- Naming layer: <foundational only | semantic only | two-layer>
- Identifier language: <English | Portuguese | etc.>
- Color scale: 50, 100, …, 900 per hue (where shades exist)
- Spacing base: <detected base or "no numerical base">
```

## Phase 5 — Report

Output in chat — concise, scannable. The user reads files for detail.

```
## Design audit complete

**Stack:** <detected>
**Existing token layer:** <none / partial / present>

### Inventory → consolidated
- Colors: 47 distinct → 18 tokens (8 grays + 5 blues + semantic mappings)
- Typography: 12 sizes → scale of 7 (12px–48px)
- Spacing: 31 values → scale of 8 on 4px base
- Border radius: 6 values → 4 tokens
- Shadows: 9 → 4 elevations

### Files written
- <token file path>
- <DESIGN-DECISIONS.md path>

### Awaiting your decision (in DESIGN-DECISIONS.md)
- 3 medium-confidence color merges
- 2 typography outliers (13px, 15px appearing once each)
- 1 spacing outlier (17px in legacy/old-modal.tsx)
- 1 contrast risk (consolidating gray-400 and gray-450 — gray-450 was passing AA on dark surfaces; consolidated value fails)

### State gaps surfaced
- No hover/disabled variants for `color-action` (you opted to skip — system left as in code)

### Not done (intentionally out of scope)
- Wiring tokens into the build — instructions in DESIGN-DECISIONS.md
- Migrating components to reference tokens — use `refactor` skill or do manually
- Aesthetic / hierarchy decisions — this skill audits, doesn't recommend
```

## Behavior

- **Don't fabricate brand.** Tokens derive from values found in the codebase, or are user-confirmed canonicalizations of similar values, or are user-confirmed gap-fills derived from the existing scale. Never invented from nothing.
- **Don't degrade accessibility silently.** Any consolidation that risks regressing WCAG AA against the codebase's actual backgrounds is flagged for confirmation, not auto-applied.
- **Don't recommend aesthetic choices.** "Should we use blue or green?" "Is this too many fonts?" — out of scope. The skill describes; the user decides.
- **Don't merge across confidence levels silently.** High-confidence goes through with a report; medium and low require user confirmation.
- **Don't migrate components.** Producing tokens is one job; using them is another.
- **Don't fight the existing pattern.** Each stack gets its idiomatic output. No introducing CSS variables alongside Tailwind because they're "more standard."
- **Don't editorialize.** Use neutral language ("outlier", "uncommon value", "value appearing N times") rather than terms that imply defect ("drift", "stale", "wrong").
- **Match the project's identifier language.** If existing tokens are in Portuguese, new tokens are too. Default English only when no convention exists and the user doesn't specify.

## When to ask the user

Ask when:

- Medium- or low-confidence color merges
- Naming convention (foundational / semantic / two-layer) when no existing convention is detectable
- Identifier language when no existing tokens make it clear
- State gap fills (always opt-in, never automatic)
- Audit reveals so much consolidation that real opinions are needed (e.g., >50% reduction in any category)
- Contrast risks identified during consolidation
- Project size below threshold — confirm whether to proceed

Don't ask about:

- The stack (detect it)
- Where to write files (idiomatic location for the stack)
- Token categories to include (default: colors, typography, spacing, sizing — universally useful four; effects/z-index added when present in the code)

## Example flow

User: "audita o design system desse projeto"

Skill:

1. **Phase 0** — confirms it's a frontend project (Next.js + Tailwind), no `tokens/` file, partial `theme.extend` in `tailwind.config.ts` with 3 custom colors.
2. **Phase 1** — primary pattern: Tailwind classes + occasional inline `style={}`. Identifier language: English (matches existing custom color names).
3. **Phase 2** — scans `app/` and `components/`, finds 47 colors, 12 font sizes, 31 spacing values, 9 shadows. All categories above threshold, proceed.
4. **Phase 3** —
   - Consolidates 47 → 18 colors (high-confidence merges).
   - Runs WCAG check: 1 risk found (gray-400/gray-450 merge fails AA on dark surface).
   - Proposes 3 medium-confidence merges to user.
   - Identifies state gap: `color-action` exists but no hover variant. Asks user.
   - Asks naming convention: detected partial semantic naming in existing custom colors → suggests two-layer to extend, user confirms.
5. **Phase 4** — writes `tokens.ts` and `tokens/DESIGN-DECISIONS.md`. Does NOT touch `tailwind.config.ts`; documents the import step.
6. **Phase 5** — reports: "47 → 18 tokens. 12 sizes → scale of 7. Spacing on 4px base. 3 awaiting your call. 1 contrast risk flagged. State gap for hover variant — you chose to skip. tokens.ts ready to wire (instructions in DESIGN-DECISIONS.md)."

## Versioning

`v1.1` — 2026-05. Bias corrections: WCAG contrast checking; neutral naming convention presentation (no more "recommended"); equivalent treatment for all stacks; explicit opt-in for state gap-filling; off-ramp for small projects; "outlier" language replacing "drift"; identifier language detected rather than assumed.

`v1.0` — 2026-05. Initial.
