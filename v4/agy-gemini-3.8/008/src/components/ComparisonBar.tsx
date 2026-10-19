import React, { useRef } from 'react';
import { InstrumentPreset } from '../types';
import { DEFAULT_PRESETS } from '../presets/defaultPresets';
import { proceduralAudio } from '../engine/ProceduralAudioEngine';
import {
  Shuffle,
  RotateCcw,
  Download,
  Upload,
  FileAudio,
  Radio,
  Play,
  Copy,
} from 'lucide-react';

interface ComparisonBarProps {
  currentSlot: 'A' | 'B';
  onSwitchSlot: (slot: 'A' | 'B') => void;
  presetA: InstrumentPreset;
  presetB: InstrumentPreset;
  activePreset: InstrumentPreset;
  onUpdateActivePreset: (preset: InstrumentPreset) => void;
  onSaveSlot: (preset: InstrumentPreset) => void;
  onResetDefaults: () => void;
  onPlayTestNote: () => void;
}

export const ComparisonBar: React.FC<ComparisonBarProps> = ({
  currentSlot,
  onSwitchSlot,
  presetA,
  presetB,
  activePreset,
  onUpdateActivePreset,
  onSaveSlot,
  onResetDefaults,
  onPlayTestNote,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Procedural Random Instrument Generator
  const handleRandomize = () => {
    const updated = { ...activePreset };
    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    // Randomize ADSR
    updated.adsr = {
      attack: Math.max(0.002, rand(0.002, 0.4)),
      decay: rand(0.2, 2.5),
      sustain: rand(0.1, 0.8),
      release: rand(0.1, 1.2),
    };

    if (updated.family === 'STRINGS' && updated.stringParams) {
      updated.stringParams = {
        ...updated.stringParams,
        tension: rand(0.6, 1.6),
        damping: rand(0.01, 0.08),
        brightness: rand(1200, 11000),
        pluckPosition: rand(0.08, 0.45),
        excitationStrength: rand(0.5, 1.3),
        bodyResonance: rand(0.2, 0.9),
      };
    } else if (updated.family === 'PERCUSSION' && updated.percussionParams) {
      updated.percussionParams = {
        ...updated.percussionParams,
        pitch: rand(50, 320),
        pitchDecay: rand(0.03, 0.25),
        noiseMix: rand(0.1, 0.8),
        toneDecay: rand(0.1, 1.4),
        filterCutoff: rand(800, 9000),
        metallicInharmonicity: rand(0.1, 1.5),
      };
    } else if (updated.family === 'FM' && updated.fmParams) {
      const ops = updated.fmParams.operators.map((op, idx) => ({
        ...op,
        ratio: idx === 0 ? 1.0 : [0.5, 1, 2, 3, 3.5, 5.4, 7, 14][Math.floor(Math.random() * 8)],
        level: rand(0.2, 0.95),
        detune: Math.floor(rand(-15, 15)),
      }));
      updated.fmParams = {
        ...updated.fmParams,
        feedback: rand(0.1, 0.9),
        operators: ops,
      };
    } else if (updated.family === 'WIND' && updated.windParams) {
      updated.windParams = {
        ...updated.windParams,
        breathPressure: rand(0.6, 1.6),
        breathNoise: rand(0.05, 0.5),
        embouchure: rand(0.4, 1.4),
        bellFlare: rand(0.4, 1.4),
        vibratoDepth: rand(0.1, 0.5),
      };
    } else if (updated.family === 'EXPERIMENTAL' && updated.experimentalParams) {
      updated.experimentalParams = {
        ...updated.experimentalParams,
        feedbackAmount: rand(0.3, 0.92),
        density: Math.floor(rand(3, 10)),
        modulationRate: rand(0.1, 4.0),
        chaosFactor: rand(0.1, 0.8),
        filterCutoff: rand(600, 8000),
        resonance: rand(2, 16),
      };
    }

    onUpdateActivePreset(updated);
  };

  // Export Preset JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activePreset, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${activePreset.name.toLowerCase().replace(/\s+/g, '-')}-preset.json`);
    dlAnchor.click();
  };

  // Import Preset JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && typeof json === 'object' && json.name && json.family) {
          const fallback = DEFAULT_PRESETS.find((p) => p.family === json.family) || DEFAULT_PRESETS[0];
          const validatedPreset: InstrumentPreset = {
            ...fallback,
            ...json,
            id: json.id || `custom-${Date.now()}`,
            name: String(json.name).slice(0, 40),
            family: json.family,
            polyphony: Math.max(1, Math.min(16, Number(json.polyphony) || fallback.polyphony)),
            gain: Math.max(0.1, Math.min(2.0, Number(json.gain) || fallback.gain)),
            adsr: {
              attack: Math.max(0.001, Math.min(5.0, Number(json.adsr?.attack) || fallback.adsr.attack)),
              decay: Math.max(0.01, Math.min(10.0, Number(json.adsr?.decay) || fallback.adsr.decay)),
              sustain: Math.max(0.0, Math.min(1.0, Number(json.adsr?.sustain) ?? fallback.adsr.sustain)),
              release: Math.max(0.01, Math.min(8.0, Number(json.adsr?.release) || fallback.adsr.release)),
            },
            stringParams: json.stringParams ? { ...fallback.stringParams, ...json.stringParams } : fallback.stringParams,
            percussionParams: json.percussionParams ? { ...fallback.percussionParams, ...json.percussionParams } : fallback.percussionParams,
            fmParams: json.fmParams ? { ...fallback.fmParams, ...json.fmParams } : fallback.fmParams,
            windParams: json.windParams ? { ...fallback.windParams, ...json.windParams } : fallback.windParams,
            experimentalParams: json.experimentalParams ? { ...fallback.experimentalParams, ...json.experimentalParams } : fallback.experimentalParams,
          };
          onUpdateActivePreset(validatedPreset);
        }
      } catch (err) {
        console.error('Failed to parse preset JSON:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Export WAV Audio Sample
  const handleExportWAV = async () => {
    try {
      const blob = await proceduralAudio.exportWAV(2.8);
      const url = URL.createObjectURL(blob);
      const dlAnchor = document.createElement('a');
      dlAnchor.href = url;
      dlAnchor.download = `${activePreset.name.toLowerCase().replace(/\s+/g, '-')}-sample.wav`;
      dlAnchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (err) {
      console.error('WAV export error:', err);
    }
  };

  return (
    <div className="bg-slate-950/95 border-b border-slate-800/80 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs select-none shrink-0">
      {/* 1. A/B Comparison Switching Bar */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
          A/B Audition:
        </span>

        {/* Slot A Button */}
        <button
          onClick={() => onSwitchSlot('A')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentSlot === 'A'
              ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-300" />
          <span>Slot A ({presetA.name})</span>
        </button>

        {/* Slot B Button */}
        <button
          onClick={() => onSwitchSlot('B')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentSlot === 'B'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-indigo-300" />
          <span>Slot B ({presetB.name})</span>
        </button>

        {/* Copy current to other slot */}
        <button
          onClick={() => onSaveSlot(activePreset)}
          className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
          title={`Save Current to Slot ${currentSlot}`}
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {/* Audition Trigger Note */}
        <button
          onClick={onPlayTestNote}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all font-semibold cursor-pointer"
          title="Play Test Tone [Spacebar]"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Audition</span>
        </button>
      </div>

      {/* 2. Laboratory Utilities */}
      <div className="flex items-center gap-2">
        {/* Randomizer */}
        <button
          onClick={handleRandomize}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 text-amber-400 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800 transition-all cursor-pointer"
          title="Randomize Algorithmic Parameters"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Randomize</span>
        </button>

        {/* Reset Defaults */}
        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
          title="Reset to Factory Preset Defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset</span>
        </button>

        {/* Export JSON */}
        <button
          onClick={handleExportJSON}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
          title="Export Preset JSON"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">JSON</span>
        </button>

        {/* Import JSON */}
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleImportJSON}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
          title="Import Preset JSON"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Load</span>
        </button>

        {/* Export WAV Sample */}
        <button
          onClick={handleExportWAV}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-all font-semibold cursor-pointer"
          title="Synthesize &amp; Bounce WAV Sample"
        >
          <FileAudio className="w-3.5 h-3.5" />
          <span>Bounce WAV</span>
        </button>
      </div>
    </div>
  );
};
