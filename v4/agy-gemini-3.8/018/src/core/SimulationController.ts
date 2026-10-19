/**
 * STELLAR-FORGE Unified Simulation Controller
 * Single-owner state controller and physical clock conforming to Hardening Protocol 2.0.
 */

import { CONSTANTS } from '../physics/PhysicalConstants.js';
import { LaneEmdenSolver, StellarRadialProfile } from '../physics/LaneEmdenSolver.js';
import { NuclearKinetics, NuclearEmissivityResult } from '../physics/NuclearKinetics.js';
import { DegeneracyPhysics } from '../physics/DegeneracyPhysics.js';
import { TovSolver, TovSolution } from '../physics/TovSolver.js';
import { SupernovaCollapseEngine, SupernovaState } from '../physics/SupernovaCollapseEngine.js';
import { PresetId, PresetConfig, StellarTelemetry, SuiteMode } from '../types/index.js';

export const STELLAR_PRESETS: Record<PresetId, PresetConfig> = {
  SUN_ZAMS: {
    id: 'SUN_ZAMS',
    name: 'Sun (Zero-Age Main Sequence)',
    category: 'MAIN_SEQUENCE',
    description: '1.0 M☉ G2V star in hydrostatic equilibrium with n=3 polytropic radiative core and p-p chain dominance.',
    massSolar: 1.0,
    radiusSolar: 1.0,
    polytropicIndexN: 3.0,
    centralDensityKgM3: 1.5e5,
    centralTemperatureK: 1.57e7,
    composition: { X: 0.73, Y: 0.25, Z: 0.02 },
    equationOfState: 'IDEAL_GAS',
  },
  SIRIUS_A: {
    id: 'SIRIUS_A',
    name: 'Sirius A (Early A-Type)',
    category: 'MAIN_SEQUENCE',
    description: '2.02 M☉ star with convective core powered by steep CNO cycle (T > 20 MK) and radiative envelope.',
    massSolar: 2.02,
    radiusSolar: 1.71,
    polytropicIndexN: 3.0,
    centralDensityKgM3: 1.0e5,
    centralTemperatureK: 2.3e7,
    composition: { X: 0.71, Y: 0.27, Z: 0.02 },
    equationOfState: 'IDEAL_GAS',
  },
  BETELGEUSE_SUPERGIANT: {
    id: 'BETELGEUSE_SUPERGIANT',
    name: 'Betelgeuse Progenitor (Massive Supergiant)',
    category: 'MASSIVE_STAR',
    description: '16.5 M☉ red supergiant with advanced concentric onion-skin nuclear burning shells and iron core.',
    massSolar: 16.5,
    radiusSolar: 760.0,
    polytropicIndexN: 3.0,
    centralDensityKgM3: 3.0e9,
    centralTemperatureK: 3.5e9,
    composition: { X: 0.30, Y: 0.40, Z: 0.30 },
    equationOfState: 'IDEAL_GAS',
  },
  SIRIUS_B_WHITE_DWARF: {
    id: 'SIRIUS_B_WHITE_DWARF',
    name: 'Sirius B (Carbon-Oxygen White Dwarf)',
    category: 'COMPACT_OBJECT',
    description: '1.02 M☉ degenerate compact core supported by non-relativistic electron degeneracy pressure (n=1.5).',
    massSolar: 1.02,
    radiusSolar: 0.0084,
    polytropicIndexN: 1.5,
    centralDensityKgM3: 3.0e9,
    centralTemperatureK: 1.2e7,
    composition: { X: 0.00, Y: 0.00, Z: 1.00 },
    equationOfState: 'DEGENERATE_NON_REL',
  },
  CHANDRASEKHAR_LIMIT: {
    id: 'CHANDRASEKHAR_LIMIT',
    name: 'Chandrasekhar Threshold Core',
    category: 'COMPACT_OBJECT',
    description: '1.44 M☉ ultra-relativistic electron degenerate core at the edge of gravitational instability (n=3.0).',
    massSolar: 1.44,
    radiusSolar: 0.0035,
    polytropicIndexN: 3.0,
    centralDensityKgM3: 2.5e12,
    centralTemperatureK: 5.0e7,
    composition: { X: 0.00, Y: 0.00, Z: 1.00 },
    equationOfState: 'DEGENERATE_REL',
  },
  CRAB_PULSAR_TOV: {
    id: 'CRAB_PULSAR_TOV',
    name: 'Crab Pulsar (TOV Relativistic Neutron Star)',
    category: 'COMPACT_OBJECT',
    description: '1.4 M☉ neutron star governed by Tolman-Oppenheimer-Volkoff general relativistic metric equilibrium.',
    massSolar: 1.4,
    radiusSolar: 1.65e-5, // ~11.5 km
    polytropicIndexN: 1.0, // Stiff nuclear equation of state Gamma=2 -> n=1
    centralDensityKgM3: 1.0e18,
    centralTemperatureK: 1.0e6,
    composition: { X: 0.00, Y: 0.00, Z: 1.00 },
    equationOfState: 'TOV_NUCLEAR',
  },
};

