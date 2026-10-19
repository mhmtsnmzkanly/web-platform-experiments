/**
 * POWDER-BOX (EXP-022) — Procedural Web Audio Sonification Engine
 * 100% synthesized sound effects: Sand rustle, liquid trickles, fire crackles,
 * steam hisses, acid sizzles, and explosive booms.
 *
 * Equipped with a studio-grade master DynamicsCompressorNode limiter to
 * eliminate digital clipping across overlapping audio events.
 */

export class PowderAudioEngine {
  private ctx: AudioContext | null = null;
  private limiter: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;

  private lastHissTime: number = 0;
  private lastCrackleTime: number = 0;
  private lastAcidTime: number = 0;
  private lastExplosionTime: number = 0;

  constructor() {
    // Lazy AudioContext initialization on first user gesture
  }

  private initContext(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master Dynamics Compressor (Limiter)
      this.limiter = this.ctx.createDynamicsCompressor();
      this.limiter.threshold.setValueAtTime(-12.0, this.ctx.currentTime); // dB
      this.limiter.knee.setValueAtTime(6.0, this.ctx.currentTime);
      this.limiter.ratio.setValueAtTime(16.0, this.ctx.currentTime); // Hard limiting
      this.limiter.attack.setValueAtTime(0.003, this.ctx.currentTime); // 3ms fast attack
      this.limiter.release.setValueAtTime(0.12, this.ctx.currentTime); // 120ms release

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0.0 : 0.45, this.ctx.currentTime);

      this.limiter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    } catch {
      // Audio not supported in headless environments
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0.0 : 0.45, this.ctx.currentTime + 0.04);
    }
  }

  public get muted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Soft granular rustle when powder particles pour or slide
   */
  public playPowderPour(): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const t = this.ctx.currentTime;
    const dur = 0.05;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, t);
    filter.Q.setValueAtTime(3.5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.limiter);

    noise.onended = () => {
      noise.disconnect();
      filter.disconnect();
      gain.disconnect();
    };

    noise.start(t);
  }

  /**
   * Gentle liquid bubble transient when water or oil flows
   */
  public playLiquidTrickle(): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const startFreq = 420 + Math.random() * 380;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 1.8, t + 0.05);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.limiter);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };

    osc.start(t);
    osc.stop(t + 0.07);
  }

  /**
   * Thermal boiling or lava steam hiss
   */
  public playSteamHiss(intensity: number = 0.8): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const now = Date.now();
    if (now - this.lastHissTime < 180) return; // Throttle hisses
    this.lastHissTime = now;

    const t = this.ctx.currentTime;
    const dur = 0.18;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2600, t);

    const gain = this.ctx.createGain();
    const vol = Math.min(0.4, Math.max(0.08, intensity * 0.35));
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.limiter);

    noise.onended = () => {
      noise.disconnect();
      filter.disconnect();
      gain.disconnect();
    };

    noise.start(t);
  }

  /**
   * Chemical acid corrosion sizzle
   */
  public playAcidSizzle(): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const now = Date.now();
    if (now - this.lastAcidTime < 150) return;
    this.lastAcidTime = now;

    const t = this.ctx.currentTime;
    const dur = 0.12;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (i % 7 === 0 ? 1.0 : 0.2);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, t);
    filter.Q.setValueAtTime(4.0, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.limiter);

    noise.onended = () => {
      noise.disconnect();
      filter.disconnect();
      gain.disconnect();
    };

    noise.start(t);
  }

  /**
   * Explosive deflagration boom (Low sub-bass sine drop + blast noise burst)
   */
  public playExplosion(): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const now = Date.now();
    if (now - this.lastExplosionTime < 200) return;
    this.lastExplosionTime = now;

    const t = this.ctx.currentTime;

    // Sub-bass sine pitch drop (160 Hz -> 35 Hz)
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();

    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(160, t);
    boomOsc.frequency.exponentialRampToValueAtTime(35, t + 0.28);

    boomGain.gain.setValueAtTime(0.65, t);
    boomGain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

    boomOsc.connect(boomGain);
    boomGain.connect(this.limiter);

    boomOsc.onended = () => {
      boomOsc.disconnect();
      boomGain.disconnect();
    };

    boomOsc.start(t);
    boomOsc.stop(t + 0.35);

    // Blast noise transient
    const dur = 0.22;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(900, t);
    lowpass.frequency.exponentialRampToValueAtTime(140, t + dur);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(lowpass);
    lowpass.connect(noiseGain);
    noiseGain.connect(this.limiter);

    noise.onended = () => {
      noise.disconnect();
      lowpass.disconnect();
      noiseGain.disconnect();
    };

    noise.start(t);
  }

  public dispose(): void {
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {
        // Ignore
      }
      this.ctx = null;
    }
  }
}
