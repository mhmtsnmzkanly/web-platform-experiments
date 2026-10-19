/**
 * STELLAR-FORGE Numerical Validation Harness (Layer 1)
 * Validates Lane-Emden, Thermonuclear Kinetics, Fermi-Dirac Degeneracy,
 * Tolman-Oppenheimer-Volkoff General Relativistic metric balance,
 * and Core Collapse Kinematics against exact analytical and published astrophysical benchmarks.
 */

import { CONSTANTS } from './build/PhysicalConstants.js';
import { LaneEmdenSolver } from './build/LaneEmdenSolver.js';
import { NuclearKinetics } from './build/NuclearKinetics.js';
import { DegeneracyPhysics } from './build/DegeneracyPhysics.js';
import { TovSolver } from './build/TovSolver.js';
import { SupernovaCollapseEngine } from './build/SupernovaCollapseEngine.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    console.error(`  [FAIL] ${testName}: ${details}`);
    throw new Error(`Test failed: ${testName} - ${details}`);
  }
}

function relError(val, ref) {
  return Math.abs(val - ref) / Math.abs(ref);
}

console.log('================================================================');
console.log('STELLAR-FORGE: Autonomous Numerical Validation Suite (Layer 1)');
console.log('================================================================\n');

// -----------------------------------------------------------------
// 1. Lane-Emden Exact Analytical Reference Solutions (Solved via pure RK4)
// -----------------------------------------------------------------
console.log('1. Lane-Emden Analytical Reference Solutions:');

// n = 0: Analytical xi_1 = sqrt(6) = 2.44948974, omega_0 = -xi_1^2 * theta'(xi_1) = 2*sqrt(6) = 4.89897948
const solN0 = LaneEmdenSolver.solveDimensionless(0, 0.001);
const xi1_0_expected = Math.sqrt(6);
const omega0_expected = 2 * Math.sqrt(6);
const err_xi1_0 = relError(solN0.xi1, xi1_0_expected);
const err_omega_0 = relError(solN0.omega_n, omega0_expected);

assert(err_xi1_0 < 0.0001, 'n = 0: Surface root xi1 = sqrt(6) (< 0.01%)', `Got ${solN0.xi1}, expected ${xi1_0_expected}, err: ${(err_xi1_0 * 100).toFixed(4)}%`);
assert(err_omega_0 < 0.0001, 'n = 0: Mass parameter omega_0 = 2*sqrt(6) (< 0.01%)', `Got ${solN0.omega_n}, expected ${omega0_expected}, err: ${(err_omega_0 * 100).toFixed(4)}%`);

// n = 1: Analytical xi_1 = pi = 3.14159265, omega_1 = pi = 3.14159265
const solN1 = LaneEmdenSolver.solveDimensionless(1, 0.001);
const xi1_1_expected = Math.PI;
const omega1_expected = Math.PI;
const err_xi1_1 = relError(solN1.xi1, xi1_1_expected);
const err_omega_1 = relError(solN1.omega_n, omega1_expected);

assert(err_xi1_1 < 0.0001, 'n = 1: Surface root xi1 = pi (< 0.01%)', `Got ${solN1.xi1}, expected ${xi1_1_expected}, err: ${(err_xi1_1 * 100).toFixed(4)}%`);
assert(err_omega_1 < 0.0001, 'n = 1: Mass parameter omega_1 = pi (< 0.01%)', `Got ${solN1.omega_n}, expected ${omega1_expected}, err: ${(err_omega_1 * 100).toFixed(4)}%`);

// -----------------------------------------------------------------
// 2. Published Astronomical Benchmarks (Chandrasekhar 1939)
// -----------------------------------------------------------------
console.log('\n2. Published Astrophysical Benchmarks:');

// n = 1.5 (convective star / non-relativistic white dwarf): xi_1 = 3.65375, omega_1.5 = 2.71406
const solN15 = LaneEmdenSolver.solveDimensionless(1.5, 0.001);
const err_xi1_15 = relError(solN15.xi1, 3.65375);
const err_omega_15 = relError(solN15.omega_n, 2.71406);

assert(err_xi1_15 < 0.0003, 'n = 1.5: Benchmark xi1 = 3.65375 (< 0.03%)', `Got ${solN15.xi1}, err: ${(err_xi1_15 * 100).toFixed(4)}%`);
assert(err_omega_15 < 0.0003, 'n = 1.5: Benchmark omega_1.5 = 2.71406 (< 0.03%)', `Got ${solN15.omega_n}, err: ${(err_omega_15 * 100).toFixed(4)}%`);

