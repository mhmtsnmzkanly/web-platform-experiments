import React from 'react';
import {
  SuiteMode,
  ColormapMode,
  TdglParameters,
  JosephsonParameters,
  BecParameters,
  CryoFridgeParameters,
  SuperconductorMaterial,
} from '../types';
import { SUPERCONDUCTOR_SPECS } from '../cryo/CryogenicThermalEngine';
import {
  Sliders,
  Zap,
  Activity,
  Flame,
  Snowflake,
  RefreshCw,
  Trash2,
  Radio,
  ShieldAlert,
} from 'lucide-react';

interface CryoControlDeckProps {
  suiteMode: SuiteMode;
  colormapMode: ColormapMode;
  onSetColormapMode: (mode: ColormapMode) => void;
  tdglParams: TdglParameters;
  onUpdateTdglParams: (params: Partial<TdglParameters>) => void;
  josephsonParams: JosephsonParameters;
  onUpdateJosephsonParams: (params: Partial<JosephsonParameters>) => void;
  becParams: BecParameters;
  onUpdateBecParams: (params: Partial<BecParameters>) => void;
  cryoParams: CryoFridgeParameters;
  onUpdateCryoParams: (params: Partial<CryoFridgeParameters>) => void;
  onResetTdgl: () => void;
  onClearPinning: () => void;
  onRegenPinning: () => void;
  onResetBec: (isDoubleWell: boolean) => void;
  onTriggerQuench: () => void;
  onResetFridge: () => void;
}

