# Experiment Report: 017 — Relativistic Synchrotron Accelerator & Lorentz Beam Dynamics

## Concept
A high-energy relativistic electrodynamics simulation of a particle storage ring accelerator guiding ten charged particle bunches representing "HELLO WORLD" within an ultra-high vacuum circular beam pipe.
The particles are governed by the relativistic Lorentz force equation:
$$\frac{d\vec{p}}{dt} = q \left(\vec{E}_{\text{RF}}(t) + \vec{v} \times \vec{B}\right), \quad \vec{p} = \gamma m_0 \vec{v}, \quad \gamma = \frac{1}{\sqrt{1 - (v/c)^2}}$$
Equilibrium orbit radius $\rho = \frac{p}{q B_z}$ is maintained by twelve electromagnetic dipole bending magnets with copper coil windings. Alternating-gradient quadrupole focusing induces transverse betatron harmonic oscillations with tune $\nu_x = 2.75$. Two radiofrequency (RF) resonant cavities deliver longitudinal phase-synchronous kicks ($1.20\text{ MV} @ 500\text{ MHz}$), replenishing energy dissipated through tangential synchrotron radiation fans ($P \propto \frac{\gamma^4}{\rho^2}$).

## Web Platform Surface
- **Relativistic Kinematics on Float64Array**:
  - Evaluation of relativistic velocity ratio $\beta = v/c$, Lorentz factor $\gamma \in [2.5, 12.0]$, and relativistic momentum $p = \gamma m_0 v$.
  - Continuous computation of transverse betatron envelope oscillations $x_\beta(s) = A \sin(\nu_x \theta + \delta)$.
- **HTML5 2D Canvas (`CanvasRenderingContext2D`)**:
  - Over 14,000 drawing operations recorded across test frames.
  - Multi-layer visual rendering: circular ultra-high vacuum beam pipe, iron dipole magnet yokes with copper windings, 2 RF accelerating cavity resonator boxes with field glow, 10 relativistic particle bunches with glow envelopes and character inscriptions, tangential synchrotron ultraviolet X-ray extraction cones, and a real-time Beam Position Monitor (BPM) oscilloscope.
- **Pointer Events & Dipole Magnet Vernier Stage**:
  - Interactive pointer drag on the dipole magnetic field slider (`#mag-slider`) modulates $B_z$ from $0.80\text{ T}$ to $2.00\text{ T}$, dynamically shifting beam storage energy from $2.2\text{ GeV}$ to $3.7\text{ GeV}$ and contracting/expanding the closed orbit radius.

## Visual & Design Rationale
- **Palette**: Deep ultra-high vacuum carbon navy (`#020612`, `#060e22`), electromagnetic copper coil orange (`#f97316`, `#ea580c`), Cherenkov electric cyan (`#00f0ff`), and synchrotron ultraviolet photon purple (`#c084fc`).
- **Composition**: Particle accelerator control console with the main synchrotron storage ring on the left and dual instrumentation panels (BPM oscilloscope and FODO magnetic lattice parameters) on the right.
- **Aesthetic**: Authentic modern synchro-light / particle physics facility instrumentation (e.g. ESRF, DESY, CERN), completely distinct from planetary orbits, quantum cryostats, or optical benches.

## Verification Evidence
Verified via `tools.js verify 017/017.dev.html 017`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: Prominently features "Hello World" in header, bunch labels, and console telemetry.
- **Canvas Evidence**:
  - Canvas ID: `synch-canvas` (1060x520 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
- **Technology Measurements**:
  - Initial Dipole Field: $1.350\text{ Tesla}$, modulated to $1.612\text{ Tesla}$ under CDP drag.
  - Initial Beam Energy: $3.03\text{ GeV}$, modulated to $3.42\text{ GeV}$.
  - Lorentz Factor $\gamma$: $7.28 \to 8.01$.
  - Velocity $\beta$: $0.991 \to 0.992$ ($99.2\%$ of light speed).
  - Betatron Tune $\nu_x$: $2.75$.
  - Particle Bunches: 10 (`H-E-L-L-O-W-O-R-L-D`).

## Key Decisions & Trade-offs
1. **Relativistic Velocity Normalization**: Constraining $v < c$ via the Lorentz transformation $\beta = \sqrt{1 - 1/\gamma^2}$ prevents unphysical superluminal velocities and guarantees bounded, stable beam kinematics across all magnetic field settings.
2. **Integrated BPM Oscilloscope**: Rendering the transverse betatron orbit deviation in real time on a grid oscilloscope provides an authentic particle accelerator diagnostics tool.
3. **Tangential Synchrotron Fans**: Projecting tangential ultraviolet light cones outward from the curved beam pipe visually demonstrates classical relativistic electrodynamics and synchrotron radiation generation.

## Moving Frontier Contribution
- **Relativistic Electrodynamics & Accelerator Physics**: Introduced relativistic Lorentz mechanics, betatron oscillations, and synchrotron radiation to the lab.
- **High-Energy Particle Physics Aesthetic**: Established a synchrotron beamline control console design language.
- **Dynamic Relativistic Tuning**: Linked user drag interaction directly to relativistic Lorentz factor and beam energy modulations.
