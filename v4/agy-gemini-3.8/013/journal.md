# Engineering Journal — Experiment 013: SEISMIC-LAB

### 2026-10-19 — Project Origination & Architecture
Following user directive `"Kendi fikirlerine donebilirsin"` and completion, dual auditing, remediation, and deployment of Experiment 012 (`OPTICA-FORGE`), originated **SEISMIC-LAB**: an interactive browser-based geophysical elastodynamics, tectonic fault rupture, seismograph waveform recording, and shallow-water tsunami mechanics studio.

Key architectural decisions:
1. **2D Velocity-Stress Elastodynamic Wave Solver (`ElastodynamicsSolver.ts`)**:
   - $240 \times 120$ staggered finite-difference grid covering a $240\text{ km} \times 120\text{ km}$ crustal/mantle slice.
   - Solves coupled momentum balance and Hooke's constitutive equations for particle velocities $v_x, v_z$ and stresses $\sigma_{xx}, \sigma_{zz}, \sigma_{xz}$.
   - Realistic free-surface boundary condition at $z = 0$ ($\sigma_{zz} = 0, \sigma_{xz} = 0$), synthesizing retrograde elliptical Rayleigh surface waves without artificial damping.
   - 18-cell absorbing sponge damping layer along lateral and bottom boundaries eliminating boundary reflections.
   - Evaluates curl (rotational shear S-waves) and divergence (compressional P-waves) for distinct visual diagnostic modes.
2. **Dynamic Tectonic Fault Rupture Model (`FaultRuptureEngine.ts`)**:
   - Implements 5 curated geophysical scenarios: Cascadia Megathrust Subduction ($M_w 9.0$), San Andreas Strike-Slip ($M_w 7.8$), Sedimentary Basin Wave Trap ($M_w 7.2$), Wadati-Benioff Deep Slab ($M_w 7.5$), and Volcanic Caldera Collapse ($M_w 6.8$).
   - Double-couple radiation pattern with dip angle rotation, shear stress drop, and exponential moment magnitude scaling.
3. **Multi-Station Seismograph Network (`SeismographNetwork.ts`)**:
   - 4 deployable surface seismometer stations across the horizontal profile.
   - Real-time rolling seismograms recording vertical $v_z(t)$ (Cyan) and horizontal $v_x(t)$ (Orange) ground velocity.
   - Automatic phase picking for P-wave arrivals ($t_P$), S-wave arrivals ($t_S$), and Rayleigh wave ground rolls ($t_R$).
   - Dynamic travel-time curve calculation ($S - P$ lag time) estimating epicentral distance.
4. **Coupled Non-Linear Shallow Water Tsunami Hydrodynamics (`TsunamiSolver.ts`)**:
   - 1D shallow water equations (SWE) on sea surface elevation $\eta(x, t)$ and flow velocity $u(x, t)$.
   - Direct coupling with seafloor vertical uplift during megathrust subduction events ($>5\text{ m}$ uplift).
   - Realistic ocean trench to continental shelf bathymetry ($H = 4200\text{ m}$ to $8\text{ m}$).
   - Green's law shoaling amplification demonstrating coastal run-up inundation.
5. **Zero-GC 60 FPS Canvas Rendering (`SeismicBenchCanvas.tsx`)**:
   - Ref-based offscreen canvas, context, `ImageData`, and `Uint32Array` allocated once on mount.
   - Pre-computed 256-entry palettes: Seismic Bipolar, Magma Thermal, Turbo Velocity.
   - Zero per-frame allocations during 60 FPS animation.
   - Interactive draggable earthquake hypocenter gizmo with pointer capture.
6. **100% Procedural Web Audio Infrasound Sonification (`SeismicSonificationEngine.ts`)**:
   - Sub-bass P-wave compressional rumble (30–85 Hz).
   - S-wave tectonic friction roar (filtered pink noise).
   - Continuous $38\text{ Hz}$ earth resonance hum modulated by ground velocity.
   - Seismograph needle click acoustic arrivals.
   - Master `DynamicsCompressorNode` (-3 dB, 14:1 ratio) preventing audio clipping.

---

### Implementation Milestones
- `src/types/index.ts`: Defined fault configs, geology layers, seismograph stations, tsunami state, and telemetry metrics.
- `src/seismic/ElastodynamicsSolver.ts`: Built 2D velocity-stress FDTD solver, free surface boundary, absorbing sponge, and curl/div operators.
- `src/seismic/FaultRuptureEngine.ts`: Defined 5 curated geological scenarios and standard crust/mantle strata.
- `src/seismic/SeismographNetwork.ts`: Built 4-station network with rolling waveforms, phase pickers, and travel-time dispersion curves.
- `src/tsunami/TsunamiSolver.ts`: Built 1D non-linear shallow water equations solver with bathymetry shoaling.
- `src/audio/SeismicSonificationEngine.ts`: Built procedural infrasound synthesizer with rumble, friction noise, and limiter.
- `src/components/Header.tsx`: Built header with scenario dropdown, suite tabs, live telemetry strip, and audio controls.
- `src/components/SeismicBenchCanvas.tsx`: Built 60 FPS zero-GC canvas with hypocenter drag gizmo and geological overlays.
- `src/components/SeismographDeck.tsx`: Built multi-tab control deck with live SVG waveforms, travel-time curves, and tsunami bathymetry.
- `src/components/DataExportModal.tsx`: Built CSV/JSON scientific exporter.
- `src/App.tsx` & `src/main.tsx`: App orchestration, state synchronization, and 15 Hz telemetry loop.

---

### Automated Verification
- Headless automated Chromium test suite (`test-run.cjs`) executed via Puppeteer.
- Verified 5 scenarios, 4 suite modes, 3 wavefield display modes, rupture trigger, magnitude and depth sliders, pause/reset, and data export modal.
- Passed with 0 console errors and 0 unhandled exceptions.
