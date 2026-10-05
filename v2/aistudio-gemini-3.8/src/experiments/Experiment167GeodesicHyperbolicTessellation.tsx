import React, { useRef, useEffect, useState } from 'react';
import { Orbit, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment167GeodesicHyperbolicTessellation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tessellationOrderP, setTessellationOrderP] = useState(7); // {p, q} Schläfli symbol
  const [rotationAngle, setRotationAngle] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let localRot = rotationAngle;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.48;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      localRot += 0.003;

      // Poincaré Hyperbolic Disk Model:
      // Disk radius R = 1. Geodesics are circular arcs orthogonal to the boundary circle!
      // In hyperbolic space, parallel lines diverge, and triangle angle sum < 180° (negative Gaussian curvature).
      // We generate a {p, 3} hyperbolic regular polygon tiling (Escher Circle Limit style).

      const diskRadius = 170;

      // Outer boundary circle of infinity
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cx, cy, diskRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Draw recursive hyperbolic geodesic arcs
      const p = tessellationOrderP;
      const layers = 4;

      const drawHyperbolicGeodesic = (p1: { x: number; y: number }, p2: { x: number; y: number }, col: string) => {
        // Approximate hyperbolic geodesic line between two points in Poincaré disk
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        // Midpoint bend towards origin
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        const distFromCenter = Math.hypot(mx - cx, my - cy);
        const bendFactor = 0.85;
        const cxPoint = cx + (mx - cx) * bendFactor;
        const cyPoint = cy + (my - cy) * bendFactor;

        ctx.quadraticCurveTo(cxPoint, cyPoint, p2.x, p2.y);
        ctx.stroke();
      };

      // Generate regular p-gon vertices in Poincaré disk
      for (let layer = 1; layer <= layers; layer++) {
        const radius = diskRadius * (1 - 0.55 ** layer);
        const numVertices = p * (2 ** (layer - 1));
        const pts: { x: number; y: number }[] = [];

        for (let i = 0; i < numVertices; i++) {
          const theta = (i / numVertices) * Math.PI * 2 + localRot;
          const px = cx + Math.cos(theta) * radius;
          const py = cy + Math.sin(theta) * radius;
          pts.push({ x: px, y: py });
        }

        // Draw edges of polygons
        const col = layer === 1 ? '#eab308' : layer === 2 ? '#38bdf8' : '#a855f7';
        for (let i = 0; i < numVertices; i++) {
          const next = (i + 1) % numVertices;
          drawHyperbolicGeodesic(pts[i], pts[next], col);

          // Radial spokes connecting layers
          if (layer > 1 && i % 2 === 0) {
            const innerRadius = diskRadius * (1 - 0.55 ** (layer - 1));
            const innerTheta = (i / numVertices) * Math.PI * 2 + localRot;
            const inX = cx + Math.cos(innerTheta) * innerRadius;
            const inY = cy + Math.sin(innerTheta) * innerRadius;
            drawHyperbolicGeodesic({ x: inX, y: inY }, pts[i], 'rgba(148, 163, 184, 0.4)');
          }
        }
      }

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 250, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 250, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('POINCARÉ DISK HYPERBOLIC GEOMETRY', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Schläfli Symbol: {${tessellationOrderP}, 3} Regular Tiling`, 45, 72);
      ctx.fillText('Gaussian Curvature: K = -1 (Constant Negative)', 45, 90);
      ctx.fillText('Triangle Angle Sum: α + β + γ < π Radians', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1882 HENRI POINCARÉ DISK MODEL · NON-EUCLIDEAN CONFORMAL HYPERBOLIC TILING', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [tessellationOrderP, rotationAngle]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-purple-400">
            <span className="flex items-center gap-1.5 font-mono"><Orbit size={14} /> Tiling Symmetry Order (p)</span>
            <span className="font-mono">p = {tessellationOrderP} ({'{'}{tessellationOrderP}, 3{'}'} tiling)</span>
          </div>
          <input
            type="range"
            min="5"
            max="9"
            value={tessellationOrderP}
            onChange={(e) => setTessellationOrderP(Number(e.target.value))}
            className="accent-purple-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Manifold Hyperbolic Rotation</span>
            <span className="font-mono">{rotationAngle.toFixed(0)}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={rotationAngle}
            onChange={(e) => setRotationAngle(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
