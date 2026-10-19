import {
  Track,
  MasterFXSettings,
  ProjectData,
  SynthParams,
} from '../types';
import {
  noteToFreq,
  playKick,
  playSnare,
  playHiHatClosed,
  playHiHatOpen,
  playClap,
  playSynthVoice,
  playBassVoice,
  playArpVoice,
} from './synthesizers';

interface TrackAudioNodes {
  inputGain: GainNode;
  panNode: StereoPannerNode;
  outputGain: GainNode;
}

export class DAWAudioEngine {
  public ctx: AudioContext | null = null;
  private isRunning: boolean = false;

  // Master bus and nodes
  private tracksBus: GainNode | null = null;
  private masterGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;

  // FX Nodes
  private filterNode: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayFeedbackGain: GainNode | null = null;
  private delayWetGain: GainNode | null = null;
  private delayDryGain: GainNode | null = null;

  private distortionNode: WaveShaperNode | null = null;
  private distortionWetGain: GainNode | null = null;
  private distortionDryGain: GainNode | null = null;

  private reverbConvolver: ConvolverNode | null = null;
  private reverbWetGain: GainNode | null = null;
  private reverbDryGain: GainNode | null = null;
  private lastReverbDecay: number = 2.0;

  // Track channels map
  private trackNodesMap: Map<string, TrackAudioNodes> = new Map();

  // Playback scheduler state
  private schedulerInterval: number | null = null;
  private currentStep: number = 0;
  private nextStepTime: number = 0;
  private scheduleAheadTime: number = 0.1; // 100ms lookahead
  private lookaheadIntervalMs: number = 25; // 25ms tick rate
  private pendingTimeouts: Set<number> = new Set();

  // Active Project Reference
  private currentProject: ProjectData | null = null;

  // Metronome state
  public isMetronomeEnabled: boolean = false;

  // UI Step Synchronization Callback
  public onStepTick: ((stepIndex: number) => void) | null = null;

  constructor() {}

  /**
   * Initialize AudioContext and setup Master Effects Routing Graph
   */
  public init(): AudioContext {
    if (this.ctx) return this.ctx;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    this.ctx = new AudioCtx();

    // 1. Tracks summing bus
    this.tracksBus = this.ctx.createGain();

    // 2. Master Gain & Analyser
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 128;
    this.analyser.smoothingTimeConstant = 0.8;

    // 3. Distortion FX Setup
    this.distortionNode = this.ctx.createWaveShaper();
    this.distortionNode.curve = this.makeDistortionCurve(0);
    this.distortionNode.oversample = '4x';
    this.distortionDryGain = this.ctx.createGain();
    this.distortionWetGain = this.ctx.createGain();

    // 4. Filter FX Setup
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(20000, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(1.0, this.ctx.currentTime);

    // 5. Delay FX Setup
    this.delayNode = this.ctx.createDelay(2.0);
    this.delayNode.delayTime.setValueAtTime(0.25, this.ctx.currentTime);
    this.delayFeedbackGain = this.ctx.createGain();
    this.delayFeedbackGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    this.delayNode.connect(this.delayFeedbackGain);
    this.delayFeedbackGain.connect(this.delayNode);

    this.delayDryGain = this.ctx.createGain();
    this.delayWetGain = this.ctx.createGain();

    // 6. Reverb FX Setup (Procedural impulse response)
    this.reverbConvolver = this.ctx.createConvolver();
    this.reverbConvolver.buffer = this.buildImpulseResponse(this.ctx, 1.8, 2.0);
    this.reverbDryGain = this.ctx.createGain();
    this.reverbWetGain = this.ctx.createGain();

    // CONNECT FX CHAIN ROUTING:
    // tracksBus -> [Distortion Dry/Wet] -> Filter -> [Delay Dry/Wet] -> [Reverb Dry/Wet] -> masterGain -> analyser -> destination

    // Distortion Stage
    this.tracksBus.connect(this.distortionDryGain);
    this.tracksBus.connect(this.distortionNode);
    this.distortionNode.connect(this.distortionWetGain);

    const afterDistortionGain = this.ctx.createGain();
    this.distortionDryGain.connect(afterDistortionGain);
    this.distortionWetGain.connect(afterDistortionGain);

    // Filter Stage
    afterDistortionGain.connect(this.filterNode);

    // Delay Stage
    this.filterNode.connect(this.delayDryGain);
    this.filterNode.connect(this.delayNode);
    this.delayNode.connect(this.delayWetGain);

    const afterDelayGain = this.ctx.createGain();
    this.delayDryGain.connect(afterDelayGain);
    this.delayWetGain.connect(afterDelayGain);

    // Reverb Stage
    afterDelayGain.connect(this.reverbDryGain);
    afterDelayGain.connect(this.reverbConvolver);
    this.reverbConvolver.connect(this.reverbWetGain);

    const afterReverbGain = this.ctx.createGain();
    this.reverbDryGain.connect(afterReverbGain);
    this.reverbWetGain.connect(afterReverbGain);

    // Master Output
    afterReverbGain.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    return this.ctx;
  }

  /**
   * Sigmoid curve for overdrive saturation
   */
  private makeDistortionCurve(amount: number): Float32Array {
    const k = typeof amount === 'number' ? amount : 0;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      if (k === 0) {
        curve[i] = x;
      } else {
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
    }
    return curve;
  }

  /**
   * Procedural Synthetic Reverb Impulse Response Generator
   */
  private buildImpulseResponse(ctx: AudioContext, duration: number, decay: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = Math.floor(sampleRate * Math.max(0.5, duration));
    const impulse = ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const n = i / length;
      const env = Math.pow(1 - n, decay);
      left[i] = (Math.random() * 2 - 1) * env;
      right[i] = (Math.random() * 2 - 1) * env;
    }
    return impulse;
  }

