import { SynthParams } from '../types';

// Standard chromatic scale notes and frequencies
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const FLAT_MAP: Record<string, string> = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#',
  'Cb': 'B',
  'Fb': 'E',
};

export function noteToFreq(note: string): number {
  const match = note.match(/^([A-G][#b]?)(-?\d+)$/i);
  if (!match) return 440;
  let name = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
  const octave = parseInt(match[2], 10);

  // Normalize flat notation
  if (FLAT_MAP[name]) {
    name = FLAT_MAP[name];
  }

  const semitoneIndex = NOTE_NAMES.indexOf(name);
  if (semitoneIndex === -1) return 440;

  // MIDI note number: C4 = 60 (A4 = 69 = 440Hz)
  const midi = (octave + 1) * 12 + semitoneIndex;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Reusable white noise buffer to avoid GC pressure
let cachedNoiseBuffer: AudioBuffer | null = null;
function getWhiteNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (cachedNoiseBuffer && cachedNoiseBuffer.sampleRate === ctx.sampleRate) {
    return cachedNoiseBuffer;
  }
  const bufferSize = ctx.sampleRate * 2; // 2 seconds of white noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  cachedNoiseBuffer = buffer;
  return buffer;
}

/**
 * 808/909 Style Synthesized Kick Drum
 */
export function playKick(ctx: AudioContext, dest: AudioNode, time: number, velocity: number) {
  const safeVel = Math.max(0.001, Math.min(1.0, velocity));
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Pitch sweep from 150Hz down to 38Hz
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

  // Punch gain envelope
  const peak = Math.max(0.001, safeVel * 0.95);
  gain.gain.setValueAtTime(peak, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);

  osc.connect(gain);
  gain.connect(dest);

  osc.start(time);
  osc.stop(time + 0.36);
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };

  // Click transient for punch
  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  clickOsc.frequency.setValueAtTime(450, time);
  clickGain.gain.setValueAtTime(Math.max(0.001, safeVel * 0.3), time);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.02);

  clickOsc.connect(clickGain);
  clickGain.connect(dest);
  clickOsc.start(time);
  clickOsc.stop(time + 0.025);
  clickOsc.onended = () => {
    clickOsc.disconnect();
    clickGain.disconnect();
  };
}

/**
 * Synthesized Snare Drum (Triangle Body + Filtered White Noise)
 */
export function playSnare(ctx: AudioContext, dest: AudioNode, time: number, velocity: number) {
  const safeVel = Math.max(0.001, Math.min(1.0, velocity));

  // 1. Tonal body
  const bodyOsc = ctx.createOscillator();
  const bodyGain = ctx.createGain();
  bodyOsc.type = 'triangle';
  bodyOsc.frequency.setValueAtTime(220, time);
  bodyOsc.frequency.exponentialRampToValueAtTime(110, time + 0.1);

  bodyGain.gain.setValueAtTime(Math.max(0.001, safeVel * 0.6), time);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);

  bodyOsc.connect(bodyGain);
  bodyGain.connect(dest);
  bodyOsc.start(time);
  bodyOsc.stop(time + 0.13);
  bodyOsc.onended = () => {
    bodyOsc.disconnect();
    bodyGain.disconnect();
  };

  // 2. White noise rattle
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = getWhiteNoiseBuffer(ctx);

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(1400, time);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(Math.max(0.001, safeVel * 0.7), time);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.22);

  noiseSource.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(dest);

  noiseSource.start(time);
  noiseSource.stop(time + 0.23);
  noiseSource.onended = () => {
    noiseSource.disconnect();
    filter.disconnect();
    noiseGain.disconnect();
  };
}

/**
 * Synthesized Closed Hi-Hat (Crisp Metallic High-pass Noise)
 */
