/**
 * ORBITAL-SLINGSHOT (EXP-025) — Curated Mission Scenarios
 * Calibrated Astrodynamic Systems in Natural Astronomical Units
 * [Length: AU, Time: Years, Mass: Solar Masses (M_sun = 1.0)]
 */

import { MissionScenario } from '../types';

export const MISSION_SCENARIOS: MissionScenario[] = [
  {
    id: 'lunar-insertion',
    title: 'Mission 1: The Moonshot',
    subtitle: 'Direct Trans-Lunar Injection & Lunar Orbit Capture',
    briefing:
      'Launch from Low Earth Orbit on a trans-lunar trajectory. Time your departure burn to intersect the Moon, graze its leading edge for orbital deceleration or brake into a stable Low Lunar Orbit.',
    objective: 'Enter Lunar Sphere of Influence and achieve stable capture with periapsis between 5,000 km and 30,000 km.',
    targetBodyId: 'moon',
    targetPeriapsisMin: 0.000033, // ~5,000 km
    targetPeriapsisMax: 0.00020,  // ~30,000 km
    maxSimulationYears: 0.1,
    bodies: [
      {
        id: 'earth',
        name: 'Earth',
        mass: 3.003e-6,           // Earth mass in M_sun
        radius: 0.0000426,        // 6,371 km in AU
        displayRadius: 18,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        color: '#38bdf8',
        glowColor: 'rgba(56, 189, 248, 0.4)',
        soiRadius: 0.00618,       // ~925,000 km
        isStar: false,
        trail: [],
      },
      {
        id: 'moon',
        name: 'Moon',
        mass: 3.69e-8,            // Lunar mass in M_sun
        radius: 0.0000116,        // 1,737 km in AU
        displayRadius: 9,
        x: 0.00257,               // 384,400 km in AU
        y: 0,
        vx: 0,
        vy: 0.216,                // ~1.02 km/s in AU/yr
        color: '#cbd5e1',
        glowColor: 'rgba(203, 213, 225, 0.3)',
        soiRadius: 0.00044,       // ~66,000 km
        isStar: false,
        trail: [],
      },
    ],
    spacecraft: {
      id: 'apollo-probe',
      name: 'Artemis Pathfinder',
      x: 0.0001,                  // ~15,000 km altitude LEO
      y: 0,
      vx: 0,
      vy: 1.09,                   // ~5.16 km/s orbital speed
      mass: 5.0,
      totalDeltaV: 4.2,           // km/s propellant reserve
      remainingDeltaV: 4.2,
      trail: [],
      isCrashed: false,
      isEscaped: false,
    },
    initialManeuver: {
      id: 'tli-burn',
      epoch: 0.001,
      progradeDeltaV: 3.12,       // ~3.12 km/s TLI burn
      radialDeltaV: 0.0,
      isExecuted: false,
    },
  },
  {
    id: 'grand-tour',
    title: 'Mission 2: Voyager Grand Tour',
    subtitle: 'Planetary Gravity Assist Catapult (Jupiter to Saturn)',
    briefing:
      'Harness celestial mechanics to reach the outer solar system! Pass through Jupiter’s trailing hemisphere to gain orbital momentum and slingshot towards Saturn with zero additional propellant.',
    objective: 'Execute a trailing gravity assist at Jupiter to raise heliocentric apoapsis beyond 9.0 AU.',
    targetBodyId: 'saturn',
    targetApoapsisMin: 9.0,       // AU
    targetApoapsisMax: 12.0,      // AU
    maxSimulationYears: 5.0,
    bodies: [
      {
        id: 'sun',
        name: 'Sun',
        mass: 1.0,
        radius: 0.00465,          // Solar radius ~696,340 km
        displayRadius: 24,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        color: '#fbbf24',
        glowColor: 'rgba(251, 191, 36, 0.6)',
        soiRadius: 50.0,
        isStar: true,
        trail: [],
      },
      {
        id: 'jupiter',
        name: 'Jupiter',
        mass: 0.000954,           // 317.8 Earth masses
        radius: 0.000477,         // ~71,492 km
        displayRadius: 16,
        x: 5.2,
        y: 0,
        vx: 0,
        vy: 2.756,                // ~13.06 km/s in AU/yr
        color: '#f97316',
        glowColor: 'rgba(249, 115, 22, 0.4)',
        soiRadius: 0.32,          // ~48 million km
        isStar: false,
        trail: [],
      },
      {
        id: 'saturn',
        name: 'Saturn',
        mass: 0.000285,           // 95.2 Earth masses
        radius: 0.000402,         // ~60,268 km
        displayRadius: 13,
        x: 0,
        y: 9.54,
        vx: -2.035,               // ~9.65 km/s in AU/yr
        vy: 0,
        color: '#fde047',
        glowColor: 'rgba(253, 224, 71, 0.3)',
        soiRadius: 0.36,
        isStar: false,
        trail: [],
      },
    ],
    spacecraft: {
      id: 'voyager-probe',
      name: 'Voyager III',
      x: 1.0,
      y: 0,
      vx: 0,
      vy: 8.35,                   // ~39.6 km/s (transfer ellipse to Jupiter)
      mass: 0.8,
      totalDeltaV: 1.5,
      remainingDeltaV: 1.5,
      trail: [],
      isCrashed: false,
      isEscaped: false,
    },
    initialManeuver: {
      id: 'course-correction',
      epoch: 0.2,
      progradeDeltaV: 0.15,
      radialDeltaV: 0.05,
      isExecuted: false,
    },
  },
  {
    id: 'hohmann-mars',
    title: 'Mission 3: Hohmann Mars Express',
    subtitle: 'Optimal Minimum-Energy Interplanetary Transfer',
    briefing:
      'Plan the classic Hohmann transfer orbit between Earth and Mars. Calculate the departure impulse to match Mars’ orbital radius (1.524 AU) and execute the braking burn to establish capture.',
    objective: 'Reach Mars orbital radius (1.524 AU) and insert into orbit with eccentricity e < 0.15.',
    targetBodyId: 'mars',
    targetPeriapsisMin: 1.45,
    targetPeriapsisMax: 1.58,
    maxSimulationYears: 2.0,
    bodies: [
      {
        id: 'sun',
        name: 'Sun',
        mass: 1.0,
        radius: 0.00465,
        displayRadius: 24,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        color: '#fbbf24',
        glowColor: 'rgba(251, 191, 36, 0.6)',
        soiRadius: 50.0,
        isStar: true,
        trail: [],
      },
      {
        id: 'earth',
        name: 'Earth',
        mass: 3.003e-6,
        radius: 0.0000426,
        displayRadius: 10,
        x: 1.0,
        y: 0,
        vx: 0,
        vy: 6.283,                // 2*pi AU/yr = ~29.78 km/s
        color: '#38bdf8',
        glowColor: 'rgba(56, 189, 248, 0.4)',
        soiRadius: 0.00618,
        isStar: false,
        trail: [],
      },
      {
        id: 'mars',
        name: 'Mars',
        mass: 3.227e-7,           // 0.107 Earth masses
        radius: 0.0000226,        // 3,390 km
        displayRadius: 8,
        x: -1.524,
        y: 0,
        vx: 0,
        vy: -5.09,                // ~24.13 km/s in AU/yr
        color: '#ef4444',
        glowColor: 'rgba(239, 68, 68, 0.4)',
        soiRadius: 0.00385,       // ~576,000 km
        isStar: false,
        trail: [],
      },
    ],
    spacecraft: {
      id: 'mars-express',
      name: 'Ares Surveyor',
      x: 1.0,
      y: 0,
      vx: 0,
      vy: 6.283,
      mass: 1.2,
      totalDeltaV: 6.0,
      remainingDeltaV: 6.0,
      trail: [],
      isCrashed: false,
      isEscaped: false,
    },
    initialManeuver: {
      id: 'trans-mars-injection',
      epoch: 0.01,
      progradeDeltaV: 2.945,      // Exact analytical Hohmann departure impulse
      radialDeltaV: 0.0,
      isExecuted: false,
    },
  },
  {
    id: 'trojan-parking',
    title: 'Mission 4: Trojan Lagrange L4 Insertion',
    subtitle: 'Navigating into the Equilateral Gravitational Sweet Spot',
    briefing:
      'Enter the gravitational sanctuary of the Sun-Jupiter L4 Lagrange point, located 60° ahead of Jupiter in its orbit. Fine-tune your velocity to achieve stable libration without drifting away.',
    objective: 'Librate within 0.3 AU of the L4 Lagrange point with relative velocity < 1.0 km/s.',
    targetBodyId: 'jupiter',
    maxSimulationYears: 6.0,
    bodies: [
      {
        id: 'sun',
        name: 'Sun',
        mass: 1.0,
        radius: 0.00465,
        displayRadius: 24,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        color: '#fbbf24',
        glowColor: 'rgba(251, 191, 36, 0.6)',
        soiRadius: 50.0,
        isStar: true,
        trail: [],
      },
      {
        id: 'jupiter',
        name: 'Jupiter',
        mass: 0.000954,
        radius: 0.000477,
        displayRadius: 16,
        x: 5.2,
        y: 0,
        vx: 0,
        vy: 2.756,
        color: '#f97316',
        glowColor: 'rgba(249, 115, 22, 0.4)',
        soiRadius: 0.32,
        isStar: false,
        trail: [],
      },
    ],
    spacecraft: {
      id: 'trojan-probe',
      name: 'Lucy Scout',
      // Start in eccentric transfer approaching 60 deg ahead of Jupiter (x = 2.6, y = 4.5)
      x: 2.5,
      y: 4.3,
      vx: -2.3,
      vy: 1.4,
      mass: 0.9,
      totalDeltaV: 2.8,
      remainingDeltaV: 2.8,
      trail: [],
      isCrashed: false,
      isEscaped: false,
    },
    initialManeuver: {
      id: 'l4-capture',
      epoch: 0.15,
      progradeDeltaV: -0.4,
      radialDeltaV: 0.2,
      isExecuted: false,
    },
  },
  {
    id: 'asteroid-deflection',
    title: 'Mission 5: Planetary Shield Slingshot',
    subtitle: 'Gravitational Slingshot & Asteroid Kinetic Deflection',
    briefing:
      'A massive near-Earth asteroid is on an inbound collision course. Perform a high-speed close Earth flyby to amplify your probe’s velocity, intercept the asteroid, and deflect its trajectory away from Earth.',
    objective: 'Intercept the asteroid before Earth encounter (T < 0.8 yr) and nudge its periapsis by at least 0.05 AU.',
    targetBodyId: 'asteroid',
    maxSimulationYears: 1.5,
    bodies: [
      {
        id: 'sun',
        name: 'Sun',
        mass: 1.0,
        radius: 0.00465,
        displayRadius: 24,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        color: '#fbbf24',
        glowColor: 'rgba(251, 191, 36, 0.6)',
        soiRadius: 50.0,
        isStar: true,
        trail: [],
      },
      {
        id: 'earth',
        name: 'Earth',
        mass: 3.003e-6,
        radius: 0.0000426,
        displayRadius: 12,
        x: 1.0,
        y: 0,
        vx: 0,
        vy: 6.283,
        color: '#38bdf8',
        glowColor: 'rgba(56, 189, 248, 0.4)',
        soiRadius: 0.00618,
        isStar: false,
        trail: [],
      },
      {
        id: 'asteroid',
        name: 'Apophis-X',
        mass: 1e-14,              // Asteroid negligible mass
        radius: 0.000005,
        displayRadius: 6,
        x: 1.25,
        y: 0.45,
        vx: -3.8,
        vy: -4.2,
        color: '#a8a29e',
        glowColor: 'rgba(168, 162, 158, 0.4)',
        soiRadius: 0.00001,
        isStar: false,
        trail: [],
      },
    ],
    spacecraft: {
      id: 'dart-probe',
      name: 'Aegis Interceptor',
      x: 0.98,
      y: -0.05,
      vx: 2.1,
      vy: 6.6,
      mass: 1.5,
      totalDeltaV: 4.5,
      remainingDeltaV: 4.5,
      trail: [],
      isCrashed: false,
      isEscaped: false,
    },
    initialManeuver: {
      id: 'flyby-pump',
      epoch: 0.04,
      progradeDeltaV: 0.8,
      radialDeltaV: -0.3,
      isExecuted: false,
    },
  },
];
