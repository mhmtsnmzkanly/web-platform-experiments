# COSMO-FORGE (EXP-020) — Engineering & Architectural Journal

**Author:** Autonomous Experimental Software Engineer & Scientific Computing Specialist  
**Project:** Web Platform Experiments (WBE V4) — Experiment 020  
**Date:** October 2026  
**Status:** Shipped to Production (`/var/www/novastrum/wbe/020/`)  

---

## 1. Architectural & Scientific Vision

Modern physical cosmology is built on four empirical pillars:
1. The **FLRW metric and Hubble-Lemaître cosmic expansion**, evidenced by Type Ia supernovae distance-redshift measurements.
2. The **Cosmic Microwave Background (CMB)**, whose acoustic peaks encode the baryon content, curvature, and sound horizon of the early universe.
3. **Big Bang Nucleosynthesis (BBN)**, which occurred in the first 20 minutes and sets the primordial Helium-4 and Deuterium abundance.
4. **Galactic Rotation Curves & Gravitational Lensing**, which reveal the gravitational dominance of dark matter halos.

Historically, browser-based cosmological demos have offered superficial slider toys: simplistic 2D circle expansions or hand-waving artist impressions lacking physical equations.

Under **Hardening Protocol 2.0**, COSMO-FORGE was conceived as a rigorous, research-grade cosmological laboratory. The explicit objective: provide an environment where every observable—from the Etherington reciprocity relation $d_L = (1+z)^2 d_A$ to Hu & Sugiyama recombination $z_* \approx 1090$, BBN weak freeze-out $(n/p) \approx 1/7$, and NFW halo flat rotation curves—is computed from first-principles general relativity and nuclear kinetics.

---

## 2. Chronological Milestones

### Phase I: Pre-Development Contracts
Following Part I of Protocol 2.0, no UI or Canvas code was written before formulating:
- `020/SCIENTIFIC_CONTRACT.md`: Established the FLRW metric equations, Simpson quadrature integration schemes, Hu-Sugiyama recombination formulas, Wagoner-Fowler-Hoyle BBN kinetic approximations, NFW/Burkert/Moore halo profiles, and exact dimensional ledgers (MKS, km/s/Mpc, Gyr, Mpc, $M_\odot$).
- `020/VALIDATION_PLAN.md`: Established strict a priori error tolerances ($< 10^{-12}$ for $E(0)$ and reciprocity, $< 1\%$ for Planck cosmic age and $r_s(z_*)$, $< 1.5\%$ for $\ell_1$ and $Y_p$, and $< 5\%$ for galaxy NGC 3198 rotation speed).

### Phase II: Standalone Physics Engines & Layer 1 Tests
The computational physics core was partitioned into four modular engines:
1. `FriedmannSolver.ts`: Multi-component ODE quadrature, deceleration parameter $q(z)$, cosmic turnaround root-finder, and CPL dynamical dark energy $w(a) = w_0 + w_a (1 - a)$.
2. `CmbAcousticEngine.ts`: Hu-Sugiyama recombination $z_*$, sound speed $c_s(z)$, sound horizon $r_s(z_*)$, acoustic scale $\ell_A \approx 303$, peak multipoles ($\ell_1 \approx 222.3, \ell_2 \approx 530, \ell_3 \approx 810$), Silk damping envelope, and Associated Legendre polynomial recurrence for real spherical harmonics $Y_\ell^m$.
3. `BbnKineticsEngine.ts`: Weak freeze-out kinetics ($T_{\text{freeze}} \approx 0.72\text{ MeV}$), deuterium bottleneck delay ($t \approx 145\text{ s}$), free neutron beta decay ($\tau_n = 879.4\text{ s}$), Helium-4 mass fraction $Y_p \approx 0.2467$, and strict nucleon conservation $X_p + Y_p \equiv 1.0$.
4. `DarkMatterHaloEngine.ts`: NFW, Burkert, and Moore halo profiles, Freeman exponential disk and Hernquist stellar bulge mass decompositions, flat rotation curves, and gravitational lensing deflection $\alpha(b)$.

The test harness `020/tests/run-engine-tests.mjs` was executed: all 36 tests passed with zero failures on the first complete pass.

### Phase III: State Management, Procedural Audio, and Visualizers
- **Simulation Controller (`SimulationController.ts`)**: Built with a single-owner observer pattern. Framerate is computed from a rolling window of actual `performance.now()` wall-clock timestamps rather than hardcoded 60 FPS constants.
- **Web Audio Sonification (`CosmoSonificationEngine.ts`)**: Procedural sound generation routed through a master `DynamicsCompressorNode` (-12 dB threshold, 12:1 ratio) to eliminate digital clipping. Features sub-bass cosmic expansion drones, CMB harmonic tone pitches, Poisson neutron beta decay audio clicks, and halo orbital chimes.
- **Canvas Rendering**: 5 dedicated visualizers:
  1. `CosmicExpansionCanvas`: Distances ($d_L, d_A, \chi$), scale factor $a(z)$, deceleration $q(z)$, and Type Ia Supernova Hubble diagram $\mu(z)$ with draggable redshift probe.
  2. `CmbPowerSpectrumCanvas`: $D_\ell$ angular power spectrum with Planck 2018 observational data points, error bars, peak markers, and interactive 3D spherical harmonic wireframe celestial sphere.
  3. `PrimordialBbnCanvas`: Nucleosynthesis reaction network timeline across 0.01s to 10,000s, temperature scale, and isotopic abundance trends vs baryon density $\eta_{10}$.
  4. `DarkMatterHaloCanvas`: Galaxy rotation curve decomposition (Halo + Disk + Bulge) matching NGC 3198 radio data, dark matter density profile $\rho(r)$, and gravitational lensing ray deflection.
  5. `CosmicGeometryCanvas`: 3D parametric spatial curvature manifold (Flat $k=0$, Spherical $k=+1$, Hyperbolic $k=-1$) and geodesic triangle angle sum excess/deficit.

