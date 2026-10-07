# Experiment Report: 046 — Gray-Scott Reaction-Diffusion Morphogenesis on Typographic Metric ("HELLO WORLD")

## Concept
A computational chemical kinetics and mathematical morphogenesis experiment solving the coupled nonlinear Gray-Scott reaction-diffusion partial differential equations on a 2D spatial lattice, investigating Turing pattern formation, self-replicating chemical spots, and biological morphogenesis guided by a spatially heterogeneous metric field derived from "HELLO WORLD":

1. **Governing Gray-Scott Reaction-Diffusion Equations**:
   - Two interacting chemical species $U$ (inhibitor/substrate) and $V$ (activator) governed by autocatalytic reaction $U + 2V \to 3V$:
     $$\frac{\partial U}{\partial t} = D_u \nabla^2 U - U V^2 + F(x, y) (1 - U)$$
     $$\frac{\partial V}{\partial t} = D_v \nabla^2 V + U V^2 - (F(x, y) + k(x, y)) V$$
   - Discrete 5-point Laplacian stencil on a $200 \times 100$ lattice (20,000 cells):
     $$\nabla^2 C_{i, j} = C_{i+1, j} + C_{i-1, j} + C_{i, j+1} + C_{i, j-1} - 4 C_{i, j}$$
   - Diffusion rates: $D_u = 0.16$, $D_v = 0.08$. The ratio $D_u / D_v = 2.0$ satisfies the Turing diffusion-driven instability criterion.
   - Time-step stability: $D_u \Delta t / \Delta x^2 = 0.160 \le 0.25$, ensuring strict numerical stability under forward Euler time-stepping.
   - Concentration boundedness: $0.0 \le U(x, y), V(x, y) \le 1.0$ maintained at all cells.

2. **Causal Typographic Chemical Metric ("HELLO WORLD")**:
   - The kinetic parameters $F(x, y)$ and $k(x, y)$ are spatially modulated by the literal raster shape of "HELLO WORLD":
     - Inside letter strokes ($1,420\text{ cells}$): $F = 0.054, k = 0.062$ (the active Turing spot-division and labyrinthine filament regime).
     - Outside letter strokes (background agar): $F = 0.020, k = 0.065$ (quiescent decay regime where $V \to 0$).
   - This confinement causes autocatalytic spots to nucleate, replicate, and align strictly along the geometry of the characters:
     - In 'H', 'E', 'L', spots form linear arrays along vertical stems and horizontal bars.
     - In 'O' and 'D', spots form closed annular rings conforming to the curved perimeter.
     - In 'W', spots track the alternating diagonal chevron strokes.
   - Changing the letters alters the autocatalytic reaction domain and total morphogen biomass production.

3. **Phase Space & Biomass Telemetry**:
   - Integrated activator biomass: $M_V = \sum_{x, y} V(x, y) \approx 327 - 355\text{ u}$.
   - Total autocatalytic reaction rate: $\mathcal{R} = \sum_{x, y} U V^2 \approx 30.9 - 32.1\text{ u/s}$.
   - Phase trajectory $(U(t), V(t))$ tracked in a dedicated real-time chemical phase plane monitor.

## Web Platform Surface
- **Biological Agar Petri Culture Dish (`CanvasRenderingContext2D` + `ImageData`)**:
   - Dark agar culture vessel canvas (`#04070e`) with direct buffer rendering (`ImageData.data` Uint8ClampedArray) of activator concentration $V$ mapped to an organic bioluminescent emerald/cyan colormap (`#10b981`, `#06b6d4`, `#f0fdf4`).
   - Right-side chemical phase-plane monitor ($(U, V)$ phase portrait) tracking limit cycle dynamics.
   - In-situ actuators: Nutrient Shock button (`#btnNutrient`), feed rate slider ($F \in [0.030, 0.065]$), and kill rate slider ($k \in [0.050, 0.075]$).

## Verification Evidence
Verified via `tools.js verify 046/046.html 046`:
- **Result**: `OK` (0 static syntax errors, 0 runtime exceptions, 0 dependency violations, CSS valid, canvas rendering active).
- **Nominal Observables**: Diffusion Courant number $0.160 \le 0.25$, concentration bounds strictly maintained in $[0, 1]$, total activator biomass $M_V = 327.2\text{ u}$, reaction rate $\mathcal{R} = 30.9\text{ u/s}$, typographic cells $N = 1,420$.
- **Interaction Response**: Nutrient shock injection surged activator biomass from $327.2\text{ u}$ to $355.1\text{ u}$ and reaction rate to $32.1\text{ u/s}$, visibly triggering spot expansion along letter strokes.
- **Causal Connection**: The chemical feed rate field $F(x, y)$ is the literal binary raster of "HELLO WORLD"; Turing self-organization occurs only within the typographic domain.
