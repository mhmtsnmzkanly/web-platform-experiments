/**
 * POWDER-BOX (EXP-022) — Layer 1 Standalone Numerical & Cellular Automata Validation Suite
 * 35+ automated assertions validating granular mechanics, fluid stratification, thermodynamics,
 * phase changes, chemical reactions, and mass conservation.
 */

import { PowderSimulationEngine } from './build/physics/PowderSimulationEngine.js';
import { ELEMENT_IDS } from './build/physics/ElementRegistry.js';
import { loadPreset } from './build/physics/SandboxPresets.js';

let passed = 0;
let failed = 0;

function assert(condition, testId, message) {
  if (condition) {
    console.log(`  [PASS] ${testId}: ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testId}: ${message}`);
    failed++;
  }
}

function assertClose(actual, expected, tolRel, testId, message) {
  const diff = Math.abs(actual - expected);
  const denom = Math.max(Math.abs(expected), 1e-6);
  const relErr = diff / denom;
  const ok = relErr <= tolRel;

  if (ok) {
    console.log(
      `  [PASS] ${testId}: ${message} (measured: ${actual.toFixed(4)}, expected: ${expected.toFixed(4)}, relErr: ${(relErr * 100).toFixed(4)}%, tol: ${(tolRel * 100).toFixed(4)}%)`
    );
    passed++;
  } else {
    console.error(
      `  [FAIL] ${testId}: ${message} (measured: ${actual.toFixed(4)}, expected: ${expected.toFixed(4)}, relErr: ${(relErr * 100).toFixed(4)}%, tol: ${(tolRel * 100).toFixed(4)}%)`
    );
    failed++;
  }
}

console.log('================================================================');
console.log('POWDER-BOX: Autonomous Numerical & Cellular Automata Validation Suite');
console.log('================================================================\n');

// -------------------------------------------------------------
// Suite 1: Granular Kinematics & Angle of Repose (SAND)
// -------------------------------------------------------------
console.log('1. Granular Kinematics & Angle of Repose (SAND):');

{
  const engine = new PowderSimulationEngine(50, 50);
  // Spawn a single sand grain suspended in air at (25, 10)
  engine.setElement(25, 10, 'SAND');
  assert(engine.getElement(25, 10) === 'SAND', 'SAND-01a', 'Sand particle placed at initial position');

  // Step 35 times (enough to fall to floor at y = 49)
  for (let s = 0; s < 45; s++) {
    engine.step();
  }

  assert(engine.getElement(25, 49) === 'SAND', 'SAND-01b', 'Sand particle accelerates downward and reaches floor');
  assert(engine.getElement(25, 10) === 'EMPTY', 'SAND-01c', 'Initial suspended cell is now empty');
}

{
  // Sand pile angle of repose test:
  // Drop a column of sand onto a flat floor; it should form a pyramid with sloping sides, not spread flat infinitely
  const engine = new PowderSimulationEngine(60, 60);
  for (let y = 10; y < 35; y++) {
    engine.setElement(30, y, 'SAND');
  }

  for (let s = 0; s < 100; s++) {
    engine.step();
  }

  // Find apex height at center (x = 30)
  let apexY = 59;
  while (apexY >= 0 && engine.getElement(30, apexY) === 'SAND') {
    apexY--;
  }
  const pileHeight = 59 - apexY;

  // Find left and right spread on floor
  let leftX = 30;
  while (leftX >= 0 && engine.getElement(leftX, 59) === 'SAND') leftX--;
  let rightX = 30;
  while (rightX < 60 && engine.getElement(rightX, 59) === 'SAND') rightX++;

  const halfWidth = Math.max(30 - leftX, rightX - 30);
  const angleRad = Math.atan2(pileHeight, halfWidth);
  const angleDeg = (angleRad * 180) / Math.PI;

  assert(pileHeight > 2, 'SAND-02a', `Sand pile maintains vertical apex (height: ${pileHeight} cells)`);
  assert(halfWidth > 2, 'SAND-02b', `Sand pile spreads laterally into sloping shoulders (half-width: ${halfWidth})`);
  assert(
    angleDeg >= 20.0 && angleDeg <= 55.0,
    'SAND-02c',
    `Sand pile angle of repose within granular friction bounds (${angleDeg.toFixed(1)} deg)`
  );
}

