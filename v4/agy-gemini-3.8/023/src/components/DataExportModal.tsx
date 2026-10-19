/**
 * MARBLE-FORGE (EXP-023) — Telemetry & Contraption Data Export Modal
 */

import React, { useState } from 'react';
import { MarbleSimulationController } from '../core/MarbleSimulationController';

interface DataExportModalProps {
  controller: MarbleSimulationController;
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
      : controller.exportContraptionCsv();

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
    a.download = `marble-forge-contraption-${Date.now()}.${activeTab}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center space-x-3">
            <span className="text-xl">📊</span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Kinetic Telemetry & Contraption Export
              </h2>
              <p className="text-xs text-neutral-400">
                Track elements, mechanical energetics, and marble kinematic states
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-neutral-800 px-6 pt-3 bg-neutral-950">
          <button
            onClick={() => setActiveTab('json')}
            className={`pb-2 px-4 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition ${
              activeTab === 'json'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            JSON Full Snapshot
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`pb-2 px-4 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition ${
              activeTab === 'csv'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            CSV Element Ledger
          </button>
        </div>

        {/* Code Content Preview */}
        <div className="flex-1 overflow-auto p-6 bg-neutral-950/60">
          <pre className="font-mono text-xs text-emerald-400 bg-neutral-900/90 p-4 rounded-lg border border-neutral-800 overflow-x-auto whitespace-pre selection:bg-neutral-700">
            {content}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-950">
          <span className="text-xs font-mono text-neutral-500">
            {content.length.toLocaleString()} bytes • UTF-8
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition flex items-center space-x-1.5 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
              }`}
            >
              <span>{copied ? '✓ Copied' : '📋 Copy to Clipboard'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-black transition flex items-center space-x-1.5 shadow"
            >
              <span>💾 Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
