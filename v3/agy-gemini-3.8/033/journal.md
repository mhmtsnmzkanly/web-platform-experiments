# Experiment Journal: 033 — Cellular Potts Model (CPM) & Biological Morphogenesis of Typographic Tissue

## Candidate Exploration

### Candidate A: Cellular Potts Model (CPM) & Biological Morphogenesis of Typographic Tissue
- **Mechanism**: Graner-Glazier-Hogeweg (GGH) lattice-based cellular tissue modeling on a $180 \times 120$ discrete grid:
  $$H = \sum_{\sigma=1}^{10} \lambda_{\text{area}} (A_\sigma - A_{0,\sigma})^2 + \sum_{\sigma=1}^{10} \lambda_{\text{perim}} (P_\sigma - P_{0,\sigma})^2 + \sum_{\langle i, j \rangle} J(\tau(\sigma_i), \tau(\sigma_j)) (1 - \delta_{\sigma_i, \sigma_j})$$
  1. **Causal Letter Seeding & Adhesion Matrix**:
     - 10 cell clusters initialized from the spatial positions and stroke contours of `['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']`.
     - Target areas $A_{0,\sigma}$ derived from character pixel counts.
     - Inter-cellular surface energy matrix $J(c_i, c_j)$ derived from character alphabetical distance: $|c_i - c_j|$, dictating differential adhesion, cell sorting, and compartmental boundary formation.
  2. **Modified Metropolis Monte Carlo Updates**:
     - At each sub-step, a border pixel proposes to copy its spin $\sigma$ to a neighboring site.
     - The exact Hamiltonian delta $\Delta H$ is computed locally.
     - Acceptance probability: $P(\sigma \to \sigma') = \min(1, e^{-\Delta H / T})$.
  3. **Invariants & Observables**:
     - Live Hamiltonian energy $H$ dynamically evaluated across the entire lattice.
     - Volume discrepancy $\sum |A_\sigma - A_{0,\sigma}|$ verifying mechanical constraint satisfaction.
     - Acceptance ratio $\alpha = N_{\text{accepted}} / N_{\text{attempted}}$.
- **Visual Style**: 1910 Santiago Ramón y Cajal histological microscopy specimen (*Laboratorio de Investigaciones Biológicas de Madrid*); silver nitrate Golgi reaction black impregnation, saffron counter-stain, hand-drawn cellular cortical membranes on aged albumen paper, and calligraphic Spanish histology notations.

### Candidate B: Off-lattice Agent Boids / Flocking
- **Mechanism**: Reynolds boids flocking around letters.
- **Weakness**: Lacks physical tissue mechanics, cellular adhesion Hamiltonians, and Monte Carlo thermodynamic rigor.

### Candidate C: Standard 2D Voronoi Foam
- **Mechanism**: Pure geometric Voronoi tessellation without Monte Carlo Hamiltonian evolution.
- **Weakness**: Repeating mechanism family from 008 without biophysical tissue morphogenesis.

## Selection & Decision
Selected **Candidate A**. It establishes a new frontier in biophysical multicellular mechanics (Cellular Potts Model), implements true Monte Carlo statistical mechanics on a discrete lattice, and derives all adhesion energies and target volumes directly from the typography of "HELLO WORLD".

## Implementation Plan
1. Construct a $180 \times 120$ discrete lattice with 10 cell IDs ($1 \dots 10$) and medium ($0$).
2. Initialize 10 cell seeds at positions of "HELLO WORLD" with glyph contours.
3. Define adhesion energy matrix $J$: low adhesion energy between identical letters (e.g. 'L' and 'L'), high between distant letters, and moderate between cell and extracellular medium.
4. Run 10,000 Monte Carlo spin attempts per animation frame with efficient local $\Delta H$ calculation.
5. Render in 1910 Cajal histological microscopy aesthetic:
   - Albumen paper background (`#f3ebd7`).
   - Golgi silver impregnation dark cell interiors (`#1a1512`) with cell-type saffron/sepia accents.
   - Distinct cell boundary cortical membranes.
   - Live telemetry: Hamiltonian $H$, volume deviation, acceptance rate, active cell count.
6. Verification contracts:
   - `window.labEvidence()` verifying finite Hamiltonian, positive cell areas, acceptance rate $> 0.05$.
   - `window.labScenario` altering cell temperature $T$ or perturbing tissue.
