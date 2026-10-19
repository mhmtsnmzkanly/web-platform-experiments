import React from 'react';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Zap,
  Layers,
  Radio,
  Waves,
} from 'lucide-react';
import {
  SeismicSuiteMode,
  SeismicScenarioId,
  WaveFieldDisplayMode,
  ColormapMode,
  SeismicMetrics,
  FaultConfig,
} from '../types';
import { SEISMIC_SCENARIOS } from '../seismic/FaultRuptureEngine';

interface HeaderProps {
  suiteMode: SeismicSuiteMode;
  onSelectSuiteMode: (m: SeismicSuiteMode) => void;
  scenarioId: SeismicScenarioId;
  onSelectScenario: (id: SeismicScenarioId) => void;
  displayMode: WaveFieldDisplayMode;
  onSelectDisplayMode: (dm: WaveFieldDisplayMode) => void;
  colormap: ColormapMode;
  onSelectColormap: (cm: ColormapMode) => void;
  metrics: SeismicMetrics;
  fault: FaultConfig;
  isPaused: boolean;
  onTogglePause: () => void;
  onTriggerEarthquake: () => void;
  onReset: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  suiteMode,
  onSelectSuiteMode,
  scenarioId,
  onSelectScenario,
  displayMode,
  onSelectDisplayMode,
  colormap,
  onSelectColormap,
  metrics,
  fault,
  isPaused,
  onTogglePause,
  onTriggerEarthquake,
  onReset,
  isMuted,
  onToggleMute,
  onOpenExportModal,
}) => {
  return (
    <header className="h-14 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-3 flex items-center justify-between text-xs select-none z-20">
      {/* Brand & Suite Tabs */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-orange-950 border border-orange-500/50 flex items-center justify-center text-orange-400 font-bold shadow-lg shadow-orange-950/40">
            <Activity className="w-5 h-5 text-orange-400 animate-pulse" />
          </div>
          <div>
            <div className="font-extrabold tracking-wider text-orange-400 flex items-center space-x-1.5 text-sm">
              <span>SEISMIC-LAB</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-orange-900/60 text-orange-300 font-mono">
                GEOPHYSICS
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono hidden sm:block">
              ELASTODYNAMICS & TSUNAMI HYDRODYNAMICS STUDIO
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => onSelectSuiteMode('ELASTODYNAMICS')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              suiteMode === 'ELASTODYNAMICS'
                ? 'bg-orange-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>ELASTODYNAMICS</span>
          </button>
          <button
            onClick={() => onSelectSuiteMode('SEISMOGRAMS')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              suiteMode === 'SEISMOGRAMS'
                ? 'bg-orange-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>SEISMOGRAMS</span>
          </button>
          <button
            onClick={() => onSelectSuiteMode('TSUNAMI')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              suiteMode === 'TSUNAMI'
                ? 'bg-orange-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>TSUNAMI (SWE)</span>
          </button>
          <button
            onClick={() => onSelectSuiteMode('GEOLOGY')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              suiteMode === 'GEOLOGY'
                ? 'bg-orange-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>STRATA</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector Dropdown */}
      <div className="hidden lg:flex items-center space-x-2">
        <span className="text-slate-500 font-mono text-[11px]">SCENARIO:</span>
        <select
          value={scenarioId}
          onChange={(e) => onSelectScenario(e.target.value as SeismicScenarioId)}
          className="bg-slate-900 border border-slate-700 text-orange-300 rounded px-2.5 py-1 text-xs outline-none cursor-pointer max-w-xs font-semibold"
        >
          {SEISMIC_SCENARIOS.map((sc) => (
            <option key={sc.id} value={sc.id}>
              {sc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Center Live Telemetry HUD Strip */}
      <div className="hidden xl:flex items-center space-x-3 font-mono text-[11px] text-slate-400 bg-slate-900/70 border border-slate-800/80 rounded-full px-4 py-1">
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">Mw:</span>
          <span className="text-orange-400 font-bold">{fault.momentMagnitudeMw.toFixed(1)}</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">PGA:</span>
          <span className="text-rose-400 font-bold">{metrics.maxPgaG.toFixed(3)}g</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">PGV:</span>
          <span className="text-cyan-300 font-bold">{metrics.maxPgvCmS.toFixed(1)} cm/s</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">Tsunami:</span>
          <span className="text-blue-300 font-bold">
            {metrics.tsunamiWaveHeightM > 0.05 ? `${metrics.tsunamiWaveHeightM.toFixed(1)}m` : '0.0m'}
          </span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">t:</span>
          <span className="text-emerald-400 font-bold">{metrics.simulationTimeSec.toFixed(1)}s</span>
        </div>
      </div>

      {/* Right Controls: Rupture Trigger, Display Mode, Play/Pause, Reset, Export, Audio */}
      <div className="flex items-center space-x-2">
        {/* Trigger Earthquake Button */}
        <button
          onClick={onTriggerEarthquake}
          title="Trigger Earthquake Rupture"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-900/40 cursor-pointer transition-all active:scale-95"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>RUPTURE</span>
        </button>

        {/* Display Mode Selector */}
        <div className="hidden sm:flex items-center bg-slate-900 rounded border border-slate-800 p-0.5 text-[10px] font-mono">
          <button
            onClick={() => onSelectDisplayMode('CURL_SHEAR')}
            title="S-Waves & Rayleigh Surface Wave Shear"
            className={`px-2 py-0.5 rounded cursor-pointer ${
              displayMode === 'CURL_SHEAR' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            S-WAVE (CURL)
          </button>
          <button
            onClick={() => onSelectDisplayMode('DIV_COMPRESSION')}
            title="P-Waves Compressional Dilatation"
            className={`px-2 py-0.5 rounded cursor-pointer ${
              displayMode === 'DIV_COMPRESSION' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            P-WAVE (DIV)
          </button>
          <button
            onClick={() => onSelectDisplayMode('VELOCITY_MAG')}
            title="Total Ground Velocity Magnitude"
            className={`px-2 py-0.5 rounded cursor-pointer ${
              displayMode === 'VELOCITY_MAG' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            |V| SPEED
          </button>
        </div>

        {/* Colormap Dropdown */}
        <select
          value={colormap}
          onChange={(e) => onSelectColormap(e.target.value as ColormapMode)}
          className="bg-slate-900 border border-slate-700 text-orange-300 rounded px-2 py-1 text-xs outline-none cursor-pointer hidden lg:block"
        >
          <option value="SEISMIC_BIPOLAR">Seismic Bipolar</option>
          <option value="MAGMA_THERMAL">Magma Thermal</option>
          <option value="TURBO_VELOCITY">Turbo Velocity</option>
        </select>

        {/* Play/Pause */}
        <button
          onClick={onTogglePause}
          title={isPaused ? 'Resume Simulation' : 'Pause Simulation'}
          className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-orange-400 cursor-pointer transition-colors"
        >
          {isPaused ? <Play className="w-4 h-4 text-orange-400" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Reset Bench */}
        <button
          onClick={onReset}
          title="Reset Simulation Fields"
          className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Export Modal */}
        <button
          onClick={onOpenExportModal}
          title="Export Seismic & Tsunami Data (CSV & JSON)"
          className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-orange-300 cursor-pointer transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Mute */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Seismic Audio' : 'Mute Seismic Audio'}
          className={`p-1.5 rounded border cursor-pointer transition-colors ${
            isMuted
              ? 'bg-slate-900 border-slate-800 text-slate-500'
              : 'bg-slate-900 border-slate-700 text-orange-400 hover:bg-slate-800'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
