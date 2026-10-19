import {
  DietType,
  EcosystemParams,
  EcosystemTelemetry,
  EnvironmentalZone,
  Genome,
  Nutrient,
  Organism,
} from '../types';

export const DEFAULT_ECOSYSTEM_PARAMS: EcosystemParams = {
  ambientLight: 0.8,
  radiationLevel: 1.0,
  nutrientRegenRate: 1.2,
  fluidViscosity: 0.93,
  maxOrganisms: 140,
};

// Generates initial random weights for the 82-parameter neural network
export function generateRandomWeights(): number[] {
  // 8 inputs -> 6 hidden (48 weights + 6 biases) + 6 hidden -> 4 outputs (24 weights + 4 biases) = 82
  const weights: number[] = [];
  for (let i = 0; i < 82; i++) {
    // Xavier / Glorot uniform initialization
    weights.push((Math.random() * 2 - 1) * 0.85);
  }
  return weights;
}

export function createDefaultGenome(
  speciesName: string,
  diet: DietType,
  hue: number,
  generation = 1
): Genome {
  return {
    id: `gen-${Math.random().toString(36).substring(2, 9)}`,
    speciesName,
    generation,
    hue,
    size: diet === 'CARNIVORE' ? 14 : diet === 'PHOTOTROPH' ? 9 : 11,
    maxSpeed: diet === 'CARNIVORE' ? 160 : diet === 'HERBIVORE' ? 130 : 80,
    flagellaCount: diet === 'CARNIVORE' ? 4 : diet === 'PHOTOTROPH' ? 1 : 2,
    sensorRange: diet === 'CARNIVORE' ? 190 : 130,
    sensorFov: diet === 'CARNIVORE' ? 2.4 : 3.0,
    diet,
    metabolicEfficiency: 1.0,
    toxinResistance: 0.2,
    mitosisEnergy: diet === 'CARNIVORE' ? 180 : 120,
    mutationRate: 0.08,
    brainWeights: generateRandomWeights(),
  };
}

export class EcosystemEngine {
  public width: number;
  public height: number;
  public params: EcosystemParams;
  public organisms: Organism[] = [];
  public nutrients: Nutrient[] = [];
  public zones: EnvironmentalZone[] = [];

  private nextNutrientId = 1;
  private nextOrganismId = 1;
  private nutrientSpawnTimer = 0;
  private gridCellSize = 64;
  private spatialGrid: Map<number, Organism[]> = new Map();

  // Telemetry tracking
  public peakGeneration = 1;
  public totalBirths = 0;
  public totalDeaths = 0;
  public totalFeeds = 0;
  private fpsTracker: number[] = [];
  private lastTime = performance.now();

  constructor(width = 1000, height = 700) {
    this.width = width;
    this.height = height;
    this.params = { ...DEFAULT_ECOSYSTEM_PARAMS };
    this.initDefaultEcosystem();
  }

  public setDimensions(w: number, h: number) {
    this.width = Math.max(400, w);
    this.height = Math.max(300, h);
  }

