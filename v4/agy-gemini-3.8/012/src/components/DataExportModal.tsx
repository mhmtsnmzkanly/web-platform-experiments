import React, { useState } from 'react';
import { X, Download, FileText, Check, Code2 } from 'lucide-react';
import {
  OpticsSuiteMode,
  OpticalSourceConfig,
  OpticsMetrics,
  CrossSectionPoint,
  SpectrumPoint,
  ThinFilmConfig,
} from '../types';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  suiteMode: OpticsSuiteMode;
  source: OpticalSourceConfig;
  metrics: OpticsMetrics;
  crossSection: CrossSectionPoint[];
  spectrumData: SpectrumPoint[];
  thinFilmConfig: ThinFilmConfig;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({
  isOpen,
  onClose,
  suiteMode,
  source,
  metrics,
  crossSection,
  spectrumData,
  thinFilmConfig,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Export Detector Intensity Profile CSV
  const handleExportIntensityCsv = () => {
    let csv = '# OPTICA-FORGE Detector Intensity Profile Export\n';
    csv += `# Suite Mode: ${suiteMode}\n`;
    csv += `# Wavelength: ${source.wavelengthNm} nm\n`;
    csv += `# Peak Intensity: ${metrics.peakIntensity.toFixed(4)}\n`;
    csv += `# Fringe Visibility: ${(metrics.fringeVisibility * 100).toFixed(2)}%\n`;
    csv += 'coord_mm,intensity,phase_rad\n';

    crossSection.forEach((p) => {
      csv += `${p.coordMm.toFixed(4)},${p.intensity.toFixed(6)},${p.phase.toFixed(4)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optics_intensity_${suiteMode}_${source.wavelengthNm}nm.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Exported Detector Profile CSV!');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  // Export Thin-Film Spectrum CSV
  const handleExportSpectrumCsv = () => {
    let csv = '# OPTICA-FORGE Thin-Film Spectrum Export (Transfer Matrix Method)\n';
    csv += `# Incident Angle: ${thinFilmConfig.incidentAngleDeg} deg\n`;
    csv += `# Polarization: ${thinFilmConfig.polarization}\n`;
    csv += `# Substrate Index: ${thinFilmConfig.substrateIndex}\n`;
    csv += `# Layer Count: ${thinFilmConfig.layers.length}\n`;
    csv += 'wavelength_nm,reflectance,transmittance\n';

    spectrumData.forEach((p) => {
      csv += `${p.wavelengthNm.toFixed(1)},${p.reflectance.toFixed(6)},${p.transmittance.toFixed(6)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thinfilm_spectrum_${thinFilmConfig.layers.length}layers_${thinFilmConfig.incidentAngleDeg}deg.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Exported Thin-Film Spectrum CSV!');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  // Export Full Optical Bench State JSON
  const handleExportJson = () => {
    const data = {
      experimentId: '012',
      name: 'OPTICA-FORGE',
      timestamp: new Date().toISOString(),
      suiteMode,
      source,
      metrics,
      thinFilmConfig,
      detectorPointsSample: crossSection.slice(0, 30),
      spectrumPointsSample: spectrumData.slice(0, 30),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optica_bench_telemetry_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Exported Simulation JSON!');
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden font-sans">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <Download className="w-4 h-4" />
            <span>OPTICAL BENCH TELEMETRY EXPORT</span>
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
            Export numerical wave intensity profiles, thin-film spectra, and optical state matrices.
          </p>

          <div className="space-y-2">
            <button
              onClick={handleExportIntensityCsv}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <div className="text-left">
                  <div className="font-bold text-slate-200">Detector Intensity Profile (CSV)</div>
                  <div className="text-[10px] text-slate-400">Position y (mm) vs Intensity I(y) and Phase φ</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={handleExportSpectrumCsv}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <div className="font-bold text-slate-200">Thin-Film Reflection Spectrum (CSV)</div>
                  <div className="text-[10px] text-slate-400">Wavelength λ (380-780nm) vs R(λ) and T(λ)</div>
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
                  <div className="font-bold text-slate-200">Full Optical Bench State (JSON)</div>
                  <div className="text-[10px] text-slate-400">Parameters, metrics, layers, and telemetry</div>
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
