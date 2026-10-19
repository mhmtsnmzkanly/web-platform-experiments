# EXP-024: POCKET-TERRARIUM — Final Scientific & Engineering Report

## Executive Summary
**POCKET-TERRARIUM** (WBE Experiment 024) is an interactive, tactile aquatic ecosystem simulator, closed-loop vivarium, and micro-ecology studio. Developed under Hardening Protocol 2.0 with a commitment to human-scale, playful, accessible biology and chemistry ("kademeyi düşür"), POCKET-TERRARIUM brings rigorous biological modeling—3-stage biological nitrogen oxidation kinetics, diurnal photosynthetic oxygen production vs aerobic respiration, Henry's Law atmospheric reaeration, dynamic carbonate buffer pH, and Holling Type II multi-trophic predation—into an engaging, living desktop vivarium.

The simulator allows users to balance an aquatic ecosystem, observe oxygen pearling from aquatic plants, test water chemistry with a 5-tube colorimetric reagent assay kit, manage bioload and waste accumulation, feed guppies, breed fry, cultivate Elodea densa plants, and rescue tanks from catastrophic hypoxic or ammonia crises.

---

## Scientific & Computational Architecture

### 1. Water Chemistry ODEs & 4th-Order Runge-Kutta Integrator
- **State Vector:**
  $$\vec{y} = [DO, NH_3, NO_2^-, NO_3^-, pH, T]^T$$
- **Numerical Integration:**
  Authentic 4th-Order Runge-Kutta (RK4) continuous ODE stepper solving $\frac{d\vec{y}}{dt} = \vec{f}(\vec{y})$ via the classical 4-stage Butcher tableau:
  $$k_1 = f(y_n)$$
  $$k_2 = f(y_n + \frac{\Delta t}{2} k_1)$$
  $$k_3 = f(y_n + \frac{\Delta t}{2} k_2)$$
  $$k_4 = f(y_n + \Delta t k_3)$$
  $$y_{n+1} = y_n + \frac{\Delta t}{6} (k_1 + 2k_2 + 2k_3 + k_4)$$
  with 4 sub-steps per visual frame ($\Delta t_{\text{sub}} \le 0.025\text{ s}$).

### 2. Biological Nitrogen Cycle & Mass Conservation
- **Biochemical Reactions:**
  1. Fish & Organic Waste Excretion: $\text{Organic } N \to NH_3$ (scaled inversely by tank volume $V$).
  2. Nitrosomonas Oxidation: $NH_3 + 1.5 O_2 \xrightarrow{k_{amm}} NO_2^- + H_2O + 2H^+$
  3. Nitrobacter Oxidation: $NO_2^- + 0.5 O_2 \xrightarrow{k_{nit}} NO_3^-$
  4. Plant Vegetative Assimilation: $NO_3^- \xrightarrow{k_{plant}} \text{Vegetative Biomass}$
- **Monod Microbial Kinetics:**
  $$R_{amm} = \frac{k_{amm} \cdot [NH_3]}{K_s + [NH_3]} \cdot \frac{[DO]}{K_{do} + [DO]}$$
  $$R_{nit} = \frac{k_{nit} \cdot [NO_2^-]}{K_s' + [NO_2^-]} \cdot \frac{[DO]}{K_{do} + [DO]}$$
- **Molar Nitrogen Conservation Invariant:**
  In a closed volume without external inputs or vegetative sinks, every intermediate slope satisfies:
  $$\frac{d[NH_3]}{dt} + \frac{d[NO_2^-]}{dt} + \frac{d[NO_3^-]}{dt} \equiv 0$$
  Total inorganic molar nitrogen is conserved to machine precision ($0.0000\%$ relative error verified in test `NITRO-02`).

### 3. Dissolved Oxygen & Gas Exchange (Henry's Law)
- **Rate Equation:**
  $$\frac{d[DO]}{dt} = P(I) - R_{\text{total}} + K_L a ([DO]_{\text{sat}}(T) - [DO]) + Q_{\text{bubbler}}$$
- **Photosynthesis:** $P(I)$ is driven by diurnal solar irradiance $I(t) = \sin(\text{phase})$ and artificial LED lighting. When light is strong, aquatic plants pearl microscopic oxygen bubbles.
- **Respiration:** Multi-component aerobic biological demand (fish, fry, snails, zooplankton, nitrifying bacteria, and dark vegetative respiration).
- **Henry's Law Atmospheric Saturation:** Temperature-dependent saturation $[DO]_{\text{sat}} \approx 14.6 - 0.25 T$, providing two-way diffusion (reaeration under hypoxia, degassing under supersaturation).

### 4. Holling Type II Multi-Trophic Predation & Schooling Kinematics
- **Trophic Chain:** Planktonic Algae $\to$ Daphnia (Zooplankton) $\to$ Guppy Fish $\to$ Fry.
- **Holling Type II Functional Response:**
  $$f(D) = \frac{a \cdot D}{1 + a \cdot h \cdot D}$$
  where $a$ is attack/search efficiency, $h$ is handling time cooldown, and $D$ is prey abundance. Guppies hunting Daphnia incur a handling time cooldown preventing instantaneous mass consumption.
- **Kinematics:** Modified Reynolds Boids (cohesion, alignment, separation, wall collision avoidance, and hypoxic surface gasping).

---

## Verification Results

| Layer | Verification Target | Test Suite | Result |
| :--- | :--- | :--- | :--- |
| **Layer 1** | Biochemical Kinetics & Invariants | `024/tests/run-engine-tests.mjs` | **17 / 17 Passed (100%)** |
| **Layer 2** | Simulation Lifecycle & State | `TerrariumSimulationController` single-owner state | **Passed** |
| **Layer 3** | Headless Browser E2E | Puppeteer (`024/test-run.cjs`) | **Passed (0 Console Errors)** |

---

## Independent Dual Audit Certification

1. **Technical & Reliability Auditor:**
   - **Verdict:** **PASS** (Post-Remediation)
   - Certified implementation of genuine 4th-Order Runge-Kutta ODE integrator, Holling Type II predation with handling time cooldown, React StrictMode event listener re-attachment on mount, removal of window unlock listeners on dispose, zero per-frame canvas gradient allocations, and modal timeout cleanup.
2. **Product Quality & Interaction Auditor:**
   - **Verdict:** **PASS**
   - Certified deep aquatic vivarium studio with 5 curated ecological scenarios, 9 interactive trophic and maintenance tools, 5-tube colorimetric reagent test kit modal, tactile Web Audio sound synthesis, high-DPI Retina canvas rendering, and comprehensive CSV/JSON telemetry export.

---

## Web Audio Sonification & Rendering Pipeline
- **Procedural Audio Synthesis:** 100% synthesized sound: aerator air stone bubbling gurgles, oxygen pearling chimes, feeding surface plops, water change cascade swoosh, and toxicity advisory alert chime.
- **Audio Limiter & Garbage Collection:** Master `DynamicsCompressorNode` (threshold $-12\text{ dB}$, ratio $16:1$, attack $3\text{ ms}$, release $120\text{ ms}$) guarantees zero clipping. All audio nodes disconnect immediately upon completion.
- **Retina Canvas Pipeline:** Decoupled 60 FPS HTML5 Canvas visualizer scaled by `window.devicePixelRatio`, featuring diurnal lighting gradations, volumetric light caustics, green water turbidity, waving plant whorls, swimming fish, and snails.
