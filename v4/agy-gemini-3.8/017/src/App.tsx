import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  SuiteMode,
  ColliderPresetId,
  DetectorConfig,
  CollisionEvent,
  Particle,
  MassSpectrumBin,
  ColliderTelemetry,
} from './types';
import { CollisionGenerator } from './physics/CollisionGenerator';
import { ColliderSonificationEngine } from './audio/ColliderSonificationEngine';
import { Header } from './components/Header';
import { DetectorCanvas } from './components/DetectorCanvas';
import { LegoPlotCanvas } from './components/LegoPlotCanvas';
import { MassSpectrumCanvas } from './components/MassSpectrumCanvas';
import { ColliderControlDeck } from './components/ColliderControlDeck';
import { ParticleInspectorModal } from './components/ParticleInspectorModal';
import { DataExportModal } from './components/DataExportModal';

export const App: React.FC = () => {
  // Navigation & suite modes
  const [mode, setMode] = useState<SuiteMode>('TRANSVERSE_DETECTOR');
  const [currentPreset, setCurrentPreset] = useState<ColliderPresetId>('HIGGS_DIPHOTON');

  // Detector configuration
  const [config, setConfig] = useState<DetectorConfig>({
    magneticFieldB: 3.8,
    sqrtsTeV: 13.6,
    ptCutGeV: 1.0,
    jetRadiusR: 0.4,
    luminosityScale: 5,
    autoCollide: false,
    collisionRateHz: 1.5,
    triggerFilter: 'ALL',
  });

  // Active Collision Event
  const [currentEvent, setCurrentEvent] = useState<CollisionEvent | null>(null);
  const [selectedParticle, setSelectedParticle] = useState<Particle | null>(null);

  // Audio Sonification Engine
  const audioEngineRef = useRef<ColliderSonificationEngine | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Modals
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Invariant Mass Spectrum Bins (50 bins of 3 GeV width from 50 to 200 GeV)
  const [massBins, setMassBins] = useState<MassSpectrumBin[]>(() => {
    const bins: MassSpectrumBin[] = [];
    const minM = 50;
    const maxM = 200;
    const binW = 3.0;
    const count = Math.floor((maxM - minM) / binW);

    for (let i = 0; i < count; i++) {
      const center = minM + (i + 0.5) * binW;
      // Pre-populate with realistic Standard Model Drell-Yan & QCD continuum background
      const bgCount = Math.max(1, Math.round(45 * Math.exp(-center / 38.0)));
      bins.push({
        centerGeV: center,
        count: bgCount,
        higgsSignal: 0,
        zSignal: 0,
        background: bgCount,
      });
    }
    return bins;
  });

  // Telemetry Counts
  const [telemetry, setTelemetry] = useState<ColliderTelemetry>({
    totalEventsGenerated: 0,
    eventsRecordedInSpectrum: 0,
    currentEventId: 1001,
    sqrts: 13.6,
    currentProcess: 'pp → H → γγ',
    trackCount: 0,
    jetCount: 0,
    missingET: 0,
    highestPtTrack: null,
    reconstructedHiggsCount: 0,
    reconstructedZCount: 0,
    higgsSignificance: 0,
  });

  // Initialize Audio
  useEffect(() => {
    const engine = new ColliderSonificationEngine();
    audioEngineRef.current = engine;
    return () => {
      engine.dispose();
      audioEngineRef.current = null;
    };
  }, []);

  const handleToggleMute = useCallback(() => {
    if (!audioEngineRef.current) return;
    const nextMuted = !isMuted;
    if (!nextMuted) {
      audioEngineRef.current.init();
    }
    audioEngineRef.current.setMuted(nextMuted);
    setIsMuted(nextMuted);
  }, [isMuted]);

  // Generate a Collision Event
  const fireCollision = useCallback(
    (preset: ColliderPresetId) => {
      // Up to 8 collision bunch trials to find an event satisfying the trigger filter
      let event: CollisionEvent | null = null;
      for (let attempt = 0; attempt < 8; attempt++) {
        const candidate = CollisionGenerator.generateEvent(
          preset,
          config.sqrtsTeV,
          config.magneticFieldB,
          config.jetRadiusR
        );

        let passesTrigger = true;
        if (config.triggerFilter === 'DI_LEPTON') {
          const leptonCount = candidate.visibleParticles.filter(
            p => (p.type.includes('ELECTRON') || p.type.includes('POSITRON') || p.type.includes('MUON')) && p.pt >= 15
          ).length;
          passesTrigger = leptonCount >= 2;
        } else if (config.triggerFilter === 'DI_PHOTON') {
          const photonCount = candidate.visibleParticles.filter(
            p => p.type === 'PHOTON' && p.pt >= 20
          ).length;
          passesTrigger = photonCount >= 2;
        } else if (config.triggerFilter === 'HIGH_MET') {
          passesTrigger = candidate.missingET.mag >= 100;
        } else if (config.triggerFilter === 'MULTI_JET') {
          passesTrigger = candidate.jets.length >= 4;
        }

        if (passesTrigger || attempt === 7) {
          event = candidate;
          break;
        }
      }

      if (!event) return;

      setCurrentEvent(event);

      // Play audio sonification cues
      if (audioEngineRef.current && !isMuted) {
        audioEngineRef.current.playBunchCrossing();

        const avgPt =
          event.visibleParticles.reduce((s, p) => s + p.pt, 0) /
          Math.max(1, event.visibleParticles.length);
        audioEngineRef.current.playTrackerIonization(event.visibleParticles.length, avgPt);

        // ECAL cluster sound if photons or electrons exist
        const hasEM = event.visibleParticles.some(
          p => p.type === 'PHOTON' || p.type === 'ELECTRON' || p.type === 'POSITRON'
        );
        if (hasEM) {
          audioEngineRef.current.playEcalCluster(event.totalScalarET * 0.4);
        }

        // HCAL sound if hadrons exist
        const hasHadron = event.visibleParticles.some(
          p => p.type.startsWith('PION') || p.type.startsWith('KAON') || p.type === 'PROTON'
        );
        if (hasHadron) {
          audioEngineRef.current.playHcalCascade(event.totalScalarET * 0.5);
        }

        // Muon sound if muon exists
        const highPtMuon = event.visibleParticles.find(
          p => (p.type === 'MUON_MINUS' || p.type === 'MUON_PLUS') && p.pt > 15
        );
        if (highPtMuon) {
          audioEngineRef.current.playMuonChamberHit(highPtMuon.pt);
        }

        // Discovery chime if resonance matches
        const hasHiggs = event.reconstructedMasses.some(m => m.resonanceTarget === 'HIGGS');
        const hasZ = event.reconstructedMasses.some(m => m.resonanceTarget === 'Z_BOSON');
        if (hasHiggs) {
          audioEngineRef.current.playResonanceDiscovery('HIGGS');
        } else if (hasZ) {
          audioEngineRef.current.playResonanceDiscovery('Z');
        }
      }

      // Update Mass Spectrum Bins with reconstructed candidates
      setMassBins(prevBins => {
        const nextBins = prevBins.map(b => ({ ...b }));
        const minM = nextBins[0].centerGeV - 1.5;
        const binW = 3.0;

        for (const reco of event.reconstructedMasses) {
          const idx = Math.floor((reco.mass - minM) / binW);
          if (idx >= 0 && idx < nextBins.length) {
            nextBins[idx].count += 1;
            if (reco.resonanceTarget === 'HIGGS') {
              nextBins[idx].higgsSignal += 1;
            } else if (reco.resonanceTarget === 'Z_BOSON') {
              nextBins[idx].zSignal += 1;
            } else {
              nextBins[idx].background += 1;
            }
          }
        }
        return nextBins;
      });

      // Update Telemetry
      setTelemetry(prev => {
        let highestTrack: { symbol: string; pt: number; eta: number; phi: number; charge: number } | null = null;
        let maxPt = 0;
        for (const p of event.visibleParticles) {
          if (p.pt > maxPt) {
            maxPt = p.pt;
            highestTrack = { symbol: p.symbol, pt: p.pt, eta: p.eta, phi: p.phi, charge: p.charge };
          }
        }

        const isHiggs = event.reconstructedMasses.some(m => m.resonanceTarget === 'HIGGS');
        const isZ = event.reconstructedMasses.some(m => m.resonanceTarget === 'Z_BOSON');
        const nextHiggsCount = prev.reconstructedHiggsCount + (isHiggs ? 1 : 0);
        const nextZCount = prev.reconstructedZCount + (isZ ? 1 : 0);

        // Approximate significance S / sqrt(B) in 122-128 GeV window
        const bgHiggsWindow = 12.0;
        const significance = nextHiggsCount / Math.sqrt(bgHiggsWindow + nextHiggsCount * 0.2);

        return {
          totalEventsGenerated: prev.totalEventsGenerated + 1,
          eventsRecordedInSpectrum: prev.eventsRecordedInSpectrum + event.reconstructedMasses.length,
          currentEventId: event.eventId,
          sqrts: config.sqrtsTeV,
          currentProcess: event.processName,
          trackCount: event.visibleParticles.length,
          jetCount: event.jets.length,
          missingET: event.missingET.mag,
          highestPtTrack: highestTrack,
          reconstructedHiggsCount: nextHiggsCount,
          reconstructedZCount: nextZCount,
          higgsSignificance: significance,
        };
      });
    },
    [config.sqrtsTeV, config.magneticFieldB, config.jetRadiusR, config.triggerFilter, isMuted]
  );

  // Initial event on mount
  useEffect(() => {
    fireCollision(currentPreset);
  }, []); // Run once on startup

  // Collision stream runner
  useEffect(() => {
    if (!config.autoCollide) return;
    const intervalMs = Math.max(250, Math.floor(1000 / config.collisionRateHz));
    const timer = setInterval(() => {
      fireCollision(currentPreset);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [config.autoCollide, config.collisionRateHz, currentPreset, fireCollision]);

  // Preset switch handler
  const handleSelectPreset = useCallback(
    (presetId: ColliderPresetId) => {
      setCurrentPreset(presetId);
      fireCollision(presetId);
    },
    [fireCollision]
  );

  const handleChangeConfig = useCallback((newConfig: Partial<DetectorConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const handleClearSpectrum = useCallback(() => {
    setMassBins(prevBins =>
      prevBins.map(b => {
        const bg = Math.max(1, Math.round(45 * Math.exp(-b.centerGeV / 38.0)));
        return {
          centerGeV: b.centerGeV,
          count: bg,
          higgsSignal: 0,
          zSignal: 0,
          background: bg,
        };
      })
    );
    setTelemetry(prev => ({
      ...prev,
      reconstructedHiggsCount: 0,
      reconstructedZCount: 0,
      higgsSignificance: 0,
    }));
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-[#030712] text-slate-100 overflow-hidden font-sans">
      {/* 1. Header Navigation & Quick Actions */}
      <Header
        mode={mode}
        onSetMode={setMode}
        telemetry={telemetry}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        autoCollide={config.autoCollide}
        onToggleAutoCollide={() =>
          handleChangeConfig({ autoCollide: !config.autoCollide })
        }
        onManualCollide={() => {
          if (audioEngineRef.current && !isMuted) {
            audioEngineRef.current.init();
          }
          fireCollision(currentPreset);
        }}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Visualizer Canvas Area */}
        <div className="flex-1 h-full relative overflow-hidden">
          {(mode === 'TRANSVERSE_DETECTOR' || mode === 'LONGITUDINAL_RZ') && (
            <DetectorCanvas
              event={currentEvent}
              config={config}
              mode={mode}
              onSelectParticle={setSelectedParticle}
              selectedParticle={selectedParticle}
            />
          )}

          {mode === 'LEGO_ETA_PHI' && (
            <LegoPlotCanvas event={currentEvent} config={config} />
          )}

          {mode === 'MASS_SPECTRUM' && (
            <MassSpectrumCanvas
              bins={massBins}
              totalEvents={telemetry.totalEventsGenerated}
              higgsCount={telemetry.reconstructedHiggsCount}
              zCount={telemetry.reconstructedZCount}
              significance={telemetry.higgsSignificance}
              onClearSpectrum={handleClearSpectrum}
            />
          )}
        </div>

        {/* Control Deck Sidebar */}
        <ColliderControlDeck
          currentPreset={currentPreset}
          onSelectPreset={handleSelectPreset}
          config={config}
          onChangeConfig={handleChangeConfig}
          event={currentEvent}
        />
      </div>

      {/* 3. Particle Inspector Modal */}
      {selectedParticle && (
        <ParticleInspectorModal
          particle={selectedParticle}
          onClose={() => setSelectedParticle(null)}
        />
      )}

      {/* 4. Telemetry Data Export Modal */}
      {isExportOpen && (
        <DataExportModal
          event={currentEvent}
          bins={massBins}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
