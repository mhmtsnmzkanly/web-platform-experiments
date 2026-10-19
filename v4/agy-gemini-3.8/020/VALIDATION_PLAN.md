# VALIDATION PLAN: COSMO-FORGE (EXP-020)

**Experiment Identifier**: `020`  
**Governing Standard**: WBE V4 Autonomous Experiment Development Hardening Protocol (Version 2.0)  
**Tolerances Status**: **A PRIORI DEFINED BEFORE NUMERICAL ENGINE INTEGRATION**  

---

## 1. A Priori Acceptance Tolerances

To satisfy Protocol 2.0 Section 3, all tolerances are defined before examining results and are strictly justified by floating-point precision, mathematical solver order, and physical models:

1. **Friedmann $E(z)$ Dimensionless Expansion Rate**:
   - Zero-redshift normalization $E(0) = \sqrt{\sum \Omega_i} \equiv 1.000000$ (for flat cosmologies): Tolerance $< 10^{-12}$.
   - Matter-dominated Einstein-de Sitter asymptote $E(z) \to (1+z)^{3/2}$: Relative error $< 0.001\%$.
   - Radiation-dominated asymptote $E(z) \to (1+z)^2$: Relative error $< 0.001\%$.
2. **Cosmological Time & Ages**:
   - Present age of Einstein-de Sitter flat universe ($t_0 = \frac{2}{3 H_0}$): Relative error $< 0.01\%$.
   - Present age of flat $\Lambda\text{CDM}$ with $H_0 = 67.4, \Omega_m = 0.315, \Omega_\Lambda = 0.685$ ($t_0 = 13.80 \pm 0.05\text{ Gyr}$): Relative error $< 0.1\%$.
3. **Cosmological Distances**:
   - Comoving distance at $z \to 0$: $\chi(z) \to \frac{c z}{H_0}$ (Hubble-Lemaître law limit): Relative error $< 0.01\%$.
   - Luminosity distance identity: $d_L(z) = (1+z) d_M(z)$: Exact to floating-point machine precision $< 10^{-12}$.
   - Angular diameter distance identity: $d_A(z) = d_L(z) / (1+z)^2$: Exact to $< 10^{-12}$.
4. **Cosmic Acceleration Turnaround**:
   - Analytical root for flat $\Lambda\text{CDM}$: $z_{\text{acc}} = (2\Omega_\Lambda / \Omega_m)^{1/3} - 1$: Measured root matches analytical formula to $< 0.01\%$.
5. **CMB Sound Horizon & Recombination**:
   - Recombination redshift $z_*$ for Planck parameters: Matches Hu-Sugiyama formula ($1089.9 \pm 1.0$) to $< 0.05\%$.
   - Sound horizon at decoupling $r_s(z_*)$: $147.2 \pm 0.5\text{ Mpc}$ (Planck 2018 value): Matches numerical integral to $< 0.5\%$.
   - First acoustic peak multipole $\ell_1 = \pi d_M(z_*) / r_s(z_*)$: $220.5 \pm 1.0$: Matches Planck observation to $< 0.5\%$.
6. **Big Bang Nucleosynthesis**:
   - Weak freeze-out neutron-to-proton ratio $(n/p)_{\text{freeze}}$: $0.198 \pm 0.005$.
   - Post-deuterium-bottleneck ratio $(n/p)_{\text{BBN}}$: $0.161 \pm 0.005$.
   - Primordial Helium-4 mass fraction $Y_p$: $0.245 \pm 0.005$ for standard baryon density $\Omega_b h^2 \approx 0.022$.
   - Baryon mass conservation: $X + Y_p + Z \equiv 1.000000$ to machine precision.
7. **Dark Matter Halo & Galactic Dynamics**:
   - NFW mass convergence: $M(r) \to 4\pi \rho_0 r_s^3 [\ln(1+x) - x/(1+x)]$: Relative error $< 10^{-6}$.
   - Asymptotic rotation curve: Flat asymptotic circular velocity $v_c(r) \sim \text{const}$ for $r \gg r_s$, avoiding Keplerian $r^{-1/2}$ dropoff.
   - Total galactic velocity $v_{\text{total}} = \sqrt{v_h^2 + v_d^2 + v_b^2}$ for NGC 3198 galaxy at $r = 20\text{ kpc}$: $149 \pm 5\text{ km/s}$ matching empirical astronomical radio synthesis data.

