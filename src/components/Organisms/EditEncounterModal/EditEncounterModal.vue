<!-- src/components/modals/EditEncounterModal.vue -->
<template>
  <Modal
    :isOpen="isOpen"
    title="Edit Encounter"
    size="large"
    @close="closeModal"
  >
    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Tabs
          :tabs="tabs"
          :encounterData="encounterData"
          @update:mapLocations="
            (newMapLocations) => (encounterData.mapLocations = newMapLocations)
          "
          @update:encounterDetails="
            (newDetails) => Object.assign(encounterData, newDetails)
          "
        />

        <div className="md:col-span-2">
          <div class="mt-4">
            <label class="block text-gray-700">NPC Types:</label>
            <!-- <div
              v-if="
                encounterData.npcTypes && Array.isArray(encounterData.npcTypes)
              "
              class="space-y-2"
            >
              <div
                v-for="(npcType, index) in encounterData.npcTypes"
                :key="index"
              >
                <input
                  v-model="encounterData.npcTypes[index]"
                  type="text"
                  placeholder="NPC Type"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div> -->
          </div>

          <div class="mt-4">
            <label class="block text-gray-700">Map Locations:</label>
            <!-- <MapDetailsContent
              :mapLocations="encounterData.mapLocations"
              :possibleItemsPerLocation="possibleItemsPerLocation"
              @update:encounterData="updateEncounterData"
            /> -->
          </div>
        </div>
      </div>

      <div class="flex justify-between mt-6">
        <Button
          type="button"
          variant="danger"
          @click="handleDelete"
          :loading="isDeleting"
        >
          Delete Encounter
        </Button>
        <Button type="submit" variant="primary" :loading="isSubmitting">
          Save Changes
        </Button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import Modal from '@/components/Atoms/BaseModal/BaseModal.vue'
import Button from '@/components/Atoms/BaseButton/BaseButton.vue'
import CaravanContent from '@/components/Atoms/CaravanContent/CaravanContent.vue'
import MapDetailsContent from '@/components/Atoms/MapDetailsContent/MapDetailsContent.vue'
import XPDetailsContent from '@/components/Atoms/XPDetailsContent/XPDetailsContent.vue'
import Tabs from '@/components/Organisms/BaseTabs/BaseTabs.vue'

import {
  difficultyOptions,
  terrainOptions,
  timeOfDayOptions,
  weatherOptions,
  objectivesOptions,
  generateMapLocationsWithItems,
} from '@/utils/encounterUtils'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  encounter: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'update', 'delete'])

// Create a reactive local copy of encounterData
const encounterData = reactive({ ...props.encounter })
const isSubmitting = ref(false)
const isDeleting = ref(false)

// Convert options arrays into the format expected by SelectField
const difficultyOptionsUnwrapped = difficultyOptions.map((value) => ({
  value,
  label: value,
}))

const terrainOptionsUnwrapped = terrainOptions.map((value) => ({
  value,
  label: value,
}))
const timeOfDayOptionsUnwrapped = timeOfDayOptions.map((value) => ({
  value,
  label: value,
}))
const weatherOptionsUnwrapped = weatherOptions.map((value) => ({
  value,
  label: value,
}))
const objectivesOptionsUnwrapped = objectivesOptions.map((value) => ({
  value,
  label: value,
}))

// Define possible items per location (should match those in encounterUtils.js)
const possibleItemsPerLocation = {
  MAP: [
    'Trap - Grease Trap',
    'Beast (Ox)',
    "Cartographer's Station (empty)",
    'Hidden Pitfall',
    'Magical Barrier',
  ],
  'Suspended Cage': [
    'Ladder, metal, 25ft telescopic',
    'Rope Ladder, wooden',
    'Net Trap',
  ],
  'Carnival Tent': ['Backpack (empty)', 'Storage Chest', 'Magic Mirror'],
  'OPPOSITION START': [
    'Hot Air Balloon, tethered, unoccupied',
    'Ambush Point',
    'Scout Tower',
  ],
  Den: ['Fountain (holy water)', 'Den (empty)', 'Alchemy Lab'],
  'Cannon, gunpowder loaded': [
    'Levitating Stones, orbiting',
    'Cannon Ball Rack',
    'Gunpowder Keg',
  ],
  Construct: ['Construct, large', 'Guard Construct', 'Repair Station'],
  'Time-Worn Reliquary, sacred contents': [
    'Ancient Tome',
    'Sacred Relic',
    'Mystic Artifact',
  ],
  'PLAYER START': [
    'Levitating Stones, orbiting',
    'Construct, large',
    'Player Beacon',
  ],
}

// Tabs Configuration
const tabs = [
  {
    id: 'xp-details',
    label: 'XP Details',
    component: XPDetailsContent,
    props: {
      difficultyOptions: difficultyOptionsUnwrapped,
      terrainOptions: terrainOptionsUnwrapped,
      timeOfDayOptions: timeOfDayOptionsUnwrapped,
      weatherOptions: weatherOptionsUnwrapped,
      objectivesOptions: objectivesOptionsUnwrapped,
    },
    variant: 'danger',
    loading: false,
  },
  {
    id: 'map-details',
    label: 'Map Details',
    component: MapDetailsContent,
    props: {
      mapLocations: encounterData.mapLocations,
      possibleItemsPerLocation: possibleItemsPerLocation,
    },
    variant: 'primaryOutlined',
    loading: false,
  },
  {
    id: 'caravan',
    label: 'Caravan',
    component: CaravanContent,
    props: {
      encounterData,
      // Pass any necessary props to CaravanContent if needed
    },
    variant: 'primary',
    loading: false,
  },
]

console.log('Current Group Level:', props.campaign?.groupLevel)
console.log('Remaining XP:', props.campaign?.remainingAdventuringDayXP)
console.log('Encounter XP:', encounterData.encounterExperience)

function updateEncounterData(newData) {
  Object.assign(encounterData, newData)
}

// Initialize mapLocations if empty
if (
  !encounterData.mapLocations ||
  Object.keys(encounterData.mapLocations).length === 0
) {
  encounterData.mapLocations = generateMapLocationsWithItems()
}

// Watch for changes in props.encounter and update encounterData accordingly
watch(
  () => props.encounter,
  (newEncounter) => {
    Object.assign(encounterData, newEncounter)

    // Ensure npcTypes and other fields are initialized correctly
    if (!Array.isArray(encounterData.npcTypes)) {
      encounterData.npcTypes = ['', '', '', ''] // Ensure 4 empty NPC types
    }

    if (
      !encounterData.mapLocations ||
      Object.keys(encounterData.mapLocations).length === 0
    ) {
      encounterData.mapLocations = generateMapLocationsWithItems() || {}
    }
  },
  { immediate: true }
)

// Close modal
const closeModal = () => {
  emit('close')
}

// Handle form submission
const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await emit('update', { ...encounterData })
  } catch (error) {
    console.error('Update failed:', error)
    // Optionally, display an error message to the user
  } finally {
    isSubmitting.value = false
    closeModal()
  }
}

// Handle delete action
const handleDelete = async () => {
  isDeleting.value = true
  try {
    await emit('delete', encounterData.encounterNumber)
  } catch (error) {
    console.error('Delete failed:', error)
    // Optionally, display an error message to the user
  } finally {
    isDeleting.value = false
    closeModal()
  }
}
</script>
