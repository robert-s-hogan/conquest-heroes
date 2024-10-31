<!-- XPDetailsContent.vue -->
<template>
  <div>
    <SelectField
      v-model="localEncounterData.mapTerrainType"
      label="Map Terrain Type"
      :options="terrainOptions"
    />
    <SelectField
      v-model="localEncounterData.timeOfDay"
      label="Time of Day"
      :options="timeOfDayOptions"
    />
    <SelectField
      v-model="localEncounterData.weather"
      label="Weather"
      :options="weatherOptions"
    />
    <SelectField
      v-model="localEncounterData.objectivesOfEncounter"
      label="Objectives"
      :options="objectivesOptions"
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
  terrainOptions: {
    type: Array,
    required: true,
  },
  timeOfDayOptions: {
    type: Array,
    required: true,
  },
  weatherOptions: {
    type: Array,
    required: true,
  },
  objectivesOptions: {
    type: Array,
    required: true,
  },
})

// Define emits
const emit = defineEmits(['update:encounterDetails'])

// Create a local reactive object for only the relevant properties
const localEncounterDetails = reactive({
  mapTerrainType: props.encounterData.mapTerrainType,
  timeOfDay: props.encounterData.timeOfDay,
  weather: props.encounterData.weather,
  objectivesOfEncounter: props.encounterData.objectivesOfEncounter,
})
// Watch for changes and emit updates

watch(
  () => props.encounterData,
  (newData) => {
    Object.assign(localEncounterDetails, {
      mapTerrainType: newData.mapTerrainType,
      timeOfDay: newData.timeOfDay,
      weather: newData.weather,
      objectivesOfEncounter: newData.objectivesOfEncounter,
    })
  },
  { deep: true }
)

watch(
  () => localEncounterDetails,
  (newDetails) => {
    emit('update:encounterDetails', { ...newDetails })
  },
  { deep: true }
)
</script>