export interface StellarSimulationState {
  currentPreset: PresetId;
  mode: SuiteMode;
  massSolar: number;
  radiusSolar: number;
  polytropicIndexN: number;
  centralDensityKgM3: number;
  centralTemperatureK: number;
  composition: { X: number; Y: number; Z: number };
  equationOfState: 'IDEAL_GAS' | 'DEGENERATE_NON_REL' | 'DEGENERATE_REL' | 'TOV_NUCLEAR';
  profile: StellarRadialProfile;
  luminosityResult: { totalLuminosityW: number; luminosityRatioSun: number; emissivities: NuclearEmissivityResult[] };
  tovSolution: TovSolution | null;
  supernovaState: SupernovaState;
  isPaused: boolean;
  timeScale: number;
  simulationTimeS: number;
  measuredFps: number;
}

export type StateListener = (state: StellarSimulationState) => void;

export class SimulationController {
  private state: StellarSimulationState;
  private listeners: Set<StateListener> = new Set();
  private lastFrameWallTime: number = performance.now();
  private frameCount: number = 0;
  private fpsAccumulatorTime: number = performance.now();
  private currentFps: number = 60.0;

  constructor(initialPreset: PresetId = 'SUN_ZAMS') {
    this.state = this.buildInitialState(initialPreset);
  }

  private buildInitialState(presetId: PresetId): StellarSimulationState {
    const preset = STELLAR_PRESETS[presetId];
    const totalMassKg = preset.massSolar * CONSTANTS.M_sun;

    // Solve hydrostatic Lane-Emden profile
    const profile = LaneEmdenSolver.computePhysicalProfile(
      preset.polytropicIndexN,
      totalMassKg,
      preset.centralDensityKgM3
    );

    // Compute nuclear kinetics & luminosity
    const lum = NuclearKinetics.integrateLuminosity(
      profile.points,
      preset.composition.X,
      preset.composition.Y,
      preset.composition.Z
    );

    // If compact object or TOV preset, solve TOV
    const isTov = preset.equationOfState === 'TOV_NUCLEAR';
    const tovSolution = isTov ? TovSolver.solve(preset.centralDensityKgM3) : null;

    const supernovaState: SupernovaState = {
      isCollapsing: false,
      collapseTimeMs: 0,
      bounceOccurred: false,
      shockRadiusMeters: 0,
      shockVelocityKmS: 0,
      neutrinoLuminosityW: 0,
      remnantType: 'NEUTRON_STAR',
      remnantMassSolar: 1.4,
      abundances: SupernovaCollapseEngine.initialPreSupernovaAbundances(),
    };

    return {
      currentPreset: presetId,
      mode: 'INTERIOR_PROFILES',
      massSolar: preset.massSolar,
      radiusSolar: preset.radiusSolar,
      polytropicIndexN: preset.polytropicIndexN,
      centralDensityKgM3: preset.centralDensityKgM3,
      centralTemperatureK: preset.centralTemperatureK,
      composition: { ...preset.composition },
      equationOfState: preset.equationOfState,
      profile,
      luminosityResult: lum,
      tovSolution,
      supernovaState,
      isPaused: false,
      timeScale: 1.0,
      simulationTimeS: 0,
      measuredFps: 60.0,
    };
  }

