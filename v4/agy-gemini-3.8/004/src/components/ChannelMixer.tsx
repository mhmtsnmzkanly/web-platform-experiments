import React from 'react';
import { Track } from '../types';
import { Volume2, VolumeX, Sliders } from 'lucide-react';

interface ChannelMixerProps {
  tracks: Track[];
  masterVolume: number;
  onUpdateTrackVolume: (trackId: string, volume: number) => void;
  onUpdateTrackPan: (trackId: string, pan: number) => void;
  onToggleTrackMute: (trackId: string) => void;
  onToggleTrackSolo: (trackId: string) => void;
  onUpdateMasterVolume: (vol: number) => void;
  currentStep: number;
  isPlaying: boolean;
}

const ChannelMixerComponent: React.FC<ChannelMixerProps> = ({
  tracks,
  masterVolume,
  onUpdateTrackVolume,
  onUpdateTrackPan,
  onToggleTrackMute,
  onToggleTrackSolo,
  onUpdateMasterVolume,
  currentStep,
  isPlaying,
}) => {
  return (
    <div className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 font-mono shadow-inner">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            CONSOLE MIXER
          </h2>
        </div>
        <span className="text-[10px] text-slate-500">
          Per-Track Gain &bull; Stereo Pan &bull; Mute/Solo
        </span>
      </div>

      {/* Mixer Channel Strips */}
      <div className="flex items-stretch gap-2 overflow-x-auto py-2">
        {tracks.map((track) => {
          const isNoteTriggered =
            isPlaying && track.steps[currentStep] && track.steps[currentStep].active && !track.muted;

          return (
            <div
              key={track.id}
              className={`w-28 flex-shrink-0 bg-slate-900/90 border rounded-xl p-2.5 flex flex-col items-center gap-2.5 transition-all shadow-md ${
                track.muted
                  ? 'border-slate-800 opacity-60'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Channel Header */}
              <div className="w-full flex items-center justify-between pb-1 border-b border-slate-800">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: track.color }}
                />
                <span className="text-[11px] font-bold text-slate-200 truncate max-w-[70px]">
                  {track.name}
                </span>
              </div>

              {/* Mute & Solo Buttons */}
              <div className="w-full flex items-center justify-center gap-1.5">
                <button
                  onClick={() => onToggleTrackMute(track.id)}
                  className={`flex-1 py-1 text-[10px] font-bold rounded border transition-colors ${
                    track.muted
                      ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                      : 'bg-slate-850 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title="Mute Track"
                >
                  M
                </button>
                <button
                  onClick={() => onToggleTrackSolo(track.id)}
                  className={`flex-1 py-1 text-[10px] font-bold rounded border transition-colors ${
                    track.soloed
                      ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-xs'
                      : 'bg-slate-850 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title="Solo Track"
                >
                  S
                </button>
              </div>

              {/* Pan Slider */}
              <div className="w-full flex flex-col items-center gap-1">
                <div className="flex items-center justify-between w-full text-[9px] text-slate-400">
                  <span>PAN</span>
                  <span className="text-cyan-400 font-bold">
                    {track.pan === 0
                      ? 'C'
                      : track.pan < 0
                      ? `L${Math.round(Math.abs(track.pan) * 100)}`
                      : `R${Math.round(track.pan * 100)}`}
                  </span>
                </div>
                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={0.05}
                  value={track.pan}
                  onChange={(e) => onUpdateTrackPan(track.id, Number(e.target.value))}
                  onDoubleClick={() => onUpdateTrackPan(track.id, 0)}
                  className="w-full accent-cyan-400 cursor-pointer h-1 bg-slate-800 rounded-lg"
                  title="Stereo Pan (Double-click to center)"
                />
              </div>

              {/* Fader & Peak Meter Area */}
              <div className="flex items-center justify-center gap-2 h-36">
                {/* Level Meter simulation */}
                <div className="w-1.5 h-full bg-slate-950 rounded-full overflow-hidden flex flex-col justify-end p-0.5 border border-slate-800">
                  <div
                    className={`w-full rounded-full transition-all duration-75 ${
                      isNoteTriggered ? 'bg-cyan-400 h-4/5 shadow-xs shadow-cyan-400' : 'bg-slate-700 h-1/10'
                    }`}
                  />
                </div>

                {/* Vertical Volume Fader */}
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={track.volume}
                  onChange={(e) => onUpdateTrackVolume(track.id, Number(e.target.value))}
                  className="accent-cyan-400 cursor-pointer h-32 w-1.5 -rotate-90 origin-center bg-slate-800 rounded-lg"
                  title="Track Level"
                />
              </div>

              {/* Volume dB Display */}
              <div className="text-[10px] font-bold text-slate-300">
                {Math.round(track.volume * 100)}%
              </div>
            </div>
          );
        })}

        {/* Master Output Channel */}
        <div className="w-32 flex-shrink-0 bg-slate-900 border-2 border-cyan-500/50 rounded-xl p-2.5 flex flex-col items-center gap-2.5 shadow-xl shadow-cyan-950/40">
          <div className="w-full text-center pb-1 border-b border-cyan-500/30">
            <span className="text-[11px] font-bold text-cyan-400 tracking-wider">
              MASTER OUT
            </span>
          </div>

          <div className="text-[10px] text-slate-400 font-bold">STEREO BUS</div>

          {/* Master Fader & Meter */}
          <div className="flex items-center justify-center gap-2.5 h-44">
            {/* Stereo Dual Meters */}
            <div className="flex items-center gap-0.5 h-full">
              <div className="w-1.5 h-full bg-slate-950 rounded-full overflow-hidden flex flex-col justify-end p-0.5 border border-slate-800">
                <div
                  className={`w-full rounded-full transition-all duration-75 ${
                    isPlaying ? 'bg-emerald-400 h-3/4' : 'bg-slate-700 h-1/10'
                  }`}
                />
              </div>
              <div className="w-1.5 h-full bg-slate-950 rounded-full overflow-hidden flex flex-col justify-end p-0.5 border border-slate-800">
                <div
                  className={`w-full rounded-full transition-all duration-75 ${
                    isPlaying ? 'bg-emerald-400 h-3/4' : 'bg-slate-700 h-1/10'
                  }`}
                />
              </div>
            </div>

            {/* Master Fader */}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={masterVolume}
              onChange={(e) => onUpdateMasterVolume(Number(e.target.value))}
              className="accent-cyan-400 cursor-pointer h-36 w-2 -rotate-90 origin-center bg-slate-800 rounded-lg"
              title="Master Level"
            />
          </div>

          <div className="text-xs font-bold text-cyan-300">
            {Math.round(masterVolume * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChannelMixer = React.memo(ChannelMixerComponent);
