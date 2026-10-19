/**
 * PLASMA-LAB: 100% Procedural Web Audio Plasma Sonification Engine
 * Generates continuous cyclotron resonance whine, turbulent MHD roar, magnetic reconnection crackles,
 * fusion neutron hum, and disruption siren alarms without external samples.
 */

export class PlasmaSonificationEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  // Continuous sound sources
  private gyroOsc: OscillatorNode | null = null;
  private gyroGain: GainNode | null = null;

  private mhdNoiseNode: AudioBufferSourceNode | null = null;
  private mhdFilter: BiquadFilterNode | null = null;
  private mhdGain: GainNode | null = null;

  private fusionHumOsc: OscillatorNode | null = null;
  private fusionHumGain: GainNode | null = null;

  private sirenOsc: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;

  constructor() {
    // AudioContext will initialize lazily on first user gesture
  }

  public init(): void {
    if (this.isInitialized) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Dynamics Compressor to strictly avoid digital clipping
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-15, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(14, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.20, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0.0 : 0.45, this.ctx.currentTime);

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.setupContinuousLayers();
      this.isInitialized = true;
    } catch {
      // Audio initialization fallback
    }
  }

  private setupContinuousLayers(): void {
    if (!this.ctx || !this.compressor) return;

    const t = this.ctx.currentTime;

    // 1. Cyclotron Gyro-Resonance Whine (Sine oscillator)
    this.gyroOsc = this.ctx.createOscillator();
    this.gyroGain = this.ctx.createGain();
    this.gyroOsc.type = 'sine';
    this.gyroOsc.frequency.setValueAtTime(850, t);
    this.gyroGain.gain.setValueAtTime(0.015, t);
    this.gyroOsc.connect(this.gyroGain);
    this.gyroGain.connect(this.compressor);
    this.gyroOsc.start(t);

    // 2. Turbulent MHD Fluid Flutter (Filtered noise)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02; // Pink-brown noise
      lastOut = data[i];
    }

    this.mhdNoiseNode = this.ctx.createBufferSource();
    this.mhdNoiseNode.buffer = noiseBuffer;
    this.mhdNoiseNode.loop = true;

    this.mhdFilter = this.ctx.createBiquadFilter();
    this.mhdFilter.type = 'bandpass';
    this.mhdFilter.frequency.setValueAtTime(180, t);
    this.mhdFilter.Q.setValueAtTime(2.5, t);

    this.mhdGain = this.ctx.createGain();
    this.mhdGain.gain.setValueAtTime(0.025, t);

    this.mhdNoiseNode.connect(this.mhdFilter);
    this.mhdFilter.connect(this.mhdGain);
    this.mhdGain.connect(this.compressor);
    this.mhdNoiseNode.start(t);

    // 3. Fusion Neutron Burn Hum (Sub-bass tone)
    this.fusionHumOsc = this.ctx.createOscillator();
    this.fusionHumGain = this.ctx.createGain();
    this.fusionHumOsc.type = 'triangle';
    this.fusionHumOsc.frequency.setValueAtTime(65, t);
    this.fusionHumGain.gain.setValueAtTime(0.02, t);
    this.fusionHumOsc.connect(this.fusionHumGain);
    this.fusionHumGain.connect(this.compressor);
    this.fusionHumOsc.start(t);

    // 4. Disruption Siren Warning Tone
    this.sirenOsc = this.ctx.createOscillator();
    this.sirenGain = this.ctx.createGain();
    this.sirenOsc.type = 'sawtooth';
    this.sirenOsc.frequency.setValueAtTime(660, t);
    this.sirenGain.gain.setValueAtTime(0.0, t); // Starts silent
    this.sirenOsc.connect(this.sirenGain);
    this.sirenGain.connect(this.compressor);
    this.sirenOsc.start(t);
  }

  /**
   * Modulates sound parameters in real time based on plasma telemetry
   */
  public updateTelemetry(
    b0Tesla: number,
    ipMa: number,
    fusionPowerMw: number,
    tearingIslandCm: number,
    disruptionRisk: number,
    isDisrupted: boolean
  ): void {
    if (!this.ctx || !this.isInitialized) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const t = this.ctx.currentTime;

    // 1. Gyro-resonance pitch mapped to toroidal field: 600 Hz to 2400 Hz
    if (this.gyroOsc && this.gyroGain) {
      const targetFreq = Math.min(2400, Math.max(400, b0Tesla * 260 + 300));
      this.gyroOsc.frequency.linearRampToValueAtTime(targetFreq, t + 0.08);

      const gyroVol = isDisrupted ? 0.001 : 0.012 + Math.min(0.03, (ipMa / 15.0) * 0.02);
      this.gyroGain.gain.linearRampToValueAtTime(gyroVol, t + 0.08);
    }

    // 2. Turbulent MHD Flutter noise
    if (this.mhdFilter && this.mhdGain) {
      const targetFilterFreq = Math.min(600, Math.max(120, 140 + tearingIslandCm * 15.0));
      this.mhdFilter.frequency.linearRampToValueAtTime(targetFilterFreq, t + 0.08);

      const mhdVol = isDisrupted ? 0.005 : Math.min(0.08, 0.015 + (fusionPowerMw / 500.0) * 0.045);
      this.mhdGain.gain.linearRampToValueAtTime(mhdVol, t + 0.08);
    }

    // 3. Fusion neutron hum volume and pitch
    if (this.fusionHumOsc && this.fusionHumGain) {
      const humFreq = 55 + Math.min(60, (fusionPowerMw / 500.0) * 45);
      this.fusionHumOsc.frequency.linearRampToValueAtTime(humFreq, t + 0.08);

      const humVol = isDisrupted ? 0.0 : Math.min(0.06, (fusionPowerMw / 500.0) * 0.05);
      this.fusionHumGain.gain.linearRampToValueAtTime(humVol, t + 0.08);
    }

    // 4. Disruption Siren Warning Tone
    if (this.sirenGain && this.sirenOsc) {
      if (disruptionRisk > 0.65 || isDisrupted) {
        // Modulate alarm frequency between 520 Hz and 880 Hz
        const sirenPitch = 600 + 280 * Math.sin(t * 8.0);
        this.sirenOsc.frequency.setValueAtTime(sirenPitch, t);

        const sirenVol = isDisrupted ? 0.12 : (disruptionRisk - 0.65) * 0.25;
        this.sirenGain.gain.linearRampToValueAtTime(sirenVol, t + 0.05);
      } else {
        this.sirenGain.gain.linearRampToValueAtTime(0.0, t + 0.08);
      }
    }
  }

  /**
   * Plays sharp magnetic reconnection snapping crackle when tearing islands fluctuate
   */
  public playReconnectionCrackle(): void {
    if (!this.ctx || !this.compressor || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400 + Math.random() * 800, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.04);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.compressor);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc.start(t);
    osc.stop(t + 0.06);
  }

  /**
   * Plays sudden explosive crash and quench hiss when a plasma disruption occurs
   */
  public playDisruptionCrash(): void {
    if (!this.ctx || !this.compressor || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Sub-bass thump
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.4);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.compressor);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc.start(t);
    osc.stop(t + 0.5);
  }

  /**
   * Plays high-tech diagnostic chime on scenario or pellet trigger
   */
  public playDiagnosticChime(): void {
    if (!this.ctx || !this.compressor || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, t); // B5
    osc.frequency.exponentialRampToValueAtTime(1318.51, t + 0.12); // E6

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.compressor);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc.start(t);
    osc.stop(t + 0.35);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0.0 : 0.45, this.ctx.currentTime + 0.05);
    }
    return this.isMuted;
  }

  public destroy(): void {
    try {
      this.gyroOsc?.stop();
      this.mhdNoiseNode?.stop();
      this.fusionHumOsc?.stop();
      this.sirenOsc?.stop();

      this.gyroOsc?.disconnect();
      this.mhdNoiseNode?.disconnect();
      this.mhdFilter?.disconnect();
      this.fusionHumOsc?.disconnect();
      this.sirenOsc?.disconnect();
      this.masterGain?.disconnect();
      this.compressor?.disconnect();

      if (this.ctx && this.ctx.state !== 'closed') {
        this.ctx.close().catch(() => {});
      }
    } catch {}

    this.isInitialized = false;
  }
}
