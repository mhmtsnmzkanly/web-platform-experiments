import { Complex, GateType } from '../types';
import { C } from './ComplexMath';

const INV_SQRT_2 = 1 / Math.SQRT2;

export interface QuantumGateDefinition {
  type: GateType;
  name: string;
  symbol: string;
  description: string;
  numQubits: number;
  matrix2x2?: (param?: number) => Complex[][];
}

export const GATE_DEFINITIONS: Record<GateType, QuantumGateDefinition> = {
  H: {
    type: 'H',
    name: 'Hadamard',
    symbol: 'H',
    description: 'Creates equal superposition |0⟩ → (|0⟩+|1⟩)/√2 and |1⟩ → (|0⟩-|1⟩)/√2',
    numQubits: 1,
    matrix2x2: () => [
      [C.create(INV_SQRT_2), C.create(INV_SQRT_2)],
      [C.create(INV_SQRT_2), C.create(-INV_SQRT_2)],
    ],
  },
  X: {
    type: 'X',
    name: 'Pauli-X (NOT)',
    symbol: 'X',
    description: 'Bit-flip gate: exchanges |0⟩ ↔ |1⟩',
    numQubits: 1,
    matrix2x2: () => [
      [C.zero(), C.one()],
      [C.one(), C.zero()],
    ],
  },
  Y: {
    type: 'Y',
    name: 'Pauli-Y',
    symbol: 'Y',
    description: 'Bit and phase flip: |0⟩ → i|1⟩, |1⟩ → -i|0⟩',
    numQubits: 1,
    matrix2x2: () => [
      [C.zero(), C.create(0, -1)],
      [C.create(0, 1), C.zero()],
    ],
  },
  Z: {
    type: 'Z',
    name: 'Pauli-Z',
    symbol: 'Z',
    description: 'Phase-flip gate: |0⟩ → |0⟩, |1⟩ → -|1⟩',
    numQubits: 1,
    matrix2x2: () => [
      [C.one(), C.zero()],
      [C.zero(), C.create(-1, 0)],
    ],
  },
  S: {
    type: 'S',
    name: 'Phase (S)',
    symbol: 'S',
    description: 'Quarter-turn phase shift: π/2 phase to |1⟩ state',
    numQubits: 1,
    matrix2x2: () => [
      [C.one(), C.zero()],
      [C.zero(), C.create(0, 1)],
    ],
  },
  T: {
    type: 'T',
    name: 'T (π/8)',
    symbol: 'T',
    description: 'Eighth-turn phase shift: π/4 phase to |1⟩ state',
    numQubits: 1,
    matrix2x2: () => [
      [C.one(), C.zero()],
      [C.zero(), C.polar(1, Math.PI / 4)],
    ],
  },
  TDAG: {
    type: 'TDAG',
    name: 'T† (T-Dagger)',
    symbol: 'T†',
    description: 'Adjoint of T gate: -π/4 phase to |1⟩ state',
    numQubits: 1,
    matrix2x2: () => [
      [C.one(), C.zero()],
      [C.zero(), C.polar(1, -Math.PI / 4)],
    ],
  },
  RX: {
    type: 'RX',
    name: 'Rotation-X',
    symbol: 'Rx',
    description: 'Arbitrary rotation around Bloch sphere X-axis by angle θ',
    numQubits: 1,
    matrix2x2: (theta: number = Math.PI / 2) => {
      const half = theta / 2;
      return [
        [C.create(Math.cos(half)), C.create(0, -Math.sin(half))],
        [C.create(0, -Math.sin(half)), C.create(Math.cos(half))],
      ];
    },
  },
  RY: {
    type: 'RY',
    name: 'Rotation-Y',
    symbol: 'Ry',
    description: 'Arbitrary rotation around Bloch sphere Y-axis by angle θ',
    numQubits: 1,
    matrix2x2: (theta: number = Math.PI / 2) => {
      const half = theta / 2;
      return [
        [C.create(Math.cos(half)), C.create(-Math.sin(half))],
        [C.create(Math.sin(half)), C.create(Math.cos(half))],
      ];
    },
  },
  RZ: {
    type: 'RZ',
    name: 'Rotation-Z',
    symbol: 'Rz',
    description: 'Arbitrary rotation around Bloch sphere Z-axis by angle θ',
    numQubits: 1,
    matrix2x2: (theta: number = Math.PI / 2) => {
      const half = theta / 2;
      return [
        [C.polar(1, -half), C.zero()],
        [C.zero(), C.polar(1, half)],
      ];
    },
  },
  CNOT: {
    type: 'CNOT',
    name: 'Controlled-NOT (CX)',
    symbol: '⊕',
    description: 'Flips target qubit if and only if control qubit is |1⟩',
    numQubits: 2,
  },
  CZ: {
    type: 'CZ',
    name: 'Controlled-Z',
    symbol: 'CZ',
    description: 'Applies phase flip Z to target if control qubit is |1⟩',
    numQubits: 2,
  },
  CP: {
    type: 'CP',
    name: 'Controlled-Phase',
    symbol: 'CP',
    description: 'Applies phase shift φ to |11⟩ state',
    numQubits: 2,
  },
  SWAP: {
    type: 'SWAP',
    name: 'SWAP',
    symbol: '✕',
    description: 'Exchanges quantum states of two qubits: |ab⟩ ↔ |ba⟩',
    numQubits: 2,
  },
  TOFFOLI: {
    type: 'TOFFOLI',
    name: 'Toffoli (CCX)',
    symbol: 'CCX',
    description: 'Flips target qubit if both control qubits are |1⟩ (universal classical)',
    numQubits: 3,
  },
  CSWAP: {
    type: 'CSWAP',
    name: 'Fredkin (CSWAP)',
    symbol: 'CSW',
    description: 'Swaps two target qubits if control qubit is |1⟩',
    numQubits: 3,
  },
  MEASURE: {
    type: 'MEASURE',
    name: 'Measurement',
    symbol: '∡',
    description: 'Projective measurement collapsing qubit to classical |0⟩ or |1⟩',
    numQubits: 1,
  },
};
