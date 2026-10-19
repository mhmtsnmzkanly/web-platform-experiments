import { GravitationalWaveParams } from '../types';

export interface GWStrainSample {
  timeMs: number;
  hPlus: number;
  hCross: number;
  freqHz: number;
  separationM: number;
}

export class GravitationalWaveEngine {
  public history: GWStrainSample[] = [];
  public readonly maxHistoryLength: number = 320;

  // Binary orbital positions (in units of total mass M)
  public pos1: { x: number; y: number } = { x: 0, y: 0 };
  public pos2: { x: number; y: number } = { x: 0, y: 0 };

  // Current physical observables
  public chirpMassMsun: number = 28.0;
  public totalMassMsun: number = 65.0;
  public peakStrain: number = 1.0e-21;
  public currentFreqHz: number = 35.0;
  public currentSeparationM: number = 16.0;
  public ringdownDecayTau: number = 0.004; // seconds
  public ringdownFreqHz: number = 250.0;
  public isMerged: boolean = false;

  private simTimeSec: number = 0.0;
  private currentPhase: number = 0.0;
  private mergerTimeSec: number = -1.0;

  constructor() {
    this.resetSimulation({
      primaryMassMsun: 36.0,
      secondaryMassMsun: 29.0,
      dimensionlessSpin1: 0.32,
      dimensionlessSpin2: -0.44,
      luminosityDistanceMpc: 410.0,
      orbitPhase: 0.0,
      separationR: 16.0,
      orbitalFreqHz: 35.0,
      isMerged: false,
    });
  }

  public resetSimulation(params: GravitationalWaveParams, keepHistory: boolean = false) {
    const m1 = Math.max(1.0, params.primaryMassMsun);
    const m2 = Math.max(1.0, params.secondaryMassMsun);
    this.totalMassMsun = m1 + m2;
    this.chirpMassMsun = Math.pow(m1 * m2, 0.6) / Math.pow(m1 + m2, 0.2);

    this.currentSeparationM = Math.max(6.0, params.separationR);
    this.currentPhase = params.orbitPhase || 0.0;
    this.simTimeSec = 0.0;
    this.mergerTimeSec = -1.0;
    this.isMerged = false;
    if (!keepHistory) {
      this.history = [];
    }

    // Final Kerr spin estimate of remnant black hole:
    // a_remnant ~ 2*sqrt(3)*eta + s_spin
    const eta = (m1 * m2) / (this.totalMassMsun * this.totalMassMsun);
    const aRemnant = Math.min(0.95, 2.0 * Math.sqrt(3.0) * eta + 0.1 * (params.dimensionlessSpin1 + params.dimensionlessSpin2));

    // QNM ringdown frequency for Kerr remnant (Echeverria formula)
    // f_qnm ~ (c^3 / (2*pi*G*M)) * [1 - 0.63*(1 - a)^0.3]
    const f0 = 32000.0 / this.totalMassMsun; // Hz
    this.ringdownFreqHz = f0 * (1.0 - 0.63 * Math.pow(Math.max(0.01, 1.0 - aRemnant), 0.3));
    this.ringdownDecayTau = (4.0 / (2.0 * Math.PI * this.ringdownFreqHz)) * Math.pow(Math.max(0.01, 1.0 - aRemnant), -0.45);
  }

