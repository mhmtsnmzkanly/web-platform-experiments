/**
 * ORBITAL-SLINGSHOT (EXP-025) — Central Simulation Controller
 * Single-Owner State Manager, 30-Step Undo/Redo, Time Warp, and Telemetry
 */

import { AstrodynamicsEngine } from '../astrodynamics/AstrodynamicsEngine';
import { OrbitalAudioEngine } from '../audio/OrbitalAudioEngine';
import { MISSION_SCENARIOS } from '../astrodynamics/MissionScenarios';
import {
  MissionScenario,
  AstrodynamicsMetrics,
  AstrodynamicsEvent,
  ManeuverNode,
  Spacecraft,
  CelestialBody,
} from '../types';

interface SimulationStateSnapshot {
  spacecraft: Spacecraft;
  bodies: CelestialBody[];
  maneuverNode: ManeuverNode | null;
  simTime: number;
  totalDeltaVUsedKmS: number;
}

export class OrbitalSimulationController {
  public engine: AstrodynamicsEngine;
  public audio: OrbitalAudioEngine;
  public currentScenario: MissionScenario;
  public metrics: AstrodynamicsMetrics;

  public isPaused: boolean = false;
  public timeWarp: number = 1.0;
  public selectedBodyId: string | null = null;
  public isNodeEditingActive: boolean = true;
  public measuredFps: number = 60;

  private subscribers: (() => void)[] = [];
  private unsubscribeEngineEvents: (() => void) | null = null;
  private animFrameId: number | null = null;
  private lastWallClockTime: number = 0;
  private lastFpsUpdateTime: number = 0;
  private frameCount: number = 0;

  // 30-Step Undo/Redo Stacks
  private undoStack: SimulationStateSnapshot[] = [];
  private redoStack: SimulationStateSnapshot[] = [];

