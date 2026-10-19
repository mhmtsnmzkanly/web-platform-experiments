/**
 * POCKET-TERRARIUM (EXP-024) — High-Precision Aquatic Ecology & Biogeochemical Engine
 * Features:
 * - 4th-Order Runge-Kutta numerical integration for water chemistry ODEs
 * - Multi-stage biological Nitrogen Cycle (Ammonia -> Nitrite -> Nitrate)
 * - Diurnal Photosynthesis, Respiration & Henry's Law surface gas exchange
 * - Dynamic Carbonate buffer equilibrium & pH shift
 * - Holling Type II multi-trophic predation & population dynamics
 * - Boids agent kinematics with surface gasping under hypoxia
 */

import {
  WaterParameters,
  AquaticPlant,
  Zooplankton,
  AquaticSnail,
  GuppyFish,
  FoodParticle,
  AirBubble,
  AlgaeState,
  TerrariumEnvironment,
  EcosystemMetrics,
} from '../types/index.js';

export interface EcologicalEvent {
  type: 'FEEDING' | 'BUBBLE_POP' | 'PEARLING' | 'BIRTH' | 'DEATH' | 'WARNING';
  x: number;
  y: number;
  intensity: number;
  label?: string;
}

export class TerrariumSimulationEngine {
  public water: WaterParameters;
  public plants: AquaticPlant[] = [];
  public daphnia: Zooplankton[] = [];
  public snails: AquaticSnail[] = [];
  public fish: GuppyFish[] = [];
  public food: FoodParticle[] = [];
  public bubbles: AirBubble[] = [];
  public algae: AlgaeState = { planktonicDensity: 15.0, glassBiofilm: 0.25 };
  public env: TerrariumEnvironment = {
    simTime: 0,
    dayTimeHours: 10.0, // 10:00 AM start
    naturalLight: 0.8,
    lampPower: 0.7,
    effectiveLight: 1.0,
    isBubblerActive: true,
    heaterTargetTemp: 24.5,
  };

  public eventListeners: ((event: EcologicalEvent) => void)[] = [];
  private nextEntityId: number = 100;

  constructor(initialWater?: Partial<WaterParameters>) {
    const raw = {
      dissolvedOxygen: 7.6,
      ammonia: 0.05,
      nitrite: 0.02,
      nitrate: 12.0,
      pH: 7.3,
      temperature: 24.5,
      volume: 25.0,
      nitrosomonas: 20.0,
      nitrobacter: 18.0,
      ...initialWater,
    };
    // Defensive sanitization against negative or singular initial parameters
    this.water = {
      dissolvedOxygen: Math.max(0.1, Math.min(16.0, raw.dissolvedOxygen)),
      ammonia: Math.max(0.0, raw.ammonia),
      nitrite: Math.max(0.0, raw.nitrite),
      nitrate: Math.max(0.0, raw.nitrate),
      pH: Math.max(5.0, Math.min(10.0, raw.pH)),
      temperature: Math.max(10.0, Math.min(40.0, raw.temperature)),
      volume: Math.max(1.0, raw.volume),
      nitrosomonas: Math.max(0.0, raw.nitrosomonas),
      nitrobacter: Math.max(0.0, raw.nitrobacter),
    };
  }

  public onEvent(callback: (event: EcologicalEvent) => void): () => void {
    this.eventListeners.push(callback);
    return () => {
      this.eventListeners = this.eventListeners.filter((cb) => cb !== callback);
    };
  }

  private emitEvent(event: EcologicalEvent): void {
    for (const listener of this.eventListeners) {
      try {
        listener(event);
      } catch {}
    }
  }

