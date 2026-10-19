import { SeismographStation, TravelTimeCurvePoint } from '../types';
import { ElastodynamicsSolver } from './ElastodynamicsSolver';

export class SeismographNetwork {
  public stations: SeismographStation[];
  public maxHistorySamples: number = 300;

  constructor() {
    this.stations = [
      {
        id: 'STA_01',
        name: 'Station Alpha (Near-Field)',
        coordXKm: 55,
        distanceKm: 0,
        pArrivalSec: null,
        sArrivalSec: null,
        rayleighArrivalSec: null,
        pgaG: 0,
        pgvCmS: 0,
        historyVx: [],
        historyVz: [],
        historyTime: [],
      },
      {
        id: 'STA_02',
        name: 'Station Bravo (Regional)',
        coordXKm: 105,
        distanceKm: 0,
        pArrivalSec: null,
        sArrivalSec: null,
        rayleighArrivalSec: null,
        pgaG: 0,
        pgvCmS: 0,
        historyVx: [],
        historyVz: [],
        historyTime: [],
      },
      {
        id: 'STA_03',
        name: 'Station Charlie (Basin Station)',
        coordXKm: 160,
        distanceKm: 0,
        pArrivalSec: null,
        sArrivalSec: null,
        rayleighArrivalSec: null,
        pgaG: 0,
        pgvCmS: 0,
        historyVx: [],
        historyVz: [],
        historyTime: [],
      },
      {
        id: 'STA_04',
        name: 'Station Delta (Teleseismic Array)',
        coordXKm: 215,
        distanceKm: 0,
        pArrivalSec: null,
        sArrivalSec: null,
        rayleighArrivalSec: null,
        pgaG: 0,
        pgvCmS: 0,
        historyVx: [],
        historyVz: [],
        historyTime: [],
      },
    ];
  }

  /**
   * Samples surface velocities at each station and updates seismograms with calibrated physical units
   */
  public update(
    solver: ElastodynamicsSolver,
    epicenterXKm: number,
    onPhasePick?: (phase: 'P' | 'S' | 'RAYLEIGH') => void
  ): void {
    const nx = solver.nx;
    const timeSec = solver.simTimeSec;

    for (const station of this.stations) {
      // Calculate distance from epicenter
      station.distanceKm = Math.abs(station.coordXKm - epicenterXKm);

      const cellX = Math.max(0, Math.min(nx - 1, Math.round(station.coordXKm / solver.dxKm)));
      const surfaceIdx = cellX; // z = 0 is surface

      // Calibrated physical ground velocity: maps Mw 9.0 near-field peak velocity to realistic ~120 cm/s
      const scaleToPhysicalCmS = 2.5;
      const vxVal = solver.vx[surfaceIdx] * scaleToPhysicalCmS;
      const vzVal = solver.vz[surfaceIdx] * scaleToPhysicalCmS;
      const speedCmS = Math.hypot(vxVal, vzVal);

      // Estimate acceleration in g: a = dv / dt / 981 cm/s^2
      const prevVz = station.historyVz.length > 0 ? station.historyVz[station.historyVz.length - 1] : 0;
      const prevVx = station.historyVx.length > 0 ? station.historyVx[station.historyVx.length - 1] : 0;
      const dVz = (vzVal - prevVz) / Math.max(0.01, solver.dtSec);
      const dVx = (vxVal - prevVx) / Math.max(0.01, solver.dtSec);
      const accG = Math.hypot(dVx, dVz) / 981.0;

      if (speedCmS > station.pgvCmS) station.pgvCmS = speedCmS;
      if (accG > station.pgaG) station.pgaG = accG;

      // Phase picker: P-wave arrival trigger
      if (station.pArrivalSec === null && Math.abs(vzVal) > 0.35 && timeSec > 0.1) {
        station.pArrivalSec = timeSec;
        if (onPhasePick) onPhasePick('P');
      }

      // S-wave arrival trigger: high horizontal shear velocity
      if (station.pArrivalSec !== null && station.sArrivalSec === null && Math.abs(vxVal) > 0.9 && timeSec > station.pArrivalSec + 0.3) {
        station.sArrivalSec = timeSec;
        if (onPhasePick) onPhasePick('S');
      }

      // Rayleigh wave arrival: elliptical ground roll (both large vx and vz)
      if (station.sArrivalSec !== null && station.rayleighArrivalSec === null && speedCmS > 2.2 && timeSec > station.sArrivalSec + 0.4) {
        station.rayleighArrivalSec = timeSec;
        if (onPhasePick) onPhasePick('RAYLEIGH');
      }

      // Append to rolling history
      station.historyVx.push(vxVal);
      station.historyVz.push(vzVal);
      station.historyTime.push(timeSec);

      if (station.historyVx.length > this.maxHistorySamples) {
        station.historyVx.shift();
        station.historyVz.shift();
        station.historyTime.shift();
      }
    }
  }

  /**
   * Generates theoretical travel-time curve points (P, S, and Rayleigh waves)
   */
  public getTravelTimeCurves(vpSurface: number = 5.8, vsSurface: number = 3.3, focalDepthKm: number = 15): TravelTimeCurvePoint[] {
    const points: TravelTimeCurvePoint[] = [];
    const vRayleigh = vsSurface * 0.92; // Rayleigh speed ~ 0.92 * Vs

    for (let d = 0; d <= 240; d += 8) {
      // Slant distance: R = sqrt(dist^2 + depth^2)
      const slantDist = Math.hypot(d, focalDepthKm);
      const tP = slantDist / vpSurface;
      const tS = slantDist / vsSurface;
      const tRay = (d / vRayleigh) + (focalDepthKm / vsSurface);

      points.push({
        distanceKm: d,
        pTimeSec: tP,
        sTimeSec: tS,
        rayleighTimeSec: tRay,
      });
    }

    return points;
  }

  /**
   * Resets all station seismogram buffers and arrival picks
   */
  public reset(): void {
    for (const st of this.stations) {
      st.pArrivalSec = null;
      st.sArrivalSec = null;
      st.rayleighArrivalSec = null;
      st.pgaG = 0;
      st.pgvCmS = 0;
      st.historyVx = [];
      st.historyVz = [];
      st.historyTime = [];
    }
  }
}
