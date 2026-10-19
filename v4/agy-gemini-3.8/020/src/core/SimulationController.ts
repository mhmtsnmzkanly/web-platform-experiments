/**
 * SIMULATION CONTROLLER (SINGLE-OWNER AUTHORITATIVE CONTROLLER)
 * COSMO-FORGE (EXP-020)
 * Standard: Protocol 2.0 State Architecture, Unified Clock & Genuine Wall-Clock FPS Metering
 */

import { CosmoParameters, CosmoPresetId, CosmoSuiteMode, PresetConfig } from '../types';

export const COSMO_PRESETS: Record<CosmoPresetId, PresetConfig> = {
  PLANCK_LCDM: {
    id: 'PLANCK_LCDM',
    name: 'Planck 2018 Concordance (ΛCDM)',
    category: 'Standard Cosmology',
    description: 'Flat concordance universe with precision Planck 2018 parameters (Ω_m = 0.315, Ω_Λ = 0.685, H0 = 67.4).',
    params: {
      H0: 67.4,
      Omega_m: 0.315,
      Omega_b: 0.049,
      Omega_L: 0.685,
      w0: -1.0,
      wa: 0.0,
      T_CMB: 2.7255,
      probeRedshift: 1.0,
      probeMultipole: 220,
      probeRadiusKpc: 15.0,
      haloProfileType: 'NFW',
      halo_rho0: 1.2e7,
      halo_rs_kpc: 10.0,
      disk_mass_Msun: 3.5e10,
      disk_Rd_kpc: 2.6,
      bulge_mass_Msun: 4.0e9,
      bulge_a_kpc: 0.8,
    },
  },
  EINSTEIN_DE_SITTER: {
    id: 'EINSTEIN_DE_SITTER',
    name: 'Einstein-de Sitter (Pure Matter)',
    category: 'Historical Models',
    description: 'Classical flat matter-dominated cosmos (Ω_m = 1.0, Ω_Λ = 0.0) with power-law expansion a(t) ∝ t^(2/3).',
    params: {
      H0: 50.0,
      Omega_m: 1.0,
      Omega_b: 0.05,
      Omega_L: 0.0,
      w0: -1.0,
      wa: 0.0,
      probeRedshift: 1.5,
      probeMultipole: 300,
    },
  },
  OPEN_COSMOS: {
    id: 'OPEN_COSMOS',
    name: 'Open Hyperbolic Cosmos (k = -1)',
    category: 'Curvature Physics',
    description: 'Sub-critical open universe with negative spatial curvature (Ω_m = 0.20, Ω_k = +0.80), expanding forever without dark energy.',
    params: {
      H0: 70.0,
      Omega_m: 0.20,
      Omega_b: 0.04,
      Omega_L: 0.0,
      w0: -1.0,
      wa: 0.0,
      probeRedshift: 2.0,
    },
  },
  DE_SITTER_EXPONENTIAL: {
    id: 'DE_SITTER_EXPONENTIAL',
    name: 'de Sitter Vacuum (Pure Dark Energy)',
    category: 'Asymptotic Fates',
    description: 'Pure cosmological constant vacuum (Ω_Λ = 1.0) undergoing eternal exponential de Sitter expansion a(t) ∝ exp(Ht).',
    params: {
      H0: 73.0,
      Omega_m: 0.001,
      Omega_b: 0.0001,
      Omega_L: 0.999,
      w0: -1.0,
      wa: 0.0,
      probeRedshift: 0.5,
    },
  },
  PHANTOM_ENERGY: {
    id: 'PHANTOM_ENERGY',
    name: 'Phantom Dark Energy (Big Rip)',
    category: 'Exotic Physics',
    description: 'Super-accelerating dark energy equation of state (w0 = -1.30 < -1) terminating in a finite-time cosmic Big Rip singularity.',
    params: {
      H0: 70.0,
      Omega_m: 0.28,
      Omega_b: 0.045,
      Omega_L: 0.72,
      w0: -1.30,
      wa: 0.1,
      probeRedshift: 1.0,
    },
  },
  BARYON_RICH_COSMOS: {
    id: 'BARYON_RICH_COSMOS',
    name: 'Baryon-Rich Cosmos (High Ω_b)',
    category: 'Primordial Nucleosynthesis',
    description: 'High baryon abundance (Ω_b = 0.12) suppressing the CMB 2nd acoustic peak and decreasing primordial Deuterium.',
    params: {
      H0: 67.4,
      Omega_m: 0.35,
      Omega_b: 0.12,
      Omega_L: 0.65,
      w0: -1.0,
      wa: 0.0,
      probeMultipole: 540,
    },
  },
};

