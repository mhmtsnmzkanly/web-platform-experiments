import {
  ColliderPresetId,
  CollisionEvent,
  Particle,
  ParticleType,
  ReconstructedMass,
} from '../types';
import { RelativisticKinematics, FourVector } from './RelativisticKinematics';
import { DetectorGeometry } from './DetectorGeometry';
import { AntiKtJetClustering } from './AntiKtJetClustering';

export class CollisionGenerator {
  private static eventCounter = 1001;

  public static generateEvent(
    preset: ColliderPresetId,
    sqrtsTeV: number,
    magneticFieldB: number,
    jetRadiusR: number = 0.4
  ): CollisionEvent {
    this.eventCounter++;
    const eventId = this.eventCounter;
    const runId = 328000 + Math.floor(eventId / 100);
    const timestamp = Date.now();

    const allParticles: Particle[] = [];
    const reconstructedMasses: ReconstructedMass[] = [];

    let processName = '';

    switch (preset) {
      case 'HIGGS_DIPHOTON':
        processName = 'pp → H → γγ + X';
        this.generateHiggsDiphoton(allParticles, reconstructedMasses, sqrtsTeV);
        break;

      case 'HIGGS_FOUR_LEPTON':
        processName = 'pp → H → ZZ* → 4ℓ + X';
        this.generateHiggsFourLepton(allParticles, reconstructedMasses, sqrtsTeV);
        break;

      case 'Z_BOSON_DIMUON':
        processName = 'pp → Z⁰ → μ⁺μ⁻ + X';
        this.generateZBosonDimuon(allParticles, reconstructedMasses, sqrtsTeV);
        break;

      case 'TOP_QUARK_PAIR':
        processName = 'pp → tt̄ → (bW⁺)(b̄W⁻) → bℓν + b̄qq̄';
        this.generateTopPair(allParticles, reconstructedMasses, sqrtsTeV);
        break;

      case 'DARK_MATTER_MONOJET':
        processName = 'pp → χ̃₁⁰χ̃₁⁰ + g (Monojet)';
        this.generateDarkMatterMonojet(allParticles, reconstructedMasses, sqrtsTeV);
        break;

      case 'QCD_DIJET_HARD_SCATTERING':
      default:
        processName = 'pp → Dijet Hard QCD Scattering';
        this.generateQcdDijet(allParticles, reconstructedMasses, sqrtsTeV);
        break;
    }

    // Add soft underlying event particles (pileup / beam remnants)
    this.generateUnderlyingEvent(allParticles, sqrtsTeV);

    // Compute detector hits for all particles in the axial magnetic field
    for (const p of allParticles) {
      p.detectorHits = DetectorGeometry.simulateParticlePassage(p, magneticFieldB);
    }

    // Filter visible particles
    const visibleParticles = allParticles.filter(
      p => p.type !== 'NEUTRINO' && p.type !== 'DARK_MATTER'
    );

    // Run anti-kt jet clustering
    const jets = AntiKtJetClustering.clusterJets(visibleParticles, jetRadiusR, 15.0);

    // Calculate missing transverse energy (MET)
    let sumPx = 0;
    let sumPy = 0;
    let totalScalarET = 0;

    for (const p of visibleParticles) {
      sumPx += p.px;
      sumPy += p.py;
      totalScalarET += p.pt;
    }

    const metPx = -sumPx;
    const metPy = -sumPy;
    const metMag = Math.hypot(metPx, metPy);
    const metPhi = Math.atan2(metPy, metPx);

    return {
      eventId,
      runId,
      timestamp,
      sqrts: sqrtsTeV,
      processName,
      processKey: preset,
      allParticles,
      visibleParticles,
      jets,
      missingET: {
        mag: metMag,
        phi: metPhi,
        px: metPx,
        py: metPy,
      },
      totalScalarET,
      reconstructedMasses,
    };
  }

  // --- Process Generators ---

