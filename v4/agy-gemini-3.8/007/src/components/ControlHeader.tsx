import React from 'react';
import { InterventionTool, MicroscopyMode } from '../types';
import {
  Search,
  Pipette,
  Zap,
  Dna,
  Eraser,
  Volume2,
  VolumeX,
  RotateCcw,
  Eye,
  Sparkles,
} from 'lucide-react';

interface ControlHeaderProps {
  currentTool: InterventionTool;
  onSelectTool: (tool: InterventionTool) => void;
  microscopyMode: MicroscopyMode;
  onSelectMicroscopy: (mode: MicroscopyMode) => void;
  onLoadPreset: (presetName: string) => void;
  onOpenCrisprLab: () => void;
  onReset: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const ControlHeader: React.FC<ControlHeaderProps> = ({
  currentTool,
  onSelectTool,
  microscopyMode,
  onSelectMicroscopy,
  onLoadPreset,
  onOpenCrisprLab,
  onReset,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="h-14 bg-slate-950/95 border-b border-slate-800/80 px-4 flex items-center justify-between z-20 backdrop-blur-md select-none shrink-0">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Dna className="w-5 h-5 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm tracking-wide text-slate-100 flex items-center gap-1.5">
              <span>GENOME-FORGE</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                EXP-007
              </span>
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
            Evolutionary Artificial Life &amp; Gene-Regulatory Ecosystem
          </p>
        </div>
      </div>

      {/* Intervention Tools */}
      <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800/80 p-1 rounded-xl">
        <button
          onClick={() => onSelectTool('SELECT_INSPECT')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            currentTool === 'SELECT_INSPECT'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Inspect Organism [1]"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Inspect</span>
        </button>

        <button
          onClick={() => onSelectTool('PIPETTE_NUTRIENT')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            currentTool === 'PIPETTE_NUTRIENT'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Feed Nutrient Bloom [2]"
        >
          <Pipette className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Feed</span>
        </button>

        <button
          onClick={() => onSelectTool('MUTAGEN_BEAM')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            currentTool === 'MUTAGEN_BEAM'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Mutagenic Radiation Beam [3]"
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Mutate</span>
        </button>

        <button
          onClick={onOpenCrisprLab}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 hover:border-purple-400/50 transition-all shadow-xs"
          title="CRISPR Gene Splicer [4]"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>CRISPR Lab</span>
        </button>

        <button
          onClick={() => onSelectTool('EXTERMINATE')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            currentTool === 'EXTERMINATE'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Biocide Vacuum / Exterminate [5]"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Prune</span>
        </button>
      </div>

      {/* Microscopy & System Controls */}
      <div className="flex items-center gap-2">
        {/* Microscopy Filter */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-900/80 border border-slate-800/80 px-2 py-1 rounded-lg text-xs">
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 text-[11px] mr-1">Optics:</span>
          {(['DARK_FIELD', 'PHASE_CONTRAST', 'FLUORESCENT_GFP', 'BRIGHT_FIELD'] as MicroscopyMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => onSelectMicroscopy(mode)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all ${
                microscopyMode === mode
                  ? 'bg-emerald-500/30 text-emerald-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Preset Selector */}
        <select
          onChange={(e) => onLoadPreset(e.target.value)}
          defaultValue="primordial-soup"
          className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-emerald-500 cursor-pointer"
        >
          <option value="primordial-soup">Soup (Balanced)</option>
          <option value="red-queen">Red Queen (Arms Race)</option>
          <option value="extremophiles">Extremophiles (Toxic)</option>
        </select>

        {/* Audio Mute */}
        <button
          onClick={onToggleMute}
          className={`p-2 rounded-lg border text-xs transition-all ${
            isMuted
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
          title={isMuted ? 'Unmute Audio [M]' : 'Mute Audio [M]'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Reset Ecosystem */}
        <button
          onClick={onReset}
          className="p-2 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800 transition-all"
          title="Reset Ecosystem [C]"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
