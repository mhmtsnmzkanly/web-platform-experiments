# Experiment 017 — Research & Candidate Selection

## Context & Frontier Objectives
Experiment 017 advances the Moving Frontier into **Relativistic Electrodynamics, Lorentz Force Trajectories, and Synchrotron Accelerator Beam Optics**.
Previous experiments addressed gravitational mechanics (016), quantum information (015), and wave diffraction (014). Experiment 017 explores **Relativistic Lorentz Dynamics, Magnetic Dipole Bending, Radiofrequency Cavity Acceleration, and Betatron Transverse Oscillations** circulating 10 relativistic particle bunches encoding "HELLO WORLD" within a circular synchrotron storage ring.

---

## Candidate 1 (SELECTED): Relativistic Synchrotron Accelerator, Lorentz Force Beam Dynamics & Betatron Oscillations
- **Concept**: A high-energy particle storage ring accelerator where ten charged particle bunches representing "H", "E", "L", "L", "O", "W", "O", "R", "L", "D" circulate in an ultra-high vacuum beam pipe under the relativistic Lorentz force:
  $$\frac{d\vec{p}}{dt} = q \left(\vec{E}_{\text{RF}}(t) + \vec{v} \times \vec{B}\right), \quad \vec{p} = \gamma m_0 \vec{v}, \quad \gamma = \frac{1}{\sqrt{1 - (v/c)^2}}$$
  The magnetic lattice consists of:
  1. Dipole bending magnets maintaining a circular orbit of radius $\rho = \frac{p}{q B}$.
  2. Quadrupole focusing magnets (FODO cell lattice) providing alternating-gradient strong focusing and transverse betatron harmonic oscillations:
     $$\frac{d^2 x}{ds^2} + K(s) x = 0$$
  3. Radiofrequency (RF) accelerating cavities delivering phase-locked kicks $\Delta E = q V_{\text{RF}} \sin(\omega_{\text{RF}} t + \phi_s)$, compensating for relativistic synchrotron radiation loss $P_{\text{syn}} = \frac{q^2 c}{6\pi \epsilon_0} \frac{\gamma^4}{\rho^2}$.
- **Strengths**:
  - Genuinely new mechanism family (Relativistic electrodynamics, Lorentz force, accelerator physics, betatron beam stability).
  - Novel visual identity: High-energy particle physics beamline, ultra-high vacuum chamber, copper quadrupole magnet yokes, synchrotron tangential radiation fans, and Cherenkov electric blue glow.
  - Interactive beam tuning: Pointer drag modulates magnetic dipole field $B$ and RF cavity phase, altering beam revolution frequency $f_{\text{rev}}$ and relativistic Lorentz factor $\gamma$.
  - Clean relativistic mathematics, zero external dependencies.
- **Weaknesses**: Must calculate relativistic gamma factors $\gamma$ and betatron envelopes without numerical instability at high velocities ($v \to c$).

## Candidate 2: Maxwell-Boltzmann Kinetic Theory & Thermodynamic Piston Entropy
- **Concept**: A statistical mechanical system simulating 1,000 gas atoms partitioned across 10 temperature/pressure cells of "HELLO WORLD" with Maxwell-Boltzmann velocity distributions and adiabatic piston compression.
- **Strengths**: Classical thermodynamics and statistical entropy $S = k_B \sum p_i \ln p_i$.
- **Weaknesses**: Particulate collision visual language overlaps somewhat with 002/010.

## Candidate 3: Deployable Origami Kinematics & Miura-Ori Auxetic Metamaterial
- **Concept**: A 3D deployable origami tessellation folding and expanding the letters of "HELLO WORLD" via coupled dihedral crease angles.
- **Strengths**: Rigid-foldable geometric metamaterials.
- **Weaknesses**: Motion is primarily 1D parametric scale; lower dynamic physical variety.

---

## Architectural Specification for Candidate 1 (Synchrotron Beam Dynamics)
- **Accelerator Machine Parameters**:
  - Storage ring circumference: $2\pi R$ with nominal radius $R_0 = 180\text{ px}$.
  - Relativistic speed of light normalized constant $c = 300\text{ px/s}$.
  - Nominal beam energy $\gamma \in [1.2, 5.0]$, velocity $v = c \sqrt{1 - 1/\gamma^2}$.
  - Dipole magnetic field $B_z$ tuned to maintain closed circular orbit: $B_z = \frac{\gamma m_0 v}{q R_0}$.
- **10-Bunch Typographic Beam ("HELLO WORLD")**:
  - Ten discrete charged particle bunches circulating in synchronous RF buckets with harmonic number $h = 10$.
  - Betatron transverse oscillations around central orbit: $x_\beta(s) = \sqrt{\epsilon \beta(s)} \cos(\nu \theta + \delta)$.
  - Synchrotron light emission: Tangential radiant photons emitted along the velocity vector $\vec{v}$ of each bunch.
- **Diagnostics & Instrumentation**:
  - Beam Position Monitor (BPM) display showing transverse orbit deviations $\Delta x$.
  - Relativistic Lorentz factor $\gamma$ and beam energy $E = \gamma m c^2$.
  - RF cavity phase lock indicator.
- **Interaction Contract (`window.labScenario`)**:
  - Pointer drag on the RF phase dial / dipole magnetic tuning slider adjusting magnetic field and beam orbital radius.
- **Evidence Contract (`window.labEvidence`)**:
  - Measures beam relativistic factor $\gamma$, revolution frequency $f_{\text{rev}}$, betatron tune $\nu_x$, synchrotron radiation power, and active bunch count (10).