  private static generateHiggsDiphoton(
    particles: Particle[],
    reco: ReconstructedMass[],
    sqrts: number
  ) {
    // Sample Higgs mass around 125.1 GeV with detector resolution smearing ~1.5%
    const trueMass = 125.1;
    const smearedMass = trueMass + (Math.random() - 0.5) * 2.8;

    // Small transverse boost from initial state radiation
    const isrPt = 5 + Math.random() * 25;
    const isrPhi = (Math.random() * 2 - 1) * Math.PI;
    const higgsEta = (Math.random() - 0.5) * 1.5;

    const higgsPt = isrPt;
    const higgsPx = -higgsPt * Math.cos(isrPhi);
    const higgsPy = -higgsPt * Math.sin(isrPhi);
    const higgsTheta = 2 * Math.atan(Math.exp(-higgsEta));
    const higgsPz = Math.hypot(higgsPx, higgsPy) / Math.tan(higgsTheta);
    const higgsE = Math.sqrt(smearedMass * smearedMass + higgsPx * higgsPx + higgsPy * higgsPy + higgsPz * higgsPz);

    const higgsVec: FourVector = { E: higgsE, px: higgsPx, py: higgsPy, pz: higgsPz };

    // Decay H -> gamma gamma (massless photons)
    const [gamma1, gamma2] = RelativisticKinematics.twoBodyDecay(higgsVec, 0, 0);

    const p1 = this.createParticle('PHOTON', 'Photon (γ₁)', 'γ', 0, 0, gamma1, 'H → γγ', '#f59e0b');
    const p2 = this.createParticle('PHOTON', 'Photon (γ₂)', 'γ', 0, 0, gamma2, 'H → γγ', '#f59e0b');

    particles.push(p1, p2);

    const recoMass = RelativisticKinematics.invariantMass(
      RelativisticKinematics.addFourVectors([gamma1, gamma2])
    );

    reco.push({
      label: `M(γγ) = ${recoMass.toFixed(2)} GeV`,
      mass: recoMass,
      constituents: [p1.id, p2.id],
      resonanceTarget: 'HIGGS',
    });

    // Add recoil ISR gluon jet
    this.createJetShower(particles, isrPt, isrPhi, -higgsEta * 0.8, 'ISR Gluon Jet');
  }

  private static generateHiggsFourLepton(
    particles: Particle[],
    reco: ReconstructedMass[],
    sqrts: number
  ) {
    const trueMass = 125.1;
    const smearedMass = trueMass + (Math.random() - 0.5) * 2.0;

    const higgsEta = (Math.random() - 0.5) * 1.2;
    const higgsPt = 8 + Math.random() * 20;
    const higgsPhi = (Math.random() * 2 - 1) * Math.PI;
    const higgsTheta = 2 * Math.atan(Math.exp(-higgsEta));
    const higgsPz = higgsPt / Math.tan(higgsTheta);
    const higgsE = Math.sqrt(smearedMass * smearedMass + higgsPt * higgsPt + higgsPz * higgsPz);
    const higgsVec: FourVector = {
      E: higgsE,
      px: higgsPt * Math.cos(higgsPhi),
      py: higgsPt * Math.sin(higgsPhi),
      pz: higgsPz,
    };

    // H -> Z1 (on shell ~91.2 GeV) + Z2* (off shell ~30 GeV)
    const mZ1 = RelativisticKinematics.sampleBreitWigner(91.2, 2.5, 86, 96);
    const mZ2 = Math.max(12, smearedMass - mZ1 - 0.5);

    const [z1Vec, z2Vec] = RelativisticKinematics.twoBodyDecay(higgsVec, mZ1, mZ2);

    // Z1 -> mu+ mu-
    const [muPlus, muMinus] = RelativisticKinematics.twoBodyDecay(z1Vec, 0.1056, 0.1056);
    const pMuP = this.createParticle('MUON_PLUS', 'Muon (μ⁺₁)', 'μ⁺', +1, 0.1056, muPlus, 'Z₁ → μ⁺μ⁻', '#06b6d4');
    const pMuM = this.createParticle('MUON_MINUS', 'Muon (μ⁻₁)', 'μ⁻', -1, 0.1056, muMinus, 'Z₁ → μ⁺μ⁻', '#06b6d4');

    // Z2* -> e+ e-
    const [ePlus, eMinus] = RelativisticKinematics.twoBodyDecay(z2Vec, 0.000511, 0.000511);
    const pEP = this.createParticle('POSITRON', 'Positron (e⁺₂)', 'e⁺', +1, 0.000511, ePlus, 'Z₂* → e⁺e⁻', '#38bdf8');
    const pEM = this.createParticle('ELECTRON', 'Electron (e⁻₂)', 'e⁻', -1, 0.000511, eMinus, 'Z₂* → e⁺e⁻', '#38bdf8');

    particles.push(pMuP, pMuM, pEP, pEM);

    const mZ1Reco = RelativisticKinematics.invariantMass(
      RelativisticKinematics.addFourVectors([muPlus, muMinus])
    );
    const m4lReco = RelativisticKinematics.invariantMass(
      RelativisticKinematics.addFourVectors([muPlus, muMinus, ePlus, eMinus])
    );

    reco.push({
      label: `M(Z₁) = ${mZ1Reco.toFixed(2)} GeV`,
      mass: mZ1Reco,
      constituents: [pMuP.id, pMuM.id],
      resonanceTarget: 'Z_BOSON',
    });

    reco.push({
      label: `M(4ℓ) = ${m4lReco.toFixed(2)} GeV`,
      mass: m4lReco,
      constituents: [pMuP.id, pMuM.id, pEP.id, pEM.id],
      resonanceTarget: 'HIGGS',
    });
  }

