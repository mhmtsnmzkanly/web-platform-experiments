import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment134GaborHolographicWavefront() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [coherenceLengthMm, setCoherenceLengthMm] = useState(12); // mm
  const [reconstructionAngleDeg, setReconstructionAngleDeg] = useState(35);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cx = width / 2;
    const cy = height / 2;

    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, width, height);

    // Dennis Gabor 1948 Hologram:
    // Interference between reference beam R and object wave O: I = |R + O|^2 = |R|^2 + |O|^2 + R*O + R*O*
    const angleRad = (reconstructionAngleDeg * Math.PI) / 180;

    // Render dense holographic fringe pattern on photographic emulsion plate
    const plateW = width - 120;
    const plateH = height - 120;
    const px0 = 60;
    const py0 = 60;

    ctx.save();
    ctx.beginPath();
    ctx.rect(px0, py0, plateW, plateH);
    ctx.clip();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px0, py0, plateW, plateH);

    // Microscopic interference fringes
    const numFringes = 64;
    for (let i = 0; i < numFringes; i++) {
      const fx = px0 + (i / numFringes) * plateW;
      const waveShift = Math.sin(i * 0.4 + angleRad) * (coherenceLengthMm * 1.5);

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(fx + waveShift, py0);
      ctx.lineTo(fx - waveShift, py0 + plateH);
      ctx.stroke();
    }

    // Reconstructed 3D Virtual Image "HELLO WORLD" floating in space
    ctx.font = 'bold 58px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 22;
    ctx.fillText('HELLO WORLD', cx, cy);

    ctx.restore();

    // Photographic Emulsion Plate Glass Border
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.strokeRect(px0, py0, plateW, plateH);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText(
      `DENNIS GABOR 1948 NOBEL HOLOGRAM · REFERENCE & OBJECT WAVEFRONTS · COHERENCE ${coherenceLengthMm} mm · ILLUMINATION θ = ${reconstructionAngleDeg}°`,
      cx,
      height - 20
    );
  }, [coherenceLengthMm, reconstructionAngleDeg]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Eye className="text-cyan-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 134: DENNIS GABOR 1948 WAVEFRONT RECONSTRUCTION HOLOGRAM
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Coherent Laser Reference Beam & Photographic Emulsion Micro-Fringes
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCoherenceLengthMm(12);
              setReconstructionAngleDeg(35);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Re-Align Beam</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-cyan-400" /> Reference Angle (θ):
              </span>
              <span className="text-cyan-400 font-bold">{reconstructionAngleDeg}°</span>
            </div>
            <input
              type="range"
              min="10"
              max="75"
              value={reconstructionAngleDeg}
              onChange={(e) => setReconstructionAngleDeg(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Laser Coherence Length:</span>
              <span className="text-cyan-400 font-bold">{coherenceLengthMm} mm</span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              value={coherenceLengthMm}
              onChange={(e) => setCoherenceLengthMm(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
