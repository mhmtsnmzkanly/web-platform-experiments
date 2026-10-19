import { JosephsonParameters } from '../types';

export interface IvPoint {
  current: number; // I / Ic
  voltage: number; // V / (Ic * R)
}

export interface SquidPoint {
  flux: number; // Phi / Phi_0
  voltage: number; // V / (Ic * R)
}

export class JosephsonJunctionEngine {
  // Dynamical state of the junction
  public phi: number = 0.0; // phase difference
  public dPhi: number = 0.0; // phase velocity = dimensionless voltage v
  public time: number = 0.0;

  // Real-time telemetry
  public currentVoltage: number = 0.0; // normalized V / (Ic R)
  public physicalVoltageMilliV: number = 0.0; // physical mV (assuming Ic*R ~ 1.0 mV)
  public instantaneousCurrent: number = 0.0; // I / Ic
  public washboardEnergy: number = 0.0;
  public squidSensitivity: number = 0.0; // dV / dPhi

  // Cached curves for visual plotting
  public ivCurve: IvPoint[] = [];
  public squidCurve: SquidPoint[] = [];

  // History buffer for oscilloscope / phase trajectory
  public phaseHistory: Float32Array = new Float32Array(128);
  public voltageHistory: Float32Array = new Float32Array(128);
  private historyIdx: number = 0;

  constructor() {
    this.computeStaticCurves({
      iDc: 1.2,
      iRf: 0.8,
      fRf: 1.0,
      betaC: 1.5,
      squidFluxPhi: 0.25,
      asymmetryAlpha: 0.05,
      inductanceBetaL: 0.1,
    });
  }

