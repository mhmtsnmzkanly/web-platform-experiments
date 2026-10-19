export class FluidAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  // Ambient fluid turbulence hum
  private flowNoiseSource: AudioBufferSourceNode | null = null;
  private flowFilter: BiquadFilterNode | null = null;
  private flowGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  // Cached noise buffer
  private noiseBuffer: AudioBuffer | null = null;
  private lastDropletTime: number = 0;

  constructor() {}

  public init() {
    if (this.ctx) return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Create 2-second looped noise for fluid flow
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 2;
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    // Pink noise approximation for warm water flow
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
    }

    this.flowFilter = this.ctx.createBiquadFilter();
    this.flowFilter.type = 'bandpass';
    this.flowFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
    this.flowFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    this.flowGain = this.ctx.createGain();
    this.flowGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    this.flowFilter.connect(this.flowGain);
    this.flowGain.connect(this.masterGain);

    this.startFlowAmbience();
  }

  private startFlowAmbience() {
    if (!this.ctx || !this.noiseBuffer || !this.flowFilter) return;
    this.flowNoiseSource = this.ctx.createBufferSource();
    this.flowNoiseSource.buffer = this.noiseBuffer;
    this.flowNoiseSource.loop = true;
    this.flowNoiseSource.connect(this.flowFilter);
    this.flowNoiseSource.start();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.25, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Update fluid flow sonification based on particle count and kinetic energy.
   * Safe to call from 60fps RAF loop without triggering browser autoplay warnings.
   */
  public updateFlow(kineticEnergy: number, particleCount: number) {
    if (this.isMuted || !this.ctx || !this.flowFilter || !this.flowGain) return;
    // Only modulate when context is genuinely active
    if (this.ctx.state !== 'running') return;

    const t = this.ctx.currentTime;
    // Modulate filter frequency based on kinetic energy
    const targetFreq = Math.min(1800, 200 + Math.sqrt(kineticEnergy) * 18);
    this.flowFilter.frequency.setTargetAtTime(targetFreq, t, 0.05);

    // Modulate flow volume based on particle count
    const targetGain = Math.min(0.12, (particleCount / 2000) * 0.09);
    this.flowGain.gain.setTargetAtTime(targetGain, t, 0.05);
  }

  /**
   * Play droplet water drop splash sound (rate-limited to max 10/sec)
   */
  public playDroplet(pitch: number = 600) {
    if (this.isMuted) return;
    const now = performance.now();
    if (now - this.lastDropletTime < 90) return;
    this.lastDropletTime = now;

    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Bubble pitch sweep upwards
    osc.frequency.setValueAtTime(pitch * 0.7, t);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, t + 0.08);

    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.11);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  /**
   * Play pressure shockwave burst (dam break / explosion)
   */
  public playPressureBurst() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.3);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, t);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.46);
    osc.onended = () => {
      osc.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
  }

  public dispose() {
    if (this.flowNoiseSource) {
      try {
        this.flowNoiseSource.stop();
        this.flowNoiseSource.disconnect();
      } catch {}
      this.flowNoiseSource = null;
    }
    if (this.flowFilter) {
      this.flowFilter.disconnect();
      this.flowFilter = null;
    }
    if (this.flowGain) {
      this.flowGain.disconnect();
      this.flowGain = null;
    }
    if (this.masterGain) {
      this.masterGain.disconnect();
      this.masterGain = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

export const fluidAudio = new FluidAudioEngine();
