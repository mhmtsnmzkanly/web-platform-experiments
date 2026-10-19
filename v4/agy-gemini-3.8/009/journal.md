# Engineering Journal — Experiment 009: ORBITAL-MECH

### 2026-10-19 — Project Origination & Architecture
Following user instruction `"Kendi fikirlerine donebilirsin"`, embarked on an autonomous, high-agency astrodynamics studio and orbital mission flight computer: **ORBITAL-MECH**.

Key architectural tenets:
1. **Symplectic Integration over Explicit Runge-Kutta**: Standard RK4 dissipates or grows total mechanical energy over extended time spans. Yoshida's 4th-order symplectic method was chosen because its Hamiltonian mapping preserves phase space volume, eliminating artificial orbital decay.
2. **Interactive Maneuver Node Gizmo**: Bringing the intuitive flight planning paradigm of modern aerospace software to the browser. Users can adjust delta-v prograde and radial components and see forward trajectory prediction cones respond in real-time.
3. **Curated Physical Scenarios**: Rather than just an empty sandbox, providing 6 rigorous scenarios (Apollo 13 free-return loop, Moore 3-body choreography, Shoemaker-Levy 9 tidal breakup, JWST L2 halo, Voyager 2 gravity assist, and Inner Solar System sandbox).
4. **100% Procedural Web Audio**: Zero external audio assets. Synthetic space acoustics modulating gravitational potential depth, engine roar, RCS hisses, and flight computer guidance tones.

---

### Implementation Milestones
- `src/types.ts`: Defined `CelestialBody`, `ManeuverNode`, `OrbitalElements`, `ScenarioPreset`, and `EphemerisDataPoint`.
- `src/physics/OrbitalMath.ts`: Implemented 2D vector algebra, Keplerian elements derivation, analytical Hohmann transfer calculations, circular restricted three-body problem Lagrange points ($L_1$–$L_5$), fluid/rigid Roche limits, and Tsiolkovsky fuel consumption.
- `src/physics/NBodyPhysicsEngine.ts`: Implemented Yoshida 4th-order symplectic integrator with adaptive sub-stepping, 1PN relativistic precession, barometric exponential atmospheric drag, tidal disruption fragment spawner, and forward trajectory rollout.
- `src/audio/SpaceSonificationEngine.ts`: Built procedural sound generator featuring gravitational drone, cold-gas thruster bursts, rocket engine roar, and telemetry chimes with master compression limiter.
- `src/components/OrbitalCanvas.tsx`: Built 60 FPS HTML5 Canvas with HiDPI DPR scaling, smooth pan/zoom, orbital trails, predicted trajectory cones, day/night terminators, SOI circles, Lagrange point crosshairs, and maneuver node handles.
- `src/components/FlightComputerDeck.tsx`: Implemented maneuver planner, Hohmann transfer assistant, and manual RCS pulses.
- `src/components/TelemetryHUD.tsx`: Implemented real-time flight telemetry readout with eccentricity class badge and propellant bar.
- `src/components/CelestialBodyInspector.tsx` & `EphemerisExportModal.tsx`: Implemented custom body spawner with presets and multi-format data export (CSV, JSON, SVG).

---

### Automated Verification & Testing
- Automated test script `test-run.cjs` written using Puppeteer Core and headless Chromium.
- Tested canvas visibility, 6 scenario transitions, time warp multipliers, step forward, flight computer deck, RCS pulses, and telemetry export.
- Result: 0 console errors, 0 runtime exceptions, passed with flying colors.
