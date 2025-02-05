<!-- EncounterItem.vue (After) -->
<template>
  <div
    class="px-1 rounded shadow cursor-pointer border-1 bg-gray-50 border-black"
    @click="openEditModal"
  >
    <div class="flex items-center border-y border-black">
      <div class="flex-1 text-left p-1">
        <h3 class="text-lg font-semibold">{{ encounterTitle }}</h3>
        <p class="text-sm text-gray-600">{{ encounterDescription }}</p>
      </div>
      <span class="w-px h-14 bg-black mx-4"></span>

      <div class="flex-1 text-right p-1">
        <span class="text-gray-500">{{ formattedDate }}</span>
      </div>
    </div>

    <!-- Edit Encounter Modal -->
    <EditEncounterModal
      v-if="isEditModalOpen"
      :isOpen="isEditModalOpen"
      :encounter="encounter"
      @close="isEditModalOpen = false"
      @update="handleUpdateEncounter"
      @delete="handleDeleteEncounter(encounter.id)"
      @complete="handleEncounterComplete"
      @fail="handleEncounterFail"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import EditEncounterModal from '@/components/Organisms/EditEncounterModal/EditEncounterModal.vue'
import { useEncounterStore } from '@/store/encounterStore'

const props = defineProps({
  encounter: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update-encounter', 'delete-encounter'])

// Import the encounter store so we can call complete/fail actions.
const encounterStore = useEncounterStore()

const isEditModalOpen = ref(false)

const openEditModal = () => {
  isEditModalOpen.value = true
}

const handleUpdateEncounter = (updatedEncounter) => {
  emit('update-encounter', updatedEncounter)
  isEditModalOpen.value = false
}

const handleDeleteEncounter = (encounterId) => {
  emit('delete-encounter', encounterId)
  isEditModalOpen.value = false
}

const encounterTitle = computed(() => {
  return `Encounter: #${props.encounter.encounterNumber || 'N/A'}`
})

const encounterDescription = computed(() => {
  return `Encounter Adj. XP: ${
    props.encounter.encounterAdjustedExperience || 'No data'
  }, Encounter XP: ${props.encounter.encounterExperience || 'No data'}
  Players: ${props.encounter.numberOfPlayers || 'N/A'}`
})

const formattedDate = computed(() => {
  const date = new Date(props.encounter.date)
  return date.toLocaleDateString()
})

function handleEncounterComplete(encounterId) {
  // Call the completeEncounter action in the store with the unique id.
  encounterStore.completeEncounter(encounterId)
}

function handleEncounterFail(encounterId) {
  // Call the failEncounter action in the store with the unique id.
  encounterStore.failEncounter(encounterId)
}
</script>
