import React from 'react';
import { MasterFXSettings } from '../types';
import { Sparkles, Activity, Repeat, Zap, Wind } from 'lucide-react';

interface MasterFXRackProps {
  fx: MasterFXSettings;
  onUpdateFX: (updater: (prev: MasterFXSettings) => MasterFXSettings) => void;
}

const MasterFXRackComponent: React.FC<MasterFXRackProps> = ({ fx, onUpdateFX }) => {
  return (
    <div className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 font-mono shadow-inner">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            MASTER EFFECTS RACK
          </h2>
        </div>
        <span className="text-[10px] text-slate-500">
          Studio Grade DSP Processing
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-1">
        {/* 1. FILTER UNIT */}
        <div
          className={`bg-slate-900/90 border rounded-xl p-3 flex flex-col gap-2 transition-all ${
            fx.filter.enabled ? 'border-cyan-500/50 shadow-md shadow-cyan-950/30' : 'border-slate-800 opacity-65'
          }`}
        >
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-bold text-slate-200">FILTER</span>
            </div>
            <button
              onClick={() =>
                onUpdateFX((prev) => ({
                  ...prev,
                  filter: { ...prev.filter, enabled: !prev.filter.enabled },
                }))
              }
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                fx.filter.enabled ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {fx.filter.enabled ? 'ON' : 'BYPASS'}
            </button>
          </div>

          {/* Filter Type */}
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400">TYPE:</span>
            <div className="flex gap-1">
              {(['lowpass', 'highpass', 'bandpass'] as BiquadFilterType[]).map((t) => (
                <button
                  key={t}
                  onClick={() =>
                    onUpdateFX((prev) => ({
                      ...prev,
                      filter: { ...prev.filter, type: t },
                    }))
                  }
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    fx.filter.type === t ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t.slice(0, 4)}
                </button>
              ))}
            </div>
          </div>

          {/* Cutoff */}
          <div className="flex flex-col gap-1 text-[10px]">
            <div className="flex justify-between text-slate-400">
              <span>CUTOFF</span>
              <span className="text-cyan-300 font-bold">{Math.round(fx.filter.cutoff)} Hz</span>
            </div>
            <input
              type="range"
              min={100}
              max={18000}
              step={100}
              value={fx.filter.cutoff}
              onChange={(e) =>
                onUpdateFX((prev) => ({
                  ...prev,
                  filter: { ...prev.filter, cutoff: Number(e.target.value) },
                }))
              }
              className="accent-cyan-400 cursor-pointer w-full"
            />
          </div>

          {/* Resonance */}
          <div className="flex flex-col gap-1 text-[10px]">
            <div className="flex justify-between text-slate-400">
              <span>RESONANCE</span>
              <span className="text-cyan-300 font-bold">{fx.filter.resonance.toFixed(1)} Q</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={15}
              step={0.5}
              value={fx.filter.resonance}
              onChange={(e) =>
                onUpdateFX((prev) => ({
                  ...prev,
                  filter: { ...prev.filter, resonance: Number(e.target.value) },
                }))
              }
              className="accent-cyan-400 cursor-pointer w-full"
            />
          </div>
        </div>

        {/* 2. DELAY UNIT */}
        <div
          className={`bg-slate-900/90 border rounded-xl p-3 flex flex-col gap-2 transition-all ${
            fx.delay.enabled ? 'border-amber-500/50 shadow-md shadow-amber-950/30' : 'border-slate-800 opacity-65'
          }`}
        >
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-slate-200">DELAY</span>
            </div>
            <button
              onClick={() =>
                onUpdateFX((prev) => ({
                  ...prev,
                  delay: { ...prev.delay, enabled: !prev.delay.enabled },
                }))
              }
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                fx.delay.enabled ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {fx.delay.enabled ? 'ON' : 'BYPASS'}
            </button>
          </div>

          {/* Delay Time */}
          <div className="flex flex-col gap-1 text-[10px]">
            <div className="flex justify-between text-slate-400">
              <span>TIME</span>
              <span className="text-amber-300 font-bold">{Math.round(fx.delay.time * 1000)} ms</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={0.8}
              step={0.01}
              value={fx.delay.time}
              onChange={(e) =>
                onUpdateFX((prev) => ({
                  ...prev,
                  delay: { ...prev.delay, time: Number(e.target.value) },
                }))
              }
              className="accent-amber-400 cursor-pointer w-full"
            />
          </div>

          {/* Feedback */}
          <div className="flex flex-col gap-1 text-[10px]">
            <div className="flex justify-between text-slate-400">
              <span>FEEDBACK</span>
              <span className="text-amber-300 font-bold">{Math.round(fx.delay.feedback * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.8}
              step={0.02}
              value={fx.delay.feedback}
              onChange={(e) =>
                onUpdateFX((prev) => ({
                  ...prev,
                  delay: { ...prev.delay, feedback: Number(e.target.value) },
                }))
              }
              className="accent-amber-400 cursor-pointer w-full"
            />
          </div>

          {/* Delay Mix */}
          <div className="flex flex-col gap-1 text-[10px]">
            <div className="flex justify-between text-slate-400">
              <span>WET MIX</span>
              <span className="text-amber-300 font-bold">{Math.round(fx.delay.mix * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={fx.delay.mix}
              onChange={(e) =>
                onUpdateFX((prev) => ({
                  ...prev,
                  delay: { ...prev.delay, mix: Number(e.target.value) },
                }))
              }
              className="accent-amber-400 cursor-pointer w-full"
            />
          </div>
        </div>

        {/* 3. DISTORTION UNIT */}
        <div
          className={`bg-slate-900/90 border rounded-xl p-3 flex flex-col gap-2 transition-all ${
            fx.distortion.enabled ? 'border-rose-500/50 shadow-md shadow-rose-950/30' : 'border-slate-800 opacity-65'
          }`}
        >
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-xs font-bold text-slate-200">OVERDRIVE</span>
            </div>
            <button
              onClick={() =>
                onUpdateFX((prev) => ({
                  ...prev,
                  distortion: { ...prev.distortion, enabled: !prev.distortion.enabled },
                }))
              }
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                fx.distortion.enabled ? 'bg-rose-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {fx.distortion.enabled ? 'ON' : 'BYPASS'}
            </button>
          </div>

          {/* Drive */}
          <div className="flex flex-col gap-1 text-[10px]">
            <div className="flex justify-between text-slate-400">
              <span>DRIVE</span>
              <span className="text-rose-300 font-bold">{Math.round(fx.distortion.drive)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={fx.distortion.drive}
              onChange={(e) =>
                onUpdateFX((prev) => ({
                  ...prev,
                  distortion: { ...prev.distortion, drive: Number(e.target.value) },
                }))
              }
              className="accent-rose-400 cursor-pointer w-full"
            />
          </div>

          {/* Drive Mix */}
          <div className="flex flex-col gap-1 text-[10px]">
            <div className="flex justify-between text-slate-400">
              <span>WET MIX</span>
              <span className="text-rose-300 font-bold">{Math.round(fx.distortion.mix * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={fx.distortion.mix}
              onChange={(e) =>
                onUpdateFX((prev) => ({
                  ...prev,
                  distortion: { ...prev.distortion, mix: Number(e.target.value) },
                }))
              }
              className="accent-rose-400 cursor-pointer w-full"
            />
          </div>
        </div>

        {/* 4. REVERB UNIT */}
        <div
          className={`bg-slate-900/90 border rounded-xl p-3 flex flex-col gap-2 transition-all ${
            fx.reverb.enabled ? 'border-indigo-500/50 shadow-md shadow-indigo-950/30' : 'border-slate-800 opacity-65'
          }`}
        >
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-bold text-slate-200">SPACE REVERB</span>
            </div>
            <button
              onClick={() =>
                onUpdateFX((prev) => ({
                  ...prev,
                  reverb: { ...prev.reverb, enabled: !prev.reverb.enabled },
                }))
              }
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                fx.reverb.enabled ? 'bg-indigo-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {fx.reverb.enabled ? 'ON' : 'BYPASS'}
            </button>
          </div>

          {/* Reverb Decay */}
          <div className="flex flex-col gap-1 text-[10px]">
            <div className="flex justify-between text-slate-400">
              <span>DECAY TIME</span>
              <span className="text-indigo-300 font-bold">{fx.reverb.decay.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={4.5}
              step={0.1}
              value={fx.reverb.decay}
              onChange={(e) =>
                onUpdateFX((prev) => ({
                  ...prev,
                  reverb: { ...prev.reverb, decay: Number(e.target.value) },
                }))
              }
              className="accent-indigo-400 cursor-pointer w-full"
            />
          </div>

          {/* Reverb Wet Mix */}
          <div className="flex flex-col gap-1 text-[10px]">
            <div className="flex justify-between text-slate-400">
              <span>WET MIX</span>
              <span className="text-indigo-300 font-bold">{Math.round(fx.reverb.mix * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={fx.reverb.mix}
              onChange={(e) =>
                onUpdateFX((prev) => ({
                  ...prev,
                  reverb: { ...prev.reverb, mix: Number(e.target.value) },
                }))
              }
              className="accent-indigo-400 cursor-pointer w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const MasterFXRack = React.memo(MasterFXRackComponent);
