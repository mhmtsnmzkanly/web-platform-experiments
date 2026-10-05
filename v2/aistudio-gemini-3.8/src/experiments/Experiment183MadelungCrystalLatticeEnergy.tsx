import React, { useRef, useEffect, useState } from 'react';
import { Atom, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment183MadelungCrystalLatticeEnergy() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shellsSummed, setShellsSummed] = useState(4); // Shell radius in lattice units
  const [latticeConstR0, setLatticeConstR0] = useState(0.282); // nm (NaCl)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Madelung Constant (Erwin Madelung, 1918):
    // Total electrostatic potential energy of an ion in an ionic crystal (e.g. NaCl rock salt):
    // E_net = - (e^2 / 4*pi*epsilon_0 * r_0) * M
    // where M is the Madelung constant obtained by alternating summing 3D shells:
    // M = sum_{j != 0} [ (-1)^{j_x + j_y + j_z} / sqrt(j_x^2 + j_y^2 + j_z^2) ] ~ 1.747565 for NaCl rock-salt!

    let partialMadelung = 0;
    for (let x = -shellsSummed; x <= shellsSummed; x++) {
      for (let y = -shellsSummed; y <= shellsSummed; y++) {
        for (let z = -shellsSummed; z <= shellsSummed; z++) {
          if (x === 0 && y === 0 && z === 0) continue;
          const dist = Math.sqrt(x * x + y * y + z * z);
          const sign = (Math.abs(x + y + z) % 2 === 0) ? -1 : 1;
          partialMadelung += sign / dist;
        }
      }
    }

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.45;
      const cy = height * 0.5;

      ctx.fillStyle = '#06070d';
      ctx.fillRect(0, 0, width, height);

      // Draw 3D Isometric Ionic Crystal Lattice
      const scale = 32;
      const rotY = Date.now() * 0.0004;

      const project = (x: number, y: number, z: number) => {
        const rx = x * Math.cos(rotY) - z * Math.sin(rotY);
        const rz = x * Math.sin(rotY) + z * Math.cos(rotY);
        return {
          px: cx + rx * scale,
          py: cy - (y * scale * 0.8 + rz * scale * 0.35),
        };
      };

      const maxDim = Math.min(3, shellsSummed);

      // Draw ions in lattice
      for (let x = -maxDim; x <= maxDim; x++) {
        for (let y = -maxDim; y <= maxDim; y++) {
          for (let z = -maxDim; z <= maxDim; z++) {
            const { px, py } = project(x, y, z);
            const isPositive = (Math.abs(x + y + z) % 2 === 0);

            // Connect lines to positive neighbors along axes
            if (x < maxDim) {
              const pNext = project(x + 1, y, z);
              ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(pNext.px, pNext.py);
              ctx.stroke();
            }
            if (y < maxDim) {
              const pNext = project(x, y + 1, z);
              ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(pNext.px, pNext.py);
              ctx.stroke();
            }

            // Ion Sphere: Na+ (Purple) vs Cl- (Green)
            ctx.fillStyle = isPositive ? '#a855f7' : '#22c55e';
            ctx.beginPath();
            ctx.arc(px, py, isPositive ? 4.5 : 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Highlight central reference ion
      const centerPt = project(0, 0, 0);
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerPt.px, centerPt.py, 10, 0, Math.PI * 2);
      ctx.stroke();

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 270, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 270, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('MADELUNG CRYSTAL LATTICE ENERGY', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Summed Cube Shells: ±${shellsSummed} units`, 45, 72);
      ctx.fillText(`Madelung Constant M: ~${Math.abs(partialMadelung).toFixed(4)}`, 45, 90);
      ctx.fillText(`Rock-Salt NaCl Exact: M = 1.747565`, 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1918 ERWIN MADELUNG CONSTANT · ELECTROSTATIC COULOMB ENERGY OF IONIC ROCK-SALT LATTICES', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [shellsSummed, latticeConstR0]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-purple-400">
            <span className="flex items-center gap-1.5 font-mono"><Atom size={14} /> Summed Lattice Shells (N)</span>
            <span className="font-mono">±{shellsSummed} units</span>
          </div>
          <input
            type="range"
            min="2"
            max="6"
            value={shellsSummed}
            onChange={(e) => setShellsSummed(Number(e.target.value))}
            className="accent-purple-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Nearest Neighbor Distance (r_0)</span>
            <span className="font-mono">{latticeConstR0.toFixed(3)} nm (NaCl)</span>
          </div>
          <input
            type="range"
            min="0.220"
            max="0.380"
            step="0.005"
            value={latticeConstR0}
            onChange={(e) => setLatticeConstR0(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
