import React, { useRef, useEffect, useState } from 'react';
import { Zap, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment87PencilLeadGraphiteCircuit() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [supplyVoltage, setSupplyVoltage] = useState(9.0); // Volts DC
  const [graphiteSoftness, setGraphiteSoftness] = useState<'2B' | '4B' | '6B' | '9B'>('9B');
  const [probeDistance, setProbeDistance] = useState(120); // mm

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cx = width / 2;
    const cy = height / 2;

    // Textured cotton rag paper backdrop
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, width, height);

    // Graph grid lines
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Heavy hand-drawn graphite carbon traces spelling "HELLO WORLD"
    ctx.save();
    ctx.font = '900 68px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Graphite sheen
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#44403c';
    ctx.strokeText('HELLO WORLD', cx, cy);

    ctx.fillStyle = '#292524';
    ctx.fillText('HELLO WORLD', cx, cy);

    // Conductivity calculation based on graphite grade and distance
    const gradeMultiplier = graphiteSoftness === '9B' ? 0.35 : graphiteSoftness === '6B' ? 0.6 : graphiteSoftness === '4B' ? 1.0 : 1.8;
    const resistanceOhms = Math.round(probeDistance * 12 * gradeMultiplier);
    const currentMilliAmps = ((supplyVoltage / (resistanceOhms + 100)) * 1000).toFixed(1);

    // Illuminated surface-mount LEDs along the conductive graphite track
    const ledPositions = [
      { x: cx - 280, y: cy - 25 },
      { x: cx - 180, y: cy + 20 },
      { x: cx - 60, y: cy - 20 },
      { x: cx + 60, y: cy + 20 },
      { x: cx + 180, y: cy - 25 },
      { x: cx + 280, y: cy + 20 },
    ];

    const ledBrightness = Math.min(1.0, Number(currentMilliAmps) / 25);

    ledPositions.forEach((led) => {
      // Glow halo
      const grad = ctx.createRadialGradient(led.x, led.y, 2, led.x, led.y, 28);
      grad.addColorStop(0, `rgba(234, 179, 8, ${ledBrightness * 0.9})`);
      grad.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(led.x, led.y, 28, 0, Math.PI * 2);
      ctx.fill();

      // SMD LED chip
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(led.x - 4, led.y - 3, 8, 6);
    });

    // Copper probe alligator clips
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - probeDistance, cy + 80);
    ctx.lineTo(cx - probeDistance, cy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + probeDistance, cy + 80);
    ctx.lineTo(cx + probeDistance, cy);
    ctx.stroke();

    // Multimeter Readout Display HUD
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(cx - 160, cy + 100, 320, 70);
    ctx.strokeStyle = '#44403c';
    ctx.strokeRect(cx - 160, cy + 100, 320, 70);

    ctx.font = 'bold 15px monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.textAlign = 'left';
    ctx.fillText(`CARBON RESISTANCE: ${resistanceOhms} Ω`, cx - 140, cy + 124);
    ctx.fillText(`CIRCUIT CURRENT:   ${currentMilliAmps} mA`, cx - 140, cy + 144);
    ctx.fillText(`OHM'S LAW: V = I × R (${supplyVoltage}V)`, cx - 140, cy + 162);
    ctx.restore();
  }, [supplyVoltage, graphiteSoftness, probeDistance]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Zap className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 087: HAND-DRAWN GRAPHITE CARBON PENCIL CIRCUIT
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Ohmic Sheet Resistance on Rag Paper & Conductive SMD LED Array
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSupplyVoltage(9.0);
              setGraphiteSoftness('9B');
              setProbeDistance(120);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Probes</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Graphite Hardness Grade:</span>
              <span className="text-amber-400 font-bold">{graphiteSoftness}</span>
            </div>
            <div className="flex gap-2">
              {(['2B', '4B', '6B', '9B'] as const).map((grade) => (
                <button
                  key={grade}
                  onClick={() => setGraphiteSoftness(grade)}
                  className={`flex-1 py-1.5 rounded border transition-all cursor-pointer ${
                    graphiteSoftness === grade
                      ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> DC Power Supply:
              </span>
              <span className="text-amber-400 font-bold">{supplyVoltage.toFixed(1)} V</span>
            </div>
            <input
              type="range"
              min="3"
              max="24"
              step="0.5"
              value={supplyVoltage}
              onChange={(e) => setSupplyVoltage(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Probe Spacing:</span>
              <span className="text-amber-400 font-bold">{probeDistance} mm</span>
            </div>
            <input
              type="range"
              min="50"
              max="220"
              value={probeDistance}
              onChange={(e) => setProbeDistance(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
