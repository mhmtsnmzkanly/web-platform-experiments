# Experiment 012: OPTICA-FORGE — Physical Wave Optics, Holographic Interference & Thin-Film Studio

## Executive Summary
**OPTICA-FORGE** is a browser-based physical wave optics, interferometry, digital holography, and thin-film spectral engineering laboratory. Running on a $280 \times 140$ optical lattice at a steady 60 FPS, the engine simulates scalar monochromatic electromagnetic wave propagation $E(\vec{x}, t) \in \mathbb{C}$, wave interference, diffraction, optical cavity resonance, and 2x2 Transfer Matrix Method (TMM) multi-layer thin-film coatings.

The laboratory delivers four comprehensive optical instrument suites with real-time acoustic sonification, dynamic SVG cross-section analyzers, visible spectrum plots $R(\lambda)$ and $T(\lambda)$, and multi-format scientific telemetry export (CSV and JSON).

---

## 1. Physical Optics & Mathematical Foundations

### 1.1 Scalar Diffraction & Huygens-Fresnel Integral
The downstream optical field $E(x, y)$ emitted from an arbitrary aperture mask $A(x', y')$ illuminated by a coherent laser source is computed via scalar diffraction theory:
$$E(x, y) = \frac{-i}{\lambda} \iint_{\text{aperture}} E(x', y') \frac{e^{i k r}}{r} K(\theta) \, dx' dy'$$
where:
- $\lambda$ is the laser wavelength (400 nm to 700 nm),
- $k = \frac{2\pi}{\lambda}$ is the angular optical wavenumber,
- $r = \sqrt{z^2 + (y - y')^2 + (x - x')^2}$ is the Euclidean optical path distance,
- $K(\theta) = \frac{1 + \cos\theta}{2}$ is the obliquity inclination factor.

The observable optical irradiance (intensity) $I(x, y)$ is given by the squared magnitude of the complex field:
$$I(x, y) = |E(x, y)|^2 = \text{Re}\{E\}^2 + \text{Im}\{E\}^2$$
with instantaneous wavefront phase:
$$\phi(x, y) = \text{atan2}\left(\text{Im}\{E\}, \, \text{Re}\{E\}\right) \in [-\pi, +\pi]$$

### 1.2 Multi-Beam Interferometry & Resonant Cavities

#### Michelson Interferometer
Interference between the reference arm $L_1$ and scanning test arm $L_2$ generates spatial and temporal fringes:
$$I(r, \theta) = I_1 + I_2 + 2\sqrt{I_1 I_2} \, \gamma(\Delta L) \cos\left(2k\Delta L + k y \sin\theta_{\text{tilt}} + \frac{k r^2}{2f}\right)$$
where:
- $\Delta L = |L_1 - L_2| + \Delta L_{\text{piezo}}$ is the optical path difference (OPD),
- $\gamma(\Delta L) = \exp\left(-\left(\frac{\Delta L}{L_c}\right)^2\right)$ models temporal coherence decay as a function of laser coherence length $L_c$,
- $\theta_{\text{tilt}}$ introduces linear Fizeau carrier fringes.

#### Mach-Zehnder Refractometer
A test sample of physical thickness $L_s$ and refractive index $n_s$ placed into one arm induces an exact optical phase delay:
$$\Delta\phi = \frac{2\pi}{\lambda} (n_s - 1) L_s$$
enabling precision optical refractometry with sub-wavelength fringe displacement.

#### Fabry-Pérot Resonant Cavity
Multi-beam back-and-forth reflections within two parallel dielectric mirrors of power reflectivity $R$ produce high-contrast resonant transmission described by the Airy function:
$$I_T = \frac{I_0}{1 + F \sin^2(\delta / 2)}$$
where:
- $F = \frac{4R}{(1 - R)^2}$ is the coefficient of finesse,
- $\mathcal{F} = \frac{\pi \sqrt{R}}{1 - R}$ is the cavity finesse,
- $\delta = \frac{4\pi}{\lambda} n d \cos\theta$ is the round-trip round cavity phase.