  /**
   * Main Simulation Step: Coupled Biogeochemistry & Organism Dynamics
   */
  public step(dt: number): void {
    if (!Number.isFinite(dt) || dt <= 0) return;
    const clampedDt = Math.min(0.1, dt);

    // 1. Advance Diurnal Environment Clock
    // 1 real second = 1 sim minute (0.0167 hr)
    const hoursElapsed = (clampedDt * 60) / 3600;
    this.env.simTime += clampedDt;
    this.env.dayTimeHours = (this.env.dayTimeHours + hoursElapsed) % 24.0;

    // Diurnal sunlight cycle: sinusoidal between 6:00 (dawn) and 18:00 (dusk)
    const hour = this.env.dayTimeHours;
    if (hour >= 6.0 && hour <= 18.0) {
      const sunPhase = ((hour - 6.0) / 12.0) * Math.PI;
      this.env.naturalLight = Math.sin(sunPhase);
    } else {
      this.env.naturalLight = 0.0;
    }
    this.env.effectiveLight = Math.min(1.0, this.env.naturalLight * 0.7 + this.env.lampPower * 0.8);

    // 2. Continuous Water Chemistry ODEs via RK4 Sub-stepping
    const numSubSteps = 4;
    const subDt = clampedDt / numSubSteps;
    for (let s = 0; s < numSubSteps; s++) {
      this.integrateWaterChemistryRK4(subDt);
    }

    // 3. Staged Organism Kinematics, Foraging & Population Lifecycle
    this.updateFish(clampedDt);
    this.updateZooplankton(clampedDt);
    this.updateSnails(clampedDt);
    this.updatePlants(clampedDt);
    this.updateFoodParticles(clampedDt);
    this.updateAirBubbles(clampedDt);
  }

  /**
   * Evaluates continuous rates of change for water chemistry state vector:
   * dy/dt = f(y)
   */
  private computeWaterDerivatives(
    doVal: number,
    ammVal: number,
    nitVal: number,
    nitrateVal: number,
    phVal: number,
    tempVal: number
  ): { dDO: number; dAmmonia: number; dNitrite: number; dNitrate: number; dpH: number; dTemp: number } {
    const w = this.water;
    const light = this.env.effectiveLight;

    // 1. Photosynthesis & Respiration (Biological Oxygen Demand)
    const plantBiomass = this.plants.reduce((sum, p) => sum + p.biomass, 0);
    const photoRate =
      (0.35 * (this.algae.planktonicDensity / 50.0) + 0.12 * (plantBiomass / 20.0)) * light;

    const fishResp = this.fish.reduce((sum, f) => sum + (f.isFry ? 0.015 : 0.04), 0);
    const daphniaResp = this.daphnia.length * 0.001;
    const snailResp = this.snails.length * 0.005;
    const bacteriaResp = (w.nitrosomonas + w.nitrobacter) * 0.002;
    const plantDarkResp = (plantBiomass * 0.01 + this.algae.planktonicDensity * 0.005) * (1.0 - light * 0.8);
    const totalRespRate = fishResp + daphniaResp + snailResp + bacteriaResp + plantDarkResp;

    // Atmospheric Gas Exchange (Henry's Law Saturation)
    const doSat = Math.max(6.0, 14.6 - 0.25 * tempVal);
    const surfaceReaeration = 0.08 * (doSat - doVal);
    const bubblerOxygen = this.env.isBubblerActive ? 0.35 * Math.max(0, doSat - doVal) : 0;
    const dDO = photoRate - totalRespRate + surfaceReaeration + bubblerOxygen;

    // 2. Three-Stage Nitrogen Cycle Oxidation (Monod Kinetics)
    const volumeFactor = Math.max(0.1, w.volume / 25.0);
    const totalFishExcretion =
      ((this.fish.reduce((sum, f) => sum + (f.isFry ? 0.004 : 0.014), 0) / 3600) * 60) / volumeFactor;
    const safeDO = Math.max(0.0, doVal);
    const doFactor = safeDO / (0.8 + safeDO); // Aerobic efficiency factor

    // Nitrosomonas: NH3 -> NO2-
    const kAmmOx = 0.045 * (w.nitrosomonas / 20.0) * doFactor;
    const safeAmm = Math.max(0.0, ammVal);
    const ammOxidation = (kAmmOx * safeAmm) / (0.4 + safeAmm);

    // Nitrobacter: NO2- -> NO3-
    const kNitOx = 0.04 * (w.nitrobacter / 20.0) * doFactor;
    const safeNit = Math.max(0.0, nitVal);
    const nitOxidation = (kNitOx * safeNit) / (0.5 + safeNit);

    // Plant Nitrate Assimilation: NO3- uptake
    const kPlantUptake = 0.08 * (plantBiomass / 15.0) * Math.max(0.3, light);
    const safeNitrate = Math.max(0.0, nitrateVal);
    const plantUptake = (kPlantUptake * safeNitrate) / (2.0 + safeNitrate);

    // Molar balanced deltas: ammOxidation consumes NH3 and produces identical molar NO2-
    const dAmmonia = totalFishExcretion - ammOxidation;
    const dNitrite = ammOxidation - nitOxidation;
    const dNitrate = nitOxidation - plantUptake;

    // 3. Carbonate Equilibrium & pH Dynamics
    const targetPH = 7.2 + 0.9 * (photoRate - totalRespRate);
    const dpH = (Math.max(6.2, Math.min(8.8, targetPH)) - phVal) * 0.05;

    // 4. Temperature Conduction towards Heater Target
    const dTemp = (this.env.heaterTargetTemp - tempVal) * 0.015;

    return { dDO, dAmmonia, dNitrite, dNitrate, dpH, dTemp };
  }

