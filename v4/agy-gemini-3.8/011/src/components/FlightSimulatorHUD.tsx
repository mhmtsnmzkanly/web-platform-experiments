import React from 'react';
import { GliderState } from '../types';
import { Plane, AlertOctagon, Zap } from 'lucide-react';

interface FlightSimulatorHUDProps {
  gliderState: GliderState;
  onPitchUp: () => void;
  onPitchDown: () => void;
  onExitFlightMode: () => void;
}

export const FlightSimulatorHUD: React.FC<FlightSimulatorHUDProps> = ({
  gliderState,
  onPitchUp,
  onPitchDown,
  onExitFlightMode,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-10 font-mono select-none">
      {/* Top Telemetry Tape */}
      <div className="flex items-center justify-between text-xs text-emerald-400">
        <div className="flex items-center space-x-2 bg-slate-950/80 backdrop-blur border border-emerald-500/50 rounded px-3 py-1.5 shadow">
          <Plane className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">GLIDER FLIGHT DYNAMICS TEST</span>
        </div>

        {/* Flight Instruments */}
        <div className="flex items-center space-x-4 bg-slate-950/80 backdrop-blur border border-emerald-500/50 rounded px-4 py-1.5 shadow">
          <div>
            <span className="text-slate-500 text-[10px] block">AIRSPEED:</span>
            <span className="text-emerald-300 font-bold text-sm">
              {gliderState.airspeed.toFixed(1)} kts
            </span>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block">ALTITUDE:</span>
            <span className="text-cyan-300 font-bold text-sm">
              {Math.round(gliderState.altitude)} ft
            </span>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block">PITCH (α):</span>
            <span className="text-white font-bold text-sm">
              {gliderState.pitchDeg > 0 ? `+${gliderState.pitchDeg}°` : `${gliderState.pitchDeg}°`}
            </span>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block">L/D RATIO:</span>
            <span className="text-amber-300 font-bold text-sm">
              {Math.max(-50, Math.min(50, gliderState.cl / Math.max(0.01, gliderState.cd))).toFixed(1)}
            </span>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block">SCORE:</span>
            <span className="text-purple-300 font-bold text-sm">
              {Math.round(gliderState.score)}
            </span>
          </div>
        </div>

        {/* Exit Button */}
        <button
          onClick={onExitFlightMode}
          className="pointer-events-auto px-3 py-1 bg-red-900/80 hover:bg-red-800 text-white rounded border border-red-500 font-bold transition-colors cursor-pointer text-xs"
        >
          EXIT FLIGHT MODE
        </button>
      </div>

      {/* Center Stall Alert Banner */}
      {gliderState.stalled && (
        <div className="self-center flex items-center space-x-2 bg-red-950/90 border-2 border-red-500 text-red-200 px-6 py-2 rounded-lg text-sm font-bold animate-bounce shadow-2xl">
          <AlertOctagon className="w-5 h-5 text-red-400" />
          <span>AERODYNAMIC STALL! NOSE DOWN IMMEDIATELY TO RECOVER AIRSPEED</span>
        </div>
      )}

      {/* Bottom Controls Legend & Touch Controls */}
      <div className="flex items-center justify-between">
        <div className="bg-slate-950/80 backdrop-blur border border-slate-800 rounded px-3 py-1.5 text-[11px] text-slate-400">
          <span className="text-emerald-400 font-bold">CONTROLS:</span> Use [W] / [↑] Pitch Down (Dive), [S] / [↓] Pitch Up (Climb), or on-screen buttons.
        </div>

        {/* On-screen touch controls */}
        <div className="pointer-events-auto flex items-center space-x-2">
          <button
            onClick={onPitchDown}
            className="px-4 py-2 bg-slate-900/90 hover:bg-slate-800 active:bg-cyan-700 text-cyan-300 rounded border border-slate-700 font-bold text-xs cursor-pointer shadow"
          >
            PITCH DOWN (DIVE)
          </button>
          <button
            onClick={onPitchUp}
            className="px-4 py-2 bg-slate-900/90 hover:bg-slate-800 active:bg-cyan-700 text-cyan-300 rounded border border-slate-700 font-bold text-xs cursor-pointer shadow"
          >
            PITCH UP (CLIMB)
          </button>
        </div>
      </div>
    </div>
  );
};
