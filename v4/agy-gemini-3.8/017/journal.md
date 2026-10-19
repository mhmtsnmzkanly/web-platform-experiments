# COLLIDER-LAB: Engineering & Design Journal

**Experiment**: `017`  
**Focus**: High-Energy Particle Physics, Relativistic Quantum Scattering, Jet Clustering & Collider Detector Studio  
**Date**: October 19, 2026

---

## 1. Design Objectives & Agency Charter
- Deliver an interactive, mathematically rigorous high-energy particle physics collision and detector laboratory exploring subatomic scattering, relativistic kinematics, calorimeter shower development, and jet reconstruction.
- Emphasize deep user agency across 4 distinct domains of particle physics:
  1. **Transverse Detector Cross-Section (X-Y)**: Concentric subdetector simulation (Silicon Inner Tracker, ECAL crystals, HCAL absorbers, Superconducting Solenoid, Muon Spectrometer) with Lorentz force helical track deflection ($p_T = 0.3 B R |q|$) in an adjustable axial magnetic field $B \in [0.5, 4.0\text{ T}]$.
  2. **Longitudinal Detector View (R-Z)**: Side-profile cross-section displaying barrel calorimeters, forward endcap disks, and pseudorapidity $\eta$ coordinate cones ($\eta \in [-3.2, 3.2]$).
  3. **Calorimeter (η, φ) Lego Plot & Jet Reconstruction**: Standard high-energy physics Lego tower plot displaying transverse energy $E_T$ deposited in ECAL and HCAL crystal cells, with overlaid anti-$k_t$ jet cones.
  4. **Invariant Mass Spectrum & Resonance Reconstruction**: Real-time accumulating histogram of reconstructed multi-particle invariant masses ($M_{\text{inv}} = \sqrt{E^2 - |\mathbf{p}|^2}$) revealing Breit-Wigner resonance peaks for the Higgs Boson ($125.1\text{ GeV}$), $Z^0$ Vector Boson ($91.2\text{ GeV}$), and Top Quark ($172.8\text{ GeV}$), with live statistical significance calculations ($S/\sqrt{B} \ge 5\sigma$ discovery alert).
- 100% Procedural Web Audio: Zero audio sample files; real-time procedural synthesis of RF bunch crossing pulses, tracker ionization clicks, ECAL crystal bell chimes, HCAL hadronic rumbles, muon horn tones, and discovery pentatonic arpeggios with master dynamics limiting.

---

## 2. Key Engineering Milestones & Architectural Choices

### Milestone 1: Relativistic 4-Momentum Kinematics & Breit-Wigner Sampling
- Implemented Minkowski 4-vector algebra ($p^\mu = (E, \mathbf{p})$) with invariant mass $M = \sqrt{E^2 - \mathbf{p}^2}$.
- Implemented inverse-CDF relativistic Breit-Wigner sampling for unstable resonance masses:
  $m = m_0 + \frac{\Gamma}{2} \tan(\pi (u - 0.5))$
- Built 2-body isotropic decay generators in parent rest frames coupled to Lorentz boost matrices returning laboratory 4-momenta.
- Implemented Transverse Mass calculation for leptonic $W$ decays:
  $M_T = \sqrt{2 p_T^\ell E_T^{\text{miss}} (1 - \cos\Delta\phi)}$.

### Milestone 2: Anti-kt Jet Clustering Engine
- Implemented the experimental anti-$k_t$ jet clustering algorithm ($p = -1$):
  - Inter-particle metric: $d_{ij} = \min(1/k_{Ti}^2, 1/k_{Tj}^2) \frac{\Delta R_{ij}^2}{R^2}$
  - Beam metric: $d_{iB} = 1 / k_{Ti}^2$
  - Iterative merging of closest pairs by 4-momentum addition and separation of finished jets when $d_{iB} < d_{ij}$.
- Added configurable jet cone radius parameter $R \in [0.2, 1.0]$.
- Overlaid jet cones with transverse momentum labels on both the detector canvas and the $(\eta, \phi)$ Lego plot.

