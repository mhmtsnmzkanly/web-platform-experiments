import React, { useState, useEffect, useCallback } from 'react';
import { proceduralAudio } from './engine/ProceduralAudioEngine';
import {
  InstrumentFamily,
  InstrumentPreset,
  ActiveVoiceInfo,
  AudioTelemetry,
} from './types';
import { DEFAULT_PRESETS } from './presets/defaultPresets';
import { Header } from './components/Header';
import { ComparisonBar } from './components/ComparisonBar';
import { OscilloscopeVisualizer } from './components/OscilloscopeVisualizer';
import { InstrumentParameterDeck } from './components/InstrumentParameterDeck';
import { PianoKeyboard } from './components/PianoKeyboard';

export function App() {
  const [activePreset, setActivePreset] = useState<InstrumentPreset>({ ...DEFAULT_PRESETS[0] });
  const [presetA, setPresetA] = useState<InstrumentPreset>({ ...DEFAULT_PRESETS[0] });
  const [presetB, setPresetB] = useState<InstrumentPreset>({ ...DEFAULT_PRESETS[1] });
  const [currentSlot, setCurrentSlot] = useState<'A' | 'B'>('A');

  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const [activeVoices, setActiveVoices] = useState<ActiveVoiceInfo[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  const [telemetry, setTelemetry] = useState<AudioTelemetry>({
    activeVoices: 0,
    maxPolyphony: 8,
    rmsLevel: 0,
    peakLevel: 0,
    audioContextState: 'suspended',
    sampleRate: 44100,
  });

  // Sync engine preset whenever activePreset changes
  useEffect(() => {
    proceduralAudio.setPreset(activePreset);
  }, [activePreset]);

  // Teardown on unmount
  useEffect(() => {
    return () => {
      proceduralAudio.dispose();
    };
  }, []);

  // Telemetry 10Hz sync loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(proceduralAudio.getTelemetry());
      setActiveVoices(proceduralAudio.getActiveVoices());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Note Playing Actions
  const handlePlayNote = useCallback((midi: number) => {
    proceduralAudio.init();
    proceduralAudio.noteOn(midi, 0.85);
    setActiveNotes((prev) => new Set(prev).add(midi));
  }, []);

  const handleStopNote = useCallback((midi: number) => {
    proceduralAudio.noteOffByMidi(midi);
    setActiveNotes((prev) => {
      const next = new Set(prev);
      next.delete(midi);
      return next;
    });
  }, []);

  // A/B Slot Switching
  const handleSwitchSlot = useCallback((slot: 'A' | 'B') => {
    setCurrentSlot(slot);
    proceduralAudio.switchSlot(slot);
    if (slot === 'A') {
      setActivePreset({ ...presetA });
    } else {
      setActivePreset({ ...presetB });
    }
  }, [presetA, presetB]);

  const handleSaveSlot = useCallback((preset: InstrumentPreset) => {
    proceduralAudio.saveToCurrentSlot(preset);
    if (currentSlot === 'A') {
      setPresetA({ ...preset });
    } else {
      setPresetB({ ...preset });
    }
  }, [currentSlot]);

  const handleToggleMute = useCallback(() => {
    proceduralAudio.init();
    setIsMuted((prev) => {
      const next = !prev;
      proceduralAudio.setMuted(next);
      return next;
    });
  }, []);

  const handleResetDefaults = useCallback(() => {
    const original = DEFAULT_PRESETS.find((p) => p.id === activePreset.id) || DEFAULT_PRESETS[0];
    setActivePreset({ ...original });
  }, [activePreset.id]);

  const handlePlayTestNote = useCallback(() => {
    handlePlayNote(60); // C4
    setTimeout(() => handleStopNote(60), 600);
  }, [handlePlayNote, handleStopNote]);

  const handleUpdateActivePreset = useCallback((updated: InstrumentPreset) => {
    setActivePreset(updated);
    if (currentSlot === 'A') {
      setPresetA({ ...updated });
    } else {
      setPresetB({ ...updated });
    }
  }, [currentSlot]);

  // Keyboard shortcut handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayTestNote();
      } else if (e.key.toLowerCase() === 'm') {
        handleToggleMute();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        handleSwitchSlot(currentSlot === 'A' ? 'B' : 'A');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayTestNote, handleToggleMute, handleSwitchSlot, currentSlot]);

  return (
    <div className="w-screen h-screen bg-[#030712] text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* 1. Header with Family Tabs, Telemetry & Global Status */}
      <Header
        currentFamily={activePreset.family}
        onSelectFamily={(fam) => {
          const first = DEFAULT_PRESETS.find((p) => p.family === fam);
          if (first) {
            handleUpdateActivePreset({ ...first });
          }
        }}
        activePreset={activePreset}
        onSelectPreset={(p) => {
          handleUpdateActivePreset({ ...p });
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        activeVoiceCount={telemetry.activeVoices}
        telemetry={telemetry}
      />

      {/* 2. A/B Comparison Toolbar */}
      <ComparisonBar
        currentSlot={currentSlot}
        onSwitchSlot={handleSwitchSlot}
        presetA={presetA}
        presetB={presetB}
        activePreset={activePreset}
        onUpdateActivePreset={handleUpdateActivePreset}
        onSaveSlot={handleSaveSlot}
        onResetDefaults={handleResetDefaults}
        onPlayTestNote={handlePlayTestNote}
      />

      {/* 3. Oscilloscope & 64-Band FFT Spectrum Visualizer */}
      <OscilloscopeVisualizer activeVoices={activeVoices} />

      {/* 4. Interactive Instrument Parameter Control Deck */}
      <InstrumentParameterDeck
        preset={activePreset}
        onUpdatePreset={handleUpdateActivePreset}
      />

      {/* 5. Virtual Interactive Piano Keyboard */}
      <PianoKeyboard
        onPlayNote={handlePlayNote}
        onStopNote={handleStopNote}
        activeNotes={activeNotes}
      />
    </div>
  );
}