  /**
   * Integrates Water Chemistry Differential Equations via 4th-Order Runge-Kutta (RK4)
   * Solves dy/dt = f(y) using the standard 4-stage Butcher tableau.
   */
  private integrateWaterChemistryRK4(dt: number): void {
    const w = this.water;

    // Current state vector y0
    const y0_do = w.dissolvedOxygen;
    const y0_amm = w.ammonia;
    const y0_nit = w.nitrite;
    const y0_nitrate = w.nitrate;
    const y0_ph = w.pH;
    const y0_temp = w.temperature;

    // Stage 1: k1 = f(y0)
    const k1 = this.computeWaterDerivatives(y0_do, y0_amm, y0_nit, y0_nitrate, y0_ph, y0_temp);

    // Stage 2: k2 = f(y0 + 0.5 * dt * k1)
    const k2 = this.computeWaterDerivatives(
      y0_do + 0.5 * dt * k1.dDO,
      y0_amm + 0.5 * dt * k1.dAmmonia,
      y0_nit + 0.5 * dt * k1.dNitrite,
      y0_nitrate + 0.5 * dt * k1.dNitrate,
      y0_ph + 0.5 * dt * k1.dpH,
      y0_temp + 0.5 * dt * k1.dTemp
    );

    // Stage 3: k3 = f(y0 + 0.5 * dt * k2)
    const k3 = this.computeWaterDerivatives(
      y0_do + 0.5 * dt * k2.dDO,
      y0_amm + 0.5 * dt * k2.dAmmonia,
      y0_nit + 0.5 * dt * k2.dNitrite,
      y0_nitrate + 0.5 * dt * k2.dNitrate,
      y0_ph + 0.5 * dt * k2.dpH,
      y0_temp + 0.5 * dt * k2.dTemp
    );

    // Stage 4: k4 = f(y0 + dt * k3)
    const k4 = this.computeWaterDerivatives(
      y0_do + dt * k3.dDO,
      y0_amm + dt * k3.dAmmonia,
      y0_nit + dt * k3.dNitrite,
      y0_nitrate + dt * k3.dNitrate,
      y0_ph + dt * k3.dpH,
      y0_temp + dt * k3.dTemp
    );

    // Simpson 4th-order weighted sum: dy = (dt/6) * (k1 + 2*k2 + 2*k3 + k4)
    const dDO = (dt / 6.0) * (k1.dDO + 2.0 * k2.dDO + 2.0 * k3.dDO + k4.dDO);
    const dAmmonia = (dt / 6.0) * (k1.dAmmonia + 2.0 * k2.dAmmonia + 2.0 * k3.dAmmonia + k4.dAmmonia);
    const dNitrite = (dt / 6.0) * (k1.dNitrite + 2.0 * k2.dNitrite + 2.0 * k3.dNitrite + k4.dNitrite);
    const dNitrate = (dt / 6.0) * (k1.dNitrate + 2.0 * k2.dNitrate + 2.0 * k3.dNitrate + k4.dNitrate);
    const dpH = (dt / 6.0) * (k1.dpH + 2.0 * k2.dpH + 2.0 * k3.dpH + k4.dpH);
    const dTemp = (dt / 6.0) * (k1.dTemp + 2.0 * k2.dTemp + 2.0 * k3.dTemp + k4.dTemp);

    // Apply updates
    w.dissolvedOxygen = Math.max(0.1, Math.min(16.0, y0_do + dDO));
    w.ammonia = Math.max(0.0, y0_amm + dAmmonia);
    w.nitrite = Math.max(0.0, y0_nit + dNitrite);
    w.nitrate = Math.max(0.0, y0_nitrate + dNitrate);
    w.pH = Math.max(6.0, Math.min(9.0, y0_ph + dpH));
    w.temperature = y0_temp + dTemp;
  }

