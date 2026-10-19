import React, { useState } from 'react';
import { X, Copy, Download, Check } from 'lucide-react';
import { StellarSimulationState } from '../core/SimulationController.js';
import { StellarTelemetry } from '../types/index.js';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  simState: StellarSimulationState;
  telemetry: StellarTelemetry;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({
  isOpen,
  onClose,
  simState,
  telemetry,
}) => {
  const [exportFormat, setExportFormat] = useState<'JSON' | 'CSV'>('JSON');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateJson = (): string => {
    return JSON.stringify(
      {
        experiment: 'STELLAR-FORGE (EXP-018)',
        verificationProtocol: 'WBE V4 Hardening Protocol 2.0',
        timestamp: new Date().toISOString(),
        preset: simState.currentPreset,
        telemetry,
        stellarParameters: {
          massSolar: simState.massSolar,
          radiusSolar: simState.radiusSolar,
          polytropicIndexN: simState.polytropicIndexN,
          centralDensityKgM3: simState.centralDensityKgM3,
          centralPressurePa: simState.profile.centralPressurePa,
          centralTemperatureK: simState.profile.centralTemperatureK,
          composition: simState.composition,
          equationOfState: simState.equationOfState,
        },
        tovSolution: simState.tovSolution,
        radialProfilePoints: simState.profile.points,
        nuclearEmissivities: simState.luminosityResult.emissivities,
        supernovaAbundances: simState.supernovaState.abundances,
      },
      null,
      2
    );
  };

  const generateCsv = (): string => {
    let csv = '# STELLAR-FORGE EXP-018 Stellar Interior Radial Profile\n';
    csv += '# Mass (M_sun),Radius (R_sun),Polytropic Index n,Central Density (kg/m^3)\n';
    csv += `${simState.massSolar},${simState.radiusSolar},${simState.polytropicIndexN},${simState.centralDensityKgM3}\n\n`;
    csv += 'r_meters,radius_fraction,rho_kg_m3,pressure_pa,enclosed_mass_kg,mass_fraction,temperature_k\n';

    simState.profile.points.forEach((p) => {
      csv += `${p.r.toExponential(6)},${p.radiusFraction.toFixed(5)},${p.rho.toExponential(6)},${p.pressure.toExponential(6)},${p.enclosedMass.toExponential(6)},${p.massFraction.toFixed(5)},${p.temperature.toExponential(6)}\n`;
    });

    return csv;
  };

  const content = exportFormat === 'JSON' ? generateJson() : generateCsv();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: exportFormat === 'JSON' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stellar_forge_${simState.currentPreset.toLowerCase()}_data.${exportFormat.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-slate-100">Export Scientific Telemetry</h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              {simState.currentPreset}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setExportFormat('JSON')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                exportFormat === 'JSON'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              JSON Structure
            </button>
            <button
              onClick={() => setExportFormat('CSV')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                exportFormat === 'CSV'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Radial Profile CSV
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium shadow transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Code Content View */}
        <div className="flex-1 p-3 overflow-auto font-mono text-[11px] bg-slate-950 text-slate-300 select-all">
          <pre>{content}</pre>
        </div>
      </div>
    </div>
  );
};
