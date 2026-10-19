import React from 'react';
import { SuiteMode, ColliderTelemetry } from '../types';
import {
  Atom,
  Layers,
  BarChart3,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Download,
  Zap,
  RotateCcw,
} from 'lucide-react';

interface HeaderProps {
  mode: SuiteMode;
  onSetMode: (mode: SuiteMode) => void;
  telemetry: ColliderTelemetry;
  isMuted: boolean;
  onToggleMute: () => void;
  autoCollide: boolean;
  onToggleAutoCollide: () => void;
  onManualCollide: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onSetMode,
  telemetry,
  isMuted,
  onToggleMute,
  autoCollide,
  onToggleAutoCollide,
  onManualCollide,
  onOpenExport,
}) => {
  return (
    <header className="h-14 bg-slate-950/90 border-b border-slate-800 px-4 flex items-center justify-between z-20 select-none">
      {/* Brand & Suite Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
          <Atom className="w-5 h-5 animate-spin" style={{ animationDuration: '12s' }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              COLLIDER-LAB
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold">
              EXP-017
            </span>
            <span className="text-[10px] font-mono text-slate-400 hidden lg:inline">
              √s = {telemetry.sqrts} TeV • Event #{telemetry.currentEventId}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 hidden md:block">
            High-Energy Particle Physics, Relativistic Quantum Scattering & Detector Studio
          </div>
        </div>
      </div>

      {/* Navigation Mode Tabs */}
      <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-lg gap-1">
        <button
          onClick={() => onSetMode('TRANSVERSE_DETECTOR')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition ${
            mode === 'TRANSVERSE_DETECTOR'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Transverse (X-Y)</span>
        </button>

        <button
          onClick={() => onSetMode('LONGITUDINAL_RZ')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition ${
            mode === 'LONGITUDINAL_RZ'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5 rotate-90" />
          <span>Longitudinal (R-Z)</span>
        </button>

        <button
          onClick={() => onSetMode('LEGO_ETA_PHI')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition ${
            mode === 'LEGO_ETA_PHI'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Lego Plot (η-φ)</span>
        </button>

        <button
          onClick={() => onSetMode('MASS_SPECTRUM')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition ${
            mode === 'MASS_SPECTRUM'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Mass Spectrum</span>
        </button>
      </div>

      {/* Action Controls & Audio */}
      <div className="flex items-center gap-2">
        <button
          onClick={onManualCollide}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-md transition active:scale-95"
          title="Trigger a single proton bunch collision"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">Collide</span>
        </button>

        <button
          onClick={onToggleAutoCollide}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
            autoCollide
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
          }`}
          title={autoCollide ? 'Pause continuous beam collisions' : 'Start continuous beam collisions'}
        >
          {autoCollide ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{autoCollide ? 'Beam Running' : 'Beam Idle'}</span>
        </button>

        <button
          onClick={onToggleMute}
          className={`p-2 rounded-lg border transition ${
            isMuted
              ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
              : 'bg-cyan-950/60 border-cyan-800 text-cyan-400 hover:bg-cyan-900/60'
          }`}
          title={isMuted ? 'Unmute procedural collider audio' : 'Mute audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenExport}
          className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          title="Export collision data and kinematics"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
