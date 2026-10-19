/**
 * BandControlDeck.tsx
 * Control deck and physics parameter control center for BAND-FORGE.
 */

import React from 'react';
import { SimulationParameters, PresetId } from '../types/index.js';
import { PRESETS } from '../core/SimulationController.js';

interface BandControlDeckProps {
  params: SimulationParameters;
  onUpdateParams: (partial: Partial<SimulationParameters>) => void;
  onApplyPreset: (presetId: PresetId) => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const BandControlDeck: React.FC<BandControlDeckProps> = ({
  params,
  onUpdateParams,
  onApplyPreset,
  isPaused,
  onTogglePause
}) => {
  return (
    <div className="bg-slate-900 border-t border-slate-800 p-4 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Presets & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Preset:
            </span>
            <select
              value={params.activePresetId || 'GRAPHENE_DIRAC'}
              onChange={(e) => onApplyPreset(e.target.value as PresetId)}
              className="bg-slate-950 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-cyan-500"
            >
              {Object.entries(PRESETS).map(([id, p]) => (
                <option key={id} value={id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pause / Resume Button */}
          <button
            onClick={onTogglePause}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isPaused
                ? 'bg-amber-600/30 text-amber-300 border-amber-500/60'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
          >
            {isPaused ? '▶ Resume Clock' : '⏸ Pause Clock'}
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="flex-1 w-full md:w-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs font-mono">
          {/* General Hopping t */}
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Hopping t</span>
              <span className="text-cyan-400 font-bold">{params.t.toFixed(2)} eV</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.5"
              step="0.05"
              value={params.t}
              onChange={(e) => onUpdateParams({ t: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Fermi Energy EF */}
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Fermi Level EF</span>
              <span className="text-amber-400 font-bold">{params.ef.toFixed(2)} eV</span>
            </div>
            <input
              type="range"
              min="-3.5"
              max="3.5"
              step="0.05"
              value={params.ef}
              onChange={(e) => onUpdateParams({ ef: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Mode-specific sliders */}
          {params.suiteMode === 'BAND_STRUCTURE' || params.suiteMode === 'FERMI_SURFACE' ? (
            <>
              {/* Next-nearest neighbor hopping tp */}
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Hopping t'</span>
                  <span className="text-emerald-400 font-bold">{params.tp.toFixed(2)} eV</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.4"
                  step="0.02"
                  value={params.tp}
                  onChange={(e) => onUpdateParams({ tp: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </>
          ) : params.suiteMode === 'TOPOLOGICAL_CHERN' ? (
            <>
              {/* Semenoff Mass M */}
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Mass M</span>
                  <span className="text-emerald-400 font-bold">{params.haldane_M.toFixed(2)} eV</span>
                </div>
                <input
                  type="range"
                  min="-2.0"
                  max="2.0"
                  step="0.05"
                  value={params.haldane_M}
                  onChange={(e) => onUpdateParams({ haldane_M: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Haldane Phase Phi */}
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Phase φ</span>
                  <span className="text-indigo-400 font-bold">{(params.haldane_phi / Math.PI).toFixed(2)}π</span>
                </div>
                <input
                  type="range"
                  min={-Math.PI}
                  max={Math.PI}
                  step="0.05"
                  value={params.haldane_phi}
                  onChange={(e) => onUpdateParams({ haldane_phi: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </>
          ) : params.suiteMode === 'PHONON_DISPERSION' ? (
            <>
              {/* Mass M1 */}
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Mass M1</span>
                  <span className="text-cyan-400 font-bold">{params.M1_amu.toFixed(1)} u</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="1"
                  value={params.M1_amu}
                  onChange={(e) => onUpdateParams({ M1_amu: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Mass M2 */}
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Mass M2</span>
                  <span className="text-rose-400 font-bold">{params.M2_amu.toFixed(1)} u</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="1"
                  value={params.M2_amu}
                  onChange={(e) => onUpdateParams({ M2_amu: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              {/* Force Constant Cs */}
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Spring Cs</span>
                  <span className="text-emerald-400 font-bold">{params.Cs_force.toFixed(1)} N/m</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={params.Cs_force}
                  onChange={(e) => onUpdateParams({ Cs_force: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </>
          ) : params.suiteMode === 'HOFSTADTER_FRACTAL' ? (
            <>
              {/* Magnetic Flux Alpha */}
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Flux α = Φ/Φ₀</span>
                  <span className="text-cyan-400 font-bold">{params.magFluxAlpha.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.01"
                  value={params.magFluxAlpha}
                  onChange={(e) => onUpdateParams({ magFluxAlpha: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Max Denominator Q */}
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Max Q</span>
                  <span className="text-amber-400 font-bold">{params.maxHarperQ}</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="28"
                  step="2"
                  value={params.maxHarperQ}
                  onChange={(e) => onUpdateParams({ maxHarperQ: parseInt(e.target.value, 10) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </>
          ) : (
            <>
              {/* SSH Hopping t1 */}
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>SSH t1</span>
                  <span className="text-cyan-400 font-bold">{params.t1_ssh.toFixed(2)} eV</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.05"
                  value={params.t1_ssh}
                  onChange={(e) => onUpdateParams({ t1_ssh: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* SSH Hopping t2 */}
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>SSH t2</span>
                  <span className="text-indigo-400 font-bold">{params.t2_ssh.toFixed(2)} eV</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.05"
                  value={params.t2_ssh}
                  onChange={(e) => onUpdateParams({ t2_ssh: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
