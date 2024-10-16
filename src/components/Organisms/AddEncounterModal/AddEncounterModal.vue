<template>
  <BaseModal :isOpen="isOpen" title="Add New Encounter" @close="closeModal">
    <form @submit.prevent="handleSubmit">
      <!-- Input Fields -->
      <InputField
        v-model="numberOfPlayers"
        label="Number of Players"
        type="number"
        placeholder="Enter number of players"
      />
      <InputField
        v-model="encounterExperience"
        label="Encounter Experience"
        type="number"
        placeholder="Enter encounter experience"
      />
      <InputField
        v-model="encounterAdjustedExperience"
        label="Encounter Adjusted Experience"
        type="number"
        placeholder="Enter adjusted experience"
      />

      <Button :loading="isSubmitting" variant="primary" class="w-full mt-4">
        Add Encounter
      </Button>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import InputField from "@/components/Atoms/Input/Input.vue";
import SelectField from "@/components/Atoms/SelectField/SelectField.vue";
import BaseModal from "@/components/Atoms/Modal/Modal.vue";
import Button from "@/components/Atoms/Button/Button.vue";
import {
  getRandomEncounterDifficultyOption,
  getRandomMapTerrainType,
  getRandomTimeOfDay,
  getRandomWeather,
  getRandomObjectivesOfEncounter,
  difficultyOptions,
  terrainOptions,
  timeOfDayOptions,
  weatherOptions,
  objectivesOptions,
} from "@/utils/encounterUtils";

const emit = defineEmits(["close", "submit"]);

const isOpen = ref(false);
const isSubmitting = ref(false);

const numberOfPlayers = ref(0);
const encounterExperience = ref(0);
const encounterAdjustedExperience = ref(0);

const encounterDifficultyOption = ref("");
const mapTerrainType = ref("");
const timeOfDay = ref("");
const weather = ref("");
const objectivesOfEncounter = ref("");

// Convert options arrays into the format expected by SelectField
const difficultyOptionsRef = ref(
  difficultyOptions.map((value) => ({ value, label: value }))
);
const terrainOptionsRef = ref(
  terrainOptions.map((value) => ({ value, label: value }))
);
const timeOfDayOptionsRef = ref(
  timeOfDayOptions.map((value) => ({ value, label: value }))
);
const weatherOptionsRef = ref(
  weatherOptions.map((value) => ({ value, label: value }))
);
const objectivesOptionsRef = ref(
  objectivesOptions.map((value) => ({ value, label: value }))
);

const resetForm = () => {
  numberOfPlayers.value = 0;
  encounterExperience.value = 0;
  encounterAdjustedExperience.value = 0;

  // Use random functions from encounterUtils.js
  encounterDifficultyOption.value = getRandomEncounterDifficultyOption();
  mapTerrainType.value = getRandomMapTerrainType();
  timeOfDay.value = getRandomTimeOfDay();
  weather.value = getRandomWeather();
  objectivesOfEncounter.value = getRandomObjectivesOfEncounter();
};

const closeModal = () => {
  emit("close");
  resetForm();
};

const handleSubmit = () => {
  isSubmitting.value = true;
  emit("submit", {
    numberOfPlayers: Number(numberOfPlayers.value),
    encounterExperience: Number(encounterExperience.value),
    encounterAdjustedExperience: Number(encounterAdjustedExperience.value),
    encounterDifficultyOption: encounterDifficultyOption.value,
    mapTerrainType: mapTerrainType.value,
    timeOfDay: timeOfDay.value,
    weather: weather.value,
    objectivesOfEncounter: objectivesOfEncounter.value,
  });
  isSubmitting.value = false;
  closeModal();
};
</script>
