import React, { useRef, useEffect, useState } from 'react';
import { Radio, Volume2, VolumeX, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment22RadarSonarSweep() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rpm, setRpm] = useState(24);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [phosphor, setPhosphor] = useState<'emerald' | 'amber' | 'cyan'>('emerald');
  const audioCtxRef = useRef<AudioContext | null>(null);

  const colors = {
    emerald: { line: '#10b981', glow: 'rgba(16, 185, 129, 0.8)', bgSweep: 'rgba(16, 185, 129, 0.15)' },
    amber: { line: '#f59e0b', glow: 'rgba(245, 158, 11, 0.8)', bgSweep: 'rgba(245, 158, 11, 0.15)' },
    cyan: { line: '#06b6d4', glow: 'rgba(6, 182, 212, 0.8)', bgSweep: 'rgba(6, 182, 212, 0.15)' },
  }[phosphor];

  const playPing = () => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio fallback
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.45;

    // Generate targets for "HELLO WORLD"
    const off = document.createElement('canvas');
    off.width = width;
    off.height = height;
    const offCtx = off.getContext('2d')!;
    offCtx.font = `bold ${Math.min(width / 9, 84)}px 'Syne', sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText('HELLO WORLD', centerX, centerY);

    const data = offCtx.getImageData(0, 0, width, height).data;
    const targets: { x: number; y: number; angle: number; dist: number; brightness: number }[] = [];

    for (let y = 10; y < height - 10; y += 12) {
      for (let x = 10; x < width - 10; x += 12) {
        if (data[(y * width + x) * 4 + 3] > 180) {
          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.hypot(dx, dy);
          let angle = Math.atan2(dy, dx);
          if (angle < 0) angle += Math.PI * 2;
          targets.push({ x, y, angle, dist, brightness: 0 });
        }
      }
    }

    let isRunning = true;
    let animId = 0;
    let sweepAngle = 0;
    let lastPing = 0;

    const render = () => {
      if (!isRunning) return;
      sweepAngle = (sweepAngle + (rpm * 0.0015)) % (Math.PI * 2);

      // Dark sonar scope backdrop
      ctx.fillStyle = '#030a08';
      ctx.fillRect(0, 0, width, height);

      // Concentric range rings
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.lineWidth = 1;
      for (let r = 50; r <= maxRadius; r += 50) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Compass crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius, centerY);
      ctx.lineTo(centerX + maxRadius, centerY);
      ctx.moveTo(centerX, centerY - maxRadius);
      ctx.lineTo(centerX, centerY + maxRadius);
      ctx.stroke();

      // Sweeping beam arc with gradient phosphor tail
      ctx.save();
      const sweepTailAngle = 0.4; // radians
      for (let a = 0; a < sweepTailAngle; a += 0.02) {
        const rayA = sweepAngle - a;
        ctx.strokeStyle = `rgba(16, 185, 129, ${(1 - a / sweepTailAngle) * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(rayA) * maxRadius, centerY + Math.sin(rayA) * maxRadius);
        ctx.stroke();
      }

      // Main beam line
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 2;
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(sweepAngle) * maxRadius, centerY + Math.sin(sweepAngle) * maxRadius);
      ctx.stroke();
      ctx.restore();

      // Update and draw radar echoes (targets)
      let hitTarget = false;
      targets.forEach((t) => {
        const diff = Math.abs(t.angle - sweepAngle);
        if (diff < 0.04 || Math.abs(diff - Math.PI * 2) < 0.04) {
          t.brightness = 1.0;
          hitTarget = true;
        } else {
          t.brightness = Math.max(0, t.brightness - 0.008);
        }

        if (t.brightness > 0.05) {
          ctx.beginPath();
          ctx.arc(t.x, t.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = colors.line;
          ctx.shadowColor = colors.glow;
          ctx.shadowBlur = t.brightness * 12;
          ctx.globalAlpha = t.brightness;
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (hitTarget && Date.now() - lastPing > 300) {
        lastPing = Date.now();
        playPing();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [rpm, phosphor, audioEnabled]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#030a08] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-emerald-400" />
          <span className="font-bold text-stone-200">STUDY 022</span> // NAVAL PPI SONAR SWEEP
        </div>
        <div className="flex items-center gap-4">
          <span>RANGE: 24 NAUTICAL MILES</span>
          <span>PPI SCAN: {rpm} RPM</span>
        </div>
      </div>

      {/* PPI Radar Screen */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-emerald-400 bg-stone-900/60 px-3 py-1.5 rounded backdrop-blur border border-emerald-900/60">
          BEAM ECHO INTERSECTS TARGET COORDINATES
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Sweep Velocity:</span>
            <input
              type="range"
              min="10"
              max="60"
              value={rpm}
              onChange={(e) => setRpm(Number(e.target.value))}
              className="w-24 accent-emerald-400"
            />
            <span>{rpm} RPM</span>
          </div>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200"
          >
            {audioEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{audioEnabled ? 'Sonar Ping ON' : 'Ping Muted'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {(['emerald', 'amber', 'cyan'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPhosphor(p)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                phosphor === p ? 'bg-stone-800 text-white font-bold border-stone-600' : 'border-stone-800 text-stone-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
