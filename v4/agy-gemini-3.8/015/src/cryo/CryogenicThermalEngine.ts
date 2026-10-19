import { CryoFridgeParameters, SuperconductorMaterial } from '../types';

export interface MaterialProperties {
  name: string;
  Tc: number; // Critical temperature in Kelvin
  Bc2: number; // Upper critical magnetic field in Tesla
  Ic0: number; // Baseline critical current in Amperes
}

export const SUPERCONDUCTOR_SPECS: Record<SuperconductorMaterial, MaterialProperties> = {
  YBCO: { name: 'Yttrium Barium Copper Oxide (YBCO)', Tc: 93.0, Bc2: 120.0, Ic0: 320.0 },
  NbTi: { name: 'Niobium-Titanium (NbTi)', Tc: 9.2, Bc2: 14.5, Ic0: 220.0 },
  Nb3Sn: { name: 'Niobium-Tin (Nb3Sn)', Tc: 18.3, Bc2: 30.0, Ic0: 280.0 },
  BSCCO: { name: 'Bismuth Strontium Calcium Copper Oxide (BSCCO)', Tc: 108.0, Bc2: 100.0, Ic0: 300.0 },
};

export class CryogenicThermalEngine {
  // Magnet electrical parameters
  public readonly inductanceHenry: number = 4.8;
  public magnetCurrent: number = 180.0; // Amperes
  public storedEnergyKJ: number = 0.0; // kJ
  public normalZoneResistance: number = 0.0; // Ohms
  public jouleHeatingWatts: number = 0.0; // Watts

  // Cryostat stage temperatures (Kelvin)
  public t300: number = 300.0;
  public t77: number = 77.3;
  public t4: number = 4.2;
  public t1: number = 1.25;
  public tMC: number = 0.015; // 15 mK

  // Cryogen liquid levels (% inventory)
  public ln2Level: number = 92.0;
  public lheLevel: number = 88.0;

  // Quench state
  public isQuenched: boolean = false;
  public quenchTime: number = 0.0;
  public boilOffRateLps: number = 0.2; // Liters per second

  // Cooling powers (micro-Watts)
  public coolingPowerMicroW: number = 120.0;

  constructor() {
    this.updateEnergy();
  }

  private updateEnergy() {
    this.storedEnergyKJ = (0.5 * this.inductanceHenry * this.magnetCurrent * this.magnetCurrent) / 1000.0;
  }

  public step(params: CryoFridgeParameters, dtSec: number = 0.05) {
    const spec = SUPERCONDUCTOR_SPECS[params.superconductorMaterial];

    // Compute dilution refrigerator cooling power: Q_cool = 84 * n3_dot * T_mc^2 (in uW)
    // where n3_dot is flow in umol/s
    const n3 = Math.max(10.0, params.he3FlowRate);
    const qCooling = 84.0 * (n3 / 100.0) * (this.tMC * 1000.0 / 15.0) ** 2;
    this.coolingPowerMicroW = Math.max(1.0, qCooling);

    // Thermal equilibrium on mixing chamber
    const ambientLeak = 0.8; // uW residual radiation leak
    const netHeatMicroW = ambientLeak + params.heaterPower - this.coolingPowerMicroW;
    const thermalMass = 120.0; // uJ / mK equivalent heat capacity

    if (!this.isQuenched) {
      this.tMC += (netHeatMicroW / thermalMass) * dtSec * 0.001;
      this.tMC = Math.max(0.008, Math.min(0.45, this.tMC));
    }

    // Check critical state for superconducting magnet
    // Operating temperature of magnet coil (immersed in LHe or 1K stage)
    const tOp = params.superconductorMaterial === 'YBCO' || params.superconductorMaterial === 'BSCCO'
      ? this.t77
      : this.t4;

    const criticalCurrent = spec.Ic0 * Math.max(0.0, 1.0 - tOp / spec.Tc);

    // If current exceeds Ic or manual quench triggered
    if (params.isQuenched || (this.magnetCurrent > criticalCurrent && criticalCurrent > 0)) {
      this.isQuenched = true;
    }

    if (this.isQuenched) {
      this.quenchTime += dtSec;

      // Normal zone resistance grows rapidly
      if (params.energyDumpActive) {
        // Fast energy extraction through dump resistor R_dump = 2.5 Ohm
        const rDump = 2.5;
        this.normalZoneResistance = Math.min(8.0, 0.5 + this.quenchTime * 2.0);
        const totalR = this.normalZoneResistance + rDump;

        // Exponential current decay: dI/dt = -I * totalR / L
        const decayFactor = Math.exp(-dtSec * totalR / this.inductanceHenry);
        this.magnetCurrent *= decayFactor;
        this.jouleHeatingWatts = this.magnetCurrent * this.magnetCurrent * this.normalZoneResistance;
      } else {
        // Catastrophic quench without dump: huge internal Joule dissipation
        this.normalZoneResistance = Math.min(14.0, 0.2 + this.quenchTime * 4.0);
        const decayFactor = Math.exp(-dtSec * this.normalZoneResistance / this.inductanceHenry);
        this.magnetCurrent *= decayFactor;
        this.jouleHeatingWatts = this.magnetCurrent * this.magnetCurrent * this.normalZoneResistance;

        // Cryogen violent boil-off
        this.lheLevel = Math.max(0.0, this.lheLevel - (this.jouleHeatingWatts / 2500.0) * dtSec);
        this.boilOffRateLps = Math.min(120.0, 0.5 + (this.jouleHeatingWatts / 300.0));

        // Temperature rise
        this.t4 = Math.min(180.0, this.t4 + (this.jouleHeatingWatts / 1500.0) * dtSec);
        this.tMC = Math.min(15.0, this.tMC + (this.jouleHeatingWatts / 3000.0) * dtSec);
      }

      if (this.magnetCurrent < 0.2) {
        this.magnetCurrent = 0.0;
        this.jouleHeatingWatts = 0.0;
      }
    } else {
      // Normal operating state
      this.magnetCurrent = params.magnetCurrentA;
      this.normalZoneResistance = 0.0;
      this.jouleHeatingWatts = 0.0;
      this.quenchTime = 0.0;
      this.boilOffRateLps = 0.15;

      // Steady state stages
      this.t300 = params.stage300Temp;
      this.t77 = params.stage77Temp;
      this.t4 = params.stage4Temp;
      this.t1 = params.stage1Temp;
    }

    this.updateEnergy();
  }

  public resetFridge() {
    this.isQuenched = false;
    this.quenchTime = 0.0;
    this.t300 = 300.0;
    this.t77 = 77.3;
    this.t4 = 4.2;
    this.t1 = 1.25;
    this.tMC = 0.015;
    this.ln2Level = 92.0;
    this.lheLevel = 88.0;
    this.boilOffRateLps = 0.15;
    this.normalZoneResistance = 0.0;
    this.jouleHeatingWatts = 0.0;
  }
}
