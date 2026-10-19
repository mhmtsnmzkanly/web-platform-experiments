import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FDTDSolver, NX, NY } from './engine/FDTDSolver';
import { rfAudio } from './audio/RFAudioSynthesizer';
import {
  SimParameters,
  PresetType,
  FieldProbe,
  PhysicalObservables,
} from './types';
import { ElectrodynamicsCanvas } from './components/ElectrodynamicsCanvas';
import { OscilloscopePanel } from './components/OscilloscopePanel';
import { TelemetryStrip } from './components/TelemetryStrip';
import { ControlHeader } from './components/ControlHeader';

const DEFAULT_PROBES: FieldProbe[] = [
  { id: 'p1', name: 'PROBE A (INCIDENT)', x: 40, y: Math.floor(NY / 2), color: '#38bdf8', history: [] },
  { id: 'p2', name: 'PROBE B (SCATTERED)', x: 195, y: Math.floor(NY / 2), color: '#f43f5e', history: [] },
];

export function App() {
  const solver = useMemo(() => new FDTDSolver(), []);

  const [params, setParams] = useState<SimParameters>({
    wavelength: 18,
    epsRel: 4.0,
    sourceAngleDeg: 0,
    sourceMode: 'CONTINUOUS_PLANE',
    materialBrush: 'DIELECTRIC',
    brushRadius: 6,
    customText: 'HELLO WORLD',
    colorMap: 'BIPOLAR_ELECTRIC',
    showPoyntingVectors: false,
    showWavefrontContours: false,
    isPaused: false,
    audioSonification: false,
  });

  const [activeTool, setActiveTool] = useState<'BRUSH' | 'PROBE'>('BRUSH');
  const [activeProbeIndex, setActiveProbeIndex] = useState<number>(1); // default target Probe B
  const [probes, setProbes] = useState<FieldProbe[]>(DEFAULT_PROBES);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [pulseFired, setPulseFired] = useState<boolean>(false);
  const [prePulseEnergy, setPrePulseEnergy] = useState<number>(0);

  const [observables, setObservables] = useState<PhysicalObservables>(() =>
    solver.computeObservables(params)
  );

  const paramsRef = useRef(params);
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  const probesRef = useRef(probes);
  useEffect(() => {
    probesRef.current = probes;
  }, [probes]);

  // Teardown Web Audio on component unmount
  useEffect(() => {
    return () => {
      rfAudio.dispose();
    };
  }, []);

  // Update Parameters
  const handleUpdateParams = useCallback((partial: Partial<SimParameters>) => {
    setParams((prev) => {
      const updated = { ...prev, ...partial };
      paramsRef.current = updated;
      return updated;
    });
  }, []);

  // Apply Handcrafted Preset
  const handleApplyPreset = useCallback(
    (preset: PresetType) => {
      rfAudio.playClick();
      solver.applyPreset(preset, paramsRef.current.customText, paramsRef.current.epsRel);
    },
    [solver]
  );

  // Shock Burst Action
  const handleShockBurst = useCallback(() => {
    const curObs = solver.computeObservables(paramsRef.current);
    setPrePulseEnergy(curObs.totalEnergyMicroJ);
    setPulseFired(true);

    rfAudio.playShockPulse();
    solver.triggerShockBurst();
  }, [solver]);

  // Reset Fields
  const handleResetFields = useCallback(() => {
    rfAudio.playClick();
    solver.resetFields();
  }, [solver]);

  // Toggle Audio
  const handleToggleAudio = useCallback(() => {
    const muted = rfAudio.toggleMute();
    setIsAudioMuted(muted);
    handleUpdateParams({ audioSonification: !muted });
  }, [handleUpdateParams]);

  // Paint Brush on grid
  const handlePaint = useCallback(
    (x: number, y: number) => {
      const p = paramsRef.current;
      solver.paintMaterial(x, y, p.brushRadius, p.materialBrush, p.epsRel);
    },
    [solver]
  );

  // Place Active Selected Probe (Probe A or Probe B)
  const handlePlaceProbe = useCallback(
    (x: number, y: number) => {
      rfAudio.playClick();
      setProbes((prev) => {
        const updated = [...prev];
        const targetIdx = activeProbeIndex;
        if (targetIdx >= 0 && targetIdx < updated.length) {
          updated[targetIdx] = {
            ...updated[targetIdx],
            x: Math.round(x),
            y: Math.round(y),
            history: [],
          };
        }
        return updated;
      });
    },
    [activeProbeIndex]
  );

  // High-Frequency Oscilloscope Telemetry & Sonification Poller
  useEffect(() => {
    const interval = setInterval(() => {
      const curParams = paramsRef.current;
      const curProbes = probesRef.current;

      // Update probe histories
      const updatedProbes = curProbes.map((pr) => {
        const val = solver.getFieldValueAt(pr.x, pr.y);
        const nextHist = [...pr.history, val];
        if (nextHist.length > 120) nextHist.shift(); // keep 120 samples
        return { ...pr, history: nextHist };
      });

      setProbes(updatedProbes);

      // Compute physical invariants
      const obs = solver.computeObservables(curParams);
      setObservables(obs);

      // Sonification: active probe
      if (!isAudioMuted && updatedProbes[0]) {
        const probeVal = solver.getFieldValueAt(updatedProbes[0].x, updatedProbes[0].y);
        rfAudio.updateProbeSonification(probeVal, obs.totalEnergyMicroJ);
      }

      // Backward compatible verification contract
      (window as unknown as { labEvidence: () => unknown }).labEvidence = () => {
        const validCFL = obs.cflStabilityNumber <= 0.7071;
        const validEnergy = obs.totalEnergyMicroJ > 0.0;
        return {
          subject: curParams.customText || 'HELLO WORLD',
          passed: validCFL && validEnergy && obs.dielectricPhaseDelayRad > 0.5,
          mechanism: '2D Yee-Lattice FDTD Maxwell Solver through Typographic Dielectric Metasurface',
          measurements: {
            cflStability: obs.cflStabilityNumber,
            totalEnergy: obs.totalEnergyMicroJ,
            transmissionRatio: obs.transmissionRatio,
            phaseDelayRad: obs.dielectricPhaseDelayRad,
            dielectricNodes: obs.dielectricNodesCount,
            epsRelGlyph: curParams.epsRel,
            wavelength0: curParams.wavelength,
          },
        };
      };

      (window as unknown as { labInteractionEvidence: () => unknown }).labInteractionEvidence = () => {
        if (!pulseFired) return null;
        return {
          subject: curParams.customText || 'HELLO WORLD',
          passed: pulseFired && obs.totalEnergyMicroJ > prePulseEnergy,
          mechanism: 'Terahertz Wavefront Pulse Injection & Electromagnetic Energy Surge',
          measurements: {
            totalEnergy: obs.totalEnergyMicroJ,
            prePulseEnergy: prePulseEnergy,
            transmissionRatio: obs.transmissionRatio,
          },
        };
      };
    }, 40);

    return () => clearInterval(interval);
  }, [solver, isAudioMuted, pulseFired, prePulseEnergy]);

  return (
    <main className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-mono">
      {/* Top Controls & Navigation Header */}
      <ControlHeader
        params={params}
        onUpdateParams={handleUpdateParams}
        onApplyPreset={handleApplyPreset}
        onShockBurst={handleShockBurst}
        onResetFields={handleResetFields}
        activeTool={activeTool}
        onSetActiveTool={setActiveTool}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 p-3 flex flex-col gap-3 max-w-7xl mx-auto w-full">
        {/* Central Electromagnetic Simulation Canvas */}
        <section aria-label="Microwave Anechoic Chamber" className="relative flex flex-col items-center">
          <ElectrodynamicsCanvas
            solver={solver}
            params={params}
            probes={probes}
            activeTool={activeTool}
            onPlaceProbe={handlePlaceProbe}
            onPaint={handlePaint}
          />

          {/* In-situ HUD badges */}
          <div className="absolute top-3 left-4 pointer-events-none flex flex-col gap-1 text-[10px]">
            <span className="bg-amber-950/80 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold shadow">
              METASURFACE: {params.customText} (εᵣ = {params.epsRel.toFixed(1)})
            </span>
            <span className="text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
              YEE GRID: {NX} × {NY} ({NX * NY} CELLS) • 1ST-ORDER MUR ABC
            </span>
          </div>
        </section>

        {/* Real-time Oscilloscope Panel */}
        <section aria-label="Field Oscilloscope">
          <OscilloscopePanel
            probes={probes}
            activeProbeIndex={activeProbeIndex}
            onSelectProbeIndex={setActiveProbeIndex}
          />
        </section>

        {/* Bottom Maxwell Telemetry Strip */}
        <TelemetryStrip obs={observables} />
      </div>
    </main>
  );
}
