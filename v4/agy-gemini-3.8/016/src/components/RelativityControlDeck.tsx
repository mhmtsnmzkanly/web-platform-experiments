import React from 'react';
import {
  SuiteMode,
  MetricType,
  ColormapMode,
  GeodesicParams,
  LensingParams,
  GravitationalWaveParams,
  TelemetryMetrics,
} from '../types';

interface RelativityControlDeckProps {
  suiteMode: SuiteMode;
  colormapMode: ColormapMode;
  onSetColormapMode: (mode: ColormapMode) => void;
  geodesicParams: GeodesicParams;
  lensingParams: LensingParams;
  gwParams: GravitationalWaveParams;
  telemetry: TelemetryMetrics;
  onUpdateGeodesic: (params: Partial<GeodesicParams>) => void;
  onUpdateLensing: (params: Partial<LensingParams>) => void;
  onUpdateGW: (params: Partial<GravitationalWaveParams>) => void;
  onSpawnParticle: () => void;
  onClearParticles: () => void;
  onResetGW: () => void;
}

export const RelativityControlDeck: React.FC<RelativityControlDeckProps> = ({
  suiteMode,
  colormapMode,
  onSetColormapMode,
  geodesicParams,
  lensingParams,
  gwParams,
  telemetry,
  onUpdateGeodesic,
  onUpdateLensing,
  onUpdateGW,
  onSpawnParticle,
  onClearParticles,
  onResetGW,
}) => {
  return (
    <div className="w-full bg-slate-900 border-t border-slate-800 p-4 text-xs font-mono text-slate-300 select-none">
      {/* 1. GEODESIC ORBITS CONTROLS */}
      {suiteMode === 'GEODESIC_ORBITS' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="text-sky-400 font-semibold uppercase tracking-wider text-[11px]">
              Spacetime Metric
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Metric Geometry</label>
              <select
                value={geodesicParams.metricType}
                onChange={(e) => onUpdateGeodesic({ metricType: e.target.value as MetricType })}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 outline-none focus:border-sky-500"
              >
                <option value="SCHWARZSCHILD">Schwarzschild (Static, a*=0)</option>
                <option value="KERR">Kerr (Rotating, Frame-Dragging)</option>
                <option value="REISSNER_NORDSTROM">Reissner-Nordström (Charged Q)</option>
              </select>
            </div>
            {geodesicParams.metricType === 'KERR' && (
              <div>
                <div className="flex justify-between text-slate-400">
                  <span>Dimensionless Spin a*</span>
                  <span className="text-sky-400">{geodesicParams.spinA.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-0.99"
                  max="0.99"
                  step="0.01"
                  value={geodesicParams.spinA}
                  onChange={(e) => onUpdateGeodesic({ spinA: parseFloat(e.target.value) })}
                  className="w-full accent-sky-500"
                />
              </div>
            )}
            {geodesicParams.metricType === 'REISSNER_NORDSTROM' && (
              <div>
                <div className="flex justify-between text-slate-400">
                  <span>Electric Charge Q/M</span>
                  <span className="text-sky-400">{geodesicParams.chargeQ.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.95"
                  step="0.01"
                  value={geodesicParams.chargeQ}
                  onChange={(e) => onUpdateGeodesic({ chargeQ: parseFloat(e.target.value) })}
                  className="w-full accent-sky-500"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-sky-400 font-semibold uppercase tracking-wider text-[11px]">
              Geodesic Launcher
            </div>
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Launch Radius r₀</span>
                <span className="text-amber-400">{geodesicParams.launchRadius.toFixed(1)} M</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="26.0"
                step="0.5"
                value={geodesicParams.launchRadius}
                onChange={(e) => onUpdateGeodesic({ launchRadius: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Launch Speed v/c</span>
                <span className="text-amber-400">{geodesicParams.launchSpeed.toFixed(2)} c</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.01"
                disabled={geodesicParams.isPhoton}
                value={geodesicParams.launchSpeed}
                onChange={(e) => onUpdateGeodesic({ launchSpeed: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 disabled:opacity-40"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Azimuthal Angle θ₀</span>
                <span className="text-amber-400">{geodesicParams.launchAngleDeg.toFixed(0)}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="2"
                value={geodesicParams.launchAngleDeg}
                onChange={(e) => onUpdateGeodesic({ launchAngleDeg: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sky-400 font-semibold uppercase tracking-wider text-[11px]">
              Particle Species & Actions
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onUpdateGeodesic({ isPhoton: false })}
                className={`flex-1 py-1 px-2 rounded border text-center transition-colors ${
                  !geodesicParams.isPhoton
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Timelike (Massive)
              </button>
              <button
                type="button"
                onClick={() => onUpdateGeodesic({ isPhoton: true })}
                className={`flex-1 py-1 px-2 rounded border text-center transition-colors ${
                  geodesicParams.isPhoton
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Null (Photon)
              </button>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onSpawnParticle}
                className="flex-1 py-1.5 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded font-medium transition-colors"
              >
                Launch Geodesic
              </button>
              <button
                type="button"
                onClick={onClearParticles}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
              >
                Clear Trails
              </button>
            </div>
            <div className="text-[10px] text-slate-500 italic">
              Tip: Drag on canvas to aim & launch with custom velocity vector.
            </div>
          </div>

          <div className="space-y-1 bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px]">
            <div className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider pb-1">
              General Relativistic Radii
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Horizon (r+):</span>
              <span className="text-red-400 font-bold">{telemetry.eventHorizonRadiusRplus.toFixed(2)} M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Photon Sphere (r_ph):</span>
              <span className="text-amber-400">{telemetry.photonSphereRadiusRph.toFixed(2)} M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">ISCO Radius:</span>
              <span className="text-blue-400">{telemetry.iscoRadius.toFixed(2)} M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Redshift z(r_min):</span>
              <span className="text-purple-400">+{telemetry.gravitationalRedshiftZ.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. KERR SHADOW & LENSING CONTROLS */}
      {suiteMode === 'KERR_SHADOW_LENS' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="text-sky-400 font-semibold uppercase tracking-wider text-[11px]">
              Observer Camera
            </div>
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Observer Distance D_obs</span>
                <span className="text-sky-400">{lensingParams.observerDistance.toFixed(1)} M</span>
              </div>
              <input
                type="range"
                min="14.0"
                max="50.0"
                step="1.0"
                value={lensingParams.observerDistance}
                onChange={(e) => onUpdateLensing({ observerDistance: parseFloat(e.target.value) })}
                className="w-full accent-sky-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Inclination Angle i</span>
                <span className="text-sky-400">{lensingParams.inclinationDeg.toFixed(0)}°</span>
              </div>
              <input
                type="range"
                min="5"
                max="88"
                step="1"
                value={lensingParams.inclinationDeg}
                onChange={(e) => onUpdateLensing({ inclinationDeg: parseFloat(e.target.value) })}
                className="w-full accent-sky-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Field of View</span>
                <span className="text-sky-400">{lensingParams.fovDeg.toFixed(0)}°</span>
              </div>
              <input
                type="range"
                min="24"
                max="55"
                step="1"
                value={lensingParams.fovDeg}
                onChange={(e) => onUpdateLensing({ fovDeg: parseFloat(e.target.value) })}
                className="w-full accent-sky-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sky-400 font-semibold uppercase tracking-wider text-[11px]">
              Accretion Disk Geometry
            </div>
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Inner Radius (ISCO)</span>
                <span className="text-amber-400">{lensingParams.diskInnerRadius.toFixed(1)} M</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="6.0"
                step="0.1"
                value={lensingParams.diskInnerRadius}
                onChange={(e) => onUpdateLensing({ diskInnerRadius: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Outer Radius</span>
                <span className="text-amber-400">{lensingParams.diskOuterRadius.toFixed(1)} M</span>
              </div>
              <input
                type="range"
                min="10.0"
                max="28.0"
                step="0.5"
                value={lensingParams.diskOuterRadius}
                onChange={(e) => onUpdateLensing({ diskOuterRadius: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Disk Luminosity</span>
                <span className="text-amber-400">{lensingParams.accretionBrightness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="2.5"
                step="0.05"
                value={lensingParams.accretionBrightness}
                onChange={(e) => onUpdateLensing({ accretionBrightness: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sky-400 font-semibold uppercase tracking-wider text-[11px]">
              Optical & Relativistic Effects
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={lensingParams.secondaryRings}
                onChange={(e) => onUpdateLensing({ secondaryRings: e.target.checked })}
                className="rounded accent-sky-500"
              />
              <span>Secondary Lensed Rings (Bent Light)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={lensingParams.starFieldGrid}
                onChange={(e) => onUpdateLensing({ starFieldGrid: e.target.checked })}
                className="rounded accent-sky-500"
              />
              <span>Background Celestial Star Grid</span>
            </label>
            <div className="pt-1">
              <label className="text-slate-400 block mb-1">Color Palette Mapping</label>
              <select
                value={colormapMode}
                onChange={(e) => onSetColormapMode(e.target.value as ColormapMode)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 outline-none focus:border-sky-500"
              >
                <option value="ACCRETION_FIRE">Accretion Disk Thermal Fire</option>
                <option value="GRAVITATIONAL_REDSHIFT">Gravitational Redshift g(r)</option>
                <option value="CURVATURE_KRETSCHMANN">Kretschmann Curvature K</option>
              </select>
            </div>
          </div>

          <div className="space-y-1 bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px]">
            <div className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider pb-1">
              Ray-Tracing Observables
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kerr Spin a*:</span>
              <span className="text-sky-400 font-bold">{geodesicParams.spinA.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Doppler Boost (δ⁴):</span>
              <span className="text-emerald-400">Approach &gt; Recede</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Gravitational Redshift:</span>
              <span className="text-red-400">√(1 - 2M/r)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Engine Rate:</span>
              <span className="text-slate-300">{telemetry.simFps} FPS</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. GRAVITATIONAL WAVES CONTROLS */}
      {suiteMode === 'GRAVITATIONAL_WAVES' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="text-sky-400 font-semibold uppercase tracking-wider text-[11px]">
              Binary Masses (Solar)
            </div>
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Primary Mass m₁</span>
                <span className="text-sky-400">{gwParams.primaryMassMsun.toFixed(1)} M☉</span>
              </div>
              <input
                type="range"
                min="5.0"
                max="80.0"
                step="1.0"
                value={gwParams.primaryMassMsun}
                onChange={(e) => onUpdateGW({ primaryMassMsun: parseFloat(e.target.value) })}
                className="w-full accent-sky-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Secondary Mass m₂</span>
                <span className="text-amber-400">{gwParams.secondaryMassMsun.toFixed(1)} M☉</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="60.0"
                step="1.0"
                value={gwParams.secondaryMassMsun}
                onChange={(e) => onUpdateGW({ secondaryMassMsun: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Luminosity Distance D_L</span>
                <span className="text-slate-300">{gwParams.luminosityDistanceMpc.toFixed(0)} Mpc</span>
              </div>
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={gwParams.luminosityDistanceMpc}
                onChange={(e) => onUpdateGW({ luminosityDistanceMpc: parseFloat(e.target.value) })}
                className="w-full accent-slate-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sky-400 font-semibold uppercase tracking-wider text-[11px]">
              Aligned Spins
            </div>
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Primary Spin χ₁</span>
                <span className="text-sky-400">{gwParams.dimensionlessSpin1.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-0.9"
                max="0.9"
                step="0.05"
                value={gwParams.dimensionlessSpin1}
                onChange={(e) => onUpdateGW({ dimensionlessSpin1: parseFloat(e.target.value) })}
                className="w-full accent-sky-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Secondary Spin χ₂</span>
                <span className="text-amber-400">{gwParams.dimensionlessSpin2.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-0.9"
                max="0.9"
                step="0.05"
                value={gwParams.dimensionlessSpin2}
                onChange={(e) => onUpdateGW({ dimensionlessSpin2: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
            <button
              type="button"
              onClick={onResetGW}
              className="w-full mt-2 py-1.5 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded font-medium transition-colors"
            >
              Restart Inspiral & Merger
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-sky-400 font-semibold uppercase tracking-wider text-[11px]">
              Waveform Telemetry (3.5PN)
            </div>
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Chirp Mass (Mc):</span>
                <span className="text-emerald-400 font-bold">{telemetry.gwChirpMassMsun.toFixed(1)} M☉</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Frequency:</span>
                <span className="text-sky-400">{telemetry.gwFrequencyHz.toFixed(1)} Hz</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Peak Strain (h₀):</span>
                <span className="text-amber-400">{telemetry.gwStrainPeak.toExponential(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ISCO Plunge:</span>
                <span className="text-purple-400">r ≤ 6.0 M</span>
              </div>
            </div>
          </div>

          <div className="space-y-1 bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px]">
            <div className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider pb-1">
              Astrophysical Context
            </div>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              Models quadrupole energy loss from Einstein&apos;s quadrupole formula:
              <br />
              <code className="text-sky-300">dE/dt = -32/5 · (G/c⁵) · (M_c)¹⁰/³ · ω¹⁰/³</code>
              <br />
              Followed by Kerr quasi-normal mode ringdown (QNM) after horizon merger.
            </p>
          </div>
        </div>
      )}

      {/* 4. SPACETIME EMBEDDING CONTROLS */}
      {suiteMode === 'SPACETIME_EMBEDDING' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="text-sky-400 font-semibold uppercase tracking-wider text-[11px]">
              Curvature Funnel Geometry
            </div>
            <div>
              <div className="flex justify-between text-slate-400">
                <span>Central Mass M</span>
                <span className="text-sky-400">{geodesicParams.massM.toFixed(1)} M☉</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={geodesicParams.massM}
                onChange={(e) => onUpdateGeodesic({ massM: parseFloat(e.target.value) })}
                className="w-full accent-sky-500"
              />
            </div>
            <div className="text-[10px] text-slate-500">
              Drag on the canvas to rotate the 3D isometric perspective.
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sky-400 font-semibold uppercase tracking-wider text-[11px]">
              Particle in Funnel
            </div>
            <button
              type="button"
              onClick={onSpawnParticle}
              className="w-full py-1.5 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded font-medium transition-colors"
            >
              Drop Test Particle
            </button>
            <button
              type="button"
              onClick={onClearParticles}
              className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
            >
              Clear Particles
            </button>
          </div>

          <div className="space-y-1 bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px]">
            <div className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider pb-1">
              Flamm&apos;s Paraboloid
            </div>
            <div className="text-[10px] text-slate-400 leading-relaxed">
              Isometric embedding of Schwarzschild equatorial slice:
              <br />
              <code className="text-indigo-400">z(r) = 2√(2M(r - 2M))</code>
              <br />
              At the event horizon r = 2M, the slope dz/dr → ∞ (throat).
            </div>
          </div>

          <div className="space-y-1 bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px]">
            <div className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider pb-1">
              Kretschmann Curvature
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Formula:</span>
              <span className="text-amber-400">48 M² / r⁶</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">At Horizon (r=2M):</span>
              <span className="text-red-400 font-bold">0.75 M⁻⁴</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">At Singularity (r→0):</span>
              <span className="text-red-500 font-bold">∞ (Infinite)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
