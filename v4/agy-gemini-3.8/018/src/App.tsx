import React, { useState, useEffect, useRef } from 'react';
import { SimulationController, StellarSimulationState } from './core/SimulationController.js';
import { StellarSonificationEngine } from './audio/StellarSonificationEngine.js';
import { Header } from './components/Header.js';
import { StellarProfileCanvas } from './components/StellarProfileCanvas.js';
import { OnionCoreCanvas } from './components/OnionCoreCanvas.js';
import { HrDiagramCanvas } from './components/HrDiagramCanvas.js';
import { NucleosynthesisCanvas } from './components/NucleosynthesisCanvas.js';
import { StellarControlDeck } from './components/StellarControlDeck.js';
import { DataExportModal } from './components/DataExportModal.js';
import { SuiteMode, PresetId, StellarTelemetry } from './types/index.js';

export const App: React.FC = () => {
  const controllerRef = useRef<SimulationController | null>(null);
  const audioRef = useRef<StellarSonificationEngine | null>(null);

  if (!controllerRef.current) {
    controllerRef.current = new SimulationController('SUN_ZAMS');
  }
  if (!audioRef.current) {
    audioRef.current = new StellarSonificationEngine();
  }

  const [simState, setSimState] = useState<StellarSimulationState>(controllerRef.current.getState());
  const [telemetry, setTelemetry] = useState<StellarTelemetry>(controllerRef.current.getTelemetry());
  const [isMuted, setIsMuted] = useState(true);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    const controller = controllerRef.current!;
    const audio = audioRef.current!;

    // Subscribe to state changes
    const unsubscribe = controller.subscribe((newState) => {
      setSimState({ ...newState });
      const telem = controller.getTelemetry();
      setTelemetry(telem);
      audio.updateTelemetry(telem);
    });

    let lastTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      const deltaMs = Math.min(100, now - lastTime);
      lastTime = now;

      controller.tick(deltaMs);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      unsubscribe();
      audio.dispose();
    };
  }, []);

  const handleSelectMode = (mode: SuiteMode) => {
    controllerRef.current?.setMode(mode);
  };

  const handleSelectPreset = (presetId: PresetId) => {
    controllerRef.current?.loadPreset(presetId);
  };

  const handleTogglePause = () => {
    controllerRef.current?.togglePause();
  };

  const handleReset = () => {
    controllerRef.current?.loadPreset(simState.currentPreset);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current?.setMuted(nextMuted);
  };

  const handleUpdateParameters = (params: Parameters<SimulationController['updateParameters']>[0]) => {
    controllerRef.current?.updateParameters(params);
  };

  const handleTriggerSupernova = () => {
    controllerRef.current?.triggerSupernovaCollapse();
  };

  const handleResetSupernova = () => {
    controllerRef.current?.resetSupernova();
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <Header
        currentMode={simState.mode}
        onSelectMode={handleSelectMode}
        currentPreset={simState.currentPreset}
        onSelectPreset={handleSelectPreset}
        isPaused={simState.isPaused}
        onTogglePause={handleTogglePause}
        onReset={handleReset}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenExport={() => setIsExportOpen(true)}
        telemetry={telemetry}
      />

      {/* Main Observatory Display Viewport */}
      <main className="flex-1 relative overflow-hidden flex flex-col min-h-0">
        {/* Real-time Telemetry Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-mono gap-x-4 gap-y-1">
          <div className="flex items-center space-x-3">
            <span className="text-slate-400">
              Mass: <strong className="text-amber-300">{telemetry.massSolar.toFixed(2)} M☉</strong>
            </span>
            <span className="text-slate-400">
              Radius: <strong className="text-sky-300">{telemetry.radiusSolar.toFixed(4)} R☉</strong>
            </span>
            <span className="text-slate-400">
              ρ_c: <strong className="text-emerald-300">{telemetry.centralDensityKgM3.toExponential(2)} kg/m³</strong>
            </span>
            <span className="text-slate-400">
              P_c: <strong className="text-orange-300">{telemetry.centralPressurePa.toExponential(2)} Pa</strong>
            </span>
            <span className="text-slate-400">
              T_eff: <strong className="text-rose-300">{Math.round(telemetry.effectiveTemperatureK)} K</strong>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-slate-400">
              Luminosity: <strong className="text-yellow-300">{telemetry.totalLuminositySolar.toExponential(2)} L☉</strong>
            </span>
            <span className="text-slate-400">
              Process: <strong className="text-purple-300">{telemetry.dominantNuclearProcess}</strong>
            </span>
            <span className="text-slate-400">
              M_Ch: <strong className="text-cyan-300">{telemetry.chandrasekharMassLimitSolar.toFixed(3)} M☉</strong>
            </span>
            {telemetry.tovRedshift > 0 && (
              <span className="text-slate-400">
                Redshift z_g: <strong className="text-indigo-300">{telemetry.tovRedshift.toFixed(3)}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Active Visualization Canvas */}
        <div className="flex-1 w-full h-full relative min-h-0">
          {simState.mode === 'INTERIOR_PROFILES' && (
            <StellarProfileCanvas
              profile={simState.profile}
              luminosityResult={simState.luminosityResult}
            />
          )}

          {simState.mode === 'ONION_CORE_CROSS_SECTION' && (
            <OnionCoreCanvas simState={simState} />
          )}

          {simState.mode === 'HR_EVOLUTIONARY_TRACK' && (
            <HrDiagramCanvas simState={simState} />
          )}

          {simState.mode === 'NUCLEOSYNTHESIS_CHART' && (
            <NucleosynthesisCanvas simState={simState} />
          )}
        </div>
      </main>

      {/* Bottom Control Deck */}
      <StellarControlDeck
        simState={simState}
        telemetry={telemetry}
        onUpdateParameters={handleUpdateParameters}
        onTriggerSupernova={handleTriggerSupernova}
        onResetSupernova={handleResetSupernova}
      />

      {/* Data Export Modal */}
      <DataExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        simState={simState}
        telemetry={telemetry}
      />
    </div>
  );
};
