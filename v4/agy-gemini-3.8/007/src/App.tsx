import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { EcosystemEngine, DEFAULT_ECOSYSTEM_PARAMS } from './engine/EcosystemEngine';
import {
  InterventionTool,
  MicroscopyMode,
  Organism,
  Genome,
  EcosystemTelemetry,
  EcosystemParams,
} from './types';
import { bioAudio } from './audio/BioAudioEngine';
import { ControlHeader } from './components/ControlHeader';
import { PetriCanvas } from './components/PetriCanvas';
import { SpecimenInspector } from './components/SpecimenInspector';
import { CrisprLabModal } from './components/CrisprLabModal';
import { EcosystemSidebar } from './components/EcosystemSidebar';

export function App() {
  const engine = useMemo(() => new EcosystemEngine(1000, 700), []);

  const [currentTool, setCurrentTool] = useState<InterventionTool>('SELECT_INSPECT');
  const [microscopy, setMicroscopy] = useState<MicroscopyMode>('DARK_FIELD');
  const [selectedOrganism, setSelectedOrganism] = useState<Organism | null>(null);

  const [isCrisprOpen, setIsCrisprOpen] = useState(false);
  const [crisprInitialGenome, setCrisprInitialGenome] = useState<Genome | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [params, setParams] = useState<EcosystemParams>(DEFAULT_ECOSYSTEM_PARAMS);

  const [telemetry, setTelemetry] = useState<EcosystemTelemetry>({
    totalOrganisms: 0,
    herbivoreCount: 0,
    carnivoreCount: 0,
    phototrophCount: 0,
    omnivoreCount: 0,
    totalNutrients: 0,
    avgLifespan: 0,
    shannonDiversityIndex: 0,
    peakGeneration: 1,
    fps: 60,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      bioAudio.dispose();
    };
  }, []);

  const handleUpdateParams = useCallback(
    (newParams: EcosystemParams) => {
      setParams(newParams);
      engine.params = { ...newParams };
    },
    [engine]
  );

  const handleLoadPreset = useCallback(
    (presetName: string) => {
      bioAudio.init();
      engine.loadPreset(presetName);
      setParams({ ...engine.params });
      setSelectedOrganism(null);
      bioAudio.playMitosisPop(440);
    },
    [engine]
  );

  const handleReset = useCallback(() => {
    engine.initDefaultEcosystem();
    setSelectedOrganism(null);
  }, [engine]);

  const handleToggleMute = useCallback(() => {
    bioAudio.init();
    setIsMuted((prev) => {
      const next = !prev;
      bioAudio.setMuted(next);
      return next;
    });
  }, []);

  // CRISPR synthesis and inoculation injection
  const handleInjectSpecies = useCallback(
    (genome: Genome, count: number) => {
      const cx = engine.width / 2;
      const cy = engine.height / 2;

      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const r = Math.random() * 80;
        engine.spawnOrganism(genome, cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
      }
      bioAudio.playMitosisPop(520);
    },
    [engine]
  );

  // Clone wild specimen into CRISPR splicer
  const handleCloneToCrispr = useCallback((org: Organism) => {
    setCrisprInitialGenome(org.genome);
    setIsCrisprOpen(true);
  }, []);

  // Keyboard hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCrisprOpen) return;
      if (e.key === '1') setCurrentTool('SELECT_INSPECT');
      else if (e.key === '2') setCurrentTool('PIPETTE_NUTRIENT');
      else if (e.key === '3') setCurrentTool('MUTAGEN_BEAM');
      else if (e.key === '4') setIsCrisprOpen(true);
      else if (e.key === '5') setCurrentTool('EXTERMINATE');
      else if (e.key.toLowerCase() === 'm') handleToggleMute();
      else if (e.key.toLowerCase() === 'c') handleReset();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCrisprOpen, handleToggleMute, handleReset]);

  return (
    <div className="w-screen h-screen bg-[#020617] text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* 1. Master Control Header */}
      <ControlHeader
        currentTool={currentTool}
        onSelectTool={setCurrentTool}
        microscopyMode={microscopy}
        onSelectMicroscopy={setMicroscopy}
        onLoadPreset={handleLoadPreset}
        onOpenCrisprLab={() => {
          setCrisprInitialGenome(null);
          setIsCrisprOpen(true);
        }}
        onReset={handleReset}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* 2. Main Simulation & Inspection Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 h-full relative" aria-label="Ecosystem Simulation Viewport">
          <PetriCanvas
            engine={engine}
            tool={currentTool}
            microscopy={microscopy}
            selectedOrganism={selectedOrganism}
            onSelectOrganism={setSelectedOrganism}
            onTelemetry={setTelemetry}
          />

          {/* Extinction Alert Overlay */}
          {telemetry.totalOrganisms === 0 && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-rose-500/40 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-4 text-xs z-20 animate-in fade-in duration-300">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <div>
                <strong className="text-rose-400 block font-semibold">Biosphere Depleted</strong>
                <span className="text-slate-400">All organisms have expired. Inoculate new life or reset the petri dish.</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCrisprOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all cursor-pointer"
                >
                  CRISPR Inoculate [4]
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
                >
                  Reset [C]
                </button>
              </div>
            </div>
          )}

          {/* Quick HUD overlay pill */}
          <div className="absolute bottom-3 left-4 bg-slate-950/80 border border-slate-800/80 px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-3 backdrop-blur-xs pointer-events-none text-slate-400">
            <div>TOOL: <strong className="text-cyan-400">{currentTool}</strong></div>
            <div>OPTICS: <strong className="text-emerald-400">{microscopy}</strong></div>
            <div className="hidden sm:block">HOTKEYS: [1-5] Tools &bull; [M] Sound &bull; [C] Reset</div>
          </div>

          {/* Specimen Inspector Modal Drawer */}
          <SpecimenInspector
            organism={selectedOrganism}
            onClose={() => setSelectedOrganism(null)}
            onCloneToCrispr={handleCloneToCrispr}
          />

          {/* CRISPR Lab Modal */}
          <CrisprLabModal
            isOpen={isCrisprOpen}
            onClose={() => setIsCrisprOpen(false)}
            onInjectSpecies={handleInjectSpecies}
            initialGenome={crisprInitialGenome}
          />
        </main>

        {/* 3. Telemetry & Environmental Controls Sidebar */}
        <EcosystemSidebar
          params={params}
          onUpdateParams={handleUpdateParams}
          telemetry={telemetry}
        />
      </div>
    </div>
  );
}
