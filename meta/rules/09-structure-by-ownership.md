# Structure By Ownership Rule

## Principle

Project structure should optimize ownership and traceability.

## Rules

- Group files by feature, domain, capability, package, or responsibility according to the existing architecture.
- Avoid scattering one behavior across many global technical folders unless the project intentionally uses that style.
- A developer should know where to start when debugging a specific behavior.
- Structure must serve navigation, not aesthetics.

## Violations

- One feature split across unrelated global folders with no clear owner.
- Technical-type folders make behavior hard to trace.
- New files ignore the surrounding project organization.
