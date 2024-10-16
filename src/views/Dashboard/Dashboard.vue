<!-- Dashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <div class="flex flex-1">
      <aside class="w-64 bg-white p-4 shadow-md">
        <nav>
          <!-- <ul>
            <li class="mb-4">
              <a href="#" class="text-blue-500 hover:underline">Campaigns</a>
            </li>
            <li class="mb-4">
              <a href="#" class="text-blue-500 hover:underline">Encounters</a>
            </li>
          </ul> -->
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
                @click="isEncounterModalOpen = true"
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Encounter
              </button>
            </div>
          </div>

          <!-- List of Encounters -->
          <div
            v-if="encounters && encounters.length > 0"
            class="border border-2 border-black"
          >
            <EncounterItem
              v-for="encounter in encounters"
              :key="encounter.id"
              :encounter="encounter"
              @update-encounter="handleUpdateEncounter"
              @delete-encounter="handleDeleteEncounter"
            />
          </div>
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

        <AddEncounterModal
          :isOpen="isEncounterModalOpen"
          @close="isEncounterModalOpen = false"
          @submit="handleAddEncounter"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";

import Button from "@/components/atoms/Button/Button.vue";
import Heading from "@/components/atoms/Heading/Heading.vue";
import DataSection from "@/components/organisms/DataSection/DataSection.vue";
import EncounterItem from "@/components/molecules/EncounterItem/EncounterItem.vue";
import AddCampaignModal from "@/components/organisms/AddCampaignModal/AddCampaignModal.vue";
import AddEncounterModal from "@/components/organisms/AddEncounterModal/AddEncounterModal.vue";
import ConfirmationModal from "@/components/molecules/ConfirmationModal/ConfirmationModal.vue";
import EditCampaignModal from "@/components/organisms/EditCampaignModal/EditCampaignModal.vue";

import { useCampaignData } from "@/composables/Campaign/useCampaignData";
import { useEncounter } from "@/composables/Encounter/useEncounter";

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
} = useCampaignData();

// Encounter-related references
const isEncounterModalOpen = ref(false);
const isDeletingEncounter = ref(false);

// Define campaignIdRef as a computed property
const campaignIdRef = computed(() => currentCampaign.value?.id);

// Use useEncounter with campaignIdRef
const {
  encounters,
  fetchEncounters,
  addEncounter,
  deleteEncounter,
  updateEncounter,
} = useEncounter(campaignIdRef);

// Fetch encounters when campaignId changes
watch(
  campaignIdRef,
  (newCampaignId) => {
    if (newCampaignId) {
      fetchEncounters();
    } else {
      // Reset encounters
      encounters.value = [];
    }
  },
  { immediate: true }
);

const handleAddEncounter = async (encounterData) => {
  if (currentCampaign.value?.id) {
    await addEncounter({
      ...encounterData,
      campaignId: currentCampaign.value.id,
    });
    // No need to refetch encounters; they are reactive
  }
};

const handleUpdateEncounter = async (updatedEncounter) => {
  if (currentCampaign.value?.id) {
    await updateEncounter(updatedEncounter);
    // No need to refetch encounters; they are reactive
  }
};

const handleDeleteEncounter = async (encounterId) => {
  if (currentCampaign.value?.id) {
    await deleteEncounter(encounterId);
    // No need to refetch encounters; they are reactive
  }
};

const isDeleteConfirmModalOpen = ref(false);

const confirmDeleteCampaign = async () => {
  isDeleteConfirmModalOpen.value = false;
  await handleDeleteCampaign();
};

// Load campaigns on mount
onMounted(loadCampaigns);
</script>
