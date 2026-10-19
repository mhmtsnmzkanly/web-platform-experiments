export interface FourVector {
  E: number;
  px: number;
  py: number;
  pz: number;
}

export class RelativisticKinematics {
  /**
   * Calculate invariant mass M = sqrt(E^2 - |p|^2)
   */
  public static invariantMass(v: FourVector): number {
    const p2 = v.px * v.px + v.py * v.py + v.pz * v.pz;
    const m2 = v.E * v.E - p2;
    return m2 > 0 ? Math.sqrt(m2) : 0;
  }

  /**
   * Sum multiple 4-vectors
   */
  public static addFourVectors(vectors: FourVector[]): FourVector {
    let E = 0, px = 0, py = 0, pz = 0;
    for (const v of vectors) {
      E += v.E;
      px += v.px;
      py += v.py;
      pz += v.pz;
    }
    return { E, px, py, pz };
  }

  /**
   * Transverse momentum pT = sqrt(px^2 + py^2)
   */
  public static pt(px: number, py: number): number {
    return Math.hypot(px, py);
  }

  /**
   * Total momentum p = sqrt(px^2 + py^2 + pz^2)
   */
  public static p(px: number, py: number, pz: number): number {
    return Math.hypot(px, py, pz);
  }

  /**
   * Azimuthal angle phi in [-pi, pi]
   */
  public static phi(px: number, py: number): number {
    return Math.atan2(py, px);
  }

  /**
   * Polar angle theta in [0, pi]
   */
  public static theta(px: number, py: number, pz: number): number {
    const ptVal = Math.hypot(px, py);
    return Math.atan2(ptVal, pz);
  }

  /**
   * Pseudorapidity eta = -ln(tan(theta / 2))
   * Clamped to [-6, 6] for numerical stability
   */
  public static eta(px: number, py: number, pz: number): number {
    const ptVal = Math.hypot(px, py);
    if (ptVal < 1e-6) {
      return pz >= 0 ? 6.0 : -6.0;
    }
    const thetaVal = Math.atan2(ptVal, pz);
    const halfTheta = Math.max(1e-6, Math.min(Math.PI - 1e-6, thetaVal / 2));
    const rawEta = -Math.log(Math.tan(halfTheta));
    return Math.max(-6.0, Math.min(6.0, rawEta));
  }

  /**
   * Delta phi between two azimuthal angles wrapped in [-pi, pi]
   */
  public static deltaPhi(phi1: number, phi2: number): number {
    let dPhi = phi1 - phi2;
    while (dPhi > Math.PI) dPhi -= 2 * Math.PI;
    while (dPhi < -Math.PI) dPhi += 2 * Math.PI;
    return dPhi;
  }

  /**
   * Angular separation Delta R = sqrt(DeltaEta^2 + DeltaPhi^2)
   */
  public static deltaR(eta1: number, phi1: number, eta2: number, phi2: number): number {
    const dEta = eta1 - eta2;
    const dPhi = RelativisticKinematics.deltaPhi(phi1, phi2);
    return Math.hypot(dEta, dPhi);
  }

  /**
   * Sample from relativistic Breit-Wigner distribution
   */
  public static sampleBreitWigner(m0: number, gamma: number, minM: number, maxM: number): number {
    // Inverse CDF: m = m0 + (gamma / 2) * tan(pi * (u - 0.5))
    // Re-sample if out of physical bounds
    for (let attempts = 0; attempts < 20; attempts++) {
      const u = Math.random();
      const m = m0 + 0.5 * gamma * Math.tan(Math.PI * (u - 0.5));
      if (m >= minM && m <= maxM) {
        return m;
      }
    }
    return m0;
  }

  /**
   * Generate 2-body decay in parent rest frame and boost into lab frame
   */
  public static twoBodyDecay(
    parent: FourVector,
    m1: number,
    m2: number
  ): [FourVector, FourVector] {
    const M = RelativisticKinematics.invariantMass(parent);
    if (M <= m1 + m2 + 1e-4) {
      // Degenerate fallback
      const halfE = parent.E * 0.5;
      const v1: FourVector = { E: halfE, px: parent.px * 0.5, py: parent.py * 0.5, pz: parent.pz * 0.5 };
      const v2: FourVector = { E: halfE, px: parent.px * 0.5, py: parent.py * 0.5, pz: parent.pz * 0.5 };
      return [v1, v2];
    }

    // Momentum in parent rest frame:
    // p* = sqrt((M^2 - (m1+m2)^2) * (M^2 - (m1-m2)^2)) / (2*M)
    const term1 = M * M - (m1 + m2) * (m1 + m2);
    const term2 = M * M - (m1 - m2) * (m1 - m2);
    const pStar = Math.sqrt(Math.max(0, term1 * term2)) / (2 * M);

    const E1Star = Math.sqrt(pStar * pStar + m1 * m1);
    const E2Star = Math.sqrt(pStar * pStar + m2 * m2);

    // Random isotropic angles in rest frame
    const cosTheta = 2 * Math.random() - 1;
    const sinTheta = Math.sqrt(Math.max(0, 1 - cosTheta * cosTheta));
    const phi = (2 * Math.random() - 1) * Math.PI;

    const pStarX = pStar * sinTheta * Math.cos(phi);
    const pStarY = pStar * sinTheta * Math.sin(phi);
    const pStarZ = pStar * cosTheta;

    const rf1: FourVector = { E: E1Star, px: pStarX, py: pStarY, pz: pStarZ };
    const rf2: FourVector = { E: E2Star, px: -pStarX, py: -pStarY, pz: -pStarZ };

    // Lorentz boost from parent rest frame to lab frame
    // Boost velocity beta = p / E
    const betaX = parent.px / parent.E;
    const betaY = parent.py / parent.E;
    const betaZ = parent.pz / parent.E;
    const beta2 = betaX * betaX + betaY * betaY + betaZ * betaZ;

    if (beta2 < 1e-8) {
      return [rf1, rf2];
    }

    const gamma = 1 / Math.sqrt(Math.max(1e-6, 1 - beta2));

    const boost = (v: FourVector): FourVector => {
      const bDotP = betaX * v.px + betaY * v.py + betaZ * v.pz;
      const factor = (gamma - 1) / beta2;
      return {
        E: gamma * (v.E + bDotP),
        px: v.px + factor * bDotP * betaX + gamma * betaX * v.E,
        py: v.py + factor * bDotP * betaY + gamma * betaY * v.E,
        pz: v.pz + factor * bDotP * betaZ + gamma * betaZ * v.E,
      };
    };

    return [boost(rf1), boost(rf2)];
  }

  /**
   * Calculate Transverse Mass MT for W -> l + nu:
   * MT = sqrt(2 * pt_l * pt_miss * (1 - cos(deltaPhi)))
   */
  public static transverseMass(ptLepton: number, ptMiss: number, deltaPhi: number): number {
    return Math.sqrt(Math.max(0, 2 * ptLepton * ptMiss * (1 - Math.cos(deltaPhi))));
  }
}
