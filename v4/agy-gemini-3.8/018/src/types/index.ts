/**
 * STELLAR-FORGE Type Definitions
 * Strict types for state, astrophysical telemetry, modes, presets, and nucleosynthesis.
 */

import { StellarRadialProfile } from '../physics/LaneEmdenSolver.js';
import { NuclearEmissivityResult } from '../physics/NuclearKinetics.js';
import { TovSolution } from '../physics/TovSolver.js';
import { IsotopeAbundance, SupernovaState } from '../physics/SupernovaCollapseEngine.js';

export type SuiteMode =
  | 'INTERIOR_PROFILES'
  | 'ONION_CORE_CROSS_SECTION'
  | 'HR_EVOLUTIONARY_TRACK'
  | 'NUCLEOSYNTHESIS_CHART';

export type PresetId =
  | 'SUN_ZAMS'
  | 'SIRIUS_A'
  | 'BETELGEUSE_SUPERGIANT'
  | 'SIRIUS_B_WHITE_DWARF'
  | 'CHANDRASEKHAR_LIMIT'
  | 'CRAB_PULSAR_TOV';

export interface PresetConfig {
  id: PresetId;
  name: string;
  category: 'MAIN_SEQUENCE' | 'MASSIVE_STAR' | 'COMPACT_OBJECT';
  description: string;
  massSolar: number;
  radiusSolar: number;
  polytropicIndexN: number;
  centralDensityKgM3: number;
  centralTemperatureK: number;
  composition: {
    X: number; // Hydrogen
    Y: number; // Helium
    Z: number; // Metallicity
  };
  equationOfState: 'IDEAL_GAS' | 'DEGENERATE_NON_REL' | 'DEGENERATE_REL' | 'TOV_NUCLEAR';
}

export interface StellarTelemetry {
  massSolar: number;
  radiusSolar: number;
  polytropicIndexN: number;
  centralDensityKgM3: number;
  centralPressurePa: number;
  centralTemperatureK: number;
  totalLuminositySolar: number;
  effectiveTemperatureK: number;
  dominantNuclearProcess: 'PP_CHAIN' | 'CNO_CYCLE' | 'TRIPLE_ALPHA' | 'ADVANCED_SHELL' | 'INERT';
  chandrasekharMassLimitSolar: number;
  whiteDwarfRadiusSolar: number;
  electronRelativityParameterX: number;
  degeneracyDegFraction: number; // Fraction of pressure provided by degeneracy
  tovCompactness: number;
  tovRedshift: number;
  collapseActive: boolean;
  collapseTimeMs: number;
  shockRadiusKm: number;
  neutrinoLuminosityW: number;
  simulationTimeS: number;
  fps: number;
}

export interface HrStarPoint {
  name: string;
  logTeff: number;
  logLuminosity: number;
  color: string;
  size: number;
}
