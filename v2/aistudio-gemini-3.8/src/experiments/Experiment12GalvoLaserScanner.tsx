import React, { useRef, useEffect, useState } from 'react';
import { Zap, Gauge, Sliders, Play, RotateCcw } from 'lucide-react';

export default function Experiment12GalvoLaserScanner() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [laserWavelength, setLaserWavelength] = useState<'532nm' | '650nm' | '405nm'>('532nm');
  const [scanSpeed, setScanSpeed] = useState(1.2);
  const [beamIntensity, setBeamIntensity] = useState(90);

  const laserSpecs = {
    '532nm': { name: 'DPSS GREEN', color: '#00ff44', glow: 'rgba(0, 255, 68, 0.9)', core: '#ffffff' },
    '650nm': { name: 'DIODE RED', color: '#ff1a1a', glow: 'rgba(255, 26, 26, 0.9)', core: '#ffffff' },
    '405nm': { name: 'VIOLET LASER', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.9)', core: '#ffffff' },
  }[laserWavelength];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    // Vector strokes for "HELLO WORLD"
    const text = 'HELLO WORLD';
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d')!;

    offCtx.font = `900 ${Math.min(width / 9, 88)}px 'Syne', sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#ffffff';
    offCtx.fillText(text, width / 2, height / 2);

    const imgData = offCtx.getImageData(0, 0, width, height).data;
    const pathPoints: { x: number; y: number }[] = [];

    // Extract outline boundary points
    for (let y = 10; y < height - 10; y += 8) {
      for (let x = 10; x < width - 10; x += 8) {
        const idx = (y * width + x) * 4 + 3;
        if (imgData[idx] > 180) {
          // Check if boundary
          const isEdge =
            imgData[((y - 1) * width + x) * 4 + 3] <= 180 ||
            imgData[((y + 1) * width + x) * 4 + 3] <= 180 ||
            imgData[(y * width + (x - 1)) * 4 + 3] <= 180 ||
            imgData[(y * width + (x + 1)) * 4 + 3] <= 180;
          if (isEdge) {
            pathPoints.push({ x, y });
          }
        }
      }
    }

    let isRunning = true;
    let animId = 0;
    let scanHead = 0;

    const render = () => {
      if (!isRunning) return;

      // Dark optics chamber with phosphorescent persistence
      ctx.fillStyle = 'rgba(5, 5, 8, 0.2)';
      ctx.fillRect(0, 0, width, height);

      if (pathPoints.length > 0) {
        const stepsPerFrame = Math.round(18 * scanSpeed);

        ctx.save();
        ctx.strokeStyle = laserSpecs.color;
        ctx.shadowColor = laserSpecs.glow;
        ctx.shadowBlur = beamIntensity * 0.25;
        ctx.lineWidth = 2.5;

        for (let s = 0; s < stepsPerFrame; s++) {
          const curr = pathPoints[scanHead % pathPoints.length];
          const next = pathPoints[(scanHead + 1) % pathPoints.length];

          // Laser beam trace
          ctx.beginPath();
          ctx.moveTo(curr.x, curr.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();

          // Laser impact spot
          ctx.fillStyle = laserSpecs.core;
          ctx.beginPath();
          ctx.arc(curr.x, curr.y, 2, 0, Math.PI * 2);
          ctx.fill();

          scanHead++;
        }

        // Draw galvanometer mirror scanner origin
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        const headPt = pathPoints[scanHead % pathPoints.length];
        ctx.moveTo(width / 2, 10);
        ctx.lineTo(headPt.x, headPt.y);
        ctx.stroke();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [laserWavelength, scanSpeed, beamIntensity, laserSpecs]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#050508] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Zap size={14} style={{ color: laserSpecs.color }} />
          <span className="font-bold text-stone-200">STUDY 012</span> // DUAL GALVO VECTOR LASER SCANNER
        </div>
        <div className="flex items-center gap-4">
          <span>SOURCE: {laserSpecs.name}</span>
          <span>PPS: {Math.round(scanSpeed * 30000)} PTS/SEC</span>
        </div>
      </div>

      {/* Laser Chamber Screen */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 right-4 pointer-events-none text-[11px] text-stone-400 bg-stone-900/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          GALVO DEFLECTION: ±18.4° X / ±12.2° Y
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Scan Rate:</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={scanSpeed}
              onChange={(e) => setScanSpeed(Number(e.target.value))}
              className="w-24 accent-emerald-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Bloom:</span>
            <input
              type="range"
              min="30"
              max="140"
              value={beamIntensity}
              onChange={(e) => setBeamIntensity(Number(e.target.value))}
              className="w-24 accent-emerald-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['532nm', '650nm', '405nm'] as const).map((wl) => (
            <button
              key={wl}
              onClick={() => setLaserWavelength(wl)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                laserWavelength === wl
                  ? 'bg-stone-800 text-white font-bold border-stone-600'
                  : 'border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {wl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
