import React from 'react';

interface ActionButtonsProps {
  onA: () => void;
  onB: () => void;
  onSelect: () => void;
  onStart: () => void;
  canUndo: boolean;
  isWon: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onA,
  onB,
  onSelect,
  onStart,
  canUndo,
  isWon,
}) => {
  return (
    <div className="flex flex-col items-center justify-between gap-6 select-none">
      {/* Primary A & B Round Buttons - Angled 25 degrees */}
      <div className="flex items-center gap-5 -rotate-25 origin-center">
        {/* B BUTTON: UNDO */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onB}
            aria-label="Undo Move (B Button)"
            className="w-12 h-12 rounded-full bg-rose-900 border-2 border-rose-950 shadow-md active:translate-y-1 active:shadow-inner flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group transition-all"
          >
            <span className="text-white font-black text-sm tracking-wider">B</span>
          </button>
          <span className="mt-1 text-[10px] font-mono tracking-widest text-neutral-400 font-bold uppercase">
            UNDO
          </span>
        </div>

        {/* A BUTTON: ACTION / NEXT LEVEL */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={onA}
            aria-label="Action / Proceed (A Button)"
            className="w-12 h-12 rounded-full bg-rose-900 border-2 border-rose-950 shadow-md active:translate-y-1 active:shadow-inner flex items-center justify-center cursor-pointer group transition-all"
          >
            <span className="text-white font-black text-sm tracking-wider">A</span>
          </button>
          <span className="mt-1 text-[10px] font-mono tracking-widest text-neutral-400 font-bold uppercase">
            {isWon ? 'NEXT' : 'ACTION'}
          </span>
        </div>
      </div>

      {/* Pill-shaped SELECT & START Rubber Buttons */}
      <div className="flex items-center justify-center gap-6 mt-4">
        {/* SELECT: Toggle LCD Palette */}
        <div className="flex flex-col items-center rotate-[-25deg]">
          <button
            type="button"
            onClick={onSelect}
            aria-label="Toggle Color Palette (Select)"
            className="w-12 h-3.5 bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800 rounded-full shadow border border-neutral-800 cursor-pointer transition-colors"
          />
          <span className="mt-1.5 text-[9px] font-mono tracking-widest text-neutral-400 font-bold">
            PALETTE
          </span>
        </div>

        {/* START: Restart / Next */}
        <div className="flex flex-col items-center rotate-[-25deg]">
          <button
            type="button"
            onClick={onStart}
            aria-label="Restart Level (Start)"
            className="w-12 h-3.5 bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800 rounded-full shadow border border-neutral-800 cursor-pointer transition-colors"
          />
          <span className="mt-1.5 text-[9px] font-mono tracking-widest text-neutral-400 font-bold">
            RESET
          </span>
        </div>
      </div>
    </div>
  );
};
