# Experiment 018 — Research & Candidate Selection

## Context & Frontier Objectives
Experiment 018 advances the Moving Frontier into **Thermodynamics, Statistical Mechanics, and Kinetic Gas Theory**.
Previous experiments addressed relativistic electrodynamics (017), celestial mechanics (016), and quantum states (015). Experiment 018 explores **Microscopic Molecular Collisions, Maxwell-Boltzmann Velocity Distributions, Thermodynamic Piston Expansion, and Irreversible Entropy Generation** across ten thermal chambers encoding "HELLO WORLD".

---

## Candidate 1 (SELECTED): Maxwell-Boltzmann Kinetic Theory, Ideal Gas Expansion & Thermodynamic Entropy
- **Concept**: A precision thermodynamic calorimeter apparatus containing a gas of 450 hard-sphere molecules undergoing continuous elastic kinetic collisions. The gas is partitioned across ten thermal chambers corresponding to the characters of "H", "E", "L", "L", "O", "W", "O", "R", "L", "D".
  The microscopic velocity distribution evolves towards the analytical Maxwell-Boltzmann equilibrium distribution:
  $$f(v) = 4\pi \left(\frac{m}{2\pi k_B T}\right)^{3/2} v^2 \exp\left(-\frac{m v^2}{2 k_B T}\right)$$
  The system computes macroscopic thermodynamic state variables in real time:
  1. Kinetic Temperature: $T = \frac{m \langle v^2 \rangle}{2 k_B}$.
  2. Wall Pressure: $P = \frac{1}{A} \sum \frac{2 m v_{\perp}}{\Delta t}$ (momentum impulse rate per unit perimeter).
  3. Boltzmann Entropy: $S = -k_B \sum p_i \ln p_i$ across discretized velocity microstate bins.
  4. Ideal Gas Law state verification: $P V \approx N k_B T$.
  An interactive movable adiabatic partition piston allows the user to compress or expand the gas, demonstrating work $W = \int P dV$ and irreversible entropy increase $\Delta S = N k_B \ln(V_2 / V_1)$ upon free expansion.
- **Strengths**:
  - Genuinely new mechanism family (Statistical mechanics, molecular kinetics, thermodynamic entropy, Maxwell-Boltzmann distribution).
  - Novel visual identity: Victorian brass thermodynamics laboratory (Lord Kelvin & Ludwig Boltzmann era), mercury U-tube manometers, engraved copper Bourdon dials, and dual-pane kinetic velocity histograms.
  - Interactive thermodynamic piston: Dragging the partition piston compresses the chamber, doing mechanical work $W$ and dynamically raising kinetic temperature $T$ and pressure $P$.
  - Clean analytical mathematics and energy-conserving elastic collision physics.
- **Weaknesses**: Hard-sphere collisions among 450 particles must be resolved efficiently in $O(N)$ using spatial partitioning or fast pairing.

## Candidate 2: Crystallographic Space Groups & Laue X-Ray Bragg Diffraction
- **Concept**: Simulating 2D Bravais lattices and Miller indices $(h, k, l)$ with constructive Bragg diffraction spots ($2d \sin\theta = n\lambda$).
- **Strengths**: Solid-state crystallography.
- **Weaknesses**: Visual diffraction spots share traits with 014's laser interference patterns.

## Candidate 3: Rigid Origami Tessellation & Miura-Ori Auxetic Kinematics
- **Concept**: Deployable origami tessellation folding facets with negative Poisson ratio $\nu_{xy} < 0$.
- **Strengths**: Metamaterial kinematics.
- **Weaknesses**: Mostly static geometry; lower continuous kinetic depth.

---

## Architectural Specification for Candidate 1 (Statistical Mechanics & Entropy)
- **Molecular Ensemble**:
  - $N = 450$ hard-sphere gas molecules with mass $m_0 = 1.0$ and radius $r_0 = 2.4\text{ px}$.
  - Continuous 2D elastic collisions conserving total kinetic energy $E = \sum \frac{1}{2} m v_i^2$ and linear momentum.
- **10 Thermal Chambers ("HELLO WORLD")**:
  - Ten chamber compartments at base temperatures $T_k$, partitioned by permeable microscopic thermal orifices.
- **Thermodynamic Instrumentation**:
  - Dynamic Maxwell-Boltzmann velocity histogram: Bins of molecular speed $v$ compared against the theoretical continuous Maxwell-Boltzmann curve $f(v)$.
  - Mercury U-tube manometer: Height of liquid column $h \propto P$.
  - Entropy meter: Real-time Shannon-Boltzmann entropy $S = -\sum p_i \ln p_i$.
- **Interaction Contract (`window.labScenario`)**:
  - Pointer drag on the compression piston (`#piston-handle`) compressing the volume $V$, raising pressure $P$ and temperature $T$.
- **Evidence Contract (`window.labEvidence`)**:
  - Measures temperature $T$, pressure $P$, total particle count (450), entropy $S$, and ideal gas law ratio $P V / (N k_B T) \approx 1.00$.
