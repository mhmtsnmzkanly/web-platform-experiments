/**
 * BAND-FORGE Numerical Validation Harness (Layer 1)
 * Validates tight-binding electronic structures, Su-Schrieffer-Heeger topological invariants,
 * Haldane quantum anomalous Hall Chern numbers, Harper equation Hofstadter spectra,
 * and diatomic lattice phonon dispersion relations against exact analytical and published benchmarks.
 */

import { CONSTANTS } from './build/PhysicalConstants.js';
import { TightBindingSolver } from './build/TightBindingSolver.js';
import { TopologicalMatter } from './build/TopologicalMatter.js';
import { HofstadterButterfly } from './build/HofstadterButterfly.js';
import { PhononDispersionEngine } from './build/PhononDispersionEngine.js';

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

function assertClose(actual, expected, tol, testName) {
  const err = Math.abs(actual - expected);
  const relErr = expected !== 0 ? err / Math.abs(expected) : err;
  const ok = err <= tol || relErr <= tol;
  assert(ok, testName, `actual=${actual}, expected=${expected}, err=${err}, tol=${tol}`);
}

console.log('================================================================');
console.log('BAND-FORGE: Autonomous Numerical Validation Suite (Layer 1)');
console.log('================================================================\n');

// -----------------------------------------------------------------
// 1. TIGHT-BINDING ELECTRONIC STRUCTURE BENCHMARKS
// -----------------------------------------------------------------
console.log('1. Tight-Binding Electronic Analytical Solutions:');

// TB-01: Graphene Dirac Point K has exact zero energy
const acc = CONSTANTS.GRAPHENE_ACC;
const t_graph = CONSTANTS.GRAPHENE_T;
const kKx = (2 * Math.PI) / (3 * Math.sqrt(3) * acc);
const kKy = (2 * Math.PI) / (3 * acc);
const [eMinusK, ePlusK] = TightBindingSolver.computeGrapheneEnergy(kKx, kKy, t_graph, acc);
assertClose(eMinusK, 0.0, 1e-12, 'TB-01: Graphene Dirac point K lower band E = 0 eV (< 1e-12 eV)');
assertClose(ePlusK, 0.0, 1e-12, 'TB-01: Graphene Dirac point K upper band E = 0 eV (< 1e-12 eV)');

// TB-02: Graphene Bandwidth at Gamma and M points
const [eMinusGamma, ePlusGamma] = TightBindingSolver.computeGrapheneEnergy(0, 0, t_graph, acc);
assertClose(eMinusGamma, -3 * t_graph, 1e-10, 'TB-02a: Graphene Gamma point lower band E = -3t');
assertClose(ePlusGamma, +3 * t_graph, 1e-10, 'TB-02b: Graphene Gamma point upper band E = +3t');

const kMy = (2 * Math.PI) / (3 * acc);
const [eMinusM, ePlusM] = TightBindingSolver.computeGrapheneEnergy(0, kMy, t_graph, acc);
assertClose(eMinusM, -t_graph, 1e-10, 'TB-02c: Graphene M saddle point lower band E = -t');
assertClose(ePlusM, +t_graph, 1e-10, 'TB-02d: Graphene M saddle point upper band E = +t');

// TB-03: Square Lattice Analytical Extremes
const t_sq = 1.0;
const a_sq = 3.0;
const eSqGamma = TightBindingSolver.computeSquareEnergy(0, 0, t_sq, 0, a_sq);
assertClose(eSqGamma, -4 * t_sq, 1e-12, 'TB-03a: Square lattice Gamma point E = -4t');

const eSqM = TightBindingSolver.computeSquareEnergy(Math.PI / a_sq, Math.PI / a_sq, t_sq, 0, a_sq);
assertClose(eSqM, +4 * t_sq, 1e-12, 'TB-03b: Square lattice M point E = +4t');

const eSqX = TightBindingSolver.computeSquareEnergy(Math.PI / a_sq, 0, t_sq, 0, a_sq);
assertClose(eSqX, 0.0, 1e-12, 'TB-03c: Square lattice X saddle point E = 0 eV');

