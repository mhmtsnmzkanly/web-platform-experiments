import { BasisStateAmplitude } from '../types';

/**
 * 100% Procedural Web Audio Engine for Quantum State Sonification
 * Zero external audio samples or audio files.
 */
export class QuantumSonificationEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  public isMuted: boolean = false;

  // Entanglement continuous drone
  private entropyOsc: OscillatorNode | null = null;
  private entropySubOsc: OscillatorNode | null = null;
  private entropyFilter: BiquadFilterNode | null = null;
  private entropyGain: GainNode | null = null;

  constructor() {
    // Lazy initialized on first user gesture
  }

  public init(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Compressor / Limiter
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-3, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(6, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.15, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);

      this.setupEntanglementDrone();
    } catch (e) {
      console.warn('Web Audio API not supported in this environment:', e);
    }
  }

  private setupEntanglementDrone(): void {
    if (!this.ctx || !this.masterGain) return;

    this.entropyGain = this.ctx.createGain();
    this.entropyGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    this.entropyFilter = this.ctx.createBiquadFilter();
    this.entropyFilter.type = 'lowpass';
    this.entropyFilter.frequency.setValueAtTime(140, this.ctx.currentTime);
    this.entropyFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    this.entropyOsc = this.ctx.createOscillator();
    this.entropyOsc.type = 'sine';
    this.entropyOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // A1

    this.entropySubOsc = this.ctx.createOscillator();
    this.entropySubOsc.type = 'triangle';
    this.entropySubOsc.frequency.setValueAtTime(27.5, this.ctx.currentTime); // A0

    this.entropyOsc.connect(this.entropyFilter);
    this.entropySubOsc.connect(this.entropyFilter);
    this.entropyFilter.connect(this.entropyGain);
    this.entropyGain.connect(this.masterGain);

    this.entropyOsc.start();
    this.entropySubOsc.start();
  }

  /**
   * Modulates continuous entanglement drone based on Von Neumann entropy
   */
  public updateEntanglementDrone(entropy: number): void {
    if (!this.ctx || !this.entropyFilter || !this.entropyGain) return;

    const now = this.ctx.currentTime;
    const targetFreq = 100 + Math.min(800, entropy * 700);
    const targetGain = 0.02 + Math.min(0.18, entropy * 0.16);

    this.entropyFilter.frequency.setTargetAtTime(targetFreq, now, 0.1);
    this.entropyGain.gain.setTargetAtTime(targetGain, now, 0.1);
  }

  /**
   * Plays harmonic chime upon quantum gate execution
   */
  public playGateSound(gateType: string): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    let baseFreq = 440; // A4
    let duration = 0.18;

    if (gateType === 'H') {
      baseFreq = 659.25; // E5 airy shimmer
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime( baseFreq * 1.5, t + duration);
    } else if (gateType === 'X' || gateType === 'Y' || gateType === 'Z') {
      baseFreq = 330;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.setValueAtTime(baseFreq * 1.25, t + 0.04);
    } else if (gateType === 'CNOT' || gateType === 'CZ' || gateType === 'TOFFOLI') {
      baseFreq = 523.25; // C5
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.setValueAtTime(baseFreq * 1.5, t + 0.06); // Fifth leap
      duration = 0.22;
    } else if (gateType === 'RX' || gateType === 'RY' || gateType === 'RZ') {
      baseFreq = 587.33; // D5
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, t);
    } else {
      baseFreq = 493.88; // B4
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, t);
    }

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc.start(t);
    osc.stop(t + duration);
  }

  /**
   * Plays projective measurement wavefunction collapse sound
   */
  public playMeasurementCollapse(outcome: 0 | 1): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const pitch = outcome === 0 ? 880 : 440;
    osc.frequency.setValueAtTime(pitch, t);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, t + 0.25);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, t);
    filter.frequency.exponentialRampToValueAtTime(200, t + 0.25);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.onended = () => {
      try {
        osc.disconnect();
        filter.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc.start(t);
    osc.stop(t + 0.28);
  }

  /**
   * Mute / Unmute audio with smooth de-zippering ramp
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime, 0.03);
    }
    return this.isMuted;
  }

  public destroy(): void {
    try {
      this.entropyOsc?.stop();
      this.entropySubOsc?.stop();
      this.entropyOsc?.disconnect();
      this.entropySubOsc?.disconnect();
      this.ctx?.close();
    } catch {}
  }
}
