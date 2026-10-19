import React from 'react';
import { PhysicalObservables } from '../types';

interface TelemetryStripProps {
  obs: PhysicalObservables;
}

const TelemetryStripComponent: React.FC<TelemetryStripProps> = ({ obs }) => {
  const isTransit = obs.transmissionRatio < 0.01 && obs.simulationTimeStep < 200;

  return (
    <footer className="w-full bg-slate-900/90 border border-slate-800 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
      {/* 1. CFL STABILITY */}
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">CFL STABILITY</span>
        <span className="text-sm font-bold text-cyan-400">
          {obs.cflStabilityNumber.toFixed(3)} ≤ 0.707
        </span>
      </div>

      {/* 2. TOTAL ENERGY */}
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">TOTAL ENERGY U_EM</span>
        <span className="text-sm font-bold text-emerald-400">
          {obs.totalEnergyMicroJ.toFixed(1)} µJ
        </span>
      </div>

      {/* 3. TRANSMISSION RATIO & TRANSIT STATUS */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">TRANSMISSION T</span>
          {isTransit && (
            <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 rounded animate-pulse">
              TRANSIT
            </span>
          )}
        </div>
        <span className="text-sm font-bold text-amber-400">
          {(obs.transmissionRatio * 100).toFixed(1)}%
        </span>
      </div>

      {/* 4. PHASE DELAY */}
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">PHASE DELAY Δφ</span>
        <span className="text-sm font-bold text-rose-400">
          {obs.dielectricPhaseDelayRad.toFixed(2)} rad ({(obs.dielectricPhaseDelayRad / Math.PI).toFixed(2)}π)
        </span>
      </div>

      {/* 5. DIELECTRIC NODES */}
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">DIELECTRIC NODES</span>
        <span className="text-sm font-bold text-purple-400">
          {obs.dielectricNodesCount.toLocaleString()} pts
        </span>
      </div>

      {/* 6. CONDUCTOR NODES */}
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">PEC METAL NODES</span>
        <span className="text-sm font-bold text-slate-200">
          {obs.conductorNodesCount.toLocaleString()} pts
        </span>
      </div>
    </footer>
  );
};

export const TelemetryStrip = React.memo(TelemetryStripComponent);
