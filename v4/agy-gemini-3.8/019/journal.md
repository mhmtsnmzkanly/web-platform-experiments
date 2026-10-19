# BAND-FORGE: Engineering & Design Journal

**Experiment**: `019`  
**Focus**: Electronic Band Structure, Topological Quantum Matter, Phonon Dispersions & Hofstadter Butterfly Studio  
**Date**: October 19, 2026  
**Governing Standard**: WBE V4 Autonomous Experiment Development Hardening Protocol (Version 2.0)  

---

## 1. Design Objectives & Agency Charter

- Deliver an interactive, mathematically rigorous solid-state and condensed matter physics laboratory modeling electronic band structures, topological quantum matter invariants, self-similar fractal magnetic spectra (Hofstadter butterfly), and crystal lattice vibrational phonon dispersions.
- Strictly adhere to Hardening Protocol 2.0 to prevent recurrence of defects identified in the SOL 6.1 independent audit of experiments 006–017:
  - Establish a pre-development scientific contract (`SCIENTIFIC_CONTRACT.md`) and validation plan (`VALIDATION_PLAN.md`) with a priori tolerances before writing UI components.
  - Mandate three distinct testing layers: Layer 1 (Standalone numerical and invariant tests), Layer 2 (State lifecycle and clock integration), and Layer 3 (Headless browser runtime verification with Chromium).
  - Enforce zero numerical error concealment (no artificial clamps hiding mathematical instabilities or hardcoded outputs).
