/**
 * PLASMA-LAB: Tokamak Presets & Fusion Scenarios
 */

import { FusionScenario } from '../types';

export const FUSION_SCENARIOS: FusionScenario[] = [
  {
    id: 'iter-baseline',
    name: 'ITER Q=10 Burning Plasma Baseline',
    tagline: 'Standard 500 MW D-T high-confinement H-mode scenario',
    description:
      'The international thermonuclear benchmark: 6.2m major radius, 15 MA plasma current, and 5.3 Tesla toroidal field. Generates 500 MW of fusion power from 50 MW of auxiliary heating (Q = 10) with active feedback stabilization.',
    geometry: {
      majorRadiusR0: 6.2,
      minorRadiusA: 2.0,
      elongationKappa: 1.85,
      triangularityDelta: 0.48,
      toroidalFieldB0: 5.3,
      plasmaCurrentIp: 15.0,
    },
    controls: {
      nbiPowerMw: 33.0,
      ecrhPowerMw: 17.0,
      fuelingRateTorrLS: 45.0,
      targetDensityN20: 1.05,
      impurityFractionZeff: 1.4,
      feedbackVdeEnabled: true,
      upperPfCurrentKa: 120.0,
      lowerPfCurrentKa: 120.0,
      divertorCoilCurrentKa: 180.0,
    },
  },
  {
    id: 'spherical-tokamak',
    name: 'Spherical Tokamak (MAST-U / NSTX-U)',
    tagline: 'Ultra-low aspect ratio high-beta compact geometry',
    description:
      'Tight aspect ratio (A = R/a = 1.31) with natural vertical elongation (kappa = 2.4). Achieves exceptionally high toroidal beta (beta_T > 20%) at modest magnetic field strength (0.95 T), pioneering compact fusion powerplant design.',
    geometry: {
      majorRadiusR0: 0.85,
      minorRadiusA: 0.65,
      elongationKappa: 2.4,
      triangularityDelta: 0.55,
      toroidalFieldB0: 0.95,
      plasmaCurrentIp: 1.8,
    },
    controls: {
      nbiPowerMw: 5.0,
      ecrhPowerMw: 2.5,
      fuelingRateTorrLS: 20.0,
      targetDensityN20: 0.75,
      impurityFractionZeff: 1.2,
      feedbackVdeEnabled: true,
      upperPfCurrentKa: 45.0,
      lowerPfCurrentKa: 45.0,
      divertorCoilCurrentKa: 60.0,
    },
  },
  {
    id: 'high-beta-advanced',
    name: 'Advanced Tokamak Steady-State (AT)',
    tagline: 'Non-inductive current drive with high bootstrap fraction',
    description:
      'Advanced tokamak regime optimized for continuous steady-state operation without central solenoid reliance. Features reversed magnetic shear profile q(0) > 2, high bootstrap current fraction (f_bs > 65%), and internal transport barrier.',
    geometry: {
      majorRadiusR0: 5.4,
      minorRadiusA: 1.6,
      elongationKappa: 2.05,
      triangularityDelta: 0.62,
      toroidalFieldB0: 4.2,
      plasmaCurrentIp: 10.5,
    },
    controls: {
      nbiPowerMw: 40.0,
      ecrhPowerMw: 25.0,
      fuelingRateTorrLS: 35.0,
      targetDensityN20: 0.95,
      impurityFractionZeff: 1.3,
      feedbackVdeEnabled: true,
      upperPfCurrentKa: 95.0,
      lowerPfCurrentKa: 95.0,
      divertorCoilCurrentKa: 140.0,
    },
  },
  {
    id: 'field-reversed',
    name: 'Field-Reversed Configuration (FRC)',
    tagline: 'Diamagnetic self-confined compact toroid with beta ~ 85%',
    description:
      'High-beta compact toroid where internal plasma currents reverse the direction of the applied axial magnetic field, creating closed poloidal flux surfaces with nearly zero toroidal magnetic field and extreme beta values.',
    geometry: {
      majorRadiusR0: 2.2,
      minorRadiusA: 1.1,
      elongationKappa: 1.15,
      triangularityDelta: 0.05,
      toroidalFieldB0: 2.8,
      plasmaCurrentIp: 8.0,
    },
    controls: {
      nbiPowerMw: 45.0,
      ecrhPowerMw: 10.0,
      fuelingRateTorrLS: 50.0,
      targetDensityN20: 1.4,
      impurityFractionZeff: 1.15,
      feedbackVdeEnabled: true,
      upperPfCurrentKa: 70.0,
      lowerPfCurrentKa: 70.0,
      divertorCoilCurrentKa: 80.0,
    },
  },
  {
    id: 'vde-disruption',
    name: 'Uncontrolled VDE & Major Disruption',
    tagline: 'Vertical Displacement Event without feedback stabilization',
    description:
      'High elongation (kappa = 2.15) with active vertical position feedback disabled. Demonstrates rapid vertical drift, wall contact with upper divertor armor, sudden thermal quench, current quench collapse, and halo current generation.',
    geometry: {
      majorRadiusR0: 6.2,
      minorRadiusA: 2.0,
      elongationKappa: 2.15,
      triangularityDelta: 0.40,
      toroidalFieldB0: 5.0,
      plasmaCurrentIp: 14.5,
    },
    controls: {
      nbiPowerMw: 35.0,
      ecrhPowerMw: 15.0,
      fuelingRateTorrLS: 40.0,
      targetDensityN20: 1.1,
      impurityFractionZeff: 1.8,
      feedbackVdeEnabled: false, // Disabled to induce VDE!
      upperPfCurrentKa: 140.0,
      lowerPfCurrentKa: 110.0,
      divertorCoilCurrentKa: 160.0,
    },
  },
];
