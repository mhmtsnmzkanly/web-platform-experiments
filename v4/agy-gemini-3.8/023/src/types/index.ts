/**
 * MARBLE-FORGE (EXP-023) — TypeScript Definitions & Physical Interfaces
 */

export type MarbleMaterial = 'GLASS' | 'STEEL' | 'WOOD' | 'RUBBER';

export interface MarbleDefinition {
  material: MarbleMaterial;
  name: string;
  mass: number; // kg
  radius: number; // meters (e.g. 0.015 m = 1.5 cm)
  restitution: number; // 0 to 1
  rollingFriction: number;
  color: string;
  glowColor: string;
}

export interface Marble {
  id: string;
  x: number; // meters
  y: number; // meters
  vx: number; // m/s
  vy: number; // m/s
  omega: number; // rad/s (angular velocity)
  material: MarbleMaterial;
  mass: number; // kg
  radius: number; // m
  restitution: number;
  isGrounded: boolean;
  trail: Array<{ x: number; y: number }>;
}

export type TrackElementType =
  | 'STRAIGHT_RAIL'
  | 'CURVED_RAIL'
  | 'LOOP_THE_LOOP'
  | 'FUNNEL'
  | 'BUMPER'
  | 'SEESAW'
  | 'DOMINO'
  | 'ARCHIMEDES_LIFT'
  | 'TARGET_BELL'
  | 'MARBLE_SPAWNER';

export interface StraightRail {
  type: 'STRAIGHT_RAIL';
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  friction: number;
}

export interface CurvedRail {
  type: 'CURVED_RAIL';
  id: string;
  cx: number;
  cy: number;
  radius: number;
  startAngle: number; // radians
  endAngle: number; // radians
  friction: number;
}

export interface LoopTheLoop {
  type: 'LOOP_THE_LOOP';
  id: string;
  cx: number;
  cy: number;
  radius: number;
  entrySide: 'LEFT' | 'RIGHT';
}

export interface Funnel {
  type: 'FUNNEL';
  id: string;
  cx: number;
  cy: number;
  outerRadius: number;
  drainRadius: number;
  drainX: number;
  drainY: number;
}

export interface Bumper {
  type: 'BUMPER';
  id: string;
  x: number;
  y: number;
  radius: number;
  kickImpulse: number; // m/s impulse kick
  cooldownTimer: number;
}

export interface Seesaw {
  type: 'SEESAW';
  id: string;
  px: number; // Pivot X
  py: number; // Pivot Y
  length: number; // Total length
  angle: number; // radians
  angularVelocity: number; // rad/s
  minAngle: number; // rad
  maxAngle: number; // rad
  mass: number; // kg
}

export interface Domino {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  angularVelocity: number;
  toppled: boolean;
}

export interface DominoChain {
  type: 'DOMINO';
  id: string;
  dominoes: Domino[];
}

export interface ArchimedesLift {
  type: 'ARCHIMEDES_LIFT';
  id: string;
  x: number;
  bottomY: number;
  topY: number;
  radius: number;
  liftSpeed: number; // m/s
  spiralPhase: number;
}

export interface TargetBell {
  type: 'TARGET_BELL';
  id: string;
  x: number;
  y: number;
  radius: number;
  noteFrequency: number; // Hz (e.g. 523.25 Hz = C5)
  hitCount: number;
  hasTriggeredObjective: boolean;
}

export interface MarbleSpawner {
  type: 'MARBLE_SPAWNER';
  id: string;
  x: number;
  y: number;
  material: MarbleMaterial;
  spawnInterval: number; // seconds
  lastSpawnTime: number;
  spawnVx: number;
  spawnVy: number;
  autoSpawn: boolean;
}

export type TrackElement =
  | StraightRail
  | CurvedRail
  | LoopTheLoop
  | Funnel
  | Bumper
  | Seesaw
  | DominoChain
  | ArchimedesLift
  | TargetBell
  | MarbleSpawner;

export type ToolType =
  | 'SELECT'
  | 'STRAIGHT_RAIL'
  | 'CURVED_RAIL'
  | 'LOOP_THE_LOOP'
  | 'FUNNEL'
  | 'BUMPER'
  | 'SEESAW'
  | 'DOMINO'
  | 'ARCHIMEDES_LIFT'
  | 'TARGET_BELL'
  | 'MARBLE_SPAWNER'
  | 'DELETE';

export interface LevelDefinition {
  id: number;
  name: string;
  tagline: string;
  briefing: string;
  requiredHits: number;
  availableTools: ToolType[];
  elements: TrackElement[];
  spawnMaterial: MarbleMaterial;
  bounds: { width: number; height: number }; // meters (e.g. 12m x 8m)
}

export interface SimulationMetrics {
  activeMarbles: number;
  completedBellHits: number;
  kineticEnergy: number; // Joules
  potentialEnergy: number; // Joules
  totalEnergy: number; // Joules
  maxVelocity: number; // m/s
  fps: number;
  isObjectiveMet: boolean;
}
