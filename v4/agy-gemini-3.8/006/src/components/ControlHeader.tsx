import React from 'react';
import { ToolMode, FluidType, SimulationMode } from '../types';
import {
  Waves,
  Droplets,
  CircleDot,
  Compass,
  Move,
  Trash2,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
} from 'lucide-react';

interface ControlHeaderProps {
  toolMode: ToolMode;
  onSelectTool: (tool: ToolMode) => void;
  fluidType: FluidType;
  onSelectFluidType: (type: FluidType) => void;
  simMode: SimulationMode;
  onSelectSimMode: (mode: SimulationMode) => void;
  onLoadPreset: (presetName: string) => void;
  onClear: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const ControlHeaderComponent: React.FC<ControlHeaderProps> = ({
  toolMode,
  onSelectTool,
  fluidType,
  onSelectFluidType,
  simMode,
  onSelectSimMode,
  onLoadPreset,
  onClear,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="w-full bg-slate-900/95 border-b border-cyan-500/30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md backdrop-blur-md">
      {/* Brand & Mode */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-950/50">
          <Waves className="w-5 h-5 text-slate-950 font-bold" />
        </div>
        <div>
          <h1 className="text-base font-bold font-mono tracking-wider text-cyan-400 leading-none">
            NEURO-FLUID STUDIO
          </h1>
          <span className="text-[11px] text-slate-400 font-mono">
            SPH Navier-Stokes &amp; Morphogenesis
          </span>
        </div>
      </div>

      {/* Simulation Mode Selector */}
      <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 font-mono text-xs">
        <button
          onClick={() => onSelectSimMode('SPH_PARTICLES')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
            simMode === 'SPH_PARTICLES'
              ? 'bg-cyan-500 text-slate-950 shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          SPH FLUID
        </button>
        <button
          onClick={() => onSelectSimMode('COUPLED_MORPHOGENESIS')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
            simMode === 'COUPLED_MORPHOGENESIS'
              ? 'bg-emerald-500 text-slate-950 shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          COUPLED MORPHOGENESIS
        </button>
      </div>

      {/* Interactive Tool Selection */}
      <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 font-mono text-xs">
        <button
          onClick={() => onSelectTool('EMIT_FLUID')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
            toolMode === 'EMIT_FLUID'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Spray Fluid Drops"
        >
          <Droplets className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">EMIT</span>
        </button>

        <button
          onClick={() => onSelectTool('STIR_FORCE')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
            toolMode === 'STIR_FORCE'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Stir Fluid"
        >
          <Move className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">STIR</span>
        </button>

        <button
          onClick={() => onSelectTool('DRAW_OBSTACLE')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
            toolMode === 'DRAW_OBSTACLE'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Draw Deflection Obstacle"
        >
          <CircleDot className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">OBSTACLE</span>
        </button>

        <button
          onClick={() => onSelectTool('PLACE_VORTEX')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
            toolMode === 'PLACE_VORTEX'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Place Vortex (Shift+Click for reverse)"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">VORTEX</span>
        </button>

        <button
          onClick={() => onSelectTool('ERASE')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
            toolMode === 'ERASE'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Erase Obstacle / Vortex"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Fluid Type Dropdown & Presets */}
      <div className="flex items-center gap-2 font-mono text-xs">
        <select
          value={fluidType}
          onChange={(e) => onSelectFluidType(e.target.value as FluidType)}
          className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-cyan-400 cursor-pointer"
        >
          <option value="WATER">Water (Cyan)</option>
          <option value="VISCOUS_OIL">Viscous Oil (Amber)</option>
          <option value="BIOLUMINESCENT">Bioluminescent (Emerald)</option>
        </select>

        {/* Presets */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              onLoadPreset(e.target.value);
            }
          }}
          defaultValue="dam-break"
          className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-cyan-400 cursor-pointer"
        >
          <option value="dam-break">Dam Break</option>
          <option value="karman-vortex">Karman Vortex</option>
          <option value="coral-morph">Turing Coral</option>
        </select>

        {/* Audio Mute Toggle */}
        <button
          onClick={onToggleMute}
          className={`p-2 rounded-lg border transition-colors ${
            !isMuted
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
              : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}
          title="Toggle Acoustic Sonification"
        >
          {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Clear All */}
        <button
          onClick={onClear}
          className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 rounded-lg transition-colors"
          title="Clear Simulation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export const ControlHeader = React.memo(ControlHeaderComponent);
