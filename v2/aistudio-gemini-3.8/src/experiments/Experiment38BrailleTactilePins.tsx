import React, { useRef, useEffect, useState } from 'react';
import { Grid, Sliders, RotateCcw, Eye } from 'lucide-react';

interface Pin {
  x: number;
  y: number;
  baseH: number;
  currentH: number;
  targetH: number;
}

export default function Experiment38BrailleTactilePins() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pinElevation, setPinElevation] = useState(14);
  const [showBraille, setShowBraille] = useState(false);
  const pinsRef = useRef<Pin[]>([]);
  const mouseRef = useRef<{ x: number; y: number; isDown: boolean }>({ x: 450, y: 240, isDown: false });

  // Braille cells for H-E-L-L-O W-O-R-L-D:
  // H: ⠓, E: ⠑, L: ⠇, O: ⠕, W: ⠺, R: ⠗, D: ⠙
  const brailleString = '⠓⠑⠇⠇⠕ ⠺⠕⠗⠇⠙';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    const cols = 56;
    const rows = 28;
    const spacingX = width / cols;
    const spacingY = height / rows;

    // Render text or braille to offscreen canvas to obtain pin target heights
    const off = document.createElement('canvas');
    off.width = cols;
    off.height = rows;
    const offCtx = off.getContext('2d')!;

    offCtx.fillStyle = '#ffffff';
    if (showBraille) {
      offCtx.font = 'bold 16px monospace';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText(brailleString, cols / 2, rows / 2);
    } else {
      offCtx.font = 'bold 10px sans-serif';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText('HELLO WORLD', cols / 2, rows / 2);
    }

    const data = offCtx.getImageData(0, 0, cols, rows).data;
    const newPins: Pin[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isRaised = data[(r * cols + c) * 4 + 3] > 128;
        const targetH = isRaised ? pinElevation : 2;
        newPins.push({
          x: c * spacingX + spacingX / 2,
          y: r * spacingY + spacingY / 2,
          baseH: targetH,
          currentH: targetH,
          targetH: targetH,
        });
      }
    }

    pinsRef.current = newPins;

    let isRunning = true;
    let animId = 0;

    const render = () => {
      if (!isRunning) return;

      // Dark anodized aluminum chassis plate
      ctx.fillStyle = '#111217';
      ctx.fillRect(0, 0, width, height);

      const pins = pinsRef.current;
      const mouse = mouseRef.current;

      // Update and draw pins
      for (let i = 0; i < pins.length; i++) {
        const p = pins[i];

        // Cursor indentation
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 40 && mouse.isDown) {
          p.targetH = 0; // pushed fully in
        } else {
          p.targetH = p.baseH;
        }

        // Spring toward target height
        p.currentH += (p.targetH - p.currentH) * 0.15;

        // Draw pin socket aperture hole
        ctx.fillStyle = '#08080a';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw 3D chrome pin head with height offset
        const pinHeadY = p.y - p.currentH;
        const pinRadius = 4.2;

        // Pin shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, pinRadius, pinRadius * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Metallic chrome radial gradient on pin head
        const grad = ctx.createRadialGradient(
          p.x - 1,
          pinHeadY - 1,
          1,
          p.x,
          pinHeadY,
          pinRadius
        );
        if (p.currentH > 4) {
          grad.addColorStop(0, '#ffffff'); // bright top highlight
          grad.addColorStop(0.5, '#e4e4e7');
          grad.addColorStop(1, '#71717a');
        } else {
          grad.addColorStop(0, '#71717a');
          grad.addColorStop(1, '#27272a');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, pinHeadY, pinRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [pinElevation, showBraille]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#111217] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Grid size={14} className="text-zinc-300" />
          <span className="font-bold text-stone-200">STUDY 038</span> // MOTORIZED TACTILE PIN-MATRIX BED
        </div>
        <div className="flex items-center gap-4">
          <span>PINS: 1,568 SOLENOIDS</span>
          <span>MODE: {showBraille ? 'GRADE-1 BRAILLE' : 'LATIN EMBOSS'}</span>
        </div>
      </div>

      {/* Pin Art Viewport */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseDown={() => (mouseRef.current.isDown = true)}
          onMouseUp={() => (mouseRef.current.isDown = false)}
          className="w-full h-[450px] block rounded-lg"
        />
        <div className="absolute top-4 left-4 pointer-events-none text-[11px] text-zinc-300 bg-black/60 px-3 py-1.5 rounded backdrop-blur border border-stone-800">
          CLICK AND DRAG TO DEPRESS MECHANICAL PINS
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Pin Stroke:</span>
            <input
              type="range"
              min="6"
              max="24"
              value={pinElevation}
              onChange={(e) => setPinElevation(Number(e.target.value))}
              className="w-24 accent-zinc-300"
            />
            <span>{pinElevation}mm</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBraille(!showBraille)}
            className={`px-3 py-1.5 rounded border transition-colors ${
              showBraille ? 'bg-amber-400 text-stone-950 font-bold border-amber-300' : 'border-stone-800 text-stone-300'
            }`}
          >
            {showBraille ? 'Latin Alphabets' : 'Translate to Braille (⠓⠑⠇⠇⠕)'}
          </button>
        </div>
      </div>
    </div>
  );
}
