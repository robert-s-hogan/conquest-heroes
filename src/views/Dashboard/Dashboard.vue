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
          <button
            v-if="playerProgression.length === 0"
            @click="isModalOpen = true"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Campaign
          </button>
          <Button
            v-else
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
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Heading from "@/atoms/Heading/Heading.vue";
import DataSection from "@/organisms/DataSection/DataSection.vue";
import AddCampaignModal from "@/organisms/AddCampaignModal/AddCampaignModal.vue";
import Button from "@/components/Atoms/Button/Button.vue";
import { useCampaign } from "@/composables/useCampaign";

const { fetchCampaigns, addCampaign, deleteCampaign } = useCampaign();
const isModalOpen = ref(false);
const playerProgression = ref([]);
const isDeleting = ref(false);

const handleAddCampaign = async ({
  name,
  description,
  playerExperienceStart,
}) => {
  await addCampaign(name, description, playerExperienceStart);
  isModalOpen.value = false;
  await loadCampaigns();
};

const handleDeleteCampaign = async () => {
  if (playerProgression.value.length > 0) {
    const campaignId = playerProgression.value[0].id; // Assuming only one campaign
    isDeleting.value = true;
    await deleteCampaign(campaignId);
    isDeleting.value = false;
    playerProgression.value = []; // Clear out local campaign data
  }
};

const loadCampaigns = async () => {
  const campaigns = await fetchCampaigns();
  if (campaigns.length > 0) {
    const campaign = campaigns[0];

    playerProgression.value = [
      { label: "Group Level", value: campaign.groupLevel, id: campaign.id },
      {
        label: "Player Start Experience",
        value: campaign.playerStartExperience,
      },
      { label: "XP Threshold Easy", value: campaign.xpThresholds.easy },
      { label: "XP Threshold Medium", value: campaign.xpThresholds.medium },
      { label: "XP Threshold Hard", value: campaign.xpThresholds.hard },
      { label: "XP Threshold Deadly", value: campaign.xpThresholds.deadly },
      {
        label: "Adventuring Day XP Limit",
        value: campaign.adventuringDayXpLimit,
      },
      {
        label: "Adventuring Day XP Used",
        value: campaign.adventuringDayXpUsed,
      },
      {
        label: "Percent Adventuring Day XP Remaining",
        value: `${campaign.percentAdventuringDayXpRemaining}%`,
      },
      {
        label: "Short Rest Needed? - First One (68%)",
        value: campaign.shortRestNeededFirst ? "Yes" : "No",
      },
      {
        label: "Short Rest Needed? - Second One (35%)",
        value: campaign.shortRestNeededSecond ? "Yes" : "No",
      },
      { label: "Short Rest Counter", value: campaign.shortRestCounter },
      {
        label: "Long Rest Needed?",
        value: campaign.longRestNeeded ? "Yes" : "No",
      },
      {
        label: "Time Spent Resting",
        value: `${campaign.timeSpentResting} hours`,
      },
      {
        label: "Death Penalty Multiplier - Increase",
        value: `${campaign.deathPenaltyMultiplier}%`,
      },
      { label: "", value: "" },
      {
        label: "Adventuring Day XP Limit Difference",
        value:
          campaign.adventuringDayXpLimit - campaign.currentAdventuringDayXp,
      },
    ];
  }
};

onMounted(loadCampaigns);
</script>