  /**
   * Synchronize Tracks in the Audio Mixer Graph and prune removed track IDs
   */
  public syncTracks(tracks: Track[]) {
    if (!this.ctx || !this.tracksBus) return;

    // 1. Prune removed tracks from node map
    const activeTrackIds = new Set(tracks.map((t) => t.id));
    for (const [id, nodes] of this.trackNodesMap.entries()) {
      if (!activeTrackIds.has(id)) {
        nodes.inputGain.disconnect();
        nodes.panNode.disconnect();
        nodes.outputGain.disconnect();
        this.trackNodesMap.delete(id);
      }
    }

    // 2. Check if any track is soloed
    const hasSolo = tracks.some((t) => t.soloed);

    tracks.forEach((track) => {
      let nodes = this.trackNodesMap.get(track.id);
      if (!nodes) {
        // Create nodes
        const inputGain = this.ctx!.createGain();
        const panNode = this.ctx!.createStereoPanner();
        const outputGain = this.ctx!.createGain();

        inputGain.connect(panNode);
        panNode.connect(outputGain);
        outputGain.connect(this.tracksBus!);

        nodes = { inputGain, panNode, outputGain };
        this.trackNodesMap.set(track.id, nodes);
      }

      // Update parameters smoothly
      const now = this.ctx!.currentTime;
      nodes.inputGain.gain.setValueAtTime(track.volume, now);
      nodes.panNode.pan.setValueAtTime(Math.max(-1, Math.min(1, track.pan)), now);

      // Mute / Solo logic: Mutting a soloed channel must silence it
      const isAudible = hasSolo ? (track.soloed && !track.muted) : !track.muted;
      nodes.outputGain.gain.setValueAtTime(isAudible ? 1.0 : 0.0, now);
    });
  }

  /**
   * Update Project Reference dynamically so live sequencer/piano roll edits apply in real-time
   */
  public updateProject(project: ProjectData) {
    this.currentProject = project;
  }

  /**
   * Update Tempo & Swing smoothly in-place without resetting scheduler clock or interval
   */
  public setTempo(bpm: number, swing: number) {
    if (this.currentProject) {
      this.currentProject.bpm = bpm;
      this.currentProject.swing = swing;
    }
  }

