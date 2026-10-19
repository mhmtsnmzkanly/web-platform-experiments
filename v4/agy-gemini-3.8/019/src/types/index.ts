/**
 * Types and interfaces for BAND-FORGE studio.
 */

import { LatticeType } from '../physics/TightBindingSolver.js';

export type SuiteMode =
  | 'BAND_STRUCTURE'
  | 'FERMI_SURFACE'
  | 'TOPOLOGICAL_CHERN'
  | 'HOFSTADTER_FRACTAL'
  | 'PHONON_DISPERSION';

export type PresetId =
  | 'GRAPHENE_DIRAC'
  | 'HALDANE_CHERN_INSULATOR'
  | 'SSH_TOPOLOGICAL_CHAIN'
  | 'SQUARE_VAN_HOVE'
  | 'HOFSTADTER_QUANTUM_HALL'
  | 'SILICON_DIATOMIC_PHONON';

export interface SimulationParameters {
  // Mode & General
  suiteMode: SuiteMode;
  activePresetId?: PresetId;
  latticeType: LatticeType;
  latticeConstant: number; // in Angstroms

  // Tight Binding
  t: number;      // Nearest neighbor hopping in eV
  tp: number;     // Next-nearest neighbor hopping in eV
  ef: number;     // Fermi energy in eV

  // Topological / SSH / Haldane
  t1_ssh: number; // Intra-cell hopping in eV
  t2_ssh: number; // Inter-cell hopping in eV
  haldane_t1: number;
  haldane_t2: number;
  haldane_phi: number; // in radians
  haldane_M: number;   // Semenoff mass in eV

  // Magnetic Field / Hofstadter
  magFluxAlpha: number; // Flux fraction alpha = p/q in [0, 1]
  maxHarperQ: number;   // Max denominator for fractal butterfly

  // Phonons
  M1_amu: number; // Mass 1 in amu
  M2_amu: number; // Mass 2 in amu
  Cs_force: number; // Spring constant in N/m

  // Active k-probe in reciprocal space (draggable probe)
  probeKx: number;
  probeKy: number;
}

export interface SimulationTelemetry {
  bandGap: number;        // in eV
  fermiVelocity: number;  // in km/s
  chernNumber: number;    // Topological invariant C in Z
  windingNumber: number;  // 1D topological invariant nu in {0, 1}
  soundSpeed: number;     // in km/s
  opticalFreq0: number;   // in rad/ps
  measuredFps: number;    // Real wall-clock frame rate
  simTime: number;        // Continuous simulation time
  isTopological: boolean;
}

export interface PresetConfig {
  id: PresetId;
  name: string;
  subtitle: string;
  description: string;
  mode: SuiteMode;
  params: Partial<SimulationParameters>;
}
