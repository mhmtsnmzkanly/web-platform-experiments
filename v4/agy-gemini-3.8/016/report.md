# RELATIVITY-LAB: Einsteinian Curved Spacetime, Geodesics, Gravitational Lensing & Kerr Black Hole Studio
**Technical Architecture & Physical Systems Report**  
*Experiment 016 — Autonomous Web Platform Experiment*

---

## 1. Executive Summary

**RELATIVITY-LAB** is an interactive, browser-based computational laboratory simulating Einstein's General Relativity, curved spacetime metrics, timelike and null geodesics, relativistic ray-tracing around spinning Kerr black holes, gravitational lensing of Shakura-Sunyaev accretion disks with relativistic Doppler beaming ($\delta^4$), 3.5PN post-Newtonian gravitational wave inspiral and quasi-normal mode (QNM) ringdown waveforms, and Flamm's paraboloid 2.5D curvature embeddings.

The studio integrates:
1. A **4th-order Runge-Kutta Geodesic Integrator** in Schwarzschild, Kerr, and Reissner-Nordström spacetimes, modeling relativistic perihelion precession ($\Delta \phi = 6\pi GM / (c^2 a(1-e^2))$), Innermost Stable Circular Orbits (ISCO), photon spheres, horizon capture, and Kerr Lense-Thirring frame-dragging accelerations.
2. A **Relativistic Null-Geodesic Ray Tracer** ($160 \times 120$ internal resolution blitted at 60 FPS), simulating asymmetric Kerr shadow deformation, Shakura-Sunyaev geometrically thin accretion disks, relativistic Doppler boosting $(I_{\text{obs}} \propto (\delta \cdot g)^4)$, gravitational redshift $g(r) = \sqrt{1 - 2M/r}$, and secondary lensed photon rings bent over the black hole.
3. A **3.5PN Post-Newtonian Gravitational Wave Inspiral, Merger & Ringdown (IMR) Engine**, modeling binary black hole orbital decay via Einstein's quadrupole formula ($dE/dt \propto M_c^{10/3} \omega^{10/3}$), strain polarizations $h_+(t)$ and $h_\times(t)$, and remnant Kerr quasi-normal mode (QNM) ringdown damping.
4. A **2.5D Flamm's Paraboloid Spacetime Embedding Engine**, rendering the equatorial spatial slice $z(r) = 2\sqrt{2M(r - 2M)}$ in rotatable isometric projection with real-time Kretschmann curvature scalar $K = 48 M^2 / r^6$ calculations.
5. An **Interactive 60 FPS zero-GC HTML5 Canvas Visualizer** featuring directional velocity vector drag-and-launch, rotatable camera angles, letterbox-compensated coordinate mapping, and dual-polarization strain oscilloscopes.
6. A **100% procedural Web Audio relativity sonification engine** generating Doppler whistlers, metric curvature sub-bass drones, and 30–450 Hz gravitational wave chirp sweeps with dynamics compressor limiting.

---

## 2. Theoretical Foundations & Mathematical Formulations

### 2.1 General Relativistic Geodesics & Effective Potentials
In curved spacetime governed by metric $g_{\mu\nu}$, free-falling test particles follow the geodesic equation:
$$\frac{d^2 x^\mu}{d\lambda^2} + \Gamma^\mu_{\alpha\beta} \frac{dx^\alpha}{d\lambda} \frac{dx^\beta}{d\lambda} = 0$$
where $\Gamma^\mu_{\alpha\beta} = \frac{1}{2} g^{\mu\sigma} (\partial_\alpha g_{\beta\sigma} + \partial_\beta g_{\alpha\sigma} - \partial_\sigma g_{\alpha\beta})$ are the Christoffel connection coefficients.