---

## 2. Test Matrix (Layer 1 Standalone Engine Tests)

| Benchmark ID | Test Group | Target Observable | Analytical / Trusted Reference | Pre-Defined Tolerance |
|---|---|---|---|---|
| `FLRW-01a` | Friedmann ODE | Flat Universe $E(0)$ normalization | $1.000000000000$ | $< 10^{-12}$ |
| `FLRW-01b` | Friedmann ODE | Matter-dominated asymptote $E(z=100)$ | $\sqrt{\Omega_m} \times 101^{1.5}$ | $< 0.01\%$ |
| `FLRW-01c` | Friedmann ODE | Radiation-dominated asymptote $E(z=10^4)$ | $\sqrt{\Omega_r} \times (10^4+1)^2$ | $< 0.01\%$ |
| `FLRW-02a` | Friedmann Time | Einstein-de Sitter flat age $t_0$ | $\frac{2}{3 H_0} \approx 13.04\text{ Gyr}$ ($H_0=50$) | $< 0.01\%$ |
| `FLRW-02b` | Friedmann Time | Planck 2018 concordance age $t_0$ | $13.79 \pm 0.05\text{ Gyr}$ | $< 0.1\%$ |
| `FLRW-03a` | Distances | Comoving distance small-$z$ limit | $c z / H_0$ for $z = 0.001$ | $< 0.01\%$ |
| `FLRW-03b` | Distances | Luminosity / Angular distance reciprocity | $d_L = (1+z)^2 d_A$ | $< 10^{-12}$ |
| `FLRW-04` | Cosmic Turnaround| Deceleration zero-crossing $q(z_{\text{acc}})=0$ | $(2\Omega_\Lambda / \Omega_m)^{1/3} - 1$ | $< 0.01\%$ |
| `CMB-01` | Recombination | Hu-Sugiyama $z_*$ for Planck 2018 | $1089.9 \pm 1.0$ | $< 0.1\%$ |
| `CMB-02` | Plasma Sound | Baryon drag sound speed $c_s(z_*)$ | $c / \sqrt{3(1 + R(z_*))}$ | $< 0.01\%$ |
| `CMB-03` | Sound Horizon | Comoving sound horizon $r_s(z_*)$ | $147.2 \pm 0.5\text{ Mpc}$ | $< 0.5\%$ |
| `CMB-04` | Acoustic Peaks | Primary peak multipole $\ell_1$ | $220.5 \pm 1.0$ | $< 0.5\%$ |
| `CMB-05` | Silk Damping | Damping scale suppression at $\ell = 2000$ | $D_{2000} \ll D_{220}$ | Ratio $< 0.15$ |
| `BBN-01` | Freeze-Out | Weak freeze-out neutron fraction $(n/p)_0$ | $\exp(-1.293 / 0.8) \approx 0.198$ | $< 2\%$ |
| `BBN-02` | Neutron Decay | Delayed neutron fraction at $T_{\text{BBN}}$ | $(n/p)_0 e^{-180/879.4} \approx 0.161$| $< 2\%$ |
| `BBN-03` | Primordial Helium| Helium-4 mass fraction $Y_p$ | $2(n/p) / (1 + n/p) \approx 0.245$ | $\pm 0.005$ |
| `BBN-04` | Deuterium Sensitivity| Deuterium $(D/H)$ anti-correlation with $\Omega_b$ | $(D/H)_{\text{high }\Omega_b} < (D/H)_{\text{low }\Omega_b}$ | Monotonic |
| `DM-01` | Dark Matter Halo | NFW enclosed mass analytical match | $4\pi \rho_0 r_s^3 [\ln(1+x) - x/(1+x)]$| $< 10^{-6}$ |
| `DM-02` | Rotation Curve | Flat rotation asymptote $v_c(r)$ | $v_c(30\text{ kpc}) > 0.85 v_{\max}$ | Flat curve |
| `DM-03` | Galactic Kinematics| NGC 3198 total rotation velocity at $20\text{ kpc}$| $149 \pm 5\text{ km/s}$ | $< 3\%$ |
| `ADV-01` | Adversarial | Degenerate $H_0 \le 0$ rejection | Graceful rejection / clamp | Safe handling |
| `ADV-02` | Adversarial | Dark energy Big Rip singular $w < -1$ | Handled cleanly up to horizon | Zero NaN/Inf |
