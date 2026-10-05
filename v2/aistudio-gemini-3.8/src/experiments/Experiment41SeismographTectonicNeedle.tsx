import React, { useRef, useEffect, useState } from 'react';
import { Activity, Sliders, RotateCcw, Zap } from 'lucide-react';

export default function Experiment41SeismographTectonicNeedle() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [magnitude, setMagnitude] = useState(6.2); // Richter
  const [paperSpeed, setPaperSpeed] = useState(2);
  const [isQuaking, setIsQuaking] = useState(false);
  const seismicHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerY = height / 2;

    const maxHistory = Math.floor(width / paperSpeed);
    if (seismicHistoryRef.current.length === 0) {
      seismicHistoryRef.current = new Array(maxHistory).fill(0);
    }

    let isRunning = true;
    let animId = 0;
    let time = 0;

    const render = () => {
      if (!isRunning) return;
      time += 0.05;

      // Smoked seismic drum paper background
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, width, height);

      // Horizontal baseline and calibration grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let y = 40; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Generate seismic tremor needle deflection
      let tremor = (Math.random() - 0.5) * 2; // ambient microseism
      if (isQuaking) {
        const quakeWave =
          Math.sin(time * 12) * Math.cos(time * 5) * Math.pow(magnitude, 1.8) * 4;
        tremor += quakeWave + (Math.random() - 0.5) * magnitude * 8;
      }

      const history = seismicHistoryRef.current;
      history.push(tremor);
      if (history.length > maxHistory) history.shift();

      // Draw continuous inscribed ink trace on drum
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 2;
      ctx.beginPath();

      for (let i = 0; i < history.length; i++) {
        const x = i * paperSpeed;
        const y = centerY + history[i];
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // Stylus needle tip at right edge
      const currentY = centerY + (history[history.length - 1] || 0);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(width - 20, currentY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Stylus arm
      ctx.strokeStyle = '#a8a29e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width - 4, centerY - 60);
      ctx.lineTo(width - 20, currentY);
      ctx.stroke();

      // Typographic watermark in background
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${Math.min(width / 9, 86)}px 'Instrument Serif', Georgia, serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillText('HELLO WORLD', width / 2, centerY);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [magnitude, paperSpeed, isQuaking]);

  const triggerTectonicQuake = () => {
    setIsQuaking(true);
    setTimeout(() => setIsQuaking(false), 2400);
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#1c1917] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-rose-500" />
          <span className="font-bold text-stone-200">STUDY 041</span> // DRUM SEISMOGRAPH TECTONIC NEEDLE
        </div>
        <div className="flex items-center gap-4">
          <span>MAGNITUDE: {magnitude} ML</span>
          <span>RECORDING: SMOKED PAPER ROLL</span>
        </div>
      </div>

      {/* Seismograph Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          MECHANICAL NEEDLE INSCRIBES SEISMIC SIGNATURE CONTINUOUSLY
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Richter Magnitude:</span>
            <input
              type="range"
              min="3.0"
              max="8.5"
              step="0.1"
              value={magnitude}
              onChange={(e) => setMagnitude(Number(e.target.value))}
              className="w-24 accent-rose-500"
            />
            <span>{magnitude}M</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerTectonicQuake}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
          >
            <Zap size={12} />
            <span>Trigger Tectonic Tremor</span>
          </button>
        </div>
      </div>
    </div>
  );
}
