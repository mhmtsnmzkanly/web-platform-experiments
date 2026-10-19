import React from 'react';
import { Flame, ShieldAlert, Zap, Orbit, RefreshCw, Activity } from 'lucide-react';
import { StellarSimulationState } from '../core/SimulationController.js';
import { StellarTelemetry } from '../types/index.js';

interface StellarControlDeckProps {
  simState: StellarSimulationState;
  telemetry: StellarTelemetry;
  onUpdateParameters: (params: {
    massSolar?: number;
    polytropicIndexN?: number;
    centralDensityKgM3?: number;
    centralTemperatureK?: number;
    X?: number;
    Y?: number;
    Z?: number;
    equationOfState?: 'IDEAL_GAS' | 'DEGENERATE_NON_REL' | 'DEGENERATE_REL' | 'TOV_NUCLEAR';
  }) => void;
  onTriggerSupernova: () => void;
  onResetSupernova: () => void;
}

export const StellarControlDeck: React.FC<StellarControlDeckProps> = ({
  simState,
  telemetry,
  onUpdateParameters,
  onTriggerSupernova,
  onResetSupernova,
}) => {
  const logRhoC = Math.log10(Math.max(1, simState.centralDensityKgM3));
  const sn = simState.supernovaState;

  return (
    <div className="w-full bg-slate-900 border-t border-slate-800 p-3 select-none flex flex-col md:flex-row gap-4">
      {/* Primary Astrophysical Sliders */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Mass Slider */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Stellar Mass</span>
            <span className="text-amber-400 font-mono font-bold">{simState.massSolar.toFixed(2)} M☉</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="40.0"
            step="0.05"
            value={simState.massSolar}
            onChange={(e) => onUpdateParameters({ massSolar: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>0.10 M☉</span>
            <span>40.0 M☉</span>
          </div>
        </div>

        {/* Polytropic Index n */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Polytrope Index n</span>
            <span className="text-sky-400 font-mono font-bold">{simState.polytropicIndexN.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="4.5"
            step="0.05"
            value={simState.polytropicIndexN}
            onChange={(e) => onUpdateParameters({ polytropicIndexN: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>n=1.5 (Conv/WD)</span>
            <span>n=3.0 (Rad/UR)</span>
          </div>
        </div>

        {/* Central Density log(rho_c) */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Central Density</span>
            <span className="text-emerald-400 font-mono font-bold">10^{logRhoC.toFixed(1)} kg/m³</span>
          </div>
          <input
            type="range"
            min="2.0"
            max="18.5"
            step="0.1"
            value={logRhoC}
            onChange={(e) => onUpdateParameters({ centralDensityKgM3: Math.pow(10, parseFloat(e.target.value)) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>10² (Giant)</span>
            <span>10¹⁸ (Pulsar)</span>
          </div>
        </div>

        {/* Composition X (Hydrogen) */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Core Hydrogen X</span>
            <span className="text-orange-400 font-mono font-bold">{(simState.composition.X * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="0.95"
            step="0.01"
            value={simState.composition.X}
            onChange={(e) => {
              const X = parseFloat(e.target.value);
              const remaining = 1.0 - X;
              onUpdateParameters({ X, Y: remaining * 0.9, Z: remaining * 0.1 });
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>0% (Burned Out)</span>
            <span>95% (Primordial)</span>
          </div>
        </div>

        {/* Degeneracy Limit Alert Pill */}
        {(simState.equationOfState === 'DEGENERATE_NON_REL' || simState.equationOfState === 'DEGENERATE_REL') &&
          simState.massSolar >= telemetry.chandrasekharMassLimitSolar && (
            <div className="col-span-full bg-rose-950/90 border border-rose-500/70 rounded-md px-3 py-1.5 flex items-center justify-between text-xs text-rose-200 shadow-lg shadow-rose-950/50">
              <span className="font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse flex-shrink-0" />
                Mass ({simState.massSolar.toFixed(2)} M☉) exceeds Chandrasekhar Limit ({telemetry.chandrasekharMassLimitSolar.toFixed(3)} M☉): Ultra-relativistic degeneracy pressure cannot maintain hydrostatic equilibrium!
              </span>
              {!sn.isCollapsing && (
                <button
                  onClick={onTriggerSupernova}
                  className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium text-[11px] transition-colors flex-shrink-0 ml-2"
                >
                  Collapse Core
                </button>
              )}
            </div>
          )}
      </div>

      {/* Equation of State Toggles & Supernova Trigger */}
      <div className="flex flex-col sm:flex-row md:flex-col justify-between gap-2.5 min-w-[280px]">
        {/* EOS Radio Selector */}
        <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">Equation of State (EOS)</span>
          <div className="grid grid-cols-2 gap-1 text-[11px]">
            <button
              onClick={() => onUpdateParameters({ equationOfState: 'IDEAL_GAS', polytropicIndexN: 3.0 })}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                simState.equationOfState === 'IDEAL_GAS'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              Ideal Gas (n=3)
            </button>
            <button
              onClick={() => onUpdateParameters({ equationOfState: 'DEGENERATE_NON_REL', polytropicIndexN: 1.5, centralDensityKgM3: 1e9 })}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                simState.equationOfState === 'DEGENERATE_NON_REL'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              NR Degeneracy
            </button>
            <button
              onClick={() => onUpdateParameters({ equationOfState: 'DEGENERATE_REL', polytropicIndexN: 3.0, centralDensityKgM3: 1e12 })}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                simState.equationOfState === 'DEGENERATE_REL'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              UR Degeneracy
            </button>
            <button
              onClick={() => onUpdateParameters({ equationOfState: 'TOV_NUCLEAR', polytropicIndexN: 1.0, centralDensityKgM3: 1e18 })}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                simState.equationOfState === 'TOV_NUCLEAR'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              TOV Relativistic
            </button>
          </div>
        </div>

        {/* Supernova Action Trigger */}
        <div className="flex gap-2">
          {!sn.isCollapsing ? (
            <button
              onClick={onTriggerSupernova}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-rose-950/40 transition-all border border-rose-500/30"
            >
              <Flame className="w-4 h-4 animate-bounce" />
              <span>Trigger Core Collapse</span>
            </button>
          ) : (
            <button
              onClick={onResetSupernova}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs rounded-lg border border-slate-700 transition-all"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Reset Core Collapse ({sn.collapseTimeMs.toFixed(0)} ms)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
