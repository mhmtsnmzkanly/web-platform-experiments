import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';

const ASCII_HELLO = `
 ██░░██  ▓█████  ██▓     ██▓     ▒█████  
▓██░░██▒ ▓█   ▀ ▓██▒    ▓██▒    ▒██▒  ██▒
▒██████░ ▒███   ▒██░    ▒██░    ▒██░  ██▒
░██░░██░ ▒▓█  ▄ ▒██░    ▒██░    ▒██   ██░
░██▒░██▓ ░▒████▒░██████▒░██████▒░ ████▓▒░
 █░  ░█░ ░░ ▒░ ░░ ▒░▓  ░░ ▒░▓  ░░ ▒░▒░▒░ 
                                         
 █     █░▒█████   ██▀███   ██▓    ▓█████▄
▓█░ █ ░█░▒██▒  ██▒▓██ ▒ ██▒▓██▒    ▒██▀ ██▌
▒█░ █ ░█ ▒██░  ██▒▓██ ░▄█ ▒▒██░    ░██   █▌
░█░ █ ░█ ▒██   ██░▒██▀▀█▄  ▒██░    ░▓█▄   ▌
░░██▒██▓ ░ ████▓▒░░██▓ ▒██▒░██████▒░▒████▓ 
`;

export default function Experiment02CrtTerminal() {
  const [phosphor, setPhosphor] = useState<'green' | 'amber' | 'cyan' | 'white'>('green');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([
    'VT-100 TERMINAL SUBSYSTEM INITIALIZED [BAUD 9600]',
    'ROM CHECK OK - 64K RAM DETECTED',
    'TYPE "help" FOR AVAILABLE COMMANDS',
  ]);
  const [isGlitching, setIsGlitching] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  const colors = {
    green: {
      text: '#33ff33',
      glow: '0 0 10px rgba(51, 255, 51, 0.7), 0 0 20px rgba(51, 255, 51, 0.4)',
      bg: '#040d04',
      border: '#1b4d1b',
    },
    amber: {
      text: '#ffb000',
      glow: '0 0 10px rgba(255, 176, 0, 0.7), 0 0 20px rgba(255, 176, 0, 0.4)',
      bg: '#140c02',
      border: '#4a2f05',
    },
    cyan: {
      text: '#00f3ff',
      glow: '0 0 10px rgba(0, 243, 255, 0.7), 0 0 20px rgba(0, 243, 255, 0.4)',
      bg: '#020e14',
      border: '#0a3d4d',
    },
    white: {
      text: '#e6f0ff',
      glow: '0 0 10px rgba(230, 240, 255, 0.7), 0 0 20px rgba(230, 240, 255, 0.3)',
      bg: '#0c0e12',
      border: '#2a313d',
    },
  }[phosphor];

  const playBlip = (freq = 800, duration = 0.04) => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;
    playBlip(1200, 0.08);

    const newHistory = [...history, `> ${inputVal}`];

    if (cmd === 'help') {
      newHistory.push(
        'AVAILABLE COMMANDS:',
        '  hello       - Display Primary Transmission',
        '  color [c]   - Set phosphor: green, amber, cyan, white',
        '  glitch      - Induce electromagnetic interference',
        '  clear       - Flush CRT buffer',
        '  date        - Display local chronometer',
        '  echo [text] - Retransmit input buffer'
      );
    } else if (cmd === 'hello') {
      newHistory.push('TRANSMITTING: HELLO WORLD // SIGNAL CONFIRMED');
    } else if (cmd.startsWith('color ')) {
      const c = cmd.split(' ')[1] as 'green' | 'amber' | 'cyan' | 'white';
      if (['green', 'amber', 'cyan', 'white'].includes(c)) {
        setPhosphor(c);
        newHistory.push(`PHOSPHOR CALIBRATED TO: ${c.toUpperCase()}`);
      } else {
        newHistory.push('INVALID COLOR. USE: green, amber, cyan, white');
      }
    } else if (cmd === 'glitch') {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 900);
      newHistory.push('WARNING: HIGH VOLTAGE FLYBACK ANOMALY');
    } else if (cmd === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (cmd === 'date') {
      newHistory.push(new Date().toISOString());
    } else if (cmd.startsWith('echo ')) {
      newHistory.push(inputVal.substring(5));
    } else {
      newHistory.push(`SYNTAX ERROR: UNKNOWN COMMAND "${cmd}"`);
    }

    setHistory(newHistory);
    setInputVal('');
  };

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div
      className={`relative w-full min-h-[620px] p-6 rounded-2xl flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 font-mono ${
        isGlitching ? 'skew-x-2 filter invert' : ''
      }`}
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: '8px',
        boxShadow: `inset 0 0 80px rgba(0,0,0,0.9), 0 10px 40px rgba(0,0,0,0.8)`,
      }}
    >
      {/* Scanline CRT overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 z-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.7) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.04))',
          backgroundSize: '100% 4px, 6px 100%',
        }}
      />

      {/* Screen Vignette & Glass reflection */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_50%_30%,transparent_60%,rgba(0,0,0,0.8)_100%)]" />

      {/* Monitor Header */}
      <div
        className="relative z-30 flex items-center justify-between border-b pb-3 text-xs tracking-wider"
        style={{ color: colors.text, borderColor: colors.border, textShadow: colors.glow }}
      >
        <div className="flex items-center gap-2">
          <Terminal size={14} />
          <span>RAYTHEON 12" CRT PHOSPHOR TERMINAL // MODEL 78</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="flex items-center gap-1 hover:underline cursor-pointer"
          >
            {audioEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span>{audioEnabled ? 'SYNTH ON' : 'SYNTH MUTE'}</span>
          </button>
          <span>P1-{phosphor.toUpperCase()}</span>
        </div>
      </div>

      {/* Specimen Output Area */}
      <div className="relative z-30 my-3 flex-1 overflow-y-auto max-h-[380px] space-y-3 pr-2 scrollbar-thin">
        {/* Giant Monospace ASCII Banner */}
        <pre
          className="text-[9px] md:text-[11px] leading-[1.05] font-bold select-none whitespace-pre overflow-x-hidden"
          style={{ color: colors.text, textShadow: colors.glow }}
        >
          {ASCII_HELLO}
        </pre>

        {/* Console Log History */}
        <div className="space-y-1 text-xs" style={{ color: colors.text, textShadow: colors.glow }}>
          {history.map((line, i) => (
            <div key={i} className="leading-relaxed">
              {line}
            </div>
          ))}
          <div ref={terminalBottomRef} />
        </div>
      </div>

      {/* Interactive Command Input & Phosphor Selector */}
      <div className="relative z-30 pt-3 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: colors.border }}>
        <form onSubmit={handleCommand} className="w-full md:w-2/3 flex items-center gap-2 text-sm" style={{ color: colors.text }}>
          <span className="font-bold animate-pulse">&gt;</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              playBlip(700 + Math.random() * 200, 0.02);
            }}
            placeholder="Type 'help', 'glitch', 'color amber', 'hello'..."
            className="w-full bg-transparent outline-none font-mono"
            style={{ color: colors.text, textShadow: colors.glow }}
            autoFocus
          />
        </form>

        <div className="flex items-center gap-2">
          {(['green', 'amber', 'cyan', 'white'] as const).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPhosphor(p);
                playBlip(950, 0.05);
              }}
              className={`px-2.5 py-1 text-[11px] uppercase rounded border transition-all ${
                phosphor === p
                  ? 'bg-stone-800 font-bold shadow-lg scale-105'
                  : 'bg-transparent opacity-60 hover:opacity-100'
              }`}
              style={{ color: colors.text, borderColor: colors.border }}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => {
              setIsGlitching(true);
              playBlip(200, 0.2);
              setTimeout(() => setIsGlitching(false), 800);
            }}
            title="Trigger CRT Glitch"
            className="p-1 rounded border opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: colors.text, borderColor: colors.border }}
          >
            <Sparkles size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
