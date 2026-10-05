# Experiment 011: CSS Custom Highlight API & Non-Destructive Text Styling

## Title
CSS Custom Highlight API & Non-Destructive Text Styling

## Goal
Explore the CSS Custom Highlight API Level 1 (`CSS.highlights`, `new Highlight()`, and `::highlight()` pseudo-element), demonstrating how arbitrary character offset ranges within a single, unmodified text node can be styled with custom background fills and decorations without altering DOM tree structure or injecting inline `<span>` elements.

## Selected Idea
Archival Scholarly Manuscript / Philological Codex. The phrase "Hello World" resides in a single, raw text node within `<h1>`. JavaScript `Range` objects define boundary offsets for "Hello" [0…5] and "World" [6…11]. These ranges are registered into the global `CSS.highlights` map and styled via `::highlight(hl-hello)` (saffron wash + solid rule) and `::highlight(hl-world)` (rose wash + wavy underline).

## Technology
- CSS Custom Highlight API Level 1 (`CSS.highlights.set()`, `new Highlight(range)`, `::highlight()`)
- DOM Range API (`new Range()`, `range.setStart()`, `range.setEnd()`)
- Semantic HTML5

## Mechanism Signature
`DOM Range text offsets -> CSS.highlights registry -> ::highlight pseudo-element painting -> non-destructive highlighted Hello World`

## Design Signature
- Typography: Humanist scholarly serif (`"Palatino"`, `"Georgia"`, serif) with sharp contrast
- Color: Manuscript vellum (`#f5efe4`), iron gall ink (`#1a1815`), illuminated saffron (`#ffe66d`), rose cinnabar (`#ff758f`), sepia marginalia (`#665f55`)
- Composition: Illuminated manuscript folio with marginal registry column and central text passage
- Material: Fine textured rag vellum sheet
- Motion: Static

## Implementation Summary
The HTML declares an `<h1 id="subject-node">Hello World</h1>`. The element has exactly zero child elements (`h1El.children.length === 0`) and one text node.
Two `Range` objects are defined:
- `rangeHello`: start 0, end 5
- `rangeWorld`: start 6, end 11
These are registered with `CSS.highlights.set('hl-hello', new Highlight(rangeHello))` and `CSS.highlights.set('hl-world', new Highlight(rangeWorld))`. The browser's paint pipeline natively draws the saffron and rose highlight boxes over the glyph runs without DOM wrappers.

## Architectural Decisions
- Used the native CSS Custom Highlight API rather than wrapping words in `<mark>` or `<span>` tags. This demonstrates modern non-destructive text decoration, crucial for search highlighters and syntax stylers where DOM mutation can disrupt caret positions or virtualized text flows.
- Verified DOM tree integrity in `window.labEvidence()`, confirming that `h1.children.length === 0` and node text content remains intact.

## Verification Evidence
- Automated verification command: `node tools.js verify 011/011.dev.html 011` returned `OK` with exit code `0`.
- Dependency check: zero external assets, zero network requests.
- Browser test: valid doctype, zero console errors, zero runtime exceptions, valid CSS.
- Runtime evidence: `highlightApiSupported: true`, `registeredHighlights: ["hl-hello", "hl-world"]`, `domChildrenCount: 0`, `rawTextNodeLength: 11`.

## Visual Evidence & Review
- Screenshot captured: `011/screenshot.png` (1280x800).
- Visual review confirmed:
  - "Hello" is highlighted in radiant saffron yellow with a crisp baseline rule.
  - "World" is highlighted in delicate rose with a decorative wavy underline.
  - "Hello World" is the unmistakable primary visual subject on the vellum folio sheet.

## Limitations
- Static highlighted ranges; does not test native HTML top-layer dialog promotion or modal focus traps. Native `<dialog>` and Top Layer will be explored in Experiment 012.
