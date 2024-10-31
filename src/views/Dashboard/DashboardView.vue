<!-- Dashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <div class="flex flex-1">
      <aside class="w-64 bg-white p-4 shadow-md">
        <nav>
          <!-- Navigation items (if needed) -->
        </nav>
      </aside>
      <main class="flex-1 p-4">
        <div class="flex items-center justify-between mb-6">
          <Heading title="Conquest of Heroes v2.5 Framework" level="1" />
        </div>

        <!-- Campaign Section -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <Heading title="Campaign Management" level="2" />
            <div class="flex space-x-4">
              <button
                v-if="!currentCampaign"
                @click="isModalOpen = true"
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Campaign
              </button>

              <button
                v-else
                @click="isEditModalOpen = true"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Campaign
              </button>

              <Button
                v-if="currentCampaign"
                variant="secondary"
                @click="isDeleteConfirmModalOpen = true"
                :loading="isDeleting"
              >
                Delete Campaign
              </Button>
            </div>
          </div>

          <DataSection
            v-if="playerProgression.length > 0"
            title="Player Progression"
            :items="playerProgression"
          />
        </div>

        <!-- Encounter Section -->
        <div v-if="currentCampaign" class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <Heading title="Encounters" level="2" />
            <div>
              <button
                @click="handleAddEncounter"
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Generate Encounter
              </button>
            </div>
          </div>

          <!-- List of Encounters -->
          <div
            v-if="encounters && encounters.length > 0"
            class="border border-2 border-black rounded"
          >
            <EncounterItem
              v-for="encounter in encounters"
              :key="encounter.id"
              :encounter="encounter"
              @update-encounter="handleUpdateEncounter"
              @delete-encounter="handleDeleteEncounter"
            />
          </div>
          <div v-else class="text-gray-500">No encounters available.</div>
        </div>

        <!-- Modals -->

        <!-- Confirmation Modal -->
        <ConfirmationModal
          v-if="currentCampaign"
          :isOpen="isDeleteConfirmModalOpen"
          title="Delete Campaign"
          message="Are you sure you want to delete this campaign? This action cannot be undone."
          @confirm="confirmDeleteCampaign"
          @cancel="isDeleteConfirmModalOpen = false"
        />

        <AddCampaignModal
          :isOpen="isModalOpen"
          @close="isModalOpen = false"
          @submit="handleAddCampaign"
        />

        <EditCampaignModal
          v-if="currentCampaign"
          :isOpen="isEditModalOpen"
          :campaign="currentCampaign"
          @close="isEditModalOpen = false"
          @update="handleEditCampaign"
        />

        <!-- Add Encounter Modal (if needed) -->
        <AddEncounterModal
          v-if="isEncounterModalOpen"
          :campaignId="currentCampaign.id"
          @close="isEncounterModalOpen = false"
          @add="handleAddEncounter"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, provide } from 'vue'

import Button from '@/components/Atoms/BaseButton/BaseButton.vue'
import Heading from '@/components/Atoms/BaseHeading/BaseHeading.vue'
import DataSection from '@/components/Organisms/DataSection/DataSection.vue'
import EncounterItem from '@/components/Molecules/EncounterItem/EncounterItem.vue'
import AddCampaignModal from '@/components/Organisms/AddCampaignModal/AddCampaignModal.vue'
import AddEncounterModal from '@/components/Organisms/AddEncounterModal/AddEncounterModal.vue'
import ConfirmationModal from '@/components/Molecules/ConfirmationModal/ConfirmationModal.vue'
import EditCampaignModal from '@/components/Organisms/EditCampaignModal/EditCampaignModal.vue'

import { useCampaignData } from '@/composables/Campaign/useCampaignData'
import { useEncounter } from '@/composables/Encounter/useEncounter'
import { generateEncounterData } from '@/utils/encounterDataGenerator'

// Campaign composable setup
const {
  isModalOpen,
  isEditModalOpen,
  playerProgression,
  currentCampaign,
  isDeleting,
  loadCampaigns,
  handleAddCampaign,
  handleEditCampaign,
  handleDeleteCampaign,
} = useCampaignData()

// Provide currentCampaign to child components if needed
provide('currentCampaign', currentCampaign)

// Define campaignIdRef as a computed property
const campaignIdRef = computed(() => currentCampaign.value?.id)

// Use useEncounter with campaignIdRef
const {
  encounters,
  fetchEncounters,
  addEncounter,
  deleteEncounter,
  updateEncounter,
} = useEncounter(campaignIdRef)

// Watch for changes in campaignIdRef to fetch encounters
watch(
  campaignIdRef,
  (newCampaignId) => {
    if (newCampaignId) {
      fetchEncounters()
    } else {
      // Reset encounters if no campaign is selected
      encounters.value = []
    }
  },
  { immediate: true }
)

// Handle adding a new encounter
const handleAddEncounter = async () => {
  if (currentCampaign.value?.id) {
    console.log('Encounters before generating:', encounters.value)

    const encounterData = generateEncounterData(
      currentCampaign.value,
      encounters.value
    )

    // Debugging encounter data
    console.log('Generated encounter data:', encounterData)

    // Validate encounter data
    if (!encounterData.players || encounterData.players.length === 0) {
      console.error(
        'Encounter data has missing or undefined players',
        encounterData
      )
      return // Prevent the call if data is invalid
    }

    await addEncounter({
      ...encounterData,
      campaignId: currentCampaign.value.id,
    })
  }
}

// Handle updating an encounter
const handleUpdateEncounter = async (updatedEncounter) => {
  if (currentCampaign.value?.id) {
    await updateEncounter(updatedEncounter)
    // No need to refetch encounters; they are reactive
  }
}

// Handle deleting an encounter
const handleDeleteEncounter = async (encounterId) => {
  if (currentCampaign.value?.id) {
    await deleteEncounter(encounterId)
  }
}

// Delete Confirmation Modal
const isDeleteConfirmModalOpen = ref(false)

const confirmDeleteCampaign = async () => {
  isDeleteConfirmModalOpen.value = false
  await handleDeleteCampaign()
}

// Encounter Modal State (if using AddEncounterModal)
const isEncounterModalOpen = ref(false)

// Load campaigns on mount
onMounted(loadCampaigns)
</script>
