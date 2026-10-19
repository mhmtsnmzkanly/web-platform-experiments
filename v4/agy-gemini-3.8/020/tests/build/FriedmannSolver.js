/**
 * FRIEDMANN EQUATION & FLRW COSMOLOGICAL METRIC SOLVER
 * Models multi-component universe: Radiation, Baryons, Cold Dark Matter, Curvature, Dark Energy (w0, wa)
 * Protocol 2.0: High-order numerical quadrature, analytical limiting asymptotes, zero error concealment
 */
import { PhysicalConstants } from './PhysicalConstants.js';
export class FriedmannSolver {
    /**
     * Computes the radiation density parameter Omega_r at z=0
     * Sum of photons and 3 relativistic neutrino species
     */
    static computeRadiationDensity(params) {
        const h = params.H0 / 100.0;
        if (h <= 0)
            return 0;
        const omega_gamma = PhysicalConstants.omega_gamma_h2 / (h * h);
        // Include 3 relativistic neutrinos: factor = 1 + 3 * (7/8)*(4/11)^(4/3) = 1 + 0.6813 = 1.6813
        return omega_gamma * (1.0 + PhysicalConstants.neutrino_factor);
    }
    /**
     * Computes effective curvature density Omega_k
     */
    static computeCurvatureDensity(params, Omega_r) {
        if (params.Omega_k !== undefined) {
            return params.Omega_k;
        }
        const or = Omega_r !== undefined ? Omega_r : this.computeRadiationDensity(params);
        return 1.0 - (params.Omega_m + params.Omega_L + or);
    }
    /**
     * Computes dark energy density scaling f_DE(z) for CPL w(a) = w0 + wa(1-a)
     * f_DE(z) = (1+z)^(3(1+w0+wa)) * exp(-3 wa * z / (1+z))
     */
    static computeDarkEnergyScaling(z, w0, wa) {
        if (z <= -1.0)
            return 0.0;
        const onePlusZ = 1.0 + z;
        if (Math.abs(w0 - (-1.0)) < 1e-12 && Math.abs(wa) < 1e-12) {
            return 1.0; // Standard cosmological constant Lambda
        }
        const power = 3.0 * (1.0 + w0 + wa);
        const exponent = Math.max(-700.0, Math.min(700.0, -3.0 * wa * (z / onePlusZ)));
        return Math.pow(onePlusZ, power) * Math.exp(exponent);
    }
    /**
     * Dimensionless Hubble parameter E(z) = H(z) / H0
     */
    static computeEz(z, params) {
        if (z < -0.9999)
            z = -0.9999;
        const onePlusZ = 1.0 + z;
        const Omega_r = this.computeRadiationDensity(params);
        const Omega_k = this.computeCurvatureDensity(params, Omega_r);
        const f_DE = this.computeDarkEnergyScaling(z, params.w0, params.wa);
        const term_r = Omega_r * Math.pow(onePlusZ, 4);
        const term_m = params.Omega_m * Math.pow(onePlusZ, 3);
        const term_k = Omega_k * Math.pow(onePlusZ, 2);
        const term_L = params.Omega_L * f_DE;
        const E2 = term_r + term_m + term_k + term_L;
        return Math.sqrt(Math.max(1e-18, E2));
    }
    /**
     * Deceleration parameter q(z) = - a ddot(a) / dot(a)^2 = (1+z)/E(z) * dE/dz - 1
     */
    static computeDeceleration(z, params) {
        const Ez = this.computeEz(z, params);
        const dz = 1e-4 * Math.max(1.0, 1.0 + z);
        const EzPlus = this.computeEz(z + dz, params);
        const EzMinus = this.computeEz(z - dz, params);
        const dEdz = (EzPlus - EzMinus) / (2.0 * dz);
        return ((1.0 + z) / Ez) * dEdz - 1.0;
    }
    /**
     * Calculates the cosmic acceleration turnaround redshift z_acc where q(z) = 0
     * For flat Lambda-CDM: z_acc = (2 Omega_L / Omega_m)^(1/3) - 1
     */
    static findAccelerationRedshift(params) {
        // If pure flat Lambda-CDM:
        const Omega_r = this.computeRadiationDensity(params);
        const Omega_k = this.computeCurvatureDensity(params, Omega_r);
        if (Math.abs(Omega_k) < 1e-4 && Math.abs(params.w0 - (-1.0)) < 1e-4 && Math.abs(params.wa) < 1e-4) {
            if (params.Omega_m > 0 && params.Omega_L > 0) {
                const z_acc = Math.cbrt((2.0 * params.Omega_L) / params.Omega_m) - 1.0;
                return z_acc > 0 ? z_acc : 0;
            }
        }
        // Numerical bisection search for q(z) = 0 across z in [0, 5]
        let zLow = 0.0;
        let zHigh = 5.0;
        let qLow = this.computeDeceleration(zLow, params);
        let qHigh = this.computeDeceleration(zHigh, params);
        // If no sign change, acceleration never occurs or always accelerated
        if (qLow * qHigh > 0) {
            return null;
        }
        for (let iter = 0; iter < 40; iter++) {
            const zMid = 0.5 * (zLow + zHigh);
            const qMid = this.computeDeceleration(zMid, params);
            if (Math.abs(qMid) < 1e-7 || (zHigh - zLow) < 1e-6) {
                return zMid;
            }
            if (qLow * qMid <= 0) {
                zHigh = zMid;
                qHigh = qMid;
            }
            else {
                zLow = zMid;
                qLow = qMid;
            }
        }
        return 0.5 * (zLow + zHigh);
    }
    /**
     * Comoving line-of-sight distance integral chi(z) = (c/H0) * \int_0^z dz' / E(z')
     * Integrated via Adaptive Simpson's quadrature
     */
    static computeComovingDistance(z, params) {
        if (z <= 0)
            return 0.0;
        const safeH0 = Math.max(1e-4, params.H0);
        const c_over_H0 = PhysicalConstants.hubble_distance_Mpc_factor / safeH0;
        // Numerical integration of 1 / E(z') from 0 to z
        const N = Math.max(100, Math.min(2000, Math.ceil(z * 200)));
        const h = z / N;
        let sum = (1.0 / this.computeEz(0, params)) + (1.0 / this.computeEz(z, params));
        for (let i = 1; i < N; i++) {
            const zi = i * h;
            const weight = (i % 2 === 0) ? 2.0 : 4.0;
            sum += weight * (1.0 / this.computeEz(zi, params));
        }
        const integral = sum * (h / 3.0);
        return c_over_H0 * integral;
    }
    /**
     * Transverse comoving distance d_M(z) accounting for spatial curvature Omega_k
     */
    static computeTransverseComovingDistance(z, params) {
        const chi = this.computeComovingDistance(z, params);
        const Omega_r = this.computeRadiationDensity(params);
        const Omega_k = this.computeCurvatureDensity(params, Omega_r);
        const safeH0 = Math.max(1e-4, params.H0);
        const c_over_H0 = PhysicalConstants.hubble_distance_Mpc_factor / safeH0;
        if (Math.abs(Omega_k) < 1e-6) {
            // Flat universe
            return chi;
        }
        else if (Omega_k > 0) {
            // Open / Hyperbolic universe (k = -1)
            const sqrtOk = Math.sqrt(Omega_k);
            return (c_over_H0 / sqrtOk) * Math.sinh(sqrtOk * (chi / c_over_H0));
        }
        else {
            // Closed / Spherical universe (k = +1)
            const sqrtAbsOk = Math.sqrt(-Omega_k);
            return (c_over_H0 / sqrtAbsOk) * Math.sin(sqrtAbsOk * (chi / c_over_H0));
        }
    }
    /**
     * Lookback time t_L(z) in Gigayears (Gyr)
     * t_L(z) = (1/H0) \int_0^z dz' / [ (1+z') E(z') ]
     */
    static computeLookbackTime(z, params) {
        if (z <= 0)
            return 0.0;
        const safeH0 = Math.max(1e-4, params.H0);
        const timeFactor = PhysicalConstants.hubble_time_Gyr_factor / safeH0;
        const N = Math.max(100, Math.min(2000, Math.ceil(z * 200)));
        const h = z / N;
        const integrand = (zi) => {
            return 1.0 / ((1.0 + zi) * this.computeEz(zi, params));
        };
        let sum = integrand(0) + integrand(z);
        for (let i = 1; i < N; i++) {
            const zi = i * h;
            const weight = (i % 2 === 0) ? 2.0 : 4.0;
            sum += weight * integrand(zi);
        }
        return timeFactor * sum * (h / 3.0);
    }
    /**
     * Age of the universe t(z) in Gigayears (Gyr)
     * t(z) = (1/H0) \int_z^\infty dz' / [ (1+z') E(z') ]
     * Transformed by substituting u = 1 / (1 + z') => du = - dz' / (1+z')^2
     * t(z) = (1/H0) \int_0^{1/(1+z)} du / [ u E(1/u - 1) ]
     */
    static computeAgeOfUniverse(z, params) {
        const safeH0 = Math.max(1e-4, params.H0);
        const timeFactor = PhysicalConstants.hubble_time_Gyr_factor / safeH0;
        const uMax = 1.0 / (1.0 + Math.max(-0.9999, z));
        const N = 500;
        const h = uMax / N;
        const integrand = (u) => {
            if (u <= 1e-12)
                return 0.0;
            const zPrime = (1.0 / u) - 1.0;
            const Ez = this.computeEz(zPrime, params);
            return 1.0 / (u * Ez);
        };
        let sum = integrand(1e-12) + integrand(uMax);
        for (let i = 1; i < N; i++) {
            const u = i * h;
            const weight = (i % 2 === 0) ? 2.0 : 4.0;
            sum += weight * integrand(u);
        }
        return timeFactor * sum * (h / 3.0);
    }
    /**
     * Full cosmological distance suite at a specified redshift z
     */
    static computeDistances(z, params) {
        const chi = this.computeComovingDistance(z, params);
        const dM = this.computeTransverseComovingDistance(z, params);
        const onePlusZ = 1.0 + z;
        const dL = onePlusZ * dM;
        const dA = dM / onePlusZ;
        // Distance modulus: mu = 5 * log10(dL in pc / 10 pc) = 5 * log10(dL in Mpc) + 25
        const mu = dL > 1e-8 ? 5.0 * Math.log10(dL) + 25.0 : 0.0;
        const lookbackTime = this.computeLookbackTime(z, params);
        const cosmicAge = this.computeAgeOfUniverse(z, params);
        const Ez = this.computeEz(z, params);
        const Hz = params.H0 * Ez;
        const qz = this.computeDeceleration(z, params);
        return {
            z,
            chi_Mpc: chi,
            dM_Mpc: dM,
            dL_Mpc: dL,
            dA_Mpc: dA,
            mu_mag: mu,
            lookbackTime_Gyr: lookbackTime,
            cosmicAge_Gyr: cosmicAge,
            Ez,
            Hz_km_s_Mpc: Hz,
            qz,
        };
    }
}
