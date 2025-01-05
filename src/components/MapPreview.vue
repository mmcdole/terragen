<template>
  <div class="relative bg-gray-950 p-6">
    <pre
      class="block w-full overflow-auto text-gray-100 font-mono text-base leading-none whitespace-pre"
      style="tab-size: 1; letter-spacing: 0;"
    >{{ formattedMap }}</pre>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

const props = defineProps<{
  map: string[][]
}>()

const formattedMap = computed(() => {
  console.log('MapPreview map:', props.map);
  if (!props.map || !props.map.length) {
    return 'Click "Generate Map" to create a new map'
  }
  const result = props.map.map(row => row.join(' ')).join('\n')
  console.log('MapPreview formatted:', result.slice(0, 100) + '...');
  return result
})

// Watch for map changes
watch(() => props.map, (newMap) => {
  console.log('MapPreview map changed:', newMap?.length > 0 ? `${newMap.length}x${newMap[0].length}` : 'empty');
}, { deep: true })
</script>

<style>
pre {
  font-family: 'Fira Code', 'JetBrains Mono', 'Courier New', monospace;
}

/* Custom scrollbar for the preview */
pre::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

pre::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.5);
}

pre::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
  border-radius: 6px;
  border: 3px solid rgba(31, 41, 55, 0.5);
}

pre::-webkit-scrollbar-corner {
  background: rgba(31, 41, 55, 0.5);
}
</style>
