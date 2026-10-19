/**
 * DARK MATTER HALO & GALACTIC ROTATION ENGINE
 * Models NFW, Burkert, and Moore dark matter halo density profiles,
 * baryonic disk/bulge decomposition, flat galactic rotation curves (NGC 3198),
 * Keplerian falloff comparison, and gravitational lensing deflection.
 */

import { PhysicalConstants } from './PhysicalConstants.js';

export type HaloProfileType = 'NFW' | 'BURKERT' | 'MOORE';

export interface GalaxyRotationParameters {
  profileType: HaloProfileType;
  halo_rho0: number;     // Central/characteristic density in M_sun / kpc^3 (e.g. 1.2e7)
  halo_rs_kpc: number;   // Halo scale radius r_s in kpc (e.g. 10.0)
  disk_mass_Msun: number;// Baryonic disk mass in M_sun (e.g. 3.0e10)
  disk_Rd_kpc: number;   // Disk exponential scale length in kpc (e.g. 2.6)
  bulge_mass_Msun: number;// Bulge mass in M_sun (e.g. 5.0e9)
  bulge_a_kpc: number;   // Bulge scale radius in kpc (e.g. 0.8)
}

export interface RotationCurvePoint {
  radius_kpc: number;
  v_halo_km_s: number;
  v_disk_km_s: number;
  v_bulge_km_s: number;
  v_total_km_s: number;
  v_kepler_km_s: number; // Pure baryonic Keplerian decline
}

export interface Ngc3198DataPoint {
  radius_kpc: number;
  v_obs_km_s: number;
  err_km_s: number;
}

export class DarkMatterHaloEngine {
  // Gravitational constant in galactic units: (km/s)^2 * kpc / M_sun
  // G = 6.6743e-11 m^3 / (kg s^2)
  // G in (km/s)^2 * kpc / M_sun:
  // 6.6743e-11 * (1e-6 km^2/m^2) * (1 / 3.085677581e19 kpc/m) * (1.98847e30 kg/M_sun)
  // = 4.30091e-6 (km/s)^2 kpc / M_sun
  public static readonly G_galactic = 4.30091727e-6;

  /**
   * Computes enclosed dark matter mass M_halo(r) in M_sun for NFW profile
   * M_NFW(r) = 4*pi*rho0*rs^3 * [ ln(1 + x) - x / (1 + x) ]
   */
  public static computeNfwMass(r_kpc: number, rho0: number, rs_kpc: number): number {
    if (r_kpc <= 0) return 0.0;
    const x = r_kpc / rs_kpc;
    const factor = Math.log(1.0 + x) - (x / (1.0 + x));
    return 4.0 * Math.PI * rho0 * Math.pow(rs_kpc, 3) * factor;
  }

  /**
   * Computes enclosed dark matter mass M_halo(r) in M_sun for Burkert cored profile
   * M_Burkert(r) = pi*rho0*r0^3 * [ ln(1 + x^2) + 2*ln(1 + x) - 2*arctan(x) ]
   */
  public static computeBurkertMass(r_kpc: number, rho0: number, r0_kpc: number): number {
    if (r_kpc <= 0) return 0.0;
    const x = r_kpc / r0_kpc;
    const factor = Math.log(1.0 + x * x) + 2.0 * Math.log(1.0 + x) - 2.0 * Math.atan(x);
    return Math.PI * rho0 * Math.pow(r0_kpc, 3) * factor;
  }

  /**
   * Computes enclosed dark matter mass M_halo(r) for Moore cuspy profile
   */
  public static computeMooreMass(r_kpc: number, rho0: number, rs_kpc: number): number {
    if (r_kpc <= 0) return 0.0;
    const x = r_kpc / rs_kpc;
    // Approximated analytical mass for Moore profile: x^1.5 / (1 + x^1.5)
    const factor = (4.0 * Math.PI / 1.5) * (Math.pow(x, 1.5) / (1.0 + Math.pow(x, 1.5)));
    return rho0 * Math.pow(rs_kpc, 3) * factor;
  }

  /**
   * Computes circular halo velocity v_halo(r) = sqrt(G M_halo(r) / r) in km/s
   */
  public static computeHaloVelocity(r_kpc: number, params: GalaxyRotationParameters): number {
    if (r_kpc <= 1e-4) return 0.0;
    let M_halo = 0.0;
    switch (params.profileType) {
      case 'NFW':
        M_halo = this.computeNfwMass(r_kpc, params.halo_rho0, params.halo_rs_kpc);
        break;
      case 'BURKERT':
        M_halo = this.computeBurkertMass(r_kpc, params.halo_rho0, params.halo_rs_kpc);
        break;
      case 'MOORE':
        M_halo = this.computeMooreMass(r_kpc, params.halo_rho0, params.halo_rs_kpc);
        break;
    }
    return Math.sqrt(Math.max(0.0, (this.G_galactic * M_halo) / r_kpc));
  }

