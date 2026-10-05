# Experiment 010: CSS Container Queries & Container Query Units

## Title
CSS Container Queries & Container Query Units

## Goal
Explore the CSS Container Queries Level 1 specification (`container-type: inline-size`, `@container (min-width: ...)`, and `cqi` container query inline units), demonstrating how components adapt their layout hierarchy, typographic orientation, and font scale based purely on their own allocated container dimensions rather than the global browser viewport.

## Selected Idea
Architectural Packaging Folio / Industrial Specimen Triptych. Three container columns of distinct allocated widths (Wide: 492px, Medium: 295px, Narrow: 197px) are rendered simultaneously in the same viewport. Each container hosts the identical component markup. Purely through `@container` rules and `cqi` units, the component adapts into three distinct typographic expressions:
- Wide (>= 440px): Horizontal banner layout with continuous baseline and 12cqi font scale.
- Medium (250–439px): Stacked two-tone lockup with "WORLD" enclosed in a solid terracotta badge.
- Narrow (< 250px): Compact stacked spine with horizontal hairline rules and 20cqi font scale.

## Technology
- CSS Container Queries Level 1 (`container-type: inline-size`, `container-name: card`, `@container`)
- Container Query Units (`cqi`)
- CSS Flexbox & Custom Properties
- Semantic HTML5

## Mechanism Signature
`Independent container inline-size context -> @container query threshold matching & cqi unit scaling -> simultaneous multi-state adaptation -> responsive Hello World folio`

## Design Signature
- Typography: Industrial geometric sans-serif (`system-ui`, `Helvetica Neue`, sans-serif) with high visual weight
- Color: Tactile Paper Packaging palette: raw cardstock cream (`#ebe5da`), warm terracotta (`#c86446`), deep espresso ink (`#211a17`), cream foil (`#faf8f5`), slate rule (`#cbc3b5`)
- Composition: Simultaneous tri-panel packaging triptych (Wide, Medium, Narrow)
- Material: Die-cut packaging cardstock with scoring rules
- Motion: Static simultaneous multi-state comparison

## Implementation Summary
The parent triptych sets up three columns with flex ratios (5:3:2). Each column declares `container-type: inline-size; container-name: card`. The child card contains an accessible `<h1>` with `.w-hello` and `.w-world`. Container query rules adapt the layout:
- `@container card (min-width: 440px)` applies `flex-direction: row` with `font-size: clamp(48px, 12cqi, 64px)`.
- `@container card (min-width: 250px) and (max-width: 439px)` applies `flex-direction: column` and styles `.w-world` as a reversed terracotta badge.
- `@container card (max-width: 249px)` applies compact stacking with `font-size: clamp(24px, 20cqi, 36px)`.

## Architectural Decisions
- Showcased all three container query tiers simultaneously on a single screen rather than relying on viewport resizing, providing deterministic, observable proof of container-relative behavior in automated testing.
- Used genuine `cqi` units so font sizing dynamically calculates from container inline width rather than viewport width (`vw`).
- Evaluated runtime metrics via `window.labEvidence()` confirming native container support and asserting monotonic font size progression (59.04px -> 47.23px -> 36px).

## Verification Evidence
- Automated verification command: `node tools.js verify 010/010.dev.html 010` returned `OK` with exit code `0`.
- Dependency check: zero external assets, zero network requests.
- Browser test: valid doctype, zero console errors, zero runtime exceptions, valid CSS.
- Runtime evidence: `containerSupport: true`, `containerWidths: { wide: 492, medium: 295, narrow: 197 }`, `fontSizes: { wide: 59.04, medium: 47.23, narrow: 36 }`.

## Visual Evidence & Review
- Screenshot captured: `010/screenshot.png` (1280x800).
- Visual review confirmed:
  - All three panels render simultaneously with flawless visual hierarchy.
  - Wide container displays horizontal banner layout; Medium container displays stacked terracotta badge; Narrow container displays compact spine.
  - "Hello World" is the central semantic and visual subject across all three panels.

## Limitations
- Static multi-container folio; does not explore view transitions or animated container resizing. Subsequent runs can build upon this foundation.
