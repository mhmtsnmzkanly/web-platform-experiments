import React from 'react';
import { Particle } from '../types';
import { X, ShieldAlert, Crosshair, Zap } from 'lucide-react';

interface ParticleInspectorModalProps {
  particle: Particle | null;
  onClose: () => void;
}

export const ParticleInspectorModal: React.FC<ParticleInspectorModalProps> = ({
  particle,
  onClose,
}) => {
  if (!particle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-100 flex flex-col font-sans animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full inline-block shadow-md"
              style={{ backgroundColor: particle.color }}
            />
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{particle.name}</span>
                <span className="font-mono text-cyan-400">({particle.symbol})</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Process: {particle.parentProcess}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs font-mono">
          {/* Key Properties Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px]">ELECTRIC CHARGE</span>
              <span className="text-white font-bold text-sm">
                {particle.charge > 0 ? `+${particle.charge}` : particle.charge} e
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">REST MASS</span>
              <span className="text-white font-bold text-sm">
                {particle.mass < 0.001 ? `${(particle.mass * 1e6).toFixed(1)} keV` : `${particle.mass.toFixed(4)} GeV`}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">TRANSVERSE MOMENTUM (pT)</span>
              <span className="text-cyan-400 font-bold text-sm">
                {particle.pt.toFixed(3)} GeV/c
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">TOTAL ENERGY (E)</span>
              <span className="text-emerald-400 font-bold text-sm">
                {particle.E.toFixed(3)} GeV
              </span>
            </div>
          </div>

          {/* 4-Momentum Vector */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              <span>Relativistic 4-Momentum Vector (E, px, py, pz)</span>
            </h4>
            <div className="grid grid-cols-4 gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80 text-center text-[11px]">
              <div>
                <span className="text-slate-500 block text-[9px]">E</span>
                <span className="text-white">{particle.E.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">p_x</span>
                <span className="text-white">{particle.px.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">p_y</span>
                <span className="text-white">{particle.py.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">p_z</span>
                <span className="text-white">{particle.pz.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Angular Coordinates */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Angular Phase Space (η, φ, θ)
            </h4>
            <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80 text-center text-[11px]">
              <div>
                <span className="text-slate-500 block text-[9px]">PSEUDORAPIDITY (η)</span>
                <span className="text-cyan-300">{particle.eta.toFixed(3)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">AZIMUTH (φ)</span>
                <span className="text-cyan-300">{(particle.phi * (180 / Math.PI)).toFixed(1)}°</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">POLAR ANGLE (θ)</span>
                <span className="text-cyan-300">{(particle.theta * (180 / Math.PI)).toFixed(1)}°</span>
              </div>
            </div>
          </div>

          {/* Subdetector Hits */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Detector Layer Interactions ({particle.detectorHits.length} Hits)</span>
            </h4>
            {particle.detectorHits.length > 0 ? (
              <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                {particle.detectorHits.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-2.5 py-1 bg-slate-950 rounded border border-slate-800/70 text-[10px]"
                  >
                    <span className="font-bold text-cyan-400">{h.subdetector}</span>
                    <span className="text-slate-400">r = {h.r.toFixed(2)}m, z = {h.z.toFixed(2)}m</span>
                    <span className="text-amber-300 font-semibold">{h.energyDeposit.toFixed(3)} GeV</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic text-[11px]">
                No interactions (non-interacting neutralino / neutrino).
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
