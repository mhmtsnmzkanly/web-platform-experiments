# Experiment Report: 021 — Artin Braid Group B₇ & Topological Link Closure

## Concept
An algebraic topology and knot theory apparatus where the string "HELLO WORLD" serves as the **direct causal seed** generating an Artin braid word across $N=7$ parallel strands.
Rather than using letters as decorative labels, the mathematical structure of the braid is derived strictly from the discrete orthography and sequential transitions of the text:
1. **Alphabet to Strand Mapping**:
   The 7 unique characters of "HELLO WORLD" are sorted into their canonical lexicographic order:
   $$\{D, E, H, L, O, R, W\} \longleftrightarrow \{1, 2, 3, 4, 5, 6, 7\}$$
2. **Causal Artin Generator Word Derivation**:
   The 9 sequential bigram transitions of "H-E-L-L-O-W-O-R-L-D" require transpositions between adjacent strand slots:
   - $H \to E$ ($3 \to 2$): $\sigma_2^{-1}$ (under-crossing)
   - $E \to L$ ($2 \to 4$): $\sigma_2 \cdot \sigma_3$ (two over-crossings)
   - $L \to L$ ($4 \to 4$): $\sigma_4 \cdot \sigma_4^{-1}$ (neutral full twist)
   - $L \to O$ ($4 \to 5$): $\sigma_4$ (over-crossing)
   - $O \to W$ ($5 \to 7$): $\sigma_5 \cdot \sigma_6$ (two over-crossings)
   - $W \to O$ ($7 \to 5$): $\sigma_6^{-1} \cdot \sigma_5^{-1}$ (two under-crossings)
   - $O \to R$ ($5 \to 6$): $\sigma_5$ (over-crossing)
   - $R \to L$ ($6 \to 4$): $\sigma_5^{-1} \cdot \sigma_4^{-1}$ (two under-crossings)
   - $L \to D$ ($4 \to 1$): $\sigma_3^{-1} \cdot \sigma_2^{-1} \cdot \sigma_1^{-1}$ (three under-crossings)
   yielding an exact 16-letter Artin braid word:
   $$W = \sigma_2^{-1} \sigma_2 \sigma_3 \sigma_4 \sigma_4^{-1} \sigma_4 \sigma_5 \sigma_6 \sigma_6^{-1} \sigma_5^{-1} \sigma_5 \sigma_5^{-1} \sigma_4^{-1} \sigma_3^{-1} \sigma_2^{-1} \sigma_1^{-1} \in B_7$$
3. **Discrete Topological Invariants**:
   - Total signed crossings: $N_+ = 7$ (right-handed over-crossings), $N_- = 9$ (left-handed under-crossings).
   - Total crossing count: $c = N_+ + N_- = 16$.
   - Topological writhe: $w = N_+ - N_- = -2$ (net chiral bias).
   - Induced permutation $\pi \in S_7$:
     $$\pi = \begin{pmatrix} 1 & 2 & 3 & 4 & 5 & 6 & 7 \\ 2 & 3 & 1 & 4 & 5 & 6 & 7 \end{pmatrix}$$
   - Disjoint cycle decomposition: $(1\ 2\ 3) \cdot (4) \cdot (5) \cdot (6) \cdot (7)$ (a 3-cycle permuting $\{D, E, H\}$ and 4 fixed points $\{L, O, R, W\}$).
   - Link component count under plat/trace closure: 5 disjoint linked components.

## Web Platform Surface
- **Canvas 2D Interwoven Spline Graphics (`CanvasRenderingContext2D`)**:
  - Implements multi-pass cubic Bézier curve rendering with 3D over/under occlusion ordering.
  - Ambient shadow cutouts: When strand $A$ crosses over strand $B$, an ambient drop shadow mask is cast across the underlying strand, creating tangible depth without a heavy 3D engine.
  - Specular silk highlights: Core thread strokes with luminous highlights emulate traditional dyed silk threads (Saffron Gold, Madder Crimson, Cobalt Azure, Malachite Green, Tyrian Violet, Carmine Rose, Verdigris Teal).
- **Interactive Mechanical Loom Shuttle**:
  - An interactive step slider (`#step-slider`) drives the mechanical brass shuttle needle vertically along the loom, allowing continuous scrubbing of the weaving process from step 0 to step 16 with real-time bigram highlighting.

## Visual & Design Rationale
- **Palette**: Dark walnut timber (`#140c07`, `#22140c`), polished brass guide bars and pins (`#d4af37`, `#b8860b`), warm ivory typography (`#fef3c7`), and 7 rich Victorian silk dyes.
- **Composition**: Dual-panel mechanical apparatus featuring the vertical braiding loom with 7 silk strands and 16 crossing levels on the left, and the algebraic topology invariant specifications and permutation cycle diagram on the right.
- **Aesthetic**: 19th-century mechanical Jacquard-era algebraic loom, establishing a tactile handcrafted physical machine aesthetic completely separated from dark telemetry HUDs.

## Verification Evidence
Verified via `tools.js verify 021/021.dev.html 021`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: Features "Hello World" in header and causally throughout the bigram generation and alphabet pins.
- **Canvas Evidence**:
  - Canvas ID: `braid-canvas` (1060x520 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
  - Active frame count: 18 frames, 1690 draw ops.
- **Technology Measurements**:
  - Total Braid Generators: 16 operations.
  - Positive Crossings $N_+$: 7.
  - Negative Crossings $N_-$: 9.
  - Topological Writhe $w$: -2.
  - Disjoint Cycle Count: 5 components.
  - Permutation Array: `[3, 1, 2, 4, 5, 6, 7]` (strand IDs at slots 1..7).
  - Active Shuttle Step: Verified initial 16 $\to$ scrubbed to step 7 under CDP interaction.

## Key Decisions & Trade-offs
1. **Causal Bigram Routing**: Mapping consecutive bigram leaps to sequences of elementary Artin generators $\sigma_k$ ensures that the text "HELLO WORLD" is not an arbitrary decoration, but the exact causal blueprint for every crossing.
2. **Layered 2-Pass Drawing for 3D Occlusion**: Splitting each crossing level into under-strand drawing followed by shadow-masked over-strand drawing guarantees clean over/under knots without z-buffer artifacts.
3. **Discrete Topological Honesty**: Reported strictly exact mathematical counts (writhe, crossings, cycles, parity) rather than heuristic physical approximations.

## Moving Frontier Contribution
- **Algebraic Topology & Knot Theory**: Introduced Artin braid groups ($B_n$), generator words, signed crossing counts, and topological writhe to the lab.
- **Text as Causal Mathematical Blueprint**: Demonstrated how character orthography and bigram leaps directly synthesize complex topological structures.
- **Victorian Textile Loom Aesthetic**: Introduced rich natural silk pigments, polished brass guideways, and dark walnut craftsmanship.
