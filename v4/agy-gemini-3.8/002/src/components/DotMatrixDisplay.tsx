import React, { useRef, useEffect } from 'react';
import { LevelConfig, LetterBlock, Barrier, Position, Direction, PaletteColors } from '../types';

interface DotMatrixDisplayProps {
  level: LevelConfig;
  playerPos: Position;
  playerDir: Direction;
  blocks: LetterBlock[];
  barriers: Barrier[];
  palette: PaletteColors;
  isWon: boolean;
  parMoves: number;
  turnCount: number;
}

export const DotMatrixDisplay: React.FC<DotMatrixDisplayProps> = ({
  level,
  playerPos,
  playerDir,
  blocks,
  barriers,
  palette,
  isWon,
  parMoves,
  turnCount,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed internal Game Boy aspect ratio (160x144 internal virtual resolution or scaled)
    // We compute tile size based on level dimensions so the maze is centered
    const width = canvas.width;
    const height = canvas.height;

    const tileSize = Math.floor(Math.min((width - 24) / level.cols, (height - 24) / level.rows));
    const offsetX = Math.floor((width - tileSize * level.cols) / 2);
    const offsetY = Math.floor((height - tileSize * level.rows) / 2);

    // 1. Clear background (lightest shade)
    ctx.fillStyle = palette.lightest;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw subtle dot-matrix background grid
    ctx.fillStyle = palette.light;
    ctx.globalAlpha = 0.25;
    for (let x = 4; x < width; x += 4) {
      for (let y = 4; y < height; y += 4) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
    ctx.globalAlpha = 1.0;

    // 3. Draw Floor & Walls
    for (let r = 0; r < level.rows; r++) {
      for (let c = 0; c < level.cols; c++) {
        const x = offsetX + c * tileSize;
        const y = offsetY + r * tileSize;

        if (level.walls[r][c] === 1) {
          // Wall tile (Darkest + Dark beveled brick)
          ctx.fillStyle = palette.darkest;
          ctx.fillRect(x, y, tileSize, tileSize);

          ctx.fillStyle = palette.dark;
          ctx.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2);

          // Brick pattern lines
          ctx.fillStyle = palette.darkest;
          ctx.fillRect(x, y + Math.floor(tileSize / 2), tileSize, 1);
          ctx.fillRect(x + Math.floor(tileSize / 2), y, 1, Math.floor(tileSize / 2));
        } else {
          // Floor tile
          ctx.fillStyle = palette.lightest;
          ctx.fillRect(x, y, tileSize, tileSize);

          // Subtle floor corner markers
          ctx.fillStyle = palette.light;
          ctx.fillRect(x + 1, y + 1, 1, 1);
          ctx.fillRect(x + tileSize - 2, y + 1, 1, 1);
          ctx.fillRect(x + 1, y + tileSize - 2, 1, 1);
          ctx.fillRect(x + tileSize - 2, y + tileSize - 2, 1, 1);
        }
      }
    }

    // 4. Draw Goal Sockets
    level.sockets.forEach((socket) => {
      const sx = offsetX + socket.col * tileSize;
      const sy = offsetY + socket.row * tileSize;

      // Socket Receptacle Box
      ctx.strokeStyle = palette.dark;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 2]);
      ctx.strokeRect(sx + 3, sy + 3, tileSize - 6, tileSize - 6);
      ctx.setLineDash([]);

      // Light target letter watermark
      ctx.fillStyle = palette.light;
      ctx.font = `bold ${Math.floor(tileSize * 0.48)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(socket.char, sx + tileSize / 2, sy + tileSize / 2 + 1);
    });

    // 5. Draw Barriers
    barriers.forEach((barrier) => {
      const bx = offsetX + barrier.col * tileSize;
      const by = offsetY + barrier.row * tileSize;

      if (barrier.active) {
        // Active laser/electro barrier
        ctx.fillStyle = palette.darkest;
        ctx.fillRect(bx + 2, by + 2, tileSize - 4, tileSize - 4);

        ctx.fillStyle = palette.lightest;
        ctx.font = `bold ${Math.floor(tileSize * 0.55)}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡', bx + tileSize / 2, by + tileSize / 2);
      } else {
        // Deactivated barrier floor imprint
        ctx.strokeStyle = palette.light;
        ctx.lineWidth = 1;
        ctx.strokeRect(bx + 4, by + 4, tileSize - 8, tileSize - 8);
        ctx.fillStyle = palette.light;
        ctx.font = `bold ${Math.floor(tileSize * 0.35)}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('OPEN', bx + tileSize / 2, by + tileSize / 2);
      }
    });

    // 6. Draw Movable Letter Blocks
    blocks.forEach((block) => {
      const bx = offsetX + block.col * tileSize;
      const by = offsetY + block.row * tileSize;

      const pad = 2;
      const bWidth = tileSize - pad * 2;
      const bHeight = tileSize - pad * 2;

      // Drop shadow
      ctx.fillStyle = palette.darkest;
      ctx.fillRect(bx + pad + 2, by + pad + 2, bWidth, bHeight);

      if (block.isMatched) {
        // Matched state: Light background with Darkest text + double frame
        ctx.fillStyle = palette.light;
        ctx.fillRect(bx + pad, by + pad, bWidth, bHeight);

        ctx.strokeStyle = palette.darkest;
        ctx.lineWidth = 2;
        ctx.strokeRect(bx + pad + 1, by + pad + 1, bWidth - 2, bHeight - 2);

        // Letter
        ctx.fillStyle = palette.darkest;
      } else {
        // Unmatched state: Dark body with Lightest text
        ctx.fillStyle = palette.dark;
        ctx.fillRect(bx + pad, by + pad, bWidth, bHeight);

        ctx.strokeStyle = palette.darkest;
        ctx.lineWidth = 1;
        ctx.strokeRect(bx + pad, by + pad, bWidth, bHeight);

        // Letter
        ctx.fillStyle = palette.lightest;
      }

      ctx.font = `900 ${Math.floor(tileSize * 0.52)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(block.char, bx + tileSize / 2, by + tileSize / 2 + 1);
    });

    // 7. Draw Player Avatar (Retro DMG Technician)
    const px = offsetX + playerPos.col * tileSize;
    const py = offsetY + playerPos.row * tileSize;
    const centerPx = px + tileSize / 2;
    const centerPy = py + tileSize / 2;
    const radius = Math.floor(tileSize * 0.38);

    // Body shadow
    ctx.fillStyle = palette.darkest;
    ctx.beginPath();
    ctx.arc(centerPx + 1, centerPy + 1, radius, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = palette.darkest;
    ctx.beginPath();
    ctx.arc(centerPx, centerPy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Helmet visor
    ctx.fillStyle = palette.lightest;
    const visorRadius = radius * 0.55;
    let vdx = 0;
    let vdy = 0;
    if (playerDir === 'UP') vdy = -visorRadius * 0.5;
    if (playerDir === 'DOWN') vdy = visorRadius * 0.5;
    if (playerDir === 'LEFT') vdx = -visorRadius * 0.5;
    if (playerDir === 'RIGHT') vdx = visorRadius * 0.5;

    ctx.beginPath();
    ctx.arc(centerPx + vdx, centerPy + vdy, visorRadius, 0, Math.PI * 2);
    ctx.fill();

    // Visor eye glint
    ctx.fillStyle = palette.darkest;
    ctx.fillRect(centerPx + vdx - 1, centerPy + vdy - 1, 2, 2);

    // 8. Victory Banner Overlay
    if (isWon) {
      ctx.fillStyle = palette.darkest;
      ctx.globalAlpha = 0.88;
      ctx.fillRect(0, height / 2 - 40, width, 80);
      ctx.globalAlpha = 1.0;

      ctx.strokeStyle = palette.lightest;
      ctx.lineWidth = 2;
      ctx.strokeRect(6, height / 2 - 36, width - 12, 72);

      ctx.fillStyle = palette.lightest;
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★ LEVEL COMPILED! ★', width / 2, height / 2 - 12);

      ctx.font = '12px monospace';
      const parStar = turnCount <= parMoves ? ' [PAR GOLD ★★★]' : ' [COMPLETED ★☆☆]';
      ctx.fillText(`MOVES: ${turnCount} / PAR: ${parMoves}${parStar}`, width / 2, height / 2 + 14);
    }

    // 9. Scanline Effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    for (let y = 0; y < height; y += 2) {
      ctx.fillRect(0, y, width, 1);
    }
  }, [level, playerPos, playerDir, blocks, barriers, palette, isWon, parMoves, turnCount]);

  return (
    <div className="relative w-full aspect-[4/3] bg-neutral-900 rounded-sm border-2 border-neutral-700 shadow-inner flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={360}
        height={270}
        className="w-full h-full object-contain pixelated"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};
