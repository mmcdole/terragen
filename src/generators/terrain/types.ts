import { Point } from '../types';

export interface NoiseParams {
  scale: number;
  octaves: number;
  persistence: number;
  lacunarity: number;
  seed: number;
}

export type RGB = [number, number, number];

export interface TerrainType {
  heightRange: [number, number];
  symbols: string[];
  colors: RGB[];
}

export interface TerrainCell {
  height: number;
  symbol: string;
  color: RGB;
}

export interface TerrainConfig {
  dimensions: {
    width: number;
    height: number;
  };
  generation: NoiseParams;
  terrain: {
    waterLevel: number;
    mountainLevel: number;
  };
  terrainTypes: {
    ocean: TerrainType;
    plains: TerrainType;
    hills: TerrainType;
    mountains: TerrainType;
  };
}

export interface TerrainMap {
  width: number;
  height: number;
  cells: string[][];
}
