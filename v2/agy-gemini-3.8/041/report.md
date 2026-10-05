# Experiment 041: MathML Core Level 4 Mathematical Typographical Folio

## Metadata
- **Experiment ID**: 041
- **Technology**: W3C MathML Core Level 4 (`<math>`, `<mrow>`, `<mfrac>`, `<msqrt>`, `<msubsup>`, `<mtable>`, `<mo>`, `<mi>`, `<mtext>`)
- **Status**: COMPLETED
- **Date**: 2026-10-05

## Architectural Overview & Mechanism Signature
Experiment 041 explores native browser-level mathematical typesetting standardized by the W3C MathML Core working group (shipped natively in Chromium 109+ without external third-party math rendering engines or JavaScript libraries).

Key mathematical typographic capabilities demonstrated:
1. **Vertical Fraction Layout (`<mfrac>`)**:
   - The `<mfrac>` element lays out numerator and denominator with an automatically calculated horizontal fraction rule, baseline alignment, and vertical font size reduction according to MathML scriptlevel rules.
2. **Dynamic Radical Surd Drawing (`<msqrt>`)**:
   - Native square root rendering calculates the radical symbol height and extends the horizontal overbar over the radicand expression (`Hello / Δt`) regardless of the contents' inner bounding box.
3. **Stretchable Mathematical Operators & Delimiters (`<mo>`)**:
   - Using native OpenType math table parameters, square brackets `[` and `]` scale vertically to embrace multi-line expressions and 2D matrix tables (`<mtable>`).
4. **2D Mathematical Tables & Matrices (`<mtable>`, `<mtr>`, `<mtd>`)**:
   - Native mathematical tables provide cellular coordinate alignment for 2D matrix linear algebra transformations, combined with inline `<math>` rendering.
5. **DOM Tree Taxonomy & Geometry Introspection**:
   - The document audits 72 native MathML nodes across 14 element categories, measuring exact subpixel layout dimensions (`419.16 px × 50.89 px` for the block equation).

## Verification Summary
- **CDP Verification Script**: `./verify.sh 041/041.dev.html 041`
- **Result**: `OK` (Exit code 0)
- **Primary Subject**: `<h1 id="subject-hello-world">Hello World</h1>`
- **Total MathML Nodes**: 72 verified elements across block and inline formulas.
- **Radical & Fraction Verification**: Native `<msqrt>` and `<mfrac>` verified with rendered dimensions.
- **Matrix Transformation**: Structured 2x2 `<mtable>` linear equation verified.
