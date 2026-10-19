import React from 'react';
import {
  InstrumentPreset,
  StringMaterial,
  PercussionType,
  FMAlgorithm,
  WindType,
  ExperimentalType,
} from '../types';
import { Sliders, Volume2, Activity, Cpu, Sparkles } from 'lucide-react';

interface InstrumentParameterDeckProps {
  preset: InstrumentPreset;
  onUpdatePreset: (updated: InstrumentPreset) => void;
}

const InstrumentParameterDeckComponent: React.FC<InstrumentParameterDeckProps> = ({
  preset,
  onUpdatePreset,
}) => {
  const updateADSR = (field: keyof InstrumentPreset['adsr'], val: number) => {
    onUpdatePreset({
      ...preset,
      adsr: {
        ...preset.adsr,
        [field]: val,
      },
    });
  };

  const updateStringParam = <K extends keyof NonNullable<InstrumentPreset['stringParams']>>(
    field: K,
    val: NonNullable<InstrumentPreset['stringParams']>[K]
  ) => {
    if (!preset.stringParams) return;
    onUpdatePreset({
      ...preset,
      stringParams: {
        ...preset.stringParams,
        [field]: val,
      },
    });
  };

  const updatePercussionParam = <K extends keyof NonNullable<InstrumentPreset['percussionParams']>>(
    field: K,
    val: NonNullable<InstrumentPreset['percussionParams']>[K]
  ) => {
    if (!preset.percussionParams) return;
    onUpdatePreset({
      ...preset,
      percussionParams: {
        ...preset.percussionParams,
        [field]: val,
      },
    });
  };

  const updateFMParam = <K extends keyof NonNullable<InstrumentPreset['fmParams']>>(
    field: K,
    val: NonNullable<InstrumentPreset['fmParams']>[K]
  ) => {
    if (!preset.fmParams) return;
    onUpdatePreset({
      ...preset,
      fmParams: {
        ...preset.fmParams,
        [field]: val,
      },
    });
  };

  const updateFMOperator = (opIndex: number, field: string, val: number) => {
    if (!preset.fmParams) return;
    const ops = [...preset.fmParams.operators];
    ops[opIndex] = {
      ...ops[opIndex],
      [field]: val,
    };
    onUpdatePreset({
      ...preset,
      fmParams: {
        ...preset.fmParams,
        operators: ops,
      },
    });
  };

  const updateWindParam = <K extends keyof NonNullable<InstrumentPreset['windParams']>>(
    field: K,
    val: NonNullable<InstrumentPreset['windParams']>[K]
  ) => {
    if (!preset.windParams) return;
    onUpdatePreset({
      ...preset,
      windParams: {
        ...preset.windParams,
        [field]: val,
      },
    });
  };

  const updateExperimentalParam = <
    K extends keyof NonNullable<InstrumentPreset['experimentalParams']>
  >(
    field: K,
    val: NonNullable<InstrumentPreset['experimentalParams']>[K]
  ) => {
    if (!preset.experimentalParams) return;
    onUpdatePreset({
      ...preset,
      experimentalParams: {
        ...preset.experimentalParams,
        [field]: val,
      },
    });
  };

  return (
    <div className="flex-1 bg-slate-900/60 p-4 overflow-y-auto flex flex-col gap-5 select-none">
      {/* 1. Header & Identity */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>{preset.name}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {preset.family}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time algorithmic parameter modulation &amp; physical modeling controls
          </p>
        </div>

        {/* Polyphony & Output Gain */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400">Polyphony:</span>
            <select
              value={preset.polyphony}
              onChange={(e) => onUpdatePreset({ ...preset, polyphony: Number(e.target.value) })}
              className="bg-transparent text-cyan-400 font-bold focus:outline-hidden cursor-pointer"
            >
              {[1, 2, 4, 6, 8, 12, 16].map((p) => (
                <option key={p} value={p} className="bg-slate-900 text-slate-200">
                  {p} voices
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400">Gain (A/B Norm):</span>
            <span className="text-emerald-400 font-bold">{preset.gain.toFixed(2)}x</span>
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.05"
              value={preset.gain}
              onChange={(e) => onUpdatePreset({ ...preset, gain: Number(e.target.value) })}
              className="w-20 accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 2. ALGORITHM-SPECIFIC PARAMETER CONTROLS */}
      {/* --------------------------------------------------------------------- */}
      {/* A. PHYSICAL MODELING STRINGS CONTROLS */}
      {/* --------------------------------------------------------------------- */}
      {preset.family === 'STRINGS' && preset.stringParams && (
        <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Digital Waveguide &amp; Karplus-Strong Parameters
            </span>
            <div className="flex items-center gap-1">
              {(['NYLON', 'STEEL', 'BASS', 'SYNTHETIC'] as StringMaterial[]).map((mat) => (
                <button
                  key={mat}
                  type="button"
                  onClick={() => updateStringParam('material', mat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                    preset.stringParams?.material === mat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* String Tension */}
            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>String Tension</span>
                <span className="font-mono text-cyan-400">{preset.stringParams.tension.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.05"
                value={preset.stringParams.tension}
                onChange={(e) => updateStringParam('tension', Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Modulates wave speed and delay pitch length</span>
            </div>

            {/* Damping */}
            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Feedback Damping</span>
                <span className="font-mono text-cyan-400">{preset.stringParams.damping.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.005"
                max="0.15"
                step="0.005"
                value={preset.stringParams.damping}
                onChange={(e) => updateStringParam('damping', Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">One-pole loop filter high-frequency loss</span>
            </div>

            {/* Brightness */}
            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Exciter Brightness</span>
                <span className="font-mono text-cyan-400">{Math.round(preset.stringParams.brightness)} Hz</span>
              </div>
              <input
                type="range"
                min="600"
                max="16000"
                step="200"
                value={preset.stringParams.brightness}
                onChange={(e) => updateStringParam('brightness', Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Initial strike noise harmonic bandwidth</span>
            </div>

            {/* Pluck Position */}
            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Pluck Position (Notch)</span>
                <span className="font-mono text-cyan-400">{(preset.stringParams.pluckPosition * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.01"
                value={preset.stringParams.pluckPosition}
                onChange={(e) => updateStringParam('pluckPosition', Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Comb filter harmonic notch position</span>
            </div>

            {/* Excitation Strength */}
            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Strike / Plectrum Force</span>
                <span className="font-mono text-cyan-400">{preset.stringParams.excitationStrength.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.5"
                step="0.05"
                value={preset.stringParams.excitationStrength}
                onChange={(e) => updateStringParam('excitationStrength', Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Transient hammer strike energy</span>
            </div>

            {/* Body Resonance */}
            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Acoustic Body Cavity</span>
                <span className="font-mono text-cyan-400">{Math.round(preset.stringParams.bodyResonance * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={preset.stringParams.bodyResonance}
                onChange={(e) => updateStringParam('bodyResonance', Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Wooden soundboard formant resonance</span>
            </div>

            {/* String Decay Time */}
            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>String Waveguide Decay</span>
                <span className="font-mono text-cyan-400">{preset.stringParams.decay.toFixed(1)} s</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={preset.stringParams.decay}
                onChange={(e) => updateStringParam('decay', Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">Open loop feedback decay duration</span>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* B. PERCUSSION CONTROLS */}
      {/* --------------------------------------------------------------------- */}
      {preset.family === 'PERCUSSION' && preset.percussionParams && (
        <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-rose-400" />
              Modal Drum &amp; Percussion Synthesis
            </span>
            <div className="flex items-center gap-1">
              {(['KICK', 'SNARE', 'HIHAT', 'TOM', 'METALLIC'] as PercussionType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updatePercussionParam('type', type)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                    preset.percussionParams?.type === type
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Fundamental Pitch</span>
                <span className="font-mono text-rose-400">{Math.round(preset.percussionParams.pitch)} Hz</span>
              </div>
              <input
                type="range"
                min="40"
                max="440"
                step="5"
                value={preset.percussionParams.pitch}
                onChange={(e) => updatePercussionParam('pitch', Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Pitch Drop Decay</span>
                <span className="font-mono text-rose-400">
                  {Math.round(preset.percussionParams.pitchDecay * 1000)} ms
                </span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.35"
                step="0.01"
                value={preset.percussionParams.pitchDecay}
                onChange={(e) => updatePercussionParam('pitchDecay', Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Noise / Snare Mix</span>
                <span className="font-mono text-rose-400">{Math.round(preset.percussionParams.noiseMix * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={preset.percussionParams.noiseMix}
                onChange={(e) => updatePercussionParam('noiseMix', Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Filter Bandwidth</span>
                <span className="font-mono text-rose-400">{Math.round(preset.percussionParams.filterCutoff)} Hz</span>
              </div>
              <input
                type="range"
                min="300"
                max="12000"
                step="200"
                value={preset.percussionParams.filterCutoff}
                onChange={(e) => updatePercussionParam('filterCutoff', Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Metallic Inharmonicity</span>
                <span className="font-mono text-rose-400">
                  {preset.percussionParams.metallicInharmonicity.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.05"
                value={preset.percussionParams.metallicInharmonicity}
                onChange={(e) => updatePercussionParam('metallicInharmonicity', Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>

            {/* Tone Decay */}
            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Body / Tone Decay</span>
                <span className="font-mono text-rose-400">{preset.percussionParams.toneDecay.toFixed(2)} s</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="2.5"
                step="0.05"
                value={preset.percussionParams.toneDecay}
                onChange={(e) => updatePercussionParam('toneDecay', Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* C. FM SYNTHESIS CONTROLS */}
      {/* --------------------------------------------------------------------- */}
      {preset.family === 'FM' && preset.fmParams && (
        <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-amber-400" />
              4-Operator Frequency Modulation Engine
            </span>

            {/* Feedback & Algorithm */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/80 px-2.5 py-1 rounded-xl">
                <span className="text-slate-400 text-[11px]">Feedback:</span>
                <input
                  type="range"
                  min="0.0"
                  max="1.5"
                  step="0.05"
                  value={preset.fmParams.feedback}
                  onChange={(e) => updateFMParam('feedback', Number(e.target.value))}
                  className="w-20 accent-amber-400 cursor-pointer"
                />
                <span className="font-mono text-amber-400 text-[11px]">
                  {preset.fmParams.feedback.toFixed(2)}
                </span>
              </div>

              {/* Algorithm Selector (1-6) */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 text-[11px] mr-1">Algorithm:</span>
                {([1, 2, 3, 4, 5, 6] as FMAlgorithm[]).map((alg) => (
                  <button
                    key={alg}
                    type="button"
                    onClick={() => updateFMParam('algorithm', alg)}
                    className={`w-6 h-6 rounded-lg text-xs font-mono font-bold transition-all ${
                      preset.fmParams?.algorithm === alg
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                    }`}
                  >
                    {alg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4 Operators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            {preset.fmParams.operators.map((op, idx) => (
              <div key={idx} className="bg-slate-900/70 border border-slate-800/70 p-3 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-slate-300 font-bold">
                  <span>Operator {idx + 1}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 font-mono text-amber-400">
                    {idx === 0 ? 'CARRIER' : 'MODULATOR'}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Freq Ratio</span>
                    <span className="font-mono text-slate-200">{op.ratio.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="16.0"
                    step="0.5"
                    value={op.ratio}
                    onChange={(e) => updateFMOperator(idx, 'ratio', Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Level (Index)</span>
                    <span className="font-mono text-slate-200">{Math.round(op.level * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={op.level}
                    onChange={(e) => updateFMOperator(idx, 'level', Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Detune</span>
                    <span className="font-mono text-slate-200">{op.detune}c</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="1"
                    value={op.detune}
                    onChange={(e) => updateFMOperator(idx, 'detune', Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* D. WIND LABORATORY CONTROLS */}
      {/* --------------------------------------------------------------------- */}
      {preset.family === 'WIND' && preset.windParams && (
        <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Acoustic Jet &amp; Non-Linear Lip/Reed Modeling
            </span>
            <div className="flex items-center gap-1">
              {(['FLUTE', 'REED', 'BRASS'] as WindType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateWindParam('type', type)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                    preset.windParams?.type === type
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Breath Pressure</span>
                <span className="font-mono text-emerald-400">{preset.windParams.breathPressure.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.05"
                value={preset.windParams.breathPressure}
                onChange={(e) => updateWindParam('breathPressure', Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Turbulent Jet Noise</span>
                <span className="font-mono text-emerald-400">{Math.round(preset.windParams.breathNoise * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.8"
                step="0.02"
                value={preset.windParams.breathNoise}
                onChange={(e) => updateWindParam('breathNoise', Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Embouchure Stiffness</span>
                <span className="font-mono text-emerald-400">{preset.windParams.embouchure.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.5"
                step="0.05"
                value={preset.windParams.embouchure}
                onChange={(e) => updateWindParam('embouchure', Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Bell Flare Cutoff</span>
                <span className="font-mono text-emerald-400">{preset.windParams.bellFlare.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.6"
                step="0.05"
                value={preset.windParams.bellFlare}
                onChange={(e) => updateWindParam('bellFlare', Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Vibrato Depth</span>
                <span className="font-mono text-emerald-400">{Math.round(preset.windParams.vibratoDepth * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={preset.windParams.vibratoDepth}
                onChange={(e) => updateWindParam('vibratoDepth', Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Bore Resonance */}
            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Bore Resonance (Q)</span>
                <span className="font-mono text-emerald-400">{preset.windParams.boreResonance.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={preset.windParams.boreResonance}
                onChange={(e) => updateWindParam('boreResonance', Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Vibrato Rate */}
            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Vibrato LFO Rate</span>
                <span className="font-mono text-emerald-400">{preset.windParams.vibratoRate.toFixed(1)} Hz</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="8.0"
                step="0.2"
                value={preset.windParams.vibratoRate}
                onChange={(e) => updateWindParam('vibratoRate', Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* E. EXPERIMENTAL LABORATORY CONTROLS */}
      {/* --------------------------------------------------------------------- */}
      {preset.family === 'EXPERIMENTAL' && preset.experimentalParams && (
        <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Complex Feedback Resonators &amp; Textures
            </span>
            <div className="flex items-center gap-1">
              {(['DRONE', 'EVOLVING_PAD', 'ALIEN_RESONATOR', 'GENERATIVE_TEXTURE'] as ExperimentalType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateExperimentalParam('type', type)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                    preset.experimentalParams?.type === type
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Feedback Amount</span>
                <span className="font-mono text-purple-400">
                  {Math.round(preset.experimentalParams.feedbackAmount * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.96"
                step="0.02"
                value={preset.experimentalParams.feedbackAmount}
                onChange={(e) => updateExperimentalParam('feedbackAmount', Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Partials Density</span>
                <span className="font-mono text-purple-400">{preset.experimentalParams.density} partials</span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="1"
                value={preset.experimentalParams.density}
                onChange={(e) => updateExperimentalParam('density', Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Modulation / LFO Rate</span>
                <span className="font-mono text-purple-400">
                  {preset.experimentalParams.modulationRate.toFixed(2)} Hz
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="8.0"
                step="0.05"
                value={preset.experimentalParams.modulationRate}
                onChange={(e) => updateExperimentalParam('modulationRate', Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Chaos Factor</span>
                <span className="font-mono text-purple-400">
                  {Math.round(preset.experimentalParams.chaosFactor * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={preset.experimentalParams.chaosFactor}
                onChange={(e) => updateExperimentalParam('chaosFactor', Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Resonance Q</span>
                <span className="font-mono text-purple-400">{preset.experimentalParams.resonance.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="20.0"
                step="0.5"
                value={preset.experimentalParams.resonance}
                onChange={(e) => updateExperimentalParam('resonance', Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

            {/* Filter Cutoff */}
            <div className="bg-slate-900/60 border border-slate-800/60 p-3 rounded-xl space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Resonator Filter Cutoff</span>
                <span className="font-mono text-purple-400">{Math.round(preset.experimentalParams.filterCutoff)} Hz</span>
              </div>
              <input
                type="range"
                min="150"
                max="12000"
                step="100"
                value={preset.experimentalParams.filterCutoff}
                onChange={(e) => updateExperimentalParam('filterCutoff', Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. ADSR ENVELOPE CONTROLS */}
      <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl space-y-3">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
          <Activity className="w-4 h-4 text-indigo-400" />
          Master ADSR Envelope Generator
        </span>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Attack */}
          <div className="bg-slate-900/60 border border-slate-800/60 p-2.5 rounded-xl space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Attack</span>
              <span className="font-mono text-indigo-400">{Math.round(preset.adsr.attack * 1000)} ms</span>
            </div>
            <input
              type="range"
              min="0.001"
              max="1.5"
              step="0.005"
              value={preset.adsr.attack}
              onChange={(e) => updateADSR('attack', Number(e.target.value))}
              className="w-full accent-indigo-400 cursor-pointer"
            />
          </div>

          {/* Decay */}
          <div className="bg-slate-900/60 border border-slate-800/60 p-2.5 rounded-xl space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Decay</span>
              <span className="font-mono text-indigo-400">{preset.adsr.decay.toFixed(2)} s</span>
            </div>
            <input
              type="range"
              min="0.02"
              max="4.0"
              step="0.05"
              value={preset.adsr.decay}
              onChange={(e) => updateADSR('decay', Number(e.target.value))}
              className="w-full accent-indigo-400 cursor-pointer"
            />
          </div>

          {/* Sustain */}
          <div className="bg-slate-900/60 border border-slate-800/60 p-2.5 rounded-xl space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Sustain</span>
              <span className="font-mono text-indigo-400">{Math.round(preset.adsr.sustain * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={preset.adsr.sustain}
              onChange={(e) => updateADSR('sustain', Number(e.target.value))}
              className="w-full accent-indigo-400 cursor-pointer"
            />
          </div>

          {/* Release */}
          <div className="bg-slate-900/60 border border-slate-800/60 p-2.5 rounded-xl space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Release</span>
              <span className="font-mono text-indigo-400">{preset.adsr.release.toFixed(2)} s</span>
            </div>
            <input
              type="range"
              min="0.02"
              max="3.5"
              step="0.05"
              value={preset.adsr.release}
              onChange={(e) => updateADSR('release', Number(e.target.value))}
              className="w-full accent-indigo-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const InstrumentParameterDeck = React.memo(InstrumentParameterDeckComponent);
