<!-- src/components/atoms/MapDetailsContent.vue (After Updated) -->
<script setup>
import { reactive, watch, ref, onMounted } from 'vue'
import SelectField from '@/components/Atoms/BaseSelect/BaseSelect.vue'

// Options for the opposition marker
const oppositionLocationOptions = [
  { value: 'None', label: 'None' },
  { value: 'Top', label: 'Top' },
  { value: 'Left', label: 'Left' },
  { value: 'Right', label: 'Right' },
]

const props = defineProps({
  encounterData: { type: Object, required: true },
  terrainOptions: { type: Array, required: true },
  timeOfDayOptions: { type: Array, required: true },
  weatherOptions: { type: Array, required: true },
  objectivesOptions: { type: Array, required: true },
})
const emit = defineEmits(['update:encounterDetails'])

// Build a local copy from the encounterData without overwriting mapLocations.
// Also include npcTypes (an array of 4 strings).
const localMapData = reactive({
  mapTerrainType: props.encounterData.mapTerrainType || '',
  timeOfDay: props.encounterData.timeOfDay || '',
  weather: props.encounterData.weather || '',
  objectivesOfEncounter: props.encounterData.objectivesOfEncounter || '',
  // Expecting this to contain only random items (generated elsewhere)
  mapLocations: props.encounterData.mapLocations || {},
  // Store the marker separately. Default to "None" if not provided.
  oppositionStartLocation:
    props.encounterData.oppositionStartLocation || 'None',
  // NPC Types: an array of 4 text values.
  npcTypes: props.encounterData.npcTypes || ['', '', '', ''],
})

// Create a ref to control the opposition marker (this does not affect the items)
const oppositionStartLocation = ref(localMapData.oppositionStartLocation)

// Update the marker field when the select changes
watch(oppositionStartLocation, (newVal) => {
  localMapData.oppositionStartLocation = newVal
})

// Emit changes whenever localMapData changes so the parent (and firebase store) stays in sync.
watch(
  () => localMapData,
  (newData) => {
    emit('update:encounterDetails', { ...newData })
  },
  { deep: true }
)

// Optionally, if the marker is not set (i.e. "None"), randomize it on mount.
onMounted(() => {
  if (localMapData.oppositionStartLocation === 'None') {
    const randomOpp = ['Top', 'Left', 'Right'][Math.floor(Math.random() * 3)]
    oppositionStartLocation.value = randomOpp
  }
})
</script>

<template>
  <div class="space-y-4 p-4">
    <!-- Basic Map Details Selects -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <SelectField
        v-model="localMapData.mapTerrainType"
        label="Map Terrain Type"
        :options="terrainOptions"
      />
      <SelectField
        v-model="localMapData.timeOfDay"
        label="Time of Day"
        :options="timeOfDayOptions"
      />
      <SelectField
        v-model="localMapData.weather"
        label="Weather"
        :options="weatherOptions"
      />
      <SelectField
        v-model="localMapData.objectivesOfEncounter"
        label="Objectives"
        :options="objectivesOptions"
      />
    </div>

    <!-- Diamond Layout for Map Locations -->
    <div class="mt-4 flex flex-col items-center bg-black p-8">
      <!-- Top Row -->
      <div class="w-full flex justify-center">
        <div class="w-1/2 border p-2 text-center relative bg-white">
          <div class="flex flex-col items-center justify-center">
            <p v-for="(item, i) in localMapData.mapLocations.top" :key="i">
              {{ item }}
            </p>
          </div>
          <div
            v-if="localMapData.oppositionStartLocation === 'Top'"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
          >
            OPPOSITION START
          </div>
        </div>
      </div>

      <!-- Middle Row: Left and Right -->
      <div class="w-full flex justify-between mt-4">
        <!-- Left -->
        <div class="w-1/2 border p-2 text-center relative bg-white">
          <div class="flex flex-col items-center justify-center">
            <p v-for="(item, i) in localMapData.mapLocations.left" :key="i">
              {{ item }}
            </p>
          </div>
          <div
            v-if="localMapData.oppositionStartLocation === 'Left'"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
          >
            OPPOSITION START
          </div>
        </div>
        <!-- Right -->
        <div class="w-1/2 border p-2 text-center relative bg-white">
          <div class="flex flex-col items-center justify-center">
            <p v-for="(item, i) in localMapData.mapLocations.right" :key="i">
              {{ item }}
            </p>
          </div>
          <div
            v-if="localMapData.oppositionStartLocation === 'Right'"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
          >
            OPPOSITION START
          </div>
        </div>
      </div>

      <!-- Bottom Row: Center -->
      <div class="w-full flex justify-center mt-4 relative">
        <div class="w-1/2 border p-2 text-center bg-white">
          <div class="flex flex-col items-center justify-center">
            <p v-for="(item, i) in localMapData.mapLocations.center" :key="i">
              {{ item }}
            </p>
          </div>
          <!-- Always overlay a single "GROUP START" marker on center -->
          <div
            class="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-50 text-white"
          >
            GROUP START
          </div>
        </div>
      </div>
    </div>

    <!-- Opposition Start Selector Field -->
    <div class="mt-4">
      <SelectField
        v-model="oppositionStartLocation"
        label="Opposition Start Location"
        :options="oppositionLocationOptions"
      />
    </div>

    <!-- NPC Types Inputs -->
    <div class="mt-4">
      <h4 class="mb-2 font-semibold">NPC Types</h4>
      <div class="grid grid-cols-2 gap-4">
        <div v-for="(npc, index) in localMapData.npcTypes" :key="index">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >NPC {{ index + 1 }}</label
          >
          <input
            type="text"
            v-model="localMapData.npcTypes[index]"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  </div>
</template>
