<!-- src/components/atoms/MapDetailsContent.vue -->
<template>
  <div>
    <div
      v-for="(items, location) in localMapLocations"
      :key="location"
      class="mb-6"
    >
      <h3 class="text-xl font-semibold mb-2">
        {{ formatLocationName(location) }}
      </h3>
      <div v-for="(item, index) in items" :key="index" class="mb-4">
        <SelectField
          v-model="localMapLocations[location][index]"
          :label="`Item ${index + 1}`"
          :options="getOptionsForLocation(location)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import SelectField from '@/components/Atoms/BaseSelect/BaseSelect.vue'

// Define props
const props = defineProps({
  mapLocations: {
    type: Object,
    required: true,
  },
  possibleItemsPerLocation: {
    type: Object,
    required: true,
  },
})

// Define emits
const emit = defineEmits(['update:mapLocations'])

// Create a local reactive copy of mapLocations to avoid mutating props
const localMapLocations = reactive({ ...props.mapLocations })
const getOptionsForLocation = (location) => {
  return props.possibleItemsPerLocation[location] || []
}

const formatLocationName = (location) => {
  // Replace underscores with spaces and capitalize words
  return location
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Watch for changes in the localMapLocations and emit updates to the parent
watch(
  () => props.mapLocations,
  (newMapLocations) => {
    Object.assign(localMapLocations, newMapLocations)
  },
  { deep: true }
)

watch(
  () => localMapLocations,
  (newMapLocations) => {
    emit('update:mapLocations', { ...newMapLocations })
  },
  { deep: true }
)
</script>
