import {
  Complex,
  CircuitGate,
  QuantumSystemState,
  SingleQubitReducedState,
  BasisStateAmplitude,
  MeasurementResult,
} from '../types';
import { C } from './ComplexMath';
import { GATE_DEFINITIONS } from './QuantumGates';

export class QuantumSimulatorEngine {
  public numQubits: number;
  public stateVector: Complex[] = [];
  public measurementHistory: MeasurementResult[] = [];

  constructor(numQubits: number = 3) {
    this.numQubits = Math.max(1, Math.min(8, numQubits));
    this.resetState();
  }

  /**
   * Resets the quantum register to ground state |0...0⟩
   */
  public resetState(): void {
    const dim = 1 << this.numQubits;
    this.stateVector = Array.from({ length: dim }, (_, i) =>
      i === 0 ? C.one() : C.zero()
    );
    this.measurementHistory = [];
  }

  /**
   * Sets custom number of qubits (1 to 8) and resets state
   */
  public setNumQubits(n: number): void {
    this.numQubits = Math.max(1, Math.min(8, n));
    this.resetState();
  }

  /**
   * Applies a single quantum gate to the state vector
   */
  public applyGate(gate: CircuitGate): void {
    const dim = 1 << this.numQubits;
    const targetMask = 1 << gate.targetQubit;

    switch (gate.type) {
      case 'H':
      case 'X':
      case 'Y':
      case 'Z':
      case 'S':
      case 'T':
      case 'TDAG':
      case 'RX':
      case 'RY':
      case 'RZ': {
        const def = GATE_DEFINITIONS[gate.type];
        if (!def.matrix2x2) return;
        const U = def.matrix2x2(gate.parameter);

        // Transform pairs of amplitudes where target bit is 0 and 1
        for (let i = 0; i < dim; i++) {
          if ((i & targetMask) === 0) {
            const i0 = i;
            const i1 = i | targetMask;
            const a0 = this.stateVector[i0];
            const a1 = this.stateVector[i1];

            // [psi0'] = [u00 u01] [psi0]
            // [psi1']   [u10 u11] [psi1]
            this.stateVector[i0] = C.add(C.mul(U[0][0], a0), C.mul(U[0][1], a1));
            this.stateVector[i1] = C.add(C.mul(U[1][0], a0), C.mul(U[1][1], a1));
          }
        }
        break;
      }

      case 'CNOT': {
        const controlQubit = gate.controlQubits?.[0] ?? (gate.targetQubit === 0 ? 1 : 0);
        const controlMask = 1 << controlQubit;

        for (let i = 0; i < dim; i++) {
          // If control is 1 and target is 0, swap with target is 1
          if ((i & controlMask) !== 0 && (i & targetMask) === 0) {
            const i0 = i;
            const i1 = i | targetMask;
            const temp = this.stateVector[i0];
            this.stateVector[i0] = this.stateVector[i1];
            this.stateVector[i1] = temp;
          }
        }
        break;
      }

      case 'CZ': {
        const controlQubit = gate.controlQubits?.[0] ?? (gate.targetQubit === 0 ? 1 : 0);
        const controlMask = 1 << controlQubit;

        for (let i = 0; i < dim; i++) {
          // If both control and target are 1, invert phase
          if ((i & controlMask) !== 0 && (i & targetMask) !== 0) {
            this.stateVector[i] = C.scale(this.stateVector[i], -1);
          }
        }
        break;
      }

      case 'CP': {
        const controlQubit = gate.controlQubits?.[0] ?? (gate.targetQubit === 0 ? 1 : 0);
        const controlMask = 1 << controlQubit;
        const phi = gate.parameter ?? Math.PI / 2;
        const phaseFactor = C.polar(1, phi);

        for (let i = 0; i < dim; i++) {
          if ((i & controlMask) !== 0 && (i & targetMask) !== 0) {
            this.stateVector[i] = C.mul(this.stateVector[i], phaseFactor);
          }
        }
        break;
      }

      case 'SWAP': {
        const target2 = gate.controlQubits?.[0] ?? (gate.targetQubit === 0 ? 1 : 0);
        const mask1 = 1 << gate.targetQubit;
        const mask2 = 1 << target2;

        for (let i = 0; i < dim; i++) {
          const bit1 = (i & mask1) !== 0;
          const bit2 = (i & mask2) !== 0;
          if (bit1 && !bit2) {
            const swappedIndex = (i ^ mask1) ^ mask2;
            const temp = this.stateVector[i];
            this.stateVector[i] = this.stateVector[swappedIndex];
            this.stateVector[swappedIndex] = temp;
          }
        }
        break;
      }

      case 'TOFFOLI': {
        const t = gate.targetQubit;
        const available = Array.from({ length: this.numQubits }, (_, k) => k).filter((k) => k !== t);
        const c1 =
          gate.controlQubits?.[0] !== undefined && gate.controlQubits[0] !== t
            ? gate.controlQubits[0]
            : available[0] ?? 0;
        const c2 =
          gate.controlQubits?.[1] !== undefined &&
          gate.controlQubits[1] !== t &&
          gate.controlQubits[1] !== c1
            ? gate.controlQubits[1]
            : available.find((k) => k !== c1) ?? 1;
        const cMask = (1 << c1) | (1 << c2);

        for (let i = 0; i < dim; i++) {
          if ((i & cMask) === cMask && (i & targetMask) === 0) {
            const i0 = i;
            const i1 = i | targetMask;
            const temp = this.stateVector[i0];
            this.stateVector[i0] = this.stateVector[i1];
            this.stateVector[i1] = temp;
          }
        }
        break;
      }

      case 'CSWAP': {
        const t1 = gate.targetQubit;
        const available = Array.from({ length: this.numQubits }, (_, k) => k).filter((k) => k !== t1);
        const control =
          gate.controlQubits?.[0] !== undefined && gate.controlQubits[0] !== t1
            ? gate.controlQubits[0]
            : available[0] ?? 0;
        const t2 =
          gate.controlQubits?.[1] !== undefined &&
          gate.controlQubits[1] !== t1 &&
          gate.controlQubits[1] !== control
            ? gate.controlQubits[1]
            : available.find((k) => k !== control) ?? (t1 === 1 ? 2 : 1);
        const cMask = 1 << control;
        const mask1 = 1 << t1;
        const mask2 = 1 << t2;

        for (let i = 0; i < dim; i++) {
          if ((i & cMask) !== 0) {
            const bit1 = (i & mask1) !== 0;
            const bit2 = (i & mask2) !== 0;
            if (bit1 && !bit2) {
              const swapped = (i ^ mask1) ^ mask2;
              const temp = this.stateVector[i];
              this.stateVector[i] = this.stateVector[swapped];
              this.stateVector[swapped] = temp;
            }
          }
        }
        break;
      }

      case 'MEASURE': {
        this.performMeasurement(gate.targetQubit, gate.step);
        break;
      }
    }
  }

