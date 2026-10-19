import {
  ActiveVoiceInfo,
  AudioTelemetry,
  InstrumentPreset,
  StringParams,
  PercussionParams,
  FMParams,
  WindParams,
  ExperimentalParams,
} from '../types';
import { DEFAULT_PRESETS } from '../presets/defaultPresets';

// Voice representation in Web Audio graph
interface ActiveVoice {
  id: string;
  note: number;
  freq: number;
  velocity: number;
  startTime: number;
  gainNode: GainNode;
  nodesToClean: (AudioNode | AudioBufferSourceNode | OscillatorNode)[];
  release: () => void;
  isReleasing?: boolean;
}

export class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private masterLimiter: DynamicsCompressorNode | null = null;
  private analyser: AnalyserNode | null = null;

  public isMuted = false;
  public isInitialized = false;

  public activePreset: InstrumentPreset = { ...DEFAULT_PRESETS[0] };
  public presetA: InstrumentPreset = { ...DEFAULT_PRESETS[0] };
  public presetB: InstrumentPreset = { ...DEFAULT_PRESETS[1] };
  public currentSlot: 'A' | 'B' = 'A';

  private voices: Map<string, ActiveVoice> = new Map();
  private voiceCounter = 0;

  // Analyser cache buffers
  private timeDataBuffer: Uint8Array | null = null;
  private freqDataBuffer: Uint8Array | null = null;

  constructor() {
    // Lazily initialized on genuine user gesture
  }

  public init() {
    if (this.isInitialized && this.ctx && this.ctx.state !== 'closed') {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx({ latencyHint: 'interactive' });

      // Master output stage: Master Gain -> Anti-Clipping Limiter -> Analyser -> Destination
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);

      this.masterLimiter = this.ctx.createDynamicsCompressor();
      this.masterLimiter.threshold.setValueAtTime(-1.5, this.ctx.currentTime);
      this.masterLimiter.knee.setValueAtTime(4, this.ctx.currentTime);
      this.masterLimiter.ratio.setValueAtTime(16, this.ctx.currentTime);
      this.masterLimiter.attack.setValueAtTime(0.002, this.ctx.currentTime);
      this.masterLimiter.release.setValueAtTime(0.08, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 1024;
      this.analyser.smoothingTimeConstant = 0.82;

      this.timeDataBuffer = new Uint8Array(this.analyser.fftSize);
      this.freqDataBuffer = new Uint8Array(this.analyser.frequencyBinCount);

      this.masterGain.connect(this.masterLimiter);
      this.masterLimiter.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.isInitialized = true;
    } catch {
      // AudioContext unavailable
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.85, this.ctx.currentTime);
    }
  }

  public setPreset(preset: InstrumentPreset) {
    this.activePreset = { ...preset };
  }

  public switchSlot(slot: 'A' | 'B') {
    this.currentSlot = slot;
    this.activePreset = slot === 'A' ? { ...this.presetA } : { ...this.presetB };
  }

  public saveToCurrentSlot(preset: InstrumentPreset) {
    if (this.currentSlot === 'A') {
      this.presetA = { ...preset };
    } else {
      this.presetB = { ...preset };
    }
    this.activePreset = { ...preset };
  }

  public getAvailablePresets(): InstrumentPreset[] {
    return DEFAULT_PRESETS;
  }

  // NOTE TRIGGER: DISPATCHES TO SPECIALIZED ALGORITHMIC SYNTHESIZER
  public noteOn(note: number, velocity = 0.8): string {
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return '';

    const freq = 440 * Math.pow(2, (note - 69) / 12);
    const voiceId = `v-${this.voiceCounter++}-${note}`;

    // Polyphony voice stealing check
    const maxPoly = this.activePreset.polyphony || 8;
    if (this.voices.size >= maxPoly) {
      // Find oldest voice, prioritizing voices that are already releasing
      let oldestReleasingTime = Infinity;
      let oldestHeldTime = Infinity;
      let oldestReleasingId: string | null = null;
      let oldestHeldId: string | null = null;

      for (const [id, v] of this.voices) {
        if (v.isReleasing) {
          if (v.startTime < oldestReleasingTime) {
            oldestReleasingTime = v.startTime;
            oldestReleasingId = id;
          }
        } else {
          if (v.startTime < oldestHeldTime) {
            oldestHeldTime = v.startTime;
            oldestHeldId = id;
          }
        }
      }
      const targetId = oldestReleasingId || oldestHeldId;
      if (targetId) {
        this.noteOff(targetId, true);
      }
    }

    const t = this.ctx.currentTime;
    const voiceGain = this.ctx.createGain();
    // Equal loudness preset gain compensation
    const presetGain = this.activePreset.gain || 1.0;
    const initialAmp = Math.max(0.01, Math.min(1.0, velocity * presetGain));

    const nodesToClean: (AudioNode | AudioBufferSourceNode | OscillatorNode)[] = [voiceGain];

    let voiceReleaseFn = () => {};

    // ROUTE TO CORRESPONDING ALGORITHMIC SYNTHESIS ENGINE
    switch (this.activePreset.family) {
      case 'STRINGS':
        voiceReleaseFn = this.synthesizeString(
          freq,
          velocity,
          voiceGain,
          nodesToClean,
          this.activePreset.stringParams || DEFAULT_PRESETS[0].stringParams!
        );
        break;
      case 'PERCUSSION':
        voiceReleaseFn = this.synthesizePercussion(
          freq,
          velocity,
          voiceGain,
          nodesToClean,
          this.activePreset.percussionParams || DEFAULT_PRESETS[5].percussionParams!
        );
        break;
      case 'FM':
        voiceReleaseFn = this.synthesizeFM(
          freq,
          velocity,
          voiceGain,
          nodesToClean,
          this.activePreset.fmParams || DEFAULT_PRESETS[10].fmParams!
        );
        break;
      case 'WIND':
        voiceReleaseFn = this.synthesizeWind(
          freq,
          velocity,
          voiceGain,
          nodesToClean,
          this.activePreset.windParams || DEFAULT_PRESETS[15].windParams!
        );
        break;
      case 'EXPERIMENTAL':
        voiceReleaseFn = this.synthesizeExperimental(
          freq,
          velocity,
          voiceGain,
          nodesToClean,
          this.activePreset.experimentalParams || DEFAULT_PRESETS[18].experimentalParams!
        );
        break;
    }

    voiceGain.connect(this.masterGain!);

    const voice: ActiveVoice = {
      id: voiceId,
      note,
      freq,
      velocity,
      startTime: t,
      gainNode: voiceGain,
      nodesToClean,
      release: voiceReleaseFn,
      isReleasing: false,
    };

    this.voices.set(voiceId, voice);
    return voiceId;
  }

  // NOTE RELEASE: TRIGGER ADSR RELEASE OR TERMINATE VOICE
  public noteOff(voiceId: string, immediate = false) {
    const voice = this.voices.get(voiceId);
    if (!voice || !this.ctx) return;
    if (voice.isReleasing && !immediate) return;

    voice.isReleasing = true;
    const t = this.ctx.currentTime;

    if (immediate) {
      if (typeof voice.gainNode.gain.cancelAndHoldAtTime === 'function') {
        voice.gainNode.gain.cancelAndHoldAtTime(t);
      } else {
        voice.gainNode.gain.cancelScheduledValues(t);
      }
      voice.gainNode.gain.linearRampToValueAtTime(0.0001, t + 0.008);
      setTimeout(() => {
        this.cleanupVoiceNodes(voice);
        this.voices.delete(voiceId);
      }, 20);
    } else {
      voice.release();
      const relTime = this.activePreset.adsr.release || 0.3;
      setTimeout(() => {
        this.cleanupVoiceNodes(voice);
        this.voices.delete(voiceId);
      }, (relTime + 0.1) * 1000);
    }
  }

  public noteOffByMidi(note: number) {
    for (const [id, voice] of this.voices) {
      if (voice.note === note && !voice.isReleasing) {
        this.noteOff(id);
      }
    }
  }

  public allNotesOff() {
    for (const [id] of this.voices) {
      this.noteOff(id, true);
    }
  }

  private cleanupVoiceNodes(voice: ActiveVoice) {
    for (const node of voice.nodesToClean) {
      try {
        if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch {}
    }
  }

  // =========================================================================
  // 1. PHYSICAL MODELING STRING SYNTHESIS (Karplus-Strong & Digital Waveguide)
  // =========================================================================
  private synthesizeString(
    freq: number,
    velocity: number,
    outGain: GainNode,
    nodes: (AudioNode | AudioBufferSourceNode | OscillatorNode)[],
    p: StringParams,
    ctxParam?: BaseAudioContext,
    startTime?: number
  ): () => void {
    const ctx = ctxParam || this.ctx!;
    const t = startTime !== undefined ? startTime : ctx.currentTime;

    // Period in seconds: 1 / f
    const period = 1 / freq;
    // Delay time modulated by string tension
    const delayTime = Math.max(0.0005, Math.min(0.05, period / p.tension));

    // A. Excitation generator: Short filtered white noise or non-linear plectrum strike
    const sampleRate = ctx.sampleRate;
    const burstLength = Math.max(32, Math.floor(sampleRate * Math.min(0.035, period * p.pluckPosition * 2.5)));
    const noiseBuffer = ctx.createBuffer(1, burstLength, sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    // Excitation shape according to string material
    const isSteel = p.material === 'STEEL';
    const isBass = p.material === 'BASS';

    for (let i = 0; i < burstLength; i++) {
      const frac = i / burstLength;
      // Windowed hammer strike
      const window = Math.sin(frac * Math.PI);
      const rawNoise = (Math.random() * 2 - 1);
      // Steel has sharper transient; Nylon has rounder softer strike
      noiseData[i] = rawNoise * window * (isSteel ? 1.0 : isBass ? 1.2 : 0.75);
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    nodes.push(noiseSource);

    // Excitation Filter (Brightness control)
    const exciterFilter = ctx.createBiquadFilter();
    exciterFilter.type = 'lowpass';
    exciterFilter.frequency.setValueAtTime(Math.min(16000, p.brightness * (0.6 + velocity * 0.8)), t);
    nodes.push(exciterFilter);

    // B. Digital Waveguide Delay Line
    const delay = ctx.createDelay(0.1);
    delay.delayTime.setValueAtTime(delayTime, t);
    nodes.push(delay);

    // Feedback Damping Filter (Critically-damped lowpass filter in the loop to prevent resonant peaks)
    const loopFilter = ctx.createBiquadFilter();
    loopFilter.type = 'lowpass';
    loopFilter.Q.setValueAtTime(0.5, t); // Critically damped (Q=0.5 guarantees |H(w)| <= 1.0 at all frequencies)
    // Higher damping = lower cutoff = faster high-frequency loss
    const loopCutoff = Math.max(600, Math.min(18000, 16000 * (1 - p.damping * 3.5)));
    loopFilter.frequency.setValueAtTime(loopCutoff, t);
    nodes.push(loopFilter);

    // Feedback Gain (Strictly clamped below unity to guarantee unconditional waveguide stability)
    const feedbackGain = ctx.createGain();
    const feedbackAmount = Math.max(0.80, Math.min(0.985, 1.0 - (0.025 / Math.max(0.2, p.decay))));
    feedbackGain.gain.setValueAtTime(feedbackAmount, t);
    nodes.push(feedbackGain);

    // C. Body Resonance (Acoustic cavity formants)
    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'peaking';
    bodyFilter.frequency.setValueAtTime(isBass ? 95 : 210, t);
    bodyFilter.Q.setValueAtTime(2.2, t);
    bodyFilter.gain.setValueAtTime(p.bodyResonance * 12, t);
    nodes.push(bodyFilter);

    // Connect Waveguide Loop: noise -> exciter -> delay -> loopFilter -> feedbackGain -> delay
    noiseSource.connect(exciterFilter);
    exciterFilter.connect(delay);
    delay.connect(loopFilter);
    loopFilter.connect(feedbackGain);
    feedbackGain.connect(delay);

    // Output through Body Cavity to voice gain
    delay.connect(bodyFilter);
    bodyFilter.connect(outGain);

    // Envelope
    outGain.gain.setValueAtTime(0, t);
    outGain.gain.linearRampToValueAtTime(velocity * p.excitationStrength * 0.7, t + this.activePreset.adsr.attack);
    outGain.gain.exponentialRampToValueAtTime(
      Math.max(0.001, velocity * this.activePreset.adsr.sustain * 0.5),
      t + this.activePreset.adsr.attack + this.activePreset.adsr.decay
    );

    noiseSource.start(t);

    return () => {
      const now = ctx.currentTime;
      if (typeof outGain.gain.cancelAndHoldAtTime === 'function') {
        outGain.gain.cancelAndHoldAtTime(now);
      } else {
        outGain.gain.cancelScheduledValues(now);
      }
      outGain.gain.exponentialRampToValueAtTime(0.0001, now + (this.activePreset.adsr.release || 0.3));
    };
  }

  // =========================================================================
  // 2. PERCUSSION SYNTHESIS (Modal Physics & Filtered Noise Envelopes)
  // =========================================================================
  private synthesizePercussion(
    freq: number,
    velocity: number,
    outGain: GainNode,
    nodes: (AudioNode | AudioBufferSourceNode | OscillatorNode)[],
    p: PercussionParams,
    ctxParam?: BaseAudioContext,
    startTime?: number
  ): () => void {
    const ctx = ctxParam || this.ctx!;
    const t = startTime !== undefined ? startTime : ctx.currentTime;
    // Scale pitch from keyboard frequency (C4 = 261.63 Hz) for tuned percussive play
    const pitchRatio = freq / 261.63;
    const basePitch = p.pitch * (p.type === 'HIHAT' ? 1.0 : Math.max(0.35, Math.min(3.0, pitchRatio)));

    if (p.type === 'KICK') {
      // Dual-stage pitch drop sine + body thump
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(basePitch * 2.5, t);
      osc.frequency.exponentialRampToValueAtTime(basePitch * 0.45, t + p.pitchDecay);
      nodes.push(osc);

      // Transient click generator
      const clickBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.005), ctx.sampleRate);
      const clickData = clickBuffer.getChannelData(0);
      for (let i = 0; i < clickData.length; i++) {
        clickData[i] = (Math.random() * 2 - 1) * (1 - i / clickData.length);
      }
      const clickSource = ctx.createBufferSource();
      clickSource.buffer = clickBuffer;
      nodes.push(clickSource);

      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(velocity * 0.6, t);
      nodes.push(clickGain);

      osc.connect(outGain);
      clickSource.connect(clickGain);
      clickGain.connect(outGain);

      outGain.gain.setValueAtTime(velocity, t);
      outGain.gain.exponentialRampToValueAtTime(0.0001, t + p.toneDecay);

      osc.start(t);
      clickSource.start(t);
      osc.stop(t + p.toneDecay + 0.05);
      clickSource.stop(t + 0.01);
    } else if (p.type === 'SNARE') {
      // Tonal membrane + noisy snares
      const toneOsc = ctx.createOscillator();
      toneOsc.type = 'triangle';
      toneOsc.frequency.setValueAtTime(basePitch, t);
      toneOsc.frequency.exponentialRampToValueAtTime(basePitch * 0.6, t + p.pitchDecay);
      nodes.push(toneOsc);

      const toneGain = ctx.createGain();
      toneGain.gain.setValueAtTime(velocity * (1 - p.noiseMix), t);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, t + p.toneDecay);
      nodes.push(toneGain);

      // Filtered white noise burst
      const noiseLen = Math.floor(ctx.sampleRate * Math.max(0.1, p.toneDecay));
      const noiseBuf = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < noiseLen; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuf;
      nodes.push(noiseSource);

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(p.filterCutoff, t);
      noiseFilter.Q.setValueAtTime(2.5, t);
      nodes.push(noiseFilter);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(velocity * p.noiseMix, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + p.toneDecay * 1.2);
      nodes.push(noiseGain);

      toneOsc.connect(toneGain);
      toneGain.connect(outGain);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(outGain);

      toneOsc.start(t);
      noiseSource.start(t);
      toneOsc.stop(t + p.toneDecay + 0.05);
      noiseSource.stop(t + p.toneDecay * 1.2 + 0.05);
    } else if (p.type === 'HIHAT') {
      // 6 inharmonic square wave cluster (authentic Roland-style metallic synthesis)
      const freqs = [205, 304, 369, 522, 540, 800];
      const hihatGain = ctx.createGain();
      nodes.push(hihatGain);

      for (const f of freqs) {
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(f * (basePitch / 300), t);
        osc.connect(hihatGain);
        osc.start(t);
        osc.stop(t + p.toneDecay + 0.05);
        nodes.push(osc);
      }

      const hpf = ctx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.setValueAtTime(p.filterCutoff, t);
      nodes.push(hpf);

      hihatGain.connect(hpf);
      hpf.connect(outGain);

      outGain.gain.setValueAtTime(velocity * 0.45, t);
      outGain.gain.exponentialRampToValueAtTime(0.0001, t + p.toneDecay);
    } else {
      // METALLIC / TOM: Inharmonic modal resonators
      const ratios = p.type === 'TOM' ? [1.0, 1.58, 2.14] : [1.0, 1.48, 2.14, 2.83, 3.42];
      for (let i = 0; i < ratios.length; i++) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        const modalFreq = basePitch * ratios[i] * (1 + (i * p.metallicInharmonicity * 0.08));
        osc.frequency.setValueAtTime(modalFreq, t);
        if (p.type === 'TOM') {
          osc.frequency.exponentialRampToValueAtTime(modalFreq * 0.65, t + p.pitchDecay);
        }
        nodes.push(osc);

        const mGain = ctx.createGain();
        const decayI = Math.max(0.05, p.toneDecay / (1 + i * 0.4));
        mGain.gain.setValueAtTime(velocity * (0.35 / (i + 1)), t);
        mGain.gain.exponentialRampToValueAtTime(0.0001, t + decayI);
        nodes.push(mGain);

        osc.connect(mGain);
        mGain.connect(outGain);
        osc.start(t);
        osc.stop(t + decayI + 0.05);
      }
    }

    return () => {
      const now = ctx.currentTime;
      if (typeof outGain.gain.cancelAndHoldAtTime === 'function') {
        outGain.gain.cancelAndHoldAtTime(now);
      } else {
        outGain.gain.cancelScheduledValues(now);
      }
      outGain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
    };
  }

  // =========================================================================
  // 3. 4-OPERATOR FM SYNTHESIS LABORATORY
  // =========================================================================
  private synthesizeFM(
    freq: number,
    velocity: number,
    outGain: GainNode,
    nodes: (AudioNode | AudioBufferSourceNode | OscillatorNode)[],
    p: FMParams,
    ctxParam?: BaseAudioContext,
    startTime?: number
  ): () => void {
    const ctx = ctxParam || this.ctx!;
    const t = startTime !== undefined ? startTime : ctx.currentTime;

    // Instantiate 4 operators with decoupled modulation gain (Hz) and carrier audio output gain (0..1)
    const ops: OscillatorNode[] = [];
    const modGains: GainNode[] = [];
    const carrierGains: GainNode[] = [];

    for (let i = 0; i < 4; i++) {
      const opConfig = p.operators[i] || { ratio: 1.0, detune: 0, level: 0.5, attack: 0.01, decay: 1.0, sustain: 0.3, release: 0.5 };
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * opConfig.ratio, t);
      osc.detune.setValueAtTime(opConfig.detune, t);
      nodes.push(osc);

      // Modulation gain in Hz (deviation)
      const modGain = ctx.createGain();
      const modMax = Math.max(0.1, opConfig.level * 850 * velocity);
      modGain.gain.setValueAtTime(0.001, t);
      modGain.gain.linearRampToValueAtTime(modMax, t + opConfig.attack);
      modGain.gain.exponentialRampToValueAtTime(
        Math.max(0.001, modMax * opConfig.sustain),
        t + opConfig.attack + opConfig.decay
      );
      nodes.push(modGain);

      // Audio carrier output gain (normalized 0..1 amplitude)
      const carrierGain = ctx.createGain();
      const carrierMax = Math.max(0.001, opConfig.level * 0.32 * velocity);
      carrierGain.gain.setValueAtTime(0.0001, t);
      carrierGain.gain.linearRampToValueAtTime(carrierMax, t + opConfig.attack);
      carrierGain.gain.exponentialRampToValueAtTime(
        Math.max(0.001, carrierMax * opConfig.sustain),
        t + opConfig.attack + opConfig.decay
      );
      nodes.push(carrierGain);

      osc.connect(modGain);
      osc.connect(carrierGain);
      ops.push(osc);
      modGains.push(modGain);
      carrierGains.push(carrierGain);
    }

    // Connect Operators based on FM Algorithm:
    // When modulating: source modGain -> target osc.frequency
    // When outputting: source carrierGain -> outGain
    const alg = p.algorithm || 1;

    if (alg === 1) {
      modGains[3].connect(ops[2].frequency);
      modGains[2].connect(ops[1].frequency);
      modGains[1].connect(ops[0].frequency);
      carrierGains[0].connect(outGain);
    } else if (alg === 2) {
      modGains[3].connect(ops[2].frequency);
      modGains[1].connect(ops[0].frequency);
      carrierGains[2].connect(outGain);
      carrierGains[0].connect(outGain);
    } else if (alg === 3) {
      modGains[3].connect(ops[1].frequency);
      modGains[2].connect(ops[1].frequency);
      modGains[1].connect(ops[0].frequency);
      carrierGains[0].connect(outGain);
    } else if (alg === 4) {
      modGains[3].connect(ops[2].frequency);
      modGains[3].connect(ops[1].frequency);
      modGains[3].connect(ops[0].frequency);
      carrierGains[2].connect(outGain);
      carrierGains[1].connect(outGain);
      carrierGains[0].connect(outGain);
    } else if (alg === 5) {
      modGains[3].connect(ops[2].frequency);
      modGains[2].connect(ops[1].frequency);
      modGains[2].connect(ops[0].frequency);
      carrierGains[1].connect(outGain);
      carrierGains[0].connect(outGain);
    } else {
      // Alg 6: All parallel carriers
      for (let i = 0; i < 4; i++) {
        carrierGains[i].connect(outGain);
      }
    }

    // Feedback on Operator 4
    if (p.feedback > 0.05) {
      const fbGain = ctx.createGain();
      fbGain.gain.setValueAtTime(p.feedback * 350, t);
      modGains[3].connect(fbGain);
      fbGain.connect(ops[3].frequency);
      nodes.push(fbGain);
    }

    outGain.gain.setValueAtTime(1.0, t);

    // Start all 4 operators
    for (const op of ops) {
      op.start(t);
    }

    return () => {
      const now = ctx.currentTime;
      const rel = this.activePreset.adsr.release || 0.4;
      if (typeof outGain.gain.cancelAndHoldAtTime === 'function') {
        outGain.gain.cancelAndHoldAtTime(now);
      } else {
        outGain.gain.cancelScheduledValues(now);
      }
      outGain.gain.exponentialRampToValueAtTime(0.0001, now + rel);
      for (let i = 0; i < 4; i++) {
        const opRel = p.operators[i]?.release || rel;
        try {
          if (typeof carrierGains[i].gain.cancelAndHoldAtTime === 'function') {
            carrierGains[i].gain.cancelAndHoldAtTime(now);
          } else {
            carrierGains[i].gain.cancelScheduledValues(now);
          }
          carrierGains[i].gain.exponentialRampToValueAtTime(0.0001, now + opRel);
        } catch {}
      }
    };
  }

  // =========================================================================
  // 4. WIND LABORATORY (Acoustic Jet Waveguide & Reed/Lip Non-Linear Exciters)
  // =========================================================================
  private synthesizeWind(
    freq: number,
    velocity: number,
    outGain: GainNode,
    nodes: (AudioNode | AudioBufferSourceNode | OscillatorNode)[],
    p: WindParams,
    ctxParam?: BaseAudioContext,
    startTime?: number
  ): () => void {
    const ctx = ctxParam || this.ctx!;
    const t = startTime !== undefined ? startTime : ctx.currentTime;

    const isFlute = p.type === 'FLUTE';
    const isReed = p.type === 'REED';
    const isBrass = p.type === 'BRASS';

    // A. Breath turbulence noise generator
    const noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 1.5), ctx.sampleRate);
    const nData = noiseBuf.getChannelData(0);
    for (let i = 0; i < nData.length; i++) {
      nData[i] = (Math.random() * 2 - 1) * 0.8;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuf;
    noiseSource.loop = true;
    nodes.push(noiseSource);

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(freq * (isFlute ? 2.0 : 1.5), t);
    noiseFilter.Q.setValueAtTime(isFlute ? 5.0 : 3.0, t);
    nodes.push(noiseFilter);

    const breathGain = ctx.createGain();
    breathGain.gain.setValueAtTime(p.breathNoise * velocity * (isFlute ? 0.35 : 0.15), t);
    nodes.push(breathGain);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(breathGain);

    // B. Core Tone Exciter (Lip reed / mechanical reed pressure oscillator)
    const exciterOsc = ctx.createOscillator();
    exciterOsc.type = isReed ? 'sawtooth' : isBrass ? 'sawtooth' : 'sine';
    exciterOsc.frequency.setValueAtTime(freq, t);
    nodes.push(exciterOsc);

    // Vibrato LFO
    if (p.vibratoDepth > 0.05) {
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(p.vibratoRate, t);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(p.vibratoDepth * 6.5, t);
      lfo.connect(lfoGain);
      lfoGain.connect(exciterOsc.detune);
      lfo.start(t);
      nodes.push(lfo);
      nodes.push(lfoGain);
    }

    // C. Non-linear wave shaping (Reed table / Lip reflection distortion)
    const waveShaper = ctx.createWaveShaper();
    const curve = new Float32Array(512);
    for (let i = 0; i < 512; i++) {
      const x = (i / 256) - 1;
      // Hyperbolic tangent saturation with pressure offset
      curve[i] = Math.tanh(p.embouchure * x * 1.8);
    }
    waveShaper.curve = curve;
    nodes.push(waveShaper);

    // D. Bell Flare & Acoustic Bore Formant Filter
    const bellFilter = ctx.createBiquadFilter();
    bellFilter.type = 'lowpass';
    const cutoffBase = isBrass ? 4500 * p.bellFlare : isReed ? 3200 : 2600;
    bellFilter.frequency.setValueAtTime(cutoffBase * (0.8 + velocity * 0.4), t);
    bellFilter.Q.setValueAtTime(p.boreResonance * 4.0, t);
    nodes.push(bellFilter);

    // Connections
    exciterOsc.connect(waveShaper);
    waveShaper.connect(bellFilter);
    breathGain.connect(bellFilter);
    bellFilter.connect(outGain);

    // Envelope
    outGain.gain.setValueAtTime(0, t);
    outGain.gain.linearRampToValueAtTime(velocity * p.breathPressure * 0.6, t + this.activePreset.adsr.attack);
    outGain.gain.exponentialRampToValueAtTime(
      Math.max(0.001, velocity * this.activePreset.adsr.sustain * 0.5),
      t + this.activePreset.adsr.attack + this.activePreset.adsr.decay
    );

    noiseSource.start(t);
    exciterOsc.start(t);

    return () => {
      const now = ctx.currentTime;
      if (typeof outGain.gain.cancelAndHoldAtTime === 'function') {
        outGain.gain.cancelAndHoldAtTime(now);
      } else {
        outGain.gain.cancelScheduledValues(now);
      }
      outGain.gain.exponentialRampToValueAtTime(0.0001, now + (this.activePreset.adsr.release || 0.25));
    };
  }

  // =========================================================================
  // 5. EXPERIMENTAL SYNTHESIS (Complex Resonators & Generative Textures)
  // =========================================================================
  private synthesizeExperimental(
    freq: number,
    velocity: number,
    outGain: GainNode,
    nodes: (AudioNode | AudioBufferSourceNode | OscillatorNode)[],
    p: ExperimentalParams,
    ctxParam?: BaseAudioContext,
    startTime?: number
  ): () => void {
    const ctx = ctxParam || this.ctx!;
    const t = startTime !== undefined ? startTime : ctx.currentTime;

    if (p.type === 'DRONE') {
      // Additive multi-harmonic cluster with micro-tuning beating
      const numPartials = Math.max(2, Math.min(10, p.density));
      for (let i = 0; i < numPartials; i++) {
        const osc = ctx.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        const detuneCents = (i - numPartials / 2) * (p.chaosFactor * 35);
        osc.frequency.setValueAtTime(freq * (1 + (i * 0.5)), t);
        osc.detune.setValueAtTime(detuneCents, t);
        nodes.push(osc);

        const pGain = ctx.createGain();
        pGain.gain.setValueAtTime(velocity * (0.3 / (i + 1)), t);
        nodes.push(pGain);

        osc.connect(pGain);
        pGain.connect(outGain);
        osc.start(t);
      }
    } else if (p.type === 'ALIEN_RESONATOR') {
      // Inharmonic comb-matrix delay network with cross-feedback
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      nodes.push(osc);

      const delay1 = ctx.createDelay(0.1);
      const delay2 = ctx.createDelay(0.1);
      delay1.delayTime.setValueAtTime(1 / (freq * 1.414), t);
      delay2.delayTime.setValueAtTime(1 / (freq * 2.718), t);
      nodes.push(delay1);
      nodes.push(delay2);

      const fb = ctx.createGain();
      fb.gain.setValueAtTime(p.feedbackAmount * 0.9, t);
      nodes.push(fb);

      osc.connect(delay1);
      delay1.connect(delay2);
      delay2.connect(fb);
      fb.connect(delay1);

      const resFilter = ctx.createBiquadFilter();
      resFilter.type = 'bandpass';
      resFilter.frequency.setValueAtTime(p.filterCutoff, t);
      resFilter.Q.setValueAtTime(p.resonance, t);
      nodes.push(resFilter);

      delay1.connect(resFilter);
      delay2.connect(resFilter);
      resFilter.connect(outGain);

      osc.start(t);
    } else {
      // EVOLVING PAD & GENERATIVE TEXTURE: LFO-swept dual state-variable filter
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, t);
      osc2.frequency.setValueAtTime(freq * 1.006, t);
      nodes.push(osc1);
      nodes.push(osc2);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(p.filterCutoff, t);
      filter.Q.setValueAtTime(p.resonance, t);
      nodes.push(filter);

      // LFO modulation
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(p.modulationRate, t);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(p.filterCutoff * 0.6, t);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(t);
      nodes.push(lfo);
      nodes.push(lfoGain);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(outGain);

      osc1.start(t);
      osc2.start(t);
    }

    outGain.gain.setValueAtTime(0, t);
    outGain.gain.linearRampToValueAtTime(velocity * 0.65, t + this.activePreset.adsr.attack);
    outGain.gain.exponentialRampToValueAtTime(
      Math.max(0.001, velocity * this.activePreset.adsr.sustain * 0.5),
      t + this.activePreset.adsr.attack + this.activePreset.adsr.decay
    );

    return () => {
      const now = ctx.currentTime;
      if (typeof outGain.gain.cancelAndHoldAtTime === 'function') {
        outGain.gain.cancelAndHoldAtTime(now);
      } else {
        outGain.gain.cancelScheduledValues(now);
      }
      outGain.gain.exponentialRampToValueAtTime(0.0001, now + (this.activePreset.adsr.release || 0.6));
    };
  }

  // =========================================================================
  // TELEMETRY & VISUALIZATION
  // =========================================================================
  public getTelemetry(): AudioTelemetry {
    let rms = 0;
    let peak = 0;

    if (this.analyser && this.timeDataBuffer) {
      this.analyser.getByteTimeDomainData(this.timeDataBuffer);
      let sumSq = 0;
      for (let i = 0; i < this.timeDataBuffer.length; i++) {
        const norm = (this.timeDataBuffer[i] - 128) / 128;
        sumSq += norm * norm;
        const absVal = Math.abs(norm);
        if (absVal > peak) peak = absVal;
      }
      rms = Math.sqrt(sumSq / this.timeDataBuffer.length);
    }

    return {
      activeVoices: this.voices.size,
      maxPolyphony: this.activePreset.polyphony || 8,
      rmsLevel: Math.round(rms * 100) / 100,
      peakLevel: Math.round(peak * 100) / 100,
      audioContextState: this.ctx ? this.ctx.state : 'uninitialized',
      sampleRate: this.ctx ? this.ctx.sampleRate : 44100,
    };
  }

  public getTimeDomainData(): Uint8Array {
    if (this.analyser && this.timeDataBuffer) {
      this.analyser.getByteTimeDomainData(this.timeDataBuffer);
      return this.timeDataBuffer;
    }
    return new Uint8Array(512).fill(128);
  }

  public getFrequencyData(): Uint8Array {
    if (this.analyser && this.freqDataBuffer) {
      this.analyser.getByteFrequencyData(this.freqDataBuffer);
      return this.freqDataBuffer;
    }
    return new Uint8Array(256).fill(0);
  }

  public getActiveVoices(): ActiveVoiceInfo[] {
    const list: ActiveVoiceInfo[] = [];
    for (const [, v] of this.voices) {
      list.push({
        id: v.id,
        note: v.note,
        freq: Math.round(v.freq),
        velocity: Math.round(v.velocity * 100) / 100,
        startTime: v.startTime,
        family: this.activePreset.family,
      });
    }
    return list;
  }

  // =========================================================================
  // WAV AUDIO BOUNCE EXPORT (OfflineAudioContext)
  // =========================================================================
  public async exportWAV(durationSec = 2.5, presetToRender?: InstrumentPreset): Promise<Blob> {
    const sampleRate = 44100;
    const numFrames = Math.floor(sampleRate * durationSec);
    const offlineCtx = new OfflineAudioContext(2, numFrames, sampleRate);
    const preset = presetToRender || this.activePreset;

    const master = offlineCtx.createGain();
    const presetGain = preset.gain || 1.0;
    master.gain.setValueAtTime(0.75 * presetGain, 0);
    master.connect(offlineCtx.destination);

    // Render musical triad arpeggio: C4 (60), E4 (64), G4 (67)
    const notes = [60, 64, 67];
    const nodes: (AudioNode | AudioBufferSourceNode | OscillatorNode)[] = [];

    for (let n = 0; n < notes.length; n++) {
      const note = notes[n];
      const freq = 440 * Math.pow(2, (note - 69) / 12);
      const startT = n * 0.35;
      const voiceGain = offlineCtx.createGain();
      voiceGain.connect(master);
      nodes.push(voiceGain);

      // Articulate musical gate & release envelope on the offline voice gain
      const gateTime = 0.28;
      const relTime = preset.adsr.release || 0.35;
      voiceGain.gain.setValueAtTime(1.0, startT);
      voiceGain.gain.setValueAtTime(1.0, startT + gateTime);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, startT + gateTime + relTime);

      switch (preset.family) {
        case 'STRINGS':
          this.synthesizeString(
            freq,
            0.85,
            voiceGain,
            nodes,
            preset.stringParams || DEFAULT_PRESETS[0].stringParams!,
            offlineCtx,
            startT
          );
          break;
        case 'PERCUSSION':
          this.synthesizePercussion(
            freq,
            0.85,
            voiceGain,
            nodes,
            preset.percussionParams || DEFAULT_PRESETS[5].percussionParams!,
            offlineCtx,
            startT
          );
          break;
        case 'FM':
          this.synthesizeFM(
            freq,
            0.85,
            voiceGain,
            nodes,
            preset.fmParams || DEFAULT_PRESETS[10].fmParams!,
            offlineCtx,
            startT
          );
          break;
        case 'WIND':
          this.synthesizeWind(
            freq,
            0.85,
            voiceGain,
            nodes,
            preset.windParams || DEFAULT_PRESETS[15].windParams!,
            offlineCtx,
            startT
          );
          break;
        case 'EXPERIMENTAL':
          this.synthesizeExperimental(
            freq,
            0.85,
            voiceGain,
            nodes,
            preset.experimentalParams || DEFAULT_PRESETS[18].experimentalParams!,
            offlineCtx,
            startT
          );
          break;
      }
    }

    const renderedBuffer = await offlineCtx.startRendering();
    return this.encodeWAV(renderedBuffer);
  }

  private encodeWAV(audioBuffer: AudioBuffer): Blob {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const left = audioBuffer.getChannelData(0);
    const right = numChannels > 1 ? audioBuffer.getChannelData(1) : left;
    const numSamples = left.length;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const buffer = new ArrayBuffer(44 + numSamples * blockAlign);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + numSamples * blockAlign, true);
    this.writeString(view, 8, 'WAVE');

    // fmt sub-chunk
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);

    // data sub-chunk
    this.writeString(view, 36, 'data');
    view.setUint32(40, numSamples * blockAlign, true);

    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      // Left channel
      let sL = Math.max(-1, Math.min(1, left[i]));
      view.setInt16(offset, sL < 0 ? sL * 0x8000 : sL * 0x7fff, true);
      offset += 2;

      // Right channel
      if (numChannels > 1) {
        let sR = Math.max(-1, Math.min(1, right[i]));
        view.setInt16(offset, sR < 0 ? sR * 0x8000 : sR * 0x7fff, true);
        offset += 2;
      }
    }

    return new Blob([buffer], { type: 'audio/wav' });
  }

  private writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  public dispose() {
    this.allNotesOff();
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch {}
    }
    this.ctx = null;
    this.isInitialized = false;
  }
}

export const proceduralAudio = new ProceduralAudioEngine();
