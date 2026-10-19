# SCIENTIFIC_CONTRACT.md — Experiment 019: BAND-FORGE
## Electronic Band Structure, Topological Quantum Matter, Phonon Dispersions & Hofstadter Butterfly Studio

**Document Version:** 1.0  
**Status:** Approved & Binding before Engine Implementation  
**Standard:** WBE Hardening Protocol 2.0 (Post-SOL 6.1 Independent Audit)

---

### 1. Mathematical & Physical Models

`BAND-FORGE` models the quantum mechanics of electrons and lattice vibrations in periodic crystalline solids. The system spans five core computational domains:
1. **Lattice Geometry & Reciprocal Space**: Real-space Bravais lattice basis vectors $\mathbf{a}_1, \mathbf{a}_2$ and dual reciprocal lattice vectors $\mathbf{b}_1, \mathbf{b}_2$ satisfying $\mathbf{a}_i \cdot \mathbf{b}_j = 2\pi \delta_{ij}$. High-symmetry path parametrization through the first Brillouin zone (FBZ).
2. **Tight-Binding Electronic Hamiltonian**: Bloch's theorem single-particle tight-binding Schrödinger equation $H(\mathbf{k}) |\psi_n(\mathbf{k})\rangle = E_n(\mathbf{k}) |\psi_n(\mathbf{k})\rangle$ on 1D dimerized chains (SSH model) and 2D lattices (square, triangular, and honeycomb graphene).
3. **Topological Quantum Invariants & Berry Curvature**:
   - 1D Su-Schrieffer-Heeger (SSH) model: chiral symmetry, Zak phase, and topological winding number $\nu \in \{0, 1\}$.
   - 2D Haldane Model on honeycomb lattice with broken time-reversal symmetry: complex next-nearest-neighbor hopping $t_2 e^{\pm i\phi}$, staggered Semenoff mass $M$, Berry curvature $\Omega_{xy}(\mathbf{k})$, and quantized first Chern number $C = \frac{1}{2\pi} \int_{\text{BZ}} \Omega_{xy}(\mathbf{k}) d^2\mathbf{k} \in \mathbb{Z}$.
4. **Hofstadter Butterfly & Harper's Equation**: 2D square lattice in a perpendicular uniform magnetic field with flux per unit cell $\alpha = \Phi / \Phi_0 = p/q$. Discrete Harper equation eigenspectrum exhibiting self-similar fractal Cantor set structure and Diophantine Chern gap indices.
5. **Harmonic Phonon Lattice Dynamics**: Classical and quantum harmonic lattice vibrations governed by dynamical matrix $D(\mathbf{q})$. Exact acoustic and optical phonon dispersion branches $\omega(\mathbf{q})$ and sound velocity $v_s = \lim_{q\to 0} \frac{d\omega}{dq}$.

---

### 2. Governing Equations

#### 2.1 Real and Reciprocal Lattice Vectors
For 2D lattices with primitive vectors $\mathbf{a}_1, \mathbf{a}_2$:
$$\mathbf{b}_1 = 2\pi \frac{\mathbf{a}_2 \times \hat{\mathbf{z}}}{|\mathbf{a}_1 \times \mathbf{a}_2|}, \quad \mathbf{b}_2 = 2\pi \frac{\hat{\mathbf{z}} \times \mathbf{a}_1}{|\mathbf{a}_1 \times \mathbf{a}_2|}$$
- **Square Lattice**: $\mathbf{a}_1 = a(1, 0)$, $\mathbf{a}_2 = a(0, 1) \implies \mathbf{b}_1 = \frac{2\pi}{a}(1, 0)$, $\mathbf{b}_2 = \frac{2\pi}{a}(0, 1)$. High-symmetry path: $\Gamma(0,0) \to X(\frac{\pi}{a}, 0) \to M(\frac{\pi}{a}, \frac{\pi}{a}) \to \Gamma(0,0)$.
- **Graphene Honeycomb Lattice**: $\mathbf{a}_1 = a(\frac{3}{2}, \frac{\sqrt{3}}{2})$, $\mathbf{a}_2 = a(\frac{3}{2}, -\frac{\sqrt{3}}{2})$. Carbon-carbon bond length $a_{\text{cc}} = a/\sqrt{3} \approx 1.42\text{ \AA}$. High-symmetry path: $\Gamma(0,0) \to K(\frac{2\pi}{3a}, \frac{2\pi}{3\sqrt{3}a}) \to M(\frac{2\pi}{3a}, 0) \to \Gamma(0,0)$.

