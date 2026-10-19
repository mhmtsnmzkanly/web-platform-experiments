/**
 * MARBLE-FORGE (EXP-023) — Single-Owner State Controller & Game Engine
 * Manages simulation lifecycle, levels, user interactions, tool placement,
 * audio routing, undo/redo history, and telemetry reporting.
 */

import { MarbleSimulationEngine, CollisionEvent } from '../physics/MarbleSimulationEngine';
import { MarbleAudioEngine } from '../audio/MarbleAudioEngine';
import { MARBLE_LEVELS } from '../physics/LevelDefinitions';
import {
  TrackElement,
  ToolType,
  MarbleMaterial,
  LevelDefinition,
  SimulationMetrics,
} from '../types';

export class MarbleSimulationController {
  public engine: MarbleSimulationEngine;
  public audio: MarbleAudioEngine;

  public currentLevelIndex: number = 0;
  public mode: 'BUILD' | 'PLAY' = 'PLAY';
  public activeTool: ToolType = 'SELECT';
  public activeMaterial: MarbleMaterial = 'GLASS';

  public isPaused: boolean = false;
  public simSpeed: number = 1.0;

  public metrics: SimulationMetrics;
  public measuredFps: number = 60;

  private frameCount: number = 0;
  private lastFpsUpdateTime: number = performance.now();
  private subscribers: Set<() => void> = new Set();

  private undoStack: TrackElement[][] = [];
  private redoStack: TrackElement[][] = [];

  constructor() {
    this.engine = new MarbleSimulationEngine(12.0, 8.0);
    this.audio = new MarbleAudioEngine();

    // Hook collision audio events
    this.engine.addEventListener((evt: CollisionEvent) => {
      this.routeAudioEvent(evt);
    });

    this.metrics = this.engine.getMetrics(60, 1);
    this.loadLevel(0);
  }