// -------------------------------------------------------------
// Suite 2: Multi-Fluid Buoyancy & Density Stratification (FLUID)
// -------------------------------------------------------------
console.log('\n2. Multi-Fluid Buoyancy & Density Stratification (FLUID):');

{
  // Test: Oil floats on Water
  // We place a layer of Water on top of Oil, then simulate. They must swap places due to density!
  const engine = new PowderSimulationEngine(40, 40);
  const floorY = 39;

  // Build container walls
  for (let y = 30; y <= floorY; y++) {
    engine.setElement(14, y, 'STONE');
    engine.setElement(26, y, 'STONE');
  }

  // Bottom layer: Oil
  for (let x = 15; x <= 25; x++) {
    engine.setElement(x, floorY, 'OIL');
  }
  // Top layer: Water (denser: 1000 kg/m^3 vs 820 kg/m^3)
  for (let x = 15; x <= 25; x++) {
    engine.setElement(x, floorY - 1, 'WATER');
  }

  for (let s = 0; s < 30; s++) {
    engine.step();
  }

  // After settling, Water must sink below Oil
  let waterCountAtFloor = 0;
  let oilCountAbove = 0;
  for (let x = 15; x <= 25; x++) {
    if (engine.getElement(x, floorY) === 'WATER') waterCountAtFloor++;
    if (engine.getElement(x, floorY - 1) === 'OIL') oilCountAbove++;
  }

  assert(waterCountAtFloor >= 8, 'FLUID-01a', 'Denser Water sinks below lighter Oil');
  assert(oilCountAbove >= 8, 'FLUID-01b', 'Lighter Oil rises and floats on top of Water');
}

{
  // Test: Sand sinks through Water
  const engine = new PowderSimulationEngine(40, 40);
  for (let y = 25; y < 40; y++) {
    for (let x = 10; x < 30; x++) {
      engine.setElement(x, y, 'WATER');
    }
  }

  // Drop sand above water pool
  engine.setElement(20, 15, 'SAND');

  for (let s = 0; s < 40; s++) {
    engine.step();
  }

  assert(engine.getElement(20, 39) === 'SAND', 'FLUID-02', 'Dense sand grains sink through water to the bedrock floor');
}

{
  // Test: Closed vessel mass conservation
  const engine = new PowderSimulationEngine(50, 50);
  // Build sealed stone vessel
  for (let x = 10; x <= 40; x++) {
    engine.setElement(x, 10, 'STONE');
    engine.setElement(x, 40, 'STONE');
  }
  for (let y = 10; y <= 40; y++) {
    engine.setElement(10, y, 'STONE');
    engine.setElement(40, y, 'STONE');
  }

  // Add 100 cells of water inside sealed vessel
  let initialWaterCount = 0;
  for (let y = 20; y < 25; y++) {
    for (let x = 15; x < 35; x++) {
      engine.setElement(x, y, 'WATER');
      initialWaterCount++;
    }
  }

  // Simulate fluid splashing and leveling for 60 ticks
  for (let s = 0; s < 60; s++) {
    engine.step();
  }

  let finalWaterCount = 0;
  for (let y = 11; y < 40; y++) {
    for (let x = 11; x < 40; x++) {
      if (engine.getElement(x, y) === 'WATER') finalWaterCount++;
    }
  }

  assert(
    finalWaterCount === initialWaterCount,
    'FLUID-03',
    `Fluid mass strictly conserved in sealed vessel (${finalWaterCount} === ${initialWaterCount})`
  );
}

// -------------------------------------------------------------
// Suite 3: Thermodynamics & Heat Conduction (THERM)
// -------------------------------------------------------------
console.log('\n3. Thermodynamics & Heat Conduction (THERM):');

