<!-- src/components/Organisms/AddEncounterModal/AddEncounterModal.vue -->
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
      <SelectField
        v-model="encounterDifficultyOption"
        label="Encounter Difficulty"
        :options="availableDifficultyOptionsRef"
        placeholder="Select difficulty"
        :disabled="availableDifficultyOptionsRef.length === 0"
      />

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

      <Button
        type="submit"
        :loading="isSubmitting"
        variant="primary"
        class="w-full mt-4"
      >
        Add Encounter
      </Button>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import InputField from '@/components/Atoms/BaseInput/BaseInput.vue'
import SelectField from '@/components/Atoms/BaseSelect/BaseSelect.vue'
import BaseModal from '@/components/Atoms/BaseModal/BaseModal.vue'
import Button from '@/components/Atoms/BaseButton/BaseButton.vue'
import {
  getRandomMapTerrainType,
  getRandomTimeOfDay,
  getRandomWeather,
  getRandomObjectivesOfEncounter,
  terrainOptions,
  timeOfDayOptions,
  weatherOptions,
  objectivesOptions,
} from '@/utils/encounterUtils'
import { xpThresholdsByCharLvl } from '@/utils/xpTables'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  campaign: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'add'])

const isSubmitting = ref(false)

const numberOfPlayers = ref(4) // Default to 4 players
const encounterExperience = ref(0)

const encounterDifficultyOption = ref('')
const mapTerrainType = ref('')
const timeOfDay = ref('')
const weather = ref('')
const objectivesOfEncounter = ref('')

// 1) Simple helper for random ID in [1..100]
function generateSimpleEncounterId() {
  return Math.floor(Math.random() * 100) + 1
}

// Compute available difficulties based on remainingAdventuringDayXP
const availableDifficultyOptionsRef = computed(() => {
  if (!props.campaign) return []

  const xpThresholds = xpThresholdsByCharLvl[props.campaign.groupLevel]
  const remainingXP = props.campaign.remainingAdventuringDayXP || 0

  return Object.entries(xpThresholds)
    .filter(([difficulty, xp]) => xp * numberOfPlayers.value <= remainingXP)
    .map(([difficulty]) => ({
      value: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
      label: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    }))
})

// Watch for changes in encounterDifficultyOption to update encounterExperience
watch(
  () => encounterDifficultyOption.value,
  (newDifficulty) => {
    if (!props.campaign) return []

    const xpThresholds = xpThresholdsByCharLvl[props.campaign.groupLevel]
    if (!xpThresholds) return

    const difficultyKey = newDifficulty.toLowerCase()
    const xpPerPlayer = xpThresholds[difficultyKey] || 0
    encounterExperience.value = xpPerPlayer * numberOfPlayers.value
  }
)

// Convert options arrays into the format expected by SelectField
const terrainOptionsRef = ref(
  terrainOptions.map((value) => ({ value, label: value }))
)
const timeOfDayOptionsRef = ref(
  timeOfDayOptions.map((value) => ({ value, label: value }))
)
const weatherOptionsRef = ref(
  weatherOptions.map((value) => ({ value, label: value }))
)
const objectivesOptionsRef = ref(
  objectivesOptions.map((value) => ({ value, label: value }))
)

// Reset form
const resetForm = async () => {
  numberOfPlayers.value = 4
  encounterExperience.value = 0

  // Use random utility functions
  mapTerrainType.value = getRandomMapTerrainType()
  if (availableDifficultyOptionsRef.value.length > 0) {
    const randomIndex = Math.floor(
      Math.random() * availableDifficultyOptionsRef.value.length
    )
    encounterDifficultyOption.value =
      availableDifficultyOptionsRef.value[randomIndex].value
  } else {
    encounterDifficultyOption.value = ''
  }
  timeOfDay.value = getRandomTimeOfDay()
  weather.value = getRandomWeather()
  objectivesOfEncounter.value = getRandomObjectivesOfEncounter()

  await nextTick()

  // Randomly set difficulty from available options (if any)
  if (availableDifficultyOptionsRef.value.length > 0) {
    const randomIndex = Math.floor(
      Math.random() * availableDifficultyOptionsRef.value.length
    )
    encounterDifficultyOption.value =
      availableDifficultyOptionsRef.value[randomIndex].value
  } else {
    encounterDifficultyOption.value = ''
  }
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const handleSubmit = () => {
  console.log('🚀 AddEncounterModal: handleSubmit triggered')

  isSubmitting.value = true

  // 2) Build a more comprehensive encounter object
  const newEncounter = {
    // If you'd rather call it 'id', that's fine too
    encounterNumber: generateSimpleEncounterId(),
    date: new Date().toISOString(),

    // Fields from your form
    numberOfPlayers: Number(numberOfPlayers.value),
    encounterExperience: Number(encounterExperience.value),
    encounterAdjustedExperience: Number(encounterExperience.value),
    encounterDifficultyOption: encounterDifficultyOption.value,
    mapTerrainType: mapTerrainType.value,
    timeOfDay: timeOfDay.value,
    weather: weather.value,
    objectivesOfEncounter: objectivesOfEncounter.value,

    // Additional placeholders (if you want to store them):
    // players: ['Player 1', 'Player 2'],
    // npcTypes: ['', '', '', ''],
    // mapLocations: { top: [], left: [], center: [], right: [] },
    // shortRestNeededFirstOne: false,
    // ...
  }

  emit('add', newEncounter)
  isSubmitting.value = false
  closeModal()
  console.log('🚀 after emit in handleSubmit')
}

// Re-init form whenever the modal is opened or the campaign changes
watch(
  () => props.campaign,
  (newVal) => {
    if (newVal) {
      resetForm()
    }
  },
  { immediate: true }
)

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      resetForm()
    }
  }
)
</script>
