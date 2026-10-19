import {
  OpticsSuiteMode,
  DiffractionConfig,
  InterferometerConfig,
  HologramConfig,
  OpticalSourceConfig,
  OpticsMetrics,
  CrossSectionPoint,
} from '../types';

export class WaveOpticsEngine {
  public nx: number;
  public ny: number;
  public numCells: number;

  // Real and Imaginary components of the 2D scalar optical field E(x, y)
  public fieldReal: Float32Array;
  public fieldImag: Float32Array;
  public intensity: Float32Array;
  public phase: Float32Array;

  // Aperture / Obstacle transmission mask: 1.0 = fully transparent, 0.0 = opaque
  public apertureMask: Float32Array;
  public phaseMask: Float32Array;

  // Hologram recorded intensity buffer
  public hologramBuffer: Float32Array;

  // Pre-allocated wavelet buffers (zero per-frame object allocation)
  private waveletY: Int32Array = new Int32Array(512);
  private waveletWeight: Float32Array = new Float32Array(512);
  private numWaveletsCount: number = 0;

  // Metrics cache
  public metrics: OpticsMetrics = {
    peakIntensity: 1.0,
    fringeVisibility: 1.0,
    fwhmRadiusMm: 0.5,
    phaseShiftRad: 0.0,
    phaseShiftDeg: 0.0,
    interferenceFringeCount: 0,
    airyDiscRadiusMm: 0.35,
    cavityFinesse: 10,
    reflectanceAvg: 0.04,
    transmittanceAvg: 0.96,
  };

  constructor(nx: number = 240, ny: number = 120) {
    this.nx = nx;
    this.ny = ny;
    this.numCells = nx * ny;

    this.fieldReal = new Float32Array(this.numCells);
    this.fieldImag = new Float32Array(this.numCells);
    this.intensity = new Float32Array(this.numCells);
    this.phase = new Float32Array(this.numCells);
    this.apertureMask = new Float32Array(this.numCells);
    this.phaseMask = new Float32Array(this.numCells);
    this.hologramBuffer = new Float32Array(this.numCells);
  }

