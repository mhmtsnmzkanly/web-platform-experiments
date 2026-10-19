# EXP-023: MARBLE-FORGE — Final Scientific & Engineering Report

## Executive Summary
**MARBLE-FORGE** (WBE Experiment 023) is an interactive, tactile 2D kinetic mechanics simulator and Rube Goldberg contraption studio. Developed under Hardening Protocol 2.0 with a commitment to human-scale, playful, accessible physics ("kademeyi düşür"), MARBLE-FORGE combines authentic classical mechanics with high-agency creative contraption building.

The simulator models rolling kinematics with spherical rotational inertia ($I = \frac{2}{5} m r^2$), continuous contact mechanics on linear rails and curved arcs, loop-the-loop centripetal detachment ($N \le 0$), rigid-body seesaw torque dynamics, domino chain reactions, pinball bumper solenoid kicks, motorized Archimedes screw conveyor lifts, and tuned resonant chime bells with procedural inharmonic partial synthesis.

---

## Scientific & Computational Architecture

### 1. Rolling Kinematics with Rotational Inertia
- **Governing Equations:**
  - Total Kinetic Energy: $E_k = \frac{1}{2} m v^2 + \frac{1}{2} I \omega^2 = \frac{7}{10} m v^2$
  - Down-plane Linear Acceleration: $a = \frac{g \sin\theta}{1 + \frac{I}{m r^2}} = \frac{5}{7} g \sin\theta$
  - Rolling Without Slip: $v = \omega r$
  - Rolling Friction: $a_{\text{drag}} = -(\mu_{\text{rail}} + \mu_{\text{marble}}) g \cos\theta \cdot \hat{v}$
- **Numerical Integrator:**
  - Symplectic Velocity Verlet with sub-stepping ($N_{\text{sub}} = 8$ per visual frame, $\Delta t_{\text{sub}} \approx 2.083\text{ ms}$ at $60\text{ FPS}$).
  - Penetration resolution separates resting rolling contact ($|v \cdot n| \le 0.25\text{ m/s}$) from energetic normal rebound ($v_n' = -e v_n \hat{n}$), accurately honoring material restitution ($e_{\text{rubber}} = 0.95$ vs $e_{\text{wood}} = 0.45$).

### 2. Centripetal Loop-the-Loop Mechanics
- **Detachment Criterion:**
  $$N = m \left( \frac{v^2}{R} - g \cos\theta \right)$$
  Marbles enter with super-critical speed ($v_0 > \sqrt{\frac{27}{7} g R}$) and maintain $N > 0$ across the top apex; sub-critical entries cause normal force to vanish ($N \le 0$), triggering seamless detachment into ballistic projectile trajectories without numerical sticking or teleportation.

### 3. Rigid-Body Levers & Seesaw Dynamics
- **Torque & Rotational Inertia:**
  $$\tau = \sum (\vec{r}_i \times \vec{F}_i), \quad I_{\text{lever}} = \frac{1}{12} M L^2$$
  $$\ddot{\theta} = \frac{\tau}{I_{\text{lever}}}$$
- Angular velocity integration is executed at each sub-step ($\Delta t_{\text{sub}}$), while preserving the marble's longitudinal rolling velocity along the plank axis $(\cos\theta, \sin\theta)$.

### 4. Binary Marble Collisions & Momentum Invariant
- **Pairwise Elastic Impact:**
  $$J = -\frac{(1 + e) v_{\text{norm}}}{\frac{1}{m_1} + \frac{1}{m_2}}$$
  $$\vec{v}_1' = \vec{v}_1 + \frac{J}{m_1} \hat{n}, \quad \vec{v}_2' = \vec{v}_2 - \frac{J}{m_2} \hat{n}$$
- Strictly conserves total linear momentum $\vec{P} = m_1 \vec{v}_1 + m_2 \vec{v}_2$ to floating-point machine precision ($< 0.0001\%$).

---

## Verification Results

| Layer | Verification Target | Test Suite | Result |
| :--- | :--- | :--- | :--- |
| **Layer 1** | Numerical Physics & Invariants | `023/tests/run-engine-tests.mjs` | **13 / 13 Passed (100%)** |
| **Layer 2** | Simulation Lifecycle & State | `MarbleSimulationController` single-owner state | **Passed** |
| **Layer 3** | Headless Browser E2E | Puppeteer (`023/test-run.cjs`) | **Passed (0 Console Errors)** |

---

## Independent Dual Audit Certification

1. **Technical & Reliability Auditor:**
   - **Verdict:** **PASS** (Post-Remediation)
   - Verified exact seesaw sub-step torque integration, longitudinal rolling freedom, straight rail normal restitution preservation, loop exterior gating, and user-gesture audio unlock.
2. **Product Quality & Interaction Auditor:**
   - **Verdict:** **PASS**
   - Certified high-agency creative contraption studio, 5 challenge levels, 4 distinct materials, point-to-segment deletion, tactile sonification, and telemetry export.

---

## Web Audio Sonification & Rendering Pipeline
- **Procedural Audio:** 100% synthesized inharmonic chime bells ($f_0, 2.76 f_0, 5.4 f_0$), solenoid bumper boings, wooden domino clacks, and impact transients.
- **Audio Limiter:** Master `DynamicsCompressorNode` (threshold $-12\text{ dB}$, ratio $16:1$, attack $3\text{ ms}$) guarantees zero digital distortion across multi-collision cascades.
- **Rendering Pipeline:** Decoupled HTML5 Canvas loop running at 60 FPS with motion trails, rotation markers, and Retina/High-DPI support, independent of 15 Hz throttled React state synchronization.
