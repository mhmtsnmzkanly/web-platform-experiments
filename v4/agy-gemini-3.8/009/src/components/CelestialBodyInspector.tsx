import React, { useState } from 'react';
import { X, Plus, Sparkles, Orbit } from 'lucide-react';
import { CelestialBody, CelestialBodyType } from '../types';

interface CelestialBodyInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBody: (body: CelestialBody) => void;
  primaryReferenceBody?: CelestialBody | null;
}

export const CelestialBodyInspector: React.FC<CelestialBodyInspectorProps> = ({
  isOpen,
  onClose,
  onAddBody,
  primaryReferenceBody,
}) => {
  const [name, setName] = useState<string>('Explorer-X');
  const [type, setType] = useState<CelestialBodyType>('SPACECRAFT');
  const [mass, setMass] = useState<number>(0.00001);
  const [radius, setRadius] = useState<number>(500);
  const [posX, setPosX] = useState<number>(8000);
  const [posY, setPosY] = useState<number>(0);
  const [velX, setVelX] = useState<number>(0);
  const [velY, setVelY] = useState<number>(7.1);
  const [color, setColor] = useState<string>('#38bdf8');
  const [hasAtmosphere, setHasAtmosphere] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleApplyPreset = (presetType: 'LEO_SAT' | 'LUNAR_PROBE' | 'ASTEROID' | 'DWARF_PLANET') => {
    if (presetType === 'LEO_SAT') {
      setName('Orbital CommSat');
      setType('SPACECRAFT');
      setMass(1e-21);
      setRadius(400);
      setPosX(primaryReferenceBody ? primaryReferenceBody.pos.x + 7200 : 7200);
      setPosY(primaryReferenceBody ? primaryReferenceBody.pos.y : 0);
      setVelX(0);
      setVelY(primaryReferenceBody ? primaryReferenceBody.vel.y + 7.45 : 7.45);
      setColor('#38bdf8');
    } else if (presetType === 'LUNAR_PROBE') {
      setName('Artemis Relay');
      setType('SPACECRAFT');
      setMass(1e-21);
      setRadius(500);
      setPosX(primaryReferenceBody ? primaryReferenceBody.pos.x + 15000 : 15000);
      setPosY(primaryReferenceBody ? primaryReferenceBody.pos.y : 0);
      setVelX(0);
      setVelY(primaryReferenceBody ? primaryReferenceBody.vel.y + 5.15 : 5.15);
      setColor('#fbbf24');
    } else if (presetType === 'ASTEROID') {
      setName('Asteroid 2026-NEO');
      setType('ASTEROID');
      setMass(0.0001);
      setRadius(2500);
      setPosX(120000);
      setPosY(45000);
      setVelX(-1.8);
      setVelY(1.2);
      setColor('#a3a3a3');
    } else if (presetType === 'DWARF_PLANET') {
      setName('Ceres-II');
      setType('PLANET');
      setMass(0.002);
      setRadius(4500);
      setPosX(250000);
      setPosY(0);
      setVelX(0);
      setVelY(1.25);
      setColor('#ec4899');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBody: CelestialBody = {
      id: `body-${Date.now()}`,
      name: name.trim() || 'Custom Body',
      type,
      mass: Math.max(1e-24, mass),
      radius: Math.max(10, radius),
      pos: { x: posX, y: posY },
      vel: { x: velX, y: velY },
      color,
      glowColor: color,
      hasAtmosphere,
      atmosphereHeightKm: hasAtmosphere ? 100 : undefined,
      trail: [],
      maxTrailLength: type === 'SPACECRAFT' ? 1000 : 400,
      fuelKg: type === 'SPACECRAFT' ? 2500 : undefined,
      dryMassKg: type === 'SPACECRAFT' ? 1200 : undefined,
      ispSeconds: type === 'SPACECRAFT' ? 320 : undefined,
      isControlled: type === 'SPACECRAFT',
    };

    onAddBody(newBody);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden text-slate-200 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Orbit className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-sm text-slate-100">Spawn Celestial Body / Spacecraft</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Archetype Presets */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Quick Archetype Presets:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleApplyPreset('LEO_SAT')}
                className="py-1 px-2 bg-slate-800 hover:bg-sky-900/60 border border-slate-700 hover:border-sky-500 rounded text-[11px] text-sky-300"
              >
                LEO Sat
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('LUNAR_PROBE')}
                className="py-1 px-2 bg-slate-800 hover:bg-amber-900/60 border border-slate-700 hover:border-amber-500 rounded text-[11px] text-amber-300"
              >
                Lunar Probe
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('ASTEROID')}
                className="py-1 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[11px] text-slate-300"
              >
                Asteroid
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('DWARF_PLANET')}
                className="py-1 px-2 bg-slate-800 hover:bg-pink-900/60 border border-slate-700 hover:border-pink-500 rounded text-[11px] text-pink-300"
              >
                Dwarf Planet
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Body Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Body Type:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CelestialBodyType)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100"
              >
                <option value="SPACECRAFT">SPACECRAFT</option>
                <option value="PLANET">PLANET</option>
                <option value="MOON">MOON</option>
                <option value="STAR">STAR</option>
                <option value="ASTEROID">ASTEROID</option>
                <option value="BLACK_HOLE">BLACK HOLE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Mass (Earth Masses):</label>
              <input
                type="number"
                step="any"
                value={mass}
                onChange={(e) => setMass(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Physical Radius (km):</label>
              <input
                type="number"
                step="any"
                value={radius}
                onChange={(e) => setRadius(parseFloat(e.target.value) || 10)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Position (X, Y in km):</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="any"
                  placeholder="X"
                  value={posX}
                  onChange={(e) => setPosX(parseFloat(e.target.value) || 0)}
                  className="w-1/2 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Y"
                  value={posY}
                  onChange={(e) => setPosY(parseFloat(e.target.value) || 0)}
                  className="w-1/2 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Velocity (Vx, Vy in km/s):</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="any"
                  placeholder="Vx"
                  value={velX}
                  onChange={(e) => setVelX(parseFloat(e.target.value) || 0)}
                  className="w-1/2 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Vy"
                  value={velY}
                  onChange={(e) => setVelY(parseFloat(e.target.value) || 0)}
                  className="w-1/2 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center space-x-2">
              <label className="text-slate-400 font-semibold">Render Color:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded bg-transparent cursor-pointer border border-slate-700"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="atmCheck"
                checked={hasAtmosphere}
                onChange={(e) => setHasAtmosphere(e.target.checked)}
                className="rounded border-slate-700 text-sky-500 focus:ring-0"
              />
              <label htmlFor="atmCheck" className="text-slate-300 font-semibold cursor-pointer">
                Atmosphere Layer
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-md shadow-sky-600/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>SPAWN BODY</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
