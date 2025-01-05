import { NoiseParams } from './types';

export class NoiseGenerator {
  private noise2D(x: number, y: number, seed: number): number {
    // Create permutation table
    const perm = new Array(512);
    for (let i = 0; i < 256; i++) {
      perm[i] = i;
    }
    
    // Shuffle using the seed
    for (let i = 255; i > 0; i--) {
      const j = Math.floor((seed * i) % (i + 1));
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    
    // Copy to 512 array
    for (let i = 0; i < 256; i++) {
      perm[256 + i] = perm[i];
    }

    // Unit square vertex coordinates
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    // Gradients at square vertices
    const g00 = this.grad2D(perm[perm[xi] + yi], xf, yf);
    const g10 = this.grad2D(perm[perm[xi + 1] + yi], xf - 1, yf);
    const g01 = this.grad2D(perm[perm[xi] + yi + 1], xf, yf - 1);
    const g11 = this.grad2D(perm[perm[xi + 1] + yi + 1], xf - 1, yf - 1);

    // Quintic interpolation weights
    const u = this.quintic(xf);
    const v = this.quintic(yf);

    // Interpolate between gradients
    const x1 = this.lerp(g00, g10, u);
    const x2 = this.lerp(g01, g11, u);
    return this.lerp(x1, x2, v);
  }

  private grad2D(hash: number, x: number, y: number): number {
    const h = hash & 7;
    let u = h < 4 ? x : y;
    let v = h < 4 ? y : x;
    
    return ((h & 1) !== 0 ? -u : u) + ((h & 2) !== 0 ? -2.0 * v : 2.0 * v);
  }

  private quintic(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  generateHeightMap(width: number, height: number, params: NoiseParams, seed: number): number[][] {
    const heightMap: number[][] = Array(height).fill(0).map(() => Array(width).fill(0));
    
    // Initialize with slight positive bias to favor land over ocean
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        heightMap[y][x] = Math.random() * 0.05;
      }
    }

    // Apply multiple octaves of noise
    let frequency = 1.0 / params.scale;
    let amplitude = 1.0;

    // Generate octaves
    for (let octave = 0; octave < params.octaves; octave++) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Add very subtle continental bias
          const dx = x / width - 0.5;
          const dy = y / height - 0.5;
          const distFromCenter = Math.sqrt(dx * dx + dy * dy);
          const continentalBias = (1.0 - distFromCenter * 2) * 0.05;

          // Generate noise value
          const nx = x * frequency;
          const ny = y * frequency;
          const n = this.noise2D(nx, ny, seed + octave);

          // Combine noise with subtle bias
          heightMap[y][x] += (n + continentalBias) * amplitude;
        }
      }
      frequency *= params.lacunarity;
      amplitude *= params.persistence;
    }

    // Normalize to [0, 1] range
    let min = heightMap[0][0];
    let max = heightMap[0][0];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (heightMap[y][x] < min) min = heightMap[y][x];
        if (heightMap[y][x] > max) max = heightMap[y][x];
      }
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        heightMap[y][x] = (heightMap[y][x] - min) / (max - min);
      }
    }

    return heightMap;
  }
}
