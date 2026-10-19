import { ThinFilmConfig, ThinFilmLayer, SpectrumPoint } from '../types';

export const THIN_FILM_PRESETS: { name: string; description: string; layers: ThinFilmLayer[] }[] = [
  {
    name: 'Uncoated Crown Glass (Fresnel Reflection ~4%)',
    description: 'Bare optical substrate without coating showing standard Fresnel boundary reflection R ≈ 4.2% across visible band.',
    layers: [],
  },
  {
    name: 'Single-Layer MgF₂ Anti-Reflective (AR) Coating',
    description: 'Classic quarter-wave magnesium fluoride (n = 1.38) coating optimized for minimum reflection at green 550 nm.',
    layers: [
      { id: 'l1', name: 'MgF₂ (Low Index)', thicknessNm: 100, refractiveIndex: 1.38, extinctionCoeff: 0.0 },
    ],
  },
  {
    name: 'Broadband V-Coat (Dual-Layer High-Performance AR)',
    description: 'High-index TiO₂ and low-index SiO₂ dual-layer destructive interference reducing reflection to < 0.25% at 532 nm.',
    layers: [
      { id: 'l1', name: 'TiO₂ (High Index)', thicknessNm: 35, refractiveIndex: 2.35, extinctionCoeff: 0.0 },
      { id: 'l2', name: 'SiO₂ (Low Index)', thicknessNm: 95, refractiveIndex: 1.46, extinctionCoeff: 0.0 },
    ],
  },
  {
    name: 'Dielectric Bragg Reflector (DBR Laser Mirror R > 99%)',
    description: 'Quarter-wave stack of 5 pairs of alternating high/low index layers producing constructive Bragg backscattering.',
    layers: [
      { id: 'l1', name: 'TiO₂ (High Index)', thicknessNm: 58, refractiveIndex: 2.30, extinctionCoeff: 0.0 },
      { id: 'l2', name: 'SiO₂ (Low Index)', thicknessNm: 92, refractiveIndex: 1.45, extinctionCoeff: 0.0 },
      { id: 'l3', name: 'TiO₂ (High Index)', thicknessNm: 58, refractiveIndex: 2.30, extinctionCoeff: 0.0 },
      { id: 'l4', name: 'SiO₂ (Low Index)', thicknessNm: 92, refractiveIndex: 1.45, extinctionCoeff: 0.0 },
      { id: 'l5', name: 'TiO₂ (High Index)', thicknessNm: 58, refractiveIndex: 2.30, extinctionCoeff: 0.0 },
      { id: 'l6', name: 'SiO₂ (Low Index)', thicknessNm: 92, refractiveIndex: 1.45, extinctionCoeff: 0.0 },
      { id: 'l7', name: 'TiO₂ (High Index)', thicknessNm: 58, refractiveIndex: 2.30, extinctionCoeff: 0.0 },
      { id: 'l8', name: 'SiO₂ (Low Index)', thicknessNm: 92, refractiveIndex: 1.45, extinctionCoeff: 0.0 },
      { id: 'l9', name: 'TiO₂ (High Index)', thicknessNm: 58, refractiveIndex: 2.30, extinctionCoeff: 0.0 },
      { id: 'l10', name: 'SiO₂ (Low Index)', thicknessNm: 92, refractiveIndex: 1.45, extinctionCoeff: 0.0 },
    ],
  },
  {
    name: 'Fabry-Pérot Narrowband Optical Filter',
    description: 'Two DBR dielectric mirrors separated by a half-wave resonant cavity spacer transmitting an ultra-narrow passband.',
    layers: [
      { id: 'l1', name: 'TiO₂', thicknessNm: 58, refractiveIndex: 2.30, extinctionCoeff: 0.0 },
      { id: 'l2', name: 'SiO₂', thicknessNm: 92, refractiveIndex: 1.45, extinctionCoeff: 0.0 },
      { id: 'l3', name: 'TiO₂', thicknessNm: 58, refractiveIndex: 2.30, extinctionCoeff: 0.0 },
      // Resonant Half-Wave Cavity Spacer
      { id: 'l4', name: 'SiO₂ (Resonant Cavity)', thicknessNm: 184, refractiveIndex: 1.45, extinctionCoeff: 0.0 },
      { id: 'l5', name: 'TiO₂', thicknessNm: 58, refractiveIndex: 2.30, extinctionCoeff: 0.0 },
      { id: 'l6', name: 'SiO₂', thicknessNm: 92, refractiveIndex: 1.45, extinctionCoeff: 0.0 },
      { id: 'l7', name: 'TiO₂', thicknessNm: 58, refractiveIndex: 2.30, extinctionCoeff: 0.0 },
    ],
  },
  {
    name: 'Silver Metallic High-Reflector Film',
    description: 'Thin silver metal film with complex refractive index showing high broad plasmonic reflection across all colors.',
    layers: [
      { id: 'l1', name: 'Silver (Ag)', thicknessNm: 40, refractiveIndex: 0.14, extinctionCoeff: 3.4 },
      { id: 'l2', name: 'Al₂O₃ Protective Passivation', thicknessNm: 25, refractiveIndex: 1.77, extinctionCoeff: 0.0 },
    ],
  },
];

