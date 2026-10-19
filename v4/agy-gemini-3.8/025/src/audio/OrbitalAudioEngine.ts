/**
 * ORBITAL-SLINGSHOT (EXP-025) — Procedural Web Audio Sonification Engine
 * 100% Synthesized Astrodynamic Audio:
 * - Thruster rocket burn roar with filtered noise & sub-bass
 * - Planetary Sphere of Influence (SOI) crystalline entry chime
 * - Gravity assist periapsis flyby doppler whoosh
 * - Close-approach proximity radar beep
 * - Mission accomplishment harmonic fanfare
 * - Surface impact collision transient
 *
 * Equipped with master DynamicsCompressor limiter, user-gesture unlock, and node garbage collection.
 */

export class OrbitalAudioEngine {
  private ctx: AudioContext | null = null;
  private limiter: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private hasUserInteracted: boolean = false;
  private unlockHandler: (() => void) | null = null;

  private lastBurnTime: number = 0;
  private lastSoiTime: number = 0;
  private lastPeriapsisTime: number = 0;
  private lastSuccessTime: number = 0;

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
    if (!this.hasUserInteracted && typeof window !== 'undefined') return;

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

      // Master Dynamics Compressor Limiter
      this.limiter = this.ctx.createDynamicsCompressor();
      this.limiter.threshold.setValueAtTime(-12.0, this.ctx.currentTime);
      this.limiter.knee.setValueAtTime(6.0, this.ctx.currentTime);
      this.limiter.ratio.setValueAtTime(16.0, this.ctx.currentTime);
      this.limiter.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.limiter.release.setValueAtTime(0.12, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0.0 : 0.65, this.ctx.currentTime);

      this.masterGain.connect(this.limiter);
      this.limiter.connect(this.ctx.destination);
    } catch {
      this.ctx = null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0.0 : 0.65, t + 0.04);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Synthesizes Rocket Thruster Burn Roar
   */
  public playThrusterBurn(intensity: number = 0.8): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = performance.now();
    if (now - this.lastBurnTime < 180) return;
    this.lastBurnTime = now;

    const t = this.ctx.currentTime;
    const dur = 0.45;

    // 1. Noise Generator for Rocket Flame
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.95 * b1 + white * 0.1;
      b2 = 0.85 * b2 + white * 0.2;
      output[i] = (b0 + b1 + b2) * 0.35;
    }

    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, t);
    filter.frequency.exponentialRampToValueAtTime(120, t + dur);

    const gain = this.ctx.createGain();
    const peakVol = Math.min(0.5, 0.2 + intensity * 0.3);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(peakVol, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    // 2. Sub-bass Rumble
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(65, t);
    subOsc.frequency.exponentialRampToValueAtTime(38, t + dur);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.001, t);
    subGain.gain.linearRampToValueAtTime(peakVol * 0.7, t + 0.05);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    noiseSrc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);

    noiseSrc.onended = () => {
      try {
        noiseSrc.disconnect();
        filter.disconnect();
        gain.disconnect();
      } catch {}
    };

    subOsc.onended = () => {
      try {
        subOsc.disconnect();
        subGain.disconnect();
      } catch {}
    };

    noiseSrc.start(t);
    subOsc.start(t);
    subOsc.stop(t + dur);
  }

  /**
   * Sphere of Influence (SOI) Entry/Exit Celestial Chime
   */
  public playSoiEntryChime(intensity: number = 0.7): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = performance.now();
    if (now - this.lastSoiTime < 600) return;
    this.lastSoiTime = now;

    const t = this.ctx.currentTime;
    const playChimeTone = (freq: number, startOffset: number) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + startOffset);

      gain.gain.setValueAtTime(0.001, t + startOffset);
      gain.gain.linearRampToValueAtTime(0.22 * intensity, t + startOffset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + startOffset + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      };

      osc.start(t + startOffset);
      osc.stop(t + startOffset + 0.65);
    };

    playChimeTone(587.33, 0);     // D5
    playChimeTone(880.0, 0.12);   // A5
    playChimeTone(1174.66, 0.24); // D6
  }

  /**
   * Gravity Assist Periapsis Flyby Whoosh
   */
  public playGravityAssistWhoosh(intensity: number = 0.8): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = performance.now();
    if (now - this.lastPeriapsisTime < 800) return;
    this.lastPeriapsisTime = now;

    const t = this.ctx.currentTime;
    const dur = 0.8;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Doppler sweep: rises up to periapsis, then slopes down
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(540, t + dur * 0.45);
    osc.frequency.exponentialRampToValueAtTime(140, t + dur);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.28 * intensity, t + dur * 0.45);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);

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
   * Surface Crash / Collision Impact
   */
  public playCollisionImpact(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const dur = 0.6;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + dur);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);

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
   * Mission Accomplishment Victory Fanfare
   */
  public playMissionSuccessFanfare(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = performance.now();
    if (now - this.lastSuccessTime < 2000) return;
    this.lastSuccessTime = now;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = t + i * 0.12;
      const duration = i === notes.length - 1 ? 0.8 : 0.25;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.24, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      };

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  }

  public dispose(): void {
    this.removeUnlockListeners();
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