  /**
   * Projective measurement collapsing target qubit to |0⟩ or |1⟩
   */
  public performMeasurement(targetQubit: number, step: number): 0 | 1 {
    const dim = 1 << this.numQubits;
    const targetMask = 1 << targetQubit;

    // Compute probability of measuring 0
    let prob0 = 0;
    for (let i = 0; i < dim; i++) {
      if ((i & targetMask) === 0) {
        prob0 += C.magSq(this.stateVector[i]);
      }
    }

    // Roll random outcome according to Born rule
    const rand = Math.random();
    const outcome: 0 | 1 = rand < prob0 ? 0 : 1;
    const norm = Math.sqrt(outcome === 0 ? prob0 : 1 - prob0);

    // Collapse state vector
    if (norm > 1e-12) {
      for (let i = 0; i < dim; i++) {
        const bit = (i & targetMask) === 0 ? 0 : 1;
        if (bit === outcome) {
          this.stateVector[i] = C.scale(this.stateVector[i], 1 / norm);
        } else {
          this.stateVector[i] = C.zero();
        }
      }
    }

    this.measurementHistory.push({
      step,
      qubitIndex: targetQubit,
      collapsedValue: outcome,
      probability: outcome === 0 ? prob0 : 1 - prob0,
      timestamp: Date.now(),
    });

    return outcome;
  }