// TB-04: Graphene Dirac Fermi Velocity
const vf = TightBindingSolver.computeFermiVelocity(2.8, 1.42);
const vfExpected = (1.5 * (2.8 * CONSTANTS.EV_TO_JOULE) * (1.42 * CONSTANTS.ANGSTROM_M)) / CONSTANTS.HBAR_SI;
assertClose(vf, vfExpected, 1e-6, 'TB-04: Graphene Fermi velocity v_F matches analytical formula (< 0.001%)');
assert(vf > 8e5 && vf < 1.2e6, 'TB-04b: Graphene Fermi velocity in physical ~10^6 m/s window');

// -----------------------------------------------------------------
// 2. SU-SCHRIEFFER-HEEGER (SSH) 1D TOPOLOGICAL MODEL
// -----------------------------------------------------------------
console.log('\n2. 1D Su-Schrieffer-Heeger (SSH) Topological Benchmarks:');

// SSH-01: Bulk Energy Gap
const t1_ssh = 0.6;
const t2_ssh = 1.4;
const [eBulkMinus, eBulkPlus] = TopologicalMatter.computeSshBulkEnergy(Math.PI, t1_ssh, t2_ssh);
const bulkGap = eBulkPlus - eBulkMinus;
assertClose(bulkGap, 2 * Math.abs(t1_ssh - t2_ssh), 1e-12, 'SSH-01: Bulk energy gap at zone boundary Delta E = 2|t1 - t2|');

// SSH-02: Winding Number Invariant
const nuTopological = TopologicalMatter.computeSshWindingNumber(0.4, 1.2);
assert(nuTopological === 1, 'SSH-02a: Winding number nu = 1 in topological phase (t1 < t2)');

const nuTrivial = TopologicalMatter.computeSshWindingNumber(1.2, 0.4);
assert(nuTrivial === 0, 'SSH-02b: Winding number nu = 0 in trivial phase (t1 > t2)');

// SSH-03: Zero-Energy In-Gap Edge States in Open Boundary Conditions (OBC)
const eChainTopological = TopologicalMatter.computeSshFiniteChain(0.4, 1.2, 25);
// Dimers = 25 -> 50 sites. Middle eigenvalues index 24 and 25
const midE1 = eChainTopological[24];
const midE2 = eChainTopological[25];
assertClose(midE1, 0.0, 1e-8, 'SSH-03a: Topological chain possesses zero-energy edge state E_mid1 = 0 (< 1e-8 eV)');
assertClose(midE2, 0.0, 1e-8, 'SSH-03b: Topological chain possesses zero-energy edge state E_mid2 = 0 (< 1e-8 eV)');

const eChainTrivial = TopologicalMatter.computeSshFiniteChain(1.2, 0.4, 25);
const trivMid1 = Math.abs(eChainTrivial[24]);
const trivMid2 = Math.abs(eChainTrivial[25]);
assert(trivMid1 > 0.5 && trivMid2 > 0.5, 'SSH-03c: Trivial chain has no zero-energy edge states (bulk gap open)');

// -----------------------------------------------------------------
// 3. 2D HALDANE QUANTUM ANOMALOUS HALL & CHERN NUMBER
// -----------------------------------------------------------------
console.log('\n3. 2D Haldane Model & Quantized Chern Number:');

// HAL-01: Dirac Mass Gaps
const halParams = { t1: 1.0, t2: 0.2, phi: Math.PI / 2, M: 0.5 };
const masses = TopologicalMatter.computeDiracMasses(halParams);
const expectedShift = 3 * Math.sqrt(3) * 0.2 * Math.sin(Math.PI / 2);
assertClose(masses.mK, 0.5 - expectedShift, 1e-12, 'HAL-01a: Analytical Dirac mass at K matches M - 3*sqrt(3)*t2*sin(phi)');
assertClose(masses.mKprime, 0.5 + expectedShift, 1e-12, 'HAL-01b: Analytical Dirac mass at K\' matches M + 3*sqrt(3)*t2*sin(phi)');

// HAL-02: Analytical Chern Number
const cTopological = TopologicalMatter.computeAnalyticalChernNumber({ t1: 1.0, t2: 0.2, phi: Math.PI / 2, M: 0.0 });
assert(cTopological === 1, 'HAL-02a: Analytical Chern number C = +1 in topological QAH regime');

