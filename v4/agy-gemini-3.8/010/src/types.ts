export interface Complex {
  re: number;
  im: number;
}

export type SingleQubitGateType =
  | 'H'
  | 'X'
  | 'Y'
  | 'Z'
  | 'S'
  | 'T'
  | 'TDAG'
  | 'RX'
  | 'RY'
  | 'RZ';

export type TwoQubitGateType = 'CNOT' | 'CZ' | 'CP' | 'SWAP';
export type ThreeQubitGateType = 'TOFFOLI' | 'CSWAP';
export type MeasurementType = 'MEASURE';

export type GateType =
  | SingleQubitGateType
  | TwoQubitGateType
  | ThreeQubitGateType
  | MeasurementType;

export interface CircuitGate {
  id: string;
  type: GateType;
  targetQubit: number;
  controlQubits?: number[];
  step: number;
  parameter?: number; // angle in radians for RX, RY, RZ, CP
}

export interface BlochVector {
  x: number;
  y: number;
  z: number;
}

export interface SingleQubitReducedState {
  index: number;
  bloch: BlochVector;
  theta: number; // 0 to PI
  phi: number; // 0 to 2*PI
  prob0: number;
  prob1: number;
  purity: number; // Tr(rho^2) - 1.0 for pure, 0.5 for maximally entangled
  entangled: boolean;
}

export interface BasisStateAmplitude {
  binaryString: string;
  index: number;
  amplitude: Complex;
  probability: number;
  phaseRad: number;
}

export interface QuantumSystemState {
  numQubits: number;
  stateVector: Complex[]; // Length 2^n
  densityMatrix?: Complex[][]; // 2^n x 2^n
  reducedStates: SingleQubitReducedState[];
  amplitudes: BasisStateAmplitude[];
  totalProbability: number;
  isPure: boolean;
  entanglementEntropy: number;
}

export interface AlgorithmPreset {
  id: string;
  name: string;
  category: 'FOUNDATIONAL' | 'ENTANGLEMENT' | 'ALGORITHMS' | 'COMMUNICATION';
  description: string;
  details: string;
  numQubits: number;
  gates: CircuitGate[];
}

export interface MeasurementResult {
  step: number;
  qubitIndex: number;
  collapsedValue: 0 | 1;
  probability: number;
  timestamp: number;
}
