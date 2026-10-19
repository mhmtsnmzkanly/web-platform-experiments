import React, { useState } from 'react';
import { X, Download, FileText, Check, Code2 } from 'lucide-react';
import { AirfoilProfile, AeroMetrics, ChordPressurePoint, PolarPoint } from '../types';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AirfoilProfile;
  metrics: AeroMetrics;
  chordPressure: ChordPressurePoint[];
  polarHistory: PolarPoint[];
}

export const DataExportModal: React.FC<DataExportModalProps> = ({
  isOpen,
  onClose,
  profile,
  metrics,
  chordPressure,
  polarHistory,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Export Chord Pressure Distribution CSV
  const handleExportPressureCsv = () => {
    let csv = '# AERO-TUNNEL Chord Pressure Distribution Export\n';
    csv += `# Airfoil: ${profile.name}\n`;
    csv += `# Angle of Attack: ${metrics.angleDeg} deg\n`;
    csv += `# Reynolds Number: ${metrics.reynolds.toFixed(0)}\n`;
    csv += 'x_norm,cp_upper,cp_lower\n';

    chordPressure.forEach((p) => {
      csv += `${p.xNorm.toFixed(4)},${p.cpUpper.toFixed(4)},${p.cpLower.toFixed(4)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pressure_dist_${profile.id}_alpha${metrics.angleDeg}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess('Pressure CSV downloaded!');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  // Export Polar History CSV
  const handleExportPolarCsv = () => {
    let csv = '# AERO-TUNNEL Polar Drag Curve Export\n';
    csv += `# Airfoil: ${profile.name}\n`;
    csv += 'alpha_deg,cl,cd,ld_ratio\n';

    polarHistory.forEach((p) => {
      csv += `${p.alphaDeg},${p.cl.toFixed(4)},${p.cd.toFixed(4)},${p.ld.toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `polar_curve_${profile.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess('Polar CSV downloaded!');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  // Export JSON Simulation State
  const handleExportJson = () => {
    const data = {
      timestamp: new Date().toISOString(),
      profile,
      metrics,
      chordPressure,
      polarHistory,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aero_state_${profile.id}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess('Simulation JSON downloaded!');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden text-slate-200 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold font-mono">
            <Download className="w-4 h-4 text-cyan-400" />
            <span>AERODYNAMIC TELEMETRY EXPORT</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Options */}
        <div className="p-4 space-y-3">
          <p className="text-slate-400 text-xs leading-relaxed">
            Export experimental computational aerodynamic observables, pressure coefficient curves $C_p(x)$, and lift-drag polar polars for external CFD benchmarking.
          </p>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleExportPressureCsv}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <div className="text-left">
                  <div className="font-bold text-slate-200">Chord Pressure Coefficient (CSV)</div>
                  <div className="text-[10px] text-slate-400">Surface x/c, upper suction Cp, and lower pressure Cp</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={handleExportPolarCsv}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div className="font-bold text-slate-200">Lift-Drag Polar Curve (CSV)</div>
                  <div className="text-[10px] text-slate-400">Angle of attack α vs CL, CD, and L/D polar bucket</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={handleExportJson}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <Code2 className="w-4 h-4 text-purple-400" />
                <div className="text-left">
                  <div className="font-bold text-slate-200">Complete Simulation Telemetry (JSON)</div>
                  <div className="text-[10px] text-slate-400">Full parameter state, Reynolds number, and metrics</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {downloadSuccess && (
            <div className="flex items-center space-x-1.5 p-2 rounded bg-emerald-950/80 border border-emerald-500/80 text-emerald-300 font-bold justify-center">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{downloadSuccess}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
