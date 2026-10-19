/**
 * ORBITAL-SLINGSHOT (EXP-025) — Top Header & Telemetry Ribbon
 */

import React from 'react';
import { OrbitalSimulationController } from '../core/OrbitalSimulationController';
import { MISSION_SCENARIOS } from '../astrodynamics/MissionScenarios';

interface HeaderProps {
  controller: OrbitalSimulationController;
  onOpenExport: () => void;
  onOpenBriefing: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  controller,
  onOpenExport,
  onOpenBriefing,
}) => {
  const m = controller.metrics;
  const currentScen = controller.currentScenario;
  const isMuted = controller.audio.getMuted();

  // Status Badge Styling
  const getStatusBadge = () => {
    switch (m.missionStatus) {
      case 'TARGET_REACHED':
        return {
          label: 'OBJECTIVE ACHIEVED',
          bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        };
      case 'CRASHED':
        return {
          label: 'SURFACE COLLISION',
          bg: 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse',
        };
      case 'LOST_TO_DEEP_SPACE':
        return {
          label: 'INTERSTELLAR ESCAPE',
          bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        };
      default:
        return {
          label: 'TRAJECTORY NOMINAL',
          bg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
        };
    }
  };

  const statusBadge = getStatusBadge();
  const fuelRatio =
    currentScen.spacecraft.totalDeltaV > 0
      ? m.remainingDeltaVKmS / currentScen.spacecraft.totalDeltaV
      : 0;

  return (
    <header className="bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 select-none z-30">
      {/* Brand & Mission Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-white font-black text-sm tracking-tighter">OS</span>
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-100 tracking-wider uppercase">
              Orbital-Slingshot
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight">
              Astrodynamics Studio
            </p>
          </div>
        </div>

        {/* Mission Carousel Dropdown */}
        <div className="relative">
          <select
            value={currentScen.id}
            onChange={(e) => {
              const selected = MISSION_SCENARIOS.find((s) => s.id === e.target.value);
              if (selected) controller.loadScenario(selected);
            }}
            className="bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors cursor-pointer"
          >
            {MISSION_SCENARIOS.map((scen, idx) => (
              <option key={scen.id} value={scen.id}>
                {idx + 1}. {scen.title}
              </option>
            ))}
          </select>
        </div>

        {/* Mission Briefing Button */}
        <button
          onClick={onOpenBriefing}
          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
          title="Mission Flight Briefing"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Briefing</span>
        </button>
      </div>

      {/* Center Live Telemetry Gauges */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Speed */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg px-2.5 py-1 text-center min-w-[76px]">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Velocity</span>
          <span className="text-xs font-bold text-cyan-300 font-mono">
            {m.currentSpeedKmS.toFixed(2)} <span className="text-[9px] font-normal text-slate-400">km/s</span>
          </span>
        </div>

        {/* Distance to Primary */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg px-2.5 py-1 text-center min-w-[88px]">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">
            {m.primaryBodyName} Dist
          </span>
          <span className="text-xs font-bold text-indigo-300 font-mono">
            {m.distanceToPrimaryKm > 1000000
              ? `${m.distanceToPrimaryAu.toFixed(3)} AU`
              : `${(m.distanceToPrimaryKm / 1000).toFixed(0)}k km`}
          </span>
        </div>

        {/* Periapsis & Apoapsis */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg px-2.5 py-1 text-center min-w-[105px]">
          <div className="flex items-center justify-between text-[10px] font-mono gap-2">
            <span className="text-emerald-400">
              Pe: {m.elements.periapsis < 1.0 ? `${(m.elements.periapsis * 149597870).toFixed(0)}km` : `${m.elements.periapsis.toFixed(2)}AU`}
            </span>
            <span className="text-amber-400">
              Ap: {m.elements.apoapsis === Infinity ? 'Esc' : `${m.elements.apoapsis.toFixed(2)}AU`}
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
            e = {m.elements.eccentricity.toFixed(3)} ({m.elements.orbitType})
          </span>
        </div>

        {/* Delta-V Fuel Reserve */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg px-2.5 py-1 min-w-[110px]">
          <div className="flex items-center justify-between text-[9px] font-mono mb-1">
            <span className="text-slate-400 uppercase tracking-wider">Delta-V</span>
            <span className={`font-bold ${fuelRatio < 0.2 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {m.remainingDeltaVKmS.toFixed(2)} km/s
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                fuelRatio < 0.2 ? 'bg-rose-500' : fuelRatio < 0.5 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, fuelRatio * 100))}%` }}
            />
          </div>
        </div>

        {/* Flight Time */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg px-2 py-1 text-center">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Mission MET</span>
          <span className="text-xs font-bold text-slate-200 font-mono">
            {m.simTimeDays < 100 ? `${m.simTimeDays.toFixed(1)}d` : `${m.simTimeYears.toFixed(2)}y`}
          </span>
        </div>

        {/* Status Badge */}
        <div className={`px-2.5 py-1 border rounded-lg text-xs font-bold font-mono tracking-wide ${statusBadge.bg}`}>
          {statusBadge.label}
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2">
        {/* Wall-Clock FPS Counter */}
        <div className="px-2 py-1 bg-slate-950/60 border border-slate-800/80 rounded-md text-[10px] font-mono text-slate-400">
          <span className="text-emerald-400 font-bold">{controller.measuredFps}</span> FPS
        </div>

        {/* Audio Mute Toggle */}
        <button
          onClick={() => controller.audio.toggleMute()}
          className={`p-1.5 rounded-lg border transition-colors ${
            isMuted
              ? 'bg-rose-950/50 border-rose-800 text-rose-400'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
          }`}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>

        {/* Telemetry Export Button */}
        <button
          onClick={onOpenExport}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
          title="Export Telemetry Ledger (JSON / CSV)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    </header>
  );
};
