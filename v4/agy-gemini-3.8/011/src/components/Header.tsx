import React from 'react';
import {
  Wind,
  Gauge,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  AlertTriangle,
  Plane,
  Flame,
  Activity,
  Layers,
} from 'lucide-react';
import { AirfoilProfile, AeroMetrics, VisualizationMode } from '../types';

interface HeaderProps {
  presets: AirfoilProfile[];
  currentProfile: AirfoilProfile;
  onSelectProfile: (p: AirfoilProfile) => void;
  metrics: AeroMetrics;
  visMode: VisualizationMode;
  onSelectVisMode: (mode: VisualizationMode) => void;
  isFlightMode: boolean;
  onToggleFlightMode: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onResetField: () => void;
  onEmitSmokePuff: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenExportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  presets,
  currentProfile,
  onSelectProfile,
  metrics,
  visMode,
  onSelectVisMode,
  isFlightMode,
  onToggleFlightMode,
  isPaused,
  onTogglePause,
  onResetField,
  onEmitSmokePuff,
  isMuted,
  onToggleMute,
  onOpenExportModal,
}) => {
  return (
    <header className="h-14 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-3 flex items-center justify-between text-xs select-none z-20">
      {/* Brand & Preset Selector */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold font-mono tracking-wider">
          <Wind className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">AERO-TUNNEL</span>
        </div>

        {/* Profile Preset Dropdown */}
        <div className="relative">
          <select
            value={currentProfile.id}
            onChange={(e) => {
              const selected = presets.find((p) => p.id === e.target.value);
              if (selected) onSelectProfile(selected);
            }}
            className="bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-300 font-semibold rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Visualizer Mode Toggles */}
        <div className="hidden lg:flex items-center space-x-1 bg-slate-900/80 p-0.5 rounded border border-slate-800">
          {(['VELOCITY', 'PRESSURE', 'VORTICITY', 'STREAMLINES'] as VisualizationMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onSelectVisMode(mode)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors ${
                visMode === mode
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Live Telemetry Indicators */}
      <div className="hidden md:flex items-center space-x-3 font-mono text-[11px]">
        {/* Reynolds Number */}
        <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
          <span className="text-slate-500">Re:</span>
          <span className="text-cyan-300 font-bold">{Math.round(metrics.reynolds)}</span>
        </div>

        {/* Lift & Drag Coefficients */}
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
          <span className="text-slate-500">C_L:</span>
          <span className={metrics.liftCoeff >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {metrics.liftCoeff.toFixed(2)}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500">C_D:</span>
          <span className="text-amber-400 font-bold">{metrics.dragCoeff.toFixed(2)}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500">L/D:</span>
          <span className="text-cyan-300 font-bold">{metrics.liftToDragRatio.toFixed(1)}</span>
        </div>

        {/* Vortex Shedding Strouhal Frequency */}
        <div className="hidden xl:flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-500">SHED:</span>
          <span className="text-slate-300">{metrics.strouhalFreq.toFixed(1)} Hz</span>
        </div>

        {/* Stall Alarm Badge */}
        {metrics.isStalled && (
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-red-950/80 border border-red-500/80 text-red-300 font-bold animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>STALL</span>
          </div>
        )}
      </div>

      {/* Action Controls & Flight Mode */}
      <div className="flex items-center space-x-2">
        {/* Flight Simulator Glider Toggle */}
        <button
          onClick={onToggleFlightMode}
          title="Toggle Glider Flight Dynamics Simulation Test"
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded font-bold transition-all border ${
            isFlightMode
              ? 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-600/30'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-300'
          }`}
        >
          <Plane className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">GLIDER TEST</span>
        </button>

        {/* Smoke Burst Injection */}
        <button
          onClick={onEmitSmokePuff}
          title="Inject Smoke Tracer Streamline Particles"
          className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 hover:border-cyan-500 transition-colors"
        >
          <Flame className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden lg:inline">SMOKE</span>
        </button>

        {/* Play / Pause */}
        <button
          onClick={onTogglePause}
          title={isPaused ? 'Resume Wind Tunnel' : 'Pause Wind Tunnel'}
          className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-cyan-400 transition-colors"
        >
          {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Reset */}
        <button
          onClick={onResetField}
          title="Reset Wind Tunnel Fluid Fields"
          className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Export Data */}
        <button
          onClick={onOpenExportModal}
          title="Export Aerodynamic Telemetry, Polar Curves & SVG"
          className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Mute */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Aerodynamic Sonification' : 'Mute Aerodynamic Sonification'}
          className={`p-1.5 rounded border transition-colors ${
            isMuted
              ? 'bg-slate-900 border-slate-800 text-slate-500'
              : 'bg-slate-900 border-slate-700 text-cyan-400 hover:bg-slate-800'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
