/**
 * 100% Procedural Web Audio Engine for Aerodynamic Wind Tunnel Sonification
 * Zero external audio samples or audio files.
 */
export class AeroSonificationEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  public isMuted: boolean = false;

  // 1. Boundary layer turbulence noise
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseGain: GainNode | null = null;

  // 2. Periodic vortex shedding hum (Strouhal Tone)
  private sheddingOsc: OscillatorNode | null = null;
  private sheddingFilter: BiquadFilterNode | null = null;
  private sheddingGain: GainNode | null = null;

  // 3. High-alpha aerodynamic stall buffet rumble
  private stallOsc: OscillatorNode | null = null;
  private stallGain: GainNode | null = null;

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
      this.compressor.threshold.setValueAtTime(-3, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(6, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(14, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.05, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime);

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.setupTurbulenceNoise();
      this.setupVortexSheddingHum();
      this.setupStallBuffet();
    } catch (err) {
      console.warn('[AeroSonification] AudioContext initialization deferred:', err);
    }
  }

  /**
   * Generates continuous pink/white noise buffer for boundary layer air hiss
   */
  private setupTurbulenceNoise(): void {
    if (!this.ctx || !this.compressor) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0,
      b1 = 0,
      b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // 3-pole pinking filter
      b0 = 0.99765 * b0 + white * 0.099046;
      b1 = 0.963 * b1 + white * 0.2965164;
      b2 = 0.57 * b2 + white * 1.0526913;
      output[i] = (b0 + b1 + b2 + white * 0.1848) * 0.06;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    this.noiseFilter = this.ctx.createBiquadFilter();
    this.noiseFilter.type = 'bandpass';
    this.noiseFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    this.noiseFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    this.noiseNode.connect(this.noiseFilter);
    this.noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.compressor);

    this.noiseNode.start(0);
  }

  /**
   * Creates harmonic sine oscillator for periodic vortex shedding
   */
  private setupVortexSheddingHum(): void {
    if (!this.ctx || !this.compressor) return;

    this.sheddingOsc = this.ctx.createOscillator();
    this.sheddingOsc.type = 'sine';
    this.sheddingOsc.frequency.setValueAtTime(65, this.ctx.currentTime);

    this.sheddingFilter = this.ctx.createBiquadFilter();
    this.sheddingFilter.type = 'lowpass';
    this.sheddingFilter.frequency.setValueAtTime(250, this.ctx.currentTime);

    this.sheddingGain = this.ctx.createGain();
    this.sheddingGain.gain.setValueAtTime(0.03, this.ctx.currentTime);

    this.sheddingOsc.connect(this.sheddingFilter);
    this.sheddingFilter.connect(this.sheddingGain);
    this.sheddingGain.connect(this.compressor);

    this.sheddingOsc.start(0);
  }

  /**
   * Creates low-frequency sub-bass rumble for aerodynamic stall
   */
  private setupStallBuffet(): void {
    if (!this.ctx || !this.compressor) return;

    this.stallOsc = this.ctx.createOscillator();
    this.stallOsc.type = 'triangle';
    this.stallOsc.frequency.setValueAtTime(32, this.ctx.currentTime);

    this.stallGain = this.ctx.createGain();
    this.stallGain.gain.setValueAtTime(0.0, this.ctx.currentTime); // inactive until stall

    this.stallOsc.connect(this.stallGain);
    this.stallGain.connect(this.compressor);

    this.stallOsc.start(0);
  }

  /**
   * Dynamically modulates acoustics based on real-time fluid dynamics telemetry
   */
  public updateTelemetry(
    velocity: number, // 0.02 to 0.16
    strouhalFreq: number, // Hz
    dragCoeff: number,
    isStalled: boolean
  ): void {
    if (!this.ctx || this.isMuted) return;
    const t = this.ctx.currentTime;

    // 1. Boundary layer hiss frequency & amplitude scale with velocity
    if (this.noiseFilter && this.noiseGain) {
      const centerFreq = 600 + velocity * 18000; // 960 Hz to 3500 Hz
      const targetGain = Math.min(0.25, 0.04 + velocity * 1.5 + dragCoeff * 0.08);

      this.noiseFilter.frequency.setTargetAtTime(centerFreq, t, 0.05);
      this.noiseGain.gain.setTargetAtTime(targetGain, t, 0.05);
    }

    // 2. Vortex shedding tone scales with Strouhal frequency
    if (this.sheddingOsc && this.sheddingGain) {
      const targetPitch = Math.min(180, Math.max(30, strouhalFreq * 1.5 + 40));
      const targetSheddingGain = Math.min(0.12, 0.01 + dragCoeff * 0.06);

      this.sheddingOsc.frequency.setTargetAtTime(targetPitch, t, 0.08);
      this.sheddingGain.gain.setTargetAtTime(targetSheddingGain, t, 0.08);
    }

    // 3. Stall buffet deep rumble
    if (this.stallGain) {
      const stallIntensity = isStalled ? 0.18 : 0.0;
      this.stallGain.gain.setTargetAtTime(stallIntensity, t, 0.06);
    }
  }

  /**
   * Plays a crisp acoustic chime when switching airfoil presets
   */
  public playPresetTransitionChime(): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, t); // D5
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.12); // A5

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

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
   * Plays smoke puff burst ping
   */
  public playSmokeBurst(): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.15);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc.start(t);
    osc.stop(t + 0.16);
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
      this.sheddingOsc?.stop();
      this.stallOsc?.stop();
      this.ctx?.close();
    } catch {}
  }
}
