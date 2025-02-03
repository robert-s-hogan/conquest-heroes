<!-- src/components/atoms/MapDetailsContent.vue -->
<script setup>
import { reactive, watch, ref, onMounted } from 'vue'
import SelectField from '@/components/Atoms/BaseSelect/BaseSelect.vue'
import mapItems from '@/data/mapItems.json' // Using the flat lookup from mapItems.json
import mundaneItems from '@/data/mundaneItems.json' // Import mundane items

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

// Randomize 4 unique mundane items
function getRandomMundaneItems() {
  const shuffled = [...mundaneItems].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 4).map((item) => item.name)
}

// Reactive state for random mundane items
const randomMundaneItems = reactive(getRandomMundaneItems())

// Provide options for selection
function getMundaneOptions() {
  return [
    { value: '', label: 'None' },
    ...mundaneItems.map((item) => ({ value: item.name, label: item.name })),
  ]
}

// NEW: Generate an object for each of the four locations (top, left, center, right)
// with exactly 5 slots. For each slot, there is a 50% chance it remains empty and a 50% chance
// it is filled with a random item from mapItems.json.
function generateRandomMapLocations() {
  const locations = {}
  const locationKeys = ['top', 'left', 'center', 'right']
  const numSlots = 5
  locationKeys.forEach((key) => {
    const slots = []
    for (let i = 0; i < numSlots; i++) {
      if (Math.random() < 0.5) {
        // 50% chance to be empty
        slots.push('')
      } else {
        const randomIndex = Math.floor(Math.random() * mapItems.length)
        slots.push(mapItems[randomIndex].name)
      }
    }
    locations[key] = slots
  })
  return locations
}

// NEW: Build the select options from the flat lookup.
// We include a top-level "None" option and then add all non‑empty items.
function getOptionsForLocation() {
  return [
    { value: '', label: 'None' },
    ...mapItems
      .filter((item) => item.name) // filter out any empty entries (if desired)
      .map((item) => ({ value: item.name, label: item.name })),
  ]
}

// Build a local copy from the encounterData without overwriting mapLocations.
// Also include npcTypes (an array of 4 strings).
const localMapData = reactive({
  mapTerrainType: props.encounterData.mapTerrainType || '',
  timeOfDay: props.encounterData.timeOfDay || '',
  weather: props.encounterData.weather || '',
  objectivesOfEncounter: props.encounterData.objectivesOfEncounter || '',
  // If no mapLocations are provided (or if the object doesn't have all 4 keys), generate new ones.
  mapLocations:
    props.encounterData.mapLocations &&
    Object.keys(props.encounterData.mapLocations).length === 4
      ? props.encounterData.mapLocations
      : generateRandomMapLocations(),
  // Store the marker separately. Default to "None" if not provided.
  oppositionStartLocation:
    props.encounterData.oppositionStartLocation || 'None',
  // NPC Types: an array of 4 text values.
  npcTypes: props.encounterData.npcTypes || ['', '', '', ''],
  mundaneItems: props.encounterData.mundaneItems || [...randomMundaneItems],
})

// Create a ref to control the opposition marker (this does not affect the items)
const oppositionStartLocation = ref(localMapData.oppositionStartLocation)

// Update the marker field when the select changes
watch(oppositionStartLocation, (newVal) => {
  localMapData.oppositionStartLocation = newVal
})

// Emit changes whenever localMapData changes so the parent (and Firebase store) stays in sync.
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
  <div class="grid grid-cols-1 md:grid-cols-3 space-y-4">
    <!-- Left Grid -->
    <div class="space-y-4">
      <!-- NPC Types Inputs -->
      <div class="space-y-2">
        <h4 class="font-semibold">NPC Types</h4>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="(npc, index) in localMapData.npcTypes"
            :key="index"
            class="flex space-x-2 items-center"
          >
            <label class="block text-sm font-medium text-gray-700 mb-1">
              NPC&nbsp;{{ index + 1 }}
            </label>
            <input
              type="text"
              v-model="localMapData.npcTypes[index]"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Mundane Inputs -->
      <div class="space-y-2">
        <h4 class="font-semibold">Mundane Items</h4>
        <div class="flex flex-col">
          <div
            v-for="(mundane, index) in localMapData.mundaneItems"
            :key="index"
            class="flex items-center space-y-0 text-xs"
          >
            <p class="text-xs">Random Item #{{ index + 1 }}</p>
            <SelectField
              v-model="localMapData.mundaneItems[index]"
              :options="getMundaneOptions()"
              class="mb-0"
              label=""
            />
          </div>
        </div>
      </div>

      <!-- Map Locations -->
      <div class="space-y-2">
        <h4 class="font-semibold">Map Locations</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 pr-4">
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
      </div>
    </div>

    <!-- Right Grid -->
    <div class="col-span-2">
      <!-- Diamond Layout for Map Locations -->
      <div class="grid grid-rows-[auto,1fr,auto] gap-y-4 bg-black p-4">
        <!-- TOP (row 1) -->
        <div class="flex justify-center -mb-32">
          <div class="border p-4 bg-white w-[455px] text-center">
            <!-- Top SelectFields -->
            <div v-for="(item, i) in localMapData.mapLocations.top" :key="i">
              <SelectField
                v-model="localMapData.mapLocations.top[i]"
                :options="getOptionsForLocation()"
                label=""
              />
            </div>

            <!-- Opposition Start Overlay for Top -->
            <div
              v-if="localMapData.oppositionStartLocation === 'Top'"
              class="flex items-center justify-center bg-red-500 bg-opacity-50 text-white"
            >
              OPPOSITION START
            </div>
          </div>
        </div>

        <!-- MIDDLE ROW (Left & Right side by side) -->
        <div class="grid grid-cols-3">
          <!-- LEFT -->
          <div class="border p-4 bg-white text-center">
            <div v-for="(item, i) in localMapData.mapLocations.left" :key="i">
              <SelectField
                v-model="localMapData.mapLocations.left[i]"
                :options="getOptionsForLocation()"
                label=""
              />
            </div>

            <!-- Opposition Start Overlay for Left -->
            <div
              v-if="localMapData.oppositionStartLocation === 'Left'"
              class="flex items-center justify-center bg-black bg-opacity-50 text-white"
            >
              OPPOSITION START
            </div>
          </div>

          <!-- EMPTY MID-->
          <div />

          <!-- RIGHT -->
          <div class="border p-4 bg-white text-center">
            <div v-for="(item, i) in localMapData.mapLocations.right" :key="i">
              <SelectField
                v-model="localMapData.mapLocations.right[i]"
                :options="getOptionsForLocation()"
                label=""
              />
            </div>

            <!-- Opposition Start Overlay for Right -->
            <div
              v-if="localMapData.oppositionStartLocation === 'Right'"
              class="flex items-center justify-center bg-black bg-opacity-50 text-white"
            >
              OPPOSITION START
            </div>
          </div>
        </div>

        <!-- BOTTOM (row 3) -->
        <div class="flex justify-center -mt-32">
          <div class="border p-4 bg-white w-[455px] text-center">
            <!-- Bottom / Center SelectFields -->
            <div v-for="(item, i) in localMapData.mapLocations.center" :key="i">
              <SelectField
                v-model="localMapData.mapLocations.center[i]"
                :options="getOptionsForLocation()"
                label=""
              />
            </div>

            <!-- You said you always overlay "GROUP START" on center -->
            <div
              class="flex items-center justify-center bg-blue-500 bg-opacity-50 text-white"
            >
              GROUP START
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
