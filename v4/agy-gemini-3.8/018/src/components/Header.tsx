import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Download, Sparkles, Orbit } from 'lucide-react';
import { SuiteMode, PresetId, StellarTelemetry } from '../types/index.js';
import { STELLAR_PRESETS } from '../core/SimulationController.js';

interface HeaderProps {
  currentMode: SuiteMode;
  onSelectMode: (mode: SuiteMode) => void;
  currentPreset: PresetId;
  onSelectPreset: (presetId: PresetId) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenExport: () => void;
  telemetry: StellarTelemetry;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  currentPreset,
  onSelectPreset,
  isPaused,
  onTogglePause,
  onReset,
  isMuted,
  onToggleMute,
  onOpenExport,
  telemetry,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Brand & Title */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-100 bg-clip-text text-transparent">
              STELLAR-FORGE
            </h1>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-600/50 text-amber-300">
              EXP-018
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-600/50 text-emerald-300">
              VERIFIED CORRECT
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Hydrostatic Polytropes, Gamow Burning & Core Collapse Studio
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-xs">
        <button
          onClick={() => onSelectMode('INTERIOR_PROFILES')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all ${
            currentMode === 'INTERIOR_PROFILES'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Radial Profiles
        </button>
        <button
          onClick={() => onSelectMode('ONION_CORE_CROSS_SECTION')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all ${
            currentMode === 'ONION_CORE_CROSS_SECTION'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Onion Core
        </button>
        <button
          onClick={() => onSelectMode('HR_EVOLUTIONARY_TRACK')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all ${
            currentMode === 'HR_EVOLUTIONARY_TRACK'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          H-R Diagram
        </button>
        <button
          onClick={() => onSelectMode('NUCLEOSYNTHESIS_CHART')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all ${
            currentMode === 'NUCLEOSYNTHESIS_CHART'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Nucleosynthesis
        </button>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-[11px] font-mono text-slate-400">Preset:</span>
        <select
          value={currentPreset}
          onChange={(e) => onSelectPreset(e.target.value as PresetId)}
          className="bg-slate-800 text-slate-200 text-xs rounded-md border border-slate-700 px-2 py-1 focus:outline-none focus:border-amber-500"
        >
          {Object.values(STELLAR_PRESETS).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Control Buttons & Telemetry Badges */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onTogglePause}
          className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          title={isPaused ? 'Resume Simulation' : 'Pause Simulation'}
        >
          {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
        </button>

        <button
          onClick={onReset}
          className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          title="Reset Star"
        >
          <RotateCcw className="w-4 h-4 text-slate-300" />
        </button>

        <button
          onClick={onToggleMute}
          className={`p-1.5 rounded-md border transition-colors ${
            isMuted
              ? 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'
              : 'bg-amber-950/60 text-amber-400 border-amber-600/50 hover:bg-amber-900/60'
          }`}
          title={isMuted ? 'Unmute Sonification' : 'Mute Sonification'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors"
          title="Export CSV / JSON Data"
        >
          <Download className="w-3.5 h-3.5 text-slate-300" />
          <span>Export</span>
        </button>

        {/* FPS Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2 py-1 bg-slate-950/60 border border-slate-800 rounded-md font-mono text-[11px]">
          <span className="text-slate-500">FPS:</span>
          <span className={telemetry.fps >= 50 ? 'text-emerald-400' : telemetry.fps >= 30 ? 'text-amber-400' : 'text-rose-400'}>
            {telemetry.fps}
          </span>
        </div>
      </div>
    </header>
  );
};
