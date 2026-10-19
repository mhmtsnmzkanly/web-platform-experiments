import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Radio,
  TrendingUp,
  Waves,
  Zap,
  Activity,
  Layers,
  Clock,
  Compass,
} from 'lucide-react';
import {
  SeismicSuiteMode,
  FaultConfig,
  SeismographStation,
  SeismicMetrics,
  TravelTimeCurvePoint,
} from '../types';

interface SeismographDeckProps {
  suiteMode: SeismicSuiteMode;
  fault: FaultConfig;
  onUpdateFault: (updater: (prev: FaultConfig) => FaultConfig) => void;
  stations: SeismographStation[];
  metrics: SeismicMetrics;
  travelTimeCurves: TravelTimeCurvePoint[];
  tsunamiSurface: Float32Array;
  tsunamiBathymetry: Float32Array;
  oceanBathymetryKm: number;
}

export const SeismographDeck: React.FC<SeismographDeckProps> = ({
  suiteMode,
  fault,
  onUpdateFault,
  stations,
  metrics,
  travelTimeCurves,
  tsunamiSurface,
  tsunamiBathymetry,
  oceanBathymetryKm,
}) => {
  const [activeTab, setActiveTab] = useState<'CONTROLS' | 'SEISMOGRAMS' | 'TRAVEL_TIME' | 'TSUNAMI' | 'GEOLOGY'>('CONTROLS');
  const [selectedStationIndex, setSelectedStationIndex] = useState<number>(0);

  // Synchronize top header suiteMode with lower deck tabs
  useEffect(() => {
    if (suiteMode === 'SEISMOGRAMS') setActiveTab('SEISMOGRAMS');
    else if (suiteMode === 'TSUNAMI' && oceanBathymetryKm > 0) setActiveTab('TSUNAMI');
    else if (suiteMode === 'GEOLOGY') setActiveTab('GEOLOGY');
    else if (suiteMode === 'ELASTODYNAMICS') setActiveTab('CONTROLS');
  }, [suiteMode, oceanBathymetryKm]);

  const selectedStation = stations[selectedStationIndex] || stations[0];

  return (
    <div className="w-full flex flex-col bg-slate-950/95 backdrop-blur border-t border-slate-800 text-xs select-none">
      {/* Sub-Header Tabs */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 bg-slate-900/40">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('CONTROLS')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'CONTROLS'
                ? 'bg-slate-800 text-orange-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>FAULT & RUPTURE CONTROLS</span>
          </button>

          <button
            onClick={() => setActiveTab('SEISMOGRAMS')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'SEISMOGRAMS'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>SEISMOGRAM TELEMETRY (4 STATIONS)</span>
          </button>

          <button
            onClick={() => setActiveTab('TRAVEL_TIME')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'TRAVEL_TIME'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>P / S TRAVEL-TIME CURVES</span>
          </button>

          <button
            onClick={() => setActiveTab('GEOLOGY')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
              activeTab === 'GEOLOGY'
                ? 'bg-slate-800 text-amber-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>STRATA PARAMETERS</span>
          </button>

          {oceanBathymetryKm > 0 && (
            <button
              onClick={() => setActiveTab('TSUNAMI')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                activeTab === 'TSUNAMI'
                  ? 'bg-slate-800 text-blue-400 border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>TSUNAMI BATHYMETRY & RUN-UP</span>
            </button>
          )}
        </div>

        {/* Magnitude Quick Readout */}
        <div className="hidden sm:flex items-center space-x-3 font-mono text-[11px] text-slate-300">
          <span>MOMENT MAGNITUDE:</span>
          <span className="font-bold text-orange-400 text-sm">Mw {fault.momentMagnitudeMw.toFixed(1)}</span>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-3 max-h-56 overflow-y-auto">
        {/* 1. FAULT CONTROLS TAB */}
        {activeTab === 'CONTROLS' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Mechanism Selection */}
            <div className="space-y-1">
              <label className="text-slate-400 font-mono text-[11px] block">FAULT MECHANISM:</label>
              <div className="grid grid-cols-3 gap-1">
                {(['THRUST_SUBDUCTION', 'STRIKE_SLIP', 'NORMAL'] as const).map((mech) => (
                  <button
                    key={mech}
                    onClick={() =>
                      onUpdateFault((prev) => ({
                        ...prev,
                        mechanism: mech,
                        dipAngleDeg: mech === 'THRUST_SUBDUCTION' ? 15 : mech === 'STRIKE_SLIP' ? 90 : 60,
                      }))
                    }
                    className={`py-1.5 rounded text-[9px] font-bold cursor-pointer transition-colors ${
                      fault.mechanism === mech
                        ? 'bg-orange-600 text-white shadow'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mech === 'THRUST_SUBDUCTION' ? 'THRUST' : mech === 'STRIKE_SLIP' ? 'STRIKE' : 'NORMAL'}
                  </button>
                ))}
              </div>
            </div>

            {/* Moment Magnitude Mw */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                <span>MAGNITUDE (Mw):</span>
                <span className="text-rose-400 font-bold">Mw {fault.momentMagnitudeMw.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={5.5}
                max={9.2}
                step={0.1}
                value={fault.momentMagnitudeMw}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onUpdateFault((prev) => ({ ...prev, momentMagnitudeMw: val }));
                }}
                className="w-full cursor-pointer"
              />
            </div>

            {/* Hypocenter Focal Depth */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                <span>FOCAL DEPTH (z):</span>
                <span className="text-cyan-400 font-bold">{fault.hypocenterDepthKm} km</span>
              </div>
              <input
                type="range"
                min={3}
                max={85}
                step={1}
                value={fault.hypocenterDepthKm}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onUpdateFault((prev) => ({ ...prev, hypocenterDepthKm: val }));
                }}
                className="w-full cursor-pointer"
              />
            </div>

            {/* Fault Dip Angle */}
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                <span>DIP ANGLE (θ):</span>
                <span className="text-amber-400 font-bold">{fault.dipAngleDeg}°</span>
              </div>
              <input
                type="range"
                min={10}
                max={90}
                step={2}
                value={fault.dipAngleDeg}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onUpdateFault((prev) => ({ ...prev, dipAngleDeg: val }));
                }}
                className="w-full cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* 2. SEISMOGRAMS TAB */}
        {activeTab === 'SEISMOGRAMS' && (
          <div className="space-y-2">
            {/* Station Selector Bar */}
            <div className="flex items-center space-x-2">
              {stations.map((st, i) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStationIndex(i)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                    selectedStationIndex === i
                      ? 'bg-cyan-700 text-white font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{st.name.split(' ')[0]} {st.name.split(' ')[1]}</span>
                  <span className="text-[10px] text-slate-300">({st.distanceKm.toFixed(0)} km)</span>
                </button>
              ))}
            </div>

            {/* Live Seismogram SVG Oscillogram */}
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 w-full h-32 relative">
                {(() => {
                  const displayGain = Math.max(0.2, 30.0 / Math.max(15.0, selectedStation.pgvCmS));
                  return (
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                      {/* Center zero line */}
                      <line x1="0" y1="40" x2="300" y2="40" stroke="#334155" strokeWidth="1" />

                      {/* Horizontal Component Vx (Orange) */}
                      <polyline
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="1.2"
                        points={selectedStation.historyVx
                          .map((vx, i) => {
                            const sx = (i / Math.max(1, selectedStation.historyVx.length - 1)) * 300;
                            const sy = 40 - Math.max(-35, Math.min(35, vx * displayGain));
                            return `${sx},${sy}`;
                          })
                          .join(' ')}
                      />

                      {/* Vertical Component Vz (Cyan) */}
                      <polyline
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        points={selectedStation.historyVz
                          .map((vz, i) => {
                            const sx = (i / Math.max(1, selectedStation.historyVz.length - 1)) * 300;
                            const sy = 40 - Math.max(-35, Math.min(35, vz * displayGain));
                            return `${sx},${sy}`;
                          })
                          .join(' ')}
                      />
                    </svg>
                  );
                })()}

                <div className="absolute top-1 left-2 flex items-center space-x-3 text-[10px] font-mono">
                  <span className="text-cyan-400">― Vz (Vertical P/Rayleigh)</span>
                  <span className="text-orange-400">― Vx (Horizontal Shear S)</span>
                </div>
              </div>

              {/* Station Phase Telemetry */}
              <div className="w-full md:w-64 font-mono text-[11px] space-y-1 text-slate-400 bg-slate-950 p-2 rounded border border-slate-800">
                <span className="font-bold text-cyan-400">{selectedStation.name}</span>
                <div className="flex justify-between">
                  <span>Epicentral Dist:</span>
                  <span className="text-white font-bold">{selectedStation.distanceKm.toFixed(1)} km</span>
                </div>
                <div className="flex justify-between">
                  <span>P-Wave Arrival:</span>
                  <span className="text-cyan-300 font-bold">
                    {selectedStation.pArrivalSec !== null ? `${selectedStation.pArrivalSec.toFixed(2)}s` : 'Waiting...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>S-Wave Arrival:</span>
                  <span className="text-orange-300 font-bold">
                    {selectedStation.sArrivalSec !== null ? `${selectedStation.sArrivalSec.toFixed(2)}s` : 'Waiting...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>PGA / PGV:</span>
                  <span className="text-rose-400 font-bold">
                    {selectedStation.pgaG.toFixed(3)}g / {selectedStation.pgvCmS.toFixed(1)} cm/s
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. TRAVEL TIME CURVES TAB */}
        {activeTab === 'TRAVEL_TIME' && (
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full h-32 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                <line x1="0" y1="75" x2="300" y2="75" stroke="#475569" strokeWidth="1" />
                <line x1="0" y1="5" x2="0" y2="75" stroke="#475569" strokeWidth="1" />

                <text x="5" y="12" fill="#64748b" fontSize="8" fontFamily="monospace">Travel Time (s)</text>
                <text x="240" y="72" fill="#64748b" fontSize="8" fontFamily="monospace">Distance (km)</text>

                {/* P-wave travel time curve (Cyan) */}
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  points={travelTimeCurves
                    .map((pt) => {
                      const sx = (pt.distanceKm / 240) * 300;
                      const sy = 75 - Math.min(70, pt.pTimeSec * 1.6);
                      return `${sx},${sy}`;
                    })
                    .join(' ')}
                />

                {/* S-wave travel time curve (Orange) */}
                <polyline
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  points={travelTimeCurves
                    .map((pt) => {
                      const sx = (pt.distanceKm / 240) * 300;
                      const sy = 75 - Math.min(70, pt.sTimeSec * 1.6);
                      return `${sx},${sy}`;
                    })
                    .join(' ')}
                />

                {/* Rayleigh surface wave curve (Purple) */}
                <polyline
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                  points={travelTimeCurves
                    .map((pt) => {
                      const sx = (pt.distanceKm / 240) * 300;
                      const sy = 75 - Math.min(70, pt.rayleighTimeSec * 1.6);
                      return `${sx},${sy}`;
                    })
                    .join(' ')}
                />

                {/* Plot actual station picks */}
                {stations.map((st, i) => {
                  const sx = (st.distanceKm / 240) * 300;
                  return (
                    <g key={i}>
                      {st.pArrivalSec !== null && (
                        <circle cx={sx} cy={75 - Math.min(70, st.pArrivalSec * 1.6)} r="3" fill="#38bdf8" />
                      )}
                      {st.sArrivalSec !== null && (
                        <circle cx={sx} cy={75 - Math.min(70, st.sArrivalSec * 1.6)} r="3" fill="#f97316" />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="w-full md:w-64 font-mono text-[11px] space-y-1 text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="font-bold text-emerald-400">TRAVEL-TIME DISPERSION:</span>
              <div className="flex justify-between">
                <span className="text-cyan-400">― P-Wave Speed:</span>
                <span className="text-white font-bold">5.8 km/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-400">― S-Wave Speed:</span>
                <span className="text-white font-bold">3.3 km/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">- - Rayleigh Speed:</span>
                <span className="text-white font-bold">3.0 km/s</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                <span>Vp / Vs Ratio:</span>
                <span className="text-slate-300 font-bold">1.76 (Poisson Solid)</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. TSUNAMI TAB */}
        {activeTab === 'TSUNAMI' && oceanBathymetryKm > 0 && (
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full h-32 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                {/* Sea level line */}
                <line x1="0" y1="25" x2="300" y2="25" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />

                {/* Bathymetry floor (Brown / Dark Slate) */}
                <polyline
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2"
                  points={Array.from(tsunamiBathymetry)
                    .map((h, i) => {
                      const sx = (i / (tsunamiBathymetry.length - 1)) * 300;
                      const sy = 25 + Math.min(50, (h / 4500) * 50);
                      return `${sx},${sy}`;
                    })
                    .join(' ')}
                />

                {/* Sea surface wave elevation eta(x) */}
                <polyline
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  points={Array.from(tsunamiSurface)
                    .map((eta, i) => {
                      const sx = (i / (tsunamiSurface.length - 1)) * 300;
                      const sy = 25 - Math.max(-20, Math.min(20, eta * 3.5));
                      return `${sx},${sy}`;
                    })
                    .join(' ')}
                />
              </svg>
            </div>

            <div className="w-full md:w-64 font-mono text-[11px] space-y-1 text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="font-bold text-cyan-400">TSUNAMI HYDRODYNAMICS:</span>
              <div className="flex justify-between">
                <span>Ocean Wave Height:</span>
                <span className="text-cyan-300 font-bold">{metrics.tsunamiWaveHeightM.toFixed(1)} m</span>
              </div>
              <div className="flex justify-between">
                <span>Propagation Speed:</span>
                <span className="text-white font-bold">{metrics.tsunamiSpeedKmh.toFixed(0)} km/h</span>
              </div>
              <div className="flex justify-between">
                <span>Coastal Shoaling:</span>
                <span className="text-amber-400 font-bold">Green's Law Amplification</span>
              </div>
            </div>
          </div>
        )}

        {/* 5. GEOLOGY & STRATA TAB */}
        {activeTab === 'GEOLOGY' && (
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-1 px-2">Strata Layer</th>
                    <th className="py-1 px-2">Depth (km)</th>
                    <th className="py-1 px-2">Vp (km/s)</th>
                    <th className="py-1 px-2">Vs (km/s)</th>
                    <th className="py-1 px-2">Density (kg/m³)</th>
                    <th className="py-1 px-2">Poisson Ratio (ν)</th>
                    <th className="py-1 px-2">Shear Modulus (GPa)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-1.5 px-2 font-semibold text-amber-300">Sedimentary Basin</td>
                    <td className="py-1.5 px-2">0.0 – 4.0</td>
                    <td className="py-1.5 px-2 text-cyan-300 font-bold">3.2</td>
                    <td className="py-1.5 px-2 text-orange-300 font-bold">1.8</td>
                    <td className="py-1.5 px-2">2,200</td>
                    <td className="py-1.5 px-2 text-purple-300">0.27</td>
                    <td className="py-1.5 px-2">7.1</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-1.5 px-2 font-semibold text-amber-200">Upper Crust (Granitic)</td>
                    <td className="py-1.5 px-2">4.0 – 20.0</td>
                    <td className="py-1.5 px-2 text-cyan-300 font-bold">5.8</td>
                    <td className="py-1.5 px-2 text-orange-300 font-bold">3.3</td>
                    <td className="py-1.5 px-2">2,670</td>
                    <td className="py-1.5 px-2 text-purple-300">0.26</td>
                    <td className="py-1.5 px-2">29.1</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-1.5 px-2 font-semibold text-amber-100">Lower Crust (Basaltic)</td>
                    <td className="py-1.5 px-2">20.0 – 35.0</td>
                    <td className="py-1.5 px-2 text-cyan-300 font-bold">6.6</td>
                    <td className="py-1.5 px-2 text-orange-300 font-bold">3.8</td>
                    <td className="py-1.5 px-2">2,900</td>
                    <td className="py-1.5 px-2 text-purple-300">0.25</td>
                    <td className="py-1.5 px-2">41.9</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 bg-slate-800/20">
                    <td className="py-1.5 px-2 font-semibold text-rose-300">Upper Mantle (Peridotite)</td>
                    <td className="py-1.5 px-2">&gt; 35.0 (Moho)</td>
                    <td className="py-1.5 px-2 text-cyan-300 font-bold">8.1</td>
                    <td className="py-1.5 px-2 text-orange-300 font-bold">4.6</td>
                    <td className="py-1.5 px-2">3,300</td>
                    <td className="py-1.5 px-2 text-purple-300">0.26</td>
                    <td className="py-1.5 px-2">69.8</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="w-full md:w-64 font-mono text-[11px] space-y-1 text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 shrink-0">
              <span className="font-bold text-amber-400">ELASTIC CONTINUUM:</span>
              <div className="flex justify-between">
                <span>Moho Depth:</span>
                <span className="text-white font-bold">35.0 km</span>
              </div>
              <div className="flex justify-between">
                <span>Vp / Vs Ratio:</span>
                <span className="text-cyan-300 font-bold">1.73 – 1.78</span>
              </div>
              <div className="flex justify-between">
                <span>Lamé First (λ):</span>
                <span className="text-purple-300 font-bold">λ = ρ(Vp² - 2Vs²)</span>
              </div>
              <div className="flex justify-between">
                <span>Shear Modulus (μ):</span>
                <span className="text-orange-300 font-bold">μ = ρ · Vs²</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
