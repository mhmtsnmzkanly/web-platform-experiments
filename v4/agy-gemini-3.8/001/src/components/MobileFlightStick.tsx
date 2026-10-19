import React from 'react';

interface MobileFlightStickProps {
  onForward: (active: boolean) => void;
  onBackward: (active: boolean) => void;
  onLeft: (active: boolean) => void;
  onRight: (active: boolean) => void;
  onFire: (active: boolean) => void;
  onBoost: (active: boolean) => void;
  canDock: boolean;
  onDock: () => void;
}

const MobileFlightStickComponent: React.FC<MobileFlightStickProps> = ({
  onForward,
  onBackward,
  onLeft,
  onRight,
  onFire,
  onBoost,
  canDock,
  onDock,
}) => {
  return (
    <div className="md:hidden fixed inset-x-0 bottom-3 px-4 flex items-end justify-between pointer-events-none select-none z-30 font-mono">
      {/* Directional Flight Controls (Left) */}
      <div className="pointer-events-auto grid grid-cols-3 gap-2 w-36 h-36 bg-slate-950/60 p-2 rounded-full border border-slate-800 backdrop-blur-xs">
        <div />
        <button
          onPointerDown={() => onForward(true)}
          onPointerUp={() => onForward(false)}
          onPointerLeave={() => onForward(false)}
          onPointerCancel={() => onForward(false)}
          className="bg-slate-800/80 active:bg-cyan-600 rounded-t-lg flex items-center justify-center text-slate-200 text-xs font-bold"
        >
          ▲
        </button>
        <div />

        <button
          onPointerDown={() => onLeft(true)}
          onPointerUp={() => onLeft(false)}
          onPointerLeave={() => onLeft(false)}
          onPointerCancel={() => onLeft(false)}
          className="bg-slate-800/80 active:bg-cyan-600 rounded-l-lg flex items-center justify-center text-slate-200 text-xs font-bold"
        >
          ◀
        </button>
        <button
          onPointerDown={() => onBackward(true)}
          onPointerUp={() => onBackward(false)}
          onPointerLeave={() => onBackward(false)}
          onPointerCancel={() => onBackward(false)}
          className="bg-slate-800/80 active:bg-cyan-600 rounded flex items-center justify-center text-[10px] text-slate-300 font-bold"
        >
          BRAKE
        </button>
        <button
          onPointerDown={() => onRight(true)}
          onPointerUp={() => onRight(false)}
          onPointerLeave={() => onRight(false)}
          onPointerCancel={() => onRight(false)}
          className="bg-slate-800/80 active:bg-cyan-600 rounded-r-lg flex items-center justify-center text-slate-200 text-xs font-bold"
        >
          ▶
        </button>

        <div />
        <div />
        <div />
      </div>

      {/* Action Buttons (Right) */}
      <div className="pointer-events-auto flex flex-col items-end gap-3">
        {canDock && (
          <button
            onClick={onDock}
            className="w-14 h-14 rounded-full bg-cyan-600 active:bg-cyan-500 text-white font-black text-xs shadow-lg shadow-cyan-950 flex items-center justify-center animate-pulse cursor-pointer"
          >
            DOCK
          </button>
        )}

        <div className="flex items-center gap-3">
          {/* Boost Button */}
          <button
            onPointerDown={() => onBoost(true)}
            onPointerUp={() => onBoost(false)}
            onPointerLeave={() => onBoost(false)}
            onPointerCancel={() => onBoost(false)}
            className="w-14 h-14 rounded-full bg-amber-600/90 active:bg-amber-500 text-black font-black text-xs shadow-lg flex items-center justify-center cursor-pointer"
          >
            BOOST
          </button>

          {/* Fire Button */}
          <button
            onPointerDown={() => onFire(true)}
            onPointerUp={() => onFire(false)}
            onPointerLeave={() => onFire(false)}
            onPointerCancel={() => onFire(false)}
            className="w-18 h-18 rounded-full bg-rose-600 active:bg-rose-500 text-white font-black text-sm shadow-xl shadow-rose-950 flex items-center justify-center cursor-pointer"
          >
            FIRE
          </button>
        </div>
      </div>
    </div>
  );
};

export const MobileFlightStick = React.memo(MobileFlightStickComponent);
