import { CONSTANTS } from './PhysicalConstants.js';

export interface NuclearEmissivityResult {
  epsilon_pp: number; // W/kg
  epsilon_cno: number; // W/kg
  epsilon_3alpha: number; // W/kg
  epsilon_advanced: number; // W/kg (Carbon/Oxygen/Silicon burning)
  epsilon_total: number; // W/kg
  dominantProcess: 'PP_CHAIN' | 'CNO_CYCLE' | 'TRIPLE_ALPHA' | 'ADVANCED_SHELL' | 'INERT';
}

export class NuclearKinetics {
  /**
   * Computes thermonuclear energy generation rate per unit mass (W/kg)
   * @param rho Density in kg/m^3
   * @param T Temperature in Kelvin
   * @param X Hydrogen mass fraction (0 to 1)
   * @param Y Helium mass fraction (0 to 1)
   * @param Z Metal mass fraction (0 to 1)
   */
  public static computeEmissivity(
    rho: number,
    T: number,
    X: number = 0.73,
    Y: number = 0.25,
    Z: number = 0.02
  ): NuclearEmissivityResult {
    if (rho <= 0 || T <= 1e5) {
      return {
        epsilon_pp: 0,
        epsilon_cno: 0,
        epsilon_3alpha: 0,
        epsilon_advanced: 0,
        epsilon_total: 0,
        dominantProcess: 'INERT',
      };
    }

    const T6 = T / 1e6; // Temperature in millions of Kelvin
    const T8 = T / 1e8; // Temperature in hundreds of millions of Kelvin
    const T9 = T / 1e9; // Temperature in billions of Kelvin

    // 1. Proton-Proton Chain
    let eps_pp = 0;
    if (X > 0.001 && T6 >= 4.0) {
      // Calibrated to solar core rate eps_pp = 1.5e-3 W/kg at T = 1.5e7 K, rho = 1.5e5 kg/m^3, X = 0.73
      const T_ratio = T6 / 15.0;
      eps_pp = 1.5e-3 * (rho / 1.5e5) * Math.pow(X / 0.73, 2) * Math.pow(T_ratio, 4.0);
      if (!isFinite(eps_pp) || eps_pp < 0) eps_pp = 0;
    }

    // 2. CNO Cycle
    let eps_cno = 0;
    const X_CNO = Z * 0.7; // ~70% of metals in Population I stars are C, N, O
    if (X > 0.001 && X_CNO > 1e-5 && T6 >= 8.0) {
      // Calibrated CNO rate: eps_cno = 1.5e-4 W/kg at 15 MK (10% of pp), crossing over at 18 MK with T^16.7
      const T_ratio = T6 / 15.0;
      eps_cno = 1.5e-4 * (rho / 1.5e5) * (X / 0.73) * (X_CNO / 0.014) * Math.pow(T_ratio, 16.7);
      if (!isFinite(eps_cno) || eps_cno < 0) eps_cno = 0;
    }

    // 3. Triple-Alpha Process (He burning: 3 * 4He -> 12C)
    let eps_3a = 0;
    if (Y > 0.01 && T8 >= 0.8) {
      // Calibrated triple-alpha rate: steep ignition at T ~ 1e8 K, scaling as T^40 near 100 MK
      const T8_ratio = T8 / 1.0;
      eps_3a = 1.0e-1 * Math.pow(rho / 1.0e7, 2) * Math.pow(Y / 0.98, 3) * Math.pow(T8_ratio, 30.0);
      if (!isFinite(eps_3a) || eps_3a < 0) eps_3a = 0;
    }

    // 4. Advanced Burning Shells (Carbon, Neon, Oxygen, Silicon)
    let eps_adv = 0;
    if (T9 >= 0.5) {
      // Carbon burning: T9 ~ 0.5 - 1.0
      const eps_C = 1.0e10 * Math.pow(rho / 1e8, 1) * Math.pow(T9 / 0.8, 25);
      // Oxygen & Silicon burning: T9 > 1.5
      const eps_Si = T9 >= 2.0 ? 1.0e15 * Math.pow(rho / 1e9, 1) * Math.pow(T9 / 3.0, 35) : 0;
      eps_adv = eps_C + eps_Si;
      if (!isFinite(eps_adv)) eps_adv = 1e20;
    }

    const eps_total = eps_pp + eps_cno + eps_3a + eps_adv;

    let dominantProcess: 'PP_CHAIN' | 'CNO_CYCLE' | 'TRIPLE_ALPHA' | 'ADVANCED_SHELL' | 'INERT' = 'INERT';
    if (eps_total > 1e-6) {
      if (eps_adv > eps_pp && eps_adv > eps_cno && eps_adv > eps_3a) {
        dominantProcess = 'ADVANCED_SHELL';
      } else if (eps_3a > eps_pp && eps_3a > eps_cno) {
        dominantProcess = 'TRIPLE_ALPHA';
      } else if (eps_cno > eps_pp) {
        dominantProcess = 'CNO_CYCLE';
      } else {
        dominantProcess = 'PP_CHAIN';
      }
    }

    return {
      epsilon_pp: eps_pp,
      epsilon_cno: eps_cno,
      epsilon_3alpha: eps_3a,
      epsilon_advanced: eps_adv,
      epsilon_total: eps_total,
      dominantProcess,
    };
  }

  /**
   * Numerically integrates total stellar luminosity L = Integral(4 * pi * r^2 * rho * epsilon dr)
   */
  public static integrateLuminosity(
    profilePoints: { r: number; rho: number; temperature: number }[],
    X: number = 0.73,
    Y: number = 0.25,
    Z: number = 0.02
  ): { totalLuminosityW: number; luminosityRatioSun: number; emissivities: NuclearEmissivityResult[] } {
    let totalL = 0;
    const emissivities: NuclearEmissivityResult[] = [];

    for (let i = 0; i < profilePoints.length; i++) {
      const pt = profilePoints[i];
      const em = this.computeEmissivity(pt.rho, pt.temperature, X, Y, Z);
      emissivities.push(em);

      if (i > 0) {
        const prevPt = profilePoints[i - 1];
        const dr = pt.r - prevPt.r;
        const midR = (pt.r + prevPt.r) * 0.5;
        const midRho = (pt.rho + prevPt.rho) * 0.5;
        const midEps = (em.epsilon_total + emissivities[i - 1].epsilon_total) * 0.5;

        // Shell mass dM = 4 * pi * r^2 * rho * dr
        const dM = 4 * Math.PI * midR * midR * midRho * dr;
        // Shell luminosity dL = dM * epsilon
        totalL += dM * midEps;
      }
    }

    const luminosityRatioSun = totalL / CONSTANTS.L_sun;

    return {
      totalLuminosityW: totalL,
      luminosityRatioSun,
      emissivities,
    };
  }
}