---

### 1.3 Exact Transfer Matrix Method (TMM) for Multi-Layer Thin Films
For a multi-layer dielectric optical coating composed of $N$ isotropic layers deposited on a substrate of refractive index $n_{\text{sub}}$, electromagnetic boundary conditions across all interfaces are solved exactly using 2x2 characteristic transfer matrices:

$$\begin{bmatrix} B \\ C \end{bmatrix} = \left( \prod_{j=1}^N M_j \right) \begin{bmatrix} 1 \\ \eta_{\text{sub}} \end{bmatrix}$$

For each layer $j$ with thickness $d_j$ and refractive index $n_j$:
$$M_j = \begin{bmatrix} \cos\delta_j & -\frac{i}{\eta_j}\sin\delta_j \\ -i\eta_j \sin\delta_j & \cos\delta_j \end{bmatrix}$$
where:
- Phase thickness: $\delta_j = \frac{2\pi}{\lambda} n_j d_j \cos\theta_j$,
- Snell's refraction angle: $\sin\theta_j = \frac{n_0 \sin\theta_0}{n_j}$,
- Effective optical admittance:
  $$\eta_j^{(s)} = n_j \cos\theta_j \quad (\text{TE / s-polarization})$$
  $$\eta_j^{(p)} = \frac{n_j}{\cos\theta_j} \quad (\text{TM / p-polarization})$$

The complex reflection coefficient $r$ and total power reflectance $R$ and transmittance $T$ are:
$$r = \frac{\eta_0 B - C}{\eta_0 B + C}, \quad R = |r|^2, \quad T = \frac{4\eta_0 \text{Re}\{\eta_{\text{sub}}\}}{|\eta_0 B + C|^2}$$

---

### 1.4 Digital Holography: Recording & 3D Wavefront Reconstruction
Digital off-axis holography records the interference between the object wave $E_{\text{obj}}$ and an off-axis reference plane wave $E_{\text{ref}} = E_r e^{i \vec{k}_r \cdot \vec{r}}$:
$$I_H(\vec{r}) = |E_{\text{obj}} + E_{\text{ref}}|^2 = |E_{\text{obj}}|^2 + |E_{\text{ref}}|^2 + E_{\text{obj}} E_{\text{ref}}^* + E_{\text{obj}}^* E_{\text{ref}}$$
During virtual 3D reconstruction, illuminating the recorded hologram transmittance with a conjugate readout wave $E_{\text{recon}} \propto E_{\text{ref}}^*$ regenerates the real and virtual diffracted wavefronts downstream.

---

## 2. Four Optical Laboratories

### A. Diffraction Laboratory
- **Young Double-Slit**: Interfere two coherent sub-micron apertures; observe fringe spacing $\Delta y = \frac{\lambda z}{d}$ and central envelope diffraction.
- **Single-Slit**: Classic Fraunhofer diffraction sinc profile $I(\theta) = I_0 \left(\frac{\sin\beta}{\beta}\right)^2$.
- **Circular Aperture (Airy Disc)**: 2D Bessel function $J_1(x)/x$ diffraction pattern displaying central Airy disc surrounded by concentric dark rings ($r_1 = 1.22 \frac{\lambda z}{D}$).
- **Diffraction Grating**: Discrete, razor-sharp principal diffraction orders $m \lambda = d \sin\theta$.
- **Fresnel Zone Plate**: Concentric diffractive Fresnel lens concentrating planar light into a sharp focal point without refractive glass.
- **Custom SLM**: Spatial Light Modulator multi-pinhole array.

