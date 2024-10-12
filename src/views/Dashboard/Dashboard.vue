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
            @click="isModalOpen = true"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Campaign
          </button>
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
import { useCampaign } from "@/composables/useCampaign";

const { fetchCampaigns, addCampaign } = useCampaign();
const isModalOpen = ref(false);
const playerProgression = ref([]);

const handleAddCampaign = async ({
  name,
  description,
  playerExperienceStart,
}) => {
  console.log(
    `Adding Campaign - Player Experience Start: ${playerExperienceStart}`
  );
  await addCampaign(name, description, playerExperienceStart);
  isModalOpen.value = false;
  await loadCampaigns();
};

const loadCampaigns = async () => {
  const campaigns = await fetchCampaigns();
  if (campaigns.length > 0) {
    const campaign = campaigns[0];

    const percentAdventuringDayXpRemaining = (
      (campaign.adventuringDayXpStart / campaign.adventuringDayXpLimit) *
      100
    ).toFixed(0);

    playerProgression.value = [
      { label: "Group Level", value: campaign.groupLevel },
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
        label: "Adventuring Day XP Start",
        value: campaign.adventuringDayXpStart,
      },
      {
        label: "Percent Adventuring Day XP Remaining",
        value: `${percentAdventuringDayXpRemaining}%`,
      },
      {
        label: "Short Rest Needed? - First One (68%)",
        value: campaign.shortRestNeededFirst ? "Yes" : "No",
      },
      {
        label: "Short Rest Needed? - Second One (35%)",
        value: campaign.shortRestNeededSecond ? "Yes" : "No",
      },
      {
        label: "Short Rest Counter",
        value: campaign.shortRestCounter,
      },
      {
        label: "Long Rest Needed?",
        value: campaign.longRestNeeded ? "Yes" : "No",
      },
    ];
  }
};

onMounted(loadCampaigns);
</script>
