import React, { useState, useEffect } from 'react';
import { X, Copy, Download, Upload, Check, FileCode } from 'lucide-react';
import { CircuitGate, GateType } from '../types';

interface QasmInterchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  numQubits: number;
  gates: CircuitGate[];
  onLoadGates: (numQubits: number, gates: CircuitGate[]) => void;
}

export const QasmInterchangeModal: React.FC<QasmInterchangeModalProps> = ({
  isOpen,
  onClose,
  numQubits,
  gates,
  onLoadGates,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Generate OpenQASM 2.0 text
  const generateQasm = (): string => {
    let qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\n\n';
    qasm += `qreg q[${numQubits}];\n`;
    qasm += `creg c[${numQubits}];\n\n`;

    const sorted = [...gates].sort((a, b) => a.step - b.step);

    for (const g of sorted) {
      switch (g.type) {
        case 'H':
          qasm += `h q[${g.targetQubit}];\n`;
          break;
        case 'X':
          qasm += `x q[${g.targetQubit}];\n`;
          break;
        case 'Y':
          qasm += `y q[${g.targetQubit}];\n`;
          break;
        case 'Z':
          qasm += `z q[${g.targetQubit}];\n`;
          break;
        case 'S':
          qasm += `s q[${g.targetQubit}];\n`;
          break;
        case 'T':
          qasm += `t q[${g.targetQubit}];\n`;
          break;
        case 'TDAG':
          qasm += `tdg q[${g.targetQubit}];\n`;
          break;
        case 'RX':
          qasm += `rx(${(g.parameter ?? 0).toFixed(4)}) q[${g.targetQubit}];\n`;
          break;
        case 'RY':
          qasm += `ry(${(g.parameter ?? 0).toFixed(4)}) q[${g.targetQubit}];\n`;
          break;
        case 'RZ':
          qasm += `rz(${(g.parameter ?? 0).toFixed(4)}) q[${g.targetQubit}];\n`;
          break;
        case 'CNOT':
          qasm += `cx q[${g.controlQubits?.[0] ?? 0}],q[${g.targetQubit}];\n`;
          break;
        case 'CZ':
          qasm += `cz q[${g.controlQubits?.[0] ?? 0}],q[${g.targetQubit}];\n`;
          break;
        case 'CP':
          qasm += `cp(${(g.parameter ?? 0).toFixed(4)}) q[${g.controlQubits?.[0] ?? 0}],q[${g.targetQubit}];\n`;
          break;
        case 'SWAP':
          qasm += `swap q[${g.targetQubit}],q[${g.controlQubits?.[0] ?? 1}];\n`;
          break;
        case 'TOFFOLI':
          qasm += `ccx q[${g.controlQubits?.[0] ?? 0}],q[${g.controlQubits?.[1] ?? 1}],q[${g.targetQubit}];\n`;
          break;
        case 'CSWAP':
          qasm += `cswap q[${g.controlQubits?.[0] ?? 0}],q[${g.targetQubit}],q[${g.controlQubits?.[1] ?? 1}];\n`;
          break;
        case 'MEASURE':
          qasm += `measure q[${g.targetQubit}] -> c[${g.targetQubit}];\n`;
          break;
      }
    }

    return qasm;
  };

  const [qasmText, setQasmText] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setQasmText(generateQasm());
    }
  }, [isOpen, gates, numQubits]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(qasmText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([qasmText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `circuit_${Date.now()}.qasm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleParseAndLoad = () => {
    const lines = qasmText.split('\n');
    let detectedQubits = numQubits;
    const parsedGates: CircuitGate[] = [];
    let currentStepIndex = 0;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('//') || line.startsWith('OPENQASM') || line.startsWith('include'))
        continue;

      const qregMatch = line.match(/qreg\s+q\[(\d+)\]/);
      if (qregMatch) {
        detectedQubits = Math.max(1, Math.min(8, parseInt(qregMatch[1], 10)));
        continue;
      }

      // Single-qubit standard gates
      const hMatch = line.match(/^h\s+q\[(\d+)\]/i);
      if (hMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'H', targetQubit: parseInt(hMatch[1], 10), step: currentStepIndex++ });
        continue;
      }

      const xMatch = line.match(/^x\s+q\[(\d+)\]/i);
      if (xMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'X', targetQubit: parseInt(xMatch[1], 10), step: currentStepIndex++ });
        continue;
      }

      const yMatch = line.match(/^y\s+q\[(\d+)\]/i);
      if (yMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'Y', targetQubit: parseInt(yMatch[1], 10), step: currentStepIndex++ });
        continue;
      }

      const zMatch = line.match(/^z\s+q\[(\d+)\]/i);
      if (zMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'Z', targetQubit: parseInt(zMatch[1], 10), step: currentStepIndex++ });
        continue;
      }

      const sMatch = line.match(/^s\s+q\[(\d+)\]/i);
      if (sMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'S', targetQubit: parseInt(sMatch[1], 10), step: currentStepIndex++ });
        continue;
      }

      const tMatch = line.match(/^t\s+q\[(\d+)\]/i);
      if (tMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'T', targetQubit: parseInt(tMatch[1], 10), step: currentStepIndex++ });
        continue;
      }

      const tdgMatch = line.match(/^(?:tdg|tdag)\s+q\[(\d+)\]/i);
      if (tdgMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'TDAG', targetQubit: parseInt(tdgMatch[1], 10), step: currentStepIndex++ });
        continue;
      }

      // Single-qubit rotations
      const rxMatch = line.match(/^rx\(([^)]+)\)\s+q\[(\d+)\]/i);
      if (rxMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'RX', targetQubit: parseInt(rxMatch[2], 10), parameter: parseFloat(rxMatch[1]) || 0, step: currentStepIndex++ });
        continue;
      }

      const ryMatch = line.match(/^ry\(([^)]+)\)\s+q\[(\d+)\]/i);
      if (ryMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'RY', targetQubit: parseInt(ryMatch[2], 10), parameter: parseFloat(ryMatch[1]) || 0, step: currentStepIndex++ });
        continue;
      }

      const rzMatch = line.match(/^rz\(([^)]+)\)\s+q\[(\d+)\]/i);
      if (rzMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'RZ', targetQubit: parseInt(rzMatch[2], 10), parameter: parseFloat(rzMatch[1]) || 0, step: currentStepIndex++ });
        continue;
      }

      // Two-qubit gates
      const cxMatch = line.match(/^(?:cx|cnot)\s+q\[(\d+)\],\s*q\[(\d+)\]/i);
      if (cxMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'CNOT', targetQubit: parseInt(cxMatch[2], 10), controlQubits: [parseInt(cxMatch[1], 10)], step: currentStepIndex++ });
        continue;
      }

      const czMatch = line.match(/^cz\s+q\[(\d+)\],\s*q\[(\d+)\]/i);
      if (czMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'CZ', targetQubit: parseInt(czMatch[2], 10), controlQubits: [parseInt(czMatch[1], 10)], step: currentStepIndex++ });
        continue;
      }

      const cpMatch = line.match(/^cp\(([^)]+)\)\s+q\[(\d+)\],\s*q\[(\d+)\]/i);
      if (cpMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'CP', targetQubit: parseInt(cpMatch[3], 10), controlQubits: [parseInt(cpMatch[2], 10)], parameter: parseFloat(cpMatch[1]) || 0, step: currentStepIndex++ });
        continue;
      }

      const swapMatch = line.match(/^swap\s+q\[(\d+)\],\s*q\[(\d+)\]/i);
      if (swapMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'SWAP', targetQubit: parseInt(swapMatch[1], 10), controlQubits: [parseInt(swapMatch[2], 10)], step: currentStepIndex++ });
        continue;
      }

      // Three-qubit gates
      const ccxMatch = line.match(/^(?:ccx|toffoli)\s+q\[(\d+)\],\s*q\[(\d+)\],\s*q\[(\d+)\]/i);
      if (ccxMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'TOFFOLI', targetQubit: parseInt(ccxMatch[3], 10), controlQubits: [parseInt(ccxMatch[1], 10), parseInt(ccxMatch[2], 10)], step: currentStepIndex++ });
        continue;
      }

      const cswapMatch = line.match(/^(?:cswap|fredkin)\s+q\[(\d+)\],\s*q\[(\d+)\],\s*q\[(\d+)\]/i);
      if (cswapMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'CSWAP', targetQubit: parseInt(cswapMatch[2], 10), controlQubits: [parseInt(cswapMatch[1], 10), parseInt(cswapMatch[3], 10)], step: currentStepIndex++ });
        continue;
      }

      // Measurement
      const measureMatch = line.match(/^measure\s+q\[(\d+)\]/i);
      if (measureMatch) {
        parsedGates.push({ id: `g-${Date.now()}-${parsedGates.length}`, type: 'MEASURE', targetQubit: parseInt(measureMatch[1], 10), step: currentStepIndex++ });
        continue;
      }
    }

    if (parsedGates.length > 0) {
      onLoadGates(detectedQubits, parsedGates);
      onClose();
    } else {
      alert('No valid gates could be parsed. Check OpenQASM 2.0 syntax.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden text-gray-200 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-950 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-sm text-gray-100">OpenQASM 2.0 Interchange</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Editor Area */}
        <div className="p-4 space-y-3">
          <textarea
            value={qasmText}
            onChange={(e) => setQasmText(e.target.value)}
            className="w-full h-64 bg-gray-950 border border-gray-800 rounded-lg p-3 font-mono text-xs text-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded font-medium border border-gray-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded font-medium border border-gray-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD .QASM</span>
              </button>
            </div>

            <button
              onClick={handleParseAndLoad}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold shadow-md shadow-purple-600/30"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>PARSE & LOAD INTO SIMULATOR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
