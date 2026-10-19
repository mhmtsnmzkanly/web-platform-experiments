import React, { useRef, useEffect, useState } from 'react';
import { StellarSimulationState } from '../core/SimulationController.js';
import { CONSTANTS } from '../physics/PhysicalConstants.js';
import { HrStarPoint } from '../types/index.js';

interface HrDiagramCanvasProps {
  simState: StellarSimulationState;
}

export const HrDiagramCanvas: React.FC<HrDiagramCanvasProps> = ({ simState }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);

  // Reference Benchmark Stars
  const benchmarkStars: HrStarPoint[] = [
    { name: 'Betelgeuse (M1-2 Ia-ab)', logTeff: 3.55, logLuminosity: 5.10, color: '#ef4444', size: 8 },
    { name: 'Rigel (B8 Ia)', logTeff: 4.08, logLuminosity: 5.08, color: '#93c5fd', size: 7 },
    { name: 'Sirius A (A1 V)', logTeff: 3.99, logLuminosity: 1.40, color: '#e2e8f0', size: 6 },
    { name: 'Sun (G2 V)', logTeff: 3.76, logLuminosity: 0.00, color: '#fbbf24', size: 6 },
    { name: 'Proxima Centauri (M5.5 V)', logTeff: 3.48, logLuminosity: -3.77, color: '#f87171', size: 4 },
    { name: 'Sirius B (DA2 White Dwarf)', logTeff: 4.40, logLuminosity: -1.77, color: '#38bdf8', size: 5 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const targetW = Math.floor(rect.width * dpr);
    const targetH = Math.floor(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = rect.width;
    const height = rect.height;

    // Background
    ctx.fillStyle = '#070a13';
    ctx.fillRect(0, 0, width, height);

    // Margins
    const margin = { top: 35, right: 40, bottom: 45, left: 65 };
    const plotW = width - margin.left - margin.right;
    const plotH = height - margin.top - margin.bottom;

    // Axis Ranges:
    // log(T_eff): 4.6 (left, hot) down to 3.3 (right, cool) -- standard astronomical convention!
    const logT_min = 3.3;
    const logT_max = 4.6;
    // log(L/L_sun): -5.0 (bottom, dim) up to +6.0 (top, luminous)
    const logL_min = -5.0;
    const logL_max = 6.0;

    const mapCoords = (logT: number, logL: number) => {
      const xNorm = (logT_max - logT) / (logT_max - logT_min); // Reversed axis
      const yNorm = (logL - logL_min) / (logL_max - logL_min);
      return {
        x: margin.left + xNorm * plotW,
        y: margin.top + (1.0 - yNorm) * plotH,
      };
    };

    // Draw Grid & Axes
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    // Horizontal grid lines (Luminosity)
    for (let logL = -4; logL <= 6; logL += 2) {
      const pt = mapCoords(logT_max, logL);
      ctx.beginPath();
      ctx.moveTo(margin.left, pt.y);
      ctx.lineTo(margin.left + plotW, pt.y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText(`10${logL >= 0 ? `^${logL}` : `^(${logL})`}`, margin.left - 48, pt.y + 3);
    }

    // Vertical grid lines (Temperature & Spectral Class)
    const spectralClasses = [
      { class: 'O', logT: 4.55, temp: '40,000 K' },
      { class: 'B', logT: 4.30, temp: '20,000 K' },
      { class: 'A', logT: 3.98, temp: '9,500 K' },
      { class: 'F', logT: 3.86, temp: '7,200 K' },
      { class: 'G', logT: 3.76, temp: '5,800 K' },
      { class: 'K', logT: 3.65, temp: '4,500 K' },
      { class: 'M', logT: 3.48, temp: '3,000 K' },
    ];

    spectralClasses.forEach(sc => {
      const pt = mapCoords(sc.logT, 0);
      ctx.beginPath();
      ctx.moveTo(pt.x, margin.top);
      ctx.lineTo(pt.x, margin.top + plotH);
      ctx.stroke();

      // Spectral Class Label at Top
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 12px Inter, system-ui, sans-serif';
      ctx.fillText(sc.class, pt.x - 4, margin.top - 12);

      // Temperature label at bottom
      ctx.fillStyle = '#64748b';
      ctx.font = '9px monospace';
      ctx.fillText(sc.temp, pt.x - 18, margin.top + plotH + 18);
    });

    // Border
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(margin.left, margin.top, plotW, plotH);

    // Constant Stellar Radius Lines: L = 4*pi*R^2 * sigma * T^4 -> log(L) = 2*log(R) + 4*log(T) + C
    const radiusLines = [
      { rSolar: 0.01, label: '0.01 R☉ (White Dwarf)' },
      { rSolar: 1.0, label: '1 R☉' },
      { rSolar: 10.0, label: '10 R☉' },
      { rSolar: 100.0, label: '100 R☉ (Giant)' },
      { rSolar: 1000.0, label: '1000 R☉ (Supergiant)' },
    ];

    ctx.strokeStyle = '#33415544';
    ctx.setLineDash([3, 5]);
    radiusLines.forEach(rl => {
      ctx.beginPath();
      let started = false;
      for (let t = logT_min; t <= logT_max; t += 0.05) {
        // log(L / L_sun) = 2 * log10(R / R_sun) + 4 * (log10(T) - log10(5778))
        const logL = 2 * Math.log10(rl.rSolar) + 4 * (t - Math.log10(5778));
        if (logL >= logL_min && logL <= logL_max) {
          const pt = mapCoords(t, logL);
          if (!started) {
            ctx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
      }
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // 1. Draw Zero-Age Main Sequence (ZAMS) Curve
    ctx.strokeStyle = '#38bdf888';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const zamsPoints = [
      { logT: 4.58, logL: 5.7 },
      { logT: 4.45, logL: 4.2 },
      { logT: 4.25, logL: 2.8 },
      { logT: 4.00, logL: 1.4 },
      { logT: 3.85, logL: 0.5 },
      { logT: 3.76, logL: 0.0 },
      { logT: 3.65, logL: -0.8 },
      { logT: 3.55, logL: -1.8 },
      { logT: 3.45, logL: -3.2 },
    ];
    zamsPoints.forEach((zp, i) => {
      const pt = mapCoords(zp.logT, zp.logL);
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    // ZAMS Text label
    const zamsLabelPt = mapCoords(4.15, 2.0);
    ctx.font = '600 11px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Main Sequence (ZAMS)', zamsLabelPt.x + 10, zamsLabelPt.y - 6);

    // 2. Draw White Dwarf Cooling Track
    ctx.strokeStyle = '#a855f766';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const wdTrack = [
      { logT: 4.55, logL: -0.5 },
      { logT: 4.40, logL: -1.8 },
      { logT: 4.15, logL: -3.0 },
      { logT: 3.80, logL: -4.5 },
    ];
    wdTrack.forEach((wp, i) => {
      const pt = mapCoords(wp.logT, wp.logL);
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    const wdLabelPt = mapCoords(4.25, -2.5);
    ctx.font = '500 10px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#a855f7';
    ctx.fillText('White Dwarf Cooling Track', wdLabelPt.x - 30, wdLabelPt.y + 14);

    // 3. Draw Benchmark Stars
    benchmarkStars.forEach(star => {
      const pt = mapCoords(star.logTeff, star.logLuminosity);
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '500 10px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(star.name, pt.x + star.size + 4, pt.y + 3);
    });

    // 4. Current Star Position Marker
    const curLum = Math.max(1e-5, simState.luminosityResult.luminosityRatioSun);
    const curLogL = Math.log10(curLum);

    // Calculate effective temperature
    const totalMassKg = simState.massSolar * CONSTANTS.M_sun;
    const totalR_M = simState.profile.totalRadiusM;
    const totalL_W = Math.max(1e20, simState.luminosityResult.totalLuminosityW);
    const teff4 = totalL_W / (4 * Math.PI * Math.pow(totalR_M, 2) * CONSTANTS.sigma_SB);
    const curTeff = Math.max(1500, Math.pow(Math.max(1, teff4), 0.25));
    const curLogT = Math.log10(curTeff);

    const curPt = mapCoords(curLogT, curLogL);

    // Glowing pulsating target indicator
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(curPt.x, curPt.y, 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(curPt.x, curPt.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Callout Box for Current Star
    const boxW = 180;
    const boxH = 58;
    const boxX = curPt.x > width - 210 ? curPt.x - boxW - 12 : curPt.x + 14;
    const boxY = Math.min(height - 70, Math.max(margin.top + 10, curPt.y - 25));

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.2;
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.font = '700 11px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('CURRENT SIMULATION', boxX + 8, boxY + 16);

    ctx.font = '500 10px monospace';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(`T_eff: ${Math.round(curTeff)} K (logT: ${curLogT.toFixed(2)})`, boxX + 8, boxY + 32);
    ctx.fillText(`L: ${curLum.toExponential(2)} L☉ (logL: ${curLogL.toFixed(2)})`, boxX + 8, boxY + 48);

    // Axis titles
    ctx.font = '600 11px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Effective Surface Temperature T_eff [K] →', width / 2 - 100, height - 10);

    ctx.save();
    ctx.translate(16, height / 2 + 50);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Luminosity log₁₀(L / L☉) →', 0, 0);
    ctx.restore();
  }, [simState]);

  return (
    <div className="w-full h-full flex flex-col p-2 bg-slate-950">
      <div className="flex-1 relative w-full h-full min-h-[420px]">
        <canvas
          ref={canvasRef}
          className="w-full h-full block rounded-lg border border-slate-800 shadow-inner"
        />
      </div>
    </div>
  );
};
