---
name: frontend
description: Force structured thinking about a screen/page/view layout before writing code. Resists AI-generic patterns (hero+three-feature-cards+CTA, default-centered everything, three-card grids, "welcome to X" hero sections, sidebars because dashboards-have-sidebars) by making the user articulate goal, hierarchy, content bounds, and states first. Use whenever the user says any variant of "design a layout", "plan the UI for", "pensa o layout de", "como deveria ser a tela de", "ajuda a pensar essa página", "layout pra <feature>", or starts implementing a screen without having articulated its shape. Also fire proactively when an implementation request asks to "build the X page" or "monta a tela de Y" without prior structural thinking. Outputs a `layout.md` brief consumable by `spec`, implementation prompts, and `code-review`. Does NOT write code, generate visual mockups, choose colors/typography, or pick a UI framework.
---

# Layout

Most AI-generated frontend looks the same because most prompts don't force any specificity. The model defaults to: hero + three feature cards + CTA, centered text, `max-w-7xl`, gradient buttons, sidebar because dashboards have sidebars, "Welcome to [Product]" headings. The output is competent and forgettable.

This skill exists to slow that process down. Before any JSX gets written, force articulation of: what the user is doing, what content is shown, what matters most, what states exist, and what makes this screen _not generic_. Then write a brief other skills can consume.

This skill is **a thinking aid, not a code generator**. The thesis is explicit: AI defaults toward the visually generic, and articulating structure beats it. If the thesis doesn't fit the task (e.g., a real marketing page where "hero+features+CTA" is the right answer because users have learned to scan it), the skill is the wrong tool — say so and move on.

## What this skill produces

- A `layout.md` brief covering goal, content, hierarchy, states, structure, and excluded options
- The brief lives next to the relevant spec if one exists (`meta/features/<name>/layout.md`), or wherever the user designates

## What this skill does NOT produce

