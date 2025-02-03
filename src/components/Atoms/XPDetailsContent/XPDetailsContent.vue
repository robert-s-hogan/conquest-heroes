<!-- src/components/atoms/XPDetailsContent.vue -->
<template>
  <div class="p-4">
    <h3 class="text-xl font-semibold mb-4">XP &amp; Difficulty Details</h3>
    <div class="space-y-4 grid grid-cols-4 gap-4">
      <!-- Difficulty Select -->
      <SelectField
        v-model="localData.encounterDifficultyOption"
        label="Difficulty"
        :options="difficultyOptions"
      />
      <!-- Number of Players Select -->
      <SelectField
        v-model="localData.numberOfPlayers"
        label="Number of Players"
        :options="numberOfPlayersOptions"
      />
      <!-- Encounter XP as Input Number -->
      <div>
        <label class="block text-gray-700 font-bold mb-1">Encounter XP</label>
        <input
          type="number"
          v-model.number="localData.encounterExperience"
          class="border border-gray-300 rounded p-2 w-full"
        />
      </div>
      <!-- Adjusted XP as Input Number -->
      <div>
        <label class="block text-gray-700 font-bold mb-1">Adjusted XP</label>
        <input
          type="number"
          v-model.number="localData.encounterAdjustedExperience"
          class="border border-gray-300 rounded p-2 w-full"
        />
      </div>
      <!-- XP Thresholds (read-only text) -->
      <div>
        <label class="block text-gray-700 font-bold mb-2">XP Thresholds</label>
        <ul class="list-disc ml-4">
          <li
            v-for="(value, key) in localData.xpThresholdsByCharacterLevel"
            :key="key"
          >
            <span class="capitalize">{{ key }}:</span> {{ value }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import SelectField from '@/components/Atoms/BaseSelect/BaseSelect.vue'

const props = defineProps({
  encounterData: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:encounterData'])

// Create a reactive copy of the encounter data (with fallback for thresholds)
const localData = reactive({
  ...props.encounterData,
  xpThresholdsByCharacterLevel: props.encounterData
    .xpThresholdsByCharacterLevel || { easy: 0, medium: 0, hard: 0, deadly: 0 },
})

// Options arrays
const difficultyOptions = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
  { value: 'Deadly', label: 'Deadly' },
]

const numberOfPlayersOptions = Array.from({ length: 8 }, (_, i) => ({
  value: i + 1,
  label: (i + 1).toString(),
}))

// Emit any changes on localData update
watch(
  () => ({ ...localData }),
  (newData) => {
    emit('update:encounterData', newData)
  },
  { deep: true }
)
</script>
