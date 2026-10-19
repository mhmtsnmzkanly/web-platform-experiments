import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  StepForward,
  Orbit,
  Download,
  PlusCircle,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { ScenarioPreset } from '../types';

interface HeaderProps {
  scenarios: ScenarioPreset[];
  currentScenario: ScenarioPreset;
  onSelectScenario: (scenario: ScenarioPreset) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onStepForward: () => void;
  timeScale: number;
  onSetTimeScale: (scale: number) => void;
  onResetScenario: () => void;
  energyDriftPercent: number;
  isMuted: boolean;
  onToggleMute: () => void;
  enableRelativity: boolean;
  onToggleRelativity: () => void;
  enableAtmosphericDrag: boolean;
  onToggleAtmosphericDrag: () => void;
  onOpenAddBodyModal: () => void;
  onOpenExportModal: () => void;
}

const TIME_WARP_OPTIONS = [1, 5, 25, 100, 1000, 10000, 50000];

export const Header: React.FC<HeaderProps> = ({
  scenarios,
  currentScenario,
  onSelectScenario,
  isPaused,
  onTogglePause,
  onStepForward,
  timeScale,
  onSetTimeScale,
  onResetScenario,
  energyDriftPercent,
  isMuted,
  onToggleMute,
  enableRelativity,
  onToggleRelativity,
  enableAtmosphericDrag,
  onToggleAtmosphericDrag,
  onOpenAddBodyModal,
  onOpenExportModal,
}) => {
  return (
    <header className="h-14 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 flex items-center justify-between text-xs select-none z-20">
      {/* Brand & Scenario Selector */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-sky-400 font-bold tracking-wider uppercase text-sm">
          <Orbit className="w-5 h-5 animate-spin-slow text-sky-400" />
          <span className="hidden sm:inline bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            ORBITAL-MECH
          </span>
        </div>

        <div className="relative">
          <select
            value={currentScenario.id}
            onChange={(e) => {
              const selected = scenarios.find((s) => s.id === e.target.value);
              if (selected) onSelectScenario(selected);
            }}
            className="bg-slate-800/90 border border-slate-700 hover:border-sky-500 rounded px-2.5 py-1 text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                [{s.category}] {s.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onResetScenario}
          title="Reset Simulation State"
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent hover:border-slate-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Time Controls & Integrator Telemetry */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onTogglePause}
          className={`flex items-center space-x-1 px-3 py-1 rounded font-semibold transition-colors ${
            isPaused
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20'
          }`}
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          <span>{isPaused ? 'RUN' : 'PAUSE'}</span>
        </button>

        <button
          onClick={onStepForward}
          disabled={!isPaused}
          title="Step 1 Frame Forward (when paused)"
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 border border-slate-700"
        >
          <StepForward className="w-3.5 h-3.5" />
        </button>

        {/* Warp Multipliers */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-950/80 p-0.5 rounded border border-slate-800">
          <FastForward className="w-3 h-3 text-slate-500 ml-1.5 mr-0.5" />
          {TIME_WARP_OPTIONS.map((warp) => (
            <button
              key={warp}
              onClick={() => onSetTimeScale(warp)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                timeScale === warp
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {warp >= 1000 ? `${warp / 1000}k` : warp}x
            </button>
          ))}
        </div>

        {/* Symplectic Energy Drift Indicator */}
        <div
          title="Symplectic 4th-Order Integrator Mechanical Energy Drift (ΔE / E₀)"
          className="hidden lg:flex items-center space-x-1.5 px-2 py-1 rounded bg-slate-950/80 border border-slate-800 font-mono text-[11px]"
        >
          <ShieldCheck
            className={`w-3.5 h-3.5 ${
              Math.abs(energyDriftPercent) < 0.05
                ? 'text-emerald-400'
                : Math.abs(energyDriftPercent) < 0.5
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          />
          <span className="text-slate-400">ΔE:</span>
          <span
            className={
              Math.abs(energyDriftPercent) < 0.05
                ? 'text-emerald-300'
                : Math.abs(energyDriftPercent) < 0.5
                ? 'text-amber-300'
                : 'text-rose-400'
            }
          >
            {energyDriftPercent > 0 ? '+' : ''}
            {energyDriftPercent.toFixed(4)}%
          </span>
        </div>
      </div>

      {/* Physics Toggles & Tools */}
      <div className="flex items-center space-x-2">
        {/* Relativistic Precession Toggle */}
        <button
          onClick={onToggleRelativity}
          title="1PN Post-Newtonian Relativistic Precession"
          className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors ${
            enableRelativity
              ? 'bg-indigo-900/60 border-indigo-500 text-indigo-300'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-300'
          }`}
        >
          1PN GR
        </button>

        {/* Atmospheric Drag Toggle */}
        <button
          onClick={onToggleAtmosphericDrag}
          title="Atmospheric Density Barometric Drag"
          className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors ${
            enableAtmosphericDrag
              ? 'bg-sky-900/60 border-sky-500 text-sky-300'
              : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-300'
          }`}
        >
          AERO DRAG
        </button>

        {/* Add Body */}
        <button
          onClick={onOpenAddBodyModal}
          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">SPAWN BODY</span>
        </button>

        {/* Export Data */}
        <button
          onClick={onOpenExportModal}
          title="Export Ephemeris & Telemetry (CSV / JSON / SVG)"
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Audio Sonification' : 'Mute Audio Sonification'}
          className={`p-1.5 rounded border transition-colors ${
            isMuted
              ? 'bg-slate-800 border-slate-700 text-slate-500'
              : 'bg-slate-800 border-slate-700 text-sky-400 hover:bg-slate-700'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