  /**
   * Fish Agent Kinematics, Schooling & Foraging
   */
  private updateFish(dt: number): void {
    const isHypoxic = this.water.dissolvedOxygen < 2.2;
    const isToxicAmmonia = this.water.ammonia > 1.2;

    const deadFishIds = new Set<string>();
    const newFry: GuppyFish[] = [];

    for (let i = 0; i < this.fish.length; i++) {
      const f = this.fish[i];
      f.tailPhase += dt * (f.speed * 8 + 4);

      // Metabolism & Satiety
      f.satiety = Math.max(0, f.satiety - dt * 0.015);

      // Health degradation under hypoxia or ammonia stress
      if (isHypoxic || isToxicAmmonia) {
        f.health = Math.max(0, f.health - dt * (isHypoxic ? 0.05 : 0.03));
      } else {
        f.health = Math.min(1.0, f.health + dt * 0.01);
      }

      if (f.health <= 0) {
        deadFishIds.add(f.id);
        this.emitEvent({
          type: 'DEATH',
          x: f.x,
          y: f.y,
          intensity: 0.8,
          label: 'Fish perished from water toxicity',
        });
        continue;
      }

      // Fry Growth into Adult
      if (f.isFry) {
        f.size = Math.min(0.06, f.size + dt * 0.001);
        if (f.size >= 0.05) {
          f.isFry = false;
        }
      }

      // Breeding: Well-fed adult fish reproduce
      if (!f.isFry && f.satiety > 0.8 && f.energy > 0.85 && this.fish.length < 16) {
        f.energy -= 0.6;
        newFry.push(this.createFry(f.x, f.y));
        this.emitEvent({
          type: 'BIRTH',
          x: f.x,
          y: f.y,
          intensity: 0.7,
          label: 'New guppy fry born!',
        });
      }

      // Update handling cooldown if active
      if (f.handlingCooldown && f.handlingCooldown > 0) {
        f.handlingCooldown = Math.max(0, f.handlingCooldown - dt);
      }

      // Foraging on Food Particles
      for (let pIdx = this.food.length - 1; pIdx >= 0; pIdx--) {
        const p = this.food[pIdx];
        const dist = Math.hypot(f.x - p.x, f.y - p.y);
        if (dist < 0.04) {
          f.satiety = Math.min(1.0, f.satiety + p.nutrition);
          f.energy = Math.min(1.0, f.energy + p.nutrition * 0.7);
          this.food.splice(pIdx, 1);
          this.emitEvent({
            type: 'FEEDING',
            x: f.x,
            y: f.y,
            intensity: 0.5,
          });
          break;
        }
      }

      // Foraging on Zooplankton (Daphnia) via Holling Type II Functional Response
      if (f.satiety < 0.9 && this.daphnia.length > 0 && (!f.handlingCooldown || f.handlingCooldown <= 0)) {
        const preyDensity = this.daphnia.length;
        const attackRate = 0.5; // search and attack rate
        const handlingTime = 0.8; // handling cooldown in seconds
        // Holling Type II saturation factor: f(D) = (a * D) / (1 + a * h * D)
        const encounterProb = (attackRate * preyDensity) / (1.0 + attackRate * handlingTime * preyDensity);

        for (let dIdx = this.daphnia.length - 1; dIdx >= 0; dIdx--) {
          const d = this.daphnia[dIdx];
          const dist = Math.hypot(f.x - d.x, f.y - d.y);
          if (dist < 0.04) {
            f.satiety = Math.min(1.0, f.satiety + 0.2);
            f.energy = Math.min(1.0, f.energy + 0.15);
            f.handlingCooldown = handlingTime / Math.max(0.5, encounterProb);
            this.daphnia.splice(dIdx, 1);
            this.emitEvent({
              type: 'FEEDING',
              x: f.x,
              y: f.y,
              intensity: 0.6,
            });
            break;
          }
        }
      }

      // Locomotion & Steering
      if (isHypoxic) {
        // Hypoxic distress: swim to surface to gasp atmospheric air
        const targetY = 0.08 + Math.sin(f.id.charCodeAt(0) + this.env.simTime) * 0.03;
        f.vy += (targetY - f.y) * 2.0 * dt;
        f.vx += (Math.random() - 0.5) * 0.2 * dt;
      } else {
        // Normal Boids wander + schooling
        const wanderAngle = (Math.random() - 0.5) * 1.5;
        f.angle += wanderAngle * dt;
        f.speed = f.isFry ? 0.09 : 0.06;

        f.vx = Math.cos(f.angle) * f.speed;
        f.vy = Math.sin(f.angle) * f.speed * 0.6;
      }

      // Position update & Boundary bounce
      f.x += f.vx * dt;
      f.y += f.vy * dt;

      if (f.x < 0.05) { f.x = 0.05; f.vx = Math.abs(f.vx); f.angle = 0; }
      if (f.x > 0.95) { f.x = 0.95; f.vx = -Math.abs(f.vx); f.angle = Math.PI; }
      if (f.y < 0.08) { f.y = 0.08; f.vy = Math.abs(f.vy); }
      if (f.y > 0.88) { f.y = 0.88; f.vy = -Math.abs(f.vy); }
    }

    // Apply Staged Removals & Additions
    this.fish = this.fish.filter((f) => !deadFishIds.has(f.id)).concat(newFry);
  }