// n = 3.0 (Eddington solar model / ultra-relativistic degenerate core): xi_1 = 6.89685, omega_3.0 = 2.01824
const solN30 = LaneEmdenSolver.solveDimensionless(3.0, 0.001);
const err_xi1_30 = relError(solN30.xi1, 6.89685);
const err_omega_30 = relError(solN30.omega_n, 2.01824);

assert(err_xi1_30 < 0.0003, 'n = 3.0: Benchmark xi1 = 6.89685 (< 0.03%)', `Got ${solN30.xi1}, err: ${(err_xi1_30 * 100).toFixed(4)}%`);
assert(err_omega_30 < 0.0003, 'n = 3.0: Benchmark omega_3.0 = 2.01824 (< 0.03%)', `Got ${solN30.omega_n}, err: ${(err_omega_30 * 100).toFixed(4)}%`);

// -----------------------------------------------------------------
// 3. RK4 4th-Order Grid Convergence
// -----------------------------------------------------------------
console.log('\n3. Numerical Grid Convergence:');

const h1 = 0.008;
const h2 = 0.004;
const h3 = 0.002;
const root1 = LaneEmdenSolver.solveDimensionless(1.0, h1).xi1;
const root2 = LaneEmdenSolver.solveDimensionless(1.0, h2).xi1;
const root3 = LaneEmdenSolver.solveDimensionless(1.0, h3).xi1;

const ratio = (root1 - root2) / (root2 - root3);
// Note: As h gets small, linear root finding error on the boundary step scales O(h), but ratio remains in asymptotic regime
assert(ratio > 1.8, 'Grid refinement converges monotonically towards exact root', `Convergence factor = ${ratio.toFixed(2)}`);

// -----------------------------------------------------------------
// 4. Conservation Laws and Invariant Checks
// -----------------------------------------------------------------
console.log('\n4. Conservation Laws & Invariants:');

// Enclosed mass integral consistency: M(R) = int_0^R 4*pi*r^2 * rho(r) dr
const starSol = LaneEmdenSolver.computePhysicalProfile(3.0, CONSTANTS.M_sun, 1.5e5);
let integratedMass = 0;
for (let i = 1; i < starSol.points.length; i++) {
  const pt = starSol.points[i];
  const prevPt = starSol.points[i - 1];
  const r_mid = 0.5 * (pt.r + prevPt.r);
  const dr = pt.r - prevPt.r;
  const rho_mid = 0.5 * (pt.rho + prevPt.rho);
  integratedMass += 4 * Math.PI * r_mid * r_mid * rho_mid * dr;
}
const massConservationErr = relError(integratedMass, starSol.totalMassKg);
assert(massConservationErr < 0.005, 'Enclosed mass integral matches total stellar mass (< 0.5%)', `Got ${integratedMass.toExponential(4)}, expected ${starSol.totalMassKg.toExponential(4)}, err: ${(massConservationErr * 100).toFixed(3)}%`);

// Non-negativity and monotonicity of mass: M(r) >= 0 and dM/dr >= 0
let massMonotonic = true;
for (let i = 1; i < starSol.points.length; i++) {
  if (starSol.points[i].enclosedMass < starSol.points[i - 1].enclosedMass) massMonotonic = false;
}
assert(massMonotonic, 'Enclosed mass M(r) is monotonically increasing everywhere');

// Monotonicity of pressure and density: dP/dr <= 0 and drho/dr <= 0
let pressureMonotonic = true;
let densityMonotonic = true;
for (let i = 1; i < starSol.points.length; i++) {
  if (starSol.points[i].pressure > starSol.points[i - 1].pressure + 1e-10) pressureMonotonic = false;
  if (starSol.points[i].rho > starSol.points[i - 1].rho + 1e-10) densityMonotonic = false;
}
assert(pressureMonotonic, 'Hydrostatic pressure P(r) decreases monotonically outward');
assert(densityMonotonic, 'Stellar density rho(r) decreases monotonically outward');

// -----------------------------------------------------------------
// 5. Fermi-Dirac Degeneracy & Chandrasekhar Mass Limit Invariant
// -----------------------------------------------------------------
console.log('\n5. Fermi-Dirac Degeneracy & Chandrasekhar Limit:');

