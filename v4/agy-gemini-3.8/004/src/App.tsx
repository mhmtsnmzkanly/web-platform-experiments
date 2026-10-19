import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ProjectData, Track, MasterFXSettings, SynthParams } from './types';
import { dawAudio } from './audio/DAWAudioEngine';
import { FACTORY_PRESETS, PRESET_SYNTHWAVE } from './audio/presets';
import { TransportBar } from './components/TransportBar';
import { StepSequencerGrid } from './components/StepSequencerGrid';
import { ChannelMixer } from './components/ChannelMixer';
import { MasterFXRack } from './components/MasterFXRack';
import { AudioVisualizer } from './components/AudioVisualizer';
import { PianoRollModal } from './components/PianoRollModal';

const STORAGE_KEY = 'synth_strum_daw_project';

export function App() {
  // Initialize with saved project or factory preset
  const [project, setProject] = useState<ProjectData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tracks && Array.isArray(parsed.tracks) && parsed.bpm) {
          return parsed;
        }
      }
    } catch {}
    return PRESET_SYNTHWAVE;
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isMetronome, setIsMetronome] = useState<boolean>(false);

  // Piano Roll Modal State
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isPianoRollOpen, setIsPianoRollOpen] = useState<boolean>(false);

  // Persistent reference to project for lookahead audio scheduler
  const projectRef = useRef<ProjectData>(project);
  useEffect(() => {
    projectRef.current = project;
    // Auto-save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch {}
  }, [project]);

  // Setup DAWAudioEngine step synchronization on mount
  useEffect(() => {
    dawAudio.onStepTick = (step) => {
      setCurrentStep(step);
    };

    return () => {
      dawAudio.dispose();
    };
  }, []);

  // Sync Audio graph whenever project, tracks, FX, or master volume changes
  useEffect(() => {
    dawAudio.updateProject(project);
    if (dawAudio.ctx) {
      dawAudio.syncTracks(project.tracks);
      dawAudio.updateMasterFX(project.masterFX, project.masterVolume);
    }
  }, [project]);

  // Global Keyboard Shortcuts (Space for Play/Pause, Esc for Modal close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) {
          handlePause();
        } else {
          handlePlay();
        }
      } else if (e.code === 'Escape' && isPianoRollOpen) {
        setIsPianoRollOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPianoRollOpen, project]);

  // Transport Handlers
  const handlePlay = useCallback(() => {
    dawAudio.play(projectRef.current);
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    dawAudio.pause();
    setIsPlaying(false);
  }, []);

  const handleStop = useCallback(() => {
    dawAudio.stop();
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const handleUpdateBpm = useCallback((bpm: number) => {
    const clamped = Math.max(50, Math.min(240, bpm));
    setProject((prev) => {
      const updated = { ...prev, bpm: clamped };
      dawAudio.setTempo(clamped, updated.swing);
      return updated;
    });
  }, []);

  const handleUpdateSwing = useCallback((swing: number) => {
    setProject((prev) => {
      const updated = { ...prev, swing };
      dawAudio.setTempo(updated.bpm, swing);
      return updated;
    });
  }, []);

  const handleToggleMetronome = useCallback(() => {
    setIsMetronome((prev) => {
      const next = !prev;
      dawAudio.isMetronomeEnabled = next;
      return next;
    });
  }, []);

  // Step Sequencer Handlers
  const handleToggleStep = useCallback((trackId: string, stepIndex: number) => {
    setProject((prev) => {
      const tracks = prev.tracks.map((t) => {
        if (t.id !== trackId) return t;
        const newSteps = [...t.steps];
        const step = newSteps[stepIndex];
        const willBeActive = !step.active;
        newSteps[stepIndex] = {
          ...step,
          active: willBeActive,
        };

        // Audition sound if activated
        if (willBeActive) {
          dawAudio.previewSound(t, step.pitch);
        }

        return { ...t, steps: newSteps };
      });
      return { ...prev, tracks };
    });
  }, []);

  const handleAuditionTrack = useCallback((track: Track) => {
    dawAudio.previewSound(track);
  }, []);

  const handleOpenPianoRoll = useCallback((track: Track) => {
    setEditingTrack(track);
    setIsPianoRollOpen(true);
  }, []);

  const handleUpdateStepPitch = useCallback(
    (trackId: string, stepIndex: number, pitch: string) => {
      setProject((prev) => {
        const tracks = prev.tracks.map((t) => {
          if (t.id !== trackId) return t;
          const newSteps = [...t.steps];
          newSteps[stepIndex] = {
            ...newSteps[stepIndex],
            active: true,
            pitch,
          };
          return { ...t, steps: newSteps };
        });
        return { ...prev, tracks };
      });

      // Keep editingTrack state synchronized
      setEditingTrack((prev) => {
        if (!prev || prev.id !== trackId) return prev;
        const newSteps = [...prev.steps];
        newSteps[stepIndex] = {
          ...newSteps[stepIndex],
          active: true,
          pitch,
        };
        return { ...prev, steps: newSteps };
      });
    },
    []
  );

  const handleUpdateSynthParams = useCallback((trackId: string, params: SynthParams) => {
    setProject((prev) => {
      const tracks = prev.tracks.map((t) => {
        if (t.id !== trackId) return t;
        return { ...t, synthParams: params };
      });
      return { ...prev, tracks };
    });

    setEditingTrack((prev) => {
      if (!prev || prev.id !== trackId) return prev;
      return { ...prev, synthParams: params };
    });
  }, []);

  // Channel Mixer Handlers
  const handleUpdateTrackVolume = useCallback((trackId: string, volume: number) => {
    setProject((prev) => {
      const tracks = prev.tracks.map((t) => (t.id === trackId ? { ...t, volume } : t));
      return { ...prev, tracks };
    });
  }, []);

  const handleUpdateTrackPan = useCallback((trackId: string, pan: number) => {
    setProject((prev) => {
      const tracks = prev.tracks.map((t) => (t.id === trackId ? { ...t, pan } : t));
      return { ...prev, tracks };
    });
  }, []);

  const handleToggleTrackMute = useCallback((trackId: string) => {
    setProject((prev) => {
      const tracks = prev.tracks.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t));
      return { ...prev, tracks };
    });
  }, []);

  const handleToggleTrackSolo = useCallback((trackId: string) => {
    setProject((prev) => {
      const tracks = prev.tracks.map((t) => (t.id === trackId ? { ...t, soloed: !t.soloed } : t));
      return { ...prev, tracks };
    });
  }, []);

  const handleUpdateMasterVolume = useCallback((vol: number) => {
    setProject((prev) => ({ ...prev, masterVolume: vol }));
  }, []);

  // Master FX Rack Updater
  const handleUpdateFX = useCallback(
    (updater: (prev: MasterFXSettings) => MasterFXSettings) => {
      setProject((prev) => ({
        ...prev,
        masterFX: updater(prev.masterFX),
      }));
    },
    []
  );

  // Preset Loading
  const handleLoadPreset = useCallback((presetKey: string) => {
    const found = FACTORY_PRESETS[presetKey];
    if (found) {
      if (dawAudio.getPlaybackActive()) {
        dawAudio.stop();
        setIsPlaying(false);
      }
      setProject(JSON.parse(JSON.stringify(found)));
      setCurrentStep(0);
    }
  }, []);

  // JSON Export & Import
  const handleExportJson = useCallback(() => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(project, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    const safeTitle = project.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${safeTitle}_project.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [project]);

  const handleImportJson = useCallback((data: ProjectData) => {
    if (dawAudio.getPlaybackActive()) {
      dawAudio.stop();
      setIsPlaying(false);
    }
    setProject(data);
    setCurrentStep(0);
  }, []);

  const handleNewProject = useCallback(() => {
    if (dawAudio.getPlaybackActive()) {
      dawAudio.stop();
      setIsPlaying(false);
    }
    setProject({
      ...PRESET_SYNTHWAVE,
      title: 'Untitled Session',
      tracks: PRESET_SYNTHWAVE.tracks.map((t) => ({
        ...t,
        steps: t.steps.map((s) => ({ ...s, active: false })),
      })),
    });
    setCurrentStep(0);
  }, []);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Master Transport Bar */}
      <TransportBar
        project={project}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStop={handleStop}
        onUpdateBpm={handleUpdateBpm}
        onUpdateSwing={handleUpdateSwing}
        isMetronome={isMetronome}
        onToggleMetronome={handleToggleMetronome}
        onLoadPreset={handleLoadPreset}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onNewProject={handleNewProject}
      />

      {/* Main Studio Workstation Body */}
      <main className="flex-1 p-3 md:p-4 flex flex-col gap-3 max-w-[1500px] w-full mx-auto">
        {/* Top Status & Spectrum Visualizer Banner */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500">PLAYBACK: </span>
              <strong className={isPlaying ? 'text-amber-400 animate-pulse' : 'text-slate-400'}>
                {isPlaying ? 'RUNNING' : 'STOPPED'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500">STEP: </span>
              <strong className="text-cyan-400">{currentStep + 1} / {project.stepCount}</strong>
            </div>
            <div className="hidden md:block">
              <span className="text-slate-500">CHANNELS: </span>
              <strong className="text-indigo-400">{project.tracks.length} ACTIVE</strong>
            </div>
          </div>

          <div className="flex-1 sm:max-w-md">
            <AudioVisualizer engine={dawAudio} isPlaying={isPlaying} />
          </div>
        </div>

        {/* 2. Step Sequencer Grid */}
        <section aria-label="Step Sequencer">
          <StepSequencerGrid
            tracks={project.tracks}
            stepCount={project.stepCount}
            currentStep={currentStep}
            isPlaying={isPlaying}
            onToggleStep={handleToggleStep}
            onAuditionTrack={handleAuditionTrack}
            onOpenPianoRoll={handleOpenPianoRoll}
          />
        </section>

        {/* 3. Lower Section: Console Mixer & Master FX Rack */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 items-start">
          <section aria-label="Channel Console Mixer">
            <ChannelMixer
              tracks={project.tracks}
              masterVolume={project.masterVolume}
              onUpdateTrackVolume={handleUpdateTrackVolume}
              onUpdateTrackPan={handleUpdateTrackPan}
              onToggleTrackMute={handleToggleTrackMute}
              onToggleTrackSolo={handleToggleTrackSolo}
              onUpdateMasterVolume={handleUpdateMasterVolume}
              currentStep={currentStep}
              isPlaying={isPlaying}
            />
          </section>

          <section aria-label="Master Effects Rack">
            <MasterFXRack
              fx={project.masterFX}
              onUpdateFX={handleUpdateFX}
            />
          </section>
        </div>
      </main>

      {/* Melodic Piano Roll Modal */}
      <PianoRollModal
        track={editingTrack}
        stepCount={project.stepCount}
        isOpen={isPianoRollOpen}
        onClose={() => setIsPianoRollOpen(false)}
        onUpdateStepPitch={handleUpdateStepPitch}
        onToggleStep={handleToggleStep}
        onUpdateSynthParams={handleUpdateSynthParams}
        onAuditionPitch={(trk, pitch) => dawAudio.previewSound(trk, pitch)}
      />

      {/* Quick Keyboard Hotkeys Footer */}
      <footer className="w-full bg-slate-950/80 border-t border-slate-900 py-1.5 px-4 text-center text-[11px] font-mono text-slate-500">
        [SPACE] Play / Pause &bull; [CLICK] Toggle Step / Audition &bull; [DOUBLE CLICK PAN] Reset Center &bull; [EDIT] Open Piano Roll &bull; Pure Web Audio API
      </footer>
    </div>
  );
}
