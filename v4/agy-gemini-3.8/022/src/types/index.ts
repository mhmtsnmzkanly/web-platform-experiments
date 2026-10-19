/**
 * POWDER-BOX (EXP-022) — Data Models & System Types
 * Granular Materials, Multi-Phase Fluids, Thermodynamics & Cellular Automata
 */

export type ElementType =
  | 'EMPTY'
  | 'SAND'
  | 'WATER'
  | 'FIRE'
  | 'WOOD'
  | 'STONE'
  | 'GUNPOWDER'
  | 'OIL'
  | 'ACID'
  | 'LAVA'
  | 'ICE'
  | 'PLANT'
  | 'STEAM'
  | 'SMOKE'
  | 'GLASS'
  | 'IRON';

export type StateCategory = 'SOLID' | 'POWDER' | 'LIQUID' | 'GAS' | 'ENERGY';

export interface ElementDefinition {
  id: number;
  type: ElementType;
  name: string;
  category: StateCategory;
  density: number; // kg/m^3 (relative sort index)
  color: [number, number, number, number]; // RGBA [0-255]
  colorVariation?: number; // Random brightness jitter
  thermalConductivity: number; // 0.0 to 1.0 (Laplacian weight)
  baseTemp: number; // Celsius ambient creation
  flammability: number; // 0.0 (immune) to 1.0 (instant flash)
  dispersionRate: number; // Lateral cell slide count for liquids/gases
  dissolvableByAcid: boolean;
  meltTemp?: number;
  meltTarget?: ElementType;
  boilTemp?: number;
  boilTarget?: ElementType;
  freezeTemp?: number;
  freezeTarget?: ElementType;
}

export type BrushTool =
  | ElementType
  | 'ERASER'
  | 'HEAT_BRUSH'
  | 'COOL_BRUSH'
  | 'SPARK';

export interface SandboxMetrics {
  totalCells: number;
  activeParticles: number;
  meanTemperature: number; // Celsius
  maxTemperature: number; // Celsius
  reactionCount: number; // Reaction events per second
  fps: number;
}

export type PresetType =
  | 'HOURGLASS'
  | 'OIL_SPILL'
  | 'VOLCANO'
  | 'ACID_CHAMBER'
  | 'FOREST_FIRE'
  | 'STEAM_ENGINE';

export interface PresetDefinition {
  type: PresetType;
  name: string;
  description: string;
  width: number;
  height: number;
}
