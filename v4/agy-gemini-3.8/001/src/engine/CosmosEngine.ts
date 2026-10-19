import {
  Vector2D,
  ResourceType,
  ResourceDrop,
  Asteroid,
  Projectile,
  Particle,
  EnemyShip,
  EnemyType,
  SpaceStation,
  PlayerShip,
} from '../types';

export const CHUNK_SIZE = 1200;

export const RESOURCE_CONFIG: Record<ResourceType, { name: string; color: string; value: number }> = {
  IRON: { name: 'Iron Ore', color: '#94a3b8', value: 15 },
  TITANIUM: { name: 'Titanium', color: '#38bdf8', value: 45 },
  TRITIUM: { name: 'Tritium Gas', color: '#34d399', value: 90 },
  NOVA_CRYSTAL: { name: 'Nova Crystal', color: '#f59e0b', value: 180 },
  DARK_MATTER: { name: 'Dark Matter', color: '#c084fc', value: 400 },
};

// Deterministic PRNG for chunk generation
function pseudoRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function getChunkKey(cx: number, cy: number): string {
  return `${cx},${cy}`;
}

export class CosmosEngine {
  // Player state
  public player: PlayerShip;

  // Active world entities (culled by chunk proximity)
  public asteroids: Asteroid[] = [];
  public enemies: EnemyShip[] = [];
  public stations: SpaceStation[] = [];
  public projectiles: Projectile[] = [];
  public resourceDrops: ResourceDrop[] = [];
  public particles: Particle[] = [];

  // Active loaded chunk keys in current window
  private activeLoadedChunks = new Set<string>();
  // Monotonically tracked discovered sectors
  private discoveredSectors = new Set<string>();

