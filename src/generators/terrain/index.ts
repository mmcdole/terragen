import { Generator } from '../types';
import { config as defaultConfig } from './config';
import { NoiseGenerator } from './noise';
import { FeatureGenerator } from './features';
import { TerrainCell, TerrainMap } from './types';

export class TerrainGenerator implements Generator {
  readonly id = 'terrain-default';
  readonly name = 'Simple Terrain';
  readonly description = 'A procedural terrain generator';
  readonly author = '@mmcdole';
  readonly config = defaultConfig;

  private map: TerrainMap;
  private noiseGen: NoiseGenerator;
  private featureGen: FeatureGenerator;

  constructor() {
    this.map = {
      width: defaultConfig.dimensions.fields.width.default,
      height: defaultConfig.dimensions.fields.height.default,
      cells: []
    };
    this.noiseGen = new NoiseGenerator();
    this.featureGen = new FeatureGenerator(this.map);
  }

  generate(config: Record<string, any>): string[][] {
    console.log('TerrainGenerator.generate called with config:', JSON.stringify(config, null, 2));
    
    // Update map dimensions
    this.map.width = config.dimensions.width;
    this.map.height = config.dimensions.height;
    console.log(`Map dimensions set to ${this.map.width}x${this.map.height}`);

    // Generate height map
    console.log('Generating height map with params:', {
      scale: config.generation.scale,
      octaves: config.generation.octaves,
      persistence: config.generation.persistence,
      lacunarity: config.generation.lacunarity,
      seed: config.generation.seed
    });
    
    const heightMap = this.noiseGen.generateHeightMap(
      this.map.width,
      this.map.height,
      {
        scale: config.generation.scale,
        octaves: config.generation.octaves,
        persistence: config.generation.persistence,
        lacunarity: config.generation.lacunarity
      },
      config.generation.seed
    );

    // Log height map statistics
    const heights = heightMap.flat();
    const minHeight = Math.min(...heights);
    const maxHeight = Math.max(...heights);
    console.log('Height map stats:', { minHeight, maxHeight });

    // Create terrain cells
    this.map.cells = heightMap.map(row => row.map(height => new TerrainCell(height)));

    // Assign terrain types based on height thresholds
    const waterLevel = config.terrain.waterLevel;
    const mountainLevel = config.terrain.mountainLevel;
    const plainsThreshold = waterLevel + (mountainLevel - waterLevel) * 0.4;
    const hillsThreshold = waterLevel + (mountainLevel - waterLevel) * 0.8;

    console.log('Terrain thresholds:', {
      waterLevel,
      plainsThreshold,
      hillsThreshold,
      mountainLevel
    });

    // Count terrain types for distribution analysis
    const terrainCounts = {
      ocean: 0,
      plains: 0,
      hills: 0,
      mountains: 0
    };

    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const cell = this.map.cells[y][x];
        const height = cell.height;

        // Add slight local variation to thresholds for more natural boundaries
        const localVariation = (Math.random() * 2 - 1) * 0.02;

        if (height < waterLevel + localVariation) {
          cell.terrainType = 'ocean';
          cell.symbol = config.symbols.ocean;
          terrainCounts.ocean++;
        } else if (height < plainsThreshold + localVariation) {
          cell.terrainType = 'plains';
          cell.symbol = config.symbols.plains;
          terrainCounts.plains++;
        } else if (height < hillsThreshold + localVariation) {
          cell.terrainType = 'hills';
          cell.symbol = config.symbols.hills;
          terrainCounts.hills++;
        } else {
          cell.terrainType = 'mountains';
          cell.symbol = config.symbols.mountains;
          terrainCounts.mountains++;
        }
      }
    }

    console.log('Terrain distribution:', terrainCounts);

    const result = this.map.cells.map(row => row.map(cell => cell.symbol));
    return result;
  }
}

export default TerrainGenerator;
