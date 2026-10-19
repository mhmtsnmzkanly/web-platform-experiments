# SCIENTIFIC CONTRACT: EXP-025 (ORBITAL-SLINGSHOT)

**Experiment:** EXP-025 ORBITAL-SLINGSHOT — Astrodynamical Trajectory & Gravity Assist Puzzle Studio  
**Version:** 1.0 — Post-Audit Hardening Protocol 2.0 Standard  
**Fidelity Classification:** LEVEL A / B (Reference-Validated Astrodynamics & Bounded N-body Numerical Mechanics)  

---

## 1. Physical Phenomenon & Governing Equations

### 1.1 Gravitational Point-Mass Interactions (Newton's Universal Gravitation)
The gravitational acceleration experienced by a spacecraft or celestial body of mass $m_i$ due to $N$ celestial bodies is:
$$\vec{a}_i = \frac{d^2 \vec{r}_i}{dt^2} = \sum_{j \ne i}^N \frac{G M_j}{|\vec{r}_j - \vec{r}_i|^3} (\vec{r}_j - \vec{r}_i)$$
where:
- $G = 6.67430 \times 10^{-11}\text{ m}^3\text{ kg}^{-1}\text{ s}^{-2}$ (or scaled gravitational constant in orbital normalized units $\mu = G M$).
- $\vec{r}_i$ is the position vector of entity $i$.
- $M_j$ is the mass of celestial primary $j$.

For spacecraft dynamics where $m_{\text{probe}} \ll M_{\text{body}}$, the spacecraft moves as a test mass in the gravitational potential created by the primaries without exerting back-reaction on planetary orbits.

### 1.2 Vis-Viva Equation & Specific Mechanical Energy
In the two-body central force problem ($\mu = G M$):
$$\varepsilon = \frac{v^2}{2} - \frac{\mu}{r} = -\frac{\mu}{2a}$$
where:
- $\varepsilon$ is specific mechanical orbital energy ($\text{J/kg} = \text{m}^2/\text{s}^2$).
- $v = |\vec{v}|$ is orbital speed ($\text{m/s}$).
- $r = |\vec{r}|$ is distance from the barycentric primary ($\text{m}$).
- $a$ is the semi-major axis ($\text{m}$).
  - $a > 0, \varepsilon < 0$: Bound elliptic orbit ($e < 1$).
  - $\varepsilon = 0, a \to \infty$: Parabolic escape trajectory ($e = 1$).
  - $a < 0, \varepsilon > 0$: Unbound hyperbolic flyby ($e > 1$).

### 1.3 Conic Section State & Keplerian Orbital Elements
From the instantaneous Cartesian state $(\vec{r}, \vec{v})$:
1. **Specific Relative Angular Momentum Vector:**
   $$\vec{h} = \vec{r} \times \vec{v}$$
   Magnitude $h = |\vec{h}| = r v \sin\gamma$.
2. **Eccentricity Vector:**
   $$\vec{e} = \frac{\vec{v} \times \vec{h}}{\mu} - \frac{\vec{r}}{r}$$
   Orbital eccentricity is scalar magnitude $e = |\vec{e}|$.
3. **Periapsis and Apoapsis Distances:**
   $$r_p = a(1 - e) = \frac{h^2}{\mu(1 + e)}$$
   $$r_a = a(1 + e) \quad (\text{for bound orbits } e < 1)$$
