/**
 * PONTIFEX (EXP-021) — Procedural Web Audio Engine
 * 100% synthesized sound design with master DynamicsCompressor limiter.
 * Features structural creaks, brittle snap cracks, vehicle engine rumble,
 * water splashes, and construction interface clicks.
 */

import { MaterialType } from '../types';

export class BridgeAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private limiter: DynamicsCompressorNode | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private isMuted: boolean = false;
  private lastCreakTime: number = 0;

  constructor() {
    // Lazy initialization on first user interaction
  }

  private initContext(): void {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Safety Limiter
      this.limiter = this.ctx.createDynamicsCompressor();
      this.limiter.threshold.setValueAtTime(-10.0, this.ctx.currentTime); // dB
      this.limiter.knee.setValueAtTime(6.0, this.ctx.currentTime);
      this.limiter.ratio.setValueAtTime(14.0, this.ctx.currentTime);
      this.limiter.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.limiter.release.setValueAtTime(0.12, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0.0 : 0.45, this.ctx.currentTime);

      this.limiter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    } catch {
      console.warn('[BridgeAudio] Web Audio API not supported in environment');
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0.0 : 0.45, this.ctx.currentTime + 0.05);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Click sound when placing or selecting a truss node
   */
  public playNodeClick(): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.04);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.limiter);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };

    osc.start(t);
    osc.stop(t + 0.05);
  }

  /**
   * Sound when connecting a beam member
   */
  public playBeamConnect(material: MaterialType): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (material === 'STEEL') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(440, t + 0.08);
    } else if (material === 'WOOD') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(160, t + 0.07);
    } else if (material === 'CABLE') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.06);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(210, t + 0.07);
    }

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.limiter);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };

    osc.start(t);
    osc.stop(t + 0.09);
  }

  /**
   * Structural stress creak when bridge members approach yield (> 75%)
   */
  public playCreak(stress: number): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const now = Date.now();
    if (now - this.lastCreakTime < 240) return; // Throttle creaks
    this.lastCreakTime = now;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200 + stress * 350, t);
    filter.Q.setValueAtTime(8.0, t);

    const gain = this.ctx.createGain();
    const volume = Math.min(0.35, Math.max(0.05, (stress - 0.7) * 1.2));
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

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
   * Loud brittle snap/fracture crack when a member yields and breaks
   */
  public playSnap(material: MaterialType): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Transient crack noise burst
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2.0 - 1.0) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(material === 'STEEL' ? 2400 : 900, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.65, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    noise.connect(highpass);
    highpass.connect(gain);
    gain.connect(this.limiter);

    noise.onended = () => {
      noise.disconnect();
      highpass.disconnect();
      gain.disconnect();
    };

    noise.start(t);

    // Resonant ping for steel/cable
    if (material === 'STEEL' || material === 'CABLE') {
      const pingOsc = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();
      pingOsc.type = 'triangle';
      pingOsc.frequency.setValueAtTime(material === 'STEEL' ? 1450 : 2100, t);
      pingOsc.frequency.exponentialRampToValueAtTime(400, t + 0.15);

      pingGain.gain.setValueAtTime(0.4, t);
      pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      pingOsc.connect(pingGain);
      pingGain.connect(this.limiter);

      pingOsc.onended = () => {
        pingOsc.disconnect();
        pingGain.disconnect();
      };

      pingOsc.start(t);
      pingOsc.stop(t + 0.16);
    }
  }

  /**
   * Vehicle engine sound loop tracking speed
   */
  public updateEngineSound(active: boolean, speed: number, maxSpeed: number): void {
    this.initContext();
    if (!this.ctx || !this.limiter) return;

    if (!active || this.isMuted) {
      if (this.engineGain) {
        this.engineGain.gain.linearRampToValueAtTime(0.0, this.ctx.currentTime + 0.08);
      }
      return;
    }

    const t = this.ctx.currentTime;
    if (!this.engineOsc) {
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();

      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(65, t);
      this.engineGain.gain.setValueAtTime(0.0, t);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, t);

      this.engineOsc.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.limiter);

      this.engineOsc.start(t);
    }

    const speedFraction = Math.min(1.0, Math.max(0.0, speed / (maxSpeed || 15.0)));
    const targetFreq = 55.0 + speedFraction * 130.0;
    this.engineOsc.frequency.linearRampToValueAtTime(targetFreq, t + 0.04);
    this.engineGain?.gain.linearRampToValueAtTime(0.18 + speedFraction * 0.1, t + 0.04);
  }

  /**
   * Splash sound when debris or vehicle crashes into canyon water
   */
  public playSplash(): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const t = this.ctx.currentTime;
    const dur = 0.28;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.exponentialRampToValueAtTime(220, t + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, t);
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
   * Victory fanfare when vehicle reaches opposite cliff flag
   */
  public playVictory(): void {
    this.initContext();
    if (!this.ctx || !this.limiter || this.isMuted) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const t = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.limiter) return;
      const noteTime = t + idx * 0.11;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.3, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(this.limiter);

      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };

      osc.start(noteTime);
      osc.stop(noteTime + 0.38);
    });
  }

  /**
   * Teardown & cleanup
   */
  public dispose(): void {
    if (this.engineOsc) {
      try {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      } catch {
        // Ignore
      }
      this.engineOsc = null;
    }
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
