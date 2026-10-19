/**
 * POCKET-TERRARIUM (EXP-024) — Bottom Tool Deck & Ecosystem Interventions
 */

import React from 'react';
import { TerrariumSimulationController } from '../core/TerrariumSimulationController';
import { ToolType } from '../types/index';

interface ControlDeckProps {
  controller: TerrariumSimulationController;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({ controller }) => {
  const { activeTool, isPaused, simSpeed } = controller;
  const isBubblerOn = controller.engine.env.isBubblerActive;
  const isLampOn = controller.engine.env.lampPower > 0.1;

  const tools: Array<{ id: ToolType; label: string; icon: string; desc: string }> = [
    { id: 'OBSERVE', label: 'Observe', icon: '🔍', desc: 'Interact & ripple water' },
    { id: 'FEED', label: 'Feed Flakes', icon: '🥫', desc: 'Drop nutritious fish flakes' },
    { id: 'ADD_PLANT', label: 'Plant Stem', icon: '🌿', desc: 'Plant oxygenating Elodea' },
    { id: 'ADD_FISH', label: 'Add Guppy', icon: '🐟', desc: 'Stock adult guppy fish' },
    { id: 'ADD_SNAIL', label: 'Add Snail', icon: '🐌', desc: 'Algae-eating nerite snail' },
    { id: 'ADD_DAPHNIA', label: 'Daphnia', icon: '🦐', desc: 'Micro-crustacean zooplankton' },
    { id: 'ADD_BACTERIA', label: 'Bio-Filter', icon: '🧪', desc: 'Dose nitrifying bacteria' },
    { id: 'SCRUB_GLASS', label: 'Scrub Glass', icon: '🧽', desc: 'Clean algae biofilm' },
    { id: 'NET_FISH', label: 'Fish Net', icon: '🕸️', desc: 'Remove fish to reduce bio-load' },
  ];

  return (
    <div className="flex flex-col border-t border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 py-2.5 z-20 select-none gap-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Trophic & Environmental Tools Palette */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {tools.map((t) => {
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  controller.setTool(t.id);
                  if (t.id === 'ADD_BACTERIA') controller.doseBacteria();
                }}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition border shadow-sm ${
                  isActive
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-emerald-500/10'
                    : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-slate-100'
                }`}
                title={t.desc}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center: Rapid Biological Interventions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 20% Water Change */}
          <button
            onClick={() => controller.performWaterChange(20)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/80 transition flex items-center space-x-1 shadow"
            title="Perform routine 20% partial water change to dilute nitrates"
          >
            <span>💧</span>
            <span>20% Change</span>
          </button>

          {/* 50% Emergency Water Change */}
          <button
            onClick={() => controller.performWaterChange(50)}
            className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-sky-950/70 hover:bg-sky-900/80 text-sky-300 border border-sky-800/80 transition flex items-center space-x-1 shadow"
            title="Emergency 50% water change for acute ammonia or nitrite spike"
          >
            <span>🌊</span>
            <span>50% Reset</span>
          </button>

          {/* Aerator Bubbler Toggle */}
          <button
            onClick={() => controller.toggleBubbler()}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition flex items-center space-x-1 shadow ${
              isBubblerOn
                ? 'bg-blue-600/20 text-blue-300 border-blue-500 shadow-blue-500/10'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle air stone bubbler to boost dissolved oxygen saturation"
          >
            <span>💨</span>
            <span>Bubbler: {isBubblerOn ? 'ON' : 'OFF'}</span>
          </button>

          {/* LED Grow Light Toggle */}
          <button
            onClick={() => controller.toggleLamp()}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition flex items-center space-x-1 shadow ${
              isLampOn
                ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-amber-500/10'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle full-spectrum LED aquarium fixture"
          >
            <span>💡</span>
            <span>Lamp: {isLampOn ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Right: Simulation Engine Playback Controls */}
        <div className="flex items-center space-x-2">
          {/* Undo & Redo */}
          <div className="flex items-center space-x-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => controller.undo()}
              className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition font-mono"
              title="Undo (Ctrl+Z)"
            >
              ↶
            </button>
            <button
              onClick={() => controller.redo()}
              className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition font-mono"
              title="Redo (Ctrl+Y)"
            >
              ↷
            </button>
          </div>

          {/* Speed Presets */}
          <div className="flex items-center space-x-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            {[0.5, 1.0, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => controller.setSpeed(s)}
                className={`px-2 py-1 text-xs font-mono font-bold rounded transition ${
                  simSpeed === s
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Play / Pause Toggle */}
          <button
            onClick={() => controller.togglePause()}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1.5 shadow ${
              isPaused
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
            }`}
          >
            <span>{isPaused ? '▶ Resume' : '⏸ Pause'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
