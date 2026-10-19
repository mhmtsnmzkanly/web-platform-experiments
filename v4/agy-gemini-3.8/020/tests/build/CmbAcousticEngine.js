/**
 * COSMIC MICROWAVE BACKGROUND (CMB) ACOUSTIC SPECTRUM & RECOMBINATION ENGINE
 * Models photon-baryon plasma sound horizon, Hu-Sugiyama recombination,
 * angular power spectrum D_ell = ell(ell+1) C_ell / (2pi), and real spherical harmonics Y_ell^m
 */
import { PhysicalConstants } from './PhysicalConstants.js';
import { FriedmannSolver } from './FriedmannSolver.js';
export class CmbAcousticEngine {
    /**
     * Recombination redshift z_* (Hu & Sugiyama 1996 fitting formula)
     */
    static computeRecombinationZ(params) {
        const h = params.H0 / 100.0;
        const om_b_h2 = params.Omega_b * h * h;
        const om_m_h2 = params.Omega_m * h * h;
        const g1 = (0.0783 * Math.pow(om_b_h2, -0.238)) / (1.0 + 39.5 * Math.pow(om_b_h2, 0.763));
        const g2 = 0.560 / (1.0 + 21.1 * Math.pow(om_b_h2, 1.81));
        const factor1 = 1.0 + 0.00124 * Math.pow(om_b_h2, -0.738);
        const factor2 = 1.0 + g1 * Math.pow(om_m_h2, g2);
        return 1048.0 * factor1 * factor2;
    }
    /**
     * Baryon-to-photon momentum density ratio R(z) = 3 rho_b / (4 rho_gamma)
     */
    static computeBaryonPhotonRatio(z, params) {
        const h = params.H0 / 100.0;
        const om_b_h2 = params.Omega_b * h * h;
        return 31.5 * om_b_h2 * (1000.0 / (1.0 + z));
    }
    /**
     * Sound speed in photon-baryon fluid c_s(z) in m/s
     * c_s(z) = c / sqrt(3 * (1 + R(z)))
     */
    static computeSoundSpeed(z, params) {
        const R = this.computeBaryonPhotonRatio(z, params);
        return PhysicalConstants.c / Math.sqrt(3.0 * (1.0 + R));
    }
    /**
     * Comoving sound horizon r_s(z_*) at photon decoupling in Megaparsecs (Mpc)
     * r_s(z_*) = (c / H0) \int_{z_*}^\infty dz' / [ sqrt(3(1+R(z'))) E(z') ]
     */
    static computeSoundHorizon(params, zDecoupling) {
        const zStar = zDecoupling ?? this.computeRecombinationZ(params);
        const c_over_H0 = PhysicalConstants.hubble_distance_Mpc_factor / params.H0;
        // Numerical integration from zStar to zMax = 1e6
        // Use logarithmic transformation: v = ln(1+z') => dz' = (1+z') dv
        const vMin = Math.log(1.0 + zStar);
        const vMax = Math.log(1.0 + 1e6);
        const N = 400;
        const dv = (vMax - vMin) / N;
        const integrand = (v) => {
            const zPrime = Math.exp(v) - 1.0;
            const R = this.computeBaryonPhotonRatio(zPrime, params);
            const cs_norm = 1.0 / Math.sqrt(3.0 * (1.0 + R));
            const Ez = FriedmannSolver.computeEz(zPrime, params);
            // dz' / E(z') = exp(v) dv / E(z')
            return (cs_norm / Ez) * Math.exp(v);
        };
        let sum = integrand(vMin) + integrand(vMax);
        for (let i = 1; i < N; i++) {
            const v = vMin + i * dv;
            const weight = (i % 2 === 0) ? 2.0 : 4.0;
            sum += weight * integrand(v);
        }
        const integral = sum * (dv / 3.0);
        return c_over_H0 * integral;
    }
    /**
     * Computes the acoustic scale ell_A and primary acoustic peak multipole ell_1
     * ell_A = pi * d_M(z_*) / r_s(z_*)
     * ell_1 = ell_A * (1 - phi_1)
     */
    static computeFirstAcousticPeak(params) {
        const zStar = this.computeRecombinationZ(params);
        const rs = this.computeSoundHorizon(params, zStar);
        const dM = FriedmannSolver.computeTransverseComovingDistance(zStar, params);
        const thetaStar = rs / dM;
        const ell_A = Math.PI / thetaStar;
        // Gravitational potential phase shift phi_1 ~ 0.267
        const h = params.H0 / 100.0;
        const om_b_h2 = params.Omega_b * h * h;
        const phi_1 = 0.267 * Math.pow(om_b_h2 / 0.0224, 0.1);
        const ell1 = ell_A * (1.0 - phi_1);
        return {
            zStar,
            rs_Mpc: rs,
            dM_Mpc: dM,
            thetaStar_rad: thetaStar,
            ell_A,
            ell1,
        };
    }
    /**
     * Generates the complete CMB Temperature Power Spectrum D_ell = ell(ell+1) C_ell / (2pi)
     * from ell = 2 to 2500 in muK^2
     */
    static computePowerSpectrum(params) {
        const { ell1 } = this.computeFirstAcousticPeak(params);
        const h = params.H0 / 100.0;
        const om_b_h2 = params.Omega_b * h * h;
        const om_c_h2 = (params.Omega_m - params.Omega_b) * h * h;
        // Baryon loading asymmetry parameter (enhances odd peaks, suppresses even peaks)
        const Rb = 0.55 * (om_b_h2 / 0.0224);
        // Cold dark matter potential depth (enhances 3rd peak)
        const cdmBoost = 0.40 * Math.sqrt(Math.max(0.0, om_c_h2) / 0.120);
        // Silk damping scale ell_D
        const ellD = 1420.0 * Math.pow(om_b_h2 / 0.0224, 0.25) * Math.pow(params.Omega_m / 0.315, 0.1);
        const spectrum = [];
        const peakMultipoles = [];
        // Base Sachs-Wolfe plateau amplitude (~ 1050 muK^2)
        const Asw = 1050.0;
        // Peak height prefactor (~ 5700 muK^2 at first peak)
        const Apeak = 5650.0 * (1.0 + 0.3 * (om_b_h2 / 0.0224 - 1.0));
        // Phase shift parameter for acoustic peaks
        const phi = 0.267 * Math.pow(om_b_h2 / 0.0224, 0.1);
        for (let ell = 2; ell <= 2500; ell += (ell < 100 ? 2 : ell < 500 ? 4 : 8)) {
            // 1. Sachs-Wolfe contribution (dominant at ell < 40)
            const fSW = Math.exp(-Math.pow(ell / 55.0, 2.0));
            const dSW = Asw * (1.0 + 0.4 * Math.exp(-Math.pow((ell - 10) / 15.0, 2.0))) * fSW;
            // 2. Acoustic oscillations
            const x = (Math.PI * (ell / ell1)) - phi;
            // Acoustic envelope with baryon modulation
            const osc = Math.cos(x);
            const oddEvenModulation = (osc > 0) ? (1.0 + Rb) : (1.0 - 0.65 * Rb);
            const envelope = Math.pow(osc * oddEvenModulation, 2.0);
            // Early Integrated Sachs-Wolfe (eISW) boost near first peak
            const eISW = 1800.0 * Math.exp(-Math.pow((ell - ell1) / 90.0, 2.0));
            // Third peak CDM enhancement
            const thirdPeakBoost = cdmBoost * 1200.0 * Math.exp(-Math.pow((ell - 2.8 * ell1) / 140.0, 2.0));
            // Silk damping envelope: exp(- 2 * (ell / ellD)^1.2)
            const damping = Math.exp(-2.0 * Math.pow(ell / ellD, 1.25));
            // Low-ell turn-on factor for acoustic peaks
            const turnOn = 1.0 - Math.exp(-Math.pow(ell / 80.0, 2.0));
            const dAcoustic = (Apeak * envelope + eISW + thirdPeakBoost) * turnOn * damping;
            const totalDell = dSW + dAcoustic;
            spectrum.push({ ell, Dell_uK2: totalDell });
        }
        // Identify acoustic peak locations (ell >= 140)
        for (let i = 1; i < spectrum.length - 1; i++) {
            if (spectrum[i].ell >= 140 &&
                spectrum[i].Dell_uK2 > spectrum[i - 1].Dell_uK2 &&
                spectrum[i].Dell_uK2 > spectrum[i + 1].Dell_uK2 &&
                spectrum[i].Dell_uK2 > 1500) {
                spectrum[i].isPeak = true;
                peakMultipoles.push(spectrum[i].ell);
            }
        }
        return { spectrum, peakMultipoles };
    }
    /**
     * Planck 2018 observational binned CMB TT power spectrum points
     * for live visual overlay and scientific fidelity validation
     */
    static getPlanck2018Dataset() {
        return [
            { ell: 2, Dell: 228.3, errPlus: 290.0, errMinus: 120.0 },
            { ell: 10, Dell: 742.1, errPlus: 180.0, errMinus: 150.0 },
            { ell: 30, Dell: 1120.4, errPlus: 120.0, errMinus: 110.0 },
            { ell: 80, Dell: 1980.2, errPlus: 105.0, errMinus: 100.0 },
            { ell: 140, Dell: 3450.6, errPlus: 95.0, errMinus: 90.0 },
            { ell: 220, Dell: 5740.8, errPlus: 55.0, errMinus: 50.0 }, // First peak
            { ell: 300, Dell: 4210.3, errPlus: 45.0, errMinus: 40.0 },
            { ell: 400, Dell: 2230.1, errPlus: 35.0, errMinus: 30.0 },
            { ell: 540, Dell: 2580.4, errPlus: 30.0, errMinus: 30.0 }, // Second peak
            { ell: 680, Dell: 1890.2, errPlus: 28.0, errMinus: 28.0 },
            { ell: 810, Dell: 2520.6, errPlus: 25.0, errMinus: 25.0 }, // Third peak
            { ell: 950, Dell: 1480.1, errPlus: 24.0, errMinus: 24.0 },
            { ell: 1120, Dell: 1280.5, errPlus: 22.0, errMinus: 22.0 }, // Fourth peak
            { ell: 1350, Dell: 820.4, errPlus: 20.0, errMinus: 20.0 },
            { ell: 1600, Dell: 410.2, errPlus: 18.0, errMinus: 18.0 },
            { ell: 1900, Dell: 195.1, errPlus: 16.0, errMinus: 16.0 },
            { ell: 2200, Dell: 85.3, errPlus: 14.0, errMinus: 14.0 },
            { ell: 2500, Dell: 36.7, errPlus: 12.0, errMinus: 12.0 },
        ];
    }
    /**
     * Computes the Real Spherical Harmonic Y_ell^m(theta, phi)
     * for interactive 3D multipole surface visualization
     */
    static computeSphericalHarmonic(ell, m, theta, phi) {
        const absM = Math.abs(m);
        if (absM > ell)
            return 0.0;
        const x = Math.cos(theta);
        // Associated Legendre Polynomial P_ell^m(x)
        const Plm = this.evaluateLegendrePolynomial(ell, absM, x);
        // Normalization constant N_ell^m = sqrt( (2*ell + 1) / (4*pi) * (ell - m)! / (ell + m)! )
        let factorialRatio = 1.0;
        for (let i = ell - absM + 1; i <= ell + absM; i++) {
            factorialRatio /= i;
        }
        const norm = Math.sqrt(((2.0 * ell + 1.0) / (4.0 * Math.PI)) * factorialRatio);
        if (m === 0) {
            return norm * Plm;
        }
        else if (m > 0) {
            return Math.SQRT2 * norm * Plm * Math.cos(m * phi);
        }
        else {
            return Math.SQRT2 * norm * Plm * Math.sin(absM * phi);
        }
    }
    /**
     * Evaluates Associated Legendre Polynomial P_ell^m(x) via standard recurrence
     */
    static evaluateLegendrePolynomial(ell, m, x) {
        let pmm = 1.0;
        if (m > 0) {
            const somx2 = Math.sqrt(Math.max(0.0, (1.0 - x) * (1.0 + x)));
            let fact = 1.0;
            for (let i = 1; i <= m; i++) {
                pmm *= -fact * somx2;
                fact += 2.0;
            }
        }
        if (ell === m)
            return pmm;
        let pmmp1 = x * (2.0 * m + 1.0) * pmm;
        if (ell === m + 1)
            return pmmp1;
        let pll = 0.0;
        for (let ll = m + 2; ll <= ell; ll++) {
            pll = (x * (2.0 * ll - 1.0) * pmmp1 - (ll + m - 1.0) * pmm) / (ll - m);
            pmm = pmmp1;
            pmmp1 = pll;
        }
        return pll;
    }
}
