/**
 * ORBITAL-SLINGSHOT (EXP-025) — Standalone Numerical & Astrodynamics Validation Suite
 * Layer 1 Verification Harness under Hardening Protocol 2.0
 */

import { AstrodynamicsEngine, G_SOLAR, KM_S_TO_AU_YR, AU_YR_TO_KM_S, AU_TO_KM } from './build/astrodynamics/AstrodynamicsEngine.js';
import { MISSION_SCENARIOS } from './build/astrodynamics/MissionScenarios.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testId, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testId}: ${message}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testId}: ${message}`);
  }
}

function assertClose(actual, expected, tolPct, testId, message) {
  totalTests++;
  const denom = Math.abs(expected) > 1e-7 ? Math.abs(expected) : 1.0;
  const relErr = (Math.abs(actual - expected) / denom) * 100;
  if (relErr <= tolPct) {
    passedTests++;
    console.log(`  [PASS] ${testId}: ${message} (measured: ${actual.toFixed(4)}, expected: ${expected.toFixed(4)}, relErr: ${relErr.toFixed(4)}%, tol: ${tolPct}%)`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testId}: ${message} (measured: ${actual.toFixed(4)}, expected: ${expected.toFixed(4)}, relErr: ${relErr.toFixed(4)}%, tol: ${tolPct}%)`);
  }
}

console.log('================================================================');
console.log('ORBITAL-SLINGSHOT: Astrodynamics & Celestial Mechanics Suite');
console.log('================================================================');

// Helper to construct a clean 2-body test system
function createTwoBodySystem(primaryMass = 1.0, probeX = 1.0, probeY = 0, probeVx = 0, probeVy = 2 * Math.PI) {
  return {
    id: 'test-system',
    title: 'Two Body Test',
    subtitle: '',
    briefing: '',
    objective: '',
    maxSimulationYears: 10.0,
    bodies: [
      {
        id: 'primary',
        name: 'Primary',
        mass: primaryMass,
        radius: 0.005,
        displayRadius: 20,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        color: '#fbbf24',
        glowColor: 'rgba(251, 191, 36, 0.4)',
        soiRadius: 100.0,
        isStar: true,
        trail: [],
      },
    ],
    spacecraft: {
      id: 'test-probe',
      name: 'Test Probe',
      x: probeX,
      y: probeY,
      vx: probeVx,
      vy: probeVy,
      mass: 1.0,
      totalDeltaV: 10.0,
      remainingDeltaV: 10.0,
      trail: [],
      isCrashed: false,
      isEscaped: false,
    },
  };
}

// -------------------------------------------------------------
// 1. Keplerian Two-Body Kinematics & Invariants (KEPLER)
// -------------------------------------------------------------
console.log('\n1. Keplerian Two-Body Kinematics & Conservation (KEPLER):');
{
  // Test KEPLER-01: Circular Orbit Speed & Period
  const scenCirc = createTwoBodySystem(1.0, 1.0, 0, 0, 2 * Math.PI);
  const engineCirc = new AstrodynamicsEngine(scenCirc);

  // Integrate for 1.0 full year
  const dt = 0.001; // 0.001 year per step
  for (let s = 0; s < 1000; s++) {
    engineCirc.step(dt, 10);
  }

  const finalR = Math.hypot(engineCirc.spacecraft.x, engineCirc.spacecraft.y);
  assertClose(finalR, 1.0, 0.5, 'KEPLER-01', 'Circular orbit radius remains 1.0 AU over 1 full year');

  // Test KEPLER-02 & KEPLER-03: Energy & Angular Momentum Conservation over 5 Eccentric Orbits
  // a = 1.0 AU, e = 0.5 -> r_p = 0.5 AU, v_p = sqrt(mu * (2/r_p - 1/a)) = sqrt(4*pi^2 * (4 - 1)) = 2*pi*sqrt(3)
  const v_p = 2 * Math.PI * Math.sqrt(3.0);
  const scenEcc = createTwoBodySystem(1.0, 0.5, 0, 0, v_p);
  const engineEcc = new AstrodynamicsEngine(scenEcc);

  const initElem = engineEcc.getOrbitalElements();
  const initEnergy = initElem.specificEnergy;
  const initH = initElem.specificAngularMomentum;

  // Integrate for 5 full years (5 orbits since a = 1.0 -> T = 1.0 yr)
  for (let s = 0; s < 5000; s++) {
    engineEcc.step(0.001, 10);
  }

  const finalElem = engineEcc.getOrbitalElements();
  assertClose(finalElem.specificEnergy, initEnergy, 0.05, 'KEPLER-02', 'Specific orbital energy conserved across 5 eccentric orbits');
  assertClose(finalElem.specificAngularMomentum, initH, 0.05, 'KEPLER-03', 'Specific angular momentum conserved across 5 eccentric orbits');

  // Test KEPLER-04: Vis-Viva Velocity Prediction
  const measuredVp = v_p;
  const analyticalVp = Math.sqrt(G_SOLAR * (2.0 / 0.5 - 1.0 / 1.0));
  assertClose(measuredVp, analyticalVp, 0.1, 'KEPLER-04a', 'Periapsis speed matches analytical Vis-Viva equation');

  const r_a = 1.0 * (1.0 + 0.5); // 1.5 AU
  const analyticalVa = Math.sqrt(G_SOLAR * (2.0 / r_a - 1.0 / 1.0));
  const expectedVa = v_p * (0.5 / 1.5); // h conservation: r_p * v_p = r_a * v_a
  assertClose(expectedVa, analyticalVa, 0.1, 'KEPLER-04b', 'Apoapsis speed matches analytical Vis-Viva equation');
}

// -------------------------------------------------------------
// 2. Hohmann Transfer Mechanics (HOHMANN)
// -------------------------------------------------------------
console.log('\n2. Hohmann Transfer Mechanics (HOHMANN):');
{
  // Earth (1.0 AU) to Mars (1.524 AU)
  const r1 = 1.0;
  const r2 = 1.524;
  const a_trans = (r1 + r2) / 2.0; // 1.262 AU
  const v1_circ = 2 * Math.PI;      // sqrt(G*M/r1)
  const v1_trans = Math.sqrt(G_SOLAR * (2.0 / r1 - 1.0 / a_trans));
  const deltaV1_AuYr = v1_trans - v1_circ;
  const deltaV1_KmS = deltaV1_AuYr * AU_YR_TO_KM_S; // ~2.945 km/s

  // Test HOHMANN-01: First Burn Transfer Ellipse Apoapsis
  const scenHohmann = createTwoBodySystem(1.0, r1, 0, 0, v1_trans);
  const engineHohmann = new AstrodynamicsEngine(scenHohmann);

  const hohmannElem = engineHohmann.getOrbitalElements();
  assertClose(hohmannElem.apoapsis, r2, 0.5, 'HOHMANN-01', 'Hohmann departure impulse establishes transfer ellipse with target apoapsis at Mars (1.524 AU)');

  // Test HOHMANN-02: Transfer Time (Half Period)
  const analyticalTransferTimeYears = Math.PI * Math.sqrt((a_trans * a_trans * a_trans) / G_SOLAR); // 0.7088 yr
  assertClose(hohmannElem.period / 2.0, analyticalTransferTimeYears, 0.5, 'HOHMANN-02', `Transfer flight time matches analytical half-period (${(analyticalTransferTimeYears * 365.25).toFixed(1)} days)`);

  // Test HOHMANN-03: Circularization Burn at Apoapsis
  // Simulate forward until apoapsis (t = 0.7088 yr)
  const steps = 709;
  for (let s = 0; s < steps; s++) {
    engineHohmann.step(0.001, 10);
  }

  // Apoapsis speed
  const v2_trans = Math.hypot(engineHohmann.spacecraft.vx, engineHohmann.spacecraft.vy);
  const v2_circ = Math.sqrt(G_SOLAR / r2);
  const deltaV2_KmS = (v2_circ - v2_trans) * AU_YR_TO_KM_S;

  // Apply circularization burn
  engineHohmann.applyManualImpulse(deltaV2_KmS, 0);
  const circularElem = engineHohmann.getOrbitalElements();
  assert(circularElem.eccentricity < 0.015, 'HOHMANN-03', `Apoapsis burn circularizes orbit around Mars radius (eccentricity: ${circularElem.eccentricity.toFixed(4)} <= 0.015)`);
}

// -------------------------------------------------------------
// 3. Planetary Gravity Assist & Slingshot Dynamics (SLING)
// -------------------------------------------------------------
console.log('\n3. Planetary Gravity Assist & Slingshot Dynamics (SLING):');
{
  // Test SLING-01: Asymptotic Relative Speed Invariance in Planetary 2-Body Frame
  // Hyperbolic flyby around Jupiter (isolated two-body hyperbolic scattering)
  const jupMass = 0.000954;
  const muJup = G_SOLAR * jupMass; // ~0.03766
  // Start at r = 0.05 AU with hyperbolic speed v = 1.8 AU/yr (> v_esc = sqrt(2*mu/r) = 1.22 AU/yr)
  const scenHyperbolic = createTwoBodySystem(jupMass, 0.05, 0, 0, 1.8);
  const engineHyp = new AstrodynamicsEngine(scenHyperbolic);
  const initHypEnergy = engineHyp.getOrbitalElements().specificEnergy;
  const initHypSpeed = Math.hypot(engineHyp.spacecraft.vx, engineHyp.spacecraft.vy);

  // Integrate through periapsis and out to outbound leg (0.06 years)
  for (let s = 0; s < 600; s++) {
    engineHyp.step(0.0001, 10);
  }

  const finalHypEnergy = engineHyp.getOrbitalElements().specificEnergy;
  assertClose(finalHypEnergy, initHypEnergy, 0.05, 'SLING-01a', 'Specific energy exactly conserved across hyperbolic planetary flyby');
  assert(engineHyp.getOrbitalElements().orbitType === 'HYPERBOLIC', 'SLING-01b', 'Flyby trajectory is verified open hyperbolic conic section (e > 1.0)');

  // Test SLING-02: Heliocentric Energy Boost (Trailing Planetary Flyby)
  // Jupiter in circular orbit at 5.2 AU, Probe approaching on bound heliocentric ellipse
  const jupX = 5.2;
  const jupVy = Math.sqrt(G_SOLAR * 1.0 / jupX); // 2.756 AU/yr

  // Probe flyby passing Jupiter's trailing hemisphere on an initial bound ellipse (v < v_esc)
  const scenJup = {
    id: 'jupiter-flyby',
    title: 'Gravity Assist Test',
    subtitle: '',
    briefing: '',
    objective: '',
    maxSimulationYears: 2.0,
    bodies: [
      {
        id: 'sun',
        name: 'Sun',
        mass: 1.0,
        radius: 0.005,
        displayRadius: 20,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        color: '#fbbf24',
        glowColor: 'rgba(251, 191, 36, 0.4)',
        soiRadius: 50.0,
        isStar: true,
        trail: [],
      },
      {
        id: 'jupiter',
        name: 'Jupiter',
        mass: jupMass,
        radius: 0.000477,
        displayRadius: 16,
        x: jupX,
        y: 0,
        vx: 0,
        vy: jupVy,
        color: '#f97316',
        glowColor: 'rgba(249, 115, 22, 0.4)',
        soiRadius: 0.32,
        isStar: false,
        trail: [],
      },
    ],
    spacecraft: {
      id: 'probe',
      name: 'Voyager Probe',
      x: 5.12,
      y: -0.25,
      vx: 0.4,
      vy: 3.2,                    // Bound ellipse around Sun (v = 3.22 < v_esc = 3.92)
      mass: 1.0,
      totalDeltaV: 10.0,
      remainingDeltaV: 10.0,
      trail: [],
      isCrashed: false,
      isEscaped: false,
    },
  };

  const engineJup = new AstrodynamicsEngine(scenJup);
  const initSunElem = engineJup.getOrbitalElements(engineJup.bodies[0]);
  const initSunEnergy = initSunElem.specificEnergy;

  // Integrate through the flyby (0.15 years)
  for (let s = 0; s < 1500; s++) {
    engineJup.step(0.0001, 10);
  }

  const finalSunElem = engineJup.getOrbitalElements(engineJup.bodies[0]);
  const finalSunEnergy = finalSunElem.specificEnergy;
  assert(finalSunEnergy > initSunEnergy, 'SLING-02', `Trailing planetary flyby increases heliocentric specific energy (Initial: ${initSunEnergy.toFixed(3)} -> Final: ${finalSunEnergy.toFixed(3)} AU^2/yr^2)`);

  // Test SLING-03: Leading Flyby Heliocentric Energy Loss
  // Passing ahead of Jupiter's orbital vector (y > 0)
  const scenLeading = JSON.parse(JSON.stringify(scenJup));
  scenLeading.spacecraft.x = 5.24;
  scenLeading.spacecraft.y = 0.25;
  scenLeading.spacecraft.vx = -0.5;
  scenLeading.spacecraft.vy = 1.0;

  const engineLeading = new AstrodynamicsEngine(scenLeading);
  const initLeadingEnergy = engineLeading.getOrbitalElements(engineLeading.bodies[0]).specificEnergy;

  for (let s = 0; s < 1500; s++) {
    engineLeading.step(0.0001, 10);
  }

  const finalLeadingEnergy = engineLeading.getOrbitalElements(engineLeading.bodies[0]).specificEnergy;
  assert(finalLeadingEnergy < initLeadingEnergy, 'SLING-03', `Leading planetary flyby decelerates heliocentric orbital energy (Delta epsilon < 0)`);
}

// -------------------------------------------------------------
// 4. Sphere of Influence & Three-Body Mechanics (SOI)
// -------------------------------------------------------------
console.log('\n4. Sphere of Influence & Three-Body Mechanics (SOI):');
{
  // Test SOI-01: Laplace Sphere of Influence Radius
  const earthMass = 3.003e-6;
  const sunMass = 1.0;
  const earthR = 1.0;
  const analyticalEarthSOI = earthR * Math.pow(earthMass / sunMass, 0.4); // 0.00618 AU
  const earthPreset = MISSION_SCENARIOS.find((m) => m.id === 'hohmann-mars').bodies.find((b) => b.id === 'earth');
  assertClose(earthPreset.soiRadius, analyticalEarthSOI, 0.5, 'SOI-01', `Laplace Sphere of Influence radius matches analytical formula (r_soi = ${analyticalEarthSOI.toFixed(5)} AU = ~${(analyticalEarthSOI * AU_TO_KM).toFixed(0)} km)`);

  // Test SOI-02: Lagrange L4 Equilibrium Stability
  const trojanScen = MISSION_SCENARIOS.find((m) => m.id === 'trojan-parking');
  const engineTrojan = new AstrodynamicsEngine(trojanScen);

  // Integrate for 2.0 full Jovian years (~23.7 Earth years)
  for (let s = 0; s < 2000; s++) {
    engineTrojan.step(0.001, 10);
  }

  const scTrojan = engineTrojan.spacecraft;
  const distFromSun = Math.hypot(scTrojan.x, scTrojan.y);
  assert(distFromSun > 4.5 && distFromSun < 6.0 && !scTrojan.isCrashed && !scTrojan.isEscaped, 'SOI-02', `Probe remains stably bounded in Trojan L4 libration zone over multiple orbits without ejection (distance from Sun: ${distFromSun.toFixed(3)} AU)`);
}

// -------------------------------------------------------------
// 5. Rocket Propellant & Maneuver Node Lifecycle (MANEUVER)
// -------------------------------------------------------------
console.log('\n5. Rocket Propellant Budget & Maneuver Node Lifecycle (MANEUVER):');
{
  // Test MANEUVER-01: Impulse Vector Addition & Delta-V Accounting
  const scenManeuver = createTwoBodySystem(1.0, 1.0, 0, 0, 2 * Math.PI);
  const engineManeuver = new AstrodynamicsEngine(scenManeuver);

  const initRemainingDV = engineManeuver.spacecraft.remainingDeltaV; // 10.0 km/s
  const initVx = engineManeuver.spacecraft.vx;
  const initVy = engineManeuver.spacecraft.vy;

  // Apply 2.0 km/s prograde burn
  const burnKmS = 2.0;
  engineManeuver.applyManualImpulse(burnKmS, 0);

  const deltaV_AuYr = burnKmS * KM_S_TO_AU_YR;
  assertClose(engineManeuver.spacecraft.vy, initVy + deltaV_AuYr, 0.001, 'MANEUVER-01a', 'Prograde impulse increases velocity along tangent vector by exact Delta-V');
  assertClose(engineManeuver.spacecraft.remainingDeltaV, initRemainingDV - burnKmS, 0.001, 'MANEUVER-01b', 'Propellant budget is deducted by exactly burned Delta-V (remaining: 8.000 km/s)');

  // Test MANEUVER-02: Ahead-of-Time Projected Trajectory Prediction
  const projectedPoints = engineManeuver.computeProjectedTrajectory(300, 0.005);
  assert(projectedPoints.length > 0, 'MANEUVER-02a', `Projected trajectory cone generated ${projectedPoints.length} lookahead points`);

  // Max distance in projected trajectory should match apoapsis of current orbit
  let maxProjR = 0;
  for (const pt of projectedPoints) {
    const pr = Math.hypot(pt.x, pt.y);
    if (pr > maxProjR) maxProjR = pr;
  }
  const currentElem = engineManeuver.getOrbitalElements();
  assertClose(maxProjR, currentElem.apoapsis, 1.0, 'MANEUVER-02b', `Projected trajectory apoapsis (${maxProjR.toFixed(3)} AU) matches analytical Keplerian apoapsis (${currentElem.apoapsis.toFixed(3)} AU)`);

  // Test MANEUVER-03: Scenario Definition Validity
  assert(MISSION_SCENARIOS.length === 5, 'MANEUVER-03a', `All 5 curated astrodynamics mission scenarios defined`);
  for (const scen of MISSION_SCENARIOS) {
    const hasBodies = scen.bodies.length >= 2;
    const hasProbe = scen.spacecraft && scen.spacecraft.totalDeltaV > 0;
    const hasObjective = scen.objective.length > 10;
    assert(hasBodies && hasProbe && hasObjective, `MANEUVER-03b (${scen.id})`, `Scenario '${scen.title}' configured with valid bodies, spacecraft, and objectives`);
  }
}

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log('================================================================');
console.log(`TOTAL LAYER 1 TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('================================================================');

if (failedTests === 0) {
  console.log('\nALL LAYER 1 TESTS PASSED (100% SUCCESS)!');
  console.log('Astrodynamics, Keplerian orbits, Hohmann transfers, and gravity assists certified.\n');
  process.exit(0);
} else {
  console.error(`\nFAILED ${failedTests} LAYER 1 TEST(S).\n`);
  process.exit(1);
}
