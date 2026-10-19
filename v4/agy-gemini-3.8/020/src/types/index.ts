/**
 * TYPE DEFINITIONS FOR COSMO-FORGE (EXP-020)
 */

import { HaloProfileType } from '../physics/DarkMatterHaloEngine';

export type CosmoSuiteMode =
  | 'COSMIC_EXPANSION'
  | 'CMB_POWER_SPECTRUM'
  | 'PRIMORDIAL_BBN'
  | 'DARK_MATTER_HALO'
  | 'COSMIC_GEOMETRY';

export type CosmoPresetId =
  | 'PLANCK_LCDM'
  | 'EINSTEIN_DE_SITTER'
  | 'OPEN_COSMOS'
  | 'DE_SITTER_EXPONENTIAL'
  | 'PHANTOM_ENERGY'
  | 'BARYON_RICH_COSMOS';

export interface CosmoParameters {
  activePresetId?: CosmoPresetId;
  // Cosmological Parameters
  H0: number;            // Hubble constant in km/s/Mpc (e.g. 67.4)
  Omega_m: number;       // Total matter density parameter (e.g. 0.315)
  Omega_b: number;       // Baryon density parameter (e.g. 0.049)
  Omega_L: number;       // Dark energy density parameter (e.g. 0.685)
  w0: number;            // Dark energy equation of state at z=0 (default -1.0)
  wa: number;            // Dark energy evolution (default 0.0)
  T_CMB: number;         // Present CMB temperature (K)

  // Interactive Exploration Probes
  probeRedshift: number; // Redshift for distance/expansion probe (0 - 10)
  probeMultipole: number;// Multipole ell for CMB spherical harmonic probe (2 - 2500)
  probeRadiusKpc: number;// Galactic radius for dark matter probe (0 - 35 kpc)

  // Galactic Dark Matter Halo Parameters
  haloProfileType: HaloProfileType;
  halo_rho0: number;     // M_sun / kpc^3 (e.g. 1.2e7)
  halo_rs_kpc: number;   // kpc (e.g. 10.0)
  disk_mass_Msun: number;// M_sun (e.g. 3.5e10)
  disk_Rd_kpc: number;   // kpc (e.g. 2.6)
  bulge_mass_Msun: number;// M_sun (e.g. 4.0e9)
  bulge_a_kpc: number;   // kpc (e.g. 0.8)

  // Audio Sonification Toggle
  audioEnabled: boolean;
}

export interface PresetConfig {
  id: CosmoPresetId;
  name: string;
  category: string;
  description: string;
  params: Partial<CosmoParameters>;
}
