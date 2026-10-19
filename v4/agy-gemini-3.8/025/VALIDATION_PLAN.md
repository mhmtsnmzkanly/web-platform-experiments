# VALIDATION PLAN: EXP-025 (ORBITAL-SLINGSHOT)

**Experiment:** EXP-025 ORBITAL-SLINGSHOT — Astrodynamical Trajectory & Gravity Assist Puzzle Studio  
**Standard:** Hardening Protocol 2.0 (Mandatory A Priori Tolerances)  

---

## 1. Test Matrix & Acceptance Criteria

### Suite 1: Keplerian Two-Body Kinematics & Conservation (KEPLER)
- **KEPLER-01: Circular Orbit Speed & Period:**
  A spacecraft in circular orbit at radius $r = 1.0\text{ AU}$ around a solar-mass primary ($\mu = 4\pi^2$) must maintain constant distance $|r(t) - 1.0| < 0.005\text{ AU}$ and complete an orbit in $T = 1.000\text{ yr} \pm 0.005\text{ yr}$.
  *A Priori Tolerance:* $\le 0.5\%$.
- **KEPLER-02: Specific Orbital Energy Conservation:**
  Over 5 complete orbits of an eccentric ellipse ($e = 0.5, a = 1.0\text{ AU}$), relative energy drift $\left|\frac{\varepsilon(t) - \varepsilon(0)}{\varepsilon(0)}\right|$ must not exceed $0.05\%$.
  *A Priori Tolerance:* $\le 0.05\%$.
- **KEPLER-03: Specific Angular Momentum Invariant:**
  Over 5 complete eccentric orbits, specific angular momentum drift $\left|\frac{h(t) - h(0)}{h(0)}\right|$ must not exceed $0.05\%$.
  *A Priori Tolerance:* $\le 0.05\%$.
- **KEPLER-04: Vis-Viva Velocity Prediction:**
  At periapsis $r_p = a(1-e)$ and apoapsis $r_a = a(1+e)$, numerical speeds must match analytical vis-viva values $v = \sqrt{\mu(2/r - 1/a)}$ within $0.1\%$.
  *A Priori Tolerance:* $\le 0.1\%$.

### Suite 2: Hohmann Transfer Mechanics (HOHMANN)
- **HOHMANN-01: First Burn Departure Velocity $\Delta v_1$:**
  Analytical impulse $\Delta v_1 = \sqrt{\mu/r_1} (\sqrt{2r_2/(r_1+r_2)} - 1)$ for $r_1 = 1.0\text{ AU}$ to $r_2 = 1.524\text{ AU}$ (Earth to Mars) equals $2.945\text{ km/s}$ ($0.622\text{ AU/yr}$). The resulting transfer orbit's apoapsis must match $1.524\text{ AU} \pm 0.01\text{ AU}$.
  *A Priori Tolerance:* $\le 0.8\%$.
- **HOHMANN-02: Transfer Time (Half-Period):**
  Transfer time must match $t = \pi \sqrt{a_{\text{trans}}^3 / \mu} = 0.7088\text{ yr}$ ($258.9\text{ days}$) within $0.5\%$.
  *A Priori Tolerance:* $\le 0.5\%$.
- **HOHMANN-03: Circularization Burn $\Delta v_2$:**
  Applying second impulse $\Delta v_2 = \sqrt{\mu/r_2}(1 - \sqrt{2r_1/(r_1+r_2)})$ at apoapsis circularizes the orbit with eccentricity $e < 0.01$.
  *A Priori Tolerance:* $e \le 0.01$.

### Suite 3: Planetary Gravity Assist & Slingshot Dynamics (SLING)
- **SLING-01: Asymptotic Hyperbolic Speed Invariance (Planet Frame):**
  During a close hyperbolic flyby of a moving planet, the asymptotic inbound relative speed must equal the outbound relative speed:
  $$\left|\frac{|\vec{v}_{\text{rel,out}}| - |\vec{v}_{\text{rel,in}}|}{|\vec{v}_{\text{rel,in}}|}\right| < 0.05\%$$
  *A Priori Tolerance:* $\le 0.05\%$.
- **SLING-02: Heliocentric Energy Boost (Trailing Flyby):**
  Passing behind the trailing hemisphere of a planet moving with velocity $\vec{V}_p$ must result in a net increase in heliocentric kinetic energy and semi-major axis ($\Delta a_{\text{helio}} > 0$).
  *A Priori Tolerance:* Positive heliocentric energy gain verified ($\Delta \varepsilon > 0$).
- **SLING-03: Heliocentric Energy Reduction (Leading Flyby):**
  Passing ahead of the leading hemisphere must result in a net decrease in heliocentric orbital energy and semi-major axis ($\Delta a_{\text{helio}} < 0$).
  *A Priori Tolerance:* Negative heliocentric energy loss verified ($\Delta \varepsilon < 0$).

### Suite 4: Sphere of Influence & Restricted Three-Body Mechanics (SOI)
- **SOI-01: Laplace Sphere of Influence Radius:**
  For Earth mass ($3.0 \times 10^{-6} M_\odot$) at $1.0\text{ AU}$, $r_{\text{SOI}} \approx 0.0062\text{ AU} \approx 925,000\text{ km}$. The engine's SOI transition detector must trigger within $1\%$ of the analytical boundary.
  *A Priori Tolerance:* $\le 1.0\%$.
- **SOI-02: Lagrange $L_4$ Equilibrium Stability:**
  A test particle placed at the $L_4$ equilateral point ($60^\circ$ ahead of Jupiter in circular orbit) must remain bounded in stable tadpole libration over multiple orbital periods without ejection.
  *A Priori Tolerance:* Distance from $L_4$ remains bounded $< 0.1\text{ AU}$ over 3 Jovian years.

### Suite 5: Rocket Propellant Budget & Maneuver Node Lifecycle (MANEUVER)
- **MANEUVER-01: Impulse Vector Addition & Delta-V Accounting:**
  Executing an impulsive burn of $(\Delta v_x, \Delta v_y)$ must update spacecraft velocity by exactly $(\Delta v_x, \Delta v_y)$ and deduct $\sqrt{\Delta v_x^2 + \Delta v_y^2}$ from the propellant budget to machine precision ($0.000\%$).
  *A Priori Tolerance:* $\le 0.001\%$.
- **MANEUVER-02: Projected Conic Section Intersection:**
  The maneuver node projected trajectory accurately predicts future periapsis altitude matching the integrated simulation trajectory within $1.0\%$.
  *A Priori Tolerance:* $\le 1.0\%$.
- **MANEUVER-03: Scenario Definition Validity:**
  All 5 curated mission scenarios instantiate with non-empty planetary systems, positive propellant budgets, valid initial orbits, and distinct mission objectives.
  *A Priori Tolerance:* Boolean pass.

---

## 2. Test Execution Protocol

- Standalone test harness: `025/tests/run-engine-tests.mjs`
- Target: 100% test pass rate (15 / 15 tests) before UI integration.
