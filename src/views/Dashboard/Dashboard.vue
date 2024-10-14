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

          <!-- Add Campaign Button -->
          <button
            v-if="!currentCampaign"
            @click="isModalOpen = true"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Campaign
          </button>

          <!-- Edit Campaign Button -->
          <button
            v-else
            @click="openEditModal(currentCampaign)"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Campaign
          </button>

          <!-- Delete Campaign Button -->
          <Button
            variant="secondary"
            @click="handleDeleteCampaign"
            :loading="isDeleting"
          >
            Delete Campaign
          </Button>
        </div>

        <!-- Conditionally render DataSection only if there is a campaign -->
        <DataSection
          v-if="playerProgression.length > 0"
          title="Player Progression"
          :items="playerProgression"
        />

        <!-- AddCampaignModal Component -->
        <AddCampaignModal
          :isOpen="isModalOpen"
          @close="isModalOpen = false"
          @submit="handleAddCampaign"
        />

        <!-- EditCampaignModal Component -->
        <EditCampaignModal
          v-if="currentCampaign"
          :isOpen="isEditModalOpen"
          :campaign="currentCampaign"
          @close="isEditModalOpen = false"
          @update="handleEditCampaign"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Heading from "@/atoms/Heading/Heading.vue";
import DataSection from "@/organisms/DataSection/DataSection.vue";
import AddCampaignModal from "@/organisms/AddCampaignModal/AddCampaignModal.vue";
import EditCampaignModal from "@/organisms/EditCampaignModal/EditCampaignModal.vue";
import Button from "@/components/Atoms/Button/Button.vue";
import { useCampaign } from "@/composables/useCampaign";

const {
  fetchCampaigns,
  addCampaign,
  updateCampaignInFirebase,
  deleteCampaign,
} = useCampaign();
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const playerProgression = ref([]);
const currentCampaign = ref(null);
const isDeleting = ref(false);

const handleAddCampaign = async ({ name, startXp }) => {
  await addCampaign(name, startXp);
  isModalOpen.value = false;
  await loadCampaigns();
};

const handleEditCampaign = async (updatedCampaign) => {
  await updateCampaignInFirebase(updatedCampaign.id, {
    campaignName: updatedCampaign.campaignName,
    deathPenaltyMultiplier: updatedCampaign.deathPenaltyMultiplier,
    groupExperience: updatedCampaign.groupExperience,
    cumulativeGoldEarned: updatedCampaign.cumulativeGoldEarned,
  });
  isEditModalOpen.value = false;
  await loadCampaigns();
};

const openEditModal = (campaign) => {
  currentCampaign.value = campaign;
  isEditModalOpen.value = true;
};

const handleDeleteCampaign = async () => {
  if (currentCampaign.value) {
    const campaignId = currentCampaign.value.id;
    isDeleting.value = true;
    await deleteCampaign(campaignId);
    isDeleting.value = false;
    playerProgression.value = [];
    currentCampaign.value = null; // Clear current campaign after deletion
  }
};

const loadCampaigns = async () => {
  const campaigns = await fetchCampaigns();
  if (campaigns.length > 0) {
    const campaign = campaigns[0];
    currentCampaign.value = campaign;

    playerProgression.value = [
      { label: "Group Level", value: campaign.groupLevel, id: campaign.id },
      {
        label: "Adventuring Day XP Limit",
        value: campaign.adventuringDayXpLimit,
      },
      {
        label: "Death Penalty Multiplier",
        value: `${campaign.deathPenaltyMultiplier}%`,
      },
      { label: "Cumulative Gold Earned", value: campaign.cumulativeGoldEarned },
      { label: "Current Group Experience", value: campaign.groupExperience },
    ];
  } else {
    currentCampaign.value = null;
  }
};

onMounted(loadCampaigns);
</script>