  private static generateZBosonDimuon(
    particles: Particle[],
    reco: ReconstructedMass[],
    sqrts: number
  ) {
    const mZ = RelativisticKinematics.sampleBreitWigner(91.1876, 2.495, 75, 110);
    const zPt = 10 + Math.random() * 35;
    const zPhi = (Math.random() * 2 - 1) * Math.PI;
    const zEta = (Math.random() - 0.5) * 2.0;
    const zTheta = 2 * Math.atan(Math.exp(-zEta));
    const zPz = zPt / Math.tan(zTheta);
    const zE = Math.sqrt(mZ * mZ + zPt * zPt + zPz * zPz);

    const zVec: FourVector = {
      E: zE,
      px: zPt * Math.cos(zPhi),
      py: zPt * Math.sin(zPhi),
      pz: zPz,
    };

    const [muPlus, muMinus] = RelativisticKinematics.twoBodyDecay(zVec, 0.1056, 0.1056);
    const pMuP = this.createParticle('MUON_PLUS', 'Muon (μ⁺)', 'μ⁺', +1, 0.1056, muPlus, 'Z → μ⁺μ⁻', '#10b981');
    const pMuM = this.createParticle('MUON_MINUS', 'Muon (μ⁻)', 'μ⁻', -1, 0.1056, muMinus, 'Z → μ⁺μ⁻', '#10b981');

    particles.push(pMuP, pMuM);

    const mDimuon = RelativisticKinematics.invariantMass(
      RelativisticKinematics.addFourVectors([muPlus, muMinus])
    );

    reco.push({
      label: `M(μ⁺μ⁻) = ${mDimuon.toFixed(2)} GeV`,
      mass: mDimuon,
      constituents: [pMuP.id, pMuM.id],
      resonanceTarget: 'Z_BOSON',
    });

    // Add recoil gluon jet
    this.createJetShower(particles, zPt, zPhi + Math.PI, -zEta * 0.5, 'Recoil Jet');
  }

