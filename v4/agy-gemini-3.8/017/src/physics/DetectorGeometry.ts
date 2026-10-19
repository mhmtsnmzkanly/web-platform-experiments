import { Particle, DetectorHit } from '../types';

export interface DetectorDimensions {
  beamPipeRadius: number; // m
  trackerInnerRadius: number; // m
  trackerOuterRadius: number; // m
  ecalInnerRadius: number; // m
  ecalOuterRadius: number; // m
  hcalInnerRadius: number; // m
  hcalOuterRadius: number; // m
  solenoidRadius: number; // m
  muonInnerRadius: number; // m
  muonOuterRadius: number; // m
  lengthHalfZ: number; // m
}

export const DETECTOR_SPECS: DetectorDimensions = {
  beamPipeRadius: 0.04,
  trackerInnerRadius: 0.08,
  trackerOuterRadius: 1.15,
  ecalInnerRadius: 1.25,
  ecalOuterRadius: 1.85,
  hcalInnerRadius: 1.95,
  hcalOuterRadius: 3.15,
  solenoidRadius: 3.40,
  muonInnerRadius: 3.75,
  muonOuterRadius: 6.20,
  lengthHalfZ: 7.50,
};

export class DetectorGeometry {
  /**
   * Propagate a particle through detector layers in an axial magnetic field B
   * Calculates hit locations and track vertices
   */
  public static simulateParticlePassage(
    particle: Particle,
    B: number // Magnetic field in Tesla
  ): DetectorHit[] {
    const hits: DetectorHit[] = [];

    // Invisible particles (neutrinos, dark matter) leave no detector hits
    if (particle.type === 'NEUTRINO' || particle.type === 'DARK_MATTER') {
      return hits;
    }

    const q = particle.charge;
    const pt = particle.pt;
    const phi0 = particle.phi;
    const eta = particle.eta;
    const theta = particle.theta;
    const pz = particle.pz;
    const p = particle.p;

    // Radius of curvature in transverse plane:
    // R = pt / (0.3 * B * |q|) meters
    const effectiveB = Math.max(0.1, B);
    const hasCurvature = Math.abs(q) > 0.01 && pt > 0.05;
    const R_L = hasCurvature ? pt / (0.3 * effectiveB * Math.abs(q)) : 1e9;
    // Bending sign: positive charges bend clockwise, negative counter-clockwise (for B_z > 0)
    const bendSign = q > 0 ? -1 : 1;

    // Center of circle in transverse plane:
    // At t=0, x=0, y=0, heading in direction phi0.
    // Center is perpendicular to initial velocity: (x_c, y_c) = ( -bendSign * R_L * sin(phi0), bendSign * R_L * cos(phi0) )
    const xc = -bendSign * R_L * Math.sin(phi0);
    const yc = bendSign * R_L * Math.cos(phi0);

    // Stop radius depending on particle type
    let stopRadius = DETECTOR_SPECS.muonOuterRadius;
    if (particle.type === 'ELECTRON' || particle.type === 'POSITRON' || particle.type === 'PHOTON') {
      stopRadius = (DETECTOR_SPECS.ecalInnerRadius + DETECTOR_SPECS.ecalOuterRadius) * 0.5;
    } else if (
      particle.type === 'PION_PLUS' ||
      particle.type === 'PION_MINUS' ||
      particle.type === 'PION_ZERO' ||
      particle.type === 'KAON_PLUS' ||
      particle.type === 'KAON_MINUS' ||
      particle.type === 'PROTON' ||
      particle.type === 'ANTIPROTON' ||
      particle.type === 'NEUTRON'
    ) {
      stopRadius = (DETECTOR_SPECS.hcalInnerRadius + DETECTOR_SPECS.hcalOuterRadius) * 0.5;
    } else if (particle.type === 'MUON_MINUS' || particle.type === 'MUON_PLUS') {
      stopRadius = DETECTOR_SPECS.muonOuterRadius;
    }

    // 1. Tracker Hits (only charged particles ionize silicon)
    if (Math.abs(q) > 0.01) {
      const trackerRadii = [0.15, 0.35, 0.60, 0.85, 1.10];
      for (const rTarget of trackerRadii) {
        if (rTarget > stopRadius) break;
        const coords = DetectorGeometry.getPointAtRadius(rTarget, xc, yc, R_L, phi0, bendSign, theta, pz, p);
        if (coords && Math.abs(coords.z) <= DETECTOR_SPECS.lengthHalfZ) {
          hits.push({
            subdetector: 'TRACKER',
            x: coords.x,
            y: coords.y,
            z: coords.z,
            r: rTarget,
            energyDeposit: 0.002, // minimal dE/dx in silicon
            time: (rTarget / 0.3) * 1e-9, // approximate speed of light
          });
        }
      }
    }

    // 2. ECAL Hit
    if (stopRadius >= DETECTOR_SPECS.ecalInnerRadius) {
      const rEcal = (DETECTOR_SPECS.ecalInnerRadius + DETECTOR_SPECS.ecalOuterRadius) * 0.5;
      const coords = DetectorGeometry.getPointAtRadius(rEcal, xc, yc, R_L, phi0, bendSign, theta, pz, p);
      if (coords && Math.abs(coords.z) <= DETECTOR_SPECS.lengthHalfZ) {
        let eDep = 0;
        if (particle.type === 'ELECTRON' || particle.type === 'POSITRON' || particle.type === 'PHOTON') {
          eDep = particle.E * 0.98; // Full EM shower
        } else if (particle.type === 'MUON_MINUS' || particle.type === 'MUON_PLUS') {
          eDep = 0.5; // MIP deposit
        } else {
          eDep = particle.E * 0.15; // Hadronic shower early punch-through
        }
        hits.push({
          subdetector: 'ECAL',
          x: coords.x,
          y: coords.y,
          z: coords.z,
          r: rEcal,
          energyDeposit: eDep,
          time: (rEcal / 0.3) * 1e-9,
        });
      }
    }

    // 3. HCAL Hit
    if (stopRadius >= DETECTOR_SPECS.hcalInnerRadius) {
      const rHcal = (DETECTOR_SPECS.hcalInnerRadius + DETECTOR_SPECS.hcalOuterRadius) * 0.5;
      const coords = DetectorGeometry.getPointAtRadius(rHcal, xc, yc, R_L, phi0, bendSign, theta, pz, p);
      if (coords && Math.abs(coords.z) <= DETECTOR_SPECS.lengthHalfZ) {
        let eDep = 0;
        if (particle.type === 'MUON_MINUS' || particle.type === 'MUON_PLUS') {
          eDep = 1.2; // MIP
        } else {
          eDep = particle.E * 0.85; // Hadronic shower absorption
        }
        hits.push({
          subdetector: 'HCAL',
          x: coords.x,
          y: coords.y,
          z: coords.z,
          r: rHcal,
          energyDeposit: eDep,
          time: (rHcal / 0.3) * 1e-9,
        });
      }
    }

    // 4. Muon Spectrometer Hits
    if (stopRadius >= DETECTOR_SPECS.muonInnerRadius && (particle.type === 'MUON_MINUS' || particle.type === 'MUON_PLUS')) {
      const muonRadii = [4.2, 5.1, 6.0];
      for (const rMuon of muonRadii) {
        const coords = DetectorGeometry.getPointAtRadius(rMuon, xc, yc, R_L, phi0, bendSign, theta, pz, p);
        if (coords && Math.abs(coords.z) <= DETECTOR_SPECS.lengthHalfZ) {
          hits.push({
            subdetector: 'MUON',
            x: coords.x,
            y: coords.y,
            z: coords.z,
            r: rMuon,
            energyDeposit: 0.8,
            time: (rMuon / 0.3) * 1e-9,
          });
        }
      }
    }

    return hits;
  }

