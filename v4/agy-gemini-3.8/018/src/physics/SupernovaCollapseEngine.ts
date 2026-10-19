import { CONSTANTS } from './PhysicalConstants.js';

export interface IsotopeAbundance {
  element: string;
  symbol: string;
  Z: number; // Atomic number (protons)
  A: number; // Mass number
  massFraction: number; // 0.0 to 1.0
  origin: 'PRIMORDIAL' | 'STELLAR_FUSION' | 'EXPLOSIVE_BURNING' | 'R_PROCESS';
}

export interface SupernovaState {
  isCollapsing: boolean;
  collapseTimeMs: number; // 0 to 150 ms
  bounceOccurred: boolean;
  shockRadiusMeters: number; // Outward blast wave position
  shockVelocityKmS: number;
  neutrinoLuminosityW: number;
  remnantType: 'NEUTRON_STAR' | 'BLACK_HOLE';
  remnantMassSolar: number;
  abundances: IsotopeAbundance[];
}

export class SupernovaCollapseEngine {
  /**
   * Generates baseline pre-supernova massive star isotope abundances (Onion Core)
   */
  public static initialPreSupernovaAbundances(): IsotopeAbundance[] {
    return [
      { element: 'Hydrogen', symbol: '¹H', Z: 1, A: 1, massFraction: 0.52, origin: 'PRIMORDIAL' },
      { element: 'Helium', symbol: '⁴He', Z: 2, A: 4, massFraction: 0.30, origin: 'STELLAR_FUSION' },
      { element: 'Carbon', symbol: '¹²C', Z: 6, A: 12, massFraction: 0.05, origin: 'STELLAR_FUSION' },
      { element: 'Nitrogen', symbol: '¹⁴N', Z: 7, A: 14, massFraction: 0.01, origin: 'STELLAR_FUSION' },
      { element: 'Oxygen', symbol: '¹⁶O', Z: 8, A: 16, massFraction: 0.05, origin: 'STELLAR_FUSION' },
      { element: 'Neon', symbol: '²⁰Ne', Z: 10, A: 20, massFraction: 0.02, origin: 'STELLAR_FUSION' },
      { element: 'Magnesium', symbol: '²⁴Mg', Z: 12, A: 24, massFraction: 0.01, origin: 'STELLAR_FUSION' },
      { element: 'Silicon', symbol: '²⁸Si', Z: 14, A: 28, massFraction: 0.015, origin: 'STELLAR_FUSION' },
      { element: 'Iron', symbol: '⁵⁶Fe', Z: 26, A: 56, massFraction: 0.025, origin: 'STELLAR_FUSION' },
      { element: 'Nickel-56', symbol: '⁵⁶Ni', Z: 28, A: 56, massFraction: 0.00, origin: 'EXPLOSIVE_BURNING' },
      { element: 'Gold', symbol: '¹⁹⁷Au', Z: 79, A: 197, massFraction: 0.00, origin: 'R_PROCESS' },
      { element: 'Uranium', symbol: '²³⁸U', Z: 92, A: 238, massFraction: 0.00, origin: 'R_PROCESS' },
    ];
  }

  /**
   * Advances the core collapse and shock wave breakout by dt seconds
   */
  public static stepCollapse(
    state: SupernovaState,
    initialStellarMassSolar: number,
    dtSeconds: number
  ): SupernovaState {
    if (!state.isCollapsing) return state;

    const nextCollapseTimeMs = state.collapseTimeMs + dtSeconds * 1000;
    const bounceTimeMs = 100.0; // Core bounce occurs at ~100 ms of free fall

    let bounceOccurred = state.bounceOccurred;
    let shockRadius = state.shockRadiusMeters;
    let shockVel = state.shockVelocityKmS;
    let neutrinoL = state.neutrinoLuminosityW;
    const abundances = state.abundances.map(a => ({ ...a }));

    if (nextCollapseTimeMs >= bounceTimeMs && !bounceOccurred) {
      bounceOccurred = true;
      shockRadius = 5e4; // 50 km bounce launch radius
      shockVel = 30000; // 30,000 km/s (~0.1 c) initial shock velocity
      neutrinoL = 1.0e45; // 10^45 W neutrino burst peak
    }

    if (bounceOccurred) {
      // Outward blast wave expands into envelope
      // Sedov-Taylor decelleration
      shockRadius += shockVel * 1000 * dtSeconds;
      shockVel = Math.max(8000, shockVel * Math.pow(0.98, dtSeconds * 10)); // gradual shock deceleration
      neutrinoL = Math.max(1e38, neutrinoL * Math.pow(0.92, dtSeconds * 5));

      // Explosive nucleosynthesis synthesis behind shock
      // 56Ni production from explosive silicon burning: 28Si + 7 alpha -> 56Ni
      const niIdx = abundances.findIndex(a => a.symbol === '⁵⁶Ni');
      const siIdx = abundances.findIndex(a => a.symbol === '²⁸Si');
      if (niIdx >= 0 && siIdx >= 0 && abundances[niIdx].massFraction < 0.04 && abundances[siIdx].massFraction > 0.001) {
        const dNi = Math.min(abundances[siIdx].massFraction - 0.001, 0.005 * dtSeconds);
        abundances[niIdx].massFraction += dNi;
        abundances[siIdx].massFraction -= dNi;
      }

      // r-process synthesis of heavy neutron-rich nuclei from iron-peak seed nuclei
      const feIdx = abundances.findIndex(a => a.symbol === '⁵⁶Fe');
      const auIdx = abundances.findIndex(a => a.symbol === '¹⁹⁷Au');
      const uIdx = abundances.findIndex(a => a.symbol === '²³⁸U');
      if (feIdx >= 0 && abundances[feIdx].massFraction > 0.001) {
        if (auIdx >= 0 && abundances[auIdx].massFraction < 1e-4) {
          const dAu = Math.min(abundances[feIdx].massFraction * 0.5, 2e-5 * dtSeconds);
          abundances[auIdx].massFraction += dAu;
          abundances[feIdx].massFraction -= dAu;
        }
        if (uIdx >= 0 && abundances[uIdx].massFraction < 5e-5) {
          const dU = Math.min(abundances[feIdx].massFraction * 0.5, 1e-5 * dtSeconds);
          abundances[uIdx].massFraction += dU;
          abundances[feIdx].massFraction -= dU;
        }
      }
    }

    // Determine remnant type based on progenitor mass
    const isBlackHole = initialStellarMassSolar >= 25.0;
    const remnantType = isBlackHole ? 'BLACK_HOLE' : 'NEUTRON_STAR';
    const remnantMassSolar = isBlackHole
      ? Math.min(15.0, initialStellarMassSolar * 0.35)
      : Math.min(2.1, 1.2 + initialStellarMassSolar * 0.03);

    return {
      isCollapsing: true,
      collapseTimeMs: nextCollapseTimeMs,
      bounceOccurred,
      shockRadiusMeters: shockRadius,
      shockVelocityKmS: shockVel,
      neutrinoLuminosityW: neutrinoL,
      remnantType,
      remnantMassSolar,
      abundances,
    };
  }
}
