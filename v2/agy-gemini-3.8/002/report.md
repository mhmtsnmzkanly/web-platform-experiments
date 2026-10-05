# Experiment 002: CSS Grid & Subgrid Modular Typographic Lockup

## Title
CSS Grid & Subgrid Modular Typographic Lockup

## Goal
Explore native Web Platform CSS Grid track inheritance via `grid-template-columns: subgrid`, demonstrating how independent semantic typographic units ("Hello" and "World") lock to a shared 6-column modular coordinate system.

## Selected Idea
Swiss International Typographic poster layout where a 6-column parent grid establishes proportional horizontal rhythm, and an `<h1>` container inherits those column tracks using `subgrid`. "Hello" anchors to tracks 1–4, while "World" shifts into tracks 3–6, creating an intentional typographic counterpoint and overlap on tracks 3 and 4.

## Technology
- CSS Grid (`display: grid`)
- CSS Subgrid (`grid-template-columns: subgrid`)
- CSS Custom Properties (Design tokens for color and metrics)
- Semantic HTML5

## Mechanism Signature
Parent grid 6-track geometry -> subgrid column inheritance -> coordinated typographic lockup -> structured Hello World display

## Design Signature
- Typography: Heavy Swiss grotesque sans-serif (`system-ui`, `-apple-system`, `Helvetica Neue`, sans-serif) with high visual weight
- Color: High-contrast Swiss poster palette: warm archival cream (`#f5f2eb`), deep carbon black (`#121314`), cadmium vermilion (`#e63946`), slate muted (`#5e6268`)
- Composition: Asymmetric 6-column modular poster with diagonal rhythmic counterweight
- Material: Heavy matte exhibition print sheet with solid drop-shadow offset
- Motion: Static

## Implementation Summary
The parent container `.parent-grid` defines 6 equal fractional tracks (`repeat(6, minmax(0, 1fr))`) with a 20px gap. The primary subject `h1.subject-lockup` spans `1 / -1` across all columns and declares `grid-template-columns: subgrid`. Its child word elements (`.hello-word` and `.world-word`) inherit these tracks directly:
- `.hello-word` spans `1 / span 4` (Columns 1–4)
- `.world-word` spans `3 / span 4` (Columns 3–6)

An accompanying annotation row `.annotation-row` also participates in the subgrid, placing typographic captions in columns 1–2 and 5–6, perfectly aligned with the word boundaries above.

## Architectural Decisions
- Used `subgrid` instead of flattening the HTML or using manual percentage offsets. Subgrid guarantees that regardless of font sizing, line breaks, or viewport resizing, the words lock mathematically to the parent tracks.
- Enclosed "Hello" and "World" directly within the single `<h1>` tag with whitespace separation, maintaining strict semantic HTML accessibility while enabling DOM visibility detectors to recognize the full phrase.
- Embedded runtime layout measurement via `window.labEvidence()` to mathematically verify that subgrid is natively supported and track coordinates are correctly computed.

## Verification Evidence
- Verification command: `node tools.js verify 002/002.dev.html 002` returned `OK` with exit code `0`.
- Dependency check: zero runtime external dependencies, zero external network requests.
- Browser test: clean HTML5 doctype, zero console errors, zero runtime exceptions, valid CSS declarations.
- Runtime evidence: `subgridSupported: true`, `parentWidth: 1018px`, `helloWidth: 672px`, `worldWidth: 672px`, `worldOffsetLeft: 346px` (locking precisely to Column 3).

## Visual Evidence & Review
- Screenshot captured: `002/screenshot.png` (1280x800).
- Visual review confirmed:
  - "Hello World" is unmistakably the dominant, central visual and conceptual subject.
  - "HELLO" rendered in massive carbon black letters; "WORLD" rendered in cadmium vermilion.
  - Baseline rules and track coordinate indicators visibly confirm the underlying mathematical grid.
  - Contrast is sharp and typography is crisp with zero layout distortion.

## Limitations
- Static layout; does not test dynamic interaction or timeline animation. These will be explored in subsequent experiments.
