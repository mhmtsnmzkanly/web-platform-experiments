import { ReactionDiffusionParams } from '../types';

export const RD_PRESETS: Record<string, ReactionDiffusionParams> = {
  MITOSIS_SPOTS: {
    Da: 1.0,
    Db: 0.5,
    feed: 0.0367,
    kill: 0.0649,
    iterationsPerFrame: 4,
  },
  CORAL_LABYRINTH: {
    Da: 1.0,
    Db: 0.5,
    feed: 0.029,
    kill: 0.057,
    iterationsPerFrame: 4,
  },
  SPIRAL_WAVES: {
    Da: 1.0,
    Db: 0.5,
    feed: 0.018,
    kill: 0.051,
    iterationsPerFrame: 4,
  },
  SOLITON_CHAOS: {
    Da: 1.0,
    Db: 0.5,
    feed: 0.03,
    kill: 0.062,
    iterationsPerFrame: 4,
  },
};

export class ReactionDiffusionEngine {
  public width: number;
  public height: number;
  public params: ReactionDiffusionParams;

  // Grid fields: Float32Array for high performance
  public u: Float32Array;
  public v: Float32Array;
  private nextU: Float32Array;
  private nextV: Float32Array;

  constructor(width: number = 200, height: number = 150, params: ReactionDiffusionParams = RD_PRESETS.CORAL_LABYRINTH) {
    this.width = width;
    this.height = height;
    this.params = { ...params };

    const size = width * height;
    this.u = new Float32Array(size);
    this.v = new Float32Array(size);
    this.nextU = new Float32Array(size);
    this.nextV = new Float32Array(size);

    this.reset();
  }

  public reset() {
    const size = this.width * this.height;
    // Initial state: U is full (1.0), V is empty (0.0)
    this.u.fill(1.0);
    this.v.fill(0.0);

    // Seed center spot of V
    const cx = Math.floor(this.width / 2);
    const cy = Math.floor(this.height / 2);
    const seedR = 12;

    for (let y = cy - seedR; y <= cy + seedR; y++) {
      for (let x = cx - seedR; x <= cx + seedR; x++) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
          const idx = y * this.width + x;
          this.u[idx] = 0.5 + Math.random() * 0.1;
          this.v[idx] = 0.25 + Math.random() * 0.1;
        }
      }
    }
  }

  /**
   * Deposit chemical V at world coordinates (deposited by fluid particles or mouse)
   */
  public depositV(
    x: number,
    y: number,
    amount: number = 0.4,
    radius: number = 3,
    canvasWidth: number = 800,
    canvasHeight: number = 600
  ) {
    const gx = Math.floor((x / Math.max(1, canvasWidth)) * this.width);
    const gy = Math.floor((y / Math.max(1, canvasHeight)) * this.height);

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const px = gx + dx;
        const py = gy + dy;
        if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
          const idx = py * this.width + px;
          this.v[idx] = Math.min(1.0, this.v[idx] + amount);
          this.u[idx] = Math.max(0.0, this.u[idx] - amount * 0.5);
        }
      }
    }
  }

  /**
   * Run Gray-Scott Laplacian diffusion & reaction step
   */
  public step() {
    const { Da, Db, feed, kill, iterationsPerFrame } = this.params;
    const w = this.width;
    const h = this.height;

    for (let iter = 0; iter < iterationsPerFrame; iter++) {
      for (let y = 1; y < h - 1; y++) {
        const row = y * w;
        const rowUp = (y - 1) * w;
        const rowDown = (y + 1) * w;

        for (let x = 1; x < w - 1; x++) {
          const idx = row + x;
          const uVal = this.u[idx];
          const vVal = this.v[idx];

          // 9-point Laplacian stencil:
          // Center: -1.0, Orthogonal: 0.2, Diagonal: 0.05
          const lapU =
            0.2 * (this.u[idx - 1] + this.u[idx + 1] + this.u[rowUp + x] + this.u[rowDown + x]) +
            0.05 *
              (this.u[rowUp + x - 1] +
                this.u[rowUp + x + 1] +
                this.u[rowDown + x - 1] +
                this.u[rowDown + x + 1]) -
            uVal;

          const lapV =
            0.2 * (this.v[idx - 1] + this.v[idx + 1] + this.v[rowUp + x] + this.v[rowDown + x]) +
            0.05 *
              (this.v[rowUp + x - 1] +
                this.v[rowUp + x + 1] +
                this.v[rowDown + x - 1] +
                this.v[rowDown + x + 1]) -
            vVal;

          const uvv = uVal * vVal * vVal;

          // Gray-Scott formulas
          const du = Da * lapU - uvv + feed * (1.0 - uVal);
          const dv = Db * lapV + uvv - (feed + kill) * vVal;

          this.nextU[idx] = Math.max(0.0, Math.min(1.0, uVal + du));
          this.nextV[idx] = Math.max(0.0, Math.min(1.0, vVal + dv));
        }
      }

      // Swap buffers
      const tempU = this.u;
      this.u = this.nextU;
      this.nextU = tempU;

      const tempV = this.v;
      this.v = this.nextV;
      this.nextV = tempV;
    }
  }
}
