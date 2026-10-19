# VALIDATION PLAN: STELLAR-FORGE (Experiment 018)

**Target**: Standalone Numerical Engine, React Integration, and Browser Runtime  
**Protocol Version**: 2.0 (Post-Audit Hardening)  
**Date**: October 19, 2026

---

## 1. Validation Philosophy & Tolerances Defined *A Priori*

In accordance with Protocol 2.0 Part II and VII, all tolerances are defined **prior** to running tests based on the theoretical order of the Runge-Kutta 4 integrator ($\mathcal{O}(h^4)$) and IEEE 754 double-precision floating point limits. Tolerances will not be weakened after inspecting test results.

| Test Case | Target Quantity | Analytical / Reference Value | Maximum Allowable Relative Error |
|---|---|---|---|
| **$n = 0$ Analytical Polytrope** | Surface root $\xi_1$ | $\sqrt{6} \approx 2.44948974$ | $1.0 \times 10^{-4}$ (0.01%) |
| **$n = 0$ Analytical Polytrope** | Mass parameter $\omega_0$ | $\frac{2\sqrt{6}}{3} \times \frac{3}{2} \approx 4.89897948$ | $1.0 \times 10^{-4}$ (0.01%) |
| **$n = 1$ Analytical Polytrope** | Surface root $\xi_1$ | $\pi \approx 3.14159265$ | $1.0 \times 10^{-4}$ (0.01%) |
| **$n = 1$ Analytical Polytrope** | Mass parameter $\omega_1$ | $\pi \approx 3.14159265$ | $1.0 \times 10^{-4}$ (0.01%) |
| **$n = 1.5$ Benchmark** | Surface root $\xi_1$ | $3.65375$ (Chandrasekhar 1939) | $2.0 \times 10^{-4}$ (0.02%) |
| **$n = 1.5$ Benchmark** | Mass parameter $\omega_{1.5}$ | $2.71406$ | $2.0 \times 10^{-4}$ (0.02%) |
| **$n = 3.0$ Benchmark** | Surface root $\xi_1$ | $6.89685$ | $3.0 \times 10^{-4}$ (0.03%) |
| **$n = 3.0$ Benchmark** | Mass parameter $\omega_{3.0}$ | $2.01824$ | $3.0 \times 10^{-4}$ (0.03%) |
| **Chandrasekhar Mass Limit** | $M_{\text{Ch}} (\mu_e = 2)$ | $1.442 M_\odot$ ($2.868 \times 10^{30}\text{ kg}$) | $1.0 \times 10^{-3}$ (0.1%) |
| **Internal Mass Integral Conservation** | $\frac{\left\| \int_0^R 4\pi r^2 \rho dr - M(R) \right\|}{M(R)}$ | $0.0$ | $1.0 \times 10^{-3}$ (0.1%) |
| **Numerical Convergence** | Convergence ratio $\frac{E(2h)}{E(h)}$ | $16.0$ ($\mathcal{O}(h^4)$) | $15.0 \le \text{Ratio} \le 17.0$ |

---

## 2. Test Architecture: Three Validation Layers

```
Layer 1: Standalone Numerical & Physical Engine Tests (tests/run-engine-tests.mjs)
  ├── 1.1 Analytical solutions (n=0, n=1)
  ├── 1.2 Benchmark numerical solutions (n=1.5, n=3.0)
  ├── 1.3 Fourth-order grid convergence (h = 0.02, 0.01, 0.005)
  ├── 1.4 Mass conservation & density volume integral consistency
  ├── 1.5 Nuclear reaction rate Gamow scaling and crossover temperature
  ├── 1.6 Chandrasekhar limit derivation from fundamental constants
  ├── 1.7 TOV general relativistic mass-radius turning point
  └── 1.8 Adversarial inputs (infinite n, negative density, zero radius)

Layer 2: State Lifecycle & UI Integration Tests
  ├── 2.1 Unified simulation clock: pause freezes all subsystems
  ├── 2.2 Control-to-engine contract: parameter change propagates to physics
  ├── 2.3 Single-owner state: no duplicate mutations in React reducers
  ├── 2.4 Telemetry provenance: all displayed numbers have identifiable sources
  └── 2.5 Preset switching initializes physically valid stellar models

Layer 3: Browser Runtime & Performance Verification (test-run.cjs)
  ├── 3.1 Page load & canvas element initialization
  ├── 3.2 High-DPI / Retina coordinate scaling without offset
  ├── 3.3 Web Audio context gesture initialization & master dynamics limiting
  ├── 3.4 All 4 suite modes switchable without uncaught exceptions
  ├── 3.5 Real-time frame timing: measure actual render interval
  └── 3.6 Data export roundtrip: JSON & CSV validation
```

---

## 3. Mandatory Failure Modes to Test Adversarially

1. **Origin Singularity at $r = 0$**:
   Verify that $\xi \to 0$ does not divide by zero or emit `NaN`, and that the series expansion transitions smoothly to RK4.
2. **Surface Root Root-Finding**:
   Ensure $\theta(\xi_1) = 0$ is detected precisely by root bracketing without overshooting into negative density $\theta < 0$.
3. **No Numerical Clamping**:
   Pressure, density, and temperature must remain positive purely as a consequence of correct differential evolution, not forced math clamps.
4. **CNO vs $p\text{–}p$ Crossover**:
   Test that $\epsilon_{pp} > \epsilon_{\text{CNO}}$ for $T < 1.7 \times 10^7\text{ K}$, and $\epsilon_{\text{CNO}} > \epsilon_{pp}$ for $T > 1.9 \times 10^7\text{ K}$.
5. **No Synthetic Telemetry**:
   Displayed core temperature, central pressure, and luminosity must be direct analytical/numerical outputs of the stellar profile, never hardcoded display strings.
