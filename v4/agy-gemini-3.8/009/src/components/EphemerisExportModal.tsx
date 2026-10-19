import React from 'react';
import { X, Download, FileSpreadsheet, FileJson, Camera } from 'lucide-react';
import { CelestialBody, EphemerisDataPoint } from '../types';

interface EphemerisExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bodies: CelestialBody[];
  ephemerisLog: EphemerisDataPoint[];
}

export const EphemerisExportModal: React.FC<EphemerisExportModalProps> = ({
  isOpen,
  onClose,
  bodies,
  ephemerisLog,
}) => {
  if (!isOpen) return null;

  const handleExportCSV = () => {
    if (ephemerisLog.length === 0) {
      alert('Ephemeris log is empty. Advance the simulation to collect data points.');
      return;
    }

    const headers = [
      'timestamp_seconds',
      'body_name',
      'pos_x_km',
      'pos_y_km',
      'vel_x_kms',
      'vel_y_kms',
      'speed_kms',
      'altitude_km',
      'distance_to_primary_km',
    ];

    const rows = ephemerisLog.map((dp) => [
      dp.timestamp.toFixed(1),
      `"${dp.bodyName}"`,
      dp.posX.toFixed(2),
      dp.posY.toFixed(2),
      dp.velX.toFixed(4),
      dp.velY.toFixed(4),
      dp.speedKmS.toFixed(4),
      dp.altitudeKm.toFixed(1),
      dp.distanceToPrimaryKm.toFixed(1),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadFile(csvContent, `orbital_ephemeris_${Date.now()}.csv`, 'text/csv');
  };

  const handleExportJSON = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      bodies: bodies.map((b) => ({
        id: b.id,
        name: b.name,
        type: b.type,
        mass: b.mass,
        radius: b.radius,
        pos: b.pos,
        vel: b.vel,
      })),
      ephemerisDataCount: ephemerisLog.length,
      ephemerisLog: ephemerisLog.slice(-500), // last 500 points
    };

    const jsonString = JSON.stringify(payload, null, 2);
    downloadFile(jsonString, `orbital_mission_${Date.now()}.json`, 'application/json');
  };

  const handleExportSVG = () => {
    // Generate clean SVG vector diagram of current bodies & trails
    let minX = -10000;
    let maxX = 10000;
    let minY = -10000;
    let maxY = 10000;

    bodies.forEach((b) => {
      minX = Math.min(minX, b.pos.x - b.radius * 2);
      maxX = Math.max(maxX, b.pos.x + b.radius * 2);
      minY = Math.min(minY, b.pos.y - b.radius * 2);
      maxY = Math.max(maxY, b.pos.y + b.radius * 2);
    });

    const width = maxX - minX;
    const height = maxY - minY;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}" width="1200" height="800" style="background:#020617">\n`;

    // Trails
    bodies.forEach((b) => {
      if (b.trail.length > 1) {
        const pathData = b.trail.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${-pt.y}`).join(' ');
        svg += `  <path d="${pathData}" fill="none" stroke="${b.color}" stroke-width="${Math.max(1, width / 800)}" stroke-opacity="0.5" />\n`;
      }
    });

    // Bodies
    bodies.forEach((b) => {
      const r = Math.max(width / 300, b.radius);
      svg += `  <circle cx="${b.pos.x}" cy="${-b.pos.y}" r="${r}" fill="${b.color}" />\n`;
      svg += `  <text x="${b.pos.x + r * 1.5}" y="${-b.pos.y + r * 0.5}" fill="#f8fafc" font-family="monospace" font-size="${r * 1.8}">${b.name}</text>\n`;
    });

    svg += '</svg>';
    downloadFile(svg, `orbital_snapshot_${Date.now()}.svg`, 'image/svg+xml');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden text-slate-200 text-xs">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Download className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-sm text-slate-100">Export Orbital Telemetry</span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-slate-400 text-[11px]">
            Logged {ephemerisLog.length} ephemeris state points across current simulation run. Choose your export format:
          </p>

          <button
            onClick={handleExportCSV}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-500 transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <div className="text-left">
                <div className="font-semibold text-slate-200">CSV Ephemeris Trajectory</div>
                <div className="text-[10px] text-slate-400">Position, velocity vectors, speed & altitude timeseries</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-500 transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <FileJson className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <div className="font-semibold text-slate-200">JSON Mission State</div>
                <div className="text-[10px] text-slate-400">Full system state, bodies configuration & telemetry logs</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={handleExportSVG}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <Camera className="w-5 h-5 text-indigo-400" />
              <div className="text-left">
                <div className="font-semibold text-slate-200">SVG Orbital Snapshot</div>
                <div className="text-[10px] text-slate-400">Vector graphic diagram of bodies & orbital paths</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