  public initDefaultEcosystem() {
    this.organisms = [];
    this.nutrients = [];
    this.zones = [];
    this.peakGeneration = 1;
    this.totalBirths = 0;
    this.totalDeaths = 0;

    // Environmental zones
    this.zones = [
      {
        id: 'zone-vent-1',
        type: 'NUTRIENT_VENT',
        x: this.width * 0.25,
        y: this.height * 0.35,
        radius: 90,
        intensity: 1.5,
      },
      {
        id: 'zone-rad-1',
        type: 'RADIATION_HOTSPOT',
        x: this.width * 0.78,
        y: this.height * 0.72,
        radius: 110,
        intensity: 2.5,
      },
      {
        id: 'zone-tox-1',
        type: 'TOXIN_POLLUTION',
        x: this.width * 0.8,
        y: this.height * 0.25,
        radius: 80,
        intensity: 1.2,
      },
    ];

    // Seed nutrients
    for (let i = 0; i < 90; i++) {
      this.spawnNutrient(
        Math.random() * (this.width - 60) + 30,
        Math.random() * (this.height - 60) + 30,
        'PLANT'
      );
    }

    // Seed 3 baseline species: Phototroph (Cyan), Herbivore (Emerald), Carnivore (Crimson)
    for (let i = 0; i < 18; i++) {
      const g = createDefaultGenome('Cyanobacteria', 'PHOTOTROPH', 175);
      this.spawnOrganism(g, Math.random() * this.width, Math.random() * this.height);
    }
    for (let i = 0; i < 16; i++) {
      const g = createDefaultGenome('Paramecium Verde', 'HERBIVORE', 135);
      this.spawnOrganism(g, Math.random() * this.width, Math.random() * this.height);
    }
    for (let i = 0; i < 6; i++) {
      const g = createDefaultGenome('Didinium Raptor', 'CARNIVORE', 5);
      this.spawnOrganism(g, Math.random() * this.width, Math.random() * this.height);
    }
  }

  public loadPreset(name: string) {
    if (name === 'primordial-soup') {
      this.params = {
        ...DEFAULT_ECOSYSTEM_PARAMS,
        ambientLight: 0.9,
        radiationLevel: 0.8,
        nutrientRegenRate: 1.8,
      };
      this.initDefaultEcosystem();
    } else if (name === 'red-queen') {
      this.params = {
        ...DEFAULT_ECOSYSTEM_PARAMS,
        ambientLight: 0.7,
        radiationLevel: 1.5,
        nutrientRegenRate: 1.0,
      };
      this.organisms = [];
      this.nutrients = [];
      for (let i = 0; i < 70; i++) {
        this.spawnNutrient(Math.random() * this.width, Math.random() * this.height, 'PLANT');
      }
      for (let i = 0; i < 22; i++) {
        const g = createDefaultGenome('Swift Grazer', 'HERBIVORE', 140);
        g.maxSpeed = 160;
        this.spawnOrganism(g, Math.random() * this.width, Math.random() * this.height);
      }
      for (let i = 0; i < 12; i++) {
        const g = createDefaultGenome('Apex Stalker', 'CARNIVORE', 355);
        g.maxSpeed = 190;
        g.sensorRange = 240;
        this.spawnOrganism(g, Math.random() * this.width, Math.random() * this.height);
      }
    } else if (name === 'extremophiles') {
      this.params = {
        ...DEFAULT_ECOSYSTEM_PARAMS,
        ambientLight: 0.3,
        radiationLevel: 3.5,
        nutrientRegenRate: 0.7,
      };
      this.organisms = [];
      this.nutrients = [];
      for (let i = 0; i < 40; i++) {
        this.spawnNutrient(Math.random() * this.width, Math.random() * this.height, 'PLANT');
      }
      for (let i = 0; i < 15; i++) {
        const g = createDefaultGenome('Radiotrophic Slime', 'PHOTOTROPH', 280);
        g.toxinResistance = 0.9;
        g.mutationRate = 0.18;
        this.spawnOrganism(g, Math.random() * this.width, Math.random() * this.height);
      }
      for (let i = 0; i < 15; i++) {
        const g = createDefaultGenome('Scavenger Amoeba', 'OMNIVORE', 45);
        g.toxinResistance = 0.8;
        this.spawnOrganism(g, Math.random() * this.width, Math.random() * this.height);
      }
    }
  }

