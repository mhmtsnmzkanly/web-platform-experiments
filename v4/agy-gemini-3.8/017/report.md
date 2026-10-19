# COLLIDER-LAB: High-Energy Particle Physics, Relativistic Quantum Scattering, Jet Clustering & Collider Detector Studio
**Technical Architecture & Physical Systems Report**  
*Experiment 017 — Autonomous Web Platform Experiment*

---

## 1. Executive Summary

**COLLIDER-LAB** is an interactive, browser-based computational physics laboratory simulating high-energy subatomic particle collisions, relativistic 4-momentum kinematics, calorimeter shower development, and jet clustering algorithms modeled after the Large Hadron Collider (ATLAS and CMS experiments at CERN).

The studio integrates:
1. A **Relativistic 4-Momentum Kinematics & Quantum Scattering Engine**, executing exact Minkowski 4-vector algebra ($p^\mu = (E, \mathbf{p})$ with metric $\eta = (+,-,-,-)$), relativistic Breit-Wigner resonance generation, isotropic 2-body center-of-mass decays, and Lorentz boosts to the laboratory frame.
2. An **Experimental Anti-$k_t$ Jet Clustering Engine** ($p = -1$) with variable cone radius $R \in [0.2, 1.0]$, iteratively clustering particle four-momenta into collimated hadron jets with kinematic parameters ($p_T, \eta, \phi, M_{\text{jet}}$).
3. A **Multi-Layered Subdetector Simulation**:
   - Central Beryllium Beam Pipe ($r = 0.04\text{ m}$).
   - Silicon Pixel and Microstrip Inner Tracker ($r \in [0.08, 1.15\text{ m}]$) in an axial magnetic field $B_z \in [0.5, 4.0\text{ T}]$: charged tracks deflect via the Lorentz force with gyroradius $R = p_T / (0.3 B |q|)$.
   - Lead Tungstate ($\text{PbWO}_4$) Electromagnetic Calorimeter (ECAL, $r \in [1.25, 1.85\text{ m}]$): full containment of electromagnetic cascades from electrons and photons.
   - Brass/Scintillator Hadronic Calorimeter (HCAL, $r \in [1.95, 3.15\text{ m}]$): deep absorption of hadron showers from pions, kaons, protons, and neutrons.
   - Superconducting Solenoid Magnet ($r = 3.40\text{ m}$).
   - Muon Spectrometer & Drift Tubes ($r \in [3.75, 6.20\text{ m}]$): high-penetration detection of minimum ionizing muons.
   - Missing Transverse Energy ($\mathbf{p}_T^{\text{miss}} = -\sum \mathbf{p}_{T,i}$) reconstruction for weakly interacting particles (neutrinos and dark matter neutralinos).
4. Four distinct **Suite Modes**:
   - `TRANSVERSE_DETECTOR`: Cross-sectional $x\text{–}y$ projection with curved tracks, calorimeter hits, jet cones, and hoverable particle HUDs.
   - `LONGITUDINAL_RZ`: Side-profile $r\text{–}z$ barrel and endcap calorimeter geometries with pseudorapidity $\eta$ coordinate cones.
   - `LEGO_ETA_PHI`: Standard high-energy physics $(\eta, \phi)$ calorimeter energy tower plot with anti-$k_t$ jet circles overlaid.
   - `MASS_SPECTRUM`: Dynamic invariant mass histogram accumulating events over time with Breit-Wigner peak fitting, signal-to-background extraction, and real-time $5\sigma$ discovery significance metrics.
5. Six curated **Collision Presets**:
   - Higgs Boson Di-Photon ($H \to \gamma\gamma$, $M = 125.1\text{ GeV}$)
   - Higgs Golden Channel ($H \to ZZ^* \to 4\ell$, $M = 125.1\text{ GeV}$)
   - $Z^0$ Standard Candle ($Z^0 \to \mu^+\mu^-$, $M = 91.2\text{ GeV}$)
   - Top Quark Pair Production ($t\bar{t} \to bW^+ \bar{b}W^-$)
   - Dark Matter / SUSY Monojet ($pp \to \tilde{\chi}_1^0 \tilde{\chi}_1^0 + g$)
   - QCD Dijet Hard Scattering ($qg \to qg$)
