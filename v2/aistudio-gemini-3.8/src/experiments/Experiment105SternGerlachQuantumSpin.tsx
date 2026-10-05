import React, { useRef, useEffect, useState } from 'react';
import { Atom, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment105SternGerlachQuantumSpin() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fieldGradientDBZ, setFieldGradientDBZ] = useState(4.5); // T/cm dB_z/dz
  const [spinMeasurementCount, setSpinMeasurementCount] = useState(140);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cx = width / 2;
    const cy = height / 2;

    // Dark vacuum tube spectrometer stage
    ctx.fillStyle = '#06070c';
    ctx.fillRect(0, 0, width, height);

    // Inhomogeneous Magnet Pole Pieces (Pointed North knife-edge and grooved South)
    const magnetLeft = 140;
    const magnetRight = 420;

    // Top pointed pole piece (North)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(magnetLeft, 40);
    ctx.lineTo(magnetRight, 40);
    ctx.lineTo((magnetLeft + magnetRight) / 2, cy - 40);
    ctx.closePath();
    ctx.fill();
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('N (POINTED APEX)', (magnetLeft + magnetRight) / 2 - 50, 70);

    // Bottom grooved pole piece (South)
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(magnetLeft, cy + 40, magnetRight - magnetLeft, 80);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('S (GROOVED FLAT)', (magnetLeft + magnetRight) / 2 - 50, cy + 85);

    // Oven source emitting neutral silver (Ag) atom thermal beam
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(40, cy - 15, 50, 30);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Ag OVEN', 44, cy + 4);

    // Quantum beam splitting through the magnet: F_z = mu_z * (dB_z / dz)
    // Pure spin quantization: Sz = +hbar/2 or -hbar/2 (NO classical continuum!)
    const detectorX = width - 260;

    // Draw particle trajectories
    ctx.lineWidth = 1.5;
    for (let i = 0; i < spinMeasurementCount; i++) {
      const isSpinUp = i % 2 === 0;
      const deflection = (isSpinUp ? -1 : 1) * (fieldGradientDBZ * 12 + (Math.random() - 0.5) * 4);

      ctx.strokeStyle = isSpinUp ? 'rgba(239, 68, 68, 0.45)' : 'rgba(59, 130, 246, 0.45)';
      ctx.beginPath();
      ctx.moveTo(90, cy);
      ctx.lineTo(magnetLeft, cy);
      // Quad curve deflection
      ctx.quadraticCurveTo((magnetLeft + magnetRight) / 2, cy, detectorX, cy + deflection);
      ctx.stroke();
    }

    // Glass detector condensation plate at the right
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(detectorX, 40, 20, height - 80);
    ctx.strokeStyle = '#64748b';
    ctx.strokeRect(detectorX, 40, 20, height - 80);

    // Two distinct silver condensation deposits (Spin Up and Spin Down)
    const splitOffset = fieldGradientDBZ * 12;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 12;
    ctx.fillRect(detectorX - 2, cy - splitOffset - 15, 6, 30);

    ctx.shadowColor = '#3b82f6';
    ctx.fillRect(detectorX - 2, cy + splitOffset - 15, 6, 30);

    // Detector plate typography labels "HELLO WORLD"
    ctx.save();
    ctx.font = 'bold 36px "Syne", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f87171';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 8;
    ctx.fillText('HELLO', detectorX + 35, cy - splitOffset);

    ctx.fillStyle = '#60a5fa';
    ctx.shadowColor = '#3b82f6';
    ctx.fillText('WORLD', detectorX + 35, cy + splitOffset);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.shadowBlur = 0;
    ctx.fillText(`STERN-GERLACH 1922 · DISCRETE SPATIAL QUANTIZATION Sz = ±ℏ/2`, 60, height - 20);
    ctx.restore();
  }, [fieldGradientDBZ, spinMeasurementCount]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Atom className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 105: STERN-GERLACH QUANTUM SPIN QUANTIZATION
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Otto Stern & Walther Gerlach 1922 Inhomogeneous Magnetic Field Splitting
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setFieldGradientDBZ(4.5);
              setSpinMeasurementCount(140);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Gradient</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Magnetic Gradient ∂Bz/∂z:
              </span>
              <span className="text-amber-400 font-bold">{fieldGradientDBZ.toFixed(1)} T/cm</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.5"
              value={fieldGradientDBZ}
              onChange={(e) => setFieldGradientDBZ(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Silver Atom Flux Density:</span>
              <span className="text-amber-400 font-bold">{spinMeasurementCount} atoms</span>
            </div>
            <input
              type="range"
              min="40"
              max="300"
              value={spinMeasurementCount}
              onChange={(e) => setSpinMeasurementCount(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