  public spawnOrganism(genome: Genome, x: number, y: number): Organism {
    const id = `org-${this.nextOrganismId++}`;
    const organism: Organism = {
      id,
      genome,
      x: Math.max(20, Math.min(this.width - 20, x)),
      y: Math.max(20, Math.min(this.height - 20, y)),
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20,
      angle: Math.random() * Math.PI * 2,
      energy: genome.mitosisEnergy * 0.65,
      maxEnergy: genome.mitosisEnergy * 1.5,
      health: 100,
      age: 0,
      generation: genome.generation,
      kills: 0,
      offspringCount: 0,
      flagellaPhases: Array.from({ length: genome.flagellaCount }, () => Math.random() * Math.PI * 2),
      membraneWobble: 0,
      brainActivations: {
        inputs: new Array(8).fill(0),
        hidden: new Array(6).fill(0),
        outputs: new Array(4).fill(0),
      },
    };

    this.organisms.push(organism);
    this.totalBirths++;
    if (genome.generation > this.peakGeneration) {
      this.peakGeneration = genome.generation;
    }
    return organism;
  }

  public spawnNutrient(x: number, y: number, type: 'PLANT' | 'MEAT'): Nutrient | null {
    if (this.nutrients.length >= 350) return null;
    const nutrient: Nutrient = {
      id: this.nextNutrientId++,
      x: Math.max(10, Math.min(this.width - 10, x)),
      y: Math.max(10, Math.min(this.height - 10, y)),
      radius: type === 'PLANT' ? 3.5 : 5.5,
      energyValue: type === 'PLANT' ? 24 : 45,
      age: 0,
      type,
    };
    this.nutrients.push(nutrient);
    return nutrient;
  }

  private getGridKey(cx: number, cy: number): number {
    return ((cx + 1000) << 16) | ((cy + 1000) & 0xffff);
  }

  // Fast spatial partitioning grid builder
  private buildSpatialGrid() {
    this.spatialGrid.clear();
    const cellSize = this.gridCellSize;
    for (let i = 0; i < this.organisms.length; i++) {
      const org = this.organisms[i];
      const cx = Math.floor(org.x / cellSize);
      const cy = Math.floor(org.y / cellSize);
      const key = this.getGridKey(cx, cy);
      let cell = this.spatialGrid.get(key);
      if (!cell) {
        cell = [];
        this.spatialGrid.set(key, cell);
      }
      cell.push(org);
    }
  }

