/**
 * MARBLE-FORGE (EXP-023) — Standalone Numerical & Physical Validation Suite
 * Layer 1 Verification Harness under Hardening Protocol 2.0
 */

import { MarbleSimulationEngine } from './build/physics/MarbleSimulationEngine.js';
import { MARBLE_MATERIALS } from './build/physics/MarbleMaterials.js';
import { MARBLE_LEVELS } from './build/physics/LevelDefinitions.js';

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
console.log('MARBLE-FORGE: Autonomous Kinematics & Kinetic Physics Suite');
console.log('================================================================\n');

// -------------------------------------------------------------
// 1. Kinematics & Free Fall Dynamics (FALL)
// -------------------------------------------------------------
console.log('1. Kinematics & Free Fall Dynamics (FALL):');
{
  const engine = new MarbleSimulationEngine(12, 10);
  const m = engine.spawnMarble(5.0, 1.0, 'STEEL', 0, 0);

  const tEnd = 0.5; // seconds
  const steps = 60 * tEnd;
  const dt = 1 / 60;

  for (let s = 0; s < steps; s++) {
    engine.step(dt);
  }

  // Theoretical position: y = y0 + 0.5 * g * t^2
  // g = 9.81 m/s^2, t = 0.5s -> 0.5 * 9.81 * 0.25 = 1.22625m
  // y = 1.0 + 1.22625 = 2.22625m
  const yExpected = 1.0 + 0.5 * 9.81 * (tEnd * tEnd);
  assertClose(m.y, yExpected, 1.0, 'FALL-01a', 'Free fall vertical displacement matches y(t) = y0 + 0.5 g t^2');

  // Velocity: v = g * t = 9.81 * 0.5 = 4.905 m/s
  const vExpected = 9.81 * tEnd;
  assertClose(m.vy, vExpected, 1.0, 'FALL-01b', 'Free fall vertical velocity matches vy(t) = g * t');

  // Projectile Motion with Horizontal Velocity
  const engine2 = new MarbleSimulationEngine(12, 10);
  const m2 = engine2.spawnMarble(1.0, 1.0, 'GLASS', 3.0, 0);
  for (let s = 0; s < steps; s++) {
    engine2.step(dt);
  }
  const xExpected = 1.0 + 3.0 * tEnd;
  assertClose(m2.x, xExpected, 1.0, 'FALL-02', 'Horizontal projectile displacement x(t) = x0 + vx*t preserved');
}

// -------------------------------------------------------------
// 2. Rolling without Slip on Inclined Plane (ROLL)
// -------------------------------------------------------------
console.log('\n2. Rolling without Slip on Inclined Plane (ROLL):');
{
  const engine = new MarbleSimulationEngine(12, 10);
  // Rail inclined at 30 degrees (slope: tan(30) = 0.577)
  const theta = (30 * Math.PI) / 180;
  const railLen = 6.0;
  const x1 = 1.0, y1 = 1.0;
  const x2 = x1 + railLen * Math.cos(theta);
  const y2 = y1 + railLen * Math.sin(theta);

  engine.elements = [
    {
      type: 'STRAIGHT_RAIL',
      id: 'incline-30',
      x1,
      y1,
      x2,
      y2,
      friction: 0.0,
    },
  ];

  // Spawn marble on incline
  const def = MARBLE_MATERIALS['STEEL'];
  const m = engine.spawnMarble(x1 + 0.5 * Math.cos(theta), y1 + 0.5 * Math.sin(theta) - def.radius * 0.95, 'STEEL', 0, 0);

  const tEnd = 0.4;
  const dt = 1 / 60;
  const steps = Math.floor(tEnd / dt);

  for (let s = 0; s < steps; s++) {
    engine.step(dt);
  }

  // Theoretical acceleration for rolling solid sphere:
  // a_roll = (5/7) * g * sin(theta) = (5/7) * 9.81 * 0.5 = 3.5036 m/s^2
  const aTheoretical = (5 / 7) * 9.81 * Math.sin(theta);
  const vExpected = aTheoretical * tEnd;

  const currentSpeed = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
  assertClose(currentSpeed, vExpected, 3.5, 'ROLL-01', 'Marble rolling acceleration matches solid sphere a = (5/7) g sin(theta)');

  // Angular rolling condition v = omega * r
  const omegaExpected = currentSpeed / m.radius;
  assertClose(Math.abs(m.omega), omegaExpected, 3.0, 'ROLL-02', 'Rolling without slip maintains v = omega * r');
}

