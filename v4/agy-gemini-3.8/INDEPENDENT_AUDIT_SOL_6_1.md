# WBE V4 — Independent Scientific & Engineering Audit — SOL 6.1

**Scope:** experiments 006–018 inclusive, explicitly capped at 018 by the user.  
**Audit date:** 2026-10-19 UTC. **Repository HEAD at capture:** `1dfff01b8666d4ac32883f6e8805597d90c64b78`.  
**Method:** independent source inspection, analytical derivation, executed Node numerical/adversarial tests, production rebuilds, per-experiment type checks, and engine microbenchmarks. Existing reports were treated as claims. This is an audit, not an implementation change.

Paths below are relative to `v4/agy-gemini-3.8/` unless explicitly stated. Line references refer to the captured source. Read-only context includes both V4 charters, the local task queue, and all available reports, audit reports, verification JSON and test scripts in scope. The development charter was reviewed as evidence of requirements; its instructions to commission development auditors were not treated as instructions to this independent audit.

## A. Executive Summary

**There is substantial working implementation, but the collection cannot currently be endorsed as scientifically verified.** Newtonian Yoshida integration, quantum state-vector algebra, allowed two-body Lorentz decays, Gray–Scott reactions, BGK LBM, and elastic wave updates are real computations. Several advertised advanced capabilities are instead heuristic visual models, disconnected controls, imposed telemetry, or equations with consequential errors.

The most consequential discoveries are:

1. **007 duplicates each newborn by inserting the same object twice.** One parent division produces three population entries but only two unique organisms. Subsequent physiology, statistics and selection operate on aliased individuals.
2. **015 evolves BEC kinetic phase with the wrong sign.** A free discrete sine eigenmode acquires positive imaginary amplitude where the advertised Gross–Pitaevskii equation requires negative amplitude. Renormalizing every step conceals this error. TDGL magnetic fields are prescribed and cannot demonstrate self-consistent Meissner screening.
3. **014 is not a self-consistent Grad–Shafranov equilibrium solver.** Halving plasma current leaves the computed poloidal field unchanged. Its thermal energy conversion is wrong by 10×. The standalone ITER baseline falls to about 0.754 keV and Q≈0.000485 after 10.01 simulated seconds in the executed test, rather than sustaining its stated Q=10 behavior. This is a standalone thermonuclear-engine result, not a measured coupled UI trajectory.
4. **016 does not integrate advertised metric null geodesics or a 3.5PN inspiral.** It uses an effective-force approximation and analytic screen formulas. GW phase advances at about 0.597 Hz while the same sample reports 15.535 Hz.
5. **012's slit-width control does not change diffraction output; hologram reconstruction distance only changes phase, not image formation.** The metallic TMM approximation does not use complex optical admittance and fails a thick-silver Fresnel limit.
6. **017 accepts trigger failures on its eighth attempt, constructs discovery significance from truth labels and a fixed background, and does not conserve complete-event transverse momentum.** Correct two-body decay helpers do not validate the event generator or statistical inference.

**Positive independent results:** all 12 available experiments (006–017) rebuild successfully using installed dependencies. A circular Newtonian orbit exhibits approximately fourth-order position convergence. Bell probabilities, reduced-state purity, Grover's 25/32 target probability, Deutsch–Jozsa and superdense coding match basic reference cases. One thousand allowed two-body decays conserve four-momentum to ≤2.85×10⁻¹⁴ GeV in the run and daughter masses to ≤3.64×10⁻¹² GeV. Bare-glass and quarter-wave AR optics return sensible normal-incidence lossless results. Empty LBM flow remains near unit density.

**Evidence limitations are material.** Chromium launch failed in this restricted environment: snap Chromium reports missing capabilities; cached Playwright Chromium reports `sandbox_host_linux.cc:41 ... Operation not permitted`. No browser interaction, browser FPS, actual Web Audio output, cross-browser compatibility, mobile usability, full runtime export/download, or browser heap/GC claims are independently verified here. Engine timings are not browser frame rates. No network deployment was tested. No clean dependency reinstall was performed.

**Safety:** source, old audits, queue and deployments were not modified. Builds and test harnesses were created in `/tmp/wbe-independent-audit/`. This report is the only intentional repository write. No commit, push or publication was performed.

### Discovery and completion evidence

| Experiment | Product | Source files TS/TSX (including config) | Report / verification | audit-report.md | Completion assessment |
|---|---|---:|---|---|---|
| 006 | NEURO-FLUID | 10 | Present / present | Present | Delivered artifact; substantive defects |
| 007 | GENOME-FORGE | 11 | Present / present | Present | Delivered artifact; core lifecycle invalid |
| 008 | Instrument Lab | 11 | Present / present | Present | Delivered artifact; audio execution unverified |
| 009 | ORBITAL-MECH | 14 | Present / present | Present | Delivered artifact; maneuver defects |
| 010 | QUANTUM-GATE | 14 | Present / present | Present | Delivered artifact; bounded scientific success |
| 011 | AERO-TUNNEL | 12 | Present / present | Present | Delivered artifact; telemetry/flight defects |
| 012 | OPTICA-FORGE | 11 | Present / present | Present | Delivered artifact; core advertised modes invalid |
| 013 | SEISMIC-LAB | 13 | Present / present | Present | Delivered artifact; quantitative claims unsupported |
| 014 | PLASMA-LAB | 13 | Present / present | Present | Delivered artifact; equilibrium and units invalid |
| 015 | CRYO-LAB | 14 | Present / present | Present | Delivered artifact; BEC and screening invalid |
| 016 | RELATIVITY-LAB | 13 | Present / present | **Missing** | Delivered artifact; audit sign-off unsupported by artifact |
| 017 | COLLIDER-LAB | 17 | Present / present | **Missing** | Delivered artifact; audit sign-off unsupported by artifact |
| 018 | STELLAR-FORGE | 0 | **Absent / absent** | **Absent** | Queue says IN_PROGRESS; directory absent at capture and recheck |

“Delivered artifact” means source, entry point and production output exist and can bundle; it does not mean scientifically complete or product-approved. Source import dependencies resolve in the existing installation. The queue's completion labels for 006–017 agree with delivery artifacts, but its statements that all are independently audited are not substantiated for 016–017. No conclusions about 019 or later are drawn.

### Version and build boundary

A 242-file snapshot (excluding dependencies, dist and out-of-scope experiments) was copied before testing, with per-file SHA-256 hashes. All captured files remained identical to the live workspace at the final source recheck. This prevents attribution of defects to an unseen concurrent edit. The snapshot dependency symlink uses the existing local installation, so installed-package reproducibility is verified, clean-install reproducibility is not.

All `vite build` commands executed successfully against snapshot directories. A first subprocess wrapper reported EPERM despite emitting artifacts; that result was discarded as build evidence and commands were rerun directly through the execution tool, yielding explicit exit 0 and complete build logs. Eleven snapshot dist trees match current repository dist filenames and bytes. For 010 the JS payload bytes match but CSS and generated asset names differ; this is a packaging reproducibility difference, not evidence of a changed quantum engine. Live hosted bytes were not fetched, so deployed/source equality remains unverified.

## B. Experiment Scorecard

Scores are coarse reviewer judgments, **not percentages of accuracy**. 0–2: core promises invalid/mostly absent; 3–4: major defects; 5–6: substantive but materially limited; 7–8: good bounded evidence with gaps; 9–10: broad independent reference and adversarial coverage (none qualifies). Functional and engineering scores are provisional source-and-engine assessments, not browser certifications. Test scores evaluate the checked-in verification suite, not tests newly written by this audit.

Performance scores below cover **only measured engine workloads** and source scheduling. UI scores assess visible source wiring and recovery design, with ±2-point uncertainty; actual usability and browser behavior remain untested. **NE** is used where numerical scoring would fabricate evidence (audio performance and absent 018); it is not zero. These restrictions deliberately limit the requested score precision.

| ID | Scientific correctness | Functional completeness* | Software engineering* | Performance (engine only) | User interaction (source only)* | Existing test coverage |
|---|---:|---:|---:|---:|---:|---:|
| 006 | 4 | 6 | 5 | 3 | 6 | 2 |
| 007 | 3 | 5 | 4 | 6 | 6 | 2 |
| 008 | 6 | 6 | 5 | NE | 6 | 4 |
| 009 | 7 | 6 | 6 | NE | 6 | 2 |
| 010 | 8 | 7 | 6 | NE | 6 | 3 |
| 011 | 5 | 6 | 5 | 6 | 6 | 2 |
| 012 | 3 | 4 | 5 | 3 | 5 | 2 |
| 013 | 4 | 5 | 5 | 7 | 6 | 2 |
| 014 | 2 | 4 | 5 | 6 | 6 | 2 |
| 015 | 2 | 4 | 5 | 6 | 6 | 3 |
| 016 | 2 | 4 | 5 | 5 | 5 | 2 |
| 017 | 5 | 5 | 5 | 5 | 6 | 2 |
| 018 | NE | NE | NE | NE | NE | NE |

`*` Provisional judgment. An 008 scientific score rates the plausibility of procedural synthesis architecture, not realistic timbre, acoustic validation or audible safety. 009's high scientific score applies to its tested Newtonian core; it does not endorse historical mission fidelity or unlimited time warp. 010's score is bounded to small-register linear algebra, not full OpenQASM compliance.

## C. Critical and High Findings

Findings are ordered primarily by scientific impact. All reported executed numeric results come from the captured implementation. Mathematical findings include explicit derivations; source-only reproduction instructions are not represented as completed browser tests.

### C01 — 015 — CRITICAL: BEC kinetic term has the opposite sign

- **Location:** `015/src/quantum/BecGrossPitaevskii.ts:169`; `015/src/quantum/BecGrossPitaevskii.ts:185`; `015/src/quantum/BecGrossPitaevskii.ts:233`
- **Expected:** For iψ_t = −½∇²ψ +(V+g|ψ|²)ψ, u_t=−½∇²v and v_t=+½∇²u. A positive real Laplacian eigenmode has negative initial imaginary phase.
- **Actual:** The code updates u with +½∇²v and v with −½∇²u. Potential kicks have the advertised sign, so this is a reversed kinetic Hamiltonian, not a harmless global time reversal. It also absorbs edges and then globally renormalizes, finally assigning totalNorm=1.
- **Evidence / reproduction:** `numerical.ts`, free sine mode, g=0, timeOfFlight=true: center imaginary amplitude +1.8737328e−6; analytical discrete-Laplacian expectation −1.8737339e−6. Expected eigenvalue is 8 sin²(π/238)/dx². The norm readout remains 1. Appendix includes the executed harness.
- **Recommended correction:** Correct both kinetic signs; use a genuinely unitary kinetic propagator or documented consistent integrator. Test dispersion phase, free expansion, energy and dt convergence separately from norm. Expose measured pre-renormalization norm and distinguish absorbing from closed boundaries.
- **Confidence:** HIGH.

### C02 — 014 — CRITICAL: Displayed equilibrium is not governed by its advertised current

