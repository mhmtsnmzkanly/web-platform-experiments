# Experiment 037 — Design Journal

## Candidates Considered

### Candidate A: Semi-Discrete Optimal Transport & Monge-Ampère Power Diagram
- **Mechanism**: Semi-discrete optimal transport between a continuous 2D domain $\Omega$ with uniform Lebesque measure and a discrete typographic measure $\nu = \sum_{i=1}^{10} \nu_i \delta_{y_i}$ where target cell masses $\nu_i$ are causally derived from "HELLO WORLD" character stroke volumes (`['H','E','L','L','O','W','O','R','L','D']`). Laguerre Voronoi power cells $Lag_i(\mathbf{w}) = \{x \in \Omega \mid \|x - y_i\|^2 - w_i \le \|x - y_j\|^2 - w_j\}$. Damped Newton-Raphson Monge-Ampère solver updates weights $\mathbf{w}$ until relative area defects $|\text{Area}(Lag_i) - \nu_i| / \nu_i < 0.02$. Computes exact 2-Wasserstein transport distance $W_2^2 = \sum \int_{Lag_i} \|x - y_i\|^2 dx$.
- **Physical Invariants**:
  - Exact total area conservation: $\sum_{i=1}^{10} \text{Area}(Lag_i) \equiv \text{Area}(\Omega)$ ($100.00\%$).
  - Monge-Ampère convergence residual: $\max_i |\text{Area}_i - \nu_i| / \nu_i \to < 0.02$.
  - 2-Wasserstein transport metric $W_2^2$ dynamically integrated across power cells.
- **Visual Aesthetic**: 1923 Bauhaus Weimar Geometric Constructivism (Walter Gropius, László Moholy-Nagy, Wassily Kandinsky). Cream raw canvas background (`#f5efe6`), stark constructivist primary color blocking (Bauhaus Scarlet `#d9251d`, Cobalt Blue `#154360`, Chrome Yellow `#f59e0b`, Pitch Black `#141414`), bold German typography (`OPTIMALER TRANSPORT`, `KANTOROWITSCH-MONGE-AMPÈRE`), heavy structural dividing rules, and dynamic vector arrows pointing to transport centroids.
- **Strengths**: Classical pure mathematics meets computational geometry and iconic 20th-century art history; zero CRT/screen aesthetic repetition.

### Candidate B: Fluid Dynamic SPH Dam Break
- **Mechanism**: Smoothed particle hydrodynamics over letter obstacles.
- **Risks**: Better suited for 038 where fluid mechanics can shine; optimal transport opens a completely fresh mathematical frontier.

### Candidate C: Non-Euclidean Hyperbolic Voronoi Tesselation
- **Mechanism**: Poincaré disk Voronoi cells.
- **Risks**: Overlaps with experiment 012 (Poincaré Planisphere); semi-discrete optimal transport is brand new.

## Selected Candidate
**Candidate A**: Semi-Discrete Optimal Transport & Monge-Ampère Power Diagram.
- Clean mathematical convergence, causal stroke-weight mass distribution, pristine 1923 Bauhaus Weimar constructivist visual design.
