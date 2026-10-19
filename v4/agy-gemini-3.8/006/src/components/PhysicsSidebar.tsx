import React from 'react';
import { SPHParams, ReactionDiffusionParams, FluidTelemetry } from '../types';
import { RD_PRESETS } from '../engine/ReactionDiffusionEngine';
import { Activity, Gauge, Sliders, Dna, Compass } from 'lucide-react';

interface PhysicsSidebarProps {
  sphParams: SPHParams;
  onUpdateSPHParams: (params: SPHParams) => void;
  rdParams: ReactionDiffusionParams;
  onUpdateRDParams: (params: ReactionDiffusionParams) => void;
  telemetry: FluidTelemetry;
}

const PhysicsSidebarComponent: React.FC<PhysicsSidebarProps> = ({
  sphParams,
  onUpdateSPHParams,
  rdParams,
  onUpdateRDParams,
  telemetry,
}) => {
  return (
    <aside className="w-80 bg-slate-900/90 border-l border-cyan-500/30 p-3.5 flex flex-col gap-4 font-mono text-xs overflow-y-auto select-none shadow-xl backdrop-blur-md">
      {/* 1. Live Hydrodynamic Telemetry */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-slate-200">TELEMETRY</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-bold">{telemetry.fps} FPS</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-slate-500">PARTICLES:</span>
            <div className="font-bold text-slate-200">{telemetry.particleCount}</div>
          </div>
          <div>
            <span className="text-slate-500">REYNOLDS Re:</span>
            <div className="font-bold text-cyan-300">{telemetry.reynoldsNumber}</div>
          </div>
          <div>
            <span className="text-slate-500">KINETIC ENERGY:</span>
            <div className="font-bold text-amber-300">{telemetry.kineticEnergy} J</div>
          </div>
          <div>
            <span className="text-slate-500">MAX PRESSURE:</span>
            <div className="font-bold text-emerald-300">{telemetry.maxPressure} Pa</div>
          </div>
        </div>
      </div>

      {/* 2. SPH Navier-Stokes Parameters */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-slate-200">NAVIER-STOKES SPH</span>
          </div>
        </div>

        {/* Gravity Y */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>GRAVITY Y</span>
            <span className="text-cyan-400 font-bold">{sphParams.gravityY} m/s²</span>
          </div>
          <input
            type="range"
            min={0}
            max={1500}
            step={50}
            value={sphParams.gravityY}
            onChange={(e) =>
              onUpdateSPHParams({ ...sphParams, gravityY: Number(e.target.value) })
            }
            className="accent-cyan-400 cursor-pointer w-full"
          />
        </div>

        {/* Viscosity */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>DYNAMIC VISCOSITY</span>
            <span className="text-amber-400 font-bold">{sphParams.viscosity} mPa·s</span>
          </div>
          <input
            type="range"
            min={20}
            max={800}
            step={20}
            value={sphParams.viscosity}
            onChange={(e) =>
              onUpdateSPHParams({ ...sphParams, viscosity: Number(e.target.value) })
            }
            className="accent-amber-400 cursor-pointer w-full"
          />
        </div>

        {/* Gas Constant Stiffness */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>STIFFNESS k</span>
            <span className="text-cyan-400 font-bold">{sphParams.stiffness}</span>
          </div>
          <input
            type="range"
            min={500}
            max={4000}
            step={100}
            value={sphParams.stiffness}
            onChange={(e) =>
              onUpdateSPHParams({ ...sphParams, stiffness: Number(e.target.value) })
            }
            className="accent-cyan-400 cursor-pointer w-full"
          />
        </div>

        {/* Wall Restitution */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>RESTITUTION</span>
            <span className="text-slate-200 font-bold">{Math.round(sphParams.restitution * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.05}
            value={sphParams.restitution}
            onChange={(e) =>
              onUpdateSPHParams({ ...sphParams, restitution: Number(e.target.value) })
            }
            className="accent-cyan-400 cursor-pointer w-full"
          />
        </div>
      </div>

      {/* 3. Reaction-Diffusion Morphogenesis */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <Dna className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-slate-200">TURING MORPHOGENESIS</span>
          </div>
        </div>

        {/* Pattern Preset Buttons */}
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(RD_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => onUpdateRDParams(preset)}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-850 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold truncate transition-colors"
            >
              {key.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Feed Rate F */}
        <div className="flex flex-col gap-1 pt-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>FEED RATE F</span>
            <span className="text-emerald-400 font-bold">{rdParams.feed.toFixed(4)}</span>
          </div>
          <input
            type="range"
            min={0.01}
            max={0.065}
            step={0.001}
            value={rdParams.feed}
            onChange={(e) =>
              onUpdateRDParams({ ...rdParams, feed: Number(e.target.value) })
            }
            className="accent-emerald-400 cursor-pointer w-full"
          />
        </div>

        {/* Kill Rate K */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>KILL RATE K</span>
            <span className="text-emerald-400 font-bold">{rdParams.kill.toFixed(4)}</span>
          </div>
          <input
            type="range"
            min={0.04}
            max={0.075}
            step={0.001}
            value={rdParams.kill}
            onChange={(e) =>
              onUpdateRDParams({ ...rdParams, kill: Number(e.target.value) })
            }
            className="accent-emerald-400 cursor-pointer w-full"
          />
        </div>
      </div>
    </aside>
  );
};

export const PhysicsSidebar = React.memo(PhysicsSidebarComponent);
