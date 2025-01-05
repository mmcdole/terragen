<template>
  <div class="min-h-screen p-4 bg-gray-900">
    <header class="mb-8">
      <h1 class="text-4xl font-bold text-center text-white">Terragen</h1>
      <p class="text-center text-gray-400">ASCII Terrain Generator</p>
    </header>

    <main class="container mx-auto max-w-6xl space-y-6">
      <!-- Top Controls -->
      <div class="bg-gray-800 rounded-lg shadow-lg p-6">
        <div class="flex flex-col sm:flex-row gap-6 items-end">
          <div class="w-full sm:w-96">
            <AlgorithmSelector @select="onGeneratorSelect" />
          </div>
          <button
            class="h-10 w-full sm:w-auto bg-blue-600 text-white rounded-md px-8 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-base font-medium"
            @click="generateMap"
          >
            Generate Map
          </button>
        </div>

        <!-- Configuration Panel -->
        <div class="mt-6 border-t border-gray-700 pt-4">
          <div 
            class="flex justify-between items-center cursor-pointer hover:bg-gray-700/50 p-2 rounded-md -mx-2"
            @click="configVisible = !configVisible"
          >
            <h2 class="text-lg font-semibold text-white">Configuration</h2>
            <span class="text-gray-400">
              {{ configVisible ? '▼' : '▶' }}
            </span>
          </div>
          <div v-show="configVisible" class="mt-4">
            <ConfigForm 
              v-if="currentGenerator"
              :generator="currentGenerator"
              :config="currentConfig"
              @change="onConfigChange"
            />
          </div>
        </div>
      </div>

      <!-- Map Preview Panel -->
      <div class="bg-gray-800 rounded-lg shadow-lg">
        <div class="p-4 border-b border-gray-700">
          <h2 class="text-xl font-semibold text-white">Preview</h2>
        </div>
        <MapPreview :map="currentMap" />
        <div class="p-4 border-t border-gray-700 flex justify-end">
          <DownloadButton :map="currentMap" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import AlgorithmSelector from './components/AlgorithmSelector.vue'
import ConfigForm from './components/ConfigForm.vue'
import MapPreview from './components/MapPreview.vue'
import DownloadButton from './components/DownloadButton.vue'
import { TerrainGenerator, registry } from './generators'
import type { Generator } from './generators'

const configVisible = ref(false)
const currentGenerator = ref<Generator>()
const currentConfig = ref<Record<string, any>>({})
const currentMap = ref<string[][]>([])

// Debug watcher for map changes
watch(() => currentMap.value, (newMap) => {
  console.log('currentMap changed:', {
    isArray: Array.isArray(newMap),
    length: newMap?.length,
    rowLength: newMap?.[0]?.length,
    sample: newMap?.[0]?.slice(0, 5)
  });
}, { deep: true });

function onGeneratorSelect(generator: Generator) {
  console.log('Generator selected:', {
    id: generator.id,
    name: generator.name,
    configGroups: Object.keys(generator.config)
  });
  
  currentGenerator.value = generator
  
  // Initialize config with default values from generator's config
  const newConfig: Record<string, any> = {};
  
  // Process each config group
  Object.entries(generator.config).forEach(([groupId, group]) => {
    console.log(`Processing config group: ${groupId}`, {
      fields: Object.keys(group.fields)
    });
    newConfig[groupId] = {};
    Object.entries(group.fields).forEach(([fieldId, field]) => {
      newConfig[groupId][fieldId] = field.default;
      console.log(`Setting ${groupId}.${fieldId} =`, field.default);
    });
  });
  
  currentConfig.value = newConfig;
  console.log('Final config structure:', {
    groups: Object.keys(newConfig),
    dimensions: newConfig.dimensions,
    generation: newConfig.generation,
    terrain: newConfig.terrain,
    features: newConfig.features,
    symbols: newConfig.symbols
  });
  
  generateMap();
}

function onConfigChange(config: Record<string, any>) {
  console.log('Config changed:', {
    groups: Object.keys(config),
    dimensions: config.dimensions,
    generation: config.generation
  });
  currentConfig.value = config;
}

function generateMap() {
  if (!currentGenerator.value) {
    console.error('No generator selected');
    return;
  }
  
  // Update seed for new generation
  if (currentConfig.value.generation) {
    const newSeed = Math.floor(Math.random() * 1000000);
    console.log('Updating generation seed:', newSeed);
    currentConfig.value.generation.seed = newSeed;
  }
  
  console.log('Generating map with config structure:', {
    groups: Object.keys(currentConfig.value),
    dimensions: currentConfig.value.dimensions,
    generation: currentConfig.value.generation,
    terrain: currentConfig.value.terrain,
    features: currentConfig.value.features,
    symbols: currentConfig.value.symbols
  });
  
  try {
    console.log('Calling generator.generate()...');
    const newMap = currentGenerator.value.generate(currentConfig.value);
    console.log('Map generated:', {
      isArray: Array.isArray(newMap),
      length: newMap?.length,
      rowLength: newMap?.[0]?.length,
      sample: newMap?.[0]?.slice(0, 5)
    });
    currentMap.value = newMap;
  } catch (error) {
    console.error('Error generating map:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
  }
}

// Generate initial map
onMounted(() => {
  console.log('Component mounted');
  const defaultGen = registry.getDefaultGenerator();
  console.log('Default generator:', defaultGen ? {
    id: defaultGen.id,
    name: defaultGen.name,
    configGroups: Object.keys(defaultGen.config)
  } : 'none');
  
  if (defaultGen) {
    onGeneratorSelect(defaultGen);
  } else {
    console.error('No default generator available');
  }
})
</script>
