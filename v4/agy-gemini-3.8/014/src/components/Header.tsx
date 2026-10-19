/**
 * PLASMA-LAB: Top Application Header & Live Reactor Telemetry Bar
 */

import React from 'react';
import {
  Atom,
  Flame,
  Activity,
  Layers,
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Zap,
  TrendingUp,
} from 'lucide-react';
import {
  PlasmaSuiteMode,
  PlasmaColormap,
  DiagnosticMode,
  FusionScenarioId,
  TokamakGeometry,
  TokamakMetrics,
} from '../types';
import { FUSION_SCENARIOS } from '../plasma/TokamakPresets';

interface HeaderProps {
  scenarioId: FusionScenarioId;
  onSelectScenario: (id: FusionScenarioId) => void;
  suiteMode: PlasmaSuiteMode;
  onSelectSuiteMode: (mode: PlasmaSuiteMode) => void;
  colormap: PlasmaColormap;
  onSelectColormap: (colormap: PlasmaColormap) => void;
  diagnosticMode: DiagnosticMode;
  onSelectDiagnosticMode: (diag: DiagnosticMode) => void;
  geom: TokamakGeometry;
  metrics: TokamakMetrics;
  isPaused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
  onTriggerDisruption: () => void;
  onOpenExportModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  scenarioId,
  onSelectScenario,
  suiteMode,
  onSelectSuiteMode,
  colormap,
  onSelectColormap,
  diagnosticMode,
  onSelectDiagnosticMode,
  geom,
  metrics,
  isPaused,
  onTogglePause,
  onReset,
  onTriggerDisruption,
  onOpenExportModal,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-4 py-2 bg-slate-950/95 backdrop-blur border-b border-slate-800 text-xs select-none z-20">
      {/* Brand & Suite Mode */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 shadow-md shadow-purple-900/40">
            <Atom className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-sm tracking-wider text-white">PLASMA-LAB</span>
              <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono">
                MHD / TOKAMAK
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
              MAGNETOHYDRODYNAMIC FUSION REACTOR STUDIO
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => onSelectSuiteMode('MAGNETIC_TOPOLOGY')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              suiteMode === 'MAGNETIC_TOPOLOGY'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>TOPOLOGY</span>
          </button>
          <button
            onClick={() => onSelectSuiteMode('PROFILES_SAFETY')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              suiteMode === 'PROFILES_SAFETY'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>PROFILES</span>
          </button>
          <button
            onClick={() => onSelectSuiteMode('POINCARE_MAP')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              suiteMode === 'POINCARE_MAP'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>POINCARÉ</span>
          </button>
          <button
            onClick={() => onSelectSuiteMode('THERMONUCLEAR_POWER')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              suiteMode === 'THERMONUCLEAR_POWER'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>FUSION (Q)</span>
          </button>
          <button
            onClick={() => onSelectSuiteMode('COIL_CONTROL')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              suiteMode === 'COIL_CONTROL'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>COILS</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector Dropdown */}
      <div className="hidden lg:flex items-center space-x-2">
        <span className="text-slate-500 font-mono text-[11px]">SCENARIO:</span>
        <select
          value={scenarioId}
          onChange={(e) => onSelectScenario(e.target.value as FusionScenarioId)}
          className="bg-slate-900 border border-slate-700 text-purple-300 rounded px-2.5 py-1 text-xs outline-none cursor-pointer max-w-xs font-semibold"
        >
          {FUSION_SCENARIOS.map((sc) => (
            <option key={sc.id} value={sc.id}>
              {sc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Center Live Telemetry HUD Strip */}
      <div className="hidden xl:flex items-center space-x-3 font-mono text-[11px] text-slate-400 bg-slate-900/70 border border-slate-800/80 rounded-full px-4 py-1">
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">Ip:</span>
          <span className="text-purple-300 font-bold">{geom.plasmaCurrentIp.toFixed(1)}MA</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">Te:</span>
          <span className="text-orange-400 font-bold">{metrics.centralTeKev.toFixed(1)}keV</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">βN:</span>
          <span className={metrics.troyonBetaN > 3.0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
            {metrics.troyonBetaN.toFixed(2)}
          </span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">q95:</span>
          <span className="text-cyan-300 font-bold">{metrics.q95.toFixed(2)}</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">Pfus:</span>
          <span className="text-rose-400 font-bold">{metrics.fusionPowerMw.toFixed(0)}MW</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">Q:</span>
          <span className="text-emerald-400 font-bold">{metrics.qFactor.toFixed(2)}</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">t:</span>
          <span className="text-slate-300 font-bold">{metrics.simTimeSec.toFixed(1)}s</span>
        </div>
      </div>

      {/* Right Controls: Disruption Trigger, Diagnostic, Colormap, Play/Pause, Reset, Export, Audio */}
      <div className="flex items-center space-x-2">
        {/* Trigger Disruption Button */}
        <button
          onClick={onTriggerDisruption}
          title="Induce Thermal Quench Disruption"
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-900/40 cursor-pointer transition-all active:scale-95"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>DISRUPT</span>
        </button>

        {/* Diagnostic Mode Selector */}
        <div className="hidden sm:flex items-center bg-slate-900 rounded border border-slate-800 p-0.5 text-[10px] font-mono">
          <button
            onClick={() => onSelectDiagnosticMode('ELECTRON_TEMP')}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              diagnosticMode === 'ELECTRON_TEMP' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Te TEMP
          </button>
          <button
            onClick={() => onSelectDiagnosticMode('FLUX_PSI')}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              diagnosticMode === 'FLUX_PSI' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            ψ FLUX
          </button>
          <button
            onClick={() => onSelectDiagnosticMode('CURRENT_DENSITY')}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              diagnosticMode === 'CURRENT_DENSITY' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Jφ CURRENT
          </button>
          <button
            onClick={() => onSelectDiagnosticMode('POINCARE_POINTS')}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              diagnosticMode === 'POINCARE_POINTS' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            POINCARÉ
          </button>
        </div>

        {/* Colormap Dropdown */}
        <select
          value={colormap}
          onChange={(e) => onSelectColormap(e.target.value as PlasmaColormap)}
          className="bg-slate-900 border border-slate-700 text-purple-300 rounded px-2 py-1 text-xs outline-none cursor-pointer hidden lg:block"
        >
          <option value="THERMAL_FIRE">Thermal Fire</option>
          <option value="MAGNETIC_FLUX">Magnetic Flux</option>
          <option value="PLASMA_NEON">Plasma Neon</option>
          <option value="MHD_VORTICITY">MHD Vorticity</option>
        </select>

        {/* Play/Pause */}
        <button
          onClick={onTogglePause}
          title={isPaused ? 'Resume Fusion Simulation' : 'Pause Fusion Simulation'}
          className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-purple-400 cursor-pointer transition-colors"
        >
          {isPaused ? <Play className="w-4 h-4 text-purple-400" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Reset Reactor */}
        <button
          onClick={onReset}
          title="Reset Plasma State"
          className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Export Modal */}
        <button
          onClick={onOpenExportModal}
          title="Export Tokamak Telemetry & Profiles (CSV & JSON)"
          className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-purple-300 cursor-pointer transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Mute */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Plasma Audio' : 'Mute Plasma Audio'}
          className={`p-1.5 rounded border cursor-pointer transition-colors ${
            isMuted
              ? 'bg-slate-900 border-slate-800 text-slate-500'
              : 'bg-slate-900 border-slate-700 text-purple-400 hover:bg-slate-800'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
