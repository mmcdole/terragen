import { Generator } from '../types';
import { NoiseGenerator } from './noise';
import { FeatureGenerator } from './features';
import { TerrainMap, TerrainType, TerrainCell, RGB, TerrainConfig } from './types';
import { config as defaultConfig } from './config';

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

  private interpolateColor(color1: RGB, color2: RGB, factor: number): RGB {
    return [
      Math.round(color1[0] + (color2[0] - color1[0]) * factor),
      Math.round(color1[1] + (color2[1] - color1[1]) * factor),
      Math.round(color1[2] + (color2[2] - color1[2]) * factor)
    ];
  }

  private getTerrainCell(height: number, config: TerrainConfig): TerrainCell {
    const types = config.terrainTypes;
    let terrainType: TerrainType;
    
    // Determine terrain type based on height
    if (height <= types.ocean.heightRange[1]) {
      terrainType = types.ocean;
    } else if (height <= types.plains.heightRange[1]) {
      terrainType = types.plains;
    } else if (height <= types.hills.heightRange[1]) {
      terrainType = types.hills;
    } else {
      terrainType = types.mountains;
    }

    // Calculate where within this terrain type's range the height falls
    const [min, max] = terrainType.heightRange;
    const rangeFactor = (height - min) / (max - min);
    
    // Get color by interpolating between the closest colors
    const colors = terrainType.colors;
    const colorIndex = Math.min(
      Math.floor(rangeFactor * (colors.length - 1)),
      colors.length - 2
    );
    const colorFactor = (rangeFactor * (colors.length - 1)) - colorIndex;
    const color = this.interpolateColor(
      colors[colorIndex],
      colors[colorIndex + 1],
      colorFactor
    );

    // Randomly select a symbol
    const symbol = terrainType.symbols[
      Math.floor(Math.random() * terrainType.symbols.length)
    ];

    return { height, symbol, color };
  }

  generate(config: TerrainConfig): string[][] {
    // Update map dimensions
    this.map.width = config.dimensions.width;
    this.map.height = config.dimensions.height;

    // Generate height map
    const heightMap = this.noiseGen.generateHeightMap(
      this.map.width,
      this.map.height,
      config.generation,
      config.generation.seed
    );

    // Convert height map to colored terrain cells
    const cells: string[][] = Array(this.map.height)
      .fill(0)
      .map(() => Array(this.map.width).fill(''));

    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const height = heightMap[y][x];
        const cell = this.getTerrainCell(height, config);
        
        // Format as HTML span with RGB color
        const [r, g, b] = cell.color;
        cells[y][x] = `<span style="color: rgb(${r}, ${g}, ${b})">${cell.symbol}</span>`;
      }
    }

    this.map.cells = cells;
    return cells;
  }
}

export default TerrainGenerator;
