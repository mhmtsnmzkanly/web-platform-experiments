import React, { useRef, useEffect, useState } from 'react';
import { Sun, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment88AnamorphicShadowProjection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lightAngle, setLightAngle] = useState(45); // degrees
  const [sculptureRotation, setSculptureRotation] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);
    const cx = width / 2;
    const cy = height / 2;

    // Gallery studio space
    ctx.fillStyle = '#0f1115';
    ctx.fillRect(0, 0, width, height);

    // Gallery backdrop wall (shadow projection screen)
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(60, 60, width - 120, height - 120);

    // Wall frame bevel
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, width - 120, height - 120);

    // Shadow cast calculation based on light source angle and sculpture rotation
    const rad = (lightAngle * Math.PI) / 180;
    const rotRad = (sculptureRotation * Math.PI) / 180;

    // Perfect alignment at lightAngle = 45 and sculptureRotation = 0
    const alignCoeff = Math.abs(Math.cos(rad - Math.PI / 4)) * Math.abs(Math.cos(rotRad));

    ctx.save();
    ctx.translate(cx, cy);

    // Projected Shadow onto the gallery wall
    ctx.save();
    ctx.translate(Math.cos(rad) * 40, Math.sin(rad) * 40);
    ctx.scale(1 + Math.cos(rotRad) * 0.2, 1 + Math.sin(rotRad) * 0.4);
    ctx.rotate(rotRad * 0.5);

    ctx.font = '900 68px "Syne", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (alignCoeff > 0.85) {
      // Crisp intelligible shadow "HELLO WORLD"
      ctx.fillStyle = `rgba(15, 23, 42, ${0.75 * alignCoeff})`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 6;
      ctx.fillText('HELLO WORLD', 0, 0);
    } else {
      // Disordered chaotic fragmented shadow blocks
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      for (let i = -5; i <= 5; i++) {
        ctx.fillRect(i * 45, (i % 2 === 0 ? 1 : -1) * 35, 30, 50);
      }
    }
    ctx.restore();

    // 3D Abstract Suspended Wire Sculpture in the foreground
    ctx.save();
    ctx.rotate(rotRad);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;

    // Geometric polyhedra wire assemblage
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 60, Math.sin(a) * 60);
      ctx.lineTo(Math.cos(a + 1.2) * 110, Math.sin(a + 1.2) * 110);
      ctx.stroke();
    }
    ctx.restore();

    // Spotlight beam overlay
    const spotX = cx - Math.cos(rad) * 350;
    const spotY = cy - Math.sin(rad) * 260;
    const beamGrad = ctx.createRadialGradient(spotX, spotY, 10, cx, cy, 380);
    beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 380, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Status readout
    ctx.font = '11px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`ANAMORPHIC COHERENCE: ${(alignCoeff * 100).toFixed(0)}% · (ALIGN TO 45° / 0° ROTATION FOR SHADOW RESOLUTION)`, 80, 440);
  }, [lightAngle, sculptureRotation]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Sun className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 088: ANAMORPHIC 3D SCULPTURE SHADOW PROJECTION
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Fukuda Spatial Shadow Cast & Optical Perspective Alignment
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setLightAngle(45);
              setSculptureRotation(0);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Align Optical Axis</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950 flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Point Light Azimuth:
              </span>
              <span className="text-amber-400 font-bold">{lightAngle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              value={lightAngle}
              onChange={(e) => setLightAngle(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Sculpture 3D Tumble:</span>
              <span className="text-amber-400 font-bold">{sculptureRotation}°</span>
            </div>
            <input
              type="range"
              min="-90"
              max="90"
              value={sculptureRotation}
              onChange={(e) => setSculptureRotation(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
