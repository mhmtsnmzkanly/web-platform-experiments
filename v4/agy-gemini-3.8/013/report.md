# Experiment 013: SEISMIC-LAB — Geophysical Elastodynamics, Fault Rupture & Tsunami Wave Mechanics Studio

## Executive Summary
**SEISMIC-LAB** is a browser-based computational geophysics laboratory simulating 2D elastodynamic wave propagation, tectonic fault rupture, multi-station seismogram waveform recording, and coupled shallow-water tsunami hydrodynamics. Running on a $240 \times 120$ staggered finite-difference grid ($240\text{ km} \times 120\text{ km}$ crustal domain) at 60 FPS, the simulation resolves compressional P-waves, shear S-waves, and dispersive Rayleigh surface waves across heterogeneous geological strata.

The studio incorporates 5 curated tectonic earthquake scenarios, an interactive 4-station seismograph network with real-time phase picking ($P, S, \text{Rayleigh}$), theoretical travel-time dispersion curves, coastal tsunami run-up bathymetry, 100% procedural Web Audio infrasound sonification, and scientific CSV/JSON data export.

---

## 1. Mathematical & Geophysical Foundations

### 1.1 2D Velocity-Stress Elastodynamic Wave Equations
Seismic wave propagation through isotropic elastic media is formulated in velocity-stress form on a staggered spatial grid:

$$\rho \frac{\partial v_x}{\partial t} = \frac{\partial \sigma_{xx}}{\partial x} + \frac{\partial \sigma_{xz}}{\partial z}$$
$$\rho \frac{\partial v_z}{\partial t} = \frac{\partial \sigma_{xz}}{\partial x} + \frac{\partial \sigma_{zz}}{\partial z}$$

Constitutive Hooke's law relating stress rates to spatial velocity gradients (strain rates):
$$\frac{\partial \sigma_{xx}}{\partial t} = (\lambda + 2\mu) \frac{\partial v_x}{\partial x} + \lambda \frac{\partial v_z}{\partial z}$$
$$\frac{\partial \sigma_{zz}}{\partial t} = \lambda \frac{\partial v_x}{\partial x} + (\lambda + 2\mu) \frac{\partial v_z}{\partial z}$$
$$\frac{\partial \sigma_{xz}}{\partial t} = \mu \left( \frac{\partial v_x}{\partial z} + \frac{\partial v_z}{\partial x} \right)$$

where:
- $v_x, v_z$ are horizontal and vertical ground particle velocities ($\text{km/s}$),
- $\sigma_{xx}, \sigma_{zz}$ are normal stress components, $\sigma_{xz}$ is shear stress,
- $\rho$ is mass density ($\text{g/cm}^3$),
- $\lambda, \mu$ are Lamé elastodynamic parameters:
  $$\mu = \rho V_s^2 \quad (\text{Shear Modulus})$$
  $$\lambda = \rho(V_p^2 - 2V_s^2) \quad (\text{First Lamé Parameter})$$
- $V_p, V_s$ are primary (compressional) and secondary (shear) wave speeds.

### 1.2 Boundary Conditions & Rayleigh Surface Waves
- **Free Surface at $z = 0$**: The traction-free boundary condition enforces $\sigma_{zz} = 0$ and $\sigma_{xz} = 0$. This boundary condition physically couples compressional and shear motion at the earth's surface, naturally synthesizing **Rayleigh surface waves** with characteristic retrograde elliptical particle motion that decays exponentially with depth:
  $$V_R \approx \frac{0.87 + 1.12\nu}{1 + \nu} V_s \approx 0.92 V_s$$
- **Absorbing Boundary Layer**: Lateral (left/right) and bottom boundaries implement an 18-cell exponential sponge damping layer $\gamma(x, z) = \exp(-\alpha d^2)$ that absorbs outgoing wave energy, eliminating non-physical box reverberations.

---

### 1.3 Dynamic Tectonic Fault Rupture & Source Scaling
Earthquake rupture is modeled as a shear stress dislocation across a planar fault dipping at angle $\theta_{\text{dip}}$:
- **Seismic Moment ($M_0$) & Moment Magnitude ($M_w$)**:
  $$M_0 = \mu A D \quad (\text{N}\cdot\text{m})$$
  $$M_w = \frac{2}{3} \log_{10}(M_0) - 6.07$$
  Energy released scales exponentially with magnitude:
  $$\log_{10}(E) = 1.5 M_w + 4.8 \quad (\text{Joules})$$
- **Radiation Pattern**: Generates the classical 4-lobed double-couple radiation pattern: quadrupolar alternating quadrants of compression ($+$) and dilatation ($-$) for P-waves, and transverse shear rotations for S-waves.

---

### 1.4 Coupled Non-Linear Shallow Water Tsunami Hydrodynamics
For offshore submarine megathrust events, dynamic vertical seafloor displacement $\Delta z_{\text{bed}}(x)$ transfers directly into the ocean water column:
$$\frac{\partial \eta}{\partial t} + \frac{\partial ((H + \eta) u)}{\partial x} = 0$$
$$\frac{\partial u}{\partial t} + u \frac{\partial u}{\partial x} + g \frac{\partial \eta}{\partial x} = -\frac{c_f u |u|}{H + \eta}$$
where:
- $\eta(x, t)$ is sea surface elevation above mean sea level ($\text{m}$),
- $u(x, t)$ is depth-averaged horizontal flow velocity ($\text{m/s}$),
- $H(x)$ is bathymetric ocean depth ($\text{m}$),
- $g = 9.81\text{ m/s}^2$ is gravitational acceleration, $c_f$ is seafloor friction.

