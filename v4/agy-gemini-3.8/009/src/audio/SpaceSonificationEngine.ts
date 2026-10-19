/**
 * 100% Procedural Web Audio Engine for Orbital & Spacecraft Sonification
 * Zero external audio samples or audio files.
 */
export class SpaceSonificationEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  public isMuted: boolean = false;

  // Continuous drone nodes for gravity field sonification
  private gravityOsc: OscillatorNode | null = null;
  private gravitySubOsc: OscillatorNode | null = null;
  private gravityFilter: BiquadFilterNode | null = null;
  private gravityGain: GainNode | null = null;

  // Engine burn continuous roar
  private burnNoiseNode: AudioBufferSourceNode | null = null;
  private burnRumbleOsc: OscillatorNode | null = null;
  private burnGain: GainNode | null = null;
  private burnFilter: BiquadFilterNode | null = null;
  private isBurning: boolean = false;

  // Cached noise buffer
  private noiseBuffer: AudioBuffer | null = null;

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
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Compressor / Limiter
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-3, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(6, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.15, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.75, this.ctx.currentTime);

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);

      this.generateNoiseBuffer();
      this.setupGravityDrone();
    } catch (e) {
      console.warn('Web Audio API not supported in this environment:', e);
    }
  }

  private generateNoiseBuffer(): void {
    if (!this.ctx) return;
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 2; // 2 seconds looping white noise
    this.noiseBuffer = this.ctx.createBuffer(1, length, sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }

  private setupGravityDrone(): void {
    if (!this.ctx || !this.masterGain) return;

    this.gravityGain = this.ctx.createGain();
    this.gravityGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    this.gravityFilter = this.ctx.createBiquadFilter();
    this.gravityFilter.type = 'lowpass';
    this.gravityFilter.frequency.setValueAtTime(180, this.ctx.currentTime);
    this.gravityFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    this.gravityOsc = this.ctx.createOscillator();
    this.gravityOsc.type = 'sine';
    this.gravityOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // 55Hz (A1)

    this.gravitySubOsc = this.ctx.createOscillator();
    this.gravitySubOsc.type = 'triangle';
    this.gravitySubOsc.frequency.setValueAtTime(27.5, this.ctx.currentTime); // 27.5Hz (A0)

    this.gravityOsc.connect(this.gravityFilter);
    this.gravitySubOsc.connect(this.gravityFilter);
    this.gravityFilter.connect(this.gravityGain);
    this.gravityGain.connect(this.masterGain);

    this.gravityOsc.start();
    this.gravitySubOsc.start();
  }

  /**
   * Modulates the gravitational potential field tone based on altitude and speed
   */
  public updateGravityTone(speedKmS: number, altitudeKm: number, primaryMass: number): void {
    if (!this.ctx || !this.gravityOsc || !this.gravityFilter) return;

    // Map speed and gravity gradient to frequency and cutoff
    const baseFreq = 40 + Math.min(120, speedKmS * 4);
    const cutoff = 120 + Math.min(800, (primaryMass / (Math.max(100, altitudeKm) + 500)) * 0.05);

    const now = this.ctx.currentTime;
    this.gravityOsc.frequency.setTargetAtTime(baseFreq, now, 0.15);
    if (this.gravitySubOsc) {
      this.gravitySubOsc.frequency.setTargetAtTime(baseFreq * 0.5, now, 0.15);
    }
    this.gravityFilter.frequency.setTargetAtTime(Math.min(1200, cutoff), now, 0.2);
  }

  /**
   * Fires an RCS Attitude Control burst (short filtered noise hiss)
   */
  public playRcsBurst(): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const dur = 0.08 + Math.random() * 0.04;

    const noise = this.ctx.createBufferSource();
    if (this.noiseBuffer) {
      noise.buffer = this.noiseBuffer;
    }

    const bpf = this.ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(1400 + Math.random() * 400, t);
    bpf.Q.setValueAtTime(2.5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    noise.connect(bpf);
    bpf.connect(gain);
    gain.connect(this.masterGain);

    noise.onended = () => {
      try {
        noise.disconnect();
        bpf.disconnect();
        gain.disconnect();
      } catch {}
    };

    noise.start(t);
    noise.stop(t + dur);
  }

  /**
   * Starts or stops the main rocket engine burn rumble
   */
  public setRocketBurn(burning: boolean): void {
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;

    if (burning && !this.isBurning) {
      this.isBurning = true;

      this.burnGain = this.ctx.createGain();
      this.burnGain.gain.setValueAtTime(0.001, now);
      this.burnGain.gain.linearRampToValueAtTime(0.28, now + 0.15);

      this.burnFilter = this.ctx.createBiquadFilter();
      this.burnFilter.type = 'lowpass';
      this.burnFilter.frequency.setValueAtTime(350, now);

      this.burnRumbleOsc = this.ctx.createOscillator();
      this.burnRumbleOsc.type = 'sawtooth';
      this.burnRumbleOsc.frequency.setValueAtTime(42, now);

      if (this.noiseBuffer) {
        this.burnNoiseNode = this.ctx.createBufferSource();
        this.burnNoiseNode.buffer = this.noiseBuffer;
        this.burnNoiseNode.loop = true;
        this.burnNoiseNode.connect(this.burnFilter);
      }

      this.burnRumbleOsc.connect(this.burnFilter);
      this.burnFilter.connect(this.burnGain);
      this.burnGain.connect(this.masterGain);

      this.burnRumbleOsc.start(now);
      if (this.burnNoiseNode) this.burnNoiseNode.start(now);
    } else if (!burning && this.isBurning) {
      this.isBurning = false;
      if (this.burnGain) {
        this.burnGain.gain.cancelScheduledValues(now);
        this.burnGain.gain.setValueAtTime(this.burnGain.gain.value, now);
        this.burnGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

        setTimeout(() => {
          try {
            this.burnRumbleOsc?.stop();
            this.burnRumbleOsc?.disconnect();
            this.burnNoiseNode?.stop();
            this.burnNoiseNode?.disconnect();
          } catch {}
        }, 250);
      }
    }
  }

  /**
   * Telemetry chime for scheduled maneuver burn execution
   */
  public playManeuverChime(): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, t); // A5
    osc1.frequency.setValueAtTime(1318.51, t + 0.08); // E6

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1760, t + 0.08); // A6

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.onended = () => {
      try {
        osc1.disconnect();
        osc2.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc1.start(t);
    osc2.start(t + 0.08);
    osc1.stop(t + 0.35);
    osc2.stop(t + 0.35);
  }

  /**
   * Chime when crossing into a new Sphere of Influence (SOI)
   */
  public playSoiTransition(): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C Major arpeggio
    notes.forEach((freq, idx) => {
      const t = this.ctx!.currentTime + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      };

      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  /**
   * Warning siren when entering tidal disruption or atmospheric burn
   */
  public playTidalAlert(): void {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(220, t + 0.25);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };

    osc.start(t);
    osc.stop(t + 0.32);
  }

  /**
   * Mute / Unmute audio
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.75, this.ctx.currentTime, 0.03);
    }
    return this.isMuted;
  }

  public destroy(): void {
    try {
      this.gravityOsc?.stop();
      this.gravitySubOsc?.stop();
      this.burnRumbleOsc?.stop();
      this.burnNoiseNode?.stop();
      this.ctx?.close();
    } catch {}
  }
}
