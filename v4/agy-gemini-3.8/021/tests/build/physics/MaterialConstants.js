/**
 * PONTIFEX (EXP-021) — Material Constants & Physical Properties Ledger
 * Exact MKS parameters for Road, Wood, Steel, Cable, and Hydraulic members.
 */
export const MATERIAL_PROPERTIES = {
    ROAD: {
        type: 'ROAD',
        name: 'Road Deck',
        density: 35.0, // kg per meter
        stiffness: 140000.0, // N/m (high stiffness for stable vehicle driving surface)
        damping: 180.0, // N*s/m
        breakForce: 22000.0, // N (tensile and compressive failure limit)
        costPerMeter: 150.0, // $ per meter
        color: '#38bdf8', // Light sky blue
        stressColor: '#ef4444',
        lineWidth: 7.0,
        isDeck: true,
        canCompress: true,
    },
    WOOD: {
        type: 'WOOD',
        name: 'Wood Strut',
        density: 10.0, // kg/m (lightweight)
        stiffness: 55000.0, // N/m
        damping: 90.0, // N*s/m
        breakForce: 9000.0, // N
        costPerMeter: 45.0, // $ per meter (budget friendly)
        color: '#fbbf24', // Amber / Wood tone
        stressColor: '#ef4444',
        lineWidth: 4.5,
        isDeck: false,
        canCompress: true,
    },
    STEEL: {
        type: 'STEEL',
        name: 'Steel Beam',
        density: 28.0, // kg/m
        stiffness: 180000.0, // N/m (heavy-duty structural beam)
        damping: 240.0, // N*s/m
        breakForce: 32000.0, // N
        costPerMeter: 130.0, // $ per meter
        color: '#94a3b8', // Steel slate gray
        stressColor: '#ef4444',
        lineWidth: 5.5,
        isDeck: false,
        canCompress: true,
    },
    CABLE: {
        type: 'CABLE',
        name: 'Suspension Cable',
        density: 4.0, // kg/m (very light)
        stiffness: 95000.0, // N/m (resists tension only)
        damping: 60.0, // N*s/m
        breakForce: 26000.0, // N (high tensile capacity)
        costPerMeter: 65.0, // $ per meter
        color: '#a855f7', // Purple wire
        stressColor: '#ef4444',
        lineWidth: 2.5,
        isDeck: false,
        canCompress: false, // Collapses completely under compression!
    },
    HYDRAULIC: {
        type: 'HYDRAULIC',
        name: 'Hydraulic Piston',
        density: 22.0, // kg/m
        stiffness: 150000.0, // N/m
        damping: 160.0, // N*s/m
        breakForce: 24000.0, // N
        costPerMeter: 220.0, // $ per meter
        color: '#34d399', // Emerald
        stressColor: '#ef4444',
        lineWidth: 6.0,
        isDeck: false,
        canCompress: true,
    },
};
export const GRAVITY = 9.81; // m/s^2 downward
export const AIR_DAMPING = 0.25; // N*s/m air resistance on nodes
export const WATER_DAMPING = 12.0; // Viscous resistance in canyon water
export const SUBSTEPS = 16; // Number of sub-steps per frame for symplectic stability
