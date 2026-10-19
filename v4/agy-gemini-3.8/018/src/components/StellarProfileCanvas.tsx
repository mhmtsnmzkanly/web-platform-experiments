import React, { useRef, useEffect, useState } from 'react';
import { StellarRadialProfile } from '../physics/LaneEmdenSolver.js';
import { NuclearEmissivityResult } from '../physics/NuclearKinetics.js';
import { CONSTANTS } from '../physics/PhysicalConstants.js';

interface StellarProfileCanvasProps {
  profile: StellarRadialProfile;
  luminosityResult: {
    totalLuminosityW: number;
    luminosityRatioSun: number;
    emissivities: NuclearEmissivityResult[];
  };
}

export const StellarProfileCanvas: React.FC<StellarProfileCanvasProps> = ({
  profile,
  luminosityResult,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverFraction, setHoverFraction] = useState<number | null>(null);

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
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Layout: Two vertically stacked plots with margins
    const margin = { top: 32, right: 30, bottom: 35, left: 65 };
    const plotHeight = (height - margin.top - margin.bottom - 40) / 2;
    const plotWidth = width - margin.left - margin.right;

    const topPlot = { x: margin.left, y: margin.top, w: plotWidth, h: plotHeight };
    const bottomPlot = { x: margin.left, y: margin.top + plotHeight + 35, w: plotWidth, h: plotHeight };

    // Draw Plot Frames & Grid
    const drawGrid = (plot: { x: number; y: number; w: number; h: number }, yLabel: string, title: string) => {
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;

      // Title
      ctx.font = '600 12px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(title, plot.x, plot.y - 10);

      // Y-axis label
      ctx.font = '500 10px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(yLabel, plot.x - 55, plot.y + 12);

      // Grid lines
      for (let i = 0; i <= 4; i++) {
        const y = plot.y + (plot.h * i) / 4;
        ctx.beginPath();
        ctx.moveTo(plot.x, y);
        ctx.lineTo(plot.x + plot.w, y);
        ctx.stroke();

        const val = (1.0 - i * 0.25).toFixed(2);
        ctx.fillStyle = '#475569';
        ctx.font = '10px monospace';
        ctx.fillText(val, plot.x - 32, y + 3);
      }

      for (let i = 0; i <= 5; i++) {
        const x = plot.x + (plot.w * i) / 5;
        ctx.beginPath();
        ctx.moveTo(x, plot.y);
        ctx.lineTo(x, plot.y + plot.h);
        ctx.stroke();

        const val = (i * 0.2).toFixed(1);
        ctx.fillStyle = '#475569';
        ctx.font = '10px monospace';
        ctx.fillText(val, x - 8, plot.y + plot.h + 16);
      }

      // Border
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(plot.x, plot.y, plot.w, plot.h);
    };

    drawGrid(topPlot, 'Ratio', 'Interior Thermodynamic Profiles: P/P_c, ρ/ρ_c, T/T_c');
    drawGrid(bottomPlot, 'Fraction', 'Enclosed Mass Fraction M(r)/M_total & Nuclear Emissivity ε(r)');

    const points = profile.points;
    if (points.length < 2) return;

    // Helper to map (radiusFraction, normalizedVal) to canvas coords
    const mapTop = (rFrac: number, val: number) => ({
      x: topPlot.x + rFrac * topPlot.w,
      y: topPlot.y + (1.0 - Math.max(0, Math.min(1.0, val))) * topPlot.h,
    });

    const mapBottom = (rFrac: number, val: number) => ({
      x: bottomPlot.x + rFrac * bottomPlot.w,
      y: bottomPlot.y + (1.0 - Math.max(0, Math.min(1.0, val))) * bottomPlot.h,
    });

    // 1. Draw Density Curve ρ(r)/ρ_c (Cyan)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    points.forEach((p, idx) => {
      const normRho = p.rho / Math.max(1, profile.centralDensityKgM3);
      const pt = mapTop(p.radiusFraction, normRho);
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    // 2. Draw Pressure Curve P(r)/P_c (Amber)
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    points.forEach((p, idx) => {
      const normP = p.pressure / Math.max(1, profile.centralPressurePa);
      const pt = mapTop(p.radiusFraction, normP);
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    // 3. Draw Temperature Curve T(r)/T_c (Rose)
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    points.forEach((p, idx) => {
      const normT = p.temperature / Math.max(1, profile.centralTemperatureK);
      const pt = mapTop(p.radiusFraction, normT);
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    // 4. Draw Enclosed Mass M(r)/M_total (Emerald)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    points.forEach((p, idx) => {
      const pt = mapBottom(p.radiusFraction, p.massFraction);
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    // 5. Draw Nuclear Emissivity ε(r) (Violet)
    const emissivities = luminosityResult.emissivities;
    const maxEps = emissivities.reduce((max, em) => Math.max(max, em.epsilon_total), 0);
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    points.forEach((p, idx) => {
      const em = idx < emissivities.length ? emissivities[idx].epsilon_total : 0;
      const normEps = maxEps > 0 ? em / maxEps : 0;
      const pt = mapBottom(p.radiusFraction, normEps);
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    // Legends
    // Top Legend
    const drawLegendItem = (x: number, y: number, color: string, label: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y - 4, 12, 4);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 11px Inter, system-ui, sans-serif';
      ctx.fillText(label, x + 16, y);
    };

    drawLegendItem(topPlot.x + topPlot.w - 240, topPlot.y - 10, '#38bdf8', 'Density ρ/ρ_c');
    drawLegendItem(topPlot.x + topPlot.w - 150, topPlot.y - 10, '#fbbf24', 'Pressure P/P_c');
    drawLegendItem(topPlot.x + topPlot.w - 65, topPlot.y - 10, '#f43f5e', 'Temp T/T_c');

    drawLegendItem(bottomPlot.x + bottomPlot.w - 240, bottomPlot.y - 10, '#10b981', 'Enclosed M(r)');
    drawLegendItem(bottomPlot.x + bottomPlot.w - 120, bottomPlot.y - 10, '#a855f7', 'Emissivity ε(r)');

    // Hover Line & Coordinate Readout
    if (hoverFraction !== null) {
      const hoverX = topPlot.x + hoverFraction * topPlot.w;

      ctx.strokeStyle = '#f8fafc';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;

      // Top vertical line
      ctx.beginPath();
      ctx.moveTo(hoverX, topPlot.y);
      ctx.lineTo(hoverX, topPlot.y + topPlot.h);
      ctx.stroke();

      // Bottom vertical line
      ctx.beginPath();
      ctx.moveTo(hoverX, bottomPlot.y);
      ctx.lineTo(hoverX, bottomPlot.y + bottomPlot.h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Continuous linear interpolation between adjacent points
      const exactIndex = hoverFraction * (points.length - 1);
      const i0 = Math.floor(exactIndex);
      const i1 = Math.min(points.length - 1, i0 + 1);
      const t_frac = exactIndex - i0;

      const p0 = points[i0];
      const p1 = points[i1];

      const r_interp = p0.r + t_frac * (p1.r - p0.r);
      const rho_interp = p0.rho + t_frac * (p1.rho - p0.rho);
      const P_interp = p0.pressure + t_frac * (p1.pressure - p0.pressure);
      const T_interp = p0.temperature + t_frac * (p1.temperature - p0.temperature);
      const M_interp = p0.enclosedMass + t_frac * (p1.enclosedMass - p0.enclosedMass);
      const massFrac_interp = p0.massFraction + t_frac * (p1.massFraction - p0.massFraction);

      const em0 = i0 < emissivities.length ? emissivities[i0].epsilon_total : 0;
      const em1 = i1 < emissivities.length ? emissivities[i1].epsilon_total : 0;
      const em_interp = em0 + t_frac * (em1 - em0);

      // Tooltip Card in top plot corner
      const tooltipX = hoverFraction > 0.6 ? topPlot.x + 10 : topPlot.x + topPlot.w - 200;
      const tooltipY = topPlot.y + 10;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.fillRect(tooltipX, tooltipY, 190, 110);
      ctx.strokeRect(tooltipX, tooltipY, 190, 110);

      ctx.font = '600 11px monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`r/R: ${hoverFraction.toFixed(3)} (${(r_interp / 1000).toFixed(0)} km)`, tooltipX + 8, tooltipY + 16);

      ctx.font = '500 10px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`ρ: ${rho_interp.toExponential(3)} kg/m³`, tooltipX + 8, tooltipY + 34);

      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`P: ${P_interp.toExponential(3)} Pa`, tooltipX + 8, tooltipY + 52);

      ctx.fillStyle = '#f43f5e';
      ctx.fillText(`T: ${T_interp.toExponential(3)} K`, tooltipX + 8, tooltipY + 70);

      ctx.fillStyle = '#10b981';
      ctx.fillText(`M(r): ${(M_interp / CONSTANTS.M_sun).toFixed(3)} M☉ (${(massFrac_interp * 100).toFixed(1)}%)`, tooltipX + 8, tooltipY + 88);

      ctx.fillStyle = '#a855f7';
      ctx.fillText(`ε: ${em_interp.toExponential(2)} W/kg`, tooltipX + 8, tooltipY + 104);
    }

    // X-axis label
    ctx.font = '500 11px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Fractional Stellar Radius r / R', bottomPlot.x + bottomPlot.w / 2 - 80, bottomPlot.y + bottomPlot.h + 30);
  }, [profile, luminosityResult, hoverFraction]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const margin = { left: 65, right: 30 };
    const plotWidth = rect.width - margin.left - margin.right;
    const clientX = e.clientX - rect.left;

    if (clientX >= margin.left && clientX <= rect.width - margin.right) {
      const frac = (clientX - margin.left) / plotWidth;
      setHoverFraction(Math.max(0, Math.min(1.0, frac)));
    } else {
      setHoverFraction(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverFraction(null);
  };

  return (
    <div className="w-full h-full flex flex-col p-2 bg-slate-950">
      <div className="flex-1 relative w-full h-full min-h-[420px]">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full block rounded-lg border border-slate-800 shadow-inner cursor-crosshair"
        />
      </div>
    </div>
  );
};
