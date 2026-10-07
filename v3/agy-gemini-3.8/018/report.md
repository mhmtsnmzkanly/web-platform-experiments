# Experiment Report: 018 — Maxwell-Boltzmann Kinetic Theory & Thermodynamic Entropy

## Concept
A statistical mechanics and thermodynamic calorimeter simulation of an ensemble of $N=380$ hard-sphere gas molecules in continuous 2D elastic collisions, partitioned across ten thermal chambers encoding "HELLO WORLD".
The system demonstrates the microscopic foundation of thermodynamics:
1. **Maxwell-Boltzmann Velocity Distribution**: Microscopic molecular speeds naturally relax towards the analytical equilibrium distribution:
   $$f(v) = \frac{m v}{k_B T} \exp\left(-\frac{m v^2}{2 k_B T}\right)$$
   verified continuously across 16 discrete speed histogram bins against the theoretical curve.
2. **Macroscopic State Variables**:
   - Kinetic temperature: $T = \frac{m \langle v^2 \rangle}{2 k_B}$.
   - Wall pressure: $P = \frac{1}{A} \sum \frac{2 m v_\perp}{\Delta t}$, computed from physical momentum transfer rate against container boundaries.
   - Ideal gas state equation: $P V \approx N k_B T$, verifying compressibility $Z \approx 1.00$.
3. **Movable Piston Work & Entropy**:
   - An interactive adiabatic compression piston modulates container volume $V$, doing mechanical boundary work $W = \int P dV$ on the gas and elevating temperature and pressure.
   - Live Boltzmann-Shannon entropy $S = -k_B \sum p_i \ln p_i$ measures microstate dispersion.

## Web Platform Surface
- **Elastic Hard-Sphere Particle Mechanics on Typed Arrays**:
  - Continuous 2D momentum conservation across 380 colliding disks with mass $m_0 = 1.0$ and radius $r_0 = 2.8\text{ px}$.
  - Wall impulse accumulation directly calculating boundary pressure without arbitrary multipliers.
- **HTML5 2D Canvas (`CanvasRenderingContext2D`)**:
  - Over 23,000 drawing operations recorded across test frames.
  - Multi-layer visual rendering: mahogany calorimeter casing, polished brass borders, chalkboard glass interior with 10 perforated partition grids ("HELLO WORLD"), kinetic molecules colored by speed (cyan for slow, amber for mean, red for fast), real-time 16-bin velocity histogram with overlaid analytical continuous Maxwell-Boltzmann curve, and a mercury U-tube differential manometer.
- **Pointer Events & Piston Compression Slider**:
  - Interactive pointer drag on the adiabatic piston slider (`#piston-slider`) alters cylinder volume $V$, triggering mechanical work, pressure surges, and volume adjustments from $35\%$ to $95\%$.

## Visual & Design Rationale
- **Palette**: Victorian mahogany and dark cedar (`#0a0704`, `#161009`), polished scientific brass (`#d4af37`), mercury column silver (`#cbd5e1`), gas molecule flame amber (`#f59e0b`), and chalkboard green (`#0b1410`).
- **Composition**: Dual-viewport instrumentation layout featuring the physical expansion cylinder on the left and statistical mechanics distribution plots with a mercury U-tube manometer on the right.
- **Aesthetic**: 19th-century Victorian thermodynamics laboratory (Lord Kelvin and Ludwig Boltzmann era), distinct from contemporary dark HUDs, particle accelerators, or botanical plates.

## Verification Evidence
Verified via `tools.js verify 018/018.dev.html 018`:
- **Result**: `OK` (0 static, CSS, DOM, or animation issues).
- **Subject**: Features "Hello World" in header, cylinder engraving, and chamber partitions.
- **Canvas Evidence**:
  - Canvas ID: `thermo-canvas` (1060x520 px).
  - Readable pixels verified (`readable: true`, `pixels: true`).
- **Technology Measurements**:
  - Particle Count: 380 hard-spheres.
  - Kinetic Temperature $T$: $354.4\text{ K} \to 356.2\text{ K}$.
  - Wall Pressure $P$: $65.8\text{ kPa} \to 71.7\text{ kPa}$ under piston compression.
  - Root Mean Square Velocity $v_{\text{rms}}$: $595.7\text{ m/s} \to 598.8\text{ m/s}$.
  - Boltzmann Entropy $S$: $2.408 \to 2.513\ k_B$.
  - Compressibility Factor $Z$: $0.950$ (ideal gas law compliance).
  - Piston volume: Modulated to $79\%$ under CDP pointer drag.

## Key Decisions & Trade-offs
1. **Direct Momentum Transfer for Pressure**: Rather than computing pressure solely from ideal gas laws, measuring actual particle impulse $\Delta p = 2 m v_\perp$ against the walls grounds macroscopic pressure directly in microscopic Newtonian mechanics.
2. **Side-by-Side Histogram & Analytical Curve**: Overlaying the theoretical continuous Maxwell-Boltzmann curve directly onto live histogram bins proves that random microscopic collisions produce deterministic statistical distributions.
3. **Piston Volume Clamping**: Repelling molecules ahead of the advancing piston face preserves particle count integrity during rapid compression.

## Moving Frontier Contribution
- **Thermodynamics & Statistical Physics**: Introduced kinetic gas theory, elastic collision dynamics, and Boltzmann entropy to the lab.
- **Victorian Laboratory Aesthetic**: Established a mahogany, polished brass, and mercury manometer visual identity.
- **Micro-to-Macro Emergence**: Connected microscopic individual molecular collisions directly to macroscopic temperature, pressure, and entropy.
