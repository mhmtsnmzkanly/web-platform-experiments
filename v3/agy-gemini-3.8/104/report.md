# Experiment Report: 104 — Visual System & Art Direction Frontier: Neoplastic De Stijl Chromatic Equilibrium ("HELLO WORLD")

## Frontier Classification: Visual System / Art Direction Frontier
This experiment establishes the **Visual System / Art Direction Frontier** within the Frontier Atlas. Rejecting the default scientific console chassis (no side telemetry panel, no oscilloscope reticles, no industrial chassis), the experiment develops a unified visual system rooted in De Stijl neoplasticism and Bauhaus constructivist architecture (Piet Mondrian, Theo van Doesburg, Gerrit Rietveld). The visual architecture directly *is* the computational mechanism.

## Concept & Mechanics
1. **Asymmetric Neoplastic Partition**:
   - The entire viewport is partitioned into an orthogonal matrix of 10 rectangular volumetric cells bounded by deep black grid mullions ($12\text{px}$).
   - The palette is strictly restrained to neoplastic primary pigments and neutrals:
     - Cadmium Red (`#d9261c`, visual weight $\rho = 2.0$)
     - Ultramarine Blue (`#1d4ed8`, visual weight $\rho = 1.6$)
     - Chrome Yellow (`#facc15`, visual weight $\rho = 1.3$)
     - Alabaster White (`#f8fafc`, visual weight $\rho = 0.6$)
     - Cool Gray (`#f1f5f9`, visual weight $\rho = 0.7$)

2. **Causal Typographic Architecture ("HELLO WORLD")**:
   - The 10 literal characters of "HELLO WORLD" ('H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D') are the spatial architectural occupants of the 10 neoplastic cells.
   - Each glyph's scale and typography are dynamically proportioned to its enclosing rectangular volume, maintaining negative-space margin relationships and high-contrast figure-ground legibility (white text on dark red/blue planes; pitch black text on yellow/white planes).

3. **Visual Mass Equilibrium & Moment of Inertia**:
   - Each cell has area $A_k = w_k \times h_k$ and chromatic mass $M_k = A_k \times \rho_k$.
   - Center of visual gravity:
     $$\mathbf{C}_{\text{vis}} = \frac{\sum_k M_k \mathbf{x}_k}{\sum_k M_k}$$
   - Visual moment of inertia:
     $$I_{\text{vis}} = \sum_k M_k \|\mathbf{x}_k - \mathbf{C}_{\text{vis}}\|^2$$
   - Activating orthogonal transmutation glides the partition rails along continuous spring curves, redistributing chromatic mass and shifting the focal visual center of mass across the composition.

## Web Platform Surface
- **Neoplastic Constructivist Canvas (`CanvasRenderingContext2D`)**:
  - Fullscreen canvas with dynamic orthogonal sub-grid partitioning.
  - Minimalist header and footer embedded seamlessly into the primary top and bottom black grid mullions.
  - Interactive Transmutation button (`#btnRebalance`) triggering cubic spring rail interpolation.
  - Direct canvas click interaction allowing the user to guide the primary vertical dividing rail dynamically.

## Verification Evidence
Verified via `tools.js verify 104/104.html 104`:
- **Result**: `OK` (0 static syntax errors, 0 runtime exceptions, 0 dependency violations, valid CSS, active rendering).
- **Nominal Observables**: 10 occupied neoplastic cells, total cell area $834,911\text{ px}^2$ ($100.0\%$ area conservation), initial center of visual mass $(674, 341)$, moment of inertia $167,835.25\text{ M}_{\text{vis}}$.
- **Interaction Response**: Clicking `#btnRebalance` smoothly translated the orthogonal partition rails, shifting the visual mass center to $(655, 331)$ ($\Delta \mathbf{C} = 21.5\text{ px}$) and adjusting the moment of inertia to $182,067.40\text{ M}_{\text{vis}}$ while preserving 10 / 10 typographic occupancy.
- **Causal Connection**: The 10 characters of "HELLO WORLD" physically define the 10 neoplastic spatial cells; their individual proportions and chromatic contrasts directly dictate the global visual equilibrium.
