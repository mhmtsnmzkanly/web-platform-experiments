/**
 * PONTIFEX (EXP-021) — Autonomous Numerical Validation Suite (Layer 1)
 * Validates 2D truss mechanics, Hookean equilibrium, cable asymmetry,
 * fracture thresholds, vehicle contact dynamics, and budget accounting.
 */

import { TrussPhysicsEngine } from './build/physics/TrussPhysicsEngine.js';
import { VehiclePhysicsEngine } from './build/physics/VehiclePhysicsEngine.js';
import { MATERIAL_PROPERTIES, GRAVITY } from './build/physics/MaterialConstants.js';
import { BRIDGE_LEVELS } from './build/physics/LevelDefinitions.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition, testId, message) {
  if (condition) {
    console.log(`  [PASS] ${testId}: ${message}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${testId}: ${message}`);
    failedTests++;
  }
}

function assertClose(actual, expected, relTolerance, testId, label) {
  const diff = Math.abs(actual - expected);
  const denom = Math.max(Math.abs(expected), 1e-12);
  const relErr = diff / denom;
  const pass = relErr <= relTolerance;
  const pctErr = (relErr * 100).toFixed(5);
  const tolPct = (relTolerance * 100).toFixed(5);

  if (pass) {
    console.log(`  [PASS] ${testId}: ${label} (measured: ${actual.toFixed(6)}, expected: ${expected.toFixed(6)}, relErr: ${pctErr}%, tol: ${tolPct}%)`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${testId}: ${label} (measured: ${actual.toFixed(6)}, expected: ${expected.toFixed(6)}, relErr: ${pctErr}%, tol: ${tolPct}%)`);
    failedTests++;
  }
}

console.log('================================================================');
console.log('PONTIFEX: Autonomous Numerical Validation Suite (Layer 1)');
console.log('================================================================\n');

// ----------------------------------------------------------------
// Suite 1: Truss Elasticity & Hookean Statics
// ----------------------------------------------------------------
console.log('1. Truss Elasticity & Hookean Statics:');

// Test 1a: Single hanging spring equilibrium elongation: Delta L = mg / k
{
  const k = MATERIAL_PROPERTIES.STEEL.stiffness; // 180,000 N/m
  const mass = 1500.0; // kg
  const expectedDeltaL = (mass * GRAVITY) / k; // ~ 0.08175 m

  const nodes = [
    { id: 'top', x: 0, y: 10, vx: 0, vy: 0, fx: 0, fy: 0, mass: 100, isAnchor: true },
    { id: 'bottom', x: 0, y: 5, vx: 0, vy: 0, fx: 0, fy: 0, mass: mass, isAnchor: false },
  ];
  const members = [
    {
      id: 'm1',
      nodeAId: 'top',
      nodeBId: 'bottom',
      material: 'STEEL',
      restLength: 5.0,
      currentLength: 5.0,
      force: 0,
      stress: 0,
      isBroken: false,
    },
  ];

  // Relax simulation with velocity damping to reach static equilibrium
  for (let step = 0; step < 1000; step++) {
    TrussPhysicsEngine.stepSimulation(nodes, members, 0.01, -100);
    nodes[1].vy *= 0.98;
  }

  const measuredDeltaL = Math.abs(nodes[1].y - 5.0);
  assertClose(measuredDeltaL, expectedDeltaL, 0.005, 'TRUSS-01a', 'Hanging steel beam static elongation Delta L = mg/k');
}

// Test 1b: Cable slack condition: compression produces zero restoring force
{
  const nodes = [
    { id: 'anchor', x: 0, y: 10, vx: 0, vy: 0, fx: 0, fy: 0, mass: 50, isAnchor: true },
    { id: 'free', x: 0, y: 7, vx: 0, vy: 0, fx: 0, fy: 0, mass: 50, isAnchor: false },
  ];
  // Rest length is 5m, but actual distance is 3m (compressed by 2m)
  const members = [
    {
      id: 'cable1',
      nodeAId: 'anchor',
      nodeBId: 'free',
      material: 'CABLE',
      restLength: 5.0,
      currentLength: 3.0,
      force: 0,
      stress: 0,
      isBroken: false,
    },
  ];

  TrussPhysicsEngine.stepSimulation(nodes, members, 0.001, -100);
  assert(members[0].force === 0.0, 'TRUSS-02a', 'Compressed cable produces identically zero restoring force (slack condition)');
}

// Test 1c: Cable tension resistance when stretched
{
  const nodes = [
    { id: 'anchor', x: 0, y: 10, vx: 0, vy: 0, fx: 0, fy: 0, mass: 50, isAnchor: true },
    { id: 'free', x: 0, y: 4, vx: 0, vy: 0, fx: 0, fy: 0, mass: 50, isAnchor: false },
  ];
  // Rest length 5m, distance 6m (stretched by 1m)
  const members = [
    {
      id: 'cable2',
      nodeAId: 'anchor',
      nodeBId: 'free',
      material: 'CABLE',
      restLength: 5.0,
      currentLength: 6.0,
      force: 0,
      stress: 0,
      isBroken: false,
    },
  ];

  TrussPhysicsEngine.stepSimulation(nodes, members, 0.0001, -100);
  const expectedForce = MATERIAL_PROPERTIES.CABLE.stiffness * 1.0; // 95,000 N
  assertClose(members[0].force, expectedForce, 0.01, 'TRUSS-02b', 'Stretched cable exerts full Hookean tensile resistance');
}

// Test 1d: Symmetric Warren truss reaction forces
{
  // 3 nodes: Left pin (0, 0), Right pin (10, 0), Center apex (5, 4) loaded with M = 2000 kg
  const M = 2000.0;
  const nodes = [
    { id: 'leftPin', x: 0, y: 0, vx: 0, vy: 0, fx: 0, fy: 0, mass: 50, isAnchor: true },
    { id: 'rightPin', x: 10, y: 0, vx: 0, vy: 0, fx: 0, fy: 0, mass: 50, isAnchor: true },
    { id: 'apex', x: 5, y: 4, vx: 0, vy: 0, fx: 0, fy: 0, mass: M, isAnchor: false },
  ];
  const members = [
    { id: 'mLeft', nodeAId: 'leftPin', nodeBId: 'apex', material: 'STEEL', restLength: Math.hypot(5, 4), currentLength: Math.hypot(5, 4), force: 0, stress: 0, isBroken: false },
    { id: 'mRight', nodeAId: 'rightPin', nodeBId: 'apex', material: 'STEEL', restLength: Math.hypot(5, 4), currentLength: Math.hypot(5, 4), force: 0, stress: 0, isBroken: false },
  ];

  for (let i = 0; i < 400; i++) {
    TrussPhysicsEngine.stepSimulation(nodes, members, 0.01, -100);
  }

  // Under symmetry, both beams should carry equal compressive load
  assertClose(members[0].force, members[1].force, 0.001, 'TRUSS-03', 'Symmetric truss members bear identical balanced load');
}

// ----------------------------------------------------------------
// Suite 2: Stress Calculation & Brittle Fracture Mechanics
// ----------------------------------------------------------------
console.log('\n2. Material Stress & Fracture Mechanics:');

// Test 2a: Stress ratio formula sigma = |F| / F_break
{
  const woodBreak = MATERIAL_PROPERTIES.WOOD.breakForce; // 9000 N
  const testForce = 4500.0;
  const expectedStress = testForce / woodBreak; // 0.50

  const nodes = [
    { id: 'n1', x: 0, y: 0, vx: 0, vy: 0, fx: 0, fy: 0, mass: 10, isAnchor: true },
    { id: 'n2', x: 5 + (testForce / MATERIAL_PROPERTIES.WOOD.stiffness), y: 0, vx: 0, vy: 0, fx: 0, fy: 0, mass: 10, isAnchor: false },
  ];
  const members = [
    { id: 'w1', nodeAId: 'n1', nodeBId: 'n2', material: 'WOOD', restLength: 5.0, currentLength: 5.0, force: 0, stress: 0, isBroken: false },
  ];

  TrussPhysicsEngine.stepSimulation(nodes, members, 0.0001, -100);
  assertClose(members[0].stress, expectedStress, 0.01, 'FAIL-01', 'Member stress ratio matches |F| / F_break');
}

// Test 2b: Member fractures when stress >= 1.0
{
  const woodBreak = MATERIAL_PROPERTIES.WOOD.breakForce;
  // Overload by 10%
  const overloadForce = woodBreak * 1.1;
  const deltaL = overloadForce / MATERIAL_PROPERTIES.WOOD.stiffness;

  const nodes = [
    { id: 'a', x: 0, y: 0, vx: 0, vy: 0, fx: 0, fy: 0, mass: 10, isAnchor: true },
    { id: 'b', x: 5.0 + deltaL, y: 0, vx: 0, vy: 0, fx: 0, fy: 0, mass: 10, isAnchor: false },
  ];
  const members = [
    { id: 'overloaded', nodeAId: 'a', nodeBId: 'b', material: 'WOOD', restLength: 5.0, currentLength: 5.0, force: 0, stress: 0, isBroken: false },
  ];

  let snappedFired = false;
  const res = TrussPhysicsEngine.stepSimulation(nodes, members, 0.001, -100, () => {
    snappedFired = true;
  });

  assert(members[0].isBroken === true, 'FAIL-02a', 'Member marked as broken when stress exceeds 1.0');
  assert(snappedFired === true, 'FAIL-02b', 'Snap callback successfully triggered upon fracture');
  assert(res.snappedMembers.length === 1, 'FAIL-02c', 'Fracture recorded in frame snapped members list');
}

// Test 2c: Broken member transmits zero force in subsequent steps
{
  const nodes = [
    { id: 'a', x: 0, y: 0, vx: 0, vy: 0, fx: 0, fy: 0, mass: 10, isAnchor: true },
    { id: 'b', x: 6, y: 0, vx: 0, vy: 0, fx: 0, fy: 0, mass: 10, isAnchor: false },
  ];
  const members = [
    { id: 'broken', nodeAId: 'a', nodeBId: 'b', material: 'WOOD', restLength: 5.0, currentLength: 6.0, force: 1000, stress: 1.2, isBroken: true },
  ];

  TrussPhysicsEngine.stepSimulation(nodes, members, 0.001, -100);
  assert(nodes[1].fx === 0.0, 'FAIL-03', 'Broken member exerts zero structural force on connected nodes');
}

// ----------------------------------------------------------------
// Suite 3: Vehicle Kinematics & Wheel-Road Contact Mechanics
// ----------------------------------------------------------------
console.log('\n3. Vehicle Kinematics & Contact Mechanics:');

// Test 3a: Vehicle initialization
{
  const car = VehiclePhysicsEngine.createVehicle('CAR', 5.0, 10.0);
  assert(car.type === 'CAR', 'VEH-01a', 'Vehicle instantiated with type CAR');
  assert(car.mass === 1400.0, 'VEH-01b', 'Passenger car mass calibrated to 1400 kg');
  assert(car.frontWheel.radius === 0.38, 'VEH-01c', 'Front wheel radius initialized to 0.38m');
}

// Test 3b: Heavy truck & train parameters
{
  const truck = VehiclePhysicsEngine.createVehicle('TRUCK', 0, 10);
  const train = VehiclePhysicsEngine.createVehicle('TRAIN', 0, 10);
  assert(truck.mass === 5500.0, 'VEH-02a', 'Heavy truck mass calibrated to 5500 kg');
  assert(train.mass === 14000.0, 'VEH-02b', 'Freight train mass calibrated to 14000 kg');
  assert(train.driveForce > truck.driveForce, 'VEH-02c', 'Train engine drive force exceeds truck');
}

// Test 3c: Wheel-road contact detection & support against gravity
{
  const car = VehiclePhysicsEngine.createVehicle('CAR', 15.0, 10.4);
  car.status = 'DRIVING';

  const nodes = [
    { id: 'nL', x: 10.0, y: 10.0, vx: 0, vy: 0, fx: 0, fy: 0, mass: 100, isAnchor: true },
    { id: 'nR', x: 20.0, y: 10.0, vx: 0, vy: 0, fx: 0, fy: 0, mass: 100, isAnchor: true },
  ];
  const members = [
    { id: 'roadDeck', nodeAId: 'nL', nodeBId: 'nR', material: 'ROAD', restLength: 10.0, currentLength: 10.0, force: 0, stress: 0, isBroken: false },
  ];

  // Advance vehicle for several steps
  for (let i = 0; i < 60; i++) {
    VehiclePhysicsEngine.stepVehicle(car, nodes, members, 0.016, 10.0, 20.0, 10.0, 30.0, 0.0);
  }

  assert(car.isGrounded === true, 'VEH-03a', 'Car wheels ground successfully on active road deck');
  assert(car.vx > 0.5, 'VEH-03b', 'Car accelerates forward under engine drive traction');
  assert(car.y >= 9.8, 'VEH-03c', 'Normal contact force prevents car from falling through bridge deck');
}

// Test 3d: Vehicle crash detection when falling into water
{
  const car = VehiclePhysicsEngine.createVehicle('CAR', 15.0, 2.0); // Dropped into water (water level = 3.0)
  car.status = 'DRIVING';

  const nodes = [];
  const members = [];

  VehiclePhysicsEngine.stepVehicle(car, nodes, members, 0.016, 5.0, 25.0, 10.0, 30.0, 3.0);
  assert(car.status === 'CRASHED', 'VEH-04', 'Vehicle status transitions to CRASHED when submerged in water');
}

// Test 3e: Vehicle goal reach detection
{
  const car = VehiclePhysicsEngine.createVehicle('CAR', 31.0, 10.0); // At target flag on right cliff at y = 10.0
  car.status = 'DRIVING';

  const nodes = [];
  const members = [];

  // Pass rightCliffMinX = 25.0 so the car wheels contact the right approach cliff road at y = 10.0
  VehiclePhysicsEngine.stepVehicle(car, nodes, members, 0.016, 10.0, 25.0, 10.0, 30.0, 0.0);
  assert(car.status === 'SUCCESS', 'VEH-05', 'Vehicle status transitions to SUCCESS upon reaching flag on right cliff');
}

// ----------------------------------------------------------------
// Suite 4: Level Definitions & Budget Calculations
// ----------------------------------------------------------------
console.log('\n4. Level Definitions & Budget Calculations:');

// Test 4a: Bridge budget formula exactness
{
  const members = [
    { id: 'm1', nodeAId: 'a', nodeBId: 'b', material: 'ROAD', restLength: 10.0, currentLength: 10.0, force: 0, stress: 0, isBroken: false },
    { id: 'm2', nodeAId: 'b', nodeBId: 'c', material: 'WOOD', restLength: 6.0, currentLength: 6.0, force: 0, stress: 0, isBroken: false },
    { id: 'm3', nodeAId: 'c', nodeBId: 'd', material: 'STEEL', restLength: 4.0, currentLength: 4.0, force: 0, stress: 0, isBroken: false },
  ];

  // Expected cost: 10 * 150 + 6 * 45 + 4 * 130 = 1500 + 270 + 520 = 2290
  const totalCost = TrussPhysicsEngine.computeTotalBudget(members);
  assert(totalCost === 2290, 'BUDGET-01', `Total bridge budget calculated exactly ($${totalCost} === $2290)`);
}

// Test 4b: Level geometry and constraints
{
  assert(BRIDGE_LEVELS.length === 5, 'LVL-01', 'Verified 5 curated challenge levels');
  BRIDGE_LEVELS.forEach((lvl, idx) => {
    assert(lvl.budget > 5000, `LVL-02-${idx+1}`, `Level ${lvl.id} has positive valid budget ($${lvl.budget})`);
    assert(lvl.anchorNodes.length >= 4, `LVL-03-${idx+1}`, `Level ${lvl.id} has at least 4 terrain anchor points`);
    assert(lvl.targetFlagX > lvl.terrain.rightX, `LVL-04-${idx+1}`, `Level ${lvl.id} target flag is on opposite cliff`);
  });
}

// ----------------------------------------------------------------
// Suite 5: Adversarial & Edge Cases
// ----------------------------------------------------------------
console.log('\n5. Adversarial & Edge Cases:');

// Test 5a: Zero length element guard
{
  const nodes = [
    { id: 'n1', x: 5, y: 5, vx: 0, vy: 0, fx: 0, fy: 0, mass: 10, isAnchor: false },
    { id: 'n2', x: 5, y: 5, vx: 0, vy: 0, fx: 0, fy: 0, mass: 10, isAnchor: false },
  ];
  const members = [
    { id: 'zero', nodeAId: 'n1', nodeBId: 'n2', material: 'WOOD', restLength: 0.0, currentLength: 0.0, force: 0, stress: 0, isBroken: false },
  ];

  TrussPhysicsEngine.stepSimulation(nodes, members, 0.016, -100);
  assert(!isNaN(nodes[0].x) && !isNaN(nodes[1].x), 'ADV-01', 'Zero-length coincident nodes do not produce NaN or Infinity');
}

// Test 5b: Rapid velocity clamp prevents explosion
{
  const nodes = [
    { id: 'n1', x: 0, y: 0, vx: 500.0, vy: -500.0, fx: 1e9, fy: 1e9, mass: 1, isAnchor: false },
  ];
  const members = [];

  TrussPhysicsEngine.stepSimulation(nodes, members, 0.016, -100);
  const speed = Math.hypot(nodes[0].vx, nodes[0].vy);
  assert(speed <= 120.1, 'ADV-02', `High-velocity node clamped safely to maximum speed (speed: ${speed.toFixed(1)} <= 120)`);
}

console.log('\n================================================================');
console.log(`TOTAL LAYER 1 TESTS: ${passedTests + failedTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL LAYER 1 TESTS PASSED (100% SUCCESS)!');
  console.log('2D Truss mechanics, material yield, and vehicle contact certified.');
}
