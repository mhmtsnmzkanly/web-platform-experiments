# Experiment 007: CSS Multi-column Fragmentation & Spanning Layout

## Title
CSS Multi-column Fragmentation & Spanning Layout

## Goal
Explore the CSS Multi-column Layout Level 1 specification (`column-count`, `column-gap`, `column-rule`, and `column-span: all`), demonstrating how the browser balances inline and block content across multiple reading lanes and integrates spanning header elements.

## Selected Idea
19th Century Broadsheet Gazette / Periodical Edition. A 3-column layout where a monumental headline "Hello World" spans all 3 columns using `column-span: all`, while introductory editorial prose flows and fragments naturally across the 3 vertical columns with authentic vertical rules and drop-cap styling.

## Technology
- CSS Multi-column Layout Level 1 (`column-count: 3`, `column-gap: 32px`, `column-rule`, `column-span: all`)
- CSS Generated Content / Drop Cap (`::first-letter` / float drop cap)
- Semantic HTML5 (`<main>`, `<header>`, `<article>`, `<h1>`, `<p>`, `<footer>`)

## Mechanism Signature
`CSS multi-column container -> column-span header integration -> column height balancing & overflow fragmentation -> editorial broadsheet Hello World`

## Design Signature
- Typography: Historic transitional editorial serif (`"Baskerville"`, `"Georgia"`, serif) with authentic small-caps dateline and burnt sienna drop-cap
- Color: Aged newsprint cream (`#f7f3ea`), printer's carbon black (`#141312`), burnt sienna rule (`#8c3a27`), sepia gray rules (`#d5cdbd`)
- Composition: 3-column newspaper broadsheet with double-line masthead and spanned headline
- Material: Heavy pulp newsprint paper with ink rules
- Motion: Static

## Implementation Summary
The article container `.article-columns` declares `column-count: 3; column-gap: 32px; column-rule: 1px solid var(--color-rule)`. The primary headline `h1.broadsheet-headline` declares `column-span: all`. In the browser's layout engine, `column-span: all` establishes a fragmentation boundary that spans across all three column tracks. The body paragraphs beneath the headline are automatically balanced across the 3 vertical columns.

## Architectural Decisions
- Used native CSS multi-column properties (`columns: 3` and `column-span: all`) rather than CSS Grid or Flexbox, demonstrating the browser's dedicated document fragmentation algorithms.
- Kept the headline text as clean "Hello World" within `<h1>` to satisfy strict DOM visibility and semantic structure.
- Embedded `window.labEvidence()` verifying computed columnCount (3), columnSpan ('all'), and confirming that the headline width matches the article container width (998px).

## Verification Evidence
- Automated verification command: `node tools.js verify 007/007.dev.html 007` returned `OK` with exit code `0`.
- Dependency check: zero external assets, zero network requests.
- Browser test: valid doctype, zero console errors, zero runtime exceptions, valid CSS.
- Runtime evidence: `columnCount: 3`, `columnSpan: "all"`, `headlineWidth: 998px`, `articleWidth: 998px`, `columnGap: "32px"`.

## Visual Evidence & Review
- Screenshot captured: `007/screenshot.png` (1280x800).
- Visual review confirmed:
  - "HELLO WORLD" is the commanding primary subject, spanning the full newspaper width.
  - The 3-column text flow is balanced with clean vertical column rules.
  - Newsprint palette and typography evoke an authentic historic newspaper edition.

## Limitations
- Static multi-column document; does not explore dynamic keyframe interpolation or time-based animation. Web Animations API (WAAPI) will be explored in Experiment 008.
