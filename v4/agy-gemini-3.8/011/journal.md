# Engineering Journal — Experiment 011: AERO-TUNNEL

### 2026-10-19 — Project Origination & Architecture
Following user directive `"Kendi fikirlerine donebilirsin"` and completion/deployment of Experiment 010, originated **AERO-TUNNEL**: an interactive 2D computational fluid dynamics (CFD) wind tunnel and aerodynamic flight testbed powered by the Lattice Boltzmann Method (D2Q9 BGK formulation).

Key architectural decisions:
1. **D2Q9 Lattice Boltzmann Method (LBM)**:
   - Contiguous typed `Float32Array` buffers for 9 distribution functions across a $220 \times 90$ grid (19,800 lattice cells).
   - In-place BGK collision operator with relaxation time $\tau$ mapped to kinematic viscosity $\nu = \frac{1}{3}(\tau - 0.5)$.
   - Half-way bounce-back boundary condition on solid obstacle boundaries.
   - Zou-He velocity inlet at $x=0$, convective non-reflective outflow at $x=N_x-1$, and free-slip wind tunnel walls at top and bottom.
2. **Exact Momentum-Exchange Force Integration**:
   - Summing momentum transfer across all solid-fluid boundary links directly computes aerodynamic Lift ($C_L$), Drag ($C_D$), and Lift-to-Drag ratio ($L/D$).
   - Real-time zero-crossing oscillation tracker computes the physical vortex shedding frequency (Strouhal number $St \approx 0.2$).
3. **Parametric NACA 4-Digit Airfoil Geometry**:
   - Generates exact coordinates for any 4-digit profile (camber $m$, position $p$, thickness $t$).
   - Quarter-chord rotation matrix supports continuous angle of attack adjustment $\alpha \in [-25^\circ, +25^\circ]$.
   - Additional curated profiles: Circular cylinder (von Kármán vortex street), flat plate, supersonic wedge, and custom obstacle brush.
4. **Interactive Flow Field Visualizations & Smoke Tracers**:
   - 60 FPS HTML5 Canvas with pre-computed colormap lookup tables for Velocity magnitude (Turbo), Pressure deviation (Isobar), and Vorticity (Bipolar).
   - Streakline particle rack advects using bilinear velocity interpolation.
5. **Interactive Glider Flight Simulation**:
   - Real-time glider dynamics allowing users to pilot an aircraft through wind tunnel airflow, managing pitch attitude, avoiding aerodynamic stall, and optimizing cruise glide ratio.
6. **100% Procedural Web Audio Aerodynamic Sonification**:
   - Zero audio samples. Boundary layer turbulent noise hiss, vortex shedding Strouhal tone, and stall buffet sub-bass rumble.

---

### Implementation Milestones
- `src/types/index.ts`: Defined `AirfoilProfile`, `AeroMetrics`, `ChordPressurePoint`, `PolarPoint`, and `GliderState`.
- `src/airfoils/AirfoilGenerator.ts`: Built NACA 4-digit mathematical generator, polygon rasterizer, and 7 curated presets.
- `src/lbm/LatticeBoltzmannSolver.ts`: Implemented D2Q9 BGK solver, momentum-exchange force integration, vorticity calculation, and chord pressure sampling.
- `src/audio/AeroSonificationEngine.ts`: Implemented procedural turbulence noise, vortex shedding hum, and stall rumble with dynamics limiter.
- `src/components/WindTunnelCanvas.tsx`: Built 60 FPS canvas with colormaps, smoke streamlines, and glider flight rendering.
- `src/components/AerodynamicsDeck.tsx`: Built control deck with live $C_p(x)$ SVG plot, polar diagrams, and NACA geometry morphing sliders.
- `src/components/FlightSimulatorHUD.tsx`: Built aviation flight instrumentation HUD for glider dynamics test mode.
- `src/components/DataExportModal.tsx`: Built CSV/JSON data exporter.

---

### Automated Verification
- Headless automated Chromium test suite (`test-run.cjs`) executed via Puppeteer.
- Verified wind tunnel canvas, 7 aerodynamic presets, 4 visualization modes, angle-of-attack slider, glider flight mode, and data export modal.
- Passed with 0 console errors and 0 unhandled exceptions.
