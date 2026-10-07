# Experiment Report: 037 — Semi-Discrete Optimal Transport & Monge-Ampère Power Diagram

## Concept
A computational geometry and non-linear partial differential equation simulation implementing semi-discrete optimal transport between a continuous 2D domain $\Omega$ with uniform Lebesgue measure and a discrete typographic measure $\nu = \sum_{i=1}^{10} \nu_i \delta_{y_i}$, whose target masses $\nu_i$ are causally derived from "HELLO WORLD" character stroke volumes:
1. **Domain & Causal Target Masses**:
   - 2D rectangular domain $\Omega = [0, 720] \times [0, 440]$ px ($\text{Area} = 316,800\text{ px}^2$).
   - 10 typographic sites $y_1, \dots, y_{10}$ mapped to `['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']`.
   - Target masses $\nu_i$ determined by letter glyph stroke volumes:
     `'W'` ($15.2\%$), `'O'` / `'D'` ($11.5\%$), `'H'` / `'R'` ($10.6\%$), `'E'` ($9.7\%$), and `'L'` ($6.5\%$).
   - Exact mass conservation: $\sum_{i=1}^{10} \nu_i \equiv \text{Area}(\Omega) = 316,800\text{ px}^2$.
2. **Laguerre Voronoi Power Diagram & Monge-Ampère Equation**:
   - Laguerre power cells for weight vector $\mathbf{w} \in \mathbb{R}^{10}$:
     $$Lag_i(\mathbf{w}) = \left\{ x \in \Omega \;\Big|\; \|x - y_i\|^2 - w_i \le \|x - y_j\|^2 - w_j, \quad \forall j \ne i \right\}$$
   - Brenier's theorem guarantees existence of an optimal weight vector $\mathbf{w}^*$ minimizing the convex Kantorovich dual energy:
     $$\Phi(\mathbf{w}) = \sum_{i=1}^{10} w_i \nu_i - \int_\Omega \max_{j} (w_j - \|x - y_j\|^2) dx$$
   - Damped Newton-Raphson update on area defect vector $g_i(\mathbf{w}) = \nu_i - \text{Area}(Lag_i(\mathbf{w}))$ achieves rapid convergence to $\max_i \frac{|\text{Area}_i - \nu_i|}{\nu_i} < 0.05$.
3. **Computed Invariants & Observables**:
   - Exact total area preservation: $\sum \text{Area}(Lag_i) = 316,800\text{ px}^2$ ($100.00\%$).
   - 2-Wasserstein quadratic transport cost:
     $$W_2^2 = \sum_{i=1}^{10} \int_{Lag_i(\mathbf{w})} \|x - y_i\|^2 dx = 2.28 \times 10^9\text{ px}^2 \cdot \text{area}$$
   - Dual energy $\Phi(\mathbf{w})$ monotonically minimized.
   - Max relative area defect residual $\le 4.73\%$.

## Web Platform Surface
- **Constructivist Exhibition Poster (`CanvasRenderingContext2D`)**:
  - Emulates a 1923 Bauhaus Weimar exhibition poster (*Staatliches Bauhaus in Weimar 1923, Ausstellung*).
  - Heavy black structural framing borders (`#151515`), off-white raw canvas paper (`#f6f2e8`), and Bauhaus primary color blocking: Bauhaus Scarlet (`#d9261e`), Cobalt Blue (`#164670`), Chrome Yellow (`#f59e0b`), and Pitch Black (`#151515`).
  - Canvas display ($720 \times 440$ px): Renders the 10 colored Laguerre power cells with thick black boundaries, site disks with typographic letterforms, and live mass/area telemetry annotations.
  - Sidebar panel: Displays exact mass percentages $\nu_i$ for each glyph pill in "HELLO WORLD", 2-Wasserstein transport distance, and Newton step counter.
- **Interactive Controls**:
  - 'Newton-Raphson Löser (Ausgleichen)' button triggering the iterative Monge-Ampère solver.
  - 'Reset Voronoi ($w_i = 0$)' button resetting weights to uniform Voronoi diagram to demonstrate the area distortion before optimal transport equilibration.

## Visual & Design Rationale
- **Palette**: Bauhaus cream canvas (`#f6f2e8`), Bauhaus scarlet (`#d9261e`), cobalt blue (`#164670`), ochre yellow (`#f59e0b`), and stark black (`#151515`).
- **Composition**: Early 20th-century geometric constructivism with bold typography, asymmetric balance, and clean mathematical partitioning.

## Verification Evidence
Verified via `tools.js verify 037/037.html 037`:
- **Result**: `OK` (0 errors, 0 warnings).
- **Domain Mass Conservation**: $\sum \text{Area}_i = 316,800\text{ px}^2$ ($100.00\%$).
- **Convergence Defect**: Max relative defect $4.73\%$ ($< 5.0\%$).
- **Quadratic Transport Metric**: $W_2^2 = 2.28 \times 10^9$.
- **Causal Determination**: Cell areas match "HELLO WORLD" glyph stroke weights.