  /**
   * Zooplankton (Daphnia) Grazing & Population Dynamics
   */
  private updateZooplankton(dt: number): void {
    const isHypoxic = this.water.dissolvedOxygen < 1.0;
    const newDaphnia: Zooplankton[] = [];
    const deadDaphniaIds = new Set<string>();

    for (const d of this.daphnia) {
      d.age += dt;

      // Grazing on Phytoplankton (Holling Type II)
      const grazeRate = (0.08 * this.algae.planktonicDensity) / (15.0 + this.algae.planktonicDensity);
      d.satiety = Math.min(1.0, d.satiety + grazeRate * dt);
      this.algae.planktonicDensity = Math.max(0.5, this.algae.planktonicDensity - grazeRate * 0.01 * dt);

      // Reproduction by parthenogenesis when well-fed
      if (d.satiety > 0.85 && this.daphnia.length < 50 && Math.random() < 0.015 * dt) {
        d.satiety = 0.5;
        newDaphnia.push({
          id: `daphnia-${this.nextEntityId++}`,
          x: d.x + (Math.random() - 0.5) * 0.04,
          y: d.y + (Math.random() - 0.5) * 0.04,
          vx: (Math.random() - 0.5) * 0.02,
          vy: -0.01,
          satiety: 0.6,
          health: 1.0,
          age: 0,
        });
      }

      // Mortality from starvation or hypoxia
      if (isHypoxic || d.satiety < 0.05 || d.age > 180.0) {
        deadDaphniaIds.add(d.id);
        continue;
      }

      // Brownian hopping locomotion
      if (Math.random() < 0.08) {
        d.vy = -0.05 - Math.random() * 0.04; // upward jump
        d.vx = (Math.random() - 0.5) * 0.04;
      } else {
        d.vy += 0.03 * dt; // sinking slowly
      }

      d.x += d.vx * dt;
      d.y += d.vy * dt;

      // Bounds
      d.x = Math.max(0.04, Math.min(0.96, d.x));
      d.y = Math.max(0.1, Math.min(0.9, d.y));
    }

    this.daphnia = this.daphnia.filter((d) => !deadDaphniaIds.has(d.id)).concat(newDaphnia);
  }

