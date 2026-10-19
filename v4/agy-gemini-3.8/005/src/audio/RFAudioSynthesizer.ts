/**
 * RFAudioSynthesizer.ts
 * Real-time electromagnetic wave field sonification engine.
 * Translates Maxwell field oscillations Ez(t) and Poynting flux into audible RF telemetry.
 */

export class RFAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private carrierOsc: OscillatorNode | null = null;
  private carrierGain: GainNode | null = null;
  private isMuted: boolean = true; // Start muted by default to respect browser autoplay

  constructor() {}

  private initContext() {
    if (this.ctx) return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.12, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Continuous RF carrier hum
    this.carrierOsc = this.ctx.createOscillator();
    this.carrierGain = this.ctx.createGain();

    this.carrierOsc.type = 'sine';
    this.carrierOsc.frequency.setValueAtTime(220, this.ctx.currentTime);
    this.carrierGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.carrierOsc.connect(this.carrierGain);
    this.carrierGain.connect(this.masterGain);
    this.carrierOsc.start();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.initContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.12, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Modulate continuous tone according to probe value
   */
  public updateProbeSonification(probeValue: number, energy: number) {
    if (this.isMuted || !this.ctx || !this.carrierOsc || !this.carrierGain) return;

    const t = this.ctx.currentTime;
    // Map probe Ez amplitude [-1, 1] to audible pitch shift
    const baseFreq = 180 + Math.min(600, energy * 0.08);
    const modFreq = Math.max(80, baseFreq + probeValue * 140);
    this.carrierOsc.frequency.setTargetAtTime(modFreq, t, 0.04);

    const amp = Math.min(0.25, Math.abs(probeValue) * 0.15 + 0.01);
    this.carrierGain.gain.setTargetAtTime(amp, t, 0.04);
  }

  /**
   * Sound on shock pulse trigger
   */
  public playShockPulse() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.12);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.45);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.46);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  /**
   * Sound on preset switch
   */
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, t);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.035);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  public dispose() {
    if (this.carrierOsc) {
      try {
        this.carrierOsc.stop();
        this.carrierOsc.disconnect();
      } catch {}
      this.carrierOsc = null;
    }
    if (this.carrierGain) {
      this.carrierGain.disconnect();
      this.carrierGain = null;
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

export const rfAudio = new RFAudioSynthesizer();
