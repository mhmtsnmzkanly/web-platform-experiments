# SCIENTIFIC CONTRACT: COSMO-FORGE (EXP-020)

**Experiment Identifier**: `020`  
**Full Title**: COSMO-FORGE — Physical Cosmology, FLRW Friedmann Dynamics, CMB Acoustic Peaks & Big Bang Nucleosynthesis Studio  
**Standard**: WBE V4 Autonomous Experiment Development Hardening Protocol (Version 2.0)  
**Scientific Fidelity Classification**:
- **FLRW Friedmann Metric ODE & Cosmological Distances**: **LEVEL A** (Exact analytical and numerical solutions to Friedmann differential equations, verified to $< 10^{-5}$ relative error).
- **Cosmic Microwave Background (CMB) Sound Horizon & Acoustic Peaks**: **LEVEL A** (Hu-Sugiyama recombination physics, exact sound horizon integral $r_s(z_*)$, and angular diameter distance $d_A(z_*)$ yielding peak $\ell_1 \approx 220.5 \pm 0.5$, verified against Planck 2018).
- **Big Bang Nucleosynthesis (BBN) Primordial Kinetics**: **LEVEL B** (Semi-analytical nuclear network tracking $T_{\text{freeze}}$, free neutron decay through the deuterium bottleneck, $Y_p \approx 0.245$, and $D/H$ scaling with $\eta$).
- **Dark Matter Halo & Galactic Rotation Curves**: **LEVEL A** (Exact analytical NFW, Burkert, and Moore mass integrations and circular velocity profiles $v_c(r)$ matching NGC 3198 galaxy data).

---

## 1. Physical Phenomenon & Governing Equations

### 1.1 FLRW Metric & Friedmann Differential Equations
The spacetime metric for a homogeneous and isotropic expanding universe in comoving coordinates $(t, r, \theta, \phi)$ is the Friedmann-Lemaître-Robertson-Walker (FLRW) metric:
$$ds^2 = -c^2 dt^2 + a(t)^2 \left[ \frac{dr^2}{1 - k r^2} + r^2 (d\theta^2 + \sin^2\theta d\phi^2) \right]$$
where $a(t)$ is the dimensionless cosmic scale factor normalized to $a(t_0) = 1$ today, and $k \in \{-1, 0, +1\}$ is the spatial curvature index.

Applying Einstein's Field Equations $G_{\mu\nu} + \Lambda g_{\mu\nu} = \frac{8\pi G}{c^4} T_{\mu\nu}$ with an energy-momentum tensor of multiple perfect fluids $T^\mu_\nu = \operatorname{diag}(-\rho c^2, P, P, P)$ yields the Friedmann differential equations:
$$\left( \frac{\dot{a}}{a} \right)^2 = \frac{8\pi G}{3} \rho - \frac{k c^2}{a^2} + \frac{\Lambda c^2}{3}$$
$$\frac{\ddot{a}}{a} = -\frac{4\pi G}{3}\left(\rho + \frac{3P}{c^2}\right) + \frac{\Lambda c^2}{3}$$

Defining the Hubble parameter $H(t) \equiv \frac{\dot{a}}{a}$ and critical density $\rho_{c,0} \equiv \frac{3 H_0^2}{8\pi G}$, we define the fractional energy density parameters at the present epoch:
$$\Omega_{r,0} \equiv \frac{\rho_{r,0}}{\rho_{c,0}}, \quad \Omega_{m,0} \equiv \frac{\rho_{m,0}}{\rho_{c,0}}, \quad \Omega_{k,0} \equiv -\frac{k c^2}{a_0^2 H_0^2}, \quad \Omega_{DE,0} \equiv \frac{\rho_{DE,0}}{\rho_{c,0}}$$

In terms of redshift $z \equiv \frac{1}{a} - 1$, the dimensionless expansion rate $E(z) \equiv H(z) / H_0$ is:
$$E(z) = \left[ \Omega_{r,0}(1+z)^4 + \Omega_{m,0}(1+z)^3 + \Omega_{k,0}(1+z)^2 + \Omega_{DE,0} f_{DE}(z) \right]^{1/2}$$
where for a dark energy equation of state $w(a) = w_0 + w_a(1-a)$ (Chevallier-Polarski-Linder CPL parameterization):
$$f_{DE}(z) = (1+z)^{3(1+w_0+w_a)} \exp\left( -3 w_a \frac{z}{1+z} \right)$$
For a pure cosmological constant $\Lambda$ ($w_0 = -1, w_a = 0$), $f_{DE}(z) \equiv 1$.

