/**
 * PLASMA-LAB: Magnetohydrodynamic (MHD) & Tokamak Fusion Reactor Studio
 * Main Application Orchestrator
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  PlasmaSuiteMode,
  PlasmaColormap,
  DiagnosticMode,
  FusionScenarioId,
  TokamakGeometry,
  PlasmaControls,
  TokamakMetrics,
  RadialProfilePoint,
} from './types';
import { FUSION_SCENARIOS } from './plasma/TokamakPresets';
import { GradShafranovSolver } from './plasma/GradShafranovSolver';
import { ThermonuclearEngine } from './plasma/ThermonuclearEngine';
import { MhdInstabilityEngine } from './plasma/MhdInstabilityEngine';
import { PlasmaSonificationEngine } from './audio/PlasmaSonificationEngine';
import { Header } from './components/Header';
import { TokamakBenchCanvas } from './components/TokamakBenchCanvas';
import { PlasmaControlDeck } from './components/PlasmaControlDeck';
import { DataExportModal } from './components/DataExportModal';

export const App: React.FC = () => {
  // Scenario & Modes
  const [scenarioId, setScenarioId] = useState<FusionScenarioId>('iter-baseline');
  const [suiteMode, setSuiteMode] = useState<PlasmaSuiteMode>('MAGNETIC_TOPOLOGY');
  const [colormap, setColormap] = useState<PlasmaColormap>('THERMAL_FIRE');
  const [diagnosticMode, setDiagnosticMode] = useState<DiagnosticMode>('ELECTRON_TEMP');

  // Tokamak Parameters
  const initialScenario = FUSION_SCENARIOS[0];
  const [geom, setGeom] = useState<TokamakGeometry>({ ...initialScenario.geometry });
  const [controls, setControls] = useState<PlasmaControls>({ ...initialScenario.controls });

  // Simulation Controls & Telemetry
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Persistent Physics & Audio Engines (Refs to prevent GC churn)
  const solverRef = useRef<GradShafranovSolver>(new GradShafranovSolver(initialScenario.geometry));
  const thermoRef = useRef<ThermonuclearEngine>(new ThermonuclearEngine(initialScenario.geometry, initialScenario.controls));
  const mhdRef = useRef<MhdInstabilityEngine>(new MhdInstabilityEngine());
  const audioEngineRef = useRef<PlasmaSonificationEngine>(new PlasmaSonificationEngine());

  // Reactive Telemetry State for UI
  const [metrics, setMetrics] = useState<TokamakMetrics>({
    simTimeSec: 0.0,
    plasmaCurrentIpMa: initialScenario.geometry.plasmaCurrentIp,
    centralTeKev: 18.0,
    centralTiKev: 17.2,
    peakDensityN20: initialScenario.controls.targetDensityN20 * 1.3,
    storedThermalEnergyMj: 350.0,
    fusionPowerMw: 480.0,
    alphaPowerMw: 96.0,
    auxiliaryPowerMw: 50.0,
    radiatedPowerMw: 25.0,
    qFactor: 9.6,
    lawsonParameter: 62.0,
    confinementTimeTauESec: 3.6,
    troyonBetaN: 2.3,
    greenwaldFraction: 0.75,
    q95: 3.2,
    q0: 1.05,
    verticalDisplacementZMm: 0.0,
    tearingIslandWidthCm: 2.5,
    disruptionRisk: 0.04,
    isDisrupted: false,
    disruptionReason: null,
  });

  const [radialProfiles, setRadialProfiles] = useState<RadialProfilePoint[]>(
    solverRef.current.getRadialProfiles()
  );

  // User gesture listener to unlock Web Audio API
  const handleUserInteraction = useCallback(() => {
    audioEngineRef.current.init();
  }, []);

  useEffect(() => {
    window.addEventListener('pointerdown', handleUserInteraction, { once: true });
    window.addEventListener('keydown', handleUserInteraction, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [handleUserInteraction]);

  // Clean up audio engine on unmount
  useEffect(() => {
    return () => {
      audioEngineRef.current.destroy();
    };
  }, []);

  // Scenario Selection Handler
  const handleSelectScenario = useCallback(
    (id: FusionScenarioId) => {
      handleUserInteraction();
      setScenarioId(id);
      const sc = FUSION_SCENARIOS.find((s) => s.id === id) || FUSION_SCENARIOS[0];

      setGeom({ ...sc.geometry });
      setControls({ ...sc.controls });

      solverRef.current.updateGridBounds(sc.geometry);
      solverRef.current.solveEquilibrium(sc.geometry, 16.0, 0.0);
      thermoRef.current.reset(sc.geometry, sc.controls);
      mhdRef.current.reset();
      mhdRef.current.initPoincareMap(
        sc.geometry.majorRadiusR0,
        sc.geometry.minorRadiusA,
        sc.geometry.elongationKappa,
        sc.geometry.triangularityDelta
      );

      setRadialProfiles(solverRef.current.getRadialProfiles());
      audioEngineRef.current.playDiagnosticChime();
    },
    [handleUserInteraction]
  );

  // Trigger Plasma Disruption Manually
  const handleTriggerDisruption = useCallback(() => {
    handleUserInteraction();
    mhdRef.current.triggerDisruption('MANUAL OPERATOR THERMAL QUENCH');
    audioEngineRef.current.playDisruptionCrash();
  }, [handleUserInteraction]);

  // Re-ignite Plasma after disruption
  const handleResetDisruption = useCallback(() => {
    handleUserInteraction();
    mhdRef.current.reset();
    thermoRef.current.reset(geom, controls);
    solverRef.current.solveEquilibrium(geom, 15.0, 0.0);
    audioEngineRef.current.playDiagnosticChime();
  }, [geom, controls, handleUserInteraction]);

  // Reset Reactor
  const handleReset = useCallback(() => {
    handleUserInteraction();
    const sc = FUSION_SCENARIOS.find((s) => s.id === scenarioId) || FUSION_SCENARIOS[0];
    setGeom({ ...sc.geometry });
    setControls({ ...sc.controls });
    solverRef.current.solveEquilibrium(sc.geometry, 16.0, 0.0);
    thermoRef.current.reset(sc.geometry, sc.controls);
    mhdRef.current.reset();
    audioEngineRef.current.playDiagnosticChime();
  }, [scenarioId, handleUserInteraction]);

  // Handle Geometry Updates with dynamic Poincaré map & grid recalculation
  const handleUpdateGeometry = useCallback(
    (updater: (prev: TokamakGeometry) => TokamakGeometry) => {
      setGeom((prev) => {
        const next = updater(prev);
        solverRef.current.updateGridBounds(next);
        mhdRef.current.initPoincareMap(
          next.majorRadiusR0,
          next.minorRadiusA,
          next.elongationKappa,
          next.triangularityDelta
        );
        return next;
      });
    },
    []
  );

  // Vertical offset dragging from canvas gizmo
  const handleUpdateVerticalOffset = useCallback((dZMm: number) => {
    mhdRef.current.verticalOffsetZMm = dZMm;
    mhdRef.current.verticalVelocityZMmS = 0.0;
  }, []);

  // Audio mute toggle
  const handleToggleMute = useCallback(() => {
    handleUserInteraction();
    const muted = audioEngineRef.current.toggleMute();
    setIsMuted(muted);
  }, [handleUserInteraction]);

  // Periodic Simulation Loop (30 Hz)
  useEffect(() => {
    const dt = 0.033; // 33 ms step
    const timer = setInterval(() => {
      if (!isPaused) {
        // Step Thermonuclear kinetics
        thermoRef.current.step(geom, controls, dt);

        // Step MHD stability, tearing modes, and VDE dynamics
        mhdRef.current.step(geom, controls, solverRef.current, thermoRef.current, dt);

        // Update 2D Grad-Shafranov equilibrium
        solverRef.current.solveEquilibrium(
          geom,
          thermoRef.current.centralTeKev,
          mhdRef.current.verticalOffsetZMm / 1000.0
        );

        // Acoustic telemetry modulation
        audioEngineRef.current.updateTelemetry(
          geom.toroidalFieldB0,
          geom.plasmaCurrentIp,
          thermoRef.current.pFusMw,
          mhdRef.current.tearingIslandWidthCm,
          mhdRef.current.disruptionRisk,
          mhdRef.current.isDisrupted
        );

        // Update UI metrics state
        setMetrics((prev) => ({
          simTimeSec: prev.simTimeSec + dt,
          plasmaCurrentIpMa: geom.plasmaCurrentIp,
          centralTeKev: thermoRef.current.centralTeKev,
          centralTiKev: thermoRef.current.centralTiKev,
          peakDensityN20: thermoRef.current.lineAvgDensityN20 * 1.3,
          storedThermalEnergyMj: thermoRef.current.storedThermalEnergyMj,
          fusionPowerMw: thermoRef.current.pFusMw,
          alphaPowerMw: thermoRef.current.pAlphaMw,
          auxiliaryPowerMw: thermoRef.current.pAuxMw,
          radiatedPowerMw: thermoRef.current.pRadMw,
          qFactor: thermoRef.current.qFactor,
          lawsonParameter: thermoRef.current.lawsonTripleProduct,
          confinementTimeTauESec: thermoRef.current.tauESec,
          troyonBetaN: mhdRef.current.troyonBetaN,
          greenwaldFraction: mhdRef.current.greenwaldFraction,
          q95: solverRef.current.q95,
          q0: solverRef.current.q0,
          verticalDisplacementZMm: mhdRef.current.verticalOffsetZMm,
          tearingIslandWidthCm: mhdRef.current.tearingIslandWidthCm,
          disruptionRisk: mhdRef.current.disruptionRisk,
          isDisrupted: mhdRef.current.isDisrupted,
          disruptionReason: mhdRef.current.disruptionReason,
        }));

        setRadialProfiles(solverRef.current.getRadialProfiles());
      }
    }, 33);

    return () => clearInterval(timer);
  }, [isPaused, geom, controls]);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#030712] text-slate-100 overflow-hidden font-sans">
      {/* Top Header & Telemetry Bar */}
      <Header
        scenarioId={scenarioId}
        onSelectScenario={handleSelectScenario}
        suiteMode={suiteMode}
        onSelectSuiteMode={setSuiteMode}
        colormap={colormap}
        onSelectColormap={setColormap}
        diagnosticMode={diagnosticMode}
        onSelectDiagnosticMode={setDiagnosticMode}
        geom={geom}
        metrics={metrics}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused((prev) => !prev)}
        onReset={handleReset}
        onTriggerDisruption={handleTriggerDisruption}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Tokamak Poloidal Cross-Section & Magnetic Bench Canvas */}
      <div className="flex-1 w-full relative overflow-hidden">
        <TokamakBenchCanvas
          geom={geom}
          controls={controls}
          metrics={metrics}
          colormap={colormap}
          diagnosticMode={diagnosticMode}
          solver={solverRef.current}
          mhd={mhdRef.current}
          onUpdateGeometry={handleUpdateGeometry}
          onUpdateVerticalOffset={handleUpdateVerticalOffset}
          isPaused={isPaused}
        />
      </div>

      {/* Lower Instrumentation & Control Deck */}
      <PlasmaControlDeck
        suiteMode={suiteMode}
        onSelectSuiteMode={setSuiteMode}
        geom={geom}
        controls={controls}
        metrics={metrics}
        radialProfiles={radialProfiles}
        onUpdateGeometry={handleUpdateGeometry}
        onUpdateControls={setControls}
        onResetDisruption={handleResetDisruption}
      />

      {/* Data Export Modal */}
      <DataExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        geom={geom}
        controls={controls}
        metrics={metrics}
        radialProfiles={radialProfiles}
      />
    </div>
  );
};
