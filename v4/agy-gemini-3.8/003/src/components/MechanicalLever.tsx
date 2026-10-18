import React, { useState, useRef, useEffect } from 'react';
import { soundFx } from '../audio/SlotAudioEngine';

interface MechanicalLeverProps {
  onPull: () => void;
  disabled: boolean;
}

export const MechanicalLever: React.FC<MechanicalLeverProps> = ({ onPull, disabled }) => {
  const [pullProgress, setPullProgress] = useState(0); // 0 (up) to 1 (fully pulled down)
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const currentProgressRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const triggerSpin = () => {
    if (disabled) return;
    soundFx.playLeverPull();
    onPull();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    currentProgressRef.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || disabled) return;
    const deltaY = e.clientY - startYRef.current;
    const maxDelta = 130; // pixels to full pull
    const progress = Math.min(1, Math.max(0, deltaY / maxDelta));
    currentProgressRef.current = progress;
    setPullProgress(progress);

    if (progress >= 0.95 && !disabled) {
      // Full pull reached!
      isDraggingRef.current = false;
      triggerSpin();
      snapBack();
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (currentProgressRef.current > 0.5 && !disabled) {
      triggerSpin();
    }
    snapBack();
  };

  const snapBack = () => {
    const startTime = performance.now();
    const startVal = currentProgressRef.current;
    const duration = 280; // ms spring snap

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Damped spring bounce
      const bounce = Math.cos(t * Math.PI * 1.5) * Math.exp(-t * 3);
      const val = startVal * bounce;
      currentProgressRef.current = Math.max(0, val);
      setPullProgress(Math.max(0, val));

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        currentProgressRef.current = 0;
        setPullProgress(0);
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Calculate physical rotation and shaft elongation
  const rotationDeg = pullProgress * 55; // 0 to 55 deg tilt
  const shaftHeight = 110 - pullProgress * 30; // compresses as it swings towards viewer

  return (
    <div
      className="relative flex flex-col items-center justify-start select-none touch-none h-64 w-16"
      style={{ filter: disabled ? 'grayscale(0.6) opacity(0.8)' : 'none' }}
      title={disabled ? 'Reels are spinning...' : 'Click or Drag Lever Down to Spin!'}
    >
      {/* Base mounting housing bolted to cabinet */}
      <div className="absolute top-24 w-12 h-14 bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-900 rounded-lg border-2 border-neutral-500 shadow-2xl flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-400 flex items-center justify-center shadow-inner">
          <div className="w-3 h-3 rounded-full bg-amber-500/80 animate-pulse" />
        </div>
      </div>

      {/* Lever Arm & Ball Grip */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={() => {
          if (!disabled && pullProgress === 0) {
            triggerSpin();
            currentProgressRef.current = 1;
            setPullProgress(1);
            snapBack();
          }
        }}
        className="absolute top-4 cursor-grab active:cursor-grabbing flex flex-col items-center transition-transform"
        style={{
          transformOrigin: 'bottom center',
          transform: `translateY(${pullProgress * 65}px) rotate(${rotationDeg * 0.3}deg)`,
        }}
      >
        {/* Red Metallic Knob with specular highlights */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-red-400 via-red-600 to-red-950 border-2 border-red-300 shadow-xl flex items-center justify-center relative transform hover:scale-105 active:scale-95 transition-transform">
          <div className="absolute top-1.5 left-2 w-3.5 h-2 rounded-full bg-white/70 blur-[0.5px]" />
          <div className="w-4 h-4 rounded-full bg-red-800/60 border border-red-400/50" />
        </div>

        {/* Chrome Metallic Shaft */}
        <div
          className="w-3 bg-gradient-to-r from-slate-200 via-white to-slate-400 border-x border-slate-500 shadow-lg"
          style={{ height: `${shaftHeight}px` }}
        />
      </div>

      {/* Pull hint indicator */}
      {!disabled && pullProgress === 0 && (
        <div className="absolute bottom-1 text-[10px] uppercase font-mono tracking-widest text-amber-400/80 animate-bounce pointer-events-none">
          PULL
        </div>
      )}
    </div>
  );
};
