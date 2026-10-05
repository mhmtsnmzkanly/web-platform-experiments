# Experiment 003: Orthogonal Writing Modes & Vertical Typographic Stacking

## Title
Orthogonal Writing Modes & Vertical Typographic Stacking

## Goal
Explore the CSS Writing Modes Level 3 specification (`writing-mode: vertical-rl` and `text-orientation: upright`), demonstrating how native browser engines stack upright glyphs along a vertical inline axis and coordinate with orthogonal horizontal typography.

## Selected Idea
Japanese Minimalist Book Spine / Hanging Scroll layout. "Hello" stacks vertically downwards using `writing-mode: vertical-rl` with `text-orientation: upright`, while "World" anchors horizontally beneath it using `writing-mode: horizontal-tb`, creating an orthogonal cross-axis typographic lockup.

## Technology
- CSS Writing Modes Level 3 (`writing-mode: vertical-rl`, `writing-mode: horizontal-tb`)
- CSS Text Orientation (`text-orientation: upright`)
- CSS Grid & Flexbox
- Semantic HTML5

## Mechanism Signature
`writing-mode: vertical-rl -> upright glyph stacking -> orthogonal cross-axis greeting -> vertical-horizontal typographic lock`

## Design Signature
- Typography: High-contrast literary transitional serif (`"Georgia"`, `"Times New Roman"`, serif)
- Color: Japanese washi palette: bone ivory washi paper (`#f7f4ee`), deep indigo ink (`#0c131d`), cinnabar vermilion seal (`#c73e3a`), muted stone (`#7b828c`)
- Composition: Asymmetric vertical hanging scroll with generous negative space and fine hairlines
- Material: Handmade fibrous paper sheet with subtle border insets
- Motion: Static

## Implementation Summary
The central subject `h1.subject-lockup` contains two coordinated span elements:
- `.vertical-word`: applies `writing-mode: vertical-rl` and `text-orientation: upright` with `letter-spacing: 0.16em`, producing a clean vertical glyph column for "Hello".
- `.horizontal-word`: applies `writing-mode: horizontal-tb` in italic cinnabar red, separated by an ink horizontal rule for "World".
- `window.labEvidence` verifies runtime writingMode properties and asserts that the vertical element's height exceeds its width, while the horizontal element's width exceeds its height.

## Architectural Decisions
- Used `text-orientation: upright` rather than `mixed` or `sideways` for "Hello" so glyphs sit unrotated in reading sequence downwards.
- Kept "Hello" and "World" within a single semantic `<h1>` tag with whitespace separation to ensure full accessibility and clean DOM visibility validation.
- Constrained the scroll canvas dimensions so that the entire composition and its delicate margins fit within the deterministic 1280x800 viewport without scrollbars.

## Verification Evidence
- Automated verification command: `node tools.js verify 003/003.dev.html 003` returned `OK` with exit code `0`.
- Dependency check: zero external resources, zero network requests.
- Browser test: valid HTML5 doctype, zero console errors, zero runtime exceptions, valid CSS declarations.
- Runtime evidence: `verticalMode: "vertical-rl"`, `textOrientation: "upright"`, `verticalBox: { width: 78, height: 350 }`, `horizontalBox: { width: 219, height: 93 }`.

## Visual Evidence & Review
- Screenshot captured: `003/screenshot.png` (1280x800).
- Visual review confirmed:
  - "Hello World" is the central visual subject, commanding the composition.
  - "Hello" glyphs stack cleanly downwards with upright orientation.
  - "World" sits horizontally in cinnabar red, locked to the orthogonal axis.
  - Washi paper container displays clean borders and subtle seal mark without scrollbars.

## Limitations
- Static layout; does not test dynamic interaction.
