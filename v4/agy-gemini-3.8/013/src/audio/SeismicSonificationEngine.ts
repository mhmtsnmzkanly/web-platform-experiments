/**
 * 100% Procedural Web Audio Geophysical Elastodynamics & Seismic Sonification Engine
 * Zero external audio files or pre-recorded samples.
 */
export class SeismicSonificationEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  public isMuted: boolean = false;

  // 1. Continuous Infrasound Earth Hum
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;

  // 2. Tectonic Shear Noise (S-wave friction)
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseGain: GainNode | null = null;

  // 3. Tsunami Coastal Surge
  private surfOsc: OscillatorNode | null = null;
  private surfGain: GainNode | null = null;

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

      // Master Dynamics Compressor (Limiter)
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-3.0, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(6.0, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(14.0, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.002, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.15, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // --- 1. Low Infrasound Earth Hum (38 Hz) ---
      this.humOsc = this.ctx.createOscillator();
      this.humOsc.type = 'sine';
      this.humOsc.frequency.setValueAtTime(38, this.ctx.currentTime);

      this.humGain = this.ctx.createGain();
      this.humGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      this.humOsc.connect(this.humGain);
      this.humGain.connect(this.compressor);
      this.humOsc.start(0);

      // --- 2. Tectonic Rock Friction Pink Noise ---
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = noiseBuffer.getChannelData(0);

      // Pink noise filter
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.1;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseFilter.type = 'lowpass';
      this.noiseFilter.frequency.setValueAtTime(120, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

      this.noiseNode.connect(this.noiseFilter);
      this.noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.compressor);
      this.noiseNode.start(0);

      // --- 3. Tsunami Coastal Surge Hum ---
      this.surfOsc = this.ctx.createOscillator();
      this.surfOsc.type = 'triangle';
      this.surfOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

      this.surfGain = this.ctx.createGain();
      this.surfGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      this.surfOsc.connect(this.surfGain);
      this.surfGain.connect(this.compressor);
      this.surfOsc.start(0);
    } catch {}
  }

  /**
   * Plays deep sub-bass rupture thump when an earthquake nucleates
   */
  public playRuptureExplosion(magnitudeMw: number): void {
    if (!this.ctx || !this.compressor || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = Math.max(30, 85 - magnitudeMw * 5); // Larger Mw = deeper sub-bass
    osc.frequency.setValueAtTime(baseFreq * 2.2, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, t + 0.35);

    const amp = Math.min(0.35, 0.05 + (magnitudeMw - 5.0) * 0.06);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(amp, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.compressor);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc.start(t);
    osc.stop(t + 0.45);
  }

  /**
   * Plays high-frequency needle arrival click when a seismometer picks a seismic phase
   */
  public playPhaseArrivalClick(phaseType: 'P' | 'S' | 'RAYLEIGH'): void {
    if (!this.ctx || !this.compressor || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = phaseType === 'P' ? 'sine' : phaseType === 'S' ? 'triangle' : 'sawtooth';
    const freq = phaseType === 'P' ? 880 : phaseType === 'S' ? 520 : 330;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.08);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.compressor);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc.start(t);
    osc.stop(t + 0.1);
  }

  /**
   * Modulates acoustic parameters smoothly based on seismic and tsunami energy
   */
  public updateTelemetry(
    groundMotionCmS: number,
    pgaG: number,
    tsunamiHeightM: number
  ): void {
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Ground motion swells low earth hum
    if (this.humGain && this.humOsc) {
      const targetGain = Math.min(0.2, 0.02 + groundMotionCmS * 0.02);
      this.humGain.gain.setTargetAtTime(targetGain, t, 0.08);

      const freq = Math.max(30, Math.min(80, 38 + pgaG * 40));
      this.humOsc.frequency.setTargetAtTime(freq, t, 0.08);
    }

    // Tectonic friction noise filter cutoff rises with ground velocity
    if (this.noiseGain && this.noiseFilter) {
      const targetGain = Math.min(0.15, 0.015 + groundMotionCmS * 0.015);
      this.noiseGain.gain.setTargetAtTime(targetGain, t, 0.06);

      const cutoff = Math.min(600, 100 + groundMotionCmS * 40);
      this.noiseFilter.frequency.setTargetAtTime(cutoff, t, 0.08);
    }

    // Tsunami surge swells as wave height rises
    if (this.surfGain && this.surfOsc) {
      const targetGain = Math.min(0.18, tsunamiHeightM * 0.035);
      this.surfGain.gain.setTargetAtTime(targetGain, t, 0.1);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime, 0.03);
    }
    return this.isMuted;
  }

  public destroy(): void {
    try {
      this.humOsc?.stop();
      this.noiseNode?.stop();
      this.surfOsc?.stop();
      this.ctx?.close();
    } catch {}
  }
}
