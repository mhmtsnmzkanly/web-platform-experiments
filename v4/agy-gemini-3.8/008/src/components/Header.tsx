import React from 'react';
import { InstrumentFamily, InstrumentPreset, AudioTelemetry } from '../types';
import { DEFAULT_PRESETS } from '../presets/defaultPresets';
import { Volume2, VolumeX, Music4, Activity, Cpu, Gauge } from 'lucide-react';

interface HeaderProps {
  currentFamily: InstrumentFamily;
  onSelectFamily: (family: InstrumentFamily) => void;
  activePreset: InstrumentPreset;
  onSelectPreset: (preset: InstrumentPreset) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  activeVoiceCount: number;
  telemetry: AudioTelemetry;
}

export const Header: React.FC<HeaderProps> = ({
  currentFamily,
  onSelectFamily,
  activePreset,
  onSelectPreset,
  isMuted,
  onToggleMute,
  activeVoiceCount,
  telemetry,
}) => {
  const families: { id: InstrumentFamily; label: string }[] = [
    { id: 'STRINGS', label: 'Physical Strings' },
    { id: 'PERCUSSION', label: 'Percussion' },
    { id: 'FM', label: 'FM Synthesis' },
    { id: 'WIND', label: 'Acoustic Wind' },
    { id: 'EXPERIMENTAL', label: 'Experimental' },
  ];

  const presetsForFamily = DEFAULT_PRESETS.filter((p) => p.family === currentFamily);

  return (
    <header className="h-16 bg-slate-950/95 border-b border-slate-800/80 px-4 flex items-center justify-between z-20 backdrop-blur-md select-none shrink-0">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Music4 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm tracking-wide text-slate-100 flex items-center gap-1.5">
              <span>PROCEDURAL INSTRUMENT LAB</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                EXP-008
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
            Mathematical &amp; Algorithmic Acoustic Physical Modeling
          </p>
        </div>
      </div>

      {/* Instrument Family Selector Tabs */}
      <div className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800/80 p-1 rounded-xl">
        {families.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              onSelectFamily(f.id);
              const firstPreset = DEFAULT_PRESETS.find((p) => p.family === f.id);
              if (firstPreset) onSelectPreset(firstPreset);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentFamily === f.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Preset Selector & Global Audio */}
      <div className="flex items-center gap-2">
        {/* Preset Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800/80 px-2.5 py-1.5 rounded-xl">
          <span className="text-slate-400 text-xs hidden lg:inline">Preset:</span>
          <select
            value={activePreset.id}
            onChange={(e) => {
              const selected = DEFAULT_PRESETS.find((p) => p.id === e.target.value);
              if (selected) onSelectPreset(selected);
            }}
            className="bg-transparent text-xs text-cyan-300 font-medium focus:outline-hidden cursor-pointer"
          >
            {presetsForFamily.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* DSP CPU & Audio Telemetry Meter */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 border border-slate-800/80 px-2.5 py-1 rounded-xl text-[11px] font-mono text-slate-300">
          <div className="flex items-center gap-1 text-cyan-400" title="Estimated Web Audio DSP Thread Load">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {Math.min(99, Math.round((activeVoiceCount / (activePreset.polyphony || 8)) * 32 + (telemetry?.rmsLevel || 0) * 45))}% CPU
            </span>
          </div>

          <span className="text-slate-700">|</span>

          {/* VU / Headroom Peak Bar */}
          <div className="flex items-center gap-1" title={`RMS: ${(telemetry?.rmsLevel || 0).toFixed(2)} / Peak: ${(telemetry?.peakLevel || 0).toFixed(2)}`}>
            <Gauge className="w-3 h-3 text-slate-400" />
            <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-rose-500 transition-all duration-75"
                style={{ width: `${Math.min(100, Math.round((telemetry?.rmsLevel || 0) * 120))}%` }}
              />
            </div>
          </div>

          <span className="text-slate-700 hidden lg:inline">|</span>

          <span className="text-[10px] text-slate-400 hidden lg:inline">
            {(telemetry?.sampleRate ? (telemetry.sampleRate / 1000).toFixed(1) : '44.1')}kHz
          </span>
        </div>

        {/* Active Voice Pill */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800/80 px-2.5 py-1.5 rounded-xl text-xs font-mono text-slate-300">
          <Activity className={`w-3.5 h-3.5 ${activeVoiceCount > 0 ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <span>{activeVoiceCount}/{activePreset.polyphony || 8} v</span>
        </div>

        {/* Mute Button */}
        <button
          onClick={onToggleMute}
          className={`p-2 rounded-xl border text-xs transition-all ${
            isMuted
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
          title={isMuted ? 'Unmute Audio [M]' : 'Mute Audio [M]'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