  private static generateTopPair(
    particles: Particle[],
    reco: ReconstructedMass[],
    sqrts: number
  ) {
    const mt1 = RelativisticKinematics.sampleBreitWigner(172.8, 1.4, 165, 180);
    const mt2 = RelativisticKinematics.sampleBreitWigner(172.8, 1.4, 165, 180);

    const ttPhi = (Math.random() * 2 - 1) * Math.PI;
    const ttPt = 60 + Math.random() * 120;

    // Top 1: semileptonic t -> b + W+ -> b + mu+ + nu
    const b1Pt = ttPt * (0.4 + Math.random() * 0.2);
    const b1Phi = ttPhi + (Math.random() - 0.5) * 0.4;
    const b1Eta = (Math.random() - 0.5) * 1.5;
    const b1Four = this.createFourVector(b1Pt, b1Phi, b1Eta, 4.18);
    const b1Particle = this.createParticle('BOTTOM', 'b-quark Jet 1', 'b₁', -1 / 3, 4.18, b1Four, 't → bW⁺', '#ec4899');
    particles.push(b1Particle);
    this.createJetShower(particles, b1Pt * 0.6, b1Phi, b1Eta, 'b-jet 1 fragments');

    // W+ -> mu+ + nu
    const mW1 = RelativisticKinematics.sampleBreitWigner(80.379, 2.085, 75, 85);
    const w1Pt = ttPt * 0.7;
    const w1Phi = ttPhi + 0.3;
    const w1Eta = b1Eta + (Math.random() - 0.5) * 0.8;
    const w1Four = this.createFourVector(w1Pt, w1Phi, w1Eta, mW1);
    const [muPlus, nu] = RelativisticKinematics.twoBodyDecay(w1Four, 0.1056, 0);

    const pMuP = this.createParticle('MUON_PLUS', 'Isolated Muon (μ⁺)', 'μ⁺', +1, 0.1056, muPlus, 'W⁺ → μ⁺ν', '#f43f5e');
    const pNu = this.createParticle('NEUTRINO', 'Muon Neutrino (ν_μ)', 'ν_μ', 0, 0, nu, 'W⁺ → μ⁺ν', '#94a3b8');
    particles.push(pMuP, pNu);

    // Top 2: hadronic tbar -> bbar + W- -> bbar + q + qbar'
    const b2Pt = ttPt * (0.4 + Math.random() * 0.2);
    const b2Phi = ttPhi + Math.PI + (Math.random() - 0.5) * 0.4;
    const b2Eta = -b1Eta + (Math.random() - 0.5) * 0.8;
    const b2Four = this.createFourVector(b2Pt, b2Phi, b2Eta, 4.18);
    const b2Particle = this.createParticle('BOTTOM', 'b̄-quark Jet 2', 'b̄₂', 1 / 3, 4.18, b2Four, 't̄ → b̄W⁻', '#ec4899');
    particles.push(b2Particle);

    // Hadronic W- -> q1 + q2
    const mW2 = RelativisticKinematics.sampleBreitWigner(80.379, 2.085, 75, 85);
    const w2Pt = ttPt * 0.7;
    const w2Phi = ttPhi + Math.PI - 0.3;
    const w2Eta = b2Eta + (Math.random() - 0.5) * 0.5;
    const w2Four = this.createFourVector(w2Pt, w2Phi, w2Eta, mW2);
    const [q1, q2] = RelativisticKinematics.twoBodyDecay(w2Four, 0.3, 0.3);

    const pQ1 = this.createParticle('UP', 'W-Jet 1 (q)', 'j₁', 2 / 3, 0.3, q1, 'W⁻ → qq̄', '#eab308');
    const pQ2 = this.createParticle('DOWN', 'W-Jet 2 (q̄)', 'j₂', -1 / 3, 0.3, q2, 'W⁻ → qq̄', '#eab308');
    particles.push(pQ1, pQ2);
    this.createJetShower(particles, pQ1.pt, pQ1.phi, pQ1.eta, 'W jet fragments');

    const mWHad = RelativisticKinematics.invariantMass(
      RelativisticKinematics.addFourVectors([q1, q2])
    );
    const mTopHad = RelativisticKinematics.invariantMass(
      RelativisticKinematics.addFourVectors([b2Four, q1, q2])
    );

    reco.push({
      label: `M(W⁻_had) = ${mWHad.toFixed(2)} GeV`,
      mass: mWHad,
      constituents: [pQ1.id, pQ2.id],
      resonanceTarget: 'W_BOSON',
    });

    reco.push({
      label: `M(t_had) = ${mTopHad.toFixed(2)} GeV`,
      mass: mTopHad,
      constituents: [b2Particle.id, pQ1.id, pQ2.id],
      resonanceTarget: 'TOP',
    });
  }

