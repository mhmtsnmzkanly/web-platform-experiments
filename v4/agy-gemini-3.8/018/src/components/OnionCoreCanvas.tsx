import React, { useRef, useEffect, useState } from 'react';
import { StellarSimulationState } from '../core/SimulationController.js';
import { CONSTANTS } from '../physics/PhysicalConstants.js';

interface OnionCoreCanvasProps {
  simState: StellarSimulationState;
}

interface ShellDefinition {
  name: string;
  element: string;
  color: string;
  outerRadiusFrac: number;
  innerRadiusFrac: number;
  temperatureK: number;
  dominantReaction: string;
  isConvective: boolean;
}

export const OnionCoreCanvas: React.FC<OnionCoreCanvasProps> = ({ simState }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredShell, setHoveredShell] = useState<ShellDefinition | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Define concentric shells based on stellar mass and type
  const getShells = (): ShellDefinition[] => {
    const m = simState.massSolar;

    if (simState.equationOfState === 'TOV_NUCLEAR') {
      return [
        { name: 'Nuclear Superfluid Core', element: 'Neutrons & Hyperons', color: '#6366f1', outerRadiusFrac: 0.65, innerRadiusFrac: 0.0, temperatureK: 1e6, dominantReaction: 'Beta equilibrium (n, p, e⁻)', isConvective: false },
        { name: 'Inner Crust', element: 'Neutron-rich Nuclei Lattice', color: '#8b5cf6', outerRadiusFrac: 0.90, innerRadiusFrac: 0.65, temperatureK: 8e5, dominantReaction: 'Neutron drip', isConvective: false },
        { name: 'Outer Crust', element: 'Iron-56 Crystal Lattice', color: '#a855f7', outerRadiusFrac: 1.0, innerRadiusFrac: 0.90, temperatureK: 5e5, dominantReaction: 'Coulomb crystal', isConvective: false },
      ];
    }

    if (simState.equationOfState === 'DEGENERATE_NON_REL' || simState.equationOfState === 'DEGENERATE_REL') {
      return [
        { name: 'Degenerate Core', element: 'Carbon & Oxygen (¹²C, ¹⁶O)', color: '#06b6d4', outerRadiusFrac: 0.88, innerRadiusFrac: 0.0, temperatureK: simState.centralTemperatureK, dominantReaction: 'Electron degeneracy support', isConvective: false },
        { name: 'Helium Mantle', element: 'Helium (⁴He)', color: '#38bdf8', outerRadiusFrac: 0.98, innerRadiusFrac: 0.88, temperatureK: simState.centralTemperatureK * 0.3, dominantReaction: 'Inert degenerate mantle', isConvective: false },
        { name: 'Thin Atmosphere', element: 'Hydrogen (¹H)', color: '#93c5fd', outerRadiusFrac: 1.0, innerRadiusFrac: 0.98, temperatureK: 2.5e4, dominantReaction: 'Gravitational stratification', isConvective: false },
      ];
    }

    if (m >= 8.0) {
      // Massive star onion skin shells
      return [
        { name: 'Iron Core', element: 'Iron-56 (⁵⁶Fe)', color: '#e2e8f0', outerRadiusFrac: 0.12, innerRadiusFrac: 0.0, temperatureK: 3.5e9, dominantReaction: 'Endothermic photodisintegration', isConvective: false },
        { name: 'Silicon Shell', element: 'Silicon (²⁸Si) & Sulfur (³²S)', color: '#d946ef', outerRadiusFrac: 0.22, innerRadiusFrac: 0.12, temperatureK: 2.7e9, dominantReaction: '²⁸Si + 7 α → ⁵⁶Ni', isConvective: true },
        { name: 'Oxygen Shell', element: 'Oxygen (¹⁶O) & Magnesium (²⁴Mg)', color: '#f97316', outerRadiusFrac: 0.35, innerRadiusFrac: 0.22, temperatureK: 1.8e9, dominantReaction: '¹⁶O + ¹⁶O → ²⁸Si + ⁴He', isConvective: true },
        { name: 'Neon Shell', element: 'Neon (²⁰Ne)', color: '#06b6d4', outerRadiusFrac: 0.48, innerRadiusFrac: 0.35, temperatureK: 1.2e9, dominantReaction: '²⁰Ne + γ → ¹⁶O + ⁴He', isConvective: true },
        { name: 'Carbon Shell', element: 'Carbon (¹²C)', color: '#10b981', outerRadiusFrac: 0.62, innerRadiusFrac: 0.48, temperatureK: 8.0e8, dominantReaction: '¹²C + ¹²C → ²⁰Ne + ⁴He', isConvective: true },
        { name: 'Helium Shell', element: 'Helium (⁴He)', color: '#f59e0b', outerRadiusFrac: 0.80, innerRadiusFrac: 0.62, temperatureK: 2.0e8, dominantReaction: 'Triple-α: 3 ⁴He → ¹²C', isConvective: true },
        { name: 'Hydrogen Envelope', element: 'Hydrogen (¹H)', color: '#ef4444', outerRadiusFrac: 1.0, innerRadiusFrac: 0.80, temperatureK: 4.0e7, dominantReaction: 'CNO cycle & p-p chain', isConvective: true },
      ];
    }

    // Solar type star: Core + Radiative Zone + Convective Envelope
    return [
      { name: 'Thermonuclear Core', element: 'Hydrogen & Helium (¹H → ⁴He)', color: '#fbbf24', outerRadiusFrac: 0.25, innerRadiusFrac: 0.0, temperatureK: 1.57e7, dominantReaction: 'p-p chain (4 ¹H → ⁴He)', isConvective: false },
      { name: 'Radiative Transfer Zone', element: 'Ionized Plasma (H, He)', color: '#f97316', outerRadiusFrac: 0.70, innerRadiusFrac: 0.25, temperatureK: 7.0e6, dominantReaction: 'Photon diffusion (mean free path ~ 1 mm)', isConvective: false },
      { name: 'Convective Envelope', element: 'Hydrogen & Helium Envelope', color: '#ef4444', outerRadiusFrac: 1.0, innerRadiusFrac: 0.70, temperatureK: 1.0e6, dominantReaction: 'Thermal convection granulation', isConvective: true },
    ];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cachedW = 0;
    let cachedH = 0;
    let timeOffset = 0;

    const render = () => {
      timeOffset += 0.02;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const targetW = Math.floor(rect.width * dpr);
      const targetH = Math.floor(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        cachedW = rect.width;
        cachedH = rect.height;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const width = cachedW || rect.width;
      const height = cachedH || rect.height;

      // Deep space background
      ctx.fillStyle = '#060911';
      ctx.fillRect(0, 0, width, height);

      const centerX = width * 0.45;
      const centerY = height * 0.5;
      const maxStarRadius = Math.min(width * 0.4, height * 0.42);

      const shells = getShells();
      const sn = simState.supernovaState;

      // 1. Draw Concentric Shells (Cutaway Half-Circle / Full Circle)
      shells.slice().reverse().forEach((shell) => {
        const outerR = shell.outerRadiusFrac * maxStarRadius;
        const innerR = shell.innerRadiusFrac * maxStarRadius;

        // Outer glow gradient
        const grad = ctx.createRadialGradient(centerX, centerY, innerR, centerX, centerY, outerR);
        grad.addColorStop(0, shell.color);
        grad.addColorStop(1, shell.color + 'aa');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerR, 0, Math.PI * 2);
        ctx.fill();

        // Boundary line
        ctx.strokeStyle = '#ffffff22';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Convective Loops in convective zones
        if (shell.isConvective && !sn.isCollapsing) {
          const midR = (innerR + outerR) * 0.5;
          const numLoops = Math.floor(shell.outerRadiusFrac * 12);
          for (let i = 0; i < numLoops; i++) {
            const angle = (i / numLoops) * Math.PI * 2 + timeOffset * 0.5 * (i % 2 === 0 ? 1 : -1);
            const cx = centerX + Math.cos(angle) * midR;
            const cy = centerY + Math.sin(angle) * midR;
            const loopRadius = (outerR - innerR) * 0.3;

            ctx.strokeStyle = '#ffffff44';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(cx, cy, loopRadius, timeOffset * 2, timeOffset * 2 + Math.PI * 1.5);
            ctx.stroke();
          }
        }
      });

      // 2. Supernova Core Collapse & Shock Animation
      if (sn.isCollapsing) {
        const collapseT = sn.collapseTimeMs;

        if (collapseT < 100.0) {
          // Implosion phase: Inward compression arrows
          const collapseFraction = collapseT / 100.0;
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          for (let a = 0; a < 12; a++) {
            const angle = (a / 12) * Math.PI * 2;
            const startR = maxStarRadius * (0.8 - collapseFraction * 0.4);
            const endR = maxStarRadius * (0.3 - collapseFraction * 0.2);
            ctx.beginPath();
            ctx.moveTo(centerX + Math.cos(angle) * startR, centerY + Math.sin(angle) * startR);
            ctx.lineTo(centerX + Math.cos(angle) * endR, centerY + Math.sin(angle) * endR);
            ctx.stroke();
          }
        } else {
          // Post-bounce Blast Wave
          const shockRadiusPx = Math.min(maxStarRadius * 1.4, (sn.shockRadiusMeters / 1e6) * 1.2);

          // Blinding Core Bounce Flash
          const flashAlpha = Math.max(0, 1.0 - (collapseT - 100.0) / 40.0);
          if (flashAlpha > 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.9})`;
            ctx.beginPath();
            ctx.arc(centerX, centerY, maxStarRadius * 1.2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Expanding Shock Wave Ring
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(centerX, centerY, shockRadiusPx, 0, Math.PI * 2);
          ctx.stroke();

          // Shock Glow
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
          ctx.lineWidth = 12;
          ctx.beginPath();
          ctx.arc(centerX, centerY, shockRadiusPx, 0, Math.PI * 2);
          ctx.stroke();

          // Ejecta debris particles
          const seed = 12345;
          ctx.fillStyle = '#fef08a';
          for (let p = 0; p < 40; p++) {
            const pAngle = ((p * 137.5) % 360) * (Math.PI / 180);
            const pDist = shockRadiusPx * (0.4 + (p % 10) * 0.05);
            ctx.beginPath();
            ctx.arc(centerX + Math.cos(pAngle) * pDist, centerY + Math.sin(pAngle) * pDist, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Remnant in center
          ctx.fillStyle = sn.remnantType === 'BLACK_HOLE' ? '#000000' : '#818cf8';
          ctx.beginPath();
          ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // 3. Shell Legend & Detail Sidebar
      const sidebarX = width * 0.72;
      const sidebarY = 30;

      ctx.fillStyle = '#1e293b';
      ctx.font = '600 13px Inter, system-ui, sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('Nuclear Burning Shells', sidebarX, sidebarY);

      shells.forEach((shell, idx) => {
        const itemY = sidebarY + 28 + idx * 36;
        const isHovered = hoveredShell?.name === shell.name;

        // Color badge
        ctx.fillStyle = shell.color;
        ctx.fillRect(sidebarX, itemY - 10, 12, 12);
        ctx.strokeStyle = isHovered ? '#ffffff' : '#334155';
        ctx.strokeRect(sidebarX, itemY - 10, 12, 12);

        // Name & Element
        ctx.font = isHovered ? '600 12px Inter, system-ui, sans-serif' : '500 11px Inter, system-ui, sans-serif';
        ctx.fillStyle = isHovered ? '#38bdf8' : '#e2e8f0';
        ctx.fillText(shell.name, sidebarX + 20, itemY);

        ctx.font = '400 10px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`${shell.element} • T ~ ${shell.temperatureK.toExponential(1)} K`, sidebarX + 20, itemY + 14);
      });

      // Hovered Shell Detailed Callout Card
      if (hoveredShell) {
        const cardX = 20;
        const cardY = height - 120;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.fillRect(cardX, cardY, 320, 100);
        ctx.strokeRect(cardX, cardY, 320, 100);

        ctx.font = '600 12px Inter, system-ui, sans-serif';
        ctx.fillStyle = hoveredShell.color;
        ctx.fillText(`${hoveredShell.name} (${hoveredShell.element})`, cardX + 12, cardY + 22);

        ctx.font = '500 11px monospace';
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(`Ignition Temp: ${hoveredShell.temperatureK.toExponential(2)} K`, cardX + 12, cardY + 42);

        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`Reaction: ${hoveredShell.dominantReaction}`, cardX + 12, cardY + 62);

        ctx.fillStyle = hoveredShell.isConvective ? '#f59e0b' : '#38bdf8';
        ctx.fillText(`Transport: ${hoveredShell.isConvective ? 'Convective Overturn' : 'Radiative Transfer'}`, cardX + 12, cardY + 82);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [simState, hoveredShell]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width * 0.45;
    const centerY = rect.height * 0.5;
    const maxStarRadius = Math.min(rect.width * 0.4, rect.height * 0.42);

    const dist = Math.hypot(x - centerX, y - centerY);
    const distFrac = dist / maxStarRadius;

    if (distFrac <= 1.0) {
      const shells = getShells();
      const match = shells.find(s => distFrac >= s.innerRadiusFrac && distFrac < s.outerRadiusFrac);
      setHoveredShell(match || null);
    } else {
      setHoveredShell(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredShell(null);
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
