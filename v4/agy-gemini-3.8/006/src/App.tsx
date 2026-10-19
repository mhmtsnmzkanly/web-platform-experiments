import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SPHEngine, DEFAULT_SPH_PARAMS } from './engine/SPHEngine';
import { ReactionDiffusionEngine, RD_PRESETS } from './engine/ReactionDiffusionEngine';
import { ToolMode, FluidType, SimulationMode, SPHParams, ReactionDiffusionParams, FluidTelemetry } from './types';
import { fluidAudio } from './audio/FluidAudioEngine';
import { ControlHeader } from './components/ControlHeader';
import { FluidCanvas } from './components/FluidCanvas';
import { PhysicsSidebar } from './components/PhysicsSidebar';

export function App() {
  const sphEngine = useMemo(() => new SPHEngine(800, 600), []);
  const rdEngine = useMemo(() => new ReactionDiffusionEngine(200, 150), []);

  const [toolMode, setToolMode] = useState<ToolMode>('EMIT_FLUID');
  const [fluidType, setFluidType] = useState<FluidType>('WATER');
  const [simMode, setSimMode] = useState<SimulationMode>('COUPLED_MORPHOGENESIS');

  const [sphParams, setSphParams] = useState<SPHParams>(DEFAULT_SPH_PARAMS);
  const [rdParams, setRdParams] = useState<ReactionDiffusionParams>(RD_PRESETS.CORAL_LABYRINTH);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [telemetry, setTelemetry] = useState<FluidTelemetry>({
    particleCount: 0,
    kineticEnergy: 0,
    maxPressure: 0,
    fps: 60,
    reynoldsNumber: 0,
  });

  // Initial preset on boot: Dam Break
  useEffect(() => {
    sphEngine.loadDamBreak();

    return () => {
      fluidAudio.dispose();
    };
  }, [sphEngine]);

  // Sync SPH parameters to engine
  const handleUpdateSPHParams = useCallback(
    (params: SPHParams) => {
      setSphParams(params);
      sphEngine.params = { ...params };
    },
    [sphEngine]
  );

  // Sync Reaction-Diffusion parameters to engine
  const handleUpdateRDParams = useCallback(
    (params: ReactionDiffusionParams) => {
      setRdParams(params);
      rdEngine.params = { ...params };
    },
    [rdEngine]
  );

  // Preset loading handler
  const handleLoadPreset = useCallback(
    (presetName: string) => {
      if (presetName === 'dam-break') {
        sphEngine.loadDamBreak();
        rdEngine.reset();
        fluidAudio.playPressureBurst();
      } else if (presetName === 'karman-vortex') {
        sphEngine.loadVortexChannel();
        rdEngine.reset();
        fluidAudio.playPressureBurst();
      } else if (presetName === 'coral-morph') {
        setSimMode('COUPLED_MORPHOGENESIS');
        sphEngine.clearAll();
        sphEngine.emitParticles(400, 300, 120, 'BIOLUMINESCENT', 60);
        rdEngine.reset();
        fluidAudio.playDroplet(800);
      }
    },
    [sphEngine, rdEngine]
  );

  const handleClear = useCallback(() => {
    sphEngine.clearAll();
    rdEngine.reset();
  }, [sphEngine, rdEngine]);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      fluidAudio.setMuted(next);
      return next;
    });
  }, []);

  // Keyboard hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '1') setToolMode('EMIT_FLUID');
      else if (e.key === '2') setToolMode('STIR_FORCE');
      else if (e.key === '3') setToolMode('DRAW_OBSTACLE');
      else if (e.key === '4') setToolMode('PLACE_VORTEX');
      else if (e.key === '5') setToolMode('ERASE');
      else if (e.key.toLowerCase() === 'm') handleToggleMute();
      else if (e.key.toLowerCase() === 'c') handleClear();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleMute, handleClear]);

  return (
    <div className="w-screen h-screen bg-[#030712] text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* 1. Master Control Header */}
      <ControlHeader
        toolMode={toolMode}
        onSelectTool={setToolMode}
        fluidType={fluidType}
        onSelectFluidType={setFluidType}
        simMode={simMode}
        onSelectSimMode={setSimMode}
        onLoadPreset={handleLoadPreset}
        onClear={handleClear}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* 2. Simulation Workspace: Interactive Canvas + Telemetry Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 h-full relative" aria-label="Fluid Simulation Viewport">
          <FluidCanvas
            sphEngine={sphEngine}
            rdEngine={rdEngine}
            toolMode={toolMode}
            fluidType={fluidType}
            simMode={simMode}
            onPointerAction={() => {}}
            onTelemetry={setTelemetry}
          />

          {/* Quick HUD overlay pill */}
          <div className="absolute bottom-3 left-4 bg-slate-950/80 border border-slate-800/80 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-3 backdrop-blur-xs pointer-events-none text-slate-400">
            <div>TOOL: <strong className="text-cyan-400">{toolMode}</strong></div>
            <div>MODE: <strong className="text-emerald-400">{simMode}</strong></div>
            <div className="hidden sm:block">HOTKEYS: [1-5] Tools &bull; [M] Sound &bull; [C] Clear</div>
          </div>
        </main>

        <PhysicsSidebar
          sphParams={sphParams}
          onUpdateSPHParams={handleUpdateSPHParams}
          rdParams={rdParams}
          onUpdateRDParams={handleUpdateRDParams}
          telemetry={telemetry}
        />
      </div>
    </div>
  );
}
