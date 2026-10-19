import React, { useState } from 'react';
import {
  AirfoilProfile,
  AeroMetrics,
  ChordPressurePoint,
  PolarPoint,
} from '../types';
import {
  Sliders,
  TrendingUp,
  BarChart2,
  Paintbrush,
  Eraser,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

interface AerodynamicsDeckProps {
  currentProfile: AirfoilProfile;
  metrics: AeroMetrics;
  angleDeg: number;
  onSetAngleDeg: (a: number) => void;
  inletVelocity: number;
  onSetInletVelocity: (v: number) => void;
  viscosity: number;
  onSetViscosity: (nu: number) => void;
  onUpdateProfileParams: (camber: number, pos: number, thick: number) => void;
  chordPressure: ChordPressurePoint[];
  polarHistory: PolarPoint[];
  brushMode: 'NONE' | 'DRAW' | 'ERASE';
  onSetBrushMode: (mode: 'NONE' | 'DRAW' | 'ERASE') => void;
  brushRadius: number;
  onSetBrushRadius: (r: number) => void;
  onClearObstacles: () => void;
}

export const AerodynamicsDeck: React.FC<AerodynamicsDeckProps> = ({
  currentProfile,
  metrics,
  angleDeg,
  onSetAngleDeg,
  inletVelocity,
  onSetInletVelocity,
  viscosity,
  onSetViscosity,
  onUpdateProfileParams,
  chordPressure,
  polarHistory,
  brushMode,
  onSetBrushMode,
  brushRadius,
  onSetBrushRadius,
  onClearObstacles,
}) => {
  const [activeTab, setActiveTab] = useState<'CONTROLS' | 'PRESSURE_PLOT' | 'POLAR_PLOT'>('CONTROLS');
  const [polarViewMode, setPolarViewMode] = useState<'CL_ALPHA' | 'DRAG_POLAR'>('CL_ALPHA');

  return (
    <div className="w-full flex flex-col bg-slate-950/90 backdrop-blur border-t border-slate-800 text-xs select-none">
      {/* Sub-Header Tabs */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 bg-slate-900/40">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('CONTROLS')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors ${
              activeTab === 'CONTROLS'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>FLOW & AIRFOIL CONTROLS</span>
          </button>

          <button
            onClick={() => setActiveTab('PRESSURE_PLOT')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors ${
              activeTab === 'PRESSURE_PLOT'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>CHORD C_p DISTRIBUTION</span>
          </button>

          <button
            onClick={() => setActiveTab('POLAR_PLOT')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded font-semibold transition-colors ${
              activeTab === 'POLAR_PLOT'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>LIFT-DRAG POLAR CURVES</span>
          </button>
        </div>

        {/* Current Airfoil Description */}
        <div className="hidden md:flex items-center space-x-2 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-cyan-300">{currentProfile.name}:</span>
          <span className="text-slate-400 truncate max-w-xs">{currentProfile.description}</span>
        </div>
      </div>

      {/* Main Deck Tab Views */}
      <div className="p-3">
        {activeTab === 'CONTROLS' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 1. Angle of Attack & Flight Attitude */}
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span>ANGLE OF ATTACK (α)</span>
                <span className="font-mono text-cyan-400">{angleDeg > 0 ? `+${angleDeg}°` : `${angleDeg}°`}</span>
              </div>
              <input
                type="range"
                min="-25"
                max="25"
                step="1"
                value={angleDeg}
                onChange={(e) => onSetAngleDeg(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-700 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-25° (Nose Down)</span>
                <span>0°</span>
                <span>+25° (High Alpha)</span>
              </div>
            </div>

            {/* 2. Tunnel Airspeed & Viscosity */}
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span>INLET AIRSPEED (U_∞)</span>
                <span className="font-mono text-cyan-400">{(inletVelocity * 100).toFixed(1)} u/s</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.16"
                step="0.01"
                value={inletVelocity}
                onChange={(e) => onSetInletVelocity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded cursor-pointer"
              />
              <div className="flex items-center justify-between text-slate-300 font-bold pt-1">
                <span>VISCOSITY (ν)</span>
                <span className="font-mono text-cyan-400">{viscosity.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.005"
                max="0.05"
                step="0.005"
                value={viscosity}
                onChange={(e) => onSetViscosity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded cursor-pointer"
              />
            </div>

            {/* 3. Parametric Airfoil Geometry (NACA) */}
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span>NACA GEOMETRY</span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  {Math.round(currentProfile.camber * 100)}
                  {Math.round(currentProfile.camberPos * 10)}
                  {Math.round(currentProfile.thickness * 100).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Camber */}
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Camber m:</span>
                <span className="font-mono text-slate-200">{(currentProfile.camber * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.08"
                step="0.01"
                value={currentProfile.camber}
                onChange={(e) =>
                  onUpdateProfileParams(parseFloat(e.target.value), currentProfile.camberPos, currentProfile.thickness)
                }
                className="w-full h-1 bg-slate-700 rounded cursor-pointer"
              />

              {/* Thickness */}
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Thickness t:</span>
                <span className="font-mono text-slate-200">{(currentProfile.thickness * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.04"
                max="0.25"
                step="0.01"
                value={currentProfile.thickness}
                onChange={(e) =>
                  onUpdateProfileParams(currentProfile.camber, currentProfile.camberPos, parseFloat(e.target.value))
                }
                className="w-full h-1 bg-slate-700 rounded cursor-pointer"
              />
            </div>

            {/* 4. Brush Tools & Canvas Actions */}
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-2">
              <span className="text-slate-300 font-bold block">OBSTACLE BRUSH TOOLS</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSetBrushMode(brushMode === 'DRAW' ? 'NONE' : 'DRAW')}
                  className={`flex-1 flex items-center justify-center space-x-1 py-1 rounded font-bold transition-colors border ${
                    brushMode === 'DRAW'
                      ? 'bg-cyan-600 border-cyan-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <Paintbrush className="w-3.5 h-3.5" />
                  <span>PAINT</span>
                </button>

                <button
                  onClick={() => onSetBrushMode(brushMode === 'ERASE' ? 'NONE' : 'ERASE')}
                  className={`flex-1 flex items-center justify-center space-x-1 py-1 rounded font-bold transition-colors border ${
                    brushMode === 'ERASE'
                      ? 'bg-rose-600 border-rose-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>ERASE</span>
                </button>

                <button
                  onClick={onClearObstacles}
                  title="Clear Custom Obstacles"
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Radius: {brushRadius}px</span>
                <input
                  type="range"
                  min="2"
                  max="12"
                  value={brushRadius}
                  onChange={(e) => onSetBrushRadius(parseInt(e.target.value, 10))}
                  className="w-24 h-1 bg-slate-700 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* PRESSURE COEFFICIENT PLOT Cp(x) */}
        {activeTab === 'PRESSURE_PLOT' && (
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full h-32 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                {/* Zero line */}
                <line x1="0" y1="50" x2="300" y2="50" stroke="#475569" strokeDasharray="2,2" strokeWidth="1" />

                {/* Upper Surface Cp line (inverted in aero convention: negative suction upwards) */}
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  points={chordPressure
                    .map((pt) => {
                      const sx = pt.xNorm * 300;
                      // Cp ranges typically -3.0 to +1.0
                      const sy = 50 - pt.cpUpper * 25;
                      return `${sx},${Math.max(5, Math.min(95, sy))}`;
                    })
                    .join(' ')}
                />

                {/* Lower Surface Cp line */}
                <polyline
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2"
                  points={chordPressure
                    .map((pt) => {
                      const sx = pt.xNorm * 300;
                      const sy = 50 - pt.cpLower * 25;
                      return `${sx},${Math.max(5, Math.min(95, sy))}`;
                    })
                    .join(' ')}
                />
              </svg>
            </div>

            <div className="w-full md:w-64 font-mono text-[11px] space-y-1 text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                <span>Upper Surface (Suction)</span>
              </div>
              <div className="flex items-center space-x-2 text-rose-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                <span>Lower Surface (Pressure)</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-1">
                Area between curves represents non-dimensional net sectional lift coefficient C_L.
              </p>
            </div>
          </div>
        )}

        {/* POLAR CURVE PLOT (CL vs Alpha & CL vs CD) */}
        {activeTab === 'POLAR_PLOT' && (
          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full h-36 relative flex flex-col">
              <div className="flex items-center justify-between mb-1 text-[11px] font-mono">
                <span className="text-cyan-400 font-bold">
                  {polarViewMode === 'CL_ALPHA'
                    ? 'LIFT CURVE SLOPE: C_L vs Angle of Attack (α)'
                    : 'LILIENTHAL DRAG POLAR: C_L vs C_D (Induced Drag Bucket)'}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setPolarViewMode('CL_ALPHA')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      polarViewMode === 'CL_ALPHA'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    C_L vs α
                  </button>
                  <button
                    onClick={() => setPolarViewMode('DRAG_POLAR')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      polarViewMode === 'DRAG_POLAR'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    C_L vs C_D
                  </button>
                </div>
              </div>

              <div className="flex-1 relative w-full h-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 90" preserveAspectRatio="none">
                  {polarViewMode === 'CL_ALPHA' ? (
                    <>
                      {/* Axis lines for CL vs Alpha */}
                      <line x1="150" y1="0" x2="150" y2="90" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />
                      <line x1="0" y1="45" x2="300" y2="45" stroke="#475569" strokeWidth="1" />

                      {/* Axis labels */}
                      <text x="5" y="40" fill="#64748b" fontSize="8" fontFamily="monospace">-25°</text>
                      <text x="153" y="10" fill="#64748b" fontSize="8" fontFamily="monospace">+CL</text>
                      <text x="153" y="85" fill="#64748b" fontSize="8" fontFamily="monospace">-CL</text>
                      <text x="275" y="40" fill="#64748b" fontSize="8" fontFamily="monospace">+25°</text>

                      {/* Polar history dots */}
                      {polarHistory.map((pt, idx) => {
                        const sx = 150 + (pt.alphaDeg / 25) * 140;
                        const sy = 45 - pt.cl * 28;
                        return (
                          <circle
                            key={idx}
                            cx={sx}
                            cy={Math.max(5, Math.min(85, sy))}
                            r="2.5"
                            fill="#38bdf8"
                            opacity={0.7}
                          />
                        );
                      })}

                      {/* Current operating point */}
                      <circle
                        cx={150 + (metrics.angleDeg / 25) * 140}
                        cy={Math.max(5, Math.min(85, 45 - metrics.liftCoeff * 28))}
                        r="5"
                        fill="#f43f5e"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    </>
                  ) : (
                    <>
                      {/* Axis lines for Drag Polar CL vs CD */}
                      <line x1="30" y1="0" x2="30" y2="90" stroke="#475569" strokeWidth="1" />
                      <line x1="30" y1="45" x2="300" y2="45" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />

                      {/* Axis labels */}
                      <text x="35" y="10" fill="#64748b" fontSize="8" fontFamily="monospace">+CL</text>
                      <text x="35" y="85" fill="#64748b" fontSize="8" fontFamily="monospace">-CL</text>
                      <text x="270" y="40" fill="#64748b" fontSize="8" fontFamily="monospace">CD →</text>

                      {/* Theoretical Drag Bucket Parabola Guide */}
                      <path
                        d="M 35 45 Q 70 45 140 10"
                        fill="none"
                        stroke="rgba(100, 116, 139, 0.4)"
                        strokeWidth="1"
                        strokeDasharray="3,3"
                      />

                      {/* Polar history points */}
                      {polarHistory.map((pt, idx) => {
                        const sx = 30 + Math.min(260, pt.cd * 600);
                        const sy = 45 - pt.cl * 28;
                        return (
                          <circle
                            key={idx}
                            cx={sx}
                            cy={Math.max(5, Math.min(85, sy))}
                            r="2.5"
                            fill="#38bdf8"
                            opacity={0.75}
                          />
                        );
                      })}

                      {/* Current operating point */}
                      <circle
                        cx={30 + Math.min(260, metrics.dragCoeff * 600)}
                        cy={Math.max(5, Math.min(85, 45 - metrics.liftCoeff * 28))}
                        r="5"
                        fill="#f43f5e"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    </>
                  )}
                </svg>
              </div>
            </div>

            <div className="w-full md:w-64 font-mono text-[11px] space-y-1 text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="font-bold text-cyan-400">OPERATING POINT:</span>
              <div className="flex justify-between">
                <span>Alpha (α):</span>
                <span className="text-white font-bold">{metrics.angleDeg}°</span>
              </div>
              <div className="flex justify-between">
                <span>C_L (Lift):</span>
                <span className="text-emerald-400 font-bold">{metrics.liftCoeff.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>C_D (Drag):</span>
                <span className="text-amber-400 font-bold">{metrics.dragCoeff.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>L/D Ratio:</span>
                <span className="text-cyan-300 font-bold">{metrics.liftToDragRatio.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                <span>Max L/D Pitch:</span>
                <span className="text-slate-300">~ 4° to 6° cruise</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
