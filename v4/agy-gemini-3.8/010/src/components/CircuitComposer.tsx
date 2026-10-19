import React, { useState } from 'react';
import { CircuitGate, GateType } from '../types';
import { GATE_DEFINITIONS } from '../quantum/QuantumGates';
import { Trash2, Plus, Sparkles, X } from 'lucide-react';

interface CircuitComposerProps {
  numQubits: number;
  gates: CircuitGate[];
  currentStep: number;
  maxStep: number;
  onAddGate: (gate: CircuitGate) => void;
  onRemoveGate: (gateId: string) => void;
  onClearCircuit: () => void;
  onSelectStep: (step: number) => void;
}

const PALETTE_GATES: GateType[] = [
  'H',
  'X',
  'Y',
  'Z',
  'S',
  'T',
  'TDAG',
  'RX',
  'RY',
  'RZ',
  'CNOT',
  'CZ',
  'CP',
  'SWAP',
  'TOFFOLI',
  'MEASURE',
];

export const CircuitComposer: React.FC<CircuitComposerProps> = ({
  numQubits,
  gates,
  currentStep,
  maxStep,
  onAddGate,
  onRemoveGate,
  onClearCircuit,
  onSelectStep,
}) => {
  const [selectedGateType, setSelectedGateType] = useState<GateType>('H');
  const [rotationAngle, setRotationAngle] = useState<number>(Math.PI / 2);
  const [controlQubit, setControlQubit] = useState<number>(0);

  const totalCols = Math.max(14, maxStep + 3);

  const handleCellClick = (qubitIndex: number, colIndex: number) => {
    // Check if a gate already exists here
    const existing = gates.find((g) => g.step === colIndex && g.targetQubit === qubitIndex);
    if (existing) {
      onRemoveGate(existing.id);
      return;
    }

    const def = GATE_DEFINITIONS[selectedGateType];
    const newGate: CircuitGate = {
      id: `gate-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: selectedGateType,
      targetQubit: qubitIndex,
      step: colIndex,
      parameter:
        selectedGateType === 'RX' ||
        selectedGateType === 'RY' ||
        selectedGateType === 'RZ' ||
        selectedGateType === 'CP'
          ? rotationAngle
          : undefined,
      controlQubits:
        def.numQubits === 2
          ? [controlQubit === qubitIndex ? (qubitIndex === 0 ? 1 : 0) : controlQubit]
          : def.numQubits === 3
          ? Array.from({ length: numQubits }, (_, i) => i)
              .filter((q) => q !== qubitIndex)
              .slice(0, 2)
          : undefined,
    };

    onAddGate(newGate);
  };

  return (
    <div className="w-full flex flex-col bg-gray-950/80 backdrop-blur border-b border-gray-800 p-3 select-none text-xs">
      {/* Palette Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-gray-800/80">
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          <span className="text-[10px] uppercase font-bold text-gray-500 mr-1">GATE PALETTE:</span>
          {PALETTE_GATES.map((gType) => {
            const def = GATE_DEFINITIONS[gType];
            const isSelected = selectedGateType === gType;
            return (
              <button
                key={gType}
                onClick={() => setSelectedGateType(gType)}
                title={`${def.name}: ${def.description}`}
                className={`px-2 py-1 rounded font-mono font-bold transition-all text-xs cursor-pointer border ${
                  isSelected
                    ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-600/30 scale-105'
                    : 'bg-gray-900 border-gray-700 hover:border-purple-500 text-gray-300 hover:bg-gray-800'
                }`}
              >
                {def.symbol}
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2">
          {/* Angle slider for rotation gates */}
          {(selectedGateType === 'RX' ||
            selectedGateType === 'RY' ||
            selectedGateType === 'RZ' ||
            selectedGateType === 'CP') && (
            <div className="flex items-center space-x-1.5 bg-gray-900 px-2 py-1 rounded border border-gray-800">
              <span className="text-[10px] text-gray-400 font-mono">θ:</span>
              <input
                type="range"
                min="0"
                max={Math.PI * 2}
                step="0.05"
                value={rotationAngle}
                onChange={(e) => setRotationAngle(parseFloat(e.target.value))}
                className="w-20 h-1 bg-gray-700 rounded cursor-pointer"
              />
              <span className="text-[10px] font-mono text-purple-400">
                {(rotationAngle / Math.PI).toFixed(2)}π
              </span>
            </div>
          )}

          {/* Control Qubit Picker for 2-Qubit Gates */}
          {GATE_DEFINITIONS[selectedGateType].numQubits === 2 && (
            <div className="flex items-center space-x-1 bg-gray-900 px-2 py-1 rounded border border-gray-800 text-[10px]">
              <span className="text-gray-400">Ctrl:</span>
              <select
                value={controlQubit}
                onChange={(e) => setControlQubit(parseInt(e.target.value))}
                className="bg-gray-800 text-purple-300 rounded px-1 py-0.5 border border-gray-700"
              >
                {Array.from({ length: numQubits }, (_, i) => (
                  <option key={i} value={i}>
                    q[{i}]
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={onClearCircuit}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-gray-900 hover:bg-rose-950/40 text-gray-400 hover:text-rose-300 border border-gray-800 hover:border-rose-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CLEAR</span>
          </button>
        </div>
      </div>

      {/* Circuit Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-fit flex flex-col space-y-3 relative py-2">
          {/* Step numbers header */}
          <div className="flex items-center ml-14 space-x-1">
            {Array.from({ length: totalCols }, (_, col) => (
              <button
                key={col}
                onClick={() => onSelectStep(col)}
                className={`w-9 text-center font-mono text-[10px] transition-colors rounded py-0.5 cursor-pointer ${
                  currentStep === col
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'
                }`}
              >
                {col}
              </button>
            ))}
          </div>

          {/* Qubit wires */}
          {Array.from({ length: numQubits }, (_, qIdx) => (
            <div key={qIdx} className="flex items-center space-x-2 relative group">
              {/* Qubit label with click-to-flip starting state */}
              <button
                onClick={() => {
                  const existingX = gates.find(
                    (g) => g.step === 0 && g.targetQubit === qIdx && g.type === 'X'
                  );
                  if (existingX) {
                    onRemoveGate(existingX.id);
                  } else {
                    onAddGate({
                      id: `init-x-${qIdx}-${Date.now()}`,
                      type: 'X',
                      targetQubit: qIdx,
                      step: 0,
                    });
                  }
                }}
                title="Click to toggle initial state between |0⟩ and |1⟩"
                className="w-14 text-right font-mono font-bold px-1 py-0.5 rounded text-gray-400 hover:text-purple-300 hover:bg-gray-800/80 text-xs flex-shrink-0 transition-colors cursor-pointer"
              >
                q[{qIdx}] |{gates.some((g) => g.step === 0 && g.targetQubit === qIdx && g.type === 'X') ? '1' : '0'}⟩
              </button>

              {/* Wire line & Gate slots */}
              <div className="relative flex items-center space-x-1">
                {/* Background horizontal wire line */}
                <div className="absolute left-0 right-0 h-0.5 bg-gray-700 z-0" />

                {Array.from({ length: totalCols }, (_, col) => {
                  const gate = gates.find((g) => g.step === col && g.targetQubit === qIdx);
                  const isControl = gates.some(
                    (g) => g.step === col && g.controlQubits?.includes(qIdx)
                  );
                  const isTarget = !!gate;

                  // Find multi-qubit gate connecting wire
                  const controllingGate = gates.find(
                    (g) => g.step === col && (g.targetQubit === qIdx || g.controlQubits?.includes(qIdx))
                  );

                  return (
                    <div
                      key={col}
                      onClick={() => handleCellClick(qIdx, col)}
                      className="w-9 h-9 relative flex items-center justify-center cursor-pointer z-10"
                    >
                      {/* Vertical control connector wire */}
                      {controllingGate && controllingGate.controlQubits && (
                        <div
                          className="absolute w-0.5 bg-purple-500 z-0 pointer-events-none"
                          style={{
                            top:
                              Math.min(controllingGate.targetQubit, ...controllingGate.controlQubits) === qIdx
                                ? '50%'
                                : '-50%',
                            bottom:
                              Math.max(controllingGate.targetQubit, ...controllingGate.controlQubits) === qIdx
                                ? '50%'
                                : '-50%',
                            height: '100%',
                          }}
                        />
                      )}

                      {/* Control dot */}
                      {isControl && !isTarget && (
                        <div className="w-3.5 h-3.5 rounded-full bg-purple-400 shadow-md shadow-purple-500/50 z-10" />
                      )}

                      {/* Placed Gate badge */}
                      {isTarget && (
                        <div
                          className={`w-8 h-8 rounded-md flex items-center justify-center font-mono font-bold text-xs shadow-md z-10 transition-transform hover:scale-110 ${
                            gate.type === 'CNOT'
                              ? 'bg-purple-600 text-white border border-purple-400'
                              : gate.type === 'H'
                              ? 'bg-indigo-600 text-white border border-indigo-400'
                              : gate.type === 'MEASURE'
                              ? 'bg-amber-600 text-white border border-amber-400'
                              : 'bg-gray-800 text-purple-300 border border-purple-500'
                          }`}
                        >
                          {GATE_DEFINITIONS[gate.type].symbol}
                        </div>
                      )}

                      {/* Empty slot placeholder hover */}
                      {!isTarget && !isControl && (
                        <div className="w-7 h-7 rounded border border-dashed border-gray-800 hover:border-purple-500/60 opacity-0 group-hover:opacity-60 transition-opacity" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Timeline Playhead Needle */}
          <div
            className="absolute top-6 bottom-0 w-0.5 bg-amber-400 pointer-events-none transition-all duration-200 z-20 shadow-md shadow-amber-400/50"
            style={{
              left: `${56 + currentStep * 40 + 18}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
