import React from 'react';
import {
  Compass,
  Activity,
  Flame,
  AlertTriangle,
  Globe,
  Radio,
  Clock,
  Zap,
} from 'lucide-react';
import { CelestialBody, OrbitalElements } from '../types';

interface TelemetryHUDProps {
  body: CelestialBody | null;
  orbitalElements: OrbitalElements | null;
  simulationTime: number;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  body,
  orbitalElements,
  simulationTime,
}) => {
  if (!body) {
    return (
      <div className="p-3 bg-slate-900/80 backdrop-blur border border-slate-800 rounded-lg text-slate-500 text-xs font-mono">
        No celestial body selected for tracking.
      </div>
    );
  }

  // Format mission elapsed time (MET)
  const days = Math.floor(simulationTime / 86400);
  const hours = Math.floor((simulationTime % 86400) / 3600);
  const minutes = Math.floor((simulationTime % 3600) / 60);
  const seconds = Math.floor(simulationTime % 60);
  const formattedTime = `T+ ${days}d ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Orbit Class badge
  const e = orbitalElements?.eccentricity ?? 0;
  let orbitClass = 'CIRCULAR';
  let orbitBadgeColor = 'bg-sky-500/20 text-sky-300 border-sky-500/40';

  if (e >= 1.0) {
    orbitClass = 'HYPERBOLIC ESCAPE';
    orbitBadgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  } else if (e > 0.85) {
    orbitClass = 'HIGHLY ECCENTRIC';
    orbitBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  } else if (e > 0.05) {
    orbitClass = 'ELLIPTIC';
    orbitBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  }

  // Fuel & Delta-V Capacity for Spacecraft
  const dryMass = body.dryMassKg ?? 1000;
  const fuel = body.fuelKg ?? 0;
  const totalMass = dryMass + fuel;
  const isp = body.ispSeconds ?? 314;
  const remainingDeltaV = isp * 0.00980665 * Math.log(totalMass / Math.max(1, dryMass));
  const fuelPercent = totalMass > dryMass ? (fuel / (totalMass - dryMass + 1e-4)) * 100 : 0;

  return (
    <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-3 text-xs shadow-xl select-none space-y-3 font-mono">
      {/* Title & Body Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: body.color }} />
          <span className="font-bold text-slate-100 text-sm">{body.name}</span>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
            {body.type}
          </span>
        </div>
        <div className="text-[11px] text-sky-400 font-semibold">{formattedTime}</div>
      </div>

      {/* Orbit Class & Primary */}
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center space-x-1.5">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Primary:</span>
          <span className="text-slate-200 font-semibold">
            {orbitalElements?.primaryBodyName || 'Barycenter'}
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${orbitBadgeColor}`}>
          {orbitClass}
        </span>
      </div>

      {/* Real-time Kinematics Grid */}
      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/70 p-2.5 rounded border border-slate-800/80">
        <div>
          <span className="text-slate-500 block text-[10px]">CURRENT SPEED:</span>
          <span className="text-sky-300 font-bold text-sm">
            {(orbitalElements?.currentSpeedKmS ?? 0).toFixed(3)}
          </span>{' '}
          <span className="text-slate-400 text-[10px]">km/s</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px]">ALTITUDE:</span>
          <span className="text-emerald-300 font-bold text-sm">
            {Math.round(orbitalElements?.altitudeKm ?? 0).toLocaleString()}
          </span>{' '}
          <span className="text-slate-400 text-[10px]">km</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px]">PERIAPSIS (Pe):</span>
          <span className="text-amber-300 font-bold">
            {Math.round(orbitalElements?.periapsisKm ?? 0).toLocaleString()}
          </span>{' '}
          <span className="text-slate-400 text-[10px]">km</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px]">APOAPSIS (Ap):</span>
          <span className="text-amber-300 font-bold">
            {isFinite(orbitalElements?.apoapsisKm ?? 0)
              ? `${Math.round(orbitalElements?.apoapsisKm ?? 0).toLocaleString()} km`
              : 'ESCAPE ∞'}
          </span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px]">ECCENTRICITY (e):</span>
          <span className="text-slate-200 font-bold">
            {(orbitalElements?.eccentricity ?? 0).toFixed(4)}
          </span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px]">ORBITAL PERIOD:</span>
          <span className="text-slate-200 font-bold">
            {isFinite(orbitalElements?.orbitalPeriodSeconds ?? 0) &&
            (orbitalElements?.orbitalPeriodSeconds ?? 0) > 0
              ? (orbitalElements?.orbitalPeriodSeconds ?? 0) > 86400
                ? `${((orbitalElements?.orbitalPeriodSeconds ?? 0) / 86400).toFixed(2)} d`
                : `${((orbitalElements?.orbitalPeriodSeconds ?? 0) / 3600).toFixed(2)} h`
              : 'HYPERBOLIC'}
          </span>
        </div>
      </div>

      {/* Propellant & Delta-V Capacity Gauge (if Spacecraft) */}
      {body.type === 'SPACECRAFT' && body.fuelKg !== undefined && (
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400 flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Propellant ({Math.round(fuel)} kg):</span>
            </span>
            <span className="text-orange-300 font-bold">Δv: {remainingDeltaV.toFixed(2)} km/s</span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-300 ${
                fuelPercent > 40 ? 'bg-orange-500' : fuelPercent > 15 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.max(0, Math.min(100, fuelPercent))}%` }}
            />
          </div>
        </div>
      )}

      {/* Atmospheric Entry Alert */}
      {body.type === 'SPACECRAFT' &&
        orbitalElements &&
        orbitalElements.altitudeKm < 150 &&
        orbitalElements.altitudeKm > 0 && (
          <div className="flex items-center space-x-2 p-2 rounded bg-rose-950/40 border border-rose-500/50 text-rose-300 text-[11px] animate-pulse">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>ATMOSPHERIC ENTRY DETECTED: Aerobraking drag active</span>
          </div>
        )}
    </div>
  );
};
