<!-- src/components/atoms/XPDetailsContent.vue -->
<template>
  <div>
    <InputField
      v-model="encounterData.numberOfPlayers"
      label="Number of Players"
      type="number"
    />
    <InputField
      v-model="encounterData.encounterExperience"
      label="Encounter Experience"
      type="number"
    />
    <InputField
      v-model="encounterData.encounterAdjustedExperience"
      label="Encounter Adjusted Experience"
      type="number"
    />
    <SelectField
      v-model="encounterData.encounterDifficultyOption"
      label="Difficulty"
      :options="difficultyOptionsRef"
    />

    <!-- Add more XP-related fields here if necessary -->
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import InputField from "@/components/Atoms/Input/Input.vue";
import SelectField from "@/components/Atoms/SelectField/SelectField.vue";

const props = defineProps({
  encounterData: {
    type: Object,
    required: true,
  },
  objectivesOptionsRef: {
    type: Array,
    required: true,
  },
  difficultyOptionsRef: {
    type: Array,
    required: true,
  },
});
</script>