  /**
   * Run 4th-order Runge-Kutta step on Stewart-McCumber RCSJ equation:
   * beta_c * d2phi/dtau2 + dphi/dtau + sin(phi) = i_dc + i_rf * sin(omega_rf * tau)
   */
  public step(params: JosephsonParameters, dtSub: number = 0.02, subSteps: number = 10) {
    const betaC = Math.max(0.05, params.betaC);
    const invBetaC = 1.0 / betaC;
    const omegaRf = 2 * Math.PI * params.fRf;

    // SQUID modulation of effective critical current
    const phiExt = params.squidFluxPhi * Math.PI; // normalized to pi
    const alpha = params.asymmetryAlpha;
    // Effective normalized Ic factor for SQUID
    const icMod = Math.max(
      0.02,
      Math.sqrt(Math.cos(phiExt) ** 2 + alpha * alpha * Math.sin(phiExt) ** 2)
    );

    let phi = this.phi;
    let v = this.dPhi;
    let tau = this.time;

    for (let s = 0; s < subSteps; s++) {
      // Total external drive current normalized to single-junction Ic
      const iDrive = params.iDc + params.iRf * Math.sin(omegaRf * tau);

      // RK4 integration of [dphi/dtau, dv/dtau]
      // dv/dtau = (iDrive - sin(phi) * icMod - v) / betaC
      const f1_v = (iDrive - Math.sin(phi) * icMod - v) * invBetaC;
      const f1_phi = v;

      const phi_mid1 = phi + 0.5 * dtSub * f1_phi;
      const v_mid1 = v + 0.5 * dtSub * f1_v;
      const tau_mid = tau + 0.5 * dtSub;
      const iDrive_mid = params.iDc + params.iRf * Math.sin(omegaRf * tau_mid);

      const f2_v = (iDrive_mid - Math.sin(phi_mid1) * icMod - v_mid1) * invBetaC;
      const f2_phi = v_mid1;

      const phi_mid2 = phi + 0.5 * dtSub * f2_phi;
      const v_mid2 = v + 0.5 * dtSub * f2_v;

      const f3_v = (iDrive_mid - Math.sin(phi_mid2) * icMod - v_mid2) * invBetaC;
      const f3_phi = v_mid2;

      const phi_end = phi + dtSub * f3_phi;
      const v_end = v + dtSub * f3_v;
      const tau_end = tau + dtSub;
      const iDrive_end = params.iDc + params.iRf * Math.sin(omegaRf * tau_end);

      const f4_v = (iDrive_end - Math.sin(phi_end) * icMod - v_end) * invBetaC;
      const f4_phi = v_end;

      phi += (dtSub / 6.0) * (f1_phi + 2 * f2_phi + 2 * f3_phi + f4_phi);
      v += (dtSub / 6.0) * (f1_v + 2 * f2_v + 2 * f3_v + f4_v);
      tau += dtSub;
    }

    // Wrap phi for display if needed, but keep continuous for trajectory
    this.phi = phi;
    this.dPhi = v;
    this.time = tau;

    this.currentVoltage = Math.max(0, v);
    // Typical standard Nb junction Ic*R product is ~ 1.5 - 2.0 mV
    this.physicalVoltageMilliV = this.currentVoltage * 1.5;
    this.instantaneousCurrent = params.iDc + params.iRf * Math.sin(omegaRf * tau);

    // Washboard potential: U(phi) = -cos(phi) - (I/Ic)*phi
    this.washboardEnergy = -Math.cos(phi) - (params.iDc / icMod) * (phi % (2 * Math.PI));

    // Store in circular history buffer
    this.phaseHistory[this.historyIdx] = (phi % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    this.voltageHistory[this.historyIdx] = v;
    this.historyIdx = (this.historyIdx + 1) % this.phaseHistory.length;

    // SQUID differential sensitivity |dV/dPhi|
    const phiNorm = params.squidFluxPhi;
    const sin2Phi = Math.sin(2 * Math.PI * phiNorm);
    this.squidSensitivity = Math.abs(sin2Phi * Math.PI * 1.2);
  }

  /**
   * Precomputes full I-V characteristic with Shapiro steps and SQUID V-Phi response
   */
  public computeStaticCurves(params: JosephsonParameters) {
    // 1. Compute I-V curve for I from 0.0 to 3.0
    const pointsCount = 60;
    const iv: IvPoint[] = [];
    const omegaRf = 2 * Math.PI * params.fRf;
    const iRf = params.iRf;
    const betaC = params.betaC;

    for (let i = 0; i <= pointsCount; i++) {
      const cur = (i / pointsCount) * 3.2;

      // Analytical Stewart-McCumber overdamped + Bessel function Shapiro step approximation
      let vAvg = 0;
      if (cur <= 1.0 && iRf < 0.1) {
        vAvg = 0;
      } else {
        // Base hyperbolic RSJ voltage
        const baseV = cur > 1.0 ? Math.sqrt(cur * cur - 1.0) : 0.0;

        // Microwave Shapiro step pinning: plateaus occur at V_n = n * omega_rf
        let pinnedV = baseV;
        if (iRf > 0.05) {
          const stepSize = omegaRf;
          const n = Math.round(baseV / stepSize);
          const targetV = n * stepSize;
          // Width of n-th step proportional to J_n(2 * iRf / omegaRf)
          const stepWidth = Math.max(0.08, 0.35 * Math.exp(-0.4 * Math.abs(n)) * (iRf / (1 + iRf)));

          if (Math.abs(baseV - targetV) < stepWidth) {
            // Pin to Shapiro plateau
            pinnedV = targetV;
          }
        }
        vAvg = pinnedV;
      }

      iv.push({ current: cur, voltage: vAvg });
    }
    this.ivCurve = iv;

    // 2. Compute SQUID V vs Phi curve for Phi from -2.0 to +2.0 Phi_0
    const squidPts: SquidPoint[] = [];
    const phiPoints = 80;
    const iBias = Math.max(1.1, params.iDc);
    const alpha = params.asymmetryAlpha;

    for (let i = 0; i <= phiPoints; i++) {
      const flux = -2.0 + (i / phiPoints) * 4.0;
      const phase = Math.PI * flux;
      const icEff = 2.0 * Math.sqrt(Math.cos(phase) ** 2 + alpha * alpha * Math.sin(phase) ** 2);

      let vSquid = 0;
      if (iBias > icEff) {
        vSquid = Math.sqrt(iBias * iBias - icEff * icEff);
      }
      squidPts.push({ flux, voltage: vSquid });
    }
    this.squidCurve = squidPts;
  }
}