/**
 * Computes Transfer Matrix Method (TMM) reflectance and transmittance for a multi-layer stack
 */
export function calculateThinFilmResponse(
  config: ThinFilmConfig,
  wavelengthNm: number
): { reflectance: number; transmittance: number } {
  const theta0Rad = (config.incidentAngleDeg * Math.PI) / 180;
  const n0 = 1.0; // Incident medium: Air (n = 1)
  const nSub = config.substrateIndex; // Substrate (e.g. Glass)

  // Admittances of incident and substrate media
  const cosTheta0 = Math.cos(theta0Rad);
  const sinTheta0 = Math.sin(theta0Rad);

  // Snell law in substrate
  const sinThetaSub = (n0 * sinTheta0) / nSub;
  const cosThetaSub = Math.sqrt(Math.max(0, 1.0 - sinThetaSub * sinThetaSub));

  const eta0_s = n0 * cosTheta0;
  const eta0_p = n0 / cosTheta0;
  const etaSub_s = nSub * cosThetaSub;
  const etaSub_p = nSub / cosThetaSub;

  const solveForPol = (eta0: number, etaSub: number, isP: boolean) => {
    // 2x2 Identity Matrix: [M11, M12, M21, M22]
    // Complex numbers: represented as (re, im)
    let M11_r = 1, M11_i = 0;
    let M12_r = 0, M12_i = 0;
    let M21_r = 0, M21_i = 0;
    let M22_r = 1, M22_i = 0;

    for (const layer of config.layers) {
      const nReal = Math.max(0.01, layer.refractiveIndex);
      const kExt = Math.max(0.0, layer.extinctionCoeff);
      const d = layer.thicknessNm;

      // Effective refractive index modulus
      const nEff = Math.sqrt(nReal * nReal + kExt * kExt);

      // Snell law for layer: sin(theta_j) = (n0 * sinTheta0) / nEff
      const sinTheta_j = Math.min(0.9999, (n0 * sinTheta0) / Math.max(1e-4, nEff));
      const cosTheta_j = Math.sqrt(Math.max(1e-5, 1.0 - sinTheta_j * sinTheta_j));

      // Phase thickness (real optical propagation)
      const delta = (2.0 * Math.PI * nReal * d * cosTheta_j) / wavelengthNm;

      // Attenuation parameter from extinction absorption kExt
      const alpha = (2.0 * Math.PI * kExt * d) / (wavelengthNm * Math.max(1e-4, cosTheta_j));

      // Optical admittance: eta_j
      let eta_j = isP ? nEff / Math.max(1e-5, cosTheta_j) : nEff * cosTheta_j;
      eta_j = Math.max(1e-5, eta_j);

      // cos(delta - i*alpha) = cos(delta)*cosh(alpha) + i*sin(delta)*sinh(alpha)
      // sin(delta - i*alpha) = sin(delta)*cosh(alpha) - i*cos(delta)*sinh(alpha)
      const clampedAlpha = Math.min(30, alpha);
      const coshA = Math.cosh(clampedAlpha);
      const sinhA = Math.sinh(clampedAlpha);
      const cosD = Math.cos(delta);
      const sinD = Math.sin(delta);

      const cosDelta_r = cosD * coshA;
      const cosDelta_i = sinD * sinhA;
      const sinDelta_r = sinD * coshA;
      const sinDelta_i = -cosD * sinhA;

      // Layer Characteristic Matrix:
      // m11 = cosDelta
      const m11_r = cosDelta_r, m11_i = cosDelta_i;
      // m12 = -i * sinDelta / eta_j = (sinDelta_i - i * sinDelta_r) / eta_j
      const m12_r = sinDelta_i / eta_j, m12_i = -sinDelta_r / eta_j;
      // m21 = -i * eta_j * sinDelta = eta_j * sinDelta_i - i * eta_j * sinDelta_r
      const m21_r = eta_j * sinDelta_i, m21_i = -eta_j * sinDelta_r;
      // m22 = cosDelta
      const m22_r = cosDelta_r, m22_i = cosDelta_i;

      // Multiply: M_new = M_accum * M_layer
      const n11_r = M11_r * m11_r - M11_i * m11_i + M12_r * m21_r - M12_i * m21_i;
      const n11_i = M11_r * m11_i + M11_i * m11_r + M12_r * m21_i + M12_i * m21_r;

      const n12_r = M11_r * m12_r - M11_i * m12_i + M12_r * m22_r - M12_i * m22_i;
      const n12_i = M11_r * m12_i + M11_i * m12_r + M12_r * m22_i + M12_i * m22_r;

      const n21_r = M21_r * m11_r - M21_i * m11_i + M22_r * m21_r - M22_i * m21_i;
      const n21_i = M21_r * m11_i + M21_i * m11_r + M22_r * m21_i + M22_i * m21_r;

      const n22_r = M21_r * m12_r - M21_i * m12_i + M22_r * m22_r - M22_i * m22_i;
      const n22_i = M21_r * m12_i + M21_i * m12_r + M22_r * m22_i + M22_i * m22_r;

      M11_r = n11_r; M11_i = n11_i;
      M12_r = n12_r; M12_i = n12_i;
      M21_r = n21_r; M21_i = n21_i;
      M22_r = n22_r; M22_i = n22_i;
    }

    // Multiply M * [1, etaSub]^T = [B, C]^T
    const B_r = M11_r + M12_r * etaSub;
    const B_i = M11_i + M12_i * etaSub;
    const C_r = M21_r + M22_r * etaSub;
    const C_i = M21_i + M22_i * etaSub;

    // Reflection coefficient r = (eta0 * B - C) / (eta0 * B + C)
    const num_r = eta0 * B_r - C_r;
    const num_i = eta0 * B_i - C_i;
    const den_r = eta0 * B_r + C_r;
    const den_i = eta0 * B_i + C_i;

    const denSq = den_r * den_r + den_i * den_i;
    const r_re = (num_r * den_r + num_i * den_i) / (denSq + 1e-12);
    const r_im = (num_i * den_r - num_r * den_i) / (denSq + 1e-12);

    let R = r_re * r_re + r_im * r_im;
    if (isNaN(R) || !isFinite(R)) R = 0.04;
    R = Math.max(0, Math.min(1, R));

    let T = (4 * eta0 * etaSub) / (denSq + 1e-12);
    if (isNaN(T) || !isFinite(T)) T = 1.0 - R;
    T = Math.max(0, Math.min(1 - R, T));

    return { R, T };
  };

  if (config.polarization === 'TE') {
    const res = solveForPol(eta0_s, etaSub_s, false);
    return { reflectance: res.R, transmittance: res.T };
  } else if (config.polarization === 'TM') {
    const res = solveForPol(eta0_p, etaSub_p, true);
    return { reflectance: res.R, transmittance: res.T };
  } else {
    // Unpolarized: average of TE and TM
    const resS = solveForPol(eta0_s, etaSub_s, false);
    const resP = solveForPol(eta0_p, etaSub_p, true);
    return {
      reflectance: (resS.R + resP.R) * 0.5,
      transmittance: (resS.T + resP.T) * 0.5,
    };
  }
}

/**
 * Calculates continuous reflection and transmission spectrum across 380nm - 780nm
 */
export function calculateVisibleSpectrum(config: ThinFilmConfig, steps: number = 65): SpectrumPoint[] {
  const points: SpectrumPoint[] = [];
  const startWl = 380;
  const endWl = 780;
  const stepSize = (endWl - startWl) / (steps - 1);

  for (let i = 0; i < steps; i++) {
    const wl = startWl + i * stepSize;
    const { reflectance, transmittance } = calculateThinFilmResponse(config, wl);
    points.push({
      wavelengthNm: wl,
      reflectance,
      transmittance,
    });
  }

  return points;
}
