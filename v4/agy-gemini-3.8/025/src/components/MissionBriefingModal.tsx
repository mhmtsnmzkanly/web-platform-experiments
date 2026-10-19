/**
 * ORBITAL-SLINGSHOT (EXP-025) — Mission Briefing Modal
 * Detailed flight objectives, governing equations, and astrodynamic guidance.
 */

import React from 'react';
import { OrbitalSimulationController } from '../core/OrbitalSimulationController';

interface MissionBriefingModalProps {
  controller: OrbitalSimulationController;
  isOpen: boolean;
  onClose: () => void;
}

export const MissionBriefingModal: React.FC<MissionBriefingModalProps> = ({
  controller,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  const scen = controller.currentScenario;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
              Flight Director Briefing
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">{scen.title}</h2>
            <p className="text-xs text-slate-400">{scen.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-slate-300 text-xs leading-relaxed">
          {/* Mission Objective Callout */}
          <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-xl">
            <span className="text-[10px] font-mono font-bold uppercase text-cyan-300 tracking-wider block mb-1">
              Primary Flight Objective
            </span>
            <p className="text-sm font-semibold text-cyan-100">{scen.objective}</p>
          </div>

          {/* Narrative Briefing */}
          <div>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono mb-1.5">
              Flight Plan Overview
            </h3>
            <p>{scen.briefing}</p>
          </div>

          {/* Astrodynamic Physics Principles */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
              Governing Astrodynamics Equations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-amber-300 font-bold block mb-1">Vis-Viva Orbital Energy</span>
                <p className="text-slate-400">v² = μ(2/r - 1/a)</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Speed v relates orbital distance r to semi-major axis a.
                </p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-emerald-300 font-bold block mb-1">Kepler's Third Law</span>
                <p className="text-slate-400">T = 2π √(a³ / μ)</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Orbital period scales with the 3/2 power of semi-major axis.
                </p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-purple-300 font-bold block mb-1">Hohmann Transfer Δv₁</span>
                <p className="text-slate-400">Δv₁ = √(μ/r₁) [√(2r₂/(r₁+r₂)) - 1]</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Minimum-energy impulse connecting two circular orbits.
                </p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-cyan-300 font-bold block mb-1">Gravity Assist Deflection</span>
                <p className="text-slate-400">sin(δ/2) = 1 / [1 + (r_p v_∞² / μ_p)]</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Hyperbolic flyby turning angle transfers planetary momentum.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Controls Guide */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono mb-1.5">
              Flight Controls & Maneuver Planner
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li><strong className="text-slate-200">Plot Maneuver Node:</strong> Places an interactive burn gizmo on your trajectory.</li>
              <li><strong className="text-slate-200">Prograde / Retrograde:</strong> Burns along your velocity vector to raise or lower apoapsis.</li>
              <li><strong className="text-slate-200">Mouse Wheel & Drag:</strong> Zoom in/out and pan across celestial distances.</li>
              <li><strong className="text-slate-200">Time Warp:</strong> Accelerate simulation clock up to 500× for long interplanetary voyages.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg text-xs transition-colors"
          >
            Acknowledge & Launch
          </button>
        </div>
      </div>
    </div>
  );
};