In equatorial Schwarzschild coordinates ($ds^2 = -(1 - 2M/r) dt^2 + (1 - 2M/r)^{-1} dr^2 + r^2 d\phi^2$), the radial motion for a particle with specific energy $E$ and specific angular momentum $L$ obeys:
$$\frac{1}{2}\left(\frac{dr}{d\tau}\right)^2 + V_{\text{eff}}(r) = \frac{1}{2}(E^2 - 1)$$
where the relativistic effective potential is:
$$V_{\text{eff}}(r) = -\frac{M}{r} + \frac{L^2}{2r^2} - \frac{M L^2}{r^3}$$
- The first term represents classical Newtonian gravity.
- The second term represents the classical centrifugal barrier.
- The third term ($-\frac{M L^2}{r^3}$) is the general relativistic correction that eliminates the centrifugal barrier at small radii, driving horizon plunge and producing perihelion precession:
$$\Delta\phi = \frac{6\pi G M}{c^2 a (1 - e^2)} \quad \text{radians per orbit}$$

For circular orbits ($dV_{\text{eff}}/dr = 0, d^2V_{\text{eff}}/dr^2 = 0$):
- **Photon Sphere**: $r_{\text{ph}} = 3M$ (unstable circular photon orbit).
- **Innermost Stable Circular Orbit (ISCO)**: $r_{\text{ISCO}} = 6M$. Inside $r < 6M$, no stable circular orbits exist; all matter dynamically plunges into the horizon.

### 2.2 Kerr Spacetime & Frame Dragging
For a rotating black hole of mass $M$ and angular momentum $J$, the dimensionless spin parameter is $a^* = a/M = J/(M^2 c) \in [-1, 1]$. In Boyer-Lindquist coordinates:
$$ds^2 = -\left(1 - \frac{2Mr}{\rho^2}\right) dt^2 - \frac{4Mar\sin^2\theta}{\rho^2} dt d\phi + \frac{\rho^2}{\Delta} dr^2 + \rho^2 d\theta^2 + \left(r^2 + a^2 + \frac{2Ma^2r\sin^2\theta}{\rho^2}\right)\sin^2\theta d\phi^2$$
where $\rho^2 = r^2 + a^2 \cos^2\theta$ and $\Delta = r^2 - 2Mr + a^2$.

Key geometric surfaces:
1. **Outer Event Horizon ($r_+$)**: $\Delta = 0 \implies r_+ = M + \sqrt{M^2 - a^2}$.
2. **Inner Cauchy Horizon ($r_-$)**: $r_- = M - \sqrt{M^2 - a^2}$.
3. **Ergosphere ($r_{\text{ergo}}(\theta)$)**: $g_{tt} = 0 \implies r_{\text{ergo}}(\theta) = M + \sqrt{M^2 - a^2 \cos^2\theta}$.
Inside the ergosphere ($r_+ < r < r_{\text{ergo}}$), the asymptotic timelike Killing vector $\partial_t$ becomes spacelike: no physical object can remain stationary relative to infinity. Matter is forcibly dragged into corotation with frame-dragging angular velocity:
$$\omega(r, \theta) = -\frac{g_{t\phi}}{g_{\phi\phi}} = \frac{2Mar}{(r^2 + a^2)\rho^2 + 2Ma^2r\sin^2\theta}$$
This enables the **Penrose Process**: energy extraction from the black hole's rotational energy by injecting particles that split into negative-energy geodesics inside the ergosphere.

Bardeen-Press-Teukolsky formula for Kerr equatorial ISCO:
$$Z_1 = 1 + (1 - a^2/M^2)^{1/3} \left[(1 + a/M)^{1/3} + (1 - a/M)^{1/3}\right]$$
$$Z_2 = \sqrt{3 a^2/M^2 + Z_1^2}$$
$$r_{\text{ISCO}} = M \left[ 3 + Z_2 \mp \sqrt{(3 - Z_1)(3 + Z_1 + 2 Z_2)} \right]$$
For extreme prograde Kerr ($a \to M$), $r_{\text{ISCO}} \to M$ and the accretion radiative efficiency jumps from 5.7% (Schwarzschild) to 42.3%.