#### Deceleration Parameter & Cosmic Acceleration Turnaround
$$q(z) \equiv -\frac{\ddot{a} a}{\dot{a}^2} = \frac{1+z}{E(z)} \frac{dE}{dz} - 1$$
For a flat $\Lambda\text{CDM}$ universe ($\Omega_k = 0, \Omega_r \ll \Omega_m$), the transition from decelerating expansion ($q > 0$) to accelerated expansion ($q < 0$) occurs at:
$$q(z_{\text{acc}}) = 0 \implies z_{\text{acc}} = \left( \frac{2 \Omega_{\Lambda,0}}{\Omega_{m,0}} \right)^{1/3} - 1$$
For Planck 2018 ($\Omega_{m,0} = 0.315, \Omega_{\Lambda,0} = 0.685$), $z_{\text{acc}} = (2 \times 0.685 / 0.315)^{1/3} - 1 = (4.349)^{1/3} - 1 \approx 0.632$.

#### Cosmological Distances & Lookback Time
- **Lookback Time**:
  $$t_L(z) = \frac{1}{H_0} \int_0^z \frac{dz'}{(1+z') E(z')}$$
- **Age of the Universe**:
  $$t(z) = \frac{1}{H_0} \int_z^\infty \frac{dz'}{(1+z') E(z')}$$
  Present age: $t_0 = t(0)$.
- **Comoving Line-of-Sight Distance**:
  $$\chi(z) = \frac{c}{H_0} \int_0^z \frac{dz'}{E(z')}$$
- **Transverse Comoving Distance**:
  $$d_M(z) = \begin{cases} \frac{c}{H_0 \sqrt{\Omega_k}} \sinh\left( \sqrt{\Omega_k} \frac{H_0 \chi(z)}{c} \right) & \text{if } \Omega_k > 0 \quad (\text{Open / Hyperbolic}) \\ \chi(z) & \text{if } \Omega_k = 0 \quad (\text{Flat Euclidean}) \\ \frac{c}{H_0 \sqrt{|\Omega_k|}} \sin\left( \sqrt{|\Omega_k|} \frac{H_0 \chi(z)}{c} \right) & \text{if } \Omega_k < 0 \quad (\text{Closed / Spherical}) \end{cases}$$
- **Luminosity Distance**:
  $$d_L(z) = (1+z) d_M(z)$$
- **Angular Diameter Distance**:
  $$d_A(z) = \frac{d_M(z)}{1+z} = \frac{d_L(z)}{(1+z)^2}$$
- **Distance Modulus (Supernova Type Ia)**:
  $$\mu(z) = 5 \log_{10}\left( \frac{d_L(z)}{10\text{ pc}} \right) = 5 \log_{10}\left( \frac{d_L(z)}{1\text{ Mpc}} \right) + 25$$

---

### 1.2 Cosmic Microwave Background (CMB) Acoustic Spectrum
At recombination ($z_* \approx 1090$), photons decouple from baryons as neutral hydrogen forms.

#### Recombination Redshift (Hu & Sugiyama 1996 Fitting Formula)
$$z_* = 1048 \left[ 1 + 0.00124 (\Omega_b h^2)^{-0.738} \right] \left[ 1 + g_1 (\Omega_m h^2)^{g_2} \right]$$
$$g_1 = \frac{0.0783 (\Omega_b h^2)^{-0.238}}{1 + 39.5 (\Omega_b h^2)^{0.763}}, \quad g_2 = \frac{0.560}{1 + 21.1 (\Omega_b h^2)^{1.81}}$$

#### Sound Horizon at Photon Decoupling
The sound speed of the tightly coupled photon-baryon plasma is:
$$c_s(z) = \frac{c}{\sqrt{3 \left( 1 + R(z) \right)}}, \quad R(z) \equiv \frac{3 \rho_b(z)}{4 \rho_\gamma(z)} = \frac{3 \Omega_b h^2}{4 \Omega_\gamma h^2 (1+z)} = 31.5 \Omega_b h^2 \left( \frac{1000}{1+z} \right)$$
where $\Omega_\gamma h^2 = 2.47 \times 10^{-5}$ ($T_{\text{CMB}} = 2.7255\text{ K}$).

The physical comoving sound horizon is:
$$r_s(z_*) = \int_{z_*}^\infty \frac{c_s(z')}{H(z')} dz'$$

#### First Acoustic Peak Multipole
The angular acoustic scale subtended by the sound horizon on the last scattering surface is:
$$\theta_* = \frac{r_s(z_*)}{d_M(z_*)} = \frac{r_s(z_*)}{(1+z_*) d_A(z_*)}$$
The primary acoustic peak multipole $\ell_1$ satisfies:
$$\ell_1 = \frac{\pi}{\theta_*} = \frac{\pi d_M(z_*)}{r_s(z_*)}$$
For the Planck 2018 concordance $\Lambda\text{CDM}$ cosmology, $\ell_1 \approx 220.5 \pm 0.5$.

#### Angular Power Spectrum $D_\ell = \frac{\ell(\ell+1)}{2\pi} C_\ell$
The temperature anisotropy angular power spectrum is modeled across multipoles $\ell \in [2, 2500]$:
$$D_\ell = D_\ell^{\text{SW}} + D_\ell^{\text{acoustic}} \times \exp\left( -2 \left( \frac{\ell}{\ell_D} \right)^{1.2} \right)$$
- **Sachs-Wolfe Plateau ($\ell < 30$)**: Large-scale gravitational potential fluctuations $\Delta T / T \sim \frac{1}{3}\Phi$.
- **Acoustic Oscillations ($\ell \sim 100\text{–}1500$)**:
  $$D_\ell^{\text{acoustic}} = A \left[ \cos\left( \pi \frac{\ell}{\ell_1} + \phi \right) + R_b \right]^2$$
  where the baryon loading factor $R_b \propto \Omega_b / \Omega_c$ enhances odd peaks (compressions into potential wells) and suppresses even peaks (rarefactions).
- **Silk Damping Tail ($\ell > 1000$)**: Photon diffusion dampens perturbations exponentially on scales below the photon mean free path with damping multipole $\ell_D \approx 1400$.

---

### 1.3 Big Bang Nucleosynthesis (BBN) Primordial Kinetics
During the first $\sim 20$ minutes after the Big Bang, cosmic expansion cools the universe from $T \sim 10^{11}\text{ K}$ ($10\text{ MeV}$) down to $T \sim 10^8\text{ K}$ ($10\text{ keV}$).

#### 1. Weak Freeze-Out ($T \approx 0.8\text{ MeV}, t \approx 1\text{ s}$)
Electroweak transitions $n + \nu_e \leftrightarrow p + e^-$ and $n + e^+ \leftrightarrow p + \bar{\nu}_e$ freeze out when the weak reaction rate $\Gamma_{wk} \propto G_F^2 T^5$ drops below the expansion rate $H \propto T^2$:
$$T_{\text{freeze}} \approx 0.8\text{ MeV} \implies \left(\frac{n}{p}\right)_{\text{freeze}} = \exp\left( -\frac{\Delta m c^2}{k_B T_{\text{freeze}}} \right) \approx \exp\left( -\frac{1.293\text{ MeV}}{0.80\text{ MeV}} \right) \approx 0.198$$

#### 2. The Deuterium Bottleneck & Free Neutron Beta Decay ($1\text{ s} \le t \le 180\text{ s}$)
Even though deuterium ($d$) has binding energy $B_d = 2.22\text{ MeV}$, the immense photon-to-baryon ratio $\eta^{-1} = n_\gamma / n_b \approx 10^9$ photodisintegrates deuterium ($d + \gamma \to p + n$) until the temperature drops to $T_{\text{BBN}} \approx 0.08\text{ MeV}$ ($t_{\text{delay}} \approx 180\text{ s}$). During this delay, free neutrons decay with lifetime $\tau_n = 879.4\text{ s}$:
$$\left(\frac{n}{p}\right)_{\text{BBN}} = \left(\frac{n}{p}\right)_{\text{freeze}} \exp\left( -\frac{t_{\text{delay}}}{\tau_n} \right) \approx 0.198 \times \exp\left( -\frac{180}{879.4} \right) \approx 0.161 \approx \frac{1}{6.2}$$

#### 3. Primordial Helium-4 Mass Fraction $Y_p$
Almost all surviving neutrons are incorporated into the tightly bound $^{4}\text{He}$ nucleus ($B_\alpha = 28.3\text{ MeV}$):
$$Y_p \equiv \frac{4 n_{^4\text{He}}}{n_n + n_p} = \frac{2 (n/p)_{\text{BBN}}}{1 + (n/p)_{\text{BBN}}} \approx \frac{2 \times 0.161}{1 + 0.161} = \frac{0.322}{1.161} \approx 0.245 \pm 0.005$$
This fundamental cosmological observable matches astronomical observations of metal-poor H II regions ($Y_p = 0.245 \pm 0.003$).

#### 4. Trace Residuals vs Baryon Density $\eta_{10} \equiv 10^{10}(n_b/n_\gamma) = 274 \Omega_b h^2$
- Primordial Deuterium $(D/H) \approx 2.54 \times 10^{-5} \times (\Omega_b h^2 / 0.022)^{-1.6}$ (sensitive "cosmic baryon-meter").
- Helium-3: $(^3\text{He}/H) \approx 1.0 \times 10^{-5}$.
- Lithium-7: $(^7\text{Li}/H) \approx 4.6 \times 10^{-10} \times (\Omega_b h^2 / 0.022)^2$.

---

### 1.4 Dark Matter Halo Profiles & Galactic Rotation Curves
For an isolated spherically symmetric dark matter halo, the circular orbital velocity is governed by:
$$v_c(r) = \sqrt{\frac{G M(r)}{r}}, \quad M(r) = \int_0^r 4\pi r'^2 \rho(r') dr'$$

