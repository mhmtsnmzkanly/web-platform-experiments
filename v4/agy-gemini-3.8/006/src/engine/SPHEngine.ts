import {
  FluidParticle,
  SPHParams,
  FluidType,
  Obstacle,
  Vortex,
  FluidTelemetry,
} from '../types';

export const DEFAULT_SPH_PARAMS: SPHParams = {
  restDensity: 1.0, // Normalized 2D rest density
  stiffness: 24000, // Sound speed stiffness k for incompressibility
  viscosity: 180, // Dynamic shear viscosity
  smoothingRadius: 24, // h kernel radius (px)
  gravityX: 0,
  gravityY: 650, // Real 2D gravity (px/s^2)
  surfaceTension: 0.15,
  restitution: 0.45,
};

export class SPHEngine {
  public particles: FluidParticle[] = [];
  public obstacles: Obstacle[] = [];
  public vortices: Vortex[] = [];
  public params: SPHParams;

  public width: number = 800;
  public height: number = 600;

  // Spatial Grid Partitioning for O(N) neighbor lookup
  private cellSize: number;
  private grid: Map<number, number[]> = new Map();

  // Next particle ID
  private nextId: number = 1;
  public isKarmanPreset: boolean = false;

  constructor(width: number = 800, height: number = 600, params: SPHParams = DEFAULT_SPH_PARAMS) {
    this.width = width;
    this.height = height;
    this.params = { ...params };
    this.cellSize = this.params.smoothingRadius;
  }

  public setDimensions(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  private hashCoords(cx: number, cy: number): number {
    return (cx * 73856093) ^ (cy * 19349663);
  }

  private buildSpatialGrid() {
    this.grid.clear();
    const h = this.params.smoothingRadius;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const cx = Math.floor(p.x / h);
      const cy = Math.floor(p.y / h);
      const hash = this.hashCoords(cx, cy);

      let cell = this.grid.get(hash);
      if (!cell) {
        cell = [];
        this.grid.set(hash, cell);
      }
      cell.push(i);
    }
  }

  /**
   * Add a single fluid particle
   */
  public addParticle(x: number, y: number, vx: number = 0, vy: number = 0, type: FluidType = 'WATER') {
    if (this.particles.length >= 2500) return; // Strict memory cap

    let color = '#38bdf8'; // Water cyan
    if (type === 'VISCOUS_OIL') color = '#fbbf24'; // Oil amber
    if (type === 'BIOLUMINESCENT') color = '#34d399'; // Bio emerald

    this.particles.push({
      id: this.nextId++,
      x,
      y,
      vx,
      vy,
      fx: 0,
      fy: 0,
      density: this.params.restDensity,
      pressure: 0,
      type,
      color,
    });
  }

