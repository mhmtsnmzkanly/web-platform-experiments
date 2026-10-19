import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { CircuitComposer } from './components/CircuitComposer';
import { BlochSphereVisualizer } from './components/BlochSphereVisualizer';
import { StateHistogramVisualizer } from './components/StateHistogramVisualizer';
import { QasmInterchangeModal } from './components/QasmInterchangeModal';
import { CURATED_ALGORITHMS } from './algorithms/curatedAlgorithms';
import { QuantumSimulatorEngine } from './quantum/QuantumSimulatorEngine';
import { QuantumSonificationEngine } from './audio/QuantumSonificationEngine';
import {
  CircuitGate,
  AlgorithmPreset,
  QuantumSystemState,
} from './types';
import { Info, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  // Simulator & Algorithm State
  const [currentAlgorithm, setCurrentAlgorithm] = useState<AlgorithmPreset>(CURATED_ALGORITHMS[0]);
  const [numQubits, setNumQubits] = useState<number>(CURATED_ALGORITHMS[0].numQubits);
  const [gates, setGates] = useState<CircuitGate[]>(CURATED_ALGORITHMS[0].gates);
  const [currentStep, setCurrentStep] = useState<number>(
    Math.max(0, ...CURATED_ALGORITHMS[0].gates.map((g) => g.step))
  );

  // Playback & Step State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedQubitIndex, setSelectedQubitIndex] = useState<number>(0);

  // Modals & Audio
  const [isQasmOpen, setIsQasmOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Engine Refs
  const simulatorRef = useRef<QuantumSimulatorEngine | null>(null);
  const audioEngineRef = useRef<QuantumSonificationEngine | null>(null);

  // Quantum System State
  const [systemState, setSystemState] = useState<QuantumSystemState>(() => {
    const sim = new QuantumSimulatorEngine(CURATED_ALGORITHMS[0].numQubits);
    return sim.runCircuit(CURATED_ALGORITHMS[0].gates);
  });

  // Calculate Max Step
  const maxStep = Math.max(0, ...gates.map((g) => g.step));

  // Initialize Engines
  useEffect(() => {
    simulatorRef.current = new QuantumSimulatorEngine(numQubits);
    audioEngineRef.current = new QuantumSonificationEngine();

    return () => {
      audioEngineRef.current?.destroy();
    };
  }, []);

  // Update simulation when gates, step, or numQubits changes
  const updateSimulation = useCallback(
    (stepToEvaluate?: number) => {
      if (!simulatorRef.current) return;
      const step = stepToEvaluate !== undefined ? stepToEvaluate : currentStep;
      const state = simulatorRef.current.runCircuit(gates, step);
      setSystemState(state);
      audioEngineRef.current?.updateEntanglementDrone(state.entanglementEntropy);
    },
    [gates, currentStep]
  );

  useEffect(() => {
    updateSimulation();
  }, [gates, currentStep, updateSimulation]);

  // Handle Preset Switching
  const handleSelectAlgorithm = (algo: AlgorithmPreset) => {
    setCurrentAlgorithm(algo);
    setNumQubits(algo.numQubits);
    setGates(algo.gates);
    setSelectedQubitIndex(0);
    const mStep = Math.max(0, ...algo.gates.map((g) => g.step));
    setCurrentStep(mStep);

    if (simulatorRef.current) {
      simulatorRef.current.setNumQubits(algo.numQubits);
      const state = simulatorRef.current.runCircuit(algo.gates, mStep);
      setSystemState(state);
    }
  };

  const handleSetNumQubits = (n: number) => {
    setNumQubits(n);
    if (selectedQubitIndex >= n) setSelectedQubitIndex(0);
    // Filter out gates exceeding new qubit count
    const validGates = gates.filter(
      (g) =>
        g.targetQubit < n &&
        (!g.controlQubits || g.controlQubits.every((c) => c < n))
    );
    setGates(validGates);
    if (simulatorRef.current) {
      simulatorRef.current.setNumQubits(n);
      const state = simulatorRef.current.runCircuit(validGates, currentStep);
      setSystemState(state);
    }
  };

  // Playback Step Timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= maxStep) {
          setIsPlaying(false);
          return maxStep;
        }
        const next = prev + 1;
        // Play sound for gates at this step
        const gatesAtStep = gates.filter((g) => g.step === next);
        gatesAtStep.forEach((g) => {
          if (g.type === 'MEASURE') {
            audioEngineRef.current?.playMeasurementCollapse(0);
          } else {
            audioEngineRef.current?.playGateSound(g.type);
          }
        });
        return next;
      });
    }, 750);

    return () => clearInterval(interval);
  }, [isPlaying, maxStep, gates]);

  // Audio Interaction Initialization
  const handleUserGesture = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.init();
      audioEngineRef.current.updateEntanglementDrone(systemState.entanglementEntropy);
    }
  };

  const handleToggleMute = () => {
    handleUserGesture();
    if (audioEngineRef.current) {
      const muted = audioEngineRef.current.toggleMute();
      setIsMuted(muted);
    }
  };

  // Gate Manipulation
  const handleAddGate = (newGate: CircuitGate) => {
    handleUserGesture();
    setGates((prev) => [...prev, newGate]);
    audioEngineRef.current?.playGateSound(newGate.type);
    if (newGate.step > currentStep) {
      setCurrentStep(newGate.step);
    }
  };

  const handleRemoveGate = (gateId: string) => {
    setGates((prev) => prev.filter((g) => g.id !== gateId));
  };

  const handleClearCircuit = () => {
    setGates([]);
    setCurrentStep(0);
  };

  const handleLoadQasmGates = (newN: number, newGates: CircuitGate[]) => {
    setNumQubits(newN);
    setGates(newGates);
    const m = Math.max(0, ...newGates.map((g) => g.step));
    setCurrentStep(m);
    if (simulatorRef.current) {
      simulatorRef.current.setNumQubits(newN);
      const state = simulatorRef.current.runCircuit(newGates, m);
      setSystemState(state);
    }
  };

  return (
    <div
      onClick={handleUserGesture}
      className="flex flex-col w-screen h-screen bg-[#030712] text-slate-100 overflow-hidden font-sans select-none"
    >
      {/* Top Header */}
      <Header
        algorithms={CURATED_ALGORITHMS}
        currentAlgorithm={currentAlgorithm}
        onSelectAlgorithm={handleSelectAlgorithm}
        numQubits={numQubits}
        onSetNumQubits={handleSetNumQubits}
        currentStep={currentStep}
        maxStep={maxStep}
        onStepForward={() => {
          if (currentStep < maxStep) {
            handleUserGesture();
            const next = currentStep + 1;
            setCurrentStep(next);
            gates.filter((g) => g.step === next).forEach((g) => audioEngineRef.current?.playGateSound(g.type));
          }
        }}
        onStepBack={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
        onResetCircuit={() => setCurrentStep(0)}
        isPlaying={isPlaying}
        onTogglePlay={() => {
          handleUserGesture();
          if (!isPlaying && currentStep >= maxStep) {
            setCurrentStep(0);
          }
          setIsPlaying(!isPlaying);
        }}
        entanglementEntropy={systemState.entanglementEntropy}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenQasmModal={() => setIsQasmOpen(true)}
      />

      {/* Circuit Composer Wire Grid (Top Panel) */}
      <CircuitComposer
        numQubits={numQubits}
        gates={gates}
        currentStep={currentStep}
        maxStep={maxStep}
        onAddGate={handleAddGate}
        onRemoveGate={handleRemoveGate}
        onClearCircuit={handleClearCircuit}
        onSelectStep={setCurrentStep}
      />

      {/* Algorithm Details Banner */}
      <div className="bg-gray-900/40 border-b border-gray-800/80 px-4 py-1.5 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-2 truncate">
          <Info className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
          <span className="font-semibold text-purple-300">{currentAlgorithm.name}:</span>
          <span className="truncate text-gray-400">{currentAlgorithm.details}</span>
        </div>
        <div className="flex-shrink-0 font-mono text-[10px] text-gray-500 pl-2">
          STATE DIM: {1 << numQubits}
        </div>
      </div>

      {/* Main Dual Visualizer Deck: Bloch Sphere (Left) + State Histogram (Right) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: 3D Bloch Spheres */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full">
          <BlochSphereVisualizer
            reducedStates={systemState.reducedStates}
            selectedQubitIndex={selectedQubitIndex}
            onSelectQubit={setSelectedQubitIndex}
          />
        </div>

        {/* Right: State Probabilities & Density Matrix */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full">
          <StateHistogramVisualizer
            amplitudes={systemState.amplitudes}
            numQubits={numQubits}
          />
        </div>
      </div>

      {/* OpenQASM Modal */}
      <QasmInterchangeModal
        isOpen={isQasmOpen}
        onClose={() => setIsQasmOpen(false)}
        numQubits={numQubits}
        gates={gates}
        onLoadGates={handleLoadQasmGates}
      />
    </div>
  );
};
