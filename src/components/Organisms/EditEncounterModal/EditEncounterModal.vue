<!-- src/components/modals/EditEncounterModal.vue (After) -->
<template>
  <Modal
    :isOpen="isOpen"
    title="Edit Encounter"
    size="large"
    @close="closeModal"
  >
    <!-- Status Indicator -->
    <div v-if="encounter.status" class="mb-4">
      <span :class="statusClass">{{ statusText }}</span>
      <span v-if="encounter.status !== 'in-progress'" class="ml-2">
        ({{ outcomeIndicator }})
      </span>
    </div>

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

      <!-- Action Buttons -->
      <div class="flex justify-between items-center gap-4 mt-6">
        <Button
          type="button"
          variant="danger"
          @click="handleDelete"
          :loading="isDeleting"
        >
          Delete Encounter
        </Button>

        <!-- Only allow status change if the encounter is in progress -->
        <div>
          <select
            id="status"
            v-model="encounterData.status"
            class="w-full p-2 border border-gray-300 rounded"
          >
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <Button type="submit" variant="primary" :loading="isSubmitting">
          Save Changes
        </Button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { computed, ref, watch, reactive } from 'vue'
import Modal from '@/components/Atoms/BaseModal/BaseModal.vue'
import Button from '@/components/Atoms/BaseButton/BaseButton.vue'
import CaravanContent from '@/components/Atoms/CaravanContent/CaravanContent.vue'
import MapDetailsContent from '@/components/Atoms/MapDetailsContent/MapDetailsContent.vue'
import XPDetailsContent from '@/components/Atoms/XPDetailsContent/XPDetailsContent.vue'
import AwardedContent from '@/components/Atoms/AwardedContent/AwardedContent.vue'
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
  isOpen: { type: Boolean, required: true },
  encounter: { type: Object, required: true },
})

// Include 'complete' and 'fail' events
const emit = defineEmits(['close', 'update', 'delete', 'complete', 'fail'])

const statusText = computed(() => {
  if (props.encounter.status === 'completed')
    return 'Encounter Completed Successfully'
  if (props.encounter.status === 'failed') return 'Encounter Failed'
  return 'Encounter In Progress'
})

const statusClass = computed(() => {
  if (props.encounter.status === 'completed') return 'text-green-600 font-bold'
  if (props.encounter.status === 'failed') return 'text-red-600 font-bold'
  return 'text-gray-600'
})

// New computed property to explicitly show the outcome:
const outcomeIndicator = computed(() => {
  if (props.encounter.status === 'completed') return 'Success'
  if (props.encounter.status === 'failed') return 'Failure'
  return 'Pending'
})

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

const tabs = [
  {
    id: 'xp-details',
    label: 'XP Details',
    component: XPDetailsContent,
    props: { encounterData },
    variant: 'danger',
    loading: false,
  },
  {
    id: 'map-details',
    label: 'Map Details',
    component: MapDetailsContent,
    props: {
      encounterData,
      terrainOptions: terrainOptionsUnwrapped,
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
    props: { encounterData },
    variant: 'primary',
    loading: false,
  },
  {
    id: 'awarded',
    label: 'Awarded',
    component: AwardedContent,
    props: { encounterData },
    variant: 'secondary',
    loading: false,
  },
]

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
    // Pass the unique id from Firestore
    await emit('delete', encounterData.id)
  } catch (error) {
    console.error('Delete failed:', error)
  } finally {
    isDeleting.value = false
    closeModal()
  }
}

function completeEncounter() {
  isSubmitting.value = true
  try {
    // Emit a 'complete' event with the encounter's id.
    emit('complete', encounterData.id)
  } catch (error) {
    console.error('Complete encounter failed:', error)
  } finally {
    isSubmitting.value = false
    closeModal()
  }
}

function failEncounter() {
  isSubmitting.value = true
  try {
    // Emit a 'fail' event with the encounter's id.
    emit('fail', encounterData.id)
  } catch (error) {
    console.error('Fail encounter failed:', error)
  } finally {
    isSubmitting.value = false
    closeModal()
  }
}
</script>