export type StateListener = (params: CosmoParameters, mode: CosmoSuiteMode, fps: number) => void;

export class SimulationController {
  private params: CosmoParameters;
  private suiteMode: CosmoSuiteMode = 'COSMIC_EXPANSION';
  private listeners: Set<StateListener> = new Set();

  // Animation & Clock State
  private isRunning = true;
  private simTime = 0.0;
  private timeScale = 1.0;
  private rafId: number | null = null;
  private lastWallTime = 0;

  // Genuine Wall-Clock FPS Metering
  private frameCount = 0;
  private fpsAccumulator = 0;
  private measuredFps = 60.0;
  private lastFpsNotifyTime = 0;

  constructor() {
    this.params = {
      activePresetId: 'PLANCK_LCDM',
      H0: 67.4,
      Omega_m: 0.315,
      Omega_b: 0.049,
      Omega_L: 0.685,
      w0: -1.0,
      wa: 0.0,
      T_CMB: 2.7255,
      probeRedshift: 1.0,
      probeMultipole: 220,
      probeRadiusKpc: 15.0,
      haloProfileType: 'NFW',
      halo_rho0: 1.2e7,
      halo_rs_kpc: 10.0,
      disk_mass_Msun: 3.5e10,
      disk_Rd_kpc: 2.6,
      bulge_mass_Msun: 4.0e9,
      bulge_a_kpc: 0.8,
      audioEnabled: false,
    };
  }

  public start(): void {
    if (this.rafId !== null) return;
    this.isRunning = true;
    this.lastWallTime = performance.now();
    this.lastFpsNotifyTime = performance.now();

    const loop = (wallTime: number) => {
      const dtWall = (wallTime - this.lastWallTime) / 1000.0;
      this.lastWallTime = wallTime;

      // Accumulate wall-clock FPS
      this.frameCount++;
      this.fpsAccumulator += dtWall;
      if (this.fpsAccumulator >= 0.5) {
        this.measuredFps = Math.round((this.frameCount / this.fpsAccumulator) * 10) / 10;
        this.frameCount = 0;
        this.fpsAccumulator = 0;
        // Notify subscribers of updated frame rate
        this.notify();
      }

      // Advance dynamic simulation time
      if (this.isRunning) {
        this.simTime += dtWall * this.timeScale;
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  public stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isRunning = false;
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.params, this.suiteMode, this.measuredFps);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.params, this.suiteMode, this.measuredFps));
  }

  // --- Authoritative Getters & Setters ---

  public getParameters(): CosmoParameters {
    return this.params;
  }

  public getSuiteMode(): CosmoSuiteMode {
    return this.suiteMode;
  }

  public getFps(): number {
    return this.measuredFps;
  }

  public getSimTime(): number {
    return this.simTime;
  }

  public setSuiteMode(mode: CosmoSuiteMode): void {
    this.suiteMode = mode;
    this.notify();
  }

  public setParameters(partial: Partial<CosmoParameters>): void {
    this.params = { ...this.params, ...partial };
    this.notify();
  }

  public loadPreset(presetId: CosmoPresetId): void {
    const config = COSMO_PRESETS[presetId];
    if (!config) return;
    this.params = {
      ...this.params,
      ...config.params,
      activePresetId: presetId,
    };
    this.notify();
  }

  public toggleAudio(): boolean {
    this.params = { ...this.params, audioEnabled: !this.params.audioEnabled };
    this.notify();
    return this.params.audioEnabled;
  }
}
