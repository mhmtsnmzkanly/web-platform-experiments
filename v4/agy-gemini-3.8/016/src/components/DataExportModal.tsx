import React, { useState } from 'react';
import {
  SuiteMode,
  GeodesicParams,
  LensingParams,
  GravitationalWaveParams,
  TelemetryMetrics,
} from '../types';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  suiteMode: SuiteMode;
  geodesicParams: GeodesicParams;
  lensingParams: LensingParams;
  gwParams: GravitationalWaveParams;
  telemetry: TelemetryMetrics;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({
  isOpen,
  onClose,
  suiteMode,
  geodesicParams,
  lensingParams,
  gwParams,
  telemetry,
}) => {
  const [exportFormat, setExportFormat] = useState<'JSON' | 'CSV'>('JSON');

  if (!isOpen) return null;

  const handleDownload = () => {
    let content = '';
    let filename = `relativity-lab-${suiteMode.toLowerCase()}-${Date.now()}`;
    let mimeType = 'text/plain';

    if (exportFormat === 'JSON') {
      const payload = {
        meta: {
          experiment: 'EXP-016 Relativity-Lab',
          timestamp: new Date().toISOString(),
          suiteMode,
        },
        geodesicParams,
        lensingParams,
        gwParams,
        telemetry,
      };
      content = JSON.stringify(payload, null, 2);
      filename += '.json';
      mimeType = 'application/json';
    } else {
      // CSV format
      filename += '.csv';
      mimeType = 'text/csv';
      const rows = [
        ['Parameter / Metric', 'Value', 'Unit / Note'],
        ['SuiteMode', suiteMode, ''],
        ['Schwarzschild Radius Rs', telemetry.schwarzschildRadiusRs.toString(), 'M'],
        ['Event Horizon Radius r+', telemetry.eventHorizonRadiusRplus.toString(), 'M'],
        ['Photon Sphere Radius r_ph', telemetry.photonSphereRadiusRph.toString(), 'M'],
        ['ISCO Radius', telemetry.iscoRadius.toString(), 'M'],
        ['Kerr Spin a*', geodesicParams.spinA.toString(), 'dimensionless'],
        ['Gravitational Redshift z', telemetry.gravitationalRedshiftZ.toString(), 'dimensionless'],
        ['GW Primary Mass m1', gwParams.primaryMassMsun.toString(), 'M_sun'],
        ['GW Secondary Mass m2', gwParams.secondaryMassMsun.toString(), 'M_sun'],
        ['GW Chirp Mass Mc', telemetry.gwChirpMassMsun.toString(), 'M_sun'],
        ['GW Peak Strain h0', telemetry.gwStrainPeak.toString(), 'dimensionless'],
        ['GW Frequency', telemetry.gwFrequencyHz.toString(), 'Hz'],
      ];
      content = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 text-slate-200 font-mono text-xs shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <h2 className="font-bold text-sm text-white">Export Relativity Telemetry</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Download the exact curved spacetime geometry parameters, Kerr ray-tracing metrics, and
            3.5PN gravitational wave strain observables.
          </p>

          <div>
            <label className="text-slate-400 block mb-1">Format</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setExportFormat('JSON')}
                className={`flex-1 py-1.5 px-3 rounded border text-center transition-colors ${
                  exportFormat === 'JSON'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                JSON Object
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('CSV')}
                className={`flex-1 py-1.5 px-3 rounded border text-center transition-colors ${
                  exportFormat === 'CSV'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                CSV Table
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors"
          >
            Download {exportFormat}
          </button>
        </div>
      </div>
    </div>
  );
};
