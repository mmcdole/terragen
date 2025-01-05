<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div 
      v-for="group in configGroups" 
      :key="group.id"
      class="bg-gray-700/30 rounded-lg p-4"
    >
      <h3 class="text-base font-medium mb-4">{{ group.label }}</h3>
      <div class="space-y-4">
        <div 
          v-for="(field, key) in group.fields" 
          :key="key"
          class="space-y-1"
        >
          <label :for="key" class="block text-sm font-medium text-gray-300">
            {{ field.label }}
          </label>

          <!-- Number input -->
          <div v-if="field.type === 'number'" class="space-y-1">
            <input
              :id="key"
              type="range"
              :value="config[group.id]?.[key] ?? field.default"
              :min="field.min"
              :max="field.max"
              :step="field.step"
              class="w-full"
              @input="updateField(group.id, key, $event)"
            >
            <div class="text-sm text-gray-400">
              {{ config[group.id]?.[key] ?? field.default }}
            </div>
          </div>

          <!-- Text input -->
          <input
            v-if="field.type === 'text'"
            :id="key"
            type="text"
            :value="config[group.id]?.[key] ?? field.default"
            class="block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            @input="updateField(group.id, key, $event)"
          >

          <!-- Select input -->
          <select
            v-if="field.type === 'select'"
            :id="key"
            :value="config[group.id]?.[key] ?? field.default"
            class="block w-full rounded-md border-gray-600 bg-gray-700 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            @change="updateField(group.id, key, $event)"
          >
            <option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <!-- Boolean input -->
          <div v-if="field.type === 'boolean'" class="flex items-center">
            <input
              :id="key"
              type="checkbox"
              :checked="config[group.id]?.[key] ?? field.default"
              class="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
              @change="updateField(group.id, key, $event)"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Generator } from '../generators'

const props = defineProps<{
  generator: Generator;
  config: Record<string, any>;
}>();

const emit = defineEmits<{
  (e: 'change', config: Record<string, any>): void;
}>();

const configGroups = computed(() => Object.values(props.generator.config));

function updateField(groupId: string, fieldId: string, event: Event) {
  const target = event.target as HTMLInputElement;
  const value = target.type === 'checkbox' ? target.checked :
                target.type === 'number' ? Number(target.value) :
                target.value;

  const newConfig = {
    ...props.config,
    [groupId]: {
      ...props.config[groupId],
      [fieldId]: value
    }
  };

  emit('change', newConfig);
}
</script>
