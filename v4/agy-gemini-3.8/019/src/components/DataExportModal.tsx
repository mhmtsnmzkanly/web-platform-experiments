/**
 * DataExportModal.tsx
 * Telemetry data export modal for BAND-FORGE.
 * Exports comprehensive solid-state band dispersions, DOS histograms,
 * topological invariants, and phonon dynamics as JSON and CSV.
 */

import React, { useState, useMemo } from 'react';
import { SimulationParameters, SimulationTelemetry } from '../types/index.js';
import { TightBindingSolver } from '../physics/TightBindingSolver.js';
import { PhononDispersionEngine } from '../physics/PhononDispersionEngine.js';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: SimulationParameters;
  telemetry: SimulationTelemetry;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({
  isOpen,
  onClose,
  params,
  telemetry
}) => {
  const [tab, setTab] = useState<'JSON' | 'CSV'>('JSON');
  const [copied, setCopied] = useState(false);

  // Generate Export Data
  const jsonContent = useMemo(() => {
    const path = TightBindingSolver.computeBandStructurePath(
      params.latticeType,
      { t: params.t, tp: params.tp, latticeParam: params.latticeConstant },
      40
    );

    const phonons = PhononDispersionEngine.samplePhononCurve({
      M1_amu: params.M1_amu,
      M2_amu: params.M2_amu,
      Cs: params.Cs_force,
      a_angstrom: params.latticeConstant
    }, 40);

    const data = {
      experiment: '019',
      name: 'BAND-FORGE',
      timestamp: new Date().toISOString(),
      parameters: params,
      telemetry,
      bandStructurePath: path.map(p => ({
        dist: p.dist,
        label: p.label || null,
        energies_eV: p.energies
      })),
      phononDispersion: phonons.map(p => ({
        q_inv_angstrom: p.q,
        omegaAcoustic_rad_ps: p.omegaAcoustic,
        omegaOptical_rad_ps: p.omegaOptical,
        vgAcoustic_km_s: p.vgAcoustic,
        vgOptical_km_s: p.vgOptical
      }))
    };

    return JSON.stringify(data, null, 2);
  }, [params, telemetry]);

  const csvContent = useMemo(() => {
    const path = TightBindingSolver.computeBandStructurePath(
      params.latticeType,
      { t: params.t, tp: params.tp, latticeParam: params.latticeConstant },
      40
    );

    let csv = '# BAND-FORGE Electronic Band Structure Telemetry\n';
    csv += `# Lattice: ${params.latticeType}, t: ${params.t} eV, EF: ${params.ef} eV\n`;
    csv += `# Chern: ${telemetry.chernNumber}, Winding: ${telemetry.windingNumber}, Bandgap: ${telemetry.bandGap.toFixed(4)} eV\n`;
    csv += 'k_distance_angstrom_inv,label,band_1_eV,band_2_eV\n';

    path.forEach(p => {
      const b1 = p.energies[0] !== undefined ? p.energies[0].toFixed(5) : '';
      const b2 = p.energies[1] !== undefined ? p.energies[1].toFixed(5) : '';
      csv += `${p.dist.toFixed(5)},"${p.label || ''}",${b1},${b2}\n`;
    });

    return csv;
  }, [params, telemetry]);

  if (!isOpen) return null;

  const contentToDisplay = tab === 'JSON' ? jsonContent : csvContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(contentToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = tab === 'JSON' ? 'band-forge-data.json' : 'band-forge-data.csv';
    const mimeType = tab === 'JSON' ? 'application/json' : 'text/csv';
    const blob = new Blob([contentToDisplay], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-100 text-sm">Export Solid-State & Condensed Matter Telemetry</span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
              EXP 019
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-xs">
              <button
                onClick={() => setTab('JSON')}
                className={`px-3 py-1 rounded-md font-mono ${
                  tab === 'JSON' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                JSON
              </button>
              <button
                onClick={() => setTab('CSV')}
                className={`px-3 py-1 rounded-md font-mono ${
                  tab === 'CSV' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                CSV
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-4 flex-1 overflow-auto bg-slate-950">
          <pre className="text-xs font-mono text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 overflow-x-auto select-all">
            {contentToDisplay}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900 border-t border-slate-800 text-xs">
          <span className="text-slate-500 font-mono">
            {tab === 'JSON' ? `${jsonContent.length} bytes (Full telemetry)` : `${csvContent.split('\n').length} lines (Path curve)`}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium transition-all"
            >
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-all shadow-md shadow-cyan-950/40"
            >
              Download File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
