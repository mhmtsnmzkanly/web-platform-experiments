# Experiment 006: NEURO-FLUID — Autonomous SPH Hydrodynamics & Morphogenesis Studio

## Executive Summary
Experiment 006 is an original autonomous interactive physical simulation created under the V4 continuous expansion charter. It couples a 2D Smoothed Particle Hydrodynamics (SPH) Navier-Stokes fluid mechanics engine with a Gray-Scott reaction-diffusion Turing morphogenesis substrate. Running 100% client-side with React 19 and HTML5 Canvas, it integrates real-time fluid sonification, spatial uniform grid acceleration, and rich physical agency.

## Core Architectural Systems

1. **Smoothed Particle Hydrodynamics (SPH) Navier-Stokes Solver**:
   - $O(N)$ spatial grid cell hashing enabling up to 2,500 interactive particles at 60 FPS without $O(N^2)$ neighbor bottlenecks.
   - Poly6 smoothing kernel for local fluid density estimation.
   - Spiky gradient kernel for symmetric pressure forces derived via the Tait equation of state.
   - Viscosity Laplacian kernel for dynamic shear and viscous dissipation.
   - Symplectic Euler integration with velocity clamping, boundary restitution, and normal obstacle reflection.

2. **Gray-Scott Reaction-Diffusion Substrate**:
   - Continuous 2D chemical field computing Laplacian diffusion of species $U$ and $V$.
   - Interactive morphogenesis presets: Mitosis Spots, Coral Labyrinth, Spiral Waves, and Soliton Chaos.
   - Coupled Feedback: Bioluminescent fluid particles deposit chemical species $V$ along their paths, creating organic glowing trails that evolve into Turing patterns.

3. **High-Agency User Interaction & Tools**:
   - **Fluid Emitter**: Spray droplets with custom velocity and multi-fluid density types (Water, Heavy Viscous Oil, Bioluminescent Green).
   - **Stir Impulse**: Interactive mouse gesture transferring kinetic momentum into the fluid velocity field.
   - **Obstacle Sculpting**: Draw circular and rectangular walls to deflect, channel, and dam fluids.
   - **Spinning Vortices**: Place rotational force wells with adjustable clockwise/counter-clockwise strength.
   - **Procedural Presets**: Dam Break collapse, Karman Vortex Street behind cylindrical obstacles, and Turing Coral Morphogenesis.

4. **Procedural Web Audio Acoustic Sonification**:
   - Zero-dependency procedural Web Audio synthesis.
   - Dynamic fluid turbulence ambience with pink noise passed through a bandpass filter tracking average fluid kinetic energy.
   - Droplet bubble plucks on particle emission and boundary collisions.
   - Low-frequency pressure wave detonation boom on dam collapses.

## Verification Matrix
- **TypeScript (`npx tsc --noEmit`)**: 0 errors
- **Vite Production Bundle**: 254.00 KB JS, 20.62 KB CSS
- **Automated Headless Chromium Test**: 100% PASS across canvas initialization, live SPH particle population, Navier-Stokes Reynolds telemetry, interactive particle emission, tool switching, Karman vortex preset loading, and parameter sliders with 0 uncaught errors.
