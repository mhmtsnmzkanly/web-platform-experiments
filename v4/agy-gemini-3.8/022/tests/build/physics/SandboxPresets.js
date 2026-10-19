/**
 * POWDER-BOX (EXP-022) — Curated Presets
 * Hourglass, Oil Spill, Volcano, Acid Chamber, Forest Fire, and Steam Engine.
 */
export const SANDBOX_PRESETS = [
    {
        type: 'HOURGLASS',
        name: 'Antique Hourglass',
        description: 'Precision stone hourglass with silica sand trickling through a narrow orifice.',
        width: 240,
        height: 150,
    },
    {
        type: 'OIL_SPILL',
        name: 'Petroleum Slick & Fire',
        description: 'Layer of crude oil floating on ocean water ignited into a thermal blaze.',
        width: 240,
        height: 150,
    },
    {
        type: 'VOLCANO',
        name: 'Magma Caldera',
        description: 'Active volcanic vent bubbling molten lava that cools into solid basalt rock on contact with cold air.',
        width: 240,
        height: 150,
    },
    {
        type: 'ACID_CHAMBER',
        name: 'Chemical Dissolution Vat',
        description: 'Vat of toxic sulfuric acid corroding organic timber scaffolds and iron beams.',
        width: 240,
        height: 150,
    },
    {
        type: 'FOREST_FIRE',
        name: 'Wildfire Canopy',
        description: 'Lush plant vines and wooden trees susceptible to rapid fire propagation.',
        width: 240,
        height: 150,
    },
    {
        type: 'STEAM_ENGINE',
        name: 'Thermodynamic Boiler',
        description: 'Closed cycle: Fire boils water into steam, which condenses on cold ice back into water droplets.',
        width: 240,
        height: 150,
    },
];
export function loadPreset(engine, type) {
    engine.clear();
    const w = engine.width;
    const h = engine.height;
    const midX = Math.floor(w / 2);
    switch (type) {
        case 'HOURGLASS': {
            // Draw stone hourglass walls
            for (let y = 15; y < h - 15; y++) {
                const dy = Math.abs(y - Math.floor(h / 2));
                const neckWidth = 3;
                const bulbWidth = Math.floor(35 * (dy / (h / 2 - 15))) + neckWidth;
                // Left and right stone walls
                engine.setElement(midX - bulbWidth, y, 'STONE');
                engine.setElement(midX - bulbWidth - 1, y, 'STONE');
                engine.setElement(midX + bulbWidth, y, 'STONE');
                engine.setElement(midX + bulbWidth + 1, y, 'STONE');
            }
            // Top and bottom stone caps
            for (let x = midX - 40; x <= midX + 40; x++) {
                engine.setElement(x, 15, 'STONE');
                engine.setElement(x, 16, 'STONE');
                engine.setElement(x, h - 15, 'STONE');
                engine.setElement(x, h - 16, 'STONE');
            }
            // Fill top bulb with sand
            for (let y = 20; y < Math.floor(h / 2) - 8; y++) {
                const dy = Math.abs(y - Math.floor(h / 2));
                const bulbWidth = Math.floor(30 * (dy / (h / 2 - 15)));
                for (let x = midX - bulbWidth + 3; x <= midX + bulbWidth - 3; x++) {
                    engine.setElement(x, y, 'SAND');
                }
            }
            break;
        }
        case 'OIL_SPILL': {
            // Basin boundaries
            for (let x = 10; x < w - 10; x++) {
                engine.setElement(x, h - 10, 'STONE');
            }
            for (let y = 40; y < h - 10; y++) {
                engine.setElement(10, y, 'STONE');
                engine.setElement(w - 11, y, 'STONE');
            }
            // Water layer (deep ocean)
            for (let y = h - 50; y < h - 10; y++) {
                for (let x = 11; x < w - 11; x++) {
                    engine.setElement(x, y, 'WATER');
                }
            }
            // Oil slick (floats on top of water!)
            for (let y = h - 65; y < h - 50; y++) {
                for (let x = 30; x < w - 30; x++) {
                    engine.setElement(x, y, 'OIL');
                }
            }
            // Single initial spark of fire in center of oil slick
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    engine.setElement(midX + dx, h - 66 + dy, 'FIRE', 750.0);
                }
            }
            break;
        }
        case 'VOLCANO': {
            // Mountain silhouette (Basalt stone)
            for (let x = 10; x < w - 10; x++) {
                const distFromCenter = Math.abs(x - midX);
                const calderaWidth = 14;
                let surfaceY = h - 15;
                if (distFromCenter > calderaWidth) {
                    const slope = (h - 55) / (midX - calderaWidth - 10);
                    surfaceY = Math.floor(55 + (distFromCenter - calderaWidth) * slope);
                }
                else {
                    surfaceY = 85; // Caldera depression
                }
                for (let y = surfaceY; y < h - 5; y++) {
                    engine.setElement(x, y, 'STONE');
                }
            }
            // Central magma conduit
            for (let y = 70; y < h - 5; y++) {
                for (let x = midX - 8; x <= midX + 8; x++) {
                    engine.setElement(x, y, 'LAVA', 1050.0);
                }
            }
            break;
        }
        case 'ACID_CHAMBER': {
            // Glass container
            for (let x = 30; x < w - 30; x++) {
                engine.setElement(x, h - 15, 'GLASS');
                engine.setElement(x, h - 16, 'GLASS');
            }
            for (let y = 35; y < h - 15; y++) {
                engine.setElement(30, y, 'GLASS');
                engine.setElement(31, y, 'GLASS');
                engine.setElement(w - 31, y, 'GLASS');
                engine.setElement(w - 32, y, 'GLASS');
            }
            // Fill with acid
            for (let y = h - 45; y < h - 16; y++) {
                for (let x = 32; x < w - 32; x++) {
                    engine.setElement(x, y, 'ACID');
                }
            }
            // Suspended wood and iron scaffold partially submerged
            for (let y = h - 65; y < h - 30; y++) {
                for (let x = 60; x <= 65; x++)
                    engine.setElement(x, y, 'WOOD');
                for (let x = w - 65; x <= w - 60; x++)
                    engine.setElement(x, y, 'WOOD');
                for (let x = midX - 3; x <= midX + 3; x++)
                    engine.setElement(x, y, 'IRON');
            }
            for (let x = 50; x < w - 50; x++) {
                engine.setElement(x, h - 60, 'WOOD');
                engine.setElement(x, h - 40, 'WOOD');
            }
            break;
        }
        case 'FOREST_FIRE': {
            // Earth soil bed
            for (let x = 5; x < w - 5; x++) {
                for (let y = h - 20; y < h - 5; y++) {
                    engine.setElement(x, y, 'STONE');
                }
            }
            // Trees and foliage
            const treeSpacing = 28;
            for (let tx = 25; tx < w - 25; tx += treeSpacing) {
                // Trunk
                for (let y = h - 65; y < h - 20; y++) {
                    engine.setElement(tx, y, 'WOOD');
                    engine.setElement(tx + 1, y, 'WOOD');
                }
                // Canopy
                for (let cy = h - 90; cy < h - 65; cy++) {
                    const r = Math.floor(14 - Math.abs(cy - (h - 78)) * 0.7);
                    for (let cx = tx - r; cx <= tx + r; cx++) {
                        if (Math.random() < 0.88) {
                            engine.setElement(cx, cy, 'PLANT');
                        }
                    }
                }
            }
            // Lightning fire strike on leftmost tree
            for (let dy = -3; dy <= 3; dy++) {
                for (let dx = -3; dx <= 3; dx++) {
                    engine.setElement(25 + dx, h - 85 + dy, 'FIRE', 700.0);
                }
            }
            break;
        }
        case 'STEAM_ENGINE': {
            // Iron boiler chamber
            const boilerY = h - 35;
            for (let x = 40; x < w - 40; x++) {
                engine.setElement(x, boilerY, 'IRON');
                engine.setElement(x, boilerY - 1, 'IRON');
            }
            for (let y = 30; y < boilerY; y++) {
                engine.setElement(40, y, 'GLASS');
                engine.setElement(w - 41, y, 'GLASS');
            }
            // Fire heating element beneath iron plate
            for (let y = boilerY + 3; y < boilerY + 12; y++) {
                for (let x = 45; x < w - 45; x++) {
                    engine.setElement(x, y, 'FIRE', 800.0);
                }
            }
            // Water reservoir inside boiler
            for (let y = boilerY - 15; y < boilerY - 1; y++) {
                for (let x = 42; x < w - 42; x++) {
                    engine.setElement(x, y, 'WATER');
                }
            }
            // Cold ice ceiling for condensation
            for (let y = 32; y < 40; y++) {
                for (let x = 50; x < w - 50; x++) {
                    engine.setElement(x, y, 'ICE', -15.0);
                }
            }
            break;
        }
    }
}
