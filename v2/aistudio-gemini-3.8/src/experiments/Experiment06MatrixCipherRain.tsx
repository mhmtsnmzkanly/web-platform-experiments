import React, { useRef, useEffect, useState } from 'react';
import { Terminal, Shield, RefreshCw, Volume2, VolumeX } from 'lucide-react';

export default function Experiment06MatrixCipherRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [speed, setSpeed] = useState(33);
  const [decryptProgress, setDecryptProgress] = useState(100); // 0 to 100
  const [matrixColor, setMatrixColor] = useState<'matrixGreen' | 'cyberCyan' | 'bloodRed'>('matrixGreen');

  const colors = {
    matrixGreen: { primary: '#00ff66', glow: 'rgba(0, 255, 102, 0.8)', tail: 'rgba(0, 255, 102, 0.15)' },
    cyberCyan: { primary: '#00e5ff', glow: 'rgba(0, 229, 255, 0.8)', tail: 'rgba(0, 229, 255, 0.15)' },
    bloodRed: { primary: '#ff1744', glow: 'rgba(255, 23, 68, 0.8)', tail: 'rgba(255, 23, 68, 0.15)' },
  }[matrixColor];

  const glyphs = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
  const targetText = 'HELLO WORLD';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 500);

    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));

    let isRunning = true;
    let animId = 0;
    let lastTime = 0;

    const render = (time: number) => {
      if (!isRunning) return;

      if (time - lastTime > speed) {
        lastTime = time;

        // Semi-transparent black background to form rain decay trails
        ctx.fillStyle = 'rgba(5, 7, 10, 0.15)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = glyphs[Math.floor(Math.random() * glyphs.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Leading bright glyph
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = colors.glow;
          ctx.shadowBlur = 8;
          ctx.fillText(text, x, y);

          // Follower glow glyph
          ctx.fillStyle = colors.primary;
          ctx.shadowBlur = 4;
          ctx.fillText(text, x, y - fontSize);

          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }

        // Overlay central decrypted "HELLO WORLD" text
        ctx.save();
        ctx.shadowBlur = 24;
        ctx.shadowColor = colors.glow;

        const mainFontSize = Math.min(width / 9, 84);
        ctx.font = `bold ${mainFontSize}px 'Syne', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Scramble logic based on decryptProgress
        let displayText = '';
        for (let i = 0; i < targetText.length; i++) {
          const threshold = (i / targetText.length) * 100;
          if (decryptProgress >= threshold + 10) {
            displayText += targetText[i];
          } else {
            displayText += glyphs[Math.floor(Math.random() * glyphs.length)];
          }
        }

        // Draw solid dark backing plate
        const textMetrics = ctx.measureText(displayText);
        const padX = 36;
        const padY = 24;
        ctx.fillStyle = 'rgba(5, 7, 10, 0.85)';
        ctx.fillRect(
          width / 2 - textMetrics.width / 2 - padX,
          height / 2 - mainFontSize / 2 - padY,
          textMetrics.width + padX * 2,
          mainFontSize + padY * 2
        );

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = colors.primary;
        ctx.strokeRect(
          width / 2 - textMetrics.width / 2 - padX,
          height / 2 - mainFontSize / 2 - padY,
          textMetrics.width + padX * 2,
          mainFontSize + padY * 2
        );

        ctx.fillStyle = colors.primary;
        ctx.fillText(displayText, width / 2, height / 2);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, [speed, decryptProgress, matrixColor, colors]);

  const triggerCipherScramble = () => {
    setDecryptProgress(0);
    const interval = setInterval(() => {
      setDecryptProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  return (
    <div className="relative w-full min-h-[620px] bg-[#05070a] text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs font-mono text-stone-400">
        <div className="flex items-center gap-2">
          <Terminal size={14} style={{ color: colors.primary }} />
          <span className="font-bold text-stone-200">STUDY 006</span> // CYBER MATRIX CIPHER DECODER
        </div>
        <div className="flex items-center gap-4">
          <span>STREAM DENSITY: 100%</span>
          <span>CIPHER: QUANTUM RESOLVED</span>
        </div>
      </div>

      {/* Canvas Screen */}
      <div className="relative my-auto flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <canvas ref={canvasRef} className="w-full h-[450px] block rounded-lg cursor-pointer" onClick={triggerCipherScramble} />
        <div className="absolute bottom-4 left-4 pointer-events-none text-[11px] font-mono text-stone-400 bg-black/70 px-2 py-1 rounded backdrop-blur border border-stone-800">
          CLICK STAGE TO RE-ENCRYPT & DECODE STREAM
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-950/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-6 w-full md:w-auto">
          {/* Speed */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Baud Rate:</span>
            <input
              type="range"
              min="15"
              max="70"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-24 accent-emerald-400"
            />
          </div>

          {/* Decrypt Progress */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400">Resolution:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={decryptProgress}
              onChange={(e) => setDecryptProgress(Number(e.target.value))}
              className="w-24 accent-emerald-400"
            />
            <span className="w-10 text-right">{decryptProgress}%</span>
          </div>
        </div>

        {/* Color Palette & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {(['matrixGreen', 'cyberCyan', 'bloodRed'] as const).map((col) => (
              <button
                key={col}
                onClick={() => setMatrixColor(col)}
                className={`px-2.5 py-1 uppercase rounded text-[11px] border transition-all ${
                  matrixColor === col ? 'bg-stone-800 text-white font-bold' : 'border-stone-800 text-stone-400'
                }`}
              >
                {col === 'matrixGreen' ? 'GREEN' : col === 'cyberCyan' ? 'CYAN' : 'RED'}
              </button>
            ))}
          </div>

          <button
            onClick={triggerCipherScramble}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold rounded transition-colors"
          >
            <RefreshCw size={13} />
            <span>Re-Cipher</span>
          </button>
        </div>
      </div>
    </div>
  );
}
