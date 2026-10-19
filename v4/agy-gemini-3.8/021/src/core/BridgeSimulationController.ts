/**
 * PONTIFEX (EXP-021) — Single-Owner Simulation Controller
 * Central authoritative state manager for the bridge truss network,
 * build tools, undo/redo history, vehicle lifecycle, and real wall-clock FPS tracking.
 */

import {
  TrussNode,
  TrussMember,
  VehicleState,
  MaterialType,
  BridgeLevel,
  BridgeMetrics,
} from '../types';
import { BRIDGE_LEVELS } from '../physics/LevelDefinitions';
import { TrussPhysicsEngine, SnapEvent } from '../physics/TrussPhysicsEngine';
import { VehiclePhysicsEngine } from '../physics/VehiclePhysicsEngine';
import { BridgeAudioEngine } from '../audio/BridgeAudioEngine';

export type BuildTool = 'SELECT' | 'ROAD' | 'WOOD' | 'STEEL' | 'CABLE' | 'HYDRAULIC' | 'DELETE';

interface BridgeSnapshot {
  nodes: TrussNode[];
  members: TrussMember[];
}

export type ControllerListener = (controller: BridgeSimulationController) => void;

export class BridgeSimulationController {
  public currentLevelIndex: number = 0;
  public mode: 'BUILD' | 'TEST' = 'BUILD';
  public activeTool: BuildTool = 'ROAD';
  public isGridSnapping: boolean = true;
  public simSpeed: number = 1.0;

  public nodes: TrussNode[] = [];
  public members: TrussMember[] = [];
  public vehicle: VehicleState;

  // Build snapshot for resetting test runs
  private initialBuildSnapshot: BridgeSnapshot | null = null;
  private undoStack: BridgeSnapshot[] = [];
  private redoStack: BridgeSnapshot[] = [];

  // Metrics
  public metrics: BridgeMetrics;
  public audio: BridgeAudioEngine;

  // Performance tracking
  public measuredFps: number = 60.0;
  private frameCount: number = 0;
  private lastFpsUpdateTime: number = performance.now();
  private subscribers: Set<ControllerListener> = new Set();

  constructor() {
    this.audio = new BridgeAudioEngine();
    this.vehicle = VehiclePhysicsEngine.createVehicle('CAR', 0, 10);
    this.metrics = {
      currentCost: 0,
      budget: 12000,
      maxStress: 0.0,
      nodeCount: 0,
      memberCount: 0,
      brokenMemberCount: 0,
      status: 'BUILDING',
    };

    this.loadLevel(0);
  }

  public subscribe(listener: ControllerListener): () => void {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  }

  private notify(): void {
    this.subscribers.forEach((l) => l(this));
  }

  public get currentLevel(): BridgeLevel {
    return BRIDGE_LEVELS[this.currentLevelIndex] || BRIDGE_LEVELS[0];
  }

  /**
   * Loads a challenge level and initializes terrain anchors
   */
  public loadLevel(levelIndex: number): void {
    if (this.mode === 'TEST') {
      this.stopSimulation();
    }

    this.currentLevelIndex = Math.max(0, Math.min(BRIDGE_LEVELS.length - 1, levelIndex));
    const lvl = this.currentLevel;

    this.nodes = [];
    this.members = [];
    this.undoStack = [];
    this.redoStack = [];

    // Create fixed terrain anchor nodes
    lvl.anchorNodes.forEach((pt, idx) => {
      this.nodes.push({
        id: `anchor_${idx}`,
        x: pt.x,
        y: pt.y,
        vx: 0,
        vy: 0,
        fx: 0,
        fy: 0,
        mass: 100.0,
        isAnchor: true,
      });
    });

    // Spawn vehicle at left cliff
    const startX = lvl.terrain.leftX + 2.0;
    const startY = lvl.terrain.leftY;
    this.vehicle = VehiclePhysicsEngine.createVehicle(lvl.vehicle, startX, startY);

    // Validate active tool against level allowed materials
    if (this.activeTool !== 'SELECT' && this.activeTool !== 'DELETE') {
      if (!lvl.allowedMaterials.includes(this.activeTool as MaterialType)) {
        this.activeTool = lvl.allowedMaterials[0] || 'ROAD';
      }
    }

    this.updateMetrics();
    this.saveSnapshot();
    this.notify();
  }

  public setTool(tool: BuildTool): void {
    this.activeTool = tool;
    this.notify();
  }

  public toggleGridSnapping(): void {
    this.isGridSnapping = !this.isGridSnapping;
    this.notify();
  }

  public setSimSpeed(speed: number): void {
    this.simSpeed = speed;
    this.notify();
  }

  /**
   * Snaps a coordinate to nearest 0.5m grid if snapping is active
   */
  public snapCoord(val: number): number {
    if (!this.isGridSnapping) return Math.round(val * 100) / 100;
    const grid = 0.5; // 0.5 meter precision grid
    return Math.round(val / grid) * grid;
  }

