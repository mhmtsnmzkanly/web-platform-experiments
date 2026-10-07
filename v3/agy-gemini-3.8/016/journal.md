# Experiment 016 — Research & Candidate Selection

## Context & Frontier Objectives
Experiment 016 advances the Moving Frontier into **Celestial Mechanics, Symplectic Hamiltonian Dynamics, and Gravitational Multi-Body Resonance**.
Previous experiments established quantum Hilbert space operators (015), coherent wave optics (014), and biological slime mold networks (013). Experiment 016 explores **Conservative Hamiltonian Systems, Symplectic Störmer-Verlet Integration, Keplerian Orbital Elements, and Mean-Motion Resonance** governing a resonant planetary system carrying the characters of "HELLO WORLD".

---

## Candidate 1 (SELECTED): Symplectic Celestial N-Body Orbital Mechanics & Gravitational Resonance
- **Concept**: A precision celestial mechanical system where a central star is orbited by ten resonant celestial bodies corresponding to "H", "E", "L", "L", "O", "W", "O", "R", "L", "D". The equations of motion:
  $$\frac{d\vec{r}_i}{dt} = \vec{v}_i, \quad \frac{d\vec{v}_i}{dt} = -\frac{GM}{r_i^3} \vec{r}_i + \sum_{j \neq i} \frac{Gm_j}{\|\vec{r}_j - \vec{r}_i\|^3} (\vec{r}_j - \vec{r}_i)$$
  are integrated via a 2nd-order Symplectic Leapfrog (Störmer-Verlet) integrator, strictly conserving total mechanical energy $E = T + U$ and total orbital angular momentum $L = \sum m_i (\vec{r}_i \times \vec{v}_i)$ without secular numerical drift.
  The 10 bodies are locked in harmonic mean-motion orbital resonance ratios ($1:2:3:4\dots$). Orbital telemetry continuously traces Keplerian orbital elements (semimajor axis $a$, orbital eccentricity $e$, true anomaly $\nu$, orbital period $T = 2\pi\sqrt{a^3/GM}$), sweeping equal areas in equal times (Kepler's Second Law).
  Five gravitational Lagrange libration points ($L_1, L_2, L_3, L_4, L_5$) and Jacobi energy zero-velocity curves are computed and visualized.
- **Strengths**:
  - Genuinely new mechanism family (Symplectic Hamiltonian mechanics, Keplerian orbital dynamics, gravitational resonances).
  - Astronomical observatory aesthetic: Deep midnight celestial charts, fine engraved golden orbit ellipses, periapsis/apoapsis apsidal vectors, sweep area sectors, and celestial chronometer ticks.
  - Interactive gravitational perturbation: Dragging a gravitational perturber probe alters planetary eccentricities, causing osculating orbits and precession.
  - Clean physics: True symplectic integration guarantees energy conservation error $|\Delta E / E_0| < 10^{-4}$.
- **Weaknesses**: Orbital speeds vary widely across radii ($v \propto r^{-1/2}$); must maintain numerical stability during close periapsis passages.

## Candidate 2: Lattice Boltzmann Hydrodynamics & Kármán Vortex Street
- **Concept**: D2Q9 Lattice Boltzmann BGK collision-streaming solver simulating viscous fluid flowing past "HELLO WORLD" bluff bodies, shedding periodic vortices.
- **Strengths**: Classical computational fluid dynamics.
- **Weaknesses**: Grid-based fluid mechanics shares visual and structural similarities with 003 and 010.

## Candidate 3: Miura-Ori Deployable Origami Kinematics
- **Concept**: Deployable origami tessellation with rigid facet kinematics and dihedral folding angle degrees of freedom.
- **Strengths**: Geometric space engineering.
- **Weaknesses**: Motion is primarily 1D parametric scale; less dynamical variation.

---

## Architectural Specification for Candidate 1 (Celestial Symplectic Mechanics)
- **Gravitational System**:
  - Central Star mass $M_0 = 10,000$, gravitational constant $G = 1.0$.
  - 10 planetary bodies representing the letters of "HELLO WORLD" at harmonic radii $r_k \in [65, 360]\text{ px}$.
  - Harmonic resonance period ratios yielding synchronized celestial alignments.
- **Symplectic Störmer-Verlet Integrator**:
  - Kick-Drift-Kick formulation:
    $$\vec{v}(t + \Delta t/2) = \vec{v}(t) + \frac{1}{2} \vec{a}(t) \Delta t$$
    $$\vec{r}(t + \Delta t) = \vec{r}(t) + \vec{v}(t + \Delta t/2) \Delta t$$
    $$\vec{v}(t + \Delta t) = \vec{v}(t + \Delta t/2) + \frac{1}{2} \vec{a}(t + \Delta t) \Delta t$$
- **Keplerian Orbital Telemetry**:
  - Semimajor axis $a_k$, eccentricity $e_k$, orbital energy $E = \frac{1}{2}v^2 - \frac{GM}{r}$.
  - Real-time Keplerian area sweep sector visualization demonstrating $\frac{dA}{dt} = \frac{L}{2m} = \text{const}$.
  - Lagrange points $L_1-L_5$ calculated for the primary inner-outer binary pair.
- **Interaction Contract (`window.labScenario`)**:
  - Pointer drag perturbing an orbital mass, altering osculating eccentricity and argument of periapsis.
- **Evidence Contract (`window.labEvidence`)**:
  - Measures total system energy conservation $|\Delta E / E_0|$, angular momentum $L$, active body count (10), and resonance stability index.
