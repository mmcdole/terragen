import { Generator } from './types';

class GeneratorRegistry {
  private generators: Map<string, Generator> = new Map();

  register(generator: Generator) {
    // In development, allow re-registration for HMR
    if (import.meta.env.DEV) {
      this.generators.set(generator.id, generator);
      return;
    }
    
    // In production, prevent duplicate registration
    if (this.generators.has(generator.id)) {
      throw new Error(`Generator with id ${generator.id} is already registered`);
    }
    this.generators.set(generator.id, generator);
  }

  get(id: string): Generator | undefined {
    return this.generators.get(id);
  }

  getAll(): Generator[] {
    return Array.from(this.generators.values());
  }

  getDefaultGenerator(): Generator | undefined {
    return this.generators.get('terrain-default');
  }

  // Clear all generators (useful for HMR)
  clear() {
    this.generators.clear();
  }
}

export const registry = new GeneratorRegistry();

// Handle HMR
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    registry.clear();
  });
}
