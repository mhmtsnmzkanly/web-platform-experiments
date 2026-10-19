/**
 * MARBLE-FORGE (EXP-023) — Marble Material Physical Constants
 */
export const MARBLE_MATERIALS = {
    GLASS: {
        material: 'GLASS',
        name: 'Glass Cat’s-Eye',
        mass: 0.02, // 20 grams
        radius: 0.15, // 0.15 meters in simulation world units (scaled for tactile visibility)
        restitution: 0.68,
        rollingFriction: 0.004,
        color: '#38bdf8', // Cerulean cyan
        glowColor: 'rgba(56, 189, 248, 0.4)',
    },
    STEEL: {
        material: 'STEEL',
        name: 'Steel Ball Bearing',
        mass: 0.07, // 70 grams (heavy momentum carrier)
        radius: 0.15,
        restitution: 0.88,
        rollingFriction: 0.002,
        color: '#cbd5e1', // Silver steel
        glowColor: 'rgba(203, 213, 225, 0.4)',
    },
    WOOD: {
        material: 'WOOD',
        name: 'Polished Beechwood',
        mass: 0.009, // 9 grams (light, low inertia)
        radius: 0.15,
        restitution: 0.45,
        rollingFriction: 0.012,
        color: '#f59e0b', // Amber wood
        glowColor: 'rgba(245, 158, 11, 0.35)',
    },
    RUBBER: {
        material: 'RUBBER',
        name: 'Superball Rubber',
        mass: 0.014, // 14 grams (ultra bouncy)
        radius: 0.15,
        restitution: 0.95,
        rollingFriction: 0.018,
        color: '#ec4899', // Hot neon pink
        glowColor: 'rgba(236, 72, 153, 0.5)',
    },
};
