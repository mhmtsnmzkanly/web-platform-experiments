import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Play, Square, Activity, Music } from 'lucide-react';

const LETTER_NOTES = [
  { char: 'H', freq: 220.0, note: 'A3' },
  { char: 'E', freq: 277.18, note: 'C#4' },
  { char: 'L', freq: 329.63, note: 'E4' },
  { char: 'L', freq: 370.0, note: 'F#4' },
  { char: 'O', freq: 440.0, note: 'A4' },
  { char: ' ', freq: 0, note: 'REST' },
  { char: 'W', freq: 493.88, note: 'B4' },
  { char: 'O', freq: 554.37, note: 'C#5' },
  { char: 'R', freq: 659.25, note: 'E5' },
  { char: 'L', freq: 739.99, note: 'F#5' },
  { char: 'D', freq: 880.0, note: 'A5' },
];

export default function Experiment07AudioWaveformSynth() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [activeLetterIdx, setActiveLetterIdx] = useState<number | null>(null);
  const [waveType, setWaveType] = useState<OscillatorType>('sine');
  const [bpm, setBpm] = useState(120);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const analyser = audioCtxRef.current.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      analyser.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playFreq = (freq: number, duration = 0.3) => {
    if (freq <= 0) return;
    initAudio();
    const ctx = audioCtxRef.current;
    const analyser = analyserRef.current;
    if (!ctx || !analyser) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = waveType;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(analyser);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  // Oscilloscope Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    const height = (canvas.height = 360);

    let isRunning = true;
    let animId = 0;

    const bufferLength = analyserRef.current?.frequencyBinCount || 1024;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      if (!isRunning) return;

      // Dark background
      ctx.fillStyle = '#0c0e12';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Oscilloscope Beam
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = '#0ea5e9';
      ctx.shadowBlur = 10;
      ctx.beginPath();

      if (analyserRef.current) {
        analyserRef.current.getByteTimeDomainData(dataArray);
        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
      } else {
        // Idle flatline with subtle hum
        const t = Date.now() * 0.003;
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin(x * 0.02 + t) * 3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, []);

  // Sequence player
  useEffect(() => {
    if (!isPlayingSeq) return;

    let idx = 0;
    const stepDuration = (60 / bpm) * 1000 * 0.5;

    const timer = setInterval(() => {
      if (idx >= LETTER_NOTES.length) {
        idx = 0;
      }
      setActiveLetterIdx(idx);
      playFreq(LETTER_NOTES[idx].freq, stepDuration / 1000);
      idx++;
    }, stepDuration);

    return () => {
      clearInterval(timer);
      setActiveLetterIdx(null);
    };
  }, [isPlayingSeq, bpm, waveType]);

  return (
    <div className="relative w-full min-h-[620px] bg-stone-950 text-stone-100 rounded-xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-stone-800">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-3 text-xs font-mono text-stone-400">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-sky-400" />
          <span className="font-bold text-stone-200">STUDY 007</span> // HARMONIC WAVEFORM OSCILLOSCOPE
        </div>
        <div className="flex items-center gap-4">
          <span>WEB AUDIO SYNTHESIZER</span>
          <span>BPM: {bpm}</span>
        </div>
      </div>

      {/* Oscilloscope Screen */}
      <div className="relative my-auto flex-1 flex flex-col items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-[280px] rounded-lg border border-stone-800 shadow-inner" />

        {/* Interactive Piano Roll Letters for "HELLO WORLD" */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {LETTER_NOTES.map((item, i) => {
            if (item.char === ' ') {
              return <div key={i} className="w-4" />;
            }
            const isActive = activeLetterIdx === i;
            return (
              <button
                key={i}
                onClick={() => {
                  setActiveLetterIdx(i);
                  playFreq(item.freq, 0.4);
                  setTimeout(() => setActiveLetterIdx(null), 300);
                }}
                className={`flex flex-col items-center justify-between p-3 rounded-lg border transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-sky-500 text-stone-950 border-sky-400 scale-105 shadow-[0_0_20px_rgba(56,189,248,0.8)]'
                    : 'bg-stone-900/90 text-stone-100 border-stone-700 hover:border-sky-500 hover:bg-stone-800'
                }`}
              >
                <span className="text-2xl font-bold font-sans">{item.char}</span>
                <span className="text-[10px] font-mono mt-1 opacity-70">{item.note}</span>
                <span className="text-[9px] font-mono opacity-50">{Math.round(item.freq)}Hz</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="relative z-10 bg-stone-900/90 border border-stone-800 rounded-lg p-3 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              initAudio();
              setIsPlayingSeq(!isPlayingSeq);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded font-bold transition-all ${
              isPlayingSeq ? 'bg-amber-500 text-stone-950' : 'bg-sky-500 text-stone-950 hover:bg-sky-400'
            }`}
          >
            {isPlayingSeq ? <Square size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
            <span>{isPlayingSeq ? 'STOP' : 'PLAY ARPEGGIO'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-stone-400">Tempo:</span>
            <input
              type="range"
              min="60"
              max="220"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-24 accent-sky-400"
            />
            <span className="w-12">{bpm} BPM</span>
          </div>
        </div>

        {/* Waveform Selector */}
        <div className="flex items-center gap-2">
          <span className="text-stone-400">Wave:</span>
          {(['sine', 'triangle', 'square', 'sawtooth'] as const).map((w) => (
            <button
              key={w}
              onClick={() => setWaveType(w)}
              className={`px-2 py-1 uppercase rounded text-[11px] transition-all ${
                waveType === w ? 'bg-white text-stone-950 font-bold' : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