export const CryoControlDeck: React.FC<CryoControlDeckProps> = ({
  suiteMode,
  colormapMode,
  onSetColormapMode,
  tdglParams,
  onUpdateTdglParams,
  josephsonParams,
  onUpdateJosephsonParams,
  becParams,
  onUpdateBecParams,
  cryoParams,
  onUpdateCryoParams,
  onResetTdgl,
  onClearPinning,
  onRegenPinning,
  onResetBec,
  onTriggerQuench,
  onResetFridge,
}) => {
  return (
    <div className="w-full bg-slate-900/90 border-t border-slate-800 p-3 text-xs select-none">
      {/* Colormap and Diagnostics Bar */}
      <div className="flex flex-wrap items-center justify-between pb-2 mb-2 border-b border-slate-800/80 gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-semibold tracking-wider flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            COLORMAP DIAGNOSTIC:
          </span>
          <div className="flex bg-slate-950 p-0.5 rounded border border-slate-700">
            <button
              onClick={() => onSetColormapMode('CYAN_SUPERCONDUCTING')}
              className={`px-2 py-0.5 rounded font-mono text-[11px] transition-colors ${
                colormapMode === 'CYAN_SUPERCONDUCTING'
                  ? 'bg-cyan-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ORDER |ψ|
            </button>
            <button
              onClick={() => onSetColormapMode('PHASE_WHEEL')}
              className={`px-2 py-0.5 rounded font-mono text-[11px] transition-colors ${
                colormapMode === 'PHASE_WHEEL'
                  ? 'bg-cyan-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PHASE θ
            </button>
            <button
              onClick={() => onSetColormapMode('MAGNETIC_FLUX')}
              className={`px-2 py-0.5 rounded font-mono text-[11px] transition-colors ${
                colormapMode === 'MAGNETIC_FLUX'
                  ? 'bg-cyan-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              FLUX Bz
            </button>
            <button
              onClick={() => onSetColormapMode('BEC_DENSITY')}
              className={`px-2 py-0.5 rounded font-mono text-[11px] transition-colors ${
                colormapMode === 'BEC_DENSITY'
                  ? 'bg-cyan-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              BEC DENSITY
            </button>
          </div>
        </div>
      </div>

      {/* --- TAB 1: TDGL VORTEX LATTICE --- */}
      {suiteMode === 'TDGL_VORTEX' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>T / Tc</span>
              <span className="text-cyan-400">{tdglParams.temperatureRatio.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.20"
              step="0.02"
              value={tdglParams.temperatureRatio}
              onChange={(e) => onUpdateTdglParams({ temperatureRatio: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>GL KAPPA κ</span>
              <span className="text-cyan-400">{tdglParams.kappa.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="10.0"
              step="0.2"
              value={tdglParams.kappa}
              onChange={(e) => onUpdateTdglParams({ kappa: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>COIL FIELD B_ext</span>
              <span className="text-cyan-400">{tdglParams.bExt.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.8"
              step="0.05"
              value={tdglParams.bExt}
              onChange={(e) => onUpdateTdglParams({ bExt: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>TRANSPORT J_ext</span>
              <span className="text-cyan-400">{tdglParams.jExt.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.2"
              step="0.05"
              value={tdglParams.jExt}
              onChange={(e) => onUpdateTdglParams({ jExt: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>PINNING SITES</span>
              <span className="text-cyan-400">{tdglParams.pinningDensity}</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="2"
              value={tdglParams.pinningDensity}
              onChange={(e) => {
                const count = parseInt(e.target.value);
                onUpdateTdglParams({ pinningDensity: count });
              }}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col justify-end space-y-1">
            <div className="flex space-x-1">
              <button
                onClick={onRegenPinning}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-1 rounded flex items-center justify-center gap-1 border border-slate-700 text-[10px]"
                title="Redistribute pinning defects"
              >
                <RefreshCw className="w-3 h-3 text-cyan-400" />
                DEFECTS
              </button>
              <button
                onClick={onClearPinning}
                className="bg-slate-800 hover:bg-slate-700 text-red-400 px-2 py-1 rounded border border-slate-700 text-[10px]"
                title="Clear all pinning defects"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <button
              onClick={onResetTdgl}
              className="bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 py-1 rounded border border-cyan-800 text-[10px] font-medium"
            >
              RESET STATE |ψ|
            </button>
          </div>
        </div>
      )}

      {/* --- TAB 2: JOSEPHSON SQUID & SHAPIRO STEPS --- */}
      {suiteMode === 'JOSEPHSON_SQUID' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>DC BIAS I / Ic</span>
              <span className="text-cyan-400">{josephsonParams.iDc.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.0"
              step="0.05"
              value={josephsonParams.iDc}
              onChange={(e) => onUpdateJosephsonParams({ iDc: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>RF MICROWAVE Irf</span>
              <span className="text-cyan-400">{josephsonParams.iRf.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.5"
              step="0.05"
              value={josephsonParams.iRf}
              onChange={(e) => onUpdateJosephsonParams({ iRf: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>FREQUENCY f_rf</span>
              <span className="text-cyan-400">{josephsonParams.fRf.toFixed(2)} GHz</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="3.0"
              step="0.05"
              value={josephsonParams.fRf}
              onChange={(e) => onUpdateJosephsonParams({ fRf: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>McCUMBER βc</span>
              <span className="text-cyan-400">{josephsonParams.betaC.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="8.0"
              step="0.1"
              value={josephsonParams.betaC}
              onChange={(e) => onUpdateJosephsonParams({ betaC: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>SQUID FLUX Φ/Φ0</span>
              <span className="text-cyan-400">{josephsonParams.squidFluxPhi.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-2.0"
              max="2.0"
              step="0.02"
              value={josephsonParams.squidFluxPhi}
              onChange={(e) => onUpdateJosephsonParams({ squidFluxPhi: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>ASYMMETRY α</span>
              <span className="text-cyan-400">{josephsonParams.asymmetryAlpha.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.4"
              step="0.02"
              value={josephsonParams.asymmetryAlpha}
              onChange={(e) => onUpdateJosephsonParams({ asymmetryAlpha: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* --- TAB 3: BEC SUPERFLUID MATTER-WAVE --- */}
      {suiteMode === 'BEC_SUPERFLUID' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>SCATTERING g</span>
              <span className="text-cyan-400">{becParams.scatteringG.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-2.0"
              max="5.0"
              step="0.2"
              value={becParams.scatteringG}
              onChange={(e) => onUpdateBecParams({ scatteringG: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>BARRIER V0</span>
              <span className="text-cyan-400">{becParams.barrierHeight.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="20.0"
              step="0.5"
              value={becParams.barrierHeight}
              onChange={(e) => onUpdateBecParams({ barrierHeight: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>TRAP ASPECT ωy/ωx</span>
              <span className="text-cyan-400">{becParams.trapAspect.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={becParams.trapAspect}
              onChange={(e) => onUpdateBecParams({ trapAspect: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>STIRRING SPEED</span>
              <span className="text-cyan-400">{becParams.stirringSpeed.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="4.0"
              step="0.2"
              value={becParams.stirringSpeed}
              onChange={(e) => onUpdateBecParams({ stirringSpeed: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex items-center space-x-2 pt-3">
            <button
              onClick={() => onUpdateBecParams({ stirringActive: !becParams.stirringActive })}
              className={`flex-1 py-1 rounded border text-[11px] font-mono transition-colors ${
                becParams.stirringActive
                  ? 'bg-cyan-600 text-white border-cyan-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              LASER STIR
            </button>
            <button
              onClick={() => onUpdateBecParams({ timeOfFlight: !becParams.timeOfFlight })}
              className={`flex-1 py-1 rounded border text-[11px] font-mono transition-colors ${
                becParams.timeOfFlight
                  ? 'bg-amber-600 text-white border-amber-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              TOF EXPAND
            </button>
          </div>

          <div className="flex flex-col justify-end space-y-1">
            <button
              onClick={() => onResetBec(true)}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-200 py-1 rounded border border-slate-700 text-[10px]"
            >
              DOUBLE WELL
            </button>
            <button
              onClick={() => onResetBec(false)}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-200 py-1 rounded border border-slate-700 text-[10px]"
            >
              SINGLE WELL
            </button>
          </div>
        </div>
      )}

      {/* --- TAB 4: DILUTION REFRIGERATOR & THERMAL QUENCH --- */}
      {suiteMode === 'DILUTION_FRIDGE' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <div className="text-slate-300 font-mono mb-1">MATERIAL SPEC</div>
            <select
              value={cryoParams.superconductorMaterial}
              onChange={(e) =>
                onUpdateCryoParams({
                  superconductorMaterial: e.target.value as SuperconductorMaterial,
                })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-cyan-300 font-mono text-[11px]"
            >
              <option value="YBCO">YBCO (Tc=93K, High-Tc)</option>
              <option value="NbTi">NbTi (Tc=9.2K, Standard)</option>
              <option value="Nb3Sn">Nb3Sn (Tc=18.3K, High-Field)</option>
              <option value="BSCCO">BSCCO (Tc=108K, Ceramic)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>MAGNET CURRENT</span>
              <span className="text-cyan-400">{cryoParams.magnetCurrentA.toFixed(0)} A</span>
            </div>
            <input
              type="range"
              min="0"
              max="240"
              step="5"
              value={cryoParams.magnetCurrentA}
              onChange={(e) => onUpdateCryoParams({ magnetCurrentA: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>3He FLOW RATE</span>
              <span className="text-cyan-400">{cryoParams.he3FlowRate.toFixed(0)} μmol/s</span>
            </div>
            <input
              type="range"
              min="20"
              max="400"
              step="10"
              value={cryoParams.he3FlowRate}
              onChange={(e) => onUpdateCryoParams({ he3FlowRate: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono">
              <span>HEATER LOAD</span>
              <span className="text-cyan-400">{cryoParams.heaterPower.toFixed(0)} μW</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={cryoParams.heaterPower}
              onChange={(e) => onUpdateCryoParams({ heaterPower: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col justify-end space-y-1">
            <button
              onClick={() => onUpdateCryoParams({ energyDumpActive: !cryoParams.energyDumpActive })}
              className={`py-1 rounded border text-[10px] font-mono transition-colors flex items-center justify-center gap-1 ${
                cryoParams.energyDumpActive
                  ? 'bg-amber-600 text-white border-amber-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-amber-300" />
              ENERGY DUMP {cryoParams.energyDumpActive ? 'ARMED' : 'OFF'}
            </button>
            <button
              onClick={onTriggerQuench}
              className="bg-red-950/80 hover:bg-red-900 text-red-200 py-1 rounded border border-red-800 text-[10px] font-mono flex items-center justify-center gap-1"
            >
              <Flame className="w-3 h-3 text-red-400" />
              TRIGGER QUENCH
            </button>
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={onResetFridge}
              className="bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 py-2 rounded border border-cyan-800 text-[10px] font-mono flex items-center justify-center gap-1"
            >
              <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
              RE-COOL & REFILL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
