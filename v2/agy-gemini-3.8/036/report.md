# Experiment 036: CSS @scope Donut Scoping & Scope Proximity Laboratory

## Metadata
- **Experiment ID**: 036
- **Technology**: W3C CSS Cascading and Inheritance Level 6 (`@scope`, donut scoping `to (.limit)`, scope proximity precedence)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 036 explores CSS Cascading and Inheritance Level 6 native `@scope` rules. Prior to `@scope`, scoping styles to a component required either BEM naming conventions, CSS Modules hash mangling, or Shadow DOM encapsulation (which severs inherited typography and cascade participation).

`@scope` introduces native scoped style boundaries directly within the light DOM cascade:
1. **Donut Scoping (`@scope (.root) to (.limit)`)**:
   Styles declared within `@scope (.chamber-alpha) to (.sanctum-boundary)` apply to elements rooted inside `.chamber-alpha`, but halt cleanly at `.sanctum-boundary`, leaving elements inside the donut hole unaffected by Chamber Alpha's scoped rules.
2. **Scope Proximity Precedence**:
   When two conflicting scoped rules target the same element with identical specificity, CSS Cascade Level 6 resolves the conflict by proximity: the rule whose scoping root has fewer DOM steps (closer ancestor) to the subject element wins over a more distant scoping root, regardless of order of appearance.
3. **Dual Chamber Architecture**:
   - **Chamber Alpha (Atrium)**: Scoped with cyan neon styling (`color: #38bdf8`, cyan border accents) with a donut limit on `.sanctum-boundary`. Inside Chamber Alpha resides the primary subject `h1#subject-hello-world`.
   - **Chamber Beta (Inner Sanctum)**: Nested inside the donut hole of Chamber Alpha, Chamber Beta establishes its own scope rooted at `.chamber-beta` with emerald styling (`color: #34d399`, emerald border accents). It contains an isolated nested subject `h1#subject-hello-world-nested`.
4. **CSSOM Introspection**:
   The runtime JavaScript inspects `document.styleSheets` to verify `CSSScopeRule` presence, extracting `conditionText` (`.chamber-alpha to (.sanctum-boundary)` and `.chamber-beta`) and confirming computed style color values across the boundary.

## Verification Summary
- **CDP Verification Script**: `./verify.sh 036/036.dev.html 036`
- **Result**: `OK` (Exit code 0)
- **Visible Subjects**: Dual `<h1>Hello World</h1>` headings detected and measured.
- **Computed Colors**:
  - Chamber Alpha subject: `rgb(56, 189, 248)` (#38bdf8)
  - Chamber Beta subject: `rgb(52, 211, 153)` (#34d399)
- **Donut Boundary**: Verified that Chamber Alpha's scoped styles do not penetrate past `.sanctum-boundary`.
- **CSSScopeRule Count**: 2 active `@scope` rules registered and validated.