  private getNearbyOrganisms(x: number, y: number, radius: number): Organism[] {
    const cellSize = this.gridCellSize;
    const minCx = Math.floor((x - radius) / cellSize);
    const maxCx = Math.floor((x + radius) / cellSize);
    const minCy = Math.floor((y - radius) / cellSize);
    const maxCy = Math.floor((y + radius) / cellSize);

    const r2 = radius * radius;
    const results: Organism[] = [];

    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cy = minCy; cy <= maxCy; cy++) {
        const cell = this.spatialGrid.get(this.getGridKey(cx, cy));
        if (!cell) continue;
        for (let i = 0; i < cell.length; i++) {
          const o = cell[i];
          const dx = o.x - x;
          const dy = o.y - y;
          if (dx * dx + dy * dy <= r2) {
            results.push(o);
          }
        }
      }
    }
    return results;
  }

  // Neural network forward propagation
  private evaluateBrain(org: Organism, inputs: number[]): number[] {
    const w = org.genome.brainWeights;
    const hidden = new Array(6);

    // Hidden layer: 8 inputs * 6 neurons + 6 biases = 54 weights
    let wIdx = 0;
    for (let j = 0; j < 6; j++) {
      let sum = 0;
      for (let i = 0; i < 8; i++) {
        sum += inputs[i] * w[wIdx++];
      }
      sum += w[wIdx++]; // Bias
      hidden[j] = Math.tanh(sum);
    }

    // Output layer: 6 hidden * 4 outputs + 4 biases = 28 weights
    const outputs = new Array(4);
    for (let k = 0; k < 4; k++) {
      let sum = 0;
      for (let j = 0; j < 6; j++) {
        sum += hidden[j] * w[wIdx++];
      }
      sum += w[wIdx++]; // Bias

      if (k === 1) {
        // Steering torque output in [-1, 1]
        outputs[k] = Math.tanh(sum);
      } else {
        // Thrust, bioluminescence, bite output in [0, 1] (sigmoid)
        outputs[k] = 1 / (1 + Math.exp(-sum));
      }
    }

    org.brainActivations = {
      inputs,
      hidden,
      outputs,
    };

    return outputs;
  }

  // Genome mutation operator
  public mutateGenome(parentGenome: Genome, radiationMultiplier = 1.0): Genome {
    const rate = Math.min(0.6, parentGenome.mutationRate * radiationMultiplier);
    const weights = [...parentGenome.brainWeights];

    // Mutate subset of weights with Gaussian noise
    for (let i = 0; i < weights.length; i++) {
      if (Math.random() < rate) {
        weights[i] += (Math.random() * 2 - 1) * 0.35;
        // Clamp weights to prevent unbounded growth
        weights[i] = Math.max(-3.0, Math.min(3.0, weights[i]));
      }
    }

    // Physical trait drift
    let hue = parentGenome.hue;
    if (Math.random() < rate) {
      hue = (hue + (Math.random() * 28 - 14) + 360) % 360;
    }

    let size = parentGenome.size;
    if (Math.random() < rate) {
      size = Math.max(6, Math.min(22, size + (Math.random() * 2 - 1) * 1.5));
    }

    let maxSpeed = parentGenome.maxSpeed;
    if (Math.random() < rate) {
      maxSpeed = Math.max(50, Math.min(230, maxSpeed + (Math.random() * 2 - 1) * 15));
    }

    let sensorRange = parentGenome.sensorRange;
    if (Math.random() < rate) {
      sensorRange = Math.max(50, Math.min(280, sensorRange + (Math.random() * 2 - 1) * 20));
    }

    let flagellaCount = parentGenome.flagellaCount;
    if (Math.random() < rate * 0.4) {
      flagellaCount = Math.max(1, Math.min(6, flagellaCount + (Math.random() > 0.5 ? 1 : -1)));
    }

    let toxinResistance = parentGenome.toxinResistance;
    if (Math.random() < rate) {
      toxinResistance = Math.max(0, Math.min(1.0, toxinResistance + (Math.random() * 0.2 - 0.1)));
    }

    return {
      id: `gen-${Math.random().toString(36).substring(2, 9)}`,
      speciesName: parentGenome.speciesName,
      generation: parentGenome.generation + 1,
      hue,
      size,
      maxSpeed,
      flagellaCount,
      sensorRange,
      sensorFov: parentGenome.sensorFov,
      diet: parentGenome.diet,
      metabolicEfficiency: Math.max(0.6, Math.min(1.8, parentGenome.metabolicEfficiency + (Math.random() * 0.1 - 0.05))),
      toxinResistance,
      mitosisEnergy: parentGenome.mitosisEnergy,
      mutationRate: Math.max(0.02, Math.min(0.25, parentGenome.mutationRate + (Math.random() * 0.02 - 0.01))),
      brainWeights: weights,
    };
  }

  // Master physics, evolution, and metabolism step
  public update(dt: number): EcosystemTelemetry {
    // Bound delta time to prevent leapfrog divergence
    const dtClamped = Math.min(0.06, Math.max(0.001, dt));

    this.buildSpatialGrid();

    // 1. NUTRIENT REGENERATION & VENT DISCHARGE
    this.nutrientSpawnTimer += dtClamped;
    const targetNutrientCount = Math.floor(100 * this.params.nutrientRegenRate);

    if (this.nutrients.length < targetNutrientCount && this.nutrientSpawnTimer > 0.25) {
      this.nutrientSpawnTimer = 0;
      // Chance to spawn from nutrient vent or ambient phototrophic bloom
      const vent = this.zones.find((z) => z.type === 'NUTRIENT_VENT');
      if (vent && Math.random() < 0.6) {
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.random() * vent.radius;
        this.spawnNutrient(vent.x + Math.cos(ang) * dist, vent.y + Math.sin(ang) * dist, 'PLANT');
      } else {
        this.spawnNutrient(
          Math.random() * (this.width - 40) + 20,
          Math.random() * (this.height - 40) + 20,
          'PLANT'
        );
      }
    }

    // Age existing nutrients & decompose expired meat chunks (35s)
    this.nutrients = this.nutrients.filter((n) => {
      n.age += dtClamped;
      if (n.type === 'MEAT' && n.age > 35) return false;
      return true;
    });

    // 2. SIMULATE ORGANISMS
    const newOffspring: Organism[] = [];
    const deadOrganismIds = new Set<string>();
    const eatenNutrientIds = new Set<number>();

    for (let i = 0; i < this.organisms.length; i++) {
      const org = this.organisms[i];
      if (deadOrganismIds.has(org.id)) continue;
      org.age += dtClamped;
      org.membraneWobble += dtClamped * 4.0;

      // Check environmental zone interactions
      let inRadiationZone = false;
      let inToxinZone = false;
      for (const zone of this.zones) {
        const dx = org.x - zone.x;
        const dy = org.y - zone.y;
        if (dx * dx + dy * dy <= zone.radius * zone.radius) {
          if (zone.type === 'RADIATION_HOTSPOT') {
            inRadiationZone = true;
          } else if (zone.type === 'TOXIN_POLLUTION') {
            inToxinZone = true;
          }
        }
      }

      if (inToxinZone && org.genome.toxinResistance < 0.7) {
        const dmg = (0.7 - org.genome.toxinResistance) * 20 * dtClamped;
        org.health -= dmg;
      }

      // Sensory perception: scan for closest food, predator, and mate
      const sRange = org.genome.sensorRange;
      const nearby = this.getNearbyOrganisms(org.x, org.y, sRange);

      let closestFoodDist = 9999;
      let closestFoodAngle = 0;
      let closestPredDist = 9999;
      let closestPredAngle = 0;
      let closestMateDist = 9999;
      let closestMateAngle = 0;

      // Scan edible nutrients (for Herbivores and Omnivores)
      if (org.genome.diet !== 'PHOTOTROPH') {
        for (let nIdx = 0; nIdx < this.nutrients.length; nIdx++) {
          const nut = this.nutrients[nIdx];
          const ndx = nut.x - org.x;
          const ndy = nut.y - org.y;
          const dist = Math.sqrt(ndx * ndx + ndy * ndy);

          if (dist < sRange) {
            // Edibility check
            const isEdible =
              org.genome.diet === 'OMNIVORE' ||
              (org.genome.diet === 'HERBIVORE' && nut.type === 'PLANT') ||
              (org.genome.diet === 'CARNIVORE' && nut.type === 'MEAT');

            if (isEdible && dist < closestFoodDist) {
              closestFoodDist = dist;
              const globalAng = Math.atan2(ndy, ndx);
              let relAng = globalAng - org.angle;
              while (relAng > Math.PI) relAng -= Math.PI * 2;
              while (relAng < -Math.PI) relAng += Math.PI * 2;
              closestFoodAngle = relAng / Math.PI; // Normalized to [-1, 1]
            }
          }
        }
      }

      // Scan nearby organisms for predators, prey, or mates
      for (let j = 0; j < nearby.length; j++) {
        const other = nearby[j];
        if (other.id === org.id) continue;

        const odx = other.x - org.x;
        const ody = other.y - org.y;
        const dist = Math.sqrt(odx * odx + ody * ody);
        const globalAng = Math.atan2(ody, odx);
        let relAng = globalAng - org.angle;
        while (relAng > Math.PI) relAng -= Math.PI * 2;
        while (relAng < -Math.PI) relAng += Math.PI * 2;
        const normAng = relAng / Math.PI;

        // Predator identification
        const isDangerous =
          (other.genome.diet === 'CARNIVORE' || other.genome.diet === 'OMNIVORE') &&
          other.genome.size > org.genome.size * 0.9;
        if (isDangerous && dist < closestPredDist) {
          closestPredDist = dist;
          closestPredAngle = normAng;
        }

        // Carnivore prey identification
        if (org.genome.diet === 'CARNIVORE' || org.genome.diet === 'OMNIVORE') {
          const isPrey = other.genome.speciesName !== org.genome.speciesName && other.genome.size <= org.genome.size * 1.25;
          if (isPrey && dist < closestFoodDist) {
            closestFoodDist = dist;
            closestFoodAngle = normAng;
          }
        }

        // Same-species mate identification
        if (
          other.genome.speciesName === org.genome.speciesName &&
          other.energy >= other.genome.mitosisEnergy * 0.7 &&
          dist < closestMateDist
        ) {
          closestMateDist = dist;
          closestMateAngle = normAng;
        }
      }

      // Build 8-input sensory vector
      const brainInputs = [
        closestFoodDist < sRange ? 1 - closestFoodDist / sRange : 0,
        closestFoodAngle,
        closestPredDist < sRange ? 1 - closestPredDist / sRange : 0,
        closestPredAngle,
        closestMateDist < sRange ? 1 - closestMateDist / sRange : 0,
        closestMateAngle,
        Math.min(1.0, org.energy / org.maxEnergy),
        org.health / 100,
      ];

      // Run neural inference
      const brainOutputs = this.evaluateBrain(org, brainInputs);
      const thrustVal = brainOutputs[0]; // [0, 1]
      const torqueVal = brainOutputs[1]; // [-1, 1]
      const biteVal = brainOutputs[3]; // [0, 1]

      // Apply torque to steering angle
      org.angle += torqueVal * 4.2 * dtClamped;
      while (org.angle > Math.PI * 2) org.angle -= Math.PI * 2;
      while (org.angle < 0) org.angle += Math.PI * 2;

      // Apply thrust to velocity
      const thrustAccel = thrustVal * org.genome.maxSpeed * (1 - org.genome.size / 45);
      org.vx += Math.cos(org.angle) * thrustAccel * dtClamped;
      org.vy += Math.sin(org.angle) * thrustAccel * dtClamped;

      // Fluid drag friction
      org.vx *= this.params.fluidViscosity;
      org.vy *= this.params.fluidViscosity;

      // Position update
      org.x += org.vx * dtClamped;
      org.y += org.vy * dtClamped;

      // Circular Petri dish or boundary repulsion
      const margin = org.genome.size + 4;
      if (org.x < margin) {
        org.x = margin;
        org.vx *= -0.5;
      } else if (org.x > this.width - margin) {
        org.x = this.width - margin;
        org.vx *= -0.5;
      }
      if (org.y < margin) {
        org.y = margin;
        org.vy *= -0.5;
      } else if (org.y > this.height - margin) {
        org.y = this.height - margin;
        org.vy *= -0.5;
      }

      // Animate flagella wave phases based on current thrust
      const waveSpeed = (0.5 + thrustVal * 3.0) * 16.0;
      for (let f = 0; f < org.flagellaPhases.length; f++) {
        org.flagellaPhases[f] += waveSpeed * dtClamped;
      }

      // METABOLISM & ENERGY CONSUMPTION
      const basalCost =
        (0.6 +
          0.04 * org.genome.size +
          0.08 * org.genome.flagellaCount +
          0.03 * (org.genome.sensorRange / 50)) /
        org.genome.metabolicEfficiency;
      const motionCost = (thrustVal * 1.6 + Math.abs(torqueVal) * 0.4);
      org.energy -= (basalCost + motionCost) * dtClamped;

      // Phototroph photosynthesis
      if (org.genome.diet === 'PHOTOTROPH') {
        const photoGain = this.params.ambientLight * 3.8 * (org.genome.size / 10);
        org.energy = Math.min(org.maxEnergy, org.energy + photoGain * dtClamped);
      }

      // PHYSICAL FEEDING & EATING INTERACTIONS
      // 1. Consume floating nutrients
      if (org.genome.diet !== 'PHOTOTROPH') {
        for (let n = 0; n < this.nutrients.length; n++) {
          const nut = this.nutrients[n];
          if (eatenNutrientIds.has(nut.id)) continue;

          const dx = nut.x - org.x;
          const dy = nut.y - org.y;
          const hitDist = org.genome.size + nut.radius;
          if (dx * dx + dy * dy <= hitDist * hitDist) {
            const canEat =
              org.genome.diet === 'OMNIVORE' ||
              (org.genome.diet === 'HERBIVORE' && nut.type === 'PLANT') ||
              (org.genome.diet === 'CARNIVORE' && nut.type === 'MEAT');

            if (canEat) {
              eatenNutrientIds.add(nut.id);
              this.totalFeeds++;
              const gain = nut.energyValue * org.genome.metabolicEfficiency * (org.genome.diet === 'OMNIVORE' ? 0.75 : 1.0);
              org.energy = Math.min(org.maxEnergy, org.energy + gain);
              org.health = Math.min(100, org.health + 10);
              break;
            }
          }
        }
      }

      // 2. Predation attacks against other organisms
      if ((org.genome.diet === 'CARNIVORE' || org.genome.diet === 'OMNIVORE') && biteVal > 0.35) {
        for (let j = 0; j < nearby.length; j++) {
          const victim = nearby[j];
          if (victim.id === org.id || victim.genome.speciesName === org.genome.speciesName) continue;
          if (deadOrganismIds.has(victim.id)) continue;

          const dx = victim.x - org.x;
          const dy = victim.y - org.y;
          const contactDist = org.genome.size + victim.genome.size + 4;

          if (dx * dx + dy * dy <= contactDist * contactDist) {
            const damage = (38 * (org.genome.size / victim.genome.size) + 10) * dtClamped;
            victim.health -= damage;

            if (victim.health <= 0 && !deadOrganismIds.has(victim.id)) {
              deadOrganismIds.add(victim.id);
              org.kills++;
              org.energy = Math.min(org.maxEnergy, org.energy + 55 * org.genome.metabolicEfficiency);
              // Spawn meat nutrient chunk
              this.spawnNutrient(victim.x, victim.y, 'MEAT');
            }
          }
        }
      }

      // Starvation health loss
      if (org.energy <= 0) {
        org.health -= 25 * dtClamped;
        if (org.health <= 0 && !deadOrganismIds.has(org.id)) {
          deadOrganismIds.add(org.id);
          this.spawnNutrient(org.x, org.y, org.genome.diet === 'PHOTOTROPH' ? 'PLANT' : 'MEAT');
        }
      }

      // MITOSIS & REPRODUCTION
      const canReproduce =
        org.energy >= org.genome.mitosisEnergy &&
        org.health > 50 &&
        org.age > 2.5 &&
        this.organisms.length + newOffspring.length < this.params.maxOrganisms;

      if (canReproduce) {
        org.energy *= 0.5;
        org.offspringCount++;

        const radMult = inRadiationZone ? 3.0 * this.params.radiationLevel : this.params.radiationLevel;
        const daughterGenome = this.mutateGenome(org.genome, radMult);

        const spawnOffsetAngle = Math.random() * Math.PI * 2;
        const spawnDist = org.genome.size * 1.5;
        const daughter = this.spawnOrganism(
          daughterGenome,
          org.x + Math.cos(spawnOffsetAngle) * spawnDist,
          org.y + Math.sin(spawnOffsetAngle) * spawnDist
        );
        newOffspring.push(daughter);
      }
    }

    // Remove eaten nutrients
    if (eatenNutrientIds.size > 0) {
      this.nutrients = this.nutrients.filter((n) => !eatenNutrientIds.has(n.id));
    }

    // Remove dead organisms
    if (deadOrganismIds.size > 0) {
      this.totalDeaths += deadOrganismIds.size;
      this.organisms = this.organisms.filter((o) => !deadOrganismIds.has(o.id));
    }

    // Add new offspring
    if (newOffspring.length > 0) {
      for (const child of newOffspring) {
        this.organisms.push(child);
      }
    }

    // Telemetry computation
    return this.calculateTelemetry();
  }

  // Calculate live ecological telemetry
  public calculateTelemetry(): EcosystemTelemetry {
    let herbivores = 0;
    let carnivores = 0;
    let phototrophs = 0;
    let omnivores = 0;
    let totalAge = 0;
    const speciesCounts: { [species: string]: number } = {};

    for (let i = 0; i < this.organisms.length; i++) {
      const o = this.organisms[i];
      totalAge += o.age;
      speciesCounts[o.genome.speciesName] = (speciesCounts[o.genome.speciesName] || 0) + 1;

      switch (o.genome.diet) {
        case 'HERBIVORE':
          herbivores++;
          break;
        case 'CARNIVORE':
          carnivores++;
          break;
        case 'PHOTOTROPH':
          phototrophs++;
          break;
        case 'OMNIVORE':
          omnivores++;
          break;
      }
    }

    // Shannon Diversity Index: H = - sum(p_i * ln(p_i))
    let shannon = 0;
    const total = this.organisms.length;
    if (total > 0) {
      for (const s in speciesCounts) {
        const p = speciesCounts[s] / total;
        if (p > 0) {
          shannon -= p * Math.log(p);
        }
      }
    }

    // FPS calculation
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    const currentFps = dt > 0 ? Math.min(60, Math.round(1 / dt)) : 60;
    this.fpsTracker.push(currentFps);
    if (this.fpsTracker.length > 15) this.fpsTracker.shift();
    const avgFps = Math.round(
      this.fpsTracker.reduce((a, b) => a + b, 0) / this.fpsTracker.length
    );

    return {
      totalOrganisms: total,
      herbivoreCount: herbivores,
      carnivoreCount: carnivores,
      phototrophCount: phototrophs,
      omnivoreCount: omnivores,
      totalNutrients: this.nutrients.length,
      avgLifespan: total > 0 ? Math.round((totalAge / total) * 10) / 10 : 0,
      shannonDiversityIndex: Math.round(shannon * 100) / 100,
      peakGeneration: this.peakGeneration,
      fps: avgFps,
    };
  }

  // Interventions
  public addNutrientBloom(x: number, y: number, count = 12) {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = Math.random() * 45;
      this.spawnNutrient(x + Math.cos(ang) * r, y + Math.sin(ang) * r, 'PLANT');
    }
  }

  public applyRadiationBeam(x: number, y: number, radius = 70) {
    const affected = this.getNearbyOrganisms(x, y, radius);
    for (const org of affected) {
      // Induce structural mutation in place
      org.genome = this.mutateGenome(org.genome, 5.0);
    }
  }

  public exterminateAt(x: number, y: number, radius = 50) {
    const r2 = radius * radius;
    this.organisms = this.organisms.filter((o) => {
      const dx = o.x - x;
      const dy = o.y - y;
      return dx * dx + dy * dy > r2;
    });
    this.nutrients = this.nutrients.filter((n) => {
      const dx = n.x - x;
      const dy = n.y - y;
      return dx * dx + dy * dy > r2;
    });
  }

  public findOrganismAt(x: number, y: number): Organism | null {
    for (let i = this.organisms.length - 1; i >= 0; i--) {
      const o = this.organisms[i];
      const dx = o.x - x;
      const dy = o.y - y;
      if (dx * dx + dy * dy <= (o.genome.size + 10) * (o.genome.size + 10)) {
        return o;
      }
    }
    return null;
  }
}