#### 2.2 Tight-Binding Electronic Dispersion
- **Square Lattice (Single Band)**:
  $$E(\mathbf{k}) = -2t (\cos k_x a + \cos k_y a) - 4t' \cos k_x a \cos k_y a$$
  Van Hove saddle-point singularity occurs at $X(\pi/a, 0)$ and $Y(0, \pi/a)$ where $\nabla_\mathbf{k} E = 0$, producing a logarithmic divergence in the Density of States $g(E) \propto \ln|E - E_{\text{vh}}|^{-1}$.
- **Graphene Honeycomb (Two Bands: $A$ and $B$ sublattices)**:
  $$H(\mathbf{k}) = \begin{pmatrix} 0 & f(\mathbf{k}) \\ f^*(\mathbf{k}) & 0 \end{pmatrix}$$
  $$f(\mathbf{k}) = -t \sum_{j=1}^3 e^{i \mathbf{k} \cdot \boldsymbol{\delta}_j} = -t \left( e^{i k_x a/\sqrt{3}} + 2 e^{-i k_x a / (2\sqrt{3})} \cos\left(\frac{k_y a}{2}\right) \right)$$
  Eigenvalues:
  $$E_\pm(\mathbf{k}) = \pm |f(\mathbf{k})| = \pm t \sqrt{1 + 4\cos\left(\frac{3 k_x a_{\text{cc}}}{2}\right)\cos\left(\frac{\sqrt{3} k_y a_{\text{cc}}}{2}\right) + 4\cos^2\left(\frac{\sqrt{3} k_y a_{\text{cc}}}{2}\right)}$$
  At the Dirac points $K = (\frac{2\pi}{3\sqrt{3}a_{\text{cc}}}, \frac{2\pi}{3a_{\text{cc}}})$ and $K'$, $|f(\mathbf{K})| = 0$, yielding linear conical dispersion $E_\pm(\mathbf{q}) \approx \pm \hbar v_F |\mathbf{q}|$ with Fermi velocity:
  $$v_F = \frac{3 t a_{\text{cc}}}{2\hbar} \approx 1.0 \times 10^6\text{ m/s} \quad (\text{for } t \approx 2.8\text{ eV}, a_{\text{cc}} \approx 1.42\text{ \AA})$$

#### 2.3 1D Su-Schrieffer-Heeger (SSH) Model
Dimerized 1D lattice with intra-cell hopping $t_1 = t - \delta t$ and inter-cell hopping $t_2 = t + \delta t$:
$$H(k) = \begin{pmatrix} 0 & t_1 + t_2 e^{-ika} \\ t_1 + t_2 e^{ika} & 0 \end{pmatrix} = d_x(k)\sigma_x + d_y(k)\sigma_y$$
$$d_x(k) = t_1 + t_2 \cos ka, \quad d_y(k) = t_2 \sin ka$$
- Energy eigenvalues: $E_\pm(k) = \pm \sqrt{d_x^2 + d_y^2} = \pm \sqrt{t_1^2 + t_2^2 + 2t_1 t_2 \cos ka}$.
- Topological Winding Number:
  $$\nu = \frac{1}{2\pi} \int_{-\pi}^\pi \frac{d_x \frac{d d_y}{dk} - d_y \frac{d d_x}{dk}}{d_x^2 + d_y^2} dk = \begin{cases} 0 & \text{if } t_1 > t_2 \text{ (Trivial band insulator)} \\ 1 & \text{if } t_1 < t_2 \text{ (Topological insulator with edge solitons)} \end{cases}$$
- For finite chain of $N$ unit cells under open boundary conditions (OBC), when $t_1 < t_2$, two zero-energy in-gap edge states appear at $E = 0$ exponentially localized to the ends: $\psi(x) \propto (t_1/t_2)^{x/a}$.

