/**
 * POWDER-BOX (EXP-022) — Header Component
 * Telemetry displays: Wall-clock FPS, active particle counts, thermal readings, preset selection.
 */

import React from 'react';
import { PowderSimulationController } from '../core/PowderSimulationController';
import { SANDBOX_PRESETS } from '../physics/SandboxPresets';
import { PresetType } from '../types';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Thermometer,
  Download,
  Flame,
  Activity,
} from 'lucide-react';

interface HeaderProps {
  controller: PowderSimulationController;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ controller, onOpenExport }) => {
  const metrics = controller.metrics;
  const isMuted = controller.audio.muted;

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur px-4 flex items-center justify-between z-20 select-none">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-lg shadow-amber-950/40">
          <Sparkles className="w-5 h-5 text-amber-100" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-amber-300 font-mono">
              POWDER-BOX
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              EXP-022
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Granular Materials, Multi-Phase Fluids, Thermodynamics & Cellular Automata
          </p>
        </div>
      </div>

      {/* Center Live Telemetry Gauges */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">FPS:</span>
          <span className={`font-bold ${controller.measuredFps >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {controller.measuredFps}
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400">Active:</span>
          <span className="text-amber-300 font-bold" title="Active Non-Empty Cells" data-testid="active-particles">
            {metrics.activeParticles.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500">/ {metrics.totalCells.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-slate-400">Temp:</span>
          <span className="text-orange-300 font-bold">
            {metrics.meanTemperature}°C
          </span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">(max {metrics.maxTemperature}°C)</span>
        </div>
      </div>

      {/* Right Controls: Presets, Thermal View, Audio & Export */}
      <div className="flex items-center gap-2">
        {/* Preset Selector */}
        <select
          value={controller.currentPreset}
          onChange={(e) => controller.loadPreset(e.target.value as PresetType)}
          className="text-xs bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 font-mono hover:border-amber-500/50 transition cursor-pointer outline-none"
        >
          {SANDBOX_PRESETS.map((p) => (
            <option key={p.type} value={p.type}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Thermal Heatmap Toggle */}
        <button
          onClick={() => controller.toggleThermalView()}
          title="Toggle Thermal Heatmap View"
          className={`p-1.5 rounded border transition ${
            controller.showThermalView
              ? 'bg-orange-500/20 border-orange-500 text-orange-300'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Thermometer className="w-4 h-4" />
        </button>

        {/* Audio Mute Toggle */}
        <button
          onClick={() => controller.audio.toggleMute()}
          title="Toggle Procedural Audio"
          className={`p-1.5 rounded border transition ${
            isMuted
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Data Export Button */}
        <button
          onClick={onOpenExport}
          title="Export State JSON / CSV"
          className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
