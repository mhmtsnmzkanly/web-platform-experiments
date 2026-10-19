import React from 'react';
import {
  SimParameters,
  PresetType,
  SourceMode,
  MaterialType,
  ColorMapMode,
} from '../types';

interface ControlHeaderProps {
  params: SimParameters;
  onUpdateParams: (partial: Partial<SimParameters>) => void;
  onApplyPreset: (preset: PresetType) => void;
  onShockBurst: () => void;
  onResetFields: () => void;
  activeTool: 'BRUSH' | 'PROBE';
  onSetActiveTool: (tool: 'BRUSH' | 'PROBE') => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
}

const ControlHeaderComponent: React.FC<ControlHeaderProps> = ({
  params,
  onUpdateParams,
  onApplyPreset,
  onShockBurst,
  onResetFields,
  activeTool,
  onSetActiveTool,
  isAudioMuted,
  onToggleAudio,
}) => {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 p-3 flex flex-col gap-3 font-mono text-xs">
      {/* Top Identity & Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50 animate-pulse" />
          <div>
            <h1 className="font-black text-sm text-slate-100 tracking-wider flex items-center gap-2">
              <span>MAXWELL-LAB V2</span>
              <span className="text-[10px] font-normal text-cyan-400 border border-cyan-500/40 px-1.5 py-0.5 rounded">
                YEE FDTD
              </span>
            </h1>
            <p className="text-[10px] text-slate-400">
              Interactive 2D Full-Wave Electrodynamics & Metamaterials Studio
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Shock Burst Button */}
          <button
            onClick={onShockBurst}
            id="btnPulse"
            className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-cyan-500/30 transition-all cursor-pointer"
          >
            ⚡ SHOCK BURST
          </button>

          {/* Pause / Resume */}
          <button
            onClick={() => onUpdateParams({ isPaused: !params.isPaused })}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            {params.isPaused ? '▶ RESUME' : '⏸ PAUSE'}
          </button>

          {/* Clear / Reset Fields */}
          <button
            onClick={onResetFields}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            RESET
          </button>

          {/* Audio Sonification */}
          <button
            onClick={onToggleAudio}
            className={`px-2.5 py-1.5 rounded border transition-colors cursor-pointer ${
              !isAudioMuted
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {!isAudioMuted ? '🔊 AUDIO ON' : '🔇 MUTE'}
          </button>
        </div>
      </div>

      {/* Primary Configuration Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-800/80">
        {/* 1. Device Preset */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase">DEVICE PRESET</label>
          <select
            defaultValue="TYPOGRAPHIC"
            onChange={(e) => onApplyPreset(e.target.value as PresetType)}
            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 outline-none cursor-pointer"
          >
            <option value="TYPOGRAPHIC">Typographic Metasurface</option>
            <option value="DOUBLE_SLIT">Young's Double Slit</option>
            <option value="CONVEX_LENS">Convex Dielectric Lens</option>
            <option value="PHOTONIC_CRYSTAL">Photonic Crystal Lattice</option>
            <option value="PRISM_TIR">Total Internal Reflection Prism</option>
            <option value="EMPTY_WAVEGUIDE">Empty Waveguide</option>
          </select>
        </div>

        {/* 2. Wave Source Mode */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase">SOURCE EMITTER</label>
          <select
            value={params.sourceMode}
            onChange={(e) => onUpdateParams({ sourceMode: e.target.value as SourceMode })}
            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 outline-none cursor-pointer"
          >
            <option value="CONTINUOUS_PLANE">Continuous Plane Wave</option>
            <option value="STEERED_BEAM">Angled Steered Beam</option>
            <option value="RICKER_PULSE">Ricker Wavelet Pulse</option>
            <option value="POINT_DIPOLE">Point Dipole Antenna</option>
          </select>
        </div>

        {/* 3. Wavelength Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span className="font-bold">WAVELENGTH (λ₀)</span>
            <span className="text-cyan-400 font-bold">{params.wavelength} px</span>
          </div>
          <input
            type="range"
            id="sliderWavelen"
            min="12"
            max="32"
            value={params.wavelength}
            onChange={(e) => onUpdateParams({ wavelength: parseFloat(e.target.value) })}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* 4. Permittivity Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span className="font-bold">PERMITTIVITY (εᵣ)</span>
            <span className="text-amber-400 font-bold">{params.epsRel.toFixed(1)}</span>
          </div>
          <input
            type="range"
            id="sliderEps"
            min="15"
            max="80"
            value={Math.round(params.epsRel * 10)}
            onChange={(e) => onUpdateParams({ epsRel: parseFloat(e.target.value) / 10 })}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* 5. Tool Selection: Brush vs Probe */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-bold uppercase">INTERACTION MODE</label>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => onSetActiveTool('BRUSH')}
              className={`py-1 rounded text-center font-bold border transition-colors cursor-pointer ${
                activeTool === 'BRUSH'
                  ? 'bg-cyan-900/60 border-cyan-400 text-cyan-200'
                  : 'bg-slate-950 border-slate-700 text-slate-400'
              }`}
            >
              BRUSH
            </button>
            <button
              onClick={() => onSetActiveTool('PROBE')}
              className={`py-1 rounded text-center font-bold border transition-colors cursor-pointer ${
                activeTool === 'PROBE'
                  ? 'bg-rose-900/60 border-rose-400 text-rose-200'
                  : 'bg-slate-950 border-slate-700 text-slate-400'
              }`}
            >
              PROBE
            </button>
          </div>
        </div>

        {/* 6. Material / Brush Type & Size */}
        {activeTool === 'BRUSH' ? (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
              <span>MATERIAL</span>
              <div className="flex gap-1">
                {[3, 6, 12].map((r) => (
                  <button
                    key={r}
                    onClick={() => onUpdateParams({ brushRadius: r })}
                    className={`px-1 rounded text-[9px] ${
                      params.brushRadius === r ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {r}p
                  </button>
                ))}
              </div>
            </div>
            <select
              value={params.materialBrush}
              onChange={(e) => onUpdateParams({ materialBrush: e.target.value as MaterialType })}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 outline-none cursor-pointer"
            >
              <option value="DIELECTRIC">Dielectric (εᵣ)</option>
              <option value="CONDUCTOR_PEC">PEC Metal (Mirror)</option>
              <option value="LOSSY_ABSORBER">Lossy Absorber</option>
              <option value="VACUUM">Vacuum / Eraser</option>
            </select>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase">COLORMAP</label>
            <select
              value={params.colorMap}
              onChange={(e) => onUpdateParams({ colorMap: e.target.value as ColorMapMode })}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 outline-none cursor-pointer"
            >
              <option value="BIPOLAR_ELECTRIC">Electric Bipolar</option>
              <option value="PLASMA_MAGMA">Plasma Magma</option>
              <option value="SEISMIC">Seismic Diverging</option>
              <option value="GREEN_PHOSPHOR">Radar Phosphor</option>
            </select>
          </div>
        )}
      </div>

      {/* Sub-bar: Custom Typography & Poynting Flux Switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        {/* Custom Text input for Typographic Metasurface */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 uppercase font-bold">TYPOGRAPHY:</span>
          <input
            type="text"
            value={params.customText}
            maxLength={18}
            onChange={(e) => {
              const text = e.target.value.toUpperCase();
              onUpdateParams({ customText: text });
            }}
            placeholder="TYPE ANY WORD..."
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-amber-300 font-bold w-48 outline-none focus:border-amber-400"
          />
          <button
            onClick={() => onApplyPreset('TYPOGRAPHIC')}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs rounded transition-colors cursor-pointer"
          >
            RASTERIZE
          </button>
        </div>

        {/* Visual Overlays & Angle Controls */}
        <div className="flex items-center gap-4 text-[11px]">
          {params.sourceMode === 'STEERED_BEAM' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold">ANGLE:</span>
              <input
                type="range"
                min="-40"
                max="40"
                value={params.sourceAngleDeg}
                onChange={(e) => onUpdateParams({ sourceAngleDeg: parseInt(e.target.value) })}
                className="w-24 accent-cyan-500 cursor-pointer"
              />
              <span className="text-cyan-400 font-bold w-10 text-right">
                {params.sourceAngleDeg}°
              </span>
            </div>
          )}

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={params.showPoyntingVectors}
              onChange={(e) => onUpdateParams({ showPoyntingVectors: e.target.checked })}
              className="accent-cyan-500 cursor-pointer"
            />
            <span>POYNTING FLUX (S)</span>
          </label>
        </div>
      </div>
    </header>
  );
};

export const ControlHeader = React.memo(ControlHeaderComponent);
