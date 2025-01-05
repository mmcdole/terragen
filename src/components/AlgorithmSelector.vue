<template>
  <div>
    <label class="block text-sm font-medium text-gray-300 mb-1.5">
      Generator Type
    </label>
    <select
      class="form-select block w-full h-10 rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      v-model="selectedId"
      @change="onChange"
    >
      <option 
        v-for="generator in generators" 
        :key="generator.id"
        :value="generator.id"
      >
        {{ generator.name }}
        <template v-if="generator.author">
          (by {{ generator.author }})
        </template>
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { registry } from '../generators'

const generators = registry.getAll()
const selectedId = ref(registry.getDefaultGenerator()?.id || generators[0]?.id)

const emit = defineEmits<{
  (e: 'select', generator: any): void
}>()

function onChange() {
  const generator = registry.get(selectedId.value)
  if (generator) {
    emit('select', generator)
  }
}

onMounted(() => {
  // Emit initial selection
  onChange()
})
</script>

<style>
.form-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
</style>