### 2.3 Relativistic Null-Geodesic Ray Tracing & Accretion Lensing
Null geodesics ($ds^2 = 0$) traversing the accretion disk undergo:
1. **Light Deflection**: Ray bending in Schwarzschild/Kerr geometry:
$$\alpha(b) \approx \frac{4M}{b} + \frac{15\pi M^2}{4b^2}$$
where $b$ is the impact parameter. Rays passing within $b < 3\sqrt{3}M$ are captured by the black hole, creating the central shadow.
2. **Relativistic Doppler Beaming**:
For gas orbiting at Keplerian velocity $v_K = \sqrt{M/r}$, the Doppler boost factor is:
$$\delta = \frac{1}{\gamma (1 - \beta_\parallel)}, \quad \gamma = \frac{1}{\sqrt{1 - v_K^2/c^2}}$$
3. **Gravitational Redshift**:
$$g = \frac{\nu_{\text{obs}}}{\nu_{\text{emit}}} = \sqrt{1 - \frac{2M}{r}}$$
4. **Observed Specific Intensity**:
By Liouville's theorem for photon phase space density ($I_\nu / \nu^3 = \text{const}$), the bolometric observed surface brightness is:
$$I_{\text{obs}} = I_{\text{emit}} \cdot (\delta \cdot g)^4$$
This creates the characteristic asymmetric accretion crescent: the approaching side is orders of magnitude brighter and blue-shifted, while the receding side is dimmed and gravitationally red-shifted.

### 2.4 3.5PN Post-Newtonian Gravitational Wave Inspiral (IMR)
In a binary black hole system with masses $m_1, m_2$ and total mass $M = m_1 + m_2$, the chirp mass is:
$$M_c = \frac{(m_1 m_2)^{3/5}}{(m_1 + m_2)^{1/5}}$$
Gravitational wave emission carries away orbital energy according to the quadrupole formula:
$$\frac{dE}{dt} = -\frac{32}{5} \frac{G}{c^5} M_c^{10/3} \omega^{10/3}$$
Leading to orbital decay:
$$\frac{dr}{dt} = -\frac{64}{5} \frac{G^3 M^2 \eta}{c^5 r^3}$$
where $\eta = m_1 m_2 / M^2$ is the symmetric mass ratio.

The gravitational wave strain for an observer at luminosity distance $D_L$ with inclination $\iota$ is:
$$h_+(t) = \frac{4 G M_c}{c^2 D_L} \left( \frac{\pi G M_c f_{\text{gw}}}{c^3} \right)^{2/3} \frac{1 + \cos^2\iota}{2} \cos(2\phi(t))$$
$$h_\times(t) = \frac{4 G M_c}{c^2 D_L} \left( \frac{\pi G M_c f_{\text{gw}}}{c^3} \right)^{2/3} \cos\iota \sin(2\phi(t))$$
Following merger at the ISCO separation ($r \le 6M$), the newly formed Kerr black hole settles into equilibrium via Quasi-Normal Mode (QNM) ringdown:
$$h_{\text{ring}}(t) = h_{\text{peak}} e^{-(t - t_{\text{merg}})/\tau_{\text{qnm}}} \cos(2\pi f_{\text{qnm}} (t - t_{\text{merg}}))$$
where the $l=2, m=2$ fundamental quasinormal frequency obeys Echeverria's formula:
$$f_{\text{qnm}} \approx \frac{c^3}{2\pi G M} \left[ 1 - 0.63(1 - a^*)^{0.3} \right], \quad \tau_{\text{qnm}} \approx \frac{4}{2\pi f_{\text{qnm}}} (1 - a^*)^{-0.45}$$

### 2.5 Flamm's Paraboloid Curvature Embedding
The spatial metric of the Schwarzschild equatorial plane ($t = \text{const}, \theta = \pi/2$) is:
$$d\sigma^2 = \frac{dr^2}{1 - 2M/r} + r^2 d\phi^2$$
Embedding this 2D Riemannian manifold into 3D Euclidean space with cylindrical coordinates $(r, \phi, z)$ gives:
$$d\sigma^2 = dr^2 + dz^2 + r^2 d\phi^2 = \left[1 + \left(\frac{dz}{dr}\right)^2\right] dr^2 + r^2 d\phi^2$$
Equating coefficients yields:
$$\frac{dz}{dr} = \frac{1}{\sqrt{\frac{r}{2M} - 1}} \implies z(r) = 2 \sqrt{2M(r - 2M)}$$
At the horizon ($r \to 2M$), $dz/dr \to \infty$, forming a vertical throat.

