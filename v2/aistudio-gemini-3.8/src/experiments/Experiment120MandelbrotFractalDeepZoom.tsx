import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment120MandelbrotFractalDeepZoom() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [maxIterations, setMaxIterations] = useState(48);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [targetPoint, setTargetPoint] = useState({ r: -0.743643887037158704752191506114774, i: 0.131825904205311970493132056385139 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    const imgData = ctx.createImageData(width, height);
    const pixels = imgData.data;

    // Complex plane bounds: z = z^2 + c
    const scale = 3.0 / (zoomLevel * width);
    const cRealOffset = targetPoint.r - (width / 2) * scale;
    const cImagOffset = targetPoint.i - (height / 2) * scale;

    for (let py = 0; py < height; py++) {
      const cImag = cImagOffset + py * scale;
      for (let px = 0; px < width; px++) {
        const cReal = cRealOffset + px * scale;

        let zReal = 0;
        let zImag = 0;
        let iter = 0;

        while (zReal * zReal + zImag * zImag <= 4.0 && iter < maxIterations) {
          const nextZReal = zReal * zReal - zImag * zImag + cReal;
          zImag = 2 * zReal * zImag + cImag;
          zReal = nextZReal;
          iter++;
        }

        const idx = (py * width + px) * 4;
        if (iter === maxIterations) {
          // Interior of Mandelbrot set
          pixels[idx] = 4;
          pixels[idx + 1] = 6;
          pixels[idx + 2] = 12;
          pixels[idx + 3] = 255;
        } else {
          // Escape boundary color ramp (Electric Cyan / Indigo / Gold)
          const norm = iter / maxIterations;
          pixels[idx] = Math.floor(Math.sin(norm * Math.PI) * 240);
          pixels[idx + 1] = Math.floor(norm * 180 + 30);
          pixels[idx + 2] = Math.floor(255 - norm * 150);
          pixels[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Superimposed Typographic Coordinate Anchor "HELLO WORLD"
    ctx.save();
    ctx.font = 'bold 54px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 18;
    ctx.fillText('HELLO WORLD', width / 2, height / 2);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#fef08a';
    ctx.shadowBlur = 0;
    ctx.fillText(
      `BENOIT MANDELBROT 1979 · FRACTAL BOUNDARY z_n+1 = z_n² + c · ZOOM ${zoomLevel.toFixed(1)}x · MAX ITER: ${maxIterations}`,
      width / 2,
      height - 20
    );
    ctx.restore();
  }, [maxIterations, zoomLevel, targetPoint]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Compass className="text-cyan-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 120: BENOIT MANDELBROT COMPLEX FRACTAL DEEP ZOOM
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                1979 Non-Linear Quadratic Polynomial Iteration z² + c & Infinite Boundary Detail
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setMaxIterations(48);
              setZoomLevel(1.0);
              setTargetPoint({ r: -0.743643887037158704752191506114774, i: 0.131825904205311970493132056385139 });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Zoom</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-black flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-cyan-400" /> Boundary Zoom Magnification:
              </span>
              <span className="text-cyan-400 font-bold">{zoomLevel.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="20.0"
              step="0.5"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Escape Iteration Depth:</span>
              <span className="text-cyan-400 font-bold">{maxIterations} iters</span>
            </div>
            <input
              type="range"
              min="24"
              max="128"
              step="4"
              value={maxIterations}
              onChange={(e) => setMaxIterations(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
