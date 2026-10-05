import React, { useRef, useEffect, useState } from 'react';
import { Eye, Sliders, RotateCcw } from 'lucide-react';

export default function Experiment84StereogramMagicEye3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [repeatWidth, setRepeatWidth] = useState(100); // Strip repeat width in px
  const [depthIntensity, setDepthIntensity] = useState(14); // Parallax offset
  const [showGuideDots, setShowGuideDots] = useState(true);
  const [revealDepthMap, setRevealDepthMap] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 480);

    // Create depth map for "HELLO WORLD"
    const depthCanvas = document.createElement('canvas');
    depthCanvas.width = width;
    depthCanvas.height = height;
    const dCtx = depthCanvas.getContext('2d');
    if (!dCtx) return;

    dCtx.fillStyle = '#000000';
    dCtx.fillRect(0, 0, width, height);

    // Render 3D extruded lettering in depth map (white = pop out toward viewer)
    dCtx.font = 'bold 74px "Syne", sans-serif';
    dCtx.textAlign = 'center';
    dCtx.textBaseline = 'middle';
    dCtx.fillStyle = '#ffffff';
    dCtx.fillText('HELLO WORLD', width / 2, height / 2);

    if (revealDepthMap) {
      // Just show the raw depth map
      ctx.drawImage(depthCanvas, 0, 0);
      return;
    }

    const depthData = dCtx.getImageData(0, 0, width, height).data;

    // Generate Single Image Random Dot Stereogram (SIRDS)
    const imgData = ctx.createImageData(width, height);
    const pixels = imgData.data;

    // Seed base noise pattern
    const pattern = new Uint8Array(repeatWidth * height * 4);
    for (let i = 0; i < pattern.length; i += 4) {
      const val = Math.random() > 0.5 ? 255 : 30;
      const hue = Math.random() > 0.3 ? 200 : 40;
      pattern[i] = hue === 200 ? 56 : 245; // R
      pattern[i + 1] = hue === 200 ? 189 : 158; // G
      pattern[i + 2] = hue === 200 ? 248 : 11; // B
      pattern[i + 3] = 255;
    }

    // Process each scanline with disparity link constraints
    for (let y = 0; y < height; y++) {
      const same = new Int32Array(width);
      for (let x = 0; x < width; x++) same[x] = x;

      for (let x = 0; x < width; x++) {
        const dIdx = (y * width + x) * 4;
        const depthVal = depthData[dIdx] / 255; // 0 to 1
        const separation = Math.round(repeatWidth - depthVal * depthIntensity);

        const left = Math.round(x - separation / 2);
        const right = left + separation;

        if (left >= 0 && right < width) {
          same[right] = left;
        }
      }

      // Resolve color links
      for (let x = 0; x < width; x++) {
        const root = same[x];
        const pIdx = (y * repeatWidth + (root % repeatWidth)) * 4;
        const outIdx = (y * width + x) * 4;

        pixels[outIdx] = pattern[pIdx];
        pixels[outIdx + 1] = pattern[pIdx + 1];
        pixels[outIdx + 2] = pattern[pIdx + 2];
        pixels[outIdx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Optional guide dots at top for eyes convergence
    if (showGuideDots) {
      const cx = width / 2;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx - repeatWidth / 2, 24, 4, 0, Math.PI * 2);
      ctx.arc(cx + repeatWidth / 2, 24, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '10px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('ALIGN BOTH GUIDE DOTS INTO 3 DOTS (DEFOCUS EYES BEYOND SCREEN)', cx, 40);
    }
  }, [repeatWidth, depthIntensity, showGuideDots, revealDepthMap]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-4">
      <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <Eye className="text-amber-400" size={20} />
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-wide">
                STUDY 084: 1991 SINGLE-IMAGE RANDOM-DOT STEREOGRAM (SIRDS)
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Autostereoscopic Parallax Disparity & Divergent Binocular Fusion
              </p>
            </div>
          </div>
          <button
            onClick={() => setRevealDepthMap(!revealDepthMap)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer border ${
              revealDepthMap
                ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                : 'bg-stone-800 border-stone-700 text-stone-300'
            }`}
          >
            <span>{revealDepthMap ? 'HIDE DEPTH MAP' : 'REVEAL 3D DEPTH MAP'}</span>
          </button>
        </div>

        <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950 flex justify-center">
          <canvas ref={canvasRef} className="w-full h-[480px] block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-4 border-t border-stone-800 text-xs font-mono text-stone-300">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <Sliders size={13} className="text-amber-400" /> Repeat Pitch:
              </span>
              <span className="text-amber-400 font-bold">{repeatWidth}px</span>
            </div>
            <input
              type="range"
              min="70"
              max="140"
              value={repeatWidth}
              onChange={(e) => setRepeatWidth(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Depth Relief Extrusion:</span>
              <span className="text-amber-400 font-bold">{depthIntensity}px</span>
            </div>
            <input
              type="range"
              min="6"
              max="24"
              value={depthIntensity}
              onChange={(e) => setDepthIntensity(Number(e.target.value))}
              className="w-full accent-amber-400 bg-stone-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Binocular Guide Markers:</span>
            <button
              onClick={() => setShowGuideDots(!showGuideDots)}
              className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                showGuideDots
                  ? 'bg-amber-400/10 border-amber-400 text-amber-400'
                  : 'bg-stone-800 border-stone-700 text-stone-400'
              }`}
            >
              {showGuideDots ? 'GUIDE DOTS ON' : 'DOTS HIDDEN'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
