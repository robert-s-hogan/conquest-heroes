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
import InputField from "@/atoms/Input/Input.vue";
import SelectField from "@/atoms/SelectField/SelectField.vue";
import BaseModal from "@/atoms/Modal/Modal.vue";
import Button from "@/atoms/Button/Button.vue";

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

// Options for SelectFields
const difficultyOptions = ref([
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
  { value: "Deadly", label: "Deadly" },
]);

const terrainOptions = ref([
  { value: "Volcanic Island", label: "Volcanic Island" },
  { value: "Forest", label: "Forest" },
  { value: "Desert", label: "Desert" },
  { value: "Mountain", label: "Mountain" },
]);

const timeOfDayOptions = ref([
  { value: "Day", label: "Day" },
  { value: "Night", label: "Night" },
  { value: "Dawn", label: "Dawn" },
  { value: "Dusk", label: "Dusk" },
]);

const weatherOptions = ref([
  { value: "Clear", label: "Clear" },
  { value: "Rainy", label: "Rainy" },
  { value: "Stormy", label: "Stormy" },
  {
    value: "Light Sandstorm (getting worse)",
    label: "Light Sandstorm (getting worse)",
  },
]);

const objectiveOptions = ref([
  {
    value: "Remove all Enemies from the area",
    label: "Remove all Enemies from the area",
  },
  { value: "Rescue the Hostage", label: "Rescue the Hostage" },
  { value: "Defend the Base", label: "Defend the Base" },
]);

// Shuffle function
const shuffle = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

// Shuffle the options on reset or on modal open
const randomizeOptions = () => {
  difficultyOptions.value = shuffle(difficultyOptions.value);
  terrainOptions.value = shuffle(terrainOptions.value);
  timeOfDayOptions.value = shuffle(timeOfDayOptions.value);
  weatherOptions.value = shuffle(weatherOptions.value);
  objectiveOptions.value = shuffle(objectiveOptions.value);
};

const closeModal = () => {
  emit("close");
  resetForm();
};

const resetForm = () => {
  numberOfPlayers.value = 0;
  encounterExperience.value = 0;
  encounterAdjustedExperience.value = 0;
  encounterDifficultyOption.value = "";
  mapTerrainType.value = "";
  timeOfDay.value = "";
  weather.value = "";
  objectivesOfEncounter.value = "";

  // Randomize the options each time the form resets
  randomizeOptions();
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
