import React from 'react';
import { EcosystemParams, EcosystemTelemetry } from '../types';
import { Activity, Sun, Zap, Sparkles, Wind, Users, BarChart3 } from 'lucide-react';

interface EcosystemSidebarProps {
  params: EcosystemParams;
  onUpdateParams: (params: EcosystemParams) => void;
  telemetry: EcosystemTelemetry;
}

export const EcosystemSidebar: React.FC<EcosystemSidebarProps> = ({
  params,
  onUpdateParams,
  telemetry,
}) => {
  const updateField = <K extends keyof EcosystemParams>(field: K, value: EcosystemParams[K]) => {
    onUpdateParams({
      ...params,
      [field]: value,
    });
  };

  const total = Math.max(1, telemetry.totalOrganisms);
  const herbFrac = (telemetry.herbivoreCount / total) * 100;
  const carnFrac = (telemetry.carnivoreCount / total) * 100;
  const photoFrac = (telemetry.phototrophCount / total) * 100;
  const omniFrac = (telemetry.omnivoreCount / total) * 100;

  return (
    <aside className="w-80 bg-slate-950/90 border-l border-slate-800/80 flex flex-col h-full overflow-y-auto select-none backdrop-blur-md shrink-0">
      {/* 1. Ecological Telemetry Card */}
      <div className="p-4 border-b border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-emerald-400" />
            Biosphere Telemetry
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            {telemetry.fps} FPS
          </span>
        </div>

        {/* Population & Demographics Header */}
        <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-2xl">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs text-slate-400">Total Population</span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              {telemetry.totalOrganisms}
            </span>
          </div>

          {/* Demographic Stacked Bar */}
          <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800 mb-2">
            <div
              className="bg-emerald-400 h-full transition-all duration-300"
              style={{ width: `${herbFrac}%` }}
              title={`Herbivores: ${telemetry.herbivoreCount}`}
            />
            <div
              className="bg-rose-500 h-full transition-all duration-300"
              style={{ width: `${carnFrac}%` }}
              title={`Carnivores: ${telemetry.carnivoreCount}`}
            />
            <div
              className="bg-cyan-400 h-full transition-all duration-300"
              style={{ width: `${photoFrac}%` }}
              title={`Phototrophs: ${telemetry.phototrophCount}`}
            />
            <div
              className="bg-amber-400 h-full transition-all duration-300"
              style={{ width: `${omniFrac}%` }}
              title={`Omnivores: ${telemetry.omnivoreCount}`}
            />
          </div>

          {/* Demographic Counts */}
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Herbivores
              </span>
              <span className="text-slate-200">{telemetry.herbivoreCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                Carnivores
              </span>
              <span className="text-slate-200">{telemetry.carnivoreCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                Phototrophs
              </span>
              <span className="text-slate-200">{telemetry.phototrophCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                Omnivores
              </span>
              <span className="text-slate-200">{telemetry.omnivoreCount}</span>
            </div>
          </div>
        </div>

        {/* Evolutionary Metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900/60 border border-slate-800/60 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 block mb-0.5">Shannon Diversity</span>
            <span className="text-sm font-bold font-mono text-cyan-400">
              {telemetry.shannonDiversityIndex.toFixed(2)}
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/60 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 block mb-0.5">Peak Generation</span>
            <span className="text-sm font-bold font-mono text-purple-400">
              Gen {telemetry.peakGeneration}
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/60 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 block mb-0.5">Average Lifespan</span>
            <span className="text-sm font-bold font-mono text-slate-200">
              {telemetry.avgLifespan}s
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/60 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 block mb-0.5">Nutrient Biomass</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {telemetry.totalNutrients} nodes
            </span>
          </div>
        </div>
      </div>

      {/* 2. Environmental Sliders */}
      <div className="p-4 space-y-4 flex-1">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          Environmental Forces
        </span>

        {/* Ambient Light */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              Ambient Illumination
            </span>
            <span className="font-mono text-slate-200">{Math.round(params.ambientLight * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.5"
            step="0.05"
            value={params.ambientLight}
            onChange={(e) => updateField('ambientLight', Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Radiation Level */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              Radiation Mutagenesis
            </span>
            <span className="font-mono text-yellow-400">{params.radiationLevel.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0"
            max="4.0"
            step="0.1"
            value={params.radiationLevel}
            onChange={(e) => updateField('radiationLevel', Number(e.target.value))}
            className="w-full accent-yellow-400 cursor-pointer"
          />
        </div>

        {/* Nutrient Regen */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Biomass Regen Rate
            </span>
            <span className="font-mono text-emerald-400">{params.nutrientRegenRate.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3.5"
            step="0.1"
            value={params.nutrientRegenRate}
            onChange={(e) => updateField('nutrientRegenRate', Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
        </div>

        {/* Fluid Viscosity */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              Hydrodynamic Drag
            </span>
            <span className="font-mono text-cyan-400">{Math.round((1 - params.fluidViscosity) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.85"
            max="0.98"
            step="0.01"
            value={params.fluidViscosity}
            onChange={(e) => updateField('fluidViscosity', Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Population Cap */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              Biosphere Carrying Cap
            </span>
            <span className="font-mono text-purple-400">{params.maxOrganisms}</span>
          </div>
          <input
            type="range"
            min="60"
            max="250"
            step="10"
            value={params.maxOrganisms}
            onChange={(e) => updateField('maxOrganisms', Number(e.target.value))}
            className="w-full accent-purple-400 cursor-pointer"
          />
        </div>
      </div>
    </aside>
  );
};
