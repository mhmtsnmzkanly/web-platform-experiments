import { AirfoilProfile, AirfoilPresetId, ChordPressurePoint } from '../types';

export interface Point2D {
  x: number;
  y: number;
}

export const AIRFOIL_PRESETS: AirfoilProfile[] = [
  {
    id: 'naca0012',
    name: 'NACA 0012 (Symmetric)',
    category: 'SYMMETRIC',
    description: 'Classic symmetric aerobatic & helicopter blade section. Zero pitching moment at zero alpha.',
    details: '0% camber, 12% thickness. Linear lift slope dCL/dα ≈ 2π rad⁻¹ with sharp stall characteristic at ~15° angle of attack.',
    camber: 0.0,
    camberPos: 0.0,
    thickness: 0.12,
    chordLength: 60,
  },
  {
    id: 'naca2412',
    name: 'NACA 2412 (General Aviation)',
    category: 'CAMBERED',
    description: 'Workhorse general aviation airfoil (Cessna 172/182). Mild camber with gentle stall.',
    details: '2% camber at 40% chord, 12% thickness. Positive zero-lift angle of attack α_0 ≈ -2°, excellent L/D cruise efficiency.',
    camber: 0.02,
    camberPos: 0.4,
    thickness: 0.12,
    chordLength: 60,
  },
  {
    id: 'naca4415',
    name: 'NACA 4415 (High Lift / STOL)',
    category: 'HIGH_LIFT',
    description: 'Thick, high-camber wing designed for low takeoff speeds and high payload capacity.',
    details: '4% camber at 40% chord, 15% thickness. High maximum lift coefficient (CL_max > 1.6) and delayed trailing-edge stall.',
    camber: 0.04,
    camberPos: 0.4,
    thickness: 0.15,
    chordLength: 60,
  },
  {
    id: 'naca6409',
    name: 'NACA 6409 (Thin Cambered Glider)',
    category: 'HIGH_LIFT',
    description: 'High-camber undercambered airfoil for ultra-low Reynolds number gliders & birds.',
    details: '6% camber at 40% chord, 9% thickness. Exceptional thermalling glide ratio at Re < 100,000.',
    camber: 0.06,
    camberPos: 0.4,
    thickness: 0.09,
    chordLength: 60,
  },
  {
    id: 'cylinder',
    name: 'Circular Cylinder (Kármán Vortex Street)',
    category: 'BLUFF_BODY',
    description: 'Canonical bluff body benchmarking periodic von Kármán vortex shedding and Strouhal frequency.',
    details: 'Diameter D = 24 lattice units. Subcritical vortex shedding at Strouhal number St ≈ 0.20 with oscillating lift and high drag (CD ≈ 1.0).',
    camber: 0.0,
    camberPos: 0.0,
    thickness: 0.4,
    chordLength: 24,
  },
  {
    id: 'flat-plate',
    name: 'Flat Plate with Sharp Edge',
    category: 'BLUFF_BODY',
    description: 'Zero thickness plate demonstrating leading-edge flow separation bubble and thin-airfoil theory.',
    details: 'Thickness 1 unit, length 50 units. Demonstrates instantaneous flow detachment and turbulent vortex formation at non-zero alpha.',
    camber: 0.0,
    camberPos: 0.0,
    thickness: 0.02,
    chordLength: 50,
  },
  {
    id: 'wedge',
    name: 'Supersonic Wedge (Diamond Airfoil)',
    category: 'SUPERSONIC',
    description: 'Double-wedge diamond cross-section designed to minimize wave drag at trans/supersonic regimes.',
    details: 'Sharp leading and trailing edges. Shows shock-like stagnation lines and sudden oblique expansion fans in fluid dynamics.',
    camber: 0.0,
    camberPos: 0.5,
    thickness: 0.14,
    chordLength: 55,
  },
];

/**
 * Generates polygon coordinates for a NACA 4-digit airfoil
 */
