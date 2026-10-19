import React from 'react';
import { Track, SynthParams } from '../types';
import { X, Volume2, Sliders, Check } from 'lucide-react';

interface PianoRollModalProps {
  track: Track | null;
  stepCount: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStepPitch: (trackId: string, stepIndex: number, pitch: string) => void;
  onToggleStep: (trackId: string, stepIndex: number) => void;
  onUpdateSynthParams?: (trackId: string, params: SynthParams) => void;
  onAuditionPitch: (track: Track, pitch: string) => void;
}

// Chromatic scale ordered top to bottom (high to low)
const CHROMATIC_SCALE = ['B', 'A#', 'A', 'G#', 'G', 'F#', 'F', 'E', 'D#', 'D', 'C#', 'C'];

export const PianoRollModal: React.FC<PianoRollModalProps> = ({
  track,
  stepCount,
  isOpen,
  onClose,
  onUpdateStepPitch,
  onToggleStep,
  onUpdateSynthParams,
  onAuditionPitch,
}) => {
  if (!isOpen || !track) return null;

  const isBass = track.type === 'BASS';
  // 3 octaves for leads/arps (5, 4, 3) to accommodate high melodies, 2 octaves for sub-bass (2, 1)
  const octaves = isBass ? [2, 1] : [5, 4, 3];

  const fullPitches: string[] = [];
  octaves.forEach((oct) => {
    CHROMATIC_SCALE.forEach((note) => {
      fullPitches.push(`${note}${oct}`);
    });
  });

  const synth: SynthParams = track.synthParams || {
    waveform: isBass ? 'sawtooth' : 'sawtooth',
    attack: 0.01,
    decay: 0.2,
    sustain: 0.5,
    release: 0.15,
    cutoffFreq: isBass ? 400 : 3200,
  };

  const handleCellClick = (stepIdx: number, pitch: string) => {
    const currentStep = track.steps[stepIdx];
    onAuditionPitch(track, pitch);

    if (currentStep && currentStep.active && currentStep.pitch === pitch) {
      // Toggle off if clicking the active note
      onToggleStep(track.id, stepIdx);
    } else {
      // Set to this pitch and make active
      onUpdateStepPitch(track.id, stepIdx, pitch);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 font-mono">
      <div className="w-full max-w-5xl max-h-[94vh] bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div
              className="w-3.5 h-7 rounded-sm"
              style={{ backgroundColor: track.color }}
            />
            <div>
              <h2 className="text-base font-bold text-cyan-400">
                PIANO ROLL &bull; {track.name} ({octaves.length} Octaves)
              </h2>
              <span className="text-[11px] text-slate-400">
                Click any cell to set note pitch. Click active note to remove.
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Complete ADSR & Timbre Parameters Toolbar */}
        {onUpdateSynthParams && (
          <div className="bg-slate-950/70 px-5 py-2.5 border-b border-slate-800/80 flex flex-wrap items-center gap-3.5 text-xs">
            {/* Waveform Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold">WAVE:</span>
              {(['sawtooth', 'square', 'triangle', 'sine'] as OscillatorType[]).map((wave) => (
                <button
                  key={wave}
                  onClick={() =>
                    onUpdateSynthParams(track.id, { ...synth, waveform: wave })
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                    synth.waveform === wave
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {wave}
                </button>
              ))}
            </div>

            {/* Cutoff Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold">CUTOFF:</span>
              <span className="text-cyan-300 w-12 text-right">{Math.round(synth.cutoffFreq)}Hz</span>
              <input
                type="range"
                min={100}
                max={10000}
                step={100}
                value={synth.cutoffFreq}
                onChange={(e) =>
                  onUpdateSynthParams(track.id, {
                    ...synth,
                    cutoffFreq: Number(e.target.value),
                  })
                }
                className="w-16 accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* ADSR: Attack */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-bold">A:</span>
              <span className="text-slate-300 w-9 text-right">{Math.round(synth.attack * 1000)}ms</span>
              <input
                type="range"
                min={0.005}
                max={0.2}
                step={0.005}
                value={synth.attack}
                onChange={(e) =>
                  onUpdateSynthParams(track.id, {
                    ...synth,
                    attack: Number(e.target.value),
                  })
                }
                className="w-14 accent-cyan-400 cursor-pointer"
                title="Attack time"
              />
            </div>

            {/* ADSR: Decay */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-bold">D:</span>
              <span className="text-slate-300 w-9 text-right">{Math.round(synth.decay * 1000)}ms</span>
              <input
                type="range"
                min={0.05}
                max={0.8}
                step={0.02}
                value={synth.decay}
                onChange={(e) =>
                  onUpdateSynthParams(track.id, {
                    ...synth,
                    decay: Number(e.target.value),
                  })
                }
                className="w-14 accent-cyan-400 cursor-pointer"
                title="Decay time"
              />
            </div>

            {/* ADSR: Sustain */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-bold">S:</span>
              <span className="text-slate-300 w-8 text-right">{Math.round((synth.sustain ?? 0.5) * 100)}%</span>
              <input
                type="range"
                min={0.0}
                max={1.0}
                step={0.05}
                value={synth.sustain ?? 0.5}
                onChange={(e) =>
                  onUpdateSynthParams(track.id, {
                    ...synth,
                    sustain: Number(e.target.value),
                  })
                }
                className="w-14 accent-cyan-400 cursor-pointer"
                title="Sustain level"
              />
            </div>

            {/* ADSR: Release */}
            <div className="flex items-center gap-1">
              <span className="text-slate-400 font-bold">R:</span>
              <span className="text-slate-300 w-9 text-right">{Math.round((synth.release || 0.15) * 1000)}ms</span>
              <input
                type="range"
                min={0.01}
                max={1.0}
                step={0.02}
                value={synth.release || 0.15}
                onChange={(e) =>
                  onUpdateSynthParams(track.id, {
                    ...synth,
                    release: Number(e.target.value),
                  })
                }
                className="w-14 accent-cyan-400 cursor-pointer"
                title="Release time"
              />
            </div>
          </div>
        )}

        {/* Piano Roll Grid View */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-3 select-none">
          <div className="min-w-[720px] flex flex-col gap-0.5">
            {/* Step numbers row */}
            <div className="flex items-center pl-14 pb-1">
              <div className="flex-1 grid grid-cols-16 gap-1 text-[10px] text-slate-500 text-center font-bold">
                {Array.from({ length: stepCount }).map((_, idx) => (
                  <div key={idx} className={idx % 4 === 0 ? 'text-cyan-400' : ''}>
                    {idx + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Pitch Rows */}
            {fullPitches.map((pitch) => {
              const isSharp = pitch.includes('#');

              return (
                <div key={pitch} className="flex items-center gap-2 h-5">
                  {/* Piano Key */}
                  <button
                    onClick={() => onAuditionPitch(track, pitch)}
                    className={`w-12 h-full text-[9px] font-bold rounded-l flex items-center justify-end pr-2 transition-colors ${
                      isSharp
                        ? 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-900'
                        : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
                    }`}
                  >
                    {pitch}
                  </button>

                  {/* 16 Step Buttons for this pitch */}
                  <div className="flex-1 grid grid-cols-16 gap-1 h-full">
                    {Array.from({ length: stepCount }).map((_, stepIdx) => {
                      const step = track.steps[stepIdx];
                      const isSelected = step && step.active && step.pitch === pitch;
                      const isBeatStart = stepIdx % 4 === 0;

                      return (
                        <button
                          key={stepIdx}
                          onClick={() => handleCellClick(stepIdx, pitch)}
                          className={`h-full rounded-xs border transition-all ${
                            isSelected
                              ? 'border-white shadow-md'
                              : isBeatStart
                              ? isSharp
                                ? 'bg-slate-950/80 border-slate-800/80 hover:bg-slate-850'
                                : 'bg-slate-900/80 border-slate-700/60 hover:bg-slate-800'
                              : isSharp
                              ? 'bg-slate-950/40 border-slate-900 hover:bg-slate-900/60'
                              : 'bg-slate-900/40 border-slate-800/50 hover:bg-slate-850/60'
                          }`}
                          style={{
                            backgroundColor: isSelected ? track.color : undefined,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            Current Pattern: <strong className="text-slate-200">{track.steps.filter((s) => s.active).length} Notes</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-950/50"
          >
            <Check className="w-4 h-4" />
            <span>DONE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
