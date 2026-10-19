/**
 * 100% Procedural Web Audio Optical Wave & Interference Sonification Engine
 * Zero external audio samples or audio files.
 */
export class OpticaSonificationEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  public isMuted: boolean = false;

  // 1. Coherent Laser Beam Hiss
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseGain: GainNode | null = null;

  // 2. Interferometric Doppler Fringe Frequency Tone
  private fringeOsc: OscillatorNode | null = null;
  private fringeGain: GainNode | null = null;

  // 3. Fabry-Perot High-Finesse Cavity Resonance Drone
  private cavityOsc: OscillatorNode | null = null;
  private cavityFilter: BiquadFilterNode | null = null;
  private cavityGain: GainNode | null = null;

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

      // Master Limiter / Compressor
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-3.0, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(6.0, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(12.0, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.12, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime);

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // --- 1. Laser Beam Hiss ---
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = noiseBuffer.getChannelData(0);

      // Generate pink noise via Paul Kellet 3-pole filter
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.08;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseFilter.type = 'bandpass';
      this.noiseFilter.frequency.setValueAtTime(800, this.ctx.currentTime);
      this.noiseFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.03, this.ctx.currentTime);

      this.noiseNode.connect(this.noiseFilter);
      this.noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.compressor);
      this.noiseNode.start(0);

      // --- 2. Interferometric Doppler Fringe Tone ---
      this.fringeOsc = this.ctx.createOscillator();
      this.fringeOsc.type = 'sine';
      this.fringeOsc.frequency.setValueAtTime(220, this.ctx.currentTime);

      this.fringeGain = this.ctx.createGain();
      this.fringeGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      this.fringeOsc.connect(this.fringeGain);
      this.fringeGain.connect(this.compressor);
      this.fringeOsc.start(0);

      // --- 3. Fabry-Perot Cavity Resonance ---
      this.cavityOsc = this.ctx.createOscillator();
      this.cavityOsc.type = 'triangle';
      this.cavityOsc.frequency.setValueAtTime(110, this.ctx.currentTime);

      this.cavityFilter = this.ctx.createBiquadFilter();
      this.cavityFilter.type = 'lowpass';
      this.cavityFilter.frequency.setValueAtTime(440, this.ctx.currentTime);

      this.cavityGain = this.ctx.createGain();
      this.cavityGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      this.cavityOsc.connect(this.cavityFilter);
      this.cavityFilter.connect(this.cavityGain);
      this.cavityGain.connect(this.compressor);
      this.cavityOsc.start(0);
    } catch {}
  }

  /**
   * Modulates acoustic parameters smoothly based on optical telemetry
   */
  public updateTelemetry(
    wavelengthNm: number,
    fringeVisibility: number,
    piezoSpeed: number,
    cavityFinesse: number
  ): void {
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Laser wavelength mapping: 405nm (high pitch) to 700nm (warm low pitch)
    if (this.noiseFilter) {
      const centerFreq = Math.max(300, Math.min(2200, (800 - wavelengthNm) * 4.5 + 400));
      this.noiseFilter.frequency.setTargetAtTime(centerFreq, t, 0.05);
    }

    // Fringe Doppler Tone: frequency scales with piezo motion speed
    if (this.fringeOsc && this.fringeGain) {
      const dopplerHz = Math.min(880, Math.max(80, 150 + piezoSpeed * 300));
      this.fringeOsc.frequency.setTargetAtTime(dopplerHz, t, 0.04);

      const targetGain = Math.min(0.12, fringeVisibility * 0.08);
      this.fringeGain.gain.setTargetAtTime(targetGain, t, 0.06);
    }

    // Cavity resonance: Finesse swells resonance gain and filter cutoff
    if (this.cavityGain && this.cavityFilter && this.cavityOsc) {
      const normFinesse = Math.min(1.0, cavityFinesse / 40.0);
      const targetGain = 0.01 + normFinesse * 0.07;
      this.cavityGain.gain.setTargetAtTime(targetGain, t, 0.08);

      const cutoff = 200 + normFinesse * 800;
      this.cavityFilter.frequency.setTargetAtTime(cutoff, t, 0.08);
    }
  }

  /**
   * Plays harmonic phase shift chime
   */
  public playPhaseStepChime(phaseShiftDeg: number): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 440 + ((phaseShiftDeg % 360) / 360) * 440;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.15);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.compressor || this.masterGain);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc.start(t);
    osc.stop(t + 0.22);
  }

  /**
   * Plays holographic reconstruction flash sound
   */
  public playHologramLaserPulse(): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.18);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.compressor || this.masterGain);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc.start(t);
    osc.stop(t + 0.25);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime, 0.03);
    }
    return this.isMuted;
  }

  public destroy(): void {
    try {
      this.noiseNode?.stop();
      this.fringeOsc?.stop();
      this.cavityOsc?.stop();
      this.ctx?.close();
    } catch {}
  }
}
