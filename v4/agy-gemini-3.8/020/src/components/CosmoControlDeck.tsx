/**
 * COSMOLOGICAL CONTROL DECK
 * COSMO-FORGE (EXP-020)
 * Sliders, parameters, diagnostic badges, and interactive probe controls
 */

import React, { useMemo } from 'react';
import { CosmoParameters, CosmoSuiteMode } from '../types';
import { FriedmannSolver } from '../physics/FriedmannSolver';
import { CmbAcousticEngine } from '../physics/CmbAcousticEngine';
import { BbnKineticsEngine } from '../physics/BbnKineticsEngine';
import { HaloProfileType } from '../physics/DarkMatterHaloEngine';
import { Sliders, Activity, Atom, Orbit, Sparkles } from 'lucide-react';

interface ControlDeckProps {
  suiteMode: CosmoSuiteMode;
  params: CosmoParameters;
  onChangeParams: (partial: Partial<CosmoParameters>) => void;
  onTriggerBbnBurst?: () => void;
}

export const CosmoControlDeck: React.FC<ControlDeckProps> = ({
  suiteMode,
  params,
  onChangeParams,
  onTriggerBbnBurst,
}) => {
  // Computed diagnostics
  const diagnostics = useMemo(() => {
    const Omega_r = FriedmannSolver.computeRadiationDensity(params);
    const Omega_k = FriedmannSolver.computeCurvatureDensity(params, Omega_r);
    const q0 = FriedmannSolver.computeDeceleration(0, params);
    const z_acc = FriedmannSolver.findAccelerationRedshift(params);
    const age_Gyr = FriedmannSolver.computeAgeOfUniverse(0, params);

    const { ell_A, ell1 } = CmbAcousticEngine.computeFirstAcousticPeak(params);
    const bbn = BbnKineticsEngine.computeAbundances(params);

    return {
      Omega_r,
      Omega_k,
      q0,
      z_acc,
      age_Gyr,
      ell_A,
      ell1,
      bbn,
    };
  }, [params]);

  const curvatureLabel = useMemo(() => {
    const Ok = diagnostics.Omega_k;
    if (Math.abs(Ok) < 0.005) return 'Flat Euclidean (k = 0)';
    if (Ok > 0) return `Open Hyperbolic (Ω_k = +${Ok.toFixed(3)})`;
    return `Closed Spherical (Ω_k = ${Ok.toFixed(3)})`;
  }, [diagnostics.Omega_k]);

  return (
    <aside className="w-80 bg-slate-900/95 border-r border-slate-800 p-3.5 flex flex-col gap-3.5 overflow-y-auto select-none text-xs">
      {/* Header Badge */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          Cosmological Deck
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
          {curvatureLabel}
        </span>
      </div>

      {/* Telemetry Summary Cards */}
      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
        <div className="p-2 bg-slate-950/60 rounded border border-slate-800">
          <div className="text-slate-400 text-[10px]">Cosmic Age t₀</div>
          <div className="text-cyan-300 font-semibold text-sm">
            {diagnostics.age_Gyr.toFixed(2)} <span className="text-xs">Gyr</span>
          </div>
        </div>
        <div className="p-2 bg-slate-950/60 rounded border border-slate-800">
          <div className="text-slate-400 text-[10px]">Deceleration q₀</div>
          <div className={`font-semibold text-sm ${diagnostics.q0 < 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {diagnostics.q0.toFixed(3)}
          </div>
        </div>
        <div className="p-2 bg-slate-950/60 rounded border border-slate-800">
          <div className="text-slate-400 text-[10px]">CMB 1st Peak ℓ₁</div>
          <div className="text-indigo-300 font-semibold text-sm">
            ℓ = {Math.round(diagnostics.ell1)}
          </div>
        </div>
        <div className="p-2 bg-slate-950/60 rounded border border-slate-800">
          <div className="text-slate-400 text-[10px]">Primordial Helium Y_p</div>
          <div className="text-amber-300 font-semibold text-sm">
            {(diagnostics.bbn.Y_p * 100).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Primary Cosmological Parameter Sliders */}
      <div className="flex flex-col gap-2.5">
        <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
          FLRW Density Parameters
        </div>

        {/* Hubble Constant H0 */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
            <span>Hubble Constant H₀</span>
            <span className="font-mono text-cyan-400">{params.H0.toFixed(1)} km/s/Mpc</span>
          </div>
          <input
            type="range"
            min="40.0"
            max="100.0"
            step="0.5"
            value={params.H0}
            onChange={(e) => onChangeParams({ H0: parseFloat(e.target.value), activePresetId: undefined })}
            className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
          />
        </div>

        {/* Total Matter Density Omega_m */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
            <span>Total Matter Density Ω_m</span>
            <span className="font-mono text-cyan-400">{params.Omega_m.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.50"
            step="0.005"
            value={params.Omega_m}
            onChange={(e) => onChangeParams({ Omega_m: parseFloat(e.target.value), activePresetId: undefined })}
            className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
          />
        </div>

        {/* Baryon Density Omega_b */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
            <span>Baryon Density Ω_b</span>
            <span className="font-mono text-cyan-400">{params.Omega_b.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min="0.005"
            max="0.250"
            step="0.002"
            value={params.Omega_b}
            onChange={(e) => onChangeParams({ Omega_b: parseFloat(e.target.value), activePresetId: undefined })}
            className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
          />
        </div>

        {/* Dark Energy Density Omega_L */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
            <span>Dark Energy Density Ω_Λ</span>
            <span className="font-mono text-cyan-400">{params.Omega_L.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.50"
            step="0.005"
            value={params.Omega_L}
            onChange={(e) => onChangeParams({ Omega_L: parseFloat(e.target.value), activePresetId: undefined })}
            className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
          />
        </div>

        {/* Dark Energy EOS w0 */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
            <span>Dark Energy EOS w₀</span>
            <span className="font-mono text-cyan-400">{params.w0.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="-2.0"
            max="0.0"
            step="0.05"
            value={params.w0}
            onChange={(e) => onChangeParams({ w0: parseFloat(e.target.value), activePresetId: undefined })}
            className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
          />
        </div>

        {/* Dark Energy wa */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
            <span>Dark Energy Evolution w_a</span>
            <span className="font-mono text-cyan-400">{params.wa.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="-1.5"
            max="1.5"
            step="0.05"
            value={params.wa}
            onChange={(e) => onChangeParams({ wa: parseFloat(e.target.value), activePresetId: undefined })}
            className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
          />
        </div>
      </div>

      {/* Mode-Specific Probes and Toggles */}
      <div className="pt-2 border-t border-slate-800 flex flex-col gap-2.5">
        <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          Active Suite Probes
        </div>

        {suiteMode === 'COSMIC_EXPANSION' && (
          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
              <span>Probe Redshift z</span>
              <span className="font-mono text-emerald-400">z = {params.probeRedshift.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="6.0"
              step="0.05"
              value={params.probeRedshift}
              onChange={(e) => onChangeParams({ probeRedshift: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500 h-1 bg-slate-800 rounded"
            />
          </div>
        )}

        {suiteMode === 'CMB_POWER_SPECTRUM' && (
          <div>
            <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
              <span>CMB Probe Multipole ℓ</span>
              <span className="font-mono text-indigo-400">ℓ = {params.probeMultipole}</span>
            </div>
            <input
              type="range"
              min="2"
              max="2500"
              step="5"
              value={params.probeMultipole}
              onChange={(e) => onChangeParams({ probeMultipole: parseInt(e.target.value, 10) })}
              className="w-full accent-indigo-500 h-1 bg-slate-800 rounded"
            />
          </div>
        )}

        {suiteMode === 'PRIMORDIAL_BBN' && (
          <button
            onClick={onTriggerBbnBurst}
            className="w-full py-1.5 px-3 bg-gradient-to-r from-amber-600/40 to-orange-600/40 hover:from-amber-600/60 hover:to-orange-600/60 border border-amber-500/40 rounded-lg text-amber-200 font-medium flex items-center justify-center gap-2 transition-all shadow-sm shadow-amber-500/20"
          >
            <Atom className="w-4 h-4 text-amber-400" />
            Trigger Primordial Beta Decays
          </button>
        )}

        {suiteMode === 'DARK_MATTER_HALO' && (
          <div className="flex flex-col gap-2">
            <div>
              <label className="text-[10px] text-slate-400 mb-1 block">Halo Density Profile</label>
              <select
                value={params.haloProfileType}
                onChange={(e) => onChangeParams({ haloProfileType: e.target.value as HaloProfileType })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs font-mono"
              >
                <option value="NFW">Navarro-Frenk-White (Cuspy r⁻¹)</option>
                <option value="BURKERT">Burkert (Cored Profile)</option>
                <option value="MOORE">Moore (Steep Cusp r⁻¹·⁵)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-300 mb-0.5">
                <span>Galactic Radius Probe r</span>
                <span className="font-mono text-cyan-400">{params.probeRadiusKpc.toFixed(1)} kpc</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="35.0"
                step="0.5"
                value={params.probeRadiusKpc}
                onChange={(e) => onChangeParams({ probeRadiusKpc: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* Cosmic Turnaround Indicator */}
      <div className="mt-auto pt-2 border-t border-slate-800">
        <div className="text-[10px] text-slate-400 mb-1">Cosmic Acceleration Status</div>
        <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono flex items-center justify-between">
          <span>Turnaround:</span>
          <span className="text-cyan-400 font-semibold">
            {diagnostics.z_acc !== null ? `z_acc = ${diagnostics.z_acc.toFixed(3)}` : 'None'}
          </span>
        </div>
      </div>
    </aside>
  );
};