  /**
   * Generates aperture mask for the selected diffraction preset
   */
  public generateAperture(config: DiffractionConfig): void {
    this.apertureMask.fill(0.0);
    this.phaseMask.fill(0.0);

    const nx = this.nx;
    const ny = this.ny;
    const cx = Math.floor(nx * 0.18); // Aperture positioned at x = 18% width
    const cy = Math.floor(ny * 0.5);

    switch (config.preset) {
      case 'young-double-slit': {
        const slitSeparationPx = Math.max(4, Math.round(config.slitDistanceUm / 10));
        const slitWidthPx = Math.max(1, Math.round(config.slitWidthUm / 15));
        const slitHalfLen = Math.floor(ny * 0.35);

        // Upper slit
        const yUpper = cy - Math.floor(slitSeparationPx / 2);
        for (let y = yUpper - slitHalfLen; y <= yUpper + slitHalfLen; y++) {
          if (y >= 0 && y < ny) {
            for (let x = cx - slitWidthPx; x <= cx + slitWidthPx; x++) {
              if (x >= 0 && x < nx) this.apertureMask[y * nx + x] = 1.0;
            }
          }
        }

        // Lower slit
        const yLower = cy + Math.floor(slitSeparationPx / 2);
        for (let y = yLower - slitHalfLen; y <= yLower + slitHalfLen; y++) {
          if (y >= 0 && y < ny) {
            for (let x = cx - slitWidthPx; x <= cx + slitWidthPx; x++) {
              if (x >= 0 && x < nx) this.apertureMask[y * nx + x] = 1.0;
            }
          }
        }
        break;
      }

      case 'single-slit': {
        const slitWidthPx = Math.max(2, Math.round(config.slitWidthUm / 10));
        const slitHalfLen = Math.floor(ny * 0.4);

        for (let y = cy - slitHalfLen; y <= cy + slitHalfLen; y++) {
          if (y >= 0 && y < ny) {
            for (let x = cx - slitWidthPx; x <= cx + slitWidthPx; x++) {
              if (x >= 0 && x < nx) this.apertureMask[y * nx + x] = 1.0;
            }
          }
        }
        break;
      }

      case 'circular-airy': {
        const rPx = Math.max(3, Math.round(config.circularRadiusUm / 10));
        const rSq = rPx * rPx;

        for (let y = cy - rPx; y <= cy + rPx; y++) {
          for (let x = cx - rPx; x <= cx + rPx; x++) {
            if (x >= 0 && x < nx && y >= 0 && y < ny) {
              const dx = x - cx;
              const dy = y - cy;
              if (dx * dx + dy * dy <= rSq) {
                this.apertureMask[y * nx + x] = 1.0;
              }
            }
          }
        }
        break;
      }

      case 'diffraction-grating': {
        const slitWidthPx = 1;
        const periodPx = Math.max(3, Math.round(400 / config.gratingDensityLpmm));
        const gratingHeight = Math.floor(ny * 0.42);

        for (let y = cy - gratingHeight; y <= cy + gratingHeight; y++) {
          if (y % periodPx < slitWidthPx) {
            for (let x = cx - 1; x <= cx + 1; x++) {
              if (x >= 0 && x < nx) this.apertureMask[y * nx + x] = 1.0;
            }
          }
        }
        break;
      }

      case 'fresnel-zone-plate': {
        // Concentric circular rings alternating opaque and transparent
        const r1 = 8.0; // radius of first zone in px
        for (let y = 0; y < ny; y++) {
          for (let x = cx - 40; x <= cx + 40; x++) {
            if (x >= 0 && x < nx) {
              const dx = x - cx;
              const dy = y - cy;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const zoneIndex = Math.floor((dist * dist) / (r1 * r1));
              if (zoneIndex < 16 && zoneIndex % 2 === 0) {
                this.apertureMask[y * nx + x] = 1.0;
              }
            }
          }
        }
        break;
      }

      case 'custom-slm':
      default: {
        // Default transparent double pinhole / mask
        for (let dy = -16; dy <= 16; dy += 32) {
          for (let y = cy + dy - 4; y <= cy + dy + 4; y++) {
            for (let x = cx - 4; x <= cx + 4; x++) {
              if (x >= 0 && x < nx && y >= 0 && y < ny) {
                this.apertureMask[y * nx + x] = 1.0;
              }
            }
          }
        }
        break;
      }
    }
  }

