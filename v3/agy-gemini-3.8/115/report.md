# Experiment Report: 115 — Material / Metaphor Frontier: 1804 Jacquard Programmable Loom

## Frontier Classification: Material / Metaphor Frontier
This experiment establishes the **Material / Metaphor Frontier** within the Frontier Atlas. "Hello World" is not merely rendered as screen typography or pixels; it serves as a programmable binary textile weave pattern governed by the material mechanics of Joseph Marie Jacquard's 1804 punch-card loom:
1. **Material Metaphor & Physical Interlacement**:
   - Warp ($61\text{ vertical ends}$ of unbleached French linen yarn at $24.5\text{ N}$ tension) and Weft (Lyon royal indigo dyed silk yarn) interlace at perpendicular coordinates.
   - Letters ('H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D') are rasterized into a $61 \times 7$ binary matrix representing punched card perforations.
2. **Kinematic Shed Mechanics & Punch-Prism Selection**:
   - A rectangular card prism presents perforated cardboard plates to spring-loaded needles.
   - Perforations ($1$) permit needles to pass, raising warp harnesses via the griffe; solid card ($0$) pushes needles back, leaving warp threads lowered.
   - This creates a geometric shed aperture ($\Delta y = 28\text{ px}$) through which a flying wooden shuttle traverses horizontally ($v = 1.42\text{ m/s}$).
   - A reciprocating reed batten drives each newly inserted silk pick tightly into the fabric fell at $24\text{ picks/inch}$.
3. **Tactile Damask Brocade Emergence**:
   - With each mechanical treadle cycle, silk weft floats emerge over linen warp threads, building up the literal typographic glyphs of "HELLO WORLD" row by row.

## Web Platform Surface
- **1804 Académie des Sciences Lyon Textile Plate (`#loomCanvas`)**:
  - Antique parchment vellum palette (`#fdfbf7`, `#111625`, `#b45309`, `#2563eb`).
  - High-precision canvas simulation rendering individual twisted linen fibers, heddle harness cords, wooden shuttle movement, and woven damask fabric fell.
  - Interactive punched cardboard chain viewer showing active card holes alongside real-time textile telemetry (yarn consumption in meters, warp tension, shuttle reciprocating status).

## Verification Evidence
Verified via `tools.js verify 115/115.dev.html 115` & `115/115.html 115`:
- **Result**: `OK` (0 static syntax errors, 0 runtime exceptions, 0 dependency violations, valid HTML5/CSS3).
- **Nominal Observables**: 61 taut warp ends, 7-card punch sequence, 6 initial picks woven with active card #6, warp material "Unbleached French Linen", weft material "Lyon Indigo Silk".
- **Interaction Response**: Trusted CDP click on `#btnTreadlePick` triggered an authentic treadle cycle: advancing the card prism to Card #7, raising warp threads according to bottom-serif perforations, driving the shuttle, beating the weft into the fell (advancing woven rows to 7 and fabric fell height to 126 px), perfectly completing the woven textile inscription "HELLO WORLD".
