/**
 * MARBLE-FORGE (EXP-023) — Control Deck & Tool Palette
 * Provides construction tools, material selection, simulation controls,
 * and quick spawn triggers.
 */

import React from 'react';
import { MarbleSimulationController } from '../core/MarbleSimulationController';
import { MARBLE_MATERIALS } from '../physics/MarbleMaterials';
import { ToolType, MarbleMaterial } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  PlusCircle,
  Undo2,
  Redo2,
  Trash2,
  MousePointer,
  Minus,
  Bell,
  CircleDot,
  FastForward,
} from 'lucide-react';

interface ControlDeckProps {
  controller: MarbleSimulationController;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({ controller }) => {
  const activeTool = controller.activeTool;
  const activeMat = controller.activeMaterial;
  const isPaused = controller.isPaused;
  const materials: MarbleMaterial[] = ['GLASS', 'STEEL', 'WOOD', 'RUBBER'];

  const renderToolBtn = (tool: ToolType, label: string, icon: React.ReactNode) => {
    const isSelected = activeTool === tool;
    return (
      <button
        key={tool}
        onClick={() => controller.setTool(tool)}
        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition select-none ${
          isSelected
            ? 'bg-amber-500/20 text-amber-200 border border-amber-500 shadow-sm shadow-amber-500/20'
            : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="border-t border-slate-800 bg-slate-950/95 backdrop-blur px-4 py-3 select-none flex flex-wrap items-center justify-between gap-3 z-10 text-xs">
      {/* Left: Tools & Construction */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-1">
          Tools:
        </span>
        {renderToolBtn('SELECT', 'Drop / Pointer', <MousePointer className="w-3.5 h-3.5 text-cyan-400" />)}
        {renderToolBtn('STRAIGHT_RAIL', 'Straight Rail', <Minus className="w-3.5 h-3.5 text-amber-400" />)}
        {renderToolBtn('BUMPER', 'Pinball Bumper', <CircleDot className="w-3.5 h-3.5 text-indigo-400" />)}
        {renderToolBtn('TARGET_BELL', 'Chime Bell', <Bell className="w-3.5 h-3.5 text-yellow-400" />)}
        {renderToolBtn('DELETE', 'Delete', <Trash2 className="w-3.5 h-3.5 text-rose-400" />)}

        <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* Undo / Redo */}
        <button
          onClick={() => controller.undo()}
          className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => controller.redo()}
          className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center: Marble Material Selector */}
      <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-lg border border-slate-800">
        <span className="text-[10px] text-slate-500 font-bold uppercase px-1">
          Material:
        </span>
        {materials.map((m) => {
          const def = MARBLE_MATERIALS[m];
          const isSelected = activeMat === m;
          return (
            <button
              key={m}
              onClick={() => controller.setMaterial(m)}
              title={`${def.name} • Mass: ${(def.mass * 1000).toFixed(0)}g • Restitution: ${def.restitution}`}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
                style={{ backgroundColor: def.color }}
              />
              <span>{def.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Simulation Controls */}
      <div className="flex items-center gap-2">
        {/* Spawn Marble Button */}
        <button
          onClick={() => controller.spawnMarbleAt(3.0, 1.2)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/30 font-mono text-xs font-bold transition shadow-sm"
          title="Spawn Marble Now"
        >
          <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Drop Marble</span>
        </button>

        {/* Play / Pause */}
        <button
          onClick={() => controller.togglePause()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition shadow-sm ${
            isPaused
              ? 'bg-emerald-600 hover:bg-emerald-500 text-black'
              : 'bg-amber-500/20 border border-amber-500/40 text-amber-200 hover:bg-amber-500/30'
          }`}
          title="Play / Pause (Space)"
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>

        {/* Reset */}
        <button
          onClick={() => controller.resetContraption()}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition"
          title="Reset Contraption & Marbles (R)"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
        </button>

        {/* Speed Toggles */}
        <div className="flex items-center bg-slate-900 rounded border border-slate-800 p-0.5">
          {[0.5, 1.0, 2.0].map((s) => (
            <button
              key={s}
              onClick={() => controller.setSimSpeed(s)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                controller.simSpeed === s
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
