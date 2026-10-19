/**
 * PhononDispersionEngine.ts
 * Lattice dynamics and phonon dispersion engine for crystal vibrations.
 * Implements analytical acoustic and optical phonon branches, group velocities,
 * speed of sound, and phonon bandgaps for 1D diatomic and 2D lattices.
 */
import { CONSTANTS } from './PhysicalConstants.js';
export class PhononDispersionEngine {
    /**
     * Computes exact analytical acoustic and optical phonon frequencies for a 1D diatomic chain.
     * Returns { omegaMinus, omegaPlus } in rad/ps (1 rad/ps = 10^12 rad/s = 0.159 THz).
     */
    static computePhononFrequencies(q, // in 1/Angstrom
    params) {
        const { M1_amu, M2_amu, Cs, a_angstrom } = params;
        if (M1_amu <= 0 || M2_amu <= 0) {
            throw new Error('Atomic masses must be strictly positive.');
        }
        if (Cs <= 0) {
            throw new Error('Spring constant Cs must be strictly positive.');
        }
        if (a_angstrom <= 0) {
            throw new Error('Lattice constant a must be strictly positive.');
        }
        // Convert masses from amu to kg
        const m1_kg = M1_amu * CONSTANTS.AMU_KG;
        const m2_kg = M2_amu * CONSTANTS.AMU_KG;
        const a_m = a_angstrom * CONSTANTS.ANGSTROM_M;
        const q_m = q / CONSTANTS.ANGSTROM_M; // Convert 1/Angstrom to 1/m
        const mSum = m1_kg + m2_kg;
        const mProd = m1_kg * m2_kg;
        const mu = mProd / mSum; // Reduced mass
        const sinTerm = Math.sin(0.5 * q_m * a_m);
        const radicand = 1.0 - (4.0 * mProd / (mSum * mSum)) * sinTerm * sinTerm;
        const sqrtTerm = Math.sqrt(Math.max(0.0, radicand));
        const factor = Cs / mu;
        // omega^2 in (rad/s)^2
        // For small q, 1 - sqrtTerm suffers cancellation, so use Taylor expansion for radicand near 1
        let termMinus;
        if (Math.abs(sinTerm) < 1e-4) {
            // 1 - sqrt(1 - x) = x / (1 + sqrt(1 - x))
            const x = (4.0 * mProd / (mSum * mSum)) * sinTerm * sinTerm;
            termMinus = factor * (x / (1.0 + sqrtTerm));
        }
        else {
            termMinus = factor * (1.0 - sqrtTerm);
        }
        const termPlus = factor * (1.0 + sqrtTerm);
        const omegaMinus_rad_s = Math.sqrt(Math.max(0.0, termMinus));
        const omegaPlus_rad_s = Math.sqrt(Math.max(0.0, termPlus));
        // Convert to rad/ps (divide by 10^12)
        return {
            omegaMinus: omegaMinus_rad_s * 1e-12,
            omegaPlus: omegaPlus_rad_s * 1e-12
        };
    }
    /**
     * Speed of sound vs = lim_{q -> 0} d(omega_-)/dq = a * sqrt(Cs / [2(M1 + M2)]) in m/s.
     */
    static computeSoundSpeed(params) {
        const m1_kg = params.M1_amu * CONSTANTS.AMU_KG;
        const m2_kg = params.M2_amu * CONSTANTS.AMU_KG;
        const a_m = params.a_angstrom * CONSTANTS.ANGSTROM_M;
        return a_m * Math.sqrt(params.Cs / (2.0 * (m1_kg + m2_kg)));
    }
    /**
     * Optical phonon frequency at zone center q = 0: omega_+(0) = sqrt(2*Cs*(M1+M2)/(M1*M2)).
     * Returned in rad/ps.
     */
    static computeZoneCenterOpticalFrequency(params) {
        const m1_kg = params.M1_amu * CONSTANTS.AMU_KG;
        const m2_kg = params.M2_amu * CONSTANTS.AMU_KG;
        const omega_rad_s = Math.sqrt((2.0 * params.Cs * (m1_kg + m2_kg)) / (m1_kg * m2_kg));
        return omega_rad_s * 1e-12;
    }
    /**
     * Phonon bandgap Delta_omega at Brillouin zone boundary q = pi / a:
     * Delta_omega = sqrt(2*Cs / min(M1, M2)) - sqrt(2*Cs / max(M1, M2))
     * Returned in rad/ps.
     */
    static computePhononBandgap(params) {
        const m1_kg = params.M1_amu * CONSTANTS.AMU_KG;
        const m2_kg = params.M2_amu * CONSTANTS.AMU_KG;
        const mMin = Math.min(m1_kg, m2_kg);
        const mMax = Math.max(m1_kg, m2_kg);
        const omegaTop_rad_s = Math.sqrt((2.0 * params.Cs) / mMin);
        const omegaBottom_rad_s = Math.sqrt((2.0 * params.Cs) / mMax);
        return (omegaTop_rad_s - omegaBottom_rad_s) * 1e-12;
    }
    /**
     * Analytical group velocity vg = d(omega)/dq in km/s.
     */
    static computeGroupVelocity(q, params, dq = 1e-5) {
        const pPlus = this.computePhononFrequencies(q + dq, params);
        const pMinus = this.computePhononFrequencies(q - dq, params);
        // omega in rad/ps, q in 1/Angstrom
        // d(omega)/dq in (rad/ps) / (1/Angstrom) = (10^12 rad/s) * (10^-10 m) = 100 m/s = 0.1 km/s
        const dOmMinus = (pPlus.omegaMinus - pMinus.omegaMinus) / (2 * dq);
        const dOmPlus = (pPlus.omegaPlus - pMinus.omegaPlus) / (2 * dq);
        return {
            vgMinus: dOmMinus * 0.1, // km/s
            vgPlus: dOmPlus * 0.1 // km/s
        };
    }
    /**
     * Sample complete phonon dispersion curve across the First Brillouin Zone [-pi/a, pi/a].
     */
    static samplePhononCurve(params, numPoints = 100) {
        const qMax = Math.PI / params.a_angstrom;
        const points = [];
        for (let i = 0; i <= numPoints; i++) {
            const q = -qMax + (2 * qMax * i) / numPoints;
            const { omegaMinus, omegaPlus } = this.computePhononFrequencies(q, params);
            const { vgMinus, vgPlus } = this.computeGroupVelocity(q, params);
            points.push({
                q,
                omegaAcoustic: omegaMinus,
                omegaOptical: omegaPlus,
                vgAcoustic: vgMinus,
                vgOptical: vgPlus
            });
        }
        return points;
    }
}