  /**
   * Adds or returns an existing node near (x, y)
   */
  public getOrCreateNode(rawX: number, rawY: number): TrussNode {
    const x = this.snapCoord(rawX);
    const y = this.snapCoord(rawY);

    // Check if a node already exists within threshold (0.35m)
    const threshold = 0.35;
    for (const n of this.nodes) {
      if (Math.hypot(n.x - x, n.y - y) <= threshold) {
        return n;
      }
    }

    // Create new free node
    const newNode: TrussNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      x,
      y,
      vx: 0,
      vy: 0,
      fx: 0,
      fy: 0,
      mass: 15.0,
      isAnchor: false,
    };

    this.nodes.push(newNode);
    this.audio.playNodeClick();
    this.updateMetrics();
    return newNode;
  }

  /**
   * Adds an elastic structural member between two nodes
   */
  public addMember(nodeAId: string, nodeBId: string, material: MaterialType): TrussMember | null {
    if (nodeAId === nodeBId) return null;
    if (!this.currentLevel.allowedMaterials.includes(material)) return null;

    // Check if member already exists
    const exists = this.members.some(
      (m) =>
        (m.nodeAId === nodeAId && m.nodeBId === nodeBId) ||
        (m.nodeAId === nodeBId && m.nodeBId === nodeAId)
    );
    if (exists) return null;

    const nA = this.nodes.find((n) => n.id === nodeAId);
    const nB = this.nodes.find((n) => n.id === nodeBId);
    if (!nA || !nB) return null;

    const length = Math.hypot(nB.x - nA.x, nB.y - nA.y);
    if (length < 0.2 || length > 12.0) {
      // Max single beam span limit for realism
      return null;
    }

    this.saveSnapshot();

    const newMember: TrussMember = {
      id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      nodeAId,
      nodeBId,
      material,
      restLength: length,
      currentLength: length,
      force: 0.0,
      stress: 0.0,
      isBroken: false,
    };

    this.members.push(newMember);
    this.audio.playBeamConnect(material);
    TrussPhysicsEngine.updateNodeMasses(this.nodes, this.members);
    this.updateMetrics();
    this.notify();
    return newMember;
  }

  /**
   * Deletes a node and any attached members
   */
  public deleteNode(nodeId: string): void {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node || node.isAnchor) return; // Cannot delete terrain anchors

    this.saveSnapshot();
    this.members = this.members.filter((m) => m.nodeAId !== nodeId && m.nodeBId !== nodeId);
    this.nodes = this.nodes.filter((n) => n.id !== nodeId);

    TrussPhysicsEngine.updateNodeMasses(this.nodes, this.members);
    this.updateMetrics();
    this.notify();
  }

  /**
   * Deletes a single bridge member
   */
  public deleteMember(memberId: string): void {
    this.saveSnapshot();
    this.members = this.members.filter((m) => m.id !== memberId);

    // Clean up isolated free nodes (non-anchors with 0 connections)
    const connectedNodeIds = new Set<string>();
    this.members.forEach((m) => {
      connectedNodeIds.add(m.nodeAId);
      connectedNodeIds.add(m.nodeBId);
    });

    this.nodes = this.nodes.filter((n) => n.isAnchor || connectedNodeIds.has(n.id));

    TrussPhysicsEngine.updateNodeMasses(this.nodes, this.members);
    this.updateMetrics();
    this.notify();
  }

  /**
   * Clears all player-built bridge elements (retains cliff anchors)
   */
  public clearBridge(): void {
    this.saveSnapshot();
    this.members = [];
    this.nodes = this.nodes.filter((n) => n.isAnchor);
    this.updateMetrics();
    this.notify();
  }

  /**
   * Undo/Redo snapshot system
   */
  public saveSnapshot(): void {
    const snap: BridgeSnapshot = {
      nodes: JSON.parse(JSON.stringify(this.nodes)),
      members: JSON.parse(JSON.stringify(this.members)),
    };
    this.undoStack.push(snap);
    if (this.undoStack.length > 30) this.undoStack.shift();
    this.redoStack = [];
  }

  public undo(): void {
    if (this.undoStack.length === 0 || this.mode === 'TEST') return;
    const current: BridgeSnapshot = {
      nodes: JSON.parse(JSON.stringify(this.nodes)),
      members: JSON.parse(JSON.stringify(this.members)),
    };
    this.redoStack.push(current);

    const prev = this.undoStack.pop();
    if (prev) {
      this.nodes = prev.nodes;
      this.members = prev.members;
      TrussPhysicsEngine.updateNodeMasses(this.nodes, this.members);
      this.updateMetrics();
      this.notify();
    }
  }

  public redo(): void {
    if (this.redoStack.length === 0 || this.mode === 'TEST') return;
    const current: BridgeSnapshot = {
      nodes: JSON.parse(JSON.stringify(this.nodes)),
      members: JSON.parse(JSON.stringify(this.members)),
    };
    this.undoStack.push(current);

    const next = this.redoStack.pop();
    if (next) {
      this.nodes = next.nodes;
      this.members = next.members;
      TrussPhysicsEngine.updateNodeMasses(this.nodes, this.members);
      this.updateMetrics();
      this.notify();
    }
  }

  /**
   * Transitions from BUILD to TEST simulation mode
   */
  public startSimulation(): void {
    if (this.mode === 'TEST') return;

    // Cache initial intact structure for reset
    this.initialBuildSnapshot = {
      nodes: JSON.parse(JSON.stringify(this.nodes)),
      members: JSON.parse(JSON.stringify(this.members)),
    };

    const lvl = this.currentLevel;
    const startX = lvl.terrain.leftX + 2.0;
    const startY = lvl.terrain.leftY;
    this.vehicle = VehiclePhysicsEngine.createVehicle(lvl.vehicle, startX, startY);
    this.vehicle.status = 'DRIVING';

    TrussPhysicsEngine.updateNodeMasses(this.nodes, this.members);
    this.mode = 'TEST';
    this.metrics.status = 'TESTING';
    this.notify();
  }

  /**
   * Resets simulation and returns to BUILD mode with all repairs restored
   */
  public stopSimulation(): void {
    if (this.mode === 'BUILD') return;

    this.audio.updateEngineSound(false, 0, 15);

    if (this.initialBuildSnapshot) {
      this.nodes = this.initialBuildSnapshot.nodes;
      this.members = this.initialBuildSnapshot.members;
    }

    const lvl = this.currentLevel;
    const startX = lvl.terrain.leftX + 2.0;
    const startY = lvl.terrain.leftY;
    this.vehicle = VehiclePhysicsEngine.createVehicle(lvl.vehicle, startX, startY);

    this.mode = 'BUILD';
    this.metrics.status = 'BUILDING';
    this.metrics.maxStress = 0.0;
    this.updateMetrics();
    this.notify();
  }

  /**
   * Advances physics one tick in TEST mode
   */
  public tick(dt: number): void {
    // True wall-clock FPS computation
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastFpsUpdateTime;
    if (elapsed >= 500) {
      this.measuredFps = Math.round((this.frameCount * 1000) / elapsed);
      this.frameCount = 0;
      this.lastFpsUpdateTime = now;
      this.notify();
    }

    if (this.mode !== 'TEST') return;

    const scaledDt = Math.min(0.04, dt) * this.simSpeed;
    const lvl = this.currentLevel;

    // Clear external forces before vehicle wheel reactions accumulate
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].extFx = 0.0;
      this.nodes[i].extFy = 0.0;
    }

    // 1. Advance vehicle kinematics & wheel-road contacts (accumulating reaction forces into node extFx/extFy)
    VehiclePhysicsEngine.stepVehicle(
      this.vehicle,
      this.nodes,
      this.members,
      scaledDt,
      lvl.terrain.leftWidth,
      lvl.terrain.rightX,
      lvl.terrain.leftY,
      lvl.targetFlagX,
      lvl.terrain.waterLevelY,
      lvl.terrain.rightY
    );

    // 2. Advance 2D truss lumped-mass simulation incorporating vehicle load
    const { maxStress } = TrussPhysicsEngine.stepSimulation(
      this.nodes,
      this.members,
      scaledDt,
      lvl.terrain.waterLevelY,
      (snapEvt: SnapEvent) => {
        this.audio.playSnap(snapEvt.material);
      }
    );

    this.metrics.maxStress = maxStress;

    // Play creak audio when high stress occurs
    if (maxStress > 0.75) {
      this.audio.playCreak(maxStress);
    }

    // Audio tracking for vehicle engine
    this.audio.updateEngineSound(
      this.vehicle.status === 'DRIVING',
      Math.abs(this.vehicle.vx),
      this.vehicle.maxSpeed
    );

    // Check success or crash outcomes
    if (this.vehicle.status === 'SUCCESS' && this.metrics.status !== 'CLEARED') {
      this.metrics.status = 'CLEARED';
      this.audio.playVictory();
      this.notify();
    } else if (this.vehicle.status === 'CRASHED' && this.metrics.status !== 'COLLAPSED') {
      this.metrics.status = 'COLLAPSED';
      this.audio.playSplash();
      this.notify();
    }

    this.updateMetrics();
    if (this.frameCount % 2 === 0) {
      this.notify();
    }
  }

  private updateMetrics(): void {
    const cost = TrussPhysicsEngine.computeTotalBudget(this.members);
    const broken = this.members.filter((m) => m.isBroken).length;

    this.metrics = {
      ...this.metrics,
      currentCost: cost,
      budget: this.currentLevel.budget,
      nodeCount: this.nodes.length,
      memberCount: this.members.length,
      brokenMemberCount: broken,
    };
  }

  public dispose(): void {
    this.audio.dispose();
    this.subscribers.clear();
  }
}
