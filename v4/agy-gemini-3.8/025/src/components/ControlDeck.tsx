/**
 * ORBITAL-SLINGSHOT (EXP-025) — Lower Flight Deck & Maneuver Planner
 */

import React from 'react';
import { OrbitalSimulationController } from '../core/OrbitalSimulationController';

interface ControlDeckProps {
  controller: OrbitalSimulationController;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({ controller }) => {
  const isPaused = controller.isPaused;
  const timeWarp = controller.timeWarp;
  const node = controller.engine.maneuverNode;
  const m = controller.metrics;

  const warpOptions = [0.25, 0.5, 1, 5, 25, 100, 500];

  return (
    <div className="bg-slate-900/95 border-t border-slate-800 backdrop-blur-md px-4 py-3 select-none z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Playback Controls & Time Warp */}
        <div className="flex items-center gap-3">
          {/* Play / Pause */}
          <button
            onClick={() => controller.togglePause()}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all ${
              isPaused
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
            }`}
          >
            {isPaused ? (
              <>
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Resume</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                <span>Pause</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={() => controller.stepForward(0.002)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg transition-colors text-xs font-mono"
            title="Advance 1 Step (Space / Step)"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
            </svg>
          </button>

          {/* Reset Current Mission */}
          <button
            onClick={() => controller.resetCurrentScenario()}
            className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-700/50 rounded-lg transition-colors text-xs font-mono"
            title="Reset Mission to Launch Configuration"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Time Warp Bar */}
          <div className="flex items-center gap-1 bg-slate-950/70 border border-slate-800 rounded-xl p-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 px-1.5">Warp:</span>
            {warpOptions.map((w) => (
              <button
                key={w}
                onClick={() => controller.setTimeWarp(w)}
                className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  timeWarp === w
                    ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {w}×
              </button>
            ))}
          </div>
        </div>

        {/* Maneuver Flight Deck Planner */}
        <div className="flex items-center gap-3 flex-wrap">
          {node && !node.isExecuted ? (
            <div className="flex items-center gap-3 bg-slate-950/80 border border-amber-500/40 rounded-xl px-3 py-1.5 shadow-lg shadow-amber-500/10">
              <span className="text-xs font-bold text-amber-300 font-mono tracking-tight flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Maneuver Node
              </span>

              {/* Prograde / Retrograde deltaV */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-mono">Prograde:</span>
                <button
                  onClick={() => controller.adjustManeuverPrograde(-0.5)}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-xs font-mono"
                  title="-0.5 km/s"
                >
                  -0.5
                </button>
                <span className="text-xs font-mono font-bold text-amber-300 min-w-[50px] text-center">
                  {node.progradeDeltaV > 0 ? `+${node.progradeDeltaV.toFixed(2)}` : node.progradeDeltaV.toFixed(2)}
                </span>
                <button
                  onClick={() => controller.adjustManeuverPrograde(+0.5)}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-xs font-mono"
                  title="+0.5 km/s"
                >
                  +0.5
                </button>
              </div>

              {/* Radial DeltaV */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-mono">Radial:</span>
                <button
                  onClick={() => controller.adjustManeuverRadial(-0.2)}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded text-xs font-mono"
                  title="-0.2 km/s"
                >
                  -
                </button>
                <span className="text-xs font-mono font-bold text-purple-300 min-w-[40px] text-center">
                  {node.radialDeltaV > 0 ? `+${node.radialDeltaV.toFixed(2)}` : node.radialDeltaV.toFixed(2)}
                </span>
                <button
                  onClick={() => controller.adjustManeuverRadial(+0.2)}
                  className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded text-xs font-mono"
                  title="+0.2 km/s"
                >
                  +
                </button>
              </div>

              {/* Fire Burn Now Button */}
              <button
                onClick={() => controller.executeManeuverNow()}
                className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs rounded-lg shadow-md shadow-orange-500/30 transition-all flex items-center gap-1"
              >
                <span>Fire Burn</span>
              </button>

              {/* Cancel Node */}
              <button
                onClick={() => controller.clearManeuverNode()}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded transition-colors text-xs"
                title="Discard Maneuver Node"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Plan Maneuver Node Button */}
              <button
                onClick={() => controller.setManeuverNode(1.0, 0, 0.04)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 rounded-xl text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Plot Maneuver Node</span>
              </button>

              {/* Instant Quick Burns */}
              <button
                onClick={() => controller.applyManualBurn(0.2, 0)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-mono text-amber-300 transition-colors"
                title="Instant +0.2 km/s Prograde Burn"
              >
                +0.2 km/s Pro
              </button>
              <button
                onClick={() => controller.applyManualBurn(-0.2, 0)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-mono text-cyan-300 transition-colors"
                title="Instant -0.2 km/s Retrograde Burn"
              >
                -0.2 km/s Retro
              </button>
            </div>
          )}
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => controller.undo()}
            disabled={!controller.canUndo()}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono transition-colors"
            title="Undo (Ctrl+Z)"
          >
            ↩
          </button>
          <button
            onClick={() => controller.redo()}
            disabled={!controller.canRedo()}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono transition-colors"
            title="Redo (Ctrl+Y)"
          >
            ↪
          </button>
        </div>
      </div>
    </div>
  );
};