#### 1. Navarro-Frenk-White (NFW) Profile (Cuspy $r^{-1}$)
$$\rho_{\text{NFW}}(r) = \frac{\rho_0}{\frac{r}{r_s}\left(1 + \frac{r}{r_s}\right)^2}$$
$$M_{\text{NFW}}(r) = 4\pi \rho_0 r_s^3 \left[ \ln\left(1 + \frac{r}{r_s}\right) - \frac{r/r_s}{1 + r/r_s} \right]$$
$$v_c(r) = \sqrt{4\pi G \rho_0 r_s^2 \left[ \frac{\ln(1 + x) - \frac{x}{1+x}}{x} \right]}, \quad x \equiv \frac{r}{r_s}$$

#### 2. Burkert Profile (Cored)
$$\rho_{\text{Burkert}}(r) = \frac{\rho_0}{\left(1 + \frac{r}{r_0}\right) \left(1 + \left(\frac{r}{r_0}\right)^2\right)}$$
$$M_{\text{Burkert}}(r) = \pi \rho_0 r_0^3 \left[ \ln\left(1 + \frac{r^2}{r_0^2}\right) + 2\ln\left(1 + \frac{r}{r_0}\right) - 2\arctan\left(\frac{r}{r_0}\right) \right]$$

#### 3. Total Velocity with Baryonic Disk & Bulge Decomposition
$$v_{\text{total}}^2(r) = v_{\text{halo}}^2(r) + v_{\text{disk}}^2(r) + v_{\text{bulge}}^2(r)$$
where Freeman exponential thin disk:
$$v_{\text{disk}}^2(r) = \frac{G M_d r^2}{2 R_d^3} \left[ I_0(y) K_0(y) - I_1(y) K_1(y) \right], \quad y \equiv \frac{r}{2 R_d}$$
and Hernquist spherical bulge:
$$v_{\text{bulge}}^2(r) = \frac{G M_b r}{(r + a_b)^2}$$
This accurately reproduces the flat galactic rotation curve of spiral galaxy NGC 3198 ($v \approx 150\text{ km/s}$ out to $30\text{ kpc}$), completely refuting pure Keplerian falloff $v \propto r^{-1/2}$.

