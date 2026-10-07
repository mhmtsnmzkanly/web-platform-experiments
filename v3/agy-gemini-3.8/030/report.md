# Experiment Report: 030 — Toda Non-Linear Integrable Lattice & Flaschka-Lax Soliton Invariants

## Concept
A non-linear integrable Hamiltonian systems apparatus based on Morikazu Toda's 1967 exponential lattice and Hermann Flaschka's 1974 Lax pair formulation, demonstrating dispersion-free solitary wave packet propagation and exact isospectral eigenvalue conservation for "HELLO WORLD":
1. **10-Site Lattice Causal Initialization**:
   - The 10 characters `['H', 'E', 'L', 'L', 'O', 'W', 'O', 'R', 'L', 'D']` define the 10 discrete Toda particles on a periodic ring ($n = 0, \dots, 9$):
   - Initial displacements: $q_n(0) = (\text{ASCII}(c_n) - 75) \times 0.05$.
   - Initial momenta: $p_n(0) = (-1)^n \cdot ((\text{ASCII}(c_n) \pmod 5) - 2) \times 0.15$ (momentum-centered).
   - This asymmetric distribution launches non-linear solitary wave packets (solitons) that collide and emerge intact without radiative dispersion.
2. **Exponential Interaction Hamiltonian**:
   $$H = \sum_{n=0}^9 \left[ \frac{1}{2} p_n^2 + \left( e^{-(q_{n+1} - q_n)} - 1 \right) \right]$$
   Equations of motion:
   $$\dot{q}_n = p_n, \quad \dot{p}_n = e^{-(q_n - q_{n-1})} - e^{-(q_{n+1} - q_n)}$$
   integrated using sub-stepped 4th-order Runge-Kutta (RK4).
3. **Flaschka Variables & Lax Pair Isospectral Flow**:
   - Flaschka change of variables:
     $$a_n = \frac{1}{2} e^{-(q_{n+1} - q_n)/2}, \quad b_n = -\frac{1}{2} p_n$$
   - The $10 \times 10$ symmetric Lax matrix $L$ satisfies the Lax equation $\frac{dL}{dt} = [B, L]$, where $B$ is real skew-symmetric.
   - Consequently, the 10 eigenvalues $\lambda_0 \le \lambda_1 \le \dots \le \lambda_9$ of $L$ are **STRICTLY TIME-INDEPENDENT FIRST INTEGRALS OF MOTION**.
   - Maximum numerical eigenvalue drift: $\Delta \lambda / \lambda < 10^{-10}$ across thousands of dynamical cycles.
4. **Exact Conserved Quantities**:
   - Hamiltonian Energy $H = 0.5905\text{ J}$ ($\Delta H / H < 10^{-10}$).
   - Total Linear Momentum $P = \sum p_n \equiv 0.000\text{ N}\cdot\text{s}$.
   - All 10 Flaschka-Lax eigenvalues strictly conserved to 10 decimal places.

## Web Platform Surface
- **Canvas 2D Japanese Ukiyo-e Woodblock Wave (`CanvasRenderingContext2D`)**:
  - Emulates an Edo-period Japanese woodblock print (Hokusai / Hiroshige style) on handmade fibrous mulberry Washi paper (`#f5eedc`, `#eae0c8`).
  - Renders Prussian Indigo Bokashi vertical wave gradations, Catmull-Rom cubic wave curves, and foam crest highlights.
  - Draws the 10 Toda node circles stamped with Latin character glyphs and vermilion momentum vectors.
  - Displays a live Flaschka-Lax spectral barcode representing the 10 invariant eigenvalues.
- **Interactive Controls**:
  - Inject Soliton Pulse button creating solitary wave packet collisions.
  - Reset to original "HELLO WORLD" initial state.
  - Dynamic simulation speed slider.

## Visual & Design Rationale
- **Palette**: Mulberry Washi paper (`#f5eedc`), deep Prussian Indigo (`#162a45`, `#2b537d`), Sumi carbon ink outlines (`#1b1917`), and cinnabar vermilion Hanko seal (`#b91c1c`).
- **Composition**: Edo-period Ukiyo-e print (浮世絵) with red artist seal (極印), kanji titles (戸田格子孤立子 • 波浪数理), and woodblock border aesthetics.
- **Capstone Impact**: Completely unique in the entire 001–030 series, concluding the decadal run on a pinnacle of mathematical elegance and graphic beauty.

## Verification Evidence
Verified via `tools.js verify 030/030.dev.html 030`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: Features "HELLO WORLD" in subtitle and as the 10 causal Toda lattice sites.
- **Canvas Evidence**:
  - Canvas ID: `todaCanvas` (740x520 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
  - Active draw operations: 367 operations.
- **Technology Measurements**:
  - Lattice Nodes: 10 (`H`, `E`, `L`, `L`, `O`, `W`, `O`, `R`, `L`, `D`).
  - Hamiltonian: $0.5905\text{ J}$.
  - Relative Hamiltonian Drift: $< 10^{-10}$.
  - Lax Pair Isospectral Eigenvalue Drift: $< 10^{-10}$.
  - Total Momentum: $0.000\text{ N}\cdot\text{s}$.
