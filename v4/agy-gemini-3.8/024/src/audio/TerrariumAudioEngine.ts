/**
 * POCKET-TERRARIUM (EXP-024) — Procedural Web Audio Sonification Engine
 * 100% Synthesized Audio:
 * - Gentle aerator air stone bubbling gurgles
 * - Plant oxygen pearling crystal micro-chimes
 * - Fish feeding surface water plops
 * - Snail glass rasping texture clicks
 * - Water change rushing cascade
 * - Ecological toxicity advisory warning chime
 *
 * Equipped with user-gesture unlock, master DynamicsCompressor limiter, and node garbage collection.
 */

export class TerrariumAudioEngine {
  private ctx: AudioContext | null = null;
  private limiter: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private hasUserInteracted: boolean = false;

  private lastBubbleTime: number = 0;
  private lastPearlTime: number = 0;
  private lastFeedTime: number = 0;
  private lastAlarmTime: number = 0;
  private unlockHandler: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.unlockHandler = () => {
        this.unlock();
        this.removeUnlockListeners();
      };
      window.addEventListener('pointerdown', this.unlockHandler, { passive: true });
      window.addEventListener('keydown', this.unlockHandler, { passive: true });
    }
  }

  private removeUnlockListeners(): void {
    if (this.unlockHandler && typeof window !== 'undefined') {
      window.removeEventListener('pointerdown', this.unlockHandler);
      window.removeEventListener('keydown', this.unlockHandler);
      this.unlockHandler = null;
    }
  }

  public unlock(): void {
    this.hasUserInteracted = true;
    this.removeUnlockListeners();
    this.initContext();
  }

  private initContext(): void {
    if (!this.hasUserInteracted && typeof window !== 'undefined') {
      return;
    }

    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master Limiter to prevent clipping across overlapping bubble/cascade events
      this.limiter = this.ctx.createDynamicsCompressor();
      this.limiter.threshold.setValueAtTime(-12.0, this.ctx.currentTime);
      this.limiter.knee.setValueAtTime(6.0, this.ctx.currentTime);
      this.limiter.ratio.setValueAtTime(16.0, this.ctx.currentTime);
      this.limiter.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.limiter.release.setValueAtTime(0.12, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0.0 : 0.4, this.ctx.currentTime);

      this.limiter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    } catch {
      // Audio not supported in headless environments
    }
  }

  public get muted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0.0 : 0.4, t + 0.04);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Aerator Air Stone Bubble Pop (Organic liquid gurgle)
   */
  public playBubblePop(intensity: number = 0.5): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const now = Date.now();
    if (now - this.lastBubbleTime < 60) return; // 60ms throttle
    this.lastBubbleTime = now;

    const t = this.ctx.currentTime;
    const dur = 0.06;

    // Upward pitch chirp: 300 Hz -> 650 Hz
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = 280 + Math.random() * 80;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 2.1, t + dur);

    gain.gain.setValueAtTime(0.15 * Math.min(1.0, intensity), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(this.limiter);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc.start(t);
    osc.stop(t + dur);
  }

  /**
   * Plant Pearling Oxygen Bubble (High-pitched crystal ping)
   */
  public playPearlingChime(intensity: number = 0.4): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const now = Date.now();
    if (now - this.lastPearlTime < 100) return; // 100ms throttle
    this.lastPearlTime = now;

    const t = this.ctx.currentTime;
    const dur = 0.25;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const freq = 1760 + Math.random() * 440; // A6 range
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + dur);

    gain.gain.setValueAtTime(0.08 * intensity, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(gain);
    gain.connect(this.limiter);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc.start(t);
    osc.stop(t + dur);
  }

  /**
   * Fish Surface Feeding Plop
   */
  public playFeedingPlop(intensity: number = 0.6): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const now = Date.now();
    if (now - this.lastFeedTime < 80) return;
    this.lastFeedTime = now;

    const t = this.ctx.currentTime;
    const dur = 0.09;

    // Downward resonant plop: 520 Hz -> 180 Hz
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + dur);

    gain.gain.setValueAtTime(0.25 * intensity, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(this.limiter);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc.start(t);
    osc.stop(t + dur);
  }

  /**
   * Water Change Rushing Cascade (Bandpass filtered white noise burst)
   */
  public playWaterChangeSwoosh(): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const t = this.ctx.currentTime;
    const dur = 0.8;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.exponentialRampToValueAtTime(1400, t + dur * 0.4);
    filter.frequency.exponentialRampToValueAtTime(400, t + dur);
    filter.Q.setValueAtTime(2.0, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.limiter);

    noise.onended = () => {
      try {
        noise.disconnect();
        filter.disconnect();
        gain.disconnect();
      } catch {}
    };

    noise.start(t);
    noise.stop(t + dur);
  }

  /**
   * Ecological Toxicity Advisory Warning Chime (Two-tone C5 - F#4 tritone alert)
   */
  public playWarningAlert(): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const now = Date.now();
    if (now - this.lastAlarmTime < 1500) return; // 1.5s throttle
    this.lastAlarmTime = now;

    const t = this.ctx.currentTime;

    const playTone = (freq: number, startTime: number) => {
      if (!this.ctx || !this.limiter) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.limiter);

      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      };

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    };

    playTone(523.25, t);        // C5
    playTone(369.99, t + 0.18); // F#4
  }

  public dispose(): void {
    this.removeUnlockListeners();
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
