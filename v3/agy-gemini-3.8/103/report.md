# Experiment Report: 103 — Typographic Frontier: Punchcutter Anatomy & Enclosed Counter Topology ("HELLO WORLD")

## Frontier Classification: Typographic Frontier
This experiment establishes the **Typographic Frontier** within the Frontier Atlas. Rather than treating text as generic glyphs or simply changing a font family, typography is the core generative and analytical material. The mechanism models the anatomical stroke construction, metric vertical zones, topological enclosed counters, and optical negative space of "HELLO WORLD".

## Concept & Mechanics
1. **Parametric Vector Anatomy**:
   - Each glyph of "HELLO WORLD" is parametrically synthesized as scalable Bézier outline geometry:
     - Stems: Vertical structural trunks ('H', 'L', 'D').
     - Bowls & Loops: Elliptical curves with optical overshoot ('O', 'D', 'R').
     - Arms & Crossbars: Cantilever horizontal bars ('E', 'H').
     - Crotches & Apexes: Angular diagonal junctions ('W').
   - Master design axes allow continuous modulation of Stem Weight ($w \in [8, 28]\text{px}$), Serif Bracket Radius ($r \in [0, 14]\text{px}$), and Optical Tracking.

2. **Causal Typographic Role ("HELLO WORLD")**:
   - The literal characters of "HELLO WORLD" determine the structural composition:
     - 4 Enclosed Counters: 'O', 'O', 'R', and 'D' contain topologically closed internal loops.
     - 6 Open Glyph Silhouettes: 'H', 'E', 'L', 'L', 'W', and 'L' feature open arms, bays, and crotches.
   - The balance between curved bowls ('O', 'D') and rigid vertical/diagonal stems ('H', 'L', 'W') directly governs the optical advance width and inter-glyph white-space distribution.

3. **Metric Vertical Zones**:
   - Precise typefoundry guidelines anchor the layout:
     - Baseline ($Y = 0$)
     - Mean Line ($Y = 0.58 H_{\text{cap}}$, defining the x-height)
     - Cap Height line ($Y = H_{\text{cap}}$)
     - Optical Overshoot ($+3\%$) allowing curved letters ('O', 'D') to extend slightly beyond flat baselines for visual balance.

## Web Platform Surface
- **18th-Century Typefoundry Punchcutter Specimen Broadside (`CanvasRenderingContext2D`)**:
  - Antique laid vellum texture (`#fbf8ee`), rich soot-black letterforms (`#181512`), vermilion guide rules (`#991b1b`), and sapphire blue counter-space overlays (`#0284c7`).
  - Dual viewports: Upper display specimen showing the assembled type on the baseline, and lower anatomical dissection cartouche displaying ghost contours and enclosed counter areas.
  - In-situ actuators: Stem Weight slider, Serif Bracket slider, Tracking dial, and Mode toggle button (`#btnSerifToggle`) switching between Bodoni Serif and Geometric Sans.

## Verification Evidence
Verified via `tools.js verify 103/103.html 103`:
- **Result**: `OK` (0 static syntax errors, 0 runtime exceptions, 0 dependency violations, valid CSS, active rendering).
- **Nominal Observables**: Exactly 4 enclosed counters detected ('O', 'O', 'R', 'D'), mean counter area $511\text{ px}^2$, total advance width $822.4\text{ px}$, stem weight $16\text{ px}$, contrast ratio $4.00 : 1$.
- **Interaction Response**: Clicking the serif toggle button stripped bracketed serifs, transitioning from Bodoni Serif ($r = 8\text{ px}$) to Geometric Sans ($r = 0\text{ px}$), shifting the contrast ratio to $8.00 : 1$ while preserving counter topological invariance (4 / 4 counters).
- **Causal Connection**: The literal letterforms of "HELLO WORLD" dictate the anatomical stem-to-bowl ratio, counter topology, and optical kerning rhythm.
