import React from 'react';
import { SuiteMode, PresetId } from '../types';
import { RELATIVITY_PRESETS } from '../relativity/RelativityPresets';

interface HeaderProps {
  suiteMode: SuiteMode;
  onSetSuiteMode: (mode: SuiteMode) => void;
  selectedPresetId: PresetId | '';
  onSelectPreset: (id: PresetId) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onOpenExport: () => void;
  fps: number;
}

export const Header: React.FC<HeaderProps> = ({
  suiteMode,
  onSetSuiteMode,
  selectedPresetId,
  onSelectPreset,
  isPaused,
  onTogglePause,
  isAudioMuted,
  onToggleAudio,
  onOpenExport,
  fps,
}) => {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-slate-200 select-none">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 flex items-center justify-center font-bold text-white shadow-lg shadow-sky-950/50">
          gᵤᵥ
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm tracking-wide text-white">RELATIVITY-LAB</h1>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300">
              EXP-016
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Einsteinian Curved Spacetime, Null Geodesics & Kerr Studio
          </p>
        </div>
      </div>

      {/* Suite Mode Tabs */}
      <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
        <button
          type="button"
          onClick={() => onSetSuiteMode('GEODESIC_ORBITS')}
          className={`px-2.5 py-1 rounded transition-colors ${
            suiteMode === 'GEODESIC_ORBITS'
              ? 'bg-sky-600 text-white font-medium shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Geodesic Orbits
        </button>
        <button
          type="button"
          onClick={() => onSetSuiteMode('KERR_SHADOW_LENS')}
          className={`px-2.5 py-1 rounded transition-colors ${
            suiteMode === 'KERR_SHADOW_LENS'
              ? 'bg-sky-600 text-white font-medium shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Kerr Shadow & Lens
        </button>
        <button
          type="button"
          onClick={() => onSetSuiteMode('GRAVITATIONAL_WAVES')}
          className={`px-2.5 py-1 rounded transition-colors ${
            suiteMode === 'GRAVITATIONAL_WAVES'
              ? 'bg-sky-600 text-white font-medium shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          GW Inspiral (3.5PN)
        </button>
        <button
          type="button"
          onClick={() => onSetSuiteMode('SPACETIME_EMBEDDING')}
          className={`px-2.5 py-1 rounded transition-colors ${
            suiteMode === 'SPACETIME_EMBEDDING'
              ? 'bg-sky-600 text-white font-medium shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Flamm Embedding
        </button>
      </nav>

      {/* Preset Selector & Action Buttons */}
      <div className="flex items-center gap-2">
        <select
          value={selectedPresetId}
          onChange={(e) => onSelectPreset(e.target.value as PresetId)}
          className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-slate-200 outline-none focus:border-sky-500"
        >
          <option value="" disabled>
            Select Scenario Preset...
          </option>
          {RELATIVITY_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Play / Pause */}
        <button
          type="button"
          onClick={onTogglePause}
          className={`px-3 py-1 rounded text-xs font-mono border transition-colors ${
            isPaused
              ? 'bg-emerald-600 border-emerald-500 text-white'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>

        {/* Audio Sonification */}
        <button
          type="button"
          onClick={onToggleAudio}
          className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors flex items-center gap-1.5 ${
            !isAudioMuted
              ? 'bg-sky-500/20 border-sky-500 text-sky-300 shadow-sm'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>{isAudioMuted ? '🔇 Audio' : '🔊 Sonified'}</span>
        </button>

        {/* Data Export */}
        <button
          type="button"
          onClick={onOpenExport}
          className="px-2.5 py-1 rounded text-xs font-mono bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          Export
        </button>

        {/* FPS badge */}
        <div className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-400">
          {fps} FPS
        </div>
      </div>
    </header>
  );
};
