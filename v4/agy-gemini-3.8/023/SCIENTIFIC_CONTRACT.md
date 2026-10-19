# SCIENTIFIC & TECHNICAL CONTRACT: EXP-023 MARBLE-FORGE

## 1. Executive Specification & Scientific Phenomenon
**MARBLE-FORGE** is an interactive, tactile 2D kinetic mechanics and Rube Goldberg contraption simulator. It models the rolling kinematics, continuous collision dynamics, rigid-body torque mechanics, and energy exchange of spherical marbles traversing modular mechanical elements.

---

## 2. Governing Equations & Physical Principles

### 2.1 Rolling Kinematics & Inclined Plane Dynamics
A solid spherical marble of mass $m$, radius $r$, and moment of inertia $I = \frac{2}{5} m r^2$ rolling without slip down a planar rail inclined at angle $\theta$:
- Total Kinetic Energy:
  $$E_k = \frac{1}{2} m v^2 + \frac{1}{2} I \omega^2 = \frac{1}{2} m v^2 + \frac{1}{2} \left(\frac{2}{5} m r^2\right) \left(\frac{v}{r}\right)^2 = \frac{7}{10} m v^2$$
- Linear Acceleration along the incline:
  $$a = \frac{g \sin\theta}{1 + \frac{I}{m r^2}} = \frac{5}{7} g \sin\theta$$
- Rolling Friction Retardation:
  $$a_{\text{drag}} = -\mu_r g \cos\theta \cdot \hat{v}$$

### 2.2 Loop-the-Loop Centripetal Mechanics
For a circular vertical loop of radius $R$:
- At the top apex ($h = 2R$), normal force $N \ge 0$ is required for contact:
  $$\frac{m v_{\text{top}}^2}{R} = N + m g \implies v_{\text{top}} \ge \sqrt{g R}$$
- By conservation of mechanical energy from initial entry velocity $v_0$ at the base:
  $$\frac{7}{10} m v_0^2 = \frac{7}{10} m v_{\text{top}}^2 + m g (2R)$$
  $$v_0^2 \ge g R + \frac{20}{7} g R = \frac{27}{7} g R \approx 3.857 g R \quad (\text{rolling sphere})$$
  $$(v_0 \ge \sqrt{5 g R} \approx 2.236 \sqrt{g R} \text{ for frictionless point mass})$$
- If $v < v_{\text{crit}}$, normal force drops to zero ($N \le 0$) and the marble detaches in free projectile flight.

### 2.3 Rigid-Body Levers & Seesaw Rotational Dynamics
For a rigid lever pivoted at anchor $(x_p, y_p)$ with rotational inertia $I_{\text{lever}} = \frac{1}{12} M L^2$:
- Equation of Angular Motion:
  $$I_{\text{lever}} \frac{d^2\theta}{dt^2} = \sum \tau - \gamma \frac{d\theta}{dt}$$
- Net Torque:
  $$\sum \tau = \tau_{\text{grav}} + \sum_{i} (\vec{r}_i \times \vec{F}_i) \cdot \hat{z}$$
- Rest angular bounds: $\theta \in [\theta_{\min}, \theta_{\max}]$ with inelastic limit stops ($e_{\text{stop}} \in [0.1, 0.3]$).

### 2.4 Domino Chain Kinematics
- Dominos of height $H$, width $W$, and mass $m_d$ spaced at pitch $d < H$:
- Tipping criterion: center of mass displaced past base edge ($\Delta \theta > \arctan(W/H)$).
- Toppling transfer: angular impact onto next domino imparts angular momentum $L_{k+1} = e_d L_k + \tau_g \Delta t$.

### 2.5 Collision Resolution & Impulse
- For marble-rail, marble-marble, and marble-bumper collisions:
  $$\vec{v}_{\text{rel}} = \vec{v}_1 - \vec{v}_2$$
  $$v_n = \vec{v}_{\text{rel}} \cdot \hat{n}$$
  If $v_n < 0$ (approaching):
  $$J = -\frac{(1 + e) v_n}{\frac{1}{m_1} + \frac{1}{m_2}}$$
  $$\vec{v}_1' = \vec{v}_1 + \frac{J}{m_1} \hat{n}, \quad \vec{v}_2' = \vec{v}_2 - \frac{J}{m_2} \hat{n}$$