  constructor() {
    this.currentScenario = MISSION_SCENARIOS[0];
    this.engine = new AstrodynamicsEngine(this.currentScenario);
    this.audio = new OrbitalAudioEngine();
    this.metrics = this.engine.getMetrics();

    this.attachEventListeners();
    this.startLoop();
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

  public loadScenario(scenario: MissionScenario, recordUndo: boolean = true): void {
    if (recordUndo) this.pushUndo();
    this.currentScenario = scenario;
    this.engine = new AstrodynamicsEngine(scenario);
    this.attachEventListeners();
    this.timeWarp = 1.0;
    this.metrics = this.engine.getMetrics();
    this.notify();
  }

  public resetCurrentScenario(): void {
    this.pushUndo();
    this.loadScenario(this.currentScenario, false);
  }

  public togglePause(): void {
    this.isPaused = !this.isPaused;
    this.notify();
  }

  public setTimeWarp(warp: number): void {
    this.timeWarp = Math.max(0.25, Math.min(500.0, warp));
    this.notify();
  }

  public stepForward(manualDtYears: number = 0.001): void {
    this.pushUndo();
    this.engine.step(manualDtYears, 10);
    this.metrics = this.engine.getMetrics();
    this.notify();
  }

  // --- Maneuver Node Operations ---

  public setManeuverNode(progradeKmS: number, radialKmS: number, timeFromNowYears: number = 0.05): void {
    this.pushUndo();
    const epoch = this.engine.simTime + Math.max(0.001, timeFromNowYears);
    this.engine.maneuverNode = {
      id: `node-${Date.now()}`,
      epoch,
      progradeDeltaV: progradeKmS,
      radialDeltaV: radialKmS,
      isExecuted: false,
    };
    this.notify();
  }

  public adjustManeuverPrograde(deltaKmS: number): void {
    if (!this.engine.maneuverNode) {
      this.setManeuverNode(deltaKmS, 0, 0.05);
      return;
    }
    this.engine.maneuverNode.progradeDeltaV += deltaKmS;
    this.notify();
  }

  public adjustManeuverRadial(deltaKmS: number): void {
    if (!this.engine.maneuverNode) {
      this.setManeuverNode(0, deltaKmS, 0.05);
      return;
    }
    this.engine.maneuverNode.radialDeltaV += deltaKmS;
    this.notify();
  }

  public executeManeuverNow(): void {
    this.pushUndo();
    if (this.engine.maneuverNode) {
      this.engine.maneuverNode.epoch = this.engine.simTime;
      this.engine.executeManeuverNode();
      this.metrics = this.engine.getMetrics();
      this.notify();
    }
  }

  public clearManeuverNode(): void {
    this.pushUndo();
    this.engine.maneuverNode = null;
    this.notify();
  }

  public applyManualBurn(progradeKmS: number, radialKmS: number): void {
    this.pushUndo();
    this.engine.applyManualImpulse(progradeKmS, radialKmS);
    this.metrics = this.engine.getMetrics();
    this.notify();
  }

  // --- Undo / Redo System ---

  private captureSnapshot(): SimulationStateSnapshot {
    return {
      spacecraft: JSON.parse(JSON.stringify(this.engine.spacecraft)),
      bodies: JSON.parse(JSON.stringify(this.engine.bodies)),
      maneuverNode: this.engine.maneuverNode ? JSON.parse(JSON.stringify(this.engine.maneuverNode)) : null,
      simTime: this.engine.simTime,
      totalDeltaVUsedKmS: this.engine.totalDeltaVUsedKmS,
    };
  }

  private pushUndo(): void {
    this.undoStack.push(this.captureSnapshot());
    if (this.undoStack.length > 30) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  public undo(): void {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(this.captureSnapshot());
    const snap = this.undoStack.pop()!;
    this.restoreSnapshot(snap);
  }

  public redo(): void {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(this.captureSnapshot());
    const snap = this.redoStack.pop()!;
    this.restoreSnapshot(snap);
  }

  private restoreSnapshot(snap: SimulationStateSnapshot): void {
    this.engine.spacecraft = JSON.parse(JSON.stringify(snap.spacecraft));
    this.engine.bodies = JSON.parse(JSON.stringify(snap.bodies));
    this.engine.maneuverNode = snap.maneuverNode ? JSON.parse(JSON.stringify(snap.maneuverNode)) : null;
    this.engine.simTime = snap.simTime;
    this.engine.totalDeltaVUsedKmS = snap.totalDeltaVUsedKmS;
    this.metrics = this.engine.getMetrics();
    this.notify();
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  // --- Audio Event Dispatcher ---

  private routeAudioEvent(evt: AstrodynamicsEvent): void {
    switch (evt.type) {
      case 'BURN_EXECUTION':
        this.audio.playThrusterBurn(evt.intensity);
        break;
      case 'SOI_CHANGE':
        this.audio.playSoiEntryChime(evt.intensity);
        break;
      case 'PERIAPSIS_PASS':
      case 'GRAVITY_ASSIST':
        this.audio.playGravityAssistWhoosh(evt.intensity);
        break;
      case 'CRASH':
        this.audio.playCollisionImpact();
        break;
      case 'MISSION_SUCCESS':
        this.audio.playMissionSuccessFanfare();
        break;
    }
  }

  // --- Simulation Main Loop & Real Wall-Clock FPS ---

  public startLoop(): void {
    if (this.animFrameId !== null) return;
    this.lastWallClockTime = performance.now();
    this.lastFpsUpdateTime = performance.now();
    this.frameCount = 0;

    const loop = (currentTime: number) => {
      const deltaMs = Math.min(100, currentTime - this.lastWallClockTime);
      this.lastWallClockTime = currentTime;

      // Real Wall-Clock Frame Rate calculation across 500ms sliding window
      this.frameCount++;
      const elapsed = currentTime - this.lastFpsUpdateTime;
      if (elapsed >= 500) {
        this.measuredFps = Math.round((this.frameCount * 1000) / elapsed);
        this.frameCount = 0;
        this.lastFpsUpdateTime = currentTime;
      }

      if (!this.isPaused && this.engine.missionStatus !== 'CRASHED') {
        // Base dt: 1 visual second = 0.05 simulation years (~18.25 days) at 1x
        const dtYears = (deltaMs / 1000) * 0.05 * this.timeWarp;
        // Adaptive sub-steps based on time warp
        const subSteps = Math.min(40, Math.max(10, Math.floor(10 * Math.sqrt(this.timeWarp))));
        this.engine.step(dtYears, subSteps);
      }

      this.metrics = this.engine.getMetrics();

      // Throttle React state notifications to 15 Hz to protect UI render pipeline
      if (this.frameCount % 4 === 0) {
        this.notify();
      }

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  // --- Data Export Utilities ---

  public exportMissionJson(): string {
    return JSON.stringify(
      {
        scenario: this.currentScenario.title,
        simTimeYears: this.engine.simTime,
        simTimeDays: this.engine.simTime * 365.25,
        missionStatus: this.engine.missionStatus,
        statusMessage: this.engine.statusMessage,
        spacecraft: {
          x: this.engine.spacecraft.x,
          y: this.engine.spacecraft.y,
          vx: this.engine.spacecraft.vx,
          vy: this.engine.spacecraft.vy,
          speedKmS: this.metrics.currentSpeedKmS,
          remainingDeltaVKmS: this.engine.spacecraft.remainingDeltaV,
          totalDeltaVUsedKmS: this.engine.totalDeltaVUsedKmS,
        },
        orbitalElements: this.metrics.elements,
        bodies: this.engine.bodies.map((b) => ({
          name: b.name,
          x: b.x,
          y: b.y,
          vx: b.vx,
          vy: b.vy,
        })),
      },
      null,
      2
    );
  }

  public exportFlightLedgerCsv(): string {
    const m = this.metrics;
    const lines = [
      'Parameter,Value,Unit,Description',
      `MissionTitle,${this.currentScenario.title},text,Mission name`,
      `MissionStatus,${m.missionStatus},status,Current flight state`,
      `FlightTimeDays,${m.simTimeDays.toFixed(2)},days,Elapsed simulation time`,
      `CurrentSpeed,${m.currentSpeedKmS.toFixed(3)},km/s,Relative orbital velocity`,
      `PrimaryBody,${m.primaryBodyName},text,Gravitational primary`,
      `DistanceToPrimary,${m.distanceToPrimaryKm.toFixed(0)},km,Altitude/distance`,
      `SemiMajorAxis,${m.elements.semiMajorAxis.toFixed(4)},AU,Orbital semi-major axis`,
      `Eccentricity,${m.elements.eccentricity.toFixed(4)},scalar,Orbital eccentricity`,
      `Periapsis,${m.elements.periapsis.toFixed(4)},AU,Closest approach distance`,
      `Apoapsis,${m.elements.apoapsis.toFixed(4)},AU,Furthest approach distance`,
      `OrbitalPeriod,${m.elements.period.toFixed(3)},years,Keplerian period`,
      `OrbitType,${m.elements.orbitType},type,Conic section geometry`,
      `RemainingDeltaV,${m.remainingDeltaVKmS.toFixed(3)},km/s,Remaining propellant budget`,
      `TotalDeltaVUsed,${m.totalDeltaVUsedKmS.toFixed(3)},km/s,Total fuel consumed`,
      `MeasuredRenderingFps,${this.measuredFps},fps,Real wall-clock frame rate`,
    ];
    return lines.join('\n');
  }

  public dispose(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.unsubscribeEngineEvents) {
      this.unsubscribeEngineEvents();
      this.unsubscribeEngineEvents = null;
    }
    this.audio.dispose();
  }
}