**Wave Celerity & Green's Shoaling Law**:
$$c = \sqrt{g H}$$
In deep ocean ($H = 4200\text{ m}$), $c \approx 725\text{ km/h}$. As the wave approaches the shallow continental shelf ($H \to 10\text{ m}$), speed drops to $\sim 35\text{ km/h}$, compressing the wavelength and amplifying wave height:
$$A_2 = A_1 \left( \frac{H_1}{H_2} \right)^{1/4}$$
demonstrating catastrophic coastal wave shoaling and run-up inundation.

---

## 2. Five Curated Tectonic Scenarios

1. **Cascadia Megathrust Subduction ($M_w 9.0$)**:
   - Offshore shallow-dipping thrust fault ($\theta = 14^\circ$, depth $18\text{ km}$).
   - Dislocates oceanic crust beneath the accretionary wedge, producing $>5.5\text{ m}$ seafloor vertical uplift and triggering a deep-ocean tsunami.
2. **San Andreas Strike-Slip ($M_w 7.8$)**:
   - Near-vertical transform fault ($\theta = 90^\circ$, depth $10\text{ km}$).
   - Generates intense horizontal shear displacement, radiant S-waves, and rolling Rayleigh waves.
3. **Sedimentary Basin Wave Trap ($M_w 7.2$)**:
   - 12 km deep alluvial sediment basin where $V_p$ slows by 45%.
   - Traps seismic body waves via total internal reflection, creating severe resonance and extending shaking duration by $300\%$.
4. **Wadati-Benioff Deep Slab Rupture ($M_w 7.5$)**:
   - Intraslab mantle rupture at $75\text{ km}$ depth within the subducting lithosphere.
   - Shows high P-wave propagation velocities ($8.1\text{ km/s}$) and absence of surface waves.
5. **Volcanic Caldera Ring-Fault Collapse ($M_w 6.8$)**:
   - Shallow piston collapse of magma chamber roof ($5\text{ km}$ depth), radiating an intense omnidirectional P-wave compressional shockwave.

---

## 3. Seismograph Network & Travel-Time Telemetry

The laboratory features 4 surface stations monitoring 3-component ground velocity:
- **Station Alpha (Near-Field)**: $x = 55\text{ km}$
- **Station Bravo (Regional)**: $x = 105\text{ km}$
- **Station Charlie (Basin Station)**: $x = 160\text{ km}$
- **Station Delta (Teleseismic Array)**: $x = 215\text{ km}$

**Capabilities**:
- Rolling dual-trace seismograms: Vertical ground velocity $v_z(t)$ (Cyan) and horizontal shear $v_x(t)$ (Orange).
- Automated phase arrival picks ($P, S, \text{Rayleigh}$).
- Peak Ground Acceleration (PGA in $g$) and Peak Ground Velocity (PGV in $\text{cm/s}$).
- Dynamic Travel-Time Curves: Plots theoretical dispersion lines alongside real-time station picks, validating $S - P$ lag-time distance estimation:
  $$D = \frac{t_S - t_P}{\frac{1}{V_s} - \frac{1}{V_p}}$$

---

## 4. Web Audio Geophysical Sonification Architecture
100% procedural sound synthesis without external audio files:
1. **P-Wave Sub-Bass Rumble**: Low-frequency sine thump ($35 - 80\text{ Hz}$) scaling with moment magnitude $M_w$.
2. **S-Wave Tectonic Friction Roar**: Lowpass-filtered pink noise modeling subterranean rock grating and shear rupture.
3. **Infrasound Earth Hum**: Deep continuous $38\text{ Hz}$ earth resonance modulated by instantaneous ground motion.
4. **Seismograph Needle Arrival Clicks**: High-frequency needle clicks on phase arrival picks ($880\text{ Hz}$ for P, $520\text{ Hz}$ for S, $330\text{ Hz}$ for Rayleigh).
5. **Tsunami Coastal Surge**: Low triangle surf drone tracking tsunami wave height.
6. **Master Dynamics Compressor**: Hard peak limiter ($-3\text{ dB}$ threshold, $14:1$ ratio) preventing digital clipping.

---

## 5. Verification & Benchmarks

| Metric | Result | Target |
| :--- | :--- | :--- |
| **Grid Resolution** | $240 \times 120$ cells ($240\text{ km} \times 120\text{ km}$) | $\ge 200 \times 100$ |
| **Animation Loop Frame Rate** | 60.0 FPS | 60 FPS |
| **Offscreen Buffer Allocation** | Once on mount (0 GC churn) | 0 allocations / frame |
| **Headless Puppeteer Tests** | 100% Passed (0 console errors) | 0 errors |
| **Bundle Size (Gzip)** | 85.19 kB JS, 5.29 kB CSS | $< 250\text{ kB}$ |
| **CFL Stability** | $\Delta t = 0.055\text{ s} < \frac{\Delta x}{\sqrt{2} V_{p,\max}}$ | Unconditionally Stable |
| **Telemetry Export** | CSV (Waveforms & Tsunami) + JSON State | Valid data files |

---

## 6. Artifacts & Deliverables
- Source Code: `/root/web-platform-experiments/v4/agy-gemini-3.8/013/src/`
- Production Build: `/root/web-platform-experiments/v4/agy-gemini-3.8/013/dist/`
- Deployment Target: `/var/www/novastrum/wbe/013/`
- Automated Test Suite: `013/test-run.cjs`
- Technical Specification & Report: `013/report.md`
- Engineering Journal: `013/journal.md`
- Verification Metadata: `013/verification.json`