6. A **100% procedural Web Audio collider sonification engine** with master dynamics limiting, generating bunch crossing pulses, tracker ionization clicks, ECAL crystal bell chimes, HCAL hadronic bursts, muon horn tones, and pentatonic discovery arpeggios.

---

## 2. Theoretical Foundations & Mathematical Formulations

### 2.1 Relativistic Four-Momenta & Invariant Mass
In relativistic mechanics with $c=1$, the energy-momentum four-vector is:
$$p^\mu = (E, p_x, p_y, p_z)$$
The Minkowski invariant length defines the rest mass $m$:
$$p_\mu p^\mu = E^2 - (p_x^2 + p_y^2 + p_z^2) = m^2 \implies M_{\text{inv}} = \sqrt{E^2 - |\mathbf{p}|^2}$$
For a system of $N$ final-state particles:
$$M_{\text{inv}} = \sqrt{\left(\sum_{i=1}^N E_i\right)^2 - \left(\sum_{i=1}^N \mathbf{p}_i\right)^2}$$

### 2.2 Angular Phase Space & Pseudorapidity
At hadron colliders, the longitudinal boost of the parton-parton collision system is unknown due to parton distribution functions (PDFs). Observables are expressed in Lorentz-invariant transverse variables:
- Transverse momentum: $p_T = \sqrt{p_x^2 + p_y^2}$
- Azimuthal angle: $\phi = \operatorname{atan2}(p_y, p_x) \in [-\pi, \pi]$
- Polar angle: $\theta = \arccos(p_z / |\mathbf{p}|)$
- Pseudorapidity $\eta$, which approximates rapidity $y = \frac{1}{2}\ln\frac{E + p_z}{E - p_z}$ in the ultra-relativistic limit ($p \gg m$):
$$\eta \equiv -\ln\left[\tan\left(\frac{\theta}{2}\right)\right]$$
Differences in pseudorapidity $\Delta\eta = \eta_1 - \eta_2$ are invariant under longitudinal Lorentz boosts.
The angular distance measure in the $(\eta, \phi)$ plane is:
$$\Delta R = \sqrt{(\Delta\eta)^2 + (\Delta\phi)^2}$$

### 2.3 Relativistic Breit-Wigner Resonance Distribution
Unstable particles of nominal mass $M_0$ and decay width $\Gamma$ obey the relativistic Breit-Wigner probability density:
$$P(M) \propto \frac{1}{(M^2 - M_0^2)^2 + M_0^2 \Gamma^2}$$
In our simulation, resonance masses are generated via inverse transform sampling:
$$M = M_0 + \frac{\Gamma}{2} \tan\left[\pi \left(u - \frac{1}{2}\right)\right], \quad u \sim \mathcal{U}(0, 1)$$

### 2.4 Track Motion in Axial Magnetic Fields (Lorentz Force)
In a uniform axial magnetic field $\mathbf{B} = B_z \hat{z}$, the equation of motion for a particle of charge $q = \pm e$ is:
$$\frac{d\mathbf{p}}{dt} = q (\mathbf{v} \times \mathbf{B})$$
In the transverse $x\text{–}y$ plane, the trajectory is a circle of gyroradius $R$:
$$R = \frac{p_T}{0.3 \cdot B \cdot |q|} \quad [R\text{ in meters, } p_T\text{ in GeV/c, } B\text{ in Tesla}]$$
The sign of $q$ dictates the deflection curvature relative to the initial emission vector $\phi_0$:
$$x(s) = x_c + R \sin(\phi_0 + \text{sgn}(q) \cdot s/R)$$
$$y(s) = y_c - R \cos(\phi_0 + \text{sgn}(q) \cdot s/R)$$
$$z(s) = \frac{s}{\tan\theta}$$
Neutral particles ($q = 0$, e.g. photons, $\pi^0$, neutrons) do not experience Lorentz acceleration and propagate along straight lines: $R = \infty$.

### 2.5 Anti-$k_t$ Jet Clustering Algorithm
The anti-$k_t$ algorithm defines distances for all entities $i$ and pairs $(i, j)$:
$$d_{ij} = \min(k_{Ti}^{-2}, k_{Tj}^{-2}) \frac{\Delta R_{ij}^2}{R^2}$$
$$d_{iB} = k_{Ti}^{-2}$$
Because $p = -1$, energetic hard particles have very small distance measures $d_{ij}$ and $d_{iB}$. Consequently:
- Hard particles cluster soft surrounding radiation iteratively.
- Soft particles do not cluster with each other unless no hard particle is nearby.
- The resulting jet boundaries are resilient to soft pileup and produce geometrically circular cone boundaries of radius $R$ in the $(\eta, \phi)$ plane.

