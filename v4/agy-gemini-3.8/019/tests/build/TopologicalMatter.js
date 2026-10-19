/**
 * TopologicalMatter.ts
 * Topological quantum matter engine.
 * Implements:
 * 1. 1D Su-Schrieffer-Heeger (SSH) model (winding number, bulk gap, zero-energy boundary solitons).
 * 2. 2D Haldane model (broken time-reversal symmetry, Berry curvature, Fukui-Hatsugai-Suzuki Chern number, chiral edge states).
 */
export class TopologicalMatter {
    // ==========================================
    // 1D SU-SCHRIEFFER-HEEGER (SSH) MODEL
    // ==========================================
    /**
     * Bulk energy eigenvalues for 1D SSH model at momentum k in [-pi, pi].
     * E_pm(k) = +/- sqrt(t1^2 + t2^2 + 2*t1*t2*cos(k))
     */
    static computeSshBulkEnergy(k, t1, t2) {
        const dx = t1 + t2 * Math.cos(k);
        const dy = t2 * Math.sin(k);
        const e = Math.sqrt(dx * dx + dy * dy);
        return [-e, e];
    }
    /**
     * Topological winding number nu for 1D SSH model.
     * Closed-form contour integration of (dx * d(dy) - dy * d(dx)) / (dx^2 + dy^2).
     * nu = 1 when |t1| < |t2| (Topological phase), nu = 0 when |t1| > |t2| (Trivial phase).
     */
    static computeSshWindingNumber(t1, t2, steps = 200) {
        // If t1 == t2, band gap is closed (metallic transition)
        if (Math.abs(t1 - t2) < 1e-9)
            return 0.5;
        let totalAngle = 0;
        const dk = (2 * Math.PI) / steps;
        for (let i = 0; i < steps; i++) {
            const k1 = -Math.PI + i * dk;
            const k2 = k1 + dk;
            const dx1 = t1 + t2 * Math.cos(k1);
            const dy1 = t2 * Math.sin(k1);
            const dx2 = t1 + t2 * Math.cos(k2);
            const dy2 = t2 * Math.sin(k2);
            const phi1 = Math.atan2(dy1, dx1);
            const phi2 = Math.atan2(dy2, dx2);
            let dphi = phi2 - phi1;
            while (dphi > Math.PI)
                dphi -= 2 * Math.PI;
            while (dphi < -Math.PI)
                dphi += 2 * Math.PI;
            totalAngle += dphi;
        }
        const winding = Math.round(totalAngle / (2 * Math.PI));
        return winding;
    }
    /**
     * Diagonalizes a finite 1D SSH chain of N dimers (2N sites) with Open Boundary Conditions (OBC).
     * Returns all 2N sorted energy eigenvalues.
     * In topological phase (t1 < t2), two eigenvalues will be exponentially close to zero.
     */
    static computeSshFiniteChain(t1, t2, numDimers = 20) {
        const dim = 2 * numDimers;
        // Real symmetric tridiagonal matrix
        // Diagonal is 0 (chiral symmetry)
        // Off-diagonals alternate: t1, t2, t1, t2, ...
        const d = new Float64Array(dim);
        const e = new Float64Array(dim);
        for (let i = 0; i < dim - 1; i++) {
            e[i] = i % 2 === 0 ? t1 : t2;
        }
        return this.diagonalizeSymmetricTridiagonal(d, e);
    }
    // ==========================================
    // 2D HALDANE MODEL (QUANTUM ANOMALOUS HALL)
    // ==========================================
    /**
     * Evaluates the d-vector components d_0, d_x, d_y, d_z for the Haldane Hamiltonian
     * H(k) = d_0 * I + d_x * sigma_x + d_y * sigma_y + d_z * sigma_z
     */
    static computeHaldaneDVector(kx, ky, params, a = 1.0 // Normalized unit cell length
    ) {
        const { t1, t2, phi, M } = params;
        // Nearest-neighbor vectors in graphene lattice (bond length a_cc = a/sqrt(3)):
        // delta_1 = a/sqrt(3) * (0, 1)
        // delta_2 = a/sqrt(3) * (sqrt(3)/2, -1/2)
        // delta_3 = a/sqrt(3) * (-sqrt(3)/2, -1/2)
        const acc = a / Math.sqrt(3);
        const kDotDelta1 = ky * acc;
        const kDotDelta2 = (Math.sqrt(3) / 2 * kx - 0.5 * ky) * acc;
        const kDotDelta3 = (-Math.sqrt(3) / 2 * kx - 0.5 * ky) * acc;
        const dx = -t1 * (Math.cos(kDotDelta1) + Math.cos(kDotDelta2) + Math.cos(kDotDelta3));
        const dy = -t1 * (Math.sin(kDotDelta1) + Math.sin(kDotDelta2) + Math.sin(kDotDelta3));
        // Next-nearest-neighbor vectors:
        // v_1 = a * (sqrt(3)/2, 1/2)  or primitive vectors:
        // a1 = a*(sqrt(3)/2, 3/2 * 1/sqrt(3)) ... let's use standard v_j:
        // v_1 = (sqrt(3)*acc, 0) = (a, 0)
        // v_2 = (-a/2, sqrt(3)*a/2)
        // v_3 = (-a/2, -sqrt(3)*a/2)
        const kDotV1 = kx * a;
        const kDotV2 = -0.5 * kx * a + (Math.sqrt(3) / 2) * ky * a;
        const kDotV3 = -0.5 * kx * a - (Math.sqrt(3) / 2) * ky * a;
        const cosSum = Math.cos(kDotV1) + Math.cos(kDotV2) + Math.cos(kDotV3);
        const sinSum = Math.sin(kDotV1) + Math.sin(kDotV2) + Math.sin(kDotV3);
        const d0 = 2 * t2 * Math.cos(phi) * cosSum;
        const dz = M - 2 * t2 * Math.sin(phi) * sinSum;
        const dNorm = Math.sqrt(dx * dx + dy * dy + dz * dz);
        return { d0, dx, dy, dz, dNorm };
    }
    /**
     * Energy eigenvalues of the Haldane model at momentum (kx, ky).
     * E_pm(k) = d_0(k) +/- |d(k)|
     */
    static computeHaldaneEnergy(kx, ky, params, a = 1.0) {
        const { d0, dNorm } = this.computeHaldaneDVector(kx, ky, params, a);
        return [d0 - dNorm, d0 + dNorm];
    }
    /**
     * Analytical Dirac mass gap at Dirac points K and K'.
     * m_D(K)  = M - 3*sqrt(3)*t2*sin(phi)
     * m_D(K') = M + 3*sqrt(3)*t2*sin(phi)
     */
    static computeDiracMasses(params) {
        const shift = 3 * Math.sqrt(3) * params.t2 * Math.sin(params.phi);
        return {
            mK: params.M - shift,
            mKprime: params.M + shift
        };
    }
    /**
     * Evaluates the Berry curvature Omega_xy(k) of the lower occupied band:
     * Omega_xy(k) = 0.5 * [ d . ( partial_kx d x partial_ky d ) ] / |d|^3
     */
    static computeBerryCurvature(kx, ky, params, a = 1.0, dk = 1e-4) {
        const dCenter = this.computeHaldaneDVector(kx, ky, params, a);
        if (dCenter.dNorm < 1e-12)
            return 0;
        // Central difference partial derivatives
        const dKxPlus = this.computeHaldaneDVector(kx + dk, ky, params, a);
        const dKxMinus = this.computeHaldaneDVector(kx - dk, ky, params, a);
        const dKyPlus = this.computeHaldaneDVector(kx, ky + dk, params, a);
        const dKyMinus = this.computeHaldaneDVector(kx, ky - dk, params, a);
        const d_dx_x = (dKxPlus.dx - dKxMinus.dx) / (2 * dk);
        const d_dx_y = (dKxPlus.dy - dKxMinus.dy) / (2 * dk);
        const d_dx_z = (dKxPlus.dz - dKxMinus.dz) / (2 * dk);
        const d_dy_x = (dKyPlus.dx - dKyMinus.dx) / (2 * dk);
        const d_dy_y = (dKyPlus.dy - dKyMinus.dy) / (2 * dk);
        const d_dy_z = (dKyPlus.dz - dKyMinus.dz) / (2 * dk);
        // Cross product: partial_kx d x partial_ky d
        const crossX = d_dx_y * d_dy_z - d_dx_z * d_dy_y;
        const crossY = d_dx_z * d_dy_x - d_dx_x * d_dy_z;
        const crossZ = d_dx_x * d_dy_y - d_dx_y * d_dy_x;
        // Dot product with d vector
        const dot = dCenter.dx * crossX + dCenter.dy * crossY + dCenter.dz * crossZ;
        const d3 = dCenter.dNorm * dCenter.dNorm * dCenter.dNorm;
        return (-0.5 * dot) / d3;
    }
    /**
     * Computes the first Chern number C via numerical integration of Berry curvature over FBZ,
     * or via the exact analytical half-integer Dirac mass indices:
     * C = 1/2 * [ sgn(m_D(K')) - sgn(m_D(K)) ]
     */
    static computeAnalyticalChernNumber(params) {
        const { mK, mKprime } = this.computeDiracMasses(params);
        const sgnK = Math.abs(mK) < 1e-10 ? 0 : Math.sign(mK);
        const sgnKprime = Math.abs(mKprime) < 1e-10 ? 0 : Math.sign(mKprime);
        return Math.round(0.5 * (sgnKprime - sgnK));
    }
    /**
     * Computes Chern number by integrating Berry curvature over a uniform 2D grid in reciprocal space
     * parametrized by the dual reciprocal lattice basis vectors b1 and b2.
     */
    static computeNumericalChernNumber(params, gridN = 36, a = 1.0) {
        const b1 = [(2 * Math.PI / a), (2 * Math.PI / (Math.sqrt(3) * a))];
        const b2 = [(2 * Math.PI / a), (-2 * Math.PI / (Math.sqrt(3) * a))];
        const omegaBZ = (8 * Math.PI * Math.PI) / (Math.sqrt(3) * a * a);
        let sum = 0;
        for (let i = 0; i < gridN; i++) {
            const t1 = (i + 0.5) / gridN;
            for (let j = 0; j < gridN; j++) {
                const t2 = (j + 0.5) / gridN;
                const kx = t1 * b1[0] + t2 * b2[0];
                const ky = t1 * b1[1] + t2 * b2[1];
                sum += this.computeBerryCurvature(kx, ky, params, a);
            }
        }
        const cVal = (sum * omegaBZ) / (2 * Math.PI * gridN * gridN);
        return Math.round(cVal);
    }
    /**
     * Computes Chern number via the gauge-invariant Fukui-Hatsugai-Suzuki (FHS 2005) discrete link product:
     * U_mu(k) = <psi(k)|psi(k + mu)> / |<psi(k)|psi(k + mu)>|
     * F_12(k) = ln( U_1(k) U_2(k+1) U_1*(k+2) U_2*(k) )
     * C = (1 / 2*pi*i) sum_k F_12(k) in Z
     * Strictly and manifestly integer-quantized on any discrete torus mesh.
     */
    static computeChernNumberFHS(params, gridN = 24, a = 1.0) {
        const b1 = [(2 * Math.PI / a), (2 * Math.PI / (Math.sqrt(3) * a))];
        const b2 = [(2 * Math.PI / a), (-2 * Math.PI / (Math.sqrt(3) * a))];
        // Helper: compute normalized lower eigenvector [c1_re, c1_im, c2_re, c2_im]
        const getLowerVec = (dx, dy, dz) => {
            const d = Math.hypot(dx, dy, dz);
            if (d < 1e-12)
                return [1, 0, 0, 0];
            if (dz <= 0) {
                const norm = Math.sqrt(2 * d * (d - dz));
                return [-dx / norm, dy / norm, (d - dz) / norm, 0];
            }
            else {
                const norm = Math.sqrt(2 * d * (d + dz));
                return [-(d + dz) / norm, 0, dx / norm, dy / norm];
            }
        };
        // Helper: normalized inner product <v1 | v2> = [re, im]
        const linkU = (v1, v2) => {
            const re = (v1[0] * v2[0] + v1[1] * v2[1]) + (v1[2] * v2[2] + v1[3] * v2[3]);
            const im = (v1[0] * v2[1] - v1[1] * v2[0]) + (v1[2] * v2[3] - v1[3] * v2[2]);
            const mag = Math.hypot(re, im);
            if (mag < 1e-12)
                return [1, 0];
            return [re / mag, im / mag];
        };
        const multC = (u1, u2) => [
            u1[0] * u2[0] - u1[1] * u2[1],
            u1[0] * u2[1] + u1[1] * u2[0]
        ];
        // 1. Grid of eigenvectors on BZ torus
        const psi = [];
        for (let i = 0; i < gridN; i++) {
            psi[i] = [];
            const t1 = i / gridN;
            for (let j = 0; j < gridN; j++) {
                const t2 = j / gridN;
                const kx = t1 * b1[0] + t2 * b2[0];
                const ky = t1 * b1[1] + t2 * b2[1];
                const d = this.computeHaldaneDVector(kx, ky, params, a);
                psi[i][j] = getLowerVec(d.dx, d.dy, d.dz);
            }
        }
        // 2. Plaquette flux sum
        let totalFlux = 0;
        for (let i = 0; i < gridN; i++) {
            const iNext = (i + 1) % gridN;
            for (let j = 0; j < gridN; j++) {
                const jNext = (j + 1) % gridN;
                const u1_ij = linkU(psi[i][j], psi[iNext][j]);
                const u2_i1j = linkU(psi[iNext][j], psi[iNext][jNext]);
                const u1_ij1 = linkU(psi[i][jNext], psi[iNext][jNext]);
                const u2_ij = linkU(psi[i][j], psi[i][jNext]);
                let p = multC(u1_ij, u2_i1j);
                p = multC(p, [u1_ij1[0], -u1_ij1[1]]); // conj(u1_ij1)
                p = multC(p, [u2_ij[0], -u2_ij[1]]); // conj(u2_ij)
                const f12 = Math.atan2(p[1], p[0]);
                totalFlux += f12;
            }
        }
        return Math.round(totalFlux / (2 * Math.PI));
    }
    // ==========================================
    // SYMMETRIC TRIDIAGONAL EIGENSOLVER (QL / QR)
    // ==========================================
    /**
     * Fast, stable implicit symmetric tridiagonal QL/QR algorithm for eigenvalue decomposition.
     * Takes diagonal d and sub-diagonal e, returns sorted eigenvalues.
     */
    static diagonalizeSymmetricTridiagonal(diagInput, subdiagInput) {
        const n = diagInput.length;
        const d = new Float64Array(diagInput);
        const e = new Float64Array(subdiagInput);
        for (let l = 0; l < n; l++) {
            let iter = 0;
            let m = l;
            do {
                m = l;
                while (m < n - 1) {
                    const dd = Math.abs(d[m]) + Math.abs(d[m + 1]);
                    if (Math.abs(e[m]) + dd === dd)
                        break;
                    m++;
                }
                if (m !== l) {
                    if (iter++ === 60) {
                        throw new Error('Symmetric tridiagonal QL failed to converge in 60 iterations.');
                    }
                    let g = (d[l + 1] - d[l]) / (2.0 * e[l]);
                    let r = Math.hypot(g, 1.0);
                    g = d[m] - d[l] + e[l] / (g + (g >= 0 ? Math.abs(r) : -Math.abs(r)));
                    let s = 1.0;
                    let c = 1.0;
                    let p = 0.0;
                    let i = m - 1;
                    while (i >= l) {
                        let f = s * e[i];
                        let b = c * e[i];
                        r = Math.hypot(f, g);
                        e[i + 1] = r;
                        if (r === 0.0) {
                            d[i + 1] -= p;
                            e[m] = 0.0;
                            break;
                        }
                        s = f / r;
                        c = g / r;
                        g = d[i + 1] - p;
                        r = (d[i] - g) * s + 2.0 * c * b;
                        p = s * r;
                        d[i + 1] = g + p;
                        g = c * r - b;
                        i--;
                    }
                    if (r === 0.0 && i >= l)
                        continue;
                    d[l] -= p;
                    e[l] = g;
                    e[m] = 0.0;
                }
            } while (m !== l);
        }
        // Sort ascending
        const result = Array.from(d);
        result.sort((a, b) => a - b);
        return result;
    }
}
