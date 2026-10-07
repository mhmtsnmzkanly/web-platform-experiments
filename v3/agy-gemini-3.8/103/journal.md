# Experiment 103 — Journal: Frontier Atlas (Typographic Frontier)

## Frontier Interpretation: 103 — Typographic Frontier
The typographic frontier demands that typography and text structure are the primary material, not just an arbitrary string rendered in a stock font. The mechanism must causally stem from typographic anatomy: metric vertical zones (cap height, x-height, baseline, overshoot), glyph stroke topologies (stems, bowls, crossbars, serifs), enclosed counters ('O', 'D', 'R'), sidebearings, and optical kerning pairs.

---

## Candidates Considered

### Candidate A: Anatomical Punchcutter Specimen & Optical Counter-Space Metric Balance of "HELLO WORLD"
- **Mechanism**:
  - Parametric type design engine modeling the literal glyph anatomies of "HELLO WORLD" as scalable Bézier outline contours:
    - Stems: Vertical structural trunks ('H', 'L', 'D').
    - Bowls & Loops: Non-linear elliptical contours with optical overshoot ('O', 'D', 'R').
    - Crossbars & Arms: Cantilever strokes with terminal serifs ('E', 'H').
    - Apexes & Crotches: Acute angular junctions ('W').
  - Optical Counter-Space Balancing: The engine calculates the area of enclosed white-space counters ($A_{\text{counter}}$ in 'O', 'D', 'R') versus open inter-glyph negative space.
  - Master Typographic Variations: Continuous sliders for Stem Weight ($w \in [6, 28]\text{px}$), Serif Bracket Radius ($r \in [0, 14]\text{px}$), and Optical Tracking, triggering real-time Bézier contour regeneration and optical balance optimization.
- **Causal Typographic Role**:
  - The literal characters of "HELLO WORLD" dictate the topological distribution of stems vs bowls, the 4 closed counters (in 'O', 'O', 'R', 'D'), and the optical kerning friction between straight ('L'-'L') and diagonal/curved ('W'-'O') pairs.
- **Visual Composition**:
  - 18th-century Typefoundry Punchcutter Specimen (Fournier / Bodoni style): Antique laid vellum (`#fbf8ee`), deep iron-gall black ink, vermilion guideline calipers, and soft indigo counter-space fills.

### Candidate B: Knuth-Plass Optimal Line Breaking on Typographic Lead Sorts
- **Mechanism**:
  - TeX dynamic programming algorithm minimizing line-break demerits $d = (1 + \beta)^2$ across varying column widths.
- **Why Deferred**:
  - Candidate A works directly on the micro-typographic anatomy (stems, bowls, serifs, counter spaces) of each letter of "HELLO WORLD", making the letterforms themselves the generative mechanism.

### Candidate C: Variable Font Glyphtropic Metamorphosis & Vector Skeletons
- **Mechanism**:
  - Vector interpolation along variable font design axes (Weight, Width, Slant).
- **Why Deferred**:
  - Candidate A incorporates both Bézier structural anatomy and optical counter-space area integration, providing richer physical and typographic depth.

---

## Selected Candidate: Candidate A (Anatomical Punchcutter Specimen & Optical Counter-Space Metric Balance)

### Mechanism Graph
```
"HELLO WORLD" Typographic Characters
                 |
                 v
Bézier Outline Anatomy Engine (Stems, Bowls, Serifs, Apexes)
                 |
                 +-----------------------------------+
                 |                                   |
                 v                                   v
      Metric Vertical Zones              Enclosed Counter Topology
(Cap Height, Baseline, Overshoot)     (4 Closed Counters: O, O, R, D)
                 |                                   |
                 +-----------------+-----------------+
                                   |
                                   v
             Optical Negative-Space Integration & Kerning Pairs
                                   |
                                   v
          Live Foundry Specimen Display & Caliper Dissection
```

### Invariant & Evidence Strategy
- **Topological Invariant**: Exactly 4 enclosed counters ('O', 'O', 'R', 'D') across the 10 glyphs of "HELLO WORLD".
- **Dynamic Metric Derivations**: Total glyph advance width $\sum W_i$, mean counter area $\bar{A}_{\text{counter}}$, and stem aspect ratio derived directly from current font parameters.
- **`labScenario`**: Click `#btnSerifToggle` to toggle between Modern Serif (high-contrast Bodoni bracketed serifs) and Geometric Sans, measuring the structural stroke delta.
- **`labInteractionEvidence()`**: Verifies that toggling serif mode altered the total contour perimeter and glyph bounding box width ($\Delta W > 10\text{px}$) across the 10 characters.