  /**
   * Synchronize Master Effects with UI State
   */
  public updateMasterFX(fx: MasterFXSettings, masterVol: number) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    // Master Volume
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(masterVol, t, 0.02);
    }

    // Filter with proper bypass logic across Lowpass, Highpass, and Bandpass
    if (this.filterNode) {
      this.filterNode.type = fx.filter.type;
      if (!fx.filter.enabled) {
        // When bypassed, fully open the filter according to its type
        if (fx.filter.type === 'highpass') {
          // Open highpass down to sub-audible 10Hz so all bass passes through
          this.filterNode.frequency.setTargetAtTime(10, t, 0.02);
          this.filterNode.Q.setTargetAtTime(0.7, t, 0.02);
        } else if (fx.filter.type === 'lowpass') {
          // Open lowpass up to 20000Hz so all treble passes through
          this.filterNode.frequency.setTargetAtTime(20000, t, 0.02);
          this.filterNode.Q.setTargetAtTime(0.7, t, 0.02);
        } else {
          // Bandpass: broaden Q completely
          this.filterNode.frequency.setTargetAtTime(1000, t, 0.02);
          this.filterNode.Q.setTargetAtTime(0.001, t, 0.02);
        }
      } else {
        this.filterNode.frequency.setTargetAtTime(fx.filter.cutoff, t, 0.02);
        this.filterNode.Q.setTargetAtTime(fx.filter.resonance, t, 0.02);
      }
    }

    // Delay
    if (this.delayNode && this.delayFeedbackGain && this.delayDryGain && this.delayWetGain) {
      const delayTime = fx.delay.enabled ? fx.delay.time : 0.25;
      this.delayNode.delayTime.setTargetAtTime(delayTime, t, 0.02);
      const feedback = fx.delay.enabled ? fx.delay.feedback : 0.0;
      this.delayFeedbackGain.gain.setTargetAtTime(feedback, t, 0.02);

      const wet = fx.delay.enabled ? fx.delay.mix : 0.0;
      this.delayWetGain.gain.setTargetAtTime(wet, t, 0.02);
      this.delayDryGain.gain.setTargetAtTime(1.0 - wet * 0.5, t, 0.02);
    }

    // Distortion
    if (this.distortionNode && this.distortionDryGain && this.distortionWetGain) {
      const wet = fx.distortion.enabled ? fx.distortion.mix : 0.0;
      this.distortionWetGain.gain.setTargetAtTime(wet, t, 0.02);
      this.distortionDryGain.gain.setTargetAtTime(1.0 - wet * 0.5, t, 0.02);
      if (fx.distortion.enabled) {
        this.distortionNode.curve = this.makeDistortionCurve(fx.distortion.drive);
      }
    }

    // Reverb: Dynamically rebuild impulse response when decay time slider changes
    if (this.reverbWetGain && this.reverbDryGain && this.reverbConvolver) {
      const wet = fx.reverb.enabled ? fx.reverb.mix : 0.0;
      this.reverbWetGain.gain.setTargetAtTime(wet, t, 0.02);
      this.reverbDryGain.gain.setTargetAtTime(1.0 - wet * 0.4, t, 0.02);

      if (Math.abs(fx.reverb.decay - this.lastReverbDecay) > 0.05) {
        this.lastReverbDecay = fx.reverb.decay;
        this.reverbConvolver.buffer = this.buildImpulseResponse(
          this.ctx,
          Math.min(4.5, fx.reverb.decay),
          2.0
        );
      }
    }
  }

  /**
   * Preview a single note / sound triggered by user click (piano roll or pad)
   */
  public previewSound(track: Track, pitch?: string) {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const nodes = this.trackNodesMap.get(track.id);
    const dest = nodes ? nodes.inputGain : this.tracksBus || this.ctx.destination;
    const now = this.ctx.currentTime;
    const targetPitch = pitch || (track.type === 'BASS' ? 'A1' : 'C3');

    this.triggerInstrumentSound(track, targetPitch, 0.85, now, 0.25, dest);
  }

  /**
   * Core Sound Trigger Router
   */
  private triggerInstrumentSound(
    track: Track,
    pitch: string,
    velocity: number,
    time: number,
    duration: number,
    dest: AudioNode
  ) {
    if (!this.ctx) return;
    const freq = noteToFreq(pitch);

    switch (track.instrument) {
      case 'KICK':
        playKick(this.ctx, dest, time, velocity);
        break;
      case 'SNARE':
        playSnare(this.ctx, dest, time, velocity);
        break;
      case 'HIHAT_CLOSED':
        playHiHatClosed(this.ctx, dest, time, velocity);
        break;
      case 'HIHAT_OPEN':
        playHiHatOpen(this.ctx, dest, time, velocity);
        break;
      case 'CLAP':
        playClap(this.ctx, dest, time, velocity);
        break;
      case 'LEAD_SYNTH': {
        const defaultParams: SynthParams = {
          waveform: 'sawtooth',
          attack: 0.01,
          decay: 0.15,
          sustain: 0.4,
          release: 0.15,
          cutoffFreq: 2800,
        };
        const params = track.synthParams || defaultParams;
        playSynthVoice(this.ctx, dest, time, freq, velocity, params, duration);
        break;
      }
      case 'SUB_BASS':
        playBassVoice(this.ctx, dest, time, freq, velocity, duration, track.synthParams);
        break;
      case 'ARP_SYNTH':
        playArpVoice(this.ctx, dest, time, freq, velocity, duration, track.synthParams);
        break;
      default:
        playKick(this.ctx, dest, time, velocity);
    }
  }

  /**
   * Click metronome pulse on beat
   */
  private playMetronomeClick(time: number, isBarStart: boolean) {
    if (!this.ctx || !this.isMetronomeEnabled) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(isBarStart ? 1000 : 750, time);
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);

    osc.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);

    osc.start(time);
    osc.stop(time + 0.035);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  /**
   * Step Advancement & Note Scheduling Loop
   */
  private schedule() {
    if (!this.ctx || !this.currentProject || !this.isRunning) return;

    // Advance steps that fall inside the lookahead window
    while (this.nextStepTime < this.ctx.currentTime + this.scheduleAheadTime) {
      const stepIndex = this.currentStep;
      const stepTime = this.nextStepTime;
      const totalSteps = this.currentProject.stepCount;

      // 1. Play metronome if enabled (quarter notes: steps 0, 4, 8, 12, etc.)
      if (stepIndex % 4 === 0) {
        this.playMetronomeClick(stepTime, stepIndex === 0);
      }

      // 2. Schedule tracks for this step
      const secondsPerBeat = 60.0 / this.currentProject.bpm;
      const stepDuration = secondsPerBeat / 4; // 16th note step

      this.currentProject.tracks.forEach((track) => {
        const step = track.steps[stepIndex];
        if (step && step.active) {
          const nodes = this.trackNodesMap.get(track.id);
          const dest = nodes ? nodes.inputGain : this.tracksBus || this.ctx!.destination;
          this.triggerInstrumentSound(track, step.pitch, step.velocity, stepTime, stepDuration, dest);
        }
      });

      // 3. Inform React UI for cursor highlight
      const scheduledStep = stepIndex;
      const delayMs = Math.max(0, (stepTime - this.ctx.currentTime) * 1000);
      const timerId = window.setTimeout(() => {
        this.pendingTimeouts.delete(timerId);
        if (this.isRunning && this.onStepTick) {
          this.onStepTick(scheduledStep);
        }
      }, delayMs);
      this.pendingTimeouts.add(timerId);

      // 4. Calculate timing for next step with Swing
      const swingRatio = this.currentProject.swing || 0;
      let nextStepInterval = stepDuration;
      if (stepIndex % 2 === 0) {
        nextStepInterval = stepDuration * (1 + swingRatio);
      } else {
        nextStepInterval = stepDuration * (1 - swingRatio);
      }

      this.nextStepTime += nextStepInterval;
      this.currentStep = (this.currentStep + 1) % totalSteps;
    }
  }

  private clearPendingTimeouts() {
    this.pendingTimeouts.forEach((id) => window.clearTimeout(id));
    this.pendingTimeouts.clear();
  }

  /**
   * Transport: Play
   */
  public play(project: ProjectData) {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    this.currentProject = project;
    this.syncTracks(project.tracks);
    this.updateMasterFX(project.masterFX, project.masterVolume);

    this.isRunning = true;
    this.nextStepTime = this.ctx.currentTime + 0.05;

    if (this.schedulerInterval !== null) {
      window.clearInterval(this.schedulerInterval);
    }

    this.schedulerInterval = window.setInterval(() => {
      this.schedule();
    }, this.lookaheadIntervalMs);
  }

  /**
   * Transport: Pause
   */
  public pause() {
    this.isRunning = false;
    if (this.schedulerInterval !== null) {
      window.clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
    }
    this.clearPendingTimeouts();
  }

  /**
   * Transport: Stop (Reset to step 0)
   */
  public stop() {
    this.pause();
    this.currentStep = 0;
    this.clearPendingTimeouts();
    if (this.onStepTick) {
      this.onStepTick(0);
    }
  }

  public getPlaybackActive(): boolean {
    return this.isRunning;
  }

  /**
   * Clean destruction
   */
  public dispose() {
    this.stop();
    this.trackNodesMap.forEach((nodes) => {
      nodes.inputGain.disconnect();
      nodes.panNode.disconnect();
      nodes.outputGain.disconnect();
    });
    this.trackNodesMap.clear();

    if (this.tracksBus) {
      this.tracksBus.disconnect();
      this.tracksBus = null;
    }
    if (this.masterGain) {
      this.masterGain.disconnect();
      this.masterGain = null;
    }
    if (this.filterNode) {
      this.filterNode.disconnect();
      this.filterNode = null;
    }
    if (this.delayNode) {
      this.delayNode.disconnect();
      this.delayNode = null;
    }
    if (this.reverbConvolver) {
      this.reverbConvolver.disconnect();
      this.reverbConvolver = null;
    }
    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }

    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

export const dawAudio = new DAWAudioEngine();
