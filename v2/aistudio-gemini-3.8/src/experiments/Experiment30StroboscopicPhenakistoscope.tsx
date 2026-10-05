import React, { useRef, useEffect, useState } from 'react';
import { Disc, RotateCw, RotateCcw, Sliders, Play, Pause } from 'lucide-react';

export default function Experiment30StroboscopicPhenakistoscope() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rpm, setRpm] = useState(30);
  const [isPlaying, setIsPlaying] = useState(true);
  const [numSectors, setNumSectors] = useState(12);
  const [strobeFlash, setStrobeFlash] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.44;

    let isRunning = true;
    let animId = 0;
    let currentAngle = 0;

    const render = () => {
      if (!isRunning) return;

      if (isPlaying) {
        currentAngle = (currentAngle + (rpm * Math.PI * 2) / (60 * 60)) % (Math.PI * 2);
      }

      // Victorian dark walnut cabinet parlor background
      ctx.fillStyle = '#100c0a';
      ctx.fillRect(0, 0, width, height);

      // Draw Outer Phenakistoscope Cardboard Disc
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(currentAngle);

      // Cardboard disc base
      ctx.fillStyle = '#F5EFE6';
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#2c221e';
      ctx.lineWidth = 4;
      ctx.stroke();

      const sectorAngle = (Math.PI * 2) / numSectors;

      // Draw Sector Animation Frames
      for (let i = 0; i < numSectors; i++) {
        const a = i * sectorAngle;
        ctx.save();
        ctx.rotate(a);

        // Radial dividing rule
        ctx.strokeStyle = 'rgba(44, 34, 30, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(radius, 0);
        ctx.stroke();

        // Peripheral Viewing Shutter Slit
        ctx.fillStyle = '#100c0a';
        ctx.fillRect(radius - 22, -4, 22, 8);

        // Kinetic typography phase inside sector
        const phaseScale = 0.7 + Math.sin((i / numSectors) * Math.PI * 2) * 0.3;
        const phaseY = -radius * 0.65;

        ctx.translate(0, phaseY);
        ctx.rotate(Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `bold ${Math.round(18 * phaseScale)}px 'Instrument Serif', Georgia, serif`;
        ctx.fillStyle = '#2c221e';
        ctx.fillText('HELLO WORLD', 0, 0);

        ctx.restore();
      }

      // Brass Center Axle Spindle
      const brassGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 18);
      brassGrad.addColorStop(0, '#fef08a');
      brassGrad.addColorStop(0.7, '#ca8a04');
      brassGrad.addColorStop(1, '#854d0e');
      ctx.fillStyle = brassGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#422006';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();

      // Optical Mirror Aperture Window (Fixed viewing slot at 12 o'clock)
      ctx.save();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - 40, centerY - radius - 15, 80, 40);
      ctx.fillStyle = 'rgba(202, 138, 4, 0.15)';
      ctx.fillRect(centerX - 40, centerY - radius - 15, 80, 40);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [rpm, isPlaying, numSectors, strobeFlash]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#100c0a] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Disc size={14} className="text-amber-400" />
          <span className="font-bold text-stone-200">STUDY 030</span> // 1832 VICTORIAN PHENAKISTOSCOPE DISC
        </div>
        <div className="flex items-center gap-4">
          <span>PERSISTENCE OF VISION: JOSEPH PLATEAU</span>
          <span>SPEED: {rpm} RPM</span>
        </div>
      </div>

      {/* Phenakistoscope Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-amber-200/90 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          SPINNING SLOTTED DISC PRODUCES CINEMATIC STROBOSCOPIC PERSISTENCE
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition-colors ${
              isPlaying ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
            }`}
          >
            {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
            <span>{isPlaying ? 'PAUSE ROTATION' : 'SPIN DISC'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Rotation Velocity:</span>
            <input
              type="range"
              min="10"
              max="90"
              value={rpm}
              onChange={(e) => setRpm(Number(e.target.value))}
              className="w-24 accent-amber-400"
            />
            <span>{rpm} RPM</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Slit Sectors:</span>
            {[8, 12, 16].map((s) => (
              <button
                key={s}
                onClick={() => setNumSectors(s)}
                className={`px-2.5 py-1 rounded text-[11px] border transition-all ${
                  numSectors === s ? 'bg-amber-400 text-stone-950 font-bold border-amber-300' : 'border-stone-800 text-stone-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
