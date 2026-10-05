import React, { useRef, useEffect, useState } from 'react';
import { Cog, Sliders, RotateCcw, Sparkles } from 'lucide-react';

export default function Experiment150AntikytheraEclipsePredictor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [crankTurn, setCrankTurn] = useState(14); // crank turns (months)
  const [gearSpeed, setGearSpeed] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let localTurn = crankTurn;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);

      ctx.fillStyle = '#0a0d0b';
      ctx.fillRect(0, 0, width, height);

      if (autoRotate) {
        localTurn += 0.05 * gearSpeed;
      } else {
        localTurn = crankTurn;
      }

      const cx = width * 0.42;
      const cy = height * 0.48;

      // Antikythera 150th Milestone Masterpiece:
      // The Saros Eclipse Dial is a 4-turn spiral containing 223 synodic lunar months (~18 years 11 days).
      // Inside it lies the 54-year Exeligmos triple-Saros dial.
      // Driven by ancient Hellenistic bronze gears (epicyclic pin-and-slot anomaly mechanism).

      // Patina Bronze Dial Plate
      const dialRadius = 165;
      const bronzeGrad = ctx.createRadialGradient(cx - 30, cy - 30, 20, cx, cy, dialRadius);
      bronzeGrad.addColorStop(0, '#2e4338');
      bronzeGrad.addColorStop(0.5, '#192b23');
      bronzeGrad.addColorStop(1, '#0e1814');
      ctx.fillStyle = bronzeGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, dialRadius, 0, Math.PI * 2);
      ctx.fill();

      // Corroded Hellenistic Bronze Rim
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Verdigris oxidation patina marks
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.15)';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, dialRadius - 6, 0, Math.PI * 2);
      ctx.stroke();

      // Saros 4-turn Archimedean Spiral Groove
      const turns = 4;
      const spiralPts = 360;
      ctx.strokeStyle = '#854d0e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let p = 0; p <= spiralPts; p++) {
        const theta = (p / spiralPts) * turns * Math.PI * 2;
        const r = 55 + (p / spiralPts) * (dialRadius - 70);
        const sx = cx + Math.cos(theta) * r;
        const sy = cy + Math.sin(theta) * r;
        if (p === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Glyphs and tick marks for 223 lunar months
      ctx.fillStyle = '#ca8a04';
      for (let m = 0; m < 223; m += 4) {
        const frac = m / 223;
        const theta = frac * turns * Math.PI * 2;
        const r = 55 + frac * (dialRadius - 70);
        const mx = cx + Math.cos(theta) * r;
        const my = cy + Math.sin(theta) * r;

        ctx.beginPath();
        ctx.arc(mx, my, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Solar / Lunar Eclipse Glyphs (Σ = Selene / Lunar, H = Helios / Solar)
        if (m % 18 === 0 || m % 23 === 0) {
          ctx.font = '8px serif';
          ctx.fillStyle = m % 2 === 0 ? '#fde047' : '#f87171';
          ctx.fillText(m % 2 === 0 ? 'Σ' : 'H', mx + 3, my + 3);
        }
      }

      // Rotating Pointer Pointer with telescoping peg riding in spiral slot
      const currentMonth = (localTurn % 223);
      const pointerFrac = currentMonth / 223;
      const pointerTheta = pointerFrac * turns * Math.PI * 2;
      const pointerR = 55 + pointerFrac * (dialRadius - 70);

      // Bronze pointer arm
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const armEnd = dialRadius - 8;
      ctx.lineTo(cx + Math.cos(pointerTheta) * armEnd, cy + Math.sin(pointerTheta) * armEnd);
      ctx.stroke();

      // Peg sliding in groove
      const pegX = cx + Math.cos(pointerTheta) * pointerR;
      const pegY = cy + Math.sin(pointerTheta) * pointerR;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(pegX, pegY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner Exeligmos Subdial (3-phase 54-year cycle: +0 hr, +8 hr, +16 hr shift)
      const exRad = 38;
      ctx.fillStyle = '#14201a';
      ctx.beginPath();
      ctx.arc(cx, cy, exRad, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.stroke();

      const exCycle = Math.floor(localTurn / 223) % 3;
      ctx.fillStyle = '#fef08a';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('EXELIGMOS', cx, cy - 14);
      ctx.fillText(exCycle === 0 ? '0h' : exCycle === 1 ? '+8h' : '+16h', cx, cy + 18);
      ctx.textAlign = 'left';

      // Animated Differential Gear Mechanism on the right side
      const gearX = width * 0.77;
      const gearY = height * 0.38;

      const drawGear = (gx: number, gy: number, r: number, teeth: number, rot: number, col: string) => {
        ctx.fillStyle = col;
        ctx.beginPath();
        for (let i = 0; i < teeth; i++) {
          const a = rot + (i / teeth) * Math.PI * 2;
          const aNext = rot + ((i + 0.5) / teeth) * Math.PI * 2;
          const rOuter = r + 6;
          const rInner = r - 6;

          const x1 = gx + Math.cos(a) * rInner;
          const y1 = gy + Math.sin(a) * rInner;
          const x2 = gx + Math.cos(a) * rOuter;
          const y2 = gy + Math.sin(a) * rOuter;
          const x3 = gx + Math.cos(aNext) * rOuter;
          const y3 = gy + Math.sin(aNext) * rOuter;
          const x4 = gx + Math.cos(aNext) * rInner;
          const y4 = gy + Math.sin(aNext) * rInner;

          if (i === 0) ctx.moveTo(x1, y1);
          else ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x3, y3);
          ctx.lineTo(x4, y4);
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Gear axle
        ctx.fillStyle = '#0a0d0b';
        ctx.beginPath();
        ctx.arc(gx, gy, 8, 0, Math.PI * 2);
        ctx.fill();
      };

      // 4 Intermeshed Ancient Gears
      drawGear(gearX - 50, gearY, 44, 24, localTurn * 0.8, '#854d0e');
      drawGear(gearX + 30, gearY - 30, 36, 19, -localTurn * 0.8 * (24 / 19), '#713f12');
      drawGear(gearX + 30, gearY + 50, 48, 26, localTurn * 0.8 * (24 / 26), '#a16207');

      // Saros Eclipse Calculation Telemetry Card
      const cardX = width * 0.65;
      const cardY = height * 0.62;
      const cardW = width * 0.31;
      const cardH = 135;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cardX, cardY, cardW, cardH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      const isSolar = Math.floor(currentMonth) % 6 === 0;
      const isLunar = Math.floor(currentMonth) % 5 === 0;

      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px monospace';
      ctx.fillText('ANTIKYTHERA EPICYCLIC COMPUTER', cardX + 14, cardY + 22);

      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`Synodic Month: ${currentMonth.toFixed(1)} / 223`, cardX + 14, cardY + 44);
      ctx.fillText(`Saros Period: 6585.3211 Days (~18.03 yr)`, cardX + 14, cardY + 64);
      ctx.fillText(`Exeligmos Shift: ${exCycle * 8} Hours Westward`, cardX + 14, cardY + 84);

      if (isSolar || isLunar) {
        ctx.fillStyle = isSolar ? '#eab308' : '#ec4899';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`★ PREDICTED ECLIPSE: ${isSolar ? 'SOLAR (HELIOS)' : 'LUNAR (SELENE)'}`, cardX + 14, cardY + 112);
      } else {
        ctx.fillStyle = '#64748b';
        ctx.font = '11px monospace';
        ctx.fillText('○ Orbit inter-nodal crossing normal', cardX + 14, cardY + 112);
      }

      // Bottom Typography
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#4ade80';
      ctx.font = '12px monospace';
      ctx.fillText('150TH MASTER MILESTONE · ANTIKYTHERA SAROS & EXELIGMOS ECLIPSE PREDICTOR', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [crankTurn, gearSpeed, autoRotate]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-yellow-400">
            <span className="flex items-center gap-1.5 font-mono"><Cog size={14} /> Manual Crown Crank</span>
            <span className="font-mono">{crankTurn.toFixed(1)} Months</span>
          </div>
          <input
            type="range"
            min="0"
            max="223"
            step="0.5"
            value={crankTurn}
            onChange={(e) => {
              setAutoRotate(false);
              setCrankTurn(Number(e.target.value));
            }}
            className="accent-yellow-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-emerald-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Gear Rotation Speed</span>
            <span className="font-mono">{gearSpeed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={gearSpeed}
            onChange={(e) => setGearSpeed(Number(e.target.value))}
            className="accent-emerald-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Sparkles size={14} /> Drive Mode</span>
            <span className="font-mono">{autoRotate ? 'AUTOMATIC CLOCKWORK' : 'MANUAL CRANK'}</span>
          </div>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`mt-1 py-1.5 text-xs font-mono rounded border transition-colors ${
              autoRotate
                ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 font-bold'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
            }`}
          >
            {autoRotate ? 'PAUSE CLOCKWORK DRIVE' : 'RESUME CLOCKWORK DRIVE'}
          </button>
        </div>
      </div>
    </div>
  );
}