- Code (JSX, HTML, CSS) — that's implementation
- Visual mockups, wireframes, or screenshots
- Color, typography, or spacing values (that's `designer`)
- Component library or framework selection (that's project-level)
- Recommendations about whether the layout is "good" — the user owns that judgment

## Phase 1 — Goal

What is the user _doing_ on this screen? Specific action, not generic display.

Goals to push back on:

- "Display the user list" — for what purpose? Browse, find one, compare, audit?
- "Welcome the user" — to do what next?
- "Show analytics" — analyze what? Decide what?
- "Marketing landing page" — convince of what specifically?

Goals that work:

- "Let admins quickly find one specific user and take an action on them"
- "Surface anomalies in this week's revenue so the operator decides where to investigate"
- "Convert visitors who already know the product into trial signups"

If the user gives a vague goal, push back once. If still vague, note the vagueness as a risk in the brief and proceed — the result will reflect the input.

## Phase 2 — Content inventory

Enumerate what's actually displayed. For each piece of content:

- The data field/concept
- **Bounds**: max length, max count, nullability, types ("name: 1–100 chars, may include emoji"; "items: 0 to ~10,000, often <50")
- Source: DB? API? user-generated? real-time?

This is the step that catches Lorem-ipsum-shaped design — layouts that work for fake content and break on real content. A username may be 1 char or 100. A list may have 0 items or 10,000. The layout has to handle both ends.

If the user can't enumerate the content, the screen isn't ready to design — go back to Phase 1.

## Phase 3 — Hierarchy

Force a declaration:

- **Primary** — the ONE most important thing on the screen. What the user looks at first. What everything else supports.
- **Secondary** — 1–2 things that matter but support primary.
- **Tertiary** — anything else that's there because it has to be (account menu, breadcrumb, footer).

If everything is primary, nothing is. Push back: "If you had to pick _one_ thing as most important, what would it be?"

The hierarchy directly drives the structural choice in Phase 5. A screen with one dominant primary action looks different from one with three peer actions.

## Phase 4 — States

Enumerate. None are optional except where genuinely impossible:

- **Empty** — no data, first time, list of zero, filter with no matches, post-deletion. How does the screen read?
- **Loading** — data isn't ready yet. Skeleton? Spinner? Optimistic? Don't auto-pick "skeleton" — for very fast loads, no indicator beats a flicker.
- **Error** — request failed, data is wrong, user lacks permission. Specifically: how does the user recover?
- **Normal** — the happy path most designs default to. Now no longer the only path considered.
- **Edge cases** — a single item (does the layout still work?), many items (overflow gracefully?), very long content (does the username break the header?), missing optional fields (no avatar, no description).

If the user says "this screen always has data, no empty state needed" — verify. First-run, post-deletion, and filter-with-no-matches all create empty states even when steady state is non-empty.

## Phase 5 — Structure (with anti-pattern resistance)

Now propose a structural shape, tied to what came before. **The shape serves the hierarchy from Phase 3 and the content from Phase 2.** Not a default.

### AI defaults worth resisting

These are patterns the model produces when not pushed. Resist them unless there's a specific reason in the inputs that justifies them:

- **"Hero + three feature cards + CTA"** as the default landing page shape. If the page really is about three equally-weighted features, fine. Otherwise, it's the AI generic.
- **Three-card or four-card symmetric grid for everything**. Symmetric grids imply equal weight. If items have different importance or different content shapes, an even grid lies about it.
- **Centered everything**. Centering works for content with no inherent direction (a logo + tagline). Articles, forms, dashboards, and lists read better aligned to a baseline. AI centers by default; resist.
- **`max-w-7xl` content rivers regardless of content**. Reading text wants ~60–75 chars per line (~640px in Latin scripts; differs for CJK). A dashboard wants the available width. A form wants ~480px. The right max-width depends on what's inside.
- **Sidebar because "dashboards have sidebars"**. Only if there's actually persistent navigation needed _across_ views. A sidebar for one screen is wrong; an empty sidebar with placeholder items is worse.
- **"Welcome to [Product]" hero sections**. If you can replace the product name and the page still works, it's not a real hero — it's filler.
- **Symmetric four-column footers with placeholder link groups**. Same problem as feature card grids; symmetric implies all four matter equally, which is rarely true.
- **Search/filter/sort bars added because UIs have those**. Only when content count and the user's task warrant them. A list of 5 items doesn't need search; a list of 5,000 does.
- **Decorative "feature cards" with a Lucide icon, a heading, and two lines of text**. AI loves these. They rarely earn their place outside marketing pages whose actual purpose is to use them.
- **Mobile = stacked desktop**. If the only mobile adaptation is "stack everything vertically," the design isn't responsive — it's resized. Real responsive design changes information density, hides secondary content, and may use different patterns at different sizes.

The point isn't that any of these is universally bad. The point is they're produced _by default_, without thinking, and the brief is where thinking happens.

### Structural shapes to consider

Pick one (or describe a custom shape) based on the inputs from earlier phases:

- **One column, content-driven width** — articles, focused single-task screens, forms
- **Split: primary content + supporting context** — list + detail, editor + preview, item + metadata
- **Asymmetric grid** — mixed-weight content where some items are larger than others by intent
- **Dashboard grid** — multiple roughly peer modules; only when modules really are peers
- **Full-bleed media + content** — when an image or video _is_ the content, not decoration
- **Stepped flow** — multi-step task where each step is its own focused screen

State the chosen shape and **why it ties to the hierarchy and content** above. "One column because the user's primary task is reading the article; nothing else competes" is good. "Two columns because dashboards have two columns" is bad.

### What this screen is NOT

Name 2–3 patterns this screen deliberately doesn't follow. Mandatory section — it forces explicit rejection of defaults rather than silent omission. Examples:

- "Not a hero+features+CTA — this is a returning-user dashboard, not a marketing surface"
- "Not a three-card grid — the items have different weight"
- "No sidebar — this is a single-screen task; navigation lives in the header"

## Phase 6 — Output

Write the brief.

```
# Layout: <screen name>

## Goal
<one sentence: what the user does here, specific and not generic>

## Primary content
<the ONE most important thing on this screen>

## Content inventory
- <field>: <bounds — length, count, nullability, source>
- ...

## Hierarchy
- Primary: <what>
- Secondary: <what>
- Tertiary: <what>

## States
- **Empty**: <how it reads / what it offers>
- **Loading**: <approach + reasoning>
- **Error**: <how the user recovers>
- **Normal**: <the steady state, briefly>
- **Edge cases**: <single item, many items, long content, missing fields>

## Structure
- Shape: <one column / split / asymmetric / dashboard grid / etc.>
- Why: <ties to hierarchy and content above>
- Header: <yes/no + what it holds>
- Sidebar: <yes/no + why>
- Footer: <yes/no + what>
- Responsive: <how the shape adapts; "stacks vertically" is not an answer>

## What this screen is NOT
- <pattern>: <why we resist it here>
- ...

## Deliberately excluded
- <thing>: <why>

## Notes
<anything that didn't fit but matters for implementation or review>
```

### Where to write

- If `meta/features/<name>/` exists for this feature → `meta/features/<name>/layout.md`
- Otherwise → `meta/layouts/<screen-name>.md`
- If the user wants the brief inline (no file) → return it in chat instead

## Behavior

- **Force articulation; don't accept vague goals.** "Show data" is not a goal. Push back at least once.
- **Don't propose code.** Not even illustrative JSX. The brief is the deliverable; code is implementation.
- **Don't invent content.** If the user can't enumerate what's displayed, the screen isn't ready to design — go back to goal.
- **Don't recommend a "good" or "bad" layout.** Describe the choice and tie it to inputs. The user owns the judgment.
- **Don't choose visuals.** Color, typography, spacing values, icon style, illustration treatment — out of scope. The brief stops at structure.
- **Resist defaults explicitly.** "What this screen is NOT" is mandatory, not decorative — it's the section that beats AI generic.
- **Don't expand into features.** Designing a layout doesn't mean adding new functionality. Stick to what the screen does.
- **Honor the writing language.** Brief prose follows the user's conversation language; identifiers (file names, field names) follow the project's existing convention.

## How this composes with other skills

- **With `spec`** — generate the layout brief during or after Phase 2 (Spec). The brief informs the implementation prompt. `meta/features/<name>/layout.md` sits next to the spec file.
- **With implementation prompts** — the executing model reads `layout.md` before writing JSX. The brief constrains structural choices so the implementation doesn't drift back into AI generic.
- **With `code-review`** — the review can check the implementation against the brief. "The brief said 'no sidebar' but the implementation has one — was that intentional?"
- **With `designer`** — `layout.md` is structural; `tokens.ts` is visual. Complementary, not overlapping. Layout doesn't pick colors; designer doesn't pick page shape.

## Example flow

User: "pensa o layout da tela de billing do app"

Skill:

1. **Goal** — "show billing info"? Push back: what does the user _do_ here? Clarified: "see what they were charged for, find a specific invoice, dispute a charge if needed."
2. **Content inventory** — invoices (10–50/year typical, 0 for new accounts), each with date, amount, status, line items (1–20 per invoice), download link, dispute affordance. Payment method on file. Next billing date. Source: API, ~500ms cold load.
3. **Hierarchy** — Primary: list of recent invoices. Secondary: payment method + next bill date. Tertiary: account-level navigation.
4. **States** —
   - Empty: "No invoices yet. Your first bill is on <date>."
   - Loading: skeleton list (cold load is slow enough that flicker would be worse)
   - Error: retry CTA + support link
   - Normal: chronological invoice list
   - Edge cases: invoice with 1 line item; invoice with 20+ (truncate w/ expand); pending dispute (visual marker)
5. **Structure** — One column, ~720px content width. Primary task is scanning a list and clicking into one — no secondary content needs persistent visibility. Header carries account context. No sidebar (single-screen task; nav in global header). Mobile: invoice cards stack, no horizontal-scroll tables.
6. **What this screen is NOT** —
   - Not a dashboard with charts (this is a transaction list, not analytics)
   - Not a three-column grid (invoices have temporal order; grid loses that)
   - No sidebar (single-screen task)
7. **Output** — write `meta/features/billing/layout.md`.

## Versioning

`v1.0` — 2026-05.