  /**
   * Emit a batch of fluid particles (spray nozzle)
   */
  public emitParticles(x: number, y: number, count: number = 10, type: FluidType = 'WATER', speed: number = 100) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 12;
      const vx = Math.cos(angle) * speed * (0.6 + Math.random() * 0.4);
      const vy = Math.sin(angle) * speed * (0.6 + Math.random() * 0.4);
      this.addParticle(x + Math.cos(angle) * r, y + Math.sin(angle) * r, vx, vy, type);
    }
  }

  /**
   * Procedural Preset: Dam Break
   */
  public loadDamBreak() {
    this.isKarmanPreset = false;
    this.particles = [];
    this.obstacles = [];
    this.vortices = [];

    const startX = 25;
    const startY = 70;
    const cols = 26;
    const rows = 32;
    const spacing = 11;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const type: FluidType = r < 9 ? 'VISCOUS_OIL' : r < 22 ? 'WATER' : 'BIOLUMINESCENT';
        this.addParticle(startX + c * spacing, startY + r * spacing, 0, 0, type);
      }
    }
  }

  /**
   * Procedural Preset: Karman Vortex Channel
   */
  public loadVortexChannel() {
    this.isKarmanPreset = true;
    this.particles = [];
    this.obstacles = [];
    this.vortices = [];

    // Central circular obstacle
    this.obstacles.push({
      id: 'cyl-1',
      x: this.width * 0.42,
      y: this.height * 0.5,
      radius: 40,
      type: 'CIRCLE',
    });

    // Vortices behind obstacle
    this.vortices.push({
      id: 'vort-1',
      x: this.width * 0.62,
      y: this.height * 0.38,
      strength: 22000,
      radius: 110,
    });
    this.vortices.push({
      id: 'vort-2',
      x: this.width * 0.62,
      y: this.height * 0.62,
      strength: -22000,
      radius: 110,
    });

    // Stream of incoming fluid from left
    for (let c = 0; c < 16; c++) {
      for (let r = 0; r < 32; r++) {
        this.addParticle(20 + c * 11, 70 + r * 12, 160, (Math.random() - 0.5) * 20, 'WATER');
      }
    }
  }

  /**
   * Core 2D SPH Navier-Stokes Simulation Step
   */
  public update(dtSec: number): FluidTelemetry {
    // Clamp delta-time for numerical stability
    const dt = Math.min(0.016, Math.max(0.004, dtSec));
    const h = this.params.smoothingRadius;
    const h2 = h * h;
    const mass = 125.0; // Calibrated 2D particle mass

    this.buildSpatialGrid();

    // Mathematically normalized 2D SPH Kernel Constants
    // 2D Poly6: 4 / (pi * h^8)
    const poly6Const = 4.0 / (Math.PI * Math.pow(h, 8));
    // 2D Spiky Pressure Gradient: -30 / (pi * h^5)
    const spikyGradConst = -30.0 / (Math.PI * Math.pow(h, 5));
    // 2D Viscosity Laplacian: 20 / (pi * h^5)
    const viscLapConst = 20.0 / (Math.PI * Math.pow(h, 5));

    let totalKineticEnergy = 0;
    let maxPressure = 0;

    // STEP 1: COMPUTE 2D DENSITY & TAIT PRESSURE
    for (let i = 0; i < this.particles.length; i++) {
      const pi = this.particles[i];
      let density = 0;

      const cx = Math.floor(pi.x / h);
      const cy = Math.floor(pi.y / h);

      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          const cell = this.grid.get(this.hashCoords(cx + ox, cy + oy));
          if (!cell) continue;

          for (let k = 0; k < cell.length; k++) {
            const pj = this.particles[cell[k]];
            const dx = pi.x - pj.x;
            const dy = pi.y - pj.y;
            const r2 = dx * dx + dy * dy;

            if (r2 < h2) {
              const diff = h2 - r2;
              density += mass * poly6Const * diff * diff * diff;
            }
          }
        }
      }

      // Clamping to a minimal positive value to prevent division by zero
      pi.density = Math.max(0.2, density);

      // Tait Equation of State: P = k * (rho - rho_0)
      pi.pressure = Math.max(0, this.params.stiffness * (pi.density - this.params.restDensity));
      if (pi.pressure > maxPressure) maxPressure = pi.pressure;
    }

    // STEP 2: COMPUTE SPH FORCES (PRESSURE + VISCOSITY)
    for (let i = 0; i < this.particles.length; i++) {
      const pi = this.particles[i];
      let fPressureX = 0;
      let fPressureY = 0;
      let fViscX = 0;
      let fViscY = 0;

      const cx = Math.floor(pi.x / h);
      const cy = Math.floor(pi.y / h);

      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          const cell = this.grid.get(this.hashCoords(cx + ox, cy + oy));
          if (!cell) continue;

          for (let k = 0; k < cell.length; k++) {
            const jIdx = cell[k];
            if (i === jIdx) continue;
            const pj = this.particles[jIdx];

            const dx = pi.x - pj.x;
            const dy = pi.y - pj.y;
            const dist = Math.hypot(dx, dy);

            if (dist > 0.001 && dist < h) {
              // 1. Symmetric Repulsive Pressure Force
              const h_r = h - dist;
              const pressureKernel = spikyGradConst * h_r * h_r;
              const pressureMag =
                -mass * ((pi.pressure + pj.pressure) / (2 * pj.density)) * pressureKernel;

              fPressureX += (dx / dist) * pressureMag;
              fPressureY += (dy / dist) * pressureMag;

              // 2. Symmetric Viscosity Force
              const viscKernel = viscLapConst * (h - dist);
              const viscMultiplier = pi.type === 'VISCOUS_OIL' ? 2.5 : 1.0;
              const viscMag =
                this.params.viscosity * viscMultiplier * mass * (viscKernel / pj.density);

              fViscX += (pj.vx - pi.vx) * viscMag;
              fViscY += (pj.vy - pi.vy) * viscMag;
            }
          }
        }
      }

      // External Accelerations: Gravity + Vortices
      let aExtX = this.params.gravityX;
      let aExtY = this.params.gravityY;

      // Vortex forces
      for (const v of this.vortices) {
        const vxDist = pi.x - v.x;
        const vyDist = pi.y - v.y;
        const r = Math.hypot(vxDist, vyDist);
        if (r < v.radius && r > 2) {
          const vortexAccel = (v.strength * (1 - r / v.radius)) / (r + 10);
          aExtX += (-vyDist / r) * vortexAccel;
          aExtY += (vxDist / r) * vortexAccel;
        }
      }

      // Pressure & Viscosity accelerations (force / density) + direct gravity acceleration
      pi.fx = fPressureX / pi.density + fViscX / pi.density + aExtX;
      pi.fy = fPressureY / pi.density + fViscY / pi.density + aExtY;
    }

    // STEP 3: INTEGRATION & BOUNDARY COLLISIONS
    const boundRestitution = this.params.restitution;
    const margin = 8;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Symplectic Euler Integration
      p.vx += p.fx * dt;
      p.vy += p.fy * dt;

      // Realistic speed limit
      const maxSpeed = 950;
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > maxSpeed) {
        p.vx = (p.vx / speed) * maxSpeed;
        p.vy = (p.vy / speed) * maxSpeed;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      totalKineticEnergy += 0.5 * (p.vx * p.vx + p.vy * p.vy);

      // Karman Channel Recycling (infinite flow from left to right)
      if (this.isKarmanPreset && p.x > this.width - margin) {
        p.x = margin + 5;
        p.y = margin + 30 + Math.random() * (this.height - 60);
        p.vx = 140 + Math.random() * 30;
        p.vy = (Math.random() - 0.5) * 15;
        continue;
      }

      // Domain Boundary Collisions
      if (p.x < margin) {
        p.x = margin;
        p.vx = -p.vx * boundRestitution;
      } else if (p.x > this.width - margin) {
        p.x = this.width - margin;
        p.vx = -p.vx * boundRestitution;
      }

      if (p.y < margin) {
        p.y = margin;
        p.vy = -p.vy * boundRestitution;
      } else if (p.y > this.height - margin) {
        p.y = this.height - margin;
        p.vy = -p.vy * boundRestitution;
      }

      // Obstacle Collisions
      for (const obs of this.obstacles) {
        if (obs.type === 'CIRCLE' && obs.radius) {
          const dx = p.x - obs.x;
          const dy = p.y - obs.y;
          const dist = Math.hypot(dx, dy);
          if (dist < obs.radius && dist > 0.001) {
            const nx = dx / dist;
            const ny = dy / dist;
            p.x = obs.x + nx * (obs.radius + 1);

            const dot = p.vx * nx + p.vy * ny;
            if (dot < 0) {
              p.vx = (p.vx - 2 * dot * nx) * boundRestitution;
              p.vy = (p.vy - 2 * dot * ny) * boundRestitution;
            }
          }
        } else if (obs.type === 'RECT' && obs.width && obs.height) {
          if (
            p.x >= obs.x &&
            p.x <= obs.x + obs.width &&
            p.y >= obs.y &&
            p.y <= obs.y + obs.height
          ) {
            const dl = p.x - obs.x;
            const dr = obs.x + obs.width - p.x;
            const dt = p.y - obs.y;
            const db = obs.y + obs.height - p.y;
            const min = Math.min(dl, dr, dt, db);

            if (min === dl) {
              p.x = obs.x - 1;
              p.vx = -Math.abs(p.vx) * boundRestitution;
            } else if (min === dr) {
              p.x = obs.x + obs.width + 1;
              p.vx = Math.abs(p.vx) * boundRestitution;
            } else if (min === dt) {
              p.y = obs.y - 1;
              p.vy = -Math.abs(p.vy) * boundRestitution;
            } else {
              p.y = obs.y + obs.height + 1;
              p.vy = Math.abs(p.vy) * boundRestitution;
            }
          }
        }
      }
    }

    const avgKinetic = this.particles.length > 0 ? totalKineticEnergy / this.particles.length : 0;
    const reynolds =
      this.params.viscosity > 0
        ? (this.params.restDensity * Math.sqrt(avgKinetic) * h) / this.params.viscosity
        : 0;

    return {
      particleCount: this.particles.length,
      kineticEnergy: Math.round(avgKinetic),
      maxPressure: Math.round(maxPressure),
      fps: Math.round(1 / dt),
      reynoldsNumber: Math.round(reynolds),
    };
  }

  /**
   * Apply interactive mouse stir / vortex impulse
   */
  public stirFluid(mouseX: number, mouseY: number, deltaX: number, deltaY: number, radius: number = 80) {
    const r2 = radius * radius;
    for (const p of this.particles) {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const distSq = dx * dx + dy * dy;
      if (distSq < r2) {
        const factor = (1 - Math.sqrt(distSq) / radius) * 4.0;
        p.vx += deltaX * factor;
        p.vy += deltaY * factor;
      }
    }
  }

  /**
   * Erase particles, obstacles, and vortices within a brush radius
   */
  public eraseAt(x: number, y: number, radius: number = 36) {
    const r2 = radius * radius;
    this.particles = this.particles.filter((p) => {
      const dx = p.x - x;
      const dy = p.y - y;
      return dx * dx + dy * dy > r2;
    });

    this.obstacles = this.obstacles.filter(
      (obs) => Math.hypot(obs.x - x, obs.y - y) > (obs.radius || 30) + radius * 0.5
    );

    this.vortices = this.vortices.filter(
      (v) => Math.hypot(v.x - x, v.y - y) > radius + 20
    );
  }

  /**
   * Clear all particles and obstacles
   */
  public clearAll() {
    this.isKarmanPreset = false;
    this.particles = [];
    this.obstacles = [];
    this.vortices = [];
  }
}