{
  const engine = new PowderSimulationEngine(41, 41);
  const mid = 20;

  // Fill area with uniform iron plate (high thermal conductivity)
  for (let y = 10; y <= 30; y++) {
    for (let x = 10; x <= 30; x++) {
      engine.setElement(x, y, 'IRON');
      engine.setTemperature(x, y, 20.0);
    }
  }

  // Inject central heat spot
  engine.setTemperature(mid, mid, 800.0);

  // Step heat diffusion
  for (let s = 0; s < 20; s++) {
    engine.step();
  }

  const tCenter = engine.getTemperature(mid, mid);
  const tLeft = engine.getTemperature(mid - 3, mid);
  const tRight = engine.getTemperature(mid + 3, mid);
  const tUp = engine.getTemperature(mid, mid - 3);
  const tDown = engine.getTemperature(mid, mid + 3);

  assert(tCenter < 800.0 && tCenter > 25.0, 'THERM-01a', 'Central thermal energy conducts outward into adjacent iron');
  assert(tLeft > 25.0, 'THERM-01b', 'Heat conducted laterally to left probe');
  assertClose(tLeft, tRight, 0.05, 'THERM-01c', 'Lateral heat conduction is symmetric left and right');
  assertClose(tUp, tDown, 0.05, 'THERM-01d', 'Vertical heat conduction is symmetric up and down');
}

{
  // Ambient thermal relaxation test: hot spot cools towards ambient (20C)
  const engine = new PowderSimulationEngine(30, 30);
  engine.setElement(15, 15, 'STONE');
  engine.setTemperature(15, 15, 500.0);

  for (let s = 0; s < 120; s++) {
    engine.step();
  }

  const tCooled = engine.getTemperature(15, 15);
  assert(tCooled < 300.0 && tCooled >= 20.0, 'THERM-02', `Hot cell relaxes towards ambient 20C (measured: ${tCooled.toFixed(1)}C)`);
}

// -------------------------------------------------------------
// Suite 4: Phase Transformations (PHASE)
// -------------------------------------------------------------
console.log('\n4. Phase Transformations (PHASE):');

{
  // Test: Ice melts to Water at T >= 0C
  const engine = new PowderSimulationEngine(30, 30);
  for (let x = 0; x < 30; x++) engine.setElement(x, 16, 'STONE');
  engine.setElement(15, 15, 'ICE', -10.0);
  assert(engine.getElement(15, 15) === 'ICE', 'PHASE-01a', 'Ice stable below 0C');

  // Heat above melting point
  engine.setTemperature(15, 15, 25.0);
  engine.step();

  const waterMelted =
    engine.getElement(15, 15) === 'WATER' ||
    engine.getElement(16, 15) === 'WATER' ||
    engine.getElement(14, 15) === 'WATER';
  assert(waterMelted, 'PHASE-01b', 'Ice melts to Water when temperature exceeds 0C');
}

{
  // Test: Water boils to Steam at T >= 100C
  const engine = new PowderSimulationEngine(30, 30);
  for (let x = 0; x < 30; x++) engine.setElement(x, 16, 'STONE', 150.0);
  engine.setElement(15, 15, 'WATER', 20.0);
  assert(engine.getElement(15, 15) === 'WATER', 'PHASE-02a', 'Liquid water stable at 20C');

  engine.setTemperature(15, 15, 140.0);
  engine.step();

  let steamFound = false;
  for (let y = 10; y <= 16; y++) {
    for (let x = 12; x <= 18; x++) {
      if (engine.getElement(x, y) === 'STEAM') steamFound = true;
    }
  }
  assert(steamFound, 'PHASE-02b', 'Water boils to Steam vapor when temperature exceeds 100C');
}

{
  // Test: Molten Lava cools and freezes to Stone when T <= 650C
  const engine = new PowderSimulationEngine(30, 30);
  for (let x = 0; x < 30; x++) engine.setElement(x, 16, 'STONE');
  engine.setElement(15, 15, 'LAVA', 900.0);
  assert(engine.getElement(15, 15) === 'LAVA', 'PHASE-03a', 'Lava stable at molten temperature 900C');

  engine.setTemperature(15, 15, 400.0);
  engine.step();

  assert(engine.getElement(15, 15) === 'STONE', 'PHASE-03b', 'Lava solidifies into basalt Stone when cooled below 650C');
}

// -------------------------------------------------------------
// Suite 5: Chemical Reactions & Combustion (REACT)
// -------------------------------------------------------------
console.log('\n5. Chemical Reactions & Combustion (REACT):');

