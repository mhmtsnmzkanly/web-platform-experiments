export type FluidType = 'WATER' | 'VISCOUS_OIL' | 'BIOLUMINESCENT';

export interface FluidParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number;
  fy: number;
  density: number;
  pressure: number;
  type: FluidType;
  color: string;
}

export interface SPHParams {
  restDensity: number; // kg/m^3 (approx 1000)
  stiffness: number; // Gas constant k
  viscosity: number; // Dynamic viscosity
  smoothingRadius: number; // h kernel radius
  gravityX: number;
  gravityY: number;
  surfaceTension: number;
  restitution: number; // wall bounce damping
}

export interface ReactionDiffusionParams {
  Da: number; // Diffusion rate U
  Db: number; // Diffusion rate V
  feed: number; // Feed rate F
  kill: number; // Kill rate K
  iterationsPerFrame: number;
}

export type SimulationMode = 'SPH_PARTICLES' | 'REACTION_DIFFUSION' | 'COUPLED_MORPHOGENESIS';

export type ToolMode = 'EMIT_FLUID' | 'DRAW_OBSTACLE' | 'PLACE_VORTEX' | 'STIR_FORCE' | 'ERASE';

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  radius?: number;
  width?: number;
  height?: number;
  type: 'CIRCLE' | 'RECT';
}

export interface Vortex {
  id: string;
  x: number;
  y: number;
  strength: number; // Positive = clockwise, negative = counter-clockwise
  radius: number;
}

export interface FluidTelemetry {
  particleCount: number;
  kineticEnergy: number;
  maxPressure: number;
  fps: number;
  reynoldsNumber: number;
}
