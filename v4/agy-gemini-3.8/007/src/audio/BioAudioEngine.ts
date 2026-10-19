class BioAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted = false;
  private isInitialized = false;

  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;

  private lastChimeTime = 0;
  private lastPopTime = 0;
  private lastBiteTime = 0;
  private lastZapTime = 0;

  public init() {
    if (this.isInitialized && this.ctx && this.ctx.state !== 'closed') {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Ambient underwater sterile laboratory drone
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      gain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();

      this.ambientOsc = osc;
      this.ambientGain = gain;
      this.ambientFilter = filter;
      this.isInitialized = true;
    } catch {
      // AudioContext unavailable or restricted
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(muted ? 0 : 0.04, this.ctx.currentTime);
    }
  }

  // Mitosis cell division sound (ascending resonant harmonic chirp)
  public playMitosisPop(freq = 320) {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    const now = performance.now();
    if (now - this.lastPopTime < 80) return; // Rate-limiting guard
    this.lastPopTime = now;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, t + 0.12);

      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.16);
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      };
    } catch {}
  }

  // Feeding & nutrient absorption chime
  public playFeedChime(pitch = 880) {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    const now = performance.now();
    if (now - this.lastChimeTime < 50) return; // Rate-limiting guard
    this.lastChimeTime = now;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, t);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.1);
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      };
    } catch {}
  }

  // Predator bite crunch
  public playBiteCrunch() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    const now = performance.now();
    if (now - this.lastBiteTime < 100) return;
    this.lastBiteTime = now;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.1);
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      };
    } catch {}
  }

  // Mutagenic radiation beam zap
  public playMutagenZap() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    const now = performance.now();
    if (now - this.lastZapTime < 80) return;
    this.lastZapTime = now;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440 + Math.random() * 200, t);
      osc.frequency.linearRampToValueAtTime(800 + Math.random() * 300, t + 0.07);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.09);
      osc.onended = () => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      };
    } catch {}
  }

  public dispose() {
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop();
        this.ambientOsc.disconnect();
      } catch {}
    }
    if (this.ambientGain) {
      try {
        this.ambientGain.disconnect();
      } catch {}
    }
    if (this.ambientFilter) {
      try {
        this.ambientFilter.disconnect();
      } catch {}
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch {}
    }
    this.ctx = null;
    this.isInitialized = false;
  }
}

export const bioAudio = new BioAudioEngine();
