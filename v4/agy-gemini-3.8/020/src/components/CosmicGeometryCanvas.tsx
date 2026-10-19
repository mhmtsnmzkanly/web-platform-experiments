/**
 * COSMIC GEOMETRY & FLRW SPACETIME CURVATURE CANVAS
 * COSMO-FORGE (EXP-020)
 * Visualizes 3D spatial curvature (Flat k=0, Spherical k=+1, Hyperbolic k=-1),
 * geodesic triangle angle sum excess/deficit (alpha + beta + gamma != 180 deg),
 * and particle vs cosmic event horizons.
 */

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { CosmoParameters } from '../types';
import { FriedmannSolver } from '../physics/FriedmannSolver';

interface CosmicGeometryCanvasProps {
  params: CosmoParameters;
}

export const CosmicGeometryCanvas: React.FC<CosmicGeometryCanvasProps> = ({ params }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationAngleRef = useRef(0.0);

  // Compute curvature
  const Omega_r = useMemo(() => FriedmannSolver.computeRadiationDensity(params), [params]);
  const Omega_k = useMemo(() => FriedmannSolver.computeCurvatureDensity(params, Omega_r), [params, Omega_r]);


  // Canvas render pipeline
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Clear background
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    const centerX = width * 0.45;
    const centerY = height * 0.52;

    // Determine geometry type
    let geomType: 'FLAT' | 'OPEN' | 'CLOSED' = 'FLAT';
    if (Omega_k > 0.01) geomType = 'OPEN';
    else if (Omega_k < -0.01) geomType = 'CLOSED';

    // 1. Draw 3D Parametric Curved Surface Mesh
    const gridRows = 24;
    const gridCols = 24;
    const meshRadius = Math.min(width, height) * 0.35;

    ctx.save();
    ctx.lineWidth = 1;

    for (let i = 0; i < gridRows; i++) {
      const u = (i / (gridRows - 1)) * 2.0 - 1.0; // [-1, 1]
      ctx.beginPath();
      for (let j = 0; j < gridCols; j++) {
        const v = (j / (gridCols - 1)) * 2.0 - 1.0; // [-1, 1]

        let z3d = 0.0;
        if (geomType === 'CLOSED') {
          // Sphere / Cap: z = sqrt(1 - u^2 - v^2)
          const r2 = u * u + v * v;
          z3d = r2 <= 1.0 ? Math.sqrt(1.0 - r2) * 0.6 : 0.0;
        } else if (geomType === 'OPEN') {
          // Hyperbolic Saddle: z = (u^2 - v^2) * 0.4
          z3d = (u * u - v * v) * 0.4;
        } else {
          // Flat Euclidean plane
          z3d = 0.0;
        }

        // Apply 3D rotation
        const cosR = Math.cos(rotationAngleRef.current);
        const sinR = Math.sin(rotationAngleRef.current);
        const rotX = u * cosR - v * sinR;
        const rotY = u * sinR + v * cosR;

        // Isometric projection
        const projX = centerX + (rotX - rotY) * (meshRadius * 0.65);
        const projY = centerY + (rotX + rotY) * (meshRadius * 0.32) - z3d * (meshRadius * 0.8);

        if (j === 0) ctx.moveTo(projX, projY);
        else ctx.lineTo(projX, projY);
      }
      ctx.strokeStyle = geomType === 'CLOSED'
        ? 'rgba(168, 85, 247, 0.35)'
        : geomType === 'OPEN'
        ? 'rgba(245, 158, 11, 0.35)'
        : 'rgba(6, 182, 212, 0.35)';
      ctx.stroke();
    }
    ctx.restore();

    // 2. Geodesic Triangle on the Manifold
    // Triangle Vertices in normalized coords
    const triU = [0.0, -0.5, 0.5];
    const triV = [-0.6, 0.4, 0.4];

    const triProjected: { x: number; y: number }[] = [];
    for (let k = 0; k < 3; k++) {
      const u = triU[k];
      const v = triV[k];
      let z3d = 0.0;
      if (geomType === 'CLOSED') {
        const r2 = u * u + v * v;
        z3d = r2 <= 1.0 ? Math.sqrt(1.0 - r2) * 0.6 : 0.0;
      } else if (geomType === 'OPEN') {
        z3d = (u * u - v * v) * 0.4;
      }

      const cosR = Math.cos(rotationAngleRef.current);
      const sinR = Math.sin(rotationAngleRef.current);
      const rotX = u * cosR - v * sinR;
      const rotY = u * sinR + v * cosR;

      const projX = centerX + (rotX - rotY) * (meshRadius * 0.65);
      const projY = centerY + (rotX + rotY) * (meshRadius * 0.32) - z3d * (meshRadius * 0.8);
      triProjected.push({ x: projX, y: projY });
    }

    // Draw Geodesic Triangle
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(triProjected[0].x, triProjected[0].y);
    ctx.lineTo(triProjected[1].x, triProjected[1].y);
    ctx.lineTo(triProjected[2].x, triProjected[2].y);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.fill();

    // Vertices dots
    ctx.fillStyle = '#ef4444';
    triProjected.forEach((pt) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. RIGHT PANEL: Geometric Invariant Analysis Card
    const cardW = 240;
    const cardH = height - 50;
    const cardX = width - cardW - 20;
    const cardY = 25;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Cosmic Curvature & Horizons', cardX + cardW / 2, cardY + 22);

    let angleSum = 180.0;
    let angleDesc = '= 180.0° (Euclidean Invariant)';
    let color = '#06b6d4';
    if (geomType === 'CLOSED') {
      angleSum = 180.0 + Math.abs(Omega_k) * 45.0;
      angleDesc = `> 180° (+${(angleSum - 180).toFixed(1)}° Spherical Excess)`;
      color = '#a855f7';
    } else if (geomType === 'OPEN') {
      angleSum = 180.0 - Math.abs(Omega_k) * 35.0;
      angleDesc = `< 180° (-${(180 - angleSum).toFixed(1)}° Hyperbolic Deficit)`;
      color = '#f59e0b';
    }

    const items = [
      { label: 'Spatial Metric k:', val: geomType === 'FLAT' ? 'k = 0' : geomType === 'CLOSED' ? 'k = +1' : 'k = -1' },
      { label: 'Curvature Density Ω_k:', val: Omega_k.toFixed(4) },
      { label: 'Triangle Angle Sum:', val: `${angleSum.toFixed(1)}°` },
      { label: 'Geometry:', val: angleDesc },
      { label: 'Particle Horizon:', val: 'Observable Universe' },
      { label: 'Event Horizon:', val: params.Omega_L > 0 ? 'Finite Future Horizon' : 'Infinite Future' },
      { label: 'Cosmic Fate:', val: params.w0 < -1 ? 'Big Rip' : params.Omega_L > 0 ? 'Big Freeze' : 'Recollapse' },
    ];

    items.forEach((item, idx) => {
      const itemY = cardY + 55 + idx * 36;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, cardX + 12, itemY);

      ctx.fillStyle = idx === 2 ? color : '#f1f5f9';
      ctx.font = '11px monospace';
      ctx.fillText(item.val, cardX + 12, itemY + 14);
    });
  }, [Omega_k, Omega_r, params.Omega_L, params.w0]);

  // Gentle animation loop
  useEffect(() => {
    let animId: number;
    const loop = () => {
      rotationAngleRef.current += 0.01;
      renderCanvas();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [renderCanvas]);

  // ResizeObserver for high-DPI scaling
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = entry.contentRect;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      renderCanvas();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [renderCanvas]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-3 select-none">
      {/* Sub-header Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <span className="text-xs font-semibold text-slate-200">
          3D FLRW Spacetime Geometry & Geodesic Triangle:
        </span>
        <div className="text-[11px] font-mono text-slate-400">
          Rotating Spatial Manifold (k = 0 Flat, k = +1 Spherical, k = -1 Hyperbolic)
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        ref={containerRef}
        className="flex-1 relative w-full h-full min-h-[300px] rounded-lg overflow-hidden border border-slate-800"
      >
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      </div>
    </div>
  );
};