4. **Orbital Period (Kepler's 3rd Law):**
   $$T = 2\pi \sqrt{\frac{a^3}{\mu}}$$

### 1.4 Hohmann Transfer Orbit & Delta-V Impulses
Between two coplanar circular orbits of radii $r_1$ and $r_2$ ($r_1 < r_2$):
1. **Transfer Semi-major Axis:**
   $$a_{\text{trans}} = \frac{r_1 + r_2}{2}$$
2. **Departure Delta-V ($\Delta v_1$ at Periapsis of Transfer):**
   $$\Delta v_1 = \sqrt{\frac{\mu}{r_1}} \left( \sqrt{\frac{2 r_2}{r_1 + r_2}} - 1 \right)$$
3. **Arrival Circularization Delta-V ($\Delta v_2$ at Apoapsis of Transfer):**
   $$\Delta v_2 = \sqrt{\frac{\mu}{r_2}} \left( 1 - \sqrt{\frac{2 r_1}{r_1 + r_2}} \right)$$
4. **Transfer Time (Half Orbital Period):**
   $$t_{\text{trans}} = \pi \sqrt{\frac{a_{\text{trans}}^3}{\mu}}$$

### 1.5 Planetary Gravity Assist (Hyperbolic Flyby / Slingshot)
In the rest frame of a planet moving with heliocentric velocity $\vec{V}_p$:
1. The probe enters with asymptotic excess hyperbolic speed:
   $$\vec{v}_{\infty,\text{in}} = \vec{v}_{\text{in}} - \vec{V}_p, \quad v_\infty = |\vec{v}_{\infty,\text{in}}|$$
2. Energy conservation in the planet's frame ensures $|\vec{v}_{\infty,\text{out}}| = |\vec{v}_{\infty,\text{in}}| = v_\infty$.
3. **Turning / Deflection Angle $\delta$:**
   $$\sin\left(\frac{\delta}{2}\right) = \frac{1}{1 + \frac{r_p v_\infty^2}{\mu_p}} \implies \delta = 2 \arcsin\left(\frac{1}{1 + \frac{r_p v_\infty^2}{\mu_p}}\right)$$
   where $r_p$ is periapsis flyby altitude.
4. **Heliocentric Velocity Transformation:**
   $$\vec{v}_{\text{out}} = \vec{V}_p + \vec{v}_{\infty,\text{out}}$$
   The change in heliocentric kinetic energy is:
   $$\Delta \varepsilon_{\text{helio}} = \vec{V}_p \cdot (\vec{v}_{\infty,\text{out}} - \vec{v}_{\infty,\text{in}})$$
   Passing behind the trailing hemisphere of the planet increases heliocentric speed ($\Delta v > 0$); passing ahead of the leading hemisphere decreases heliocentric speed ($\Delta v < 0$).

### 1.6 Laplace Sphere of Influence (SOI)
The boundary where planetary gravitational perturbation dominates over the central Sun:
$$r_{\text{SOI}} \approx R_{\text{orbit}} \left( \frac{M_{\text{planet}}}{M_{\text{sun}}} \right)^{2/5}$$

### 1.7 Circular Restricted Three-Body Problem (CR3BP) & Lagrange Points
In the rotating synodic reference frame with angular velocity $\Omega$:
$$\Phi_{\text{eff}}(x, y) = -\frac{\mu_1}{r_1} - \frac{\mu_2}{r_2} - \frac{1}{2} \Omega^2 (x^2 + y^2)$$
Equilibrium points $\nabla \Phi_{\text{eff}} = 0$ yield the 5 Lagrange points ($L_1, L_2, L_3$ collinear saddle points; $L_4, L_5$ stable equilateral vertices forming equilateral triangles with the primaries).

### 1.8 Tsiolkovsky Rocket Equation & Delta-V Budget
$$\Delta v_{\text{burn}} = I_{\text{sp}} g_0 \ln\left( \frac{m_0}{m_f} \right)$$
Spacecraft have a finite $\Delta v$ propellant reserve. Maneuver nodes consume budget $\Delta v = \sqrt{\Delta v_{\text{prograde}}^2 + \Delta v_{\text{radial}}^2}$.

---

## 2. State Vector & Dimensional Conventions

| Variable | Symbol | Internal Units | Display Units | Physical Range |
| :--- | :--- | :--- | :--- | :--- |
| Spacecraft Position | $\vec{r}$ | normalized $\text{AU}$ ($1.0 = 1.496\times 10^{11}\text{ m}$) | $\text{AU}$ or $\text{km}$ | $[0.05, 50.0]$ |
| Spacecraft Velocity | $\vec{v}$ | normalized $\text{AU/yr}$ ($2\pi \approx 29.78\text{ km/s}$) | $\text{km/s}$ | $[0.0, 100.0]$ |
| Planetary Mass | $M$ | Solar Mass fraction $M_\odot = 1.0$ | $M_\oplus$ or $M_\odot$ | $[10^{-7}, 1.0]$ |
| Specific Energy | $\varepsilon$ | $(\text{AU/yr})^2$ | $\text{MJ/kg}$ | $(-\infty, +\infty)$ |
| Specific Angular Momentum | $h$ | $\text{AU}^2/\text{yr}$ | $\text{km}^2/\text{s}$ | $[0, 100.0]$ |
| Orbital Period | $T$ | years ($\text{yr}$) | days / years | $[0.01, 100.0]$ |
| Propellant Budget | $\Delta V$ | $\text{km/s}$ | $\text{km/s}$ or $\text{m/s}$ | $[0.0, 12.0]$ |

---

## 3. Numerical Integration Scheme

### 3.1 4th-Order Symplectic Runge-Kutta / Symplectic Velocity Verlet
- **Integrator:** 4th-Order Symplectic Runge-Kutta (Forest-Ruth / Yoshida) or Adaptive Sub-stepped Velocity Verlet.
- **Sub-stepping:** $N_{\text{sub}} = 10$ sub-steps per frame, with adaptive step refinement near planetary close-approach ($r < 3 r_p$).
- **Singularity Regularization:** Gravitational softening parameter $\epsilon = 10^{-4}\text{ AU}$ prevents numerical division by zero on direct planetary center penetration.
- **Crash Detection:** If $r < R_{\text{planet}}$, impact event is triggered.

---

## 4. Conservation Laws & Invariants

1. **Specific Energy Conservation:**
   In an isolated unperturbed 2-body Keplerian orbit, specific mechanical energy $\varepsilon = \frac{v^2}{2} - \frac{\mu}{r}$ must remain constant:
   $$\left|\frac{\varepsilon(t) - \varepsilon(0)}{\varepsilon(0)}\right| \le 10^{-5}$$
2. **Specific Angular Momentum Conservation:**
   $$\left|\frac{h(t) - h(0)}{h(0)}\right| \le 10^{-5}$$
3. **Kepler's Third Law Invariant:**
   $$\frac{T^2}{a^3} = \frac{4\pi^2}{G M} \equiv \text{constant}$$
4. **Barycentric Momentum Balance:**
   Planetary gravity assists preserve total system momentum and energy.

---

## 5. Supported Parameter Ranges & Limiting Behavior

1. **Circular Orbit ($e = 0$):**
   Speed $v = \sqrt{\frac{\mu}{r}}$ remains perfectly constant. Distance $r(t) = r_0$ for all $t$.
2. **Radial Drop ($h \to 0$):**
   Free-fall into primary along a straight line in time $t_{\text{fall}} = \frac{\pi}{2\sqrt{2}} \sqrt{\frac{r_0^3}{\mu}}$.
3. **Parabolic Escape ($e \to 1.0$):**
   $v = \sqrt{\frac{2\mu}{r}}$, trajectory is an open parabola.
4. **Hyperbolic Deflection:**
   As $r \to \infty$, $v \to v_\infty = \sqrt{v_0^2 - \frac{2\mu}{r_0}}$.

---

## 6. Curated Mission Scenarios

1. **LUNAR-INSERTION (Moonshot):**
   Depart circular Low Earth Orbit ($r = 1.0$), burn prograde $\Delta v$, execute Lunar flyby, and circularize into Low Lunar Orbit.
2. **GRAND-TOUR (Voyager Slingshot):**
   Launch from Earth to Jupiter, execute trailing-side gravity assist to boost apoapsis to Saturn's orbit with zero intermediate propellant!
3. **HOHMANN-MARS (Interplanetary Transfer):**
   Calculate exact Hohmann departure velocity to reach Mars ($r_2 = 1.524\text{ AU}$), arrive at periapsis of Mars, and brake into orbit.
4. **TROJAN-PARKING (Lagrange $L_4$ Insertion):**
   Maneuver a probe into the gravitational sweet spot at $60^\circ$ ahead of Jupiter in its orbit ($L_4$ equilibrium libration).
5. **ASTEROID-DEFLECTION (Planetary Slingshot):**
   Intercept a threatening inbound asteroid using an Earth-assist gravity pump to alter the asteroid's orbital period and miss the planet.