  /**
   * Simulates an entire circuit from step 0 to maxStep
   */
  public runCircuit(gates: CircuitGate[], upToStep?: number): QuantumSystemState {
    this.resetState();

    // Sort gates by step
    const sorted = [...gates].sort((a, b) => a.step - b.step);

    for (const gate of sorted) {
      if (upToStep !== undefined && gate.step > upToStep) {
        break;
      }
      this.applyGate(gate);
    }

    return this.getSystemState();
  }

  /**
   * Computes full system state, density matrices, and individual Bloch spheres
   */
  public getSystemState(): QuantumSystemState {
    const dim = 1 << this.numQubits;
    const amplitudes: BasisStateAmplitude[] = [];
    let totalProb = 0;

    for (let i = 0; i < dim; i++) {
      const amp = this.stateVector[i];
      const prob = C.magSq(amp);
      totalProb += prob;
      const binStr = i.toString(2).padStart(this.numQubits, '0');

      amplitudes.push({
        binaryString: binStr,
        index: i,
        amplitude: { ...amp },
        probability: prob,
        phaseRad: C.phase(amp),
      });
    }

    // Compute single-qubit reduced density matrices Tr_~q (rho)
    const reducedStates: SingleQubitReducedState[] = [];
    let totalEntropy = 0;

    for (let q = 0; q < this.numQubits; q++) {
      const mask = 1 << q;
      let rho00 = 0;
      let rho11 = 0;
      let rho01 = C.zero();

      for (let i = 0; i < dim; i++) {
        if ((i & mask) === 0) {
          const a0 = this.stateVector[i];
          const a1 = this.stateVector[i | mask];
          rho00 += C.magSq(a0);
          rho11 += C.magSq(a1);
          rho01 = C.add(rho01, C.mul(a0, C.conj(a1)));
        }
      }

      // Bloch vector coordinates:
      // x = 2 * Re(rho01)
      // y = -2 * Im(rho01)
      // z = rho00 - rho11
      const bx = 2 * rho01.re;
      const by = -2 * rho01.im;
      const bz = rho00 - rho11;

      // Purity = (1 + r^2) / 2 where r = sqrt(x^2 + y^2 + z^2)
      const r = Math.min(1.0, Math.sqrt(bx * bx + by * by + bz * bz));
      const purity = (1 + r * r) * 0.5;
      const isEntangled = purity < 0.985;

      // Spherical polar angles (theta, phi)
      const theta = Math.acos(Math.max(-1, Math.min(1, bz / (r > 1e-6 ? r : 1))));
      let phi = Math.atan2(by, bx);
      if (phi < 0) phi += 2 * Math.PI;

      // Single-qubit Von Neumann entropy
      if (r < 0.9999) {
        const lambda1 = (1 + r) * 0.5;
        const lambda2 = (1 - r) * 0.5;
        const s1 = lambda1 > 1e-12 ? -lambda1 * Math.log2(lambda1) : 0;
        const s2 = lambda2 > 1e-12 ? -lambda2 * Math.log2(lambda2) : 0;
        totalEntropy += s1 + s2;
      }

      reducedStates.push({
        index: q,
        bloch: { x: bx, y: by, z: bz },
        theta,
        phi,
        prob0: rho00,
        prob1: rho11,
        purity,
        entangled: isEntangled,
      });
    }

    return {
      numQubits: this.numQubits,
      stateVector: this.stateVector.map((c) => ({ ...c })),
      reducedStates,
      amplitudes,
      totalProbability: totalProb,
      isPure: totalEntropy < 0.01,
      entanglementEntropy: totalEntropy / this.numQubits,
    };
  }
}