  // Input states
  public inputs = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    fire: false,
    boost: false,
  };

  private fireCooldown = 0;
  private idCounter = 0;

  constructor() {
    this.player = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      angle: -Math.PI / 2, // Facing up
      angularVel: 0,
      hp: 100,
      maxHp: 100,
      shield: 100,
      maxShield: 100,
      boost: 100,
      maxBoost: 100,
      isBoosting: false,
      isDead: false,
      credits: 100,
      cargo: {
        IRON: 0,
        TITANIUM: 0,
        TRITIUM: 0,
        NOVA_CRYSTAL: 0,
        DARK_MATTER: 0,
      },
      cargoCapacity: 50,
      upgrades: {
        engineLevel: 1,
        shieldLevel: 1,
        weaponLevel: 1,
        cargoLevel: 1,
      },
      stats: {
        kills: 0,
        mineralsMined: 0,
        creditsEarned: 0,
        sectorsDiscovered: 1,
      },
    };

    // Load initial 3x3 chunks surrounding origin
    this.updateChunksAroundPlayer();
  }

  private nextId(prefix: string): string {
    return `${prefix}_${++this.idCounter}`;
  }

  /**
   * Generates entities inside a chunk deterministically
   */
  private generateChunk(cx: number, cy: number) {
    const seed = ((cx * 73856093) ^ (cy * 19349663)) >>> 0;
    const rng = pseudoRandom(seed);

    const chunkWorldX = cx * CHUNK_SIZE;
    const chunkWorldY = cy * CHUNK_SIZE;

    // 1. Generate Space Station (approx 1 in every 8 chunks, never at 0,0 where player starts)
    if ((cx !== 0 || cy !== 0) && rng() < 0.13) {
      this.stations.push({
        id: this.nextId('st'),
        name: `OUTPOST ${Math.abs(cx * 17 + cy * 31) % 900 + 100}`,
        x: chunkWorldX + CHUNK_SIZE * (0.3 + rng() * 0.4),
        y: chunkWorldY + CHUNK_SIZE * (0.3 + rng() * 0.4),
        radius: 65,
        faction: cx > 0 ? 'SOLAR CONSORTIUM' : 'FREE MINERS GUILD',
        color: '#06b6d4',
      });
    }

    // 2. Generate Asteroids
    const asteroidCount = 4 + Math.floor(rng() * 6);
    const distFromCenter = Math.hypot(cx, cy);

    for (let i = 0; i < asteroidCount; i++) {
      const ax = chunkWorldX + rng() * CHUNK_SIZE;
      const ay = chunkWorldY + rng() * CHUNK_SIZE;

      // Don't spawn directly on top of player spawn
      if (Math.hypot(ax, ay) < 220) continue;

      // Select resource rarity based on distance from core
      let resType: ResourceType = 'IRON';
      const rVal = rng();
      if (distFromCenter > 5 && rVal > 0.8) resType = 'DARK_MATTER';
      else if (distFromCenter > 3 && rVal > 0.6) resType = 'NOVA_CRYSTAL';
      else if (distFromCenter > 2 && rVal > 0.4) resType = 'TRITIUM';
      else if (rVal > 0.3) resType = 'TITANIUM';

      const radius = 24 + rng() * 32;
      const vertCount = 8 + Math.floor(rng() * 5);
      const vertices: Vector2D[] = [];

      for (let v = 0; v < vertCount; v++) {
        const theta = (v / vertCount) * Math.PI * 2;
        const rVar = radius * (0.75 + rng() * 0.45);
        vertices.push({
          x: Math.cos(theta) * rVar,
          y: Math.sin(theta) * rVar,
        });
      }

      const hp = Math.floor(radius * 1.5);
      this.asteroids.push({
        id: this.nextId('ast'),
        x: ax,
        y: ay,
        vx: (rng() - 0.5) * 0.4,
        vy: (rng() - 0.5) * 0.4,
        radius,
        rotation: rng() * Math.PI * 2,
        rotSpeed: (rng() - 0.5) * 0.015,
        hp,
        maxHp: hp,
        resourceType: resType,
        vertices,
      });
    }

    // 3. Generate Hostile Enemies (outside safe zone 0,0)
    if (distFromCenter >= 1 && rng() < 0.45) {
      const enemyCount = 1 + Math.floor(rng() * 2);
      for (let e = 0; e < enemyCount; e++) {
        let type: EnemyType = 'DRONE';
        let hp = 45;
        let shield = 25;
        let bounty = 60;
        let name = 'PIRATE SCOUT';

        if (distFromCenter > 3 && rng() > 0.5) {
          type = 'BATTLECRUISER';
          hp = 220;
          shield = 120;
          bounty = 350;
          name = 'VOID DREADNOUGHT';
        } else if (rng() > 0.4) {
          type = 'PIRATE_INTERCEPTOR';
          hp = 85;
          shield = 50;
          bounty = 140;
          name = 'RAIDER INTERCEPTOR';
        }

        this.enemies.push({
          id: this.nextId('en'),
          type,
          x: chunkWorldX + rng() * CHUNK_SIZE,
          y: chunkWorldY + rng() * CHUNK_SIZE,
          vx: 0,
          vy: 0,
          angle: rng() * Math.PI * 2,
          hp,
          maxHp: hp,
          shield,
          maxShield: shield,
          shootCooldown: 60 + Math.floor(rng() * 60),
          bounty,
          name,
        });
      }
    }
  }

  /**
   * Dynamically loads chunks around player and unloads distant ones
   */
  public updateChunksAroundPlayer() {
    const curChunkX = Math.floor(this.player.x / CHUNK_SIZE);
    const curChunkY = Math.floor(this.player.y / CHUNK_SIZE);

    const neededChunks = new Set<string>();
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = getChunkKey(curChunkX + dx, curChunkY + dy);
        neededChunks.add(key);

        if (!this.activeLoadedChunks.has(key)) {
          this.generateChunk(curChunkX + dx, curChunkY + dy);
          this.activeLoadedChunks.add(key);

          if (!this.discoveredSectors.has(key)) {
            this.discoveredSectors.add(key);
            this.player.stats.sectorsDiscovered = this.discoveredSectors.size;
          }
        }
      }
    }

    // Prune chunks no longer in active 3x3 window so they can regenerate deterministically on return
    for (const key of this.activeLoadedChunks) {
      if (!neededChunks.has(key)) {
        this.activeLoadedChunks.delete(key);
      }
    }

    // Culling distant entities (> 2.5 chunks away)
    const cullDistSq = (CHUNK_SIZE * 2.5) ** 2;
    this.asteroids = this.asteroids.filter(
      (a) => (a.x - this.player.x) ** 2 + (a.y - this.player.y) ** 2 < cullDistSq
    );
    this.enemies = this.enemies.filter(
      (e) => (e.x - this.player.x) ** 2 + (e.y - this.player.y) ** 2 < cullDistSq
    );
    this.stations = this.stations.filter(
      (s) => (s.x - this.player.x) ** 2 + (s.y - this.player.y) ** 2 < cullDistSq
    );
    this.resourceDrops = this.resourceDrops.filter(
      (r) => (r.x - this.player.x) ** 2 + (r.y - this.player.y) ** 2 < cullDistSq
    );
  }

  /**
   * Spawns an explosion particle cluster
   */
  public createExplosion(x: number, y: number, color: string, count: number = 18, speedMult: number = 1.0) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (1.5 + Math.random() * 4.0) * speedMult;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: 0,
        maxLife: 20 + Math.random() * 25,
        size: 2 + Math.random() * 3.5,
      });
    }
  }

  public takeDamage(amount: number): boolean {
    if (this.player.isDead) return false;

    if (this.player.shield > amount) {
      this.player.shield -= amount;
    } else {
      const rem = amount - this.player.shield;
      this.player.shield = 0;
      this.player.hp = Math.max(0, this.player.hp - rem);
    }

    if (this.player.hp <= 0 && !this.player.isDead) {
      this.player.isDead = true;
      this.createExplosion(this.player.x, this.player.y, '#ef4444', 60, 2.2);
      return true; // Death triggered
    }
    return false;
  }

  public respawn() {
    this.player.x = 0;
    this.player.y = 0;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.angle = -Math.PI / 2;
    this.player.hp = this.player.maxHp;
    this.player.shield = this.player.maxShield;
    this.player.boost = this.player.maxBoost;
    this.player.isDead = false;

    // Cargo penalty: 50% cargo lost upon vessel loss
    for (const res in this.player.cargo) {
      this.player.cargo[res as ResourceType] = Math.floor(this.player.cargo[res as ResourceType] * 0.5);
    }

    this.updateChunksAroundPlayer();
  }

  /**
   * Main simulation tick with frame-rate independent delta-time scaling
   */
  public update(dtSec: number = 1 / 60): {
    playerFired: boolean;
    asteroidDestroyed: boolean;
    enemyDestroyed: boolean;
    resourceCollected: boolean;
    playerHit: boolean;
    playerDied: boolean;
  } {
    let playerFired = false;
    let asteroidDestroyed = false;
    let enemyDestroyed = false;
    let resourceCollected = false;
    let playerHit = false;
    let playerDied = false;

    // Delta time normalization (1.0 = standard 60fps tick)
    const dt = Math.min(0.05, Math.max(0.005, dtSec));
    const dtScale = dt * 60;

    if (this.player.isDead) {
      // Update particles even during death
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const part = this.particles[i];
        part.x += part.vx * dtScale;
        part.y += part.vy * dtScale;
        part.life += dtScale;
        if (part.life >= part.maxLife) {
          this.particles.splice(i, 1);
        }
      }
      return {
        playerFired: false,
        asteroidDestroyed: false,
        enemyDestroyed: false,
        resourceCollected: false,
        playerHit: false,
        playerDied: false,
      };
    }

    // 1. UPDATE PLAYER PHYSICS
    const engineUp = this.player.upgrades.engineLevel;
    const accelRate = (0.18 + engineUp * 0.05) * dtScale;
    const maxSpeed = 5.5 + engineUp * 1.0;
    const turnSpeed = 0.065 * dtScale;

    // Steering
    if (this.inputs.left) this.player.angle -= turnSpeed;
    if (this.inputs.right) this.player.angle += turnSpeed;

    // Boost
    const isBoosting = this.inputs.boost && this.player.boost > 5;
    this.player.isBoosting = isBoosting;

    let effectiveAccel = accelRate;
    let effectiveMaxSpeed = maxSpeed;

    if (isBoosting) {
      effectiveAccel *= 1.8;
      effectiveMaxSpeed *= 1.6;
      this.player.boost = Math.max(0, this.player.boost - 0.7 * dtScale);

      // Boost thruster trail
      const exhaustAngle = this.player.angle + Math.PI;
      this.particles.push({
        x: this.player.x + Math.cos(exhaustAngle) * 16,
        y: this.player.y + Math.sin(exhaustAngle) * 16,
        vx: Math.cos(exhaustAngle) * (2 + Math.random() * 2),
        vy: Math.sin(exhaustAngle) * (2 + Math.random() * 2),
        color: '#38bdf8',
        life: 0,
        maxLife: 15,
        size: 3,
      });
    } else {
      // Passive boost recharge
      this.player.boost = Math.min(this.player.maxBoost, this.player.boost + 0.35 * dtScale);
    }

    // Forward Thrust
    if (this.inputs.forward) {
      this.player.vx += Math.cos(this.player.angle) * effectiveAccel;
      this.player.vy += Math.sin(this.player.angle) * effectiveAccel;

      // Regular thruster trail
      const exhaustAngle = this.player.angle + Math.PI;
      this.particles.push({
        x: this.player.x + Math.cos(exhaustAngle) * 14,
        y: this.player.y + Math.sin(exhaustAngle) * 14,
        vx: Math.cos(exhaustAngle) * (1.2 + Math.random()),
        vy: Math.sin(exhaustAngle) * (1.2 + Math.random()),
        color: '#fbbf24',
        life: 0,
        maxLife: 10,
        size: 2,
      });
    }

    // Reverse Braking Thrusters
    if (this.inputs.backward) {
      this.player.vx *= Math.pow(0.94, dtScale);
      this.player.vy *= Math.pow(0.94, dtScale);
    }

    // Space friction damping
    this.player.vx *= Math.pow(0.985, dtScale);
    this.player.vy *= Math.pow(0.985, dtScale);

    // Speed clamping
    const currentSpeed = Math.hypot(this.player.vx, this.player.vy);
    if (currentSpeed > effectiveMaxSpeed) {
      this.player.vx = (this.player.vx / currentSpeed) * effectiveMaxSpeed;
      this.player.vy = (this.player.vy / currentSpeed) * effectiveMaxSpeed;
    }

    // Move player
    this.player.x += this.player.vx * dtScale;
    this.player.y += this.player.vy * dtScale;

    // Passive shield regeneration (shieldLevel increases rate)
    const shieldRate = (0.05 + this.player.upgrades.shieldLevel * 0.03) * dtScale;
    if (this.player.shield < this.player.maxShield) {
      this.player.shield = Math.min(this.player.maxShield, this.player.shield + shieldRate);
    }

    // Update chunk discovery around new position
    this.updateChunksAroundPlayer();

    // 2. PLAYER WEAPON FIRING
    if (this.fireCooldown > 0) this.fireCooldown -= dtScale;

    if (this.inputs.fire && this.fireCooldown <= 0) {
      const weaponLevel = this.player.upgrades.weaponLevel;
      const projSpeed = 12.0;
      const damage = 20 + weaponLevel * 6;
      this.fireCooldown = Math.max(8, 16 - weaponLevel * 2);

      // Dual barrel offsets
      const perpAngle = this.player.angle + Math.PI / 2;
      const offset = 8;

      // Left projectile
      this.projectiles.push({
        id: this.nextId('pj'),
        x: this.player.x + Math.cos(perpAngle) * offset,
        y: this.player.y + Math.sin(perpAngle) * offset,
        vx: Math.cos(this.player.angle) * projSpeed + this.player.vx * 0.3,
        vy: Math.sin(this.player.angle) * projSpeed + this.player.vy * 0.3,
        damage,
        isEnemy: false,
        color: '#38bdf8',
        life: 0,
        maxLife: 55,
      });

      // Right projectile
      this.projectiles.push({
        id: this.nextId('pj'),
        x: this.player.x - Math.cos(perpAngle) * offset,
        y: this.player.y - Math.sin(perpAngle) * offset,
        vx: Math.cos(this.player.angle) * projSpeed + this.player.vx * 0.3,
        vy: Math.sin(this.player.angle) * projSpeed + this.player.vy * 0.3,
        damage,
        isEnemy: false,
        color: '#38bdf8',
        life: 0,
        maxLife: 55,
      });

      playerFired = true;
    }

    // 3. ASTEROID-PLAYER HULL COLLISION
    for (const ast of this.asteroids) {
      const dist = Math.hypot(this.player.x - ast.x, this.player.y - ast.y);
      if (dist < ast.radius + 14) {
        const nx = (this.player.x - ast.x) / (dist || 1);
        const ny = (this.player.y - ast.y) / (dist || 1);
        this.player.vx += nx * 2.0;
        this.player.vy += ny * 2.0;
        this.createExplosion(this.player.x, this.player.y, '#fbbf24', 8, 0.5);

        const died = this.takeDamage(12);
        playerHit = true;
        if (died) {
          playerDied = true;
          return {
            playerFired,
            asteroidDestroyed,
            enemyDestroyed,
            resourceCollected,
            playerHit,
            playerDied,
          };
        }
      }
    }

    // 4. UPDATE PROJECTILES
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx * dtScale;
      p.y += p.vy * dtScale;
      p.life += dtScale;

      if (p.life >= p.maxLife) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // Check collision with player (for enemy bullets)
      if (p.isEnemy) {
        const distToPlayer = Math.hypot(p.x - this.player.x, p.y - this.player.y);
        if (distToPlayer < 20) {
          this.createExplosion(p.x, p.y, '#f43f5e', 8, 0.6);
          this.projectiles.splice(i, 1);

          const died = this.takeDamage(p.damage);
          playerHit = true;
          if (died) {
            playerDied = true;
            return {
              playerFired,
              asteroidDestroyed,
              enemyDestroyed,
              resourceCollected,
              playerHit,
              playerDied,
            };
          }
          continue;
        }
      }

      // Check collision with Asteroids (for player bullets)
      if (!p.isEnemy) {
        let hitAsteroid = false;
        for (let aIdx = this.asteroids.length - 1; aIdx >= 0; aIdx--) {
          const ast = this.asteroids[aIdx];
          const dist = Math.hypot(p.x - ast.x, p.y - ast.y);
          if (dist < ast.radius) {
            hitAsteroid = true;
            ast.hp -= p.damage;
            this.createExplosion(p.x, p.y, RESOURCE_CONFIG[ast.resourceType].color, 6, 0.5);
            this.projectiles.splice(i, 1);

            if (ast.hp <= 0) {
              // Destroy Asteroid & spawn resources
              this.createExplosion(ast.x, ast.y, RESOURCE_CONFIG[ast.resourceType].color, 24, 1.2);
              const dropCount = 2 + Math.floor(Math.random() * 3);
              for (let d = 0; d < dropCount; d++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 0.8 + Math.random() * 1.5;
                this.resourceDrops.push({
                  id: this.nextId('res'),
                  type: ast.resourceType,
                  x: ast.x + Math.cos(angle) * 10,
                  y: ast.y + Math.sin(angle) * 10,
                  vx: Math.cos(angle) * spd,
                  vy: Math.sin(angle) * spd,
                  amount: 1,
                  color: RESOURCE_CONFIG[ast.resourceType].color,
                  life: 0,
                });
              }
              this.asteroids.splice(aIdx, 1);
              this.player.stats.mineralsMined++;
              asteroidDestroyed = true;
            }
            break;
          }
        }
        if (hitAsteroid) continue;

        // Check collision with Enemies (for player bullets)
        for (let eIdx = this.enemies.length - 1; eIdx >= 0; eIdx--) {
          const enemy = this.enemies[eIdx];
          const hitRadius = enemy.type === 'BATTLECRUISER' ? 36 : 18;
          const dist = Math.hypot(p.x - enemy.x, p.y - enemy.y);
          if (dist < hitRadius) {
            this.projectiles.splice(i, 1);
            this.createExplosion(p.x, p.y, '#f59e0b', 8, 0.7);

            if (enemy.shield > p.damage) {
              enemy.shield -= p.damage;
            } else {
              const rem = p.damage - enemy.shield;
              enemy.shield = 0;
              enemy.hp -= rem;
            }

            if (enemy.hp <= 0) {
              // Enemy Destroyed!
              this.createExplosion(enemy.x, enemy.y, '#ef4444', 36, 1.5);
              this.player.credits += enemy.bounty;
              this.player.stats.creditsEarned += enemy.bounty;
              this.player.stats.kills++;

              // Rare mineral drop
              this.resourceDrops.push({
                id: this.nextId('res'),
                type: 'NOVA_CRYSTAL',
                x: enemy.x,
                y: enemy.y,
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 1.2,
                amount: 2,
                color: RESOURCE_CONFIG.NOVA_CRYSTAL.color,
                life: 0,
              });

              this.enemies.splice(eIdx, 1);
              enemyDestroyed = true;
            }
            break;
          }
        }
      }
    }

    // 5. UPDATE ENEMIES AI
    for (const enemy of this.enemies) {
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 650) {
        // Track player angle
        const targetAngle = Math.atan2(dy, dx);
        const angleDiff = Math.atan2(Math.sin(targetAngle - enemy.angle), Math.cos(targetAngle - enemy.angle));
        enemy.angle += angleDiff * 0.05 * dtScale;

        // Thrust toward player if outside attack range
        const desiredDist = enemy.type === 'BATTLECRUISER' ? 220 : 160;
        if (dist > desiredDist) {
          const spd = (enemy.type === 'DRONE' ? 0.12 : enemy.type === 'BATTLECRUISER' ? 0.04 : 0.08) * dtScale;
          enemy.vx += Math.cos(enemy.angle) * spd;
          enemy.vy += Math.sin(enemy.angle) * spd;
        }

        // Fire weapons at player
        enemy.shootCooldown -= dtScale;
        if (enemy.shootCooldown <= 0 && Math.abs(angleDiff) < 0.35) {
          enemy.shootCooldown = enemy.type === 'DRONE' ? 70 : enemy.type === 'BATTLECRUISER' ? 45 : 60;
          this.projectiles.push({
            id: this.nextId('enp'),
            x: enemy.x + Math.cos(enemy.angle) * 18,
            y: enemy.y + Math.sin(enemy.angle) * 18,
            vx: Math.cos(enemy.angle) * 7.5,
            vy: Math.sin(enemy.angle) * 7.5,
            damage: enemy.type === 'BATTLECRUISER' ? 22 : 12,
            isEnemy: true,
            color: '#ef4444',
            life: 0,
            maxLife: 65,
          });
        }
      }

      // Space friction
      enemy.vx *= Math.pow(0.98, dtScale);
      enemy.vy *= Math.pow(0.98, dtScale);
      enemy.x += enemy.vx * dtScale;
      enemy.y += enemy.vy * dtScale;
    }

    // 6. UPDATE RESOURCE DROPS & TRACTOR BEAM
    const totalCargo = Object.values(this.player.cargo).reduce((a, b) => a + b, 0);

    for (let i = this.resourceDrops.length - 1; i >= 0; i--) {
      const drop = this.resourceDrops[i];
      drop.x += drop.vx * dtScale;
      drop.y += drop.vy * dtScale;
      drop.vx *= Math.pow(0.98, dtScale);
      drop.vy *= Math.pow(0.98, dtScale);

      const dx = this.player.x - drop.x;
      const dy = this.player.y - drop.y;
      const dist = Math.hypot(dx, dy);

      // Magnetic tractor pull if within 160 units
      if (dist < 160 && totalCargo < this.player.cargoCapacity) {
        const pull = (160 - dist) * 0.04 * dtScale;
        drop.vx += (dx / dist) * pull;
        drop.vy += (dy / dist) * pull;
      }

      // Collect when close
      if (dist < 26 && totalCargo < this.player.cargoCapacity) {
        this.player.cargo[drop.type] = (this.player.cargo[drop.type] || 0) + drop.amount;
        this.createExplosion(drop.x, drop.y, drop.color, 8, 0.4);
        this.resourceDrops.splice(i, 1);
        resourceCollected = true;
      }
    }

    // 7. UPDATE PARTICLES
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const part = this.particles[i];
      part.x += part.vx * dtScale;
      part.y += part.vy * dtScale;
      part.life += dtScale;
      if (part.life >= part.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    return {
      playerFired,
      asteroidDestroyed,
      enemyDestroyed,
      resourceCollected,
      playerHit,
      playerDied,
    };
  }

  /**
   * Check if player is within docking range of a space station
   */
  public getNearbyStation(): SpaceStation | null {
    for (const st of this.stations) {
      const dist = Math.hypot(this.player.x - st.x, this.player.y - st.y);
      if (dist < st.radius + 35) {
        return st;
      }
    }
    return null;
  }
}