  /**
   * Freeman exponential thin disk rotation velocity in km/s
   * v_disk(r) = sqrt( (G * M_disk / r) * [1 - (1 + r/Rd) * exp(-r/Rd)] )
   */
  public static computeDiskVelocity(r_kpc: number, disk_mass_Msun: number, Rd_kpc: number): number {
    if (r_kpc <= 1e-4) return 0.0;
    const x = r_kpc / Rd_kpc;
    const enclosedFraction = 1.0 - (1.0 + x) * Math.exp(-x);
    const M_enclosed = disk_mass_Msun * Math.max(0.0, enclosedFraction);
    return Math.sqrt(Math.max(0.0, (this.G_galactic * M_enclosed) / r_kpc));
  }

  /**
   * Hernquist spherical bulge rotation velocity in km/s
   * v_bulge(r) = sqrt(G * M_bulge * r) / (r + a_bulge)
   */
  public static computeBulgeVelocity(r_kpc: number, bulge_mass_Msun: number, a_kpc: number): number {
    if (r_kpc <= 1e-4) return 0.0;
    const numerator = this.G_galactic * bulge_mass_Msun * r_kpc;
    const denominator = Math.pow(r_kpc + a_kpc, 2.0);
    return Math.sqrt(Math.max(0.0, numerator / denominator));
  }

  /**
   * Generates the complete galactic rotation curve profile from r = 0.1 to 35 kpc
   */
  public static computeRotationCurve(params: GalaxyRotationParameters, maxR_kpc = 35.0, steps = 120): RotationCurvePoint[] {
    const points: RotationCurvePoint[] = [];
    const dr = maxR_kpc / steps;

    const totalBaryonMass = params.disk_mass_Msun + params.bulge_mass_Msun;

    for (let i = 1; i <= steps; i++) {
      const r = i * dr;
      const v_halo = this.computeHaloVelocity(r, params);
      const v_disk = this.computeDiskVelocity(r, params.disk_mass_Msun, params.disk_Rd_kpc);
      const v_bulge = this.computeBulgeVelocity(r, params.bulge_mass_Msun, params.bulge_a_kpc);

      const v_total = Math.sqrt(v_halo * v_halo + v_disk * v_disk + v_bulge * v_bulge);
      const v_kepler = Math.sqrt((this.G_galactic * totalBaryonMass) / r);

      points.push({
        radius_kpc: r,
        v_halo_km_s: v_halo,
        v_disk_km_s: v_disk,
        v_bulge_km_s: v_bulge,
        v_total_km_s: v_total,
        v_kepler_km_s: v_kepler,
      });
    }

    return points;
  }

  /**
   * Published observational data points for spiral galaxy NGC 3198 (Begeman 1989)
   */
  public static getNgc3198Dataset(): Ngc3198DataPoint[] {
    return [
      { radius_kpc: 1.5, v_obs_km_s: 92.0, err_km_s: 8.0 },
      { radius_kpc: 3.2, v_obs_km_s: 122.0, err_km_s: 6.0 },
      { radius_kpc: 5.5, v_obs_km_s: 145.0, err_km_s: 5.0 },
      { radius_kpc: 8.0, v_obs_km_s: 153.0, err_km_s: 4.0 },
      { radius_kpc: 11.2, v_obs_km_s: 151.0, err_km_s: 4.0 },
      { radius_kpc: 14.8, v_obs_km_s: 149.0, err_km_s: 4.0 },
      { radius_kpc: 18.5, v_obs_km_s: 150.0, err_km_s: 4.0 },
      { radius_kpc: 22.8, v_obs_km_s: 148.0, err_km_s: 5.0 },
      { radius_kpc: 27.5, v_obs_km_s: 149.0, err_km_s: 6.0 },
      { radius_kpc: 30.2, v_obs_km_s: 147.0, err_km_s: 7.0 },
    ];
  }

  /**
   * Computes gravitational lensing deflection angle alpha(b) in arcseconds
   * for an impact parameter b in kpc: alpha(b) = 4 * G * M_2D(b) / (c^2 * b)
   */
  public static computeLensingDeflectionArcsec(b_kpc: number, params: GalaxyRotationParameters): number {
    if (b_kpc <= 0.1) return 0.0;
    // For isothermal / flat rotation curve approximation: alpha = 4 * pi * (v_c / c)^2 in radians
    const v_c = this.computeHaloVelocity(b_kpc, params); // km/s
    const v_over_c = (v_c * 1e3) / PhysicalConstants.c;
    const alpha_rad = 4.0 * Math.PI * Math.pow(v_over_c, 2.0);
    // Convert radians to arcseconds: 1 rad = 206264.8 arcsec
    return alpha_rad * 206264.806;
  }
}