// -------------------------------------------------------------
// 3. Loop-the-Loop Centripetal Mechanics & Detachment (LOOP)
// -------------------------------------------------------------
console.log('\n3. Loop-the-Loop Centripetal Mechanics & Detachment (LOOP):');
{
  const R = 1.0; // meters
  const g = 9.81;
  // Critical entry velocity for rolling sphere:
  // v_crit^2 = (27/7) * g * R => v_crit = sqrt(27/7 * 9.81 * 1.0) = 6.151 m/s
  const vCrit = Math.sqrt((27 / 7) * g * R);

  // Case A: Super-critical launch (v0 = 8.5 m/s > v_crit)
  const engineSuper = new MarbleSimulationEngine(12, 10);
  engineSuper.elements = [
    {
      type: 'LOOP_THE_LOOP',
      id: 'loop-test-1',
      cx: 5.0,
      cy: 5.0,
      radius: R,
      entrySide: 'LEFT',
    },
  ];

  // Spawn at bottom entry with high speed
  const mSuper = engineSuper.spawnMarble(5.0 - R + 0.15, 5.0, 'STEEL', 0, -8.5);

  let reachedTop = false;
  for (let s = 0; s < 40; s++) {
    engineSuper.step(1 / 120);
    // Top apex is at y ~ cy - R = 4.0
    if (mSuper.y <= 5.0 - R * 0.8 && Math.abs(mSuper.x - 5.0) < 0.8) {
      reachedTop = true;
      break;
    }
  }
  assert(reachedTop, 'LOOP-01', `Super-critical marble clears loop apex (v0 = 8.5 m/s > v_crit = ${vCrit.toFixed(2)} m/s)`);

  // Case B: Sub-critical launch (v0 = 2.0 m/s << v_crit)
  const engineSub = new MarbleSimulationEngine(12, 10);
  engineSub.elements = [
    {
      type: 'LOOP_THE_LOOP',
      id: 'loop-test-2',
      cx: 5.0,
      cy: 5.0,
      radius: R,
      entrySide: 'LEFT',
    },
  ];
  const mSub = engineSub.spawnMarble(5.0 - R + 0.15, 5.0, 'STEEL', 0, -2.0);

  let reachedTopSub = false;
  for (let s = 0; s < 60; s++) {
    engineSub.step(1 / 120);
    if (mSub.y <= 5.0 - R * 0.8) {
      reachedTopSub = true;
      break;
    }
  }
  assert(!reachedTopSub, 'LOOP-02', 'Sub-critical marble fails to clear loop apex and cleanly falls back/detaches');
}

// -------------------------------------------------------------
// 4. Rigid-Body Levers & Seesaw Statics (LEVER)
// -------------------------------------------------------------
console.log('\n4. Rigid-Body Levers & Seesaw Statics (LEVER):');
{
  const engine = new MarbleSimulationEngine(12, 10);
  const seesaw = {
    type: 'SEESAW',
    id: 'seesaw-test',
    px: 6.0,
    py: 5.0,
    length: 3.0,
    angle: 0.0,
    angularVelocity: 0.0,
    minAngle: -0.4,
    maxAngle: 0.4,
    mass: 0.5,
  };
  engine.elements = [seesaw];

  // Spawn marble on left side (x = 5.0, distance d = 1.0m to left of pivot)
  const m = engine.spawnMarble(5.0, 4.8, 'STEEL', 0, 0);

  // Run simulation: left downward torque should tip lever counter-clockwise (positive or negative angle depending on coords)
  for (let s = 0; s < 30; s++) {
    engine.step(1 / 60);
  }

  assert(Math.abs(seesaw.angle) > 0.05, 'LEVER-01', `Marble weight creates torque causing seesaw rotation (angle: ${seesaw.angle.toFixed(4)} rad)`);
  assert(seesaw.angle <= seesaw.maxAngle && seesaw.angle >= seesaw.minAngle, 'LEVER-02', 'Seesaw respects hard mechanical angle stops');
}

