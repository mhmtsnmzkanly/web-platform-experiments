import { CONSTANTS } from './PhysicalConstants.js';

export interface TovSolution {
  centralDensityKgM3: number;
  totalMassKg: number;
  totalMassSolar: number;
  totalRadiusM: number;
  totalRadiusKm: number;
  compactness: number; // G * M / (R * c^2)
  gravitationalRedshift: number; // (1 - 2*compactness)^(-1/2) - 1
  points: {
    r: number; // meters
    pressure: number; // Pa
    density: number; // kg/m^3
    enclosedMass: number; // kg
  }[];
}

export class TovSolver {
  /**
   * Nuclear polytrope: P = K_nuc * rho^Gamma
   * Gamma = 2.0 (typical stiff neutron matter approximation)
   * K_nuc chosen such that at rho = 1e18 kg/m^3, P ~ 1e34 Pa
   */
  private static Gamma = 2.0;
  private static K_nuc = 1.0e-2; // in SI units (Pa / (kg/m^3)^2)

  public static pressureFromDensity(rho: number): number {
    return this.K_nuc * Math.pow(rho, this.Gamma);
  }

  public static densityFromPressure(P: number): number {
    if (P <= 0) return 0;
    return Math.pow(P / this.K_nuc, 1 / this.Gamma);
  }

  /**
   * Integrates the Tolman-Oppenheimer-Volkoff (TOV) relativistic hydrostatic equation
   */
  public static solve(centralDensityKgM3: number, dr: number = 10.0, maxSteps: number = 5000): TovSolution {
    if (!Number.isFinite(centralDensityKgM3) || centralDensityKgM3 <= 0) {
      throw new Error(`Central density must be a finite positive number, received: ${centralDensityKgM3}`);
    }

    let r = 10.0; // start at 10 meters
    let P = this.pressureFromDensity(centralDensityKgM3);
    let M = (4 / 3) * Math.PI * Math.pow(r, 3) * centralDensityKgM3;

    const points: { r: number; pressure: number; density: number; enclosedMass: number }[] = [
      { r: 0, pressure: P, density: centralDensityKgM3, enclosedMass: 0 },
      { r, pressure: P, density: centralDensityKgM3, enclosedMass: M },
    ];

    const dPdr = (rad: number, press: number, mass: number): number => {
      const rho = this.densityFromPressure(press);
      if (rho <= 0 || press <= 0) return 0;

      // Newtonian term: -G * M * rho / r^2
      const newtonian = -(CONSTANTS.G * mass * rho) / (rad * rad);

      // GR Correction Factors:
      // Factor 1: [ 1 + P / (rho * c^2) ]
      const f1 = 1 + press / (rho * CONSTANTS.c2);
      // Factor 2: [ 1 + 4 * pi * r^3 * P / (M * c^2) ]
      const f2 = 1 + (4 * Math.PI * Math.pow(rad, 3) * press) / (mass * CONSTANTS.c2);
      // Factor 3: [ 1 - 2 * G * M / (r * c^2) ]^(-1)
      const schw = 1 - (2 * CONSTANTS.G * mass) / (rad * CONSTANTS.c2);
      if (schw <= 0.01) {
        // Horizon reached
        return -1e30;
      }
      const f3 = 1 / schw;

      return newtonian * f1 * f2 * f3;
    };

    const dMdr = (rad: number, press: number): number => {
      const rho = this.densityFromPressure(press);
      return 4 * Math.PI * rad * rad * rho;
    };

    let prevR = r;
    let prevP = P;
    let prevM = M;

    for (let step = 0; step < maxSteps; step++) {
      prevR = r;
      prevP = P;
      prevM = M;

      // RK4 integration
      const k1_P = dPdr(r, P, M);
      const k1_M = dMdr(r, P);

      const r_mid = r + 0.5 * dr;
      const P_2 = Math.max(0, P + 0.5 * dr * k1_P);
      const M_2 = M + 0.5 * dr * k1_M;
      const k2_P = dPdr(r_mid, P_2, M_2);
      const k2_M = dMdr(r_mid, P_2);

      const P_3 = Math.max(0, P + 0.5 * dr * k2_P);
      const M_3 = M + 0.5 * dr * k2_M;
      const k3_P = dPdr(r_mid, P_3, M_3);
      const k3_M = dMdr(r_mid, P_3);

      const r_end = r + dr;
      const P_4 = Math.max(0, P + dr * k3_P);
      const M_4 = M + dr * k3_M;
      const k4_P = dPdr(r_end, P_4, M_4);
      const k4_M = dMdr(r_end, P_4);

      r += dr;
      P += (dr / 6) * (k1_P + 2 * k2_P + 2 * k3_P + k4_P);
      M += (dr / 6) * (k1_M + 2 * k2_M + 2 * k3_M + k4_M);

      if (P <= 0 || !isFinite(P)) {
        break;
      }

      if (step % 20 === 0) {
        points.push({
          r,
          pressure: P,
          density: this.densityFromPressure(P),
          enclosedMass: M,
        });
      }
    }

    // Root interpolate to P = 0 surface
    const frac = prevP / (prevP - P);
    const totalRadiusM = prevR + frac * (r - prevR);
    const totalMassKg = prevM + frac * (M - prevM);

    points.push({
      r: totalRadiusM,
      pressure: 0,
      density: 0,
      enclosedMass: totalMassKg,
    });

    const totalMassSolar = totalMassKg / CONSTANTS.M_sun;
    const totalRadiusKm = totalRadiusM / 1000.0;
    const compactness = (CONSTANTS.G * totalMassKg) / (totalRadiusM * CONSTANTS.c2);
    const schwRoot = Math.max(0.001, 1 - 2 * compactness);
    const gravitationalRedshift = 1 / Math.sqrt(schwRoot) - 1;

    return {
      centralDensityKgM3,
      totalMassKg,
      totalMassSolar,
      totalRadiusM,
      totalRadiusKm,
      compactness,
      gravitationalRedshift,
      points,
    };
  }
}
