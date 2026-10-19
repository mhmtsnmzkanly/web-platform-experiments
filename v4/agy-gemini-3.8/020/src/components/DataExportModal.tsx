/**
 * DATA EXPORT MODAL
 * COSMO-FORGE (EXP-020)
 * Exports complete cosmological telemetry in JSON and high-resolution CSV formats.
 */

import React, { useState, useMemo } from 'react';
import { CosmoParameters } from '../types';
import { FriedmannSolver } from '../physics/FriedmannSolver';
import { CmbAcousticEngine } from '../physics/CmbAcousticEngine';
import { BbnKineticsEngine } from '../physics/BbnKineticsEngine';
import { Copy, Download, Check, X, FileText, Code } from 'lucide-react';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: CosmoParameters;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({ isOpen, onClose, params }) => {
  const [format, setFormat] = useState<'JSON' | 'CSV'>('JSON');
  const [copied, setCopied] = useState(false);

  // Generate Export Payload
  const exportData = useMemo(() => {
    const Omega_r = FriedmannSolver.computeRadiationDensity(params);
    const Omega_k = FriedmannSolver.computeCurvatureDensity(params, Omega_r);
    const age_Gyr = FriedmannSolver.computeAgeOfUniverse(0, params);
    const q0 = FriedmannSolver.computeDeceleration(0, params);
    const z_acc = FriedmannSolver.findAccelerationRedshift(params);
    const cmbPeak = CmbAcousticEngine.computeFirstAcousticPeak(params);
    const bbn = BbnKineticsEngine.computeAbundances(params);

    if (format === 'JSON') {
      const payload = {
        experiment: '020',
        name: 'COSMO-FORGE',
        timestamp: new Date().toISOString(),
        cosmology: {
          H0_km_s_Mpc: params.H0,
          Omega_matter: params.Omega_m,
          Omega_baryon: params.Omega_b,
          Omega_dark_energy: params.Omega_L,
          Omega_radiation: Omega_r,
          Omega_curvature: Omega_k,
          w0: params.w0,
          wa: params.wa,
          T_CMB_K: params.T_CMB,
          age_of_universe_Gyr: age_Gyr,
          deceleration_q0: q0,
          turnaround_z_acc: z_acc,
        },
        cmb_acoustics: {
          recombination_zStar: cmbPeak.zStar,
          sound_horizon_rs_Mpc: cmbPeak.rs_Mpc,
          comoving_distance_dM_Mpc: cmbPeak.dM_Mpc,
          acoustic_scale_ell_A: cmbPeak.ell_A,
          primary_peak_ell1: cmbPeak.ell1,
        },
        primordial_bbn: {
          eta10: bbn.eta10,
          helium4_mass_fraction_Yp: bbn.Y_p,
          hydrogen_mass_fraction_Xp: bbn.X_p,
          deuterium_ratio_D_over_H: bbn.D_over_H,
          helium3_ratio_He3_over_H: bbn.He3_over_H,
          lithium7_ratio_Li7_over_H: bbn.Li7_over_H,
          neutron_proton_ratio_bbn: bbn.np_bbn,
        },
        dark_matter_halo: {
          profile_type: params.haloProfileType,
          rho0_Msun_kpc3: params.halo_rho0,
          scale_radius_rs_kpc: params.halo_rs_kpc,
          disk_mass_Msun: params.disk_mass_Msun,
          bulge_mass_Msun: params.bulge_mass_Msun,
        },
      };
      return JSON.stringify(payload, null, 2);
    } else {
      // CSV Format: Redshift evolution table
      let csv = '# COSMO-FORGE EXP-020 FLRW Cosmological Distances & Expansion Table\n';
      csv += `# H0=${params.H0}, Omega_m=${params.Omega_m}, Omega_L=${params.Omega_L}, w0=${params.w0}\n`;
      csv += 'redshift_z,scale_factor_a,H_z_km_s_Mpc,deceleration_q,dL_Mpc,dA_Mpc,chi_Mpc,mu_mag,lookback_time_Gyr\n';

      const steps = 60;
      for (let i = 0; i <= steps; i++) {
        const z = (i / steps) * 6.0;
        const d = FriedmannSolver.computeDistances(z, params);
        const a = 1.0 / (1.0 + z);
        csv += `${z.toFixed(3)},${a.toFixed(5)},${d.Hz_km_s_Mpc.toFixed(2)},${d.qz.toFixed(4)},${d.dL_Mpc.toFixed(2)},${d.dA_Mpc.toFixed(2)},${d.chi_Mpc.toFixed(2)},${d.mu_mag.toFixed(3)},${d.lookbackTime_Gyr.toFixed(3)}\n`;
      }
      return csv;
    }
  }, [format, params]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(exportData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([exportData], { type: format === 'JSON' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cosmo-forge-exp020-${new Date().toISOString().slice(0, 10)}.${format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-slate-100">
              Export Physical Cosmology Telemetry
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector Bar */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFormat('JSON')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-all ${
                format === 'JSON'
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              JSON Parameters
            </button>
            <button
              onClick={() => setFormat('CSV')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-all ${
                format === 'CSV'
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              CSV Distance Table
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-md border border-slate-700 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-md transition-all shadow-sm shadow-cyan-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300">
          <pre className="whitespace-pre overflow-x-auto leading-relaxed">{exportData}</pre>
        </div>
      </div>
    </div>
  );
};
