import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WaveOpticsEngine } from './optics/WaveOpticsEngine';
import { calculateVisibleSpectrum, THIN_FILM_PRESETS } from './optics/ThinFilmEngine';
import { OpticaSonificationEngine } from './audio/OpticaSonificationEngine';
import { Header } from './components/Header';
import { WaveBenchCanvas } from './components/WaveBenchCanvas';
import { OpticsControlDeck } from './components/OpticsControlDeck';
import { DataExportModal } from './components/DataExportModal';
import {
  OpticsSuiteMode,
  ColormapMode,
  VisualizerDisplayMode,
  OpticalSourceConfig,
  DiffractionConfig,
  InterferometerConfig,
  ThinFilmConfig,
  HologramConfig,
  OpticsMetrics,
  CrossSectionPoint,
  SpectrumPoint,
} from './types';

export const App: React.FC = () => {
  // 1. Core Simulation Engines
  const engineRef = useRef<WaveOpticsEngine>(new WaveOpticsEngine(280, 140));
  const audioEngineRef = useRef<OpticaSonificationEngine>(new OpticaSonificationEngine());

  // 2. High-Level Suite State
  const [suiteMode, setSuiteMode] = useState<OpticsSuiteMode>('DIFFRACTION');
  const [colormap, setColormap] = useState<ColormapMode>('LASER_GREEN');
  const [displayMode, setDisplayMode] = useState<VisualizerDisplayMode>('INTENSITY');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // 3. Optical Configuration State
  const [source, setSource] = useState<OpticalSourceConfig>({
    wavelengthNm: 532, // Green 532nm DPSS laser
    coherenceLengthUm: 150,
    beamWaistMm: 1.2,
    intensityPower: 1.0,
  });

  const [diffConfig, setDiffConfig] = useState<DiffractionConfig>({
    preset: 'young-double-slit',
    slitWidthUm: 30,
    slitDistanceUm: 180,
    circularRadiusUm: 120,
    gratingDensityLpmm: 300,
    propagationDistanceMm: 120,
  });

  const [interConfig, setInterConfig] = useState<InterferometerConfig>({
    type: 'MICHELSON',
    arm1LengthMm: 50,
    arm2LengthMm: 50,
    mirrorTiltDeg: 0.8,
    piezoDisplacementNm: 250,
    sampleRefractiveIndex: 1.05,
    sampleThicknessUm: 200,
    mirrorReflectivity: 0.9,
  });

  const [thinFilmConfig, setThinFilmConfig] = useState<ThinFilmConfig>({
    substrateIndex: 1.52, // BK7 Glass
    incidentAngleDeg: 0,
    polarization: 'UNPOLARIZED',
    layers: [...THIN_FILM_PRESETS[1].layers], // MgF2 coating
  });

  const [holoConfig, setHoloConfig] = useState<HologramConfig>({
    objectType: 'DOUBLE_PINHOLE',
    referenceAngleDeg: 2.2,
    recordingDistanceMm: 45,
    reconstructionDistanceMm: 45,
    isReconstructing: false,
  });

  // Detector cross-section position x
  const [sliceX, setSliceX] = useState<number>(Math.floor(280 * 0.72));

  // 4. Live Telemetry & Spectral Metrics
  const [metrics, setMetrics] = useState<OpticsMetrics>(engineRef.current.metrics);
  const [crossSection, setCrossSection] = useState<CrossSectionPoint[]>([]);
  const [spectrumData, setSpectrumData] = useState<SpectrumPoint[]>([]);

  // Initialize Web Audio on user gesture
  const handleUserInteraction = useCallback(() => {
    audioEngineRef.current.init();
  }, []);

  // Update aperture geometry when diffraction config changes
  useEffect(() => {
    engineRef.current.generateAperture(diffConfig);
  }, [diffConfig]);

  // Initial wave & aperture setup
  useEffect(() => {
    engineRef.current.generateAperture(diffConfig);
    engineRef.current.propagateWave(suiteMode, source, diffConfig, interConfig, holoConfig);
    setCrossSection(engineRef.current.sampleCrossSection(sliceX, true));
    setSpectrumData(calculateVisibleSpectrum(thinFilmConfig));
  }, []);

  // Sound pulse when holography switches between recording and 3D reconstruction
  const prevReconRef = useRef(holoConfig.isReconstructing);
  useEffect(() => {
    if (prevReconRef.current !== holoConfig.isReconstructing) {
      prevReconRef.current = holoConfig.isReconstructing;
      audioEngineRef.current.playHologramLaserPulse();
    }
  }, [holoConfig.isReconstructing]);

  // Periodic telemetry and spectrum update loop (15 Hz)
  useEffect(() => {
    const timer = setInterval(() => {
      const currentMetrics = { ...engineRef.current.metrics };
      setMetrics(currentMetrics);
      setCrossSection(engineRef.current.sampleCrossSection(sliceX, true));

      const spec = calculateVisibleSpectrum(thinFilmConfig);
      setSpectrumData(spec);

      // Acoustic modulation
      audioEngineRef.current.updateTelemetry(
        source.wavelengthNm,
        currentMetrics.fringeVisibility,
        interConfig.piezoDisplacementNm / 2000,
        currentMetrics.cavityFinesse
      );
    }, 66);

    return () => clearInterval(timer);
  }, [sliceX, thinFilmConfig, source.wavelengthNm, interConfig.piezoDisplacementNm]);

  // Clean up audio engine on unmount
  useEffect(() => {
    return () => {
      audioEngineRef.current.destroy();
    };
  }, []);

  // Interactive piezo scan handler from canvas drag
  const handleInteractivePiezoMove = useCallback((deltaNm: number) => {
    setInterConfig((prev) => {
      const nextPiezo = Math.max(0, Math.min(2000, Math.round(prev.piezoDisplacementNm + deltaNm)));
      return { ...prev, piezoDisplacementNm: nextPiezo };
    });
  }, []);

  // Reset bench to canonical defaults
  const handleResetBench = useCallback(() => {
    handleUserInteraction();
    setSource({
      wavelengthNm: 532,
      coherenceLengthUm: 150,
      beamWaistMm: 1.2,
      intensityPower: 1.0,
    });
    setDiffConfig({
      preset: 'young-double-slit',
      slitWidthUm: 30,
      slitDistanceUm: 180,
      circularRadiusUm: 120,
      gratingDensityLpmm: 300,
      propagationDistanceMm: 120,
    });
    setInterConfig({
      type: 'MICHELSON',
      arm1LengthMm: 50,
      arm2LengthMm: 50,
      mirrorTiltDeg: 0.8,
      piezoDisplacementNm: 250,
      sampleRefractiveIndex: 1.05,
      sampleThicknessUm: 200,
      mirrorReflectivity: 0.9,
    });
    setThinFilmConfig({
      substrateIndex: 1.52,
      incidentAngleDeg: 0,
      polarization: 'UNPOLARIZED',
      layers: [...THIN_FILM_PRESETS[1].layers],
    });
    setHoloConfig({
      objectType: 'DOUBLE_PINHOLE',
      referenceAngleDeg: 2.2,
      recordingDistanceMm: 45,
      reconstructionDistanceMm: 45,
      isReconstructing: false,
    });
    setSliceX(Math.floor(280 * 0.72));
    audioEngineRef.current.playPhaseStepChime(90);
  }, [handleUserInteraction]);

  const handleToggleMute = useCallback(() => {
    handleUserInteraction();
    const muted = audioEngineRef.current.toggleMute();
    setIsMuted(muted);
  }, [handleUserInteraction]);

  return (
    <div
      onClick={handleUserInteraction}
      onKeyDown={handleUserInteraction}
      className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none"
    >
      {/* 1. Master Header & Telemetry Strip */}
      <Header
        suiteMode={suiteMode}
        onSelectSuiteMode={(m) => {
          handleUserInteraction();
          setSuiteMode(m);
          audioEngineRef.current.playPhaseStepChime(180);
        }}
        colormap={colormap}
        onSelectColormap={setColormap}
        displayMode={displayMode}
        onSelectDisplayMode={setDisplayMode}
        source={source}
        metrics={metrics}
        isPaused={isPaused}
        onTogglePause={() => {
          handleUserInteraction();
          setIsPaused((p) => !p);
        }}
        onResetBench={handleResetBench}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenExportModal={() => {
          handleUserInteraction();
          setIsExportModalOpen(true);
        }}
      />

      {/* 2. Main Optical Wavefront Viewport */}
      <main className="flex-1 relative w-full h-full overflow-hidden">
        <WaveBenchCanvas
          engine={engineRef.current}
          suiteMode={suiteMode}
          colormap={colormap}
          displayMode={displayMode}
          source={source}
          diffConfig={diffConfig}
          interConfig={interConfig}
          holoConfig={holoConfig}
          isPaused={isPaused}
          sliceX={sliceX}
          onSetSliceX={setSliceX}
          onInteractivePiezoMove={handleInteractivePiezoMove}
        />
      </main>

      {/* 3. Parameter Controls & Telemetry Dock */}
      <OpticsControlDeck
        suiteMode={suiteMode}
        source={source}
        onUpdateSource={setSource}
        diffConfig={diffConfig}
        onUpdateDiffConfig={setDiffConfig}
        interConfig={interConfig}
        onUpdateInterConfig={setInterConfig}
        thinFilmConfig={thinFilmConfig}
        onUpdateThinFilmConfig={setThinFilmConfig}
        holoConfig={holoConfig}
        onUpdateHoloConfig={setHoloConfig}
        metrics={metrics}
        crossSection={crossSection}
        spectrumData={spectrumData}
      />

      {/* 4. Data Export Modal */}
      <DataExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        suiteMode={suiteMode}
        source={source}
        metrics={metrics}
        crossSection={crossSection}
        spectrumData={spectrumData}
        thinFilmConfig={thinFilmConfig}
      />
    </div>
  );
};
