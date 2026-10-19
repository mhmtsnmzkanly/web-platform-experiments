/**
 * POCKET-TERRARIUM (EXP-024) — Header & Real-Time Biogeochemical Telemetry Bar
 */

import React from 'react';
import { TerrariumSimulationController } from '../core/TerrariumSimulationController';
import { SCENARIO_PRESETS } from '../ecology/ScenarioDefinitions';

interface HeaderProps {
  controller: TerrariumSimulationController;
  onOpenTestKit: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  controller,
  onOpenTestKit,
  onOpenExport,
}) => {
  const { metrics, currentScenario } = controller;
  const { waterParameters: w, environment: env } = metrics;

  const currentIdx = SCENARIO_PRESETS.findIndex((s) => s.id === currentScenario.id);

  const handlePrevScenario = () => {
    const nextIdx = (currentIdx - 1 + SCENARIO_PRESETS.length) % SCENARIO_PRESETS.length;
    controller.loadScenario(SCENARIO_PRESETS[nextIdx]);
  };

  const handleNextScenario = () => {
    const nextIdx = (currentIdx + 1) % SCENARIO_PRESETS.length;
    controller.loadScenario(SCENARIO_PRESETS[nextIdx]);
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // Status color helpers
  const getDoColor = (doVal: number) => {
    if (doVal < 2.5) return 'text-red-400 bg-red-950/60 border-red-800 animate-pulse';
    if (doVal < 5.0) return 'text-amber-400 bg-amber-950/50 border-amber-800';
    return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/60';
  };

  const getAmmColor = (amm: number) => {
    if (amm > 0.5) return 'text-red-400 bg-red-950/60 border-red-800 animate-pulse';
    if (amm > 0.15) return 'text-amber-400 bg-amber-950/50 border-amber-800';
    return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60';
  };

  const getWqiColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500 bg-emerald-950/40';
    if (score >= 50) return 'text-amber-400 border-amber-500 bg-amber-950/40';
    return 'text-red-400 border-red-500 bg-red-950/40';
  };

  return (
    <header className="flex flex-col border-b border-slate-800 bg-slate-950/95 backdrop-blur-md z-20 select-none">
      {/* Top Banner: Scenario Carousel, Title & Action Triggers */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-b border-slate-900">
        {/* Left: Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold shadow-sm shadow-emerald-500/10">
            🌱
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold tracking-wider text-slate-100 font-mono">
                POCKET-TERRARIUM
              </h1>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-mono">
                EXP-024
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
              Aquatic Ecology, Nitrogen Cycle & Vivarium Studio
            </p>
          </div>
        </div>

        {/* Center: Scenario Preset Carousel */}
        <div className="flex items-center space-x-2 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800 shadow-inner">
          <button
            onClick={handlePrevScenario}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition"
            title="Previous Scenario"
          >
            ◀
          </button>
          <div className="text-center min-w-[210px]">
            <div className="text-xs font-bold text-slate-200 tracking-wide font-mono">
              {currentScenario.name}
            </div>
            <div className="text-[10px] text-emerald-400/90 font-mono truncate max-w-[220px]">
              {currentScenario.tagline}
            </div>
          </div>
          <button
            onClick={handleNextScenario}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition"
            title="Next Scenario"
          >
            ▶
          </button>
        </div>

        {/* Right: Quick Tools & Telemetry */}
        <div className="flex items-center space-x-2">
          {/* Water Quality Index Circular Badge */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border font-mono text-xs font-bold ${getWqiColor(
              metrics.waterQualityIndex
            )}`}
          >
            <span className="text-[10px] text-slate-400 uppercase">WQI</span>
            <span>{metrics.waterQualityIndex}%</span>
          </div>

          {/* Test Kit Modal Button */}
          <button
            onClick={onOpenTestKit}
            className="px-2.5 py-1 text-xs font-mono font-bold bg-sky-950/70 hover:bg-sky-900/70 text-sky-300 border border-sky-800/80 rounded transition flex items-center space-x-1.5 shadow"
          >
            <span>🧪</span>
            <span>Test Kit</span>
          </button>

          {/* Export Telemetry Button */}
          <button
            onClick={onOpenExport}
            className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded transition flex items-center space-x-1 shadow"
          >
            <span>📊</span>
            <span>Export</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={() => controller.audio.toggleMute()}
            className={`p-1.5 text-xs rounded border transition ${
              controller.audio.muted
                ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-slate-700'
            }`}
            title="Toggle Web Audio"
          >
            {controller.audio.muted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* Warnings Bar (if biological toxicity active) */}
      {metrics.warnings.length > 0 && (
        <div className="bg-red-950/90 border-b border-red-800 px-4 py-1 flex items-center justify-between text-xs font-mono text-red-200 animate-pulse">
          <div className="flex items-center space-x-2">
            <span>⚠️</span>
            <span className="font-bold">{metrics.warnings.join(' • ')}</span>
          </div>
          <span className="text-[10px] text-red-300 hidden md:inline">
            Action: Dose nitrifying bacteria, aerate, or perform 50% water change!
          </span>
        </div>
      )}

      {/* Bottom Sub-Bar: Continuous Real-Time Water Chemistry Gauges */}
      <div className="flex items-center justify-between overflow-x-auto px-4 py-1.5 text-xs font-mono bg-slate-950/70 gap-3 text-slate-300">
        <div className="flex items-center gap-2 flex-wrap">
          {/* DO */}
          <div className={`px-2 py-0.5 rounded border text-[11px] ${getDoColor(w.dissolvedOxygen)}`}>
            <span className="text-slate-400">DO:</span>{' '}
            <span className="font-bold">{w.dissolvedOxygen.toFixed(2)}</span> mg/L
          </div>

          {/* NH3 Ammonia */}
          <div className={`px-2 py-0.5 rounded border text-[11px] ${getAmmColor(w.ammonia)}`}>
            <span className="text-slate-400">NH₃:</span>{' '}
            <span className="font-bold">{w.ammonia.toFixed(3)}</span> mg/L
          </div>

          {/* NO2- Nitrite */}
          <div
            className={`px-2 py-0.5 rounded border text-[11px] ${
              w.nitrite > 0.75
                ? 'text-red-400 bg-red-950/60 border-red-800 animate-pulse'
                : 'text-amber-400/90 bg-slate-900 border-slate-800'
            }`}
          >
            <span className="text-slate-400">NO₂⁻:</span>{' '}
            <span className="font-bold">{w.nitrite.toFixed(3)}</span> mg/L
          </div>

          {/* NO3- Nitrate */}
          <div className="px-2 py-0.5 rounded border text-[11px] text-purple-300 bg-slate-900 border-slate-800">
            <span className="text-slate-400">NO₃⁻:</span>{' '}
            <span className="font-bold">{w.nitrate.toFixed(1)}</span> mg/L
          </div>

          {/* pH */}
          <div className="px-2 py-0.5 rounded border text-[11px] text-teal-300 bg-slate-900 border-slate-800">
            <span className="text-slate-400">pH:</span>{' '}
            <span className="font-bold">{w.pH.toFixed(2)}</span>
          </div>

          {/* Temp */}
          <div className="px-2 py-0.5 rounded border text-[11px] text-amber-300 bg-slate-900 border-slate-800">
            <span className="text-slate-400">Temp:</span>{' '}
            <span className="font-bold">{w.temperature.toFixed(1)}</span>°C
          </div>
        </div>

        {/* Right Info: Organisms, Diurnal Clock & FPS */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 whitespace-nowrap">
          <span>
            🐟 <strong className="text-slate-200">{metrics.fishCount}</strong>
            {metrics.fryCount > 0 && <span className="text-sky-400"> (+{metrics.fryCount} fry)</span>}
          </span>
          <span>
            🐌 <strong className="text-slate-200">{metrics.snailCount}</strong>
          </span>
          <span>
            🌿 <strong className="text-slate-200">{metrics.plantCount}</strong>
          </span>
          <span>
            🦐 <strong className="text-slate-200">{metrics.daphniaCount}</strong>
          </span>
          <span className="text-amber-400">
            🕒 {formatTime(env.dayTimeHours)} {env.naturalLight > 0.1 ? '☀️' : '🌙'}
          </span>
          <span className="text-slate-500">{metrics.measuredFps} FPS</span>
        </div>
      </div>
    </header>
  );
};
