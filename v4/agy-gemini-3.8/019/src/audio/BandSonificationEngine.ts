/**
 * BandSonificationEngine.ts
 * 100% Procedural Web Audio sonification engine for BAND-FORGE.
 * Synthesizes harmonic phonon modes, electronic dispersion drones,
 * and topological transition chimes with a master dynamics compressor limiter.
 */

export class BandSonificationEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  // Active continuous drone nodes
  private dispersionOsc: OscillatorNode | null = null;
  private dispersionGain: GainNode | null = null;
  private phononAcousticOsc: OscillatorNode | null = null;
  private phononOpticalOsc: OscillatorNode | null = null;
  private phononGain: GainNode | null = null;

  private pendingTimeouts: number[] = [];

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Dynamics Compressor (Limiter)
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(6, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.1, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.setupDrones();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  private setupDrones(): void {
    if (!this.ctx || !this.compressor) return;

    // 1. Electronic Dispersion Drone
    this.dispersionOsc = this.ctx.createOscillator();
    this.dispersionOsc.type = 'sine';
    this.dispersionOsc.frequency.setValueAtTime(220, this.ctx.currentTime);

    this.dispersionGain = this.ctx.createGain();
    this.dispersionGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.dispersionOsc.connect(this.dispersionGain);
    this.dispersionGain.connect(this.compressor);
    this.dispersionOsc.start();

    // 2. Phonon Dual-Branch Modal Drone (Acoustic + Optical)
    this.phononAcousticOsc = this.ctx.createOscillator();
    this.phononAcousticOsc.type = 'triangle';
    this.phononAcousticOsc.frequency.setValueAtTime(120, this.ctx.currentTime);

    this.phononOpticalOsc = this.ctx.createOscillator();
    this.phononOpticalOsc.type = 'sine';
    this.phononOpticalOsc.frequency.setValueAtTime(440, this.ctx.currentTime);

    this.phononGain = this.ctx.createGain();
    this.phononGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.phononAcousticOsc.connect(this.phononGain);
    this.phononOpticalOsc.connect(this.phononGain);
    this.phononGain.connect(this.compressor);

    this.phononAcousticOsc.start();
    this.phononOpticalOsc.start();
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(muted ? 0.0 : 0.4, now + 0.05);
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.ensureContext();
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Update continuous electronic dispersion frequency based on energy at probed k-vector.
   */
  public updateDispersionProbe(energy_eV: number, isActive: boolean): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    if (!this.dispersionOsc || !this.dispersionGain) return;

    if (!isActive) {
      this.dispersionGain.gain.setTargetAtTime(0.0, now, 0.05);
      return;
    }

    // Map energy [-8 eV, +8 eV] to audible frequency [100 Hz, 880 Hz]
    const clampedE = Math.max(-8, Math.min(8, energy_eV));
    const targetFreq = 220 * Math.pow(2, clampedE / 4.0);

    this.dispersionOsc.frequency.setTargetAtTime(Math.max(40, targetFreq), now, 0.04);
    this.dispersionGain.gain.setTargetAtTime(0.15, now, 0.05);
  }

  /**
   * Update continuous phonon branch frequencies from acoustic & optical frequencies in rad/ps.
   */
  public updatePhononFrequencies(omegaMinus_rad_ps: number, omegaPlus_rad_ps: number, isActive: boolean): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    if (!this.phononAcousticOsc || !this.phononOpticalOsc || !this.phononGain) return;

    if (!isActive) {
      this.phononGain.gain.setTargetAtTime(0.0, now, 0.05);
      return;
    }

    // Map rad/ps (typically 0 - 60 rad/ps) to audible spectrum:
    // Acoustic: 50 Hz - 400 Hz
    // Optical:  300 Hz - 900 Hz
    const fAcoustic = Math.max(40, 50 + omegaMinus_rad_ps * 8);
    const fOptical = Math.max(100, 250 + omegaPlus_rad_ps * 12);

    this.phononAcousticOsc.frequency.setTargetAtTime(fAcoustic, now, 0.04);
    this.phononOpticalOsc.frequency.setTargetAtTime(fOptical, now, 0.04);
    this.phononGain.gain.setTargetAtTime(0.12, now, 0.05);
  }

  /**
   * Play a bell chime when crossing into a non-trivial topological phase (C != 0 or nu = 1).
   */
  public triggerTopologicalChime(isTopological: boolean): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    const now = ctx.currentTime;
    if (!this.compressor) return;

    // Frequencies: pentatonic arpeggio for topological, descending pair for trivial
    const notes = isTopological ? [523.25, 659.25, 783.99, 1046.5] : [440, 329.63];

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isTopological ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.06);

      const startTime = now + index * 0.06;
      const duration = 0.4;

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.compressor!);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);

      const timeoutId = window.setTimeout(() => {
        osc.disconnect();
        gain.disconnect();
        this.pendingTimeouts = this.pendingTimeouts.filter(id => id !== timeoutId);
      }, (index * 0.06 + duration + 0.1) * 1000);

      this.pendingTimeouts.push(timeoutId);
    });
  }

  /**
   * Dispose all Web Audio nodes and clear timers on unmount.
   */
  public dispose(): void {
    for (const id of this.pendingTimeouts) {
      clearTimeout(id);
    }
    this.pendingTimeouts = [];

    if (this.dispersionOsc) {
      try { this.dispersionOsc.stop(); } catch {}
      this.dispersionOsc.disconnect();
      this.dispersionOsc = null;
    }
    if (this.dispersionGain) {
      this.dispersionGain.disconnect();
      this.dispersionGain = null;
    }
    if (this.phononAcousticOsc) {
      try { this.phononAcousticOsc.stop(); } catch {}
      this.phononAcousticOsc.disconnect();
      this.phononAcousticOsc = null;
    }
    if (this.phononOpticalOsc) {
      try { this.phononOpticalOsc.stop(); } catch {}
      this.phononOpticalOsc.disconnect();
      this.phononOpticalOsc = null;
    }
    if (this.phononGain) {
      this.phononGain.disconnect();
      this.phononGain = null;
    }
    if (this.masterGain) {
      this.masterGain.disconnect();
      this.masterGain = null;
    }
    if (this.compressor) {
      this.compressor.disconnect();
      this.compressor = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
