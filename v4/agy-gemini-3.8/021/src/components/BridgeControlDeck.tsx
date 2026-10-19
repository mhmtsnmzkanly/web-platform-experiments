/**
 * PONTIFEX (EXP-021) — Bridge Control Deck & Material Palette
 * Tool selection, simulation controls, speed multipliers, undo/redo, and stress telemetry.
 */

import React from 'react';
import { MaterialType, BridgeMetrics } from '../types';
import { BuildTool } from '../core/BridgeSimulationController';
import { MATERIAL_PROPERTIES } from '../physics/MaterialConstants';
import {
  Play,
  RotateCcw,
  Grid,
  Undo2,
  Redo2,
  Trash2,
  MousePointer,
  Eraser,
  Flame,
} from 'lucide-react';

interface BridgeControlDeckProps {
  mode: 'BUILD' | 'TEST';
  activeTool: BuildTool;
  isGridSnapping: boolean;
  simSpeed: number;
  allowedMaterials: MaterialType[];
  metrics: BridgeMetrics;
  onStartSimulation: () => void;
  onStopSimulation: () => void;
  onSetTool: (tool: BuildTool) => void;
  onToggleGrid: () => void;
  onSetSpeed: (speed: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearBridge: () => void;
}

export const BridgeControlDeck: React.FC<BridgeControlDeckProps> = ({
  mode,
  activeTool,
  isGridSnapping,
  simSpeed,
  allowedMaterials,
  metrics,
  onStartSimulation,
  onStopSimulation,
  onSetTool,
  onToggleGrid,
  onSetSpeed,
  onUndo,
  onRedo,
  onClearBridge,
}) => {
  const materials: MaterialType[] = ['ROAD', 'WOOD', 'STEEL', 'CABLE', 'HYDRAULIC'];
  const stressPercent = Math.min(100, Math.round(metrics.maxStress * 100));

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-t border-slate-800 select-none">
      {/* 1. Main Simulation Action Button & Speeds */}
      <div className="flex items-center gap-3">
        {mode === 'BUILD' ? (
          <button
            onClick={onStartSimulation}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide rounded-lg shadow-lg shadow-emerald-950 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>TEST BRIDGE</span>
          </button>
        ) : (
          <button
            onClick={onStopSimulation}
            className="flex items-center gap-2 px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs tracking-wide rounded-lg shadow-lg shadow-sky-950 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>EDIT BRIDGE</span>
          </button>
        )}

        {/* Speed Controls (Available during simulation) */}
        {mode === 'TEST' && (
          <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
            {[0.5, 1.0, 2.0].map((speed) => (
              <button
                key={speed}
                onClick={() => onSetSpeed(speed)}
                className={`px-2 py-1 text-[11px] font-mono rounded transition-all ${
                  simSpeed === speed
                    ? 'bg-slate-800 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Material Palette (Only active during BUILD mode) */}
      <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
        {materials.map((mat) => {
          const props = MATERIAL_PROPERTIES[mat];
          const isAllowed = allowedMaterials.includes(mat);
          const isSelected = activeTool === mat;

          return (
            <button
              key={mat}
              onClick={() => onSetTool(mat)}
              disabled={mode === 'TEST' || !isAllowed}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                isSelected
                  ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                  : isAllowed
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  : 'opacity-30 cursor-not-allowed text-slate-600'
              }`}
              title={isAllowed ? `${props.name}: $${props.costPerMeter}/m` : 'Not available in this level'}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: props.color }}
              />
              <span className="font-medium">{props.name}</span>
              <span className="text-[10px] text-slate-500">${props.costPerMeter}/m</span>
            </button>
          );
        })}

        <div className="h-5 w-[1px] bg-slate-800 mx-1" />

        {/* Select & Eraser Tools */}
        <button
          onClick={() => onSetTool('SELECT')}
          disabled={mode === 'TEST'}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-all ${
            activeTool === 'SELECT' ? 'bg-slate-800 text-cyan-300 border border-slate-600' : 'hover:bg-slate-900'
          }`}
          title="Select / Move Joint"
        >
          <MousePointer className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSetTool('DELETE')}
          disabled={mode === 'TEST'}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-all ${
            activeTool === 'DELETE' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'hover:bg-slate-900'
          }`}
          title="Delete Beam / Joint"
        >
          <Eraser className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Utility Tools: Snap, Undo, Redo, Clear, Stress Bar */}
      <div className="flex items-center gap-3">
        {/* Live Peak Stress Gauge */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 min-w-[150px]">
          <Flame className={`w-3.5 h-3.5 ${stressPercent > 80 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
          <div className="flex flex-col flex-1">
            <div className="flex justify-between text-[10px] font-mono mb-0.5">
              <span className="text-slate-400">Stress:</span>
              <span
                className={`font-bold ${
                  stressPercent >= 100
                    ? 'text-red-500'
                    : stressPercent > 80
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {stressPercent}%
              </span>
            </div>
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-150 ${
                  stressPercent >= 100
                    ? 'bg-red-500'
                    : stressPercent > 80
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${stressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Grid Snapping Toggle */}
        <button
          onClick={onToggleGrid}
          disabled={mode === 'TEST'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
            isGridSnapping
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}
          title="Toggle 0.5m Grid Snapping"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Grid</span>
        </button>

        {/* History & Clear */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={onUndo}
            disabled={mode === 'TEST'}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={mode === 'TEST'}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClearBridge}
            disabled={mode === 'TEST'}
            className="p-1.5 rounded text-red-400 hover:text-red-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-red-500/20 ml-1"
            title="Clear Entire Bridge"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
