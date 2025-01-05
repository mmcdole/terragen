import { TerrainGenerator } from './terrain';
import { registry } from './registry';

// Register all generators
const terrainGenerator = new TerrainGenerator();
registry.register(terrainGenerator);

// Re-export for convenience
export { TerrainGenerator } from './terrain';
export { registry };
export * from './types';

// Handle HMR
if (import.meta.hot) {
  import.meta.hot.accept(['./terrain'], ([terrainModule]) => {
    if (terrainModule) {
      const newTerrainGenerator = new terrainModule.TerrainGenerator();
      registry.register(newTerrainGenerator);
    }
  });
}
