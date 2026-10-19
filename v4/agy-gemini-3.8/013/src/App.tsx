import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ElastodynamicsSolver } from './seismic/ElastodynamicsSolver';
import { TsunamiSolver } from './tsunami/TsunamiSolver';
import { SeismographNetwork } from './seismic/SeismographNetwork';
import { SeismicSonificationEngine } from './audio/SeismicSonificationEngine';
import {
  SEISMIC_SCENARIOS,
  STANDARD_GEOLOGY_LAYERS,
  ScenarioDefinition,
} from './seismic/FaultRuptureEngine';
import { Header } from './components/Header';
import { SeismicBenchCanvas } from './components/SeismicBenchCanvas';
import { SeismographDeck } from './components/SeismographDeck';
import { DataExportModal } from './components/DataExportModal';
import {
  SeismicSuiteMode,
  SeismicScenarioId,
  WaveFieldDisplayMode,
  ColormapMode,
  FaultConfig,
  GeologyLayer,
  SeismicMetrics,
  TravelTimeCurvePoint,
} from './types';

export const App: React.FC = () => {
  // 1. Core Physics & Simulation Engines
  const solverRef = useRef<ElastodynamicsSolver>(new ElastodynamicsSolver(240, 120, 1.0, 1.0));
  const tsunamiRef = useRef<TsunamiSolver>(new TsunamiSolver(240, 1.0));
  const networkRef = useRef<SeismographNetwork>(new SeismographNetwork());
  const audioEngineRef = useRef<SeismicSonificationEngine>(new SeismicSonificationEngine());

  // 2. High-Level Studio State
  const [suiteMode, setSuiteMode] = useState<SeismicSuiteMode>('ELASTODYNAMICS');
  const [scenarioId, setScenarioId] = useState<SeismicScenarioId>('cascadia-subduction');
  const [displayMode, setDisplayMode] = useState<WaveFieldDisplayMode>('CURL_SHEAR');
  const [colormap, setColormap] = useState<ColormapMode>('SEISMIC_BIPOLAR');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // 3. Geology & Active Scenario Parameters
  const [geologyLayers] = useState<GeologyLayer[]>([...STANDARD_GEOLOGY_LAYERS]);
  const [basinDepthKm, setBasinDepthKm] = useState<number>(0);
  const [oceanBathymetryKm, setOceanBathymetryKm] = useState<number>(3.8);

  const [fault, setFault] = useState<FaultConfig>({
    ...SEISMIC_SCENARIOS[0].fault,
  });

  // 4. Telemetry State
  const [metrics, setMetrics] = useState<SeismicMetrics>({
    simulationTimeSec: 0,
    momentMagnitudeMw: 9.0,
    seismicEnergyJoules: 1e18,
    maxPgaG: 0,
    maxPgvCmS: 0,
    surfaceWaveDisplacementMm: 0,
    spTimeLagSec: 0,
    tsunamiWaveHeightM: 0,
    tsunamiSpeedKmh: 0,
    activeWaveEnergy: 0,
  });

  const [travelTimeCurves, setTravelTimeCurves] = useState<TravelTimeCurvePoint[]>([]);

  // Initialize Web Audio on user gesture
  const handleUserInteraction = useCallback(() => {
    audioEngineRef.current.init();
  }, []);

  // Trigger earthquake rupture
  const handleTriggerEarthquake = useCallback(() => {
    handleUserInteraction();
    solverRef.current.triggerEarthquake(fault);
    audioEngineRef.current.playRuptureExplosion(fault.momentMagnitudeMw);

    // If ocean is present and mechanism is thrust, trigger tsunami seafloor uplift
    if (oceanBathymetryKm > 0 && fault.mechanism === 'THRUST_SUBDUCTION') {
      const upliftM = 1.2 * Math.pow(10, (fault.momentMagnitudeMw - 7.0) * 0.5);
      tsunamiRef.current.triggerUplift(fault.hypocenterXKm, upliftM, fault.ruptureLengthKm * 0.4);
    }
  }, [fault, oceanBathymetryKm, handleUserInteraction]);

  // Load selected scenario
  const handleSelectScenario = useCallback(
    (id: SeismicScenarioId) => {
      handleUserInteraction();
      setScenarioId(id);
      const sc = SEISMIC_SCENARIOS.find((s) => s.id === id) || SEISMIC_SCENARIOS[0];

      setFault({ ...sc.fault });
      setBasinDepthKm(sc.basinDepthKm);
      setOceanBathymetryKm(sc.oceanBathymetryKm);

      // Re-initialize solver geology and reset wavefields
      solverRef.current.resetFields();
      solverRef.current.updateGeology(geologyLayers, sc.basinDepthKm);
      networkRef.current.reset();
      tsunamiRef.current.reset();

      if (sc.oceanBathymetryKm > 0) {
        tsunamiRef.current.initBathymetry(sc.oceanBathymetryKm * 1000);
      }

      // Automatically trigger initial rupture for the new scenario
      setTimeout(() => {
        solverRef.current.triggerEarthquake(sc.fault);
        audioEngineRef.current.playRuptureExplosion(sc.fault.momentMagnitudeMw);

        if (sc.oceanBathymetryKm > 0 && sc.fault.mechanism === 'THRUST_SUBDUCTION') {
          const upliftM = 1.2 * Math.pow(10, (sc.fault.momentMagnitudeMw - 7.0) * 0.5);
          tsunamiRef.current.triggerUplift(sc.fault.hypocenterXKm, upliftM, sc.fault.ruptureLengthKm * 0.4);
        }
      }, 50);
    },
    [geologyLayers, handleUserInteraction]
  );

  // Initial geology setup & earthquake rupture on mount
  useEffect(() => {
    solverRef.current.updateGeology(geologyLayers, basinDepthKm);
    solverRef.current.triggerEarthquake(fault);
    if (oceanBathymetryKm > 0) {
      tsunamiRef.current.triggerUplift(fault.hypocenterXKm, 5.8, 45);
    }
    setTravelTimeCurves(networkRef.current.getTravelTimeCurves(5.8, 3.3, fault.hypocenterDepthKm));
  }, []);

  // Update travel time curves when hypocenter depth changes
  useEffect(() => {
    setTravelTimeCurves(networkRef.current.getTravelTimeCurves(5.8, 3.3, fault.hypocenterDepthKm));
  }, [fault.hypocenterDepthKm]);

  // Reset simulation fields
  const handleReset = useCallback(() => {
    handleUserInteraction();
    solverRef.current.resetFields();
    networkRef.current.reset();
    tsunamiRef.current.reset();
  }, [handleUserInteraction]);

  // Clean up audio engine on unmount
  useEffect(() => {
    return () => {
      audioEngineRef.current.destroy();
    };
  }, []);

  // Periodic telemetry and station sampling loop (15 Hz)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused) {
        // Update seismograph stations from surface velocity field with acoustic phase pick trigger
        networkRef.current.update(solverRef.current, fault.hypocenterXKm, (phase) => {
          audioEngineRef.current.playPhaseArrivalClick(phase);
        });

        // Aggregate network PGA and PGV
        let maxPga = 0;
        let maxPgv = 0;
        networkRef.current.stations.forEach((st) => {
          if (st.pgaG > maxPga) maxPga = st.pgaG;
          if (st.pgvCmS > maxPgv) maxPgv = st.pgvCmS;
        });

        // Acoustic modulation
        audioEngineRef.current.updateTelemetry(maxPgv, maxPga, tsunamiRef.current.leadingWaveHeightM);

        setMetrics({
          simulationTimeSec: solverRef.current.simTimeSec,
          momentMagnitudeMw: fault.momentMagnitudeMw,
          seismicEnergyJoules: Math.pow(10, 1.5 * fault.momentMagnitudeMw + 4.8),
          maxPgaG: maxPga,
          maxPgvCmS: maxPgv,
          surfaceWaveDisplacementMm: maxPgv * 0.8,
          spTimeLagSec: Math.abs(fault.hypocenterXKm - 105) * (1 / 3.3 - 1 / 5.8),
          tsunamiWaveHeightM: tsunamiRef.current.leadingWaveHeightM,
          tsunamiSpeedKmh: tsunamiRef.current.oceanSpeedKmh,
          activeWaveEnergy: maxPgv * maxPga,
        });
      }
    }, 66);

    return () => clearInterval(timer);
  }, [isPaused, fault.hypocenterXKm, fault.momentMagnitudeMw]);

  // Update hypocenter from direct canvas dragging
  const handleUpdateHypocenter = useCallback((xKm: number, depthKm: number) => {
    setFault((prev) => ({
      ...prev,
      hypocenterXKm: xKm,
      hypocenterDepthKm: depthKm,
    }));
  }, []);

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
      {/* 1. Master Header & Controls */}
      <Header
        suiteMode={suiteMode}
        onSelectSuiteMode={(m) => {
          handleUserInteraction();
          setSuiteMode(m);
        }}
        scenarioId={scenarioId}
        onSelectScenario={handleSelectScenario}
        displayMode={displayMode}
        onSelectDisplayMode={setDisplayMode}
        colormap={colormap}
        onSelectColormap={setColormap}
        metrics={metrics}
        fault={fault}
        isPaused={isPaused}
        onTogglePause={() => {
          handleUserInteraction();
          setIsPaused((p) => !p);
        }}
        onTriggerEarthquake={handleTriggerEarthquake}
        onReset={handleReset}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenExportModal={() => {
          handleUserInteraction();
          setIsExportModalOpen(true);
        }}
      />

      {/* 2. Main Elastodynamic Wavefield Viewport */}
      <main className="flex-1 relative w-full h-full overflow-hidden">
        <SeismicBenchCanvas
          solver={solverRef.current}
          tsunami={tsunamiRef.current}
          suiteMode={suiteMode}
          displayMode={displayMode}
          colormap={colormap}
          fault={fault}
          onUpdateHypocenter={handleUpdateHypocenter}
          stations={networkRef.current.stations}
          geologyLayers={geologyLayers}
          basinDepthKm={basinDepthKm}
          oceanBathymetryKm={oceanBathymetryKm}
          isPaused={isPaused}
        />
      </main>

      {/* 3. Parameter Controls & Seismograph Waveform Deck */}
      <SeismographDeck
        suiteMode={suiteMode}
        fault={fault}
        onUpdateFault={setFault}
        stations={networkRef.current.stations}
        metrics={metrics}
        travelTimeCurves={travelTimeCurves}
        tsunamiSurface={tsunamiRef.current.eta}
        tsunamiBathymetry={tsunamiRef.current.bathymetry}
        oceanBathymetryKm={oceanBathymetryKm}
      />

      {/* 4. Data Export Modal */}
      <DataExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        fault={fault}
        stations={networkRef.current.stations}
        metrics={metrics}
        geologyLayers={geologyLayers}
        tsunamiSurface={tsunamiRef.current.eta}
        tsunamiBathymetry={tsunamiRef.current.bathymetry}
        oceanBathymetryKm={oceanBathymetryKm}
      />
    </div>
  );
};
