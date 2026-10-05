import React, { useRef, useEffect, useState } from 'react';
import { Atom, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment121JosephsonJunctionSQUID() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [magneticFluxPhi, setMagneticFluxPhi] = useState(1.5); // Flux quantum Phi_0
  const [biasCurrentMicroA, setBiasCurrentMicroA] = useState(8.0); // uA

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

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      // SQUID superconducting loop dimensions
      const loopR = 120;

      // Superconducting Loop Path
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, loopR, 0, Math.PI * 2);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 14;
      ctx.stroke();

      // Two Josephson Junction barrier gaps (Top and Bottom of loop)
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(cx - 12, cy - loopR - 10, 24, 20); // Junction 1
      ctx.fillRect(cx - 12, cy + loopR - 10, 24, 20); // Junction 2

      ctx.font = '10px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('JUNCTION A', cx, cy - loopR - 16);
      ctx.fillText('JUNCTION B', cx, cy + loopR + 24);

      // Magnetic Flux through center: Phi / Phi_0 (Magnetic flux quantum Phi_0 = h/2e ~ 2.067e-15 Wb)
      // Critical current modulation: I_c(Phi) = 2 * I_0 * |cos(pi * Phi / Phi_0)|
      const icNorm = Math.abs(Math.cos(Math.PI * magneticFluxPhi));
      const vVoltageOutMv = biasCurrentMicroA > 10 * icNorm ? (biasCurrentMicroA - 10 * icNorm) * 0.4 : 0;

      // Flux lines threading through loop center
      const numLines = Math.floor(magneticFluxPhi * 8);
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < numLines; i++) {
        const fa = (i / numLines) * Math.PI * 2;
        const fr = (i % 3 + 1) * 25;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(fa) * fr, cy + Math.sin(fa) * fr, 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Center Inscribed Specimen "HELLO WORLD"
      ctx.font = 'bold 50px "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 16;
      ctx.fillText('HELLO WORLD', cx, cy);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `DC SQUID INTERFEROMETER · FLUX Φ = ${magneticFluxPhi.toFixed(2)} Φ₀ (h/2e) · CRITICAL CURRENT I_c = ${(icNorm * 10).toFixed(1)} μA · V_OUT = ${vVoltageOutMv.toFixed(2)} mV`,
        cx,
        height - 24
      );
      ctx.restore();

      t += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [magneticFluxPhi, biasCurrentMicroA]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Atom className="text-cyan-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 121: SUPERCONDUCTING QUANTUM INTERFERENCE (SQUID)
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Brian Josephson 1962 Cooper Pair Tunneling & Magnetic Flux Quantization h/2e
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setMagneticFluxPhi(1.5);
              setBiasCurrentMicroA(8.0);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Zero Flux (0 Φ₀)</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-cyan-400" /> Magnetic Flux (Φ / Φ₀):
              </span>
              <span className="text-cyan-400 font-bold">{magneticFluxPhi.toFixed(2)} Φ₀</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="4.0"
              step="0.05"
              value={magneticFluxPhi}
              onChange={(e) => setMagneticFluxPhi(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Bias Current (μA):</span>
              <span className="text-cyan-400 font-bold">{biasCurrentMicroA.toFixed(1)} μA</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="16.0"
              step="0.5"
              value={biasCurrentMicroA}
              onChange={(e) => setBiasCurrentMicroA(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
