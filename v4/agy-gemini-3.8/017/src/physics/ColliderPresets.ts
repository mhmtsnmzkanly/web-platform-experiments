import { ColliderPresetId } from '../types';

export interface PresetInfo {
  id: ColliderPresetId;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  targetResonance: string;
  typicalSignatures: string[];
}

export const COLLIDER_PRESETS: Record<ColliderPresetId, PresetInfo> = {
  HIGGS_DIPHOTON: {
    id: 'HIGGS_DIPHOTON',
    name: 'Higgs Boson (H → γγ)',
    badge: '125 GeV Di-Photon',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    description: 'Gluon-gluon fusion producing a Higgs boson decaying into two isolated high-pT photons with narrow resonance at 125.1 GeV in the ECAL crystals.',
    targetResonance: 'M(γγ) ≈ 125.1 GeV',
    typicalSignatures: ['2 isolated ECAL photon showers', 'No tracker hits on photons', 'Narrow 125 GeV resonance peak'],
  },
  HIGGS_FOUR_LEPTON: {
    id: 'HIGGS_FOUR_LEPTON',
    name: 'Higgs Golden Channel (H → ZZ* → 4ℓ)',
    badge: '125 GeV 4-Lepton',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    description: 'The golden channel: H → ZZ* → 2e2μ or 4μ with four high-pT isolated leptons reconstructing the Higgs invariant mass with near-zero background.',
    targetResonance: 'M(4ℓ) ≈ 125.1 GeV',
    typicalSignatures: ['4 high-pT isolated leptons', 'On-shell Z (91.2 GeV) + off-shell Z*', 'Full invariant mass 125.1 GeV'],
  },
  Z_BOSON_DIMUON: {
    id: 'Z_BOSON_DIMUON',
    name: 'Z Boson Standard Candle (Z → μ⁺μ⁻)',
    badge: '91.2 GeV Di-Muon',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    description: 'Drell-Yan electroweak production of a Z0 vector boson decaying into a clean, opposite-sign back-to-back muon pair punching through to outer spectrometer.',
    targetResonance: 'M(μ⁺μ⁻) ≈ 91.2 GeV',
    typicalSignatures: ['2 opposite-sign penetrating muons', 'Deep spectrometer drift hits', 'Breit-Wigner width Γ = 2.5 GeV'],
  },
  TOP_QUARK_PAIR: {
    id: 'TOP_QUARK_PAIR',
    name: 'Top Quark Pair Production (tt̄ → bW b̄W)',
    badge: '173 GeV Top Quark',
    badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    description: 'Heaviest known elementary particle (mt ≈ 173 GeV). Semileptonic decay yields 1 high-pT muon, missing ET from neutrino, 2 b-jets, and 2 W decay jets.',
    targetResonance: 'M(bjj) ≈ 172.8 GeV',
    typicalSignatures: ['1 isolated high-pT lepton', 'Significant missing ET (neutrino)', '4 reconstructed anti-kt jets'],
  },
  DARK_MATTER_MONOJET: {
    id: 'DARK_MATTER_MONOJET',
    name: 'Dark Matter / SUSY Monojet (pp → χ̃₁⁰χ̃₁⁰ + g)',
    badge: 'Colossal Missing ET',
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    description: 'Search for weakly interacting massive particles (WIMPs). A single energetic QCD gluon jet recoils against invisible neutralinos with huge transverse momentum imbalance.',
    targetResonance: 'Missing ET > 350 GeV',
    typicalSignatures: ['Single high-pT hadron jet', 'Enormous missing transverse energy', 'Zero particles in recoil hemisphere'],
  },
  QCD_DIJET_HARD_SCATTERING: {
    id: 'QCD_DIJET_HARD_SCATTERING',
    name: 'QCD Dijet Hard Scattering (qg → qg)',
    badge: 'High-pT Jet Cones',
    badgeColor: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
    description: 'Fundamental strong force 2 → 2 parton collision creating back-to-back quark/gluon showers clustered into collimated anti-kt jet cones.',
    targetResonance: 'Dijet Invariant Mass > 400 GeV',
    typicalSignatures: ['2 collimated back-to-back jets', 'Tens of charged hadron tracks', 'Rich color string fragmentation'],
  },
};
