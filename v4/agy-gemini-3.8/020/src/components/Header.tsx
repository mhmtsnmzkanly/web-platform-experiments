/**
 * HEADER COMPONENT
 * COSMO-FORGE (EXP-020)
 */

import React from 'react';
import { CosmoSuiteMode, CosmoPresetId } from '../types';
import { COSMO_PRESETS } from '../core/SimulationController';
import { Volume2, VolumeX, Download, Compass, Sparkles } from 'lucide-react';

interface HeaderProps {
  suiteMode: CosmoSuiteMode;
  onSelectMode: (mode: CosmoSuiteMode) => void;
  activePresetId?: CosmoPresetId;
  onSelectPreset: (presetId: CosmoPresetId) => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  measuredFps: number;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  suiteMode,
  onSelectMode,
  activePresetId,
  onSelectPreset,
  audioEnabled,
  onToggleAudio,
  measuredFps,
  onOpenExport,
}) => {
  const modes: { id: CosmoSuiteMode; label: string }[] = [
    { id: 'COSMIC_EXPANSION', label: 'FLRW Expansion' },
    { id: 'CMB_POWER_SPECTRUM', label: 'CMB Acoustics' },
    { id: 'PRIMORDIAL_BBN', label: 'Primordial BBN' },
    { id: 'DARK_MATTER_HALO', label: 'Dark Matter Halo' },
    { id: 'COSMIC_GEOMETRY', label: 'Cosmic Geometry' },
  ];

  return (
    <header className="bg-slate-900/90 border-b border-cyan-900/40 px-4 py-2 flex flex-wrap items-center justify-between gap-3 select-none backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/30 rounded-lg border border-cyan-500/30 text-cyan-400">
          <Compass className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-wider text-slate-100 flex items-center gap-2">
            COSMO-FORGE
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              EXP-020
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-mono">
            FLRW Dynamics, CMB Acoustic Peaks, BBN & Dark Matter Studio
          </p>
        </div>
      </div>

      {/* Suite Mode Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
        {modes.map((m) => {
          const isActive = suiteMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </nav>

      {/* Preset Selector & Tools */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={activePresetId || 'PLANCK_LCDM'}
            onChange={(e) => onSelectPreset(e.target.value as CosmoPresetId)}
            className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            {Object.values(COSMO_PRESETS).map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleAudio}
          title={audioEnabled ? 'Mute Sonification' : 'Enable Procedural Audio'}
          className={`p-1.5 rounded-lg border transition-all ${
            audioEnabled
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
              : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Data Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          Export
        </button>

        {/* Real-Time Measured FPS Badge */}
        <div className="px-2 py-1 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-slate-400">
          <span className="text-cyan-400 font-semibold">{measuredFps.toFixed(1)}</span> FPS
        </div>
      </div>
    </header>
  );
};
