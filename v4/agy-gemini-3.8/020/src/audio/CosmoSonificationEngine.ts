/**
 * PROCEDURAL COSMOLOGICAL SONIFICATION ENGINE
 * COSMO-FORGE (EXP-020)
 * 100% Procedural Web Audio API with Master Dynamics Compressor Limiter
 * Standard: Protocol 2.0 Audio Lifecycle & De-zippering Ramps
 */

export class CosmoSonificationEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private limiter: DynamicsCompressorNode | null = null;
  private isMuted = true;

  // Persistent Drone Oscillators
  private expansionOsc1: OscillatorNode | null = null;
  private expansionOsc2: OscillatorNode | null = null;
  private expansionGain: GainNode | null = null;

  // CMB Acoustic Multipole Oscillator
  private cmbOsc: OscillatorNode | null = null;
  private cmbGain: GainNode | null = null;

  // Active Timer Tracking
  private activeTimers: Set<number> = new Set();

  constructor() {
    // AudioContext will be initialized on user gesture
  }

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Dynamics Compressor Limiter
      this.limiter = this.ctx.createDynamicsCompressor();
      this.limiter.threshold.setValueAtTime(-12, this.ctx.currentTime);
      this.limiter.knee.setValueAtTime(4, this.ctx.currentTime);
      this.limiter.ratio.setValueAtTime(12, this.ctx.currentTime);
      this.limiter.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.limiter.release.setValueAtTime(0.1, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0.0 : 0.7, this.ctx.currentTime);

      this.limiter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.initExpansionDrone();
      this.initCmbOscillator();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    return this.ctx;
  }

  private initExpansionDrone(): void {
    if (!this.ctx || !this.limiter) return;

    this.expansionGain = this.ctx.createGain();
    this.expansionGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

    this.expansionOsc1 = this.ctx.createOscillator();
    this.expansionOsc1.type = 'sine';
    this.expansionOsc1.frequency.setValueAtTime(55.0, this.ctx.currentTime);

    this.expansionOsc2 = this.ctx.createOscillator();
    this.expansionOsc2.type = 'triangle';
    this.expansionOsc2.frequency.setValueAtTime(55.5, this.ctx.currentTime);

    this.expansionOsc1.connect(this.expansionGain);
    this.expansionOsc2.connect(this.expansionGain);
    this.expansionGain.connect(this.limiter);

    this.expansionOsc1.start();
    this.expansionOsc2.start();
  }

  private initCmbOscillator(): void {
    if (!this.ctx || !this.limiter) return;

    this.cmbGain = this.ctx.createGain();
    this.cmbGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

    this.cmbOsc = this.ctx.createOscillator();
    this.cmbOsc.type = 'sine';
    this.cmbOsc.frequency.setValueAtTime(220.0, this.ctx.currentTime);

    this.cmbOsc.connect(this.cmbGain);
    this.cmbGain.connect(this.limiter);

    this.cmbOsc.start();
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(muted ? 0.0 : 0.7, now, 0.05);
    }
    if (!muted) {
      this.ensureContext();
    }
  }

  /**
   * Modulates the cosmological expansion drone based on H0 and deceleration q0
   */
  public updateExpansionDrone(H0: number, q0: number, active: boolean): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!this.expansionOsc1 || !this.expansionOsc2 || !this.expansionGain) return;

    const now = ctx.currentTime;
    const targetGain = active ? 0.25 : 0.0001;
    this.expansionGain.gain.cancelScheduledValues(now);
    this.expansionGain.gain.setTargetAtTime(targetGain, now, 0.08);

    // Fundamental frequency mapped to H0: 50 -> 45 Hz, 75 -> 70 Hz
    const baseFreq = 40.0 + (H0 - 50.0) * 1.2;
    // Detuning spread modulated by deceleration: accelerating (q0 < 0) has harmonic fifth, decelerating has minor third
    const detune = q0 < 0 ? baseFreq * 1.5 : baseFreq * 1.2;

    this.expansionOsc1.frequency.setTargetAtTime(baseFreq, now, 0.05);
    this.expansionOsc2.frequency.setTargetAtTime(detune, now, 0.05);
  }

  /**
   * Updates CMB multipole acoustic probe pitch
   */
  public updateCmbProbeTone(ell: number, active: boolean): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!this.cmbOsc || !this.cmbGain) return;

    const now = ctx.currentTime;
    const targetGain = active ? 0.20 : 0.0001;
    this.cmbGain.gain.cancelScheduledValues(now);
    this.cmbGain.gain.setTargetAtTime(targetGain, now, 0.05);

    if (active) {
      // Frequency mapped logarithmically from ell in [2, 2500] to [110, 880] Hz
      const minLog = Math.log10(2);
      const maxLog = Math.log10(2500);
      const curLog = Math.log10(Math.max(2, Math.min(2500, ell)));
      const norm = (curLog - minLog) / (maxLog - minLog);
      const freq = 110.0 * Math.pow(8.0, norm);

      this.cmbOsc.frequency.cancelScheduledValues(now);
      this.cmbOsc.frequency.setTargetAtTime(freq, now, 0.04);
    }
  }

  /**
   * Synthesizes a rapid Poisson burst of Geiger-like click transients for BBN neutron beta decay
   */
  public playBbnDecayClicks(): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!this.limiter) return;

    const count = 5;
    for (let i = 0; i < count; i++) {
      const delayMs = Math.random() * 250;
      const timerId = window.setTimeout(() => {
        this.activeTimers.delete(timerId);
        if (!this.ctx || this.isMuted) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // High click frequency (1500 - 3000 Hz)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1600 + Math.random() * 1200, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

        osc.connect(gain);
        gain.connect(this.limiter!);

        osc.start(now);
        osc.stop(now + 0.02);

        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };
      }, delayMs);

      this.activeTimers.add(timerId);
    }
  }

  /**
   * Resonant dark matter rotation chime proportional to circular velocity
   */
  public playDarkMatterChime(v_km_s: number): void {
    if (this.isMuted) return;
    const ctx = this.ensureContext();
    if (!this.limiter) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Map velocity in [50, 300] km/s to pentatonic frequency
    const freq = 220.0 + (v_km_s - 50.0) * 2.0;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.limiter);

    osc.start(now);
    osc.stop(now + 0.36);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  public dispose(): void {
    // Clear all pending timers
    this.activeTimers.forEach((t) => clearTimeout(t));
    this.activeTimers.clear();

    if (this.expansionOsc1) {
      try { this.expansionOsc1.stop(); } catch { /* ignore */ }
      this.expansionOsc1.disconnect();
      this.expansionOsc1 = null;
    }
    if (this.expansionOsc2) {
      try { this.expansionOsc2.stop(); } catch { /* ignore */ }
      this.expansionOsc2.disconnect();
      this.expansionOsc2 = null;
    }
    if (this.cmbOsc) {
      try { this.cmbOsc.stop(); } catch { /* ignore */ }
      this.cmbOsc.disconnect();
      this.cmbOsc = null;
    }

    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
