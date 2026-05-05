# Locality Before Abstraction Rule

## Principle

Code should stay close to where it is used until reuse or complexity justifies extraction.

## Rules

- Prefer local helpers/components/modules first.
- Promote to shared only after real reuse or clear ownership emerges.
- Avoid global utility folders becoming dumping grounds.
- Do not abstract only to satisfy a pattern.

## Violations

- Shared utilities used by only one caller.
- Generic abstractions hiding simple behavior.
- Related feature logic scattered globally before reuse exists.
