import React, { useRef, useEffect, useCallback, useState } from 'react';
import { CollisionEvent, DetectorConfig } from '../types';

interface LegoPlotCanvasProps {
  event: CollisionEvent | null;
  config: DetectorConfig;
}

export const LegoPlotCanvas: React.FC<LegoPlotCanvasProps> = ({ event, config }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ecalGridRef = useRef<Float32Array>(new Float32Array(36 * 28));
  const hcalGridRef = useRef<Float32Array>(new Float32Array(36 * 28));
  const [hoveredCell, setHoveredCell] = useState<{
    eta: number;
    phi: number;
    ecalET: number;
    hcalET: number;
    screenX: number;
    screenY: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      // Margins for axes
      const padLeft = 60;
      const padRight = 30;
      const padTop = 40;
      const padBottom = 50;

      const plotW = w - padLeft - padRight;
      const plotH = h - padTop - padBottom;

      // Coordinate ranges: eta in [-3.2, 3.2], phi in [-pi, pi]
      const etaMin = -3.2;
      const etaMax = 3.2;
      const phiMin = -Math.PI;
      const phiMax = Math.PI;

      // Draw grid background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.fillRect(padLeft, padTop, plotW, plotH);
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(padLeft, padTop, plotW, plotH);

      // Grid lines
      const numEtaDivs = 8;
      const numPhiDivs = 8;

      ctx.save();
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';

      // Eta lines
      for (let i = 0; i <= numEtaDivs; i++) {
        const etaVal = etaMin + (i / numEtaDivs) * (etaMax - etaMin);
        const x = padLeft + (i / numEtaDivs) * plotW;
        ctx.beginPath();
        ctx.moveTo(x, padTop);
        ctx.lineTo(x, padTop + plotH);
        ctx.stroke();

        ctx.fillText(etaVal.toFixed(1), x, padTop + plotH + 16);
      }

      // Phi lines
      ctx.textAlign = 'right';
      for (let j = 0; j <= numPhiDivs; j++) {
        const phiVal = phiMin + (j / numPhiDivs) * (phiMax - phiMin);
        const y = padTop + (j / numPhiDivs) * plotH;
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(padLeft + plotW, y);
        ctx.stroke();

        const deg = Math.round((phiVal * 180) / Math.PI);
        ctx.fillText(`${deg}°`, padLeft - 8, y + 3);
      }

      // Axis labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Pseudorapidity (η)', padLeft + plotW * 0.5, padTop + plotH + 36);

      ctx.save();
      ctx.translate(padLeft - 38, padTop + plotH * 0.5);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText('Azimuth Angle (φ)', 0, 0);
      ctx.restore();
      ctx.restore();

      if (!event) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Map calorimeter hits to grid towers
      const nBinsEta = 36;
      const nBinsPhi = 28;
      const ecalGrid = ecalGridRef.current;
      const hcalGrid = hcalGridRef.current;
      ecalGrid.fill(0);
      hcalGrid.fill(0);

      for (const p of event.visibleParticles) {
        if (p.pt < config.ptCutGeV) continue;
        for (const hit of p.detectorHits) {
          const binEta = Math.floor(((p.eta - etaMin) / (etaMax - etaMin)) * nBinsEta);
          const binPhi = Math.floor(((p.phi - phiMin) / (phiMax - phiMin)) * nBinsPhi);

          if (binEta >= 0 && binEta < nBinsEta && binPhi >= 0 && binPhi < nBinsPhi) {
            const idx = binPhi * nBinsEta + binEta;
            // ET = E * sin(theta) = pt
            const et = hit.energyDeposit * Math.sin(p.theta);
            if (hit.subdetector === 'ECAL') {
              ecalGrid[idx] += et;
            } else if (hit.subdetector === 'HCAL') {
              hcalGrid[idx] += et;
            }
          }
        }
      }

      const cellW = plotW / nBinsEta;
      const cellH = plotH / nBinsPhi;

      // Draw Calorimeter Energy Towers
      for (let bPhi = 0; bPhi < nBinsPhi; bPhi++) {
        for (let bEta = 0; bEta < nBinsEta; bEta++) {
          const idx = bPhi * nBinsEta + bEta;
          const ecalET = ecalGrid[idx];
          const hcalET = hcalGrid[idx];
          const totalET = ecalET + hcalET;

          if (totalET <= 0.1) continue;

          const cx = padLeft + bEta * cellW;
          const cy = padTop + bPhi * cellH;

          // Split tower between ECAL (amber) and HCAL (cyan)
          if (ecalET > 0.05) {
            const alpha = Math.min(0.9, 0.25 + Math.sqrt(ecalET) * 0.12);
            ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
            ctx.fillRect(cx + 1, cy + 1, cellW - 2, cellH - 2);
          }

          if (hcalET > 0.05) {
            const alpha = Math.min(0.9, 0.25 + Math.sqrt(hcalET) * 0.1);
            ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
            // Overlay smaller inner rectangle for HCAL
            ctx.fillRect(cx + 2, cy + 2, cellW - 4, cellH - 4);
          }

          ctx.strokeStyle = totalET > 30 ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = totalET > 30 ? 1.5 : 0.6;
          ctx.strokeRect(cx + 1, cy + 1, cellW - 2, cellH - 2);
        }
      }

      // Draw Anti-kt Jet Cones on (eta, phi) plane
      for (const jet of event.jets) {
        const jx = padLeft + ((jet.eta - etaMin) / (etaMax - etaMin)) * plotW;
        const jy = padTop + ((jet.phi - phiMin) / (phiMax - phiMin)) * plotH;
        const rx = (jet.coneRadius / (etaMax - etaMin)) * plotW;
        const ry = (jet.coneRadius / (phiMax - phiMin)) * plotH;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(jx, jy, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.stroke();

        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.fill();

        // Label jet center
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Jet ${jet.pt.toFixed(0)}G`, jx, jy - ry - 4);
        ctx.restore();
      }

      // Title HUD
      ctx.save();
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'left';
      ctx.fillText('CALORIMETER (η, φ) LEGO PLOT & ANTI-kT JET CONES', padLeft, padTop - 14);

      // Legend
      ctx.textAlign = 'right';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('■ ECAL (EM)', w - padRight - 110, padTop - 14);
      ctx.fillStyle = '#06b6d4';
      ctx.fillText('■ HCAL (Hadronic)', w - padRight, padTop - 14);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [event, config]);

  // Pointer move handler for tooltip
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !event) return;
    const rect = canvas.getBoundingClientRect();

    // Normalize CSS client coordinates to Canvas internal device pixel space
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const padLeft = 60;
    const padRight = 30;
    const padTop = 40;
    const padBottom = 50;

    const plotW = canvas.width - padLeft - padRight;
    const plotH = canvas.height - padTop - padBottom;

    if (mx < padLeft || mx > padLeft + plotW || my < padTop || my > padTop + plotH) {
      setHoveredCell(null);
      return;
    }

    const etaMin = -3.2;
    const etaMax = 3.2;
    const phiMin = -Math.PI;
    const phiMax = Math.PI;

    const eta = etaMin + ((mx - padLeft) / plotW) * (etaMax - etaMin);
    const phi = phiMin + ((my - padTop) / plotH) * (phiMax - phiMin);

    const nBinsEta = 36;
    const nBinsPhi = 28;
    const binEta = Math.floor(((eta - etaMin) / (etaMax - etaMin)) * nBinsEta);
    const binPhi = Math.floor(((phi - phiMin) / (phiMax - phiMin)) * nBinsPhi);

    let ecalET = 0;
    let hcalET = 0;
    if (binEta >= 0 && binEta < nBinsEta && binPhi >= 0 && binPhi < nBinsPhi) {
      const idx = binPhi * nBinsEta + binEta;
      ecalET = ecalGridRef.current[idx];
      hcalET = hcalGridRef.current[idx];
    }

    setHoveredCell({
      eta,
      phi,
      ecalET,
      hcalET,
      screenX: e.clientX,
      screenY: e.clientY,
    });
  };

  const handlePointerLeave = () => {
    setHoveredCell(null);
  };

  const handleResize = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#030712]">
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="w-full h-full block cursor-crosshair touch-none"
      />

      {hoveredCell && (
        <div
          className="fixed pointer-events-none z-50 px-3 py-2 bg-slate-900/95 border border-cyan-500/50 rounded-lg shadow-xl backdrop-blur-md text-[11px] font-mono text-slate-200 flex flex-col gap-0.5"
          style={{
            left: `${hoveredCell.screenX + 16}px`,
            top: `${hoveredCell.screenY + 16}px`,
          }}
        >
          <div>η: <span className="text-white font-semibold">{hoveredCell.eta.toFixed(2)}</span></div>
          <div>φ: <span className="text-white font-semibold">{(hoveredCell.phi * (180 / Math.PI)).toFixed(1)}°</span></div>
          {(hoveredCell.ecalET > 0.05 || hoveredCell.hcalET > 0.05) && (
            <div className="pt-1 mt-1 border-t border-slate-700/60 flex flex-col gap-0.5">
              {hoveredCell.ecalET > 0.05 && (
                <div className="text-amber-400">ECAL: <span className="font-semibold text-white">{hoveredCell.ecalET.toFixed(1)}</span> GeV</div>
              )}
              {hoveredCell.hcalET > 0.05 && (
                <div className="text-cyan-400">HCAL: <span className="font-semibold text-white">{hoveredCell.hcalET.toFixed(1)}</span> GeV</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
