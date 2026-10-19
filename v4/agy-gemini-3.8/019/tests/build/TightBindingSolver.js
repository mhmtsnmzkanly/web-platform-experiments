/**
 * TightBindingSolver.ts
 * Tight-binding electronic structure solver for 1D and 2D periodic crystal lattices.
 * Implements exact analytical dispersions, Brillouin zone high-symmetry path sampling,
 * continuous Density of States (DOS) integration, and Fermi surface contour extraction.
 */
import { CONSTANTS } from './PhysicalConstants.js';
export class TightBindingSolver {
    /**
     * Analytical energy eigenvalues for Graphene (Honeycomb lattice) with A and B sublattices.
     * Returns [E_minus, E_plus] in eV.
     * At the K point, E = 0.
     */
    static computeGrapheneEnergy(kx, ky, t = CONSTANTS.GRAPHENE_T, acc = CONSTANTS.GRAPHENE_ACC) {
        // Nearest-neighbor vectors in graphene:
        // delta_1 = acc * (0, 1)
        // delta_2 = acc * (sqrt(3)/2, -1/2)
        // delta_3 = acc * (-sqrt(3)/2, -1/2)
        // f(k) = -t * sum_j exp(i k . delta_j)
        // |f(k)|^2 = t^2 * [ 1 + 4*cos(sqrt(3)*kx*acc/2)*cos(3*ky*acc/2) + 4*cos^2(sqrt(3)*kx*acc/2) ]
        const argX = (Math.sqrt(3) / 2) * kx * acc;
        const argY = 1.5 * ky * acc;
        const cosX = Math.cos(argX);
        const term = 1 + 4 * cosX * Math.cos(argY) + 4 * cosX * cosX;
        // Guard against microscopic negative values due to floating-point truncation near Dirac points
        const normF = t * Math.sqrt(Math.max(0, term));
        return [-normF, normF];
    }
    /**
     * Analytical energy dispersion for 2D Square lattice (Single band s-orbital).
     * E(k) = -2t (cos kx*a + cos ky*a) - 4t' (cos kx*a * cos ky*a)
     */
    static computeSquareEnergy(kx, ky, t = 1.0, tp = 0.0, a = 3.0) {
        const cosX = Math.cos(kx * a);
        const cosY = Math.cos(ky * a);
        return -2 * t * (cosX + cosY) - 4 * tp * cosX * cosY;
    }
    /**
     * Analytical energy dispersion for 2D Triangular lattice.
     * E(k) = -2t [ cos(kx*a) + 2*cos(kx*a/2)*cos(sqrt(3)*ky*a/2) ]
     */
    static computeTriangularEnergy(kx, ky, t = 1.0, a = 3.0) {
        const cos1 = Math.cos(kx * a);
        const cos2 = Math.cos(0.5 * kx * a);
        const cos3 = Math.cos((Math.sqrt(3) / 2) * ky * a);
        return -2 * t * (cos1 + 2 * cos2 * cos3);
    }
    /**
     * Compute Dirac cone Fermi velocity v_F = 3 * t * acc / (2 * hbar) in m/s.
     */
    static computeFermiVelocity(t_eV = CONSTANTS.GRAPHENE_T, acc_angstrom = CONSTANTS.GRAPHENE_ACC) {
        const t_joule = t_eV * CONSTANTS.EV_TO_JOULE;
        const acc_meters = acc_angstrom * CONSTANTS.ANGSTROM_M;
        return (1.5 * t_joule * acc_meters) / CONSTANTS.HBAR_SI;
    }
    /**
     * Returns high-symmetry points for a given lattice type.
     */
    static getHighSymmetryPoints(type, latticeParam) {
        if (type === 'SQUARE') {
            const a = latticeParam;
            const piOverA = Math.PI / a;
            return [
                { name: 'Γ', kx: 0, ky: 0 },
                { name: 'X', kx: piOverA, ky: 0 },
                { name: 'M', kx: piOverA, ky: piOverA },
                { name: 'Γ', kx: 0, ky: 0 }
            ];
        }
        else if (type === 'GRAPHENE') {
            const acc = latticeParam;
            // Graphene Dirac point K and M saddle point in 1/Angstrom
            const kKx = (2 * Math.PI) / (3 * Math.sqrt(3) * acc);
            const kKy = (2 * Math.PI) / (3 * acc);
            const kMx = 0;
            const kMy = (2 * Math.PI) / (3 * acc);
            return [
                { name: 'Γ', kx: 0, ky: 0 },
                { name: 'K', kx: kKx, ky: kKy },
                { name: 'M', kx: kMx, ky: kMy },
                { name: 'Γ', kx: 0, ky: 0 }
            ];
        }
        else {
            // Triangular
            const a = latticeParam;
            const kKx = (4 * Math.PI) / (3 * a);
            const kKy = 0;
            const kMx = Math.PI / a;
            const kMy = Math.PI / (Math.sqrt(3) * a);
            return [
                { name: 'Γ', kx: 0, ky: 0 },
                { name: 'K', kx: kKx, ky: kKy },
                { name: 'M', kx: kMx, ky: kMy },
                { name: 'Γ', kx: 0, ky: 0 }
            ];
        }
    }
    /**
     * Sample electronic band structure along high-symmetry paths.
     */
    static computeBandStructurePath(type, params, samplesPerSegment = 80) {
        const points = this.getHighSymmetryPoints(type, params.latticeParam);
        const path = [];
        let cumDist = 0;
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const dkx = p2.kx - p1.kx;
            const dky = p2.ky - p1.ky;
            const segLength = Math.hypot(dkx, dky);
            for (let s = 0; s < samplesPerSegment; s++) {
                const frac = s / samplesPerSegment;
                const curKx = p1.kx + frac * dkx;
                const curKy = p1.ky + frac * dky;
                const dist = cumDist + frac * segLength;
                let energies;
                if (type === 'GRAPHENE') {
                    energies = this.computeGrapheneEnergy(curKx, curKy, params.t, params.latticeParam);
                }
                else if (type === 'SQUARE') {
                    energies = [this.computeSquareEnergy(curKx, curKy, params.t, params.tp ?? 0, params.latticeParam)];
                }
                else {
                    energies = [this.computeTriangularEnergy(curKx, curKy, params.t, params.latticeParam)];
                }
                path.push({
                    kx: curKx,
                    ky: curKy,
                    dist,
                    label: s === 0 ? p1.name : undefined,
                    energies
                });
            }
            cumDist += segLength;
        }
        // Append final point
        const lastP = points[points.length - 1];
        let finalEnergies;
        if (type === 'GRAPHENE') {
            finalEnergies = this.computeGrapheneEnergy(lastP.kx, lastP.ky, params.t, params.latticeParam);
        }
        else if (type === 'SQUARE') {
            finalEnergies = [this.computeSquareEnergy(lastP.kx, lastP.ky, params.t, params.tp ?? 0, params.latticeParam)];
        }
        else {
            finalEnergies = [this.computeTriangularEnergy(lastP.kx, lastP.ky, params.t, params.latticeParam)];
        }
        path.push({
            kx: lastP.kx,
            ky: lastP.ky,
            dist: cumDist,
            label: lastP.name,
            energies: finalEnergies
        });
        return path;
    }
    /**
     * Computes Density of States (DOS) via uniform Brillouin zone sampling.
     */
    static computeDensityOfStates(type, params, gridNx = 80, gridNy = 80, numBins = 100) {
        // Determine energy bounds
        let eMin = -4 * params.t;
        let eMax = 4 * params.t;
        if (type === 'GRAPHENE') {
            eMin = -3.2 * params.t;
            eMax = 3.2 * params.t;
        }
        const binWidth = (eMax - eMin) / numBins;
        const counts = new Float64Array(numBins);
        let totalSamples = 0;
        const kRangeX = (2 * Math.PI) / params.latticeParam;
        const kRangeY = (2 * Math.PI) / params.latticeParam;
        for (let ix = 0; ix < gridNx; ix++) {
            const kx = -kRangeX + (2 * kRangeX * ix) / gridNx;
            for (let iy = 0; iy < gridNy; iy++) {
                const ky = -kRangeY + (2 * kRangeY * iy) / gridNy;
                let energies;
                if (type === 'GRAPHENE') {
                    energies = this.computeGrapheneEnergy(kx, ky, params.t, params.latticeParam);
                }
                else if (type === 'SQUARE') {
                    energies = [this.computeSquareEnergy(kx, ky, params.t, params.tp ?? 0, params.latticeParam)];
                }
                else {
                    energies = [this.computeTriangularEnergy(kx, ky, params.t, params.latticeParam)];
                }
                for (const e of energies) {
                    totalSamples++;
                    const binIdx = Math.floor((e - eMin) / binWidth);
                    if (binIdx >= 0 && binIdx < numBins) {
                        counts[binIdx]++;
                    }
                }
            }
        }
        // Normalize so integral g(E) dE = total states
        const energies = new Array(numBins);
        const dos = new Array(numBins);
        const normFactor = totalSamples > 0 ? 1 / (totalSamples * binWidth) : 1;
        for (let b = 0; b < numBins; b++) {
            energies[b] = eMin + (b + 0.5) * binWidth;
            dos[b] = counts[b] * normFactor;
        }
        return { energies, dos };
    }
    /**
     * Extract Fermi surface contour segments using Marching Squares across the First Brillouin Zone.
     */
    static computeFermiSurfaceContours(type, params, ef, gridN = 60) {
        const kMax = (2 * Math.PI) / params.latticeParam;
        const step = (2 * kMax) / gridN;
        // Build scalar grid V(ix, iy) = E(kx, ky) - ef
        // For graphene, pick branch closer to ef
        const grid = [];
        for (let ix = 0; ix <= gridN; ix++) {
            grid[ix] = [];
            const kx = -kMax + ix * step;
            for (let iy = 0; iy <= gridN; iy++) {
                const ky = -kMax + iy * step;
                let eVal;
                if (type === 'GRAPHENE') {
                    const [eMinus, ePlus] = this.computeGrapheneEnergy(kx, ky, params.t, params.latticeParam);
                    eVal = Math.abs(eMinus - ef) < Math.abs(ePlus - ef) ? eMinus : ePlus;
                }
                else if (type === 'SQUARE') {
                    eVal = this.computeSquareEnergy(kx, ky, params.t, params.tp ?? 0, params.latticeParam);
                }
                else {
                    eVal = this.computeTriangularEnergy(kx, ky, params.t, params.latticeParam);
                }
                grid[ix][iy] = eVal - ef;
            }
        }
        // Marching squares
        const segments = [];
        for (let ix = 0; ix < gridN; ix++) {
            const kx0 = -kMax + ix * step;
            const kx1 = kx0 + step;
            for (let iy = 0; iy < gridN; iy++) {
                const ky0 = -kMax + iy * step;
                const ky1 = ky0 + step;
                const v0 = grid[ix][iy]; // bottom-left
                const v1 = grid[ix + 1][iy]; // bottom-right
                const v2 = grid[ix + 1][iy + 1]; // top-right
                const v3 = grid[ix][iy + 1]; // top-left
                let cellIndex = 0;
                if (v0 > 0)
                    cellIndex |= 1;
                if (v1 > 0)
                    cellIndex |= 2;
                if (v2 > 0)
                    cellIndex |= 4;
                if (v3 > 0)
                    cellIndex |= 8;
                if (cellIndex === 0 || cellIndex === 15)
                    continue;
                // Linear interpolation helpers along cell edges
                const lerpBottom = (x0, x1, va, vb) => {
                    const t = Math.abs(va - vb) > 1e-9 ? -va / (vb - va) : 0.5;
                    return x0 + t * (x1 - x0);
                };
                const edgeBottom = [lerpBottom(kx0, kx1, v0, v1), ky0];
                const edgeRight = [kx1, lerpBottom(ky0, ky1, v1, v2)];
                const edgeTop = [lerpBottom(kx0, kx1, v3, v2), ky1];
                const edgeLeft = [kx0, lerpBottom(ky0, ky1, v0, v3)];
                switch (cellIndex) {
                    case 1:
                    case 14:
                        segments.push({ x1: edgeLeft[0], y1: edgeLeft[1], x2: edgeBottom[0], y2: edgeBottom[1] });
                        break;
                    case 2:
                    case 13:
                        segments.push({ x1: edgeBottom[0], y1: edgeBottom[1], x2: edgeRight[0], y2: edgeRight[1] });
                        break;
                    case 3:
                    case 12:
                        segments.push({ x1: edgeLeft[0], y1: edgeLeft[1], x2: edgeRight[0], y2: edgeRight[1] });
                        break;
                    case 4:
                    case 11:
                        segments.push({ x1: edgeRight[0], y1: edgeRight[1], x2: edgeTop[0], y2: edgeTop[1] });
                        break;
                    case 5:
                        segments.push({ x1: edgeLeft[0], y1: edgeLeft[1], x2: edgeTop[0], y2: edgeTop[1] });
                        segments.push({ x1: edgeBottom[0], y1: edgeBottom[1], x2: edgeRight[0], y2: edgeRight[1] });
                        break;
                    case 6:
                    case 9:
                        segments.push({ x1: edgeBottom[0], y1: edgeBottom[1], x2: edgeTop[0], y2: edgeTop[1] });
                        break;
                    case 7:
                    case 8:
                        segments.push({ x1: edgeLeft[0], y1: edgeLeft[1], x2: edgeTop[0], y2: edgeTop[1] });
                        break;
                    case 10:
                        segments.push({ x1: edgeLeft[0], y1: edgeLeft[1], x2: edgeBottom[0], y2: edgeBottom[1] });
                        segments.push({ x1: edgeTop[0], y1: edgeTop[1], x2: edgeRight[0], y2: edgeRight[1] });
                        break;
                }
            }
        }
        return segments;
    }
}
