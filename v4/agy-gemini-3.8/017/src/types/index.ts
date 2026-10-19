export type ParticleType =
  | 'ELECTRON'
  | 'POSITRON'
  | 'MUON_MINUS'
  | 'MUON_PLUS'
  | 'NEUTRINO'
  | 'PHOTON'
  | 'Z_BOSON'
  | 'W_PLUS'
  | 'W_MINUS'
  | 'HIGGS'
  | 'GLUON'
  | 'UP'
  | 'DOWN'
  | 'STRANGE'
  | 'CHARM'
  | 'BOTTOM'
  | 'TOP'
  | 'PION_PLUS'
  | 'PION_MINUS'
  | 'PION_ZERO'
  | 'KAON_PLUS'
  | 'KAON_MINUS'
  | 'PROTON'
  | 'ANTIPROTON'
  | 'NEUTRON'
  | 'DARK_MATTER';

export interface DetectorHit {
  subdetector: 'TRACKER' | 'ECAL' | 'HCAL' | 'MUON';
  x: number; // meters
  y: number; // meters
  z: number; // meters
  r: number; // meters
  energyDeposit: number; // GeV
  time: number; // ns
}

export interface Particle {
  id: string;
  name: string;
  symbol: string;
  type: ParticleType;
  charge: number; // in units of e (-1, 0, +1)
  mass: number; // GeV/c^2
  px: number; // GeV/c
  py: number; // GeV/c
  pz: number; // GeV/c
  E: number; // GeV
  pt: number; // GeV/c
  p: number; // GeV/c
  eta: number; // pseudorapidity
  phi: number; // radians [-pi, pi]
  theta: number; // polar angle [0, pi]
  decayRadius: number; // meters from interaction point
  color: string;
  isStableInDetector: boolean;
  parentProcess: string;
  detectorHits: DetectorHit[];
}

export interface Jet {
  id: string;
  px: number;
  py: number;
  pz: number;
  E: number;
  pt: number;
  eta: number;
  phi: number;
  mass: number;
  coneRadius: number;
  constituentIds: string[];
}

export interface ReconstructedMass {
  label: string;
  mass: number; // GeV
  constituents: string[];
  resonanceTarget: 'HIGGS' | 'Z_BOSON' | 'W_BOSON' | 'TOP' | 'OTHER';
}

export interface CollisionEvent {
  eventId: number;
  runId: number;
  timestamp: number;
  sqrts: number; // TeV
  processName: string;
  processKey: ColliderPresetId;
  allParticles: Particle[];
  visibleParticles: Particle[];
  jets: Jet[];
  missingET: {
    mag: number; // GeV
    phi: number; // radians
    px: number; // GeV
    py: number; // GeV
  };
  totalScalarET: number; // GeV
  reconstructedMasses: ReconstructedMass[];
}

export type SuiteMode =
  | 'TRANSVERSE_DETECTOR'
  | 'LONGITUDINAL_RZ'
  | 'LEGO_ETA_PHI'
  | 'MASS_SPECTRUM';

export type ColliderPresetId =
  | 'HIGGS_DIPHOTON'
  | 'HIGGS_FOUR_LEPTON'
  | 'Z_BOSON_DIMUON'
  | 'TOP_QUARK_PAIR'
  | 'DARK_MATTER_MONOJET'
  | 'QCD_DIJET_HARD_SCATTERING';

export type TriggerFilter =
  | 'ALL'
  | 'DI_LEPTON'
  | 'DI_PHOTON'
  | 'HIGH_MET'
  | 'MULTI_JET';

export interface DetectorConfig {
  magneticFieldB: number; // Tesla (0.5 to 4.0)
  sqrtsTeV: number; // Center of mass energy in TeV (0.5 to 14.0)
  ptCutGeV: number; // Transverse momentum display cut in GeV (0.5 to 10.0)
  jetRadiusR: number; // Jet clustering cone radius (0.2 to 1.0)
  luminosityScale: number; // Relative instantaneous luminosity (1 to 10)
  autoCollide: boolean; // Continuous collision stream
  collisionRateHz: number; // Collision rate in Hz (0.5 to 5.0)
  triggerFilter: TriggerFilter;
}

export interface ColliderTelemetry {
  totalEventsGenerated: number;
  eventsRecordedInSpectrum: number;
  currentEventId: number;
  sqrts: number;
  currentProcess: string;
  trackCount: number;
  jetCount: number;
  missingET: number;
  highestPtTrack: {
    symbol: string;
    pt: number;
    eta: number;
    phi: number;
    charge: number;
  } | null;
  reconstructedHiggsCount: number;
  reconstructedZCount: number;
  higgsSignificance: number; // S / sqrt(B)
}

export interface MassSpectrumBin {
  centerGeV: number;
  count: number;
  higgsSignal: number;
  zSignal: number;
  background: number;
}
