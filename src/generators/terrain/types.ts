import { Point } from '../types';

export interface NoiseParams {
  scale: number;
  octaves: number;
  persistence: number;
  lacunarity: number;
}

export class TerrainCell {
  height: number;
  terrainType: string;
  symbol: string;

  constructor(height: number) {
    this.height = height;
    this.terrainType = '';
    this.symbol = '';
  }
}

export interface TerrainMap {
  width: number;
  height: number;
  cells: TerrainCell[][];
}