### Milestone 3: Real-Time Subdetector Physical Simulation
- Modeled realistic subdetector dimensions (Beam pipe $0.04\text{ m}$, Tracker $0.08\text{–}1.15\text{ m}$, ECAL $1.25\text{–}1.85\text{ m}$, HCAL $1.95\text{–}3.15\text{ m}$, Solenoid $3.40\text{ m}$, Muon Spectrometer $3.75\text{–}6.20\text{ m}$).
- Calculated track propagation points through the axial magnetic field $B$, bending charged particles by the Lorentz force and leaving straight paths for neutral particles.
- Simulated energy deposits: EM shower containment in ECAL for $e^\pm$ and $\gamma$, nuclear cascades in HCAL for hadrons, and MIP penetration through to the outer drift chambers for muons.
- Reconstructed Missing Transverse Energy ($\mathbf{p}_T^{\text{miss}} = -\sum \mathbf{p}_{T,i}$) and displayed vector arrows.

### Milestone 4: Procedural Sonification & Performance Optimization
- Built procedural Web Audio synthesizer:
  - Bunch crossing clock tick at 880 Hz decaying to 220 Hz.
  - Tracker ionization micro-clicks with frequency scaled to track $p_T$.
  - High-frequency crystalline bell chimes for ECAL showers (1760 Hz with fifth harmonic).
  - Low-pass filtered sawtooth rumble for HCAL hadronic cascades.
  - Frequency-modulated brassy horn for penetrating muon spectrometer hits.
  - Ascending pentatonic arpeggio (C6–D7) celebrating resonance discovery.
- Zero-GC rendering: Pre-allocated arrays and typed views guarantee steady 60 FPS performance.
- Decoupled state updates and throttled telemetry updates to prevent React render cascades.

---

## 3. Dual Independent Audit & Remediations Applied

Independent subagent auditing was conducted by the **Technical Auditor** and **Product Quality Auditor**:
- **Product Quality Auditor Verdict**: **PASS** (Substantive, High-Fidelity Physics Studio).
- **Technical Auditor Verdict**: **CONDITIONAL PASS / ACTION REQUIRED** (1 Critical, 3 Major, 2 Minor findings).

### Remediations Executed & Verified:
1. **[CRITICAL] Positive Charge Track Propagation & Hit Coordinates (`DetectorGeometry.ts`)**:
   - Re-parameterized circular arc intersection from circle center $(x_c, y_c)$ using initial angle $\alpha_0 = \operatorname{atan2}(-y_c, -x_c)$ and $\alpha = \alpha_0 + \text{bendSign} \cdot \text{arcAngle}$. This guarantees exact $x^2 + y^2 = r_{\text{target}}^2$ radius targeting for all particle charge states ($e^+, \mu^+, \pi^+, K^+, p$).
2. **[MAJOR] Top Quark W-Jet Fragmentation Arguments (`CollisionGenerator.ts`)**:
   - Corrected argument passing to `createJetShower(particles, pQ1.pt, pQ1.phi, pQ1.eta, ...)` instead of Cartesian components $(p_x, p_y, p_z)$, eliminating hadronic cluster loss.
3. **[MAJOR] High-DPI (Retina) Coordinate Normalization (`DetectorCanvas.tsx` & `LegoPlotCanvas.tsx`)**:
   - Scaled pointer coordinates by `scaleX = canvas.width / rect.width` and `scaleY = canvas.height / rect.height`, ensuring pixel-perfect hover HUD tooltips and click-to-inspect functionality on Apple Retina and high-DPI displays.
4. **[MAJOR] Active Level-1 / High-Level Trigger Filter (`App.tsx`)**:
   - Wired `config.triggerFilter` into the collision engine, actively filtering collision bunches until passing `DI_LEPTON`, `DI_PHOTON`, `HIGH_MET`, or `MULTI_JET` criteria are met.
5. **[MINOR] Zero-GC Canvas Memory Architecture (`LegoPlotCanvas.tsx` & `DetectorCanvas.tsx`)**:
   - Cached `Float32Array` buffers for the $(\eta, \phi)$ calorimeter grid and memoized track points via `useMemo([event, config.magneticFieldB])`, eliminating garbage collection pauses at 60 FPS.
6. **[MINOR] Web Audio User Gesture Autoplay Compliance (`App.tsx`)**:
   - Initialized and resumed the `AudioContext` directly within user click handlers (`handleToggleMute` and `onManualCollide`).
7. **[PRODUCT POLISH] Analytical Signal + Background Fit Curve & Tooltip Energies**:
   - Added continuous Breit-Wigner + exponential background model fit line overlay on the mass spectrum histogram and real-time ECAL/HCAL cell energy deposits in the Lego plot hover HUD.

