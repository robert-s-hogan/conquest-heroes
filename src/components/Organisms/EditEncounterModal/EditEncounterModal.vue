<!-- src/components/modals/EditEncounterModal.vue (After) -->
<template>
  <Modal
    :isOpen="isOpen"
    title="Edit Encounter"
    size="large"
    @close="closeModal"
  >
    <form @submit.prevent="handleSubmit">
      <!-- Wrap content in a scrollable container -->
      <div class="max-h-[90vh] overflow-y-auto">
        <div class="grid grid-cols-1 gap-4">
          {{ encounterData }}
          <Tabs
            :tabs="tabs"
            :encounterData="encounterData"
            @update:mapLocations="
              (newMapLocations) =>
                (encounterData.mapLocations = newMapLocations)
            "
            @update:encounterDetails="
              (newDetails) => Object.assign(encounterData, newDetails)
            "
          />
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

const encounterData = reactive({ ...props.encounter })
const isSubmitting = ref(false)
const isDeleting = ref(false)

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

const tabs = [
  {
    id: 'xp-details',
    label: 'XP Details',
    component: XPDetailsContent,
    props: {
      encounterData, // your reactive encounterData object
    },
    variant: 'danger',
    loading: false,
  },
  {
    id: 'map-details',
    label: 'Map Details',
    component: MapDetailsContent,
    props: {
      encounterData, // pass the entire encounterData
      terrainOptions: terrainOptionsUnwrapped, // e.g., [ { value: 'Desert', label: 'Desert' }, ... ]
      timeOfDayOptions: timeOfDayOptionsUnwrapped,
      weatherOptions: weatherOptionsUnwrapped,
      objectivesOptions: objectivesOptionsUnwrapped,
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
    },
    variant: 'primary',
    loading: false,
  },
]

function updateEncounterData(newData) {
  Object.assign(encounterData, newData)
}

if (
  !encounterData.mapLocations ||
  Object.keys(encounterData.mapLocations).length === 0
) {
  encounterData.mapLocations = generateMapLocationsWithItems()
}

watch(
  () => props.encounter,
  (newEncounter) => {
    Object.assign(encounterData, newEncounter)
    if (!Array.isArray(encounterData.npcTypes)) {
      encounterData.npcTypes = ['', '', '', '']
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

const closeModal = () => {
  emit('close')
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    emit('update', { ...encounterData })
  } catch (error) {
    console.error('Update failed:', error)
  } finally {
    isSubmitting.value = false
    closeModal()
  }
}

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await emit('delete', encounterData.encounterNumber)
  } catch (error) {
    console.error('Delete failed:', error)
  } finally {
    isDeleting.value = false
    closeModal()
  }
}
</script>