const cTrivial = TopologicalMatter.computeAnalyticalChernNumber({ t1: 1.0, t2: 0.2, phi: Math.PI / 2, M: 5.0 });
assert(cTrivial === 0, 'HAL-02b: Analytical Chern number C = 0 in Semenoff trivial insulator regime');

const cInverted = TopologicalMatter.computeAnalyticalChernNumber({ t1: 1.0, t2: 0.2, phi: -Math.PI / 2, M: 0.0 });
assert(cInverted === -1, 'HAL-02c: Analytical Chern number C = -1 with reversed time-reversal breaking phase');

// HAL-03: Numerical Berry Curvature Integral matches Quantized Chern Number
const cNumerical = TopologicalMatter.computeNumericalChernNumber({ t1: 1.0, t2: 0.2, phi: Math.PI / 2, M: 0.0 }, 32);
assert(cNumerical === 1, 'HAL-03: 2D Numerical Berry curvature integral yields exact quantized integer Chern C = 1');

// HAL-04: Fukui-Hatsugai-Suzuki Discrete Link Plaquette Product Method
const cFHS_Topological = TopologicalMatter.computeChernNumberFHS({ t1: 1.0, t2: 0.2, phi: Math.PI / 2, M: 0.0 }, 24);
assert(cFHS_Topological === 1, 'HAL-04a: Gauge-invariant FHS plaquette method yields exact Chern C = +1');

const cFHS_Trivial = TopologicalMatter.computeChernNumberFHS({ t1: 1.0, t2: 0.2, phi: Math.PI / 2, M: 2.0 }, 24);
assert(cFHS_Trivial === 0, 'HAL-04b: Gauge-invariant FHS plaquette method yields exact Chern C = 0');

// -----------------------------------------------------------------
// 4. HOFSTADTER BUTTERFLY & HARPER EQUATION
// -----------------------------------------------------------------
console.log('\n4. Hofstadter Butterfly & Harper Equation:');

// HOF-01: Bandwidth Invariance
const specHalf = HofstadterButterfly.computeHarperSpectrum(1, 2, 1.0, 5);
const maxEHalf = Math.max(...specHalf.map(Math.abs));
assert(maxEHalf <= 4.000001, 'HOF-01: Harper spectrum bandwidth strictly bounded by [-4t, +4t] for alpha = 1/2');

// HOF-02: Particle-Hole Spectral Symmetry
let symmetryResidual = 0;
const nHalf = specHalf.length;
for (let i = 0; i < nHalf / 2; i++) {
  const eLow = specHalf[i];
  const eHigh = specHalf[nHalf - 1 - i];
  symmetryResidual = Math.max(symmetryResidual, Math.abs(eLow + eHigh));
}
assertClose(symmetryResidual, 0.0, 1e-10, 'HOF-02: Harper spectrum exhibits exact particle-hole symmetry E <-> -E');

// HOF-03: Complex Multi-Band Rational Fraction alpha = 1/3
const specThird = HofstadterButterfly.computeHarperSpectrum(1, 3, 1.0, 5);
assert(specThird.length > 0, 'HOF-03a: Harper spectrum successfully diagonalizes q=3 matrix');
const maxEThird = Math.max(...specThird.map(Math.abs));
assert(maxEThird <= 4.000001, 'HOF-03b: q=3 spectrum respects total bandwidth bound <= 4t');

// HOF-04: Multi-slice butterfly generator
const butterfly = HofstadterButterfly.generateButterfly(12, 1.0);
assert(butterfly.length >= 20, 'HOF-04: Butterfly generator produced dense rational flux fractions');

// -----------------------------------------------------------------
// 5. DIATOMIC LATTICE PHONON DYNAMICS & SOUND VELOCITY
// -----------------------------------------------------------------
console.log('\n5. Diatomic Lattice Phonon Dynamics:');

const phononParams = {
  M1_amu: 28.0855, // Silicon
  M2_amu: 72.64,    // Germanium
  Cs: 50.0,         // N/m
  a_angstrom: 5.43   // Angstroms
};

