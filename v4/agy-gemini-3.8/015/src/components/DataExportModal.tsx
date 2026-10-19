import React, { useState } from 'react';
import {
  SuiteMode,
  TdglParameters,
  JosephsonParameters,
  BecParameters,
  CryoFridgeParameters,
  TelemetryMetrics,
} from '../types';
import { JosephsonJunctionEngine } from '../quantum/JosephsonJunctionEngine';
import { X, Copy, Download, Check } from 'lucide-react';

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  suiteMode: SuiteMode;
  tdglParams: TdglParameters;
  josephsonParams: JosephsonParameters;
  becParams: BecParameters;
  cryoParams: CryoFridgeParameters;
  metrics: TelemetryMetrics;
  josephsonEngine: JosephsonJunctionEngine;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({
  isOpen,
  onClose,
  suiteMode,
  tdglParams,
  josephsonParams,
  becParams,
  cryoParams,
  metrics,
  josephsonEngine,
}) => {
  const [exportFormat, setExportFormat] = useState<'JSON' | 'CSV'>('JSON');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateJsonData = () => {
    return JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        suiteMode,
        metrics,
        tdglParameters: tdglParams,
        josephsonParameters: josephsonParams,
        becParameters: becParams,
        cryoParameters: cryoParams,
        ivCurveData: josephsonEngine.ivCurve,
        squidCurveData: josephsonEngine.squidCurve,
      },
      null,
      2
    );
  };

  const generateCsvData = () => {
    let csv = '';
    if (suiteMode === 'JOSEPHSON_SQUID') {
      csv = 'Current_Normalized(I/Ic),Voltage_Normalized(V/IcR)\n';
      for (const pt of josephsonEngine.ivCurve) {
        csv += `${pt.current.toFixed(4)},${pt.voltage.toFixed(4)}\n`;
      }
      csv += '\nFlux_Normalized(Phi/Phi0),Squid_Voltage(V/IcR)\n';
      for (const pt of josephsonEngine.squidCurve) {
        csv += `${pt.flux.toFixed(4)},${pt.voltage.toFixed(4)}\n`;
      }
    } else {
      csv = 'Metric,Value,Unit\n';
      csv += `Order_Parameter_Avg,${metrics.orderParamAvg.toFixed(4)},a.u.\n`;
      csv += `Vortex_Count,${metrics.vortexCount},integer\n`;
      csv += `Supercurrent_Density,${metrics.supercurrentMag.toFixed(4)},a.u.\n`;
      csv += `Junction_Voltage,${metrics.junctionVoltageMilliV.toFixed(4)},mV\n`;
      csv += `SQUID_Sensitivity,${metrics.squidSensitivity.toFixed(4)},a.u.\n`;
      csv += `BEC_Condensate_Fraction,${(metrics.becCondensateFraction * 100).toFixed(2)},%\n`;
      csv += `BEC_Fringe_Visibility,${(metrics.becInterferenceVisibility * 100).toFixed(2)},%\n`;
      csv += `Mixing_Chamber_Temp,${(metrics.mixingChamberTempK * 1000).toFixed(2)},mK\n`;
      csv += `Cooling_Power,${metrics.coolingPowerMicroW.toFixed(2)},uW\n`;
      csv += `Stored_Magnetic_Energy,${metrics.storedMagneticEnergyKJ.toFixed(2)},kJ\n`;
    }
    return csv;
  };

  const dataContent = exportFormat === 'JSON' ? generateJsonData() : generateCsvData();

  const handleCopy = () => {
    navigator.clipboard.writeText(dataContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const mimeType = exportFormat === 'JSON' ? 'application/json' : 'text/csv';
    const filename = `cryo-lab-telemetry-${new Date().toISOString().replace(/[:.]/g, '-')}.${exportFormat.toLowerCase()}`;
    const blob = new Blob([dataContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-cyan-400 font-bold text-sm tracking-wide">
              QUANTUM TELEMETRY DATA EXPORT
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-300 font-mono">EXPORT FORMAT:</span>
            <div className="flex bg-slate-950 p-0.5 rounded border border-slate-700">
              <button
                onClick={() => setExportFormat('JSON')}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  exportFormat === 'JSON'
                    ? 'bg-cyan-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                JSON
              </button>
              <button
                onClick={() => setExportFormat('CSV')}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  exportFormat === 'CSV'
                    ? 'bg-cyan-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                CSV
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={dataContent}
              rows={14}
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-xs font-mono text-cyan-300 resize-none focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-2 px-4 py-3 border-t border-slate-800 bg-slate-950">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'COPIED!' : 'COPY CLIPBOARD'}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono flex items-center gap-1.5 transition-colors font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            DOWNLOAD FILE
          </button>
        </div>
      </div>
    </div>
  );
};
