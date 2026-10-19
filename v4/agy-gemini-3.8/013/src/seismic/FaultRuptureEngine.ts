import { FaultConfig, GeologyLayer, SeismicScenarioId } from '../types';

export const STANDARD_GEOLOGY_LAYERS: GeologyLayer[] = [
  {
    id: 'upper-crust',
    name: 'Upper Continental Crust (Granitic)',
    depthTopKm: 0,
    depthBottomKm: 15,
    vpKmS: 5.8,
    vsKmS: 3.3,
    densityGcm3: 2.65,
    color: '#334155',
  },
  {
    id: 'lower-crust',
    name: 'Lower Crust (Basaltic / Granulite)',
    depthTopKm: 15,
    depthBottomKm: 35,
    vpKmS: 6.6,
    vsKmS: 3.8,
    densityGcm3: 2.92,
    color: '#1e293b',
  },
  {
    id: 'upper-mantle',
    name: 'Sub-Moho Lithospheric Mantle (Peridotite)',
    depthTopKm: 35,
    depthBottomKm: 120,
    vpKmS: 8.1,
    vsKmS: 4.6,
    densityGcm3: 3.32,
    color: '#0f172a',
  },
];

export interface ScenarioDefinition {
  id: SeismicScenarioId;
  name: string;
  subtitle: string;
  description: string;
  fault: FaultConfig;
  basinDepthKm: number;
  oceanBathymetryKm: number;
}

export const SEISMIC_SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'cascadia-subduction',
    name: 'Cascadia Megathrust Subduction (Mw 9.0)',
    subtitle: 'Offshore Shallow-Dip Thrust Rupture & Coastal Tsunami Uplift',
    description: 'A massive Mw 9.0 megathrust event rupturing the locked interface between the subducting Juan de Fuca plate and North American plate, uplifting the seafloor by over 5 meters and launching deep-ocean tsunami wave trains.',
    fault: {
      hypocenterXKm: 45,
      hypocenterDepthKm: 18,
      dipAngleDeg: 14,
      mechanism: 'THRUST_SUBDUCTION',
      stressDropMpa: 12.0,
      momentMagnitudeMw: 9.0,
      ruptureLengthKm: 120,
      ruptureVelocityKmS: 2.8,
      isRupturing: false,
      ruptureProgress: 0,
    },
    basinDepthKm: 0,
    oceanBathymetryKm: 3.8,
  },
  {
    id: 'san-andreas-transform',
    name: 'San Andreas Strike-Slip Fault (Mw 7.8)',
    subtitle: 'Near-Vertical Strike-Slip Rupture with High S-Wave Shear',
    description: 'A shallow continental transform fault rupture cutting through the upper crust, radiating intense quadrupolar S-wave transverse motion and high-energy Rayleigh surface waves.',
    fault: {
      hypocenterXKm: 110,
      hypocenterDepthKm: 10,
      dipAngleDeg: 90,
      mechanism: 'STRIKE_SLIP',
      stressDropMpa: 8.5,
      momentMagnitudeMw: 7.8,
      ruptureLengthKm: 65,
      ruptureVelocityKmS: 3.1,
      isRupturing: false,
      ruptureProgress: 0,
    },
    basinDepthKm: 0,
    oceanBathymetryKm: 0,
  },
  {
    id: 'sedimentary-basin',
    name: 'Sedimentary Basin Wave Trap (Mw 7.2)',
    subtitle: 'Resonant Amplification & Long-Duration Surface Wave Trapping',
    description: 'Seismic waves entering a deep, low-velocity alluvial sediment basin undergo severe constructive interference, wave slowing, and resonance, prolonging shaking duration by 300%.',
    fault: {
      hypocenterXKm: 55,
      hypocenterDepthKm: 14,
      dipAngleDeg: 60,
      mechanism: 'NORMAL',
      stressDropMpa: 7.0,
      momentMagnitudeMw: 7.2,
      ruptureLengthKm: 35,
      ruptureVelocityKmS: 2.7,
      isRupturing: false,
      ruptureProgress: 0,
    },
    basinDepthKm: 12,
    oceanBathymetryKm: 0,
  },
  {
    id: 'intraplate-deep',
    name: 'Wadati-Benioff Deep Slab Rupture (Mw 7.5)',
    subtitle: 'Deep Mantle Slab Earthquake at 75 km Depth',
    description: 'A deep intraslab earthquake within the subducting oceanic lithosphere. Characterized by high P-wave arrival speeds and minimal Rayleigh surface wave excitation at the surface.',
    fault: {
      hypocenterXKm: 130,
      hypocenterDepthKm: 75,
      dipAngleDeg: 45,
      mechanism: 'NORMAL',
      stressDropMpa: 15.0,
      momentMagnitudeMw: 7.5,
      ruptureLengthKm: 40,
      ruptureVelocityKmS: 3.9,
      isRupturing: false,
      ruptureProgress: 0,
    },
    basinDepthKm: 0,
    oceanBathymetryKm: 0,
  },
  {
    id: 'caldera-collapse',
    name: 'Volcanic Caldera Ring-Fault Collapse (Mw 6.8)',
    subtitle: 'Shallow Volcanic Magma Chamber Roof Piston Collapse',
    description: 'A catastrophic piston collapse of a volcanic caldera roof into an evacuated magma chamber, radiating an intense isotropic P-wave compressional pulse.',
    fault: {
      hypocenterXKm: 120,
      hypocenterDepthKm: 5,
      dipAngleDeg: 75,
      mechanism: 'NORMAL',
      stressDropMpa: 9.0,
      momentMagnitudeMw: 6.8,
      ruptureLengthKm: 15,
      ruptureVelocityKmS: 2.2,
      isRupturing: false,
      ruptureProgress: 0,
    },
    basinDepthKm: 0,
    oceanBathymetryKm: 0,
  },
];
