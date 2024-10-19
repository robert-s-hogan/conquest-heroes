<!-- src/components/atoms/MapDetailsContent.vue -->
<template>
  <div>
    <SelectField
      v-model="localEncounterData.mapTerrainType"
      label="Map Terrain Type"
      :options="terrainOptionsRef"
    />
    <SelectField
      v-model="localEncounterData.timeOfDay"
      label="Time of Day"
      :options="timeOfDayOptionsRef"
    />
    <SelectField
      v-model="localEncounterData.weather"
      label="Weather"
      :options="weatherOptionsRef"
    />
    <SelectField
      v-model="localEncounterData.objectivesOfEncounter"
      label="Objectives"
      :options="objectivesOptionsRef"
    />
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import SelectField from '@/components/Atoms/BaseSelect/BaseSelect.vue'

// Define props
const props = defineProps({
  encounterData: {
    type: Object,
    required: true,
  },
  terrainOptionsRef: {
    type: Array,
    required: true,
  },
  timeOfDayOptionsRef: {
    type: Array,
    required: true,
  },
  weatherOptionsRef: {
    type: Array,
    required: true,
  },
  objectivesOptionsRef: {
    type: Array,
    required: true,
  },
})

// Define emits
const emit = defineEmits(['update:encounterData'])

// Create a reactive local copy of encounterData
const localEncounterData = reactive({ ...props.encounterData })

// Watch for changes in localEncounterData and emit updates
watch(
  () => ({ ...localEncounterData }),
  (newData) => {
    emit('update:encounterData', newData)
  },
  { deep: true }
)
</script>
