/**
 * SimulationController.ts
 * Central authoritative state owner and simulation clock for BAND-FORGE.
 * Follows Single-Owner State Architecture and Unified Simulation Clock requirements.
 */

import { SuiteMode, PresetId, SimulationParameters, SimulationTelemetry, PresetConfig } from '../types/index.js';
import { CONSTANTS } from '../physics/PhysicalConstants.js';
import { TightBindingSolver } from '../physics/TightBindingSolver.js';
import { TopologicalMatter } from '../physics/TopologicalMatter.js';
import { PhononDispersionEngine } from '../physics/PhononDispersionEngine.js';

export const PRESETS: Record<PresetId, PresetConfig> = {
  GRAPHENE_DIRAC: {
    id: 'GRAPHENE_DIRAC',
    name: 'Graphene Dirac Semimetal',
    subtitle: 'Honeycomb lattice, massless Dirac fermions & linear cones',
    description: 'Relativistic dispersion near K points with zero effective mass and v_F ~ 10^6 m/s.',
    mode: 'BAND_STRUCTURE',
    params: {
      suiteMode: 'BAND_STRUCTURE',
      latticeType: 'GRAPHENE',
      latticeConstant: CONSTANTS.GRAPHENE_ACC,
      t: 2.8,
      tp: 0.1,
      ef: 0.0,
      probeKx: (2 * Math.PI) / (3 * Math.sqrt(3) * CONSTANTS.GRAPHENE_ACC),
      probeKy: (2 * Math.PI) / (3 * CONSTANTS.GRAPHENE_ACC)
    }
  },
  HALDANE_CHERN_INSULATOR: {
    id: 'HALDANE_CHERN_INSULATOR',
    name: 'Haldane Chern Insulator',
    subtitle: 'Broken time-reversal symmetry & Quantum Anomalous Hall (C = 1)',
    description: 'Chiral edge states without Landau levels or external magnetic fields.',
    mode: 'TOPOLOGICAL_CHERN',
    params: {
      suiteMode: 'TOPOLOGICAL_CHERN',
      latticeType: 'GRAPHENE',
      latticeConstant: CONSTANTS.GRAPHENE_ACC,
      haldane_t1: 1.0,
      haldane_t2: 0.2,
      haldane_phi: Math.PI / 2,
      haldane_M: 0.0,
      ef: 0.0
    }
  },
  SSH_TOPOLOGICAL_CHAIN: {
    id: 'SSH_TOPOLOGICAL_CHAIN',
    name: '1D SSH Topological Chain',
    subtitle: 'Polyacetylene dimer chain, winding number nu=1 & zero-modes',
    description: 'Dimerized hopping producing topological boundary solitons exponentially localized at the ends.',
    mode: 'BAND_STRUCTURE',
    params: {
      suiteMode: 'BAND_STRUCTURE',
      t1_ssh: 0.4,
      t2_ssh: 1.2,
      ef: 0.0
    }
  },
  SQUARE_VAN_HOVE: {
    id: 'SQUARE_VAN_HOVE',
    name: 'Square Lattice & Van Hove',
    subtitle: '2D square tight-binding & logarithmic saddle-point singularity',
    description: 'Lifshitz topological Fermi surface transition with divergent Density of States at the X point.',
    mode: 'FERMI_SURFACE',
    params: {
      suiteMode: 'FERMI_SURFACE',
      latticeType: 'SQUARE',
      latticeConstant: 3.0,
      t: 1.0,
      tp: 0.15,
      ef: 0.0,
      probeKx: Math.PI / 3.0,
      probeKy: 0.0
    }
  },
  HOFSTADTER_QUANTUM_HALL: {
    id: 'HOFSTADTER_QUANTUM_HALL',
    name: 'Hofstadter Butterfly',
    subtitle: 'Self-similar fractal spectrum under perpendicular magnetic flux',
    description: 'Harper equation eigenspectrum exhibiting Cantor set bandgaps and quantized Diophantine Hall conductance.',
    mode: 'HOFSTADTER_FRACTAL',
    params: {
      suiteMode: 'HOFSTADTER_FRACTAL',
      magFluxAlpha: 0.333333,
      maxHarperQ: 24,
      t: 1.0
    }
  },
  SILICON_DIATOMIC_PHONON: {
    id: 'SILICON_DIATOMIC_PHONON',
    name: 'Silicon-Germanium Lattice Phonons',
    subtitle: 'Acoustic sound wave & optical lattice vibration branches',
    description: 'Harmonic dynamical matrix yielding speed of sound vs ~ 5 km/s and optical phonon bandgap.',
    mode: 'PHONON_DISPERSION',
    params: {
      suiteMode: 'PHONON_DISPERSION',
      M1_amu: 28.0855,
      M2_amu: 72.64,
      Cs_force: 50.0,
      latticeConstant: 5.43
    }
  }
};

