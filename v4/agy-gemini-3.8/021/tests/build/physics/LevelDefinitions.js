/**
 * PONTIFEX (EXP-021) — Level Definitions & Curated Challenge Geometries
 * Configures cliff terrains, anchor node positions, vehicle types, and financial budgets.
 */
export const BRIDGE_LEVELS = [
    {
        id: 1,
        name: 'Valley Creek',
        subtitle: 'Beginner Span',
        description: 'Construct a simple road bridge with wooden triangular trusses to carry a passenger car safely across the creek.',
        budget: 12000,
        targetFlagX: 24.0,
        vehicle: 'CAR',
        allowedMaterials: ['ROAD', 'WOOD'],
        terrain: {
            leftX: 0.0,
            leftY: 10.0,
            leftWidth: 8.0,
            rightX: 22.0,
            rightY: 10.0,
            rightWidth: 10.0,
            gapWidth: 14.0,
            waterLevelY: 2.5,
        },
        anchorNodes: [
            { x: 8.0, y: 10.0 }, // Left road deck anchor
            { x: 6.0, y: 7.0 }, // Left lower cliff support
            { x: 22.0, y: 10.0 }, // Right road deck anchor
            { x: 24.0, y: 7.0 }, // Right lower cliff support
        ],
    },
    {
        id: 2,
        name: 'The Great Chasm',
        subtitle: 'Medium Gorge & Heavy Truck',
        description: 'A wider 20-meter canyon requires high-strength steel beams or suspension cables to support a heavy delivery truck.',
        budget: 28000,
        targetFlagX: 34.0,
        vehicle: 'TRUCK',
        allowedMaterials: ['ROAD', 'WOOD', 'STEEL', 'CABLE'],
        terrain: {
            leftX: 0.0,
            leftY: 14.0,
            leftWidth: 10.0,
            rightX: 30.0,
            rightY: 14.0,
            rightWidth: 12.0,
            gapWidth: 20.0,
            waterLevelY: 3.0,
        },
        anchorNodes: [
            { x: 10.0, y: 14.0 }, // Left deck anchor
            { x: 7.0, y: 9.0 }, // Left lower cliff
            { x: 4.0, y: 19.0 }, // Left high tower anchor for cables
            { x: 30.0, y: 14.0 }, // Right deck anchor
            { x: 33.0, y: 9.0 }, // Right lower cliff
            { x: 36.0, y: 19.0 }, // Right high tower anchor for cables
        ],
    },
    {
        id: 3,
        name: 'Twin Pillars Island',
        subtitle: 'Dual Span with Island Pier',
        description: 'A rocky island in the center provides intermediate anchor points. Build a two-tier truss or continuous deck across both channels.',
        budget: 38000,
        targetFlagX: 42.0,
        vehicle: 'TRUCK',
        allowedMaterials: ['ROAD', 'WOOD', 'STEEL', 'CABLE'],
        terrain: {
            leftX: 0.0,
            leftY: 12.0,
            leftWidth: 8.0,
            rightX: 38.0,
            rightY: 12.0,
            rightWidth: 10.0,
            gapWidth: 30.0,
            waterLevelY: 2.0,
            rockPillars: [
                { x: 21.0, y: 0.0, width: 6.0, height: 8.5 }
            ],
        },
        anchorNodes: [
            { x: 8.0, y: 12.0 }, // Left shore
            { x: 5.0, y: 7.0 }, // Left base
            { x: 21.5, y: 8.5 }, // Island left anchor
            { x: 26.5, y: 8.5 }, // Island right anchor
            { x: 38.0, y: 12.0 }, // Right shore
            { x: 41.0, y: 7.0 }, // Right base
        ],
    },
    {
        id: 4,
        name: 'Iron Ore Express',
        subtitle: 'Heavy Freight Railway',
        description: 'A 14,000 kg heavy freight train exerts immense downward pressure. Reinforced double-Warren steel trusses are mandatory.',
        budget: 62000,
        targetFlagX: 46.0,
        vehicle: 'TRAIN',
        allowedMaterials: ['ROAD', 'WOOD', 'STEEL', 'CABLE', 'HYDRAULIC'],
        terrain: {
            leftX: 0.0,
            leftY: 15.0,
            leftWidth: 10.0,
            rightX: 40.0,
            rightY: 15.0,
            rightWidth: 14.0,
            gapWidth: 30.0,
            waterLevelY: 3.0,
        },
        anchorNodes: [
            { x: 10.0, y: 15.0 }, // Left deck
            { x: 8.0, y: 9.0 }, // Left low anchor
            { x: 4.0, y: 22.0 }, // Left suspension mast
            { x: 40.0, y: 15.0 }, // Right deck
            { x: 42.0, y: 9.0 }, // Right low anchor
            { x: 46.0, y: 22.0 }, // Right suspension mast
        ],
    },
    {
        id: 5,
        name: 'Canyon Jump Launch',
        subtitle: 'High-Elevation Gap & Monster Truck',
        description: 'The right landing cliff is 5 meters lower! Build an angled takeoff ramp so the monster truck can launch across the raging river.',
        budget: 34000,
        targetFlagX: 38.0,
        vehicle: 'MONSTER_TRUCK',
        allowedMaterials: ['ROAD', 'WOOD', 'STEEL', 'CABLE'],
        terrain: {
            leftX: 0.0,
            leftY: 16.0,
            leftWidth: 10.0,
            rightX: 32.0,
            rightY: 10.0, // 6m lower!
            rightWidth: 14.0,
            gapWidth: 22.0,
            waterLevelY: 2.0,
        },
        anchorNodes: [
            { x: 10.0, y: 16.0 }, // Left upper cliff
            { x: 8.0, y: 10.0 }, // Left lower cliff
            { x: 32.0, y: 10.0 }, // Right lower landing cliff
            { x: 35.0, y: 6.0 }, // Right support
        ],
    },
];