### 2.6 Missing Transverse Energy (MET) & Transverse Mass
Due to total momentum conservation in the transverse plane:
$$\mathbf{p}_T^{\text{miss}} = -\sum_{i \in \text{visible}} \mathbf{p}_{T,i}, \quad E_T^{\text{miss}} = |\mathbf{p}_T^{\text{miss}}|$$
For leptonic $W \to \ell \nu$ decays where the neutrino's longitudinal momentum $p_z^\nu$ cannot be measured directly, the Transverse Mass $M_T$ provides the kinematic Jacobian peak at $M_W$:
$$M_T = \sqrt{2 p_T^\ell E_T^{\text{miss}} (1 - \cos\Delta\phi_{\ell, \text{MET}})}$$

---

## 3. Architecture & Verification Summary

### Verification Checklist & Results
| Test Item | Specification | Result |
|---|---|---|
| Page Navigation & Title | `COLLIDER-LAB` title string verified | PASS |
| HTML5 Canvas Rendering | Transverse, Longitudinal, Lego, Mass Spectrum | PASS |
| Suite Modes | All 4 modes interactively toggled | PASS |
| Collision Presets | All 6 curated scenarios loaded | PASS |
| Manual Collide & Bunch | One-shot manual bunch collision tested | PASS |
| Continuous Beam Stream | Start/pause interval collision runner | PASS |
| Web Audio Sonification | Limiter compressor, bunch, calorimeter, chime | PASS |
| Export Telemetry Modal | JSON, particle CSV, mass spectrum CSV | PASS |
| Console Error Count | Zero uncaught exceptions or console errors | PASS (0 errors) |

### Independent Dual-Agent Audits & Remediations
1. **Product Quality Auditor (`ced9c602-d203-4065-a62a-31168eaee5a3`)**: **PASS**
   - Verified relativistic physics fidelity, 4-momentum algebra, anti-$k_t$ jet clustering, full detector layer modeling, 4 suite modes, and procedural Web Audio sonification.
2. **Technical Auditor (`5f27fad4-a61b-4a0d-b179-b775b98b7fc0`)**: **CONDITIONAL PASS** (1 Critical, 3 Major, 2 Minor findings).
   - **Remediations Fully Applied & Verified**:
     - **P0 [CRITICAL]**: Fixed positive charge circle intersection formula in `DetectorGeometry.ts` using center angle parameterization $\alpha = \alpha_0 + \text{bendSign} \cdot \text{arcAngle}$, eliminating track and hit distortion for $e^+, \mu^+, \pi^+, K^+, p$.
     - **P1 [MAJOR]**: Corrected argument passing in Top Quark hadronic W decay (`CollisionGenerator.ts`), passing $p_T, \phi, \eta$ instead of Cartesian momenta.
     - **P2 [MAJOR]**: Scaled pointer coordinates by device pixel ratio (`canvas.width / rect.width`) in `DetectorCanvas.tsx` and `LegoPlotCanvas.tsx` for high-DPI (Retina) screen compatibility.
     - **P3 [MAJOR]**: Implemented active Level-1/High-Level trigger acceptance filtering in `App.tsx` (`config.triggerFilter`).
     - **P4 [MINOR]**: Cached `Float32Array` buffers and memoized particle track points via `useMemo` for zero-GC 60 FPS performance.
     - **P5 [MINOR]**: Guaranteed Web Audio API context resume on user gesture in `handleToggleMute` and `onManualCollide`.
     - **[POLISH]**: Added continuous analytical model fit curve overlay on mass spectrum histogram and live cell energy readout in Lego plot hover HUD.

---

## 4. Conclusion
**COLLIDER-LAB** establishes an unprecedented browser-based experimental particle physics studio, uniting exact relativistic mechanics, full subdetector ray casting, the anti-$k_t$ jet clustering algorithm, real-time invariant mass peak reconstruction, and 100% procedural acoustic sonification into an ultra-responsive client-side application.

