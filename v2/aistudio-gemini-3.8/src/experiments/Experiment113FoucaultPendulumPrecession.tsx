import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment113FoucaultPendulumPrecession() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [latitudeDeg, setLatitudeDeg] = useState(48.85); // Paris Pantheon 48.85°N
  const [simSpeed, setSimSpeed] = useState(2.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let t = 0;
    const trail: { x: number; y: number }[] = [];

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      // Dark floor dial of Paris Pantheon
      ctx.fillStyle = '#0a0908';
      ctx.fillRect(0, 0, width, height);

      // Foucault pendulum angular precession rate:
      // omega_precession = omega_earth * sin(latitude) = 360°/day * sin(phi)
      const latRad = (latitudeDeg * Math.PI) / 180;
      const precessionRate = Math.sin(latRad) * 0.005 * simSpeed;
      const precessionAngle = t * precessionRate;

      // Circular degree scale ring with indicator pins
      const dialR = Math.min(width, height) * 0.42;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, dialR, 0, Math.PI * 2);
      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Degree tick marks
      for (let d = 0; d < 72; d++) {
        const da = (d / 72) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(da) * (dialR - 6), cy + Math.sin(da) * (dialR - 6));
        ctx.lineTo(cx + Math.cos(da) * dialR, cy + Math.sin(da) * dialR);
        ctx.strokeStyle = d % 6 === 0 ? '#f59e0b' : '#78716c';
        ctx.lineWidth = d % 6 === 0 ? 2 : 1;
        ctx.stroke();
      }

      // Fast pendulum harmonic swing: r = R * cos(omega_p * t)
      const swingR = dialR * 0.88 * Math.cos(t * 1.8);
      const px = cx + Math.cos(precessionAngle) * swingR;
      const py = cy + Math.sin(precessionAngle) * swingR;

      trail.push({ x: px, y: py });
      if (trail.length > 280) trail.shift();

      // Draw precession rosette trajectory trail
      ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        if (i === 0) ctx.moveTo(trail[i].x, trail[i].y);
        else ctx.lineTo(trail[i].x, trail[i].y);
      }
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Suspended 28kg brass bob
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();

      // Floor Inscription "HELLO WORLD"
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 50px "Instrument Serif", Georgia, serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.fillText('HELLO WORLD', cx, cy);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#a8a29e';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `LÉON FOUCAULT 1851 PANTHEON · PRECESSION ω = Ω_E · sin(${latitudeDeg.toFixed(1)}°) = ${(Math.sin(latRad) * 360 / 24).toFixed(2)}°/HOUR`,
        cx,
        cy + 40
      );
      ctx.restore();

      t += 0.03;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [latitudeDeg, simSpeed]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Compass className="text-amber-500" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 113: LÉON FOUCAULT 1851 PENDULUM PRECESSION
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Earth Coriolis Acceleration ω = Ω·sin(φ) & 67-Meter Wire Oscillation
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setLatitudeDeg(48.85);
              setSimSpeed(2.0);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Paris (48.8°N)</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950 flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-500" /> Geographic Latitude (φ):
              </span>
              <span className="text-amber-400 font-bold">{latitudeDeg.toFixed(1)}° N</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="1"
              value={latitudeDeg}
              onChange={(e) => setLatitudeDeg(Number(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Precession Sim Rate:</span>
              <span className="text-amber-400 font-bold">{simSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={simSpeed}
              onChange={(e) => setSimSpeed(Number(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