// PHON-01: Acoustic Branch Zero at Gamma
const gammaPhonon = PhononDispersionEngine.computePhononFrequencies(0, phononParams);
assertClose(gammaPhonon.omegaMinus, 0.0, 1e-10, 'PHON-01a: Acoustic phonon frequency at Gamma q = 0 is exact zero');
const expectedOpt0 = PhononDispersionEngine.computeZoneCenterOpticalFrequency(phononParams);
assertClose(gammaPhonon.omegaPlus, expectedOpt0, 1e-10, 'PHON-01b: Optical phonon frequency at Gamma matches analytical formula');

// PHON-02: Sound Velocity in Long-Wavelength Limit
const vsAnalytical = PhononDispersionEngine.computeSoundSpeed(phononParams);
// Evaluate numerical d(omega)/dq at small q = 1e-4 1/Angstrom
const smallQ = 1e-4; // 1/Angstrom
const pSmall = PhononDispersionEngine.computePhononFrequencies(smallQ, phononParams);
// omega in rad/ps, q in 1/Angstrom -> (omega*1e12)/(q*1e10) = omega/q * 100 m/s
const vsNumerical = (pSmall.omegaMinus / smallQ) * 100; // in m/s
assertClose(vsNumerical, vsAnalytical, 0.001, 'PHON-02: Acoustic branch slope matches exact analytical sound speed (< 0.1%)');
assert(vsAnalytical > 1000 && vsAnalytical < 10000, 'PHON-02b: Sound speed in physical crystal range (1-10 km/s)');

// PHON-03: Phonon Bandgap at Zone Boundary
const qBoundary = Math.PI / phononParams.a_angstrom;
const pBoundary = PhononDispersionEngine.computePhononFrequencies(qBoundary, phononParams);
const numGap = pBoundary.omegaPlus - pBoundary.omegaMinus;
const analyticalGap = PhononDispersionEngine.computePhononBandgap(phononParams);
assertClose(numGap, analyticalGap, 1e-10, 'PHON-03: Phonon bandgap at zone boundary matches analytical formula');

// -----------------------------------------------------------------
// 6. ADVERSARIAL & EDGE CASES
// -----------------------------------------------------------------
console.log('\n6. Adversarial and Edge Case Handling:');

// ADV-01: Zero Hopping
const [eZeroMinus, eZeroPlus] = TightBindingSolver.computeGrapheneEnergy(0.5, 0.5, 0.0, acc);
assertClose(eZeroMinus, 0.0, 1e-14, 'ADV-01a: Zero hopping yields flat zero-energy band (lower)');
assertClose(eZeroPlus, 0.0, 1e-14, 'ADV-01b: Zero hopping yields flat zero-energy band (upper)');

// ADV-02: Extreme Mass Ratio (1000:1)
const extremePhonon = PhononDispersionEngine.computePhononFrequencies(0.5, {
  M1_amu: 1000.0,
  M2_amu: 1.0,
  Cs: 10.0,
  a_angstrom: 4.0
});
assert(Number.isFinite(extremePhonon.omegaMinus) && extremePhonon.omegaMinus >= 0, 'ADV-02a: Extreme mass ratio yields finite real acoustic frequency');
assert(Number.isFinite(extremePhonon.omegaPlus) && extremePhonon.omegaPlus > extremePhonon.omegaMinus, 'ADV-02b: Extreme mass ratio yields stable optical frequency');

// ADV-03: Invalid Harper Denominator
let caughtAdv03 = false;
try {
  HofstadterButterfly.computeHarperSpectrum(1, -5);
} catch (e) {
  caughtAdv03 = true;
}
assert(caughtAdv03, 'ADV-03: Harper solver safely rejects negative denominator');

// ADV-04: Non-positive spring constant
let caughtAdv04 = false;
try {
  PhononDispersionEngine.computePhononFrequencies(0.1, { ...phononParams, Cs: -10 });
} catch (e) {
  caughtAdv04 = true;
}
assert(caughtAdv04, 'ADV-04: Phonon engine safely rejects negative spring constant');

console.log('\n================================================================');
console.log(`ALL LAYER 1 TESTS PASSED: ${passedTests}/${totalTests} (100% SUCCESS)`);
console.log('Electronic structure, topological invariants, Hofstadter fractal,');
console.log('and phonon dynamics certified under Hardening Protocol 2.0.');
console.log('================================================================\n');
