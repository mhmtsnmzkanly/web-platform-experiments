export class ColliderSonificationEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private isMuted: boolean = false;
  private activeNodes: Set<AudioNode> = new Set();

  constructor() {
    // AudioContext will be initialized on user gesture
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Master dynamics compressor limiter
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('AudioContext failed to initialize:', e);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.35, now + 0.04);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * RF bunch crossing pulse
   */
  public playBunchCrossing() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.compressor) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.02);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

    osc.connect(gain);
    gain.connect(this.compressor);

    osc.start(t);
    osc.stop(t + 0.025);

    this.trackTransient(osc, gain, 0.03);
  }

  /**
   * Tracker silicon microstrip ionization clicks
   */
  public playTrackerIonization(count: number, avgPt: number) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.compressor) return;

    const clicks = Math.min(6, Math.max(1, Math.floor(count / 4)));
    const baseFreq = 1200 + Math.min(2000, avgPt * 25);

    for (let i = 0; i < clicks; i++) {
      const t = this.ctx.currentTime + i * 0.012 + Math.random() * 0.008;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq + (Math.random() - 0.5) * 400, t);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);

      osc.connect(gain);
      gain.connect(this.compressor);

      osc.start(t);
      osc.stop(t + 0.02);

      this.trackTransient(osc, gain, 0.03 + i * 0.02);
    }
  }

  /**
   * ECAL high-frequency crystal bell chime for photon / electron showers
   */
  public playEcalCluster(energy: number) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.compressor) return;

    const t = this.ctx.currentTime;
    const freq = 1760 + Math.min(1200, energy * 8);

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, t);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.5, t); // Perfect fifth harmonic

    const vol = Math.min(0.2, 0.05 + (energy / 200) * 0.1);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.compressor);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.36);
    osc2.stop(t + 0.36);

    this.trackTransient(osc1, gain, 0.4);
    this.trackTransient(osc2, null, 0.4);
  }

  /**
   * HCAL hadronic cascade deep thud / filtered rumble
   */
  public playHcalCascade(energy: number) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.compressor) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.18);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, t);
    filter.frequency.exponentialRampToValueAtTime(80, t + 0.18);

    const vol = Math.min(0.25, 0.08 + (energy / 300) * 0.12);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.compressor);

    osc.start(t);
    osc.stop(t + 0.24);

    this.trackTransient(osc, gain, 0.26);
  }

  /**
   * Outer muon spectrometer brassy penetration tone
   */
  public playMuonChamberHit(pt: number) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.compressor) return;

    const t = this.ctx.currentTime;
    const carrier = this.ctx.createOscillator();
    const mod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    const freq = 220 + Math.min(220, pt * 2);
    carrier.frequency.setValueAtTime(freq, t);
    carrier.type = 'sine';

    mod.frequency.setValueAtTime(freq * 2, t);
    mod.type = 'sine';
    modGain.gain.setValueAtTime(180, t);
    modGain.gain.exponentialRampToValueAtTime(1, t + 0.3);

    mod.connect(carrier.frequency);
    carrier.connect(gain);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);

    gain.connect(this.compressor);

    mod.start(t);
    carrier.start(t);
    mod.stop(t + 0.42);
    carrier.stop(t + 0.42);

    this.trackTransient(carrier, gain, 0.45);
    this.trackTransient(mod, modGain, 0.45);
  }

  /**
   * Euphoric resonance discovery arpeggio for Higgs / Z candidates
   */
  public playResonanceDiscovery(target: string) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.compressor) return;

    const t = this.ctx.currentTime;
    // Harmonic arpeggio frequencies (C6, E6, G6, B6, C7)
    const notes = [1046.5, 1318.5, 1567.98, 1975.53, 2093.0];

    notes.forEach((freq, idx) => {
      const noteT = t + idx * 0.055;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteT);

      gain.gain.setValueAtTime(0.12, noteT);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteT + 0.28);

      osc.connect(gain);
      gain.connect(this.compressor!);

      osc.start(noteT);
      osc.stop(noteT + 0.3);

      this.trackTransient(osc, gain, 0.4 + idx * 0.06);
    });
  }

  private trackTransient(nodeA: AudioNode, nodeB: AudioNode | null, durationSec: number) {
    this.activeNodes.add(nodeA);
    if (nodeB) this.activeNodes.add(nodeB);

    setTimeout(() => {
      try {
        nodeA.disconnect();
        this.activeNodes.delete(nodeA);
        if (nodeB) {
          nodeB.disconnect();
          this.activeNodes.delete(nodeB);
        }
      } catch {
        // Ignored if already disconnected
      }
    }, durationSec * 1000 + 50);
  }

  public dispose() {
    for (const node of this.activeNodes) {
      try {
        node.disconnect();
      } catch {
        // Ignore
      }
    }
    this.activeNodes.clear();

    if (this.compressor) {
      this.compressor.disconnect();
      this.compressor = null;
    }
    if (this.masterGain) {
      this.masterGain.disconnect();
      this.masterGain = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
