# Experiment 046: Journal & Design Decisions

## 1. Candidate Formulations

### Candidate A: Anisotropic Gray-Scott Reaction-Diffusion Morphogenesis on Typographic Metric Field ("HELLO WORLD")
- **Mechanism**: Solves the coupled nonlinear reaction-diffusion Gray-Scott PDEs with spatially heterogeneous feed rate $F(x, y)$ and anisotropic diffusion tensor $\mathbf{D}(x, y)$ derived from the typography of "HELLO WORLD":
  $$\frac{\partial U}{\partial t} = D_u \nabla^2 U - U V^2 + F(x, y) (1 - U)$$
  $$\frac{\partial V}{\partial t} = D_v \nabla^2 V + U V^2 - (F(x, y) + k(x, y)) V$$
  Inside the raster silhouettes of "HELLO WORLD", parameters are tuned to the active self-replicating Turing spot and labyrinthine worm regime ($F = 0.054, k = 0.062$), while the background is in the quiescent suppression regime ($F = 0.025, k = 0.060$). This confines Turing pattern self-organization specifically along the letter strokes, causing biological morphogens to self-assemble the letters through living cellular spots and dividing filaments.
- **Hello World Causality**: The chemical reaction parameters $F(x, y)$ and $k(x, y)$ are not uniform constants; their spatial field is literally the raster geometry of "HELLO WORLD". Where letter strokes exist, the activator morphogen $V$ undergoes autocatalytic replication $U + 2V \to 3V$. In the hollow bowls of 'O' and 'D', spots arrange into circular rings of discrete punctate cells; in the linear bars of 'H', 'E', 'L', spots form aligned linear chains. Modifying the text alters the spatial domain of autocatalytic production, changing total chemical biomass and morphogen distribution.
- **Evidence Strategy**: Derived invariants: (1) Numerical stability condition $D_u \Delta t / \Delta x^2 < 0.25$; (2) Strict chemical concentration boundedness: $0.0 \le U, V \le 1.0$ across all $200 \times 100$ grid cells; (3) Measured integrated morphogen biomass $M_V = \sum V > 0$; (4) Dynamic nutrient shock response: nutrient pulse $\Delta F$ measurably surges reaction rate $\int U V^2 dA$.
- **Composition**: Biological Agar Petri Dish Culture. Circular optical culture vessel (`#050811`) with specular glass meniscus; bioluminescent activator luminescence (`#10b981`, `#06b6d4`, `#f0fdf4`); side biochemical phase-plane monitor $(U, V)$ and cross-sectional morphogen concentration profile.

### Candidate B: Relativistic Doppler Aberration & Lorentz Contraction on Typographic Constellation
- **Mechanism**: Space-time coordinate transformation and relativistic headlight aberration.

### Candidate C: Granular Sandpile Avalanche & Self-Organized Criticality through Typographic Chutes
- **Mechanism**: 2D cellular automaton sandpile avalanche with power-law distribution.

## 2. Selection & Frontier Contribution
Candidate A is selected. It establishes a brand-new frontier in **Nonlinear Chemical Morphogenesis, Turing Pattern Formation, and Heterogeneous Reaction-Diffusion PDEs**:
- Discretizes Gray-Scott autocatalysis on a $200 \times 100$ lattice with 5-point discrete Laplace operator.
- Spatially heterogeneous chemical kinetics $F(x, y)$ directly derived from "HELLO WORLD".
- Visualizes biological self-organization of typographic forms inside a dark agar culture dish.
