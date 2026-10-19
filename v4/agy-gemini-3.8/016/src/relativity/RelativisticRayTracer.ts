import { LensingParams, ColormapMode } from '../types';

export class RelativisticRayTracer {
  public readonly width: number = 160;
  public readonly height: number = 120;

  // Offscreen ray-traced image buffer
  public pixelBuffer: Uint32Array;

  // Precomputed 256-color palettes
  public paletteFire: Uint32Array;
  public paletteRedshift: Uint32Array;
  public paletteCurvature: Uint32Array;

  // Telemetry metrics
  public maxDopplerBoost: number = 2.4;
  public minRedshiftG: number = 0.25;

  constructor() {
    const size = this.width * this.height;
    this.pixelBuffer = new Uint32Array(size);

    this.paletteFire = new Uint32Array(256);
    this.paletteRedshift = new Uint32Array(256);
    this.paletteCurvature = new Uint32Array(256);
    this.initPalettes();
  }

  private initPalettes() {
    for (let i = 0; i < 256; i++) {
      const t = i / 255.0;

      // 1. Accretion Fire: Black -> Dark Crimson -> Intense Orange/Amber -> Brilliant White
      let r1 = 0, g1 = 0, b1 = 0;
      if (t < 0.35) {
        const u = t / 0.35;
        r1 = Math.floor(180 * u);
        g1 = Math.floor(20 * u);
        b1 = Math.floor(10 * u);
      } else if (t < 0.75) {
        const u = (t - 0.35) / 0.4;
        r1 = Math.floor(180 + 75 * u);
        g1 = Math.floor(20 + 170 * u);
        b1 = Math.floor(10 + 20 * u);
      } else {
        const u = (t - 0.75) / 0.25;
        r1 = 255;
        g1 = Math.floor(190 + 65 * u);
        b1 = Math.floor(30 + 225 * u);
      }
      this.paletteFire[i] = (255 << 24) | (b1 << 16) | (g1 << 8) | r1;

      // 2. Gravitational Redshift: Violet (approaching blue-shifted) -> Cyan -> Amber -> Deep Red (gravitationally redshifted)
      let r2 = 0, g2 = 0, b2 = 0;
      if (t < 0.33) {
        const u = t * 3.0;
        r2 = Math.floor(160 * (1 - u) + 20 * u);
        g2 = Math.floor(30 * (1 - u) + 180 * u);
        b2 = Math.floor(240 * (1 - u) + 240 * u);
      } else if (t < 0.66) {
        const u = (t - 0.33) * 3.0;
        r2 = Math.floor(20 * (1 - u) + 245 * u);
        g2 = Math.floor(180 * (1 - u) + 158 * u);
        b2 = Math.floor(240 * (1 - u) + 11 * u);
      } else {
        const u = (t - 0.66) * 3.0;
        r2 = Math.floor(245 * (1 - u) + 220 * u);
        g2 = Math.floor(158 * (1 - u) + 38 * u);
        b2 = Math.floor(11 * (1 - u) + 38 * u);
      }
      this.paletteRedshift[i] = (255 << 24) | (b2 << 16) | (g2 << 8) | r2;

      // 3. Spacetime Curvature: Deep Indigo -> Electric Cyan -> Hot Violet
      const r3 = Math.floor(Math.min(255, t * 240 + Math.sin(t * Math.PI) * 50));
      const g3 = Math.floor(Math.min(255, Math.sin(t * Math.PI) * 200));
      const b3 = Math.floor(Math.min(255, 60 + (1 - t) * 190));
      this.paletteCurvature[i] = (255 << 24) | (b3 << 16) | (g3 << 8) | r3;
    }
  }

