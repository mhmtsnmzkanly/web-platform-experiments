import React, { useRef, useEffect, useState } from 'react';
import { Magnet, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment91SuperconductingMeissnerLevitation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [temperatureK, setTemperatureK] = useState(77); // Kelvin (liquid nitrogen)
  const [levitationHeight, setLevitationHeight] = useState(25); // mm
  const [fluxPinningActive, setFluxPinningActive] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let t = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height / 2;

      // Dark cryogenic laboratory
      ctx.fillStyle = '#06090e';
      ctx.fillRect(0, 0, width, height);

      const tcCritical = 93; // YBCO critical temperature in Kelvin
      const isSuperconducting = temperatureK < tcCritical;

      // Permanent magnetic track along the base
      const trackW = 540;
      const trackH = 24;
      const trackX = cx - trackW / 2;
      const trackY = cy + 60;

      ctx.fillStyle = '#334155';
      ctx.fillRect(trackX, trackY, trackW, trackH);
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(trackX, trackY, trackW, trackH);

      // Alternating NdFeB magnet track poles
      const numPoles = 18;
      const poleW = trackW / numPoles;
      for (let i = 0; i < numPoles; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#3b82f6';
        ctx.fillRect(trackX + i * poleW, trackY, poleW, trackH);
      }

      // Magnetic flux lines expelling around the superconductor (Meissner Effect)
      if (isSuperconducting) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';

        for (let i = 0; i < 20; i++) {
          const fx = trackX + (i / 20) * trackW;
          ctx.beginPath();
          ctx.moveTo(fx, trackY);

          // Arch over levitating puck
          const puckCenter = cx + Math.sin(t * 0.8) * 140;
          const puckY = trackY - levitationHeight * 2;

          ctx.bezierCurveTo(
            fx,
            puckY + 40,
            puckCenter + (fx - cx) * 0.4,
            puckY - 30,
            fx + 20,
            trackY
          );
          ctx.stroke();
        }
      }

      // Levitating Superconducting YBCO Puck
      const puckX = cx + Math.sin(t * 0.8) * 140;
      const puckActualY = isSuperconducting
        ? trackY - levitationHeight * 2.2 + (Math.sin(t * 3) * 2) // Floating oscillation
        : trackY - 12; // Resting flat on track (normal state)

      // Cryogenic nitrogen vapor mist
      if (isSuperconducting) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        for (let m = 0; m < 14; m++) {
          const mx = puckX + (Math.random() - 0.5) * 80;
          const my = puckActualY + 10 + Math.random() * 20;
          ctx.beginPath();
          ctx.arc(mx, my, Math.random() * 8 + 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // YBCO Pellet Disk
      ctx.fillStyle = isSuperconducting ? '#1e293b' : '#475569';
      ctx.fillRect(puckX - 45, puckActualY - 12, 90, 24);
      ctx.strokeStyle = isSuperconducting ? '#38bdf8' : '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(puckX - 45, puckActualY - 12, 90, 24);

      // Superconducting core label
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('YBCO (77K)', puckX, puckActualY + 4);

      // Floating Typographic Specimen "HELLO WORLD"
      ctx.save();
      ctx.font = 'bold 52px "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = isSuperconducting ? '#38bdf8' : 'transparent';
      ctx.shadowBlur = 16;
      ctx.fillText('HELLO WORLD', cx, cy - 80);

      ctx.font = '11px monospace';
      ctx.fillStyle = isSuperconducting ? '#34d399' : '#f87171';
      ctx.shadowBlur = 0;
      ctx.fillText(
        isSuperconducting
          ? `MEISSNER EFFECT ACTIVE (T = ${temperatureK}K < Tc 93K) · QUANTUM FLUX PINNED`
          : `NORMAL RESISTIVE STATE (T = ${temperatureK}K ≥ Tc 93K) · NO LEVITATION`,
        cx,
        cy - 40
      );
      ctx.restore();

      t += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [temperatureK, levitationHeight, fluxPinningActive]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Magnet className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 091: YBCO SUPERCONDUCTING MEISSNER LEVITATION
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Type-II Quantum Flux Pinning & Liquid Nitrogen (77K) Cryostage
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setTemperatureK(77);
              setLevitationHeight(25);
              setFluxPinningActive(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Refill LN2</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Pellet Cryo Temperature:
              </span>
              <span className="text-amber-400 font-bold">{temperatureK} K</span>
            </div>
            <input
              type="range"
              min="50"
              max="140"
              value={temperatureK}
              onChange={(e) => setTemperatureK(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Levitation Clearance Height:</span>
              <span className="text-amber-400 font-bold">{levitationHeight} mm</span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              value={levitationHeight}
              onChange={(e) => setLevitationHeight(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
