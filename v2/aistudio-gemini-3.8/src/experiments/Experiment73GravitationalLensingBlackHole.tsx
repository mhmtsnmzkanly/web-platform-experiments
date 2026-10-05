import React, { useRef, useEffect, useState } from 'react';
import { Orbit, Sliders, RotateCcw, Sparkles } from 'lucide-react';

export default function Experiment73GravitationalLensingBlackHole() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [blackHoleMass, setBlackHoleMass] = useState(65);
  const [lensPosition, setLensPosition] = useState({ x: 0.5, y: 0.5 });
  const [showPhotonRing, setShowPhotonRing] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const bhX = width * lensPosition.x;
      const bhY = height * lensPosition.y;

      // Deep space void with distant starfield
      ctx.fillStyle = '#030408';
      ctx.fillRect(0, 0, width, height);

      // Distant stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 90; i++) {
        const sx = ((i * 137.5) % width);
        const sy = ((i * 223.1) % height);
        ctx.fillRect(sx, sy, 1, 1);
      }

      const einsteinRadius = blackHoleMass * 2.2;
      const eventHorizon = blackHoleMass * 0.45;

      // Draw background text "HELLO WORLD" with gravitational deflection warp
      // Deflection angle theta_hat = 4GM / (c^2 * b)
      const text = 'HELLO WORLD';
      ctx.save();
      ctx.font = `900 ${Math.min(width / 10, 76)}px "Syne", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Sample grid of background points to warp into Einstein rings
      const numSamples = 36;
      for (let i = 0; i < numSamples; i++) {
        const angle = (i / numSamples) * Math.PI * 2 + time * 0.15;
        const rOrig = einsteinRadius * 1.35;
        const gx = bhX + Math.cos(angle) * rOrig;
        const gy = bhY + Math.sin(angle) * (rOrig * 0.6);

        // Gravitational displacement
        const dx = gx - bhX;
        const dy = gy - bhY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const bend = (einsteinRadius * einsteinRadius) / dist;

        const warpedX = bhX + (dx / dist) * (dist + bend * 0.35);
        const warpedY = bhY + (dy / dist) * (dist + bend * 0.35);

        ctx.fillStyle = `hsla(${(i * 12 + time * 20) % 360}, 85%, 65%, 0.12)`;
        ctx.fillText(text, warpedX, warpedY);
      }

      // Unwarped background text in center
      ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.fillText(text, width / 2, height / 2);

      // Accretion Disk Doppler Boost Glow (relativistic beaming)
      const diskR = einsteinRadius * 2.1;
      const grad = ctx.createRadialGradient(bhX, bhY, eventHorizon, bhX, bhY, diskR);
      grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      grad.addColorStop(0.2, 'rgba(249, 115, 22, 0.85)');
      grad.addColorStop(0.5, 'rgba(234, 88, 12, 0.35)');
      grad.addColorStop(0.8, 'rgba(59, 130, 246, 0.15)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.translate(bhX, bhY);
      ctx.scale(1, 0.38);
      ctx.beginPath();
      ctx.arc(0, 0, diskR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      // Sharp Einstein Ring Light Arc
      if (showPhotonRing) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(bhX, bhY, einsteinRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#fdba74';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#fb923c';
        ctx.shadowBlur = 18;
        ctx.stroke();

        // Secondary inner photon orbit ring (3/2 r_s)
        ctx.beginPath();
        ctx.arc(bhX, bhY, eventHorizon * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#60a5fa';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }

      // Event Horizon Black Hole Shadow (Pure light absorption)
      ctx.save();
      ctx.beginPath();
      ctx.arc(bhX, bhY, eventHorizon, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      time += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [blackHoleMass, lensPosition, showPhotonRing]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0.1, Math.min(0.9, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0.1, Math.min(0.9, (e.clientY - rect.top) / rect.height));
    setLensPosition({ x, y });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Orbit className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 073: GENERAL RELATIVISTIC GRAVITATIONAL LENSING
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Schwarzschild Metric Geodesic Deflection & Einstein Ring Synthesis
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setBlackHoleMass(65);
              setLensPosition({ x: 0.5, y: 0.5 });
              setShowPhotonRing(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Lens</span>
          </button>
        </div>

        <div className="relative rounded-xl overflow-hidden border border-stone-800 bg-black cursor-crosshair">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            className="w-full h-[480px] block"
          />
          <div className="absolute bottom-3 left-4 text-[11px] font-mono text-stone-400 bg-stone-950/80 px-2.5 py-1 rounded border border-stone-800 pointer-events-none">
            Lens Center: ({(lensPosition.x * 100).toFixed(0)}%, {(lensPosition.y * 100).toFixed(0)}%) · Move cursor over viewport to steer black hole
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Black Hole Mass (M☉):
              </span>
              <span className="text-amber-400 font-bold">{blackHoleMass} M☉</span>
            </div>
            <input
              type="range"
              min="30"
              max="110"
              value={blackHoleMass}
              onChange={(e) => setBlackHoleMass(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Photon Orbit Ring:</span>
            <button
              onClick={() => setShowPhotonRing(!showPhotonRing)}
              className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                showPhotonRing
                  ? 'bg-amber-400/10 border-amber-400 text-amber-400'
                  : 'bg-stone-800 border-stone-700 text-stone-400'
              }`}
            >
              {showPhotonRing ? 'PHOTON RING ACTIVE' : 'PHOTON RING HIDDEN'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
