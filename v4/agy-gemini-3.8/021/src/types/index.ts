/**
 * PONTIFEX (EXP-021) — Data Models & System Types
 * 2D Truss Mechanics, Materials, Vehicle Kinematics & Levels
 */

export type MaterialType = 'ROAD' | 'WOOD' | 'STEEL' | 'CABLE' | 'HYDRAULIC';

export interface MaterialProperties {
  type: MaterialType;
  name: string;
  density: number; // kg/m
  stiffness: number; // N/m (Hooke constant k)
  damping: number; // N*s/m
  breakForce: number; // N (failure load)
  costPerMeter: number; // $ per meter
  color: string;
  stressColor: string;
  lineWidth: number;
  isDeck: boolean; // Can vehicle wheels roll on this?
  canCompress: boolean; // Cable has false
}

export interface TrussNode {
  id: string;
  x: number; // meters
  y: number; // meters
  vx: number; // m/s
  vy: number; // m/s
  fx: number; // N
  fy: number; // N
  extFx?: number; // External force accumulator (e.g. from vehicle wheels)
  extFy?: number; // External force accumulator (e.g. from vehicle wheels)
  mass: number; // kg
  isAnchor: boolean; // Fixed to rock/cliff
}

export interface TrussMember {
  id: string;
  nodeAId: string;
  nodeBId: string;
  material: MaterialType;
  restLength: number; // meters
  currentLength: number; // meters
  force: number; // N (signed: > 0 tension, < 0 compression)
  stress: number; // 0.0 to 1.0+ (normalized ratio to breakForce)
  isBroken: boolean;
  brokenTime?: number;
}

export interface WheelState {
  relX: number; // relative to chassis center (m)
  relY: number; // relative to chassis center (m)
  worldX: number;
  worldY: number;
  vx: number;
  vy: number;
  radius: number; // m
  onRoad: boolean;
  contactRoadId?: string;
}

export interface VehicleState {
  type: 'CAR' | 'TRUCK' | 'TRAIN' | 'MONSTER_TRUCK';
  name: string;
  x: number; // Chassis center of mass x (m)
  y: number; // Chassis center of mass y (m)
  vx: number;
  vy: number;
  angle: number; // radians
  angularVelocity: number; // rad/s
  mass: number; // kg
  length: number; // m
  height: number; // m
  frontWheel: WheelState;
  rearWheel: WheelState;
  driveForce: number; // N
  maxSpeed: number; // m/s
  isGrounded: boolean;
  status: 'READY' | 'DRIVING' | 'SUCCESS' | 'CRASHED';
}

export interface CliffTerrain {
  leftX: number;
  leftY: number;
  leftWidth: number;
  rightX: number;
  rightY: number;
  rightWidth: number;
  gapWidth: number;
  waterLevelY: number;
  rockPillars?: { x: number; y: number; width: number; height: number }[];
}

export interface BridgeLevel {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  budget: number; // $ max budget limit
  targetFlagX: number;
  anchorNodes: { x: number; y: number }[];
  terrain: CliffTerrain;
  vehicle: 'CAR' | 'TRUCK' | 'TRAIN' | 'MONSTER_TRUCK';
  allowedMaterials: MaterialType[];
}

export interface BridgeMetrics {
  currentCost: number;
  budget: number;
  maxStress: number; // 0.0 to 1.0+
  nodeCount: number;
  memberCount: number;
  brokenMemberCount: number;
  status: 'BUILDING' | 'TESTING' | 'CLEARED' | 'COLLAPSED';
}
