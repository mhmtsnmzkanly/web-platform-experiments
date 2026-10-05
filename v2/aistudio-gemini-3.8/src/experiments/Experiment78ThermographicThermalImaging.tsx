import React, { useRef, useEffect, useState } from 'react';
import { Flame, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment78ThermographicThermalImaging() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [palette, setPalette] = useState<'ironbow' | 'rainbow' | 'arctic' | 'whiteHot'>('ironbow');
  const [ambientTemp, setAmbientTemp] = useState(21.5);
  const [coreTemp, setCoreTemp] = useState(78.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cx = width / 2;
    const cy = height / 2;

    // Thermal sensor noise floor
    ctx.fillStyle = '#0f051d';
    ctx.fillRect(0, 0, width, height);

    // FLIR false color palettes lookup function
    const getFalseColor = (normTemp: number) => {
      const val = Math.max(0, Math.min(1, normTemp));
      if (palette === 'ironbow') {
        // Black -> Purple -> Orange -> Yellow -> White
        if (val < 0.25) return `rgb(${val * 4 * 60}, 0, ${val * 4 * 140})`;
        if (val < 0.55) return `rgb(${60 + (val - 0.25) * 3.3 * 180}, 0, ${140 - (val - 0.25) * 3.3 * 100})`;
        if (val < 0.85) return `rgb(240, ${(val - 0.55) * 3.3 * 200}, 20)`;
        return `rgb(255, 255, ${(val - 0.85) * 6.6 * 255})`;
      } else if (palette === 'arctic') {
        // Dark blue -> Cyan -> White -> Gold
        return `hsl(${220 - val * 180}, 90%, ${15 + val * 75}%)`;
      } else if (palette === 'whiteHot') {
        const c = Math.floor(val * 255);
        return `rgb(${c}, ${c}, ${c})`;
      } else {
        // Rainbow
        return `hsl(${(1 - val) * 270}, 100%, 50%)`;
      }
    };

    // Render thermal bloom around typographic heated brass specimen
    const radG = ctx.createRadialGradient(cx, cy, 40, cx, cy, 260);
    radG.addColorStop(0, getFalseColor(0.85));
    radG.addColorStop(0.4, getFalseColor(0.5));
    radG.addColorStop(0.8, getFalseColor(0.2));
    radG.addColorStop(1, getFalseColor(0.02));

    ctx.fillStyle = radG;
    ctx.fillRect(0, 0, width, height);

    // Heated Letterform Specimen "HELLO WORLD"
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 74px "Syne", sans-serif';

    // Thermal conduction glow
    ctx.shadowColor = getFalseColor(0.95);
    ctx.shadowBlur = 24;
    ctx.fillStyle = getFalseColor(0.98);
    ctx.fillText('HELLO WORLD', cx, cy);

    // Subtle thermal crosshair reticle
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy);
    ctx.lineTo(cx + 30, cy);
    ctx.moveTo(cx, cy - 30);
    ctx.lineTo(cx, cy + 30);
    ctx.stroke();

    // Spot meter readout
    ctx.font = '12px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 0;
    ctx.fillText(`CENTER T_MAX: ${coreTemp.toFixed(1)}°C`, cx + 45, cy - 15);
    ctx.fillText(`AMBIENT T_MIN: ${ambientTemp.toFixed(1)}°C`, cx + 45, cy + 5);
    ctx.fillText(`ε = 0.95 (OXIDIZED BRASS)`, cx + 45, cy + 25);
    ctx.restore();

    // Thermal color scale bar on right side
    const barX = width - 40;
    const barY = 40;
    const barH = height - 80;
    for (let y = 0; y < barH; y++) {
      const norm = 1 - y / barH;
      ctx.fillStyle = getFalseColor(norm);
      ctx.fillRect(barX, barY + y, 16, 1);
    }
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(barX, barY, 16, barH);
  }, [palette, ambientTemp, coreTemp]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Flame className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 078: LONG-WAVE INFRARED THERMOGRAPHY (LWIR)
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                FLIR 8-14μm Bolometer Sensor & False-Color Radiation LUT
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPalette('ironbow');
              setAmbientTemp(21.5);
              setCoreTemp(78.0);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Calibrate</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Thermographic Palette:</span>
              <span className="text-amber-400 font-bold uppercase">{palette}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['ironbow', 'rainbow', 'arctic', 'whiteHot'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPalette(p)}
                  className={`py-1.5 px-2 rounded border uppercase text-center transition-all cursor-pointer ${
                    palette === p
                      ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Core Temp:
              </span>
              <span className="text-amber-400 font-bold">{coreTemp.toFixed(1)}°C</span>
            </div>
            <input
              type="range"
              min="35"
              max="140"
              step="1"
              value={coreTemp}
              onChange={(e) => setCoreTemp(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Ambient Temp:</span>
              <span className="text-amber-400 font-bold">{ambientTemp.toFixed(1)}°C</span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              step="0.5"
              value={ambientTemp}
              onChange={(e) => setAmbientTemp(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
