/**
 * App.tsx
 * Top-level application shell for BAND-FORGE studio (Experiment 019).
 */

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { SuiteMode, PresetId, SimulationParameters, SimulationTelemetry } from './types/index.js';
import { SimulationController } from './core/SimulationController.js';
import { BandSonificationEngine } from './audio/BandSonificationEngine.js';

import { Header } from './components/Header.js';
import { BandStructureCanvas } from './components/BandStructureCanvas.js';
import { FermiSurfaceCanvas } from './components/FermiSurfaceCanvas.js';
import { TopologicalChernCanvas } from './components/TopologicalChernCanvas.js';
import { HofstadterCanvas } from './components/HofstadterCanvas.js';
import { PhononCanvas } from './components/PhononCanvas.js';
import { BandControlDeck } from './components/BandControlDeck.js';
import { DataExportModal } from './components/DataExportModal.js';

export const App: React.FC = () => {
  const controller = useMemo(() => new SimulationController(), []);
  const audio = useMemo(() => new BandSonificationEngine(), []);

  const [params, setParams] = useState<SimulationParameters>(() => controller.getParameters());
  const [telemetry, setTelemetry] = useState<SimulationTelemetry>(() => controller.getTelemetry());
  const [isPaused, setIsPaused] = useState<boolean>(() => controller.getIsPaused());
  const [isMuted, setIsMuted] = useState<boolean>(() => audio.getIsMuted());
  const [isExportOpen, setIsExportOpen] = useState(false);

  const prevTopologicalRef = useRef<boolean>(telemetry.isTopological);

  // Subscribe to controller updates
  useEffect(() => {
    controller.start();

    const unsubscribe = controller.subscribe(() => {
      const p = controller.getParameters();
      const t = controller.getTelemetry();
      setParams(p);
      setTelemetry(t);
      setIsPaused(controller.getIsPaused());

      // Trigger topological chime on phase transition
      if (t.isTopological !== prevTopologicalRef.current) {
        prevTopologicalRef.current = t.isTopological;
        audio.triggerTopologicalChime(t.isTopological);
      }
    });

    return () => {
      unsubscribe();
      controller.stop();
      audio.dispose();
    };
  }, [controller, audio]);

  const handleSelectMode = (mode: SuiteMode) => {
    audio.updateDispersionProbe(0, false);
    audio.updatePhononFrequencies(0, 0, false);
    controller.updateParameters({ suiteMode: mode });
  };

  const handleUpdateParams = (partial: Partial<SimulationParameters>) => {
    controller.updateParameters(partial);
  };

  const handleApplyPreset = (presetId: PresetId) => {
    controller.applyPreset(presetId);
  };

  const handleTogglePause = () => {
    controller.togglePause();
  };

  const handleToggleMute = () => {
    const muted = audio.toggleMute();
    setIsMuted(muted);
  };

  const handleProbeHover = (energy_eV: number, active: boolean) => {
    audio.updateDispersionProbe(energy_eV, active);
  };

  const handlePhononAudio = (omegaMinus: number, omegaPlus: number, active: boolean) => {
    audio.updatePhononFrequencies(omegaMinus, omegaPlus, active);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Header & Telemetry */}
      <Header
        suiteMode={params.suiteMode}
        onSelectMode={handleSelectMode}
        telemetry={telemetry}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Visualizer Stage */}
      <main className="flex-1 relative overflow-hidden">
        {params.suiteMode === 'BAND_STRUCTURE' && (
          <BandStructureCanvas
            params={params}
            onProbeHover={handleProbeHover}
            onUpdateFermiLevel={(ef) => controller.updateParameters({ ef })}
          />
        )}

        {params.suiteMode === 'FERMI_SURFACE' && (
          <FermiSurfaceCanvas
            params={params}
            onUpdateProbe={(kx, ky) => controller.updateParameters({ probeKx: kx, probeKy: ky })}
            onProbeHover={handleProbeHover}
          />
        )}

        {params.suiteMode === 'TOPOLOGICAL_CHERN' && (
          <TopologicalChernCanvas params={params} />
        )}

        {params.suiteMode === 'HOFSTADTER_FRACTAL' && (
          <HofstadterCanvas
            params={params}
            onUpdateFlux={(magFluxAlpha) => controller.updateParameters({ magFluxAlpha })}
          />
        )}

        {params.suiteMode === 'PHONON_DISPERSION' && (
          <PhononCanvas
            params={params}
            simTime={telemetry.simTime}
            onUpdatePhononAudio={handlePhononAudio}
          />
        )}
      </main>

      {/* Control Deck */}
      <BandControlDeck
        params={params}
        onUpdateParams={handleUpdateParams}
        onApplyPreset={handleApplyPreset}
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
      />

      {/* Data Export Modal */}
      <DataExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        params={params}
        telemetry={telemetry}
      />
    </div>
  );
};
