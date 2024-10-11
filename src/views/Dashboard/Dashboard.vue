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
            @click="openCampaignModal"
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

const openCampaignModal = () => {
  // Logic to open a modal goes here
  console.log("Open add campaign modal");
};
</script>
