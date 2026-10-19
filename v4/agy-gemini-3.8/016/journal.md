# RELATIVITY-LAB: Engineering & Design Journal

**Experiment**: `016`  
**Focus**: Einsteinian Curved Spacetime, Geodesics, Gravitational Lensing & Kerr Black Hole Studio  
**Date**: October 19, 2026

---

## 1. Design Objectives & Agency Charter
- Deliver an interactive, mathematically rigorous general relativity laboratory exploring Einsteinian curved spacetime metrics, relativistic geodesics, black hole shadows, gravitational wave astrophysics, and spatial curvature embeddings.
- Emphasize deep user agency across 4 distinct domains of relativistic physics:
  1. **Geodesic Orbits**: Timelike and null free-fall trajectories in Schwarzschild, Kerr, and Reissner-Nordström spacetimes with 1PN perihelion precession, frame-dragging acceleration, ISCO, and horizon capture.
  2. **Kerr Shadow & Gravitational Lensing**: Fast relativistic null-geodesic ray-tracing around rotating black holes with Shakura-Sunyaev accretion disks, relativistic Doppler beaming ($\delta^4$), gravitational redshift $g(r)$, and secondary lensed photon rings.
  3. **3.5PN Gravitational Wave Inspiral & Ringdown (IMR)**: Binary black hole orbital radiation reaction, quadrupole strain polarizations $h_+(t)$ and $h_\times(t)$, and remnant Kerr quasi-normal mode (QNM) ringdown damping.
  4. **Spacetime Curvature & Flamm's Embedding**: 2.5D Flamm's paraboloid funnel $z(r) = 2\sqrt{2M(r - 2M)}$ in rotatable 3D isometric projection with real-time Kretschmann curvature scalar $K = 48M^2/r^6$ calculation.
- 100% Procedural Web Audio: Zero audio sample files; real-time procedural synthesis with master dynamics limiting compressor.

---

## 2. Key Engineering Milestones & Architectural Choices

### Milestone 1: 4th-Order Runge-Kutta Geodesic Integrator with Relativistic Precession & Frame Dragging
- Implemented RK4 integration of the relativistic effective radial potential and Lense-Thirring frame-dragging equations.
- Integrated the relativistic correction term $-3 M L^2 / r^4$ into radial acceleration, directly reproducing the anomalous perihelion precession of timelike geodesics ($\Delta\phi = 6\pi GM / (c^2 a(1-e^2))$) and light bending of null geodesics ($\Delta\phi = 4GM / (c^2 b)$).
- Implemented dynamic Bardeen-Press-Teukolsky ISCO and photon sphere boundaries adjusting continuously with dimensionless Kerr spin $a^* \in [-0.99, 0.99]$.
- Added interactive pointer dragging on canvas to aim and launch test particles with arbitrary initial velocity vectors.

### Milestone 2: Fast Relativistic Null-Geodesic Ray Tracer
- Designed a zero-GC $160 \times 120$ ray tracer rendering in real time at 60 FPS and blitted to the primary canvas.
- Computed Kerr asymmetric critical impact parameter $b_{\text{crit}}(\phi)$ accounting for spin-induced horizon silhouette flattening and frame-dragging displacement ($a_{\text{shift}} = 2 a \sin i$).
- Implemented Shakura-Sunyaev thin disk intersections for both direct equatorial sightlines and secondary rays bent around the black hole's rear.
- Modeled relativistic Doppler boosting $\delta = 1 / [\gamma(1 - \beta_\parallel)]$ and gravitational redshift $g = \sqrt{1 - 2M/r}$, scaling observed surface brightness by $(\delta \cdot g)^4$.

### Milestone 3: 3.5PN Post-Newtonian Gravitational Wave Engine
- Solved post-Newtonian quadrupole radiation reaction equations draining orbital separation ($dr/dt \propto -r^{-3}$).
- Computed chirp mass $M_c = (m_1 m_2)^{3/5} / (m_1 + m_2)^{1/5}$ and strain waveforms for both $h_+(t)$ and $h_\times(t)$ polarizations.
- Transitioned dynamically at the ISCO boundary into Echeverria's Kerr quasi-normal mode (QNM) ringdown formula with characteristic frequency $f_{\text{qnm}}$ and exponential damping $\tau_{\text{qnm}}$.
- Provided real-time dual-polarization oscilloscope visualization alongside orbital plane metric perturbation ripples.

### Milestone 4: Flamm's Paraboloid 2.5D Isometric Embedding
- Visualized the spatial geometry of the equatorial Schwarzschild slice embedded into 3D space: $z(r) = -2\sqrt{2M(r - 2M)}$.
- Implemented real-time interactive camera rotations (elevation and azimuth) with projection matrices.
- Rendered concentric coordinate circles and radial geodesics descending down the gravity funnel towards the vertical throat at $r = 2M$.

### Milestone 5: Procedural Sonification & Performance Optimization
- Built procedural Web Audio synthesizer:
  - Gravitational wave chirp frequency sweep tracking $f_{\text{gw}}(t)$ from 30 Hz up to 450 Hz.
  - Sub-bass spacetime curvature drone with harmonic low-pass filter modulated by Kerr frame-dragging spin.
  - Geodesic gravitational potential proximity whistle rising steeply as $r \to 2M$.
- Dynamics compressor limiter prevents digital clipping.
- Simulation stepping is strictly gated by the active `suiteMode`, preventing background CPU waste.
