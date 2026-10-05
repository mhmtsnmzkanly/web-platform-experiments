import React, { useRef, useEffect, useState } from 'react';
import { Radio, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment66DopplerRadarWindVelocity() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sweepRPM, setSweepRPM] = useState(20);
  const [vMax, setVMax] = useState(45); // m/s

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxR = Math.min(width, height) * 0.44;

    let isRunning = true;
    let animId = 0;
    let sweepAngle = 0;

    const render = () => {
      if (!isRunning) return;
      sweepAngle = (sweepAngle + (sweepRPM * 0.002)) % (Math.PI * 2);

      // Dark NEXRAD weather radar scope
      ctx.fillStyle = '#060a08';
      ctx.fillRect(0, 0, width, height);

      // Range rings (25km, 50km, 75km)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      for (let r = 50; r <= maxR; r += 50) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Doppler base velocity color map:
      // Inbound = Green/Blue (-V), Outbound = Red/Amber (+V)
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxR, 0, Math.PI * 2);
      ctx.clip();

      const numSectors = 72;
      for (let s = 0; s < numSectors; s++) {
        const theta = (s / numSectors) * Math.PI * 2;
        // Doppler radial velocity: V_r = V_wind * cos(theta - windDir)
        const vr = Math.cos(theta - 0.8) * vMax;
        const norm = vr / vMax; // -1 to +1

        const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, maxR);
        if (norm < 0) {
          // Inbound green
          grad.addColorStop(0, `rgba(34, 197, 94, ${Math.abs(norm) * 0.6})`);
          grad.addColorStop(1, 'rgba(16, 185, 129, 0.1)');
        } else {
          // Outbound red
          grad.addColorStop(0, `rgba(239, 68, 68, ${norm * 0.6})`);
          grad.addColorStop(1, 'rgba(244, 63, 94, 0.1)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, maxR, theta, theta + (Math.PI * 2) / numSectors);
        ctx.closePath();
        ctx.fill();
      }

      // Sweeping radar beam line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(sweepAngle) * maxR, centerY + Math.sin(sweepAngle) * maxR);
      ctx.stroke();

      ctx.restore();

      // Typographic Monument in center "HELLO WORLD"
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 54px "Syne", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 18;
      ctx.fillText('HELLO WORLD', centerX, centerY);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [sweepRPM, vMax]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#060a08] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-emerald-400" />
          <span className="font-bold text-stone-200">STUDY 066</span> // METEOROLOGICAL DOPPLER VELOCITY
        </div>
        <div className="flex items-center gap-4">
          <span>RADIAL V_MAX: ±{vMax} M/S</span>
          <span>PULSE-PAIR DOPPLER SPECTRA</span>
        </div>
      </div>

      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-emerald-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          PULSE DOPPLER CODES INBOUND (GREEN) AND OUTBOUND (RED) RADIAL WIND
        </div>
      </div>

      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Antenna Sweep:</span>
            <input
              type="range"
              min="10"
              max="40"
              value={sweepRPM}
              onChange={(e) => setSweepRPM(Number(e.target.value))}
              className="w-24 accent-emerald-400"
            />
            <span>{sweepRPM} RPM</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Max Velocity:</span>
            <input
              type="range"
              min="20"
              max="80"
              value={vMax}
              onChange={(e) => setVMax(Number(e.target.value))}
              className="w-20 accent-emerald-400"
            />
            <span>{vMax} m/s</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400">Nyquist Unambiguous Velocity</span>
        </div>
      </div>
    </div>
  );
}
