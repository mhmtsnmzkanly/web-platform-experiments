# VALIDATION_PLAN.md — Experiment 019: BAND-FORGE
## Pre-Development Numerical Validation Plan

**Document Version:** 1.0  
**Status:** Approved & Binding before UI Development  
**Standard:** WBE Hardening Protocol 2.0 (Post-SOL 6.1 Independent Audit)

---

### 1. Test Matrix Overview

All numerical algorithms must pass standalone automated validation in `019/tests/run-engine-tests.mjs` before integration with React, Canvas, or Web Audio.

| Category | Test Identifier | Target Function | Reference Case / Theoretical Expectation | A Priori Tolerance |
|---|---|---|---|---|
| **1. Analytical Reference** | `TB-01` | Graphene Energy | $E(K) = 0$ at Dirac point $(\frac{2\pi}{3\sqrt{3}a}, \frac{2\pi}{3a})$ | $|E| < 10^{-12}\text{ eV}$ |
| **1. Analytical Reference** | `TB-02` | Graphene Bandwidth | $E(\Gamma) = \pm 3t$, $E(M) = \pm t$ | Error $< 10^{-10}\text{ eV}$ |
| **1. Analytical Reference** | `TB-03` | Square Lattice Extreme | $E(\Gamma) = -4t$, $E(M) = +4t$, $E(X) = 0$ | Error $< 10^{-12}\text{ eV}$ |
| **1. Analytical Reference** | `TB-04` | Graphene Fermi Velocity | $v_F = \frac{3 t a_{\text{cc}}}{2\hbar}$ for $t=2.8\text{ eV}, a_{\text{cc}}=1.42\text{\AA}$ | Rel. Error $< 0.01\%$ ($1.006 \times 10^6\text{ m/s}$) |
| **1. Analytical Reference** | `SSH-01`| SSH Bulk Energy Gap | $\Delta E = 2|t_1 - t_2|$ at $k=\pi/a$ | Error $< 10^{-12}\text{ eV}$ |
| **1. Analytical Reference** | `SSH-02`| SSH Edge State (OBC) | For $N=20$ dimers, $t_1=0.5, t_2=1.5$, in-gap states at $E=0$ | $|E_{\text{mid}}| < 10^{-8}\text{ eV}$ |
| **1. Analytical Reference** | `HAL-01`| Haldane Mass Gap at K | $m_D(K) = M - 3\sqrt{3}t_2 \sin\phi$ | Error $< 10^{-12}\text{ eV}$ |
| **1. Analytical Reference** | `HAL-02`| Haldane Phase Boundary | Gap closes ($m_D(K)=0$) at $M = 3\sqrt{3}t_2\sin\phi$ | Error $< 10^{-12}\text{ eV}$ |
| **1. Analytical Reference** | `PHON-01`| Diatomic Phonon Gamma | $\omega_-(0) = 0$ (Acoustic), $\omega_+(0) = \sqrt{2C_s(M_1+M_2)/(M_1 M_2)}$ | Error $< 10^{-10}\text{ rad/s}$ |
| **1. Analytical Reference** | `PHON-02`| Sound Velocity Limit | $\lim_{q\to 0} \frac{\omega_-(q)}{q} = a\sqrt{\frac{C_s}{2(M_1+M_2)}}$ | Rel. Error $< 0.05\%$ at $q = 10^{-4}$ |
| **2. Topological Invariant** | `TOP-01`| SSH Winding Number | $\nu = 1$ when $t_1 < t_2$, $\nu = 0$ when $t_1 > t_2$ | Strict Integer $\nu \in \{0, 1\}$ |
| **2. Topological Invariant**| `TOP-02`| Haldane Chern Number | $C = +1$ for $M=0, \phi=\pi/2$, $C = 0$ for $M=5, \phi=\pi/2$ | Strict Integer $C \in \{-1, 0, 1\}$ ($\pm 10^{-6}$) |
| **3. Conservation & Bounds** | `CON-01`| Harper Energy Bounds | All eigenvalues $E \in [-4t, +4t]$ for any flux $\alpha = p/q$ | $\max(|E|) \le 4.0000001 t$ |
| **3. Conservation & Bounds** | `CON-02`| Harper Particle-Hole | Spectrum invariant under $E \to -E$ | Symmetry residual $< 10^{-10}$ |
| **4. Convergence** | `CONV-01`| Chern Grid Convergence | Fukui-Hatsugai-Suzuki Chern on $N \times N$ grid ($N=12, 24, 48$) | Monotonic convergence to exact integer |
| **5. Adversarial / Edge** | `ADV-01`| Zero Hopping Limit | $t_1=0, t_2=0 \implies$ flat zero-energy band | $E \equiv 0$ everywhere |
| **5. Adversarial / Edge** | `ADV-02`| Extreme Mass Ratio | $M_1 \gg M_2$ ($1000:1$) $\implies$ flat heavy band, high light frequency | No NaN, no crash, finite real $\omega$ |
| **5. Adversarial / Edge** | `ADV-03`| Invalid Flux Index | Negative $p$ or $q \le 0 \implies$ safe validation error rejection | Throws descriptive error |

---

### 2. A Priori Test Criteria & Protocols

1. **Analytical Exactness**: Closed-form solutions must evaluate to near-machine precision ($< 10^{-10}\text{ eV}$).
2. **Topological Quantization**: Chern number must be evaluated using the gauge-invariant Fukui-Hatsugai-Suzuki link variable formulation:
   $$U_\mu(\mathbf{k}) = \frac{\langle \psi(\mathbf{k}) | \psi(\mathbf{k} + \hat{\boldsymbol{\mu}}) \rangle}{|\langle \psi(\mathbf{k}) | \psi(\mathbf{k} + \hat{\boldsymbol{\mu}}) \rangle|}, \quad F_{12}(\mathbf{k}) = \ln\left( U_1(\mathbf{k}) U_2(\mathbf{k} + \hat{\mathbf{1}}) U_1^{-1}(\mathbf{k} + \hat{\mathbf{2}}) U_2^{-1}(\mathbf{k}) \right)$$
   Summing $\frac{1}{2\pi i} \sum_{\mathbf{k}} F_{12}(\mathbf{k})$ yields strictly quantized integers even on coarse grids.
3. **No Numerical Clamping**: Clamps cannot be used to artificially force integer Chern numbers or zero-energy states. The physics engine must genuinely produce the quantized value.
