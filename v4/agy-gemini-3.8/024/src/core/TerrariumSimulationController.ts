/**
 * POCKET-TERRARIUM (EXP-024) — Single-Owner Simulation Controller
 * Manages simulation loop, tool interaction, scenario presets, undo/redo, audio routing, and telemetry export.
 */

import { TerrariumSimulationEngine, EcologicalEvent } from '../ecology/TerrariumSimulationEngine.js';
import { TerrariumAudioEngine } from '../audio/TerrariumAudioEngine.js';
import { SCENARIO_PRESETS } from '../ecology/ScenarioDefinitions.js';
import {
  ToolType,
  ScenarioPreset,
  EcosystemMetrics,
} from '../types/index.js';

export class TerrariumSimulationController {
  public engine: TerrariumSimulationEngine;
  public audio: TerrariumAudioEngine;

  public activeTool: ToolType = 'OBSERVE';
  public currentScenario: ScenarioPreset = SCENARIO_PRESETS[0];
  public isPaused: boolean = false;
  public simSpeed: number = 1.0;

  public metrics: EcosystemMetrics;

  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private subscribers: Array<() => void> = [];

  private frameCount: number = 0;
  private lastFpsUpdateTime: number = performance.now();
  private measuredFps: number = 60;
  private unsubscribeEngineEvents: (() => void) | null = null;

  constructor() {
    this.engine = new TerrariumSimulationEngine();
    this.audio = new TerrariumAudioEngine();
    this.metrics = this.engine.getMetrics();

    this.loadScenario(this.currentScenario, false);
    this.attachEventListeners();
  }

  public attachEventListeners(): void {
    if (this.unsubscribeEngineEvents) {
      this.unsubscribeEngineEvents();
    }
    this.unsubscribeEngineEvents = this.engine.onEvent((evt) => {
      this.routeAudioEvent(evt);
    });
  }

  public subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  private notify(): void {
    for (const sub of this.subscribers) {
      try {
        sub();
      } catch {}
    }
  }

  public loadScenario(scenario: ScenarioPreset, recordUndo: boolean = true): void {
    if (recordUndo) this.pushUndo();
    this.currentScenario = scenario;

    this.engine = new TerrariumSimulationEngine(scenario.water);
    this.attachEventListeners();

    // Populate Plants
    for (let i = 0; i < scenario.plantCount; i++) {
      const x = 0.15 + (i / Math.max(1, scenario.plantCount - 1)) * 0.7;
      this.engine.addPlant(x);
    }

    // Populate Fish
    for (let i = 0; i < scenario.fishCount; i++) {
      this.engine.createFish(0.2 + Math.random() * 0.6, 0.2 + Math.random() * 0.5);
    }

    // Populate Snails
    for (let i = 0; i < scenario.snailCount; i++) {
      this.engine.addSnail(0.2 + Math.random() * 0.6, 0.92);
    }

    // Populate Daphnia
    if (scenario.daphniaCount > 0) {
      this.engine.addDaphniaSwarm(scenario.daphniaCount);
    }

    // Environment and Algae parameters
    this.engine.algae.planktonicDensity = scenario.planktonicAlgae;
    this.engine.algae.glassBiofilm = scenario.glassBiofilm;
    this.engine.env.lampPower = scenario.lampPower;
    this.engine.env.isBubblerActive = scenario.isBubblerActive;

    this.updateMetrics();
    this.notify();
  }

  public setTool(tool: ToolType): void {
    this.activeTool = tool;
    this.notify();
  }

  public togglePause(): void {
    this.isPaused = !this.isPaused;
    this.notify();
  }

  public setSpeed(speed: number): void {
    this.simSpeed = speed;
    this.notify();
  }

  public toggleBubbler(): void {
    this.pushUndo();
    this.engine.env.isBubblerActive = !this.engine.env.isBubblerActive;
    this.audio.playBubblePop(0.8);
    this.notify();
  }

  public toggleLamp(): void {
    this.pushUndo();
    this.engine.env.lampPower = this.engine.env.lampPower > 0.1 ? 0.0 : 0.8;
    this.audio.playPearlingChime(0.6);
    this.notify();
  }

  public performWaterChange(percentage: number): void {
    this.pushUndo();
    this.engine.performWaterChange(percentage);
    this.audio.playWaterChangeSwoosh();
    this.updateMetrics();
    this.notify();
  }

