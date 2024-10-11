// src/composables/useCampaign.js
import { ref } from "vue";
import { db } from "@/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { fetchCampaigns as fetchCampaignsService } from "@/services/Campaign/campaignService"; // Import fetchCampaigns from the service

export function useCampaign() {
  const campaigns = ref([]);
  const campaignCollectionRef = collection(db, "campaigns");

  const addCampaign = async (name, description, playerExperienceStart) => {
    try {
      const newCampaign = {
        name,
        description,
        playerExperienceStart,
        levelOfPlayerCharactersStart: 1,
        playerExperienceFinish: 0,
        levelOfPlayerCharactersFinish: 1,
        xpThresholdEasy: 100,
        xpThresholdMedium: 200,
        xpThresholdHard: 300,
        xpThresholdDeadly: 400,
        adventuringDayXpLimit: 1000,
        adventuringDayXpUsed: 0,
        percentAdventuringDayXpRemaining: 100,
        shortRestNeededFirst: false,
        shortRestNeededSecond: false,
        shortRestCounterStart: 0,
        shortRestCounterFinish: 0,
        longRestNeeded: false,
        timeSpentResting: 0,
        status: "ongoing",
        createdAt: new Date(),
      };
      const campaignRef = await addDoc(campaignCollectionRef, newCampaign);
      campaigns.value.push({ id: campaignRef.id, ...newCampaign });
    } catch (error) {
      console.error("Error adding campaign:", error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      campaigns.value = await fetchCampaignsService(db);
      return campaigns.value;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  };

  return {
    campaigns,
    addCampaign,
    fetchCampaigns,
  };
}
