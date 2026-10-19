/**
 * PLASMA-LAB: Comprehensive Data Export Modal (CSV & JSON)
 */

import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, Atom, Layers } from 'lucide-react';
import {
  TokamakGeometry,
  PlasmaControls,
  TokamakMetrics,
  RadialProfilePoint,
} from '../types';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  geom: TokamakGeometry;
  controls: PlasmaControls;
  metrics: TokamakMetrics;
  radialProfiles: RadialProfilePoint[];
}

export const DataExportModal: React.FC<DataExportModalProps> = ({
  isOpen,
  onClose,
  geom,
  controls,
  metrics,
  radialProfiles,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Export 1D Radial Profiles CSV
  const handleExportProfilesCsv = () => {
    let csv = '# PLASMA-LAB Tokamak Radial Profiles Export\n';
    csv += `# Geometry: R0 = ${geom.majorRadiusR0} m, a = ${geom.minorRadiusA} m, kappa = ${geom.elongationKappa}, delta = ${geom.triangularityDelta}\n`;
    csv += `# Toroidal Field: ${geom.toroidalFieldB0} T, Plasma Current: ${geom.plasmaCurrentIp} MA\n`;
    csv += 'norm_radius_r_over_a,radius_m,safety_factor_q,electron_temp_kev,ion_temp_kev,density_10e20_m3,pressure_kpa,current_density_ma_m2,magnetic_shear\n';

    for (const pt of radialProfiles) {
      csv += `${pt.normRadius.toFixed(4)},${pt.radiusM.toFixed(4)},${pt.qValue.toFixed(4)},${pt.teKev.toFixed(3)},${pt.tiKev.toFixed(3)},${pt.densityN20.toFixed(4)},${pt.pressureKPa.toFixed(2)},${pt.currentDensityMaM2.toFixed(3)},${pt.shear.toFixed(4)}\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tokamak_radial_profiles_Ip${geom.plasmaCurrentIp}MA_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Exported Radial Profiles CSV!');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  // Export Power & Energy Balance CSV
  const handleExportPowerBalanceCsv = () => {
    let csv = '# PLASMA-LAB Thermonuclear Power & Energy Balance Telemetry\n';
    csv += `# Simulation Time: ${metrics.simTimeSec.toFixed(2)} s\n`;
    csv += 'metric_name,value,unit\n';
    csv += `fusion_power_pfus,${metrics.fusionPowerMw.toFixed(3)},MW\n`;
    csv += `alpha_heating_palpha,${metrics.alphaPowerMw.toFixed(3)},MW\n`;
    csv += `auxiliary_heating_paux,${metrics.auxiliaryPowerMw.toFixed(3)},MW\n`;
    csv += `radiated_power_prad,${metrics.radiatedPowerMw.toFixed(3)},MW\n`;
    csv += `stored_thermal_energy_wth,${metrics.storedThermalEnergyMj.toFixed(3)},MJ\n`;
    csv += `energy_confinement_time_tauE,${metrics.confinementTimeTauESec.toFixed(3)},s\n`;
    csv += `fusion_amplification_q,${metrics.qFactor.toFixed(3)},dimensionless\n`;
    csv += `lawson_triple_product,${metrics.lawsonParameter.toFixed(3)},10e20_keV_s_m3\n`;
    csv += `troyon_normalized_beta_betaN,${metrics.troyonBetaN.toFixed(3)},dimensionless\n`;
    csv += `greenwald_fraction,${metrics.greenwaldFraction.toFixed(3)},dimensionless\n`;
    csv += `safety_factor_q95,${metrics.q95.toFixed(3)},dimensionless\n`;
    csv += `safety_factor_q0,${metrics.q0.toFixed(3)},dimensionless\n`;
    csv += `vertical_displacement_dz,${metrics.verticalDisplacementZMm.toFixed(2)},mm\n`;
    csv += `tearing_island_width,${metrics.tearingIslandWidthCm.toFixed(2)},cm\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tokamak_power_balance_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Exported Power Balance CSV!');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  // Export Full JSON Reactor State
  const handleExportJson = () => {
    const data = {
      experiment: '014',
      name: 'PLASMA-LAB',
      exportTimestamp: new Date().toISOString(),
      geometry: geom,
      controls,
      metrics,
      radialProfilesSample: radialProfiles.slice(0, 30),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tokamak_reactor_state_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Exported Reactor State JSON!');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-5 text-slate-200 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Atom className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-sm tracking-wide text-white">
              EXPORT TOKAMAK DATA & TELEMETRY
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback message banner */}
        {downloadSuccess && (
          <div className="mt-3 p-2 bg-emerald-950/80 border border-emerald-700/80 rounded flex items-center space-x-2 text-xs text-emerald-300 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Export Options */}
        <div className="mt-4 space-y-3">
          {/* 1. Radial Profiles CSV */}
          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-semibold text-xs text-purple-300 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Radial Profiles (CSV)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Discrete 1D profiles: q(r), Te(r), Ti(r), ne(r), pressure p(r), and current Jφ(r) (60 grid points).
              </p>
            </div>
            <button
              onClick={handleExportProfilesCsv}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs cursor-pointer transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>

          {/* 2. Power Balance CSV */}
          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-semibold text-xs text-rose-300 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Power Balance & Energy Loss (CSV)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                P_fus, P_alpha, P_aux, P_rad, W_th, tau_E, Q factor, and Lawson criterion metrics.
              </p>
            </div>
            <button
              onClick={handleExportPowerBalanceCsv}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs cursor-pointer transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>

          {/* 3. Reactor State JSON */}
          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-semibold text-xs text-cyan-300 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Full Tokamak State (JSON)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Complete configuration including geometry, coil currents, controls, and active plasma observables.
              </p>
            </div>
            <button
              onClick={handleExportJson}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs cursor-pointer transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
