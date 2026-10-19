/**
 * TopologicalChernCanvas.tsx
 * Visualizer for 2D Haldane Topological Matter.
 * Renders:
 * 1. 2D Berry Curvature landscape Omega_xy(kx, ky)
 * 2. Analytical Haldane (M/t2, phi) phase diagram with live operating point
 * 3. Quantized Chern number readout C in {-1, 0, +1}
 * 4. Chiral edge mode dispersion preview
 */

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { SimulationParameters } from '../types/index.js';
import { TopologicalMatter } from '../physics/TopologicalMatter.js';

interface TopologicalChernCanvasProps {
  params: SimulationParameters;
}

export const TopologicalChernCanvas: React.FC<TopologicalChernCanvasProps> = ({ params }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dimension caching
  const cachedDimsRef = useRef({ w: 0, h: 0 });

  // Calculate topological properties
  const haldaneParams = useMemo(() => ({
    t1: params.haldane_t1,
    t2: params.haldane_t2,
    phi: params.haldane_phi,
    M: params.haldane_M
  }), [params.haldane_t1, params.haldane_t2, params.haldane_phi, params.haldane_M]);

  const chernNumber = useMemo(() => {
    return TopologicalMatter.computeAnalyticalChernNumber(haldaneParams);
  }, [haldaneParams]);

  const diracMasses = useMemo(() => {
    return TopologicalMatter.computeDiracMasses(haldaneParams);
  }, [haldaneParams]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const targetW = Math.floor(rect.width * dpr);
    const targetH = Math.floor(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      cachedDimsRef.current = { w: targetW, h: targetH };
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const width = rect.width;
    const height = rect.height;

    // Background
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    // Layout: Left 60% Berry Curvature 2D Map, Right 40% Phase Diagram & Edge Modes
    const leftW = Math.floor(width * 0.58);
    const rightW = width - leftW - 20;

    // ==========================================
    // 1. 2D BERRY CURVATURE MAP (LEFT PANEL)
    // ==========================================
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(16, 16, leftW, height - 32);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(16, 16, leftW, height - 32);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Berry Curvature Ωxy(k) across First Brillouin Zone', 28, 38);

    const mapCx = 16 + leftW / 2;
    const mapCy = 16 + (height - 32) / 2;
    const mapSize = Math.min(leftW - 40, height - 90);
    const gridN = 40;
    const cellSize = mapSize / gridN;

    const kMax = (2.5 * Math.PI) / params.latticeConstant;

    // Render Berry Curvature Grid via preallocated offscreen buffer
    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas');
      offscreenCanvasRef.current.width = gridN;
      offscreenCanvasRef.current.height = gridN;
    }
    const offCanvas = offscreenCanvasRef.current;
    const offCtx = offCanvas.getContext('2d');
    if (offCtx) {
      const imgData = offCtx.createImageData(gridN, gridN);
      const data32 = new Uint32Array(imgData.data.buffer);

      for (let ix = 0; ix < gridN; ix++) {
        const kx = -kMax + (2 * kMax * ix) / gridN;
        for (let iy = 0; iy < gridN; iy++) {
          const ky = -kMax + (2 * kMax * iy) / gridN;

          const omega = TopologicalMatter.computeBerryCurvature(
            kx,
            ky,
            haldaneParams,
            params.latticeConstant
          );

          // Colormap: Red (+), Dark (0), Blue (-)
          let r = 15;
          let g = 23;
          let b = 42;

          const val = Math.max(-1, Math.min(1, omega * 0.8));
          if (val > 0) {
            r = Math.floor(15 + val * 230);
            g = Math.floor(23 + val * 40);
            b = Math.floor(42 + (1 - val) * 60);
          } else if (val < 0) {
            const mVal = -val;
            r = Math.floor(15 + (1 - mVal) * 30);
            g = Math.floor(23 + mVal * 120);
            b = Math.floor(42 + mVal * 210);
          }

          const pixelY = gridN - 1 - iy;
          // Little-endian ABGR: (A << 24) | (B << 16) | (G << 8) | R
          data32[pixelY * gridN + ix] = (255 << 24) | (b << 16) | (g << 8) | r;
        }
      }
      offCtx.putImageData(imgData, 0, 0);

      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(offCanvas, mapCx - mapSize / 2, mapCy - mapSize / 2, mapSize, mapSize);
    }

    // Hexagonal BZ boundary overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const acc = params.latticeConstant;
    const bzScale = (mapSize / 2) / kMax;
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.PI / 6;
      const rK = (4 * Math.PI) / (3 * Math.sqrt(3) * acc);
      const hx = mapCx + rK * Math.cos(angle) * bzScale;
      const hy = mapCy - rK * Math.sin(angle) * bzScale;
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // ==========================================
    // 2. HALDANE PHASE DIAGRAM (TOP-RIGHT)
    // ==========================================
    const rightX = leftW + 28;
    const phaseH = Math.floor((height - 50) * 0.52);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(rightX, 16, rightW, phaseH);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(rightX, 16, rightW, phaseH);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Haldane Phase Diagram (M/t₂, φ)', rightX + 12, 34);

    // Coordinate mapping for phase diagram:
    // phi in [-pi, pi] -> X axis
    // M / t2 in [-6, 6] -> Y axis
    const pMargin = { left: 40, right: 20, top: 46, bottom: 26 };
    const pPlotW = rightW - pMargin.left - pMargin.right;
    const pPlotH = phaseH - pMargin.top - pMargin.bottom;

    const pX = (phi: number) => rightX + pMargin.left + ((phi + Math.PI) / (2 * Math.PI)) * pPlotW;
    const pY = (mRatio: number) => 16 + pMargin.top + pPlotH * (1 - (mRatio + 6) / 12);

    // Shaded Topological Regions |M/t2| < 3*sqrt(3)*|sin(phi)|
    const criticalConst = 3 * Math.sqrt(3); // ~5.196
    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)'; // C = +1
    ctx.beginPath();
    ctx.moveTo(pX(0), pY(0));
    for (let step = 0; step <= 40; step++) {
      const phi = (step / 40) * Math.PI;
      const mBound = criticalConst * Math.sin(phi);
      ctx.lineTo(pX(phi), pY(mBound));
    }
    for (let step = 40; step >= 0; step--) {
      const phi = (step / 40) * Math.PI;
      const mBound = -criticalConst * Math.sin(phi);
      ctx.lineTo(pX(phi), pY(mBound));
    }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(236, 72, 153, 0.15)'; // C = -1
    ctx.beginPath();
    ctx.moveTo(pX(-Math.PI), pY(0));
    for (let step = 0; step <= 40; step++) {
      const phi = -Math.PI + (step / 40) * Math.PI;
      const mBound = -criticalConst * Math.sin(phi);
      ctx.lineTo(pX(phi), pY(mBound));
    }
    for (let step = 40; step >= 0; step--) {
      const phi = -Math.PI + (step / 40) * Math.PI;
      const mBound = criticalConst * Math.sin(phi);
      ctx.lineTo(pX(phi), pY(mBound));
    }
    ctx.closePath();
    ctx.fill();

    // Boundary Curve Lines
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let s = 0; s <= 80; s++) {
      const phi = -Math.PI + (s / 80) * 2 * Math.PI;
      const mBound = criticalConst * Math.abs(Math.sin(phi));
      if (s === 0) ctx.moveTo(pX(phi), pY(mBound));
      else ctx.lineTo(pX(phi), pY(mBound));
    }
    ctx.stroke();

    ctx.beginPath();
    for (let s = 0; s <= 80; s++) {
      const phi = -Math.PI + (s / 80) * 2 * Math.PI;
      const mBound = -criticalConst * Math.abs(Math.sin(phi));
      if (s === 0) ctx.moveTo(pX(phi), pY(mBound));
      else ctx.lineTo(pX(phi), pY(mBound));
    }
    ctx.stroke();

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pX(-Math.PI), pY(0));
    ctx.lineTo(pX(Math.PI), pY(0));
    ctx.moveTo(pX(0), 16 + pMargin.top);
    ctx.lineTo(pX(0), 16 + pMargin.top + pPlotH);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '9px monospace';
    ctx.fillText('-π', pX(-Math.PI) + 4, pY(0) + 12);
    ctx.fillText('+π', pX(Math.PI) - 14, pY(0) + 12);
    ctx.fillText('0', pX(0) + 4, pY(0) + 12);

    // Current Operating Point Dot
    const curMRatio = params.haldane_t2 > 0 ? params.haldane_M / params.haldane_t2 : 0;
    const opX = pX(params.haldane_phi);
    const opY = pY(curMRatio);

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(opX, opY, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // ==========================================
    // 3. TOPOLOGICAL STATUS & CHERN CARD (BOTTOM-RIGHT)
    // ==========================================
    const cardY = 16 + phaseH + 12;
    const cardH = height - 32 - phaseH - 12;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(rightX, cardY, rightW, cardH);
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(rightX, cardY, rightW, cardH);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Topological Invariant & Dirac Gaps', rightX + 12, cardY + 20);

    // Chern Badge Box
    const badgeW = 90;
    const badgeH = 34;
    const badgeX = rightX + 12;
    const badgeY = cardY + 32;

    ctx.fillStyle = chernNumber !== 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)';
    ctx.strokeStyle = chernNumber !== 0 ? '#10b981' : '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = chernNumber !== 0 ? '#34d399' : '#94a3b8';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`Chern C = ${chernNumber}`, badgeX + badgeW / 2, badgeY + 22);

    // Dirac Mass Values
    ctx.textAlign = 'left';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '10px monospace';
    ctx.fillText(`mD(K) : ${diracMasses.mK.toFixed(3)} eV`, rightX + 115, cardY + 44);
    ctx.fillText(`mD(K'): ${diracMasses.mKprime.toFixed(3)} eV`, rightX + 115, cardY + 60);

    // Chiral Edge Modes Status
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    const edgeText =
      chernNumber === 1
        ? '✓ Right-moving Chiral Edge State traversing bulk gap'
        : chernNumber === -1
        ? '✓ Left-moving Chiral Edge State traversing bulk gap'
        : '✗ Trivial insulating phase (bulk band gap without protected edge states)';
    ctx.fillText(edgeText, rightX + 12, cardY + 84);
  }, [haldaneParams, chernNumber, diracMasses, params.latticeConstant]);

  useEffect(() => {
    render();
  }, [render]);

  // Window resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => render());
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [render]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[420px] bg-slate-950">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
