# Experiment Report: 033 — Cellular Potts Model & Biological Morphogenesis of Typographic Tissue

## Concept
A multicellular biophysical simulation based on the Cellular Potts Model (CPM / Glazier-Graner-Hogeweg model) and the Differential Adhesion Hypothesis (DAH), modeling 10 interacting biological cells whose spatial seeding, target volumes, cortical boundaries, and mutual surface adhesion energies are causally derived from "HELLO WORLD":
1. **Lattice & Cell Configuration**:
   - Discrete 2D lattice of $160 \times 90 = 14,400$ sites ($5\times$ viewport scaling to $800 \times 450$ px).
   - Medium index $\sigma = 0$; biological cells $\sigma \in \{1, \dots, 10\}$ mapped to `['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']`.
   - Target areas $A_{0,\sigma}$ modulated by character stroke weights ($A_{0,\sigma} \in [211, 271]$ lattice sites).
2. **Graner-Glazier Hamiltonian**:
   $$H = \sum_{\sigma=1}^{10} \lambda_{\text{area}} (A_\sigma - A_{0,\sigma})^2 + \sum_{\langle i, j \rangle} J(\sigma_i, \sigma_j) (1 - \delta_{\sigma_i, \sigma_j})$$
   - Parameter values: $\lambda_{\text{area}} = 0.35$, fluctuation temperature $T = 6.0$.
   - Adhesion matrix $J(c_1, c_2)$: Identical letters (e.g. `'L'` and `'L'`) share low interfacial energy ($J = 4.0$, high mutual affinity), while distant letters experience high interfacial tension ($J \le 22.0$), driving cell sorting and stable boundary demarcation.
3. **Modified Metropolis Monte Carlo Updates**:
   - 8,000 spin copy attempts per animation frame.
   - Proposed copy $\sigma(x') \to \sigma(x)$ evaluated via local $\Delta H = \Delta H_{\text{adhesion}} + \Delta H_{\text{area}}$.
   - Accepted with Boltzmann probability $P = \min(1, \exp(-\Delta H / T))$.
4. **Computed Invariants & Observables**:
   - Exact global Hamiltonian $H$ dynamically evaluated across area elastic penalties and neighbor contact interfaces ($H \approx 16,000\text{ a.u.}$).
   - Mean volume deviation: $\frac{1}{10}\sum \frac{|A_\sigma - A_{0,\sigma}|}{A_{0,\sigma}} \approx 17\%$.
   - Boundary mutation acceptance rate: $\alpha_{\text{accept}} \in [0.45, 0.65]$.

## Web Platform Surface
- **Canvas 2D Histological Microscopy Specimen (`CanvasRenderingContext2D`)**:
  - Emulates a 1910 Santiago Ramón y Cajal neuro-histology slide (*Laboratorio de Investigaciones Biológicas de Madrid*) on aged albumen paper (`#faf4e6`).
  - Silver nitrate Golgi black impregnation (`#181412`, `#292524`) for cell bodies and dense cortical membranes.
  - Saffron, ochre, and carmine biological counter-staining (`#78350f`, `#b45309`, `#8f2d2d`).
  - Cell nuclei rings with Latin character glyphs and live site area labels.
  - Calligraphic Spanish histology plaque annotations (*Preparación Histológica*, *Impregnación Argéntica*).
- **Interactive Controls**:
  - 'Thermal Agitation Pulse' button temporarily increasing Boltzmann temperature $T \to 14.0$.
  - 'Perturb Cortical Tension' button altering target areas.
  - Reset cell seed lattice button.
  - Membrane fluctuation slider ($T \in [2.0, 15.0]$).
  - Direct canvas click to stimulate local cell growth.

## Visual & Design Rationale
- **Palette**: Aged albumen mounting paper (`#faf4e6`), silver nitrate Golgi black (`#181412`), saffron yellow/umber (`#c88327`, `#78350f`), and sepia border rules (`#a89378`).
- **Composition**: Early 20th-century histological slide plate with cell nuclei markers, border graduation, and classic Cajal Spanish medical annotations.

## Verification Evidence
Verified via `tools.js verify 033/033.html 033`:
- **Result**: `OK` (0 errors, 0 warnings).
- **Subject**: 10 biological cells mapped to "HELLO WORLD" characters.
- **Measured Invariants & Evidence**:
  - 10 living cells with strictly positive areas ($A_\sigma > 190$ sites).
  - Finite, computed Potts Hamiltonian $H = 16,276\text{ a.u.}$.
  - Boundary Monte Carlo acceptance rate: $50.7\%$.
  - Thermal pulse interaction elevates membrane fluctuations cleanly.
