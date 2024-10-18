<!-- src/components/atoms/MapDetailsContent.vue -->
<template>
  <div>
    <SelectField
      v-model="encounterData.mapTerrainType"
      label="Map Terrain Type"
      :options="terrainOptionsRef"
    />
    <SelectField
      v-model="encounterData.timeOfDay"
      label="Time of Day"
      :options="timeOfDayOptionsRef"
    />
    <SelectField
      v-model="encounterData.weather"
      label="Weather"
      :options="weatherOptionsRef"
    />
    <SelectField
      v-model="encounterData.objectivesOfEncounter"
      label="Objectives"
      :options="objectivesOptionsRef"
    />
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import SelectField from "@/components/Atoms/SelectField/SelectField.vue";

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
});
</script>
