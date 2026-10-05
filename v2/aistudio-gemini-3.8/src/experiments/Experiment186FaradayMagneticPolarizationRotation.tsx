import React, { useRef, useEffect, useState } from 'react';
import { Magnet, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment186FaradayMagneticPolarizationRotation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [magneticFieldB, setMagneticFieldB] = useState(1.8); // Tesla
  const [mediumVerdet, setMediumVerdet] = useState<'flint' | 'terbium' | 'quartz'>('terbium');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Faraday Magneto-Optic Effect (1845 Michael Faraday):
    // Rotation of the plane of polarization of linearly polarized light
    // passing through a transparent dielectric medium along a magnetic field:
    // theta = V * B * L
    // where V is the Verdet constant (rad / T*m), B is magnetic field, L is path length.
    // Proved for the first time that light and electromagnetism are deeply connected!

    const verdetMap = {
      terbium: 24.5, // Terbium Gallium Garnet (TGG) - high Verdet
      flint: 8.2, // Heavy Flint Glass (Faraday's original discovery)
      quartz: 2.1,
    };

    const vConst = verdetMap[mediumVerdet];
    const pathL = 0.05; // 5 cm crystal
    const rotDeg = vConst * magneticFieldB * pathL * (180 / Math.PI) * 4;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.45;
      const cy = height * 0.48;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      // Optical Bench Components:
      // Laser Source -> Polarizer (Vertical, 0 deg) -> Faraday Solenoid & Crystal -> Analyzer (rotated by theta) -> Photodiode
      const srcX = cx - 220;
      const polX = cx - 140;
      const cryX = cx - 50;
      const cryW = 100;
      const anaX = cx + 90;
      const detX = cx + 180;

      // Laser Emitter
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(srcX - 25, cy - 14, 25, 28);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(srcX - 25, cy - 14, 25, 28);

      // Initial Polarizer (Fixed Vertical Polarizer at polX)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fillRect(polX - 5, cy - 35, 10, 70);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(polX - 5, cy - 35, 10, 70);
      // Vertical polarizing slit
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(polX, cy - 25);
      ctx.lineTo(polX, cy + 25);
      ctx.stroke();

      // Faraday Solenoid Coils surrounding Crystal
      ctx.fillStyle = '#78350f';
      ctx.fillRect(cryX - 10, cy - 45, cryW + 20, 12); // top coil
      ctx.fillRect(cryX - 10, cy + 33, cryW + 20, 12); // bottom coil

      // Transparent Magneto-Optic Crystal
      ctx.fillStyle = mediumVerdet === 'terbium' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(234, 179, 8, 0.25)';
      ctx.fillRect(cryX, cy - 30, cryW, 60);
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cryX, cy - 30, cryW, 60);

      // Rotating Laser Beam Vectors:
      // Before crystal: purely vertical polarization (angle 0)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(srcX, cy);
      ctx.lineTo(cryX, cy);
      ctx.stroke();

      // Inside Crystal: Continuous circular birefringence rotation!
      ctx.strokeStyle = '#eab308';
      ctx.beginPath();
      ctx.moveTo(cryX, cy);
      ctx.lineTo(cryX + cryW, cy);
      ctx.stroke();

      // After Crystal: Plane of polarization rotated by rotDeg!
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(cryX + cryW, cy);
      ctx.lineTo(anaX, cy);
      ctx.lineTo(detX, cy);
      ctx.stroke();

      // Rotating Analyzer Polarizer at anaX
      const anaRad = (rotDeg * Math.PI) / 180;
      ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.fillRect(anaX - 5, cy - 35, 10, 70);
      ctx.strokeStyle = '#a855f7';
      ctx.strokeRect(anaX - 5, cy - 35, 10, 70);

      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(anaX - Math.sin(anaRad) * 25, cy - Math.cos(anaRad) * 25);
      ctx.lineTo(anaX + Math.sin(anaRad) * 25, cy + Math.cos(anaRad) * 25);
      ctx.stroke();

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 270, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 270, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('FARADAY MAGNETO-OPTIC EFFECT', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Rotation Angle θ: ${rotDeg.toFixed(1)}°`, 45, 72);
      ctx.fillText(`Verdet Constant V: ${vConst.toFixed(1)} rad/(T·m)`, 45, 90);
      ctx.fillText(`Non-Reciprocal Optical Isolator (Circulator)`, 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1845 MICHAEL FARADAY MAGNETO-OPTIC EFFECT · CIRCULAR BIREFRINGENCE POLARIZATION ROTATION', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [magneticFieldB, mediumVerdet]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Magnet size={14} /> Solenoid Magnetic Field (B)</span>
            <span className="font-mono">{magneticFieldB.toFixed(2)} Tesla</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={magneticFieldB}
            onChange={(e) => setMagneticFieldB(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-purple-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Magneto-Optic Medium</span>
            <span className="font-mono uppercase">{mediumVerdet}</span>
          </div>
          <div className="flex gap-2 mt-1">
            {(['terbium', 'flint', 'quartz'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMediumVerdet(m)}
                className={`flex-1 py-1 text-xs font-mono rounded border transition-colors ${
                  mediumVerdet === m
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 font-bold'
                    : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
                }`}
              >
                {m === 'terbium' ? 'TGG Crystal' : m === 'flint' ? 'Flint Glass' : 'Quartz'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