export function playHiHatClosed(ctx: AudioContext, dest: AudioNode, time: number, velocity: number) {
  const safeVel = Math.max(0.001, Math.min(1.0, velocity));
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = getWhiteNoiseBuffer(ctx);

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(6500, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(Math.max(0.001, safeVel * 0.55), time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  noiseSource.start(time);
  noiseSource.stop(time + 0.055);
  noiseSource.onended = () => {
    noiseSource.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
}

/**
 * Synthesized Open Hi-Hat (Sustained Metallic Noise)
 */
export function playHiHatOpen(ctx: AudioContext, dest: AudioNode, time: number, velocity: number) {
  const safeVel = Math.max(0.001, Math.min(1.0, velocity));
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = getWhiteNoiseBuffer(ctx);

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(5500, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(Math.max(0.001, safeVel * 0.5), time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  noiseSource.start(time);
  noiseSource.stop(time + 0.36);
  noiseSource.onended = () => {
    noiseSource.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
}

/**
 * Synthesized Handclap (Staggered Micro-bursts)
 */
export function playClap(ctx: AudioContext, dest: AudioNode, time: number, velocity: number) {
  const safeVel = Math.max(0.001, Math.min(1.0, velocity));
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1200, time);
  filter.Q.setValueAtTime(1.8, time);

  // 3 staggered taps
  const tapTimes = [0, 0.012, 0.024];
  tapTimes.forEach((dt, idx) => {
    const tapSource = ctx.createBufferSource();
    tapSource.buffer = getWhiteNoiseBuffer(ctx);
    const tapGain = ctx.createGain();

    const isLast = idx === tapTimes.length - 1;
    const dur = isLast ? 0.2 : 0.015;
    const peak = Math.max(0.001, safeVel * (isLast ? 0.65 : 0.45));

    tapGain.gain.setValueAtTime(peak, time + dt);
    tapGain.gain.exponentialRampToValueAtTime(0.0001, time + dt + dur);

    tapSource.connect(filter);
    tapGain.connect(dest);
    filter.connect(tapGain);

    tapSource.start(time + dt);
    tapSource.stop(time + dt + dur + 0.01);
    tapSource.onended = () => {
      tapSource.disconnect();
      tapGain.disconnect();
      if (isLast) filter.disconnect();
    };
  });
}

/**
 * Polyphonic Lead Synthesizer with ADSR Envelope and Lowpass Filter
 */
export function playSynthVoice(
  ctx: AudioContext,
  dest: AudioNode,
  time: number,
  freq: number,
  velocity: number,
  params: SynthParams,
  duration: number
) {
  const safeVel = Math.max(0.001, Math.min(1.0, velocity));
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator(); // Detuned unison for analog warmth
  const filter = ctx.createBiquadFilter();
  const vca = ctx.createGain();

  osc1.type = params.waveform || 'sawtooth';
  osc1.frequency.setValueAtTime(freq, time);

  // Slight detune for richness
  osc2.type = params.waveform || 'sawtooth';
  osc2.frequency.setValueAtTime(freq * 1.003, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(Math.max(50, params.cutoffFreq || 2800), time);
  filter.Q.setValueAtTime(2.0, time);

  // ADSR calculation
  const attack = Math.max(0.005, params.attack || 0.01);
  const decay = Math.max(0.01, params.decay || 0.15);
  const sustain = Math.max(0.001, Math.min(1.0, params.sustain ?? 0.5));
  const release = Math.max(0.01, params.release || 0.15);

  const peak = Math.max(0.001, safeVel * 0.45);
  const sustainLevel = Math.max(0.0001, peak * sustain);

  // Envelope timing
  vca.gain.setValueAtTime(0.0001, time);
  vca.gain.linearRampToValueAtTime(peak, time + attack);
  vca.gain.exponentialRampToValueAtTime(sustainLevel, time + attack + decay);

  // Note release
  const noteEndTime = time + Math.max(attack + decay, duration);
  vca.gain.setValueAtTime(sustainLevel, noteEndTime);
  vca.gain.exponentialRampToValueAtTime(0.0001, noteEndTime + release);

  // Connect routing
  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(vca);
  vca.connect(dest);

  osc1.start(time);
  osc2.start(time);
  osc1.stop(noteEndTime + release + 0.02);
  osc2.stop(noteEndTime + release + 0.02);

  osc1.onended = () => {
    osc1.disconnect();
    osc2.disconnect();
    filter.disconnect();
    vca.disconnect();
  };
}

/**
 * Sub-Bass Synthesizer (Warm Sawtooth + Sub-Sine + Warm Drive)
 */
export function playBassVoice(
  ctx: AudioContext,
  dest: AudioNode,
  time: number,
  freq: number,
  velocity: number,
  duration: number,
  params?: SynthParams
) {
  const safeVel = Math.max(0.001, Math.min(1.0, velocity));
  const oscSub = ctx.createOscillator();
  const oscSaw = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  // Sub sine at fundamental
  oscSub.type = 'sine';
  oscSub.frequency.setValueAtTime(freq, time);

  // Saw wave at fundamental with lowpass to give punch and growl
  oscSaw.type = params?.waveform || 'sawtooth';
  oscSaw.frequency.setValueAtTime(freq, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(Math.max(50, params?.cutoffFreq || 320), time);
  filter.Q.setValueAtTime(3.0, time);

  const peak = Math.max(0.001, safeVel * 0.55);
  const attack = Math.max(0.005, params?.attack || 0.01);
  const decay = Math.max(0.01, params?.decay || 0.1);
  const sustain = Math.max(0.001, Math.min(1.0, params?.sustain ?? 0.7));
  const release = Math.max(0.01, params?.release || 0.08);

  const sustainLevel = Math.max(0.0001, peak * sustain);

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(peak, time + attack);
  gain.gain.exponentialRampToValueAtTime(sustainLevel, time + attack + decay);

  const endTime = time + Math.max(attack + decay, duration);
  gain.gain.setValueAtTime(sustainLevel, endTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime + release);

  oscSub.connect(gain);
  oscSaw.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  oscSub.start(time);
  oscSaw.start(time);
  oscSub.stop(endTime + release + 0.02);
  oscSaw.stop(endTime + release + 0.02);

  oscSub.onended = () => {
    oscSub.disconnect();
    oscSaw.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
}

/**
 * Arp/Pluck Synthesizer (Fast Decay Square/Triangle Pluck)
 */
export function playArpVoice(
  ctx: AudioContext,
  dest: AudioNode,
  time: number,
  freq: number,
  velocity: number,
  duration: number,
  params?: SynthParams
) {
  const safeVel = Math.max(0.001, Math.min(1.0, velocity));
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc.type = params?.waveform || 'square';
  osc.frequency.setValueAtTime(freq, time);

  // Dynamic filter sweep for pluck sound
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(Math.max(50, params?.cutoffFreq || 3500), time);
  filter.frequency.exponentialRampToValueAtTime(400, time + 0.18);
  filter.Q.setValueAtTime(4.0, time);

  const peak = Math.max(0.001, safeVel * 0.35);
  const attack = Math.max(0.005, params?.attack || 0.005);
  const decay = Math.max(0.01, params?.decay || 0.2);
  const sustain = Math.max(0.001, Math.min(1.0, params?.sustain ?? 0.2));
  const release = Math.max(0.01, params?.release || 0.1);

  const sustainLevel = Math.max(0.0001, peak * sustain);

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(peak, time + attack);
  gain.gain.exponentialRampToValueAtTime(sustainLevel, time + attack + decay);

  const endTime = time + Math.max(attack + decay, duration);
  gain.gain.setValueAtTime(sustainLevel, endTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime + release);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  osc.start(time);
  osc.stop(endTime + release + 0.02);
  osc.onended = () => {
    osc.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
}
