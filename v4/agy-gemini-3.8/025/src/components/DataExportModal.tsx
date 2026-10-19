/**
 * ORBITAL-SLINGSHOT (EXP-025) — Data Export Modal
 * JSON Mission Snapshot & CSV Flight Ledger Export
 */

import React, { useState } from 'react';
import { OrbitalSimulationController } from '../core/OrbitalSimulationController';

interface DataExportModalProps {
  controller: OrbitalSimulationController;
  isOpen: boolean;
  onClose: () => void;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({
  controller,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'JSON' | 'CSV'>('JSON');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const jsonData = controller.exportMissionJson();
  const csvData = controller.exportFlightLedgerCsv();
  const currentContent = activeTab === 'JSON' ? jsonData : csvData;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `orbital-slingshot-${controller.currentScenario.id}-${Date.now()}.${
      activeTab.toLowerCase()
    }`;
    const blob = new Blob([currentContent], {
      type: activeTab === 'JSON' ? 'application/json' : 'text/csv',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-white tracking-wider uppercase font-mono">
              Flight Telemetry Ledger
            </h2>
            <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => setActiveTab('JSON')}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                  activeTab === 'JSON'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                JSON
              </button>
              <button
                onClick={() => setActiveTab('CSV')}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                  activeTab === 'CSV'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                CSV
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Code Content View */}
        <div className="p-4 flex-1 overflow-auto bg-slate-950">
          <pre className="text-[11px] font-mono text-cyan-300 whitespace-pre-wrap select-text leading-relaxed">
            {currentContent}
          </pre>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono">
            Format: {activeTab} | Mission: {controller.currentScenario.title}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
            >
              {copied ? '✓ Copied' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Download File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