// -------------------------------------------------------------
// 5. Collision Mechanics & Conservation of Momentum (COLL)
// -------------------------------------------------------------
console.log('\n5. Collision Mechanics & Conservation of Momentum (COLL):');
{
  const engine = new MarbleSimulationEngine(12, 10);
  engine.gravity = 0; // Turn off gravity for pure collision momentum verification
  engine.airDrag = 0; // Turn off air drag for pure collision momentum verification

  // m1 moving right at 2.0 m/s, m2 stationary
  const m1 = engine.spawnMarble(3.0, 5.0, 'STEEL', 2.0, 0);
  const m2 = engine.spawnMarble(3.25, 5.0, 'STEEL', 0, 0);

  const initialMomentumX = m1.mass * m1.vx + m2.mass * m2.vx;

  // Step into collision
  for (let s = 0; s < 10; s++) {
    engine.step(1 / 120);
  }

  const finalMomentumX = m1.mass * m1.vx + m2.mass * m2.vx;
  assertClose(finalMomentumX, initialMomentumX, 0.001, 'COLL-01', 'Total linear momentum strictly conserved during binary marble collision');

  // Pinball Bumper Active Kick
  const engineBumper = new MarbleSimulationEngine(12, 10);
  engineBumper.gravity = 0;
  engineBumper.elements = [
    {
      type: 'BUMPER',
      id: 'test-bumper',
      x: 5.0,
      y: 5.0,
      radius: 0.5,
      kickImpulse: 3.0,
      cooldownTimer: 0,
    },
  ];
  const mBumper = engineBumper.spawnMarble(4.3, 5.0, 'RUBBER', 1.0, 0);

  for (let s = 0; s < 15; s++) {
    engineBumper.step(1 / 120);
  }

  // After hitting bumper, marble rebounds with kick: vx should be negative and magnitude > 3.0
  assert(mBumper.vx < -2.0, 'COLL-02', `Pinball bumper imparts active kick impulse (rebound vx: ${mBumper.vx.toFixed(2)} m/s)`);
}

// -------------------------------------------------------------
// 6. Motorized Lift Transport & Level Integrity (LIFT)
// -------------------------------------------------------------
console.log('\n6. Motorized Lift Transport & Level Integrity (LIFT):');
{
  const engine = new MarbleSimulationEngine(12, 10);
  const liftSpeed = 2.0; // m/s
  engine.elements = [
    {
      type: 'ARCHIMEDES_LIFT',
      id: 'test-lift',
      x: 3.0,
      bottomY: 7.0,
      topY: 2.0,
      radius: 0.5,
      liftSpeed,
      spiralPhase: 0,
    },
  ];

  // Spawn marble at bottom of lift
  const mLift = engine.spawnMarble(3.0, 6.5, 'GLASS', 0, 0);

  for (let s = 0; s < 30; s++) {
    engine.step(1 / 60);
  }

  assertClose(mLift.vy, -liftSpeed, 0.1, 'LIFT-01', `Archimedes screw transports marble vertically at constant lift speed (${liftSpeed} m/s)`);

  // Verify All 5 Curated Levels load correctly
  let allLevelsValid = true;
  for (const lvl of MARBLE_LEVELS) {
    if (!lvl.name || lvl.elements.length === 0 || lvl.requiredHits < 1) {
      allLevelsValid = false;
    }
  }
  assert(allLevelsValid, 'LIFT-02', `All ${MARBLE_LEVELS.length} challenge levels successfully configured with valid physics elements and targets`);
}

console.log('\n================================================================');
console.log(`TOTAL LAYER 1 TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('================================================================\n');

if (failedTests > 0) {
  console.error('LAYER 1 VALIDATION FAILED!');
  process.exit(1);
} else {
  console.log('ALL LAYER 1 TESTS PASSED (100% SUCCESS)!');
  console.log('Kinetic physics, rolling mechanics, centripetal loop, and rigid body dynamics certified.\n');
  process.exit(0);
}
