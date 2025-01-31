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

// ✅ Now everything consistently uses localEncounterData
const localEncounterData = reactive({ ...props.encounterData })

// Watch for changes in props.encounterData -> update localEncounterData
watch(
  () => props.encounterData,
  (newData) => {
    Object.assign(localEncounterData, {
      mapTerrainType: newData.mapTerrainType,
      timeOfDay: newData.timeOfDay,
      weather: newData.weather,
      objectivesOfEncounter: newData.objectivesOfEncounter,
      // ...any other fields you want to keep in sync
    })
  },
  { deep: true }
)

// Watch for changes in localEncounterData -> emit to parent
watch(
  () => localEncounterData,
  (newDetails) => {
    emit('update:encounterDetails', { ...newDetails })
  },
  { deep: true }
)
</script>
