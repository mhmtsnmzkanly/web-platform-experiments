import React, { useRef, useEffect, useState } from 'react';
import { Flame, Sliders, RotateCcw, Eye } from 'lucide-react';

export default function Experiment26ThermodynamicHeatmap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [thermalPalette, setThermalPalette] = useState<'ironbow' | 'rainbow' | 'arctic'>('ironbow');
  const [ambientTemp, setAmbientTemp] = useState(24); // Celsius
  const [heatIntensity, setHeatIntensity] = useState(180); // Celsius at cursor
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 450, y: 240, active: true });
  const heatMapRef = useRef<Float32Array | null>(null);
  const dimsRef = useRef<{ w: number; h: number; cols: number; rows: number }>({ w: 900, h: 480, cols: 90, rows: 48 });

  const getHeatColor = (val: number, palette: string): [number, number, number] => {
    // val 0.0 to 1.0
    const clamped = Math.max(0, Math.min(1, val));
    if (palette === 'ironbow') {
      // Black -> Dark Purple -> Red -> Orange -> Yellow -> White
      if (clamped < 0.2) return [Math.round(clamped * 5 * 60), 0, Math.round(clamped * 5 * 120)];
      if (clamped < 0.4) return [Math.round(60 + (clamped - 0.2) * 5 * 140), 0, Math.round(120 - (clamped - 0.2) * 5 * 80)];
      if (clamped < 0.7) return [Math.round(200 + (clamped - 0.4) * 3.33 * 55), Math.round((clamped - 0.4) * 3.33 * 180), 0];
      return [255, Math.round(180 + (clamped - 0.7) * 3.33 * 75), Math.round((clamped - 0.7) * 3.33 * 255)];
    } else if (palette === 'rainbow') {
      const hue = (1.0 - clamped) * 240;
      // Convert HSL to RGB
      const h = hue / 60;
      const c = 255;
      const x = (1 - Math.abs((h % 2) - 1)) * 255;
      if (h < 1) return [c, Math.round(x), 0];
      if (h < 2) return [Math.round(x), c, 0];
      if (h < 3) return [0, c, Math.round(x)];
      if (h < 4) return [0, Math.round(x), c];
      return [Math.round(x), 0, c];
    } else {
      // Arctic Cyan/Ice
      return [Math.round(clamped * 200), Math.round(clamped * 240), Math.round(120 + clamped * 135)];
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cols = dimsRef.current.cols;
    const rows = dimsRef.current.rows;

    const heatGrid = new Float32Array(cols * rows).fill(ambientTemp);
    heatMapRef.current = heatGrid;

    // Stamp baseline "HELLO WORLD" heat signature
    const off = document.createElement('canvas');
    off.width = cols;
    off.height = rows;
    const offCtx = off.getContext('2d')!;
    offCtx.fillStyle = '#ffffff';
    offCtx.font = 'bold 13px sans-serif';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText('HELLO WORLD', cols / 2, rows / 2);

    const imgData = offCtx.getImageData(0, 0, cols, rows).data;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (imgData[(y * cols + x) * 4 + 3] > 120) {
          heatGrid[y * cols + x] = 110; // warm letters
        }
      }
    }

    let isRunning = true;
    let animId = 0;

    const cellW = width / cols;
    const cellH = height / rows;

    const render = () => {
      if (!isRunning) return;

      const mouse = mouseRef.current;
      const mx = Math.floor((mouse.x / width) * cols);
      const my = Math.floor((mouse.y / height) * rows);

      // Inject heat at cursor
      if (mx >= 0 && mx < cols && my >= 0 && my < rows) {
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const nx = mx + dx;
            const ny = my + dy;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
              const d = Math.hypot(dx, dy);
              if (d <= 2) {
                heatGrid[ny * cols + nx] = Math.max(heatGrid[ny * cols + nx], heatIntensity);
              }
            }
          }
        }
      }

      // Thermal diffusion laplacian equation
      for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
          const idx = y * cols + x;
          const avg =
            (heatGrid[idx - 1] +
              heatGrid[idx + 1] +
              heatGrid[idx - cols] +
              heatGrid[idx + cols]) *
            0.25;
          // Cool towards ambient temp
          heatGrid[idx] = heatGrid[idx] + (avg - heatGrid[idx]) * 0.12 - (heatGrid[idx] - ambientTemp) * 0.005;
        }
      }

      // Render thermogram pixels
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const temp = heatGrid[y * cols + x];
          const norm = (temp - ambientTemp) / (heatIntensity - ambientTemp);
          const [r, g, b] = getHeatColor(norm, thermalPalette);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x * cellW, y * cellH, cellW + 0.5, cellH + 0.5);
        }
      }

      // Isotherm overlay crosshairs at cursor
      if (mx >= 0 && mx < cols && my >= 0 && my < rows) {
        const curTemp = Math.round(heatGrid[my * cols + mx]);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(mouse.x - 10, mouse.y - 10, 20, 20);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`${curTemp}°C`, mouse.x + 14, mouse.y + 4);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [thermalPalette, ambientTemp, heatIntensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#050508] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Flame size={14} className="text-amber-500" />
          <span className="font-bold text-stone-200">STUDY 026</span> // THERMODYNAMIC INFRARED HEATMAP
        </div>
        <div className="flex items-center gap-4">
          <span>FLIR THERMOGRAPHY: {thermalPalette.toUpperCase()}</span>
          <span>AMBIENT: {ambientTemp}°C</span>
        </div>
      </div>

      {/* Thermogram Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg cursor-crosshair">
        <canvas ref={canvasRef} onMouseMove={handleMouseMove} className="w-full h-[450px] block rounded-lg" />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-stone-200 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          HOVER CURSOR TO APPLY HIGH-TEMPERATURE THERMAL FLUX
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Heat Source Temp:</span>
            <input
              type="range"
              min="80"
              max="350"
              value={heatIntensity}
              onChange={(e) => setHeatIntensity(Number(e.target.value))}
              className="w-24 accent-amber-500"
            />
            <span>{heatIntensity}°C</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['ironbow', 'rainbow', 'arctic'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setThermalPalette(p)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                thermalPalette === p ? 'bg-amber-500 text-stone-950 font-bold border-amber-400' : 'border-stone-800 text-stone-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
