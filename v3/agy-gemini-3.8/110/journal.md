# Experiment 110 Journal: Constraint Frontier

## Frontier Assessment: Constraint Frontier
The Constraint Frontier requires deliberate, severe creative limitation where the value of the artifact springs from achieving depth, visual clarity, and rich mechanics *under a formally declared, non-negotiable constraint*.
"Rule: Explicitly declare your chosen constraint in the journal and strictly, uncompromisingly adhere to it. The constraint must be formal and measurable."

## Formal Constraint Declaration

The following strict, formally verifiable constraints are declared and enforced across all HTML, CSS, and JS:

1. **BINARY CHROMATIC CONSTRAINT (STRICT 1-BIT MONOCHROME)**:
   - Exactly two color values exist in the entire stylesheet: `#ffffff` (pure white) and `#000000` (pure black).
   - Zero intermediate grey shades (no `#111`, `#333`, `#888`, `#ccc`).
   - Zero color hues (no red, green, blue, cyan, etc.).
   - Zero alpha transparency (no `rgba()`, no opacity $< 1$, no transparent overlays).

2. **ZERO-GRAPHIC RENDER SURFACE CONSTRAINT**:
   - Exactly 0 `<canvas>` elements.
   - Exactly 0 `<svg>` elements.
   - Exactly 0 `<img>` elements.
   - Exactly 0 CSS gradients (`linear-gradient`, `radial-gradient`, `conic-gradient`).
   - Exactly 0 `border-radius` (pure rectilinear orthogonal geometry).
   - Exactly 0 `box-shadow` or `text-shadow`.

3. **PURE MONOSPACE TEXT GLYPH MEDIUM**:
   - 100% of the visual stage, typography, metrics, and spatial simulation is rendered exclusively through raw Unicode/ASCII glyphs (`█`, ` `, `|`, `-`, `+`, `[`, `]`, `*`) inside `<pre>` / `<code>` text containers.

4. **CAUSAL HELLO WORLD MECHANISM**:
   - The 10 characters ('H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D') are represented as $5 \times 7$ binary bitboards (350 discrete 1-bit cells).
   - A cellular morphological automaton (Conway B3/S23 Life and mathematical morphological dilation/erosion) operates directly on the character bits, altering the text matrix over generations.

## Candidate Formulations

### Candidate A: 1-Bit Cellular Morphological Typographic Bitboard
- Fully conforms to the 4 strict constraints above.
- Renders an interactive 1-bit terminal workstation with discrete binary cells, cellular automata evolution, bitwise inversion, and ASCII density telemetry.

### Candidate B: Pure CSS Without Script
- Rejected due to `tools.js` requiring JavaScript `window.labEvidence` for automated browser testing.

### Candidate C: Single `<div>` CSS Box-Shadow Matrix
- Technically possible, but fragile and harder to inspect than pure 1-bit ASCII text glyph matrices.

## Selection
**Candidate A** is selected. It adheres to all 4 formal constraints without compromise.
Every line of code and style will be audited against the 1-bit monochrome and zero-canvas/zero-svg rule.
