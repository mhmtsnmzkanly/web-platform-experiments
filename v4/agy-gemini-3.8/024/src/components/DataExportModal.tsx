/**
 * POCKET-TERRARIUM (EXP-024) — Telemetry & Ecosystem Data Export Modal
 */

import React, { useState } from 'react';
import { TerrariumSimulationController } from '../core/TerrariumSimulationController';

interface DataExportModalProps {
  controller: TerrariumSimulationController;
  isOpen: boolean;
  onClose: () => void;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({
  controller,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'json' | 'csv'>('json');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const content =
    activeTab === 'json'
      ? controller.exportStateJson()
      : controller.exportEcosystemCsv();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], {
      type: activeTab === 'json' ? 'application/json' : 'text/csv',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pocket-terrarium-ecosystem-${Date.now()}.${activeTab}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📊</span>
            <div>
              <h2 className="text-sm font-bold text-slate-100 font-mono tracking-wide">
                ECOSYSTEM TELEMETRY & BIO-LEDGER EXPORT
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Export verified water chemistry ODE state & organism populations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/70 px-6 pt-2">
          <button
            onClick={() => setActiveTab('json')}
            className={`px-4 py-2 font-mono text-xs font-bold border-b-2 transition ${
              activeTab === 'json'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            JSON Ecosystem Snapshot
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`px-4 py-2 font-mono text-xs font-bold border-b-2 transition ${
              activeTab === 'csv'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            CSV Water Quality Ledger
          </button>
        </div>

        {/* Preview Code View */}
        <div className="flex-1 overflow-auto p-6 bg-slate-950/60">
          <pre className="font-mono text-xs text-emerald-400 bg-slate-900/90 p-4 rounded-xl border border-slate-800 overflow-x-auto whitespace-pre selection:bg-slate-700">
            {content}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950">
          <span className="text-xs font-mono text-slate-500">
            {content.length.toLocaleString()} bytes • UTF-8
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1.5 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <span>{copied ? '✓ Copied' : '📋 Copy to Clipboard'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center space-x-1.5 shadow"
            >
              <span>💾 Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
