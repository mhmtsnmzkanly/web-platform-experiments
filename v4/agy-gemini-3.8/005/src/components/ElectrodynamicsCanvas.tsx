import React, { useRef, useEffect } from 'react';
import { FDTDSolver, NX, NY } from '../engine/FDTDSolver';
import { SimParameters, FieldProbe } from '../types';

interface ElectrodynamicsCanvasProps {
  solver: FDTDSolver;
  params: SimParameters;
  probes: FieldProbe[];
  activeTool: 'BRUSH' | 'PROBE';
  onPlaceProbe: (x: number, y: number) => void;
  onPaint: (x: number, y: number) => void;
}

// Precomputed 256-entry Lookup Table for Plasma Magma colormap
const MAGMA_R = new Uint8Array(256);
const MAGMA_G = new Uint8Array(256);
for (let i = 0; i < 256; i++) {
  const norm = i / 255.0;
  MAGMA_R[i] = Math.floor(255 * Math.pow(norm, 0.7));
  MAGMA_G[i] = Math.floor(255 * Math.pow(norm, 1.8));
}

const ElectrodynamicsCanvasComponent: React.FC<ElectrodynamicsCanvasProps> = ({
  solver,
  params,
  probes,
  activeTool,
  onPlaceProbe,
  onPaint,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMouseDownRef = useRef<boolean>(false);

  const probesRef = useRef(probes);
  useEffect(() => {
    probesRef.current = probes;
  }, [probes]);

  const paramsRef = useRef(params);
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  // Single continuous Animation Frame loop (Zero recreation churn)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    canvas.width = NX;
    canvas.height = NY;
    const imgData = ctx.createImageData(NX, NY);
    const pixels = imgData.data;

    const render = () => {
      const curParams = paramsRef.current;
      const curProbes = probesRef.current;

      // Step simulation if not paused (3 substeps per frame for smooth wave speed)
      if (!curParams.isPaused) {
        for (let s = 0; s < 3; s++) {
          solver.step(curParams);
        }
      }

      // 1. Pixel colormap rasterization
      const Ez = solver.Ez;
      const Hx = solver.Hx;
      const Hy = solver.Hy;
      const epsR = solver.epsR;
      const isPEC = solver.isPEC;
      const sigma = solver.sigma;
      const colorMap = curParams.colorMap;

      let p = 0;
      for (let y = 0; y < NY; y++) {
        for (let x = 0; x < NX; x++) {
          const idx = y * NX + x;
          const val = Ez[idx] * 1.8;
          const isDiel = epsR[idx] > 1.2;
          const pec = isPEC[idx] === 1;
          const lossy = sigma[idx] > 1e-4;

          if (pec) {
            // Metallic PEC: Silver/Cyan boundary
            pixels[p] = 200;
            pixels[p + 1] = 215;
            pixels[p + 2] = 230;
            pixels[p + 3] = 255;
          } else if (lossy) {
            // Lossy Absorber: Dark slate purple
            pixels[p] = 60;
            pixels[p + 1] = 40;
            pixels[p + 2] = 70;
            pixels[p + 3] = 255;
          } else {
            // Field visualization by colormap
            switch (colorMap) {
              case 'BIPOLAR_ELECTRIC': {
                if (val >= 0) {
                  // Cyan / White
                  const c = Math.min(255, Math.floor(val * 240));
                  pixels[p] = isDiel ? Math.min(255, c + 35) : Math.floor(c * 0.15);
                  pixels[p + 1] = Math.max(12, c);
                  pixels[p + 2] = Math.max(28, c);
                } else {
                  // Rose / Magenta
                  const c = Math.min(255, Math.floor(-val * 240));
                  pixels[p] = Math.max(22, c);
                  pixels[p + 1] = Math.floor(c * 0.15);
                  pixels[p + 2] = isDiel ? Math.min(255, c + 40) : Math.floor(c * 0.45);
                }
                break;
              }

              case 'PLASMA_MAGMA': {
                // LUT lookup replacing heavy Math.pow
                const lutIdx = Math.min(255, Math.max(0, Math.floor(((val + 1.2) / 2.4) * 255)));
                pixels[p] = MAGMA_R[lutIdx];
                pixels[p + 1] = MAGMA_G[lutIdx];
                pixels[p + 2] = 255 - lutIdx;
                break;
              }

              case 'SEISMIC': {
                // Red-White-Blue
                if (val >= 0) {
                  const c = Math.min(255, Math.floor(val * 255));
                  pixels[p] = 255;
                  pixels[p + 1] = 255 - c;
                  pixels[p + 2] = 255 - c;
                } else {
                  const c = Math.min(255, Math.floor(-val * 255));
                  pixels[p] = 255 - c;
                  pixels[p + 1] = 255 - c;
                  pixels[p + 2] = 255;
                }
                break;
              }

              case 'GREEN_PHOSPHOR': {
                // Radar monochrome phosphor
                const amp = Math.min(255, Math.floor(Math.abs(val) * 255));
                pixels[p] = Math.floor(amp * 0.15);
                pixels[p + 1] = amp;
                pixels[p + 2] = Math.floor(amp * 0.3);
                break;
              }
            }

            // Dielectric contour outline
            if (isDiel && Math.abs(val) < 0.12) {
              pixels[p] = 251;
              pixels[p + 1] = 191;
              pixels[p + 2] = 36;
            }

            pixels[p + 3] = 255;
          }

          p += 4;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // 2. Draw Waveguide Source & Downstream Sensor Lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(14, 12);
      ctx.lineTo(14, NY - 12);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(200, 15);
      ctx.lineTo(200, NY - 15);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Draw Optional Poynting Flux Vector Field Overlay
      if (curParams.showPoyntingVectors) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1;
        const step = 14;
        for (let gy = step; gy < NY - step; gy += step) {
          for (let gx = step; gx < NX - step; gx += step) {
            const idx = gy * NX + gx;
            const sx = -Ez[idx] * Hy[idx];
            const sy = Ez[idx] * Hx[idx];
            const mag = Math.hypot(sx, sy);
            if (mag > 0.005) {
              const len = Math.min(10, mag * 25);
              const angle = Math.atan2(sy, sx);
              const ex = gx + Math.cos(angle) * len;
              const ey = gy + Math.sin(angle) * len;

              ctx.beginPath();
              ctx.moveTo(gx, gy);
              ctx.lineTo(ex, ey);
              ctx.stroke();
            }
          }
        }
      }

      // 4. Draw Virtual Field Probes
      curProbes.forEach((probe) => {
        ctx.strokeStyle = probe.color;
        ctx.fillStyle = probe.color;
        ctx.lineWidth = 1.5;

        // Crosshair reticle
        ctx.beginPath();
        ctx.arc(probe.x, probe.y, 5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(probe.x - 8, probe.y);
        ctx.lineTo(probe.x + 8, probe.y);
        ctx.moveTo(probe.x, probe.y - 8);
        ctx.lineTo(probe.x, probe.y + 8);
        ctx.stroke();

        // Label
        ctx.font = 'bold 9px monospace';
        ctx.fillText(probe.name, probe.x + 8, probe.y - 6);
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [solver]);

  // Pointer interaction
  const handlePointerAction = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = NX / rect.width;
    const scaleY = NY / rect.height;
    const x = Math.max(0, Math.min(NX - 1, (e.clientX - rect.left) * scaleX));
    const y = Math.max(0, Math.min(NY - 1, (e.clientY - rect.top) * scaleY));

    if (activeTool === 'PROBE') {
      onPlaceProbe(x, y);
    } else {
      onPaint(x, y);
    }
  };

  return (
    <div className="relative w-full aspect-[2/1] bg-slate-950 rounded-lg border-2 border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center">
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          isMouseDownRef.current = true;
          handlePointerAction(e);
        }}
        onPointerMove={(e) => {
          if (isMouseDownRef.current && activeTool === 'BRUSH') {
            handlePointerAction(e);
          }
        }}
        onPointerUp={() => {
          isMouseDownRef.current = false;
        }}
        onPointerLeave={() => {
          isMouseDownRef.current = false;
        }}
        className="w-full h-full object-contain cursor-crosshair pixelated"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};

export const ElectrodynamicsCanvas = React.memo(ElectrodynamicsCanvasComponent);
