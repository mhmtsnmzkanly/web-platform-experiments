import React, { useRef, useEffect, useState } from 'react';
import { StellarSimulationState } from '../core/SimulationController.js';
import { IsotopeAbundance } from '../physics/SupernovaCollapseEngine.js';

interface NucleosynthesisCanvasProps {
  simState: StellarSimulationState;
}

interface NuclideInfo {
  Z: number;
  N: number;
  symbol: string;
  name: string;
  bindingEnergyMeV: number; // Binding energy per nucleon E_B / A
  halfLife: string;
  isStable: boolean;
  process: 'PRIMORDIAL' | 'STELLAR_FUSION' | 'ALPHA_CHAIN' | 'EXPLOSIVE_BURNING' | 'R_PROCESS';
}

export const NucleosynthesisCanvas: React.FC<NucleosynthesisCanvasProps> = ({ simState }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredNuclide, setHoveredNuclide] = useState<NuclideInfo | null>(null);

  // Key Nuclides for Stellar Astrophysics
  const nuclides: NuclideInfo[] = [
    { Z: 1, N: 0, symbol: '¹H', name: 'Hydrogen-1', bindingEnergyMeV: 0.0, halfLife: 'Stable', isStable: true, process: 'PRIMORDIAL' },
    { Z: 1, N: 1, symbol: '²H', name: 'Deuterium', bindingEnergyMeV: 1.11, halfLife: 'Stable', isStable: true, process: 'PRIMORDIAL' },
    { Z: 2, N: 1, symbol: '³He', name: 'Helium-3', bindingEnergyMeV: 2.57, halfLife: 'Stable', isStable: true, process: 'STELLAR_FUSION' },
    { Z: 2, N: 2, symbol: '⁴He', name: 'Helium-4', bindingEnergyMeV: 7.07, halfLife: 'Stable', isStable: true, process: 'STELLAR_FUSION' },
    { Z: 6, N: 6, symbol: '¹²C', name: 'Carbon-12', bindingEnergyMeV: 7.68, halfLife: 'Stable', isStable: true, process: 'ALPHA_CHAIN' },
    { Z: 7, N: 7, symbol: '¹⁴N', name: 'Nitrogen-14', bindingEnergyMeV: 7.48, halfLife: 'Stable', isStable: true, process: 'STELLAR_FUSION' },
    { Z: 8, N: 8, symbol: '¹⁶O', name: 'Oxygen-16', bindingEnergyMeV: 7.98, halfLife: 'Stable', isStable: true, process: 'ALPHA_CHAIN' },
    { Z: 10, N: 10, symbol: '²⁰Ne', name: 'Neon-20', bindingEnergyMeV: 8.03, halfLife: 'Stable', isStable: true, process: 'ALPHA_CHAIN' },
    { Z: 12, N: 12, symbol: '²⁴Mg', name: 'Magnesium-24', bindingEnergyMeV: 8.26, halfLife: 'Stable', isStable: true, process: 'ALPHA_CHAIN' },
    { Z: 14, N: 14, symbol: '²⁸Si', name: 'Silicon-28', bindingEnergyMeV: 8.45, halfLife: 'Stable', isStable: true, process: 'ALPHA_CHAIN' },
    { Z: 26, N: 30, symbol: '⁵⁶Fe', name: 'Iron-56', bindingEnergyMeV: 8.79, halfLife: 'Stable', isStable: true, process: 'STELLAR_FUSION' },
    { Z: 28, N: 28, symbol: '⁵⁶Ni', name: 'Nickel-56', bindingEnergyMeV: 8.64, halfLife: '6.075 days (β+)', isStable: false, process: 'EXPLOSIVE_BURNING' },
    { Z: 27, N: 29, symbol: '⁵⁶Co', name: 'Cobalt-56', bindingEnergyMeV: 8.69, halfLife: '77.2 days (β+)', isStable: false, process: 'EXPLOSIVE_BURNING' },
    { Z: 79, N: 118, symbol: '¹⁹⁷Au', name: 'Gold-197', bindingEnergyMeV: 7.92, halfLife: 'Stable', isStable: true, process: 'R_PROCESS' },
    { Z: 92, N: 146, symbol: '²³⁸U', name: 'Uranium-238', bindingEnergyMeV: 7.57, halfLife: '4.468 Gyr (α)', isStable: false, process: 'R_PROCESS' },
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
    ctx.fillStyle = '#060911';
    ctx.fillRect(0, 0, width, height);

    // Left Panel: Chart of Nuclides Grid
    // Right Panel: Live Supernova Isotope Yields Bar Chart
    const splitX = width * 0.55;

    // 1. Chart of Nuclides
    ctx.font = '600 13px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('Chart of Nuclides (Z vs N)', 30, 28);

    const chartBox = { x: 45, y: 45, w: splitX - 65, h: height - 85 };

    // Draw Grid axes
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(chartBox.x, chartBox.y, chartBox.w, chartBox.h);

    // Map (N, Z) -> Canvas coordinates
    // N range: 0 to 155
    // Z range: 0 to 95
    const mapNuclide = (N: number, Z: number) => ({
      x: chartBox.x + (N / 155) * chartBox.w,
      y: chartBox.y + (1.0 - Z / 95) * chartBox.h,
    });

    // Stability valley backbone line (empirical N ~ Z + 0.006 * A^(5/3))
    ctx.strokeStyle = '#33415555';
    ctx.lineWidth = 12;
    ctx.beginPath();
    for (let z = 1; z <= 92; z += 2) {
      const n = z <= 20 ? z : z * (1 + 0.006 * Math.pow(z * 2, 2 / 3));
      const pt = mapNuclide(n, z);
      if (z === 1) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();

    // Alpha-chain pathway line: 12C -> 16O -> 20Ne -> 24Mg -> 28Si -> 56Ni
    const alphaChain = nuclides.filter(n => n.process === 'ALPHA_CHAIN' || n.symbol === '⁵⁶Ni');
    ctx.strokeStyle = '#f59e0b88';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    alphaChain.forEach((n, idx) => {
      const pt = mapNuclide(n.N, n.Z);
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Supernova 56Ni -> 56Co -> 56Fe decay pathway line
    const feDecayChain = [
      nuclides.find(n => n.symbol === '⁵⁶Ni')!,
      nuclides.find(n => n.symbol === '⁵⁶Co')!,
      nuclides.find(n => n.symbol === '⁵⁶Fe')!,
    ];
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    feDecayChain.forEach((n, idx) => {
      const pt = mapNuclide(n.N, n.Z);
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();

    // Draw Nuclide Nodes
    nuclides.forEach(n => {
      const pt = mapNuclide(n.N, n.Z);
      const isHovered = hoveredNuclide?.symbol === n.symbol;

      let fillColor = '#38bdf8';
      if (n.process === 'ALPHA_CHAIN') fillColor = '#f59e0b';
      if (n.process === 'EXPLOSIVE_BURNING') fillColor = '#ef4444';
      if (n.process === 'R_PROCESS') fillColor = '#eab308';
      if (n.symbol === '⁵⁶Fe') fillColor = '#10b981';

      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isHovered ? 8 : 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.stroke();

      // Label
      ctx.font = isHovered ? '700 11px Inter, sans-serif' : '500 10px Inter, sans-serif';
      ctx.fillStyle = isHovered ? '#ffffff' : '#cbd5e1';
      ctx.fillText(n.symbol, pt.x + 8, pt.y + 3);
    });

    // Axis labels
    ctx.font = '500 10px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Neutron Number N →', chartBox.x + chartBox.w / 2 - 40, chartBox.y + chartBox.h + 18);

    ctx.save();
    ctx.translate(chartBox.x - 22, chartBox.y + chartBox.h / 2 + 30);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Proton Number Z →', 0, 0);
    ctx.restore();

    // 2. Right Panel: Live Abundance Bar Chart
    const barBox = { x: splitX + 20, y: 45, w: width - splitX - 45, h: height - 85 };

    ctx.font = '600 13px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText('Stellar Isotope Abundance Spectrum', barBox.x, 28);

    const abundances = simState.supernovaState.abundances;
    const barHeight = Math.min(22, (barBox.h - 30) / abundances.length);

    abundances.forEach((item, idx) => {
      const y = barBox.y + 10 + idx * (barHeight + 6);
      const frac = item.massFraction;
      const barW = Math.max(2, frac * (barBox.w - 110));

      // Label
      ctx.font = '500 11px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`${item.symbol} (${item.element})`, barBox.x, y + barHeight - 6);

      // Bar background
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(barBox.x + 100, y, barBox.w - 100, barHeight);

      // Active fill
      let barColor = '#38bdf8';
      if (item.origin === 'EXPLOSIVE_BURNING') barColor = '#ef4444';
      if (item.origin === 'R_PROCESS') barColor = '#eab308';
      if (item.symbol === '⁵⁶Fe') barColor = '#10b981';

      ctx.fillStyle = barColor;
      ctx.fillRect(barBox.x + 100, y, barW, barHeight);

      // Percentage label
      ctx.font = '500 10px monospace';
      ctx.fillStyle = '#94a3b8';
      const pctStr = frac >= 0.001 ? `${(frac * 100).toFixed(1)}%` : `${(frac * 100).toExponential(1)}%`;
      ctx.fillText(pctStr, barBox.x + 105 + barW, y + barHeight - 6);
    });

    // Hover tooltip card
    if (hoveredNuclide) {
      const tipX = chartBox.x + 10;
      const tipY = chartBox.y + chartBox.h - 100;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.fillRect(tipX, tipY, 260, 90);
      ctx.strokeRect(tipX, tipY, 260, 90);

      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`${hoveredNuclide.name} (${hoveredNuclide.symbol})`, tipX + 10, tipY + 20);

      ctx.font = '500 10px monospace';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`Protons Z: ${hoveredNuclide.Z} | Neutrons N: ${hoveredNuclide.N}`, tipX + 10, tipY + 38);
      ctx.fillText(`Binding Energy: ${hoveredNuclide.bindingEnergyMeV.toFixed(2)} MeV/nucleon`, tipX + 10, tipY + 54);
      ctx.fillText(`Half-life: ${hoveredNuclide.halfLife}`, tipX + 10, tipY + 70);
      ctx.fillText(`Process: ${hoveredNuclide.process.replace('_', ' ')}`, tipX + 10, tipY + 84);
    }
  }, [simState, hoveredNuclide]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const splitX = rect.width * 0.55;
    const chartBox = { x: 45, y: 45, w: splitX - 65, h: rect.height - 85 };

    const mapNuclide = (N: number, Z: number) => ({
      x: chartBox.x + (N / 155) * chartBox.w,
      y: chartBox.y + (1.0 - Z / 95) * chartBox.h,
    });

    let found: NuclideInfo | null = null;
    for (const n of nuclides) {
      const pt = mapNuclide(n.N, n.Z);
      const dist = Math.hypot(x - pt.x, y - pt.y);
      if (dist <= 12) {
        found = n;
        break;
      }
    }
    setHoveredNuclide(found);
  };

  const handleMouseLeave = () => {
    setHoveredNuclide(null);
  };

  return (
    <div className="w-full h-full flex flex-col p-2 bg-slate-950">
      <div className="flex-1 relative w-full h-full min-h-[420px]">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full block rounded-lg border border-slate-800 shadow-inner cursor-pointer"
        />
      </div>
    </div>
  );
};
