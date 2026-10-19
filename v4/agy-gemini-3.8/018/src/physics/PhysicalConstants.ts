/**
 * Physical and Astronomical Constants in SI Units
 * Exact CODATA 2018 and IAU values
 */
export const CONSTANTS = {
  // Fundamental Constants
  G: 6.67430e-11, // m^3 kg^-1 s^-2
  c: 2.99792458e8, // m s^-1
  c2: 8.98755179e16, // m^2 s^-2
  h: 6.62607015e-34, // J s
  hbar: 1.054571817e-34, // J s
  kB: 1.380649e-23, // J K^-1
  m_u: 1.66053906660e-27, // kg (atomic mass unit)
  m_e: 9.1093837015e-31, // kg (electron rest mass)
  m_p: 1.67262192369e-27, // kg (proton rest mass)
  m_n: 1.67492749804e-27, // kg (neutron rest mass)
  sigma_SB: 5.670374419e-8, // W m^-2 K^-4 (Stefan-Boltzmann constant)
  a_rad: 7.5657e-16, // J m^-3 K^-4 (Radiation constant = 4 * sigma / c)

  // Solar & Astronomical Units (IAU Standards)
  M_sun: 1.98847e30, // kg (Solar mass)
  R_sun: 6.957e8, // m (Solar radius)
  L_sun: 3.828e26, // W (Solar luminosity)
  T_sun_eff: 5772, // K (Solar effective surface temperature)
  rho_sun_avg: 1408, // kg m^-3 (Solar mean density)
  rho_sun_center: 1.5e5, // kg m^-3 (Solar central density)
  T_sun_center: 1.57e7, // K (Solar central temperature)
  P_sun_center: 2.47e16, // Pa (Solar central pressure)
} as const;
