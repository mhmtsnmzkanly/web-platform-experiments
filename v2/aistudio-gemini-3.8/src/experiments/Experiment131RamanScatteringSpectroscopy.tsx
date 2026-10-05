import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment131RamanScatteringSpectroscopy() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [laserIntensityMw, setLaserIntensityMw] = useState(100);
  const [vibrationalModeCm, setVibrationalModeCm] = useState(520); // 520 cm^-1 Silicon peak

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cx = width / 2;
    const cy = height / 2;

    ctx.fillStyle = '#06070a';
    ctx.fillRect(0, 0, width, height);

    // Raman inelastic scattering spectrum:
    // Rayleigh scattering: elastic, unshifted, intense central laser peak
    // Stokes lines: lower energy, redshifted, photon gives energy to molecular phonon
    // Anti-Stokes lines: higher energy, blueshifted, photon absorbs molecular phonon
    const rayleighX = cx;

    const drawSpectralPeak = (x: number, heightPx: number, color: string, label: string) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      for (let px = x - 30; px <= x + 30; px++) {
        const dx = (px - x) / 8;
        // Lorentzian spectral lineshape: I = I_0 / (1 + dx^2)
        const py = cy + 120 - (heightPx / (1 + dx * dx));
        if (px === x - 30) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.font = '10px monospace';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.fillText(label, x, cy + 140);
      ctx.restore();
    };

    const stokesOffset = vibrationalModeCm * 0.28;

    // Rayleigh peak (laser 532nm Green)
    drawSpectralPeak(rayleighX, 220 * (laserIntensityMw / 100), '#22c55e', 'RAYLEIGH (ELASTIC)');

    // Stokes peak (Redshifted)
    drawSpectralPeak(rayleighX + stokesOffset, 120 * (laserIntensityMw / 100), '#f43f5e', `STOKES (-${vibrationalModeCm} cm⁻¹)`);

    // Anti-Stokes peak (Blueshifted, Boltzmann temperature suppressed)
    drawSpectralPeak(rayleighX - stokesOffset, 45 * (laserIntensityMw / 100), '#38bdf8', `ANTI-STOKES (+${vibrationalModeCm} cm⁻¹)`);

    // Center Inscribed Specimen "HELLO WORLD"
    ctx.save();
    ctx.font = 'bold 50px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 12;
    ctx.fillText('HELLO WORLD', cx, cy - 80);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.shadowBlur = 0;
    ctx.fillText(
      `C. V. RAMAN 1928 NOBEL DISCOVERY · INELASTIC PHONON SCATTERING · VIBRATIONAL MODE Δν = ${vibrationalModeCm} cm⁻¹`,
      cx,
      height - 20
    );
    ctx.restore();
  }, [laserIntensityMw, vibrationalModeCm]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Eye className="text-emerald-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 131: C. V. RAMAN INELASTIC PHOTON SCATTERING
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                1928 Molecular Phonon Spectroscopy & Stokes / Anti-Stokes Lorentzian Peaks
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setLaserIntensityMw(100);
              setVibrationalModeCm(520);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Calibrate 532nm</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-emerald-400" /> Raman Shift (cm⁻¹):
              </span>
              <span className="text-emerald-400 font-bold">{vibrationalModeCm} cm⁻¹</span>
            </div>
            <input
              type="range"
              min="200"
              max="1100"
              step="20"
              value={vibrationalModeCm}
              onChange={(e) => setVibrationalModeCm(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>532nm Pump Laser Power:</span>
              <span className="text-emerald-400 font-bold">{laserIntensityMw} mW</span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              step="10"
              value={laserIntensityMw}
              onChange={(e) => setLaserIntensityMw(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
