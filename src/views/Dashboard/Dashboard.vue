<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <div class="flex flex-1">
      <aside class="w-64 bg-white p-4 shadow-md">
        <nav>
          <ul>
            <li class="mb-4">
              <a href="#" class="text-blue-500 hover:underline">Campaigns</a>
            </li>
            <li class="mb-4">
              <a href="#" class="text-blue-500 hover:underline">Encounters</a>
            </li>
          </ul>
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
                @click="openEditModal(currentCampaign)"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Campaign
              </button>

              <Button
                v-if="currentCampaign"
                variant="secondary"
                @click="handleDeleteCampaign"
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
            <Heading title="Encounter Management" level="2" />
            <div>
              <button
                @click="isEncounterModalOpen = true"
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Encounter
              </button>

              <Button
                v-if="encounters.length > 0"
                variant="secondary"
                @click="handleDeleteEncounter"
                :loading="isDeletingEncounter"
              >
                Delete Encounter
              </Button>
            </div>
          </div>

          <DataSection
            v-if="formattedEncounters && formattedEncounters.length > 0"
            title="Encounter Details"
            :items="formattedEncounters"
          />
        </div>

        <!-- Modals -->
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
import { ref, onMounted, computed, watchEffect } from "vue";
import Heading from "@/atoms/Heading/Heading.vue";
import DataSection from "@/organisms/DataSection/DataSection.vue";
import AddCampaignModal from "@/organisms/AddCampaignModal/AddCampaignModal.vue";
import AddEncounterModal from "@/organisms/AddEncounterModal/AddEncounterModal.vue";
import EditCampaignModal from "@/organisms/EditCampaignModal/EditCampaignModal.vue";
import Button from "@/components/Atoms/Button/Button.vue";
import { useCampaignData } from "@/composables/Campaign/useCampaignData";
import { useEncounter } from "@/composables/Encounter/useEncounter";

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
} = useCampaignData(); // Use your refactored campaign composable

const isEncounterModalOpen = ref(false);
const isDeletingEncounter = ref(false);
const encounters = ref([]);

const {
  encounters: encounterList,
  fetchEncounters,
  addEncounter,
  deleteEncounter,
} = useEncounter(currentCampaign.value?.id);

// Watch for changes in currentCampaign to load encounters dynamically
watchEffect(() => {
  if (currentCampaign.value?.id) {
    fetchEncounters();
  }
});

const openEditModal = (campaign) => {
  currentCampaign.value = campaign;
  isEditModalOpen.value = true;
};

const loadEncounters = async () => {
  await fetchEncounters();
};

const handleAddEncounter = async (encounterData) => {
  if (currentCampaign.value) {
    await addEncounter({
      ...encounterData,
      campaignId: currentCampaign.value.id,
    });
    isEncounterModalOpen.value = false;
    await fetchEncounters(); // Refresh encounters list after adding
  }
};

const handleDeleteEncounter = async () => {
  if (encounters.value.length > 0) {
    const encounterId = encounters.value[0]?.id; // Replace with actual ID or selection logic
    isDeletingEncounter.value = true;
    await deleteEncounter(encounterId);
    isDeletingEncounter.value = false;
    await loadEncounters(); // Refresh encounters list
  }
};

const formattedEncounters = computed(() => {
  if (!Array.isArray(encounters.value) || encounters.value.length === 0) {
    return [];
  }

  return encounters.value.map((encounter, index) => ({
    label: `Encounter ${index + 1}: ${encounter.encounterDifficulty || "N/A"}`,
    value: `XP: ${encounter.encounterAdjustedExperience || "No data"}, Gold: ${
      encounter.goldEarned || "No data"
    }`,
  }));
});

watchEffect(() => {
  encounters.value = encounterList.value; // keep encounters array updated
});

onMounted(loadCampaigns); // Only need to call this to load campaigns
</script>
