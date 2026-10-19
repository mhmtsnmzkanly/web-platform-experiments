/**
 * PONTIFEX (EXP-021) — Data Export Modal
 * Exports complete structural truss mechanics, node coordinates,
 * member stress telemetry, and budget calculations in JSON & CSV formats.
 */

import React, { useState, useMemo } from 'react';
import { BridgeSimulationController } from '../core/BridgeSimulationController';
import { Copy, Download, Check, X, FileText, Code } from 'lucide-react';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  controller: BridgeSimulationController;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({ isOpen, onClose, controller }) => {
  const [format, setFormat] = useState<'JSON' | 'CSV'>('JSON');
  const [copied, setCopied] = useState(false);

  const exportData = useMemo(() => {
    const lvl = controller.currentLevel;
    if (format === 'JSON') {
      const payload = {
        experiment: '021',
        title: 'PONTIFEX — 2D Truss Structural Mechanics',
        timestamp: new Date().toISOString(),
        level: {
          id: lvl.id,
          name: lvl.name,
          subtitle: lvl.subtitle,
          budget: lvl.budget,
          currentCost: controller.metrics.currentCost,
          vehicle: lvl.vehicle,
          status: controller.metrics.status,
          maxStressRatio: controller.metrics.maxStress,
        },
        nodes: controller.nodes.map((n) => ({
          id: n.id,
          x: Math.round(n.x * 1000) / 1000,
          y: Math.round(n.y * 1000) / 1000,
          mass_kg: Math.round(n.mass * 10) / 10,
          isAnchor: n.isAnchor,
        })),
        members: controller.members.map((m) => ({
          id: m.id,
          nodeA: m.nodeAId,
          nodeB: m.nodeBId,
          material: m.material,
          restLength_m: Math.round(m.restLength * 1000) / 1000,
          currentLength_m: Math.round(m.currentLength * 1000) / 1000,
          force_N: Math.round(m.force * 10) / 10,
          stressRatio: Math.round(m.stress * 1000) / 1000,
          isBroken: m.isBroken,
        })),
      };
      return JSON.stringify(payload, null, 2);
    } else {
      // CSV Format: Member Connectivity & Stress Table
      let csv = '# PONTIFEX EXP-021 Structural Truss Member & Stress Table\n';
      csv += `# Level=${lvl.id} (${lvl.name}), Budget=$${lvl.budget}, Cost=$${controller.metrics.currentCost}\n`;
      csv += 'member_id,node_a,node_b,material,rest_length_m,current_length_m,force_N,stress_ratio,is_broken\n';
      controller.members.forEach((m) => {
        csv += `${m.id},${m.nodeAId},${m.nodeBId},${m.material},${m.restLength.toFixed(3)},${m.currentLength.toFixed(3)},${m.force.toFixed(1)},${m.stress.toFixed(3)},${m.isBroken}\n`;
      });
      return csv;
    }
  }, [controller.currentLevel, controller.members, controller.metrics, controller.nodes, format]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(exportData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([exportData], { type: format === 'JSON' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pontifex-bridge-lvl${controller.currentLevel.id}.${format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-slate-100">Export Bridge Structural Telemetry</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector Bar */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFormat('JSON')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-all ${
                format === 'JSON' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              JSON Truss Graph
            </button>
            <button
              onClick={() => setFormat('CSV')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-all ${
                format === 'CSV' ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              CSV Stress Table
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-md border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-md transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300">
          <pre className="whitespace-pre overflow-x-auto leading-relaxed">{exportData}</pre>
        </div>
      </div>
    </div>
  );
};
