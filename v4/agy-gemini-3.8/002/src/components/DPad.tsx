import React from 'react';
import { Direction } from '../types';

interface DPadProps {
  onMove: (dir: Direction) => void;
  disabled?: boolean;
}

export const DPad: React.FC<DPadProps> = ({ onMove, disabled = false }) => {
  return (
    <div className="relative w-36 h-36 flex items-center justify-center select-none">
      {/* Central Cross Background */}
      <div className="absolute w-12 h-36 bg-neutral-800 rounded-sm shadow-md" />
      <div className="absolute w-36 h-12 bg-neutral-800 rounded-sm shadow-md" />

      {/* Center pivot indentation */}
      <div className="absolute w-6 h-6 rounded-full bg-neutral-900 border border-neutral-700 pointer-events-none z-10" />

      {/* UP BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onMove('UP')}
        aria-label="Move Up"
        className="absolute top-0 w-12 h-12 flex items-center justify-center text-neutral-400 active:bg-neutral-900 active:scale-95 transition-transform rounded-t-sm z-20 cursor-pointer"
      >
        <span className="text-xs font-bold pointer-events-none">▲</span>
      </button>

      {/* DOWN BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onMove('DOWN')}
        aria-label="Move Down"
        className="absolute bottom-0 w-12 h-12 flex items-center justify-center text-neutral-400 active:bg-neutral-900 active:scale-95 transition-transform rounded-b-sm z-20 cursor-pointer"
      >
        <span className="text-xs font-bold pointer-events-none">▼</span>
      </button>

      {/* LEFT BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onMove('LEFT')}
        aria-label="Move Left"
        className="absolute left-0 w-12 h-12 flex items-center justify-center text-neutral-400 active:bg-neutral-900 active:scale-95 transition-transform rounded-l-sm z-20 cursor-pointer"
      >
        <span className="text-xs font-bold pointer-events-none">◀</span>
      </button>

      {/* RIGHT BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onMove('RIGHT')}
        aria-label="Move Right"
        className="absolute right-0 w-12 h-12 flex items-center justify-center text-neutral-400 active:bg-neutral-900 active:scale-95 transition-transform rounded-r-sm z-20 cursor-pointer"
      >
        <span className="text-xs font-bold pointer-events-none">▶</span>
      </button>
    </div>
  );
};
