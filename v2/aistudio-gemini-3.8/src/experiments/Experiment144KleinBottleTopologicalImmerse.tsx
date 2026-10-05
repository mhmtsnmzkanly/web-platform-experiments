import React, { useRef, useEffect, useState } from 'react';
import { Orbit, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment144KleinBottleTopologicalImmerse() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wireframeDensity, setWireframeDensity] = useState(32);
  const [rotationSpeed, setRotationSpeed] = useState(0.8);
  const [colorMode, setColorMode] = useState<'rainbow' | 'spectral' | 'monochrome'>('spectral');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let rotX = 0.4;
    let rotY = 0;
    let rotZ = 0.2;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.46;

      ctx.fillStyle = '#06070b';
      ctx.fillRect(0, 0, width, height);

      rotY += 0.012 * rotationSpeed;
      rotX += 0.005 * rotationSpeed;

      // Figure-8 Parametric Immersion of the Klein Bottle:
      // u in [0, 2*pi], v in [0, 2*pi]
      // r = 4 * (1 - cos(u)/2)
      // x = 6*cos(u)*(1 + sin(u)) + 4*r*cos(u)*cos(v)  (or standard Figure-8)
      // Standard Figure-8:
      // r = a + cos(u/2)*sin(v) - sin(u/2)*sin(2v)
      // x = r * cos(u)
      // y = r * sin(u)
      // z = sin(u/2)*sin(v) + cos(u/2)*sin(2v)
      const uSteps = wireframeDensity;
      const vSteps = Math.floor(wireframeDensity * 0.75);
      const scale = 58;

      const project = (x: number, y: number, z: number) => {
        // 3D rotation
        // Y rotation
        let x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
        let z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
        // X rotation
        let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
        // Z rotation
        let x3 = x1 * Math.cos(rotZ) - y2 * Math.sin(rotZ);
        let y3 = x1 * Math.sin(rotZ) + y2 * Math.cos(rotZ);

        // Perspective
        const dist = 9;
        const pers = dist / (dist + z2);
        return {
          px: cx + x3 * scale * pers,
          py: cy + y3 * scale * pers,
          depth: z2,
        };
      };

      // Generate grid vertices
      const grid: { px: number; py: number; depth: number; u: number; v: number }[][] = [];

      for (let i = 0; i <= uSteps; i++) {
        const u = (i / uSteps) * Math.PI * 2;
        const row = [];
        for (let j = 0; j <= vSteps; j++) {
          const v = (j / vSteps) * Math.PI * 2;

          // Figure-8 Klein Bottle parametric formula
          const a = 2.4;
          const r = a + Math.cos(u / 2) * Math.sin(v) - Math.sin(u / 2) * Math.sin(2 * v);
          const x = r * Math.cos(u);
          const y = r * Math.sin(u);
          const z = Math.sin(u / 2) * Math.sin(v) + Math.cos(u / 2) * Math.sin(2 * v);

          row.push({ ...project(x, y, z), u, v });
        }
        grid.push(row);
      }

      // Draw U and V curves with depth coloring
      ctx.lineWidth = 1.3;
      for (let i = 0; i < uSteps; i++) {
        for (let j = 0; j < vSteps; j++) {
          const p1 = grid[i][j];
          const p2 = grid[i + 1][j];
          const p3 = grid[i][j + 1];

          let hue = 0;
          if (colorMode === 'rainbow') hue = (p1.u / (Math.PI * 2)) * 360;
          else if (colorMode === 'spectral') hue = 180 + Math.sin(p1.v) * 80 + (p1.depth + 3) * 20;
          else hue = 210;

          const alpha = Math.max(0.2, Math.min(0.9, (p1.depth + 4) / 8));
          ctx.strokeStyle = `hsla(${hue}, 85%, 60%, ${alpha})`;

          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p3.px, p3.py);
          ctx.stroke();
        }
      }

      // Bottom Typography
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('NON-ORIENTABLE 4D KLEIN BOTTLE IMMERSION · EULER CHARACTERISTIC χ = 0', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [wireframeDensity, rotationSpeed, colorMode]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-purple-400">
            <span className="flex items-center gap-1.5 font-mono"><Orbit size={14} /> Mesh Tessellation</span>
            <span className="font-mono">{wireframeDensity}x{Math.floor(wireframeDensity * 0.75)}</span>
          </div>
          <input
            type="range"
            min="20"
            max="48"
            value={wireframeDensity}
            onChange={(e) => setWireframeDensity(Number(e.target.value))}
            className="accent-purple-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-indigo-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Hyper-Rotation Rate</span>
            <span className="font-mono">{rotationSpeed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={rotationSpeed}
            onChange={(e) => setRotationSpeed(Number(e.target.value))}
            className="accent-indigo-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-pink-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Color Palette</span>
            <span className="font-mono uppercase">{colorMode}</span>
          </div>
          <div className="flex gap-2 mt-1">
            {(['spectral', 'rainbow', 'monochrome'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setColorMode(m)}
                className={`flex-1 py-1 text-xs font-mono rounded border transition-colors ${
                  colorMode === m
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 font-bold'
                    : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