  /**
   * Helper to find (x, y, z) coordinate where trajectory reaches radial distance rTarget
   */
  public static getPointAtRadius(
    rTarget: number,
    xc: number,
    yc: number,
    R_L: number,
    phi0: number,
    bendSign: number,
    theta: number,
    pz: number,
    p: number
  ): { x: number; y: number; z: number } | null {
    if (R_L > 1e6) {
      // Straight line
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      const x = rTarget * Math.cos(phi0);
      const y = rTarget * Math.sin(phi0);
      const s = sinTheta > 1e-4 ? rTarget / sinTheta : rTarget;
      const z = s * cosTheta;
      return { x, y, z };
    }

    // Circular arc intersection with circle r = rTarget centered at origin:
    // (x - xc)^2 + (y - yc)^2 = R_L^2
    // x^2 + y^2 = rTarget^2
    // Distance between centers d = sqrt(xc^2 + yc^2) = R_L
    // cos(alpha) = (d^2 + rTarget^2 - R_L^2) / (2 * d * rTarget) = rTarget / (2 * R_L)
    const ratio = rTarget / (2 * R_L);
    if (ratio > 1.0) {
      // Particle curls before reaching radius rTarget
      return null;
    }

    const arcAngle = 2 * Math.asin(ratio); // angle turned in radians
    const alpha0 = Math.atan2(-yc, -xc);
    const alpha = alpha0 + bendSign * arcAngle;

    // Transverse coordinates
    const x = xc + R_L * Math.cos(alpha);
    const y = yc + R_L * Math.sin(alpha);

    // Longitudinal coordinate z:
    // Path length in transverse plane s_T = R_L * arcAngle
    // z = s_T * (pz / pt) = s_T / tan(theta)
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    const s_T = R_L * arcAngle;
    const z = sinTheta > 1e-4 ? (s_T * cosTheta) / sinTheta : s_T;

    return { x, y, z };
  }