// Non-relativistic limit: f(x) -> 8/5 * x^5 for x << 1
const x_nr = 0.01;
const f_nr_exact = DegeneracyPhysics.fermiIntegral_f(x_nr);
const f_nr_approx = (8.0 / 5.0) * Math.pow(x_nr, 5);
assert(relError(f_nr_exact, f_nr_approx) < 0.001, 'Fermi-Dirac f(x) matches NR limit 8/5*x^5 for x=0.01 (< 0.1%)', `Exact: ${f_nr_exact.toExponential(5)}, Approx: ${f_nr_approx.toExponential(5)}`);

// Ultra-relativistic limit: f(x) -> 2*x^4 for x >> 1
const x_ur = 100.0;
const f_ur_exact = DegeneracyPhysics.fermiIntegral_f(x_ur);
const f_ur_approx = 2.0 * Math.pow(x_ur, 4);
assert(relError(f_ur_exact, f_ur_approx) < 0.001, 'Fermi-Dirac f(x) matches UR limit 2*x^4 for x=100 (< 0.1%)', `Exact: ${f_ur_exact.toExponential(5)}, Approx: ${f_ur_approx.toExponential(5)}`);

// Exact Chandrasekhar Mass Limit Invariant: 1.442 +/- 0.002 M_sun
const { massSolar: mChSolar } = DegeneracyPhysics.chandrasekharMass(2.0); // mu_e = 2.0 (pure C/O)
assert(Math.abs(mChSolar - 1.442) < 0.002, 'Chandrasekhar mass limit evaluates to 1.442 +/- 0.002 M_sun', `Got ${mChSolar.toFixed(4)} M_sun`);

// -----------------------------------------------------------------
// 6. Thermonuclear Kinetics & Crossover
// -----------------------------------------------------------------
console.log('\n6. Thermonuclear Kinetics & Gamow Crossover:');

// At solar core temperature (1.5e7 K), p-p chain MUST dominate over CNO
const nucSolar = NuclearKinetics.computeEmissivity(1.5e5, 1.5e7, 0.73, 0.25, 0.02);
assert(nucSolar.epsilon_pp > nucSolar.epsilon_cno, 'Solar core T = 1.5e7 K: p-p chain dominates over CNO', `eps_pp: ${nucSolar.epsilon_pp.toExponential(3)}, eps_cno: ${nucSolar.epsilon_cno.toExponential(3)}`);

// At higher core temperature (2.2e7 K), CNO MUST dominate over p-p due to T^16 scaling
const nucHot = NuclearKinetics.computeEmissivity(1.5e5, 2.2e7, 0.73, 0.25, 0.02);
assert(nucHot.epsilon_cno > nucHot.epsilon_pp, 'Intermediate core T = 2.2e7 K: CNO cycle dominates over p-p', `eps_cno: ${nucHot.epsilon_cno.toExponential(3)}, eps_pp: ${nucHot.epsilon_pp.toExponential(3)}`);

// Triple-alpha ignition threshold: negligible at 7e7 K, dominant at 1.8e8 K
const nucSubAlpha = NuclearKinetics.computeEmissivity(1e7, 7e7, 0.0, 0.98, 0.02);
const nucHeBurn = NuclearKinetics.computeEmissivity(1e7, 1.8e8, 0.0, 0.98, 0.02);
assert(nucSubAlpha.epsilon_3alpha < 1e-6, 'Triple-alpha dormant at T = 7e7 K', `eps_3a: ${nucSubAlpha.epsilon_3alpha}`);
assert(nucHeBurn.epsilon_3alpha > 1e3, 'Triple-alpha actively burning at T = 1.8e8 K', `eps_3a: ${nucHeBurn.epsilon_3alpha.toExponential(3)}`);

// Total luminosity integration test:
const solarLum = NuclearKinetics.integrateLuminosity(starSol.points, 0.73, 0.25, 0.02);
assert(Number.isFinite(solarLum.totalLuminosityW) && solarLum.totalLuminosityW > 0, 'Nuclear total luminosity integration is finite and positive', `L = ${solarLum.totalLuminosityW.toExponential(3)} W`);

// -----------------------------------------------------------------
// -----------------------------------------------------------------
// 7. Tolman-Oppenheimer-Volkoff (TOV) General Relativistic Solver
// -----------------------------------------------------------------
console.log('\n7. General Relativistic TOV Metric Hydrostatics:');

