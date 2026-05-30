---
name: create-component
description: Component architecture rules for this Next.js/TypeScript project. Use when creating, refactoring, reviewing, or moving React components, UI primitives, sections, hooks, helpers, constants, or shared components under src/.
---

# Component Architecture

Use this skill whenever work touches React/Next.js components in this project.

The goal is to keep components easy to read, predictable to grow, and reusable only when reuse is real.

## Core Rule

Every component is a folder in **PascalCase** with an `index.tsx` file.

```txt
ComponentName/
  index.tsx
```

The `index.tsx` file should contain the component's structural JSX: the "HTML shape" of the component.

## Component Logic

Logic that belongs to a component must live in an adjacent `hook.ts` file.

Use `hook.ts` for:

- prop manipulation;
- state;
- refs;
- effects;
- callbacks;
- derived values;
- mapping data into render-ready objects;
- component-specific behavior.

```txt
ComponentName/
  index.tsx
  hook.ts
```

Example:

```tsx
export function ComponentName() {
  const component = useComponentName();

  return <section>{component.title}</section>;
}
```

## Helpers

Reusable internal logic used by the hook belongs in an adjacent `helpers.ts` file.

```txt
ComponentName/
  index.tsx
  hook.ts
  helpers.ts
```

Use `helpers.ts` for pure functions that support the hook and may be tested or reused inside that component's folder.

Do not put JSX in `helpers.ts`.

## Constants

Magic values that repeat more than once belong in an adjacent `constants.ts` file.

```txt
ComponentName/
  index.tsx
  hook.ts
  constants.ts
```

Use `constants.ts` for repeated:

- class name groups;
- labels;
- animation values;
- timing values;
- layout values;
- configuration arrays local to the component.

Do not extract a value just because it exists once.

## Component Size Limit

A component function should have an inner content of at most **100 lines**.

If it grows beyond that, split it into subcomponents inside an adjacent `components/` folder.

```txt
ParentComponent/
  index.tsx
  hook.ts
  components/
    ChildComponent/
      index.tsx
      hook.ts
```

Prefer meaningful subcomponents over arbitrary line-count splits.

## Scope and Reuse

Keep components as local as possible until they are used in multiple parts of the codebase.

### Local component

If only one parent uses it:

```txt
ParentComponent/
  components/
    LocalComponent/
      index.tsx
```

### Shared component

If multiple unrelated parts of the code use it, move it to a high-level folder under `src/components`.

Common locations:

```txt
src/components/ui/
src/components/layout/
src/components/sections/
```

## UI Reuse Rule

Before creating a new UI primitive, check whether one already exists.

Always inspect existing shared UI first for things like:

- buttons;
- cards;
- badges;
- containers;
- sections;
- headings;
- inputs;
- links;
- layout wrappers.

For this project, common UI belongs in:

```txt
src/components/ui/
```

Do not create a one-off button/card style if the shared component can support the use case through props or `className`.

## Recommended Folder Pattern

```txt
src/
  components/
    ui/
      Button/
        index.tsx
        hook.ts
        constants.ts
      Card/
        index.tsx
        hook.ts

    layout/
      Header/
        index.tsx
        hook.ts
      Footer/
        index.tsx
        hook.ts

    sections/
      HeroSection/
        index.tsx
        hook.ts
        constants.ts
        components/
          HeroVisual/
            index.tsx
            hook.ts
```

## Data and Content

Keep section content and repeated business data outside JSX when practical.

Use `src/data/` for:

- services;
- cases;
- process steps;
- FAQ items;
- site links;
- repeated public copy.

Use `src/types/` for shared TypeScript types.

## App Router Rule

Keep `src/app/page.tsx` thin.

It should compose sections instead of owning section implementation details.

Example:

```tsx
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
      </main>
      <Footer />
    </>
  );
}
```

## Client Components

Use server components by default.

Add `"use client"` only when the component needs browser-only behavior such as:

- stateful interaction;
- refs that read DOM state;
- browser APIs;
- event-heavy behavior;
- animation libraries that require client execution.

## Implementation Checklist

Before editing or creating a component:

1. Check if a shared UI component already exists.
2. Decide if the component is local or shared.
3. Create a PascalCase folder with `index.tsx`.
4. Put render structure in `index.tsx`.
5. Put component logic in adjacent `hook.ts` when logic exists.
6. Put repeated magic values in adjacent `constants.ts`.
7. Put hook-supporting pure functions in adjacent `helpers.ts`.
8. Split into `components/` if the component function exceeds 100 lines.
9. Keep data/content in `src/data/` when it is not purely presentational.
10. Run the narrowest useful validation after changes.

## Validation

For component changes, prefer:

```bash
npm run lint
npm run build
```

If only Markdown or documentation changed, a code validation run is usually unnecessary.