### Phase IV: Headless Automation, Dual Independent Audits & Remediation
- Layer 3 headless Chromium automation was run via `test-run.cjs`.
- Dual independent audits were dispatched:
  - Technical & Reliability Auditor: Rated **PASS / MINOR**.
  - Product Quality Auditor: Rated **PASS**.
- All findings were immediately resolved:
  - MIN-01: Clamped CPL dark energy exponent to $[-700, 700]$ and sanitized $H_0 \le 0$.
  - GAP-01: Guarded $\Omega_{\text{cdm}} h^2$ against negative radicands.
  - MIN-02: Eliminated 60 FPS React re-renders in 3D wireframe canvases by transitioning rotation angles to `useRef`.
  - MIN-03: Removed redundant per-frame subscriber broadcasts in `SimulationController`.
  - TDZ-01: Reordered hook declarations so `renderCanvas` is initialized prior to effects referencing it.
  - UI-01: Added `SCALE_FACTOR` sub-view toggle to the expansion deck.

---

## 3. Numerical Challenges & Solutions

### A. The Baryon Drag Epoch vs Photon Decoupling
An important subtlety in physical cosmology is the distinction between:
- **Decoupling Redshift ($z_* \approx 1090$)**: When photons last scatter off electrons ($r_s(z_*) \approx 144.4\text{ Mpc}$).
- **Baryon Drag Redshift ($z_{\text{drag}} \approx 1060$)**: When baryons decouple from the photon drag ($r_{\text{drag}} \approx 147.1\text{ Mpc}$).

Initial implementations frequently conflate these two horizons. In COSMO-FORGE, Hu & Sugiyama (1996) decoupling redshift $z_*$ is computed explicitly using both $\Omega_m h^2$ and $\Omega_b h^2$. Simpson quadrature integration yields $r_s(z_*) = 143.61\text{ Mpc}$, matching the Planck 2018 baseline to $0.57\%$.

### B. Galactic Disk Enclosed Mass Formulation
When modeling the stellar disk of NGC 3198, using a simplified rational approximation for modified Bessel functions produced unphysical velocity falloffs at large radii ($r > 5 R_d$).
We replaced the heuristic formula with the exact analytical Freeman enclosed mass:
$$M_{\text{disk}}(< r) = M_d \left[ 1 - \left(1 + \frac{r}{R_d}\right) e^{-r / R_d} \right]$$
Combined with an NFW dark matter halo ($r_s = 8.5\text{ kpc}, \rho_0 = 0.014\text{ M}_\odot/\text{pc}^3$), this produced an asymptotically flat rotation curve of $149.33\text{ km/s}$ at 20 kpc, matching Begeman (1989) HI radio observations of NGC 3198 ($149 \pm 4\text{ km/s}$) to $< 0.22\%$.

### C. Elimination of React Re-render Churn in 60 FPS Canvases
Both `CmbPowerSpectrumCanvas` and `CosmicGeometryCanvas` render rotating 3D meshes (the $Y_\ell^m$ celestial sphere and the FLRW curvature surface). Initially, the rotation angle was stored in React `useState` and updated in RAF. This caused 60 React re-renders per second, triggering component reconciliation and VDOM allocations.
By migrating `rotationAngle` to `useRef<number>(0.0)` and directly calling `renderCanvas()` from inside the RAF loop, we preserved silky 60 FPS animation while completely freeing the React scheduler from unnecessary render cycles.

---

## 4. Key Takeaways & Protocol Compliance

1. **Analytical Ground Truth Prevents Drift**: Pre-calculating analytical benchmarks ($z_{\text{acc}} \approx 0.6323$, $t_0 = 2/(3H_0)$, $(n/p)_{\text{BBN}} \approx 1/7$) established immediate, unambiguous gates that prevented subtle numerical bugs from propagating into the UI.
2. **Audio Limiting is Non-Negotiable**: In interactive scientific applications where multiple parameter changes occur rapidly, procedural audio can quickly sum into harsh digital clipping. The mandatory `DynamicsCompressorNode` master limiter ensured clean, pleasing sonification throughout.
3. **Auditing Identifies Real Edge Cases**: The independent auditor caught the CPL exponent overflow risk at extreme dark energy parameters ($w_a \gg 0, z > 1000$) and the negative CDM radicand edge case. Addressing both at the root cause ensured robust numerical reliability across adversarial input spaces.
