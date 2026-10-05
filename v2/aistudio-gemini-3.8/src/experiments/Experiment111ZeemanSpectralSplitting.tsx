import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment111ZeemanSpectralSplitting() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [magneticFieldB, setMagneticFieldB] = useState(2.8); // Tesla
  const [polarizationMode, setPolarizationMode] = useState<'all' | 'sigma' | 'pi'>('all');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cx = width / 2;
    const cy = height / 2;

    // Dark high-resolution spectrograph focal plane
    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, width, height);

    // Normal Zeeman effect: energy shift delta_E = m_l * mu_B * B
    // Central pi component (delta_m = 0, unshifted, polarized || B)
    // Left/Right sigma components (delta_m = +-1, shifted by +- mu_B * B / h, circularly polarized)
    const splitDistance = magneticFieldB * 24; // px displacement

    const drawSpectralLine = (x: number, label: string, color: string, alpha: number) => {
      ctx.save();
      const grad = ctx.createLinearGradient(x - 6, 0, x + 6, 0);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(0.5, color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.fillRect(x - 8, 50, 16, height - 140);

      ctx.font = '10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, height - 70);
      ctx.restore();
    };

    // Render components based on polarization filter
    if (polarizationMode === 'all' || polarizationMode === 'sigma') {
      drawSpectralLine(cx - splitDistance, 'σ- (Δm = -1)', '#38bdf8', 0.85); // Left shifted
      drawSpectralLine(cx + splitDistance, 'σ+ (Δm = +1)', '#38bdf8', 0.85); // Right shifted
    }

    if (polarizationMode === 'all' || polarizationMode === 'pi') {
      drawSpectralLine(cx, 'π (Δm = 0)', '#f59e0b', 0.95); // Central unshifted
    }

    // Inscribed Typographic Core "HELLO WORLD"
    ctx.save();
    ctx.font = 'bold 58px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.fillText('HELLO WORLD', cx, cy - 30);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.shadowBlur = 0;
    ctx.fillText(
      `PIETER ZEEMAN 1896 · LARMOR FREQUENCY Δν = eB / (4πm_e) · FIELD B = ${magneticFieldB.toFixed(1)} TESLA · POLARIZATION: ${polarizationMode.toUpperCase()}`,
      cx,
      height - 24
    );
    ctx.restore();
  }, [magneticFieldB, polarizationMode]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Eye className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 111: ZEEMAN ATOMIC EMISSION SPECTRAL SPLITTING
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Pieter Zeeman 1896 Magnetic Dipole Quantization & Polarization Triplet
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setMagneticFieldB(2.8);
              setPolarizationMode('all');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Zero B-Field</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Magnetic Induction (B):
              </span>
              <span className="text-amber-400 font-bold">{magneticFieldB.toFixed(1)} Tesla</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="6.0"
              step="0.2"
              value={magneticFieldB}
              onChange={(e) => setMagneticFieldB(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Polarization Filter:</span>
              <span className="text-amber-400 font-bold uppercase">{polarizationMode}</span>
            </div>
            <div className="flex gap-2">
              {(['all', 'sigma', 'pi'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPolarizationMode(m)}
                  className={`flex-1 py-1.5 rounded border uppercase transition-all cursor-pointer ${
                    polarizationMode === m
                      ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