- **Location:** `014/src/plasma/GradShafranovSolver.ts:89`; `014/src/plasma/GradShafranovSolver.ts:138`; `014/src/plasma/GradShafranovSolver.ts:184`
- **Expected:** Poloidal flux must satisfy the Grad–Shafranov/Ampère relation with pressure/current sources and boundary conditions. Independently prescribing an arbitrary flux and current is not a self-consistent equilibrium.
- **Actual:** A D-shaped distance function times a Gaussian modifier creates ψ; no relaxation iteration or PDE residual is present. Ip scales jPhi and heuristic q but not ψ, Br or Bz. Radial density is independently hardcoded.
- **Evidence / reproduction:** `numerical.ts`: instantiate ITER geometry, then solve with Ip reduced from 15 to 7.5 MA at the same temperature. Maximum change of Br is exactly 0. The identical unchanged ψ also implies unchanged Bz while jPhi halves. Both cannot satisfy Ampère’s law for the supplied current. Reference equation: [IAEA magnetic equilibrium](https://nucleus.iaea.org/sites/fusionportal/Pages/DPWS-6/TM%20Fusion%20Data%20Processing%20Validation%20and%20Analysis/2_Tuesday/Session%20I%20Uncertainty%20Propagation%20of%20Experimental%20Data%20in%20Modelling%20Codes/830%20Fischer%20R.pdf).
- **Recommended correction:** Implement an equilibrium with coupled sources and report residual/convergence, or explicitly relabel as an illustrative prescribed-flux model. Derive q and current from the same field; do not claim Solov’ev relaxation without one.
- **Confidence:** HIGH.

### C03 — 014 — CRITICAL: Thermal energy is 10× too large and baseline power claim does not reproduce

- **Location:** `014/src/plasma/ThermonuclearEngine.ts:40`; `014/src/plasma/ThermonuclearEngine.ts:149`; `014/src/plasma/ThermonuclearEngine.ts:115`
- **Expected:** For n=n20×10²⁰ m⁻³, kT=TkeV×1.602e−16 J, converting 3nkTV to MJ gives coefficient 0.01602, not 0.1602. Loss and temperature equations must use a consistent volume/profile convention.
- **Actual:** Both reset energy and temperature inference use 0.1602. Reset uses profile factor 0.5 but inference uses 0.55. The audited claim of ~3.4 MW cyclotron radiation is inconsistent with this source’s first-step result (~397.46 MW).
- **Evidence / reproduction:** ITER volume 905.6349 m³ and target n20=1.05: reset energy 3656.0843 MJ versus 365.6084 MJ using the same profile factor. First step (.01 s) yields P_fus=1124.4379 MW and P_cycl=397.4634 MW; after 1001 steps Te=.7539424 keV, Q=.0004850. Bosch–Hale reactivity at 10 keV is sensible (1.1361655e−22 m³/s), so the reactor-balance failure should not be attributed to that helper. Energy conversion uses [BIPM SI charge definition](https://www.bipm.org/en/measurement-units/).
- **Recommended correction:** Correct MJ coefficient, align profile factors and validate radiation units against a stated reference. Reproduce a defensible baseline power balance before claiming ITER Q=10. Make density fueling scale with dt (the current fueling increment does not).
- **Confidence:** HIGH.

### C04 — 016 — CRITICAL: Metric geodesics and null ray tracing are misrepresented

- **Location:** `016/src/relativity/GeodesicIntegrator.ts:200`; `016/src/relativity/GeodesicIntegrator.ts:220`; `016/src/relativity/RelativisticRayTracer.ts:141`
- **Expected:** Advertised timelike/null geodesics should be derived from a metric with a consistent affine/proper/coordinate time and mass-shell constraint. A null Schwarzschild circular orbit at r=3M is a standard reference case.
- **Actual:** The integrator evolves Cartesian Newtonian plus effective-force corrections. Photons retain Newtonian attraction and triple a relativistic term; E is initialized to 1 and never evolved or constrained. Ray tracing uses algebraic shadow tests and heuristic intersections, not integrated null rays.
- **Evidence / reproduction:** At r=3, tangential coordinate speed=1 (the engine’s photon initialization), it gives inward acceleration −1/9−9×9/81=−10/9, while a circle at that radius/speed requires −1/3. More fundamentally, the Schwarzschild null effective radial equation has no massive-particle −M/r term. The implemented force fails the advertised photon sphere regardless of RK4 step refinement. The executable smoke case records the first step; no claim of full GR convergence is made.
- **Recommended correction:** Use Hamiltonian metric geodesics, initialize valid null/timelike momenta and test conserved E, L and null norm. Alternatively call this an effective-force illustration and remove exact metric and ray-tracing accuracy claims. Keep correct analytic horizon/ISCO formulas as reference overlays, not validations of the dynamics.
- **Confidence:** HIGH.

### H01 — 007 — HIGH: Mitosis inserts one newborn twice and corrupts state ownership

- **Location:** `007/src/engine/EcosystemEngine.ts:233`; `007/src/engine/EcosystemEngine.ts:713`; `007/src/engine/EcosystemEngine.ts:736`
- **Expected:** A division adds one distinct daughter once; each organism is advanced once per simulation step and telemetry counts unique living organisms.
- **Actual:** spawnOrganism immediately appends to the array being iterated. The daughter is also queued in newOffspring and appended again afterward. Aliased entries subsequently age, feed and reproduce more than once. Daughter energy is independently initialized rather than assigned the parent’s transferred half.
- **Evidence / reproduction:** `adversarial.ts`: one isolated fertile phototroph produces array length 3, unique ID count 2, and organisms[1]===organisms[2] true after one update. Parent energy≈74.991 and child≈77.981 rather than an explicit 50% transfer. Duplicate entries remain after 3 simulated seconds.
- **Recommended correction:** Have exactly one owner insert births after iteration. Use a creation method without append, transfer actual daughter energy, and enforce unique-ID/state-ownership invariants with deterministic reproduction tests.
- **Confidence:** HIGH.

### H02 — 016 — HIGH: GW timestamps, phase and frequency use incompatible clocks

- **Location:** `016/src/relativity/GravitationalWaveEngine.ts:101`; `016/src/relativity/GravitationalWaveEngine.ts:112`; `016/src/relativity/GravitationalWaveEngine.ts:150`
- **Expected:** For h=h0 cosφ, dφ/dt=2πfGW in the exported time units; a 3.5PN model must implement corresponding PN terms. A continuous recording must have monotonic timestamps.
- **Actual:** Frequency uses c³/(GM) conversion while phase uses an unrelated factor 120, and radial drift an additional 1.8. No 3.5PN series is implemented. Auto-restart resets simulation time while keeping history; ringdown damping uses 3× the declared tau and an amplitude based on historical peak, not matched merger amplitude.
- **Evidence / reproduction:** `numerical.ts`: at 36+29 solar masses and r=16M, first .001 s sample reports 15.5346306 Hz, but atan2(hCross, hPlus)/(2πdt)=.5968404 Hz (~26× different). This follows directly from the two incompatible phase-frequency conversion factors. Phase matching alone cannot ensure amplitude/derivative continuity. Compare [LALInspiral phasing definitions](https://lscsoft.docs.ligo.org/lalsuite/dev/lalinspiral/group__lalinspiral__inspiral.html).
- **Recommended correction:** Use one physical clock and integrate phase from the reported frequency; implement/document the actual PN order. Validate chirp mass scaling and inspiral time. Mark segment boundaries or preserve monotonic time across auto-restart, and match ringdown amplitude as well as phase.
- **Confidence:** HIGH.

### H03 — 012 — HIGH: Slit-width control changes mask artwork but not diffraction field

- **Location:** `012/src/optics/WaveOpticsEngine.ts:102`; `012/src/optics/WaveOpticsEngine.ts:228`
- **Expected:** Changing slit width should change the illuminated transverse aperture and the diffraction envelope (first-zero angle scales with λ/a).
- **Actual:** The single-slit width changes mask extent along propagation x, but emitters are sampled only at fixed apX. Their transverse y interval stays fixed. Circular aperture is likewise reduced to a one-dimensional center column, so it is not a 2D circular-aperture Airy calculation.
- **Evidence / reproduction:** `adversarial.ts`: 100×60 grid, slitWidthUm 50→100 changes mask cells but maximum intensity change is exactly 0. `numerical.ts` separately confirms unchanged emitter column. Physical dimensions also use unrelated pixel scale factors rather than one calibrated coordinate mapping.
- **Recommended correction:** Represent the aperture on the plane transverse to propagation, use physical coordinates, and validate single-slit sinc² minima, Young fringe spacing and a genuine circular-aperture reference. Disable or relabel unsupported 3D aperture claims.
- **Confidence:** HIGH.

### H04 — 012 — HIGH: Hologram reconstruction performs no propagation

- **Location:** `012/src/optics/WaveOpticsEngine.ts:396`; `012/src/optics/WaveOpticsEngine.ts:403`
- **Expected:** Changing reconstruction distance should propagate the recorded wavefront to a new plane and change focus/intensity as appropriate.
- **Actual:** Each pixel is multiplied by a unit complex exponential; distance is a global phase. Thus |E|²=hologramBuffer², independent of distance. No Fresnel/FFT/convolution reconstruction occurs.
- **Evidence / reproduction:** `numerical.ts`: record, reconstruct at 20 mm, reconstruct at 100 mm. Maximum normalized intensity change 1.1921e−7 (Float32 rounding); algebra proves exact distance invariance before rounding.
- **Recommended correction:** Implement complex field propagation and reconstruct a known point-object depth; compare focal planes. Until then label this as hologram illumination/phase visualization, not a reconstructed 3D virtual image.
- **Confidence:** HIGH.

### H05 — 012 — HIGH: Metallic thin-film “exact complex TMM” fails reference limit

- **Location:** `012/src/optics/ThinFilmEngine.ts:102`; `012/src/optics/ThinFilmEngine.ts:115`; `012/src/optics/ThinFilmEngine.ts:178`
- **Expected:** Complex refractive index and complex Snell cosine/admittance must be carried through the characteristic matrix. A sufficiently thick passive metal tends to its complex-interface Fresnel reflectance.
- **Actual:** The code replaces index by its real modulus in admittance and uses separately inserted attenuation plus clamps. This is not exact complex TMM; clamps conceal nonphysical raw responses.
- **Evidence / reproduction:** `adversarial.ts`: air→1000 nm Ag (n=.14, k=3.4), glass substrate, 550 nm: implementation R=1, T=0. Thick-metal Fresnel R=((n−1)²+k²)/((n+1)²+k²)=.9564527668 (film attenuation makes substrate effects negligible). Default silver stack also clips to R=1. Lossless bare-glass result .04258 and AR .01260 at 550 nm are reasonable; defect is not alleged for every dielectric case.
- **Recommended correction:** Use full complex n cosθ and admittance with a consistent absorption convention. Inspect unclipped R, T, A; test lossless conservation and passive-metal limits. Avoid fallback constants that masquerade as valid physics.
- **Confidence:** HIGH.

### H06 — 017 — HIGH: Trigger filter silently accepts rejected events

- **Location:** `017/src/App.tsx:138`
- **Expected:** An active trigger should reject all nonmatching events and record accepted/rejected trials honestly.
- **Actual:** The eighth candidate is accepted even if it fails the configured trigger. Rejection trials are not reflected in totalEventsGenerated.
- **Evidence / reproduction:** Source-deterministic reproduction: choose Higgs diphoton and DI_LEPTON. Its generator produces photons plus hadronic underlying particles, no ≥15 GeV electron/muon pair. All eight fail; the eighth is nonetheless displayed and histogrammed. Executed seeded event has 0 qualifying leptons.
- **Recommended correction:** Return an explicit no-accepted-event result after the trial limit, display rejection counts and test an impossible trigger/preset pair. Do not bypass filters to guarantee visual activity.
- **Confidence:** HIGH.

### H07 — 017 — HIGH: “5σ discovery” and fitted spectrum are constructed from truth labels

- **Location:** `017/src/App.tsx:230`; `017/src/App.tsx:231`; `017/src/components/MassSpectrumCanvas.tsx:186`
- **Expected:** Observed significance should use a declared statistical model, observed window counts/background estimate, and appropriate uncertainties. A fit should estimate parameters from data.
- **Actual:** The Higgs truth counter is divided by sqrt(12+0.2S), independently of measured background or mass-window membership. Histogram starts prefilled with synthetic counts. The “model fit” is fixed exponentials/Gaussians centered at known masses with amplitudes from truth counters, not an optimized Breit–Wigner fit.
- **Evidence / reproduction:** Exact source formula gives 5σ after S=20 (20/sqrt(16)=5), irrespective of any accumulated QCD background. Changing measured histogram background cannot alter its denominator. Fixed mass means/widths and no fitting objective/optimizer are visible in MassSpectrumCanvas.
- **Recommended correction:** Label this as a toy truth-count demonstration or implement a reproducible signal/background experiment with generated observations, fitted parameters, uncertainty and an explicitly defined test statistic. Separate seeded illustrative background from recorded events.
- **Confidence:** HIGH.

### H08 — 017 — HIGH: Complete collision events and MET do not share conserved momentum

- **Location:** `017/src/physics/CollisionGenerator.ts:65`; `017/src/physics/CollisionGenerator.ts:85`; `017/src/physics/CollisionGenerator.ts:285`
- **Expected:** For zero incoming transverse momentum, generated complete final states should sum to zero transverse momentum; MET should be physically attributable to invisible particles and documented detector effects.
- **Actual:** Independent random underlying particles and synthetic showers are added without recoil accounting; shower particles coexist with parent partons in the final candidate list and clustering. MET sums visible truth momenta rather than reconstructed detector response.
- **Evidence / reproduction:** `adversarial.ts`, deterministic LCG seed: QCD dijet complete final transverse sum ≈(17.099,−26.067) GeV, fake MET=31.174 GeV with no invisible particles. Top event MET=112.310 GeV while invisible pT=69.478 GeV and total transverse residual≈63.5 GeV. Isolated two-body helper conservation passes separately; it does not repair complete events.
- **Recommended correction:** Generate conserving hard processes and balanced underlying events, replace fragmented parents rather than double counting them, and define detector response separately from truth. Add full-event four-vector/charge checks and MET closure cases.
- **Confidence:** HIGH.

### H09 — 008 — HIGH: Preset JSON importer is not deeply schema validated

- **Location:** `008/src/components/ComparisonBar.tsx:130`; `008/src/components/ComparisonBar.tsx:141`; `008/src/components/ComparisonBar.tsx:146`
- **Expected:** Imported family must be a valid enum; all DSP numbers finite and bounded; nested structures and operator counts must be validated before application.
- **Actual:** Only a few top-level values are bounded. Arbitrary nested objects override defaults. Missing sustain becomes Number(undefined)=NaN, and `??` does not replace NaN. Invalid FM operators can reach render/DSP code, without an error boundary.
- **Evidence / reproduction:** Source reproduction input `{"name":"bad","family":"FM","fmParams":{"operators":null}}`: accepted by initial predicate, merged unchanged and later consumed as an operator array. Minimal `{"name":"bad","family":"STRINGS"}` makes sustain NaN. Browser crash path is not executed here; acceptance and invalid value propagation are established by the source expression.
- **Recommended correction:** Parse into an explicit schema with finite-number validation, enum checks, bounded operator arrays and input size limits. Reject before mutation and display a recoverable error. Never treat fallback merging as validation.
- **Confidence:** HIGH.

### H10 — 009 — HIGH: Maneuver burns execute late and use an incorrect radial axis

- **Location:** `009/src/physics/NBodyPhysicsEngine.ts:153`; `009/src/physics/NBodyPhysicsEngine.ts:213`; `009/src/physics/NBodyPhysicsEngine.ts:219`
- **Expected:** Scheduled impulses should occur at their requested physical time. Radial-out is displacement from the selected primary, independent of whether the orbit is circular.
- **Actual:** Events are checked before the step using the interval behind the current time, so a node crossed within a step fires at a later step boundary. “Radial” is a 90° rotation of inertial velocity. For a counterclockwise circular orbit at +x with +y velocity it points inward.
- **Evidence / reproduction:** `numerical.ts`: straight-motion G=0 case with node at t=.5 and dt=1: at t=1 it is unexecuted; at next call it burns at t=1. A +1 prograde/+1 radial request at x=10,+y velocity yields vx=−1, vy=2. The same orientation is used in prediction, so matching preview does not establish a correct burn frame.
- **Recommended correction:** Split steps at event times; compute radial-out from craft−primary position and tangential direction consistently relative to primary velocity. Enforce fuel feasibility instead of applying arbitrary delta-v and merely clipping fuel to zero.
- **Confidence:** HIGH.

### H11 — 013 — HIGH: PGA is divided by solver dt rather than station sampling interval

- **Location:** `013/src/seismic/SeismographNetwork.ts:88`; `013/src/seismic/SeismographNetwork.ts:96`; `013/src/App.tsx:183`
- **Expected:** Station acceleration is Δv/Δt between station samples, with an explicit unit convention and an appropriate anti-aliasing/sample rate.
- **Actual:** Stations are polled on a wall-clock interval, while the solver advances on RAF. Acceleration divides by .055 s even when several solver steps elapsed. The claimed km/s→cm/s calibration is also replaced by an arbitrary 2.5 multiplier (the actual unit conversion is 100000).
- **Evidence / reproduction:** `adversarial.ts`: samples at simulation t=1 and 1.22 s, raw vx 0→1, output speed scale 2.5. Expected PGA with its own scale .011583727 g; reported .046334909 g, exactly 4×. At roughly four render steps per station poll the same timing defect arises. This test isolates timing, not the separate unsupported amplitude calibration.
- **Recommended correction:** Use current−previous historyTime (skip duplicate times), sample in simulation time, and calibrate an actual seismic source/units chain. Do not infer physical PGA validity from plausible-looking output ranges.
- **Confidence:** HIGH.

### H12 — 015 — HIGH: TDGL cannot model magnetic screening and omits advertised parameters

- **Location:** `015/src/quantum/TimeDependentGinzburgLandau.ts:137`; `015/src/quantum/TimeDependentGinzburgLandau.ts:186`; `015/src/components/CryoControlDeck.tsx:146`
- **Expected:** Meissner screening requires coupling supercurrent/order parameter to electromagnetic fields. An advertised κ control should affect penetration/coherence physics.
- **Actual:** A is overwritten from an external Gaussian every active step, and B=curl A is independent of supercurrent and ψ. κ is read by controls/presets but never by the solver. Thus the model is fixed-field TDGL, not a coupled magnetic screening simulation. The displayed vortex counter samples every other plaquette, omitting three quarters of interior unit plaquettes.
- **Evidence / reproduction:** `adversarial.ts`: zeroing ψ leaves the computed B array identical (max change 0). Source shows no field backreaction equation and no params.kappa usage. A zero-field uniform |ψ|=sqrt(1−T/Tc) does remain steady to Float32 precision, so the scalar relaxation itself has a valid reference case.
- **Recommended correction:** Either restrict claims to order-parameter relaxation in a prescribed field or implement electromagnetic evolution with gauge-consistent boundaries and κ. Count all plaquettes or document/validate a spatially coarse winding estimator.
- **Confidence:** HIGH.

### H13 — 015 — HIGH: Dilution cooling remediation remains wrong by ~44×

- **Location:** `015/src/cryo/CryogenicThermalEngine.ts:58`
- **Expected:** Using the documented low-temperature approximation Q[µW]=84×flow[µmol/s]×T[K]² gives 1.89 µW at 100 µmol/s and 15 mK (neglecting return-stream correction).
- **Actual:** A normalized expression yields 84 µW at those same parameters. The claimed removal of an extra factor did not establish dimensional consistency.
- **Evidence / reproduction:** `adversarial.ts`: call step with dt=0 to isolate the formula, flow=100 and initial T=.015 K. Actual coolingPowerMicroW=84 versus 1.89 under the equation stated in its own report; ratio=44.4444. This is a check against the advertised approximation, not a complete refrigerator model.
- **Recommended correction:** Use explicitly dimensional flow and Kelvin temperature, document approximation limits and any return-temperature term. Add numerical reference cases at multiple temperatures and flow rates before recalibrating thermal evolution.
- **Confidence:** HIGH.

### H14 — 011 — HIGH: Flight mode continues evolving while simulation is paused

- **Location:** `011/src/App.tsx:212`; `011/src/App.tsx:214`; `011/src/App.tsx:266`
- **Expected:** Pause should freeze flight state and its coupled obstacle geometry, or clearly distinguish independently running subsystems.
- **Actual:** The fluid canvas checks isPaused, but the 50 ms flight timer has no pause gate or dependency and continues moving the glider, altitude/score and solid mask. It also mutates the solver inside a React updater, which must be pure.
- **Evidence / reproduction:** Source reproduction: enter flight, pause header simulation and inspect the interval body; it unconditionally calls setGliderState and updateObstacleGeometry. No browser execution is claimed. Fluid pause remediation exists, but does not fix the coupled flight lifecycle.
- **Recommended correction:** Gate all simulation subsystems with one run state. Advance solver/flight from a simulation controller outside React updaters; publish snapshots to the UI afterward.
- **Confidence:** HIGH.

## D. Experiment-by-Experiment Review

The following medium findings and bounded successes supplement C. Any capability without an explicit numerical/source test is not independently verified. Scientific fields are nondimensional unless a coherent conversion is implemented; display labels do not establish units.

### M01 — 006 — MEDIUM: Circle collision projection leaves particles inside solids

- **Location:** `006/src/engine/SPHEngine.ts:362`
- **Expected:** A penetration correction must move both coordinates onto/outside the obstacle surface.
- **Actual:** Only p.x is corrected; p.y is never projected. Oblique penetrations remain inside the circle.
- **Evidence / reproduction:** `numerical.ts`: circle center (400, 300), radius40, stationary particle(410, 310), all forces zero. After one update distance from center=30.66757<40.
- **Recommended correction:** Project both x and y along the normal, resolve degenerate center points, and test multiple incident angles.
- **Confidence:** HIGH.

### M02 — 006 — MEDIUM: Gray–Scott boundary buffers alternate between incompatible edge states

- **Location:** `006/src/engine/ReactionDiffusionEngine.ts:117`; `006/src/engine/ReactionDiffusionEngine.ts:160`
- **Expected:** A consistent fixed/reservoir, periodic or no-flux boundary must be applied to both buffers at each iteration.
- **Actual:** Only interior cells are written; nextU edges start at zero while u edges start at one. Swapping alternates boundary conditions and affects the interior. Reset does not initialize both scratch buffers.
- **Evidence / reproduction:** `numerical.ts`, uniform U=1, V=0 and one iteration per step: boundary U alternates 0 then1; near-edge U drops to .45 after two steps even though the uniform Gray–Scott equilibrium should be stationary with matching reservoir/no-flux boundaries.
- **Recommended correction:** Apply the chosen boundary to every new buffer and reset all buffers consistently.
- **Confidence:** HIGH.

### M03 — 006 — MEDIUM: Fluid telemetry and physical descriptors exceed the implemented model

- **Location:** `006/src/engine/SPHEngine.ts:411`; `006/src/engine/SPHEngine.ts:271`; `006/src/engine/SPHEngine.ts:152`
- **Expected:** FPS should measure rendered wall-clock frames; viscosity should not create unforced net pair momentum; naturally emerging shedding should be distinguished from imposed vortices.
- **Actual:** FPS is 1/clamped integration dt (max dt .016 gives ≥63 regardless of slow frames). Oil-specific one-sided viscosity multiplier breaks equal/opposite viscous forces across fluid types. Kármán preset seeds two external vortices. Surface tension is declared but unused; pressure is linear/clipped, not the advertised nonlinear Tait law.
- **Evidence / reproduction:** update(0) returns FPS250; a delayed frame still uses dt=.016. For an isolated oil/water equal-mass pair with unequal velocities, opposite viscous terms differ by 2.5×. Seeded vortex wells are explicit source data; observed swirling cannot independently validate vortex-shedding physics.
- **Recommended correction:** Measure actual frame cadence, symmetrize pair viscosity, implement or remove surface tension, describe the actual equation of state and label externally driven vortices.
- **Confidence:** HIGH.

### M04 — 008 — MEDIUM: CPU percentage is a voice/amplitude heuristic

- **Location:** `008/src/components/Header.tsx:106`
- **Expected:** A CPU meter should measure processing load or clearly show a non-CPU proxy.
- **Actual:** The UI combines voice fraction×32 and RMS×45 and labels it “% CPU”; no CPU/DSP timing is sampled.
- **Evidence / reproduction:** The displayed expression changes when gain/RMS changes at constant processing architecture and can report very different loads for equally expensive silent/loud nodes. Tooltip says estimated load but supplies no validated cost model.
- **Recommended correction:** Rename to a voice/load proxy or implement a measured AudioWorklet budget monitor with declared scope.
- **Confidence:** HIGH.

### M05 — 008 — MEDIUM: Offline export bypasses the live limiter; clipping is hidden at PCM encoding

- **Location:** `008/src/engine/ProceduralAudioEngine.ts:998`; `008/src/engine/ProceduralAudioEngine.ts:1119`
- **Expected:** Export should preserve stated safety processing and report clipping/nonfinite samples before irreversible encoding.
- **Actual:** Offline master connects directly to destination without a dynamics limiter; PCM conversion clamps every sample to [−1, 1]. The existence of a live compressor cannot prove zero clipping in exports or arbitrary imports.
- **Evidence / reproduction:** Source-level route inspection; actual OfflineAudioContext output was not executed because no browser could launch. This is a demonstrated route mismatch, not an invented clipping measurement.
- **Recommended correction:** Share live/offline graph configuration, validate floating render samples before encoding, and measure worst-case supported polyphony/presets. Preserve honest distinction between limiting and hard clipping.
- **Confidence:** HIGH.

### M06 — 010 — MEDIUM: Global purity is confused with separability; teleportation description overstates protocol

- **Location:** `010/src/quantum/QuantumSimulatorEngine.ts:358`; `010/src/algorithms/curatedAlgorithms.ts:18`
- **Expected:** An entangled pure state has Trρ²=1 globally even when single-qubit reduced states are mixed. A measured teleportation demonstration needs measurement and classical feed-forward, or a deferred-measurement explanation.
- **Actual:** isPure is false for Bell state because it is derived from local entropies. The teleportation preset uses coherent controlled corrections with no MEASURE gates, although its explanation says Alice measures and sends classical bits.
- **Evidence / reproduction:** `numerical.ts`: Bell amplitudes .5 on 00/11 and local purity .5 are correct, but isPure=false is wrong globally. Teleportation Bob reduced Bloch=(.8660254, 0,.5) matches Ry(π/3); its quantum information transfer works as a coherent/deferred-measurement circuit, not the literal narrated measured protocol.
- **Recommended correction:** Separate global purity, local reduced purity and separability metrics. Explain deferred measurement or implement actual measured classical feed-forward.
- **Confidence:** HIGH.

### M07 — 010 — MEDIUM: QASM parsing silently changes valid expressions and accepts invalid indices

- **Location:** `010/src/components/QasmInterchangeModal.tsx:115`; `010/src/components/QasmInterchangeModal.tsx:178`
- **Expected:** Accepted QASM must preserve gate parameters and register bounds; unsupported syntax must produce diagnostics.
- **Actual:** parseFloat("pi/2")||0 becomes0, and parseFloat("1.5*pi") becomes1.5. Unknown lines are silently ignored; register size is clamped while target indices are not validated before engine evaluation.
- **Evidence / reproduction:** Source reproduction: qreg q[2]; rx(pi/2) q[0]; loads identity rather than π/2 rotation. h q[99] reaches applyGate, whose bit-mask loop accesses stateVector outside its dimension and ComplexMath operations expect defined values. These source paths were inspected, not browser-executed.
- **Recommended correction:** Use a bounded expression parser and validate gate arity, register indices and distinct controls. Reject unsupported features; state a supported QASM subset rather than claiming full bidirectional 2.0 compliance.
- **Confidence:** HIGH.

### M08 — 011 — MEDIUM: Aerodynamic coefficients and shedding are not consistently normalized measurements

- **Location:** `011/src/lbm/LatticeBoltzmannSolver.ts:351`; `011/src/lbm/LatticeBoltzmannSolver.ts:357`; `011/src/lbm/LatticeBoltzmannSolver.ts:385`
- **Expected:** Reference length should match selected body geometry; empty-domain drag/shedding should be zero or undefined. Lattice frequency should use solver steps and a declared physical mapping.
- **Actual:** All profiles use reference chord60 including cylinder diameter24 and plate50. Drag has a .001 force floor and .005 CD floor. If no lift crossings occur a fallback frequency remains positive, then is labelled Hz. Inlet “Zou–He” is actually full equilibrium replacement, and outlet is zero-gradient copying.
- **Evidence / reproduction:** `numerical.ts`, empty100×50 grid after 100 steps: CL0, dragForce .001, CD .00520833, shedding .6 Hz, St .1249974 although no obstacle or shedding exists. Cylinder reference drag/Re is mis-scaled by 24/60. Momentum-exchange force sign correction itself exists.
- **Recommended correction:** Keep signed raw forces; distinguish display rounding floors from physics. Pass characteristic length per geometry and derive frequency from detrended lift over simulation time. Label simplified equilibrium inlet/zero-gradient outlet honestly.
- **Confidence:** HIGH.

### M09 — 013 — MEDIUM: Source magnitude, rupture and tsunami claims are phenomenological

- **Location:** `013/src/seismic/ElastodynamicsSolver.ts:164`; `013/src/seismic/ElastodynamicsSolver.ts:221`; `013/src/tsunami/TsunamiSolver.ts:143`
- **Expected:** A stated Mw-calibrated finite rupture should use a normalized moment tensor/source-time function and propagate rupture with its configured velocity. Physical coastal runup requires a moving shoreline/wet–dry formulation.
- **Actual:** Earthquake injection is instantaneous with 10^[.8(Mw−6)] amplitude; stressDropMpa and ruptureVelocityKmS do not enter the solver. Spatial derivatives use collocated centered two-cell stencils, not the claimed staggered grid. Tsunami “runup” is the maximum sea elevation over fixed wet shelf cells; there is no dry-land inundation.
- **Evidence / reproduction:** Moment scaling of a fixed source geometry should follow M0∝10^(1.5Mw), whereas this source follows exponent.8 without an explained dimensional model. A checkerboard Fourier mode is invisible to centered ±1 gradients (sin(kdx)=0 at Nyquist), demonstrating a spatial-decoupling risk; no long-run instability is asserted. Tsunami boundaries are sponged/held, not a validated shoreline.
- **Recommended correction:** Describe a qualitative impulse-wave demonstration unless a physical source and unit calibration are added. Implement/document the actual stencil and source-time function; report shelf elevation separately from runup. Validate travel times, P/S speeds and reflected/absorbed energy.
- **Confidence:** HIGH.

### M10 — 012 — MEDIUM: Optical preset performance and some telemetry are asserted rather than derived

- **Location:** `012/src/optics/ThinFilmEngine.ts:17`; `012/src/optics/WaveOpticsEngine.ts:447`
- **Expected:** Preset claims should reproduce their stated reflectance; fringe/FWHM readouts should be derived from the field or labelled analytic estimates.
- **Actual:** V-coat claims R<.25% at 532 nm; actual response is ~27.80%. Five-pair DBR claims >99%, but R≈97.267% at 550 nm. Fringe count is 10+sin(mirrorTiltDeg)×12 (degree value passed to radian sine), and “FWHM” is a brightness/beam-waist heuristic, not a measured half-maximum width.
- **Evidence / reproduction:** `adversarial.ts` calculates V-coat R=.27797833 at 532 nm for nSub1.52. `numerical.ts` gives DBR R=.97267345 at 550 nm. Field-independent telemetry expressions are explicit in propagateWave.
- **Recommended correction:** Optimize and verify actual coatings, scope claims to tested wavelengths/substrates, derive field observables numerically and label analytical reference values distinctly.
- **Confidence:** HIGH.

### M11 — 016 — MEDIUM: Observer-distance control is unused and curvature/beaming displays are heuristic

- **Location:** `016/src/relativity/RelativisticRayTracer.ts:96`; `016/src/relativity/RelativisticRayTracer.ts:181`; `016/src/relativity/RelativisticRayTracer.ts:230`
- **Expected:** An observer-distance control in a ray geometry should influence projection or have an explicitly invariant convention; a Kretschmann label requires48M²/r⁶.
- **Actual:** D_obs is assigned and never used. Boost exponents3.5/3.2 differ from claimed δ⁴; gamma uses line-of-sight β rather than total speed. Curvature coloring divides by impact parameter^3.5, not actual radius^6. This supports an illustrative graphic, not the declared invariant map.
- **Evidence / reproduction:** Search render: observerDistance has no downstream use. At fixed FOV all pixels are algebraically invariant to that slider. The exponent mismatch is directly readable; no screenshot interpretation is needed.
- **Recommended correction:** Wire observer geometry consistently and correct formulas or rename the panels as stylized approximations. Keep invariant calculations separate from artistic palette contrast.
- **Confidence:** HIGH.

### M12 — 006–017 — MEDIUM: Default typecheck does not cover these experiments; 008 fails an actual scoped check

- **Location:** `tsconfig.json:18`; `008/src/engine/ProceduralAudioEngine.ts:934`
- **Expected:** A verification claim for an experiment should run TypeScript over that experiment’s sources with the checked-in toolchain.
- **Actual:** Shared tsconfig includes only 003/src and src. Thus bare npx tsc --noEmit does not typecheck006–017. Scoped strict checks with vite/client pass11 experiments; 008 produces TS2345 at 934, 957, 965 for typed-array buffer generic mismatch.
- **Evidence / reproduction:** Command: tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ESNext --lib DOM, DOM.Iterable, ESNext --module ESNext --moduleResolution bundler --jsx react-jsx --allowSyntheticDefaultImports --types vite/client 008/src/main.tsx (from the shared parent, TypeScript7.0.2). Without vite/client all experiments initially emit CSS ambient-module errors; those are tooling context, not attributed as source bugs.
- **Recommended correction:** Add per-experiment configs or references, run scoped checks in CI, fix analyser buffer typing, and record exact commands/version and commit hashes. Do not equate Vite transpilation with type validation.
- **Confidence:** HIGH.

### M13 — 015 — MEDIUM: Preset reducers still mutate engines; pinning strength does not rebuild the map

- **Location:** `015/src/App.tsx:135` (`handleSelectPreset`); `015/src/App.tsx:290` (`handleUpdateTdglParams`).
- **Expected:** React functional state updaters should be pure; changing a defect-strength control should update the actual defect map.
- **Actual:** Slider handlers move mutations outside updaters, but preset handlers still call `generateDefaultPinningSites`, `resetOrderParameter`, `computeStaticCurves` and BEC initialization inside functional state updaters. The TDGL parameter handler rebuilds the pinning map only if density changes, ignoring a strength-only change.
- **Evidence / reproduction:** Source inspection: preset selection executes mutable solver operations inside `setTdglParams(prev => ...)`, `setJosephsonParams(prev => ...)` and `setBecParams(prev => ...)`. React may replay updaters in development; externally visible mutation is not safe there. For a strength-only slider event, `p.pinningDensity` is undefined so the map-rebuild branch does not run. No browser replay or slider test was executed.
- **Recommended correction:** Construct the next settings and update/reset engines once in an explicit controller event, then publish React state; rebuild the map when density **or strength** changes.
- **Confidence:** HIGH for source behavior; runtime impact under concurrent rendering is unmeasured.

### 006 — NEURO-FLUID

**Model:** normalized 2D poly6 density, spiky pressure forces, viscous interaction and symplectic Euler with prescribed gravity/vortices; Gray–Scott finite differences on a separate grid. The repaired 2D poly6 constant integrates to one: 2π∫₀ʰ[4/(πh⁸)](h²−r²)³r dr=1. Symmetric pressure acceleration is equal/opposite for equal-mass isolated particles. Particle count is capped at 2500. These are substantive implementations.

**Limits:** speed clamp950 and dt clamp.004–.016 are visual safeguards, not a convergence proof. SPH mass is fixed by particle count only; emission/erasure/recycling are open-system sources. Oil and water have the same mass/rest density; “heavy” oil changes viscosity, not density. Chemical deposition is one-way; there is no fluid advection of concentrations or chemical feedback on momentum. No hydrostatic pressure or dam-break analytical benchmark was run. C/M findings cover projection, boundaries and telemetry. Kernel normalization remediation is real; it does not validate hydrodynamic fidelity or physically emerging Kármán shedding.

### 007 — GENOME-FORGE

**Model:** 8-input/6-hidden/4-output feed-forward network with 82 parameters (54 hidden weights/biases +28 output parameters), energy/health bookkeeping, predation and trait mutation. There is genuine neural inference and heredity; this is an artificial-life model, not literal gene regulation or CRISPR chemistry. Mutation noise is uniform bounded noise despite “Gaussian” description. Neural connectivity is fixed, not a regulatory biochemical network.

**Confirmed safeguards:** dead-organism skip guard, nutrient cap350 and meat lifespan35 s exist. Newborn aliasing (H01) invalidates population/selection statistics and long-run simulation accounting. spawnOrganism itself has no hard population cap for manual inoculation. No ecological statistical validation is claimed; default/max-load timings cannot certify population correctness.

### 008 — PROCEDURAL INSTRUMENT LAB

**Model:** Web Audio feedback-delay strings, oscillator/noise percussion, operator FM, nonlinear/filter wind synthesis and feedback/additive experimental sounds. No external recorded audio dependency was found. Waveguide Q=.5 and bounded loop feedback, separated FM carrier/modulation gains, cancelAndHoldAtTime guards and voice tracking changes exist in source. A/B slot state and keyboard original-MIDI map are implemented.

**Limits:** equal-loudness matching is preset gain compensation, not a measured loudness normalization procedure. Audio fidelity, anti-clipping across all settings, maximum-polyphony CPU and voice cleanup over hours are UNTESTABLE here. The importer accepts malformed DSP state (H09); offline route lacks live limiting (M05). No numerical sound sample results from earlier reports were reused as independent measurements.

### 009 — ORBITAL-MECH

**Model:** Newtonian pair acceleration with consistent Plummer-softened potential, 4-stage Yoshida splitting for conservative separable dynamics; optional velocity-dependent atmospheric and approximate precession forces, scripted Roche fragmentation, and shadow rollout. With drag enabled, or impulses/fragmentation, exact symplectic/energy preservation does not apply. Symplectic algorithms generally conserve a modified Hamiltonian approximately; they do not exactly preserve the original energy at arbitrary dt.

**Executed reference:** static unit primary + negligible test mass in a unit circular orbit, G=1, ε=0, drag/tides off; ten orbits. At100/200/400 steps per orbit, final position errors7.87048e−4/4.94905e−5/3.09785e−6 give error ratios≈15.9/16.0. Maximum relative energy drift percentages were 1.2558e−8/5.0251e−11/3.6603e−12. This is convincing bounded evidence for fourth-order Newtonian integration. It does not establish the published <0.05% claim for arbitrary close encounters/high time warp.

**Limits:** preset histories are scaled planar approximations, not reference-ephemeris reproductions; L2 “halo” cannot be a genuine spatial halo in a strictly2D model. Roche breakup is a threshold-scripted fragmentation, not deformable-body tidal dynamics. Maneuver event timing/frame and fuel limitations require remediation. Prediction calls the same acceleration function (including callbacks), so it is not strictly side-effect-free.

### 010 — QUANTUM-GATE STUDIO

**Model:** exact small-register complex state-vector transformations and projective Born-rule collapse, with correct partial-trace Bloch components. The tested six presets retain total probability within2.3e−15 of 1. Bell marginal purity=.5, Grover target101 probability=.7812499999999983, Deutsch–Jozsa query bits11 and superdense decoded11 match references. QFT test from ground state only confirms uniform output; it is not full transform-matrix verification. Teleportation Bob’s reduced state matches the prepared state, with the deferred-measurement caveat inM06.

**Limits:** single-qubit marginal entropy average is not a general multipartite entanglement measure. Measurement outcomes are resampled whenever runCircuit resets/replays; it is not an ensemble density-matrix simulator. Parser and gate-index validation need work. Eight-qubit density rendering uses a canvas (good DOM scaling), but still computes O(4ⁿ) coherence pixels; “O(1)” applies only to DOM-node count. Browser resizing, maximum-register performance and round-trip QASM import were not executed.

### 011 — AERO-TUNNEL

**Model:** actual D2Q9 BGK collision, pull streaming, bounce-back links, simplified inlet/outlet and top/bottom slip. Momentum-exchange sign now matches reaction on the solid. Empty uniform-flow test gives density error≤1.1921e−7 after 100 steps.

**Limits:** viscosity determines lattice Reynolds number, not a validated physical aircraft Reynolds scale. Local velocity clamp .22 corresponds to Mach≈.381 (cs=1/√3), not <.3 as one source comment says; clamping changes the equations. Airfoil raster resolution and wall blockage materially affect forces. A preset called supersonic wedge cannot demonstrate physical supersonic shocks in this low-Mach solver. No grid-convergence or validated NACA/cylinder drag/lift reference study was run. The aerodynamic stall flag is largely angle/threshold logic, not independently established stall detection. Flight mode imposes lift/drag floors and time-step-free scaled forces; treat it as a game-like demonstration, not flight mechanics validation.

### 012 — OPTICA-FORGE

**Model:** sampled secondary-emitter complex sums, synthetic interferometer field formulas, lossless-layer matrix optics and an approximate absorbing-layer extension. Glass R≈.04258 and lossless MgF₂ AR R≈.01260 at 550 nm are reasonable. Airy finesse formula exists as an analytic reference.

**Limits:** C/H findings show broken aperture-width coupling, missing hologram propagation and incorrect absorbing admittance. Interference visibility attenuates one arm’s amplitude rather than only mutual coherence: at complete incoherence equal independent beams should retain summed intensity, not lose a beam’s power. Intensity is normalized per frame, obscuring energy comparison. No optical power integral/convergence test is established. Static dirty tracking reduces recomputation while idle; changing controls still causes a large synchronous computation (see performance table).

### 013 — SEISMIC-LAB

**Model:** real isotropic elastic velocity/stress evolution using Lamé parametersρVp²/ρVs², surface stress zeroing and sponge boundaries; a separate1D shallow-water elevation/velocity update with fixed bathymetry. For default maximum Vp8.1 km/s, dt.055 s and dx=dz=1 km, a conservative sqrt(2)Vpdt/dx≈.630<1; this is a useful default step-size bound, not boundary accuracy proof. No Clayton–Engquist operator was found in the inspected solver.

**Limits:** collocated spatial derivatives, uncalibrated impulsive source, fixed-threshold phase picking and arbitrary ground-motion scale prevent quantitative geophysical endorsement. Phase picks identify amplitude threshold crossings, not a demonstrated robust P/S/Rayleigh classifier. Solver and tsunami clocks advance one step per same RAF but .055 s versus .5 s respectively; coupled visual time is not a common physical clock. Theoretical travel curves use homogeneous surface velocities/slant distances, not ray tracing through the layered medium. No independent Rayleigh dispersion, arrival-time, reflection or tsunami shoaling accuracy study was performed.

### 014 — PLASMA-LAB

**Model:** prescribed-shaped flux plus heuristic q/current profiles, genuine Bosch–Hale reactivity expression, empirical confinement scaling and 0D thermal energy evolution, threshold stability/VDE bookkeeping. Troyon beta unit conversion is now physically dimensioned in MhdInstabilityEngine. Reactor geometry and magnetic derivatives are computed in real arrays.

**Limits:** no equilibrium residual, self-consistent MHD force balance or field-line Poincaré integration; puncture map points are parametrically drawn D-surfaces with imposed sinusoidal islands. “Rutherford” island growth is an empirical risk rule, not a solved resistive-MHD evolution. FRC preset retains a strong toroidal field rather than the nearly-zero field described in its text. Source density profile is fixed1.0sqrt(1−ρ²)+.1 independently of thermonuclear density, so exported radial pressure is not the current reactor state. C02/C03 are release-blocking scientific issues.

### 015 — CRYO-LAB

**Model:** fixed-external-field gauge-link TDGL, a genuine RK4 RCSJ junction ODE, heuristic static IV/SQUID curves, sign-invalid BEC propagation, and lumped refrigerator/magnet energy equations. Uniform zero-field TDGL steady amplitude sqrt(1−T/Tc) agrees to≈1.2e−8 in the executed case. Junction voltage history now preserves signed phase velocity. Coil-radius guard and letterbox coordinate helper exist.

**Limits:** BEC norm renormalization is not numerical correctness. Its condensate fraction1−.05|g| is a heuristic, not derived finite-temperature depletion. SQUID inductanceBetaL is not consumed by dynamics; static Shapiro plateaus are explicitly pinned to chosen targets instead of obtained by averaged dynamical sweeps. fRf labelledGHz is inserted as dimensionless2πf without a corresponding characteristic-time conversion, while physical voltage is arbitrarily1.5mV×v. Scope physical Josephson voltage claims accordingly. Background stepping remains mode-dependent and uses stale prescribed links when TDGL is inactive; a single physical clock is absent.

### 016 — RELATIVITY-LAB

**Model:** approximate effective-force particles, algebraic Kerr-inspired shadow/disk rendering, leading quadrupole-like chirp with inconsistent time scaling, analytic horizon/ISCO/embedding reference overlays. Correct formulas in overlays do not validate the approximate dynamics.

**Limits:** no metric Hamiltonian/null-constraint integration, no radiative-transfer ray propagation and no 3.5PN expansion. No physical Penrose energy extraction calculation was identified in the particle engine (energy is assigned1). Normalizing geometry toM=1 can be legitimate, but a mass-in-solar-units slider needs a stated physical conversion to have meaningful effect. Observer distance is an unused visible control. Export contains current parameters/telemetry, not geodesic trajectories or GW time-series arrays; it cannot be used to reproduce a waveform recording. audit-report.md is absent.

### 017 — COLLIDER-LAB

**Model:** correct ordinary allowed two-body rest-frame kinematics and boosts, E-scheme sequential clustering using inverse-pT² distances, geometric circular tracker paths and simple fixed-fraction calorimeter deposits. In1000 allowed decays, four-vector residual≤2.85e−14 and daughter-mass error≤3.64e−12 (GeV). This is real mathematical functionality.

**Limits:** below-threshold helper splits the parent four-vector in halves rather than rejecting impossible daughters: parent mass2, daughter requests1and2 returns masses1and1. Breit–Wigner helper samples a Cauchy mass distribution, not a fully relativistic line shape/cross-section. Anti-kt uses pseudorapidity rather than rapidity after massive recombination, a common educational approximation requiring disclosure. No comparison against FastJet was run. Detector calorimeter effects are illustrative fixed energy fractions, not material shower transport. Detector hits do not drive MET or truth resonance tagging. Trigger/statistical closure and full-event momentum findings are significant. audit-report.md is absent.

### 018 — STELLAR-FORGE

Only a queue concept exists locally. There is no 018 directory, source, report, verification, audit, or dist to inspect at capture/recheck. Lane–Emden, TOV, nucleosynthesis and supernova claims therefore remain **unimplemented in the audited checkout / INSUFFICIENT EVIDENCE**. This is not a failed completed experiment and is not scored 0.

### Functional and lifecycle coverage boundary

Every available experiment has React composition, stateful controls and Canvas/Audio engine code; these are not empty visual shells. Source inspection found explicit RAF/interval teardown and numerous pointer-capture/cancel paths. Existing dynamic dimension and DPR fixes are useful. No blanket “no memory leaks” conclusion is justified: node lifetimes, multiple timers, hidden-tab scheduling, graph disposal and asynchronous cleanup need browser measurement.

End-to-end controls, keyboard recovery on blur, repeated modal opening, mobile layouts, DPR 2 dragging, actual CSV downloads, JSON round-trip fidelity and all presets were **not browser-executed**. Source-level checks found actual disconnected or misleading controls (012 slit width, 015κ, 016 observer distance, 017 triggers) and pause inconsistency011. Export code generally serializes selected configuration/telemetry rather than full engine buffers/initial RNG state; do not market those files as resumable scientific snapshots. No executable HTML/JS evaluation of imported JSON was identified; malformed-input availability is demonstrated, remote code execution is not claimed.

### Executed build and typecheck matrix

| ID | Vite build | JS / CSS kB (decimal, printed by Vite) | Scoped TS7.0.2 |
|---|---|---|---|
|006|exit0|254.39 /21.90|exit0|
|007|exit0|284.28 /34.77|exit0|
|008|exit0|300.43 /33.66|**exit1; 3 typed-array errors**|
|009|exit0|302.14 /36.32|exit0|
|010|exit0|278.49 /31.43|exit0|
|011|exit0|280.83 /26.98|exit0|
|012|exit0|280.75 /25.26|exit0|
|013|exit0|284.36 /26.66|exit0|
|014|exit0|293.61 /29.93|exit0|
|015|exit0|292.94 /22.33|exit0|
|016|exit0|278.42 /22.69|exit0|
|017|exit0|299.53 /33.12|exit0|
|018|absent|NE|NE|

Build command: from each snapshot experiment directory, run the installed shared `node_modules/.bin/vite build` by absolute path. Build durations for 007–017 were 7.69–10.73 s during simultaneous builds; 006 single direct build .832 s. Those durations are not comparable performance benchmarks. Typecheck command is recorded under M12. Root default TypeScript inclusion is not an adequate substitute.

### Engine performance: measured, not browser FPS

Single Node 20.20.2 Linux x64 run, 5 warm-up calls per case, per-step performance.now, process.cpuUsage. Workloads were not statistically replicated; maximum-load particles evolve into variable distributions, and the 250-initial-organism workload can grow via the aliasing defect. Timing includes shared-host scheduling and JIT/GC effects. Browser Canvas/React/Web Audio costs are excluded. p95 uses sorted sample at floor(.95N), not an interpolated estimator.

| Workload | Measured calls | Mean ms/call | p95 ms/call | Process user CPU ms over case |
|---|---:|---:|---:|---:|
|006 832 particle default, SPH only|200|7.17|7.92|1171.96|
|006 2500 particle maximum, SPH only|200|23.25|131.79|4393.39|
|006 extended maximum, following previous case|1000|37.40|174.43|36822.23|
|007 default evolving ecosystem|200|1.42|3.05|301.13|
|007 250 initial phototrophs|200|1.77|4.33|265.13|
|011 220×90 cylinder LBM default|100|4.53|6.06|448.43|
|011 max inlet 0.18, min viscosity 0.005|100|4.68|6.31|459.60|
|012 280×140 diffraction, changing distance|20|77.73|227.54|1546.16|
|013 240×120 homogeneous elastic grid|200|.54|1.46|80.63|
|014 120×120 prescribed equilibrium rebuild|100|3.18|3.64|297.90|
|015 120×120 BEC update|200|1.37|1.12|271.95|
|016 160×120 analytic ray-image render|100|7.74|30.25|541.13|
|017 top event incl detector/clustering|100|7.09|19.55|69.23|

A mean can exceed p95 if a small number of extreme outliers dominate (015); no rows were edited to force a smooth distribution. Process CPU is not wall time; 017's large wall/CPU difference illustrates scheduling sensitivity. No browser FPS can be computed defensibly from this table. On this host, 006 maximum and 012 changing optics exceed a 16.7 ms frame budget in engine work alone. Spatial hashing is not a guaranteed O(N) bound: dense neighborhoods still approach O(N²).

**Extended/reset/adversarial conditions actually exercised:**006 — 200+1000 maximum-load updates (~19.2 simulated seconds at 0.016 dt, after warmups), 30 combined 006 reset/viscosity changes and 015 reset/±g changes. After explicit GC, process heap used was 5, 196, 872→4, 807, 672 bytes and arrayBuffers5, 510, 259→5, 510, 259 bytes. This short engine-only observation finds no retained-buffer growth in that reset loop; it does not prove browser leak freedom or characterize GC pause distribution. No hours-long soak, all-experiment reset benchmark, rapid UI interaction benchmark, audio processing cost or browser memory trace was possible.008 maximum polyphony, 009 maximum body spawning and 010 eight-qubit UI remain unmeasured.

## E. Previous Audit Reliability

**Overall reliability: useful issue discovery, unreliable scientific sign-off.** Many concrete fixes exist, but “all mathematically verified / full production ready” conclusions substantially exceed evidence. These findings do not establish dishonesty or auditor context isolation; subagent IDs and copied sign-off prose are not independently inspectable execution evidence. Historical outcomes may have occurred on other revisions; verification JSON lacks tested source hashes needed to bind them to this checkout.

Definitions: VERIFIED=implementation/fix independently established within stated scope; PARTIALLY VERIFIED=code present but root cause/behavior incomplete; NOT VERIFIED=claim lacks supporting evidence; CONTRADICTED=current source or executed test disagrees; UNTESTABLE=requires unavailable execution environment/history.

| Experiment / previous significant finding | Independent classification | Reason |
|---|---|---|
|006 2D kernel/gravity repair|VERIFIED (bounded)|2D poly6 normalizes; external gravity separate; not full fluid validation|
|006 deposition registration / ref-based RAF|VERIFIED source; runtime UNTESTABLE|Dynamic canvas arguments and persistent mode refs exist|
|006 audio guards/rate limit/disposal|VERIFIED source; audible safety UNTESTABLE|Gesture init, timestamp limiter and cleanup exist|
|006 recycling and eraser coverage|VERIFIED source|Particle/obstacle/vortex erasure and channel recycling present|
|006 naturally correct Kármán/“full production ready”|CONTRADICTED / NOT VERIFIED|Forced vortices, circle projection and RD edge defects remain|
|007 ghost death guard/nutrient cap&decay|VERIFIED source|Dead-ID skip and 350 cap / 35 s decay exist|
|007 clone weight retention|VERIFIED source|CRISPR modal retains copied brainWeights|
|007 connectome RAF, mutagen limiter, header audio init|VERIFIED source; runtime UNTESTABLE|Specified handlers/lifecycle exist|
|007 negative energy bar, packed grid, extinction UI/feed cue|VERIFIED source|Concrete implementations exist; not independent UX approval|
|007 mitosis/selection fully verified|CONTRADICTED|Same child twice; elementary birth invariant missed|
|008 waveguide Q/feedback & FM gain split|VERIFIED source; numeric audio values UNTESTABLE|Relevant safety changes present; no new audio sample execution|
|008 cancel-and-hold, MIDI map and releasing voices|VERIFIED source; click/stuck-note regression UNTESTABLE|Code addresses stated mechanisms; prolonged audio not run|
|008 percussion pitch/stop, offline articulation|VERIFIED source|Frequency ratio/stop schedules and offline gate/release present|
|008 A/B sync and DPR visualizer changes|VERIFIED source; perceptual matching UNTESTABLE|State sync/DPR code present; equal loudness not measured|
|008 live CPU/schema validation|CONTRADICTED|CPU heuristic and unvalidated nested JSON; M04/H09|
|008 0 clipping across families/all settings|UNTESTABLE; blanket inference NOT VERIFIED|Past samples do not prove all settings; offline limiter bypass persists|
|009 camera/gizmo/capture fixes|VERIFIED source; pointer accuracy UNTESTABLE|Transform/drag handlers and capture present|
|009 transient cleanup/mute ramp|VERIFIED source; leak/pop claims UNTESTABLE|onended disconnects and gain ramp exist|
|009 softened potential repair|VERIFIED|Potential uses same epsilon as force; bounded conservation test passes|
|009 Lagrange generalization/planar terminology/30 Hz|VERIFIED source|Detection/generalization and counter throttling present|
|009 exact energy/unconditional historical fidelity|NOT VERIFIED|Only tested conservative reference established; drag and scripted breakups differ|
|010 3 qubit control fallback|PARTIALLY VERIFIED|Distinct available controls for valid ≥3 register; no robust out-of-range/arity validation|
|010 QASM sync/parser expansion|PARTIALLY VERIFIED|Sync and gate regexes exist; expressions/bounds unsupported silently|
|010 density Canvas/ResizeObserver/audio sync/playback rewind|VERIFIED source; runtime UNTESTABLE|Implementations match named fixes|
|010 Grover probability correction|VERIFIED|Executed 25/32 probability agrees|
|010 basis toggles|VERIFIED source; UI interaction UNTESTABLE|Wire action exists; QASM does not express a separate classical-state protocol|
|011 force vector fix|VERIFIED source|−2cᵢfpost is reaction on obstacle|
|011 positive drag floor as accuracy fix|CONTRADICTED|Empty tunnel produces nonzero drag/shedding; floor hides output problems|
|011 pause/glider coupling|PARTIALLY VERIFIED|Fluid pauses; flight keeps updating mask while paused|
|011 offscreen cache/smoke/polar UI|VERIFIED source; zero-GC claim NOT VERIFIED|Refs and dual polar controls exist; smoke arrays still allocate|
|011 velocity clamp stability proof|PARTIALLY VERIFIED|Clamp exists; not a conservation/convergence proof and changes dynamics|
|011 audio destroy and pointer cancel|VERIFIED source; runtime UNTESTABLE|Explicit cleanup/cancellation bindings exist|
|012 metallic NaN repair|PARTIALLY VERIFIED numerically; exact optics CONTRADICTED|Finite/clamped values returned but complex admittance remains wrong|
|012 percentage formatting/palette/dirty flag|VERIFIED source|Concrete fixes exist; no browser CPU-percent reproduction|
|012 audio compressor reroute|VERIFIED source; zero clipping UNTESTABLE|Correct routing is not peak measurement|
|012 reconstruction and physical observables verified|CONTRADICTED|Hologram distance invariance, dead slit width, fabricated fringe/FWHM|
|013 persistent SWE buffers|VERIFIED source|Scratch allocation moved out of step|
|013 physical scaling “calibration”|CONTRADICTED|Arbitrary 2.5 factor replaces units; PGA uses wrong Δt|
|013 historyTime CSV fix|VERIFIED source; PARTIALLY VERIFIED root cause|Timestamps stored/exported, acceleration denominator still wrong|
|013 display gain/geology/phase audio|VERIFIED source; scientific arrival classification NOT VERIFIED|UI changes exist but threshold picks not validated phases|
|014 Troyon conversion|VERIFIED source|n × keV to SI and percentage normalization corrected|
|014 gizmo double-offset/hit test/ref/caches/tabs|VERIFIED source; pointer/runtime UNTESTABLE|Named handler/buffer fixes exist|
|014 radiation “~3.4 MW” and ITER steady balance|CONTRADICTED|First-step cyclotron loss ~397.46 MW; thermal 10× and baseline collapse|
|014 boundary derivatives/Poincaré regeneration|VERIFIED source; physical field-line map NOT VERIFIED|Derivatives/regeneration exist; points are parametric, not field-line tracing|
|015 BEC norm repair|PARTIALLY VERIFIED mechanics; scientific resolution CONTRADICTED|Renormalization exists; kinetic sign wrong; norm assigned 1|
|015 letterbox helper|VERIFIED source; direct dragging UNTESTABLE|Explicit aspect/offset mapping exists|
|015 active-mode gating|PARTIALLY VERIFIED|BEC gated; TDGL/Josephson reduced; cryo continuous; not a shared physical clock|
|015 updater mutation fix|PARTIALLY VERIFIED|Slider handlers fixed; preset state updaters still mutate engines (M13)|
|015 voltage sign/coil guard/render cache|VERIFIED source|Named implementation changes present|
|015 cooling-unit fix|CONTRADICTED|Documented84nT² limit wrong by 44.44×|
|016 claimed teardown/ref throttling/Doppler clamps|VERIFIED source; numerical accuracy NOT VERIFIED|Cleanup/ref/clamps present; metric/GW fundamentals fail|
|016 GW phase continuity/CFL claim|PARTIALLY VERIFIED|Piecewise substeps and phase carry exist; not an error-controlled CFL proof; inconsistent time units|
|016 separate dual audit signoff|NOT VERIFIED|audit-report.md missing|
|017 track arc/argument-order/DPR fixes|VERIFIED source; full UI UNTESTABLE|Correct alpha0/bendSign form and pT, phi, eta order present|
|017 trigger filtering remediation|CONTRADICTED|Eighth trial unconditionally accepted|
|017 memoization/buffer caching/audio gesture|VERIFIED source; zero GC/peaks UNTESTABLE|Memo/caches/resume paths exist; no full allocation audit|
|017 continuous fit/discovery significance|CONTRADICTED|Fixed Gaussian truth-counter display, no statistical fit|
|017 separate dual audit signoff|NOT VERIFIED|audit-report.md missing|

Many checked-in test scripts assert document titles, visible canvases, selected options, modal text and absence of console errors. Some conditional button lookups do nothing if a control is missing yet still log success (e.g. 009 test-run.cjs RCS/step sections, 014 mode/disrupt/reset sections). They do not independently prove equations, conservation, actual export contents or completed state transitions.008 contains more substantive offline-sample tests than the generic browser smoke pattern, but those past outcomes were not rerun here. Its checks inspect already-clamped PCM, so the `peak > 1` assertion cannot detect pre-encoding overload; its clipped-sample check is more useful but permits up to 50 saturated samples. Missing source-version binding also makes exact historical claim reliability UNTESTABLE.

## F. Cross-Experiment Patterns

**Legitimate reuse:** React for composition, mutable solver classes, typed-array buffers for fields, Canvas pixels, independent Web Audio engines, scenario definitions and export components form a sensible educational-lab foundation. There is real computational variety: particle neighborhoods, neural inference, linear algebra, lattice fluids, matrix optics and elastic waves are different numerical workloads.

**Formulaic product pattern:** from 009 onward especially, nearly every product repeats branded header, four-to-five suite tabs, six-ish narrative presets, giant Canvas bench, telemetry tiles, a control deck, procedural drone/chime engine and JSON/CSV modal. Scientific complexity increases faster in the report vocabulary than in validation depth. Advanced labels (3.5PN, GR geodesics, exact complex TMM, Grad–Shafranov, MHD, physical CRISPR) are sometimes layered over small heuristic rules or image formulas. This is a source-supported pattern, not a subjective complaint about consistent branding.

**Recurring numerical mistakes:** clamping values to make outputs plausible, renormalizing instead of testing the evolution operator, floor-imposed drag, ad hoc physical scale factors, independent clocks, synthetic observables unrelated to engine state, and analytic overlays mistaken for solver validation. Existing audits often discover a real issue, add a clamp/scale, and declare physics restored without a reference solution. The BEC fix and metallic TMM fix are the clearest examples.

**Recurring engineering risks:** high-frequency simulation on the main thread; React telemetry polling alongside independent RAF clocks; expensive predictions/recomputations on parameter change; mutation inside React updater callbacks; code that advertises O(1)/zero GC while only reducing DOM nodes or typed-array churn. Cleanup is often present but varies across engines; no measured general Web Audio leak was demonstrated. Physical safety claims require sampled peak measurements, not a DynamicsCompressorNode’s existence. User-provided JSON needs runtime schemas, and QASM needs strict failure diagnostics.

**Useful shared infrastructure:** a simulation clock with pause/reset/step and event scheduling; one coordinate/DPR/letterbox conversion utility; versioned snapshot/export schema with units and RNG seed; structured input validation; consistent audio lifecycle/graph construction and offline peak checks; measured telemetry types; reusable canvas buffer and worker facilities; scoped TypeScript/build tasks; and a reference-case numerical-test library. Reuse infrastructure, not scientific equations across unrelated domains.

## G. Recommended Remediation Roadmap

1. **Correct core state/equations first (small-to-medium effort, maximum impact):** fix 007 duplicate insertion/energy transfer; 015 kinetic signs and an independently checked propagator; 014 MJ conversion/profile convention; 009 radial basis/event time; 017 trigger fallthrough. Add tiny deterministic invariants for each before UI changes.
2. **Re-scope unsupported science immediately (small effort):** label 016 effective-force/lensing art and leading-order toy GW; 014 prescribed-flux equilibrium; 013 qualitative impulse/seismic amplitudes and shelf elevation; 012 hologram illumination until actual propagation exists. Remove fabricated CPU/fringe count/5σ labels or mark them as explicit toy proxies.
3. **Repair substantive advertised models (medium-to-large effort):** self-consistent GS sources/residuals; calibrated reactor power losses; unitary BEC kinetics; coupled TDGL screening or restricted claims; complex TMM; true diffraction aperture/FFT propagation; complete-event momentum closure/statistical inference. Do not demand research-grade realism; demand correctness of the educational model actually claimed.
4. **Align controls, clocks and exports (medium effort):** common run-state/controller, measured sample intervals, matched geometry references, valid parameter schemas, actual event rejection accounting and explicitly versioned numeric exports. Keep solver mutation out of React reducers.
5. **Restore verification integrity (small-to-medium effort):** scope typechecks to each experiment; record tested HEAD/source hashes, exact commands and limits; make every test assert engine values and control outcomes; retain reproducible failing cases from this report. Preserve the useful original fixes; re-audit root causes instead of reissuing blanket PASS.
6. **Then run browser/product/performance validation in a capable environment (medium effort):** default/max workload and a 30–60 minute soak; repeated reset/navigation; audio activate/mute/unmount and maximumvoiceplay; mobile + desktop + DPR 2; resize while dragging; keyboard blur recovery; actual download parsing and numeric comparison. Measure RAF cadence, long tasks, retained heap, audio nodes and floating-point peaks. The current audit’s browser restrictions are explicit gaps, not permission to infer these results.

## H. Final Verdict

A known core failure supports FAIL or NEEDS REMEDIATION even when browser testing is unavailable. Browser restrictions prevent positive product certification; no experiment earns an unconditionalPASS. INSUFFICIENT EVIDENCE is used for absent018. Known source/numerical defects are not hidden behind an evidence-gap verdict.

| ID | Verdict | Principal basis |
|---|---|---|
|006|**NEEDS REMEDIATION**|Circle projection, RD boundary alternation, momentum/telemetry limitations|
|007|**FAIL**|Aliased newborns invalidate lifecycle and evolutionary statistics|
|008|**NEEDS REMEDIATION**|Malformed import, DSP typecheck errors, CPU proxy; audio quality/performance untested|
|009|**NEEDS REMEDIATION**|Good Newtonian convergence; incorrect maneuver time/frame and broader claim limits|
|010|**NEEDS REMEDIATION**|Strong small-register references; unsafe/silent QASM parsing and purity semantics|
|011|**NEEDS REMEDIATION**|Real LBM; imposed floors/reference units and flight pause inconsistency|
|012|**FAIL**|Advertised diffraction control/holography/absorbing TMM fail targeted checks|
|013|**NEEDS REMEDIATION**|PGA sampling error and uncalibrated source/physical units|
|014|**FAIL**|Current-independent poloidal field and 10× thermal energy model|
|015|**FAIL**|Wrong BEC kinetic sign, missing magnetic screening, 44× cooling error|
|016|**FAIL**|Core GR/ray trace/3.5PN promises not implemented; GW time inconsistent|
|017|**NEEDS REMEDIATION**|Correct decay helper; trigger/statistics/full-event closure fail|
|018|**INSUFFICIENT EVIDENCE**|In-progress queue entry without source/artifact|

**Conclusion:** preserve the substantive computational work, but replace blanket scientific verification with bounded reference-case evidence. Attractive interactive output and clean builds have repeatedly concealed fundamental model errors in this collection.


## Appendix I. Reproduction package and evidence provenance

The complete executed TypeScript harnesses are embedded below so this report remains reproducible after `/tmp` is removed. They import only experiment engine modules and do not modify those modules. Save each block as the named file **in a disposable copy of the shared experiment parent**, then bundle with the installed Rolldown and run Node. Current source changes can legitimately change expected results; compare the hashes in Appendix II first.

```sh
# Working directory: disposable copy of v4/agy-gemini-3.8
node_modules/.bin/rolldown numerical.ts --file numerical.cjs --format cjs --platform node
node numerical.cjs > numerical-results.json
node_modules/.bin/rolldown adversarial.ts --file adversarial.cjs --format cjs --platform node
node adversarial.cjs > adversarial-results.json
node_modules/.bin/rolldown bench.ts --file bench.cjs --format cjs --platform node
node --expose-gc bench.cjs > bench-results.json
```

Assertions to apply to the printed outputs: orbit error ratios near16; quantum totalProbability near1; ordinary allowed daughter mass/four-vector residuals small; unique organism IDs equal population entries; free BEC eigenmode phase sign correct; thermal energy units coherent; halved current changes its self-consistent poloidal field; slit width and reconstruction distance produce physically different outputs; empty-domain forces/frequencies zero/undefined; station acceleration uses sample timestamps. The harnesses intentionally print failing actual values rather than silently fixing them. The ordinary decay test is randomized; exact residuals can differ at floating precision, but tolerances1e−9 GeV are generous. The adversarial event sample uses a fixed LCG seed; ecosystem initial conditions are randomized but the demonstrated alias invariant is deterministic.

A convenience serialized `photonSphere.initial.trail` shares its array with the advanced particle (the numerical harness makes a shallow copy); only its copied scalar initial position/velocity should be read as initial conditions. This harness detail does not affect the explicitly calculated force mismatch in C04. Performance tests are one-host observations, not pass/fail browser benchmarks.

### `numerical.ts`

```ts
import {NBodyPhysicsEngine} from './009/src/physics/NBodyPhysicsEngine';
import {QuantumSimulatorEngine} from './010/src/quantum/QuantumSimulatorEngine';
import {CURATED_ALGORITHMS} from './010/src/algorithms/curatedAlgorithms';
import {ThermonuclearEngine} from './014/src/plasma/ThermonuclearEngine';
import {GradShafranovSolver} from './014/src/plasma/GradShafranovSolver';
import {FUSION_SCENARIOS} from './014/src/plasma/TokamakPresets';
import {BecGrossPitaevskii} from './015/src/quantum/BecGrossPitaevskii';
import {GravitationalWaveEngine} from './016/src/relativity/GravitationalWaveEngine';
import {GeodesicIntegrator} from './016/src/relativity/GeodesicIntegrator';
import {RelativisticKinematics as K} from './017/src/physics/RelativisticKinematics';
import {SPHEngine,DEFAULT_SPH_PARAMS} from './006/src/engine/SPHEngine';
import {ReactionDiffusionEngine} from './006/src/engine/ReactionDiffusionEngine';
import {LatticeBoltzmannSolver} from './011/src/lbm/LatticeBoltzmannSolver';
import {WaveOpticsEngine} from './012/src/optics/WaveOpticsEngine';
import {calculateThinFilmResponse,THIN_FILM_PRESETS} from './012/src/optics/ThinFilmEngine';
const out:any={};
const body=(id:string,mass:number,x:number,y:number,vx:number,vy:number,isStatic=false)=>({id,name:id,mass,pos:{x,y},vel:{x:vx,y:vy},isStatic,radius:.00001,trail:[],maxTrailLength:10,type:'PLANET',color:'#fff'} as any);
out.orbits=[];
for(const steps of [100,200,400]){const e=new NBodyPhysicsEngine({G:1,softeningFactorKm:0,enableAtmosphericDrag:false,enableTidalDisruption:false});e.setBodies([body('s',1,0,0,0,0,true),body('p',1e-9,1,0,0,1)]);let max=0;for(let n=0;n<steps*10;n++){e.step(2*Math.PI/steps);max=Math.max(max,Math.abs(e.energyDriftPercent));}out.orbits.push({stepsPerOrbit:steps,orbits:10,maxEnergyDriftPercent:max,positionError:Math.hypot(e.bodies[1].pos.x-1,e.bodies[1].pos.y)});}
const nodeEngine=new NBodyPhysicsEngine({G:0,enableAtmosphericDrag:false,enableTidalDisruption:false});nodeEngine.setBodies([body('p',1,10,0,0,1)]);nodeEngine.setManeuverNodes([{targetBodyId:'p',timeSeconds:.5,deltaVPrograde:1,deltaVRadial:1,executed:false} as any]);nodeEngine.step(1);out.maneuverAt1={executed:nodeEngine.maneuverNodes[0].executed,pos:{...nodeEngine.bodies[0].pos}};nodeEngine.step(1);out.maneuverAt2={executed:nodeEngine.maneuverNodes[0].executed,vel:nodeEngine.bodies[0].vel};
out.quantum=CURATED_ALGORITHMS.map(a=>{const e=new QuantumSimulatorEngine(a.numQubits);const s=e.runCircuit(a.gates);return {id:a.id,norm:s.totalProbability,isPure:s.isPure,reduced:s.reducedStates,probabilities:s.amplitudes.map(x=>x.probability)};});
const sc=FUSION_SCENARIOS[0],fusion=new ThermonuclearEngine(sc.geometry,sc.controls);const vol=fusion.getPlasmaVolumeM3(sc.geometry);out.fusion={volume:vol,initialEnergyMJ:fusion.storedThermalEnergyMj,correctEnergyMJ:3*sc.controls.targetDensityN20*.01602*16*vol*.5,reactivity10:fusion.calculateDtReactivity(10)};fusion.step(sc.geometry,sc.controls,.01);out.fusion.firstStep={fusionMW:fusion.pFusMw,bremMW:fusion.pBremMw,cyclMW:fusion.pCyclMw,temperature:fusion.centralTeKev};for(let n=0;n<1000;n++)fusion.step(sc.geometry,sc.controls,.01);out.fusion.after10s={energyMJ:fusion.storedThermalEnergyMj,te:fusion.centralTeKev,q:fusion.qFactor,cycl:fusion.pCyclMw};
const gs=new GradShafranovSolver(sc.geometry);const before=Array.from(gs.br);gs.solveEquilibrium({...sc.geometry,plasmaCurrentIp:7.5},15,0);out.gs={maxBrChangeForHalfCurrent:Math.max(...before.map((x,i)=>Math.abs(x-gs.br[i]))),q0:gs.q0};
const bp={scatteringG:0,barrierHeight:0,barrierWidth:5,trapAspect:1,stirringSpeed:0,stirringActive:false,timeOfFlight:true};const bec=new BecGrossPitaevskii();bec.psiReal.fill(0);bec.psiImag.fill(0);let norm=0;for(let y=0;y<120;y++)for(let x=0;x<120;x++){const i=y*120+x;bec.psiReal[i]=Math.sin(Math.PI*x/119)*Math.sin(Math.PI*y/119);norm+=bec.psiReal[i]**2*.25;}for(let i=0;i<14400;i++)bec.psiReal[i]/=Math.sqrt(norm);const idx=60*120+60,u0=bec.psiReal[idx];const eig=8*Math.sin(Math.PI/(2*119))**2/(.5**2);bec.step(bp);out.bec={initialU:u0,actualImag:bec.psiImag[idx],expectedImag:-.5*eig*.02*u0,totalNorm:bec.totalNorm};
const gp={primaryMassMsun:36,secondaryMassMsun:29,dimensionlessSpin1:.32,dimensionlessSpin2:-.44,luminosityDistanceMpc:410,orbitPhase:0,separationR:16,orbitalFreqHz:35,isMerged:false};const gw=new GravitationalWaveEngine();gw.resetSimulation(gp);const sample=gw.step(gp,.001);out.gw={reportedFrequencyHz:sample.freqHz,phaseFrequencyHz:Math.atan2(sample.hCross,sample.hPlus)/(.001*2*Math.PI)};
const geo=new GeodesicIntegrator();const params={massM:1,spinA:0,chargeQ:0,metricType:'SCHWARZSCHILD',launchRadius:3,launchSpeed:1,launchAngleDeg:90,isPhoton:true};geo.clearParticles();geo.addParticle(params as any);const p0={...geo.particles[0]};geo.step(params as any,.001);out.photonSphere={initial:p0,after:geo.particles[0],expectedCircularRadius:3};
let residual=0,massErr=0;for(let n=0;n<1000;n++){const parent={E:Math.sqrt(125**2+30**2+40**2+80**2),px:30,py:40,pz:80};const [a,b]=K.twoBodyDecay(parent,1,2);const sum=K.addFourVectors([a,b]);residual=Math.max(residual,...['E','px','py','pz'].map(k=>Math.abs(sum[k]-parent[k])));massErr=Math.max(massErr,Math.abs(K.invariantMass(a)-1),Math.abs(K.invariantMass(b)-2));}out.decays={trials:1000,maxFourMomentumResidual:residual,maxMassResidual:massErr};out.threshold=K.twoBodyDecay({E:2,px:0,py:0,pz:0},1,2).map(K.invariantMass);
const sph=new SPHEngine(800,600,{...DEFAULT_SPH_PARAMS,gravityX:0,gravityY:0,stiffness:0,viscosity:0});sph.obstacles=[{id:'c',type:'CIRCLE',x:400,y:300,radius:40}];sph.addParticle(410,310);sph.update(.004);out.sphCircle={particle:sph.particles[0],distance:Math.hypot(sph.particles[0].x-400,sph.particles[0].y-300),expectedRadiusAtLeast:40};out.sphDtZero=sph.update(0).fps;
const rd=new ReactionDiffusionEngine(30,30,{Da:1,Db:.5,feed:.029,kill:.057,iterationsPerFrame:1});rd.u.fill(1);rd.v.fill(0);rd.step();const border1=rd.u[0];rd.step();out.rd={edgeAfter1:border1,edgeAfter2:rd.u[0],nearEdgeAfter2:rd.u[31]};
const lbm=new LatticeBoltzmannSolver(100,50);for(let i=0;i<100;i++)lbm.step();out.lbmEmpty={metrics:lbm.metrics,maxDensityError:Math.max(...Array.from(lbm.rho).map(x=>Math.abs(x-1)))};
const op=new WaveOpticsEngine(100,60);const source={wavelengthNm:550,beamWaistMm:1,coherenceLengthUm:1000} as any;const diff={preset:'single-slit',slitWidthUm:50,slitDistanceUm:200,circularRadiusUm:50,propagationDistanceMm:80,gratingDensityLpmm:100} as any;const inter={type:'MICHELSON',piezoDisplacementNm:0,mirrorTiltDeg:0,arm1LengthMm:10,arm2LengthMm:10,mirrorReflectivity:.9,sampleRefractiveIndex:1.5,sampleThicknessUm:10} as any;let holo={referenceAngleDeg:20,isReconstructing:false,reconstructionDistanceMm:20} as any;op.propagateWave('HOLOGRAPHY',source,diff,inter,holo);holo.isReconstructing=true;op.propagateWave('HOLOGRAPHY',source,diff,inter,holo);const image=Array.from(op.intensity);holo.reconstructionDistanceMm=100;op.propagateWave('HOLOGRAPHY',source,diff,inter,holo);out.hologram={maxIntensityChangeForDistance20to100:Math.max(...image.map((x,i)=>Math.abs(x-op.intensity[i])))};
op.generateAperture(diff);const mask=Array.from(op.apertureMask);diff.slitWidthUm=100;op.generateAperture(diff);out.slitWidth={changedMaskCells:mask.filter((x,i)=>x!==op.apertureMask[i]).length,emitterColumnUnchanged:mask.every((x,i)=>i%100!==18||x===op.apertureMask[i])};
out.thinFilms=THIN_FILM_PRESETS.map(p=>({name:p.name,...calculateThinFilmResponse({substrateIndex:1.52,incidentAngleDeg:0,polarization:'TE',layers:p.layers} as any,550)}));
console.log(JSON.stringify(out,null,2));
```

### `adversarial.ts`

```ts
import {EcosystemEngine,createDefaultGenome} from './007/src/engine/EcosystemEngine';
import {TimeDependentGinzburgLandau} from './015/src/quantum/TimeDependentGinzburgLandau';
import {CryogenicThermalEngine} from './015/src/cryo/CryogenicThermalEngine';
import {SeismographNetwork} from './013/src/seismic/SeismographNetwork';
import {ElastodynamicsSolver} from './013/src/seismic/ElastodynamicsSolver';
import {WaveOpticsEngine} from './012/src/optics/WaveOpticsEngine';
import {calculateThinFilmResponse,THIN_FILM_PRESETS} from './012/src/optics/ThinFilmEngine';
import {CollisionGenerator} from './017/src/physics/CollisionGenerator';
import {RelativisticKinematics as K} from './017/src/physics/RelativisticKinematics';
const out:any={};const eco=new EcosystemEngine();eco.organisms=[];eco.nutrients=[];eco.zones=[];const parent=eco.spawnOrganism(createDefaultGenome('test','PHOTOTROPH',150),500,350);parent.energy=150;parent.age=3;eco.params.ambientLight=0;eco.params.nutrientRegenRate=0;eco.update(.01);out.mitosis={arrayLength:eco.organisms.length,uniqueIds:new Set(eco.organisms.map(x=>x.id)).size,sameObject:eco.organisms[1]===eco.organisms[2],parentEnergy:parent.energy,childEnergy:eco.organisms[1].energy};for(let i=0;i<300;i++)eco.update(.01);out.mitosis.after3s={count:eco.organisms.length,unique:new Set(eco.organisms.map(x=>x.id)).size};
const td=new TimeDependentGinzburgLandau();td.clearPinningSites();td.u.fill(Math.sqrt(.5));td.v.fill(0);let tp={temperatureRatio:.5,kappa:3.5,bExt:0,jExt:0,pinningDensity:0,pinningStrength:.8,externalCoilRadius:25,coilCenterX:.5,coilCenterY:.5};td.updateVectorPotential(tp);td.step(tp);out.tdglZeroField={maxAmplitude:td.maxOrderParam,expected:Math.sqrt(.5)};td.updateVectorPotential({...tp,bExt:1});const b0=Array.from(td.localB);td.u.fill(0);td.v.fill(0);td.step({...tp,bExt:1});out.tdglNoScreening={maxBChangeWhenOrderParameterZero:Math.max(...b0.map((x,i)=>Math.abs(x-td.localB[i])))};
const fridge=new CryogenicThermalEngine();fridge.step({superconductorMaterial:'NbTi',he3FlowRate:100,heaterPower:0,magnetCurrentA:0,stage300Temp:300,stage77Temp:77,stage4Temp:4.2,stage1Temp:1.2,isQuenched:false,energyDumpActive:false,stageMCTemp:.015} as any,0);out.fridge={actualMicroW:fridge.coolingPowerMicroW,expectedFrom84nT2MicroW:84*100*.015**2,ratio:fridge.coolingPowerMicroW/(84*100*.015**2)};
const solver=new ElastodynamicsSolver();solver.rho.fill(2.7);const net=new SeismographNetwork();solver.simTimeSec=1;net.update(solver,0);solver.simTimeSec=1.22;solver.vx[55]=1;net.update(solver,0);out.seismicSampling={actualPga:net.stations[0].pgaG,expectedWithElapsedTime:2.5/.22/981,ratio:net.stations[0].pgaG/(2.5/.22/981)};
const op=new WaveOpticsEngine(100,60);const src={wavelengthNm:550,beamWaistMm:1,coherenceLengthUm:1000} as any;const diff={preset:'single-slit',slitWidthUm:50,slitDistanceUm:200,circularRadiusUm:50,propagationDistanceMm:80,gratingDensityLpmm:100} as any;const inter={type:'MICHELSON',piezoDisplacementNm:0,mirrorTiltDeg:0,arm1LengthMm:10,arm2LengthMm:10,mirrorReflectivity:.9} as any;op.generateAperture(diff);op.propagateWave('DIFFRACTION',src,diff,inter,{} as any);const image=Array.from(op.intensity);diff.slitWidthUm=100;op.generateAperture(diff);op.propagateWave('DIFFRACTION',src,diff,inter,{} as any);out.slitWidthField={maxIntensityChange:Math.max(...image.map((x,i)=>Math.abs(x-op.intensity[i])))};
out.coatings532={vCoat:calculateThinFilmResponse({substrateIndex:1.52,incidentAngleDeg:0,polarization:'TE',layers:THIN_FILM_PRESETS[2].layers} as any,532),silver:calculateThinFilmResponse({substrateIndex:1.52,incidentAngleDeg:0,polarization:'TE',layers:[{id:'s',name:'Ag',thicknessNm:1000,refractiveIndex:.14,extinctionCoeff:3.4}]} as any,550),expectedThickSilverR:((.14-1)**2+3.4**2)/((.14+1)**2+3.4**2)};
let state=123456789;Math.random=()=>{state=(1664525*state+1013904223)>>>0;return state/4294967296};out.events=[];for(const preset of ['HIGGS_DIPHOTON','HIGGS_FOUR_LEPTON','Z_BOSON_DIMUON','TOP_QUARK_PAIR','DARK_MATTER_MONOJET','QCD_DIJET_HARD_SCATTERING']){const event=CollisionGenerator.generateEvent(preset as any,13.6,3.8,.4);const sum=K.addFourVectors(event.allParticles);const invisible=K.addFourVectors(event.allParticles.filter(x=>x.type==='NEUTRINO'||x.type==='DARK_MATTER'));out.events.push({preset,particles:event.allParticles.length,totalPx:sum.px,totalPy:sum.py,visibleMET:event.missingET.mag,invisiblePt:Math.hypot(invisible.px,invisible.py),leptonsAbove15:event.visibleParticles.filter(p=>(p.type.includes('ELECTRON')||p.type.includes('POSITRON')||p.type.includes('MUON'))&&p.pt>=15).length});}
console.log(JSON.stringify(out,null,2));
```

### `bench.ts`

```ts
import {SPHEngine} from './006/src/engine/SPHEngine';
import {EcosystemEngine,createDefaultGenome} from './007/src/engine/EcosystemEngine';
import {LatticeBoltzmannSolver} from './011/src/lbm/LatticeBoltzmannSolver';
import {BecGrossPitaevskii} from './015/src/quantum/BecGrossPitaevskii';
import {WaveOpticsEngine} from './012/src/optics/WaveOpticsEngine';
import {ElastodynamicsSolver} from './013/src/seismic/ElastodynamicsSolver';
import {RelativisticRayTracer} from './016/src/relativity/RelativisticRayTracer';
import {CollisionGenerator} from './017/src/physics/CollisionGenerator';
import {GradShafranovSolver} from './014/src/plasma/GradShafranovSolver';
import {FUSION_SCENARIOS} from './014/src/plasma/TokamakPresets';
const results:any[]=[];
function bench(label:string,n:number,f:()=>void){for(let j=0;j<5;j++)f();const arr=[];const c0=process.cpuUsage();const start=performance.now();for(let j=0;j<n;j++){let t=performance.now();f();arr.push(performance.now()-t);}const wallMs=performance.now()-start,c=process.cpuUsage(c0);arr.sort((a,b)=>a-b);results.push({label,steps:n,wallMs,meanMs:arr.reduce((a,b)=>a+b,0)/n,p95Ms:arr[Math.floor(n*.95)],cpuUserMs:c.user/1000,cpuSystemMs:c.system/1000});}
const sph=new SPHEngine();sph.loadDamBreak();bench('006 default 832 particles update only',200,()=>sph.update(1/60));sph.clearAll();for(let i=0;i<2500;i++)sph.addParticle(15+(i%70)*11,15+Math.floor(i/70)*11);bench('006 maximum 2500 particles update only',200,()=>sph.update(1/60));bench('006 extended maximum update only',1000,()=>sph.update(1/60));
const eco=new EcosystemEngine();bench('007 default evolving population update only',200,()=>eco.update(1/60));eco.organisms=[];for(let i=0;i<250;i++)eco.spawnOrganism(createDefaultGenome('max','PHOTOTROPH',120),Math.random()*900,Math.random()*600);eco.params.maxOrganisms=250;bench('007 250 initial organisms update only',200,()=>eco.update(1/60));
const lbm=new LatticeBoltzmannSolver();lbm.paintObstacle(65,45,12,true);bench('011 default cylinder full grid step',100,()=>lbm.step());lbm.setInletVelocity(.18);lbm.setViscosity(.005);bench('011 maximum inlet minimum viscosity grid step',100,()=>lbm.step());
const op=new WaveOpticsEngine(280,140);const src={wavelengthNm:550,beamWaistMm:1,coherenceLengthUm:1000} as any,diff={preset:'single-slit',slitWidthUm:50,slitDistanceUm:200,circularRadiusUm:50,propagationDistanceMm:80,gratingDensityLpmm:100} as any,inter={type:'MICHELSON',piezoDisplacementNm:0,mirrorTiltDeg:0,arm1LengthMm:10,arm2LengthMm:10,mirrorReflectivity:.9} as any;op.generateAperture(diff);bench('012 changing diffraction recomputation full 280x140',20,()=>{diff.propagationDistanceMm+=.1;op.propagateWave('DIFFRACTION',src,diff,inter,{} as any)});
const seismic=new ElastodynamicsSolver();seismic.updateGeology([{depthTopKm:0,depthBottomKm:200,vpKmS:6,vsKmS:3.5,densityGcm3:2.7}] as any);bench('013 homogeneous elastic full grid step',200,()=>seismic.step());
const g=FUSION_SCENARIOS[0].geometry,gs=new GradShafranovSolver(g);bench('014 equilibrium field rebuild full grid',100,()=>gs.solveEquilibrium(g,15,0));
const bec=new BecGrossPitaevskii(),bp={scatteringG:1,barrierHeight:8,barrierWidth:5,trapAspect:1,stirringSpeed:1,stirringActive:true,timeOfFlight:false};bench('015 BEC full grid step',200,()=>bec.step(bp));
const rt=new RelativisticRayTracer();const lp={observerDistance:50,inclinationDeg:70,diskInnerRadius:6,diskOuterRadius:20,fovDeg:40,accretionBrightness:1,secondaryRings:true,starFieldGrid:true};bench('016 ray image analytical render 160x120',100,()=>rt.render(lp as any,.8,'ACCRETION_FIRE' as any,0));
bench('017 top event generation incl detector and clustering',100,()=>{CollisionGenerator.generateEvent('TOP_QUARK_PAIR',13.6,3.8,.4)});
(globalThis as any).gc?.();const mem0=process.memoryUsage();for(let i=0;i<30;i++){sph.loadDamBreak();sph.params.viscosity=i%2?180:10;sph.update(.016);bec.initializeGroundState(i%2===0);bec.step({...bp,scatteringG:i%2?6:-3});} (globalThis as any).gc?.();const mem1=process.memoryUsage();console.log(JSON.stringify({runtime:process.version,platform:process.platform,arch:process.arch,scope:'Node engine only, no canvas DOM React browser or audio; one run; no FPS inference',results,resetStress:{cycles:30,heapUsedBefore:mem0.heapUsed,heapUsedAfter:mem1.heapUsed,arrayBuffersBefore:mem0.arrayBuffers,arrayBuffersAfter:mem1.arrayBuffers,sphParticles:sph.particles.length,becNorm:bec.totalNorm}},null,2));
```

### Captured `adversarial-results.json`

```json
{
  "mitosis": {
    "arrayLength": 3,
    "uniqueIds": 2,
    "sameObject": true,
    "parentEnergy": 74.99095800589919,
    "childEnergy": 77.98087921071439,
    "after3s": {
      "count": 3,
      "unique": 2
    }
  },
  "tdglZeroField": {
    "maxAmplitude": 0.7071067695689951,
    "expected": 0.7071067811865476
  },
  "tdglNoScreening": {
    "maxBChangeWhenOrderParameterZero": 0
  },
  "fridge": {
    "actualMicroW": 84,
    "expectedFrom84nT2MicroW": 1.89,
    "ratio": 44.44444444444445
  },
  "seismicSampling": {
    "actualPga": 0.04633490872022982,
    "expectedWithElapsedTime": 0.011583727180057455,
    "ratio": 4
  },
  "slitWidthField": {
    "maxIntensityChange": 0
  },
  "coatings532": {
    "vCoat": {
      "reflectance": 0.2779783300094381,
      "transmittance": 0.7220216699904101
    },
    "silver": {
      "reflectance": 1,
      "transmittance": 0
    },
    "expectedThickSilverR": 0.9564527668045661
  },
  "events": [
    {
      "preset": "HIGGS_DIPHOTON",
      "particles": 18,
      "totalPx": 1.52628505154999,
      "totalPy": 2.335374777363021,
      "visibleMET": 2.7898963079885846,
      "invisiblePt": 0,
      "leptonsAbove15": 0
    },
    {
      "preset": "HIGGS_FOUR_LEPTON",
      "particles": 10,
      "totalPx": -4.335555911543453,
      "totalPy": 10.844932384250844,
      "visibleMET": 11.679452190967353,
      "invisiblePt": 0,
      "leptonsAbove15": 2
    },
    {
      "preset": "Z_BOSON_DIMUON",
      "particles": 20,
      "totalPx": -9.06513413424653,
      "totalPy": -5.978863232662438,
      "visibleMET": 10.859256992389689,
      "invisiblePt": 0,
      "leptonsAbove15": 2
    },
    {
      "preset": "TOP_QUARK_PAIR",
      "particles": 34,
      "totalPx": -61.59398631610885,
      "totalPy": 15.45454751141786,
      "visibleMET": 112.31026575942629,
      "invisiblePt": 69.47848640818268,
      "leptonsAbove15": 1
    },
    {
      "preset": "DARK_MATTER_MONOJET",
      "particles": 25,
      "totalPx": -47.5877543193548,
      "totalPy": 16.526426967576864,
      "visibleMET": 371.5501872552713,
      "invisiblePt": 375.2119933138601,
      "leptonsAbove15": 0
    },
    {
      "preset": "QCD_DIJET_HARD_SCATTERING",
      "particles": 26,
      "totalPx": 17.09872093979416,
      "totalPy": -26.06673679748692,
      "visibleMET": 31.174364869976326,
      "invisiblePt": 0,
      "leptonsAbove15": 0
    }
  ]
}

```

### Captured `bench-results.json`

```json
{
  "runtime": "v20.20.2",
  "platform": "linux",
  "arch": "x64",
  "scope": "Node engine only, no canvas DOM React browser or audio; one run; no FPS inference",
  "results": [
    {
      "label": "006 default 832 particles update only",
      "steps": 200,
      "wallMs": 1434.7000790000002,
      "meanMs": 7.1704911900000035,
      "p95Ms": 7.918767000000116,
      "cpuUserMs": 1171.955,
      "cpuSystemMs": 50.516
    },
    {
      "label": "006 maximum 2500 particles update only",
      "steps": 200,
      "wallMs": 4650.740603,
      "meanMs": 23.248592660000014,
      "p95Ms": 131.7897950000006,
      "cpuUserMs": 4393.394,
      "cpuSystemMs": 39.481
    },
    {
      "label": "006 extended maximum update only",
      "steps": 1000,
      "wallMs": 37405.950246,
      "meanMs": 37.39671206799998,
      "p95Ms": 174.4280179999987,
      "cpuUserMs": 36822.228,
      "cpuSystemMs": 175.771
    },
    {
      "label": "007 default evolving population update only",
      "steps": 200,
      "wallMs": 284.22010299999965,
      "meanMs": 1.42093167500032,
      "p95Ms": 3.04921800000011,
      "cpuUserMs": 301.128,
      "cpuSystemMs": 16.693
    },
    {
      "label": "007 250 initial organisms update only",
      "steps": 200,
      "wallMs": 354.03301099999953,
      "meanMs": 1.7698438900003384,
      "p95Ms": 4.333569000002171,
      "cpuUserMs": 265.127,
      "cpuSystemMs": 9.418
    },
    {
      "label": "011 default cylinder full grid step",
      "steps": 100,
      "wallMs": 453.01073900000483,
      "meanMs": 4.529364579999747,
      "p95Ms": 6.059220999995887,
      "cpuUserMs": 448.433,
      "cpuSystemMs": 5.131
    },
    {
      "label": "011 maximum inlet minimum viscosity grid step",
      "steps": 100,
      "wallMs": 468.01544499999727,
      "meanMs": 4.679582399999854,
      "p95Ms": 6.3077960000009625,
      "cpuUserMs": 459.6,
      "cpuSystemMs": 9.296
    },
    {
      "label": "012 changing diffraction recomputation full 280x140",
      "steps": 20,
      "wallMs": 1554.7084639999957,
      "meanMs": 77.73137435000099,
      "p95Ms": 227.54473100000178,
      "cpuUserMs": 1546.156,
      "cpuSystemMs": 2.412
    },
    {
      "label": "013 homogeneous elastic full grid step",
      "steps": 200,
      "wallMs": 108.03327200000058,
      "meanMs": 0.539843575000341,
      "p95Ms": 1.4588740000035614,
      "cpuUserMs": 80.631,
      "cpuSystemMs": 0
    },
    {
      "label": "014 equilibrium field rebuild full grid",
      "steps": 100,
      "wallMs": 318.3985130000001,
      "meanMs": 3.1832011699999567,
      "p95Ms": 3.6388630000001285,
      "cpuUserMs": 297.895,
      "cpuSystemMs": 0.32
    },
    {
      "label": "015 BEC full grid step",
      "steps": 200,
      "wallMs": 274.0138189999998,
      "meanMs": 1.3698686199999066,
      "p95Ms": 1.1158099999956903,
      "cpuUserMs": 271.948,
      "cpuSystemMs": 0
    },
    {
      "label": "016 ray image analytical render 160x120",
      "steps": 100,
      "wallMs": 774.0987509999977,
      "meanMs": 7.739414379999653,
      "p95Ms": 30.251598999995622,
      "cpuUserMs": 541.125,
      "cpuSystemMs": 1.034
    },
    {
      "label": "017 top event generation incl detector and clustering",
      "steps": 100,
      "wallMs": 709.2437910000008,
      "meanMs": 7.091977510000361,
      "p95Ms": 19.549808999996458,
      "cpuUserMs": 69.233,
      "cpuSystemMs": 0
    }
  ],
  "resetStress": {
    "cycles": 30,
    "heapUsedBefore": 5196872,
    "heapUsedAfter": 4807672,
    "arrayBuffersBefore": 5510259,
    "arrayBuffersAfter": 5510259,
    "sphParticles": 832,
    "becNorm": 1
  }
}

```

## Appendix II. Captured file hashes

SHA-256 below identifies every captured source, test and claim artifact in scope (242 files including shared context/config). Values were computed on copied file bytes before testing. `dist` and installed dependencies were excluded from this manifest; rebuilt dist was compared separately. All listed live files matched at the source recheck. Hash of this manifest’s original JSON bytes: `b2941b4581257450ba980e4a9083e1fc89a279f46716fdc51cd197ee4a4f7f4f`.

| Relative file | SHA-256 |
|---|---|
| `.gitignore` | `5960944f3199e18ff17e626667b503ee8d089b0b6c53b123c4907db12f5d83a2` |
| `006/audit-report.md` | `8825ac48d11f7be41e0cac17bf3d36b4eb55e4ae0f457e4a9601a87f23fb905b` |
| `006/index.html` | `7a4989836b191f7c2ddeaf5e55f3ce301b77bea6e166f302139493ff72db4b90` |
| `006/journal.md` | `603193a09ca0623d76ac2bb49db669e3c2a8c738ba3ffeba32cc8727a2fef982` |
| `006/report.md` | `7d7736e00a2fd7a9ff881756d7e7fce9dc3c8e0f8b9732ab994bf6d758cc1e51` |
| `006/src/App.tsx` | `c34fc18b775f1c6e95ba29224a9597043ec0767a291f12754a841b3c647979da` |
| `006/src/audio/FluidAudioEngine.ts` | `b064245e0ccae8b310bbffb25e5266620cd9634905de3164f6923c07cdd1e27c` |
| `006/src/components/ControlHeader.tsx` | `b9f623b2a715c7ee6c8384f184cca91b24a35a990fd90cd617fe49ea8a34d5d0` |
| `006/src/components/FluidCanvas.tsx` | `90ef18320cd777fb1b84bb028fc5b8c5b616aac9aa967db4bbcb1fa0e35c2e73` |
| `006/src/components/PhysicsSidebar.tsx` | `945b82b9b1e13dad6e6a0c5bc1d917deec93f1fca23891ad8bec0ae25be80c0b` |
| `006/src/engine/ReactionDiffusionEngine.ts` | `36897c8501f505cfa0d9c474c1bee0466d265e0879e6dcb78aa44047eaa603bb` |
| `006/src/engine/SPHEngine.ts` | `5f86221e04a386227875c5fc394a50c19f2fa2884fe0f3fd10dd47b7c95e3722` |
| `006/src/index.css` | `2cdb45b6528a0b7957b7340879475cb6d2f824c462b37201c6664fc3d9eb12fc` |
| `006/src/main.tsx` | `31435f954c81ac0d7f98a8eaa15ef38ffcf97830f447e1e8cdcda6f68f461d98` |
| `006/src/types.ts` | `a3c635a5cea6b2a25ba3bfc908a520643c6e1f79fb5e1c96d3530f802add605e` |
| `006/test-run.cjs` | `de583a7561452ee70e32e909897f4aa4d364eaba72436ef886bbcb772843ab12` |
| `006/verification.json` | `6ffb5b5442ec3ed31ce226be2d6c319064906c5e07797ea18addf2cbbdb14194` |
| `006/vite.config.ts` | `ed1a50fd0ee3841a7dfbb1170d0ecc8ba3e6d2a0fcb3d2b23a475174eae0c028` |
| `007/audit-report.md` | `321a8c17a569e745502516860d23d786603d78e8d31316748bddd67d902e37a8` |
| `007/index.html` | `fccebcc35ccd3ba87b673eab599ec23388adb55f8655501f33554ac7dd587fcd` |
| `007/journal.md` | `0ef3fbeafcd136532f8c3d71c2cda8edf56b67ed02d4711200153ee18de843f1` |
| `007/report.md` | `2a30c2934036e52141b1e2dfb83097b9ec04a0f179adc6b4ea3eda276474b148` |
| `007/src/App.tsx` | `fb89a6cebd5016f7adb27d4c3b00def82f0e01f64dbe67ad8fa41381493bd6de` |
| `007/src/audio/BioAudioEngine.ts` | `8120867b120a721b9dfc65868205ada6448805de3809ff23bb1b3e115575df29` |
| `007/src/components/ControlHeader.tsx` | `4ed942df46d4a3771e90693d1410eccc1847f172b4eb78429ac979fd78038245` |
| `007/src/components/CrisprLabModal.tsx` | `596e801bdf362f2a8ca280834d3333bf5ee5be7716dfc06e2ec290bcd473ab10` |
| `007/src/components/EcosystemSidebar.tsx` | `4be7a20bd9f2c2361d2adb8ae2d0fa81ab45494e1406c4d9c3262751669706af` |
| `007/src/components/PetriCanvas.tsx` | `63b8e9f33445afb7e30a5e2a0bdf55e7ced7fd93d949c4ff2492db16c2bd45b6` |
| `007/src/components/SpecimenInspector.tsx` | `c1538a1b0f806e6d38d76e5a0ff03e3389f86ccfe5f9403bd045753588154a9d` |
| `007/src/engine/EcosystemEngine.ts` | `3314bd57b093683ed685e3c035fb05aa482a1a8d5a19c3808f83e7ad1192dd52` |
| `007/src/index.css` | `fc45a29d96778d27d3f648c762ba5d099dfde347fb02905af0fec3c572aa5a8c` |
| `007/src/main.tsx` | `77c8a34937e68081db9b907f2a0da0970a50a20d2bd81a79de8c92a235f3faa4` |
| `007/src/types.ts` | `053552b8d8fbf4a2e26bbc09c9b4c9a2a9b6bf7d76ff7417aea3712413f39719` |
| `007/test-run.cjs` | `1ba0983955760d5c8e176cec4850630d74bbbace1a2ff52da2279d46822eccbf` |
| `007/verification.json` | `ef658a1bd32cefe7df3e8f88fbd68aa3ad3c78b25f1150ae49a3e7191d3de0e5` |
| `007/vite.config.ts` | `ed1a50fd0ee3841a7dfbb1170d0ecc8ba3e6d2a0fcb3d2b23a475174eae0c028` |
| `008/audit-report.md` | `6ec222e841cc0358da5ffa442a3a4c88bca46f6968d3e8152e006e6cb9279d93` |
| `008/index.html` | `d78223ca15800220e63765263bb9be63db545a10690bb03e6dd7499367be18a6` |
| `008/journal.md` | `2092d077ab976a3e3f84dea14be708e57f53b41c47830015434c1a9d78312b7c` |
| `008/report.md` | `87831a036beea9d66f78ed67df75796fb0d7818455eef1349686c113f44f1046` |
| `008/src/App.tsx` | `09c20ac710316d13ffe5f2920da0a31ec99e70d066b8487e34e1a79067297088` |
| `008/src/components/ComparisonBar.tsx` | `90ca2368dc36fde2fd445587199ea87950db017a4bc23d3a215dc22506b7747e` |
| `008/src/components/Header.tsx` | `e1965ca03a4ee1c6bc99d3339f2909e6e04022c6c64483d3eb7676fb62cac60b` |
| `008/src/components/InstrumentParameterDeck.tsx` | `9fd8c1235700829da6dc5ddfe1cfe4d235ccda7fcda3443224c396909df88001` |
| `008/src/components/OscilloscopeVisualizer.tsx` | `ea7f5365a568cc4e86e5818b0a6cb0dadbb9e0cbe1f928635b27559893352ff1` |
| `008/src/components/PianoKeyboard.tsx` | `69f1afa20779ecf4f45cbdcf4b6f7a46d577d291f39b46a5248c1672f4a57733` |
| `008/src/engine/ProceduralAudioEngine.ts` | `c6f7197a8af502e76a3130b41e58bd168c05839ca7308a0f4c1543c3819fc558` |
| `008/src/index.css` | `81add1ec86ea43903eab05adda25a51dee671a20ce276baedcd489e5d0cda657` |
| `008/src/main.tsx` | `a5da687a0a346b2fcc7cce01cd8d3efe98115541d6858edab6dfa3d3b3a68c78` |
| `008/src/presets/defaultPresets.ts` | `95c518d9c2b1492fd6f743e0414f125290aedae891afa70668ea0bef22272b30` |
| `008/src/types.ts` | `4a147edab28835f1d6602d71312f7eef20209b1f56fe153fe13d3c3c018373bb` |
| `008/test-run.cjs` | `ffbed19d83c3f311b26135d01d4c54cedd69960b70491f4715502b2d777b34e2` |
| `008/verification.json` | `6f2fd90e8ae3df3beeb730b38102d9c2895d073f5a92d91d6a05f8b7e82f7923` |
| `008/vite.config.ts` | `ed1a50fd0ee3841a7dfbb1170d0ecc8ba3e6d2a0fcb3d2b23a475174eae0c028` |
| `009/audit-report.md` | `ce4be4ce97636a5a769081ed91dea8ade31f57c60afbf0249a22e85f38a4144b` |
| `009/index.html` | `0cf313ff6cf1b959c3cd083b4b9d2a812d6d6b6ced079b42bed3797c15b92052` |
| `009/journal.md` | `9d782e084b6efc3dd59b496f2ce3dc4adc840f7543c744c40658f6a27dd62d21` |
| `009/report.md` | `a5590217119003d7ff9e984d2c8ad5b7f52e9830f7e5c26c2830473f06a8e26e` |
| `009/src/App.tsx` | `dd68cc0259d330c672691cf7f23f6ff6388f24d03059757f99468eeb6f18c2c6` |
| `009/src/audio/SpaceSonificationEngine.ts` | `9114cb96085aa94c07ecc6a94310ff2389c21cf19b6ab0957af63d38bfc6a9b3` |
| `009/src/components/CelestialBodyInspector.tsx` | `90ff74533d17b2d3dc00f71754c18135d3654473c9472bce1deaeb7ab853f429` |
| `009/src/components/EphemerisExportModal.tsx` | `d5b94ed23936a19b5ade1ce5b8681cff0d30e959fae5b612ae4a16fd8f6a3357` |
| `009/src/components/FlightComputerDeck.tsx` | `6e78abc4ac09c0641a88aaa7424b9dfc6002d4570713dc04cdf1fa2207e46697` |
| `009/src/components/Header.tsx` | `3cd26b2ac1e14cd65948132b7900c5c65bc082b130ef7668b4398f3584b04f10` |
| `009/src/components/OrbitalCanvas.tsx` | `77b8831f3fad0b47921685ce80c507b99d51575b21fbbb3683b2d3d7e065f44f` |
| `009/src/components/TelemetryHUD.tsx` | `1607323f1a675c9ad46df2a39f2525cf17b7e94b8c5d301217b483470e7d5fab` |
| `009/src/index.css` | `32bc37a8bf67704e0fc1940e9945e7f348563614cb1be092992469b8266e52f2` |
| `009/src/main.tsx` | `31435f954c81ac0d7f98a8eaa15ef38ffcf97830f447e1e8cdcda6f68f461d98` |
| `009/src/physics/NBodyPhysicsEngine.ts` | `5071c0d47575ab212893ffe8a5b95a1db1bb97ec4974eace878563d512232429` |
| `009/src/physics/OrbitalMath.ts` | `a6d80a138489a04990f30cce6b7855f8a6c30f24de75d0c1521d6aca8b9a66bc` |
| `009/src/scenarios/curatedScenarios.ts` | `5a197c234e6fb79413d9671fa73f0bca1b9d3e9dc5dfd91a893b59defd5de148` |
| `009/src/types.ts` | `3b844d684326d52f7689e0b2e576f73b017ad8d402cb0006cc4832628f640dd9` |
| `009/test-run.cjs` | `89e8e8a1039f31c2dccda3f4a46874db83f65d2513f16bdf57812fb3f1c0caad` |
| `009/verification.json` | `044e9599b8020d62c25e93e7a710e0b71bd65c683cff9875885235484aae7448` |
| `009/vite.config.ts` | `ed1a50fd0ee3841a7dfbb1170d0ecc8ba3e6d2a0fcb3d2b23a475174eae0c028` |
| `010/audit-report.md` | `0add9d6a6f546f444abddd064b79a7794e09c7917e4f59dfdeffe2cd9c28f69a` |
| `010/index.html` | `a723fec08d8e644c8a650022765a89006e5a9249906a92fcb54220e3ac81ad06` |
| `010/journal.md` | `0cfe34bba001ad89043b9278b1cf9431ae3085247f756d4f61079edc1f06bab5` |
| `010/report.md` | `7a55aea6a3656eb713a4f41794aa7f66ca254335660d8495821a694bde9d2e2d` |
| `010/src/App.tsx` | `de4fc44f74cca4e986a44dd10e9d28fd41da98dce1447fca2b57430c66e11693` |
| `010/src/algorithms/curatedAlgorithms.ts` | `5ce0478a75f3fa007110904c9a91dd98a5a73b6d8098b1e7f7c423b0f9b68357` |
| `010/src/audio/QuantumSonificationEngine.ts` | `e1b648ddecc7ee580c824ca58d28c6b6fd411425506b922ee8bc3a8420cedfe5` |
| `010/src/components/BlochSphereVisualizer.tsx` | `5c5bb08acdc55b441c7a0d175847c517c4e19d1c00195c8d274f8b615939e98a` |
| `010/src/components/CircuitComposer.tsx` | `d4240607eb7c176ce5df632e8a054072c7766fc8e83da66c0ea05e0077f4465b` |
| `010/src/components/Header.tsx` | `673e53d87fc74e7ecc9d6eeecfa4f7d64563beb4b4f8918cb941071200a23ceb` |
| `010/src/components/QasmInterchangeModal.tsx` | `665dcee06d8fcadfb60677eb5cdcc88f80c5bee626372f3bb2be444812500266` |
| `010/src/components/StateHistogramVisualizer.tsx` | `c65846e737336d9b1cab247671774c00ee3145c8674390726f33c2607d9b48ff` |
| `010/src/index.css` | `6f69c0cbb0b011fe2df757459223c61b04b32fa734eff2cc342e9727bae8e6a5` |
| `010/src/main.tsx` | `31435f954c81ac0d7f98a8eaa15ef38ffcf97830f447e1e8cdcda6f68f461d98` |
| `010/src/quantum/ComplexMath.ts` | `294227749fa99f4801097b7f89a755d74ac573a80268e7f3fab27f494bff5c5a` |
| `010/src/quantum/QuantumGates.ts` | `d29d8a0845cdcb64466cc36899bba3a5d7f29b15471ae0532284a127664e5c85` |
| `010/src/quantum/QuantumSimulatorEngine.ts` | `b03955bf1c315fa7fd454291f51b8a6e1174d5b14de196177bfed0e1d9455f67` |
| `010/src/types.ts` | `500818b7f337e55c3754d49d658af877958668f28e8b4a5398251bfaa1f854cf` |
| `010/test-run.cjs` | `765ec3ef8ec0725e16d4e9e586170d29f42444f00a3e134a89e56d09884ef20e` |
| `010/verification.json` | `ea6836e28c4ebeb3d628d1448ed84d8f80a2fe187adebd075acc76d7fd07f804` |
| `010/vite.config.ts` | `ed1a50fd0ee3841a7dfbb1170d0ecc8ba3e6d2a0fcb3d2b23a475174eae0c028` |
| `011/audit-report.md` | `a4beb5af2e097804b1c9fe982d5a64a0aadedf020044e198f52c0d1040d60014` |
| `011/index.html` | `418294c1f312140262b5cd957e8bd88548b5eb3a10d9f86bbb2f8905d5322165` |
| `011/journal.md` | `16181fa20dc7676f73b8514d51e6d226e2cb50070d954e4e8c56086f7f54bc85` |
| `011/report.md` | `c5607acb284c4f91cbf6a8f8678953aa6327f1ffa4a1b468c5864c6692e31c69` |
| `011/src/App.tsx` | `d998d7838cecf4bea90eaa52794f111550a62abe6b415c3f394e571d4f678bf3` |
| `011/src/airfoils/AirfoilGenerator.ts` | `6654d816e67dde32ff4f8420444b5ef017897d21ad34c86ad8760872514f33e4` |
| `011/src/audio/AeroSonificationEngine.ts` | `8f49092fda0f6c81933f3a9c9b8c656fb84bbbac21ec0162c3ce02fc22c5cc90` |
| `011/src/components/AerodynamicsDeck.tsx` | `5d2d3e806016db39d1bf6e13b28d3bdebbe4ca01e2f2a9403f258eee8274cd7b` |
| `011/src/components/DataExportModal.tsx` | `014a0ea8c8972c958273b0c417670582f32b2cac0237a5c46d067e5fac933981` |
| `011/src/components/FlightSimulatorHUD.tsx` | `df63fe21e4b6a0e913c1dfebc07fadc83ec629a0f80acafa47caf534cc29e601` |
| `011/src/components/Header.tsx` | `3506c9949d12710a4e9d48ee72ebc470d637768e0ef04d408c195f02176e605a` |
| `011/src/components/WindTunnelCanvas.tsx` | `1386491d987c47150cb3563fe905985560a6bbf87e690b37551c002ad2e0e609` |
| `011/src/index.css` | `b56615dbb7448672243b8e45a58fdb184d4da51d5705d7af3fad316a5c6b6347` |
| `011/src/lbm/LatticeBoltzmannSolver.ts` | `cb7225feda49903465c334877a253613de643c28b5f97374ab6af459627ba9f1` |
| `011/src/main.tsx` | `31435f954c81ac0d7f98a8eaa15ef38ffcf97830f447e1e8cdcda6f68f461d98` |
| `011/src/types/index.ts` | `2379d93b1715f8d84756ca533ae50fc577cc035c9607dff0cb33f22807a95c32` |
| `011/test-run.cjs` | `a0b63d1cdc09d207a5b8cac0a4cd6d1603db0fc54927fdb627483e1e4ebce9ee` |
| `011/verification.json` | `1110928e9fc16bb6d254a8e0ef0ae8510dbbee5233e65437c8979cbebe77e781` |
| `011/vite.config.ts` | `ed1a50fd0ee3841a7dfbb1170d0ecc8ba3e6d2a0fcb3d2b23a475174eae0c028` |
| `012/audit-report.md` | `9af452e44bb27391745b19c50810a028c82d9c64b7159761cc91e6f1414d95c5` |
| `012/index.html` | `9c4b9012ef3c1fdf19a77d08cf5d0e855671be37f938c8d8f9d97cd37cbc8fc1` |
| `012/journal.md` | `68d905545f5bb93c687d93cba0fc25ff582b3e47aa3c109617e949a5e598f54e` |
| `012/report.md` | `7756009ebccac0dc6b4636aa5ac3d19253bf427b5239ceb0c09fd351c31b3359` |
| `012/src/App.tsx` | `d6ef11a5c39962db5d9c5276e2d2bc2aa51362cfada277d405ae64d74d7ed9c7` |
| `012/src/audio/OpticaSonificationEngine.ts` | `b4e8c04606c6b2a61316a345891c4e3b6fb90ebe3aed3ea07e5df7201c8f4027` |
| `012/src/components/DataExportModal.tsx` | `65de9441658b5003fc60bd538dc5102aff2b8a9561f412004a6c70341827316b` |
| `012/src/components/Header.tsx` | `ec5ab8926d357520f0365887063a087526709a1040087860d0ae429da643820b` |
| `012/src/components/OpticsControlDeck.tsx` | `c27b305962ab7269747315e531a6a2fd262ef70c6bd1b879b641c718d1628d7c` |
| `012/src/components/WaveBenchCanvas.tsx` | `a14bf461e0d62498c700c38517a26af4ee5ceb39d2b2ef43c07cfe8998980a1f` |
| `012/src/index.css` | `f953f67b88de11db724b95a8933255d6ce245a807a23001a593dbc08812f225d` |
| `012/src/main.tsx` | `31435f954c81ac0d7f98a8eaa15ef38ffcf97830f447e1e8cdcda6f68f461d98` |
| `012/src/optics/ThinFilmEngine.ts` | `8a6c7dfbc2656518f692614808a191fe14313230bc312ae37385496e2dae4c51` |
| `012/src/optics/WaveOpticsEngine.ts` | `120192e95a1bcfd502be4d8e87947d1d17202000ede07d2bad15f5e75c62d017` |
| `012/src/types/index.ts` | `574daa32cd79c8c94ed824476a88246561d9a7fa9a1d7ffa148867aecafcdfa3` |
| `012/test-run.cjs` | `7ecea7e7280213a3b439f0ccf1ec1c17fb09e29f13899f7d26ba2a7bd4305699` |
| `012/verification.json` | `056c8a7dba27e9d902e4b1e472f9c1c8f03b1f5d217f35bd28cb3e1c90d2bef5` |
| `012/vite.config.ts` | `ed1a50fd0ee3841a7dfbb1170d0ecc8ba3e6d2a0fcb3d2b23a475174eae0c028` |
| `013/audit-report.md` | `c65aa60180491acc9b585081d0a5522b912b4afc07cabdad9b7e775cab5c3e31` |
| `013/index.html` | `07044bfd93a37fd3c8007b2aed01ad1236deab811a2047d880f8b27171027d50` |
| `013/journal.md` | `597faa298772e18df4d2a8c425d7b3ae658006f8d7538a7a50f8b5f32ca4094d` |
| `013/report.md` | `8d47e20621d1d708f62a8bda45d701bee81ee7fc4f22521589e37a7f078d1b99` |
| `013/src/App.tsx` | `c0ce4899713e0164330843850ebbd8ac6ee2fc8367192817a1262a3c2e45facc` |
| `013/src/audio/SeismicSonificationEngine.ts` | `3ed9c5bf9e3921edf3d93bda1ddddca248bcfb3f9eecfd015928e71a33f69ab7` |
| `013/src/components/DataExportModal.tsx` | `e07d28b3309f70ec54679a50d86963ec40cc99c4a382a83ed119322f467cd34a` |
| `013/src/components/Header.tsx` | `f609d1f361561d5a429911f28d4aa34070215325635e687d4672116247301b2e` |
| `013/src/components/SeismicBenchCanvas.tsx` | `ba8935241a679b5e9e50dcc6a098cfa3e247b92fceef75a6a20d7a8b37ac7596` |
| `013/src/components/SeismographDeck.tsx` | `0e6666ab20c92734231aa83acddc3c920e5d09166ba39f96817785417a2367e8` |
| `013/src/index.css` | `047eab31b49689de54b7096b1ddc142d17a340c1b61651f8a922cecfda430a5f` |
| `013/src/main.tsx` | `31435f954c81ac0d7f98a8eaa15ef38ffcf97830f447e1e8cdcda6f68f461d98` |
| `013/src/seismic/ElastodynamicsSolver.ts` | `e4c46ee6e9422ea595e5b9feb36207d5d55b3bf534cfdc553c13c6195edeca77` |
| `013/src/seismic/FaultRuptureEngine.ts` | `5dfa1c3cc48ebdd7d8b4ccb91c2ea8285d461f21d7141dd01522da53030076fd` |
| `013/src/seismic/SeismographNetwork.ts` | `f665f929b1ff70c8803a70218e749efd866a0ff30f883979abbbc100ab0d8cb6` |
| `013/src/tsunami/TsunamiSolver.ts` | `f27607b2123c2d74dbbc6644178d4906654fb15f0e2d2dbb00be3f5a61846673` |
| `013/src/types/index.ts` | `f38d63df12f1de12459679cb38558e984ff5e602ee8ee44457ad65397c5c28c5` |
| `013/test-run.cjs` | `6ca39d341b215eb9874701ce765b78c3339f40f521c02c8af98097e23c656fa4` |
| `013/verification.json` | `f703968ed52a40270228bc273f903163c9814ff2261e61d9a6c21769138d5fba` |
| `013/vite.config.ts` | `ed1a50fd0ee3841a7dfbb1170d0ecc8ba3e6d2a0fcb3d2b23a475174eae0c028` |
| `014/audit-report.md` | `d418a78dcdf97f645c65b9657cfcc1ee34730b5357ee3379684fe9d8c7416fdd` |
| `014/index.html` | `befa19a3268521faa1201efe969de2e52b7b70b284c559cd7eae8a92b293f0b9` |
| `014/journal.md` | `27c8b3a9d85e4b6ae5decb6d1bc0ff487eecaa150a049d3a3e59e3c5890016ce` |
| `014/report.md` | `dd1e883f2de6ddf26300ebe7587719eb54c791b3c7efd6d1c330b985106a2b83` |
| `014/src/App.tsx` | `5ea8098cbe8d292ca4d0d67fec0ca8636e81eb028749c3b76ff487967fd75824` |
| `014/src/audio/PlasmaSonificationEngine.ts` | `907c1f46cd629ee21eabfbcd2744d8d9e66c47bdfec5be3a22f1f15f9247f070` |
| `014/src/components/DataExportModal.tsx` | `75a4d1ba0ae08158edf5e9d488db5a17aa1fc61624d24e5451e6bbd5a4f0af8d` |
| `014/src/components/Header.tsx` | `5447dcc5715b33547160e60793a21abde15b61c668bce0c51e99ef248bb07435` |
| `014/src/components/PlasmaControlDeck.tsx` | `879e7c42eaaf8583a79ea3863b2bb20535de01aa0d5ceedfddc87829c8e8df29` |
| `014/src/components/TokamakBenchCanvas.tsx` | `94e777e8b9e7a5297313042e7177cb6ab5ee8df4329b56d718e9df8dad8462b9` |
| `014/src/index.css` | `3ffa1ed9ea1c61be05373dc2ba9cccbf3f7095bc3b6ca09fed56e178bcdbeebc` |
| `014/src/main.tsx` | `77c8a34937e68081db9b907f2a0da0970a50a20d2bd81a79de8c92a235f3faa4` |
| `014/src/plasma/GradShafranovSolver.ts` | `fed90341207b6b6523e1da2da84702d95f02fbb4c18e80ff50374e2573760cd4` |
| `014/src/plasma/MhdInstabilityEngine.ts` | `cc3c8c70ea9e049ed06a427a0bb69d8c2469e6acd690c51fd3fc93fbbe8f528f` |
| `014/src/plasma/ThermonuclearEngine.ts` | `5134548dc14435652a72407ae349c8cfd5934d5e334a802397b87cf9ce18bf25` |
| `014/src/plasma/TokamakPresets.ts` | `0802f57be251fcd8b4b9d6ab56838722ed9cd424d9c9232afa53c86d498e3df8` |
| `014/src/types/index.ts` | `2f31c92a0d4d52eaca6e26cc99e1da68e6298557cf95ece20ea5144cdaa5749a` |
| `014/test-run.cjs` | `66e01d35730c6568bd18872724ed033dfcf83425ca147f86601b2416029a6f70` |
| `014/verification.json` | `edc0f0dcf30fe1522be51ac9969970fd770ec58457535c8f1c8ee06700965983` |
| `014/vite.config.ts` | `ed1a50fd0ee3841a7dfbb1170d0ecc8ba3e6d2a0fcb3d2b23a475174eae0c028` |
| `015/audit-report.md` | `07cc876edd74e6745736b913b6c72a6613cac152c669d6aebc16429f638fb7d0` |
| `015/index.html` | `a0d58857f557febfb2b7dda2e15d2e5a16dbbba8dd6c442f28746dc4a6e0c661` |
| `015/journal.md` | `cf1304018ff892744071caef2466d996f94c8921a99fa6cc8cf7fd3633bd58a5` |
| `015/report.md` | `c672b79716eecc5929cd2b09d194fbafe4f0491fa3780a3b7d94715b64ef48fa` |
| `015/src/App.tsx` | `a2a32208089506a033303d6077c8ad55f3cdae025a43288e05d6c29750503afa` |
| `015/src/audio/CryoSonificationEngine.ts` | `652af5200c80a75d833bddd5fac3c988f38649d578b9450deab590d0688bedeb` |
| `015/src/components/CryoControlDeck.tsx` | `b93ec7af7e82175c181f549628d3e53b223c589c13348f1ee340064bf9021704` |
| `015/src/components/DataExportModal.tsx` | `c8774ff7833f8fafd96d3359a643e085c8311de002e9498ba8abf4bb093799a9` |
| `015/src/components/Header.tsx` | `f27149942c207c91db21830659610ebfdac62b0f09624659629d01de5771abbf` |
| `015/src/components/QuantumBenchCanvas.tsx` | `53ab831f3820dd39420c9bb80d9c23b52e52b1619f39a341bd14211fec178af9` |
| `015/src/cryo/CryogenicThermalEngine.ts` | `2c2c93fb0db24af5ba962f4a45f09df9775efe5c1fab95dd83ca9397a9cb9b44` |
| `015/src/index.css` | `5e2cc2223a52ddf276c50e9788f56fe1678f410311dbe10535d32de151c7e65d` |
| `015/src/main.tsx` | `77c8a34937e68081db9b907f2a0da0970a50a20d2bd81a79de8c92a235f3faa4` |
| `015/src/quantum/BecGrossPitaevskii.ts` | `8cff52b7a40d8b0e50d62bc9c7892e0a39aa28e76c52808180a0635918f82edd` |
| `015/src/quantum/CryoPresets.ts` | `fbfb48c52f1707c55fb6da98ce153f3f054b297acf7a0cd9738ead035882e20f` |
| `015/src/quantum/JosephsonJunctionEngine.ts` | `8f55bc0d4b18c7700ff11a1dc5194c8dcbfa548e034f59bb7d6468162bb7e8e5` |
| `015/src/quantum/TimeDependentGinzburgLandau.ts` | `0f675bc2f35ac0bd880002252703c5e8aed2a36954a257ae4f77f771d10cf6ff` |
| `015/src/types/index.ts` | `21127ba5076f1c06b9d4a0b6b0eef561c0862f2e09fa44df4ba7815d7c8f74f1` |
| `015/test-run.cjs` | `a603ee977552d05b45e6130a798e13d0e958763e4825bfd894be301649b67610` |
| `015/verification.json` | `fe6059a19e235dd4f9960a734c1a32bab08b4b17a2575a3f67b6b7b42c09613e` |
| `015/vite.config.ts` | `ed1a50fd0ee3841a7dfbb1170d0ecc8ba3e6d2a0fcb3d2b23a475174eae0c028` |
| `016/index.html` | `364dbeade3a370e25c9e810e52c4876da5f59a46e438f50705fa81fc8b7de77e` |
| `016/journal.md` | `59a021ff5a2e84b37f67377ad974140f957778b814923c2702ca1e37488574b5` |
| `016/report.md` | `cf7abc6e6d42f3e4d7bcac9506bc10acebbb9b4f1ffed80823d241ea354706af` |
| `016/src/App.tsx` | `518e2f06aa946c101fca819ad5cc4fe93fac1703160dd9dda48ae29b54ee0dff` |
| `016/src/audio/RelativitySonificationEngine.ts` | `55669a7f0d6cab80b472f45dddffcb78060d51f0c4024ba0ab9b0a3d72252d7c` |
| `016/src/components/DataExportModal.tsx` | `4fc39d2ca1ea90ac1bc8ed63862699d01125f6601364a4c9ef9fcc1c8e978e9b` |
| `016/src/components/Header.tsx` | `2b6d29703b5752ec5b02bf31f8b226254b1080e31a5f296b633d6967d5090c25` |
| `016/src/components/RelativityCanvas.tsx` | `ed9fa567c690ec3d8b821724f5dc8f49c93232e1c4cf56e5815128f0422ffc3b` |
| `016/src/components/RelativityControlDeck.tsx` | `3c40145db2fb04e7e6a565a6f7a80d0da096f320c69cdd895f512afa8bdc9324` |
| `016/src/index.css` | `982995892ea89992cb3f08834e510fbcd4b76ecf24562c9935e16b25b0df18ad` |
| `016/src/main.tsx` | `31435f954c81ac0d7f98a8eaa15ef38ffcf97830f447e1e8cdcda6f68f461d98` |
| `016/src/relativity/GeodesicIntegrator.ts` | `2b65fe32388be7eb7fdc88768df059b495caafadbcbdf0e4d83de3ef25d6b0a9` |
| `016/src/relativity/GravitationalWaveEngine.ts` | `f8371f63c12366f7343b6a9ebe3d3638766406eeea200b4a185d6d8606bc67b4` |
| `016/src/relativity/RelativisticRayTracer.ts` | `cd29f9a524d984f25d3c225a2f2c54ddd5a43a1762e86dc5de0bb3fd1dabbcaa` |
| `016/src/relativity/RelativityPresets.ts` | `c91869a7e8254cec91fed85eb8994bf8100faf3ede05b912ad7bc4c2899b3765` |
| `016/src/types/index.ts` | `b1cfc8d1189665fd5a7555219cffcf7dd4a95a8df31d9c18de0e0e4fb5eb88d2` |
| `016/test-run.cjs` | `e1662eb29b18fae325dcfa4a00408bc299147665271be6ef2089cfa92750d48e` |
| `016/verification.json` | `e3aa83ff384d670b9418c9f6d07991d009b7fd8c4641a0bd59bb2694627af11f` |
| `016/vite.config.ts` | `ed1a50fd0ee3841a7dfbb1170d0ecc8ba3e6d2a0fcb3d2b23a475174eae0c028` |
| `017/index.html` | `813585889920cf424def631b2869d94087b7599745ca15b35e5064fb8f00b52a` |
| `017/journal.md` | `675b6cd3d10ced4dab9eae723beb8943f97a7011230d21e0c699b9d12153bf40` |
| `017/report.md` | `16e8a817ac56c3dbea4b6a465cba047d02dfbe491a5464de20767580cfbaf5a5` |
| `017/src/App.tsx` | `e927350a014ae097933d04f11b96f4585a2e9c644bbb3987d5740dc5abfdc8be` |
| `017/src/audio/ColliderSonificationEngine.ts` | `034956aa7c61c382330a66fa8ba9dd72fc5ea6ed14646d01c7ee1bd53649a89e` |
| `017/src/components/ColliderControlDeck.tsx` | `c4249fd64ee3cdc8be5c31f50d33cf799cad3b040909640ace3b46d8c95d6298` |
| `017/src/components/DataExportModal.tsx` | `55546451f20b5ea4cee6004829fb2b3f1054419fdea888f4815c8c52b995dea7` |
| `017/src/components/DetectorCanvas.tsx` | `d11d8c2fcab38afa8903921f77a5768c9b7bc1c8436d2dc2120e52e73ae540fd` |
| `017/src/components/Header.tsx` | `ab1b32890f5ca523c2128c1a08bec497aad35b8feb00bb8636fcc5f9af37e223` |
| `017/src/components/LegoPlotCanvas.tsx` | `63e31d791456d829cef4afe84ccaaf4e45661f7b48b0d2f7edf68c44c04c493a` |
| `017/src/components/MassSpectrumCanvas.tsx` | `18c9af4836eb859673a4be09f4e8c15d1b099c1726bcc4e8b34d3e24a6dc3f9c` |
| `017/src/components/ParticleInspectorModal.tsx` | `96f0e5f98cd0c23ce09bdc762847040ca4f4b45336f4ad5c6fa95341f156a984` |
| `017/src/index.css` | `92ceef749ad2661cbcd8e2a82feb698b3ef2990b7d692e90e8a8dd567044735a` |
| `017/src/main.tsx` | `631a3d40ef113b9c3c85e783353a6ad3d230ad264a350daad53281f38929c7e2` |
| `017/src/physics/AntiKtJetClustering.ts` | `af5ab284391a3737804a873bcc77c23fd6d4803d74c1eafecbb62279d6a90a7f` |
| `017/src/physics/ColliderPresets.ts` | `b52e5af1a74ef0f8c337fba3a520a22daa798061f3f9a6b6b6f10b416d5e7cb4` |
| `017/src/physics/CollisionGenerator.ts` | `8a94df337a1569db550e1fb1139dc630f24c9b9f7d57a88e3387e4392c9013b4` |
| `017/src/physics/DetectorGeometry.ts` | `ed06876d8e3c059b5e2996792c418335afe777e5f96220f9464d2b1784cb09eb` |
| `017/src/physics/RelativisticKinematics.ts` | `46a11e0c17b1a981cc21f1afb99b82741cf7417fd4d0e81ee9fbcacd20681559` |
| `017/src/types/index.ts` | `caa865c7d331a9695227870854fcbf06eb909471430fe46386be29305103e8b8` |
| `017/test-run.cjs` | `1c7ebfdb02611944bc95a7d64f985adf2821e87c3108ce6a05b79f8048bacac7` |
| `017/verification.json` | `e1ced93473cef58367624513bb1d08704ef95c5bd5b580d6b1b8b35f133088fe` |
| `017/vite.config.ts` | `ed1a50fd0ee3841a7dfbb1170d0ecc8ba3e6d2a0fcb3d2b23a475174eae0c028` |
| `PROMPT.md` | `6ff8725e09d0c10b75541a787a0b2ea8b78bc8cb1ed369ddfbb89285378d0cd5` |
| `package-lock.json` | `8aa045d0ca2f5f37cdea36a62abc31aa8ea8cf103d2969b56051bd078600b979` |
| `package.json` | `683910a56b4e6d112d54f94ab4078b37aed73c3eb2ec7c566185c36d8212e822` |
| `task-queue.md` | `c28dfba7bbea3d51fd50c860dc620d3b8e227a1a4641d177ba03ee838f1b82bb` |
| `tsconfig.json` | `a321322be3f2694e52c3f339597573751da10219c73a9ef9be6d0237c96ae2fd` |
| `vite.config.ts` | `b77d0aa946c2f6e349ee91cfc2d2ec7606a16fd932bf46160f1ae5254d864546` |

## Appendix III. Reference basis

These references support governing equations/units, not claims that these particular apps work. The direct executed source tests remain the principal evidence.

- Gross–Pitaevskii dynamics and numerical invariants: [Antoine, Bao & Besse, Computational methods for NLSE/GPE](https://arxiv.org/abs/1305.1093), and [Bao, Jaksch & Markowich, Numerical solution of GPE](https://arxiv.org/abs/cond-mat/0303239). The BEC kinetic-sign finding also follows directly from the equation quoted in the developing agent’s own report.
- Magnetic equilibrium/current/flux coupling: [Blum, Boulbe & Faugeras, Tokamak equilibrium reconstruction](https://arxiv.org/abs/0909.4474), and [IAEA magnetic equilibrium presentation](https://nucleus.iaea.org/sites/fusionportal/Pages/DPWS-6/TM%20Fusion%20Data%20Processing%20Validation%20and%20Analysis/2_Tuesday/Session%20I%20Uncertainty%20Propagation%20of%20Experimental%20Data%20in%20Modelling%20Codes/830%20Fischer%20R.pdf).
- Energy unit definition: [BIPM SI defining constants](https://www.bipm.org/en/measurement-units/).
- GW frequency/phasing and explicitly ordered inspiral expansions: [LALInspiral reference](https://lscsoft.docs.ligo.org/lalsuite/dev/lalinspiral/group__lalinspiral__inspiral.html). The reported frequency versus measured phase-advance mismatch is an internal-consistency test independent of any waveform approximant choice.

No source here is used to require research-grade fidelity; the requirements are dimensional consistency, honest model descriptions, valid limiting cases and functioning controls.

**Final source recheck:** 2026-10-19T06:27:55+00:00; all 242 captured input hashes still match; 018 directory remains absent. This report contains 31 explicitly classified findings (4 CRITICAL, 14 HIGH, 13 MEDIUM). No changes to experiment source or existing evidence files were made.