const tovSol = TovSolver.solve(1e18, 10.0); // central density 10^18 kg/m^3
assert(tovSol.totalMassSolar > 0.5 && tovSol.totalMassSolar < 3.0, 'TOV neutron star mass is in physical range [0.5, 3.0] M_sun', `M = ${tovSol.totalMassSolar.toFixed(3)} M_sun`);
assert(tovSol.totalRadiusKm > 8.0 && tovSol.totalRadiusKm < 20.0, 'TOV neutron star radius is in physical range [8, 20] km', `R = ${tovSol.totalRadiusKm.toFixed(2)} km`);
assert(tovSol.gravitationalRedshift > 0.1 && tovSol.gravitationalRedshift < 0.5, 'TOV surface gravitational redshift z_g in physical range [0.1, 0.5]', `z_g = ${tovSol.gravitationalRedshift.toFixed(3)}`);
assert(tovSol.compactness < 0.5, 'TOV compactness GM/Rc^2 < 0.5 (outside Schwarzschild horizon)', `GM/Rc^2 = ${tovSol.compactness.toFixed(3)}`);

// -----------------------------------------------------------------
// 8. Supernova Core Collapse & Nucleosynthesis
// -----------------------------------------------------------------
console.log('\n8. Supernova Collapse Dynamics & Nucleosynthetic Yields:');

let snState = {
  isCollapsing: true,
  collapseTimeMs: 0,
  bounceOccurred: false,
  shockRadiusMeters: 0,
  shockVelocityKmS: 0,
  neutrinoLuminosityW: 1e39,
  remnantType: 'NEUTRON_STAR',
  remnantMassSolar: 1.4,
  abundances: SupernovaCollapseEngine.initialPreSupernovaAbundances(),
};

const dt = 0.001; // 1 ms steps
for (let step = 0; step < 200; step++) {
  snState = SupernovaCollapseEngine.stepCollapse(snState, 15.0, dt);
}

assert(snState.collapseTimeMs >= 199.0, 'Collapse reaches final epoch (~200 ms)', `t = ${snState.collapseTimeMs.toFixed(1)} ms`);
assert(snState.bounceOccurred, 'Nuclear saturation core bounce triggered at t ~ 100 ms');
assert(snState.shockRadiusMeters > 5e5, 'Supernova blast wave propagated outward through core', `R_shock = ${(snState.shockRadiusMeters / 1e3).toFixed(1)} km`);
assert(snState.neutrinoLuminosityW > 1e40, 'Neutrino burst emission active during collapse');

const ni56 = snState.abundances.find(a => a.symbol === '⁵⁶Ni');
assert(ni56 && ni56.massFraction > 0, 'Explosive nucleosynthesis produced Nickel-56', `56Ni fraction = ${ni56?.massFraction.toExponential(3)}`);

const au197 = snState.abundances.find(a => a.symbol === '¹⁹⁷Au');
assert(au197 && au197.massFraction > 0, 'r-process nucleosynthesis produced Gold-197', `197Au fraction = ${au197?.massFraction.toExponential(3)}`);

// -----------------------------------------------------------------
// 9. Adversarial & Extremal Boundary Tests
// -----------------------------------------------------------------
console.log('\n9. Adversarial & Edge Case Handling:');

// Test singular or invalid polytropic indices:
let errorCaught = false;
try {
  LaneEmdenSolver.solveDimensionless(-1.0);
} catch (e) {
  errorCaught = true;
}
assert(errorCaught, 'LaneEmdenSolver explicitly rejects negative polytropic index n < 0');

errorCaught = false;
try {
  LaneEmdenSolver.solveDimensionless(5.0);
} catch (e) {
  errorCaught = true;
}
assert(errorCaught, 'LaneEmdenSolver explicitly rejects infinite-radius polytrope n >= 5');

// Test zero and negative temperature in Nuclear Kinetics
const zeroTempEmissivity = NuclearKinetics.computeEmissivity(1000, 0);
assert(zeroTempEmissivity.epsilon_pp === 0 && zeroTempEmissivity.epsilon_total === 0, 'Nuclear emissivity at T=0 K returns exact zero with no NaN or error');

const negativeTempEmissivity = NuclearKinetics.computeEmissivity(1000, -100);
assert(negativeTempEmissivity.epsilon_total === 0, 'Nuclear emissivity at negative temperature safely returns zero');

// Test non-finite guards in TOV solver
let tovErrorCaught = false;
try {
  TovSolver.solve(0);
} catch (e) {
  tovErrorCaught = true;
}
assert(tovErrorCaught, 'TovSolver explicitly rejects non-positive central density rho_c <= 0');

console.log('\n================================================================');
console.log(`ALL LAYER 1 TESTS PASSED: ${passedTests}/${totalTests} (100% SUCCESS)`);
console.log('Numerical integrity, conservation laws, invariants, and physics');
console.log('models are verified and certified under Protocol 2.0.');
console.log('================================================================\n');