  public subscribe(fn: () => void): () => void {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  private notify(): void {
    this.subscribers.forEach((fn) => fn());
  }

  public get currentLevel(): LevelDefinition {
    return MARBLE_LEVELS[this.currentLevelIndex];
  }

  public loadLevel(index: number): void {
    if (index < 0 || index >= MARBLE_LEVELS.length) return;
    this.currentLevelIndex = index;
    const lvl = MARBLE_LEVELS[index];

    this.engine.bounds = { ...lvl.bounds };
    this.engine.elements = JSON.parse(JSON.stringify(lvl.elements));
    this.activeMaterial = lvl.spawnMaterial;
    this.engine.clearMarbles();
    this.engine.resetElements();

    this.undoStack = [];
    this.redoStack = [];

    this.updateMetrics();
    this.notify();
  }

  public nextLevel(): void {
    const nextIdx = (this.currentLevelIndex + 1) % MARBLE_LEVELS.length;
    this.loadLevel(nextIdx);
  }

  public prevLevel(): void {
    const prevIdx = (this.currentLevelIndex - 1 + MARBLE_LEVELS.length) % MARBLE_LEVELS.length;
    this.loadLevel(prevIdx);
  }

  public setTool(tool: ToolType): void {
    this.activeTool = tool;
    this.notify();
  }

  public setMaterial(material: MarbleMaterial): void {
    this.activeMaterial = material;
    this.notify();
  }

  public setMode(mode: 'BUILD' | 'PLAY'): void {
    this.mode = mode;
    if (mode === 'BUILD') {
      this.engine.clearMarbles();
      this.engine.resetElements();
    }
    this.updateMetrics();
    this.notify();
  }

  public togglePause(): boolean {
    this.isPaused = !this.isPaused;
    this.notify();
    return this.isPaused;
  }

  public setSimSpeed(speed: number): void {
    this.simSpeed = speed;
    this.notify();
  }

  public spawnMarbleAt(x: number, y: number): void {
    this.engine.spawnMarble(x, y, this.activeMaterial);
    this.audio.playImpact('MARBLE', 0.5);
    this.updateMetrics();
    this.notify();
  }

  public resetContraption(): void {
    this.engine.clearMarbles();
    this.engine.resetElements();
    this.audio.playImpact('SEESAW', 0.4);
    this.updateMetrics();
    this.notify();
  }

  public clearContraption(): void {
    this.pushUndo();
    this.engine.elements = [];
    this.engine.clearMarbles();
    this.audio.playImpact('SEESAW', 0.4);
    this.updateMetrics();
    this.notify();
  }

  /**
   * History & Undo/Redo
   */
  public pushUndo(): void {
    this.undoStack.push(JSON.parse(JSON.stringify(this.engine.elements)));
    if (this.undoStack.length > 30) this.undoStack.shift();
    this.redoStack = [];
  }

  public undo(): void {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(JSON.parse(JSON.stringify(this.engine.elements)));
    this.engine.elements = this.undoStack.pop()!;
    this.notify();
  }

  public redo(): void {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(JSON.parse(JSON.stringify(this.engine.elements)));
    this.engine.elements = this.redoStack.pop()!;
    this.notify();
  }

  public addElement(element: TrackElement): void {
    this.pushUndo();
    this.engine.elements.push(element);
    this.audio.playImpact('RAIL', 0.6);
    this.notify();
  }

  public deleteElementAt(x: number, y: number): boolean {
    const radius = 0.4;
    const initialLen = this.engine.elements.length;

    this.engine.elements = this.engine.elements.filter((el) => {
      if (el.type === 'STRAIGHT_RAIL') {
        const rx = el.x2 - el.x1;
        const ry = el.y2 - el.y1;
        const lenSq = rx * rx + ry * ry;
        if (lenSq < 1e-6) return Math.hypot(x - el.x1, y - el.y1) > radius;
        const t = Math.max(0, Math.min(1, ((x - el.x1) * rx + (y - el.y1) * ry) / lenSq));
        const px = el.x1 + t * rx;
        const py = el.y1 + t * ry;
        return Math.hypot(x - px, y - py) > radius;
      } else if (el.type === 'BUMPER' || el.type === 'TARGET_BELL' || el.type === 'MARBLE_SPAWNER') {
        return Math.hypot(x - el.x, y - el.y) > (el.radius || radius);
      } else if (el.type === 'SEESAW') {
        return Math.hypot(x - el.px, y - el.py) > Math.max(radius, el.length * 0.5);
      } else if (el.type === 'LOOP_THE_LOOP') {
        return Math.hypot(x - el.cx, y - el.cy) > (el.radius + radius);
      } else if (el.type === 'FUNNEL') {
        return Math.hypot(x - el.cx, y - el.cy) > (el.outerRadius + radius);
      } else if (el.type === 'ARCHIMEDES_LIFT') {
        const inX = Math.abs(x - el.x) <= el.radius + radius;
        const inY = y >= el.topY - radius && y <= el.bottomY + radius;
        return !(inX && inY);
      } else if (el.type === 'DOMINO') {
        const hit = el.dominoes.some((d) => Math.hypot(x - d.x, y - d.y) <= radius);
        return !hit;
      } else if (el.type === 'CURVED_RAIL') {
        const d = Math.hypot(x - el.cx, y - el.cy);
        return Math.abs(d - el.radius) > radius;
      }
      return true;
    });

    if (this.engine.elements.length !== initialLen) {
      this.pushUndo();
      this.audio.playImpact('RAIL', 0.3);
      this.notify();
      return true;
    }
    return false;
  }

  /**
   * Main Frame Tick
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

    // Sub-stepping loop based on simSpeed
    const steps = this.simSpeed >= 2.0 ? 2 : 1;
    const stepDt = (dt * this.simSpeed) / steps;

    for (let s = 0; s < steps; s++) {
      this.engine.step(stepDt);
    }

    this.updateMetrics();

    // Throttle React UI notifications to every 4 frames (15 Hz) for 60 FPS canvas decoupling
    if (this.frameCount % 4 === 0) {
      this.notify();
    }
  }

  private updateMetrics(): void {
    this.metrics = this.engine.getMetrics(
      this.measuredFps,
      this.currentLevel.requiredHits
    );
  }

  private routeAudioEvent(evt: CollisionEvent): void {
    switch (evt.type) {
      case 'BELL':
        this.audio.playBellChime(evt.frequency || 523.25, evt.intensity);
        break;
      case 'BUMPER':
        this.audio.playBumperBoing(evt.intensity);
        break;
      case 'DOMINO':
        this.audio.playDominoClack(evt.intensity);
        break;
      case 'RAIL':
      case 'SEESAW':
      case 'MARBLE':
        this.audio.playImpact(evt.type, evt.intensity);
        break;
    }
  }

  /**
   * Telemetry and State Export Modal Data
   */
  public exportStateJson(): string {
    return JSON.stringify(
      {
        experiment: '023',
        name: 'MARBLE-FORGE',
        timestamp: new Date().toISOString(),
        currentLevel: this.currentLevel.name,
        metrics: this.metrics,
        marbles: this.engine.marbles.map((m) => ({
          id: m.id,
          material: m.material,
          x: Number(m.x.toFixed(3)),
          y: Number(m.y.toFixed(3)),
          vx: Number(m.vx.toFixed(3)),
          vy: Number(m.vy.toFixed(3)),
          omega: Number(m.omega.toFixed(3)),
        })),
        elementsCount: this.engine.elements.length,
        elements: this.engine.elements,
      },
      null,
      2
    );
  }

  public exportContraptionCsv(): string {
    let csv = 'Type,Id,X1_or_X,Y1_or_Y,X2_or_Radius,Y2_or_Speed\n';
    for (const el of this.engine.elements) {
      if (el.type === 'STRAIGHT_RAIL') {
        csv += `STRAIGHT_RAIL,${el.id},${el.x1.toFixed(2)},${el.y1.toFixed(2)},${el.x2.toFixed(2)},${el.y2.toFixed(2)}\n`;
      } else if (el.type === 'BUMPER') {
        csv += `BUMPER,${el.id},${el.x.toFixed(2)},${el.y.toFixed(2)},${el.radius.toFixed(2)},${el.kickImpulse.toFixed(2)}\n`;
      } else if (el.type === 'TARGET_BELL') {
        csv += `TARGET_BELL,${el.id},${el.x.toFixed(2)},${el.y.toFixed(2)},${el.radius.toFixed(2)},${el.noteFrequency.toFixed(1)}\n`;
      } else if (el.type === 'SEESAW') {
        csv += `SEESAW,${el.id},${el.px.toFixed(2)},${el.py.toFixed(2)},${el.length.toFixed(2)},${el.angle.toFixed(3)}\n`;
      } else if (el.type === 'ARCHIMEDES_LIFT') {
        csv += `ARCHIMEDES_LIFT,${el.id},${el.x.toFixed(2)},${el.bottomY.toFixed(2)},${el.radius.toFixed(2)},${el.liftSpeed.toFixed(2)}\n`;
      } else if (el.type === 'MARBLE_SPAWNER') {
        csv += `MARBLE_SPAWNER,${el.id},${el.x.toFixed(2)},${el.y.toFixed(2)},${el.material},${el.spawnInterval.toFixed(1)}\n`;
      }
    }
    return csv;
  }

  public dispose(): void {
    this.audio.dispose();
    this.subscribers.clear();
  }
}
