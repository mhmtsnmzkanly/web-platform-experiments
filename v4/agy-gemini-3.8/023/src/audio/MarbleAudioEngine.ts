/**
 * MARBLE-FORGE (EXP-023) — Procedural Web Audio Sonification Engine
 * 100% Synthesized Audio:
 * - Tuned modal chime bells (C5, E5, G5, A5, C6) with inharmonic overtone synthesis
 * - Pinball bumper energetic electric boings
 * - Domino wooden toppling clacks
 * - Marble-to-marble and marble-to-rail rolling purrs and impact transients
 * - Archimedes screw motorized conveyor drone
 *
 * Equipped with master DynamicsCompressorNode limiter and node lifecycle garbage collection.
 */

export class MarbleAudioEngine {
  private ctx: AudioContext | null = null;
  private limiter: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;

  private lastBellTime: number = 0;
  private lastBumperTime: number = 0;
  private lastDominoTime: number = 0;
  private lastImpactTime: number = 0;

  private hasUserInteracted: boolean = false;

  constructor() {
    // Top-level user gesture unlock listener
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.unlock();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
    }
  }

  public unlock(): void {
    this.hasUserInteracted = true;
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

      // Master Studio Dynamics Compressor Limiter
      this.limiter = this.ctx.createDynamicsCompressor();
      this.limiter.threshold.setValueAtTime(-12.0, this.ctx.currentTime);
      this.limiter.knee.setValueAtTime(6.0, this.ctx.currentTime);
      this.limiter.ratio.setValueAtTime(16.0, this.ctx.currentTime);
      this.limiter.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.limiter.release.setValueAtTime(0.12, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0.0 : 0.45, this.ctx.currentTime);

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
      this.masterGain.gain.linearRampToValueAtTime(
        muted ? 0.0 : 0.45,
        this.ctx.currentTime + 0.04
      );
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Resonating Chime Bell (Fundamental + inharmonic modal overtones)
   */
  public playBellChime(frequency: number = 523.25, intensity: number = 0.8): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const now = Date.now();
    if (now - this.lastBellTime < 80) return; // 80ms throttle
    this.lastBellTime = now;

    const t = this.ctx.currentTime;
    const dur = 1.4;

    // Bell overtones: f0, 2.76 * f0, 5.4 * f0
    const partials = [
      { ratio: 1.0, gain: 0.6 * intensity, decay: dur },
      { ratio: 2.76, gain: 0.25 * intensity, decay: dur * 0.65 },
      { ratio: 5.4, gain: 0.12 * intensity, decay: dur * 0.35 },
    ];

    for (const p of partials) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency * p.ratio, t);

      gain.gain.setValueAtTime(p.gain, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + p.decay);

      osc.connect(gain);
      gain.connect(this.limiter);

      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      };

      osc.start(t);
      osc.stop(t + p.decay);
    }
  }

  /**
   * Pinball Bumper Active Impulse Kick
   */
  public playBumperBoing(intensity: number = 0.9): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const now = Date.now();
    if (now - this.lastBumperTime < 90) return;
    this.lastBumperTime = now;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Fast energetic pitch drop: 620 Hz -> 140 Hz
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(620, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);

    const vol = Math.min(0.5, Math.max(0.1, intensity * 0.45));
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.limiter);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc.start(t);
    osc.stop(t + 0.15);
  }

  /**
   * Domino Wooden Clack
   */
  public playDominoClack(intensity: number = 0.7): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const now = Date.now();
    if (now - this.lastDominoTime < 45) return;
    this.lastDominoTime = now;

    const t = this.ctx.currentTime;
    const dur = 0.035;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600 + Math.random() * 400, t);
    filter.Q.setValueAtTime(3.5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(Math.min(0.4, intensity * 0.35), t);
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
  }

  /**
   * Rail or Marble Impact Click
   */
  public playImpact(type: 'RAIL' | 'SEESAW' | 'MARBLE', intensity: number = 0.6): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const now = Date.now();
    if (now - this.lastImpactTime < 35) return;
    this.lastImpactTime = now;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const freq = type === 'MARBLE' ? 1200 + Math.random() * 600 : (type === 'SEESAW' ? 320 : 850);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.04);

    const vol = Math.min(0.35, Math.max(0.05, intensity * 0.28));
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc.connect(gain);
    gain.connect(this.limiter);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc.start(t);
    osc.stop(t + 0.05);
  }

  public dispose(): void {
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {}
      this.ctx = null;
    }
  }
}