  /**
   * Advances binary inspiral and computes post-Newtonian gravitational wave strain
   */
  public step(params: GravitationalWaveParams, dtSec: number = 0.0015): GWStrainSample {
    const m1 = params.primaryMassMsun;
    const m2 = params.secondaryMassMsun;
    const M = m1 + m2;
    const eta = (m1 * m2) / (M * M);
    const DL_m = params.luminosityDistanceMpc * 3.08567758e22; // meters
    const G = 6.6743e-11;
    const c = 2.99792458e8;
    const M_kg = M * 1.98847e30;
    const Mc_kg = this.chirpMassMsun * 1.98847e30;

    this.simTimeSec += dtSec;

    // ISCO separation in units of M = G*M/c^2
    const rISCO = 6.0;

    let hPlus = 0.0;
    let hCross = 0.0;
    let fGW = 30.0;

    if (!this.isMerged) {
      // 1. Post-Newtonian quadrupole radiation reaction shrinking orbit:
      // dr/dt = - (64/5) * (G^3 * M^2 * eta) / (c^5 * r^3)
      // In dimensionless units where GM/c^2 = 1 and c = 1:
      const drDt = -(64.0 / 5.0) * eta * Math.pow(Math.max(3.0, this.currentSeparationM), -3.0) * 1.8;
      this.currentSeparationM += drDt * dtSec * 120.0;

      // Keplerian orbital angular frequency: omega = sqrt(G*M / r^3)
      const omegaDim = Math.pow(Math.max(2.5, this.currentSeparationM), -1.5);
      const omegaSI = omegaDim * (c * c * c) / (G * M_kg);
      const fOrbital = omegaSI / (2.0 * Math.PI);
      fGW = 2.0 * fOrbital;
      this.currentFreqHz = Math.min(600.0, fGW);

      // Phase integration: dphi/dt = omega
      this.currentPhase += 2.0 * omegaDim * dtSec * 120.0;

      // Post-Newtonian Quadrupole Strain Amplitude:
      // h_0 = (4 / D_L) * (G*Mc / c^2)^(5/3) * (pi*fGW / c)^(2/3)
      const Mc_len = (G * Mc_kg) / (c * c);
      const waveNumber = (Math.PI * fGW) / c;
      const h0 = (4.0 / DL_m) * Math.pow(Mc_len, 5.0 / 3.0) * Math.pow(waveNumber, 2.0 / 3.0);

      // Unbiased physical strain in order of magnitude (~1e-21)
      const normalizedH0 = Math.max(1e-23, Math.min(1e-19, h0));
      hPlus = normalizedH0 * Math.cos(this.currentPhase);
      hCross = normalizedH0 * Math.sin(this.currentPhase);

      if (Math.abs(hPlus) > this.peakStrain) {
        this.peakStrain = Math.abs(hPlus);
      }

      // Check for merger plunge at ISCO
      if (this.currentSeparationM <= rISCO) {
        this.isMerged = true;
        this.mergerTimeSec = this.simTimeSec;
      }
    } else {
      // 2. Quasi-Normal Mode (QNM) Ringdown
      const tSinceMerger = this.simTimeSec - this.mergerTimeSec;
      const decay = Math.exp(-tSinceMerger / Math.max(0.001, this.ringdownDecayTau * 3.0));
      // Continuous phase matching at merger time
      const ringdownPhase = this.currentPhase + 2.0 * Math.PI * this.ringdownFreqHz * tSinceMerger;

      const hRing = this.peakStrain * decay;
      hPlus = hRing * Math.cos(ringdownPhase);
      hCross = hRing * Math.sin(ringdownPhase);
      fGW = this.ringdownFreqHz;
      this.currentFreqHz = fGW;
      this.currentSeparationM = 2.0; // Merged single horizon

      // Auto-restart loop when ringdown has fully decayed without wiping history
      if (tSinceMerger > 0.05) {
        this.resetSimulation(params, true);
      }
    }

    // Binary position updates for canvas visualizer
    const r1 = (m2 / M) * this.currentSeparationM;
    const r2 = (m1 / M) * this.currentSeparationM;
    const phi = this.currentPhase * 0.5;

    this.pos1 = {
      x: r1 * Math.cos(phi),
      y: r1 * Math.sin(phi),
    };
    this.pos2 = {
      x: -r2 * Math.cos(phi),
      y: -r2 * Math.sin(phi),
    };

    const sample: GWStrainSample = {
      timeMs: this.simTimeSec * 1000.0,
      hPlus,
      hCross,
      freqHz: fGW,
      separationM: this.currentSeparationM,
    };

    this.history.push(sample);
    if (this.history.length > this.maxHistoryLength) {
      this.history.shift();
    }

    return sample;
  }
}
