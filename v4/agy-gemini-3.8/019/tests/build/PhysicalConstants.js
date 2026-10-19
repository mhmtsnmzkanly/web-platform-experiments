/**
 * PhysicalConstants.ts
 * Fundamental physical constants in SI and solid-state atomic units.
 * Sourced from CODATA 2018 and IAU recommendations.
 */
export const CONSTANTS = {
    /** Reduced Planck constant in J*s */
    HBAR_SI: 1.054571817e-34,
    /** Reduced Planck constant in eV*s */
    HBAR_EV: 6.582119569e-16,
    /** Planck constant in J*s */
    H_SI: 6.62607015e-34,
    /** Planck constant in eV*s */
    H_EV: 4.135667696e-15,
    /** Elementary charge in Coulombs */
    E_CHARGE: 1.602176634e-19,
    /** Electron rest mass in kg */
    M_E_KG: 9.1093837015e-31,
    /** Speed of light in vacuum (m/s) */
    C_LIGHT: 299792458,
    /** 1 Angstrom in meters */
    ANGSTROM_M: 1e-10,
    /** 1 Electron-Volt in Joules */
    EV_TO_JOULE: 1.602176634e-19,
    /** Atomic mass unit in kg */
    AMU_KG: 1.66053906660e-27,
    /** Boltzmann constant in eV/K */
    K_B_EV: 8.617333262e-5,
    /** Quantum of conductance e^2/h in Siemens (1/Ohm) */
    CONDUCTANCE_QUANTUM: 3.87404614e-5,
    /** Von Klitzing constant R_K = h/e^2 in Ohms */
    R_KLITZING: 25812.80745,
    /** Magnetic flux quantum Phi_0 = h/e in Wb */
    FLUX_QUANTUM_WEBER: 4.135667696e-15,
    // Benchmark materials parameters
    /** Graphene C-C bond length in Angstroms */
    GRAPHENE_ACC: 1.42,
    /** Graphene nearest-neighbor hopping in eV */
    GRAPHENE_T: 2.8,
    /** Graphene next-nearest neighbor hopping in eV */
    GRAPHENE_T_PRIME: 0.1,
    /** Graphene theoretical Fermi velocity in m/s */
    GRAPHENE_VF_THEORY: 1.006e6,
    /** Silicon lattice parameter in Angstroms */
    SILICON_A: 5.43,
};
