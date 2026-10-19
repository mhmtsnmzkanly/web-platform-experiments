/**
 * PHYSICAL CONSTANTS: COSMOLOGY & ASTROPHYSICS
 * Standard: CODATA 2018 / Planck 2018 / Particle Data Group (PDG) 2024
 */

export const PhysicalConstants = {
  // Speed of light in vacuum (m/s)
  c: 2.99792458e8,

  // Newtonian gravitational constant (m^3 kg^-1 s^-2)
  G: 6.6743e-11,

  // Reduced Planck constant (J s)
  hbar: 1.054571817e-34,

  // Boltzmann constant (J/K)
  k_B: 1.380649e-23,

  // Electron volt in Joules (J/eV)
  eV_to_J: 1.602176634e-19,

  // Mega-electron volt in Joules (J/MeV)
  MeV_to_J: 1.602176634e-13,

  // Astronomical Unit (m)
  AU: 1.495978707e11,

  // Parsec in meters (m)
  pc_to_m: 3.085677581e16,

  // Megaparsec in meters (m)
  Mpc_to_m: 3.085677581e22,

  // Megaparsec in kilometers (km)
  Mpc_to_km: 3.085677581e19,

  // Julian year in seconds (s)
  year_to_s: 3.15576e7,

  // Gigayear in seconds (s)
  Gyr_to_s: 3.15576e16,

  // Solar mass (kg)
  M_sun: 1.98847e30,

  // Kiloparsec in meters (m)
  kpc_to_m: 3.085677581e19,

  // Present CMB temperature (K) - Fixsen 2009
  T_CMB_0: 2.72548,

  // Free neutron mean lifetime (s) - PDG 2024
  tau_n: 879.4,

  // Neutron - Proton mass difference in MeV (MeV)
  // m_n = 939.5654 MeV, m_p = 938.2720 MeV => Delta m = 1.293332 MeV
  delta_m_np_MeV: 1.293332,

  // Radiation density parameter prefactor: Omega_gamma * h^2 = 2.47e-5
  omega_gamma_h2: 2.47e-5,

  // Relativistic neutrino contribution factor: 3 * (7/8) * (4/11)^(4/3) = 0.6813
  neutrino_factor: 0.6813,

  // Unit conversion: 1 km/s/Mpc in s^-1
  // (1e3 m/s) / (3.085677581e22 m) = 3.24077929e-18 s^-1
  km_s_Mpc_to_s_inv: 3.24077929e-18,

  // Conversion: 1 / H0 (in km/s/Mpc) into Gyr
  // 1 / (H0 * 3.24077929e-18 s^-1) / 3.15576e16 s/Gyr = 977.813 / H0
  hubble_time_Gyr_factor: 977.8131,

  // Hubble distance factor c / H0 in Mpc
  // c (km/s) / H0 = 299792.458 / H0
  hubble_distance_Mpc_factor: 299792.458,
} as const;
