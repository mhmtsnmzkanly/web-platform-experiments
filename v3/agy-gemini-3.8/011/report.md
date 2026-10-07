# Experiment Report: 011 — Lindenmayer Fractal Morphogenesis & Botanical Herbarium

## Concept
A formal computational grammar engine implementing Lindenmayer string rewriting (L-Systems) to model botanical morphogenesis and tree arborization. 
A formal alphabet and recursive production rules ($X \to F-[[X]+X]+F[+FX]-X, F \to FF$) generate recursive branching structures across three primary trunk boughs. An animated turtle geometry interpreter renders recursive branch bifurcations with continuous harmonic wind sway. At the terminal apical meristem tips of the canopy, golden-ratio Fibonacci phyllotaxis ($\phi \approx 137.5^\circ$) unfurls tender leaflet whorls and ten prominent botanical blossom seals inscribed with the characters of "HELLO WORLD".

## Web Platform Surface
- **HTML5 2D Canvas (`CanvasRenderingContext2D`)**:
  - High-performance recursive turtle graphics rendering over 250 woody branch segments and tender sapling shoots.
  - Golden-angle Fibonacci phyllotaxis calculations organizing multi-petal leaflet rosettes around apical buds.
  - Over 27,000 canvas drawing operations recorded across verified interactive frames.
- **Pointer Events & Dynamic Kinematics**:
  - Interactive wind impulse kinematics: dragging across the canopy induces aerodynamic torque, deflecting branching angles throughout the recursive turtle hierarchy.
- **Semantic DOM & Typography**:
  - Clean archival herbarium taxonomic plate styling using standard serif and monospace typography on warm washi paper.

## Visual & Design Rationale
- **Palette**: Warm Japanese washi paper (`#f7f4ea`, `#fdfbf7`), deep pine sumi ink (`#182c1f`), moss green shoots (`#2e5239`, `#3d6c48`), earthy umber bark (`#3e271c`, `#5a3d2c`), warm amber metadata (`#b45309`), and cinnabar red seal stamp (`#be123c`).
- **Composition**: Botanical lithograph specimen plate (Tabula XI) with clear title taxonomy, central botanical illustration window, and bottom taxonomic metric ledger.
- **Aesthetic**: Deliberately breaks from dark obsidian telemetry HUDs; establishes a classical, contemplative natural history museum herbarium aesthetic.

## Verification Evidence
Verified via `tools.js verify 011/011.dev.html 011`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: Prominently displays "Hello World" in plate title, taxonomic subtitle, and inscribed across 10 apical blossoms.
- **Canvas Evidence**:
  - Canvas ID: `specimen-canvas` (1008x520 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
  - Total canvas draws: > 27,000 draw calls recorded across frames.
- **Technology Measurements**:
  - L-System grammar axiom: `X`.
  - Derivation depth: 3 generations across 3 primary boughs.
  - Total branch segments: 254 segments.
  - Apical terminal buds: 189 buds.
  - Inscribed blossoms: 10 ("HELLO WORLD").
  - Dynamic wind deflection: verified under aerodynamic drag scenario (`peakWindDeflectionRad`: ~0.30 rad).

## Key Decisions & Trade-offs
1. **Iterative Stack-Based Turtle vs. Unbounded Recursion**: The turtle graphics interpreter uses an explicit state stack (`[(x, y, heading, length, depth)]`) rather than recursive function calls, preventing call-stack limits and guaranteeing deterministic performance.
2. **Three-Bough Trunk Architecture**: Spreading the tree from a central trunk into three angled primary boughs creates a wide, well-balanced canopy spanning over 500 pixels, ensuring the 10 "HELLO WORLD" blossom seals have ample breathing room without visual clutter.
3. **Harmonic Wind Sway with Viscous Restitution**: Applying an oscillatory harmonic phase modulation to joint angles makes the tree feel genuinely alive, gently swaying in the breeze and reacting elastically to pointer drag.

## Moving Frontier Contribution
- **Computational Grammar**: Introduced formal language theory and Lindenmayer string rewriting to the laboratory.
- **Botanical Morphogenesis**: Replaced physical particle forces with developmental fractal growth and Fibonacci phyllotaxis.
- **Radical Aesthetic Shift**: Departed completely from dark HUDs to establish a light, warm, organic herbarium specimen visual language.
