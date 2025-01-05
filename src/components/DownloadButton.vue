<template>
  <button
    class="bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-sm font-medium"
    @click="downloadMap"
    :disabled="!hasMap"
  >
    Download Map
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  map: string[][]
}>()

const hasMap = computed(() => props.map.length > 0)

function downloadMap() {
  if (!hasMap.value) return

  const mapText = props.map.map(row => row.join(' ')).join('\n')
  const blob = new Blob([mapText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = 'map.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>
