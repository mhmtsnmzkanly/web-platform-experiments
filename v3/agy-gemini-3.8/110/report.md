# Experiment Report: 110 — Constraint Frontier: Strict 1-Bit Monochrome Text Matrix

## Frontier Classification: Constraint Frontier
This experiment establishes the **Constraint Frontier** within the Frontier Atlas. Creative and mechanical depth is achieved by submitting completely to an explicit, non-negotiable, formally measured constraint:
1. **Binary Chromatic Constraint (Strict 1-Bit Monochrome)**:
   - Exactly two color values exist in the entire stylesheet: `#000000` (pure black) and `#ffffff` (pure white).
   - Zero grey tints (no `#111`, `#333`, `#888`, `#ccc`).
   - Zero color hues.
   - Zero alpha transparency (100% opaque, no `rgba()`, no opacity $< 1$).
2. **Zero-Graphic Render Surface Constraint**:
   - Exactly 0 `<canvas>` elements.
   - Exactly 0 `<svg>` elements.
   - Exactly 0 `<img>` elements.
   - Exactly 0 CSS gradients (`linear-gradient`, `radial-gradient`).
   - Exactly 0 `border-radius` (strictly orthogonal rectilinear geometry).
   - Exactly 0 `box-shadow` or `text-shadow`.
3. **Pure Monospace Text Glyph Medium**:
   - 100% of the visual stage, buttons, telemetry tables, and cellular automaton is rendered exclusively through raw Unicode text characters (`█`, ` `, `|`, `-`, `+`, `[`, `]`) inside `<pre>` / `<code>` elements.

## Concept & Mechanics
1. **Governing Cellular Bitboard**:
   - The 10 characters ('H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D') are synthesized as $5 \times 7$ binary bitboards separated by 1-column spacers, producing a $7 \times 59$ bitfield ($413$ total discrete 1-bit cells).
   - Initial state contains exactly 154 live cells forming the clear word "HELLO WORLD".
   - Cellular evolution: Standard Conway Life B3/S23 rule applied iteratively across the toroidal text grid:
     $$C_{t+1}(r, c) = \begin{cases} 1 & \text{if } C_t = 1 \land N \in \{2, 3\} \\ 1 & \text{if } C_t = 0 \land N = 3 \\ 0 & \text{otherwise} \end{cases}$$
   - Morphological operations: Mathematical dilation ($A \oplus B$) and erosion ($A \ominus B$) executed directly on the 1-bit character matrix.

2. **Causal Typographic Role**:
   - The character shapes of "HELLO WORLD" act as the initial seed colony. Because different letter topologies possess distinct densities (e.g. 'O' is a hollow ring, 'H' has two stiles, 'L' has an open arm), each glyph evolves through distinct oscillatory and glider patterns.

## Web Platform Surface
- **1972 Teletype Terminal Workstation (`.chassis`)**:
  - Pure black background with solid 2px white borders.
  - Formally declared constraint manifesto.
  - Interactive ASCII control buttons and live constraint audit table verifying zero canvas, zero SVG, and 2-color compliance.

## Verification Evidence
Verified via `tools.js verify 110/110.html 110`:
- **Result**: `OK` (0 static syntax errors, 0 runtime exceptions, 0 dependency violations, valid CSS).
- **Nominal Observables**: Exactly 0 canvas/SVG/img elements, 154 initial live cells, 7x59 grid dimensions, 100% strict compliance audit passed.
- **Interaction Response**: Trusted CDP click on `#btnStepLife` executed generation step $t=1$: live cells transitioned from 154 to 216, bitboard entropy increased to 0.998, and the matrix evolved while strictly preserving the 1-bit monochrome constraint.
