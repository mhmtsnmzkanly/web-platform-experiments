/**
 * PLASMA-LAB: Comprehensive Tokamak Instrumentation & Parameter Control Deck
 */

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  TrendingUp,
  Atom,
  Flame,
  Radio,
  ShieldAlert,
  Zap,
  Activity,
  Layers,
  RotateCcw,
} from 'lucide-react';
import {
  PlasmaSuiteMode,
  TokamakGeometry,
  PlasmaControls,
  TokamakMetrics,
  RadialProfilePoint,
} from '../types';

interface PlasmaControlDeckProps {
  suiteMode: PlasmaSuiteMode;
  onSelectSuiteMode: (mode: PlasmaSuiteMode) => void;
  geom: TokamakGeometry;
  controls: PlasmaControls;
  metrics: TokamakMetrics;
  radialProfiles: RadialProfilePoint[];
  onUpdateGeometry: (updater: (prev: TokamakGeometry) => TokamakGeometry) => void;
  onUpdateControls: (updater: (prev: PlasmaControls) => PlasmaControls) => void;
  onResetDisruption: () => void;
}

export const PlasmaControlDeck: React.FC<PlasmaControlDeckProps> = ({
  suiteMode,
  onSelectSuiteMode,
  geom,
  controls,
  metrics,
  radialProfiles,
  onUpdateGeometry,
  onUpdateControls,
  onResetDisruption,
}) => {
  const [activeTab, setActiveTab] = useState<'CONTROLS' | 'PROFILES' | 'POINCARE' | 'THERMONUCLEAR' | 'COILS_VDE'>('CONTROLS');

  // Synchronize suiteMode from header with deck tabs
  useEffect(() => {
    if (suiteMode === 'MAGNETIC_TOPOLOGY') setActiveTab('CONTROLS');
    else if (suiteMode === 'PROFILES_SAFETY') setActiveTab('PROFILES');
    else if (suiteMode === 'POINCARE_MAP') setActiveTab('POINCARE');
    else if (suiteMode === 'THERMONUCLEAR_POWER') setActiveTab('THERMONUCLEAR');
    else if (suiteMode === 'COIL_CONTROL') setActiveTab('COILS_VDE');
  }, [suiteMode]);

  return (
    <div className="w-full flex flex-col bg-slate-950/95 backdrop-blur border-t border-slate-800 text-xs select-none">
      {/* Sub-Header Tabs */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 bg-slate-900/40">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              setActiveTab('CONTROLS');
              onSelectSuiteMode('MAGNETIC_TOPOLOGY');
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'CONTROLS'
                ? 'bg-slate-800 text-purple-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>REACTOR CONTROLS</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('PROFILES');
              onSelectSuiteMode('PROFILES_SAFETY');
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'PROFILES'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>RADIAL PROFILES & q(r)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('POINCARE');
              onSelectSuiteMode('POINCARE_MAP');
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'POINCARE'
                ? 'bg-slate-800 text-amber-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>POINCARÉ & ISLANDS</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('THERMONUCLEAR');
              onSelectSuiteMode('THERMONUCLEAR_POWER');
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'THERMONUCLEAR'
                ? 'bg-slate-800 text-rose-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>THERMONUCLEAR POWER (Q)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('COILS_VDE');
              onSelectSuiteMode('COIL_CONTROL');
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'COILS_VDE'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>PF COILS & VDE STABILITY</span>
          </button>
        </div>

        {/* Live Q-Factor & Disruption Risk Badge */}
        <div className="flex items-center space-x-3 font-mono text-[11px]">
          <div className="flex items-center space-x-1">
            <span className="text-slate-400">Q FACTOR:</span>
            <span className={metrics.qFactor >= 1.0 ? 'text-emerald-400 font-bold text-sm' : 'text-slate-300 font-bold'}>
              {metrics.qFactor.toFixed(2)}
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center space-x-1">
            <span className="text-slate-400">RISK:</span>
            <span
              className={
                metrics.disruptionRisk > 0.6
                  ? 'text-rose-400 font-bold'
                  : metrics.disruptionRisk > 0.3
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-300'
              }
            >
              {(metrics.disruptionRisk * 100).toFixed(0)}%
            </span>
          </div>

          {metrics.isDisrupted && (
            <button
              onClick={onResetDisruption}
              className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer transition-colors text-[10px]"
            >
              RE-IGNITE PLASMA
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-3 max-h-56 overflow-y-auto">
        {/* 1. REACTOR CONTROLS TAB */}
        {activeTab === 'CONTROLS' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Toroidal Field B_0 */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Toroidal Field (B0):</span>
                <span className="text-white font-mono font-bold">{geom.toroidalFieldB0.toFixed(2)} T</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.05"
                value={geom.toroidalFieldB0}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateGeometry((prev) => ({ ...prev, toroidalFieldB0: val }));
                }}
                className="w-full cursor-pointer h-1.5 rounded-lg bg-slate-800"
              />
            </div>

            {/* Plasma Current I_p */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Plasma Current (Ip):</span>
                <span className="text-purple-300 font-mono font-bold">{geom.plasmaCurrentIp.toFixed(1)} MA</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="20.0"
                step="0.1"
                value={geom.plasmaCurrentIp}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateGeometry((prev) => ({ ...prev, plasmaCurrentIp: val }));
                }}
                className="w-full cursor-pointer h-1.5 rounded-lg bg-slate-800"
              />
            </div>

            {/* NBI Heating Power */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>NBI Neutral Beam:</span>
                <span className="text-orange-300 font-mono font-bold">{controls.nbiPowerMw.toFixed(1)} MW</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="50.0"
                step="1.0"
                value={controls.nbiPowerMw}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateControls((prev) => ({ ...prev, nbiPowerMw: val }));
                }}
                className="w-full cursor-pointer h-1.5 rounded-lg bg-slate-800"
              />
            </div>

            {/* ECRH RF Heating */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>ECRH Microwave:</span>
                <span className="text-amber-300 font-mono font-bold">{controls.ecrhPowerMw.toFixed(1)} MW</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="30.0"
                step="1.0"
                value={controls.ecrhPowerMw}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateControls((prev) => ({ ...prev, ecrhPowerMw: val }));
                }}
                className="w-full cursor-pointer h-1.5 rounded-lg bg-slate-800"
              />
            </div>

            {/* Target Density n_e */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Target Density (ne):</span>
                <span className="text-cyan-300 font-mono font-bold">{controls.targetDensityN20.toFixed(2)} ×10²⁰</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.02"
                value={controls.targetDensityN20}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateControls((prev) => ({ ...prev, targetDensityN20: val }));
                }}
                className="w-full cursor-pointer h-1.5 rounded-lg bg-slate-800"
              />
            </div>

            {/* Elongation kappa */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Elongation (κ):</span>
                <span className="text-emerald-300 font-mono font-bold">{geom.elongationKappa.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.6"
                step="0.02"
                value={geom.elongationKappa}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateGeometry((prev) => ({ ...prev, elongationKappa: val }));
                }}
                className="w-full cursor-pointer h-1.5 rounded-lg bg-slate-800"
              />
            </div>

            {/* Triangularity delta */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Triangularity (δ):</span>
                <span className="text-blue-300 font-mono font-bold">{geom.triangularityDelta.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-0.1"
                max="0.8"
                step="0.02"
                value={geom.triangularityDelta}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateGeometry((prev) => ({ ...prev, triangularityDelta: val }));
                }}
                className="w-full cursor-pointer h-1.5 rounded-lg bg-slate-800"
              />
            </div>

            {/* Impurity Z_eff */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Impurity (Zeff):</span>
                <span className="text-rose-300 font-mono font-bold">{controls.impurityFractionZeff.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.05"
                value={controls.impurityFractionZeff}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateControls((prev) => ({ ...prev, impurityFractionZeff: val }));
                }}
                className="w-full cursor-pointer h-1.5 rounded-lg bg-slate-800"
              />
            </div>
          </div>
        )}

        {/* 2. RADIAL PROFILES & q(r) TAB */}
        {activeTab === 'PROFILES' && (
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full h-32 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                {/* Horizontal coordinate axes */}
                <line x1="0" y1="75" x2="300" y2="75" stroke="#475569" strokeWidth="1" />
                <line x1="0" y1="5" x2="0" y2="75" stroke="#475569" strokeWidth="1" />

                {/* Resonant q lines: q=1, q=2, q=3 */}
                <line x1="0" y1={75 - (1.0 / 6.0) * 70} x2="300" y2={75 - (1.0 / 6.0) * 70} stroke="#334155" strokeDasharray="2,2" strokeWidth="1" />
                <line x1="0" y1={75 - (2.0 / 6.0) * 70} x2="300" y2={75 - (2.0 / 6.0) * 70} stroke="#475569" strokeDasharray="3,3" strokeWidth="1" />
                <line x1="0" y1={75 - (3.0 / 6.0) * 70} x2="300" y2={75 - (3.0 / 6.0) * 70} stroke="#334155" strokeDasharray="2,2" strokeWidth="1" />

                <text x="5" y={75 - (2.0 / 6.0) * 70 - 2} fill="#f59e0b" fontSize="7" fontFamily="monospace">q=2 (Tearing)</text>
                <text x="5" y={75 - (1.0 / 6.0) * 70 - 2} fill="#ef4444" fontSize="7" fontFamily="monospace">q=1 (Sawtooth)</text>

                {/* Safety Factor Profile q(r) (Cyan) */}
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  points={radialProfiles
                    .map((pt) => {
                      const sx = pt.normRadius * 300;
                      const sy = 75 - Math.min(70, (pt.qValue / 6.0) * 70);
                      return `${sx},${sy}`;
                    })
                    .join(' ')}
                />

                {/* Temperature Profile T_e(r) (Orange) */}
                <polyline
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="1.5"
                  strokeDasharray="4,2"
                  points={radialProfiles
                    .map((pt) => {
                      const sx = pt.normRadius * 300;
                      const sy = 75 - Math.min(70, (pt.teKev / 30.0) * 70);
                      return `${sx},${sy}`;
                    })
                    .join(' ')}
                />
              </svg>

              <div className="absolute top-1 left-2 flex items-center space-x-3 text-[10px] font-mono">
                <span className="text-cyan-400">― Safety Factor q(r)</span>
                <span className="text-orange-400">- - Electron Temp Te(r)</span>
              </div>
            </div>

            <div className="w-full md:w-64 font-mono text-[11px] space-y-1 text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 shrink-0">
              <span className="font-bold text-cyan-400">MAGNETIC SAFETY PROFILE:</span>
              <div className="flex justify-between">
                <span>q on Axis (q0):</span>
                <span className="text-white font-bold">{metrics.q0.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>q at Edge (q95):</span>
                <span className="text-cyan-300 font-bold">{metrics.q95.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Magnetic Shear (s):</span>
                <span className="text-purple-300 font-bold">Positive Shear</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800 text-[10px]">
                <span>Troyon Limit (βN):</span>
                <span className={metrics.troyonBetaN > 3.0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {metrics.troyonBetaN.toFixed(2)} &lt; 3.5
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. POINCARE & ISLANDS TAB */}
        {activeTab === 'POINCARE' && (
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 font-mono text-[11px] space-y-2 text-slate-300">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                <Activity className="w-4 h-4" />
                <span>MHD PERTURBATIONS & MAGNETIC ISLAND RECONNECTION</span>
              </div>
              <p className="text-slate-400 text-[10px]">
                Resonant tearing modes break nested Kolmogorov-Arnold-Moser (KAM) magnetic surfaces, forming magnetic island chains at rational safety factor surfaces q = m/n = 2/1. Island growth is governed by the Rutherford equation.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-500">m=2 Island Width:</span>
                  <div className="text-amber-400 font-bold text-sm">{metrics.tearingIslandWidthCm.toFixed(1)} cm</div>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-500">Mirnov Amplitude:</span>
                  <div className="text-cyan-400 font-bold text-sm">{(metrics.tearingIslandWidthCm * 1.8).toFixed(1)} Gauss</div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-64 font-mono text-[11px] space-y-1 text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 shrink-0">
              <span className="font-bold text-amber-400">INSTABILITY INDICATORS:</span>
              <div className="flex justify-between">
                <span>Greenwald Ratio:</span>
                <span className={metrics.greenwaldFraction > 1.0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {(metrics.greenwaldFraction * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Island / Minor Radius:</span>
                <span className="text-amber-300 font-bold">
                  {((metrics.tearingIslandWidthCm / 100.0 / geom.minorRadiusA) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Disruption State:</span>
                <span className={metrics.isDisrupted ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {metrics.isDisrupted ? 'QUENCHED' : 'CONFINED'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 4. THERMONUCLEAR POWER TAB */}
        {activeTab === 'THERMONUCLEAR' && (
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500">FUSION POWER:</span>
                <div className="text-rose-400 font-bold text-base">{metrics.fusionPowerMw.toFixed(1)} MW</div>
                <span className="text-[10px] text-slate-400">P_fus = 5 × P_α</span>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500">ALPHA HEATING:</span>
                <div className="text-orange-400 font-bold text-base">{metrics.alphaPowerMw.toFixed(1)} MW</div>
                <span className="text-[10px] text-slate-400">3.5 MeV ⁴He</span>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500">AUXILIARY IN:</span>
                <div className="text-purple-400 font-bold text-base">{metrics.auxiliaryPowerMw.toFixed(1)} MW</div>
                <span className="text-[10px] text-slate-400">NBI + ECRH</span>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500">TOTAL RADIATED:</span>
                <div className="text-blue-400 font-bold text-base">{metrics.radiatedPowerMw.toFixed(1)} MW</div>
                <span className="text-[10px] text-slate-400">Brem + Cyclotron</span>
              </div>
            </div>

            <div className="w-full md:w-64 font-mono text-[11px] space-y-1 text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 shrink-0">
              <span className="font-bold text-rose-400">LAWSON CRITERION:</span>
              <div className="flex justify-between">
                <span>Triple Product:</span>
                <span className="text-white font-bold">{metrics.lawsonParameter.toFixed(1)} ×10²⁰</span>
              </div>
              <div className="flex justify-between">
                <span>Ignition Threshold:</span>
                <span className="text-emerald-400 font-bold">≥ 30.0 keV·s·m⁻³</span>
              </div>
              <div className="flex justify-between">
                <span>Confinement Time:</span>
                <span className="text-cyan-300 font-bold">{metrics.confinementTimeTauESec.toFixed(2)} s (IPB98)</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800 text-[10px]">
                <span>Stored Energy:</span>
                <span className="text-amber-300 font-bold">{metrics.storedThermalEnergyMj.toFixed(1)} MJ</span>
              </div>
            </div>
          </div>
        )}

        {/* 5. PF COILS & VDE STABILITY TAB */}
        {activeTab === 'COILS_VDE' && (
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Upper PF Coil Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Upper PF Coil:</span>
                  <span className="text-purple-300 font-mono font-bold">{controls.upperPfCurrentKa.toFixed(0)} kA</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250"
                  step="1"
                  value={controls.upperPfCurrentKa}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateControls((prev) => ({ ...prev, upperPfCurrentKa: val }));
                  }}
                  className="w-full cursor-pointer h-1.5 rounded-lg bg-slate-800"
                />
              </div>

              {/* Lower PF Coil Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Lower PF Coil:</span>
                  <span className="text-purple-300 font-mono font-bold">{controls.lowerPfCurrentKa.toFixed(0)} kA</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250"
                  step="1"
                  value={controls.lowerPfCurrentKa}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateControls((prev) => ({ ...prev, lowerPfCurrentKa: val }));
                  }}
                  className="w-full cursor-pointer h-1.5 rounded-lg bg-slate-800"
                />
              </div>

              {/* Divertor Coil Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Divertor Coil:</span>
                  <span className="text-cyan-300 font-mono font-bold">{controls.divertorCoilCurrentKa.toFixed(0)} kA</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="1"
                  value={controls.divertorCoilCurrentKa}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateControls((prev) => ({ ...prev, divertorCoilCurrentKa: val }));
                  }}
                  className="w-full cursor-pointer h-1.5 rounded-lg bg-slate-800"
                />
              </div>
            </div>

            <div className="w-full md:w-64 font-mono text-[11px] space-y-1.5 text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 shrink-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400">ACTIVE VDE FEEDBACK:</span>
                <button
                  onClick={() =>
                    onUpdateControls((prev) => ({ ...prev, feedbackVdeEnabled: !prev.feedbackVdeEnabled }))
                  }
                  className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                    controls.feedbackVdeEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-900/60 text-rose-300 border border-rose-700'
                  }`}
                >
                  {controls.feedbackVdeEnabled ? 'ENABLED (ON)' : 'DISABLED (OFF)'}
                </button>
              </div>
              <div className="flex justify-between">
                <span>Vertical Position (ΔZ):</span>
                <span className={Math.abs(metrics.verticalDisplacementZMm) > 60 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {metrics.verticalDisplacementZMm > 0 ? `+${metrics.verticalDisplacementZMm.toFixed(1)}` : metrics.verticalDisplacementZMm.toFixed(1)} mm
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>VDE Limit:</span>
                <span>±180 mm (Wall Contact)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
