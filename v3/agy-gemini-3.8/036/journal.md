# Experiment 036 — Design Journal

## Candidates Considered

### Candidate A: Ising Model Spin Glass & Simulated Annealing on Typographic Frustration Network
- **Mechanism**: A 2D spin network ($N = 120$ spins, $\sigma_i = \pm 1$) arranged in 10 typographic clusters corresponding to "HELLO WORLD". Bond couplings $J_{ij}$ are defined by typographic adjacency and letter bigrams: intra-cluster bonds are ferromagnetic ($J > 0$), while cross-cluster loop bonds and antagonistic glyph pairs are antiferromagnetic ($J < 0$), generating non-trivial geometric frustration in triangular/pentagonal loops. Glauber Monte Carlo thermal annealing $T(t)$, live Edwards-Anderson order parameter $q_{\text{EA}} = \frac{1}{N}\sum \langle \sigma_i \rangle^2$, exact lattice Hamiltonian $E$, and frustration index $f$.
- **Physical Invariants**:
  - Global Hamiltonian energy conservation / incremental $\Delta E$ consistency: $E = -\sum_{\langle i,j \rangle} J_{ij}\sigma_i\sigma_j$.
  - Exact frustration index: fraction of unsatisfied bonds $f = \frac{1}{M}\sum \Theta(-J_{ij}\sigma_i\sigma_j) > 0$.
  - Edwards-Anderson order parameter transition: $q_{\text{EA}} \approx 0.05$ (paramagnetic high $T$) to $q_{\text{EA}} > 0.65$ (frozen spin glass low $T$).
- **Visual Aesthetic**: 1956 Manchester Mark 1 Early Computing Laboratory (Ferranti Mark 1). Pale blue-grey hammertone steel cabinetry, circular green Williams-Kilburn electrostatic CRT storage tube displaying charge storage dots, and Creed Model 7 teleprinter paper tape logging live energy drops.
- **Strengths**: Classical statistical mechanics with topological frustration, mathematically verified local vs global energy equivalence, distinct 1950s British computing visual identity.

### Candidate B: Sherrington-Kirkpatrick Infinite-Range Spin Glass
- **Mechanism**: Fully connected spin glass with Gaussian couplings $J_{ij} \sim \mathcal{N}(0, 1/N)$.
- **Risks**: All-to-all connectivity has $O(N^2)$ computation per sweep and lacks visual planar spatial layout; less natural mapping to typographic glyph morphology.

### Candidate C: XY Model Vortex-Antivortex Berezinskii-Kosterlitz-Thouless (BKT) Transition
- **Mechanism**: Continuous planar spins $\theta_i \in [0, 2\pi)$ on 2D typographic mesh.
- **Risks**: High overlap with experiment 034 DEC curl/divergence flows; discrete Ising $\pm 1$ provides sharper contrast with preceding quantum continuous wavepacket.

## Selected Candidate
**Candidate A**: Ising Model Spin Glass & Simulated Annealing on Typographic Frustration Network.
- Discrete $\pm 1$ spin dynamics, explicit geometric frustration induced by letter graph loops, Williams-Kilburn CRT tube + teleprinter paper tape aesthetic.
