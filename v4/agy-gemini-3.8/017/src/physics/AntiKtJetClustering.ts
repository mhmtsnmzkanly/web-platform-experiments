import { Particle, Jet } from '../types';
import { RelativisticKinematics } from './RelativisticKinematics';

interface PseudoJet {
  id: string;
  px: number;
  py: number;
  pz: number;
  E: number;
  pt: number;
  eta: number;
  phi: number;
  constituentIds: string[];
}

export class AntiKtJetClustering {
  /**
   * Run the anti-kt jet clustering algorithm (p = -1) on a collection of particles
   * @param particles Input particles (typically hadrons, photons, electrons above threshold)
   * @param R Jet radius parameter (e.g. 0.4)
   * @param minPt Minimum transverse momentum for output jets (e.g. 15 GeV)
   */
  public static clusterJets(
    particles: Particle[],
    R: number = 0.4,
    minPt: number = 15.0
  ): Jet[] {
    // Filter input particles to hadrons and neutral particles (excluding muons, neutrinos, dark matter)
    const candidates: PseudoJet[] = [];

    for (const p of particles) {
      if (
        p.type === 'NEUTRINO' ||
        p.type === 'DARK_MATTER' ||
        p.type === 'MUON_MINUS' ||
        p.type === 'MUON_PLUS'
      ) {
        continue;
      }

      if (p.pt < 0.5) continue; // Minimum threshold for calorimeter input

      candidates.push({
        id: p.id,
        px: p.px,
        py: p.py,
        pz: p.pz,
        E: p.E,
        pt: p.pt,
        eta: p.eta,
        phi: p.phi,
        constituentIds: [p.id],
      });
    }

    if (candidates.length === 0) return [];

    const finalJets: Jet[] = [];
    const R2 = Math.max(0.01, R * R);

    // Iterative clustering loop
    while (candidates.length > 0) {
      let minDistance = Infinity;
      let minI = -1;
      let minJ = -1;
      let isBeam = false;

      // 1. Calculate distances d_ij and d_iB
      for (let i = 0; i < candidates.length; i++) {
        const pi = candidates[i];
        const invPt2_i = 1.0 / Math.max(0.1, pi.pt * pi.pt);

        // Beam distance: d_iB = 1 / pt_i^2
        if (invPt2_i < minDistance) {
          minDistance = invPt2_i;
          minI = i;
          minJ = -1;
          isBeam = true;
        }

        // Pair distance: d_ij = min(1/pt_i^2, 1/pt_j^2) * (DeltaR_ij^2 / R^2)
        for (let j = i + 1; j < candidates.length; j++) {
          const pj = candidates[j];
          const invPt2_j = 1.0 / Math.max(0.1, pj.pt * pj.pt);
          const minInvPt2 = Math.min(invPt2_i, invPt2_j);

          const deltaR2 = Math.pow(RelativisticKinematics.deltaR(pi.eta, pi.phi, pj.eta, pj.phi), 2);
          const dij = minInvPt2 * (deltaR2 / R2);

          if (dij < minDistance) {
            minDistance = dij;
            minI = i;
            minJ = j;
            isBeam = false;
          }
        }
      }

      if (isBeam || minJ === -1) {
        // Entity i is a final jet
        const finished = candidates[minI];
        candidates.splice(minI, 1);

        if (finished.pt >= minPt) {
          const mass = RelativisticKinematics.invariantMass(finished);
          finalJets.push({
            id: `jet-${finalJets.length + 1}-${finished.id}`,
            px: finished.px,
            py: finished.py,
            pz: finished.pz,
            E: finished.E,
            pt: finished.pt,
            eta: finished.eta,
            phi: finished.phi,
            mass,
            coneRadius: R,
            constituentIds: finished.constituentIds,
          });
        }
      } else {
        // Merge i and j using 4-vector addition
        const pi = candidates[minI];
        const pj = candidates[minJ];

        const mergedE = pi.E + pj.E;
        const mergedPx = pi.px + pj.px;
        const mergedPy = pi.py + pj.py;
        const mergedPz = pi.pz + pj.pz;

        const mergedPt = RelativisticKinematics.pt(mergedPx, mergedPy);
        const mergedEta = RelativisticKinematics.eta(mergedPx, mergedPy, mergedPz);
        const mergedPhi = RelativisticKinematics.phi(mergedPx, mergedPy);

        const merged: PseudoJet = {
          id: `${pi.id}+${pj.id}`,
          px: mergedPx,
          py: mergedPy,
          pz: mergedPz,
          E: mergedE,
          pt: mergedPt,
          eta: mergedEta,
          phi: mergedPhi,
          constituentIds: [...pi.constituentIds, ...pj.constituentIds],
        };

        // Remove j first (larger index), then i
        candidates.splice(minJ, 1);
        candidates.splice(minI, 1);
        candidates.push(merged);
      }
    }

    // Sort jets descending by transverse momentum
    finalJets.sort((a, b) => b.pt - a.pt);

    return finalJets;
  }
}