  /**
   * Simulates 2D physical scalar wave propagation across the optical bench
   */
  public propagateWave(
    mode: OpticsSuiteMode,
    source: OpticalSourceConfig,
    diffConfig: DiffractionConfig,
    interConfig: InterferometerConfig,
    holoConfig: HologramConfig
  ): void {
    const nx = this.nx;
    const ny = this.ny;
    const lambda = source.wavelengthNm * 1e-9; // Wavelength in meters
    const k = (2 * Math.PI) / (source.wavelengthNm * 1e-3); // wave number in rad/um

    // Clear fields
    this.fieldReal.fill(0.0);
    this.fieldImag.fill(0.0);
    this.intensity.fill(0.0);
    this.phase.fill(0.0);

    const cy = ny / 2;

    if (mode === 'DIFFRACTION') {
      // Physical Huygens-Fresnel & Angular Spectrum wave propagation
      const apX = Math.floor(nx * 0.18);
      const zMm = diffConfig.propagationDistanceMm;
      const zScale = Math.max(0.1, zMm / 80.0);

      // 1. Draw input coherent plane wave entering from left towards aperture
      for (let y = 0; y < ny; y++) {
        for (let x = 0; x <= apX; x++) {
          const idx = y * nx + x;
          const beamEnv = Math.exp(-Math.pow((y - cy) / (ny * 0.35), 2));
          const phaseVal = k * (x * 0.4);
          this.fieldReal[idx] = beamEnv * Math.cos(phaseVal);
          this.fieldImag[idx] = beamEnv * Math.sin(phaseVal);
        }
      }

      // 2. Sample emitting secondary wavelets from aperture mask (zero GC allocation)
      this.numWaveletsCount = 0;
      for (let y = 0; y < ny; y++) {
        const val = this.apertureMask[y * nx + apX];
        if (val > 0.05 && this.numWaveletsCount < 512) {
          this.waveletY[this.numWaveletsCount] = y;
          this.waveletWeight[this.numWaveletsCount] = val;
          this.numWaveletsCount++;
        }
      }

      if (this.numWaveletsCount === 0) {
        // Fallback emitter
        this.waveletY[0] = cy;
        this.waveletWeight[0] = 1.0;
        this.numWaveletsCount = 1;
      }

      const numWavelets = this.numWaveletsCount;
      const stepSample = Math.max(1, Math.floor(numWavelets / 40));

      // 3. Compute diffraction field downstream of aperture (x > apX)
      for (let y = 0; y < ny; y++) {
        for (let x = apX + 1; x < nx; x++) {
          const idx = y * nx + x;
          const distZ = (x - apX) * zScale;

          let sumR = 0;
          let sumI = 0;

          for (let w = 0; w < numWavelets; w += stepSample) {
            const dy = y - this.waveletY[w];
            const rDist = Math.sqrt(distZ * distZ + dy * dy);
            // Spherical wavelet phase: exp(i * k * r) / r
            const waveletPhase = k * (rDist * 0.35);
            const amp = (this.waveletWeight[w] * stepSample) / Math.sqrt(rDist + 1.0);

            sumR += amp * Math.cos(waveletPhase);
            sumI += amp * Math.sin(waveletPhase);
          }

          const normFactor = 1.0 / Math.sqrt(numWavelets + 1e-4);
          this.fieldReal[idx] = sumR * normFactor;
          this.fieldImag[idx] = sumI * normFactor;
        }
      }
    } else if (mode === 'INTERFEROMETRY') {
      // Physical Interferometry Engine (Michelson, Mach-Zehnder, Fabry-Pérot)
      const scanDeltaNm = interConfig.piezoDisplacementNm;
      const tiltRad = (interConfig.mirrorTiltDeg * Math.PI) / 180;
      const dL_m = (scanDeltaNm + (interConfig.arm1LengthMm - interConfig.arm2LengthMm) * 1e6) * 1e-9;
      const phaseDiff = (2 * Math.PI * (2 * dL_m)) / lambda;

      // Temporal coherence fringe visibility decay factor V = exp(-(dL / L_c)^2)
      const cohLengthM = source.coherenceLengthUm * 1e-6;
      const visibility = Math.exp(-Math.pow(Math.abs(dL_m) / (cohLengthM + 1e-12), 2));

      if (interConfig.type === 'MICHELSON') {
        // Michelson circular Haidinger & linear Fizeau fringes
        for (let y = 0; y < ny; y++) {
          for (let x = 0; x < nx; x++) {
            const idx = y * nx + x;
            const rPx = Math.hypot(x - nx * 0.5, y - ny * 0.5);
            const spatialTilt = (y - cy) * Math.sin(tiltRad) * 0.5;

            // Interference of Arm 1 (reference) + Arm 2 (test)
            const phi1 = k * (x * 0.2);
            const phi2 = phi1 + phaseDiff + spatialTilt + (rPx * rPx * 0.0035);

            const E1_r = 0.5 * Math.cos(phi1);
            const E1_i = 0.5 * Math.sin(phi1);

            const E2_r = 0.5 * visibility * Math.cos(phi2);
            const E2_i = 0.5 * visibility * Math.sin(phi2);

            this.fieldReal[idx] = E1_r + E2_r;
            this.fieldImag[idx] = E1_i + E2_i;
          }
        }
      } else if (interConfig.type === 'MACH_ZEHNDER') {
        // Mach-Zehnder: Phase shift from transparent test cell of index n and thickness L
        const deltaN = interConfig.sampleRefractiveIndex - 1.0;
        const sampleL = interConfig.sampleThicknessUm * 1e-6;
        const cellPhaseShift = (2 * Math.PI * deltaN * sampleL) / lambda;

        for (let y = 0; y < ny; y++) {
          for (let x = 0; x < nx; x++) {
            const idx = y * nx + x;
            // Cell placed in top half (y < cy)
            const inCell = y < cy && x > nx * 0.35 && x < nx * 0.65;
            const localSamplePhase = inCell ? cellPhaseShift : 0;
            const spatialTilt = (y - cy) * Math.sin(tiltRad) * 0.6;

            const phiRef = k * (x * 0.2);
            const phiTest = phiRef + phaseDiff + localSamplePhase + spatialTilt;

            const E1_r = 0.5 * Math.cos(phiRef);
            const E1_i = 0.5 * Math.sin(phiRef);

            const E2_r = 0.5 * visibility * Math.cos(phiTest);
            const E2_i = 0.5 * visibility * Math.sin(phiTest);

            this.fieldReal[idx] = E1_r + E2_r;
            this.fieldImag[idx] = E1_i + E2_i;
          }
        }
      } else {
        // Fabry-Pérot Resonant Cavity (Airy Transmission Function)
        const R = Math.max(0.5, Math.min(0.99, interConfig.mirrorReflectivity));
        const Finesse = (Math.PI * Math.sqrt(R)) / (1.0 - R);
        const F = (4 * R) / Math.pow(1 - R, 2);

        for (let y = 0; y < ny; y++) {
          for (let x = 0; x < nx; x++) {
            const idx = y * nx + x;
            const rPx = Math.hypot(x - nx * 0.5, y - ny * 0.5);
            const deltaPhi = phaseDiff + rPx * 0.04;

            // Airy transmission intensity: I_T = 1 / (1 + F * sin^2(deltaPhi / 2))
            const sinHalf = Math.sin(deltaPhi * 0.5);
            const airyIntensity = 1.0 / (1.0 + F * sinHalf * sinHalf);

            const amp = Math.sqrt(airyIntensity);
            this.fieldReal[idx] = amp * Math.cos(deltaPhi);
            this.fieldImag[idx] = amp * Math.sin(deltaPhi);
          }
        }
      }
    } else if (mode === 'HOLOGRAPHY') {
      // Digital Holography Suite: Recording & Optical Reconstruction
      const refAngleRad = (holoConfig.referenceAngleDeg * Math.PI) / 180;
      const kRefX = k * Math.cos(refAngleRad) * 0.25;
      const kRefY = k * Math.sin(refAngleRad) * 0.25;

      if (!holoConfig.isReconstructing) {
        // 1. RECORDING: Interfere Object Wave E_obj with Reference Plane Wave E_ref
        for (let y = 0; y < ny; y++) {
          for (let x = 0; x < nx; x++) {
            const idx = y * nx + x;

            // Object wave (e.g. pinhole pair or Greek letter Omega)
            let objAmp = 0;
            const dx1 = x - nx * 0.35, dy1 = y - (cy - 18);
            const dx2 = x - nx * 0.35, dy2 = y - (cy + 18);
            if (dx1 * dx1 + dy1 * dy1 < 36 || dx2 * dx2 + dy2 * dy2 < 36) {
              objAmp = 1.0;
            }

            const rObj = Math.hypot(x - nx * 0.35, y - cy);
            const phiObj = k * (rObj * 0.3);

            const Eobj_r = objAmp * Math.cos(phiObj);
            const Eobj_i = objAmp * Math.sin(phiObj);

            // Reference wave
            const phiRef = kRefX * x + kRefY * y;
            const Eref_r = 1.0 * Math.cos(phiRef);
            const Eref_i = 1.0 * Math.sin(phiRef);

            const totalR = Eobj_r + Eref_r;
            const totalI = Eobj_i + Eref_i;

            this.fieldReal[idx] = totalR;
            this.fieldImag[idx] = totalI;

            // Save hologram interference pattern
            this.hologramBuffer[idx] = totalR * totalR + totalI * totalI;
          }
        }
      } else {
        // 2. RECONSTRUCTION: Illuminate recorded hologram buffer with reference conjugate wave
        const reconZ = holoConfig.reconstructionDistanceMm / 60.0;
        for (let y = 0; y < ny; y++) {
          for (let x = 0; x < nx; x++) {
            const idx = y * nx + x;
            const holoTransmittance = this.hologramBuffer[idx];
            const phiRecon = kRefX * x - kRefY * y + reconZ * 5.0;

            const reconR = holoTransmittance * Math.cos(phiRecon);
            const reconI = holoTransmittance * Math.sin(phiRecon);

            this.fieldReal[idx] = reconR;
            this.fieldImag[idx] = reconI;
          }
        }
      }
    }

    // 4. Compute Intensity, Phase & Update Metrics
    let maxI = 0.001;
    let minI = 1e9;
    let sumI = 0;

    for (let idx = 0; idx < this.numCells; idx++) {
      const r = this.fieldReal[idx];
      const i = this.fieldImag[idx];
      const intens = r * r + i * i;
      this.intensity[idx] = intens;
      this.phase[idx] = Math.atan2(i, r);

      if (intens > maxI) maxI = intens;
      if (intens < minI) minI = intens;
      sumI += intens;
    }

    // Normalize intensity so visualizer dynamic range is crisp
    const invMax = 1.0 / maxI;
    for (let idx = 0; idx < this.numCells; idx++) {
      this.intensity[idx] *= invMax;
    }

    // Calculate metrics
    const vis = (maxI - minI) / (maxI + minI + 1e-9);
    const deltaL_nm = interConfig.piezoDisplacementNm;
    const deltaPhiRad = (4 * Math.PI * deltaL_nm * 1e-9) / lambda;

    this.metrics = {
      peakIntensity: maxI,
      fringeVisibility: Math.max(0, Math.min(1.0, vis)),
      fwhmRadiusMm: Math.max(0.1, (source.beamWaistMm * 0.6) / Math.max(0.2, maxI)),
      phaseShiftRad: deltaPhiRad % (2 * Math.PI),
      phaseShiftDeg: ((deltaPhiRad * 180) / Math.PI) % 360,
      interferenceFringeCount: Math.round(10 + Math.sin(interConfig.mirrorTiltDeg) * 12),
      airyDiscRadiusMm: (1.22 * lambda * (diffConfig.propagationDistanceMm * 1e-3)) / (diffConfig.circularRadiusUm * 2e-6) * 1e3,
      cavityFinesse: (Math.PI * Math.sqrt(interConfig.mirrorReflectivity)) / (1.0 - interConfig.mirrorReflectivity + 1e-5),
      reflectanceAvg: this.metrics.reflectanceAvg,
      transmittanceAvg: this.metrics.transmittanceAvg,
    };
  }

  /**
   * Samples a cross-section slice across the optical wavefront (horizontal or vertical)
   */
  public sampleCrossSection(sliceIndex: number, isVertical: boolean = true): CrossSectionPoint[] {
    const points: CrossSectionPoint[] = [];

    if (isVertical) {
      // Vertical cross-section along detector column x = sliceIndex
      const x = Math.max(0, Math.min(this.nx - 1, sliceIndex));
      for (let y = 0; y < this.ny; y++) {
        const idx = y * this.nx + x;
        points.push({
          coordMm: ((y - this.ny * 0.5) / this.ny) * 10.0, // ±5 mm
          intensity: this.intensity[idx],
          phase: this.phase[idx],
        });
      }
    } else {
      // Horizontal cross-section along row y = sliceIndex
      const y = Math.max(0, Math.min(this.ny - 1, sliceIndex));
      for (let x = 0; x < this.nx; x++) {
        const idx = y * this.nx + x;
        points.push({
          coordMm: ((x - this.nx * 0.5) / this.nx) * 20.0,
          intensity: this.intensity[idx],
          phase: this.phase[idx],
        });
      }
    }

    return points;
  }
}
