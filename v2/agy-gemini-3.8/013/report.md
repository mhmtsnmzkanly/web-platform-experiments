# Experiment 013: ECMAScript Intl.Segmenter Typesetter Drawer

## Title
ECMAScript Intl.Segmenter Typesetter Drawer

## Goal
Explore the native ECMAScript Internationalization API Level 2 `Intl.Segmenter`, using browser-native linguistic algorithms to decompose the subject string "Hello World" into word boundaries and grapheme clusters without external libraries or naive regex splitting, presenting the results as a physical movable typesetter drawer specimen.

## Selected Idea
Modernist Movable Typesetter Specimen Drawer. The browser acts as an automated linotype/letterpress typesetter. Using `Intl.Segmenter` with `granularity: 'word'` and `granularity: 'grapheme'`, the string "Hello World" is linguistically parsed into word tokens and 11 individual grapheme cluster slugs housed in compartmentalized lead type trays, complete with character codes, offset indices, and letterpress ink proofing.

## Technology
- ECMAScript Internationalization API (`Intl.Segmenter`)
- Native grapheme and word boundary segmentation (`granularity: 'word'`, `granularity: 'grapheme'`)
- CSS Grid & Flexbox compartmentalized tray layout
- Semantic HTML5 structure (`<main>`, `<header>`, `<section>`, `<footer>`)
- Chrome DevTools Protocol automated inspection (`window.labEvidence`)

## Mechanism Signature
`Intl.Segmenter('en') word and grapheme segmentation into structured typesetter slugs`

## Design Signature
- Typography: High-contrast literary serif (`"Didot"`, `"Playfair Display"`, `"Bodoni MT"`, `"Georgia"`, serif) for the inked proof impression and lead slug glyphs; crisp monospaced telemetry (`ui-monospace`, `"SF Mono"`, monospace)
- Color:
  - Outer cabinet: Dark walnut timber (`#171310`, `#211b16`)
  - Dividers & rules: Burnished brass (`#c99e5c`) and muted bronze (`#82663e`)
  - Proof card: Vellum newsprint ivory (`#faf4e8`) with vermilion ink (`#d94126`)
  - Letter slugs: Cast lead gunmetal (`#282a30`, `#3a3d46`) with luminous white glyphs
- Composition: Horizontal specimen cabinet divided into an upper letterpress proof card, a dual word slug tray, and an 11-cell grapheme cluster matrix
- Material: Heavy wooden typesetter drawer, milled brass divider strips, cast metal typography slugs, and impressed rag vellum
- Motion: Static typographic specimen

## Implementation Summary
The source string `"Hello World"` is processed by two native `Intl.Segmenter` instances:
1. `new Intl.Segmenter('en', { granularity: 'word' })`: Produces 3 segments (`Hello`, ` `, `World`). Filters `isWordLike` tokens to extract words and boundary offsets `[0, 5]` and `[6, 11]`.
2. `new Intl.Segmenter('en', { granularity: 'grapheme' })`: Decomposes into 11 discrete grapheme clusters (`H`, `e`, `l`, `l`, `o`, ` `, `W`, `o`, `r`, `l`, `d`), computing hex codepoints (`U+0048` to `U+0064`) and zero-indexed positions.
The layout maps these segments into physical lead type slugs in a wooden printer's drawer, anchored by a prominent letterpress proof card showing the unadulterated "Hello World" heading.

## Verification Evidence
- Automated verification: `node tools.js verify 013/013.dev.html 013` exited with `0` and output `OK`.
- Telemetry measurements in `013/verification.json`:
  - `wordCount`: 2
  - `graphemeCount`: 11
  - `boundaryIndices`: `[0, 5, 6]`
  - `totalSourceLength`: 11
- Visual review confirmed `013/screenshot.png`:
  - Imposing, legible letterpress proof reading "Hello World".
  - Precise 11-slug grapheme drawer with hatched space separator slug.
  - Zero layout overflow, zero console issues, zero external requests.

## Limitations
- Static linguistic analysis demonstration; does not construct isolated shadow trees or encapsulate DOM components. Shadow DOM v1 and Constructable Stylesheets will be explored in Experiment 014.
