import React from 'react';
import { Track } from '../types';
import { Volume2, Edit3, Music } from 'lucide-react';

interface StepSequencerGridProps {
  tracks: Track[];
  stepCount: number;
  currentStep: number;
  isPlaying: boolean;
  onToggleStep: (trackId: string, stepIndex: number) => void;
  onAuditionTrack: (track: Track) => void;
  onOpenPianoRoll: (track: Track) => void;
}

const StepSequencerGridComponent: React.FC<StepSequencerGridProps> = ({
  tracks,
  stepCount,
  currentStep,
  isPlaying,
  onToggleStep,
  onAuditionTrack,
  onOpenPianoRoll,
}) => {
  return (
    <div className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 shadow-inner overflow-x-auto">
      {/* Step Numbers Header */}
      <div className="flex items-center gap-2 min-w-[760px] pb-1 border-b border-slate-800/80">
        <div className="w-48 text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider pl-2">
          Track / Instrument
        </div>
        <div className="flex-1 grid grid-cols-16 gap-1 font-mono text-[10px] text-center">
          {Array.from({ length: stepCount }).map((_, stepIdx) => {
            const isBeatStart = stepIdx % 4 === 0;
            const isCurrent = isPlaying && currentStep === stepIdx;
            return (
              <div
                key={stepIdx}
                className={`py-0.5 rounded transition-colors ${
                  isCurrent
                    ? 'bg-cyan-400 text-slate-950 font-bold shadow-xs shadow-cyan-400'
                    : isBeatStart
                    ? 'text-cyan-400 font-bold bg-slate-900/60'
                    : 'text-slate-500'
                }`}
              >
                {stepIdx + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tracks Rows */}
      <div className="flex flex-col gap-2 min-w-[760px]">
        {tracks.map((track) => {
          const isMelodic = track.type !== 'DRUM';

          return (
            <div
              key={track.id}
              className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all ${
                track.muted
                  ? 'bg-slate-900/40 border-slate-900 opacity-60'
                  : 'bg-slate-900/90 border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              {/* Track Info & Quick Actions */}
              <div className="w-48 flex items-center justify-between gap-1 pr-2">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    onClick={() => onAuditionTrack(track)}
                    className="w-3.5 h-7 rounded-sm transition-transform active:scale-90 flex-shrink-0"
                    style={{ backgroundColor: track.color }}
                    title={`Audition ${track.name}`}
                  />
                  <div className="truncate">
                    <div className="text-xs font-bold font-mono text-slate-200 truncate">
                      {track.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {track.instrument.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {/* Piano roll open icon if melodic track */}
                {isMelodic && (
                  <button
                    onClick={() => onOpenPianoRoll(track)}
                    className="p-1 hover:bg-slate-800 text-cyan-400 rounded transition-colors flex-shrink-0"
                    title="Open Melodic Piano Roll"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Step Grid Buttons */}
              <div className="flex-1 grid grid-cols-16 gap-1">
                {track.steps.slice(0, stepCount).map((step, stepIdx) => {
                  const isBeatStart = stepIdx % 4 === 0;
                  const isCursor = isPlaying && currentStep === stepIdx;
                  const isActive = step.active;

                  return (
                    <button
                      key={stepIdx}
                      onClick={() => onToggleStep(track.id, stepIdx)}
                      className={`h-9 rounded flex flex-col items-center justify-center font-mono text-[9px] font-bold transition-all relative select-none ${
                        isActive
                          ? 'shadow-md border border-white/20'
                          : isBeatStart
                          ? 'bg-slate-850 hover:bg-slate-800 border border-slate-700/60'
                          : 'bg-slate-900/80 hover:bg-slate-850 border border-slate-800/60'
                      } ${
                        isCursor ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-950 scale-105 z-10' : ''
                      }`}
                      style={{
                        backgroundColor: isActive ? track.color : undefined,
                        color: isActive ? '#030712' : '#64748b',
                      }}
                      title={`Step ${stepIdx + 1}${isActive ? ` (${step.pitch})` : ''}`}
                    >
                      {isActive && isMelodic ? (
                        <span>{step.pitch}</span>
                      ) : (
                        <span className="opacity-40">{stepIdx + 1}</span>
                      )}

                      {/* Velocity bar indicator */}
                      {isActive && (
                        <div
                          className="absolute bottom-0.5 left-1 right-1 h-0.5 bg-black/40 rounded-full overflow-hidden"
                        >
                          <div
                            className="h-full bg-black/80"
                            style={{ width: `${(step.velocity || 0.8) * 100}%` }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const StepSequencerGrid = React.memo(StepSequencerGridComponent);
