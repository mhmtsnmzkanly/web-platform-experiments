/**
 * BIG BANG NUCLEOSYNTHESIS (BBN) PRIMORDIAL KINETICS ENGINE
 * Models weak freeze-out (T ~ 0.8 MeV), free neutron beta decay through
 * the deuterium bottleneck (t ~ 180 s), Helium-4 mass fraction Y_p,
 * and primordial trace abundances (D/H, 3He/H, 7Li/H) vs baryon density.
 */
import { PhysicalConstants } from './PhysicalConstants.js';
export class BbnKineticsEngine {
    /**
     * Computes the baryon-to-photon ratio eta_10 = 10^10 * (n_b / n_gamma)
     * eta_10 = 274.0 * Omega_b * h^2
     */
    static computeBaryonToPhotonRatio(params) {
        const h = params.H0 / 100.0;
        const om_b_h2 = params.Omega_b * h * h;
        return 274.0 * om_b_h2;
    }
    /**
     * Evaluates weak interaction freeze-out parameters
     */
    static computeWeakFreezeOut() {
        // Weak interaction rates Gamma_wk ~ G_F^2 T^5 equate to expansion rate H at ~ 0.72 MeV
        const T_freeze_MeV = 0.72;
        const deltaM_MeV = PhysicalConstants.delta_m_np_MeV; // 1.293332 MeV
        // Thermal equilibrium ratio (n/p) = exp(- Delta m / (k_B T))
        const np_freeze = Math.exp(-deltaM_MeV / T_freeze_MeV);
        return { T_freeze_MeV, np_freeze };
    }
    /**
     * Computes the deuterium bottleneck delay time in seconds
     * Nuclear reactions proceed rapidly only when T drops to T_BBN ~ 0.075 MeV
     */
    static computeDeuteriumBottleneckTime(params) {
        const eta10 = this.computeBaryonToPhotonRatio(params);
        // Higher baryon density slightly shifts the bottleneck earlier
        // Nominal delay: 145 seconds at standard Planck eta_10 ~ 6.12
        const baseDelay = 145.0;
        const etaCorrection = Math.pow(6.12 / Math.max(0.5, eta10), 0.12);
        return baseDelay * etaCorrection;
    }
    /**
     * Evaluates the full BBN primordial abundance summary for given cosmology
     */
    static computeAbundances(params) {
        const eta10 = this.computeBaryonToPhotonRatio(params);
        const { T_freeze_MeV, np_freeze } = this.computeWeakFreezeOut();
        const t_delay_s = this.computeDeuteriumBottleneckTime(params);
        // Free neutron decay during delay time before fusion:
        // (n/p)_BBN = (n/p)_freeze * exp(- t_delay / tau_n)
        const np_bbn = np_freeze * Math.exp(-t_delay_s / PhysicalConstants.tau_n);
        // Helium-4 mass fraction Y_p:
        // Every 2 neutrons form 1 Helium-4 nucleus (mass 4) with 2 protons
        // Y_p = 4 * (n/2) / (n + p) = 2 (n/p) / (1 + (n/p))
        const Y_p = (2.0 * np_bbn) / (1.0 + np_bbn);
        const X_p = 1.0 - Y_p;
        // Standard scaling of trace elements vs baryon-to-photon ratio
        // Benchmark: eta_10 = 6.12 (Planck 2018 concordance Omega_b h^2 = 0.02237)
        const normEta = Math.max(0.1, eta10) / 6.12;
        // Deuterium is an exquisite cosmic baryon-meter (inversely correlated with eta^1.6)
        const D_over_H = 2.54e-5 * Math.pow(normEta, -1.60);
        // Helium-3
        const He3_over_H = 1.05e-5 * Math.pow(normEta, -0.60);
        // Lithium-7 exhibits the "cosmological lithium valley" minimum, scaling roughly as eta^2 at standard values
        const Li7_over_H = 4.65e-10 * Math.pow(normEta, 2.05);
        return {
            eta10,
            T_freeze_MeV,
            np_freeze,
            t_delay_s,
            np_bbn,
            Y_p,
            X_p,
            D_over_H,
            He3_over_H,
            Li7_over_H,
        };
    }
    /**
     * Computes dynamical time evolution trajectories across cosmic time
     * from t = 0.01 s to t = 10,000 s
     */
    static computeEvolutionTrajectory(params) {
        const summary = this.computeAbundances(params);
        const trajectory = [];
        // Radiation-dominated epoch: T_MeV approx 1.0 / sqrt(t_s)
        const tMin = 0.01;
        const tMax = 10000.0;
        const N = 200;
        const logMin = Math.log10(tMin);
        const logMax = Math.log10(tMax);
        const dLog = (logMax - logMin) / N;
        for (let i = 0; i <= N; i++) {
            const t = Math.pow(10.0, logMin + i * dLog);
            // Temperature in MeV: T ~ 1.0 / sqrt(t) for t < 1000 s
            const T_MeV = 1.0 / Math.sqrt(Math.max(1e-4, t));
            const T_K = (T_MeV * 1e6 * PhysicalConstants.eV_to_J) / PhysicalConstants.k_B;
            let np_current;
            let Y_current;
            let D_current;
            if (t < 0.5) {
                // Pre-freeze equilibrium
                np_current = Math.exp(-PhysicalConstants.delta_m_np_MeV / Math.max(0.1, T_MeV));
                Y_current = 0.0;
                D_current = 1e-12;
            }
            else if (t < summary.t_delay_s) {
                // Freeze-out + neutron decay during deuterium bottleneck
                np_current = summary.np_freeze * Math.exp(-(t - 0.5) / PhysicalConstants.tau_n);
                Y_current = 0.0;
                // Trace deuterium slowly builds up
                const buildUpFraction = Math.pow(t / summary.t_delay_s, 2.5);
                D_current = summary.D_over_H * buildUpFraction * 1e-2;
            }
            else if (t < summary.t_delay_s * 2.5) {
                // Rapid fusion burst (the "BBN firestorm")
                const progress = (t - summary.t_delay_s) / (summary.t_delay_s * 1.5);
                const smoothProg = Math.sin((Math.PI / 2.0) * Math.min(1.0, progress));
                np_current = summary.np_bbn * (1.0 - smoothProg);
                Y_current = summary.Y_p * smoothProg;
                // Deuterium peaks then burns down to residual
                D_current = summary.D_over_H * (1.0 + 8.0 * (1.0 - smoothProg) * smoothProg);
            }
            else {
                // Post-BBN frozen abundances
                np_current = 0.0;
                Y_current = summary.Y_p;
                D_current = summary.D_over_H;
            }
            const X_current = Math.max(0.0, 1.0 - Y_current);
            const He3_current = summary.He3_over_H * (Y_current / Math.max(1e-4, summary.Y_p));
            const Li7_current = summary.Li7_over_H * (Y_current / Math.max(1e-4, summary.Y_p));
            trajectory.push({
                time_s: t,
                temp_MeV: T_MeV,
                temp_K: T_K,
                neutron_proton_ratio: np_current,
                X_hydrogen: X_current,
                Y_helium4: Y_current,
                ratio_deuterium: D_current,
                ratio_helium3: He3_current,
                ratio_lithium7: Li7_current,
            });
        }
        return trajectory;
    }
}
