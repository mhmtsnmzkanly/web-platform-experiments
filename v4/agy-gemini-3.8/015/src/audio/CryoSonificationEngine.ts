export class CryoSonificationEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  // Master nodes
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  // 1. AC Josephson / SQUID tone
  private squidOsc: OscillatorNode | null = null;
  private squidGain: GainNode | null = null;

  // 2. Microwave Shapiro drive hum
  private shapiroOsc: OscillatorNode | null = null;
  private shapiroGain: GainNode | null = null;

  // 3. Turbomolecular pump drone
  private pumpOsc1: OscillatorNode | null = null;
  private pumpOsc2: OscillatorNode | null = null;
  private pumpGain: GainNode | null = null;

  // 4. Cryogen boil-off hiss (procedural white noise generator)
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseGain: GainNode | null = null;

  // 5. Quench alert tone
  private quenchOsc: OscillatorNode | null = null;
  private quenchGain: GainNode | null = null;

  // Audio initialization guard
  private initialized: boolean = false;

  public init() {
    if (this.initialized) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Compressor to prevent any digital clipping
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(16, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.15, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0.0 : 0.45, this.ctx.currentTime);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);

      // --- SQUID / AC Josephson Oscillator ---
      this.squidOsc = this.ctx.createOscillator();
      this.squidOsc.type = 'sine';
      this.squidOsc.frequency.setValueAtTime(220, this.ctx.currentTime);

      this.squidGain = this.ctx.createGain();
      this.squidGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      this.squidOsc.connect(this.squidGain);
      this.squidGain.connect(this.masterGain);
      this.squidOsc.start();

      // --- Shapiro RF Hum ---
      this.shapiroOsc = this.ctx.createOscillator();
      this.shapiroOsc.type = 'triangle';
      this.shapiroOsc.frequency.setValueAtTime(440, this.ctx.currentTime);

      this.shapiroGain = this.ctx.createGain();
      this.shapiroGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      this.shapiroOsc.connect(this.shapiroGain);
      this.shapiroGain.connect(this.masterGain);
      this.shapiroOsc.start();

      // --- Turbomolecular Vacuum Pump Hum ---
      this.pumpOsc1 = this.ctx.createOscillator();
      this.pumpOsc1.type = 'sawtooth';
      this.pumpOsc1.frequency.setValueAtTime(120, this.ctx.currentTime);

      this.pumpOsc2 = this.ctx.createOscillator();
      this.pumpOsc2.type = 'sine';
      this.pumpOsc2.frequency.setValueAtTime(360, this.ctx.currentTime);

      this.pumpGain = this.ctx.createGain();
      this.pumpGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      const pumpFilter = this.ctx.createBiquadFilter();
      pumpFilter.type = 'lowpass';
      pumpFilter.frequency.setValueAtTime(450, this.ctx.currentTime);

      this.pumpOsc1.connect(pumpFilter);
      this.pumpOsc2.connect(pumpFilter);
      pumpFilter.connect(this.pumpGain);
      this.pumpGain.connect(this.masterGain);

      this.pumpOsc1.start();
      this.pumpOsc2.start();

      // --- Cryogen Boil-Off Noise ---
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = noiseBuffer;
      this.noiseSource.loop = true;

      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseFilter.type = 'bandpass';
      this.noiseFilter.frequency.setValueAtTime(800, this.ctx.currentTime);
      this.noiseFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      this.noiseSource.connect(this.noiseFilter);
      this.noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);
      this.noiseSource.start();

      // --- Quench Alarm ---
      this.quenchOsc = this.ctx.createOscillator();
      this.quenchOsc.type = 'sawtooth';
      this.quenchOsc.frequency.setValueAtTime(880, this.ctx.currentTime);

      this.quenchGain = this.ctx.createGain();
      this.quenchGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      const quenchFilter = this.ctx.createBiquadFilter();
      quenchFilter.type = 'lowpass';
      quenchFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);

      this.quenchOsc.connect(quenchFilter);
      quenchFilter.connect(this.quenchGain);
      this.quenchGain.connect(this.masterGain);
      this.quenchOsc.start();

      this.initialized = true;
    } catch {
      // AudioContext unavailable or restricted
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0.0 : 0.45, now + 0.05);
    }
  }

  public updateSquidTone(voltageMilliV: number, sensitivity: number, active: boolean) {
    if (!this.initialized || !this.ctx || !this.squidOsc || !this.squidGain) return;
    const now = this.ctx.currentTime;

    if (!active || this.isMuted) {
      this.squidGain.gain.linearRampToValueAtTime(0.0, now + 0.05);
      return;
    }

    // Map Josephson voltage to audio frequency: 120 Hz to 1100 Hz
    const targetFreq = Math.min(1200, Math.max(90, 140 + voltageMilliV * 350));
    this.squidOsc.frequency.setTargetAtTime(targetFreq, now, 0.03);

    const targetGain = Math.min(0.2, 0.04 + sensitivity * 0.06);
    this.squidGain.gain.setTargetAtTime(targetGain, now, 0.03);
  }

  public updateShapiroTone(fRf: number, iRf: number, active: boolean) {
    if (!this.initialized || !this.ctx || !this.shapiroOsc || !this.shapiroGain) return;
    const now = this.ctx.currentTime;

    if (!active || this.isMuted || iRf < 0.05) {
      this.shapiroGain.gain.linearRampToValueAtTime(0.0, now + 0.05);
      return;
    }

    const targetFreq = 220 * fRf;
    this.shapiroOsc.frequency.setTargetAtTime(targetFreq, now, 0.03);

    const targetGain = Math.min(0.12, iRf * 0.05);
    this.shapiroGain.gain.setTargetAtTime(targetGain, now, 0.03);
  }

  public updateCryoNoise(boilOffRate: number, stageMCTempK: number) {
    if (!this.initialized || !this.ctx || !this.noiseFilter || !this.noiseGain) return;
    const now = this.ctx.currentTime;

    if (this.isMuted) {
      this.noiseGain.gain.linearRampToValueAtTime(0.0, now + 0.05);
      return;
    }

    // Frequency shifts up with boil-off intensity
    const targetFreq = Math.min(3200, 600 + boilOffRate * 25);
    this.noiseFilter.frequency.setTargetAtTime(targetFreq, now, 0.05);

    const targetGain = Math.min(0.18, 0.015 + (boilOffRate / 60.0) * 0.08);
    this.noiseGain.gain.setTargetAtTime(targetGain, now, 0.05);
  }

  public updateQuenchState(isQuenched: boolean, jouleWatts: number) {
    if (!this.initialized || !this.ctx || !this.quenchGain || !this.quenchOsc) return;
    const now = this.ctx.currentTime;

    if (!isQuenched || this.isMuted || jouleWatts < 10) {
      this.quenchGain.gain.linearRampToValueAtTime(0.0, now + 0.08);
      return;
    }

    // Siren warble frequency
    const warble = 700 + Math.sin(now * 8.0) * 200;
    this.quenchOsc.frequency.setValueAtTime(warble, now);

    const targetGain = Math.min(0.25, 0.05 + Math.min(1.0, jouleWatts / 20000) * 0.18);
    this.quenchGain.gain.setTargetAtTime(targetGain, now, 0.05);
  }

  public triggerVortexClick() {
    if (!this.initialized || !this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 + Math.random() * 600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.025);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.04);
      setTimeout(() => {
        osc.disconnect();
        filter.disconnect();
        gain.disconnect();
      }, 50);
    } catch {
      // Ignore click transient errors
    }
  }

  public dispose() {
    if (this.ctx) {
      try {
        this.squidOsc?.stop();
        this.shapiroOsc?.stop();
        this.pumpOsc1?.stop();
        this.pumpOsc2?.stop();
        this.noiseSource?.stop();
        this.quenchOsc?.stop();

        this.squidOsc?.disconnect();
        this.shapiroOsc?.disconnect();
        this.pumpOsc1?.disconnect();
        this.pumpOsc2?.disconnect();
        this.noiseSource?.disconnect();
        this.quenchOsc?.disconnect();
        this.masterGain?.disconnect();
        this.compressor?.disconnect();

        this.ctx.close();
      } catch {
        // Safe disposal
      }
      this.ctx = null;
      this.initialized = false;
    }
  }
}