export class SimulationController {
  private params: SimulationParameters;
  private isPaused: boolean = false;
  private simTime: number = 0;
  private animFrameId: number | null = null;
  private lastWallTime: number = 0;
  private frameCount: number = 0;
  private lastFpsUpdateTime: number = 0;
  private measuredFps: number = 60;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.params = {
      suiteMode: 'BAND_STRUCTURE',
      activePresetId: 'GRAPHENE_DIRAC',
      latticeType: 'GRAPHENE',
      latticeConstant: CONSTANTS.GRAPHENE_ACC,
      t: 2.8,
      tp: 0.1,
      ef: 0.0,
      t1_ssh: 0.4,
      t2_ssh: 1.2,
      haldane_t1: 1.0,
      haldane_t2: 0.2,
      haldane_phi: Math.PI / 2,
      haldane_M: 0.0,
      magFluxAlpha: 0.333333,
      maxHarperQ: 20,
      M1_amu: 28.0855,
      M2_amu: 72.64,
      Cs_force: 50.0,
      probeKx: (2 * Math.PI) / (3 * Math.sqrt(3) * CONSTANTS.GRAPHENE_ACC),
      probeKy: (2 * Math.PI) / (3 * CONSTANTS.GRAPHENE_ACC)
    };
  }

  public start(): void {
    if (this.animFrameId !== null) return;
    this.lastWallTime = performance.now();
    this.lastFpsUpdateTime = this.lastWallTime;
    this.frameCount = 0;

    const tick = (now: number) => {
      const dtMs = now - this.lastWallTime;
      this.lastWallTime = now;

      // Update frame rate calculation over a 500 ms sliding window
      this.frameCount++;
      const elapsedSinceFps = now - this.lastFpsUpdateTime;
      let fpsUpdated = false;
      if (elapsedSinceFps >= 500) {
        this.measuredFps = Math.round((this.frameCount * 1000) / elapsedSinceFps);
        this.frameCount = 0;
        this.lastFpsUpdateTime = now;
        fpsUpdated = true;
      }

      if (!this.isPaused) {
        this.simTime += dtMs * 0.001;
      }

      // Only notify 60 FPS subscribers if in dynamic mode (Phonon Dispersion lattice wave animation)
      // or if the measured FPS sliding window expired
      if (fpsUpdated || (!this.isPaused && this.params.suiteMode === 'PHONON_DISPERSION')) {
        this.notify();
      }

      this.animFrameId = requestAnimationFrame(tick);
    };

    this.animFrameId = requestAnimationFrame(tick);
  }

  public stop(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  /**
   * Authoritative parameters snapshot.
   * Returns identical object reference unless parameters actually mutate,
   * preserving React pure component and dependency array reference equality.
   */
  public getParameters(): SimulationParameters {
    return this.params;
  }

  public updateParameters(partial: Partial<SimulationParameters>): void {
    this.params = {
      ...this.params,
      ...partial,
      activePresetId: partial.activePresetId !== undefined ? partial.activePresetId : this.params.activePresetId
    };
    this.notify();
  }

  public applyPreset(id: PresetId): void {
    const preset = PRESETS[id];
    if (!preset) return;
    this.params = {
      ...this.params,
      activePresetId: id,
      suiteMode: preset.mode,
      ...preset.params
    };
    this.notify();
  }

  public togglePause(): void {
    this.isPaused = !this.isPaused;
    this.notify();
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  public getSimTime(): number {
    return this.simTime;
  }

  public getTelemetry(): SimulationTelemetry {
    // 1. Band Gap Calculation
    let bandGap = 0;
    if (this.params.suiteMode === 'TOPOLOGICAL_CHERN') {
      const { mK, mKprime } = TopologicalMatter.computeDiracMasses({
        t1: this.params.haldane_t1,
        t2: this.params.haldane_t2,
        phi: this.params.haldane_phi,
        M: this.params.haldane_M
      });
      bandGap = 2 * Math.min(Math.abs(mK), Math.abs(mKprime));
    } else if (this.params.suiteMode === 'BAND_STRUCTURE' && this.params.latticeType === 'GRAPHENE') {
      bandGap = 0; // Dirac semimetal gapless
    } else {
      bandGap = 2 * Math.abs(this.params.t1_ssh - this.params.t2_ssh);
    }

    // 2. Fermi Velocity
    const fermiVelocity =
      TightBindingSolver.computeFermiVelocity(this.params.t, this.params.latticeConstant) / 1000; // in km/s

    // 3. Topological Invariants
    const chernNumber = TopologicalMatter.computeAnalyticalChernNumber({
      t1: this.params.haldane_t1,
      t2: this.params.haldane_t2,
      phi: this.params.haldane_phi,
      M: this.params.haldane_M
    });

    const windingNumber = TopologicalMatter.computeSshWindingNumber(
      this.params.t1_ssh,
      this.params.t2_ssh
    );

    // 4. Phonons
    const soundSpeed =
      PhononDispersionEngine.computeSoundSpeed({
        M1_amu: this.params.M1_amu,
        M2_amu: this.params.M2_amu,
        Cs: this.params.Cs_force,
        a_angstrom: this.params.latticeConstant
      }) / 1000; // in km/s

    const opticalFreq0 = PhononDispersionEngine.computeZoneCenterOpticalFrequency({
      M1_amu: this.params.M1_amu,
      M2_amu: this.params.M2_amu,
      Cs: this.params.Cs_force,
      a_angstrom: this.params.latticeConstant
    });

    const isTopological =
      this.params.suiteMode === 'TOPOLOGICAL_CHERN' ? chernNumber !== 0 : windingNumber === 1;

    return {
      bandGap,
      fermiVelocity,
      chernNumber,
      windingNumber,
      soundSpeed,
      opticalFreq0,
      measuredFps: this.measuredFps,
      simTime: this.simTime,
      isTopological
    };
  }
}