The Kretschmann scalar invariant measures true coordinate-independent gravitational tidal curvature:
$$K = R^{\alpha\beta\gamma\delta} R_{\alpha\beta\gamma\delta} = \frac{48 G^2 M^2}{c^4 r^6}$$
At the horizon $r=2M$, $K = 3/4 M^4$, which remains finite, proving that the event horizon is a coordinate singularity, whereas at $r=0$, $K \to \infty$, confirming a physical curvature singularity.

---

## 3. Architecture & Implementation

```
016/
├── index.html                   # HTML5 Entry with custom g_uv SVG favicon
├── vite.config.ts               # Vite bundler configuration
├── package.json                 # Project manifest
├── test-run.cjs                 # Headless Puppeteer test suite (Port 8196)
├── verification.json            # Automated verification test run outputs
├── report.md                    # Technical Architecture & Systems Report
├── journal.md                   # Chronological engineering log
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── index.css                # Tailwind CSS root stylesheet
    ├── types/
    │   └── index.ts             # TypeScript definitions for metrics, presets, & engines
    ├── relativity/
    │   ├── GeodesicIntegrator.ts     # RK4 Geodesic orbital solver with Lense-Thirring & ISCO
    │   ├── RelativisticRayTracer.ts  # 160x120 Null-geodesic ray tracer with (delta*g)^4 beaming
    │   ├── GravitationalWaveEngine.ts# 3.5PN IMR binary waveform generator & QNM ringdown
    │   └── RelativityPresets.ts      # 6 curated general relativity scenarios
    ├── audio/
    │   └── RelativitySonificationEngine.ts # 100% procedural Web Audio sound synthesizer
    └── components/
        ├── Header.tsx                # Suite mode tabs, preset selector, audio & export controls
        ├── RelativityCanvas.tsx      # 60 FPS HTML5 canvas visualizer with zero-GC pipeline
        ├── RelativityControlDeck.tsx # 4-mode lower parameter adjustment dock
        └── DataExportModal.tsx       # JSON and CSV telemetry export modal
```

---

## 4. Curated Scenarios & Scientific Insights

| Preset | Metric | Spin $a^*$ | Inclination | Key Relativistic Phenomenon |
|---|---|---|---|---|
| **Kerr Super-Spinning** | Kerr | $0.94$ | $78^\circ$ | Extreme frame-dragging, asymmetric shadow silhouette, $(\delta \cdot g)^4$ Doppler beaming crescent |
| **Schwarzschild Einstein Ring** | Schwarzschild | $0.00$ | $12^\circ$ | Axisymmetric deflection, photon sphere at $3M$, concentric secondary lensed Einstein rings |
| **Mercury Perihelion Precession** | Schwarzschild | $0.00$ | $45^\circ$ | Orbital rosette orbit demonstrating $1\text{PN}$ anomalous orbital perihelion advance |
| **Binary BH Merger (GW150914)** | Kerr Remnant | $0.70$ | $60^\circ$ | $36 + 29 M_\odot$ binary inspiral, ISCO plunge, and $250\text{ Hz}$ QNM ringdown waveform |
| **Penrose Energy Extraction** | Kerr | $0.98$ | $80^\circ$ | Ergosphere dragging ($r_+ < r < 2M$), negative-energy particle capture, super-energetic ejection |
| **Curvature & Flamm Embedding** | RN / Schw | $0.50$ | $55^\circ$ | 2.5D Flamm's paraboloid funnel $z(r) = 2\sqrt{2M(r - 2M)}$ and Kretschmann curvature scalar |

---

## 5. Verification & Performance Diagnostics

The automated headless browser verification suite (`016/test-run.cjs`) verified:
- **Zero console errors & zero uncaught exceptions** across all operations.
- **Full suite mode transitions**: All 4 modes (`GEODESIC_ORBITS`, `KERR_SHADOW_LENS`, `GRAVITATIONAL_WAVES`, `SPACETIME_EMBEDDING`) initialized and rendered without drops.
- **All 6 presets functional**: Parametric states cleanly reconfigured physics parameters and camera geometries.
- **Interactive particle launcher**: Velocity vector drag-and-launch spawned geodesics accurately.
- **Sonification system**: Dynamics compressor limiting prevented audio clipping across mode sweeps.
- **Export modal**: Generated valid JSON and CSV datasets.
- **Sustained frame rate**: Maintained 60 FPS under continuous relativistic ray-tracing and RK4 integration.
