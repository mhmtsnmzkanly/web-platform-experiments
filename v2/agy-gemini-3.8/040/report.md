# Experiment 040: HTML5 Exclusive Accordions & CSS :open Mechanical Index

## Metadata
- **Experiment ID**: 040
- **Technology**: HTML5 `<details name="...">` Exclusive Accordions and CSS Selectors Level 4 `:open` pseudo-class
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 040 demonstrates declarative, native document mutual exclusion and state-driven styling through HTML5 `<details name="...">` exclusive accordions and the CSS `:open` pseudo-class.

Historically, implementing single-select accordion groups required bespoke JavaScript event listeners, manual ARIA state toggles (`aria-expanded`), and coordinate synchronisation. Recent standardization in the WHATWG HTML specification and Chromium 120+ provides native browser-level mutual exclusion:
1. **Declarative Exclusive Grouping (`<details name="...">`)**:
   - Multiple `<details>` elements assigned the same `name` attribute value (`name="proscenium-catalogue"`) form a synchronized disclosure group.
   - When any collapsed details element in the group is opened by the user, the browser kernel automatically collapses all other open details elements in that same group without requiring custom script listeners.
2. **CSS `:open` Pseudo-Class**:
   - CSS Selectors Level 4 standardizes the `:open` pseudo-class to match elements that are currently expanded.
   - Applied via `details.exclusive-chamber:open`, the active chamber receives dynamic visual elevation, including warm brass gold borders (`#d97706`), rotated chevron glyphs (`transform: rotate(90deg)`), and glowing radial illumination.
3. **Mechanical Archival Proscenium**:
   - Chamber 01 acts as the primary repository chamber, opened by default and containing the monumental primary subject `<h1 id="subject-hello-world">Hello World</h1>`.
   - Chambers 02 and 03 represent collapsed metrology and classification archives.
   - A tripartite audit deck inspects DOM properties (`name`, `open`) and computed border styles directly from the cascade.

## Verification Summary
- **CDP Verification Script**: `./verify.sh 040/040.dev.html 040`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **Total Chambers in Group**: 3 elements verified.
- **Active Open Chamber**: 1 chamber (`CHAMBER-01`) confirmed active.
- **CSS `:open` Computed Border**: `rgb(217, 119, 6)` (#d97706).
- **Group Identifier**: `"proscenium-catalogue"` confirmed on all 3 `<details>` elements.
