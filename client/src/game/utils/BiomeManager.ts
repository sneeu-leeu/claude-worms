export type Biome = 'grass' | 'sand' | 'lava' | 'ice' | 'space';

export interface BiomeConfig {
  name: string;
  tileName: string;
  gravity: number;
  friction: number;
  bounceMultiplier: number;
  hazardColor?: number;
  description: string;
}

export class BiomeManager {
  static biomes: Record<Biome, BiomeConfig> = {
    grass: {
      name: 'Grassy Plains',
      tileName: 'terrain-grass',
      gravity: 300,
      friction: 0.8,
      bounceMultiplier: 0.3,
      description: 'Comfortable terrain',
    },
    sand: {
      name: 'Sandy Desert',
      tileName: 'terrain-sand',
      gravity: 350,
      friction: 1.2,
      bounceMultiplier: 0.1,
      description: 'Rough and draggy',
    },
    lava: {
      name: 'Lava Wastes',
      tileName: 'terrain-lava',
      gravity: 280,
      friction: 0.5,
      bounceMultiplier: 0.8,
      hazardColor: 0xff4500,
      description: 'Slippery and dangerous',
    },
    ice: {
      name: 'Frozen Tundra',
      tileName: 'terrain-ice',
      gravity: 320,
      friction: 0.2,
      bounceMultiplier: 0.6,
      description: 'Extremely slippery',
    },
    space: {
      name: 'Asteroid Field',
      tileName: 'terrain-space',
      gravity: 100,
      friction: 0.1,
      bounceMultiplier: 0.4,
      description: 'Low gravity',
    },
  };

  static getRandomBiome(): Biome {
    const biomes: Biome[] = ['grass', 'sand', 'lava', 'ice', 'space'];
    return biomes[Math.floor(Math.random() * biomes.length)];
  }

  static getBiomeConfig(biome: Biome): BiomeConfig {
    return this.biomes[biome];
  }

  static getHealthColor(health: number): number {
    if (health > 50) return 0x00ff00; // Green
    if (health > 25) return 0xffff00; // Yellow
    return 0xff0000; // Red
  }
}
