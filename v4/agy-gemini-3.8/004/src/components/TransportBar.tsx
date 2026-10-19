import React, { useRef } from 'react';
import { ProjectData } from '../types';
import { Play, Pause, Square, Music, Sliders, Volume2, Download, Upload, Plus } from 'lucide-react';

interface TransportBarProps {
  project: ProjectData;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onUpdateBpm: (bpm: number) => void;
  onUpdateSwing: (swing: number) => void;
  isMetronome: boolean;
  onToggleMetronome: () => void;
  onLoadPreset: (presetKey: string) => void;
  onExportJson: () => void;
  onImportJson: (data: ProjectData) => void;
  onNewProject: () => void;
}

const TransportBarComponent: React.FC<TransportBarProps> = ({
  project,
  isPlaying,
  onPlay,
  onPause,
  onStop,
  onUpdateBpm,
  onUpdateSwing,
  isMetronome,
  onToggleMetronome,
  onLoadPreset,
  onExportJson,
  onImportJson,
  onNewProject,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.tracks && Array.isArray(parsed.tracks) && parsed.bpm) {
          const merged: ProjectData = {
            ...project,
            ...parsed,
            masterFX: {
              ...project.masterFX,
              ...(parsed.masterFX || {}),
              filter: { ...project.masterFX.filter, ...(parsed.masterFX?.filter || {}) },
              delay: { ...project.masterFX.delay, ...(parsed.masterFX?.delay || {}) },
              distortion: { ...project.masterFX.distortion, ...(parsed.masterFX?.distortion || {}) },
              reverb: { ...project.masterFX.reverb, ...(parsed.masterFX?.reverb || {}) },
            },
          };
          onImportJson(merged);
        } else {
          alert('Invalid project JSON structure.');
        }
      } catch (err) {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset for re-upload
  };

  return (
    <header className="w-full bg-slate-900/90 border-b border-cyan-500/30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md backdrop-blur-md">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-900/40">
          <Music className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold font-mono tracking-wider text-cyan-400 leading-none">
            SYNTH-STRUM STUDIO
          </h1>
          <span className="text-[11px] text-slate-400 font-mono">
            {project.title} &bull; v{project.version}
          </span>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
        <button
          onClick={isPlaying ? onPause : onPlay}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all shadow-md ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/50 animate-pulse'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/50'
          }`}
          title="Play / Pause [Space]"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
        </button>

        <button
          onClick={onStop}
          className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          title="Stop & Rewind"
        >
          <Square className="w-4 h-4" />
        </button>

        {/* BPM Selector */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs">
          <span className="text-slate-400 font-bold">BPM</span>
          <input
            type="number"
            min={60}
            max={220}
            value={project.bpm}
            onChange={(e) => onUpdateBpm(Number(e.target.value))}
            className="w-14 bg-slate-950 text-cyan-300 font-bold px-1.5 py-0.5 rounded border border-slate-700 text-center focus:outline-hidden focus:border-cyan-400"
          />
          <input
            type="range"
            min={60}
            max={220}
            value={project.bpm}
            onChange={(e) => onUpdateBpm(Number(e.target.value))}
            className="w-16 accent-cyan-400 cursor-pointer hidden sm:block"
          />
        </div>

        {/* Swing Control */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs">
          <span className="text-slate-400 font-bold">SWING</span>
          <span className="text-amber-400 font-bold w-9 text-right">
            {Math.round(project.swing * 100)}%
          </span>
          <input
            type="range"
            min={0}
            max={0.5}
            step={0.02}
            value={project.swing}
            onChange={(e) => onUpdateSwing(Number(e.target.value))}
            className="w-16 accent-amber-400 cursor-pointer"
          />
        </div>

        {/* Metronome */}
        <button
          onClick={onToggleMetronome}
          className={`px-2.5 py-1.5 rounded-lg border font-mono text-xs font-bold transition-colors ${
            isMetronome
              ? 'bg-emerald-500/20 border-emerald-500/80 text-emerald-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Metronome Audio Click"
        >
          METRO
        </button>
      </div>

      {/* Preset Selector & File Actions */}
      <div className="flex items-center gap-2">
        {/* Preset Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
          <span className="text-slate-400">DEMO:</span>
          <select
            onChange={(e) => onLoadPreset(e.target.value)}
            defaultValue="synthwave"
            className="bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-1 focus:outline-hidden focus:border-cyan-400 cursor-pointer"
          >
            <option value="synthwave">Cyberpunk Synthwave</option>
            <option value="lofi">Lo-Fi Midnight Chill</option>
            <option value="chiptune">Arcade Chiptune</option>
          </select>
        </div>

        {/* Export JSON */}
        <button
          onClick={onExportJson}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-850 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-cyan-500/40 rounded-lg font-mono text-xs transition-colors shadow-xs"
          title="Export Project to JSON"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">EXPORT</span>
        </button>

        {/* Import JSON */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-850 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 border border-indigo-500/40 rounded-lg font-mono text-xs transition-colors shadow-xs"
          title="Import Project from JSON file"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">IMPORT</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".json,application/json"
          className="hidden"
        />

        {/* New Blank Project */}
        <button
          onClick={onNewProject}
          className="p-1.5 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-700 rounded-lg transition-colors"
          title="Create New Blank Project"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export const TransportBar = React.memo(TransportBarComponent);
