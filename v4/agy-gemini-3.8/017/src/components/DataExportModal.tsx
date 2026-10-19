import React, { useState } from 'react';
import { CollisionEvent, MassSpectrumBin } from '../types';
import { X, Download, Copy, Check, FileJson, FileSpreadsheet } from 'lucide-react';

interface DataExportModalProps {
  event: CollisionEvent | null;
  bins: MassSpectrumBin[];
  onClose: () => void;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({
  event,
  bins,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'JSON' | 'CSV_PARTICLES' | 'CSV_SPECTRUM'>('JSON');
  const [copied, setCopied] = useState(false);

  // Generate JSON Data
  const generateJSON = () => {
    if (!event) return '{}';
    return JSON.stringify(
      {
        experiment: '017',
        suite: 'COLLIDER-LAB',
        timestamp: new Date().toISOString(),
        event: {
          id: event.eventId,
          run: event.runId,
          sqrtsTeV: event.sqrts,
          process: event.processName,
          missingET_GeV: event.missingET.mag,
          missingET_phi: event.missingET.phi,
          totalScalarET_GeV: event.totalScalarET,
          jets: event.jets.map(j => ({
            id: j.id,
            pt: j.pt,
            eta: j.eta,
            phi: j.phi,
            mass: j.mass,
            coneR: j.coneRadius,
          })),
          reconstructedMasses: event.reconstructedMasses,
          particles: event.visibleParticles.map(p => ({
            name: p.name,
            symbol: p.symbol,
            charge: p.charge,
            massGeV: p.mass,
            px: p.px,
            py: p.py,
            pz: p.pz,
            E: p.E,
            pt: p.pt,
            eta: p.eta,
            phi: p.phi,
          })),
        },
      },
      null,
      2
    );
  };

  // Generate CSV for Particles
  const generateParticlesCSV = () => {
    if (!event) return '';
    const headers = 'Name,Symbol,Type,Charge,Mass_GeV,Px_GeV,Py_GeV,Pz_GeV,E_GeV,pT_GeV,Eta,Phi_rad\n';
    const rows = event.visibleParticles
      .map(
        p =>
          `"${p.name}","${p.symbol}","${p.type}",${p.charge},${p.mass.toFixed(4)},${p.px.toFixed(
            3
          )},${p.py.toFixed(3)},${p.pz.toFixed(3)},${p.E.toFixed(3)},${p.pt.toFixed(
            3
          )},${p.eta.toFixed(3)},${p.phi.toFixed(3)}`
      )
      .join('\n');
    return headers + rows;
  };

  // Generate CSV for Mass Spectrum
  const generateSpectrumCSV = () => {
    const headers = 'BinCenter_GeV,TotalCount,HiggsSignal,ZSignal,Background\n';
    const rows = bins
      .map(
        b =>
          `${b.centerGeV.toFixed(1)},${b.count},${b.higgsSignal},${b.zSignal},${b.background}`
      )
      .join('\n');
    return headers + rows;
  };

  const getContent = () => {
    if (activeTab === 'JSON') return generateJSON();
    if (activeTab === 'CSV_PARTICLES') return generateParticlesCSV();
    return generateSpectrumCSV();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = getContent();
    const ext = activeTab === 'JSON' ? 'json' : 'csv';
    const filename = `collider-lab-exp017-${Date.now()}.${ext}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
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
      <div className="bg-slate-900 border border-cyan-500/50 rounded-xl shadow-2xl max-w-2xl w-full flex flex-col font-sans overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Export Collider Telemetry & Kinematics
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-5 pt-3 flex gap-2 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('JSON')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-mono transition border-t border-x ${
              activeTab === 'JSON'
                ? 'bg-slate-900 border-slate-700 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Event JSON</span>
          </button>

          <button
            onClick={() => setActiveTab('CSV_PARTICLES')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-mono transition border-t border-x ${
              activeTab === 'CSV_PARTICLES'
                ? 'bg-slate-900 border-slate-700 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Particles (CSV)</span>
          </button>

          <button
            onClick={() => setActiveTab('CSV_SPECTRUM')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-mono transition border-t border-x ${
              activeTab === 'CSV_SPECTRUM'
                ? 'bg-slate-900 border-slate-700 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Mass Spectrum (CSV)</span>
          </button>
        </div>

        {/* Text Area Preview */}
        <div className="p-4 flex-1">
          <textarea
            readOnly
            value={getContent()}
            className="w-full h-72 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-300 resize-none focus:outline-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
