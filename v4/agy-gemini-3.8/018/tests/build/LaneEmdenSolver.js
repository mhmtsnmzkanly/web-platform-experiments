import { CONSTANTS } from './PhysicalConstants.js';
export class LaneEmdenSolver {
    /**
     * Taylor series expansion around xi = 0 to avoid the 0/0 origin singularity
     */
    static seriesExpansion(xi, n) {
        const xi2 = xi * xi;
        const xi3 = xi2 * xi;
        const xi4 = xi2 * xi2;
        const xi5 = xi4 * xi;
        const xi6 = xi3 * xi3;
        // theta(xi) = 1 - xi^2/6 + n*xi^4/120 - n*(8n - 5)*xi^6/15120
        const theta = 1 - xi2 / 6 + (n * xi4) / 120 - (n * (8 * n - 5) * xi6) / 15120;
        // theta'(xi) = -xi/3 + n*xi^3/30 - n*(8n - 5)*xi^5/2520
        const dtheta = -xi / 3 + (n * xi3) / 30 - (n * (8 * n - 5) * xi5) / 2520;
        return { theta, dtheta };
    }
    /**
     * Numerically integrates the Lane-Emden equation using 4th-order Runge-Kutta
     * d^2(theta)/d(xi)^2 + (2/xi)*d(theta)/d(xi) + theta^n = 0
     */
    static solveDimensionless(n, h = 0.002, maxSteps = 30000) {
        if (n < 0 || n >= 5.0) {
            throw new Error(`Polytropic index n must satisfy 0 <= n < 5, received: ${n}`);
        }
        // General RK4 Integration
        // Start at xi0 = 1e-4 using Taylor expansion
        const xi0 = 1e-4;
        const init = this.seriesExpansion(xi0, n);
        let xi = xi0;
        let y1 = init.theta; // theta
        let y2 = init.dtheta; // dtheta/dxi
        const rawPoints = [{ xi: 0, theta: 1, dtheta: 0 }];
        rawPoints.push({ xi, theta: y1, dtheta: y2 });
        const f1 = (_x, _u, v) => v;
        const f2 = (x, u, v) => {
            if (u <= 0)
                return 0;
            return -(2 / x) * v - Math.pow(u, n);
        };
        let prevXi = xi;
        let prevY1 = y1;
        let prevY2 = y2;
        for (let step = 0; step < maxSteps; step++) {
            prevXi = xi;
            prevY1 = y1;
            prevY2 = y2;
            // RK4 Stage 1
            const k1_1 = f1(xi, y1, y2);
            const k1_2 = f2(xi, y1, y2);
            // RK4 Stage 2
            const xi_mid = xi + 0.5 * h;
            const y1_2 = y1 + 0.5 * h * k1_1;
            const y2_2 = y2 + 0.5 * h * k1_2;
            const k2_1 = f1(xi_mid, y1_2, y2_2);
            const k2_2 = f2(xi_mid, y1_2, y2_2);
            // RK4 Stage 3
            const y1_3 = y1 + 0.5 * h * k2_1;
            const y2_3 = y2 + 0.5 * h * k2_2;
            const k3_1 = f1(xi_mid, y1_3, y2_3);
            const k3_2 = f2(xi_mid, y1_3, y2_3);
            // RK4 Stage 4
            const xi_end = xi + h;
            const y1_4 = y1 + h * k3_1;
            const y2_4 = y2 + h * k3_2;
            const k4_1 = f1(xi_end, y1_4, y2_4);
            const k4_2 = f2(xi_end, y1_4, y2_4);
            // Accumulate
            xi += h;
            y1 += (h / 6) * (k1_1 + 2 * k2_1 + 2 * k3_1 + k4_1);
            y2 += (h / 6) * (k1_2 + 2 * k2_2 + 2 * k3_2 + k4_2);
            if (y1 <= 0) {
                break;
            }
            // Record point periodically (~300-700 points across the star)
            if (step % 10 === 0) {
                rawPoints.push({ xi, theta: y1, dtheta: y2 });
            }
        }
        // Precise root finding for xi1 (where theta = 0) using Newton-RK4 substep
        let r_xi = prevXi + (prevY1 / (prevY1 - y1)) * (xi - prevXi);
        let finalDtheta = prevY2;
        for (let iter = 0; iter < 4; iter++) {
            const delta = r_xi - prevXi;
            const k1_1 = f1(prevXi, prevY1, prevY2);
            const k1_2 = f2(prevXi, prevY1, prevY2);
            const xm = prevXi + 0.5 * delta;
            const k2_1 = f1(xm, prevY1 + 0.5 * delta * k1_1, prevY2 + 0.5 * delta * k1_2);
            const k2_2 = f2(xm, prevY1 + 0.5 * delta * k1_1, prevY2 + 0.5 * delta * k1_2);
            const k3_1 = f1(xm, prevY1 + 0.5 * delta * k2_1, prevY2 + 0.5 * delta * k2_2);
            const k3_2 = f2(xm, prevY1 + 0.5 * delta * k2_1, prevY2 + 0.5 * delta * k2_2);
            const xe = prevXi + delta;
            const k4_1 = f1(xe, prevY1 + delta * k3_1, prevY2 + delta * k3_2);
            const k4_2 = f2(xe, prevY1 + delta * k3_1, prevY2 + delta * k3_2);
            const theta_r = prevY1 + (delta / 6) * (k1_1 + 2 * k2_1 + 2 * k3_1 + k4_1);
            const dtheta_r = prevY2 + (delta / 6) * (k1_2 + 2 * k2_2 + 2 * k3_2 + k4_2);
            finalDtheta = dtheta_r;
            if (Math.abs(dtheta_r) > 1e-12) {
                r_xi -= theta_r / dtheta_r;
            }
        }
        const xi1 = r_xi;
        const dtheta1 = finalDtheta;
        const omega_n = -xi1 * xi1 * dtheta1;
        rawPoints.push({ xi: xi1, theta: 0, dtheta: dtheta1 });
        const points = rawPoints.map(p => {
            const m = -p.xi * p.xi * p.dtheta;
            return {
                xi: p.xi,
                theta: Math.max(0, p.theta),
                dtheta: p.dtheta,
                massFrac: Math.max(0, Math.min(1.0, m / omega_n)),
            };
        });
        const rho_c_over_rho_avg = (xi1 * xi1 * xi1) / (3 * omega_n);
        return {
            n,
            xi1,
            omega_n,
            rho_c_over_rho_avg,
            points,
        };
    }
    /**
     * Generates a fully calibrated physical radial stellar profile
     * Given total mass M (kg) and central density rho_c (kg/m^3)
     */
    static computePhysicalProfile(n, totalMassKg, centralDensityKgM3, meanMolecularWeightMu = 0.61 // Solar ionized mix (X=0.74, Y=0.24, Z=0.02)
    ) {
        const dimSolution = this.solveDimensionless(n);
        const xi1 = dimSolution.xi1;
        const omega_n = dimSolution.omega_n;
        // Scale parameter a = [ M / (4 * pi * rho_c * omega_n) ]^(1/3)
        const a3 = totalMassKg / (4 * Math.PI * centralDensityKgM3 * omega_n);
        const a = Math.cbrt(a3);
        const totalRadiusM = a * xi1;
        // Polytropic constant K and Central Pressure Pc
        let centralPressurePa;
        if (n === 0) {
            // Incompressible homogeneous sphere exact hydrostatic equilibrium:
            // Pc = (2*pi/3) * G * rho_c^2 * R^2
            centralPressurePa = (2 * Math.PI / 3) * CONSTANTS.G * Math.pow(centralDensityKgM3, 2) * Math.pow(totalRadiusM, 2);
        }
        else {
            const K = (4 * Math.PI * CONSTANTS.G * a * a) / ((n + 1) * Math.pow(centralDensityKgM3, (1 - n) / n));
            centralPressurePa = K * Math.pow(centralDensityKgM3, 1 + 1 / n);
        }
        // Central temperature from ideal gas equation: P = (rho * kB * T) / (mu * m_u)
        // Tc = (Pc * mu * m_u) / (rho_c * kB)
        const centralTemperatureK = (centralPressurePa * meanMolecularWeightMu * CONSTANTS.m_u) / (centralDensityKgM3 * CONSTANTS.kB);
        const meanDensityKgM3 = totalMassKg / ((4 / 3) * Math.PI * Math.pow(totalRadiusM, 3));
        const points = dimSolution.points.map(pt => {
            const r = a * pt.xi;
            const radiusFraction = r / totalRadiusM;
            const rho = centralDensityKgM3 * (n === 0 ? 1.0 : Math.pow(pt.theta, n));
            const pressure = n === 0
                ? centralPressurePa * Math.max(0, 1 - Math.pow(radiusFraction, 2))
                : centralPressurePa * Math.pow(pt.theta, n + 1);
            const enclosedMass = totalMassKg * pt.massFrac;
            // For ideal gas polytrope, T = Tc * theta
            const temperature = centralTemperatureK * pt.theta;
            return {
                r,
                radiusFraction: Math.min(1.0, radiusFraction),
                rho: Math.max(0, rho),
                pressure: Math.max(0, pressure),
                enclosedMass: Math.max(0, Math.min(totalMassKg, enclosedMass)),
                massFraction: pt.massFrac,
                temperature: Math.max(0, temperature),
            };
        });
        return {
            n,
            totalMassKg,
            totalRadiusM,
            centralDensityKgM3,
            centralPressurePa,
            centralTemperatureK,
            meanDensityKgM3,
            scaleFactorA: a,
            points,
        };
    }
}
