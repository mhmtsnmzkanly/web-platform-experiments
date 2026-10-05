import React, { useRef, useEffect, useState } from 'react';
import { Sliders, RotateCcw } from 'lucide-react';

export default function Experiment148WheatstoneBridgeNullGalvo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rDecade, setRDecade] = useState(250); // Variable Decade box resistance R3 in Ohms
  const [supplyVoltage, setSupplyVoltage] = useState(10); // Volts DC
  const [rxUnknown, setRxUnknown] = useState(248); // Unknown precision resistance Rx in Ohms

  const r1 = 100; // Ratio arm R1 (Ohms)
  const r2 = 100; // Ratio arm R2 (Ohms)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
      const height = (canvas.height = 480);

      ctx.fillStyle = '#0a0a0d';
      ctx.fillRect(0, 0, width, height);

      // Wheatstone Bridge Bridge Balance Equation:
      // V_A = V_in * (R_2 / (R_1 + R_2))
      // V_B = V_in * (R_x / (R_3 + R_x))
      // Galvanometer potential difference V_G = V_A - V_B
      // When R_x / R_3 = R_2 / R_1, V_G = 0 (Null galvanometer deflection!)
      const va = supplyVoltage * (r2 / (r1 + r2));
      const vb = supplyVoltage * (rxUnknown / (rDecade + rxUnknown));
      const vgVolts = va - vb;

      const cx = width * 0.35;
      const cy = height * 0.48;

      // Diamond Bridge Nodes
      const topNode = { x: cx, y: cy - 120 };
      const rightNode = { x: cx + 130, y: cy };
      const bottomNode = { x: cx, y: cy + 120 };
      const leftNode = { x: cx - 130, y: cy };

      // Bridge Resistors (4 arms)
      const drawResistor = (x1: number, y1: number, x2: number, y2: number, label: string, val: string) => {
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(mx - 22, my - 12, 44, 24);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(mx - 22, my - 12, 44, 24);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, mx, my - 1);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(val, mx, my + 11);
        ctx.textAlign = 'left';
      };

      drawResistor(topNode.x, topNode.y, rightNode.x, rightNode.y, 'R1 (Ratio)', `${r1} Ω`);
      drawResistor(rightNode.x, rightNode.y, bottomNode.x, bottomNode.y, 'R2 (Ratio)', `${r2} Ω`);
      drawResistor(topNode.x, topNode.y, leftNode.x, leftNode.y, 'R3 (Decade)', `${rDecade} Ω`);
      drawResistor(leftNode.x, leftNode.y, bottomNode.x, bottomNode.y, 'Rx (Target)', `${rxUnknown} Ω`);

      // Power source connections to top & bottom nodes
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(topNode.x, topNode.y);
      ctx.lineTo(topNode.x, 40);
      ctx.lineTo(cx - 200, 40);
      ctx.lineTo(cx - 200, cy + 160);
      ctx.lineTo(bottomNode.x, cy + 160);
      ctx.lineTo(bottomNode.x, bottomNode.y);
      ctx.stroke();

      ctx.fillStyle = '#eab308';
      ctx.font = '11px monospace';
      ctx.fillText(`DC SOURCE: ${supplyVoltage.toFixed(1)} V`, cx - 210, cy);

      // Galvanometer branch between leftNode and rightNode
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(leftNode.x, leftNode.y);
      ctx.lineTo(rightNode.x, rightNode.y);
      ctx.stroke();

      // Precision Center-Zero Taut-Band Galvanometer Meter on right
      const galvoX = width * 0.72;
      const galvoY = cy;
      const meterR = 105;

      // Meter housing
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.arc(galvoX, galvoY, meterR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Meter scale markings
      ctx.strokeStyle = '#78716c';
      ctx.lineWidth = 1.5;
      for (let a = -50; a <= 50; a += 10) {
        const rad = ((-90 + a) * Math.PI) / 180;
        const tickLen = a === 0 ? 16 : a % 20 === 0 ? 12 : 8;
        const tx1 = galvoX + Math.cos(rad) * (meterR - 20);
        const ty1 = galvoY + Math.sin(rad) * (meterR - 20);
        const tx2 = galvoX + Math.cos(rad) * (meterR - 20 - tickLen);
        const ty2 = galvoY + Math.sin(rad) * (meterR - 20 - tickLen);
        ctx.beginPath();
        ctx.moveTo(tx1, ty1);
        ctx.lineTo(tx2, ty2);
        ctx.stroke();
      }

      ctx.fillStyle = '#fbbf24';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('-50', galvoX - 60, galvoY - 50);
      ctx.fillText('0 (NULL)', galvoX, galvoY - 78);
      ctx.fillText('+50', galvoX + 60, galvoY - 50);
      ctx.fillText('TAUT-BAND NULL GALVANOMETER', galvoX, galvoY + 45);
      ctx.fillText(`ΔV = ${(vgVolts * 1000).toFixed(2)} mV`, galvoX, galvoY + 65);
      ctx.textAlign = 'left';

      // Galvanometer Deflection Needle
      // Sensitivity: deflection angle proportional to V_G
      const maxDeflectionDeg = 48;
      const needleAngleDeg = -90 + Math.max(-maxDeflectionDeg, Math.min(maxDeflectionDeg, vgVolts * 180));
      const needleRad = (needleAngleDeg * Math.PI) / 180;

      const isBalanced = Math.abs(vgVolts) < 0.005;

      ctx.strokeStyle = isBalanced ? '#22c55e' : '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(galvoX, galvoY);
      ctx.lineTo(galvoX + Math.cos(needleRad) * (meterR - 25), galvoY + Math.sin(needleRad) * (meterR - 25));
      ctx.stroke();

      // Needle center pivot cap
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(galvoX, galvoY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.stroke();

      // Balance status badge
      ctx.fillStyle = isBalanced ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(galvoX - 70, galvoY - 135, 140, 24);
      ctx.strokeStyle = isBalanced ? '#22c55e' : '#ef4444';
      ctx.strokeRect(galvoX - 70, galvoY - 135, 140, 24);
      ctx.fillStyle = isBalanced ? '#4ade80' : '#f87171';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(isBalanced ? '✓ BRIDGE BALANCED' : 'UNBALANCED DEFLECTION', galvoX, galvoY - 119);
      ctx.textAlign = 'left';

      // Bottom Typography
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 24px Syne, sans-serif';
      ctx.fillText('HELLO WORLD', 40, height - 25);
      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText(`WHEATSTONE BRIDGE (1843) · Rx = (R2/R1)*R3 = ${( (r2/r1)*rDecade ).toFixed(1)} Ω · NULL METHOD PRECISION`, 220, height - 25);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [rDecade, supplyVoltage, rxUnknown]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-lg border border-stone-800 bg-stone-950 p-2 overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-amber-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> Variable Decade Box (R3)</span>
            <span className="font-mono">{rDecade} Ω</span>
          </div>
          <input
            type="range"
            min="200"
            max="300"
            value={rDecade}
            onChange={(e) => setRDecade(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-sky-400">
            <span className="flex items-center gap-1.5 font-mono"><RotateCcw size={14} /> Unknown Test Specimen (Rx)</span>
            <span className="font-mono">{rxUnknown} Ω</span>
          </div>
          <input
            type="range"
            min="200"
            max="300"
            value={rxUnknown}
            onChange={(e) => setRxUnknown(Number(e.target.value))}
            className="accent-sky-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs text-yellow-400">
            <span className="flex items-center gap-1.5 font-mono"><Sliders size={14} /> DC Bridge Excitation</span>
            <span className="font-mono">{supplyVoltage} V</span>
          </div>
          <input
            type="range"
            min="2"
            max="24"
            value={supplyVoltage}
            onChange={(e) => setSupplyVoltage(Number(e.target.value))}
            className="accent-yellow-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
