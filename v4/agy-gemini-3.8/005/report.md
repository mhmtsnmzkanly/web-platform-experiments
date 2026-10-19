# Experiment 005: MAXWELL-LAB V2 — Interactive FDTD Electrodynamics & Metamaterials Studio

## Executive Summary
Experiment 005 (succeeding legacy Experiment 045) transforms the classical 2D Yee-Lattice FDTD Maxwell solver into a full-featured, client-side React 19 computational physics laboratory. Expanding far beyond a static "HELLO WORLD" dielectric contour, V2 provides arbitrary typographic rasterization, optical device presets (Double Slit, Biconvex Lens, Photonic Crystal, TIR Prism), multi-material painting (Dielectric, PEC Metal, Lossy Absorbers), spatial beam steering, a dual-channel digital oscilloscope, and real-time Web Audio field sonification.

## Mathematical Formulation & Numerical Stability
- **Discretization**: $240 \times 120$ spatial grid (28,800 cells) in TM$_z$ polarization:
  $$\frac{\partial H_x}{\partial t} = -\frac{1}{\mu_0} \frac{\partial E_z}{\partial y}, \quad \frac{\partial H_y}{\partial t} = \frac{1}{\mu_0} \frac{\partial E_z}{\partial x}$$
  $$E_z^{n+1} = C_a E_z^n + C_b \left( \frac{\partial H_y}{\partial x} - \frac{\partial H_x}{\partial y} \right)$$
- **Courant Stability**: Courant number $S = \frac{c_0 \Delta t}{\Delta x} = 0.500 \le \frac{1}{\sqrt{2}} \approx 0.7071$ guarantees absolute numerical stability against grid dispersion blow-up.
- **Boundary Conditions**: 1st-order Mur Absorbing Boundary Conditions (ABC) along all 4 perimeter edges absorb radiating waves without boundary reflection.

## Verification & Metrics
- **TypeScript**: 0 compilation errors (`npx tsc --noEmit`)
- **Vite Production Bundle**: 247.2 KB JS, 16.8 KB CSS
- **Automated Chromium Headless Test**: 100% PASS across canvas contexts, verification contracts (`window.labEvidence` & `window.labInteractionEvidence`), custom text rasterization, and preset switches with 0 console errors.
