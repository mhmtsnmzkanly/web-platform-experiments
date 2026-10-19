/**
 * POCKET-TERRARIUM (EXP-024) — Professional Master Water Testing Kit Modal
 * Simulates standard analytical aquarium colorimetric tests:
 * 1. pH (Bromothymol Blue reagent)
 * 2. Ammonia NH3/TAN (Salicylate 2-part reagent)
 * 3. Nitrite NO2- (Sulfanilamide/NEDD reagent)
 * 4. Nitrate NO3- (Cadmium/Zinc reduction reagent)
 * 5. Dissolved Oxygen (Winkler Indigo Carmine method)
 */

import React, { useState, useEffect, useRef } from 'react';
import { TerrariumSimulationController } from '../core/TerrariumSimulationController';

interface WaterTestKitModalProps {
  controller: TerrariumSimulationController;
  isOpen: boolean;
  onClose: () => void;
}

export const WaterTestKitModal: React.FC<WaterTestKitModalProps> = ({
  controller,
  isOpen,
  onClose,
}) => {
  const [tested, setTested] = useState<boolean>(true);
  const testTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (testTimeoutRef.current) {
        clearTimeout(testTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const { waterParameters: w } = controller.metrics;

  // Colorimetric derivation for API Master Test Tubes
  // 1. pH Color (6.0 Yellow -> 7.4 Green/Teal -> 8.8 Royal Blue)
  const getPHColor = (ph: number) => {
    if (ph < 6.4) return '#eab308'; // Yellow
    if (ph < 7.0) return '#84cc16'; // Light green
    if (ph < 7.6) return '#10b981'; // Green-teal
    if (ph < 8.2) return '#0284c7'; // Deep sky blue
    return '#1d4ed8'; // Royal blue
  };

  // 2. Ammonia Color (0.0 Yellow -> 0.5 Green -> 4.0 Dark Olive)
  const getAmmoniaColor = (amm: number) => {
    if (amm < 0.1) return '#facc15'; // Pale yellow (safe)
    if (amm < 0.5) return '#84cc16'; // Light chartreuse (caution)
    if (amm < 1.5) return '#15803d'; // Emerald green (toxic)
    return '#14532d'; // Dark forest green (lethal)
  };

  // 3. Nitrite Color (0.0 Sky Blue -> 0.5 Magenta -> 5.0 Deep Violet)
  const getNitriteColor = (nit: number) => {
    if (nit < 0.05) return '#38bdf8'; // Crystal sky blue (safe)
    if (nit < 0.3) return '#c084fc'; // Lavender (warning)
    if (nit < 1.0) return '#d946ef'; // Magenta (toxic)
    return '#701a75'; // Deep dark violet (lethal)
  };

  // 4. Nitrate Color (0.0 Yellow -> 20.0 Orange -> 80.0 Dark Red)
  const getNitrateColor = (nit: number) => {
    if (nit < 5.0) return '#fef08a'; // Pale yellow
    if (nit < 25.0) return '#f97316'; // Orange (ideal planted)
    if (nit < 60.0) return '#dc2626'; // Red (elevated)
    return '#7f1d1d'; // Crimson dark red (excessive)
  };

  // 5. DO Color (1.0 Pale Grey -> 7.0 Royal Blue -> 12.0 Indigo)
  const getDOColor = (doVal: number) => {
    if (doVal < 2.0) return '#e2e8f0'; // Pale clear (anoxic)
    if (doVal < 4.5) return '#7dd3fc'; // Light cyan (hypoxic)
    if (doVal < 8.5) return '#0284c7'; // Rich cyan/blue (optimal)
    return '#1e1b4b'; // Deep indigo (supersaturated)
  };

  const handleTestNow = () => {
    setTested(false);
    controller.audio.playFeedingPlop(0.7);
    if (testTimeoutRef.current) {
      clearTimeout(testTimeoutRef.current);
    }
    testTimeoutRef.current = window.setTimeout(() => {
      setTested(true);
      controller.audio.playPearlingChime(0.8);
      testTimeoutRef.current = null;
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🧪</span>
            <div>
              <h2 className="text-sm font-bold text-slate-100 font-mono tracking-wide">
                MASTER AQUARIUM WATER TESTING LAB
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Analytical Colorimetric Reagent Assay & Bio-Health Diagnostics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Content: Test Tubes Rack */}
        <div className="p-6 bg-slate-950/60 flex flex-col gap-6">
          <div className="grid grid-cols-5 gap-4">
            {/* 1. pH */}
            <div className="flex flex-col items-center gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-300">pH Test</span>
              <div className="relative w-8 h-28 rounded-full border-2 border-slate-700 bg-slate-950 p-1 flex flex-col justify-end overflow-hidden shadow-inner">
                <div
                  className="w-full rounded-b-full transition-all duration-500 shadow"
                  style={{
                    height: tested ? '85%' : '10%',
                    backgroundColor: tested ? getPHColor(w.pH) : '#64748b',
                  }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-slate-100">
                {w.pH.toFixed(2)}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {w.pH >= 6.8 && w.pH <= 7.8 ? '✓ Optimal' : '⚠️ Stress'}
              </span>
            </div>

            {/* 2. Ammonia NH3 */}
            <div className="flex flex-col items-center gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-300">Ammonia</span>
              <div className="relative w-8 h-28 rounded-full border-2 border-slate-700 bg-slate-950 p-1 flex flex-col justify-end overflow-hidden shadow-inner">
                <div
                  className="w-full rounded-b-full transition-all duration-500 shadow"
                  style={{
                    height: tested ? '85%' : '10%',
                    backgroundColor: tested ? getAmmoniaColor(w.ammonia) : '#64748b',
                  }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-slate-100">
                {w.ammonia.toFixed(3)}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {w.ammonia < 0.2 ? '✓ Safe' : '⚠️ Toxic!'}
              </span>
            </div>

            {/* 3. Nitrite NO2- */}
            <div className="flex flex-col items-center gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-300">Nitrite</span>
              <div className="relative w-8 h-28 rounded-full border-2 border-slate-700 bg-slate-950 p-1 flex flex-col justify-end overflow-hidden shadow-inner">
                <div
                  className="w-full rounded-b-full transition-all duration-500 shadow"
                  style={{
                    height: tested ? '85%' : '10%',
                    backgroundColor: tested ? getNitriteColor(w.nitrite) : '#64748b',
                  }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-slate-100">
                {w.nitrite.toFixed(3)}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {w.nitrite < 0.1 ? '✓ Safe' : '⚠️ Danger'}
              </span>
            </div>

            {/* 4. Nitrate NO3- */}
            <div className="flex flex-col items-center gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-300">Nitrate</span>
              <div className="relative w-8 h-28 rounded-full border-2 border-slate-700 bg-slate-950 p-1 flex flex-col justify-end overflow-hidden shadow-inner">
                <div
                  className="w-full rounded-b-full transition-all duration-500 shadow"
                  style={{
                    height: tested ? '85%' : '10%',
                    backgroundColor: tested ? getNitrateColor(w.nitrate) : '#64748b',
                  }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-slate-100">
                {w.nitrate.toFixed(1)}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {w.nitrate < 40 ? '✓ Balanced' : '⚠️ Elevated'}
              </span>
            </div>

            {/* 5. Dissolved Oxygen */}
            <div className="flex flex-col items-center gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-300">Dissolved O₂</span>
              <div className="relative w-8 h-28 rounded-full border-2 border-slate-700 bg-slate-950 p-1 flex flex-col justify-end overflow-hidden shadow-inner">
                <div
                  className="w-full rounded-b-full transition-all duration-500 shadow"
                  style={{
                    height: tested ? '85%' : '10%',
                    backgroundColor: tested ? getDOColor(w.dissolvedOxygen) : '#64748b',
                  }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-slate-100">
                {w.dissolvedOxygen.toFixed(2)}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {w.dissolvedOxygen >= 5.0 ? '✓ Aerated' : '⚠️ Hypoxic'}
              </span>
            </div>
          </div>

          {/* Diagnostic Synthesis Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-200 font-mono flex items-center space-x-2">
              <span>🩺</span>
              <span>BIO-DIAGNOSTIC ADVISORY</span>
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {w.ammonia > 0.5
                ? 'CRITICAL ALERT: Ammonia concentration exceeds biological tolerance. Nitrifying bacteria colonies are insufficient to oxidize fish waste. Recommended: Dose Nitrosomonas bacteria culture immediately or execute 50% partial water change.'
                : w.dissolvedOxygen < 2.5
                ? 'CRITICAL ALERT: Acute hypoxia detected. Aquatic organisms are at severe risk of asphyxiation. Recommended: Engage aerator air stone bubbler and illuminate tank with LED lamp to stimulate plant photosynthesis.'
                : w.nitrate > 60.0
                ? 'ADVISORY: Nitrate levels are elevated due to accumulation of oxidized bio-waste. Recommended: Introduce additional rooted Elodea stems or perform routine 20% water change.'
                : 'BALANCED STATUS: Biogeochemical cycle is in harmonious equilibrium. Ammonia and nitrite are effectively metabolized into plant-available nitrates. Dissolved oxygen levels support thriving aquatic fauna.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950">
          <span className="text-xs font-mono text-slate-400">
            Water Volume: {w.volume.toFixed(1)} Liters • Temp: {w.temperature.toFixed(1)}°C
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleTestNow}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center space-x-1.5 shadow"
            >
              <span>💧 Re-Assay Vials</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
