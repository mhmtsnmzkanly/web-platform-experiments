import React, { useRef, useEffect, useState } from 'react';
import { Atom, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment168BraggXRayCrystalDiffraction() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [glancingAngleTheta, setGlancingAngleTheta] = useState(28.4); // degrees
  const [latticeSpacingD, setLatticeSpacingD] = useState(0.282); // nm (NaCl crystal)
  const [xrayWavelength, setXrayWavelength] = useState(0.154); // nm (Copper K-alpha)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width * 0.42;
      const cy = height * 0.52;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      // Bragg's Law:
      // 2 * d * sin(theta) = n * lambda
      // Path difference between rays reflected from adjacent atomic crystal planes:
      // Delta L = 2 * d * sin(theta)
      // When Delta L is an exact integer multiple of lambda, constructive interference occurs!

      const thetaRad = (glancingAngleTheta * Math.PI) / 180;
      const pathDifference = 2 * latticeSpacingD * Math.sin(thetaRad);
      const orderFraction = pathDifference / xrayWavelength;
      const nearestOrder = Math.round(orderFraction);
      const constructiveIntensity = Math.exp(-Math.pow(orderFraction - nearestOrder, 2) / 0.008);

      // Draw Atomic Crystal Lattice Planes (3 horizontal planes of atoms)
      const numPlanes = 3;
      const planeDistancePx = 55;
      const atomsPerPlane = 12;
      const atomSpacingPx = 45;

      for (let p = 0; p < numPlanes; p++) {
        const py = cy + p * planeDistancePx;

        // Plane guideline
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(cx - 240, py);
        ctx.lineTo(cx + 240, py);
        ctx.stroke();
        ctx.setLineDash([]);

        // Atoms in plane
        for (let a = 0; a < atomsPerPlane; a++) {
          const ax = cx - 220 + a * atomSpacingPx;
          ctx.fillStyle = a % 2 === 0 ? '#38bdf8' : '#22c55e'; // Na+ and Cl-
          ctx.beginPath();
          ctx.arc(ax, py, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // X-Ray Beams:
      // Incident Beam 1 targeting atom in Plane 0
      const atom0 = { x: cx - 20, y: cy };
      const atom1 = { x: cx - 20, y: cy + planeDistancePx };

      const rayLength = 180;

      // Ray 1 (Plane 0 reflection)
      const r1xIn = atom0.x - Math.cos(thetaRad) * rayLength;
      const r1yIn = atom0.y - Math.sin(thetaRad) * rayLength;
      const r1xOut = atom0.x + Math.cos(thetaRad) * rayLength;
      const r1yOut = atom0.y - Math.sin(thetaRad) * rayLength;

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(r1xIn, r1yIn);
      ctx.lineTo(atom0.x, atom0.y);
      ctx.lineTo(r1xOut, r1yOut);
      ctx.stroke();

      // Ray 2 (Plane 1 reflection - travels extra distance 2*d*sin(theta))
      const r2xIn = atom1.x - Math.cos(thetaRad) * rayLength;
      const r2yIn = atom1.y - Math.sin(thetaRad) * rayLength;
      const r2xOut = atom1.x + Math.cos(thetaRad) * rayLength;
      const r2yOut = atom1.y - Math.sin(thetaRad) * rayLength;

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(r2xIn, r2yIn);
      ctx.lineTo(atom1.x, atom1.y);
      ctx.lineTo(r2xOut, r2yOut);
      ctx.stroke();

      // Extra Path Difference Geometric Highlight Lines
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(atom0.x, atom0.y);
      ctx.lineTo(atom1.x - Math.cos(thetaRad) * (planeDistancePx * Math.sin(thetaRad)), atom1.y - Math.sin(thetaRad) * (planeDistancePx * Math.sin(thetaRad)));
      ctx.stroke();

      // Detector Meter on right
      const detX = width * 0.74;
      const detY = 70;
      const detW = width * 0.22;
      const detH = 200;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(detX, detY, detW, detH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(detX, detY, detW, detH);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('SCINTILLATION X-RAY DETECTOR', detX + 12, detY + 22);

      // Intensity bar
      const isBraggPeak = constructiveIntensity > 0.85;
      ctx.fillStyle = isBraggPeak ? '#22c55e' : '#f59e0b';
      ctx.fillRect(detX + 14, detY + 45, (detW - 28) * constructiveIntensity, 24);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`${(constructiveIntensity * 100).toFixed(0)}% Bragg Yield`, detX + 18, detY + 62);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '10px monospace';
      ctx.fillText(`Glancing Angle θ: ${glancingAngleTheta.toFixed(1)}°`, detX + 14, detY + 95);
      ctx.fillText(`Path Diff 2d·sinθ: ${pathDifference.toFixed(4)} nm`, detX + 14, detY + 115);
      ctx.fillText(`Ratio 2d·sinθ / λ: ${orderFraction.toFixed(2)}`, detX + 14, detY + 135);
      ctx.fillText(`Bragg Condition: ${isBraggPeak ? `PEAK (n = ${nearestOrder})` : 'DESTRUCTIVE'}`, detX + 14, detY + 155);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1913 BRAGG’S LAW 2d·sin(θ) = n·λ · X-RAY CRYSTALLOGRAPHY & ATOMIC LATTICE DIFFRACTION', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [glancingAngleTheta, latticeSpacingD, xrayWavelength]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Atom size={14} /> Incident Glancing Angle (θ)</span>
            <span className="font-mono">{glancingAngleTheta.toFixed(1)}°</span>
          </div>
          <input
            type="range"
            min="10.0"
            max="60.0"
            step="0.2"
            value={glancingAngleTheta}
            onChange={(e) => setGlancingAngleTheta(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Lattice Plane Spacing (d)</span>
            <span className="font-mono">{latticeSpacingD.toFixed(3)} nm (NaCl 200)</span>
          </div>
          <input
            type="range"
            min="0.180"
            max="0.450"
            step="0.005"
            value={latticeSpacingD}
            onChange={(e) => setLatticeSpacingD(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