---

## 2. Dimensional Ledger & Unit Conversions

| Physical Quantity | Symbol | Internal Dimension | Standard Units | Conversion Factor / Constant |
|---|---|---|---|---|
| Hubble Constant | $H_0$ | $\text{T}^{-1}$ | $\text{km s}^{-1}\text{Mpc}^{-1}$ | $1\text{ km/s/Mpc} = 3.24078 \times 10^{-18}\text{ s}^{-1}$ |
| Hubble Distance | $c/H_0$ | $\text{L}$ | $\text{Mpc}$ | $c/H_0 \approx 4448\text{ Mpc}$ for $H_0 = 67.4$ |
| Speed of Light | $c$ | $\text{L T}^{-1}$ | $\text{m s}^{-1}$ | $2.99792458 \times 10^8\text{ m/s}$ |
| Gravitational Constant | $G$ | $\text{M}^{-1}\text{L}^3\text{T}^{-2}$ | $\text{m}^3\text{kg}^{-1}\text{s}^{-2}$ | $6.67430 \times 10^{-11}$ |
| Megaparsec | $\text{Mpc}$ | $\text{L}$ | $\text{m}$ | $3.08567758 \times 10^{22}\text{ m}$ |
| Critical Density | $\rho_{c,0}$ | $\text{M L}^{-3}$ | $\text{kg m}^{-3}$ | $\frac{3 H_0^2}{8\pi G} \approx 8.53 \times 10^{-27}\text{ kg/m}^3$ |
| Photon-Baryon Sound Speed | $c_s$ | $\text{L T}^{-1}$ | $\text{m s}^{-1}$ | $c / \sqrt{3(1+R)}$ |
| Sound Horizon | $r_s$ | $\text{L}$ | $\text{Mpc}$ | $\approx 147.2\text{ Mpc}$ (Planck 2018) |
| Free Neutron Lifetime | $\tau_n$ | $\text{T}$ | $\text{s}$ | $879.4\text{ s}$ (PDG 2024) |
| Neutron-Proton Mass Difference| $\Delta m c^2$ | $\text{M L}^2 \text{T}^{-2}$ | $\text{MeV}$ | $1.293332\text{ MeV} = 2.072 \times 10^{-13}\text{ J}$ |

