import { Point } from '../types';
import { TerrainCell, TerrainMap } from './types';
import { config as defaultConfig } from './config';

export class FeatureGenerator {
  private map: TerrainMap;

  constructor(map: TerrainMap) {
    this.map = map;
  }

  generateRivers(config: { numRivers: number; minLength: number; symbol: string }): void {
    const numRivers = config.numRivers;
    const minLength = config.minLength;

    // Find high points for river sources
    const sources: Point[] = [];
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        if (this.map.cells[y][x].height > 0.3) {
          let isHighPoint = true;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny >= 0 && ny < this.map.height && nx >= 0 && nx < this.map.width) {
                if (this.map.cells[ny][nx].height > this.map.cells[y][x].height) {
                  isHighPoint = false;
                  break;
                }
              }
            }
            if (!isHighPoint) break;
          }
          if (isHighPoint) {
            sources.push({ x, y });
          }
        }
      }
    }

    // Sort sources by height and take the highest ones
    sources.sort((a, b) => this.map.cells[b.y][b.x].height - this.map.cells[a.y][a.x].height);
    sources.splice(numRivers);

    // Generate rivers from each source
    for (const source of sources) {
      const path = this.findRiverPath(source, config);
      if (path.length >= minLength) {
        this.markRiverPath(path, config);
      }
    }
  }

  private findRiverPath(start: Point, config: { symbol: string }): Point[] {
    const path: Point[] = [start];
    let current = start;

    while (true) {
      let lowest: Point | null = null;
      let lowestHeight = this.map.cells[current.y][current.x].height;

      // Check all adjacent cells
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;

          const nx = current.x + dx;
          const ny = current.y + dy;

          if (nx >= 0 && nx < this.map.width && ny >= 0 && ny < this.map.height) {
            const height = this.map.cells[ny][nx].height;
            if (height < lowestHeight) {
              lowest = { x: nx, y: ny };
              lowestHeight = height;
            }
          }
        }
      }

      if (!lowest || this.map.cells[lowest.y][lowest.x].terrainType === 'ocean') {
        break;
      }

      path.push(lowest);
      current = lowest;
    }

    return path;
  }

  private markRiverPath(path: Point[], config: { symbol: string }): void {
    for (const point of path) {
      this.map.cells[point.y][point.x].terrainType = 'river';
      this.map.cells[point.y][point.x].symbol = config.symbol;
    }
  }

  generateLakes(config: { symbol: string; waterLevel: number }): void {
    // Find depressions that could form lakes
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const cell = this.map.cells[y][x];
        if (cell.terrainType !== 'ocean' && cell.height < config.waterLevel + 0.1) {
          let isDepression = true;
          let hasLowerNeighbor = false;

          // Check if surrounded by higher ground
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;

              const nx = x + dx;
              const ny = y + dy;

              if (nx >= 0 && nx < this.map.width && ny >= 0 && ny < this.map.height) {
                if (this.map.cells[ny][nx].height <= cell.height) {
                  if (this.map.cells[ny][nx].height < cell.height) {
                    hasLowerNeighbor = true;
                  }
                  isDepression = false;
                  break;
                }
              }
            }
            if (!isDepression) break;
          }

          if (isDepression || !hasLowerNeighbor) {
            this.floodFillLake({ x, y }, cell.height, config);
          }
        }
      }
    }
  }

  private floodFillLake(start: Point, waterLevel: number, config: { symbol: string }): void {
    const queue: Point[] = [start];
    const visited = new Set<string>();
    visited.add(`${start.x},${start.y}`);

    while (queue.length > 0) {
      const current = queue.shift()!;
      this.map.cells[current.y][current.x].terrainType = 'lake';
      this.map.cells[current.y][current.x].symbol = config.symbol;

      // Check neighbors
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = current.x + dx;
          const ny = current.y + dy;
          const key = `${nx},${ny}`;

          if (nx >= 0 && nx < this.map.width && 
              ny >= 0 && ny < this.map.height && 
              !visited.has(key)) {
            const cell = this.map.cells[ny][nx];
            if (cell.height <= waterLevel && cell.terrainType !== 'ocean') {
              queue.push({ x: nx, y: ny });
              visited.add(key);
            }
          }
        }
      }
    }
  }
}
