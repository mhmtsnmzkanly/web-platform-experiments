import React, { useState } from 'react';
import { X, Download, FileText, Check, Code2 } from 'lucide-react';
import {
  FaultConfig,
  SeismographStation,
  SeismicMetrics,
  GeologyLayer,
} from '../types';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  fault: FaultConfig;
  stations: SeismographStation[];
  metrics: SeismicMetrics;
  geologyLayers: GeologyLayer[];
  tsunamiSurface: Float32Array;
  tsunamiBathymetry: Float32Array;
  oceanBathymetryKm: number;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({
  isOpen,
  onClose,
  fault,
  stations,
  metrics,
  geologyLayers,
  tsunamiSurface,
  tsunamiBathymetry,
  oceanBathymetryKm,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Export 4-Station Seismogram Waveforms CSV
  const handleExportSeismogramsCsv = () => {
    let csv = '# SEISMIC-LAB Seismograph Network Waveforms Export\n';
    csv += `# Earthquake Magnitude: Mw ${fault.momentMagnitudeMw.toFixed(1)}\n`;
    csv += `# Hypocenter: (${fault.hypocenterXKm} km, Depth ${fault.hypocenterDepthKm} km)\n`;
    csv += `# Fault Mechanism: ${fault.mechanism}\n`;
    csv += 'sample_index,time_sec,sta1_vx,sta1_vz,sta2_vx,sta2_vz,sta3_vx,sta3_vz,sta4_vx,sta4_vz\n';
    const maxLen = Math.max(...stations.map((s) => s.historyVz.length), 0);
    for (let i = 0; i < maxLen; i++) {
      const t = stations[0]?.historyTime?.[i] !== undefined
        ? stations[0].historyTime[i].toFixed(3)
        : (i * 0.066).toFixed(3);
      const v1x = stations[0]?.historyVx[i]?.toFixed(4) ?? '0.0000';
      const v1z = stations[0]?.historyVz[i]?.toFixed(4) ?? '0.0000';
      const v2x = stations[1]?.historyVx[i]?.toFixed(4) ?? '0.0000';
      const v2z = stations[1]?.historyVz[i]?.toFixed(4) ?? '0.0000';
      const v3x = stations[2]?.historyVx[i]?.toFixed(4) ?? '0.0000';
      const v3z = stations[2]?.historyVz[i]?.toFixed(4) ?? '0.0000';
      const v4x = stations[3]?.historyVx[i]?.toFixed(4) ?? '0.0000';
      const v4z = stations[3]?.historyVz[i]?.toFixed(4) ?? '0.0000';

      csv += `${i},${t},${v1x},${v1z},${v2x},${v2z},${v3x},${v3z},${v4x},${v4z}\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seismic_waveforms_Mw${fault.momentMagnitudeMw.toFixed(1)}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Exported Seismograms Waveform CSV!');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  // Export Tsunami Hydrodynamic Bathymetry & Wave Elevation CSV
  const handleExportTsunamiCsv = () => {
    let csv = '# SEISMIC-LAB Tsunami Hydrodynamics & Coastal Run-Up Export (SWE)\n';
    csv += `# Seafloor Uplift Rupture: ${fault.hypocenterXKm} km\n`;
    csv += `# Max Wave Height: ${metrics.tsunamiWaveHeightM.toFixed(2)} m\n`;
    csv += 'x_km,wave_elevation_m,depth_bathymetry_m\n';

    for (let x = 0; x < tsunamiSurface.length; x++) {
      csv += `${x},${tsunamiSurface[x].toFixed(4)},${tsunamiBathymetry[x].toFixed(1)}\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tsunami_hydrodynamics_profile_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Exported Tsunami Hydrodynamics CSV!');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  // Export Complete Earthquake Simulation State JSON
  const handleExportJson = () => {
    const data = {
      experimentId: '013',
      name: 'SEISMIC-LAB',
      timestamp: new Date().toISOString(),
      fault,
      metrics,
      stations: stations.map((s) => ({
        id: s.id,
        name: s.name,
        coordXKm: s.coordXKm,
        distanceKm: s.distanceKm,
        pArrivalSec: s.pArrivalSec,
        sArrivalSec: s.sArrivalSec,
        rayleighArrivalSec: s.rayleighArrivalSec,
        pgaG: s.pgaG,
        pgvCmS: s.pgvCmS,
      })),
      geologyLayers,
      tsunamiSummary: {
        oceanPresent: oceanBathymetryKm > 0,
        maxWaveHeightM: metrics.tsunamiWaveHeightM,
        propagationSpeedKmh: metrics.tsunamiSpeedKmh,
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seismic_lab_simulation_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Exported Simulation JSON!');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden font-sans">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2 text-orange-400 font-bold text-sm">
            <Download className="w-4 h-4" />
            <span>SEISMIC TELEMETRY & WAVEFORM EXPORT</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs text-slate-300">
          <p className="text-slate-400 text-[11px]">
            Export raw 3-component seismograms, P/S phase picks, tsunami shallow-water wave profiles, and elastodynamic fault rupture models.
          </p>

          <div className="space-y-2">
            <button
              onClick={handleExportSeismogramsCsv}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <div className="text-left">
                  <div className="font-bold text-slate-200">4-Station Seismograms (CSV)</div>
                  <div className="text-[10px] text-slate-400">Time t (s) vs Horizontal Vx and Vertical Vz</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400" />
            </button>

            {oceanBathymetryKm > 0 && (
              <button
                onClick={handleExportTsunamiCsv}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <div className="text-left">
                    <div className="font-bold text-slate-200">Tsunami Hydrodynamics (CSV)</div>
                    <div className="text-[10px] text-slate-400">Position x (km) vs Wave Height η and Depth H</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400" />
              </button>
            )}

            <button
              onClick={handleExportJson}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <Code2 className="w-4 h-4 text-orange-400" />
                <div className="text-left">
                  <div className="font-bold text-slate-200">Full Earthquake & Rupture State (JSON)</div>
                  <div className="text-[10px] text-slate-400">Hypocenter, Mw, strata layers, PGA/PGV metrics</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {downloadSuccess && (
            <div className="flex items-center space-x-1.5 p-2 rounded bg-orange-950/80 border border-orange-500/80 text-orange-300 font-bold justify-center">
              <Check className="w-4 h-4 text-orange-400" />
              <span>{downloadSuccess}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