---

## 3. Equation-to-Code Traceability

| Scientific Quantity | Governing Formula | Implementation File & Function | Benchmark Test ID |
|---|---|---|---|
| Dimensionless Hubble $E(z)$ | $E(z) = \sqrt{\sum \Omega_i (1+z)^{3(1+w_i)}}$ | `FriedmannSolver.computeEz()` | `FLRW-01` |
| Lookback Time $t_L(z)$ | $\int_0^z \frac{dz'}{(1+z')H(z')}$ | `FriedmannSolver.computeLookbackTime()` | `FLRW-02` |
| Age of the Universe $t_0$ | $\int_0^\infty \frac{dz'}{(1+z')H(z')}$ | `FriedmannSolver.computeAgeOfUniverse()` | `FLRW-03` |
| Luminosity Distance $d_L(z)$ | $(1+z) d_M(z)$ | `FriedmannSolver.computeDistances()` | `FLRW-04` |
| Cosmic Turnaround $z_{\text{acc}}$ | $q(z_{\text{acc}}) = 0$ | `FriedmannSolver.computeDeceleration()` | `FLRW-05` |
| Photon Decoupling $z_*$ | Hu-Sugiyama 1996 formula | `CmbAcousticEngine.computeRecombinationZ()` | `CMB-01` |
| Sound Horizon $r_s(z_*)$ | $\int_{z_*}^\infty \frac{c_s(z')}{H(z')} dz'$ | `CmbAcousticEngine.computeSoundHorizon()` | `CMB-02` |
| 1st Acoustic Peak Multipole $\ell_1$| $\pi d_M(z_*) / r_s(z_*)$ | `CmbAcousticEngine.computeFirstAcousticPeak()`| `CMB-03` |
| Angular Power Spectrum $D_\ell$ | SW + Acoustic $\cos^2(\ell/\ell_1) \times e^{-(\ell/\ell_D)^{1.2}}$| `CmbAcousticEngine.computePowerSpectrum()` | `CMB-04` |
| Weak Freeze-Out $(n/p)$ | $\exp(-\Delta m c^2 / k_B T_{\text{freeze}})$ | `BbnKineticsEngine.computeWeakFreezeOut()` | `BBN-01` |
| Free Neutron Beta Decay | $(n/p)_{\text{BBN}} = (n/p)_0 e^{-t_{\text{delay}}/\tau_n}$ | `BbnKineticsEngine.computeNeutronDecay()` | `BBN-02` |
| Primordial Helium Fraction $Y_p$ | $2(n/p) / (1 + n/p)$ | `BbnKineticsEngine.computeHeliumFraction()` | `BBN-03` |
| Deuterium Residual $(D/H)$ | $2.54 \times 10^{-5} (\Omega_b h^2 / 0.022)^{-1.6}$| `BbnKineticsEngine.computeTraceAbundances()` | `BBN-04` |
| NFW Enclosed Mass $M(r)$ | $4\pi \rho_0 r_s^3 [\ln(1+x) - x/(1+x)]$ | `DarkMatterHaloEngine.computeNfwMass()` | `DM-01` |
| NFW Circular Velocity $v_c(r)$ | $\sqrt{G M(r) / r}$ | `DarkMatterHaloEngine.computeRotationCurve()`| `DM-02` |
| Total Galactic Rotation Curve | $\sqrt{v_{\text{halo}}^2 + v_{\text{disk}}^2 + v_{\text{bulge}}^2}$ | `DarkMatterHaloEngine.computeTotalRotation()` | `DM-03` |