  private static generateDarkMatterMonojet(
    particles: Particle[],
    reco: ReconstructedMass[],
    sqrts: number
  ) {
    // Single ultra-high pT jet recoiling against invisible pair of neutralinos
    const jetPt = 350 + Math.random() * 250;
    const jetPhi = (Math.random() * 2 - 1) * Math.PI;
    const jetEta = (Math.random() - 0.5) * 1.5;

    // Hard gluon jet shower
    this.createJetShower(particles, jetPt, jetPhi, jetEta, 'Hard High-pT Monojet', 12);

    // Dark matter pair recoiling in opposite direction
    const dmPt = jetPt;
    const dmPhi = jetPhi + Math.PI + (Math.random() - 0.5) * 0.15;
    const dmEta = -jetEta * 0.5;
    const dmMass = 120 + Math.random() * 80;

    const dmFour = this.createFourVector(dmPt, dmPhi, dmEta, dmMass * 2);
    const [dm1, dm2] = RelativisticKinematics.twoBodyDecay(dmFour, dmMass, dmMass);

    particles.push(
      this.createParticle('DARK_MATTER', 'Neutralino (χ̃₁⁰)', 'χ̃₁⁰', 0, dmMass, dm1, 'DM Production', '#a855f7'),
      this.createParticle('DARK_MATTER', 'Neutralino (χ̃₂⁰)', 'χ̃₂⁰', 0, dmMass, dm2, 'DM Production', '#a855f7')
    );

    reco.push({
      label: `Missing ET = ${jetPt.toFixed(1)} GeV`,
      mass: jetPt,
      constituents: [],
      resonanceTarget: 'OTHER',
    });
  }

  private static generateQcdDijet(
    particles: Particle[],
    reco: ReconstructedMass[],
    sqrts: number
  ) {
    const dijetPt = 150 + Math.random() * 250;
    const phi1 = (Math.random() * 2 - 1) * Math.PI;
    const phi2 = phi1 + Math.PI + (Math.random() - 0.5) * 0.2;
    const eta1 = (Math.random() - 0.5) * 2.0;
    const eta2 = (Math.random() - 0.5) * 2.0;

    this.createJetShower(particles, dijetPt, phi1, eta1, 'Leading Jet', 10);
    this.createJetShower(particles, dijetPt * 0.95, phi2, eta2, 'Sub-Leading Jet', 10);

    const v1 = this.createFourVector(dijetPt, phi1, eta1, 10);
    const v2 = this.createFourVector(dijetPt * 0.95, phi2, eta2, 10);
    const mjj = RelativisticKinematics.invariantMass(
      RelativisticKinematics.addFourVectors([v1, v2])
    );

    reco.push({
      label: `M(jj) = ${mjj.toFixed(1)} GeV`,
      mass: mjj,
      constituents: [],
      resonanceTarget: 'OTHER',
    });
  }

  // --- Helper Methods ---

