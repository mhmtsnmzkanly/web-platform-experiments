/**
 * POWDER-BOX (EXP-022) — Sandbox Palette & Simulation Control Deck
 * Element selection categorized by state of matter, brush radius slider,
 * play/pause/step controls, and simulation speed toggles.
 */

import React from 'react';
import { PowderSimulationController } from '../core/PowderSimulationController';
import { ELEMENT_DEFINITIONS } from '../physics/ElementRegistry';
import { BrushTool, ElementType } from '../types';
import {
  Play,
  Pause,
  SkipForward,
  Trash2,
  Flame,
  Snowflake,
  Eraser,
  Zap,
} from 'lucide-react';

interface SandboxPaletteProps {
  controller: PowderSimulationController;
}

export const SandboxPalette: React.FC<SandboxPaletteProps> = ({ controller }) => {
  const activeTool = controller.activeTool;

  const powderElements: ElementType[] = ['SAND', 'GUNPOWDER'];
  const liquidElements: ElementType[] = ['WATER', 'OIL', 'ACID', 'LAVA'];
  const solidElements: ElementType[] = ['WOOD', 'STONE', 'ICE', 'PLANT', 'GLASS', 'IRON'];
  const gasElements: ElementType[] = ['FIRE', 'STEAM', 'SMOKE'];

  const renderToolButton = (tool: BrushTool, label: string, colorStyle: string, tooltip?: string) => {
    const isSelected = activeTool === tool;
    return (
      <button
        key={tool}
        onClick={() => controller.setTool(tool)}
        title={tooltip || label}
        className={`px-2.5 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition select-none ${
          isSelected
            ? 'bg-amber-500/20 text-amber-200 border border-amber-500 shadow-sm shadow-amber-500/20'
            : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-sm" style={{ backgroundColor: colorStyle }} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="border-t border-slate-800 bg-slate-950/95 backdrop-blur p-3 select-none flex flex-col md:flex-row items-center justify-between gap-3 z-10 text-xs">
      {/* Element Palette Groups */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Powders */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold uppercase px-1">Powders</span>
          {powderElements.map((el) => {
            const def = ELEMENT_DEFINITIONS[el];
            const [r, g, b] = def.color;
            const tooltip = `${def.name} • ${def.density} kg/m³ • ${def.state}`;
            return renderToolButton(el, def.name.split(' ')[0], `rgb(${r},${g},${b})`, tooltip);
          })}
        </div>

        {/* Liquids */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold uppercase px-1">Liquids</span>
          {liquidElements.map((el) => {
            const def = ELEMENT_DEFINITIONS[el];
            const [r, g, b] = def.color;
            const tooltip = `${def.name} • ${def.density} kg/m³ • ${def.state}`;
            return renderToolButton(el, def.name.split(' ')[0], `rgb(${r},${g},${b})`, tooltip);
          })}
        </div>

        {/* Solids */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold uppercase px-1">Solids</span>
          {solidElements.map((el) => {
            const def = ELEMENT_DEFINITIONS[el];
            const [r, g, b] = def.color;
            const tooltip = `${def.name} • ${def.density} kg/m³ • ${def.state}`;
            return renderToolButton(el, def.name.split(' ')[0], `rgb(${r},${g},${b})`, tooltip);
          })}
        </div>

        {/* Gases & Energy */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold uppercase px-1">Energy</span>
          {gasElements.map((el) => {
            const def = ELEMENT_DEFINITIONS[el];
            const [r, g, b] = def.color;
            const tooltip = `${def.name} • ${def.density} kg/m³ • ${def.state}`;
            return renderToolButton(el, def.name.split(' ')[0], `rgb(${r},${g},${b})`, tooltip);
          })}
        </div>

        {/* Special Tools: Eraser, Spark, Heat, Cool */}
        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => controller.setTool('ERASER')}
            title="Eraser (Clears cells)"
            className={`px-2 py-1.5 rounded font-mono font-medium flex items-center gap-1 transition ${
              activeTool === 'ERASER'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <Eraser className="w-3.5 h-3.5 text-pink-400" />
            <span>Erase</span>
          </button>

          <button
            onClick={() => controller.setTool('SPARK')}
            title="Ignition Spark"
            className={`px-2 py-1.5 rounded font-mono font-medium flex items-center gap-1 transition ${
              activeTool === 'SPARK'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>Spark</span>
          </button>

          <button
            onClick={() => controller.setTool('HEAT_BRUSH')}
            title="Thermal Heater (+45°C)"
            className={`px-2 py-1.5 rounded font-mono font-medium flex items-center gap-1 transition ${
              activeTool === 'HEAT_BRUSH'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Heat</span>
          </button>

          <button
            onClick={() => controller.setTool('COOL_BRUSH')}
            title="Thermal Cooler (-35°C)"
            className={`px-2 py-1.5 rounded font-mono font-medium flex items-center gap-1 transition ${
              activeTool === 'COOL_BRUSH'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cool</span>
          </button>
        </div>
      </div>

      {/* Right Controls: Brush Size, Speed, Simulation Step / Pause / Clear */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Brush Size Slider */}
        <div className="flex items-center gap-2 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
          <span className="text-[11px] text-slate-400 font-mono">Radius:</span>
          <input
            type="range"
            min="1"
            max="12"
            value={controller.brushRadius}
            onChange={(e) => controller.setBrushRadius(parseInt(e.target.value, 10))}
            className="w-20 accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <span className="text-[11px] font-mono text-amber-300 w-4 text-center">
            {controller.brushRadius}
          </span>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center bg-slate-900 rounded border border-slate-800 p-0.5">
          {[0.5, 1.0, 2.0].map((s) => (
            <button
              key={s}
              onClick={() => controller.setSimSpeed(s)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                controller.simSpeed === s
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Simulation Play / Pause / Step Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => controller.togglePause()}
            className={`px-3 py-1.5 rounded font-mono font-bold flex items-center gap-1.5 transition ${
              controller.isPaused
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
            }`}
          >
            {controller.isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            )}
          </button>

          {controller.isPaused && (
            <button
              onClick={() => controller.stepOnce()}
              title="Advance Single Physical Frame"
              className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => controller.clearSandbox()}
            title="Clear Sandbox"
            className="p-1.5 rounded bg-slate-900 border border-slate-800 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
