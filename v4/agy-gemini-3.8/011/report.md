# Experiment 011: AERO-TUNNEL — 2D Lattice Boltzmann Wind Tunnel & Airfoil Flight Dynamics Studio

## Executive Summary
**AERO-TUNNEL** is a browser-based computational fluid dynamics (CFD) wind tunnel and aerodynamic flight testbed powered by the Lattice Boltzmann Method (D2Q9 BGK formulation). Running on a $220 \times 90$ lattice grid at 60 FPS, the simulation computes exact fluid velocity, pressure, and vorticity fields around aerodynamic obstacles, integrating aerodynamic Lift ($C_L$), Drag ($C_D$), and Lift-to-Drag ratio ($L/D$) via momentum exchange.

The studio incorporates parametric NACA 4-digit airfoil geometry generation, real-time chord pressure distribution plots $C_p(x)$, aerodynamic polar diagrams ($C_L$ vs $\alpha$, $C_L$ vs $C_D$), smoke streamline tracer particle injection, an interactive glider flight dynamics simulator, and 100% procedural Web Audio aerodynamic sonification.

---

## 1. Mathematical & Aerodynamic Foundation

### 1.1 D2Q9 Lattice Boltzmann Method (BGK Formulation)
Fluid state is governed by 9 discrete velocity distribution functions $f_i(\vec{x}, t)$ along lattice directions $\vec{c}_i$:
$$\vec{c}_0 = (0,0), \quad \vec{c}_{1..4} = (\pm 1, 0), (0, \pm 1), \quad \vec{c}_{5..8} = (\pm 1, \pm 1)$$

Macroscopic density $\rho$ and flow velocity $\vec{u}$ are derived as:
$$\rho = \sum_{i=0}^8 f_i, \quad \rho \vec{u} = \sum_{i=0}^8 f_i \vec{c}_i$$

The BGK collision relaxation towards Maxwellian equilibrium distribution $f_i^{eq}$ is:
$$f_i^*(\vec{x}, t) = f_i(\vec{x}, t) - \frac{1}{\tau} \left[ f_i(\vec{x}, t) - f_i^{eq}(\vec{x}, t) \right]$$
where:
$$f_i^{eq} = \rho w_i \left[ 1 + \frac{3(\vec{c}_i \cdot \vec{u})}{c^2} + \frac{9(\vec{c}_i \cdot \vec{u})^2}{2c^4} - \frac{3|\vec{u}|^2}{2c^2} \right]$$
with weights $w_0 = 4/9$, $w_{1..4} = 1/9$, $w_{5..8} = 1/36$.

Kinematic viscosity $\nu$ and Reynolds number $Re$ are defined as:
$$\nu = \frac{1}{3}\left(\tau - \frac{1}{2}\right), \quad Re = \frac{U_\infty c}{\nu}$$

### 1.2 Momentum Exchange Aerodynamic Force Integration
Aerodynamic forces acting on the solid body are calculated by summing the momentum transfer of distribution functions bouncing back across solid-fluid interface links:
$$\vec{F} = \sum_{\vec{x}_b} \sum_{i} \vec{c}_i \left[ f_i^*(\vec{x}_f, t) + f_{\bar{i}}(\vec{x}_f, t+\Delta t) \right]$$
This yields total Lift $L = -F_y$ and Drag $D = F_x$, non-dimensionalized as:
$$C_L = \frac{L}{\frac{1}{2}\rho_\infty U_\infty^2 c}, \quad C_D = \frac{D}{\frac{1}{2}\rho_\infty U_\infty^2 c}$$

### 1.3 Parametric NACA 4-Digit Equations
Given max camber $m$, camber position $p$, and thickness $t$:
- Mean camber line $y_c(x)$:
  $$y_c(x) = \begin{cases} \frac{m}{p^2}(2px - x^2) & 0 \le x < p \\ \frac{m}{(1-p)^2}((1-2p) + 2px - x^2) & p \le x \le 1 \end{cases}$$
- Thickness distribution $y_t(x)$:
  $$y_t(x) = 5t (0.2969\sqrt{x} - 0.1260x - 0.3516x^2 + 0.2843x^3 - 0.1036x^4)$$

---

## 2. Curated Aerodynamic Profiles

1. **NACA 0012 (Symmetric)**: Benchmark aerobatic profile with linear lift slope $dC_L/d\alpha \approx 2\pi$ and zero pitching moment.
2. **NACA 2412 (General Aviation)**: Cessna 172 wing section with mild 2% camber and gentle stall characteristics.
3. **NACA 4415 (High Lift / STOL)**: Thick 15% section with 4% camber, delaying boundary layer separation.
4. **NACA 6409 (Thin Cambered Glider)**: High undercambered airfoil optimized for low Reynolds numbers.
5. **Circular Cylinder (Kármán Vortex Street)**: Classic bluff body producing periodic alternating vortex shedding at Strouhal number $St \approx 0.20$.
6. **Flat Plate**: Displays leading-edge separation bubble and stall hysteresis.
7. **Supersonic Wedge (Diamond Airfoil)**: Demonstrates sharp leading-edge stagnation and expansion fans.

---

## 3. Interactive Systems

- **Multi-Colormap Viewports**: Real-time rendering of Velocity magnitude (Turbo), Pressure deviation (Cool-to-warm isobar), and Vorticity (Bipolar Cyan-Black-Red).
- **Smoke Streamline Particle Injector**: Continuous tracer particles advecting with local velocity $\vec{u}(x, y)$ via bilinear interpolation.
- **Glider Flight Test Mode**: Interactive simulation allowing users to pilot a glider through the wind tunnel, experiencing stalls, ground effect, and lift-to-drag glide optimization.
- **Chord Pressure Distribution**: Dynamic SVG plot of upper surface suction loop vs lower surface pressure.
- **Polar Curve Tracker**: Real-time accumulation of operating points $(\alpha, C_L, C_D)$.
- **Procedural Web Audio Sonification**: Zero external assets; boundary layer shear hiss, vortex shedding Strouhal hum, and stall buffet rumble.

---

## 4. Verification Suite Results

Automated headless integration tests (`test-run.cjs`) verified:
- ✅ Wind tunnel canvas rendering verified
- ✅ All 7 aerodynamic presets loaded and simulated correctly
- ✅ All 4 visualization modes toggled smoothly
- ✅ Angle of attack continuous slider adjustment verified
- ✅ Glider flight dynamics simulation HUD verified
- ✅ Aerodynamic telemetry data export modal (CSV & JSON) verified
- ✅ 0 console errors, 0 digital clipping
