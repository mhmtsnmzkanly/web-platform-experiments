/**
 * HofstadterButterfly.ts
 * Solves the Harper equation eigenspectrum for 2D square lattices under perpendicular magnetic fields.
 * Generates the self-similar fractal Hofstadter butterfly spectrum for rational flux fractions alpha = p/q.
 */
export class HofstadterButterfly {
    /**
     * Greatest common divisor using Euclidean algorithm.
     */
    static gcd(a, b) {
        let x = Math.abs(Math.round(a));
        let y = Math.abs(Math.round(b));
        while (y !== 0) {
            const temp = y;
            y = x % y;
            x = temp;
        }
        return x;
    }
    /**
     * Computes energy eigenvalues of the Harper equation for a given coprime flux fraction alpha = p/q.
     * Uses real symmetric matrix formulation sampled across the magnetic Brillouin zone.
     */
    static computeHarperSpectrum(p, q, t = 1.0, kSamples = 6) {
        if (q <= 0 || !Number.isInteger(q)) {
            throw new Error(`Invalid denominator q = ${q}. Denominator must be a positive integer.`);
        }
        if (p < 0 || !Number.isInteger(p)) {
            throw new Error(`Invalid numerator p = ${p}. Numerator must be a non-negative integer.`);
        }
        const alpha = (p % q) / q;
        const allEnergies = [];
        // Special case q = 1: standard square lattice without magnetic field
        if (q === 1) {
            for (let ix = 0; ix < kSamples; ix++) {
                const kx = (ix / kSamples) * Math.PI;
                for (let iy = 0; iy < kSamples; iy++) {
                    const ky = (iy / kSamples) * Math.PI;
                    allEnergies.push(-2 * t * (Math.cos(kx) + Math.cos(ky)));
                }
            }
            allEnergies.sort((a, b) => a - b);
            return allEnergies;
        }
        // Special case q = 2: analytical 2x2 matrix
        if (q === 2) {
            for (let ix = 0; ix < kSamples; ix++) {
                const kx = (ix / kSamples) * Math.PI;
                for (let iy = 0; iy < kSamples; iy++) {
                    const ky = (iy / kSamples) * Math.PI;
                    const delta = 2 * t * Math.sqrt(Math.cos(kx) * Math.cos(kx) + Math.cos(ky) * Math.cos(ky));
                    allEnergies.push(-delta, delta);
                }
            }
            allEnergies.sort((a, b) => a - b);
            return allEnergies;
        }
        // General q >= 3: construct q x q symmetric Harper secular matrix
        for (let ikx = 0; ikx < kSamples; ikx++) {
            const kx = (ikx / kSamples) * (2 * Math.PI / q);
            for (let iky = 0; iky < kSamples; iky++) {
                const ky = (iky / kSamples) * (2 * Math.PI);
                // Build q x q Hermitian matrix. Notice that by a gauge transformation,
                // it can be cast into real symmetric form for kx=0, or diagonalized directly.
                // For general (kx, ky), we construct the real symmetric representation:
                const mat = new Float64Array(q * q);
                for (let m = 0; m < q; m++) {
                    // Diagonal: 2 * cos(2 * pi * m * alpha - ky)
                    mat[m * q + m] = 2.0 * t * Math.cos(2.0 * Math.PI * m * alpha - ky);
                    // Sub- and super-diagonals
                    if (m < q - 1) {
                        mat[m * q + (m + 1)] = t;
                        mat[(m + 1) * q + m] = t;
                    }
                }
                // Periodic boundary condition across magnetic unit cell:
                // Corner coupling with phase exp(i * kx * q)
                const cornerCoupling = t * Math.cos(kx * q);
                mat[0 * q + (q - 1)] += cornerCoupling;
                mat[(q - 1) * q + 0] += cornerCoupling;
                const eig = this.jacobiEigenvalues(mat, q);
                for (let e = 0; e < eig.length; e++) {
                    allEnergies.push(eig[e]);
                }
            }
        }
        allEnergies.sort((a, b) => a - b);
        return allEnergies;
    }
    /**
     * Generates the multi-slice Hofstadter Butterfly spectrum for all rational fractions p/q
     * with q up to maxQ.
     */
    static generateButterfly(maxQ = 24, t = 1.0) {
        const points = [];
        // Collect all unique rational numbers p/q in [0, 1]
        const fractions = [];
        fractions.push({ p: 0, q: 1, alpha: 0.0 });
        for (let q = 1; q <= maxQ; q++) {
            for (let p = 1; p < q; p++) {
                if (this.gcd(p, q) === 1) {
                    fractions.push({ p, q, alpha: p / q });
                }
            }
        }
        fractions.push({ p: 1, q: 1, alpha: 1.0 });
        // Sort ascending by alpha
        fractions.sort((a, b) => a.alpha - b.alpha);
        // Compute spectra
        for (const f of fractions) {
            const energies = this.computeHarperSpectrum(f.p, f.q, t, 4);
            points.push({
                alpha: f.alpha,
                p: f.p,
                q: f.q,
                energies
            });
        }
        return points;
    }
    /**
     * Robust Classical Jacobi eigenvalue algorithm for real symmetric N x N matrices.
     * Guarantees unconditional convergence and strictly real eigenvalues.
     */
    static jacobiEigenvalues(aInput, n, maxSweeps = 30) {
        const a = new Float64Array(aInput);
        const d = new Float64Array(n);
        for (let i = 0; i < n; i++) {
            d[i] = a[i * n + i];
        }
        for (let sweep = 0; sweep < maxSweeps; sweep++) {
            let offDiagSum = 0;
            for (let i = 0; i < n - 1; i++) {
                for (let j = i + 1; j < n; j++) {
                    offDiagSum += Math.abs(a[i * n + j]);
                }
            }
            if (offDiagSum < 1e-12)
                break;
            const thresh = sweep < 3 ? 0.2 * offDiagSum / (n * n) : 0.0;
            for (let p = 0; p < n - 1; p++) {
                for (let q = p + 1; q < n; q++) {
                    const g = 100.0 * Math.abs(a[p * n + q]);
                    if (sweep > 3 && Math.abs(d[p]) + g === Math.abs(d[p]) && Math.abs(d[q]) + g === Math.abs(d[q])) {
                        a[p * n + q] = 0.0;
                    }
                    else if (Math.abs(a[p * n + q]) > thresh) {
                        const h = d[q] - d[p];
                        let t;
                        if (Math.abs(h) + g === Math.abs(h)) {
                            t = a[p * n + q] / h;
                        }
                        else {
                            const theta = (0.5 * h) / a[p * n + q];
                            t = 1.0 / (Math.abs(theta) + Math.sqrt(1.0 + theta * theta));
                            if (theta < 0.0)
                                t = -t;
                        }
                        const c = 1.0 / Math.sqrt(1.0 + t * t);
                        const s = t * c;
                        const tau = s / (1.0 + c);
                        const apq = a[p * n + q];
                        a[p * n + q] = 0.0;
                        d[p] -= t * apq;
                        d[q] += t * apq;
                        for (let j = 0; j < p; j++) {
                            const ajp = a[j * n + p];
                            const ajq = a[j * n + q];
                            a[j * n + p] = ajp - s * (ajq + ajp * tau);
                            a[j * n + q] = ajq + s * (ajp - ajq * tau);
                        }
                        for (let j = p + 1; j < q; j++) {
                            const apj = a[p * n + j];
                            const ajq = a[j * n + q];
                            a[p * n + j] = apj - s * (ajq + apj * tau);
                            a[j * n + q] = ajq + s * (apj - ajq * tau);
                        }
                        for (let j = q + 1; j < n; j++) {
                            const apj = a[p * n + j];
                            const aqj = a[q * n + j];
                            a[p * n + j] = apj - s * (aqj + apj * tau);
                            a[q * n + j] = aqj + s * (apj - aqj * tau);
                        }
                    }
                }
            }
        }
        const result = Array.from(d);
        result.sort((a, b) => a - b);
        return result;
    }
}
