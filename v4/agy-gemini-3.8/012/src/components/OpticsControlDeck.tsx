import React, { useState } from 'react';
import {
  Sliders,
  TrendingUp,
  Layers,
  Sparkles,
  Sun,
  Eye,
  Info,
  RotateCcw,
  Plus,
  Trash2,
  Activity,
  Zap,
} from 'lucide-react';
import {
  OpticsSuiteMode,
  DiffractionConfig,
  DiffractionPresetId,
  InterferometerConfig,
  InterferometerType,
  ThinFilmConfig,
  HologramConfig,
  OpticalSourceConfig,
  OpticsMetrics,
  CrossSectionPoint,
  SpectrumPoint,
} from '../types';
import { THIN_FILM_PRESETS } from '../optics/ThinFilmEngine';

interface OpticsControlDeckProps {
  suiteMode: OpticsSuiteMode;
  source: OpticalSourceConfig;
  onUpdateSource: (updater: (prev: OpticalSourceConfig) => OpticalSourceConfig) => void;
  diffConfig: DiffractionConfig;
  onUpdateDiffConfig: (updater: (prev: DiffractionConfig) => DiffractionConfig) => void;
  interConfig: InterferometerConfig;
  onUpdateInterConfig: (updater: (prev: InterferometerConfig) => InterferometerConfig) => void;
  thinFilmConfig: ThinFilmConfig;
  onUpdateThinFilmConfig: (updater: (prev: ThinFilmConfig) => ThinFilmConfig) => void;
  holoConfig: HologramConfig;
  onUpdateHoloConfig: (updater: (prev: HologramConfig) => HologramConfig) => void;
  metrics: OpticsMetrics;
  crossSection: CrossSectionPoint[];
  spectrumData: SpectrumPoint[];
}

