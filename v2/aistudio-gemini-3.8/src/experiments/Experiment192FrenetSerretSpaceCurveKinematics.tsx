import React, { useRef, useEffect, useState } from 'react';
import { Compass, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment192FrenetSerretSpaceCurveKinematics() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [curveTorsionTau, setCurveTorsionTau] = useState(1.4); // Torsion tau
  const [curveCurvatureKappa, setCurveCurvatureKappa] = useState(1.8); // Curvature kappa

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let sTime = 0;

    // Frenet-Serret Formulas (1847 Jean Frédéric Frenet, 1851 Joseph Alfred Serret):
    // Orthonormal moving trihedron frame on a space curve r(s):
    // T = Tangent vector = dr/ds
    // N = Principal Normal vector = (dT/ds) / kappa
    // B = Binormal vector = T x N
    // Differential equations:
    // dT/ds = kappa * N
    // dN/ds = -kappa * T + tau * B
    // dB/ds = -tau * N

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);
      const cx = width / 2;
      const cy = height * 0.48;

      ctx.fillStyle = '#06070e';
      ctx.fillRect(0, 0, width, height);

      sTime += 0.015;

      // Generate 3D Space Curve (Helix with variable torsion and curvature)
      const numPts = 320;
      const curvePts: { x: number; y: number; z: number }[] = [];
      const rotY = sTime * 0.4;

      for (let i = 0; i < numPts; i++) {
        const s = (i / numPts) * 6 * Math.PI - 3 * Math.PI;
        const rHelix = 85 * (1 / curveCurvatureKappa);
        const pitch = 15 * curveTorsionTau;

        const x = rHelix * Math.cos(s);
        const y = s * pitch;
        const z = rHelix * Math.sin(s);
        curvePts.push({ x, y, z });
      }

      // 3D Projection
      const project = (p: { x: number; y: number; z: number }) => {
        const rx = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
        const rz = p.x * Math.sin(rotY) + p.z * Math.cos(rotY);
        return {
          px: cx + rx,
          py: cy - (p.y * 0.7 + rz * 0.35),
        };
      };

      // Draw continuous space curve
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < curvePts.length; i++) {
        const pt = project(curvePts[i]);
        if (i === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.stroke();

      // Moving Frenet-Serret Trihedron Frame at arc position s_curr
      const sIdx = Math.floor(((sTime * 25) % numPts));
      const currPt = curvePts[sIdx];
      const nextPt = curvePts[(sIdx + 1) % numPts];

      const origin = project(currPt);

      // Tangent vector T (forward difference)
      const tx = nextPt.x - currPt.x;
      const ty = nextPt.y - currPt.y;
      const tz = nextPt.z - currPt.z;
      const tLen = Math.hypot(tx, ty, tz) || 1;
      const T = { x: tx / tLen, y: ty / tLen, z: tz / tLen };

      // Normal vector N (pointing towards center of osculating circle)
      const normRad = Math.hypot(currPt.x, currPt.z) || 1;
      const N = { x: -currPt.x / normRad, y: 0, z: -currPt.z / normRad };

      // Binormal vector B = T x N
      const B = {
        x: T.y * N.z - T.z * N.y,
        y: T.z * N.x - T.x * N.z,
        z: T.x * N.y - T.y * N.x,
      };

      const vecScale = 45;

      // Draw Tangent Vector T (Red)
      const endT = project({ x: currPt.x + T.x * vecScale, y: currPt.y + T.y * vecScale, z: currPt.z + T.z * vecScale });
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(origin.px, origin.py);
      ctx.lineTo(endT.px, endT.py);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('T (Tangent)', endT.px + 6, endT.py);

      // Draw Principal Normal Vector N (Cyan)
      const endN = project({ x: currPt.x + N.x * vecScale, y: currPt.y + N.y * vecScale, z: currPt.z + N.z * vecScale });
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(origin.px, origin.py);
      ctx.lineTo(endN.px, endN.py);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('N (Normal)', endN.px + 6, endN.py);

      // Draw Binormal Vector B (Yellow)
      const endB = project({ x: currPt.x + B.x * vecScale, y: currPt.y + B.y * vecScale, z: currPt.z + B.z * vecScale });
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(origin.px, origin.py);
      ctx.lineTo(endB.px, endB.py);
      ctx.stroke();
      ctx.fillStyle = '#eab308';
      ctx.fillText('B (Binormal)', endB.px + 6, endB.py);

      // Pivot particle on curve
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(origin.px, origin.py, 5, 0, Math.PI * 2);
      ctx.fill();

      // Telemetry Box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(35, 35, 270, 95);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(35, 35, 270, 95);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText('FRENET-SERRET DIFFERENTIAL GEOMETRY', 45, 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Curvature κ (Bend in Osculating Plane): ${curveCurvatureKappa.toFixed(2)}`, 45, 72);
      ctx.fillText(`Torsion τ (Twist out of Osculating Plane): ${curveTorsionTau.toFixed(2)}`, 45, 90);
      ctx.fillText('Orthonormal Moving Trihedron Frame: T · N · B', 45, 108);

      // Bottom Typography
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText('1851 FRENET-SERRET FORMULAS · DIFFERENTIAL GEOMETRY OF SPACE CURVES & MOVING TRIHEDRON FRAME', 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [curveTorsionTau, curveCurvatureKappa]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><Compass size={14} /> Curve Curvature (κ)</span>
            <span className="font-mono">{curveCurvatureKappa.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="3.0"
            step="0.1"
            value={curveCurvatureKappa}
            onChange={(e) => setCurveCurvatureKappa(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Curve Torsion (τ)</span>
            <span className="font-mono">{curveTorsionTau.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.4"
            max="3.0"
            step="0.1"
            value={curveTorsionTau}
            onChange={(e) => setCurveTorsionTau(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
