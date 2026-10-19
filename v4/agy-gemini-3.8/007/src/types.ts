export type DietType = 'HERBIVORE' | 'CARNIVORE' | 'OMNIVORE' | 'PHOTOTROPH';

export type MicroscopyMode = 'DARK_FIELD' | 'PHASE_CONTRAST' | 'FLUORESCENT_GFP' | 'BRIGHT_FIELD';

export type InterventionTool =
  | 'SELECT_INSPECT'
  | 'PIPETTE_NUTRIENT'
  | 'MUTAGEN_BEAM'
  | 'CRISPR_INJECT'
  | 'EXTERMINATE';

export interface Genome {
  id: string;
  speciesName: string;
  generation: number;
  hue: number; // 0 - 360
  size: number; // 6 - 22 px
  maxSpeed: number; // 60 - 240 px/s
  flagellaCount: number; // 1 - 6
  sensorRange: number; // 50 - 280 px
  sensorFov: number; // 0.8 - 3.14 rad
  diet: DietType;
  metabolicEfficiency: number; // 0.5 - 2.0
  toxinResistance: number; // 0 - 1.0
  mitosisEnergy: number; // 80 - 240
  mutationRate: number; // 0.02 - 0.25
  brainWeights: number[]; // 82 weights (8 in * 6 hid + 6 bias + 6 hid * 4 out + 4 bias)
}

export interface Organism {
  id: string;
  genome: Genome;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  energy: number;
  maxEnergy: number;
  health: number;
  age: number;
  generation: number;
  kills: number;
  offspringCount: number;
  flagellaPhases: number[];
  membraneWobble: number;
  brainActivations: {
    inputs: number[];
    hidden: number[];
    outputs: number[];
  };
}

export interface Nutrient {
  id: number;
  x: number;
  y: number;
  radius: number;
  energyValue: number;
  age: number;
  type: 'PLANT' | 'MEAT';
}

export interface EnvironmentalZone {
  id: string;
  type: 'RADIATION_HOTSPOT' | 'TOXIN_POLLUTION' | 'NUTRIENT_VENT';
  x: number;
  y: number;
  radius: number;
  intensity: number;
}

export interface EcosystemTelemetry {
  totalOrganisms: number;
  herbivoreCount: number;
  carnivoreCount: number;
  phototrophCount: number;
  omnivoreCount: number;
  totalNutrients: number;
  avgLifespan: number;
  shannonDiversityIndex: number;
  peakGeneration: number;
  fps: number;
}

export interface EcosystemParams {
  ambientLight: number; // 0.1 to 1.0 (drives phototroph energy)
  radiationLevel: number; // 0 to 4.0 (boosts mutation chances)
  nutrientRegenRate: number; // 0.2 to 4.0
  fluidViscosity: number; // 0.85 to 0.98
  maxOrganisms: number; // 80 to 250
}
