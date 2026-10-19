import React from 'react';
import {
  Cpu,
  Play,
  Pause,
  RotateCcw,
  StepForward,
  StepBack,
  Volume2,
  VolumeX,
  Code2,
  Sparkles,
  Link2,
} from 'lucide-react';
import { AlgorithmPreset } from '../types';

interface HeaderProps {
  algorithms: AlgorithmPreset[];
  currentAlgorithm: AlgorithmPreset;
  onSelectAlgorithm: (algo: AlgorithmPreset) => void;
  numQubits: number;
  onSetNumQubits: (n: number) => void;
  currentStep: number;
  maxStep: number;
  onStepForward: () => void;
  onStepBack: () => void;
  onResetCircuit: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  entanglementEntropy: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenQasmModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  algorithms,
  currentAlgorithm,
  onSelectAlgorithm,
  numQubits,
  onSetNumQubits,
  currentStep,
  maxStep,
  onStepForward,
  onStepBack,
  onResetCircuit,
  isPlaying,
  onTogglePlay,
  entanglementEntropy,
  isMuted,
  onToggleMute,
  onOpenQasmModal,
}) => {
  return (
    <header className="h-14 bg-gray-950/90 backdrop-blur border-b border-gray-800 px-4 flex items-center justify-between text-xs select-none z-20">
      {/* Brand & Algorithm Selector */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-purple-400 font-bold tracking-wider uppercase text-sm">
          <Cpu className="w-5 h-5 text-purple-400" />
          <span className="hidden sm:inline bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
            QUANTUM-GATE STUDIO
          </span>
        </div>

        <div className="relative">
          <select
            value={currentAlgorithm.id}
            onChange={(e) => {
              const selected = algorithms.find((a) => a.id === e.target.value);
              if (selected) onSelectAlgorithm(selected);
            }}
            className="bg-gray-900 border border-gray-700 hover:border-purple-500 rounded px-2.5 py-1 text-gray-200 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer text-xs"
          >
            {algorithms.map((a) => (
              <option key={a.id} value={a.id}>
                [{a.category}] {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Qubit Register Count */}
        <div className="flex items-center space-x-1 bg-gray-900/80 px-2 py-0.5 rounded border border-gray-800">
          <span className="text-[10px] text-gray-400">QUBITS:</span>
          {[2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              onClick={() => onSetNumQubits(n)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                numQubits === n
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Stepping & Execution Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onResetCircuit}
          title="Reset to Ground State |0...0⟩"
          className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-gray-200 border border-transparent hover:border-gray-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onStepBack}
          disabled={currentStep <= 0}
          title="Step Backward"
          className="p-1.5 rounded bg-gray-900 hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none text-gray-300 border border-gray-800"
        >
          <StepBack className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onTogglePlay}
          className={`flex items-center space-x-1 px-3 py-1 rounded font-semibold transition-colors ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-gray-950 shadow-md shadow-amber-500/20'
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'PAUSE' : 'RUN'}</span>
        </button>

        <button
          onClick={onStepForward}
          disabled={currentStep >= maxStep}
          title="Step Forward (Execute next gate)"
          className="p-1.5 rounded bg-gray-900 hover:bg-gray-800 disabled:opacity-30 disabled:pointer-events-none text-gray-300 border border-gray-800"
        >
          <StepForward className="w-3.5 h-3.5" />
        </button>

        <div className="font-mono text-[11px] px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-300">
          STEP: <span className="text-purple-400 font-bold">{currentStep}</span> / {maxStep}
        </div>

        {/* Entanglement Entropy Indicator */}
        <div
          title="Von Neumann Entanglement Entropy S(ρ)"
          className="hidden md:flex items-center space-x-1.5 px-2 py-1 rounded bg-gray-900 border border-gray-800 font-mono text-[11px]"
        >
          <Link2
            className={`w-3.5 h-3.5 ${
              entanglementEntropy > 0.05 ? 'text-pink-400 animate-pulse' : 'text-gray-500'
            }`}
          />
          <span className="text-gray-400">ENTROPY:</span>
          <span
            className={
              entanglementEntropy > 0.4
                ? 'text-pink-300 font-bold'
                : entanglementEntropy > 0.05
                ? 'text-purple-300'
                : 'text-gray-400'
            }
          >
            {entanglementEntropy.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Tools & Audio */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenQasmModal}
          title="OpenQASM 2.0 Code Import / Export"
          className="flex items-center space-x-1 px-2.5 py-1 rounded bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 transition-colors"
        >
          <Code2 className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">OPENQASM</span>
        </button>

        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Quantum Sonification' : 'Mute Quantum Sonification'}
          className={`p-1.5 rounded border transition-colors ${
            isMuted
              ? 'bg-gray-900 border-gray-800 text-gray-500'
              : 'bg-gray-900 border-gray-700 text-purple-400 hover:bg-gray-800'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
