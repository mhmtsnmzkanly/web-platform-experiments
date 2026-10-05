import React, { useRef, useEffect, useState } from 'react';
import { Activity, Sliders, RotateCcw, Sparkles } from 'lucide-react';

export default function Experiment54OscilloscopeLissajous3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotSpeed, setRotSpeed] = useState(1);
  const [ratio, setRatio] = useState<'3:2:1' | '5:4:3' | '1:1:1'>('3:2:1');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;

    let isRunning = true;
    let animId = 0;
    let angleX = 0.3;
    let angleY = 0;

    const render = () => {
      if (!isRunning) return;
      angleY += 0.015 * rotSpeed;
      angleX += 0.008 * rotSpeed;

      // Dark phosphor screen with scan persistence
      ctx.fillStyle = 'rgba(4, 10, 8, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // CRT phosphor grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 40; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 40; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3D Lissajous parametric curve:
      // x = Ax * sin(wx * t + deltaX)
      // y = Ay * sin(wy * t + deltaY)
      // z = Az * sin(wz * t + deltaZ)
      const numPoints = 800;
      const scale = 140;
      const [wx, wy, wz] = ratio === '3:2:1' ? [3, 2, 1] : ratio === '5:4:3' ? [5, 4, 3] : [1, 1, 1];

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.strokeStyle = '#34d399';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      for (let i = 0; i <= numPoints; i++) {
        const t = (i / numPoints) * Math.PI * 2;
        const x0 = Math.sin(wx * t) * scale;
        const y0 = Math.sin(wy * t) * scale;
        const z0 = Math.sin(wz * t) * scale;

        // 3D rotation
        const x1 = x0 * cosY - z0 * sinY;
        const z1 = x0 * sinY + z0 * cosY;
        const y1 = y0 * cosX - z1 * sinX;
        const z2 = y0 * sinX + z1 * cosX;

        // Perspective projection
        const fov = 400;
        const projScale = fov / (fov + z2);
        const px = x1 * projScale;
        const py = y1 * projScale;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // Inscribed Typographic Vector Beam
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 42px "Syne", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 15;
      ctx.fillText('HELLO WORLD', centerX, centerY);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [rotSpeed, ratio]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#040a08] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-emerald-400" />
          <span className="font-bold text-stone-200">STUDY 054</span> // 3D VECTOR LISSAJOUS OSCILLOSCOPE
        </div>
        <div className="flex items-center gap-4">
          <span>HARMONIC RATIO: {ratio}</span>
          <span>PHOSPHOR: P31 EMERALD</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-emerald-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          3D VECTOR BEAM ROTATES THROUGH SPATIAL LISSAJOUS TRAJECTORIES
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Rotation Velocity:</span>
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.2"
              value={rotSpeed}
              onChange={(e) => setRotSpeed(Number(e.target.value))}
              className="w-24 accent-emerald-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['3:2:1', '5:4:3', '1:1:1'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRatio(r)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                ratio === r ? 'bg-stone-800 text-white font-bold border-stone-600' : 'border-stone-800 text-stone-400'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