  public getState(): Readonly<StellarSimulationState> {
    return this.state;
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  public setMode(mode: SuiteMode): void {
    this.state.mode = mode;
    this.notify();
  }

  public loadPreset(presetId: PresetId): void {
    this.state = this.buildInitialState(presetId);
    this.notify();
  }

  public updateParameters(params: {
    massSolar?: number;
    polytropicIndexN?: number;
    centralDensityKgM3?: number;
    centralTemperatureK?: number;
    X?: number;
    Y?: number;
    Z?: number;
    equationOfState?: 'IDEAL_GAS' | 'DEGENERATE_NON_REL' | 'DEGENERATE_REL' | 'TOV_NUCLEAR';
  }): void {
    if (params.massSolar !== undefined) this.state.massSolar = Math.max(0.08, Math.min(100.0, params.massSolar));
    if (params.polytropicIndexN !== undefined) this.state.polytropicIndexN = Math.max(0.5, Math.min(4.8, params.polytropicIndexN));
    if (params.centralDensityKgM3 !== undefined) this.state.centralDensityKgM3 = Math.max(10.0, Math.min(1e19, params.centralDensityKgM3));
    if (params.centralTemperatureK !== undefined) this.state.centralTemperatureK = Math.max(1e5, Math.min(1e10, params.centralTemperatureK));
    if (params.equationOfState !== undefined) this.state.equationOfState = params.equationOfState;

    if (params.X !== undefined || params.Y !== undefined || params.Z !== undefined) {
      let X = params.X !== undefined ? params.X : this.state.composition.X;
      let Y = params.Y !== undefined ? params.Y : this.state.composition.Y;
      let Z = params.Z !== undefined ? params.Z : this.state.composition.Z;
      const sum = X + Y + Z;
      if (sum > 0) {
        X /= sum;
        Y /= sum;
        Z /= sum;
      }
      this.state.composition = { X, Y, Z };
    }

    // Recompute physics
    this.recomputePhysics();
    this.notify();
  }

  private recomputePhysics(): void {
    const totalMassKg = this.state.massSolar * CONSTANTS.M_sun;
    this.state.profile = LaneEmdenSolver.computePhysicalProfile(
      this.state.polytropicIndexN,
      totalMassKg,
      this.state.centralDensityKgM3
    );

    this.state.radiusSolar = this.state.profile.totalRadiusM / CONSTANTS.R_sun;

    this.state.luminosityResult = NuclearKinetics.integrateLuminosity(
      this.state.profile.points,
      this.state.composition.X,
      this.state.composition.Y,
      this.state.composition.Z
    );

    if (this.state.equationOfState === 'TOV_NUCLEAR' || this.state.centralDensityKgM3 > 1e16) {
      this.state.tovSolution = TovSolver.solve(this.state.centralDensityKgM3);
    } else {
      this.state.tovSolution = null;
    }
  }

  public triggerSupernovaCollapse(): void {
    this.state.supernovaState = {
      isCollapsing: true,
      collapseTimeMs: 0,
      bounceOccurred: false,
      shockRadiusMeters: 0,
      shockVelocityKmS: 0,
      neutrinoLuminosityW: 1e39,
      remnantType: this.state.massSolar >= 25.0 ? 'BLACK_HOLE' : 'NEUTRON_STAR',
      remnantMassSolar: this.state.massSolar >= 25.0 ? this.state.massSolar * 0.35 : 1.4,
      abundances: SupernovaCollapseEngine.initialPreSupernovaAbundances(),
    };
    this.notify();
  }

  public resetSupernova(): void {
    this.state.supernovaState = {
      isCollapsing: false,
      collapseTimeMs: 0,
      bounceOccurred: false,
      shockRadiusMeters: 0,
      shockVelocityKmS: 0,
      neutrinoLuminosityW: 0,
      remnantType: 'NEUTRON_STAR',
      remnantMassSolar: 1.4,
      abundances: SupernovaCollapseEngine.initialPreSupernovaAbundances(),
    };
    this.notify();
  }

  public togglePause(): void {
    this.state.isPaused = !this.state.isPaused;
    this.notify();
  }

  public setTimeScale(scale: number): void {
    this.state.timeScale = Math.max(0.1, Math.min(10.0, scale));
    this.notify();
  }

  public tick(wallDeltaMs: number): void {
    // Measure genuine rendering frame rate over 500 ms window
    this.frameCount++;
    const now = performance.now();
    if (now - this.fpsAccumulatorTime >= 500.0) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.fpsAccumulatorTime));
      this.frameCount = 0;
      this.fpsAccumulatorTime = now;
      this.state.measuredFps = this.currentFps;
      this.notify();
    }

    if (this.state.isPaused) return;

    const dtSeconds = (wallDeltaMs / 1000.0) * this.state.timeScale;
    this.state.simulationTimeS += dtSeconds;

    // Advance supernova collapse if active
    if (this.state.supernovaState.isCollapsing) {
      this.state.supernovaState = SupernovaCollapseEngine.stepCollapse(
        this.state.supernovaState,
        this.state.massSolar,
        dtSeconds * 0.1 // Scaled to allow visual observation of the 200ms blast
      );
      this.notify();
    }
  }

  public getTelemetry(): StellarTelemetry {
    const s = this.state;
    const { massSolar: mChSolar } = DegeneracyPhysics.chandrasekharMass(2.0);
    const totalMassKg = s.massSolar * CONSTANTS.M_sun;
    const rWdM = DegeneracyPhysics.whiteDwarfRadius(totalMassKg, 2.0);
    const x_rel = DegeneracyPhysics.relativityParameter(s.centralDensityKgM3, 2.0);

    const P_deg = DegeneracyPhysics.electronDegeneracyPressure(s.centralDensityKgM3, 2.0);
    const P_total = s.profile.centralPressurePa;
    const degFraction = Math.max(0, Math.min(1.0, P_deg / Math.max(1, P_total)));

    // Stefan-Boltzmann Effective Temperature: L = 4*pi*R^2 * sigma * Teff^4
    const totalL_W = Math.max(1e20, s.luminosityResult.totalLuminosityW);
    const totalR_M = s.profile.totalRadiusM;
    const teff4 = totalL_W / (4 * Math.PI * Math.pow(totalR_M, 2) * CONSTANTS.sigma_SB);
    const effectiveTemperatureK = Math.max(1000, Math.pow(Math.max(1, teff4), 0.25));

    const emissivities = s.luminosityResult.emissivities;
    const dominantNuclearProcess = emissivities.length > 0 ? emissivities[0].dominantProcess : 'INERT';

    return {
      massSolar: s.massSolar,
      radiusSolar: s.radiusSolar,
      polytropicIndexN: s.polytropicIndexN,
      centralDensityKgM3: s.centralDensityKgM3,
      centralPressurePa: s.profile.centralPressurePa,
      centralTemperatureK: s.profile.centralTemperatureK,
      totalLuminositySolar: s.luminosityResult.luminosityRatioSun,
      effectiveTemperatureK,
      dominantNuclearProcess,
      chandrasekharMassLimitSolar: mChSolar,
      whiteDwarfRadiusSolar: rWdM / CONSTANTS.R_sun,
      electronRelativityParameterX: x_rel,
      degeneracyDegFraction: degFraction,
      tovCompactness: s.tovSolution ? s.tovSolution.compactness : 0,
      tovRedshift: s.tovSolution ? s.tovSolution.gravitationalRedshift : 0,
      collapseActive: s.supernovaState.isCollapsing,
      collapseTimeMs: s.supernovaState.collapseTimeMs,
      shockRadiusKm: s.supernovaState.shockRadiusMeters / 1000.0,
      neutrinoLuminosityW: s.supernovaState.neutrinoLuminosityW,
      simulationTimeS: s.simulationTimeS,
      fps: s.measuredFps,
    };
  }
}
