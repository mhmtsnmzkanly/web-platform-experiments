/**
 * MARBLE-FORGE (EXP-023) — Header Component
 * Telemetry displays: Level navigation, FPS gauge, energetic metrics,
 * bell objective status, sound toggles, and state export trigger.
 */

import React from 'react';
import { MarbleSimulationController } from '../core/MarbleSimulationController';
import { MARBLE_LEVELS } from '../physics/LevelDefinitions';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Download,
  Activity,
  Award,
  Zap,
} from 'lucide-react';

interface HeaderProps {
  controller: MarbleSimulationController;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ controller, onOpenExport }) => {
  const metrics = controller.metrics;
  const currentLvl = controller.currentLevel;
  const isMuted = controller.audio.muted;

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur px-4 flex items-center justify-between z-20 select-none">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-950/40">
          <Sparkles className="w-5 h-5 text-amber-100" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-amber-300 font-mono">
              MARBLE-FORGE
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              EXP-023
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Kinetic Mechanics, Rolling Dynamics & Rube Goldberg Studio
          </p>
        </div>
      </div>

      {/* Level Navigation Carousel */}
      <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-lg">
        <button
          onClick={() => controller.prevLevel()}
          className="text-slate-400 hover:text-amber-300 transition p-0.5"
          title="Previous Level"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex flex-col items-center px-2 min-w-[140px]">
          <span className="text-xs font-bold text-amber-300 font-mono">
            Level {currentLvl.id}: {currentLvl.name}
          </span>
          <span className="text-[10px] text-slate-400 truncate max-w-[180px]">
            {currentLvl.tagline}
          </span>
        </div>
        <button
          onClick={() => controller.nextLevel()}
          className="text-slate-400 hover:text-amber-300 transition p-0.5"
          title="Next Level"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Live Physical Telemetry & Objective Status */}
      <div className="flex items-center gap-3 text-xs font-mono">
        {/* Wall-Clock FPS */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">FPS:</span>
          <span
            className={`font-bold ${
              controller.measuredFps >= 50 ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {controller.measuredFps}
          </span>
        </div>

        {/* Active Marbles */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800">
          <span className="text-slate-400">Marbles:</span>
          <span className="text-cyan-300 font-bold" data-testid="active-marbles">
            {metrics.activeMarbles}
          </span>
        </div>

        {/* Total Mechanical Energy (Joules) */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">Energy:</span>
          <span className="text-amber-300 font-bold">{metrics.totalEnergy} J</span>
        </div>

        {/* Objective Hits Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition ${
            metrics.isObjectiveMet
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20'
              : 'bg-slate-900/80 text-slate-300 border-slate-800'
          }`}
        >
          <Award
            className={`w-3.5 h-3.5 ${
              metrics.isObjectiveMet ? 'text-emerald-400' : 'text-slate-400'
            }`}
          />
          <span>Goal:</span>
          <span className="font-bold">
            {metrics.completedBellHits} / {currentLvl.requiredHits}
          </span>
        </div>
      </div>

      {/* Right Action Controls: Audio & Export */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => controller.audio.toggleMute()}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-500 text-slate-200 text-xs font-mono transition"
          title="Export Telemetry & Contraption"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </header>
  );
};