export function generateNacaCoordinates(
  profile: AirfoilProfile,
  numPoints: number = 80
): Point2D[] {
  const { camber: m, camberPos: p, thickness: t } = profile;
  const upperPoints: Point2D[] = [];
  const lowerPoints: Point2D[] = [];

  for (let i = 0; i <= numPoints; i++) {
    // Non-linear cosine spacing for high resolution near leading edge
    const beta = (i / numPoints) * Math.PI;
    const x = 0.5 * (1 - Math.cos(beta)); // 0.0 to 1.0

    // 1. Camber line y_c and slope dy_c/dx
    let yc = 0;
    let dycdx = 0;

    if (m > 0 && p > 0) {
      if (x < p) {
        yc = (m / (p * p)) * (2 * p * x - x * x);
        dycdx = ((2 * m) / (p * p)) * (p - x);
      } else {
        yc = (m / ((1 - p) * (1 - p))) * (1 - 2 * p + 2 * p * x - x * x);
        dycdx = ((2 * m) / ((1 - p) * (1 - p))) * (p - x);
      }
    }

    const theta = Math.atan(dycdx);

    // 2. Thickness distribution y_t
    // Using closed trailing edge coefficient -0.1036
    const yt =
      5 *
      t *
      (0.2969 * Math.sqrt(Math.max(0, x)) -
        0.126 * x -
        0.3516 * x * x +
        0.2843 * Math.pow(x, 3) -
        0.1036 * Math.pow(x, 4));

    // 3. Upper and lower surface points
    upperPoints.push({
      x: x - yt * Math.sin(theta),
      y: yc + yt * Math.cos(theta),
    });

    lowerPoints.push({
      x: x + yt * Math.sin(theta),
      y: yc - yt * Math.cos(theta),
    });
  }

  // Combine into closed clockwise polygon: upper from 0 to 1, then lower from 1 to 0
  return [...upperPoints, ...lowerPoints.reverse().slice(1)];
}

/**
 * Checks if a 2D point (px, py) is inside a polygon
 */
function isPointInPolygon(p: Point2D, polygon: Point2D[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect =
      yi > p.y !== yj > p.y && p.x < ((xj - xi) * (p.y - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Rasterizes an airfoil profile or geometry onto a 2D lattice grid
 */
export function rasterizeObstacleToGrid(
  profile: AirfoilProfile,
  angleDeg: number,
  nx: number,
  ny: number,
  originX: number,
  originY: number
): Uint8Array {
  const mask = new Uint8Array(nx * ny);
  const angleRad = (angleDeg * Math.PI) / 180;
  const cosA = Math.cos(angleRad);
  const sinA = Math.sin(angleRad);

  if (profile.id === 'cylinder') {
    const radius = profile.chordLength * 0.5;
    const rSq = radius * radius;
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        const dx = x - originX;
        const dy = y - originY;
        if (dx * dx + dy * dy <= rSq) {
          mask[y * nx + x] = 1;
        }
      }
    }
    return mask;
  }

  if (profile.id === 'flat-plate') {
    const length = profile.chordLength;
    const halfL = length * 0.5;
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        const dx = x - originX;
        const dy = y - originY;
        // Transform to plate frame
        const localX = dx * cosA + dy * sinA;
        const localY = -dx * sinA + dy * cosA;
        if (Math.abs(localX) <= halfL && Math.abs(localY) <= 1.2) {
          mask[y * nx + x] = 1;
        }
      }
    }
    return mask;
  }

  if (profile.id === 'wedge') {
    const length = profile.chordLength;
    const halfH = length * profile.thickness * 0.5;
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        const dx = x - originX;
        const dy = y - originY;
        const localX = dx * cosA + dy * sinA;
        const localY = -dx * sinA + dy * cosA;
        const xi = localX + length * 0.5; // 0 to length
        if (xi >= 0 && xi <= length) {
          const maxThickAtX = (1 - Math.abs((xi - length * 0.5) / (length * 0.5))) * halfH;
          if (Math.abs(localY) <= maxThickAtX) {
            mask[y * nx + x] = 1;
          }
        }
      }
    }
    return mask;
  }

  // Standard NACA Airfoil Polygon
  const rawCoords = generateNacaCoordinates(profile, 70);
  const chord = profile.chordLength;

  // Scale and rotate points: rotation pivot is quarter-chord (0.25, 0)
  const pivotX = 0.25;
  const pivotY = 0.0;

  const worldPolygon: Point2D[] = rawCoords.map((pt) => {
    const relX = (pt.x - pivotX) * chord;
    const relY = (pt.y - pivotY) * chord;

    // Invert Y because canvas Y points down, but airfoil lift points up
    const invertedY = -relY;

    // Rotate by angle of attack (positive alpha = nose up)
    const rotX = relX * cosA - invertedY * sinA;
    const rotY = relX * sinA + invertedY * cosA;

    return {
      x: originX + rotX,
      y: originY + rotY,
    };
  });

  // Find bounding box for fast scan
  let minX = nx,
    maxX = 0,
    minY = ny,
    maxY = 0;
  for (const p of worldPolygon) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const startX = Math.max(0, Math.floor(minX) - 1);
  const endX = Math.min(nx - 1, Math.ceil(maxX) + 1);
  const startY = Math.max(0, Math.floor(minY) - 1);
  const endY = Math.min(ny - 1, Math.ceil(maxY) + 1);

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      if (isPointInPolygon({ x, y }, worldPolygon)) {
        mask[y * nx + x] = 1;
      }
    }
  }

  return mask;
}
