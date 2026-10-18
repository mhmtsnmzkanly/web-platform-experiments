import React, { useRef, useEffect } from 'react';
import { SymbolId, WinningLine } from '../types';
import { SYMBOLS, REEL_STRIPS, PAYLINES } from '../engine/slotMath';
import { soundFx } from '../audio/SlotAudioEngine';

interface ReelDisplayProps {
  isSpinning: boolean;
  reelStopIndices: number[]; // target stop index for each reel (0..31)
  winningLines: WinningLine[];
  activePaylinesCount: number;
  selectedPreviewLine: number | null; // lineId being hovered/previewed
  onAllReelsStopped: () => void;
  isAnticipatingReel4: boolean;
  isAnticipatingReel5: boolean;
}

const SYMBOL_HEIGHT = 100; // px per symbol
const VISIBLE_ROWS = 3;
const REEL_COUNT = 5;

export const ReelDisplay: React.FC<ReelDisplayProps> = ({
  isSpinning,
  reelStopIndices,
  winningLines,
  selectedPreviewLine,
  onAllReelsStopped,
  isAnticipatingReel4,
  isAnticipatingReel5,
}) => {
  // Physical reel offsets in fractional symbol units (e.g. 14.35)
  const reelOffsetsRef = useRef<number[]>([
    reelStopIndices[0] || 0,
    reelStopIndices[1] || 0,
    reelStopIndices[2] || 0,
    reelStopIndices[3] || 0,
    reelStopIndices[4] || 0,
  ]);
  const reelVelocitiesRef = useRef<number[]>([0, 0, 0, 0, 0]);
  const reelStatesRef = useRef<('IDLE' | 'SPINNING' | 'DECELERATING' | 'BOUNCING' | 'STOPPED')[]>([
    'STOPPED',
    'STOPPED',
    'STOPPED',
    'STOPPED',
    'STOPPED',
  ]);
  const bounceStartTimeRef = useRef<number[]>([0, 0, 0, 0, 0]);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTickOffsetRef = useRef<number[]>([0, 0, 0, 0, 0]);
  const allStoppedFiredRef = useRef<boolean>(true);

  // Force re-renders for React visual updates during animation
  const [, setFrameCount] = React.useState(0);

  // Unified Physics Animation Loop
  useEffect(() => {
    if (!isSpinning) return;

    // Spin has just begun! Initialize physical state:
    const startTime = performance.now();
    let lastTime = startTime;
    allStoppedFiredRef.current = false;

    for (let c = 0; c < REEL_COUNT; c++) {
      reelStatesRef.current[c] = 'SPINNING';
      reelVelocitiesRef.current[c] = 28 + c * 2;
    }

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const spinElapsed = (now - startTime) / 1000;
      let anyReelMoving = false;

      for (let c = 0; c < REEL_COUNT; c++) {
        const stripLength = REEL_STRIPS[c].length;
        const currentState = reelStatesRef.current[c];

        let stopDelay = 1.2 + c * 0.4;
        if (c === 3 && isAnticipatingReel4) stopDelay += 1.2;
        if (c === 4 && (isAnticipatingReel4 || isAnticipatingReel5)) stopDelay += 1.8;

        if (currentState === 'SPINNING') {
          anyReelMoving = true;
          reelOffsetsRef.current[c] = (reelOffsetsRef.current[c] + reelVelocitiesRef.current[c] * dt) % stripLength;

          if (Math.floor(reelOffsetsRef.current[c]) !== Math.floor(lastTickOffsetRef.current[c])) {
            lastTickOffsetRef.current[c] = reelOffsetsRef.current[c];
            if (c === 0 && Math.random() < 0.4) {
              soundFx.playReelTick(1.0);
            }
          }

          if (spinElapsed >= stopDelay) {
            reelStatesRef.current[c] = 'DECELERATING';
          }
        } else if (currentState === 'DECELERATING') {
          anyReelMoving = true;
          const target = reelStopIndices[c];
          const current = reelOffsetsRef.current[c] % stripLength;
          let dist = (target - current + stripLength) % stripLength;
          if (dist < 0.001) dist = 0;

          // Smoothly brake velocity proportional to remaining distance
          const speed = Math.max(3.0, Math.min(26.0, dist * 6.5));
          const step = speed * dt;

          if (step >= dist || dist < 0.18) {
            // Arrived at target! Enter spring bounce
            reelOffsetsRef.current[c] = target;
            reelStatesRef.current[c] = 'BOUNCING';
            bounceStartTimeRef.current[c] = now;

            const isAnticipation = (c === 3 && isAnticipatingReel4) || (c === 4 && isAnticipatingReel5);
            soundFx.playReelStop(isAnticipation);

            const strip = REEL_STRIPS[c];
            let hasScatter = false;
            for (let r = 0; r < 3; r++) {
              if (strip[(target + r) % stripLength] === 'SCATTER') hasScatter = true;
            }
            if (hasScatter) soundFx.playScatterLand(c + 1);
          } else {
            reelOffsetsRef.current[c] = (reelOffsetsRef.current[c] + step) % stripLength;
          }
        } else if (currentState === 'BOUNCING') {
          const bounceElapsed = (now - bounceStartTimeRef.current[c]) / 1000;
          const bounceDuration = 0.22;

          if (bounceElapsed < bounceDuration) {
            anyReelMoving = true;
            const t = bounceElapsed / bounceDuration;
            const overshoot = 0.28 * Math.sin(t * Math.PI) * Math.exp(-t * 4);
            reelOffsetsRef.current[c] = reelStopIndices[c] + overshoot;
          } else {
            reelOffsetsRef.current[c] = reelStopIndices[c];
            reelStatesRef.current[c] = 'STOPPED';
          }
        }
      }

      if (anyReelMoving) {
        setFrameCount((prev) => (prev + 1) % 100000);
        animFrameIdRef.current = requestAnimationFrame(loop);
      } else {
        // Final frame settle
        for (let c = 0; c < REEL_COUNT; c++) {
          reelOffsetsRef.current[c] = reelStopIndices[c];
          reelStatesRef.current[c] = 'STOPPED';
        }
        setFrameCount((prev) => (prev + 1) % 100000);
        if (!allStoppedFiredRef.current) {
          allStoppedFiredRef.current = true;
          onAllReelsStopped();
        }
      }
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [isSpinning, reelStopIndices, isAnticipatingReel4, isAnticipatingReel5, onAllReelsStopped]);

  // Extract winning coordinates to highlight matching symbols
  const winningPositionsSet = new Set<string>();
  winningLines.forEach((wl) => {
    wl.positions.forEach(([r, c]) => {
      winningPositionsSet.add(`${r},${c}`);
    });
  });

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-xl p-3 bg-gradient-to-b from-[#151922] via-[#0d1017] to-[#151922] border-4 border-[#2b3548] shadow-[0_0_35px_rgba(0,0,0,0.9)] overflow-hidden">
      {/* Chrome Glass Bezel Reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 pointer-events-none z-30" />

      {/* Grid of 5 Reels */}
      <div className="relative grid grid-cols-5 gap-2.5 z-10 bg-black/80 rounded-lg p-2.5 border-2 border-neutral-800 shadow-inner">
        {Array.from({ length: REEL_COUNT }).map((_, col) => {
          const strip = REEL_STRIPS[col];
          const offset = reelOffsetsRef.current[col];
          const state = reelStatesRef.current[col];
          const isAnticipating = (col === 3 && isAnticipatingReel4) || (col === 4 && isAnticipatingReel5);

          const startIntegerOffset = Math.floor(offset);
          const fractionalOffset = offset - startIntegerOffset;

          const renderedSymbols: { symbol: SymbolId; rowPos: number }[] = [];
          for (let row = -1; row <= VISIBLE_ROWS + 1; row++) {
            const symIndex = (startIntegerOffset + row + strip.length * 100) % strip.length;
            renderedSymbols.push({
              symbol: strip[symIndex],
              rowPos: row,
            });
          }

          const blurFilter =
            state === 'SPINNING'
              ? 'blur(2.5px) contrast(1.15)'
              : state === 'DECELERATING'
              ? 'blur(1px)'
              : 'none';

          return (
            <div
              key={col}
              className={`relative h-[300px] overflow-hidden rounded-md bg-gradient-to-b from-[#0a0c12] via-[#111622] to-[#0a0c12] border transition-all duration-300 ${
                isAnticipating
                  ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)] animate-pulse'
                  : 'border-neutral-800/80 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]'
              }`}
            >
              {/* Anticipation Banner */}
              {isAnticipating && state === 'SPINNING' && (
                <div className="absolute top-2 inset-x-0 z-40 text-center bg-cyan-500/90 text-black font-extrabold text-[10px] tracking-wider py-0.5 uppercase shadow-lg">
                  ⚡ BONUS CHANCE ⚡
                </div>
              )}

              {/* Vertical Reel Strip Container */}
              <div
                className="absolute inset-x-0 will-change-transform"
                style={{
                  transform: `translateY(${-fractionalOffset * SYMBOL_HEIGHT}px)`,
                  filter: blurFilter,
                }}
              >
                {renderedSymbols.map(({ symbol, rowPos }, idx) => {
                  const symData = SYMBOLS[symbol];
                  const isVisibleRow = rowPos >= 0 && rowPos < VISIBLE_ROWS;
                  const isWinningCoord = isVisibleRow && winningPositionsSet.has(`${rowPos},${col}`);

                  return (
                    <div
                      key={idx}
                      className="h-[100px] flex flex-col items-center justify-center p-2 relative group"
                    >
                      {/* Winning Symbol Glow & Frame */}
                      {isWinningCoord && !isSpinning && (
                        <div
                          className="absolute inset-1.5 rounded-lg border-2 animate-bounce shadow-lg pointer-events-none"
                          style={{
                            borderColor: symData.color,
                            boxShadow: `0 0 15px ${symData.glowColor}, inset 0 0 10px ${symData.glowColor}`,
                          }}
                        />
                      )}

                      {/* Symbol Icon */}
                      <span
                        className={`text-4xl transition-transform duration-200 select-none ${
                          isWinningCoord && !isSpinning ? 'scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]' : ''
                        }`}
                        style={{
                          textShadow: `0 0 15px ${symData.glowColor}`,
                        }}
                      >
                        {symData.icon}
                      </span>

                      {/* Symbol Label */}
                      <span
                        className="text-[10px] font-mono tracking-wider font-semibold uppercase mt-1 truncate max-w-[90%]"
                        style={{ color: symData.color }}
                      >
                        {symData.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Reel Shadow Gradients on Top & Bottom to give 3D Cylindrical Curvature */}
              <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black via-black/60 to-transparent pointer-events-none z-20" />
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-20" />
            </div>
          );
        })}

        {/* SVG Paylines Overlay precisely aligned with reel grid */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-25 p-2.5"
          viewBox="0 0 800 300"
          preserveAspectRatio="none"
        >
          {/* Render winning paylines */}
          {!isSpinning &&
            winningLines.map((wl) => {
              const payline = PAYLINES.find((p) => p.id === wl.lineId);
              if (!payline) return null;

              const colWidth = 800 / 5;
              const rowHeight = 300 / 3;

              const pathD = payline.positions
                .map((row, col) => {
                  const x = col * colWidth + colWidth / 2;
                  const y = row * rowHeight + rowHeight / 2;
                  return `${col === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                })
                .join(' ');

              return (
                <g key={wl.lineId}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={payline.color}
                    strokeWidth="8"
                    strokeOpacity="0.4"
                    className="animate-pulse"
                  />
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeDasharray="6 3"
                    className="animate-[dash_1s_linear_infinite]"
                  />
                </g>
              );
            })}

          {/* Render Preview Payline when hovered in control panel */}
          {selectedPreviewLine !== null && (
            <g>
              {(() => {
                const payline = PAYLINES.find((p) => p.id === selectedPreviewLine);
                if (!payline) return null;
                const colWidth = 800 / 5;
                const rowHeight = 300 / 3;
                const pathD = payline.positions
                  .map((row, col) => {
                    const x = col * colWidth + colWidth / 2;
                    const y = row * rowHeight + rowHeight / 2;
                    return `${col === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                  })
                  .join(' ');

                return (
                  <path
                    d={pathD}
                    fill="none"
                    stroke={payline.color}
                    strokeWidth="5"
                    strokeOpacity="0.9"
                    strokeDasharray="8 4"
                  />
                );
              })()}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
