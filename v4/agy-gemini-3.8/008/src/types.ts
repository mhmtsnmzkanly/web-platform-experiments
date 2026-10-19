export type InstrumentFamily = 'STRINGS' | 'PERCUSSION' | 'FM' | 'WIND' | 'EXPERIMENTAL';

export type StringMaterial = 'NYLON' | 'STEEL' | 'BASS' | 'SYNTHETIC';

export interface StringParams {
  tension: number; // 0.2 to 2.0
  damping: number; // 0.005 to 0.25 (decay damping)
  brightness: number; // 400 to 16000 Hz (harmonic excitation richness)
  pluckPosition: number; // 0.05 to 0.5 (comb filter notch point)
  excitationStrength: number; // 0.2 to 1.5 (hammer/plectrum strike)
  bodyResonance: number; // 0.0 to 1.0 (acoustic cavity formant)
  material: StringMaterial;
  decay: number; // 0.3 to 6.0s
}

export type PercussionType = 'KICK' | 'SNARE' | 'HIHAT' | 'TOM' | 'METALLIC';

export interface PercussionParams {
  type: PercussionType;
  pitch: number; // 35 to 440 Hz
  pitchDecay: number; // 0.02 to 0.4s
  noiseMix: number; // 0 to 1.0
  toneDecay: number; // 0.05 to 2.5s
  filterCutoff: number; // 200 to 14000 Hz
  metallicInharmonicity: number; // 0.0 to 2.0
}

export type FMAlgorithm = 1 | 2 | 3 | 4 | 5 | 6;

export interface FMOperator {
  ratio: number; // 0.5 to 16.0
  detune: number; // -50 to +50 cents
  level: number; // 0.0 to 1.0
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface FMParams {
  algorithm: FMAlgorithm;
  operators: FMOperator[]; // 4 operators
  feedback: number; // 0 to 1.5
}

export type WindType = 'FLUTE' | 'REED' | 'BRASS';

export interface WindParams {
  type: WindType;
  breathPressure: number; // 0.2 to 2.0
  breathNoise: number; // 0.0 to 0.8
  boreResonance: number; // 0.1 to 1.0
  embouchure: number; // 0.1 to 1.5
  bellFlare: number; // 0.1 to 1.5
  vibratoRate: number; // 2 to 8 Hz
  vibratoDepth: number; // 0 to 1.0
}

export type ExperimentalType = 'DRONE' | 'EVOLVING_PAD' | 'ALIEN_RESONATOR' | 'GENERATIVE_TEXTURE';

export interface ExperimentalParams {
  type: ExperimentalType;
  feedbackAmount: number; // 0.1 to 0.96
  density: number; // 2 to 12 partials
  modulationRate: number; // 0.05 to 8.0 Hz
  chaosFactor: number; // 0 to 1.0
  filterCutoff: number; // 150 to 12000 Hz
  resonance: number; // 0.5 to 20
}

export interface ADSRParams {
  attack: number; // 0.001 to 2.0s
  decay: number; // 0.01 to 3.0s
  sustain: number; // 0.0 to 1.0
  release: number; // 0.01 to 4.0s
}

export interface InstrumentPreset {
  id: string;
  name: string;
  family: InstrumentFamily;
  polyphony: number;
  gain: number; // Equal-loudness gain compensation (0.2 to 2.0)
  adsr: ADSRParams;
  stringParams?: StringParams;
  percussionParams?: PercussionParams;
  fmParams?: FMParams;
  windParams?: WindParams;
  experimentalParams?: ExperimentalParams;
}

export interface ActiveVoiceInfo {
  id: string;
  note: number;
  freq: number;
  velocity: number;
  startTime: number;
  family: InstrumentFamily;
}

export interface AudioTelemetry {
  activeVoices: number;
  maxPolyphony: number;
  rmsLevel: number;
  peakLevel: number;
  audioContextState: string;
  sampleRate: number;
}
