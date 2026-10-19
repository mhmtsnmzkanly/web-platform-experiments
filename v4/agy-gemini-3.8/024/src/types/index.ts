/**
 * POCKET-TERRARIUM (EXP-024) — Types & Biochemical Ecological Interfaces
 */

export interface WaterParameters {
  dissolvedOxygen: number; // mg/L (ppm), e.g. 1.0 to 12.0
  ammonia: number;         // mg/L (ppm), toxic NH3 / TAN
  nitrite: number;         // mg/L (ppm), toxic NO2-
  nitrate: number;         // mg/L (ppm), plant nutrient NO3-
  pH: number;              // 6.0 to 9.0
  temperature: number;     // °C, e.g. 24.0°C
  volume: number;          // Liters, default 25.0 L
  nitrosomonas: number;    // Bacterial biomass (NH3 -> NO2)
  nitrobacter: number;     // Bacterial biomass (NO2 -> NO3)
}

export interface AquaticPlant {
  id: string;
  x: number;       // Normalized 0.0 to 1.0
  y: number;       // Base position (bottom substrate)
  height: number;  // Current height (meters or relative)
  maxHeight: number;
  biomass: number; // grams
  health: number;  // 0.0 to 1.0
  swayPhase: number;
}

export interface Zooplankton {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  satiety: number; // 0 to 1
  health: number;  // 0 to 1
  age: number;     // seconds
}

export interface AquaticSnail {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  surface: 'GLASS_LEFT' | 'GLASS_RIGHT' | 'SUBSTRATE' | 'FREE';
  health: number;
  size: number;
  raspTimer: number;
}

export interface GuppyFish {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  speed: number;
  color: string;
  finColor: string;
  size: number;    // length in meters/pixels
  satiety: number; // 0.0 to 1.0
  energy: number;  // Reproductive / survival energy
  isFry: boolean;  // Baby fish
  health: number;  // 0.0 to 1.0
  tailPhase: number;
  handlingCooldown?: number; // Holling Type II prey handling time cooldown
}

export interface FoodParticle {
  id: string;
  x: number;
  y: number;
  vy: number;
  nutrition: number;
}

export interface AirBubble {
  id: string;
  x: number;
  y: number;
  radius: number;
  vy: number;
  vx: number;
}

export interface AlgaeState {
  planktonicDensity: number; // Algae cells/mL (green water)
  glassBiofilm: number;      // Glass surface algae density (0 to 1)
}

export interface TerrariumEnvironment {
  simTime: number;           // Elapsed simulation seconds
  dayTimeHours: number;      // 0.0 to 24.0 hours (diurnal clock)
  naturalLight: number;      // 0.0 to 1.0 (sunlight)
  lampPower: number;         // 0.0 to 1.0 (LED fixture)
  effectiveLight: number;    // naturalLight + lampPower
  isBubblerActive: boolean;  // Air pump state
  heaterTargetTemp: number;  // °C
}

export type ToolType =
  | 'OBSERVE'
  | 'FEED'
  | 'ADD_PLANT'
  | 'ADD_FISH'
  | 'ADD_SNAIL'
  | 'ADD_DAPHNIA'
  | 'ADD_BACTERIA'
  | 'WATER_CHANGE_20'
  | 'WATER_CHANGE_50'
  | 'TOGGLE_BUBBLER'
  | 'TOGGLE_LAMP'
  | 'NET_FISH'
  | 'SCRUB_GLASS';

export interface EcosystemMetrics {
  fishCount: number;
  fryCount: number;
  snailCount: number;
  daphniaCount: number;
  plantCount: number;
  totalBiomassGrams: number;
  waterQualityIndex: number; // 0 to 100 score
  waterParameters: WaterParameters;
  environment: TerrariumEnvironment;
  measuredFps: number;
  isEquilibrium: boolean;
  warnings: string[];
}

export interface ScenarioPreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  water: WaterParameters;
  fishCount: number;
  snailCount: number;
  daphniaCount: number;
  plantCount: number;
  planktonicAlgae: number;
  glassBiofilm: number;
  lampPower: number;
  isBubblerActive: boolean;
}
