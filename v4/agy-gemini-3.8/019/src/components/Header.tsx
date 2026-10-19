/**
 * Header.tsx
 * Top navigation and real-time physical telemetry bar for BAND-FORGE.
 */

import React from 'react';
import { SuiteMode, SimulationTelemetry } from '../types/index.js';

interface HeaderProps {
  suiteMode: SuiteMode;
  onSelectMode: (mode: SuiteMode) => void;
  telemetry: SimulationTelemetry;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenExport: () => void;
}

const MODES: { id: SuiteMode; label: string }[] = [
  { id: 'BAND_STRUCTURE', label: 'Band Structure' },
  { id: 'FERMI_SURFACE', label: 'Fermi Surface' },
  { id: 'TOPOLOGICAL_CHERN', label: 'Chern & Haldane' },
  { id: 'HOFSTADTER_FRACTAL', label: 'Hofstadter Butterfly' },
  { id: 'PHONON_DISPERSION', label: 'Phonon Dispersion' }
];

export const Header: React.FC<HeaderProps> = ({
  suiteMode,
  onSelectMode,
  telemetry,
  isMuted,
  onToggleMute,
  onOpenExport
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm select-none">
      {/* Title & Brand */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-500 flex items-center justify-center font-black text-white text-base shadow-lg shadow-cyan-950/40">
          BF
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-100 tracking-wider">BAND-FORGE</span>
            <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              EXP 019
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Electronic Band Structure & Topological Matter Studio
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <nav className="flex items-center bg-slate-950/70 p-1 rounded-lg border border-slate-800/80 space-x-1">
        {MODES.map((m) => {
          const active = suiteMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                active
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </nav>

      {/* Live Physical Telemetry Badges */}
      <div className="flex items-center space-x-2.5 text-xs font-mono">
        {/* Topological Badge */}
        <div
          className={`px-2 py-1 rounded border flex items-center space-x-1.5 ${
            telemetry.isTopological
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 shadow-sm shadow-emerald-950/50'
              : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              telemetry.isTopological ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
            }`}
          />
          <span className="font-semibold">
            {telemetry.isTopological
              ? suiteMode === 'TOPOLOGICAL_CHERN'
                ? `CHERN C=${telemetry.chernNumber}`
                : `TOPOLOGICAL ν=1`
              : 'TRIVIAL'}
          </span>
        </div>

        {/* Band Gap */}
        <div className="hidden sm:flex flex-col bg-slate-950/60 px-2.5 py-1 rounded border border-slate-800">
          <span className="text-[9px] text-slate-500 uppercase tracking-wider">Band Gap ΔE</span>
          <span className="font-bold text-slate-200">{telemetry.bandGap.toFixed(3)} eV</span>
        </div>

        {/* Sound Speed (in Phonon mode) or Fermi Velocity */}
        {suiteMode === 'PHONON_DISPERSION' ? (
          <div className="hidden md:flex flex-col bg-slate-950/60 px-2.5 py-1 rounded border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider">Sound Speed vs</span>
            <span className="font-bold text-cyan-400">{telemetry.soundSpeed.toFixed(2)} km/s</span>
          </div>
        ) : (
          <div className="hidden md:flex flex-col bg-slate-950/60 px-2.5 py-1 rounded border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase tracking-wider">Fermi Vel vF</span>
            <span className="font-bold text-indigo-400">{telemetry.fermiVelocity.toFixed(1)} km/s</span>
          </div>
        )}

        {/* FPS Badge */}
        <div className="flex flex-col bg-slate-950/60 px-2 py-1 rounded border border-slate-800 text-center min-w-[50px]">
          <span className="text-[9px] text-slate-500 uppercase">FPS</span>
          <span
            className={`font-bold ${
              telemetry.measuredFps >= 50
                ? 'text-emerald-400'
                : telemetry.measuredFps >= 30
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          >
            {telemetry.measuredFps}
          </span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleMute}
          className={`p-1.5 rounded-lg border transition-all ${
            !isMuted
              ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-950/40'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
          title={isMuted ? 'Unmute Sonification' : 'Mute Sonification'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {!isMuted ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            )}
          </svg>
        </button>

        {/* Data Export Button */}
        <button
          onClick={onOpenExport}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-sans font-medium transition-all"
        >
          Export
        </button>
      </div>
    </header>
  );
};
