export type TrackType = 'DRUM' | 'SYNTH' | 'BASS' | 'CHORD';

export type InstrumentType =
  | 'KICK'
  | 'SNARE'
  | 'HIHAT_CLOSED'
  | 'HIHAT_OPEN'
  | 'CLAP'
  | 'LEAD_SYNTH'
  | 'SUB_BASS'
  | 'ARP_SYNTH';

export interface StepNote {
  active: boolean;
  pitch: string; // e.g., 'C3', 'D#3', 'A4'
  velocity: number; // 0.1 - 1.0
}

export interface SynthParams {
  waveform: OscillatorType; // 'sine' | 'square' | 'sawtooth' | 'triangle'
  attack: number; // seconds
  decay: number;
  sustain: number; // 0 - 1
  release: number;
  cutoffFreq: number; // Hz
}

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  instrument: InstrumentType;
  color: string;
  steps: StepNote[];
  volume: number; // 0.0 - 1.0
  pan: number; // -1.0 to 1.0
  muted: boolean;
  soloed: boolean;
  synthParams?: SynthParams;
}

export interface FilterFXConfig {
  enabled: boolean;
  type: BiquadFilterType;
  cutoff: number; // Hz (20 - 20000)
  resonance: number; // Q (0.1 - 20)
}

export interface DelayFXConfig {
  enabled: boolean;
  time: number; // seconds (0.05 - 1.0)
  feedback: number; // 0.0 - 0.85
  mix: number; // 0.0 - 1.0
}

export interface DistortionFXConfig {
  enabled: boolean;
  drive: number; // 0.0 - 50.0
  mix: number; // 0.0 - 1.0
}

export interface ReverbFXConfig {
  enabled: boolean;
  decay: number; // 0.5 - 5.0 seconds
  mix: number; // 0.0 - 1.0
}

export interface MasterFXSettings {
  filter: FilterFXConfig;
  delay: DelayFXConfig;
  distortion: DistortionFXConfig;
  reverb: ReverbFXConfig;
}

export interface ProjectData {
  version: string;
  title: string;
  bpm: number;
  swing: number; // 0.0 - 0.5
  stepCount: number; // 16 or 32
  tracks: Track[];
  masterVolume: number;
  masterFX: MasterFXSettings;
}

export interface NoteDefinition {
  name: string;
  midi: number;
  frequency: number;
}