export const OpticsControlDeck: React.FC<OpticsControlDeckProps> = ({
  suiteMode,
  source,
  onUpdateSource,
  diffConfig,
  onUpdateDiffConfig,
  interConfig,
  onUpdateInterConfig,
  thinFilmConfig,
  onUpdateThinFilmConfig,
  holoConfig,
  onUpdateHoloConfig,
  metrics,
  crossSection,
  spectrumData,
}) => {
  const [activeTab, setActiveTab] = useState<'CONTROLS' | 'CROSS_SECTION' | 'SPECTRUM'>('CONTROLS');

  return (
    <div className="w-full flex flex-col bg-slate-950/95 backdrop-blur border-t border-slate-800 text-xs select-none">
      {/* Sub-Header Tabs */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 bg-slate-900/40">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('CONTROLS')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'CONTROLS'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>OPTICAL BENCH CONTROLS</span>
          </button>

          <button
            onClick={() => setActiveTab('CROSS_SECTION')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'CROSS_SECTION'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>DETECTOR SLICE I(y)</span>
          </button>

          <button
            onClick={() => setActiveTab('SPECTRUM')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'SPECTRUM'
                ? 'bg-slate-800 text-amber-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>THIN-FILM SPECTRUM R(λ) / T(λ)</span>
          </button>
        </div>

        {/* Global Laser Source Wavelength Slider */}
        <div className="hidden sm:flex items-center space-x-3 font-mono text-[11px] text-slate-300">
          <span>LASER WAVELENGTH:</span>
          <input
            type="range"
            min={400}
            max={700}
            step={1}
            value={source.wavelengthNm}
            onChange={(e) => {
              const val = Number(e.target.value);
              onUpdateSource((prev) => ({ ...prev, wavelengthNm: val }));
            }}
            className="w-28 cursor-pointer"
          />
          <span className="font-bold text-emerald-400 w-14 text-right">{source.wavelengthNm} nm</span>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-3 max-h-56 overflow-y-auto">
        {/* 1. BENCH CONTROLS TAB */}
        {activeTab === 'CONTROLS' && (
          <div className="space-y-3">
            {suiteMode === 'DIFFRACTION' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Preset Selector */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-mono text-[11px] block">DIFFRACTION APERTURE:</label>
                  <select
                    value={diffConfig.preset}
                    onChange={(e) =>
                      onUpdateDiffConfig((prev) => ({ ...prev, preset: e.target.value as DiffractionPresetId }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 text-emerald-300 rounded p-1.5 text-xs outline-none cursor-pointer"
                  >
                    <option value="young-double-slit">Young Double-Slit (Interference)</option>
                    <option value="single-slit">Single-Slit (Fraunhofer Diffraction)</option>
                    <option value="circular-airy">Circular Aperture (Airy Disc)</option>
                    <option value="diffraction-grating">Diffraction Grating (Spectral Orders)</option>
                    <option value="fresnel-zone-plate">Fresnel Zone Plate (Diffractive Lens)</option>
                    <option value="custom-slm">Custom SLM Pinhole Pair</option>
                  </select>
                </div>

                {/* Slit Distance / Aperture Radius */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                    <span>SLIT DISTANCE (d):</span>
                    <span className="text-cyan-400 font-bold">{diffConfig.slitDistanceUm} µm</span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={600}
                    step={10}
                    value={diffConfig.slitDistanceUm}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onUpdateDiffConfig((prev) => ({ ...prev, slitDistanceUm: val }));
                    }}
                    className="w-full cursor-pointer"
                  />
                </div>

                {/* Slit Width */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                    <span>SLIT WIDTH (a):</span>
                    <span className="text-emerald-400 font-bold">{diffConfig.slitWidthUm} µm</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={120}
                    step={5}
                    value={diffConfig.slitWidthUm}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onUpdateDiffConfig((prev) => ({ ...prev, slitWidthUm: val }));
                    }}
                    className="w-full cursor-pointer"
                  />
                </div>

                {/* Propagation Distance z */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                    <span>SCREEN DISTANCE (z):</span>
                    <span className="text-amber-400 font-bold">{diffConfig.propagationDistanceMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={300}
                    step={10}
                    value={diffConfig.propagationDistanceMm}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onUpdateDiffConfig((prev) => ({ ...prev, propagationDistanceMm: val }));
                    }}
                    className="w-full cursor-pointer"
                  />
                </div>
              </div>
            )}

            {suiteMode === 'INTERFEROMETRY' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Interferometer Type */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-mono text-[11px] block">INTERFEROMETER TYPE:</label>
                  <select
                    value={interConfig.type}
                    onChange={(e) =>
                      onUpdateInterConfig((prev) => ({ ...prev, type: e.target.value as InterferometerType }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 text-emerald-300 rounded p-1.5 text-xs outline-none cursor-pointer"
                  >
                    <option value="MICHELSON">Michelson (Movable Mirror)</option>
                    <option value="MACH_ZEHNDER">Mach-Zehnder (Test Cell Refractometer)</option>
                    <option value="FABRY_PEROT">Fabry-Pérot (Resonant Cavity)</option>
                  </select>
                </div>

                {/* Piezo Displacement / Mirror Scan */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                    <span>PIEZO SCAN (ΔL):</span>
                    <span className="text-cyan-400 font-bold">{interConfig.piezoDisplacementNm} nm</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2000}
                    step={10}
                    value={interConfig.piezoDisplacementNm}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onUpdateInterConfig((prev) => ({ ...prev, piezoDisplacementNm: val }));
                    }}
                    className="w-full cursor-pointer"
                  />
                </div>

                {/* Mirror Tilt Angle */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                    <span>MIRROR TILT (θ):</span>
                    <span className="text-purple-400 font-bold">{interConfig.mirrorTiltDeg.toFixed(2)}°</span>
                  </div>
                  <input
                    type="range"
                    min={0.0}
                    max={3.0}
                    step={0.05}
                    value={interConfig.mirrorTiltDeg}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onUpdateInterConfig((prev) => ({ ...prev, mirrorTiltDeg: val }));
                    }}
                    className="w-full cursor-pointer"
                  />
                </div>

                {/* Mach-Zehnder Sample Cell Refractive Index */}
                {interConfig.type === 'MACH_ZEHNDER' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                      <span>SAMPLE INDEX (n):</span>
                      <span className="text-emerald-400 font-bold">{interConfig.sampleRefractiveIndex.toFixed(3)}</span>
                    </div>
                    <input
                      type="range"
                      min={1.0}
                      max={1.5}
                      step={0.005}
                      value={interConfig.sampleRefractiveIndex}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        onUpdateInterConfig((prev) => ({ ...prev, sampleRefractiveIndex: val }));
                      }}
                      className="w-full cursor-pointer"
                    />
                  </div>
                )}

                {/* Fabry-Perot Mirror Reflectivity */}
                {interConfig.type === 'FABRY_PEROT' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                      <span>CAVITY REFLECTANCE (R):</span>
                      <span className="text-amber-400 font-bold">{(interConfig.mirrorReflectivity * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.6}
                      max={0.98}
                      step={0.01}
                      value={interConfig.mirrorReflectivity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        onUpdateInterConfig((prev) => ({ ...prev, mirrorReflectivity: val }));
                      }}
                      className="w-full cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}

            {suiteMode === 'THIN_FILM' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Preset Coatings */}
                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[11px] block">OPTICAL COATING PRESET:</label>
                    <select
                      onChange={(e) => {
                        const idx = Number(e.target.value);
                        const selected = THIN_FILM_PRESETS[idx];
                        onUpdateThinFilmConfig((prev) => ({ ...prev, layers: [...selected.layers] }));
                      }}
                      className="w-full bg-slate-900 border border-slate-700 text-emerald-300 rounded p-1.5 text-xs outline-none cursor-pointer"
                    >
                      {THIN_FILM_PRESETS.map((p, i) => (
                        <option key={i} value={i}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Incident Angle */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                      <span>INCIDENT ANGLE (θ₀):</span>
                      <span className="text-cyan-400 font-bold">{thinFilmConfig.incidentAngleDeg}°</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={75}
                      step={1}
                      value={thinFilmConfig.incidentAngleDeg}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        onUpdateThinFilmConfig((prev) => ({ ...prev, incidentAngleDeg: val }));
                      }}
                      className="w-full cursor-pointer"
                    />
                  </div>

                  {/* Polarization */}
                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[11px] block">POLARIZATION STATE:</label>
                    <div className="flex space-x-1">
                      {(['UNPOLARIZED', 'TE', 'TM'] as const).map((pol) => (
                        <button
                          key={pol}
                          onClick={() => onUpdateThinFilmConfig((prev) => ({ ...prev, polarization: pol }))}
                          className={`flex-1 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                            thinFilmConfig.polarization === pol
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          {pol}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active Layer Stack Breakdown */}
                <div className="flex items-center space-x-2 overflow-x-auto py-1">
                  <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">STACK: Air |</span>
                  {thinFilmConfig.layers.map((l, i) => (
                    <div
                      key={l.id || i}
                      className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono whitespace-nowrap"
                    >
                      <span className="text-emerald-400 font-bold">{l.name}:</span>
                      <span className="text-slate-300">{l.thicknessNm}nm</span>
                      <span className="text-cyan-400">(n={l.refractiveIndex})</span>
                    </div>
                  ))}
                  <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">| Substrate (n={thinFilmConfig.substrateIndex})</span>
                </div>
              </div>
            )}

            {suiteMode === 'HOLOGRAPHY' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Object Pattern */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-mono text-[11px] block">HOLOGRAPHIC TARGET OBJECT:</label>
                  <select
                    value={holoConfig.objectType}
                    onChange={(e) =>
                      onUpdateHoloConfig((prev) => ({ ...prev, objectType: e.target.value as any }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 text-emerald-300 rounded p-1.5 text-xs outline-none cursor-pointer"
                  >
                    <option value="DOUBLE_PINHOLE">Double Pinhole (Young's Target)</option>
                    <option value="LETTER_OMEGA">Greek Letter Omega (Ω Mask)</option>
                    <option value="SLM_TARGET">SLM Diffractive Hologram</option>
                  </select>
                </div>

                {/* Reference Beam Angle */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                    <span>REFERENCE BEAM ANGLE:</span>
                    <span className="text-cyan-400 font-bold">{holoConfig.referenceAngleDeg.toFixed(1)}°</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={6.0}
                    step={0.1}
                    value={holoConfig.referenceAngleDeg}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onUpdateHoloConfig((prev) => ({ ...prev, referenceAngleDeg: val }));
                    }}
                    className="w-full cursor-pointer"
                  />
                </div>

                {/* Reconstruction Toggle Button */}
                <div className="pt-3">
                  <button
                    onClick={() =>
                      onUpdateHoloConfig((prev) => ({ ...prev, isReconstructing: !prev.isReconstructing }))
                    }
                    className={`w-full py-2 rounded-lg font-bold text-xs cursor-pointer transition-all flex items-center justify-center space-x-2 ${
                      holoConfig.isReconstructing
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/50'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>
                      {holoConfig.isReconstructing ? 'RETURN TO HOLOGRAM RECORDING' : 'RECONSTRUCT 3D VIRTUAL IMAGE'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. DETECTOR SLICE I(y) TAB */}
        {activeTab === 'CROSS_SECTION' && (
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full h-36 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 90" preserveAspectRatio="none">
                {/* Horizontal baseline */}
                <line x1="0" y1="80" x2="300" y2="80" stroke="#475569" strokeWidth="1" />
                <line x1="150" y1="0" x2="150" y2="80" stroke="#334155" strokeWidth="1" strokeDasharray="2,2" />

                {/* Axis labels */}
                <text x="5" y="88" fill="#64748b" fontSize="8" fontFamily="monospace">-5 mm</text>
                <text x="145" y="88" fill="#64748b" fontSize="8" fontFamily="monospace">0 mm</text>
                <text x="270" y="88" fill="#64748b" fontSize="8" fontFamily="monospace">+5 mm</text>
                <text x="5" y="12" fill="#38bdf8" fontSize="8" fontFamily="monospace">I(y) Intensity</text>

                {/* Intensity curve polyline */}
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  points={crossSection
                    .map((pt, i) => {
                      const sx = (i / (crossSection.length - 1)) * 300;
                      const sy = 80 - Math.min(75, pt.intensity * 75);
                      return `${sx},${sy}`;
                    })
                    .join(' ')}
                />
              </svg>
            </div>

            <div className="w-full md:w-64 font-mono text-[11px] space-y-1 text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="font-bold text-cyan-400">DETECTOR METRICS:</span>
              <div className="flex justify-between">
                <span>Peak Intensity:</span>
                <span className="text-white font-bold">{metrics.peakIntensity.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fringe Contrast (V):</span>
                <span className="text-emerald-400 font-bold">{(metrics.fringeVisibility * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Airy Radius (r₁):</span>
                <span className="text-amber-400 font-bold">{metrics.airyDiscRadiusMm.toFixed(2)} mm</span>
              </div>
              <div className="flex justify-between">
                <span>Phase Shift (Δφ):</span>
                <span className="text-purple-300 font-bold">{metrics.phaseShiftDeg.toFixed(1)}°</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. THIN-FILM SPECTRUM TAB */}
        {activeTab === 'SPECTRUM' && (
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full h-36 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 90" preserveAspectRatio="none">
                <line x1="0" y1="80" x2="300" y2="80" stroke="#475569" strokeWidth="1" />
                <line x1="0" y1="10" x2="300" y2="10" stroke="#334155" strokeWidth="1" strokeDasharray="2,2" />

                {/* Axis labels */}
                <text x="5" y="88" fill="#64748b" fontSize="8" fontFamily="monospace">380 nm (Violet)</text>
                <text x="135" y="88" fill="#64748b" fontSize="8" fontFamily="monospace">550 nm (Green)</text>
                <text x="250" y="88" fill="#64748b" fontSize="8" fontFamily="monospace">780 nm (Red)</text>
                <text x="5" y="10" fill="#f43f5e" fontSize="8" fontFamily="monospace">R(λ) Reflectance</text>
                <text x="230" y="10" fill="#10b981" fontSize="8" fontFamily="monospace">T(λ) Transmission</text>

                {/* Reflectance R(lambda) curve */}
                <polyline
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2"
                  points={spectrumData
                    .map((pt, i) => {
                      const sx = (i / (spectrumData.length - 1)) * 300;
                      const sy = 80 - pt.reflectance * 70;
                      return `${sx},${sy}`;
                    })
                    .join(' ')}
                />

                {/* Transmittance T(lambda) curve */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                  points={spectrumData
                    .map((pt, i) => {
                      const sx = (i / (spectrumData.length - 1)) * 300;
                      const sy = 80 - pt.transmittance * 70;
                      return `${sx},${sy}`;
                    })
                    .join(' ')}
                />

                {/* Laser Marker */}
                <line
                  x1={((source.wavelengthNm - 380) / 400) * 300}
                  y1="0"
                  x2={((source.wavelengthNm - 380) / 400) * 300}
                  y2="80"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            <div className="w-full md:w-64 font-mono text-[11px] space-y-1 text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="font-bold text-amber-400">TRANSFER MATRIX (TMM):</span>
              <div className="flex justify-between">
                <span>Laser Wavelength:</span>
                <span className="text-white font-bold">{source.wavelengthNm} nm</span>
              </div>
              <div className="flex justify-between">
                <span>Reflectance (R):</span>
                <span className="text-rose-400 font-bold">
                  {((spectrumData.find((p) => Math.abs(p.wavelengthNm - source.wavelengthNm) < 8)?.reflectance ?? 0.04) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Transmittance (T):</span>
                <span className="text-emerald-400 font-bold">
                  {((spectrumData.find((p) => Math.abs(p.wavelengthNm - source.wavelengthNm) < 8)?.transmittance ?? 0.96) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                <span>Coating Layers:</span>
                <span className="text-slate-300">{thinFilmConfig.layers.length} layers</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