  /**
   * Generate points along trajectory for Canvas rendering
   */
  public static calculateTrackPoints(
    particle: Particle,
    B: number,
    maxRadius: number = 6.2,
    numSteps: number = 40
  ): { x: number; y: number; z: number; r: number }[] {
    const points: { x: number; y: number; z: number; r: number }[] = [];
    points.push({ x: 0, y: 0, z: 0, r: 0 });

    if (particle.type === 'NEUTRINO' || particle.type === 'DARK_MATTER') {
      return points;
    }

    const q = particle.charge;
    const pt = particle.pt;
    const phi0 = particle.phi;
    const theta = particle.theta;
    const pz = particle.pz;
    const p = particle.p;

    const effectiveB = Math.max(0.1, B);
    const hasCurvature = Math.abs(q) > 0.01 && pt > 0.05;
    const R_L = hasCurvature ? pt / (0.3 * effectiveB * Math.abs(q)) : 1e9;
    const bendSign = q > 0 ? -1 : 1;

    const xc = -bendSign * R_L * Math.sin(phi0);
    const yc = bendSign * R_L * Math.cos(phi0);

    // Determine stop radius
    let stopR = maxRadius;
    if (particle.type === 'ELECTRON' || particle.type === 'POSITRON' || particle.type === 'PHOTON') {
      stopR = (DETECTOR_SPECS.ecalInnerRadius + DETECTOR_SPECS.ecalOuterRadius) * 0.5;
    } else if (
      particle.type === 'PION_PLUS' ||
      particle.type === 'PION_MINUS' ||
      particle.type === 'PION_ZERO' ||
      particle.type === 'KAON_PLUS' ||
      particle.type === 'KAON_MINUS' ||
      particle.type === 'PROTON' ||
      particle.type === 'ANTIPROTON' ||
      particle.type === 'NEUTRON'
    ) {
      stopR = (DETECTOR_SPECS.hcalInnerRadius + DETECTOR_SPECS.hcalOuterRadius) * 0.5;
    }

    // Maximum physically reachable radius before circling back
    const maxReachableR = Math.min(stopR, 2 * R_L * 0.99);

    for (let i = 1; i <= numSteps; i++) {
      const frac = i / numSteps;
      const r = maxReachableR * frac;
      const ptCoords = DetectorGeometry.getPointAtRadius(r, xc, yc, R_L, phi0, bendSign, theta, pz, p);
      if (ptCoords) {
        if (Math.abs(ptCoords.z) > DETECTOR_SPECS.lengthHalfZ) break;
        points.push({ ...ptCoords, r });
      } else {
        break;
      }
    }

    return points;
  }
}
