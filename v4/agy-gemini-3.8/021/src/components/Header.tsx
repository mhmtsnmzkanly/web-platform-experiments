/**
 * PONTIFEX (EXP-021) — Header Component
 * Displays level title, budget progress bar, audio toggle, and telemetry export.
 */

import React from 'react';
import { BridgeLevel, BridgeMetrics } from '../types';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  ChevronLeft,
  ChevronRight,
  HardHat,
  Trophy,
  AlertTriangle,
} from 'lucide-react';

interface HeaderProps {
  currentLevel: BridgeLevel;
  levelIndex: number;
  totalLevels: number;
  metrics: BridgeMetrics;
  isMuted: boolean;
  fps: number;
  onSelectLevel: (index: number) => void;
  onResetLevel: () => void;
  onToggleMute: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLevel,
  levelIndex,
  totalLevels,
  metrics,
  isMuted,
  fps,
  onSelectLevel,
  onResetLevel,
  onToggleMute,
  onOpenExport,
}) => {
  const budgetRatio = metrics.budget > 0 ? metrics.currentCost / metrics.budget : 0;
  const isOverBudget = metrics.currentCost > metrics.budget;

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-100 select-none">
      {/* Brand & Level Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-wider font-mono text-amber-300">
                PONTIFEX
              </h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono border border-slate-700">
                EXP-021
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>{currentLevel.name}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500">{currentLevel.subtitle}</span>
            </div>
          </div>
        </div>

        {/* Level Navigation Chevrons */}
        <div className="flex items-center bg-slate-950 rounded-md border border-slate-800 p-0.5 ml-2">
          <button
            onClick={() => onSelectLevel(levelIndex - 1)}
            disabled={levelIndex === 0}
            className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800"
            title="Previous Level"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono px-2 text-slate-300">
            Level {currentLevel.id}/{totalLevels}
          </span>
          <button
            onClick={() => onSelectLevel(levelIndex + 1)}
            disabled={levelIndex === totalLevels - 1}
            className="p-1 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-800"
            title="Next Level"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Budget & Status Readouts */}
      <div className="flex items-center gap-5">
        {/* Budget Meter */}
        <div className="flex flex-col items-end min-w-[170px]">
          <div className="flex items-center justify-between w-full text-xs font-mono mb-1">
            <span className="text-slate-400">Budget:</span>
            <span
              className={`font-bold ${
                isOverBudget ? 'text-red-400' : budgetRatio > 0.8 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              ${metrics.currentCost.toLocaleString()} / ${metrics.budget.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-200 ${
                isOverBudget ? 'bg-red-500' : budgetRatio > 0.8 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, budgetRatio * 100)}%` }}
            />
          </div>
        </div>

        {/* Level Outcome Badge */}
        {metrics.status === 'CLEARED' && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-medium animate-pulse">
            <Trophy className="w-3.5 h-3.5" />
            <span>CLEARED!</span>
          </div>
        )}
        {metrics.status === 'COLLAPSED' && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>COLLAPSED</span>
          </div>
        )}

        {/* Telemetry FPS */}
        <div className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
          <span className="text-emerald-400 font-bold">{fps}</span> FPS
        </div>

        {/* Utility Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onResetLevel}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Reset Level"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors border border-slate-700"
            title="Export Bridge Telemetry"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>
    </header>
  );
};
