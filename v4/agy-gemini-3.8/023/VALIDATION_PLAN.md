# VALIDATION PLAN: EXP-023 MARBLE-FORGE

## 1. Overview & Verification Strategy
This document establishes the empirical validation suite and a priori numerical tolerances for MARBLE-FORGE (EXP-023), adhering strictly to Protocol 2.0.

---

## 2. Test Suites & Pass Criteria

### Suite 1: Free Fall & Kinematic Verification (FALL)
- **FALL-01:** Free fall position $y(t) = y_0 + \frac{1}{2} g t^2$.
  - *Tolerance:* Relative error $\le 0.05\%$ after $1.0\text{ s}$ of free fall ($g = 9.81\text{ m/s}^2$).
- **FALL-02:** Projectile parabolic trajectory $x(t) = v_{0x} t, y(t) = y_0 + v_{0y} t + \frac{1}{2} g t^2$.
  - *Tolerance:* Position error $\le 0.02\text{ m}$ ($2\text{ px}$).

### Suite 2: Rolling without Slip on Inclined Plane (ROLL)
- **ROLL-01:** Linear acceleration $a = \frac{5}{7} g \sin\theta$ for a solid spherical marble ($I = \frac{2}{5} m r^2$).
  - *Tolerance:* Measured acceleration vs theoretical $\le 0.1\%$ relative error for $\theta \in [15^\circ, 30^\circ, 45^\circ]$.
- **ROLL-02:** Rolling velocity relationship $v = \omega r$ maintained under rolling friction contact.
  - *Tolerance:* $|\omega - v/r| / (\omega + 10^{-6}) \le 0.5\%$.

### Suite 3: Loop-the-Loop Centripetal Mechanics (LOOP)
- **LOOP-01:** Super-critical entry velocity ($v_0 > v_{\text{crit}} = \sqrt{\frac{27}{7} g R}$): marble completes circular loop with continuous contact ($N > 0$).
  - *Tolerance:* Marble reaches top apex without falling or detaching.
- **LOOP-02:** Sub-critical entry velocity ($v_0 < v_{\text{crit}}$): normal force drops to zero ($N \le 0$) and marble cleanly transitions to free fall before reaching the apex.
  - *Tolerance:* Detachment occurs when normal reaction force vanishes.

### Suite 4: Rigid-Body Levers & Seesaw Statics (LEVER)
- **LEVER-01:** Torque balance for two masses on opposite sides of pivot:
  $$m_1 g d_1 = m_2 g d_2$$
  - *Tolerance:* Angular velocity $|\dot{\theta}| < 10^{-4}\text{ rad/s}$ under exact equilibrium.
- **LEVER-02:** Dynamic toppling: when $m_1 d_1 > m_2 d_2$, lever accelerates towards positive angular bound $\theta_{\max}$ at rate matching $\ddot{\theta} = \frac{\Delta\tau}{I_{\text{lever}}}$.
  - *Tolerance:* Angular acceleration relative error $\le 0.5\%$.

### Suite 5: Collision Mechanics & Conservation Laws (COLL)
- **COLL-01:** Binary elastic marble collision: conservation of linear momentum:
  $$\vec{P}_{\text{after}} = \vec{P}_{\text{before}}$$
  - *Tolerance:* Absolute error $|\vec{P}_{\text{after}} - \vec{P}_{\text{before}}| \le 10^{-6}\text{ kg}\cdot\text{m/s}$.
- **COLL-02:** Restitution verification: coefficient of restitution $e = -v_n' / v_n$ matches material definition ($e_{\text{glass}} = 0.65, e_{\text{steel}} = 0.88, e_{\text{rubber}} = 0.94$).
  - *Tolerance:* Relative error $\le 1.0\%$.

### Suite 6: Lift Transport & Closed Loop Invariance (LIFT)
- **LIFT-01:** Archimedes screw uplifts marble at uniform vertical rate $v_y = f \cdot p_{\text{pitch}}$.
  - *Tolerance:* Velocity deviation $\le 0.5\%$.
- **LIFT-02:** Continuous circulation in Level 5 Perpetual Loop: marble returns to summit without getting stuck or escaping track boundaries.

---

## 3. Summary of Layer 1 Numerical Gate
A standalone test runner `023/tests/run-engine-tests.mjs` will execute these 6 test suites before any UI code is connected. All tests must pass with 100% success rate.