#### 2.4 2D Haldane Model (Quantum Anomalous Hall / Chern Insulator)
Honeycomb lattice with staggered Semenoff mass $M$ on $A/B$ sites, real nearest-neighbor hopping $t_1$, and complex next-nearest-neighbor hopping $t_2 e^{\pm i\phi}$:
$$H(\mathbf{k}) = d_0(\mathbf{k})\mathbb{I} + d_x(\mathbf{k})\sigma_x + d_y(\mathbf{k})\sigma_y + d_z(\mathbf{k})\sigma_z$$
$$d_x(\mathbf{k}) = -t_1 \sum_{i=1}^3 \cos(\mathbf{k} \cdot \boldsymbol{\delta}_i), \quad d_y(\mathbf{k}) = -t_1 \sum_{i=1}^3 \sin(\mathbf{k} \cdot \boldsymbol{\delta}_i)$$
$$d_z(\mathbf{k}) = M - 2 t_2 \sin\phi \sum_{j=1}^3 \sin(\mathbf{k} \cdot \mathbf{v}_j)$$
where $\mathbf{v}_1 = \mathbf{a}_2, \mathbf{v}_2 = -\mathbf{a}_1, \mathbf{v}_3 = \mathbf{a}_1 - \mathbf{a}_2$.
- Dirac mass at $K$ and $K'$:
  $$m_D(K) = M - 3\sqrt{3} t_2 \sin\phi, \quad m_D(K') = M + 3\sqrt{3} t_2 \sin\phi$$
- Chern Number of lower band:
  $$C = \frac{1}{2}\left[\operatorname{sgn}(m_D(K)) - \operatorname{sgn}(m_D(K'))\right] = \begin{cases} +1 & \text{if } |M| < 3\sqrt{3} t_2 \sin\phi \text{ and } \sin\phi > 0 \\ -1 & \text{if } |M| < -3\sqrt{3} t_2 \sin\phi \text{ and } \sin\phi < 0 \\ 0 & \text{if } |M| > 3\sqrt{3} |t_2 \sin\phi| \end{cases}$$
- Berry Curvature across 2D Brillouin Zone:
  $$\Omega_{xy}(\mathbf{k}) = \frac{1}{2} \frac{\mathbf{d} \cdot \left(\partial_{k_x} \mathbf{d} \times \partial_{k_y} \mathbf{d}\right)}{|\mathbf{d}|^3}$$
  Integrating $\frac{1}{2\pi} \int_{\text{BZ}} \Omega_{xy}(\mathbf{k}) d^2\mathbf{k}$ yields exactly $C \in \{-1, 0, +1\}$ via gauge-invariant Fukui-Hatsugai-Suzuki link variables.

#### 2.5 Hofstadter Butterfly & Harper's Equation
Tight-binding electrons on a 2D square lattice in Landau gauge $\mathbf{A} = (0, Bx, 0)$ with magnetic flux per plaquette $\Phi = B a^2$ and flux fraction $\alpha = \Phi / \Phi_0 = p/q$ ($\Phi_0 = h/e$):
The 2D problem reduces to the 1D Harper difference equation for wave amplitude $\psi_n$:
$$e^{i k_x a} \psi_{n+1} + e^{-i k_x a} \psi_{n-1} + 2\cos(2\pi n \alpha - k_y a) \psi_n = E \psi_n$$
For rational $\alpha = p/q$, this forms a $q \times q$ tridiagonal periodic secular matrix with $q$ sub-bands:
$$H_{q \times q}(k_x, k_y) = \begin{pmatrix}
2\cos(k_y) & e^{-i k_x} & 0 & \dots & e^{i k_x} \\
e^{i k_x} & 2\cos(2\pi \alpha - k_y) & e^{-i k_x} & \dots & 0 \\
\vdots & \ddots & \ddots & \ddots & \vdots \\
e^{-i k_x} & 0 & \dots & e^{i k_x} & 2\cos(2\pi(q-1)\alpha - k_y)
\end{pmatrix}$$
- Total energy bandwidth is strictly bounded: $E \in [-4t, +4t]$.
- Spectrum has exact particle-hole symmetry $E \leftrightarrow -E$ and flux period $\alpha \to \alpha + 1$, $\alpha \to 1 - \alpha$.

#### 2.6 Diatomic Lattice Phonon Dynamics
1D chain of alternating masses $M_1$ and $M_2$ connected by spring constant $C_s$ with lattice constant $a$:
Equations of motion:
$$M_1 \ddot{u}_n = C_s (v_n + v_{n-1} - 2u_n), \quad M_2 \ddot{v}_n = C_s (u_{n+1} + u_n - 2v_n)$$
Normal mode ansatz $u_n = U e^{i(q n a - \omega t)}, v_n = V e^{i(q n a - \omega t)}$ leads to the secular determinant $\det(D(q) - \omega^2 I) = 0$:
$$\omega_\pm^2(q) = C_s \frac{M_1 + M_2}{M_1 M_2} \left[ 1 \pm \sqrt{1 - \frac{4 M_1 M_2}{(M_1 + M_2)^2} \sin^2\left(\frac{q a}{2}\right)} \right]$$
- **Acoustic branch ($\omega_-$)**: $\omega_-(q \to 0) \approx v_s |q|$ where speed of sound is $v_s = a \sqrt{\frac{C_s}{2(M_1 + M_2)}}$.
- **Optical branch ($\omega_+$)**: $\omega_+(q \to 0) = \sqrt{\frac{2 C_s (M_1 + M_2)}{M_1 M_2}}$ (non-zero finite frequency at zone center).
- **Phonon Band Gap**: $\Delta \omega = \omega_+(\pi/a) - \omega_-(\pi/a) = \sqrt{2 C_s / \min(M_1, M_2)} - \sqrt{2 C_s / \max(M_1, M_2)}$.

---

### 3. Dimensional Analysis & Unit Ledger

| Quantity | Symbol | Internal Units | Standard Unit | Conversion / Value |
|---|---|---|---|---|
| Energy | $E, t$ | $\text{eV}$ | Joules ($\text{J}$) | $1\text{ eV} = 1.602176634 \times 10^{-19}\text{ J}$ |
| Distance / Lattice constant | $a, a_{\text{cc}}$ | $\text{\AA}$ | Meters ($\text{m}$) | $1\text{ \AA} = 10^{-10}\text{ m} = 0.1\text{ nm}$ |
| Wavevector | $\mathbf{k}, \mathbf{q}$ | $\text{\AA}^{-1}$ | $\text{m}^{-1}$ | $1\text{ \AA}^{-1} = 10^{10}\text{ m}^{-1}$ |
| Reduced Planck Constant | $\hbar$ | $\text{eV}\cdot\text{s}$ | $\text{J}\cdot\text{s}$ | $6.582119569 \times 10^{-16}\text{ eV}\cdot\text{s}$ |
| Electron Mass | $m_e$ | $\text{eV}/c^2$ | $\text{kg}$ | $9.1093837 \times 10^{-31}\text{ kg}$ |
| Elementary Charge | $e$ | $\text{C}$ | Coulomb | $1.602176634 \times 10^{-19}\text{ C}$ |
| Magnetic Flux Quantum | $\Phi_0$ | $\text{T}\cdot\text{\AA}^2$ | $\text{Wb}$ | $h/e = 4.135667696 \times 10^{-15}\text{ Wb}$ |
| Phonon Frequency | $\omega$ | $\text{rad/ps}$ or $\text{THz}$ | $\text{s}^{-1}$ | $1\text{ THz} = 10^{12}\text{ s}^{-1} \implies \hbar\omega \approx 4.136\text{ meV}$ |
| Sound Speed | $v_s$ | $\text{m/s}$ or $\text{km/s}$ | $\text{m/s}$ | $1\text{ km/s} = 10^3\text{ m/s}$ |
| Hall Conductance | $\sigma_{xy}$ | $e^2/h$ | $\Omega^{-1}$ (Siemens) | $e^2/h = (25812.807 \ \Omega)^{-1}$ |

---

### 4. Scientific Fidelity Classification

- **Tight-Binding Graphene & Square Dispersion**: **LEVEL A** (Exact analytical eigenvalues $E(\mathbf{k})$ matched to machine precision $< 10^{-12}\text{ eV}$).
- **SSH 1D Model & Zero-Energy Edge States**: **LEVEL A** (Exact numerical diagonalization with boundary states at $E=0 \pm 10^{-12}\text{ eV}$ and analytical winding number).
- **Haldane Model & Fukui-Hatsugai-Suzuki Chern Number**: **LEVEL A** (Discrete gauge-invariant plaquette formula yielding strictly integer quantized Chern numbers $C \in \{-1, 0, +1\}$ within tolerance $\pm 10^{-7}$).
- **Hofstadter Butterfly Eigenspectrum**: **LEVEL A** (Exact Harper secular determinant eigenvalues for rational flux fractions $p/q$).
- **Diatomic Lattice Phonon Dynamics**: **LEVEL A** (Exact analytical dispersion branches $\omega_\pm(q)$ and zone-center sound speed).
- **Continuous Density of States (DOS)**: **LEVEL B** (Tetrahedron / Gaussian-broadened Brillouin zone summation with bounded grid convergence).

---

### 5. Equation-to-Code Traceability Table

| Scientific Quantity | Governing Equation | Implementation Function | Source File | Analytical / Reference Benchmark |
|---|---|---|---|---|
| Graphene Energy Dispersion | $E_\pm(\mathbf{k}) = \pm t \sqrt{1 + 4\cos(\dots) + 4\cos^2(\dots)}$ | `computeGrapheneEnergy(kx, ky, t)` | `TightBindingSolver.ts` | $E(K) = 0$, $E(\Gamma) = \pm 3t$, $E(M) = \pm t$ |
| Square Lattice Dispersion | $E(\mathbf{k}) = -2t(\cos k_x a + \cos k_y a)$ | `computeSquareEnergy(kx, ky, t)` | `TightBindingSolver.ts` | $E(0,0) = -4t$, $E(\pi, \pi) = +4t$, $E(\pi, 0) = 0$ |
| Graphene Fermi Velocity | $v_F = \frac{3 t a_{\text{cc}}}{2\hbar}$ | `computeFermiVelocity(t, acc)` | `TightBindingSolver.ts` | $v_F = 1.00 \times 10^6\text{ m/s}$ for $t=2.8\text{ eV}, a=1.42\text{\AA}$ |
| SSH Hamiltonian Matrix | $H(k) = d_x(k)\sigma_x + d_y(k)\sigma_y$ | `buildSshMatrix(k, t1, t2, N)` | `TopologicalMatter.ts` | Edge zero-modes at $E=0$ when $t_1 < t_2$ |
| SSH Winding Number | $\nu = \frac{1}{2\pi} \oint \frac{d_x d d_y - d_y d d_x}{d_x^2 + d_y^2}$ | `computeSshWindingNumber(t1, t2)` | `TopologicalMatter.ts` | $\nu = 1$ for $t_1 < t_2$, $\nu = 0$ for $t_1 > t_2$ |
| Haldane 2D Hamiltonian | $H(\mathbf{k}) = \mathbf{d}(\mathbf{k}) \cdot \boldsymbol{\sigma}$ | `buildHaldaneHamiltonian(kx, ky, params)`| `TopologicalMatter.ts` | Mass gap $m_D(K) = M - 3\sqrt{3}t_2\sin\phi$ |
| Berry Curvature & Chern | $\Omega_{xy} = \frac{1}{2} \frac{\mathbf{d}\cdot(\partial_x \mathbf{d} \times \partial_y \mathbf{d})}{|\mathbf{d}|^3}$ | `computeChernNumberFHS(params, gridN)` | `TopologicalMatter.ts` | $C = \pm 1$ inside phase boundary, $C = 0$ outside |
| Harper Secular Matrix | $\det(H_{q\times q} - E I) = 0$ | `computeHarperSpectrum(p, q, kx, ky)` | `HofstadterButterfly.ts` | Bandwidth $\subset [-4t, +4t]$, symmetric around $E=0$ |
| Phonon Dispersion Branches | $\omega_\pm^2(q) = C_s \frac{M_1+M_2}{M_1 M_2}(1 \pm \sqrt{\dots})$ | `computeDiatomicPhonon(q, M1, M2, Cs)` | `PhononDispersionEngine.ts` | $\omega_-(0) = 0$, $\omega_+(0) = \sqrt{2C_s(M_1+M_2)/(M_1 M_2)}$ |
| Sound Speed | $v_s = a \sqrt{C_s / [2(M_1+M_2)]}$ | `computeSoundSpeed(a, Cs, M1, M2)` | `PhononDispersionEngine.ts` | $\lim_{q\to 0} \frac{\omega_-(q)}{q} = v_s$ |

---

### 6. Boundary Conditions & Limiting Behavior

- **Periodic Boundary Conditions (PBC)**: Used for infinite bulk crystal calculations, Bloch wavefunctions, and Brillouin zone paths.
- **Open Boundary Conditions (OBC)**: Used for finite-sized nanoribbons (zigzag/armchair graphene) and finite SSH chains ($N$ dimers), enabling explicit detection and spatial isolation of topological edge solitons and chiral Fermi-arc states.
- **Limiting Behavior**:
  - As $t_2 \to 0$, Haldane model reduces identically to pristine graphene or boron-nitride (if $M \ne 0$).
  - As $M_2 \to M_1$, diatomic phonon spectrum smoothly merges into monatomic dispersion with folded Brillouin zone and acoustic gap $\Delta \omega \to 0$.
  - As $\alpha = p/q \to 0$, Harper butterfly bands merge into classical Landau levels $E_n = \hbar \omega_c (n + 1/2)$.

---

### 7. Explicitly Unsupported Effects & Honest Disclosures

- Electron-electron Coulomb repulsion (Hubbard $U$) is treated in the non-interacting single-particle approximation ($U = 0$). Strongly correlated Mott insulating states are explicitly excluded from quantitative claims.
- Anharmonic phonon-phonon interactions (Umklapp thermal resistivity) are excluded; lattice vibrations are strictly harmonic.
- Relativistic spin-orbit coupling (Kane-Mele $Z_2$ model) is treated separately from the spinless Haldane model.