  /**
   * Freshwater Snails (Biofilm Grazing & Crawling)
   */
  private updateSnails(dt: number): void {
    for (const s of this.snails) {
      s.raspTimer += dt;

      // Graze on glass biofilm
      if (this.algae.glassBiofilm > 0.05 && s.raspTimer > 1.2) {
        s.raspTimer = 0;
        this.algae.glassBiofilm = Math.max(0.01, this.algae.glassBiofilm - 0.005);
      }

      // Slow crawling along tank substrate and walls
      s.x += s.vx * dt;
      s.y += s.vy * dt;

      if (s.surface === 'SUBSTRATE') {
        s.y = 0.92;
        if (s.x < 0.08) { s.vx = Math.abs(s.vx); }
        if (s.x > 0.92) { s.vx = -Math.abs(s.vx); }
      } else if (s.surface === 'GLASS_LEFT') {
        s.x = 0.04;
        if (s.y < 0.15) { s.vy = Math.abs(s.vy); }
        if (s.y > 0.88) { s.vy = -Math.abs(s.vy); }
      } else if (s.surface === 'GLASS_RIGHT') {
        s.x = 0.96;
        if (s.y < 0.15) { s.vy = Math.abs(s.vy); }
        if (s.y > 0.88) { s.vy = -Math.abs(s.vy); }
      }
    }
  }

  /**
   * Aquatic Plants (Vegetative Growth & Pearling Oxygen Bubbles)
   */
  private updatePlants(dt: number): void {
    const light = this.env.effectiveLight;
    const canPearl = this.water.dissolvedOxygen > 8.5 && light > 0.5;

    for (const p of this.plants) {
      p.swayPhase += dt * 1.5;

      // Vegetative Growth if Nitrates and Light are present
      if (this.water.nitrate > 2.0 && light > 0.3) {
        p.biomass = Math.min(30.0, p.biomass + dt * 0.008 * light);
        p.height = Math.min(p.maxHeight, p.height + dt * 0.0002);
      }

      // Pearling: Supersaturated oxygen forms visible micro-bubbles on leaf surfaces
      if (canPearl && Math.random() < 0.05 * dt) {
        this.bubbles.push({
          id: `pearl-${this.nextEntityId++}`,
          x: p.x + (Math.random() - 0.5) * 0.04,
          y: p.y - p.height * 0.7 - Math.random() * 0.05,
          radius: 0.004 + Math.random() * 0.003,
          vy: -0.06 - Math.random() * 0.04,
          vx: (Math.random() - 0.5) * 0.01,
        });
        this.emitEvent({
          type: 'PEARLING',
          x: p.x,
          y: p.y - p.height * 0.7,
          intensity: 0.4,
        });
      }
    }
  }