  private static createJetShower(
    particles: Particle[],
    corePt: number,
    corePhi: number,
    coreEta: number,
    processLabel: string,
    numHadrons: number = 8
  ) {
    let remainingPt = corePt;
    const hadronTypes: { type: ParticleType; name: string; symbol: string; q: number; m: number; color: string }[] = [
      { type: 'PION_PLUS', name: 'Pion (π⁺)', symbol: 'π⁺', q: +1, m: 0.1396, color: '#38bdf8' },
      { type: 'PION_MINUS', name: 'Pion (π⁻)', symbol: 'π⁻', q: -1, m: 0.1396, color: '#f43f5e' },
      { type: 'PION_ZERO', name: 'Neutral Pion (π⁰)', symbol: 'π⁰', q: 0, m: 0.135, color: '#94a3b8' },
      { type: 'KAON_PLUS', name: 'Kaon (K⁺)', symbol: 'K⁺', q: +1, m: 0.4937, color: '#34d399' },
      { type: 'KAON_MINUS', name: 'Kaon (K⁻)', symbol: 'K⁻', q: -1, m: 0.4937, color: '#fb923c' },
      { type: 'PROTON', name: 'Proton (p)', symbol: 'p', q: +1, m: 0.9383, color: '#818cf8' },
    ];

    for (let i = 0; i < numHadrons; i++) {
      if (remainingPt < 1.0) break;
      const frac = i === numHadrons - 1 ? 1.0 : (0.15 + Math.random() * 0.25);
      const hadronPt = Math.max(0.8, remainingPt * frac);
      remainingPt -= hadronPt;

      // Collimated cone opening angle
      const dPhi = (Math.random() - 0.5) * 0.35;
      const dEta = (Math.random() - 0.5) * 0.35;
      const pPhi = corePhi + dPhi;
      const pEta = coreEta + dEta;

      const hadronSpec = hadronTypes[Math.floor(Math.random() * hadronTypes.length)];
      const fourVec = this.createFourVector(hadronPt, pPhi, pEta, hadronSpec.m);

      particles.push(
        this.createParticle(
          hadronSpec.type,
          hadronSpec.name,
          hadronSpec.symbol,
          hadronSpec.q,
          hadronSpec.m,
          fourVec,
          processLabel,
          hadronSpec.color
        )
      );
    }
  }

  private static generateUnderlyingEvent(particles: Particle[], sqrts: number) {
    // Generate soft pileup tracks from beam remnants
    const numSoftTracks = 6 + Math.floor(Math.random() * 8);
    for (let i = 0; i < numSoftTracks; i++) {
      const pt = 0.5 + Math.random() * 2.5;
      const phi = (Math.random() * 2 - 1) * Math.PI;
      const eta = (Math.random() - 0.5) * 4.5;
      const charge = Math.random() > 0.5 ? 1 : -1;
      const fourVec = this.createFourVector(pt, phi, eta, 0.1396);

      particles.push(
        this.createParticle(
          charge > 0 ? 'PION_PLUS' : 'PION_MINUS',
          charge > 0 ? 'Soft Pion (π⁺)' : 'Soft Pion (π⁻)',
          charge > 0 ? 'π⁺' : 'π⁻',
          charge,
          0.1396,
          fourVec,
          'Underlying Event',
          charge > 0 ? '#60a5fa' : '#f87171'
        )
      );
    }
  }

  private static createFourVector(pt: number, phi: number, eta: number, mass: number): FourVector {
    const px = pt * Math.cos(phi);
    const py = pt * Math.sin(phi);
    const theta = 2 * Math.atan(Math.exp(-eta));
    const sinTheta = Math.sin(theta);
    const pz = sinTheta > 1e-4 ? pt / Math.tan(theta) : (eta >= 0 ? pt * 10 : -pt * 10);
    const p2 = px * px + py * py + pz * pz;
    const E = Math.sqrt(mass * mass + p2);
    return { E, px, py, pz };
  }

  private static createParticle(
    type: ParticleType,
    name: string,
    symbol: string,
    charge: number,
    mass: number,
    v: FourVector,
    parentProcess: string,
    color: string
  ): Particle {
    const pt = RelativisticKinematics.pt(v.px, v.py);
    const p = RelativisticKinematics.p(v.px, v.py, v.pz);
    const eta = RelativisticKinematics.eta(v.px, v.py, v.pz);
    const phi = RelativisticKinematics.phi(v.px, v.py);
    const theta = RelativisticKinematics.theta(v.px, v.py, v.pz);

    return {
      id: `p-${Math.random().toString(36).substring(2, 9)}`,
      name,
      symbol,
      type,
      charge,
      mass,
      px: v.px,
      py: v.py,
      pz: v.pz,
      E: v.E,
      pt,
      p,
      eta,
      phi,
      theta,
      decayRadius: 10.0,
      color,
      isStableInDetector: true,
      parentProcess,
      detectorHits: [],
    };
  }
}
