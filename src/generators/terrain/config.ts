import { GeneratorConfig } from '../types';

export const config: GeneratorConfig = {
  dimensions: {
    id: 'dimensions',
    label: 'Map Dimensions',
    fields: {
      width: {
        type: 'number',
        label: 'Width',
        default: 100,
        min: 20,
        max: 200,
        step: 1
      },
      height: {
        type: 'number',
        label: 'Height',
        default: 50,
        min: 10,
        max: 100,
        step: 1
      }
    }
  },
  generation: {
    id: 'generation',
    label: 'Generation Settings',
    fields: {
      type: {
        type: 'text',
        label: 'Type',
        default: 'perlin'
      },
      seed: {
        type: 'number',
        label: 'Seed',
        default: Math.floor(Math.random() * 1000000),
        min: 0,
        max: 999999,
        step: 1
      },
      scale: {
        type: 'number',
        label: 'Scale',
        default: 50.0,
        min: 10,
        max: 200,
        step: 1
      },
      octaves: {
        type: 'number',
        label: 'Octaves',
        default: 6,
        min: 1,
        max: 8,
        step: 1
      },
      persistence: {
        type: 'number',
        label: 'Persistence',
        default: 0.5,
        min: 0.1,
        max: 0.9,
        step: 0.1
      },
      lacunarity: {
        type: 'number',
        label: 'Lacunarity',
        default: 2.0,
        min: 1.5,
        max: 3.0,
        step: 0.1
      }
    }
  },
  terrain: {
    id: 'terrain',
    label: 'Terrain Settings',
    fields: {
      waterLevel: {
        type: 'number',
        label: 'Water Level',
        default: 0.4,
        min: -0.5,
        max: 0.5,
        step: 0.1
      },
      mountainLevel: {
        type: 'number',
        label: 'Mountain Level',
        default: 0.7,
        min: 0.2,
        max: 0.8,
        step: 0.1
      }
    }
  },
  features: {
    id: 'features',
    label: 'Features',
    fields: {
      rivers: {
        type: 'number',
        label: 'Number of Rivers',
        default: 3,
        min: 0,
        max: 10,
        step: 1
      },
      minRiverLength: {
        type: 'number',
        label: 'Min River Length',
        default: 10,
        min: 5,
        max: 50,
        step: 1
      },
      lakes: {
        type: 'boolean',
        label: 'Generate Lakes',
        default: true
      }
    }
  },
  symbols: {
    id: 'symbols',
    label: 'Map Symbols',
    fields: {
      ocean: {
        type: 'text',
        label: 'Ocean',
        default: '~'
      },
      plains: {
        type: 'text',
        label: 'Plains',
        default: '·'
      },
      hills: {
        type: 'text',
        label: 'Hills',
        default: '^'
      },
      mountains: {
        type: 'text',
        label: 'Mountains',
        default: '▲'
      },
      river: {
        type: 'text',
        label: 'River',
        default: '#'
      },
      lake: {
        type: 'text',
        label: 'Lake',
        default: 'o'
      }
    }
  }
};
