export interface Vector2D {
  x: number;
  y: number;
}

export type ResourceType = 'IRON' | 'TITANIUM' | 'TRITIUM' | 'NOVA_CRYSTAL' | 'DARK_MATTER';

export interface ResourceDrop {
  id: string;
  type: ResourceType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  amount: number;
  color: string;
  life: number;
}

export interface Asteroid {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotSpeed: number;
  hp: number;
  maxHp: number;
  resourceType: ResourceType;
  vertices: Vector2D[];
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  isEnemy: boolean;
  color: string;
  life: number;
  maxLife: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
}

export type EnemyType = 'DRONE' | 'PIRATE_INTERCEPTOR' | 'BATTLECRUISER';

export interface EnemyShip {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  hp: number;
  maxHp: number;
  shield: number;
  maxShield: number;
  shootCooldown: number;
  bounty: number;
  name: string;
}

export interface SpaceStation {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
  faction: string;
  color: string;
}

export interface ShipUpgrades {
  engineLevel: number;  // 1 - 5: Top speed & acceleration
  shieldLevel: number;  // 1 - 5: Shield cap & recharge rate
  weaponLevel: number;  // 1 - 5: Blaster damage, fire rate & twin/quad barrels
  cargoLevel: number;   // 1 - 5: Cargo capacity
}

export interface PlayerStats {
  kills: number;
  mineralsMined: number;
  creditsEarned: number;
  sectorsDiscovered: number;
}

export interface PlayerShip {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVel: number;
  hp: number;
  maxHp: number;
  shield: number;
  maxShield: number;
  boost: number;
  maxBoost: number;
  isBoosting: boolean;
  isDead: boolean;
  credits: number;
  cargo: Record<ResourceType, number>;
  cargoCapacity: number;
  upgrades: ShipUpgrades;
  stats: PlayerStats;
}
