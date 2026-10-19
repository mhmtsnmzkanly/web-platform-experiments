import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  SuiteMode,
  ColormapMode,
  PresetId,
  GeodesicParams,
  LensingParams,
  GravitationalWaveParams,
  TelemetryMetrics,
} from './types';
import { RELATIVITY_PRESETS } from './relativity/RelativityPresets';
import { RelativitySonificationEngine } from './audio/RelativitySonificationEngine';
import { Header } from './components/Header';
import { RelativityCanvas } from './components/RelativityCanvas';
import { RelativityControlDeck } from './components/RelativityControlDeck';
import { DataExportModal } from './components/DataExportModal';

export const App: React.FC = () => {
  // Active Mode & Scenario Preset
  const [suiteMode, setSuiteMode] = useState<SuiteMode>('KERR_SHADOW_LENS');
  const [selectedPresetId, setSelectedPresetId] = useState<PresetId | ''>('KERR_SUPERSPINNING');
  const [colormapMode, setColormapMode] = useState<ColormapMode>('ACCRETION_FIRE');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Triggers for imperative particle operations in canvas engine
  const [spawnCounter, setSpawnCounter] = useState<number>(0);
  const [clearCounter, setClearCounter] = useState<number>(0);

  // Engine Parameters
  const [geodesicParams, setGeodesicParams] = useState<GeodesicParams>({
    massM: 1.0,
    spinA: 0.94,
    chargeQ: 0.0,
    metricType: 'KERR',
    launchRadius: 9.0,
    launchSpeed: 0.38,
    launchAngleDeg: 82,
    isPhoton: false,
  });

  const [lensingParams, setLensingParams] = useState<LensingParams>({
    observerDistance: 22.0,
    inclinationDeg: 78.0,
    fovDeg: 42.0,
    diskInnerRadius: 2.1,
    diskOuterRadius: 18.0,
    accretionBrightness: 1.4,
    starFieldGrid: true,
    secondaryRings: true,
  });

  const [gwParams, setGwParams] = useState<GravitationalWaveParams>({
    primaryMassMsun: 36.0,
    secondaryMassMsun: 29.0,
    dimensionlessSpin1: 0.32,
    dimensionlessSpin2: -0.44,
    luminosityDistanceMpc: 410.0,
    orbitPhase: 0.0,
    separationR: 16.0,
    orbitalFreqHz: 35.0,
    isMerged: false,
  });

  // Telemetry Metrics
  const [telemetry, setTelemetry] = useState<TelemetryMetrics>({
    schwarzschildRadiusRs: 2.0,
    eventHorizonRadiusRplus: 1.34,
    photonSphereRadiusRph: 2.3,
    iscoRadius: 2.1,
    ergosphereOuterRadius: 2.0,
    frameDraggingOmegaMax: 0.78,
    gravitationalRedshiftZ: 0.42,
    gwChirpMassMsun: 28.1,
    gwStrainPeak: 1.0e-21,
    gwFrequencyHz: 35.0,
    simFps: 60,
    simStepCount: 0,
  });

  // Sonification Engine
  const audioRef = useRef<RelativitySonificationEngine>(new RelativitySonificationEngine());
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);

  // Cleanup audio on unmount
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio.dispose();
    };
  }, []);

  const handleToggleAudio = useCallback(() => {
    setIsAudioMuted((prev) => {
      const nextMuted = !prev;
      audioRef.current.setMuted(nextMuted);
      return nextMuted;
    });
  }, []);

  const handleAudioUpdate = useCallback(
    (
      mode: SuiteMode,
      gwFreqHz: number,
      gwStrainPeak: number,
      isMerged: boolean,
      closestGeodesicR: number,
      spinA: number,
      maxDoppler: number
    ) => {
      audioRef.current.update(
        mode,
        gwFreqHz,
        gwStrainPeak,
        isMerged,
        closestGeodesicR,
        spinA,
        maxDoppler
      );
    },
    []
  );

  const handleUpdateGeodesic = useCallback((patch: Partial<GeodesicParams>) => {
    setGeodesicParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleUpdateLensing = useCallback((patch: Partial<LensingParams>) => {
    setLensingParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleUpdateGW = useCallback((patch: Partial<GravitationalWaveParams>) => {
    setGwParams((prev) => ({ ...prev, ...patch }));
  }, []);

  // Preset Selection
  const handleSelectPreset = useCallback((id: PresetId) => {
    setSelectedPresetId(id);
    const preset = RELATIVITY_PRESETS.find((p) => p.id === id);
    if (!preset) return;

    setSuiteMode(preset.suiteMode);
    if (preset.geodesic) {
      setGeodesicParams((prev) => ({ ...prev, ...preset.geodesic }));
    }
    if (preset.lensing) {
      setLensingParams((prev) => ({ ...prev, ...preset.lensing }));
    }
    if (preset.gw) {
      setGwParams((prev) => ({ ...prev, ...preset.gw }));
    }
  }, []);

  // Control Deck Action Handlers directly connected to canvas triggers
  const handleSpawnParticle = useCallback(() => {
    setSpawnCounter((c) => c + 1);
  }, []);

  const handleClearParticles = useCallback(() => {
    setClearCounter((c) => c + 1);
  }, []);

  const handleResetGW = useCallback(() => {
    setGwParams((prev) => ({
      ...prev,
      separationR: 16.0,
      orbitPhase: 0.0,
      isMerged: false,
    }));
  }, []);

  const handleTogglePause = useCallback(() => {
    setIsPaused((p) => !p);
  }, []);

  const handleOpenExport = useCallback(() => {
    setIsExportOpen(true);
  }, []);

  const handleCloseExport = useCallback(() => {
    setIsExportOpen(false);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <Header
        suiteMode={suiteMode}
        onSetSuiteMode={setSuiteMode}
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
        onOpenExport={handleOpenExport}
        fps={telemetry.simFps}
      />

      {/* Main Canvas Viewport */}
      <main className="flex-1 relative overflow-hidden bg-black">
        <RelativityCanvas
          suiteMode={suiteMode}
          presetId={selectedPresetId}
          colormapMode={colormapMode}
          geodesicParams={geodesicParams}
          lensingParams={lensingParams}
          gwParams={gwParams}
          spawnTrigger={spawnCounter}
          clearTrigger={clearCounter}
          onUpdateLensing={handleUpdateLensing}
          onUpdateGeodesic={handleUpdateGeodesic}
          onTelemetry={setTelemetry}
          onAudioUpdate={handleAudioUpdate}
          isPaused={isPaused}
        />
      </main>

      {/* Lower Control Deck */}
      <RelativityControlDeck
        suiteMode={suiteMode}
        colormapMode={colormapMode}
        onSetColormapMode={setColormapMode}
        geodesicParams={geodesicParams}
        lensingParams={lensingParams}
        gwParams={gwParams}
        telemetry={telemetry}
        onUpdateGeodesic={handleUpdateGeodesic}
        onUpdateLensing={handleUpdateLensing}
        onUpdateGW={handleUpdateGW}
        onSpawnParticle={handleSpawnParticle}
        onClearParticles={handleClearParticles}
        onResetGW={handleResetGW}
      />

      {/* Export Telemetry Modal */}
      <DataExportModal
        isOpen={isExportOpen}
        onClose={handleCloseExport}
        suiteMode={suiteMode}
        geodesicParams={geodesicParams}
        lensingParams={lensingParams}
        gwParams={gwParams}
        telemetry={telemetry}
      />
    </div>
  );
};
