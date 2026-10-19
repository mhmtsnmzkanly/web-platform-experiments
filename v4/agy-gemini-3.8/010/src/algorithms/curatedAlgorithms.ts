import { AlgorithmPreset } from '../types';

export const CURATED_ALGORITHMS: AlgorithmPreset[] = [
  {
    id: 'bell-state',
    name: 'Bell State |Φ⁺⟩: Maximal EPR Entanglement',
    category: 'ENTANGLEMENT',
    description: 'Generates maximally entangled Einstein-Podolsky-Rosen (EPR) state (|00⟩ + |11⟩)/√2.',
    details:
      'Applying a Hadamard gate puts Qubit 0 into equal superposition (|0⟩+|1⟩)/√2. The subsequent CNOT gate correlates Qubit 1 with Qubit 0, creating the maximally entangled Bell state |Φ⁺⟩. Both individual qubits lose all local polarization (Bloch vector length collapses to 0) while global coherence is 100%.',
    numQubits: 2,
    gates: [
      { id: 'g1', type: 'H', targetQubit: 0, step: 0 },
      { id: 'g2', type: 'CNOT', targetQubit: 1, controlQubits: [0], step: 1 },
    ],
  },
  {
    id: 'quantum-teleportation',
    name: 'Quantum Teleportation Protocol',
    category: 'COMMUNICATION',
    description: 'Transfers an unknown quantum state from Alice to Bob using an EPR pair & 2 classical bits.',
    details:
      'Qubit 0 is prepared in an arbitrary superposed test state via Ry(π/3). Qubits 1 and 2 form an entangled Bell pair shared between Alice (Q1) and Bob (Q2). Alice performs a Bell measurement on Q0 and Q1 (CNOT + H), collapsing her qubits. The classical measurement results dictate whether Bob applies X and/or Z gates to Q2, reconstructing the original state of Q0 perfectly on Q2.',
    numQubits: 3,
    gates: [
      // 1. Prepare unknown state on Qubit 0
      { id: 't1', type: 'RY', targetQubit: 0, parameter: Math.PI / 3, step: 0 },
      // 2. Create EPR Bell pair between Alice (Q1) and Bob (Q2)
      { id: 't2', type: 'H', targetQubit: 1, step: 1 },
      { id: 't3', type: 'CNOT', targetQubit: 2, controlQubits: [1], step: 2 },
      // 3. Alice performs Bell-basis measurement
      { id: 't4', type: 'CNOT', targetQubit: 1, controlQubits: [0], step: 3 },
      { id: 't5', type: 'H', targetQubit: 0, step: 4 },
      // 4. Bob applies conditional classical corrections
      { id: 't6', type: 'CNOT', targetQubit: 2, controlQubits: [1], step: 5 },
      { id: 't7', type: 'CZ', targetQubit: 2, controlQubits: [0], step: 6 },
    ],
  },
  {
    id: 'grover-search',
    name: "Grover's Search Algorithm (3-Qubit Database)",
    category: 'ALGORITHMS',
    description: 'Unstructured database search with quadratic quantum speedup O(√N). Target: |101⟩ (item 5).',
    details:
      'Searches an 8-item database (|000⟩ through |111⟩). Step 1 initializes equal superposition across all states via Hadamard gates. Step 2 applies an Oracle that selectively inverts the phase of target item |101⟩. Step 3 executes the Grover Diffusion Operator (amplitude inversion about the mean), boosting the probability of measuring |101⟩ from 12.5% to 78.13% (25/32) in a single iteration (approaching >94.5% after 2 iterations).',
    numQubits: 3,
    gates: [
      // Initialize equal superposition
      { id: 'gr1', type: 'H', targetQubit: 0, step: 0 },
      { id: 'gr2', type: 'H', targetQubit: 1, step: 0 },
      { id: 'gr3', type: 'H', targetQubit: 2, step: 0 },
      // Oracle: Phase flip target |101⟩ (Q0=1, Q1=0, Q2=1)
      { id: 'gr4', type: 'X', targetQubit: 1, step: 1 },
      { id: 'gr5', type: 'H', targetQubit: 2, step: 2 },
      { id: 'gr6', type: 'TOFFOLI', targetQubit: 2, controlQubits: [0, 1], step: 3 },
      { id: 'gr7', type: 'H', targetQubit: 2, step: 4 },
      { id: 'gr8', type: 'X', targetQubit: 1, step: 5 },
      // Diffusion Operator (Inversion about average)
      { id: 'gr9', type: 'H', targetQubit: 0, step: 6 },
      { id: 'gr10', type: 'H', targetQubit: 1, step: 6 },
      { id: 'gr11', type: 'H', targetQubit: 2, step: 6 },
      { id: 'gr12', type: 'X', targetQubit: 0, step: 7 },
      { id: 'gr13', type: 'X', targetQubit: 1, step: 7 },
      { id: 'gr14', type: 'X', targetQubit: 2, step: 7 },
      { id: 'gr15', type: 'H', targetQubit: 2, step: 8 },
      { id: 'gr16', type: 'TOFFOLI', targetQubit: 2, controlQubits: [0, 1], step: 9 },
      { id: 'gr17', type: 'H', targetQubit: 2, step: 10 },
      { id: 'gr18', type: 'X', targetQubit: 0, step: 11 },
      { id: 'gr19', type: 'X', targetQubit: 1, step: 11 },
      { id: 'gr20', type: 'X', targetQubit: 2, step: 11 },
      { id: 'gr21', type: 'H', targetQubit: 0, step: 12 },
      { id: 'gr22', type: 'H', targetQubit: 1, step: 12 },
      { id: 'gr23', type: 'H', targetQubit: 2, step: 12 },
    ],
  },
  {
    id: 'qft-3qubit',
    name: 'Quantum Fourier Transform (3-Qubit QFT)',
    category: 'ALGORITHMS',
    description: 'Quantum analogue of the discrete Fourier transform; core routine of Shor\'s factoring algorithm.',
    details:
      'Transforms state amplitudes into frequency space using a cascade of Hadamard and Controlled-Phase gates CP(π/2) and CP(π/4), concluding with a SWAP gate to reverse qubit endianness. Used in quantum phase estimation, period-finding, and order-finding.',
    numQubits: 3,
    gates: [
      // Qubit 0 transform
      { id: 'q1', type: 'H', targetQubit: 0, step: 0 },
      { id: 'q2', type: 'CP', targetQubit: 0, controlQubits: [1], parameter: Math.PI / 2, step: 1 },
      { id: 'q3', type: 'CP', targetQubit: 0, controlQubits: [2], parameter: Math.PI / 4, step: 2 },
      // Qubit 1 transform
      { id: 'q4', type: 'H', targetQubit: 1, step: 3 },
      { id: 'q5', type: 'CP', targetQubit: 1, controlQubits: [2], parameter: Math.PI / 2, step: 4 },
      // Qubit 2 transform
      { id: 'q6', type: 'H', targetQubit: 2, step: 5 },
      // Endianness reversal
      { id: 'q7', type: 'SWAP', targetQubit: 0, controlQubits: [2], step: 6 },
    ],
  },
  {
    id: 'deutsch-jozsa',
    name: 'Deutsch-Jozsa Algorithm (Balanced vs Constant)',
    category: 'ALGORITHMS',
    description: 'Determines whether a boolean oracle is constant or balanced in a single quantum query.',
    details:
      'Classical deterministic algorithms require 2^(n-1) + 1 evaluations in the worst case to distinguish between constant and balanced functions. The Deutsch-Jozsa algorithm exploits quantum phase kickback to perform complete constructive interference on |00⟩ if constant, or complete destructive cancellation if balanced, solving the problem with exactly 1 query.',
    numQubits: 3,
    gates: [
      // Initialize query qubits in |0⟩ and ancilla in |1⟩
      { id: 'dj1', type: 'X', targetQubit: 2, step: 0 },
      // Superposition
      { id: 'dj2', type: 'H', targetQubit: 0, step: 1 },
      { id: 'dj3', type: 'H', targetQubit: 1, step: 1 },
      { id: 'dj4', type: 'H', targetQubit: 2, step: 1 },
      // Balanced Oracle (f(x0, x1) = x0 ⊕ x1)
      { id: 'dj5', type: 'CNOT', targetQubit: 2, controlQubits: [0], step: 2 },
      { id: 'dj6', type: 'CNOT', targetQubit: 2, controlQubits: [1], step: 3 },
      // Interference
      { id: 'dj7', type: 'H', targetQubit: 0, step: 4 },
      { id: 'dj8', type: 'H', targetQubit: 1, step: 4 },
    ],
  },
  {
    id: 'superdense-coding',
    name: 'Superdense Coding Protocol',
    category: 'COMMUNICATION',
    description: 'Transmits 2 classical bits (\'11\') using only a single physical qubit.',
    details:
      'Alice and Bob share an entangled Bell pair. Alice encodes two classical bits by applying Pauli gates (here X and Z for message "11") to her single qubit only, and sends it to Bob. Bob performs Bell decoding (CNOT + H) and measures both qubits, decoding the full 2-bit message with 100% certainty.',
    numQubits: 2,
    gates: [
      // Create shared Bell pair
      { id: 'sd1', type: 'H', targetQubit: 0, step: 0 },
      { id: 'sd2', type: 'CNOT', targetQubit: 1, controlQubits: [0], step: 1 },
      // Alice encodes message '11' onto Qubit 0
      { id: 'sd3', type: 'X', targetQubit: 0, step: 2 },
      { id: 'sd4', type: 'Z', targetQubit: 0, step: 3 },
      // Bob decodes message
      { id: 'sd5', type: 'CNOT', targetQubit: 1, controlQubits: [0], step: 4 },
      { id: 'sd6', type: 'H', targetQubit: 0, step: 5 },
    ],
  },
];
