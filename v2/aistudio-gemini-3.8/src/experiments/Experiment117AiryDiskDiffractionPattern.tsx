import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment117AiryDiskDiffractionPattern() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pinholeDiameterD, setPinholeDiameterD] = useState(2.5); // mm aperture
  const [monochromeWavelength, setMonochromeWavelength] = useState<'emerald' | 'crimson' | 'violet'>('emerald');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cx = width / 2;
    const cy = height / 2;

    ctx.fillStyle = '#050609';
    ctx.fillRect(0, 0, width, height);

    // Airy disk diffraction intensity: I(theta) = I_0 * [2 * J1(x) / x]^2
    // Angular radius of first dark ring: theta = 1.22 * lambda / D
    const lambdaScale = monochromeWavelength === 'crimson' ? 650 : monochromeWavelength === 'emerald' ? 532 : 405;
    const airyRadiusPx = (1.22 * lambdaScale) / (pinholeDiameterD * 2.8);

    const colors = {
      emerald: { base: 'rgba(52, 211, 153', hex: '#34d399' },
      crimson: { base: 'rgba(244, 63, 94', hex: '#f43f5e' },
      violet: { base: 'rgba(168, 85, 247', hex: '#a855f7' },
    };

    const activeCol = colors[monochromeWavelength];

    // Draw concentric Bessel diffraction rings
    const maxR = Math.min(width, height) * 0.44;

    for (let r = maxR; r >= 0; r -= 2) {
      // Approximation of Bessel J1(x)/x squared
      const x = (r / airyRadiusPx) * 3.83;
      const bessel = x === 0 ? 1.0 : (2 * Math.sin(x)) / (x * x);
      const intensity = Math.min(1.0, bessel * bessel);

      ctx.fillStyle = `${activeCol.base}, ${intensity * 0.9})`;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Central bright Airy disk core
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, airyRadiusPx);
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.5, activeCol.hex);
    coreGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, airyRadiusPx, 0, Math.PI * 2);
    ctx.fill();

    // Central Typographic Watermark "HELLO WORLD"
    ctx.save();
    ctx.font = 'bold 54px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#050609';
    ctx.fillText('HELLO WORLD', cx, cy);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(
      `SIR GEORGE AIRY 1835 · BESSEL FUNCTION [2J1(x)/x]² · RAYLEIGH CRITERION θ = 1.22 λ/D · AIRY RADIUS ${airyRadiusPx.toFixed(1)}px`,
      cx,
      height - 24
    );
    ctx.restore();
  }, [pinholeDiameterD, monochromeWavelength]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Eye className="text-emerald-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 117: SIR GEORGE AIRY 1835 APERTURE DIFFRACTION PATTERN
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Circular Pupil Rayleigh Limit θ = 1.22·λ/D & Concentric Bessel Rings
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPinholeDiameterD(2.5);
              setMonochromeWavelength('emerald');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Aperture</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-emerald-400" /> Pinhole Aperture (D):
              </span>
              <span className="text-emerald-400 font-bold">{pinholeDiameterD.toFixed(1)} mm</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.2"
              value={pinholeDiameterD}
              onChange={(e) => setPinholeDiameterD(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Coherent Laser Wavelength:</span>
              <span className="text-emerald-400 font-bold uppercase">{monochromeWavelength}</span>
            </div>
            <div className="flex gap-2">
              {(['violet', 'emerald', 'crimson'] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => setMonochromeWavelength(w)}
                  className={`flex-1 py-1.5 rounded border uppercase transition-all cursor-pointer ${
                    monochromeWavelength === w
                      ? 'bg-emerald-400 text-stone-950 font-bold border-emerald-400'
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
