<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <div class="flex flex-1">
      <aside class="w-64 bg-white p-4 shadow-md">
        <nav>
          <!-- Navigation items (if needed) -->
        </nav>
      </aside>
      <main class="flex-1 p-4">
        <!-- LOADING INDICATOR -->
        <div
          v-if="campaignLoading || encounterLoading"
          class="flex flex-col justify-center items-center h-full space-y-4"
        >
          <div
            class="w-24 h-24 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"
          ></div>

          <p class="text-gray-500">Loading data...</p>
          <!-- or a spinner component -->
        </div>

        <!-- ACTUAL CONTENT (only shows if NOT loading) -->
        <div v-else>
          <div class="flex items-center justify-between mb-6">
            <Heading title="Conquest of Heroes v2.5 Framework" level="1" />
          </div>
          <!-- Campaign Section -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <Heading title="Campaign Management" level="2" />
              <div class="flex space-x-4">
                <Button
                  v-if="!currentCampaign"
                  variant="primary"
                  @click="isModalOpen = true"
                >
                  Add Campaign
                </Button>

                <Button
                  v-else
                  variant="primary"
                  @click="isEditModalOpen = true"
                >
                  Edit Campaign
                </Button>

                <Button
                  v-if="currentCampaign"
                  variant="secondary"
                  @click="isDeleteConfirmModalOpen = true"
                  :loading="campaignLoading"
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
              <Heading title="Encounters" level="2" class="mb-0" />
              <Button variant="primary" @click="isEncounterModalOpen = true">
                Generate Encounter
              </Button>
            </div>
          </div>

          <!-- List of Encounters -->
          <div
            v-if="encounters.length > 0"
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

        <!-- Add Encounter Modal -->
        <AddEncounterModal
          v-if="isEncounterModalOpen"
          :isOpen="isEncounterModalOpen"
          :campaign="currentCampaign"
          @close="isEncounterModalOpen = false"
          @add="handleAddEncounter"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCampaignStore } from '../../store/campaignStore'
import { useEncounters } from '@/composables/useEncounters'

import Button from '@/components/Atoms/BaseButton/BaseButton.vue'
import Heading from '@/components/Atoms/BaseHeading/BaseHeading.vue'
import DataSection from '@/components/Organisms/DataSection/DataSection.vue'
import ConfirmationModal from '@/components/Molecules/ConfirmationModal/ConfirmationModal.vue'

import AddCampaignModal from '@/components/Organisms/AddCampaignModal/AddCampaignModal.vue'
import EditCampaignModal from '@/components/Organisms/EditCampaignModal/EditCampaignModal.vue'

import EncounterItem from '@/components/Molecules/EncounterItem/EncounterItem.vue'
import AddEncounterModal from '@/components/Organisms/AddEncounterModal/AddEncounterModal.vue'

import { generateEncounterData } from '@/utils/encounterDataGenerator'

// Initialize Campaign Store
const campaignStore = useCampaignStore()
const {
  campaigns,
  currentCampaign,
  loading: campaignLoading,
  error: campaignError,
} = storeToRefs(campaignStore)

const {
  loadCampaigns,
  addNewCampaign,
  editExistingCampaign,
  deleteExistingCampaign,
} = campaignStore

// Encounter Composable
const {
  encounters,
  loading: encounterLoading,
  error: encounterError,
  fetchEncounters,
  addEncounter,
  updateEncounter,
  deleteEncounter,
} = useEncounters()

// Compute "playerProgression"
const playerProgression = computed(() => {
  if (!currentCampaign.value) return []
  return [
    { label: 'Group Level', value: currentCampaign.value.groupLevel },
    {
      label: 'Adventuring Day XP Limit',
      value: currentCampaign.value.adventuringDayXpLimit,
    },
    {
      label: 'Death Penalty Multiplier',
      value: `${currentCampaign.value.deathPenaltyMultiplier}%`,
    },
    {
      label: 'Cumulative Gold Earned',
      value: currentCampaign.value.cumulativeGoldEarned,
    },
    {
      label: 'Current Group Experience',
      value: currentCampaign.value.groupExperience,
    },
    // etc...
  ]
})

// Modal States
const isModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteConfirmModalOpen = ref(false)
const isEncounterModalOpen = ref(false)

// Campaign Handlers
const handleAddCampaign = async (campaignData) => {
  await addNewCampaign(
    campaignData.campaignName,
    campaignData.description,
    campaignData.startXp
  )
  isModalOpen.value = false
}
const handleEditCampaign = async (updatedCampaign) => {
  await editExistingCampaign(updatedCampaign)
  isEditModalOpen.value = false
}
const handleDeleteCampaign = async () => {
  if (!currentCampaign.value) return
  await deleteExistingCampaign(currentCampaign.value.id)
  isDeleteConfirmModalOpen.value = false
}
const confirmDeleteCampaign = async () => {
  await handleDeleteCampaign()
}

// Handlers
const handleAddEncounter = async (encounterData) => {
  console.log('👩‍🚀 Parent saw @add event with encounterData:', encounterData)
  // Pass campaignData as second arg
  await addEncounter(encounterData, currentCampaign.value)
  isEncounterModalOpen.value = false
}

const handleUpdateEncounter = async (updatedEncounter) => {
  await updateEncounter(
    updatedEncounter.id,
    updatedEncounter,
    currentCampaign.value
  )
}

const handleDeleteEncounter = async (encounterId) => {
  if (!encounterId || !currentCampaign.value?.id) {
    console.error(
      'Invalid encounterId or campaignId in handleDeleteEncounter:',
      encounterId,
      currentCampaign.value?.id
    )
    return
  }
  await deleteEncounter(encounterId, currentCampaign.value.id)
}

// onMounted and watch
onMounted(async () => {
  await loadCampaigns()
  if (currentCampaign.value?.id) {
    // Pass BOTH the campaignId and the campaign object
    await fetchEncounters(currentCampaign.value.id, currentCampaign.value)
  }
})

watch(
  () => currentCampaign.value?.id,
  async (newCampaignId) => {
    if (newCampaignId) {
      await fetchEncounters(newCampaignId, currentCampaign.value)
    } else {
      encounters.value = []
    }
  }
)
</script>