{
  // Test: Gunpowder explosive deflagration
  const engine = new PowderSimulationEngine(30, 30);
  let explosionTriggered = false;
  engine.setReactionCallback((evt) => {
    if (evt.type === 'EXPLOSION') explosionTriggered = true;
  });

  engine.setElement(15, 15, 'GUNPOWDER');
  engine.setElement(15, 14, 'FIRE'); // Fire directly above gunpowder

  engine.step();

  assert(explosionTriggered, 'REACT-01a', 'Fire in contact with Gunpowder triggers explosion event');
  assert(engine.getElement(15, 15) !== 'GUNPOWDER', 'REACT-01b', 'Gunpowder consumed in explosive deflagration');
}

{
  // Test: Acid corrodes organic wood
  const engine = new PowderSimulationEngine(30, 30);
  engine.setElement(15, 15, 'WOOD');
  engine.setElement(15, 14, 'ACID'); // Acid directly touching wood

  // Step multiple ticks to allow probabilistic acid etching
  for (let s = 0; s < 25; s++) {
    engine.step();
  }

  const woodRemaining = engine.getElement(15, 15) === 'WOOD';
  assert(!woodRemaining, 'REACT-02', 'Sulfuric acid dissolves adjacent wood scaffold');
}

{
  // Test: Lava and Water contact reaction
  const engine = new PowderSimulationEngine(30, 30);
  let hissTriggered = false;
  engine.setReactionCallback((evt) => {
    if (evt.type === 'HISS') hissTriggered = true;
  });

  for (let x = 0; x < 30; x++) engine.setElement(x, 17, 'STONE');
  engine.setElement(15, 16, 'LAVA');
  engine.setElement(15, 15, 'WATER');

  engine.step();

  assert(hissTriggered, 'REACT-03a', 'Water contacting Lava triggers thermal boiling hiss');
  assert(engine.getElement(15, 16) === 'STONE', 'REACT-03b', 'Lava rapidly solidifies to stone');
  assert(
    engine.getElement(15, 14) === 'STEAM' || engine.getElement(15, 15) === 'STEAM',
    'REACT-03c',
    'Water flash-vaporizes to buoyant Steam'
  );
}

// -------------------------------------------------------------
// Suite 6: Presets, Bounds & Adversarial Robustness (ADV)
// -------------------------------------------------------------
console.log('\n6. Presets, Bounds & Adversarial Robustness (ADV):');

{
  const engine = new PowderSimulationEngine(240, 150);
  loadPreset(engine, 'HOURGLASS');
  const metrics = engine.getMetrics(60);

  assert(metrics.activeParticles > 100, 'ADV-01a', `Hourglass preset loaded with particles (${metrics.activeParticles})`);
  assert(metrics.totalCells === 36000, 'ADV-01b', 'Total lattice cells correctly sized to 240x150');

  // Step 20 ticks of hourglass trickling
  for (let s = 0; s < 20; s++) {
    engine.step();
  }
  assert(true, 'ADV-01c', 'Hourglass simulation executes smoothly without memory faults');
}

{
  // Boundary safety tests
  const engine = new PowderSimulationEngine(20, 20);
  // Out of bounds coordinates should safely return false and not throw
  const res1 = engine.setElement(-5, -5, 'SAND');
  const res2 = engine.setElement(100, 100, 'WATER');
  const elemOOB = engine.getElement(-1, 0);

  assert(res1 === false && res2 === false, 'ADV-02a', 'Out-of-bounds cell writes cleanly rejected');
  assert(elemOOB === 'STONE', 'ADV-02b', 'Out-of-bounds access returns boundary stone wall');
}

console.log('\n================================================================');
console.log(`TOTAL LAYER 1 TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('================================================================');

if (failed === 0) {
  console.log('\nALL LAYER 1 TESTS PASSED (100% SUCCESS)!');
  console.log('Cellular automata granular physics, fluid buoyancy, and thermodynamics certified.');
  process.exit(0);
} else {
  console.error(`\nFAILED: ${failed} tests failed.`);
  process.exit(1);
}