### B. Interferometer Laboratory
- **Michelson**: Real-time piezoelectric mirror scan (0 to 2000 nm), mirror tilt angular alignment, and temporal coherence fringe decay.
- **Mach-Zehnder Refractometer**: In-situ transparent test cell with adjustable sample refractive index ($n = 1.000$ to $1.500$) and thickness ($L = 200\,\mu\text{m}$), directly visualizing phase delays.
- **Fabry-Pérot Cavity**: Resonant optical cavity with adjustable mirror reflectivity ($R = 0.60$ to $0.98$), demonstrating cavity finesse $\mathcal{F} > 150$ and razor-thin transmission fringes.

### C. Thin-Film Coating Laboratory (TMM)
Six curated industrial and scientific coating stacks:
1. **Uncoated Crown Glass**: Bare $n=1.52$ substrate showing standard 4.2% visible reflection.
2. **Single-Layer $\text{MgF}_2$ AR Coating**: Classic $\lambda/4$ anti-reflective coating at 550 nm ($R < 1.3\%$).
3. **Broadband V-Coat**: Dual-layer $\text{TiO}_2/\text{SiO}_2$ destructive interference achieving $R < 0.25\%$ at 532 nm.
4. **Dielectric Bragg Reflector (DBR Laser Mirror)**: 10-layer alternating quarter-wave stack delivering $R > 99.4\%$ constructive backscattering stopband.
5. **Fabry-Pérot Narrowband Filter**: Two DBR mirrors separated by a half-wave resonant cavity spacer transmitting an ultra-narrow passband.
6. **Silver Metallic High-Reflector**: 40 nm plasmonic silver film with complex refractive index ($\tilde{n} = 0.14 + 3.4i$).

### D. Digital Holography Laboratory
- Real-time off-axis recording with adjustable reference beam angle ($0.5^\circ$ to $6.0^\circ$).
- Holographic virtual image reconstruction recreating the original target object with diffractive wave phase.

---

## 3. Web Audio Optical Sonification Architecture
A 100% procedural Web Audio synthesizer sonifies optical wave states without external audio assets:
1. **Coherent Laser Hiss**: Pink noise generated via a 3-pole filter passed through a resonant bandpass filter centered on the laser optical frequency (400–700 nm mapped to 300–2200 Hz).
2. **Doppler Fringe Frequency Tone**: Continuous sine wave whose pitch and amplitude dynamically track piezoelectric translation speed and optical fringe visibility $V$.
3. **Fabry-Pérot Cavity Resonance Drone**: Triangle oscillator whose harmonic cutoff and swell reflect optical cavity finesse $\mathcal{F}$.
4. **Harmonic Phase Step Chimes**: Dynamic acoustic feedback when stepping optical phase ($\Delta\phi$).
5. **Master Dynamics Compressor**: Hard peak limiter preventing digital clipping under high fringe contrasts.

---

## 4. Verification & Benchmarks

| Metric | Result | Target |
| :--- | :--- | :--- |
| **Animation Loop Frame Rate** | 60.0 FPS | 60 FPS |
| **Grid Resolution** | $280 \times 140$ (39,200 complex cells) | $\ge 200 \times 100$ |
| **Offscreen Buffer Allocation** | Once on mount (0 GC churn) | 0 allocations / frame |
| **Headless Puppeteer Tests** | 100% Passed (0 console errors) | 0 errors |
| **Bundle Size (Gzip)** | 84.65 kB JS, 5.14 kB CSS | $< 250\text{ kB}$ |
| **Wavelength Tuning Range** | 400 nm to 700 nm (1 nm precision) | Full visible spectrum |
| **Telemetry Export** | CSV (Intensity & Spectrum) + JSON Bench State | Valid data files |

---

## 5. Artifacts & Deliverables
- Source Code: `/root/web-platform-experiments/v4/agy-gemini-3.8/012/src/`
- Production Build: `/root/web-platform-experiments/v4/agy-gemini-3.8/012/dist/`
- Public Web Deployment: `/var/www/novastrum/wbe/012/`
- Headless Integration Test: `012/test-run.cjs`
- Technical Specification & Report: `012/report.md`
- Engineering Journal: `012/journal.md`
- Verification Metadata: `012/verification.json`