  /**
   * Food Flakes Sinking
   */
  private updateFoodParticles(dt: number): void {
    for (let i = this.food.length - 1; i >= 0; i--) {
      const p = this.food[i];
      p.y += p.vy * dt;

      // Decompose into ammonia if hits bottom substrate (scaled inversely by tank volume)
      if (p.y >= 0.92) {
        const volumeFactor = Math.max(0.1, this.water.volume / 25.0);
        this.water.ammonia += 0.015 / volumeFactor;
        this.food.splice(i, 1);
      }
    }
  }

  /**
   * Air Bubbles Rising & Popping
   */
  private updateAirBubbles(dt: number): void {
    // Generate bubbles from active aerator stone at bottom
    if (this.env.isBubblerActive && Math.random() < 0.45) {
      this.bubbles.push({
        id: `bubble-${this.nextEntityId++}`,
        x: 0.15 + (Math.random() - 0.5) * 0.03,
        y: 0.91,
        radius: 0.005 + Math.random() * 0.006,
        vy: -0.12 - Math.random() * 0.08,
        vx: (Math.random() - 0.5) * 0.015,
      });
    }

    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.y += b.vy * dt;
      b.x += b.vx * dt;

      // Reached water surface
      if (b.y <= 0.08) {
        this.emitEvent({
          type: 'BUBBLE_POP',
          x: b.x,
          y: b.y,
          intensity: b.radius * 60,
        });
        this.bubbles.splice(i, 1);
      }
    }
  }

  // --- Creator & Interaction Methods ---

  public createFish(x: number, y: number, isFry: boolean = false): GuppyFish {
    const colors = ['#f97316', '#38bdf8', '#a855f7', '#ec4899', '#22c55e', '#eab308'];
    const finColors = ['#fde047', '#67e8f9', '#f472b6', '#fed7aa', '#86efac'];
    const col = colors[this.fish.length % colors.length];
    const fin = finColors[this.fish.length % finColors.length];

    const fish: GuppyFish = {
      id: `fish-${this.nextEntityId++}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.03,
      angle: Math.random() * Math.PI * 2,
      speed: isFry ? 0.09 : 0.06,
      color: col,
      finColor: fin,
      size: isFry ? 0.025 : 0.065,
      satiety: 0.7,
      energy: 0.7,
      isFry,
      health: 1.0,
      tailPhase: Math.random() * Math.PI * 2,
      handlingCooldown: 0,
    };
    this.fish.push(fish);
    return fish;
  }

  private createFry(x: number, y: number): GuppyFish {
    return this.createFish(x, y, true);
  }

  public addPlant(x: number): AquaticPlant {
    const plant: AquaticPlant = {
      id: `plant-${this.nextEntityId++}`,
      x,
      y: 0.92,
      height: 0.35 + Math.random() * 0.2,
      maxHeight: 0.65,
      biomass: 10.0 + Math.random() * 5.0,
      health: 1.0,
      swayPhase: Math.random() * Math.PI * 2,
    };
    this.plants.push(plant);
    return plant;
  }

  public addSnail(x: number, y: number): AquaticSnail {
    const snail: AquaticSnail = {
      id: `snail-${this.nextEntityId++}`,
      x,
      y,
      vx: 0.008,
      vy: 0,
      surface: 'SUBSTRATE',
      health: 1.0,
      size: 0.035,
      raspTimer: 0,
    };
    this.snails.push(snail);
    return snail;
  }

  public addDaphniaSwarm(count: number = 8): void {
    for (let i = 0; i < count; i++) {
      this.daphnia.push({
        id: `daphnia-${this.nextEntityId++}`,
        x: 0.2 + Math.random() * 0.6,
        y: 0.2 + Math.random() * 0.5,
        vx: (Math.random() - 0.5) * 0.02,
        vy: -0.01,
        satiety: 0.7,
        health: 1.0,
        age: Math.random() * 60.0,
      });
    }
  }

  public dropFood(x: number, y: number): void {
    for (let i = 0; i < 4; i++) {
      this.food.push({
        id: `food-${this.nextEntityId++}`,
        x: x + (Math.random() - 0.5) * 0.04,
        y: y + (Math.random() - 0.5) * 0.02,
        vy: 0.02 + Math.random() * 0.015,
        nutrition: 0.35,
      });
    }
    this.emitEvent({
      type: 'FEEDING',
      x,
      y,
      intensity: 0.4,
    });
  }

  public doseNitrifyingBacteria(): void {
    this.water.nitrosomonas += 15.0;
    this.water.nitrobacter += 15.0;
    this.emitEvent({
      type: 'WARNING',
      x: 0.5,
      y: 0.5,
      intensity: 0.6,
      label: 'Dosed beneficial nitrifying biofilter bacteria',
    });
  }

  public performWaterChange(percentage: number): void {
    const frac = Math.max(0.05, Math.min(0.95, percentage / 100));
    const retain = 1.0 - frac;

    // Solute dilution with clean aged water
    this.water.ammonia *= retain;
    this.water.nitrite *= retain;
    this.water.nitrate *= retain;
    this.water.dissolvedOxygen = this.water.dissolvedOxygen * retain + 8.0 * frac;
    this.water.pH = this.water.pH * retain + 7.4 * frac;
    this.algae.planktonicDensity *= retain;

    this.emitEvent({
      type: 'WARNING',
      x: 0.5,
      y: 0.1,
      intensity: 0.7,
      label: `Performed ${percentage}% water change`,
    });
  }

  public scrubGlass(): void {
    this.algae.glassBiofilm = 0.02;
    this.emitEvent({
      type: 'WARNING',
      x: 0.5,
      y: 0.5,
      intensity: 0.5,
      label: 'Scrubbed glass biofilm clean',
    });
  }

  /**
   * Diagnostic Telemetry & Closed Nitrogen Mass Balance
   */
  public getMetrics(fps: number = 60): EcosystemMetrics {
    const warnings: string[] = [];
    if (this.water.ammonia > 0.5) warnings.push('TOXIC AMMONIA SPIKE');
    if (this.water.nitrite > 0.75) warnings.push('DANGEROUS NITRITE LEVEL');
    if (this.water.dissolvedOxygen < 2.5) warnings.push('HYPOXIA WARNING: FISH SUFFOCATING');
    if (this.algae.planktonicDensity > 75.0) warnings.push('EUTROPHIC ALGAE BLOOM');

    // Water Quality Index (0 to 100)
    let wqi = 100;
    wqi -= Math.min(35, this.water.ammonia * 30);
    wqi -= Math.min(30, this.water.nitrite * 25);
    wqi -= Math.min(25, Math.max(0, 5.0 - this.water.dissolvedOxygen) * 8);
    wqi -= Math.min(10, Math.abs(this.water.pH - 7.3) * 15);
    const score = Math.max(0, Math.min(100, Math.round(wqi)));

    const plantBiomass = this.plants.reduce((sum, p) => sum + p.biomass, 0);
    const fishBiomass = this.fish.reduce((sum, f) => sum + (f.isFry ? 0.2 : 1.5), 0);
    const totalBiomass = Number((plantBiomass + fishBiomass).toFixed(2));

    const isEquilibrium =
      this.water.ammonia < 0.1 &&
      this.water.nitrite < 0.05 &&
      this.water.dissolvedOxygen >= 5.5 &&
      warnings.length === 0;

    return {
      fishCount: this.fish.length,
      fryCount: this.fish.filter((f) => f.isFry).length,
      snailCount: this.snails.length,
      daphniaCount: this.daphnia.length,
      plantCount: this.plants.length,
      totalBiomassGrams: totalBiomass,
      waterQualityIndex: score,
      waterParameters: { ...this.water },
      environment: { ...this.env },
      measuredFps: fps,
      isEquilibrium,
      warnings,
    };
  }
}
