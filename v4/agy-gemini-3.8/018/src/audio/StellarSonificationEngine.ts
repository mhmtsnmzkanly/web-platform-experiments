/**
 * STELLAR-FORGE Procedural Web Audio Sonification Engine
 * 100% mathematical sound synthesis with helioseismological p-modes,
 * thermonuclear fusion drones, and core collapse shock transients.
 * Fully equipped with master dynamics compressor limiter.
 */

import { StellarTelemetry } from '../types/index.js';

export class StellarSonificationEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;

  // Sound nodes
  private pModeOsc1: OscillatorNode | null = null;
  private pModeOsc2: OscillatorNode | null = null;
  private pModeGain: GainNode | null = null;

  private fusionDroneOsc: OscillatorNode | null = null;
  private fusionDroneGain: GainNode | null = null;

  private turbulenceNoiseNode: AudioNode | null = null;
  private turbulenceGain: GainNode | null = null;

  private isMuted: boolean = true;
  private lastBounceState: boolean = false;
  private pendingTimeouts: Set<ReturnType<typeof setTimeout>> = new Set();

  constructor() {
    // AudioContext lazily created on user interaction
  }

  private initAudio(): void {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Master Dynamics Compressor Limiter
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
    this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    this.compressor.release.setValueAtTime(0.15, this.ctx.currentTime);

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0.0 : 0.4, this.ctx.currentTime);

    this.compressor.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // 1. Helioseismological Acoustic p-modes
    this.pModeOsc1 = this.ctx.createOscillator();
    this.pModeOsc1.type = 'sine';
    this.pModeOsc1.frequency.setValueAtTime(180, this.ctx.currentTime);

    this.pModeOsc2 = this.ctx.createOscillator();
    this.pModeOsc2.type = 'sine';
    this.pModeOsc2.frequency.setValueAtTime(270, this.ctx.currentTime);

    this.pModeGain = this.ctx.createGain();
    this.pModeGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    this.pModeOsc1.connect(this.pModeGain);
    this.pModeOsc2.connect(this.pModeGain);
    this.pModeGain.connect(this.compressor);

    this.pModeOsc1.start();
    this.pModeOsc2.start();

    // 2. Thermonuclear Core Fusion Drone
    this.fusionDroneOsc = this.ctx.createOscillator();
    this.fusionDroneOsc.type = 'triangle';
    this.fusionDroneOsc.frequency.setValueAtTime(65, this.ctx.currentTime);

    this.fusionDroneGain = this.ctx.createGain();
    this.fusionDroneGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    this.fusionDroneOsc.connect(this.fusionDroneGain);
    this.fusionDroneGain.connect(this.compressor);

    this.fusionDroneOsc.start();

    // 3. High-temperature Plasma Turbulence (Bandpass-filtered White Noise)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const bpf = this.ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(1200, this.ctx.currentTime);
    bpf.Q.setValueAtTime(4.0, this.ctx.currentTime);

    this.turbulenceGain = this.ctx.createGain();
    this.turbulenceGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    whiteNoise.connect(bpf);
    bpf.connect(this.turbulenceGain);
    this.turbulenceGain.connect(this.compressor);

    whiteNoise.start();
    this.turbulenceNoiseNode = whiteNoise;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (!this.ctx && !muted) {
      this.initAudio();
    }
    if (this.ctx && this.masterGain) {
      if (this.ctx.state === 'suspended' && !muted) {
        this.ctx.resume();
      }
      const targetGain = muted ? 0.0 : 0.4;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public updateTelemetry(t: StellarTelemetry): void {
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;

    // 1. Helioseismology: Frequency scales with sqrt(M / R^3)
    const meanDensityFactor = Math.sqrt(Math.max(1e-6, t.massSolar / Math.pow(Math.max(1e-4, t.radiusSolar), 3)));
    const basePModeFreq = Math.min(800, Math.max(40, 150 * Math.pow(meanDensityFactor, 0.2)));

    if (this.pModeOsc1 && this.pModeOsc2) {
      this.pModeOsc1.frequency.setTargetAtTime(basePModeFreq, now, 0.1);
      this.pModeOsc2.frequency.setTargetAtTime(basePModeFreq * 1.5, now, 0.1);
    }

    // 2. Fusion Drone: Modulated by total core luminosity
    const lumFactor = Math.min(1.0, Math.max(0.05, Math.log10(Math.max(1, t.totalLuminositySolar)) / 6.0));
    if (this.fusionDroneOsc && this.fusionDroneGain) {
      const dronePitch = 55 + lumFactor * 60;
      this.fusionDroneOsc.frequency.setTargetAtTime(dronePitch, now, 0.1);
      this.fusionDroneGain.gain.setTargetAtTime(0.1 + lumFactor * 0.15, now, 0.1);
    }

    // 3. Plasma turbulence: increases when CNO or triple-alpha is active
    if (this.turbulenceGain) {
      let turbGain = 0.02;
      if (t.dominantNuclearProcess === 'CNO_CYCLE') turbGain = 0.06;
      if (t.dominantNuclearProcess === 'TRIPLE_ALPHA' || t.dominantNuclearProcess === 'ADVANCED_SHELL') turbGain = 0.12;
      this.turbulenceGain.gain.setTargetAtTime(turbGain, now, 0.1);
    }

    // 4. Core Bounce Shock Transient
    if (t.collapseActive && t.collapseTimeMs >= 100.0 && !this.lastBounceState) {
      this.triggerShockTransient();
    }
    this.lastBounceState = t.collapseActive && t.collapseTimeMs >= 100.0;
  }

  private triggerShockTransient(): void {
    if (!this.ctx || !this.compressor) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    // Downward exponential frequency sweep from 600 Hz to 35 Hz over 0.25 seconds
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.25);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.compressor);

    osc.start(now);
    osc.stop(now + 0.4);
    const timerId = setTimeout(() => {
      this.pendingTimeouts.delete(timerId);
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // Disconnected
      }
    }, 450);
    this.pendingTimeouts.add(timerId);
  }

  public dispose(): void {
    for (const tid of this.pendingTimeouts) {
      clearTimeout(tid);
    }
    this.pendingTimeouts.clear();

    if (this.pModeOsc1) {
      try { this.pModeOsc1.stop(); this.pModeOsc1.disconnect(); } catch {}
    }
    if (this.pModeOsc2) {
      try { this.pModeOsc2.stop(); this.pModeOsc2.disconnect(); } catch {}
    }
    if (this.fusionDroneOsc) {
      try { this.fusionDroneOsc.stop(); this.fusionDroneOsc.disconnect(); } catch {}
    }
    if (this.turbulenceNoiseNode) {
      try { (this.turbulenceNoiseNode as AudioBufferSourceNode).stop(); this.turbulenceNoiseNode.disconnect(); } catch {}
    }
    if (this.ctx) {
      try { this.ctx.close(); } catch {}
      this.ctx = null;
    }
  }
}
