<template>
  <BaseModal
    :isOpen="props.isOpen"
    title="Add New Encounter"
    @close="closeModal"
  >
    <form @submit.prevent="handleSubmit">
      <!-- Input Fields -->
      <InputField
        v-model="numberOfPlayers"
        label="Number of Players"
        type="number"
        placeholder="Enter number of players"
      />

      <!-- Encounter Difficulty -->
      <!-- <SelectField
        v-model="encounterDifficultyOption"
        label="Encounter Difficulty"
        :options="availableDifficultyOptionsRef"
        placeholder="Select difficulty"
        :disabled="availableDifficultyOptionsRef.length === 0"
      /> -->

      <!-- Encounter Experience (read-only) -->
      <InputField
        v-model="encounterExperience"
        label="Encounter Experience"
        type="number"
        placeholder="Encounter experience"
        :readonly="true"
      />

      <!-- Other Fields -->
      <SelectField
        v-model="mapTerrainType"
        label="Map Terrain Type"
        :options="terrainOptionsRef"
        placeholder="Select terrain type"
      />
      <SelectField
        v-model="timeOfDay"
        label="Time of Day"
        :options="timeOfDayOptionsRef"
        placeholder="Select time of day"
      />
      <SelectField
        v-model="weather"
        label="Weather"
        :options="weatherOptionsRef"
        placeholder="Select weather"
      />
      <SelectField
        v-model="objectivesOfEncounter"
        label="Objectives of Encounter"
        :options="objectivesOptionsRef"
        placeholder="Select objective"
      />

      <Button :loading="isSubmitting" variant="primary" class="w-full mt-4">
        Add Encounter
      </Button>
    </form>
  </BaseModal>
</template>

<script setup>
import {
  ref,
  computed,
  defineProps,
  defineEmits,
  inject,
  watch,
  nextTick,
} from "vue";
import InputField from "@/components/Atoms/Input/Input.vue";
import SelectField from "@/components/Atoms/SelectField/SelectField.vue";
import BaseModal from "@/components/Atoms/Modal/Modal.vue";
import Button from "@/components/Atoms/Button/Button.vue";
import {
  getRandomMapTerrainType,
  getRandomTimeOfDay,
  getRandomWeather,
  getRandomObjectivesOfEncounter,
  terrainOptions,
  timeOfDayOptions,
  weatherOptions,
  objectivesOptions,
} from "@/utils/encounterUtils";
import { xpThresholdsByCharLvl } from "@/utils/xpTables";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit"]);

const isSubmitting = ref(false);

const numberOfPlayers = ref(4); // Default to 4 players
const encounterExperience = ref(0);

const encounterDifficultyOption = ref("");
const mapTerrainType = ref("");
const timeOfDay = ref("");
const weather = ref("");
const objectivesOfEncounter = ref("");

// Inject currentCampaign from parent component or composable
const currentCampaign = inject("currentCampaign");

// Compute available difficulties based on remainingAdventuringDayXP
const availableDifficultyOptionsRef = computed(() => {
  if (!currentCampaign || !currentCampaign.value) return [];

  const xpThresholds = xpThresholdsByCharLvl[currentCampaign.value.groupLevel];
  const remainingXP = currentCampaign.value.remainingAdventuringDayXP || 0;

  return Object.entries(xpThresholds)
    .filter(([difficulty, xp]) => xp * numberOfPlayers.value <= remainingXP)
    .map(([difficulty]) => ({
      value: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
      label: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    }));
});

// Watch for changes in availableDifficultyOptionsRef and set a default option
watch(
  availableDifficultyOptionsRef,
  (newOptions) => {
    if (newOptions.length > 0) {
      encounterDifficultyOption.value = newOptions[0].value;
    } else {
      encounterDifficultyOption.value = "";
    }
  },
  { immediate: true }
);

// Watch for changes in encounterDifficultyOption to update encounterExperience
watch(
  () => encounterDifficultyOption.value,
  (newDifficulty) => {
    if (!currentCampaign || !currentCampaign.value) return;

    const xpThresholds =
      xpThresholdsByCharLvl[currentCampaign.value.groupLevel];
    if (!xpThresholds) return;

    const difficultyKey = newDifficulty.toLowerCase();
    const xpPerPlayer = xpThresholds[difficultyKey] || 0;
    encounterExperience.value = xpPerPlayer * numberOfPlayers.value;
  }
);

// Convert options arrays into the format expected by SelectField
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

// Modify resetForm to remove setting encounterDifficultyOption
const resetForm = async () => {
  numberOfPlayers.value = 4;
  encounterExperience.value = 0;

  // Use random functions from encounterUtils.js
  mapTerrainType.value = getRandomMapTerrainType();
  timeOfDay.value = getRandomTimeOfDay();
  weather.value = getRandomWeather();
  objectivesOfEncounter.value = getRandomObjectivesOfEncounter();

  // Wait for computed properties to update
  await nextTick();

  // Set default or random difficulty option based on remaining XP
  if (availableDifficultyOptionsRef.value.length > 0) {
    // Randomly select a difficulty from available options
    const randomIndex = Math.floor(
      Math.random() * availableDifficultyOptionsRef.value.length
    );
    encounterDifficultyOption.value =
      availableDifficultyOptionsRef.value[randomIndex].value; // Set random option
  } else {
    encounterDifficultyOption.value = "";
  }
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
    encounterAdjustedExperience: Number(encounterExperience.value), // Assuming adjusted experience is the same
    encounterDifficultyOption: encounterDifficultyOption.value,
    mapTerrainType: mapTerrainType.value,
    timeOfDay: timeOfDay.value,
    weather: weather.value,
    objectivesOfEncounter: objectivesOfEncounter.value,
  });
  isSubmitting.value = false;
  closeModal();
};

// Initialize form on component mount
watch(
  () => currentCampaign?.value,
  (newVal) => {
    if (newVal) {
      resetForm();
    }
  },
  { immediate: true }
);

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      resetForm();
    }
  }
);
</script>
