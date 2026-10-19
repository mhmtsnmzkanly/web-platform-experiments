import React from 'react';
import {
  Sun,
  Eye,
  Sliders,
  Layers,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Activity,
  Maximize2,
  FileSpreadsheet,
} from 'lucide-react';
import {
  OpticsSuiteMode,
  ColormapMode,
  VisualizerDisplayMode,
  OpticsMetrics,
  OpticalSourceConfig,
} from '../types';

interface HeaderProps {
  suiteMode: OpticsSuiteMode;
  onSelectSuiteMode: (mode: OpticsSuiteMode) => void;
  colormap: ColormapMode;
  onSelectColormap: (cm: ColormapMode) => void;
  displayMode: VisualizerDisplayMode;
  onSelectDisplayMode: (dm: VisualizerDisplayMode) => void;
  source: OpticalSourceConfig;
  metrics: OpticsMetrics;
  isPaused: boolean;
  onTogglePause: () => void;
  onResetBench: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  suiteMode,
  onSelectSuiteMode,
  colormap,
  onSelectColormap,
  displayMode,
  onSelectDisplayMode,
  source,
  metrics,
  isPaused,
  onTogglePause,
  onResetBench,
  isMuted,
  onToggleMute,
  onOpenExportModal,
}) => {
  return (
    <header className="h-14 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-3 flex items-center justify-between text-xs select-none z-20">
      {/* Brand & Suite Tabs */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold shadow-lg shadow-emerald-950/40">
            <Sun className="w-5 h-5 text-emerald-400 animate-spin-slow" />
          </div>
          <div>
            <div className="font-extrabold tracking-wider text-emerald-400 flex items-center space-x-1.5 text-sm">
              <span>OPTICA-FORGE</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-900/60 text-emerald-300 font-mono">
                WAVE LAB
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono hidden sm:block">
              PHYSICAL WAVE OPTICS & INTERFEROMETRY STUDIO
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => onSelectSuiteMode('DIFFRACTION')}
            className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              suiteMode === 'DIFFRACTION'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DIFFRACTION
          </button>
          <button
            onClick={() => onSelectSuiteMode('INTERFEROMETRY')}
            className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              suiteMode === 'INTERFEROMETRY'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            INTERFEROMETRY
          </button>
          <button
            onClick={() => onSelectSuiteMode('THIN_FILM')}
            className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              suiteMode === 'THIN_FILM'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            THIN-FILM (TMM)
          </button>
          <button
            onClick={() => onSelectSuiteMode('HOLOGRAPHY')}
            className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
              suiteMode === 'HOLOGRAPHY'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            HOLOGRAPHY
          </button>
        </div>
      </div>

      {/* Center Live Telemetry HUD Strip */}
      <div className="hidden xl:flex items-center space-x-3 font-mono text-[11px] text-slate-400 bg-slate-900/70 border border-slate-800/80 rounded-full px-4 py-1">
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">λ:</span>
          <span className="text-emerald-300 font-bold">{source.wavelengthNm} nm</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">Peak:</span>
          <span className="text-cyan-300 font-bold">{metrics.peakIntensity.toFixed(2)}</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">Visibility (V):</span>
          <span className="text-amber-300 font-bold">{(metrics.fringeVisibility * 100).toFixed(0)}%</span>
        </div>
        <span className="text-slate-700">|</span>
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500">Δφ:</span>
          <span className="text-purple-300 font-bold">{metrics.phaseShiftDeg.toFixed(1)}°</span>
        </div>
      </div>

      {/* Right Controls: Colormap, Display Mode & Audio */}
      <div className="flex items-center space-x-2">
        {/* Display Mode Selector */}
        <div className="flex items-center bg-slate-900 rounded border border-slate-800 p-0.5 text-[10px] font-mono">
          <button
            onClick={() => onSelectDisplayMode('INTENSITY')}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              displayMode === 'INTENSITY' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            INTENSITY
          </button>
          <button
            onClick={() => onSelectDisplayMode('PHASE')}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              displayMode === 'PHASE' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            PHASE
          </button>
          <button
            onClick={() => onSelectDisplayMode('REAL_FIELD')}
            className={`px-2 py-0.5 rounded cursor-pointer hidden sm:inline ${
              displayMode === 'REAL_FIELD' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            WAVEFRONT
          </button>
        </div>

        {/* Colormap Dropdown */}
        <select
          value={colormap}
          onChange={(e) => onSelectColormap(e.target.value as ColormapMode)}
          className="bg-slate-900 border border-slate-700 text-emerald-300 rounded px-2 py-1 text-xs outline-none cursor-pointer hidden lg:block"
        >
          <option value="LASER_GREEN">Laser Green (532nm)</option>
          <option value="CYAN_NEON">Cyan Neon (488nm)</option>
          <option value="SOLAR_AMBER">Solar Amber (589nm)</option>
          <option value="SPECTRUM_RGB">Spectrum RGB</option>
        </select>

        {/* Play/Pause */}
        <button
          onClick={onTogglePause}
          title={isPaused ? 'Resume Wave Simulation' : 'Pause Wave Simulation'}
          className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-emerald-400 cursor-pointer transition-colors"
        >
          {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Reset Bench */}
        <button
          onClick={onResetBench}
          title="Reset Optical Bench"
          className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Export Modal */}
        <button
          onClick={onOpenExportModal}
          title="Export Optical Telemetry (CSV & JSON)"
          className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 cursor-pointer transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Mute */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Optical Sonification' : 'Mute Optical Sonification'}
          className={`p-1.5 rounded border cursor-pointer transition-colors ${
            isMuted
              ? 'bg-slate-900 border-slate-800 text-slate-500'
              : 'bg-slate-900 border-slate-700 text-emerald-400 hover:bg-slate-800'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
