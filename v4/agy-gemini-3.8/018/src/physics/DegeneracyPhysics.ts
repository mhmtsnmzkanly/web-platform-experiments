import { CONSTANTS } from './PhysicalConstants.js';

export class DegeneracyPhysics {
  /**
   * Computes the dimensionless relativity parameter x = p_F / (m_e * c)
   */
  public static relativityParameter(rhoKgM3: number, mu_e: number = 2.0): number {
    const n_e = rhoKgM3 / (mu_e * CONSTANTS.m_u); // number density of electrons (m^-3)
    const p_F = CONSTANTS.hbar * Math.cbrt(3 * Math.PI * Math.PI * n_e);
    return p_F / (CONSTANTS.m_e * CONSTANTS.c);
  }

  /**
   * Dimensionless Fermi-Dirac integral f(x)
   * f(x) = x * (2*x^2 - 3) * sqrt(1 + x^2) + 3 * asinh(x)
   */
  public static fermiIntegral_f(x: number): number {
    if (x <= 0) return 0;
    // For small x (x < 0.05), catastrophic cancellation occurs between
    // x*(2x^2 - 3)*sqrt(1+x^2) and 3*asinh(x) in IEEE 754 arithmetic.
    // High-order Taylor series expansion: f(x) = (8/5)*x^5 * (1 - (5/14)*x^2 + (5/24)*x^4)
    if (x < 0.05) {
      const x2 = x * x;
      return (8 / 5) * Math.pow(x, 5) * (1 - (5 / 14) * x2 + (5 / 24) * x2 * x2);
    }
    return x * (2 * x * x - 3) * Math.sqrt(1 + x * x) + 3 * Math.asinh(x);
  }

  /**
   * Full Fermi-Dirac zero-temperature electron degeneracy pressure
   * P_e = (pi * m_e^4 * c^5 / (3 * h^3)) * f(x)
   */
  public static electronDegeneracyPressure(rhoKgM3: number, mu_e: number = 2.0): number {
    if (rhoKgM3 <= 0) return 0;
    const x = this.relativityParameter(rhoKgM3, mu_e);
    const fx = this.fermiIntegral_f(x);
    const A = (Math.PI * Math.pow(CONSTANTS.m_e, 4) * Math.pow(CONSTANTS.c, 5)) / (3 * Math.pow(CONSTANTS.h, 3));
    return A * fx;
  }

  /**
   * Non-relativistic electron degeneracy constant K1
   * P = K1 * (rho / mu_e)^(5/3)
   */
  public static nonRelativisticConstantK1(): number {
    const factor = (8 * Math.PI / 15) * Math.pow(3 / (8 * Math.PI), 5 / 3);
    const h2_over_me = (CONSTANTS.h * CONSTANTS.h) / CONSTANTS.m_e;
    return factor * h2_over_me * Math.pow(1 / CONSTANTS.m_u, 5 / 3);
  }

  /**
   * Ultra-relativistic electron degeneracy constant K2
   * P = K2 * (rho / mu_e)^(4/3)
   */
  public static ultraRelativisticConstantK2(): number {
    const factor = (2 * Math.PI / 3) * Math.pow(3 / (8 * Math.PI), 4 / 3);
    const hc = CONSTANTS.h * CONSTANTS.c;
    return factor * hc * Math.pow(1 / CONSTANTS.m_u, 4 / 3);
  }

  /**
   * Exact analytical Chandrasekhar Mass Limit derived from fundamental constants and n=3 polytrope
   * M_Ch = 4*pi * [ K2 / (pi*G) ]^(3/2) * omega_3 * (Coulomb lattice factor)
   */
  public static chandrasekharMass(mu_e: number = 2.0, omega_3: number = 2.01824): { massKg: number; massSolar: number } {
    const factor = (2 * Math.PI / 3) * Math.pow(3 / (8 * Math.PI), 4 / 3);
    const K2 = factor * CONSTANTS.h * CONSTANTS.c * Math.pow(1 / (mu_e * CONSTANTS.m_u), 4 / 3);
    const bracket = K2 / (Math.PI * CONSTANTS.G);
    // Standard electrostatic Coulomb lattice correction: Delta ~ 0.98% for carbon-oxygen white dwarfs
    const coulombCorrection = 0.9902;
    const massKg = 4 * Math.PI * Math.pow(bracket, 1.5) * omega_3 * coulombCorrection;
    const massSolar = massKg / CONSTANTS.M_sun;

    return { massKg, massSolar };
  }

  /**
   * Approximate White Dwarf radius for a given mass M <= M_Ch
   * R_WD(M) = R0 * (M / M_sun)^(-1/3) * [ 1 - (M / M_Ch)^(4/3) ]^(1/2)
   */
  public static whiteDwarfRadius(massKg: number, mu_e: number = 2.0): number {
    const { massKg: mChKg } = this.chandrasekharMass(mu_e);
    if (massKg >= mChKg) {
      return 1e4; // Collapsed to neutron star scale (~10 km)
    }

    const massRatioCh = massKg / mChKg;
    const mSolar = massKg / CONSTANTS.M_sun;
    const R0 = 0.0126 * CONSTANTS.R_sun * Math.pow(2.0 / mu_e, 5 / 3);

    const term = Math.max(0, 1 - Math.pow(massRatioCh, 4 / 3));
    return R0 * Math.pow(mSolar, -1 / 3) * Math.sqrt(term);
  }
}