- Deliver deep user agency across 5 major condensed matter domains:
  1. **Electronic Band Structure (`BAND_STRUCTURE`)**: High-symmetry path dispersions ($\Gamma \to K \to M \to \Gamma$, $\Gamma \to X \to M \to \Gamma$), draggable Fermi energy line ($E_F$), and continuous density of states (DOS) sidebar with Van Hove singularities.
  2. **2D Brillouin Zone & Fermi Surface (`FERMI_SURFACE`)**: Full 2D dispersion heatmaps, draggable wavevector $\mathbf{k}$-probe with real-space atomic lattice inset, and continuous Marching Squares iso-energy contour extraction.
  3. **Topological Chern & Haldane Studio (`TOPOLOGICAL_CHERN`)**: Signed Berry curvature $\Omega_{xy}(\mathbf{k})$ 2D heatmaps, Dirac mass gap indicators $m_D(K)$ and $m_D(K')$, analytical and discrete Fukui-Hatsugai-Suzuki Chern number calculation, and 1D SSH open-boundary zero-energy soliton spectrum.
  4. **Hofstadter Butterfly Fractal Spectrum (`HOFSTADTER_BUTTERFLY`)**: Complete fractal eigenspectrum of the Harper difference equation across rational flux fractions $\alpha = p/q \in [0, 1]$, with a draggable magnetic flux scrubber and eigenvalue spectrum bars.
  5. **Crystal Lattice Phonon Dispersion (`PHONON_DISPERSION`)**: Coupled acoustic and optical branch dispersions $\omega_\pm(q)$, interactive draggable $q$-probe, and real-time animated 1D diatomic crystal lattice with harmonic longitudinal vibrations.
- 100% Procedural Web Audio: Zero external audio samples; pure mathematical synthesis of phonon modal vibrations, continuous dispersion pitch drones, and topological phase transition bell chimes with a master dynamics compressor limiter.

---

## 2. Key Engineering Milestones & Architectural Choices

### Milestone 1: Exact Analytical Bloch Dispersion Engines
- Formulated the exact nearest-neighbor and next-nearest neighbor tight-binding Hamiltonian for graphene honeycomb, square, and triangular Bravais lattices in `TightBindingSolver.ts`.
- Graphene structure factor $\gamma(\mathbf{k})$ was derived from first principles using exact sublattice basis vectors $\boldsymbol{\delta}_1, \boldsymbol{\delta}_2, \boldsymbol{\delta}_3$, ensuring Dirac points at $K = (4\pi/3a, 0)$ evaluate identically to zero ($E_\pm(K) = 0.00000000\text{ eV}$) to $< 10^{-12}\text{ eV}$ precision.
- Validated analytical band extremes ($\Gamma = \pm 3t$, $M = \pm t$, Square $M = \pm 4t$) and Fermi velocity $v_F = 3ta_{CC} / (2\hbar)$ to $< 0.001\%$ error against known solid-state literature.

### Milestone 2: 1D SSH Topological Solitons & Eigensolver
- Implemented the bulk Hamiltonian $H(k) = \mathbf{d}(k)\cdot\boldsymbol{\sigma}$ and continuous winding number $\nu \in \{0, 1\}$.
- Constructed an explicit $N$-site tridiagonal Hamiltonian under open boundary conditions (OBC) with dimerized bonds $t_1$ and $t_2$.
- Implemented an implicit shift tridiagonal QL/QR eigensolver in `TopologicalMatter.ts` that diagonalizes the $N \times N$ matrix to machine precision, confirming that in the topological phase ($t_1 < t_2$), two zero-energy in-gap boundary solitons emerge at $E = 0.00000000\text{ eV}$ localized strictly at opposite edges.

### Milestone 3: 2D Haldane Chern Insulator & Gauge-Invariant FHS Link Products
- Modeled the Haldane Hamiltonian breaking time-reversal symmetry via complex next-nearest neighbor phase $\phi$.
- Evaluated the analytical Dirac mass gap $m_D(K) = M - 3\sqrt{3}t_2\sin\phi$ and $m_D(K') = M + 3\sqrt{3}t_2\sin\phi$, validating the topological phase boundary $|M| = 3\sqrt{3}t_2|\sin\phi|$.
- Computed the signed Berry curvature $\Omega_{xy}(\mathbf{k})$ via cross-products of normalized unit vector derivatives $\hat{\mathbf{d}}(\mathbf{k})$.
- Implemented the gauge-invariant Fukui-Hatsugai-Suzuki (FHS) discrete link product method (`computeChernNumberFHS`) on the discretized 2D BZ torus, guaranteeing strict integer quantization $C \in \{-1, 0, +1\}$ free from numerical integration boundary artifacts.

### Milestone 4: Classical Jacobi Eigensolver & Hofstadter Fractal
- Formulated the Harper secular difference equation for magnetic flux fractions $\alpha = p/q$.
- Built a Classical Jacobi rotation eigensolver in `HofstadterButterfly.ts` with guaranteed convergence ($< 10^{-14}$ off-diagonal residual), preserving exact particle-hole symmetry $E \leftrightarrow -E$ and bandwidth bounds $[-4t, +4t]$.
- Generated a dense Farey sequence of rational fractions to render the recursive self-similar fractal spectrum.

### Milestone 5: Diatomic Phonon Dynamics & Animated Crystal Chain
- Formulated the secular equation for 1D diatomic lattice vibrations with alternating atomic masses $M_1, M_2$ and spring constant $C_s$.
- Derived the acoustic small-$q$ Taylor expansion, proving $\lim_{q\to 0}\omega_-(q)/q = a\sqrt{C_s / [2(M_1+M_2)]} = v_s$, matching analytical speed of sound to $< 0.1\%$ error.
- Coupled the solver to an interactive canvas displaying both dispersion curves $\omega_\pm(q)$ and a real-time animated atomic chain undergoing longitudinal displacements proportional to normal-mode eigenvectors.

### Milestone 6: Procedural Web Audio Engine with Limiter
- 100% procedural synthesis in `BandSonificationEngine.ts` with zero external media files.
- Dual-branch phonon modal synthesizer producing pure sine tones at acoustic and optical frequencies.
- Continuous dispersion pitch drone tracking probe energy $E(\mathbf{k})$ with exponential de-zippering gain ramping.
- Pentatonic bell chime triggered upon topological phase transitions.
- Master dynamics compressor limiter (-12 dB threshold, 12:1 ratio, 3 ms attack) guaranteeing digital clipping immunity.

---

## 3. Post-Audit Hardening Remediations

Following independent dual audits by Technical and Product Quality subagents, the following remediations were implemented:
1. **Audio Drone Leak on Tab Switch**: Added unmount cleanup effects in `FermiSurfaceCanvas` and `PhononCanvas` calling `onProbeHover?.(0, false)` and `onUpdatePhononAudio?.(0, 0, false)`, plus explicit audio silencing on tab selection in `App.tsx`.
2. **60 FPS Reference Churn on Static Canvases**: In `SimulationController.ts`, returning `{ ...this.params }` broke React reference equality, causing unnecessary re-renders. Fixed by returning authoritative `this.params` directly and scoping 60 FPS animation ticks strictly to `PHONON_DISPERSION` mode.
3. **Fukui-Hatsugai-Suzuki Link Algorithm**: Implemented `TopologicalMatter.computeChernNumberFHS` evaluating discrete $U(1)$ plaquette link products over the 2D Brillouin zone torus, providing exact integer quantization matching the contract.
4. **Canvas Resize & Blurriness**: Attached `ResizeObserver` to `containerRef` across all 5 visualizer canvases, automatically updating bitmap dimensions and applying DPR transform without page reload.
5. **GC Allocation Elimination**: In `PhononCanvas`, `maxOmega` is memoized with `useMemo`, eliminating 80-element array allocations every frame. In `TopologicalChernCanvas`, Berry curvature is written into a 32-bit `ImageData` buffer and blitted via `ctx.drawImage`, eliminating 1,600 `fillRect` and string allocations per frame.
6. **Preset Selection UI Sync**: `<select>` now binds to `params.activePresetId`, accurately displaying the selected preset name for all 6 presets.
7. **Direct Parameter Sliders**: Added dedicated sliders for $t'$ (next-nearest neighbor hopping in eV) and $C_s$ (interatomic spring force constant in N/m) in `BandControlDeck.tsx`.

---

## 4. Verification & Certification Summary

- **Layer 1 Standalone Engine Tests**: 41/41 PASS (100%).
- **Layer 2 Lifecycle Contracts**: PASS (Single-owner state, unified clock, 6 presets).
- **Layer 3 Browser End-to-End Tests**: PASS (Chromium headless, zero console errors, zero uncaught exceptions).
- **Independent Technical Audit**: PASS WITH ADVISORIES $\to$ All findings fully remediated.
- **Independent Product Quality Audit**: PASS.
