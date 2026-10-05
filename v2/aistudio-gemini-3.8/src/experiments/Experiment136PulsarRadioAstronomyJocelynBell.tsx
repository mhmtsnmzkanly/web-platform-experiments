import React, { useRef, useEffect, useState } from 'react';
import { Radio, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment136PulsarRadioAstronomyJocelynBell() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pulsePeriodS, setPulsePeriodS] = useState(1.337); // CP1919 period P = 1.337 seconds!
  const [signalGain, setSignalGain] = useState(1.5);

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

      // Dark interstellar radiotelescope console
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);

      // Stacked radio pulsar trace waterfall (Joy Division Unknown Pleasures aesthetic)
      const numTraces = 28;
      const traceSpacing = 12;
      const startY = 80;

      ctx.lineWidth = 1.4;

      for (let tr = 0; tr < numTraces; tr++) {
        const yBase = startY + tr * traceSpacing;
        const phaseShift = tr * 0.15 - (t / pulsePeriodS);

        ctx.strokeStyle = '#f8fafc';
        ctx.fillStyle = '#050508';
        ctx.beginPath();
        ctx.moveTo(120, yBase);

        for (let x = 120; x <= width - 120; x += 4) {
          const relX = (x - cx) / 45;
          // Gaussian radio pulse spike in center
          const pulseShape = Math.exp(-Math.pow(relX - Math.sin(phaseShift) * 2, 2)) * 32 * signalGain;
          const py = yBase - pulseShape;
          ctx.lineTo(x, py);
        }

        ctx.lineTo(width - 120, yBase);
        ctx.fill();
        ctx.stroke();
      }

      // Inscribed Center Specimen "HELLO WORLD"
      ctx.save();
      ctx.font = 'bold 50px "Syne", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fillText('HELLO WORLD', cx, 45);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 0;
      ctx.fillText(
        `JOCELYN BELL BURNELL 1967 CAMBRIDGE · PULSAR PSR B1919+21 · ROTATION PERIOD P = ${pulsePeriodS.toFixed(3)}s · WATERFALL SPECTROGRAM`,
        cx,
        height - 20
      );
      ctx.restore();

      t += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [pulsePeriodS, signalGain]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Radio className="text-white" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 136: 1967 JOCELYN BELL PSR B1919+21 RADIO PULSAR
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Rotating Neutron Star Lighthouse Beam & Stacked Radiometer Waterfall Profile
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPulsePeriodS(1.337);
              setSignalGain(1.5);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset 1.337s</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-white" /> Pulsar Rotation Period:
              </span>
              <span className="text-amber-400 font-bold">{pulsePeriodS.toFixed(3)} seconds</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.05"
              value={pulsePeriodS}
              onChange={(e) => setPulsePeriodS(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Radiometer Gain:</span>
              <span className="text-amber-400 font-bold">{signalGain.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={signalGain}
              onChange={(e) => setSignalGain(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
