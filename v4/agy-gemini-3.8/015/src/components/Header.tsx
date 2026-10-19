import React from 'react';
import { SuiteMode, PresetId, TelemetryMetrics } from '../types';
import { CRYO_PRESETS } from '../quantum/CryoPresets';
import {
  Snowflake,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  RotateCcw,
  Atom,
  Cpu,
  Layers,
  ThermometerSnowflake,
} from 'lucide-react';

interface HeaderProps {
  suiteMode: SuiteMode;
  onSetSuiteMode: (mode: SuiteMode) => void;
  selectedPreset: PresetId;
  onSelectPreset: (id: PresetId) => void;
  isRunning: boolean;
  onToggleRunning: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenExport: () => void;
  onReset: () => void;
  metrics: TelemetryMetrics;
}

export const Header: React.FC<HeaderProps> = ({
  suiteMode,
  onSetSuiteMode,
  selectedPreset,
  onSelectPreset,
  isRunning,
  onToggleRunning,
  isMuted,
  onToggleMute,
  onOpenExport,
  onReset,
  metrics,
}) => {
  return (
    <header className="w-full bg-slate-950 border-b border-slate-800 text-slate-100 px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-3 select-none">
      {/* Brand & Suite Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Snowflake className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-cyan-400 font-mono">
              CRYO-LAB
            </h1>
            <p className="text-[10px] text-slate-400 hidden lg:block">
              Superconductivity, Josephson & BEC Studio
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => onSetSuiteMode('TDGL_VORTEX')}
            className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
              suiteMode === 'TDGL_VORTEX'
                ? 'bg-cyan-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            VORTEX LATTICE
          </button>
          <button
            onClick={() => onSetSuiteMode('JOSEPHSON_SQUID')}
            className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
              suiteMode === 'JOSEPHSON_SQUID'
                ? 'bg-cyan-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            JOSEPHSON & SQUID
          </button>
          <button
            onClick={() => onSetSuiteMode('BEC_SUPERFLUID')}
            className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
              suiteMode === 'BEC_SUPERFLUID'
                ? 'bg-cyan-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            BEC MATTER-WAVE
          </button>
          <button
            onClick={() => onSetSuiteMode('DILUTION_FRIDGE')}
            className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
              suiteMode === 'DILUTION_FRIDGE'
                ? 'bg-cyan-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ThermometerSnowflake className="w-3.5 h-3.5" />
            DILUTION FRIDGE
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center space-x-2">
        <label className="text-[11px] text-slate-400 font-mono hidden sm:inline">PRESET:</label>
        <select
          value={selectedPreset}
          onChange={(e) => onSelectPreset(e.target.value as PresetId)}
          className="bg-slate-900 border border-slate-700 text-cyan-300 text-xs rounded px-2.5 py-1 font-mono focus:outline-none focus:border-cyan-500 max-w-[200px] md:max-w-[250px]"
        >
          {CRYO_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Controls & Telemetry HUD */}
      <div className="flex items-center space-x-2">
        {/* Real-time telemetry badges */}
        <div className="hidden xl:flex items-center space-x-2 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800 font-mono text-[11px]">
          {suiteMode === 'TDGL_VORTEX' && (
            <>
              <span className="text-slate-400">|ψ|:</span>
              <span className="text-cyan-400 font-semibold">{metrics.orderParamAvg.toFixed(3)}</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Vortices:</span>
              <span className="text-cyan-400 font-semibold">{metrics.vortexCount}</span>
            </>
          )}
          {suiteMode === 'JOSEPHSON_SQUID' && (
            <>
              <span className="text-slate-400">V:</span>
              <span className="text-cyan-400 font-semibold">{metrics.junctionVoltageMilliV.toFixed(2)} mV</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">|dV/dΦ|:</span>
              <span className="text-cyan-400 font-semibold">{metrics.squidSensitivity.toFixed(2)}</span>
            </>
          )}
          {suiteMode === 'BEC_SUPERFLUID' && (
            <>
              <span className="text-slate-400">N0/N:</span>
              <span className="text-cyan-400 font-semibold">{(metrics.becCondensateFraction * 100).toFixed(0)}%</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Contrast:</span>
              <span className="text-cyan-400 font-semibold">{(metrics.becInterferenceVisibility * 100).toFixed(1)}%</span>
            </>
          )}
          {suiteMode === 'DILUTION_FRIDGE' && (
            <>
              <span className="text-slate-400">T_mc:</span>
              <span className="text-cyan-400 font-semibold">{(metrics.mixingChamberTempK * 1000).toFixed(1)} mK</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Q_cool:</span>
              <span className="text-cyan-400 font-semibold">{metrics.coolingPowerMicroW.toFixed(0)} μW</span>
            </>
          )}
          <span className="text-slate-600">|</span>
          <span className="text-slate-500">{metrics.simFps} FPS</span>
        </div>

        {/* Play/Pause */}
        <button
          onClick={onToggleRunning}
          className={`p-1.5 rounded border transition-colors ${
            isRunning
              ? 'bg-amber-950/70 border-amber-800 text-amber-300 hover:bg-amber-900'
              : 'bg-emerald-950/70 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
          }`}
          title={isRunning ? 'Pause Simulation' : 'Run Simulation'}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={onToggleMute}
          className={`p-1.5 rounded border transition-colors ${
            isMuted
              ? 'bg-slate-900 border-slate-700 text-slate-500 hover:text-white'
              : 'bg-cyan-950/70 border-cyan-800 text-cyan-300 hover:bg-cyan-900'
          }`}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Reset Simulation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Data Export */}
        <button
          onClick={onOpenExport}
          className="p-1.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 transition-colors"
          title="Export CSV / JSON Data"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