  public scrubGlass(): void {
    this.pushUndo();
    this.engine.scrubGlass();
    this.audio.playFeedingPlop(0.4);
    this.notify();
  }

  public doseBacteria(): void {
    this.pushUndo();
    this.engine.doseNitrifyingBacteria();
    this.audio.playWarningAlert();
    this.notify();
  }

  /**
   * Interactive Canvas Click/Tap Handling
   */
  public handleCanvasAction(x: number, y: number): void {
    this.audio.unlock();

    switch (this.activeTool) {
      case 'FEED':
        this.engine.dropFood(x, y);
        break;
      case 'ADD_PLANT':
        this.pushUndo();
        this.engine.addPlant(x);
        this.audio.playFeedingPlop(0.5);
        break;
      case 'ADD_FISH':
        this.pushUndo();
        this.engine.createFish(x, y);
        this.audio.playFeedingPlop(0.6);
        break;
      case 'ADD_SNAIL':
        this.pushUndo();
        this.engine.addSnail(x, y);
        this.audio.playFeedingPlop(0.4);
        break;
      case 'ADD_DAPHNIA':
        this.pushUndo();
        this.engine.addDaphniaSwarm(6);
        this.audio.playPearlingChime(0.4);
        break;
      case 'NET_FISH':
        if (this.engine.fish.length > 0) {
          this.pushUndo();
          let closestIdx = 0;
          let closestDist = Infinity;
          for (let i = 0; i < this.engine.fish.length; i++) {
            const d = Math.hypot(x - this.engine.fish[i].x, y - this.engine.fish[i].y);
            if (d < closestDist) {
              closestDist = d;
              closestIdx = i;
            }
          }
          if (closestDist < 0.15) {
            this.engine.fish.splice(closestIdx, 1);
            this.audio.playFeedingPlop(0.8);
          }
        }
        break;
      case 'SCRUB_GLASS':
        this.scrubGlass();
        break;
      case 'OBSERVE':
      default:
        // Clicking water creates gentle ripples and stirs bubbles
        this.engine.bubbles.push({
          id: `touch-${Date.now()}`,
          x,
          y,
          radius: 0.007,
          vy: -0.1,
          vx: (Math.random() - 0.5) * 0.02,
        });
        this.audio.playBubblePop(0.4);
        break;
    }

    this.updateMetrics();
    this.notify();
  }

  /**
   * Undo/Redo System
   */
  public pushUndo(): void {
    const snapshot = JSON.stringify({
      water: this.engine.water,
      fish: this.engine.fish,
      plants: this.engine.plants,
      snails: this.engine.snails,
      daphnia: this.engine.daphnia,
      env: this.engine.env,
      algae: this.engine.algae,
    });
    this.undoStack.push(snapshot);
    if (this.undoStack.length > 30) this.undoStack.shift();
    this.redoStack = [];
  }

  public undo(): void {
    if (this.undoStack.length === 0) return;
    const current = JSON.stringify({
      water: this.engine.water,
      fish: this.engine.fish,
      plants: this.engine.plants,
      snails: this.engine.snails,
      daphnia: this.engine.daphnia,
      env: this.engine.env,
      algae: this.engine.algae,
    });
    this.redoStack.push(current);

    const prev = JSON.parse(this.undoStack.pop()!);
    this.restoreSnapshot(prev);
    this.notify();
  }

  public redo(): void {
    if (this.redoStack.length === 0) return;
    const current = JSON.stringify({
      water: this.engine.water,
      fish: this.engine.fish,
      plants: this.engine.plants,
      snails: this.engine.snails,
      daphnia: this.engine.daphnia,
      env: this.engine.env,
      algae: this.engine.algae,
    });
    this.undoStack.push(current);

    const next = JSON.parse(this.redoStack.pop()!);
    this.restoreSnapshot(next);
    this.notify();
  }

  private restoreSnapshot(snap: Record<string, unknown>): void {
    if (snap.water) this.engine.water = snap.water as typeof this.engine.water;
    if (snap.fish) this.engine.fish = snap.fish as typeof this.engine.fish;
    if (snap.plants) this.engine.plants = snap.plants as typeof this.engine.plants;
    if (snap.snails) this.engine.snails = snap.snails as typeof this.engine.snails;
    if (snap.daphnia) this.engine.daphnia = snap.daphnia as typeof this.engine.daphnia;
    if (snap.env) this.engine.env = snap.env as typeof this.engine.env;
    if (snap.algae) this.engine.algae = snap.algae as typeof this.engine.algae;
    this.updateMetrics();
  }