- Restitution Coefficients:
  - Steel / Steel: $e = 0.88$
  - Glass / Wood: $e = 0.65$
  - Superball / Rigid: $e = 0.94$
  - Pinball Bumper: $e = 1.35$ (active solenoid kick adding $\Delta v_{\text{kick}} = 2.5\text{ m/s}$).

### 2.6 Archimedes Screw / Motorized Lift
- Helical screw rotating at constant angular speed $\Omega = 2\pi f$:
- Vertical transport velocity:
  $$v_y = f \cdot p_{\text{pitch}}$$
- Uplifts marbles to top chute, preserving continuous recirculation.

---

## 3. Dimensional Analysis & Unit Ledger

| Quantity | Symbol | Internal Unit | Standard MKS Unit | Conversion |
| :--- | :--- | :--- | :--- | :--- |
| Length | $x, y, r, R$ | meters ($\text{m}$) | $\text{m}$ | $1.0\text{ m} \leftrightarrow 100\text{ canvas px}$ |
| Time | $t, \Delta t$ | seconds ($\text{s}$) | $\text{s}$ | $1.0\text{ s}$ |
| Mass | $m$ | kilograms ($\text{kg}$) | $\text{kg}$ | Glass: $0.02\text{ kg}$, Steel: $0.065\text{ kg}$ |
| Velocity | $v_x, v_y$ | $\text{m/s}$ | $\text{m/s}$ | $1\text{ m/s} = 100\text{ px/s}$ |
| Acceleration | $g, a$ | $\text{m/s}^2$ | $\text{m/s}^2$ | Standard $g = 9.81\text{ m/s}^2$ |
| Torque | $\tau$ | $\text{N}\cdot\text{m}$ | $\text{N}\cdot\text{m}$ | $1\text{ N}\cdot\text{m} = 1\text{ kg}\cdot\text{m}^2/\text{s}^2$ |
| Energy | $E$ | Joules ($\text{J}$) | $\text{J}$ | $1\text{ J} = 1\text{ kg}\cdot\text{m}^2/\text{s}^2$ |

---

## 4. Numerical Integrator & Stability Bounds
- **Integrator:** Symplectic Velocity Verlet with sub-stepping ($N_{\text{sub}} = 8$ per visual frame at $60\text{ FPS} \implies \Delta t_{\text{sub}} = \frac{1}{480}\text{ s} \approx 2.083\text{ ms}$).
  $$\vec{x}(t + \Delta t) = \vec{x}(t) + \vec{v}(t)\Delta t + \frac{1}{2}\vec{a}(t)\Delta t^2$$
  $$\vec{a}(t + \Delta t) = \frac{\sum \vec{F}(t + \Delta t)}{m}$$
  $$\vec{v}(t + \Delta t) = \vec{v}(t) + \frac{1}{2}\left(\vec{a}(t) + \vec{a}(t + \Delta t)\right)\Delta t$$
- **CFL Position Shift Limit:** Maximum velocity clamp $v_{\max} = 25.0\text{ m/s} \implies \Delta x_{\max} = v_{\max} \Delta t_{\text{sub}} \approx 0.052\text{ m} < 2 r_{\min}$, preventing high-speed tunneling through thin track rails.

---

## 5. Invariants & Conservation Guarantees
1. **Mechanical Energy Invariant:** In a closed conservative loop (zero friction, $e = 1.0$), total energy $E = E_k + E_p$ is conserved to $< 0.05\%$ relative drift over 1000 cycles.
2. **Momentum Balance:** Binary elastic marble collisions conserve total linear momentum $\vec{P} = m_1 \vec{v}_1 + m_2 \vec{v}_2$ to floating-point machine precision.
3. **Torque Balance:** Stationary lever in static equilibrium satisfies $\sum \tau = 0$ exactly.
4. **Finite State Assurance:** All state values ($x, y, v_x, v_y, \omega, \theta$) are guarded against NaN and Infinity.
