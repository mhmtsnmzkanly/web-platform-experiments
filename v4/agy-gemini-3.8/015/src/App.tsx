import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SuiteMode,
  ColormapMode,
  PresetId,
  TdglParameters,
  JosephsonParameters,
  BecParameters,
  CryoFridgeParameters,
  TelemetryMetrics,
} from './types';
import { CRYO_PRESETS } from './quantum/CryoPresets';
import { TimeDependentGinzburgLandau } from './quantum/TimeDependentGinzburgLandau';
import { JosephsonJunctionEngine } from './quantum/JosephsonJunctionEngine';
import { BecGrossPitaevskii } from './quantum/BecGrossPitaevskii';
import { CryogenicThermalEngine } from './cryo/CryogenicThermalEngine';
import { CryoSonificationEngine } from './audio/CryoSonificationEngine';
import { Header } from './components/Header';
import { QuantumBenchCanvas } from './components/QuantumBenchCanvas';
import { CryoControlDeck } from './components/CryoControlDeck';
import { DataExportModal } from './components/DataExportModal';

export const App: React.FC = () => {
  // Navigation & Display state
  const [suiteMode, setSuiteMode] = useState<SuiteMode>('TDGL_VORTEX');
  const [colormapMode, setColormapMode] = useState<ColormapMode>('CYAN_SUPERCONDUCTING');
  const [selectedPreset, setSelectedPreset] = useState<PresetId>('YBCO_MEISSNER');

  // Simulation running & audio state
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Parameter states
  const [tdglParams, setTdglParams] = useState<TdglParameters>({
    temperatureRatio: 0.25,
    kappa: 3.5,
    bExt: 0.45,
    jExt: 0.0,
    pinningDensity: 24,
    pinningStrength: 0.85,
    externalCoilRadius: 24,
    coilCenterX: 0.5,
    coilCenterY: 0.5,
  });

  const [josephsonParams, setJosephsonParams] = useState<JosephsonParameters>({
    iDc: 1.0,
    iRf: 0.0,
    fRf: 1.0,
    betaC: 1.0,
    squidFluxPhi: 0.0,
    asymmetryAlpha: 0.05,
    inductanceBetaL: 0.1,
  });

  const [becParams, setBecParams] = useState<BecParameters>({
    scatteringG: 1.0,
    barrierHeight: 8.0,
    barrierWidth: 6.0,
    trapAspect: 1.0,
    stirringSpeed: 0.0,
    stirringActive: false,
    timeOfFlight: false,
  });

  const [cryoParams, setCryoParams] = useState<CryoFridgeParameters>({
    stage300Temp: 300.0,
    stage77Temp: 77.3,
    stage4Temp: 4.2,
    stage1Temp: 1.25,
    stageMCTemp: 0.015,
    he3FlowRate: 120.0,
    heaterPower: 15.0,
    superconductorMaterial: 'YBCO',
    magnetCurrentA: 140.0,
    isQuenched: false,
    energyDumpActive: false,
  });

  // Telemetry metrics
  const [metrics, setMetrics] = useState<TelemetryMetrics>({
    orderParamAvg: 0.85,
    orderParamMax: 1.0,
    vortexCount: 0,
    supercurrentMag: 0.0,
    phaseDifferencePhi: 0.0,
    junctionVoltageMilliV: 0.0,
    squidSensitivity: 0.0,
    becCondensateFraction: 0.95,
    becInterferenceVisibility: 0.0,
    mixingChamberTempK: 0.015,
    coolingPowerMicroW: 120.0,
    jouleDissipationWatts: 0.0,
    storedMagneticEnergyKJ: 47.0,
    simFps: 60,
    simStepCount: 0,
  });

  // Physics Engines & Audio instances (persisted via refs)
  const tdglSolverRef = useRef<TimeDependentGinzburgLandau>(new TimeDependentGinzburgLandau());
  const josephsonEngineRef = useRef<JosephsonJunctionEngine>(new JosephsonJunctionEngine());
  const becSolverRef = useRef<BecGrossPitaevskii>(new BecGrossPitaevskii());
  const cryoEngineRef = useRef<CryogenicThermalEngine>(new CryogenicThermalEngine());
  const sonificationRef = useRef<CryoSonificationEngine>(new CryoSonificationEngine());

  // Ref tracking current params for simulation loop
  const simStateRef = useRef({
    isRunning,
    suiteMode,
    tdglParams,
    josephsonParams,
    becParams,
    cryoParams,
  });

  useEffect(() => {
    simStateRef.current = {
      isRunning,
      suiteMode,
      tdglParams,
      josephsonParams,
      becParams,
      cryoParams,
    };
  }, [isRunning, suiteMode, tdglParams, josephsonParams, becParams, cryoParams]);

  // Handle Preset Switching
  const handleSelectPreset = useCallback((presetId: PresetId) => {
    const preset = CRYO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setSelectedPreset(presetId);
    setSuiteMode(preset.suiteMode);

    if (preset.tdgl) {
      setTdglParams((prev) => {
        const next = { ...prev, ...preset.tdgl };
        tdglSolverRef.current.generateDefaultPinningSites(
          next.pinningDensity,
          next.pinningStrength
        );
        tdglSolverRef.current.resetOrderParameter(0.85);
        return next;
      });
    }

    if (preset.josephson) {
      setJosephsonParams((prev) => {
        const next = { ...prev, ...preset.josephson };
        josephsonEngineRef.current.computeStaticCurves(next);
        return next;
      });
    }

    if (preset.bec) {
      setBecParams((prev) => {
        const next = { ...prev, ...preset.bec };
        becSolverRef.current.initializeGroundState(next.barrierHeight > 0);
        return next;
      });
    }

    if (preset.cryo) {
      setCryoParams((prev) => {
        const next = { ...prev, ...preset.cryo };
        if (!next.isQuenched) {
          cryoEngineRef.current.resetFridge();
        }
        return next;
      });
    }
  }, []);

  // Audio gesture initialization
  const ensureAudio = useCallback(() => {
    const audio = sonificationRef.current;
    audio.init();
    audio.resume();
  }, []);

  const handleToggleMute = useCallback(() => {
    ensureAudio();
    setIsMuted((prev) => {
      const next = !prev;
      sonificationRef.current.setMuted(next);
      return next;
    });
  }, [ensureAudio]);

  // Simulation physics loop (60 FPS tick decoupled from React state)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();
    let currentFps = 60;
    let stepCounter = 0;

    const tick = (now: number) => {
      frameCount++;
      if (now - fpsTimer >= 1000) {
        currentFps = Math.round((frameCount * 1000) / (now - fpsTimer));
        frameCount = 0;
        fpsTimer = now;
      }

      const st = simStateRef.current;
      if (st.isRunning) {
        stepCounter++;

        // 1. TDGL Step (active on TDGL tab, throttled when in background)
        const tdgl = tdglSolverRef.current;
        if (st.suiteMode === 'TDGL_VORTEX') {
          tdgl.updateVectorPotential(st.tdglParams);
          tdgl.step(st.tdglParams);
          if (tdgl.newVortexDetected) {
            sonificationRef.current.triggerVortexClick();
          }
        } else if (stepCounter % 6 === 0) {
          tdgl.step(st.tdglParams);
        }

        // 2. Josephson Step (active on SQUID tab, throttled in background)
        const jEngine = josephsonEngineRef.current;
        if (st.suiteMode === 'JOSEPHSON_SQUID') {
          jEngine.step(st.josephsonParams, 0.02, 8);
        } else if (stepCounter % 4 === 0) {
          jEngine.step(st.josephsonParams, 0.02, 2);
        }

        // 3. BEC Step (active on BEC tab)
        const bec = becSolverRef.current;
        if (st.suiteMode === 'BEC_SUPERFLUID') {
          bec.step(st.becParams);
        }

        // 4. Cryo Thermal Step (continuous cryostat thermodynamic clock)
        const cryo = cryoEngineRef.current;
        cryo.step(st.cryoParams, 0.05);

        // 5. Update Web Audio sonification
        const audio = sonificationRef.current;
        audio.updateSquidTone(
          jEngine.physicalVoltageMilliV,
          jEngine.squidSensitivity,
          st.suiteMode === 'JOSEPHSON_SQUID'
        );
        audio.updateShapiroTone(
          st.josephsonParams.fRf,
          st.josephsonParams.iRf,
          st.suiteMode === 'JOSEPHSON_SQUID'
        );
        audio.updateCryoNoise(cryo.boilOffRateLps, cryo.tMC);
        audio.updateQuenchState(cryo.isQuenched, cryo.jouleHeatingWatts);

        // Throttled UI state updates (~20 Hz)
        if (stepCounter % 3 === 0) {
          setMetrics({
            orderParamAvg: tdgl.avgOrderParam,
            orderParamMax: tdgl.maxOrderParam,
            vortexCount: tdgl.vortexCount,
            supercurrentMag: tdgl.totalSupercurrent,
            phaseDifferencePhi: jEngine.phi,
            junctionVoltageMilliV: jEngine.physicalVoltageMilliV,
            squidSensitivity: jEngine.squidSensitivity,
            becCondensateFraction: bec.condensateFraction,
            becInterferenceVisibility: bec.interferenceVisibility,
            mixingChamberTempK: cryo.tMC,
            coolingPowerMicroW: cryo.coolingPowerMicroW,
            jouleDissipationWatts: cryo.jouleHeatingWatts,
            storedMagneticEnergyKJ: cryo.storedEnergyKJ,
            simFps: currentFps,
            simStepCount: stepCounter,
          });
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      sonificationRef.current.dispose();
    };
  }, []);

  // UI Handlers
  const handleUpdateTdglParams = (p: Partial<TdglParameters>) => {
    const next = { ...tdglParams, ...p };
    if (p.pinningDensity !== undefined && p.pinningDensity !== tdglParams.pinningDensity) {
      tdglSolverRef.current.generateDefaultPinningSites(next.pinningDensity, next.pinningStrength);
    }
    setTdglParams(next);
  };

  const handleUpdateTdglCoil = (normX: number, normY: number) => {
    setTdglParams((prev) => ({
      ...prev,
      coilCenterX: normX,
      coilCenterY: normY,
    }));
  };

  const handleAddPinningSite = (x: number, y: number) => {
    tdglSolverRef.current.addPinningSite(x, y, tdglParams.pinningStrength);
  };

  const handleUpdateJosephsonParams = (p: Partial<JosephsonParameters>) => {
    const next = { ...josephsonParams, ...p };
    josephsonEngineRef.current.computeStaticCurves(next);
    setJosephsonParams(next);
  };

  const handleUpdateBecParams = (p: Partial<BecParameters>) => {
    setBecParams((prev) => ({ ...prev, ...p }));
  };

  const handleUpdateCryoParams = (p: Partial<CryoFridgeParameters>) => {
    setCryoParams((prev) => ({ ...prev, ...p }));
  };

  const handleResetTdgl = () => {
    tdglSolverRef.current.resetOrderParameter(0.85);
  };

  const handleClearPinning = () => {
    tdglSolverRef.current.clearPinningSites();
    setTdglParams((prev) => ({ ...prev, pinningDensity: 0 }));
  };

  const handleRegenPinning = () => {
    tdglSolverRef.current.generateDefaultPinningSites(
      tdglParams.pinningDensity || 16,
      tdglParams.pinningStrength
    );
  };

  const handleResetBec = (isDoubleWell: boolean) => {
    becSolverRef.current.initializeGroundState(isDoubleWell);
  };

  const handleTriggerQuench = () => {
    setCryoParams((prev) => ({ ...prev, isQuenched: true }));
  };

  const handleResetFridge = () => {
    cryoEngineRef.current.resetFridge();
    setCryoParams((prev) => ({ ...prev, isQuenched: false }));
  };

  return (
    <div
      onClick={ensureAudio}
      className="flex flex-col h-screen w-screen bg-[#020617] text-slate-100 overflow-hidden font-sans select-none"
    >
      {/* Top Header */}
      <Header
        suiteMode={suiteMode}
        onSetSuiteMode={setSuiteMode}
        selectedPreset={selectedPreset}
        onSelectPreset={handleSelectPreset}
        isRunning={isRunning}
        onToggleRunning={() => setIsRunning((r) => !r)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenExport={() => setIsExportOpen(true)}
        onReset={() => handleSelectPreset(selectedPreset)}
        metrics={metrics}
      />

      {/* Main Interactive Canvas */}
      <main className="flex-1 relative overflow-hidden bg-slate-950 flex items-center justify-center">
        <QuantumBenchCanvas
          suiteMode={suiteMode}
          colormapMode={colormapMode}
          tdglParams={tdglParams}
          josephsonParams={josephsonParams}
          becParams={becParams}
          cryoParams={cryoParams}
          tdglSolver={tdglSolverRef.current}
          josephsonEngine={josephsonEngineRef.current}
          becSolver={becSolverRef.current}
          cryoEngine={cryoEngineRef.current}
          onUpdateTdglCoil={handleUpdateTdglCoil}
          onAddPinningSite={handleAddPinningSite}
        />
      </main>

      {/* Lower Instrumentation Control Deck */}
      <CryoControlDeck
        suiteMode={suiteMode}
        colormapMode={colormapMode}
        onSetColormapMode={setColormapMode}
        tdglParams={tdglParams}
        onUpdateTdglParams={handleUpdateTdglParams}
        josephsonParams={josephsonParams}
        onUpdateJosephsonParams={handleUpdateJosephsonParams}
        becParams={becParams}
        onUpdateBecParams={handleUpdateBecParams}
        cryoParams={cryoParams}
        onUpdateCryoParams={handleUpdateCryoParams}
        onResetTdgl={handleResetTdgl}
        onClearPinning={handleClearPinning}
        onRegenPinning={handleRegenPinning}
        onResetBec={handleResetBec}
        onTriggerQuench={handleTriggerQuench}
        onResetFridge={handleResetFridge}
      />

      {/* Data Export Modal */}
      <DataExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        suiteMode={suiteMode}
        tdglParams={tdglParams}
        josephsonParams={josephsonParams}
        becParams={becParams}
        cryoParams={cryoParams}
        metrics={metrics}
        josephsonEngine={josephsonEngineRef.current}
      />
    </div>
  );
};
