/**
 * MAIN APPLICATION COMPONENT
 * COSMO-FORGE (EXP-020)
 * Central orchestrator connecting SimulationController, Visualizers, and Sonification Engine.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CosmoParameters, CosmoPresetId, CosmoSuiteMode } from './types';
import { SimulationController } from './core/SimulationController';
import { CosmoSonificationEngine } from './audio/CosmoSonificationEngine';
import { Header } from './components/Header';
import { CosmoControlDeck } from './components/CosmoControlDeck';
import { CosmicExpansionCanvas } from './components/CosmicExpansionCanvas';
import { CmbPowerSpectrumCanvas } from './components/CmbPowerSpectrumCanvas';
import { PrimordialBbnCanvas } from './components/PrimordialBbnCanvas';
import { DarkMatterHaloCanvas } from './components/DarkMatterHaloCanvas';
import { CosmicGeometryCanvas } from './components/CosmicGeometryCanvas';
import { DataExportModal } from './components/DataExportModal';

export const App: React.FC = () => {
  const controllerRef = useRef<SimulationController | null>(null);
  const audioRef = useRef<CosmoSonificationEngine | null>(null);

  // Authoritative State Snapshot
  const [params, setParams] = useState<CosmoParameters>(() => {
    const ctrl = new SimulationController();
    controllerRef.current = ctrl;
    return ctrl.getParameters();
  });

  const [suiteMode, setSuiteMode] = useState<CosmoSuiteMode>('COSMIC_EXPANSION');
  const [measuredFps, setMeasuredFps] = useState<number>(60.0);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Initialize Controller and Audio Lifecycle
  useEffect(() => {
    let ctrl = controllerRef.current;
    if (!ctrl) {
      ctrl = new SimulationController();
      controllerRef.current = ctrl;
    }

    const audio = new CosmoSonificationEngine();
    audioRef.current = audio;

    const unsubscribe = ctrl.subscribe((newParams, newMode, fps) => {
      setParams(newParams);
      setSuiteMode(newMode);
      setMeasuredFps(fps);
    });

    ctrl.start();

    return () => {
      unsubscribe();
      ctrl?.stop();
      audio.dispose();
      audioRef.current = null;
    };
  }, []);

  // Update audio mute state
  useEffect(() => {
    audioRef.current?.setMuted(!params.audioEnabled);
  }, [params.audioEnabled]);

  // Handle Mode Selection with explicit audio silencing
  const handleSelectMode = useCallback((mode: CosmoSuiteMode) => {
    // Silence probe tones on mode transition
    audioRef.current?.updateCmbProbeTone(0, false);
    audioRef.current?.updateExpansionDrone(0, 0, false);
    controllerRef.current?.setSuiteMode(mode);
  }, []);

  // Handle Parameter Changes
  const handleChangeParams = useCallback((partial: Partial<CosmoParameters>) => {
    controllerRef.current?.setParameters(partial);
  }, []);

  // Handle Preset Selection
  const handleSelectPreset = useCallback((presetId: CosmoPresetId) => {
    controllerRef.current?.loadPreset(presetId);
  }, []);

  // Handle Audio Toggle
  const handleToggleAudio = useCallback(() => {
    controllerRef.current?.toggleAudio();
  }, []);

  // Audio Callback Handlers
  const handleUpdateExpansionAudio = useCallback((active: boolean) => {
    if (!params.audioEnabled) return;
    const q0 = params.Omega_m / 2.0 - params.Omega_L;
    audioRef.current?.updateExpansionDrone(params.H0, q0, active);
  }, [params.H0, params.Omega_L, params.Omega_m, params.audioEnabled]);

  const handleUpdateCmbAudio = useCallback((ell: number, active: boolean) => {
    if (!params.audioEnabled) return;
    audioRef.current?.updateCmbProbeTone(ell, active);
  }, [params.audioEnabled]);

  const handleTriggerBbnBurst = useCallback(() => {
    if (!params.audioEnabled) return;
    audioRef.current?.playBbnDecayClicks();
  }, [params.audioEnabled]);

  const handleUpdateDarkMatterAudio = useCallback((v_rot: number) => {
    if (!params.audioEnabled) return;
    audioRef.current?.playDarkMatterChime(v_rot);
  }, [params.audioEnabled]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#030712] text-slate-100 overflow-hidden font-sans">
      {/* Top Application Header */}
      <Header
        suiteMode={suiteMode}
        onSelectMode={handleSelectMode}
        activePresetId={params.activePresetId}
        onSelectPreset={handleSelectPreset}
        audioEnabled={params.audioEnabled}
        onToggleAudio={handleToggleAudio}
        measuredFps={measuredFps}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Control Deck */}
        <CosmoControlDeck
          suiteMode={suiteMode}
          params={params}
          onChangeParams={handleChangeParams}
          onTriggerBbnBurst={handleTriggerBbnBurst}
        />

        {/* Center / Right Visualizer Canvas */}
        <main className="flex-1 flex overflow-hidden">
          {suiteMode === 'COSMIC_EXPANSION' && (
            <CosmicExpansionCanvas
              params={params}
              onChangeProbeRedshift={(z) => handleChangeParams({ probeRedshift: z })}
              onUpdateAudioProbe={handleUpdateExpansionAudio}
            />
          )}

          {suiteMode === 'CMB_POWER_SPECTRUM' && (
            <CmbPowerSpectrumCanvas
              params={params}
              onChangeProbeMultipole={(ell) => handleChangeParams({ probeMultipole: ell })}
              onUpdateAudioProbe={handleUpdateCmbAudio}
            />
          )}

          {suiteMode === 'PRIMORDIAL_BBN' && (
            <PrimordialBbnCanvas
              params={params}
              onTriggerBbnBurst={handleTriggerBbnBurst}
            />
          )}

          {suiteMode === 'DARK_MATTER_HALO' && (
            <DarkMatterHaloCanvas
              params={params}
              onChangeProbeRadius={(r) => handleChangeParams({ probeRadiusKpc: r })}
              onUpdateAudioProbe={handleUpdateDarkMatterAudio}
            />
          )}

          {suiteMode === 'COSMIC_GEOMETRY' && (
            <CosmicGeometryCanvas params={params} />
          )}
        </main>
      </div>

      {/* Telemetry Data Export Modal */}
      <DataExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        params={params}
      />
    </div>
  );
};