  /**
   * Fast relativistic null-geodesic ray tracer
   */
  public render(
    params: LensingParams,
    spinA: number,
    colormapMode: ColormapMode,
    timeSec: number = 0.0
  ) {
    const W = this.width;
    const H = this.height;
    const M = 1.0;
    const a = Math.max(-0.999, Math.min(0.999, spinA));

    // Observer geometry
    const D_obs = Math.max(10.0, params.observerDistance);
    const incRad = (Math.max(1.0, Math.min(88.0, params.inclinationDeg)) * Math.PI) / 180.0;
    const cosInc = Math.cos(incRad);
    const sinInc = Math.sin(incRad);

    // Characteristic radii
    const rH = M + Math.sqrt(Math.max(0.01, M * M - a * a));
    const rISCO = Math.max(rH + 0.1, params.diskInnerRadius);
    const rOut = Math.max(rISCO + 2.0, params.diskOuterRadius);

    // Shadow critical impact parameter (asymmetric for Kerr)
    // Prograde side is pushed inward, retrograde side pushed outward
    const bShadowMean = 3.0 * Math.sqrt(3.0) * M;
    const aShift = 2.0 * a * sinInc;

    // Palette selection
    let palette = this.paletteFire;
    if (colormapMode === 'GRAVITATIONAL_REDSHIFT') palette = this.paletteRedshift;
    else if (colormapMode === 'CURVATURE_KRETSCHMANN') palette = this.paletteCurvature;

    const scale = (params.fovDeg / 40.0) * (20.0 / W);

    let maxBoost = 1.0;
    let minRedshift = 1.0;

    for (let py = 0; py < H; py++) {
      // Screen coordinate y relative to center
      const sy = (py - H * 0.5) * scale;

      for (let px = 0; px < W; px++) {
        // Screen coordinate x relative to center
        const sx = (px - W * 0.5) * scale;
        const idx = py * W + px;

        // Effective impact parameter b with Kerr frame-dragging horizontal asymmetry
        const bX = sx - aShift;
        const bY = sy;
        const bSq = bX * bX + bY * bY;
        const b = Math.sqrt(bSq);

        // Angle on image plane
        const phiImg = Math.atan2(bY, bX);

        // 1. Black hole shadow test:
        // Critical capture radius with spin deformation
        const bCrit = bShadowMean * (1.0 - 0.28 * a * Math.cos(phiImg) * sinInc);

        if (b < bCrit) {
          // Inside event horizon shadow -> pure pitch black void
          this.pixelBuffer[idx] = 0xff02040a;
          continue;
        }

        // 2. Accretion Disk intersection & bending
        // Ray bending in Schwarzschild/Kerr: deflection angle alpha ~ 4M / b + 15*pi*M^2 / (4*b^2)
        const deflection = (4.0 * M) / b + (11.78 * M * M) / (b * b);

        // Intersection radius with equatorial plane z=0
        // Front side vs bent back-halo (light from rear bent above/below the hole)
        const rDirect = Math.abs(b / Math.sin(Math.max(0.08, incRad)));
        const rLensed = Math.abs((b * 1.35) / Math.cos(Math.max(0.05, deflection * 0.5)));

        let diskIntensity = 0.0;
        let dopplerFactor = 1.0;
        let gRedshift = 1.0;

        // Check if direct equatorial line of sight hits accretion disk
        if (rDirect >= rISCO && rDirect <= rOut) {
          const rNorm = (rDirect - rISCO) / (rOut - rISCO);
          const baseProfile = Math.pow(rNorm, 0.4) * Math.exp(-rNorm * 2.5);

          // Keplerian velocity in disk v/c = sqrt(M/r)
          const vKepler = Math.min(0.95, Math.sqrt(M / rDirect));
          // Doppler shift: left side approaching (px < W/2) -> blueshifted; right side receding
          const cosTheta = Math.max(-1.0, Math.min(1.0, -bX / Math.max(0.1, b)));
          const betaPar = Math.max(-0.99, Math.min(0.99, vKepler * cosTheta * sinInc));
          const gamma = 1.0 / Math.sqrt(Math.max(0.05, 1.0 - betaPar * betaPar));

          // Doppler factor delta = 1 / [gamma * (1 - beta_parallel)]
          dopplerFactor = 1.0 / Math.max(0.1, gamma * (1.0 - betaPar));

          // Gravitational redshift: g = sqrt(1 - 2M/r)
          gRedshift = Math.sqrt(Math.max(0.05, 1.0 - (2.0 * M) / rDirect));

          // Relativistic boosting: I_obs = I_emit * (delta * g)^4
          const boost = Math.pow(dopplerFactor * gRedshift, 3.5);
          diskIntensity += baseProfile * boost * params.accretionBrightness * 2.2;

          if (boost > maxBoost) maxBoost = boost;
          if (gRedshift < minRedshift) minRedshift = gRedshift;
        }

        // Check secondary lensed halo (rear of accretion disk warped over black hole)
        if (params.secondaryRings && rLensed >= rISCO && rLensed <= rOut * 0.8) {
          const rNorm = (rLensed - rISCO) / (rOut - rISCO);
          const lensedProfile = Math.pow(rNorm, 0.3) * Math.exp(-rNorm * 3.0);
          const vKepler = Math.min(0.95, Math.sqrt(M / rLensed));
          const cosTheta = Math.max(-1.0, Math.min(1.0, -bX / Math.max(0.1, b)));
          const betaPar = Math.max(-0.99, Math.min(0.99, vKepler * cosTheta * sinInc));
          const gamma = 1.0 / Math.sqrt(Math.max(0.05, 1.0 - betaPar * betaPar));
          const lensedDoppler = 1.0 / Math.max(0.1, gamma * (1.0 - betaPar));
          const lensedRedshift = Math.sqrt(Math.max(0.05, 1.0 - (2.0 * M) / rLensed));
          const lensedBoost = Math.pow(lensedDoppler * lensedRedshift, 3.2);

          diskIntensity += lensedProfile * lensedBoost * params.accretionBrightness * 1.5;
        }

        // Higher-order thin photon ring spike right at b ~ bCrit
        const distToCrit = b - bCrit;
        if (distToCrit > 0 && distToCrit < 0.35) {
          const photonRingSpike = Math.exp(-distToCrit * 12.0) * 1.4;
          diskIntensity += photonRingSpike;
        }

        // 3. Background Star Grid / Cosmic Deflection
        let starIntensity = 0.0;
        if (params.starFieldGrid && diskIntensity < 0.15) {
          // Deflected celestial angles
          const thetaDef = phiImg + deflection * 0.3;
          const gridU = Math.sin(thetaDef * 8.0) * Math.sin(b * 3.0);
          if (gridU > 0.94) {
            starIntensity = (gridU - 0.94) * 16.0;
          }
        }

        // Final color indexing
        let finalVal = Math.max(0.0, Math.min(1.0, diskIntensity + starIntensity));
        let colorIdx = Math.floor(finalVal * 255);

        if (colormapMode === 'GRAVITATIONAL_REDSHIFT') {
          // Color by gravitational redshift factor
          colorIdx = Math.floor(Math.max(0, Math.min(255, (1.0 - gRedshift) * 320)));
        } else if (colormapMode === 'CURVATURE_KRETSCHMANN') {
          // Kretschmann invariant K = 48 M^2 / r^6
          const kInv = Math.min(1.0, (48.0 * M * M) / Math.pow(Math.max(1.5, b), 3.5));
          colorIdx = Math.floor(kInv * 255);
        }

        this.pixelBuffer[idx] = palette[Math.max(0, Math.min(255, colorIdx))];
      }
    }

    this.maxDopplerBoost = maxBoost;
    this.minRedshiftG = minRedshift;
  }
}
