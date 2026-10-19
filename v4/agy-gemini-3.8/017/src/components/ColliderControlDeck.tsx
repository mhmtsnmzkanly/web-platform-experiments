import React from 'react';
import {
  ColliderPresetId,
  DetectorConfig,
  CollisionEvent,
  TriggerFilter,
} from '../types';
import { COLLIDER_PRESETS } from '../physics/ColliderPresets';
import { Sliders, Sparkles, Filter, Activity, Compass, Gauge } from 'lucide-react';

interface ColliderControlDeckProps {
  currentPreset: ColliderPresetId;
  onSelectPreset: (presetId: ColliderPresetId) => void;
  config: DetectorConfig;
  onChangeConfig: (newConfig: Partial<DetectorConfig>) => void;
  event: CollisionEvent | null;
}

export const ColliderControlDeck: React.FC<ColliderControlDeckProps> = ({
  currentPreset,
  onSelectPreset,
  config,
  onChangeConfig,
  event,
}) => {
  const triggerFilters: { id: TriggerFilter; label: string }[] = [
    { id: 'ALL', label: 'All Triggers' },
    { id: 'DI_LEPTON', label: 'Di-Lepton (pT > 20)' },
    { id: 'DI_PHOTON', label: 'Di-Photon (pT > 25)' },
    { id: 'HIGH_MET', label: 'High MET (> 100 GeV)' },
    { id: 'MULTI_JET', label: 'Multi-Jet (≥ 4 Jets)' },
  ];

  const presetList = Object.values(COLLIDER_PRESETS);

  return (
    <div className="w-80 lg:w-96 h-full bg-slate-950/95 border-l border-slate-800 flex flex-col overflow-y-auto select-none p-4 gap-4 text-xs font-sans">
      {/* 1. Curated Collision Presets */}
      <div>
        <div className="flex items-center gap-1.5 font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Collision Scenarios & Processes</span>
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {presetList.map(p => {
            const isSelected = p.id === currentPreset;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p.id)}
                className={`text-left p-2.5 rounded-lg border transition ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/70 shadow-sm'
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`font-semibold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                    {p.name}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium border ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {p.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* 2. Physics & Detector Parameters */}
      <div>
        <div className="flex items-center gap-1.5 font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Beam & Detector Configuration</span>
        </div>

        <div className="space-y-3.5">
          {/* Sqrts (Beam Energy) */}
          <div>
            <div className="flex justify-between text-slate-300 font-mono text-[11px] mb-1">
              <span>Center of Mass Energy (√s)</span>
              <span className="text-cyan-400 font-bold">{config.sqrtsTeV.toFixed(1)} TeV</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="14.0"
              step="0.5"
              value={config.sqrtsTeV}
              onChange={e => onChangeConfig({ sqrtsTeV: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-0.5">
              <span>0.5 TeV (Tevatron/Run 1)</span>
              <span>13.6/14.0 TeV (HL-LHC)</span>
            </div>
          </div>

          {/* Magnetic Field B */}
          <div>
            <div className="flex justify-between text-slate-300 font-mono text-[11px] mb-1">
              <span>Solenoid Field (B_z)</span>
              <span className="text-cyan-400 font-bold">{config.magneticFieldB.toFixed(1)} T</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={config.magneticFieldB}
              onChange={e => onChangeConfig({ magneticFieldB: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-0.5">
              <span>0.5 T (Weak)</span>
              <span>3.8/4.0 T (CMS/ATLAS)</span>
            </div>
          </div>

          {/* PT Display Cut */}
          <div>
            <div className="flex justify-between text-slate-300 font-mono text-[11px] mb-1">
              <span>Min Track Cut (pT &gt;)</span>
              <span className="text-cyan-400 font-bold">{config.ptCutGeV.toFixed(1)} GeV</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10.0"
              step="0.5"
              value={config.ptCutGeV}
              onChange={e => onChangeConfig({ ptCutGeV: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-0.5">
              <span>0.5 GeV (Full Pileup)</span>
              <span>10.0 GeV (Hard Tracks)</span>
            </div>
          </div>

          {/* Anti-kt Jet Radius R */}
          <div>
            <div className="flex justify-between text-slate-300 font-mono text-[11px] mb-1">
              <span>Anti-kt Jet Radius (R)</span>
              <span className="text-cyan-400 font-bold">{config.jetRadiusR.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={config.jetRadiusR}
              onChange={e => onChangeConfig({ jetRadiusR: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-0.5">
              <span>R = 0.2 (Narrow)</span>
              <span>R = 0.4 (Default)</span>
              <span>R = 1.0 (Fat Jet)</span>
            </div>
          </div>

          {/* Collision Rate */}
          <div>
            <div className="flex justify-between text-slate-300 font-mono text-[11px] mb-1">
              <span>Collision Stream Rate</span>
              <span className="text-cyan-400 font-bold">{config.collisionRateHz.toFixed(1)} Hz</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.5"
              value={config.collisionRateHz}
              onChange={e => onChangeConfig({ collisionRateHz: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* 3. Level-1 / High-Level Trigger Filter */}
      <div>
        <div className="flex items-center gap-1.5 font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Physics Trigger Filters</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {triggerFilters.map(tf => {
            const active = config.triggerFilter === tf.id;
            return (
              <button
                key={tf.id}
                onClick={() => onChangeConfig({ triggerFilter: tf.id })}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition border ${
                  active
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf.label}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* 4. Live Event Telemetry Card */}
      {event && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Current Hard Process:</span>
            <span className="text-cyan-400 font-semibold">{event.processName}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">TOTAL TRACKS</span>
              <span className="text-white font-bold text-sm">{event.visibleParticles.length}</span>
            </div>
            <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">ANTI-kT JETS</span>
              <span className="text-cyan-400 font-bold text-sm">{event.jets.length}</span>
            </div>
            <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">MISSING E_T</span>
              <span className={`font-bold text-sm ${event.missingET.mag > 50 ? 'text-pink-400' : 'text-slate-300'}`}>
                {event.missingET.mag.toFixed(1)} GeV
              </span>
            </div>
            <div className="bg-slate-950/70 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">SCALAR Σ E_T</span>
              <span className="text-emerald-400 font-bold text-sm">{event.totalScalarET.toFixed(0)} GeV</span>
            </div>
          </div>

          {/* Invariant Mass Candidates */}
          {event.reconstructedMasses.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Reconstructed Mass Candidates:
              </span>
              <div className="space-y-1">
                {event.reconstructedMasses.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-2 py-1 bg-slate-950 rounded border border-slate-800 text-[11px] font-mono"
                  >
                    <span className="text-amber-400 font-semibold">{m.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      {m.resonanceTarget}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
