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
        <Heading title="Conquest of Heroes v2.5 Framework" level="1" />

        <DataSection title="Player Progression" :items="playerProgression" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Heading from "@/atoms/Heading/Heading.vue";
import DataSection from "@/organisms/DataSection/DataSection.vue";
import { useCampaign } from "@/composables/useCampaign";

const { fetchCampaigns } = useCampaign();
const playerProgression = ref([]);

onMounted(async () => {
  const campaigns = await fetchCampaigns();
  if (campaigns.length > 0) {
    const campaign = campaigns[0]; // Select the first campaign for display
    playerProgression.value = [
      {
        label: "Level of Player Characters - Start",
        value: campaign.levelOfPlayerCharactersStart,
      },
      {
        label: "Player Experience - Start",
        value: campaign.playerExperienceStart,
      },
      { label: "XP Threshold Easy", value: campaign.xpThresholdEasy },
      { label: "XP Threshold Medium", value: campaign.xpThresholdMedium },
      { label: "XP Threshold Hard", value: campaign.xpThresholdHard },
      { label: "XP Threshold Deadly", value: campaign.xpThresholdDeadly },
    ];
  }
});
</script>
