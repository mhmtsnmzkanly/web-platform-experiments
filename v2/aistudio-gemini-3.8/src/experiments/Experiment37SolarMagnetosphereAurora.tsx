import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sparkles, Sliders, Zap } from 'lucide-react';

export default function Experiment37SolarMagnetosphereAurora() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [kpIndex, setKpIndex] = useState(6); // Geomagnetic storm level (1 to 9)
  const [solarSpeed, setSolarSpeed] = useState(1.4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    let isRunning = true;
    let animId = 0;
    let time = 0;

    const render = () => {
      if (!isRunning) return;
      time += 0.02 * solarSpeed;

      // Arctic polar night sky
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Distant stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let s = 0; s < 50; s++) {
        const sx = ((s * 137.5) % width);
        const sy = ((s * 73.1) % (height * 0.7));
        ctx.fillRect(sx, sy, 1, 1);
      }

      // Render Undulating Aurora Borealis Curtains
      // Raymarching multi-harmonic ribbons
      const numCurtains = 3;
      const stormIntensity = kpIndex / 9;

      ctx.save();
      for (let c = 0; c < numCurtains; c++) {
        const curtainTime = time + c * 1.5;
        const baseY = height * 0.35 + c * 30;

        ctx.beginPath();
        for (let x = 0; x <= width; x += 15) {
          // Harmonic wave equation
          const wave1 = Math.sin(x * 0.005 + curtainTime) * 45 * stormIntensity;
          const wave2 = Math.sin(x * 0.015 - curtainTime * 1.5) * 25 * stormIntensity;
          const y = baseY + wave1 + wave2;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Draw vertical aurora rays rising into ionosphere
        ctx.lineWidth = 14;
        const auroraGrad = ctx.createLinearGradient(0, baseY - 120, 0, baseY + 60);
        auroraGrad.addColorStop(0, 'rgba(168, 85, 247, 0.4)'); // Nitrogen purple high altitude
        auroraGrad.addColorStop(0.5, 'rgba(34, 197, 94, 0.6)'); // Oxygen green 557nm
        auroraGrad.addColorStop(1, 'transparent');

        ctx.strokeStyle = auroraGrad;
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 20 * stormIntensity;
        ctx.stroke();
      }
      ctx.restore();

      // Atmospheric Ground Silhouette of "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.min(width / 9, 86)}px 'Syne', sans-serif`;

      // Silhouetted against the emerald aurora sky
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 18;
      ctx.fillText('HELLO WORLD', width / 2, height * 0.62);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [kpIndex, solarSpeed]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#030712] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-emerald-400" />
          <span className="font-bold text-stone-200">STUDY 037</span> // SOLAR MAGNETOSPHERE AURORA CURTAINS
        </div>
        <div className="flex items-center gap-4">
          <span>GEOMAGNETIC STORM: KP {kpIndex}</span>
          <span>IONOSPHERE: 557.7 NM (O I)</span>
        </div>
      </div>

      {/* Aurora Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-emerald-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          SOLAR WIND FUNNELED BY GEOMAGNETIC DIPOLES GENERATES AURORA SHADE
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Kp Storm Index:</span>
            <input
              type="range"
              min="1"
              max="9"
              value={kpIndex}
              onChange={(e) => setKpIndex(Number(e.target.value))}
              className="w-24 accent-emerald-400"
            />
            <span className="font-bold text-emerald-400">Kp {kpIndex}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Solar Velocity:</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.2"
              value={solarSpeed}
              onChange={(e) => setSolarSpeed(Number(e.target.value))}
              className="w-20 accent-emerald-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400">Birkeland Currents Active</span>
        </div>
      </div>
    </div>
  );
}
