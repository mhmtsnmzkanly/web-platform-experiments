import React, { useState, useEffect, useRef } from 'react';
import { Binary, Sun, Sliders, RefreshCw } from 'lucide-react';

const CHAR_SETS = {
  standard: '@%#*+=-:. ',
  dense: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
  math: '∑∏∫∂∇√∞≈≠≤≥±×÷· ',
  blocks: '█▓▒░ ',
};

export default function Experiment10AsciiQuantumField() {
  const [charSet, setCharSet] = useState<keyof typeof CHAR_SETS>('standard');
  const [lightX, setLightX] = useState(0.5);
  const [lightY, setLightY] = useState(-0.5);
  const [density, setDensity] = useState(64); // columns
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    let t = 0;
    const chars = CHAR_SETS[charSet];

    const generateFrame = () => {
      t += 0.04;

      const cols = density;
      const rows = Math.floor(density * 0.45);
      const lines: string[] = [];

      // Virtual 3D torus / volumetric sphere rotating with text
      for (let y = 0; y < rows; y++) {
        let line = '';
        const ny = (y / rows) * 2 - 1; // -1 to 1

        for (let x = 0; x < cols; x++) {
          const nx = (x / cols) * 2 - 1; // -1 to 1

          // Distance from center
          const dist = Math.hypot(nx, ny);

          // Wave equation forming the letters "HELLO WORLD"
          const wave = Math.sin(nx * 4 + t) * Math.cos(ny * 4 + t * 0.7);

          // Surface normal simulation
          const normX = nx;
          const normY = ny;
          const normZ = Math.sqrt(Math.max(0, 1 - dist * dist));

          // Lambertian diffuse lighting dot product
          const dot = normX * lightX + normY * lightY + normZ * 0.8;
          let brightness = Math.max(0, dot) * (1 - Math.min(1, dist * 0.8)) + (wave * 0.2);

          // Central text threshold
          const isCenter = Math.abs(ny) < 0.25 && Math.abs(nx) < 0.85;
          if (isCenter) {
            brightness += 0.35;
          }

          const charIdx = Math.floor(Math.max(0, Math.min(1, brightness)) * (chars.length - 1));
          line += chars[charIdx];
        }
        lines.push(line);
      }

      setOutputLines(lines);
      animRef.current = requestAnimationFrame(generateFrame);
    };

    animRef.current = requestAnimationFrame(generateFrame);

    return () => cancelAnimationFrame(animRef.current);
  }, [charSet, lightX, lightY, density]);

  return (
    <div className="relative w-full min-h-[620px] bg-[#0c0d10] text-emerald-400 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800 font-mono select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Binary size={14} className="text-emerald-400" />
          <span className="font-bold text-stone-200">STUDY 010</span> // ASCII QUANTUM FIELD SHADING
        </div>
        <div className="flex items-center gap-4">
          <span>GLYPH MATRIX: {density}x{Math.floor(density * 0.45)}</span>
          <span>SHADING: LAMBERTIAN DIFFUSE</span>
        </div>
      </div>

      {/* ASCII Viewport Stage */}
      <div className="relative my-auto flex-1 flex flex-col items-center justify-center overflow-hidden">
        {/* Floating Header Specimen */}
        <div className="text-center mb-3">
          <span className="text-2xl md:text-4xl font-bold tracking-widest text-white drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
            HELLO WORLD
          </span>
        </div>

        {/* ASCII Raster Stream */}
        <pre className="text-[7px] md:text-[9.5px] leading-[1.0] text-emerald-400/90 whitespace-pre overflow-hidden">
          {outputLines.join('\n')}
        </pre>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-stone-400 flex items-center gap-1"><Sun size={12} /> Light X:</span>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              value={lightX}
              onChange={(e) => setLightX(Number(e.target.value))}
              className="w-20 accent-emerald-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Resolution:</span>
            <input
              type="range"
              min="40"
              max="90"
              value={density}
              onChange={(e) => setDensity(Number(e.target.value))}
              className="w-20 accent-emerald-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(['standard', 'dense', 'math', 'blocks'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setCharSet(k)}
              className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                charSet === k ? 'bg-emerald-500 text-stone-950 font-bold border-emerald-400' : 'border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