  /**
   * Main Frame Animation Tick (Decoupled 60 FPS Physics, 15 Hz React UI)
   */
  public tick(dt: number = 1 / 60): void {
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastFpsUpdateTime;

    if (elapsed >= 500) {
      this.measuredFps = Math.round((this.frameCount * 1000) / elapsed);
      this.frameCount = 0;
      this.lastFpsUpdateTime = now;
    }

    if (this.isPaused) return;

    this.engine.step(dt * this.simSpeed);

    // Throttle React notification to 15 Hz (every 4 frames)
    if (this.frameCount % 4 === 0) {
      this.updateMetrics();
      this.notify();
    }
  }

  private updateMetrics(): void {
    this.metrics = this.engine.getMetrics(this.measuredFps);
  }

  private routeAudioEvent(evt: EcologicalEvent): void {
    switch (evt.type) {
      case 'BUBBLE_POP':
        this.audio.playBubblePop(evt.intensity);
        break;
      case 'PEARLING':
        this.audio.playPearlingChime(evt.intensity);
        break;
      case 'FEEDING':
        this.audio.playFeedingPlop(evt.intensity);
        break;
      case 'WARNING':
      case 'DEATH':
        this.audio.playWarningAlert();
        break;
    }
  }

  /**
   * Telemetry & Data Export
   */
  public exportStateJson(): string {
    return JSON.stringify(
      {
        experiment: '024',
        name: 'POCKET-TERRARIUM',
        timestamp: new Date().toISOString(),
        scenario: this.currentScenario.name,
        metrics: this.metrics,
        waterParameters: this.engine.water,
        environment: this.engine.env,
        biologicalLedger: {
          fishCount: this.engine.fish.length,
          fryCount: this.engine.fish.filter((f) => f.isFry).length,
          snailCount: this.engine.snails.length,
          daphniaCount: this.engine.daphnia.length,
          plantCount: this.engine.plants.length,
        },
      },
      null,
      2
    );
  }

  public exportEcosystemCsv(): string {
    const lines = [
      'Parameter,Value,Unit,HealthStatus',
      `DissolvedOxygen,${this.engine.water.dissolvedOxygen.toFixed(2)},mg/L,${this.engine.water.dissolvedOxygen < 2.5 ? 'CRITICAL_HYPOXIC' : 'OPTIMAL'}`,
      `Ammonia,${this.engine.water.ammonia.toFixed(3)},mg/L,${this.engine.water.ammonia > 0.5 ? 'TOXIC' : 'SAFE'}`,
      `Nitrite,${this.engine.water.nitrite.toFixed(3)},mg/L,${this.engine.water.nitrite > 0.75 ? 'DANGEROUS' : 'SAFE'}`,
      `Nitrate,${this.engine.water.nitrate.toFixed(2)},mg/L,${this.engine.water.nitrate > 80 ? 'ELEVATED' : 'BALANCED'}`,
      `pH,${this.engine.water.pH.toFixed(2)},pH,${this.engine.water.pH < 6.8 || this.engine.water.pH > 8.4 ? 'STRESS' : 'NORMAL'}`,
      `Temperature,${this.engine.water.temperature.toFixed(1)},C,NORMAL`,
      `WaterQualityIndex,${this.metrics.waterQualityIndex},/100,SCORE`,
      `FishPopulation,${this.engine.fish.length},count,LIVING`,
      `SnailPopulation,${this.engine.snails.length},count,LIVING`,
      `DaphniaPopulation,${this.engine.daphnia.length},count,LIVING`,
      `PlantCount,${this.engine.plants.length},count,LIVING`,
      `DiurnalTimeHours,${this.engine.env.dayTimeHours.toFixed(1)},hrs,CLOCK`,
      `BubblerActive,${this.engine.env.isBubblerActive ? 1 : 0},bool,AERATION`,
      `LampPower,${this.engine.env.lampPower.toFixed(2)},ratio,LIGHT`,
    ];
    return lines.join('\n');
  }

  public dispose(): void {
    if (this.unsubscribeEngineEvents) {
      this.unsubscribeEngineEvents();
    }
    this.audio.dispose();
  }
}
