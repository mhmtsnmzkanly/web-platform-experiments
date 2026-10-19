import { SuiteMode } from '../types';

export class RelativitySonificationEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private limiter: DynamicsCompressorNode | null = null;

  // GW Chirp nodes
  private gwOsc: OscillatorNode | null = null;
  private gwGain: GainNode | null = null;

  // Ambient Curvature / Frame-Dragging Drone nodes
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private droneGain: GainNode | null = null;

  // Geodesic Well Whistle nodes
  private wellOsc: OscillatorNode | null = null;
  private wellGain: GainNode | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Limiter to prevent clipping
      this.limiter = this.ctx.createDynamicsCompressor();
      this.limiter.threshold.setValueAtTime(-1.5, this.ctx.currentTime);
      this.limiter.knee.setValueAtTime(3.0, this.ctx.currentTime);
      this.limiter.ratio.setValueAtTime(18.0, this.ctx.currentTime);
      this.limiter.attack.setValueAtTime(0.002, this.ctx.currentTime);
      this.limiter.release.setValueAtTime(0.05, this.ctx.currentTime);

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0.0 : 0.35, this.ctx.currentTime);

      this.masterGain.connect(this.limiter);
      this.limiter.connect(this.ctx.destination);

      // 1. Gravitational Wave Chirp Oscillator
      this.gwOsc = this.ctx.createOscillator();
      this.gwOsc.type = 'sine';
      this.gwOsc.frequency.setValueAtTime(40.0, this.ctx.currentTime);

      this.gwGain = this.ctx.createGain();
      this.gwGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      this.gwOsc.connect(this.gwGain);
      this.gwGain.connect(this.masterGain);
      this.gwOsc.start();

      // 2. Curvature / Frame-Dragging Dual Drone
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(55.0, this.ctx.currentTime); // A1 sub-bass

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(110.0, this.ctx.currentTime); // A2 harmonic

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(220.0, this.ctx.currentTime);
      this.droneFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      this.droneOsc1.connect(this.droneFilter);
      this.droneOsc2.connect(this.droneFilter);
      this.droneFilter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc1.start();
      this.droneOsc2.start();

      // 3. Geodesic Proximity Whistle
      this.wellOsc = this.ctx.createOscillator();
      this.wellOsc.type = 'sine';
      this.wellOsc.frequency.setValueAtTime(160.0, this.ctx.currentTime);

      this.wellGain = this.ctx.createGain();
      this.wellGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      this.wellOsc.connect(this.wellGain);
      this.wellGain.connect(this.masterGain);
      this.wellOsc.start();
    } catch {
      // AudioContext unavailable or blocked
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!this.ctx) {
      if (!muted) this.init();
    } else {
      if (this.ctx.state === 'suspended' && !muted) {
        this.ctx.resume();
      }
      const t = this.ctx.currentTime;
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(t);
        this.masterGain.gain.linearRampToValueAtTime(muted ? 0.0 : 0.35, t + 0.04);
      }
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Modulates soundscape in real-time according to current relativity metrics
   */
  public update(
    suiteMode: SuiteMode,
    gwFreqHz: number,
    gwStrainPeak: number,
    isMerged: boolean,
    closestGeodesicR: number,
    spinA: number,
    maxDoppler: number
  ) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    // 1. Gravitational Wave Chirp Mode
    if (suiteMode === 'GRAVITATIONAL_WAVES') {
      if (this.gwOsc && this.gwGain) {
        const clampedFreq = Math.max(25.0, Math.min(650.0, gwFreqHz));
        this.gwOsc.frequency.setTargetAtTime(clampedFreq, t, 0.015);

        const targetGwVol = isMerged ? 0.08 : Math.min(0.32, (gwStrainPeak / 2e-21) * 0.28);
        this.gwGain.gain.setTargetAtTime(targetGwVol, t, 0.02);
      }
      if (this.droneGain) this.droneGain.gain.setTargetAtTime(0.04, t, 0.05);
      if (this.wellGain) this.wellGain.gain.setTargetAtTime(0.0, t, 0.05);
    }
    // 2. Kerr Shadow & Lensing Mode
    else if (suiteMode === 'KERR_SHADOW_LENS') {
      if (this.gwGain) this.gwGain.gain.setTargetAtTime(0.0, t, 0.05);
      if (this.wellGain) this.wellGain.gain.setTargetAtTime(0.0, t, 0.05);

      if (this.droneGain && this.droneFilter) {
        const cutoff = 150.0 + Math.abs(spinA) * 280.0 + (maxDoppler - 1.0) * 120.0;
        this.droneFilter.frequency.setTargetAtTime(Math.min(1200.0, cutoff), t, 0.05);
        this.droneGain.gain.setTargetAtTime(0.18, t, 0.05);
      }
    }
    // 3. Geodesic Orbits Mode
    else if (suiteMode === 'GEODESIC_ORBITS') {
      if (this.gwGain) this.gwGain.gain.setTargetAtTime(0.0, t, 0.05);
      if (this.droneGain) this.droneGain.gain.setTargetAtTime(0.05, t, 0.05);

      if (this.wellOsc && this.wellGain) {
        // Frequency rises steeply as r approaches horizon (2M)
        const proximity = Math.max(0.0, Math.min(1.0, (12.0 - closestGeodesicR) / 10.0));
        const wellPitch = 120.0 + Math.pow(proximity, 2.5) * 440.0;
        this.wellOsc.frequency.setTargetAtTime(wellPitch, t, 0.02);
        this.wellGain.gain.setTargetAtTime(0.12 * proximity, t, 0.03);
      }
    }
    // 4. Spacetime Curvature Embedding
    else {
      if (this.gwGain) this.gwGain.gain.setTargetAtTime(0.0, t, 0.05);
      if (this.wellGain) this.wellGain.gain.setTargetAtTime(0.0, t, 0.05);
      if (this.droneGain && this.droneFilter) {
        this.droneFilter.frequency.setTargetAtTime(120.0, t, 0.05);
        this.droneGain.gain.setTargetAtTime(0.12, t, 0.05);
      }
    }
  }

  public dispose() {
    try {
      this.gwOsc?.stop();
      this.gwOsc?.disconnect();
      this.gwGain?.disconnect();

      this.droneOsc1?.stop();
      this.droneOsc1?.disconnect();
      this.droneOsc2?.stop();
      this.droneOsc2?.disconnect();
      this.droneFilter?.disconnect();
      this.droneGain?.disconnect();

      this.wellOsc?.stop();
      this.wellOsc?.disconnect();
      this.wellGain?.disconnect();

      this.masterGain?.disconnect();
      this.limiter?.disconnect();

      this.ctx?.close();
    } catch {
      // Ignored
    }
    this.gwOsc = null;
    this.gwGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.droneFilter = null;
    this.droneGain = null;
    this.wellOsc = null;
    this.wellGain = null;
    this.masterGain = null;
    this.limiter = null;
    this.ctx = null;
  }
}
