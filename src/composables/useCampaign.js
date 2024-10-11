// src/composables/useCampaign.js
import { ref } from "vue";
import { db } from "@/firebase/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { calculateXpFields } from "@/utils/xpTables";

export function useCampaign() {
  const campaigns = ref([]);
  const campaignCollectionRef = collection(db, "campaigns");

  const addCampaign = async (name, description, startXp) => {
    console.log(`Adding Campaign - Player Experience Start: ${startXp}`);
    const {
      groupLevel,
      xpThresholds,
      adventuringXpLimit,
      adventuringDayXpStart,
    } = calculateXpFields(startXp);

    const newCampaign = {
      name,
      description,
      playerStartExperience: startXp,
      groupLevel,
      xpThresholds,
      adventuringDayXpLimit: adventuringXpLimit,
      adventuringDayXpStart: adventuringDayXpStart,
      createdAt: new Date().toISOString(),
      status: "ongoing",
    };

    try {
      const campaignRef = await addDoc(campaignCollectionRef, newCampaign);
      campaigns.value.push({ id: campaignRef.id, ...newCampaign });
      console.log("Campaign added with fields:", newCampaign);
    } catch (error) {
      console.error("Error adding campaign:", error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const snapshot = await getDocs(campaignCollectionRef);
      campaigns.value = snapshot.docs.map((doc) => {
        const campaignData = doc.data();
        const { groupLevel, adventuringXpLimit, adventuringDayXpStart } =
          calculateXpFields(campaignData.playerStartExperience);

        return {
          id: doc.id,
          ...campaignData,
          groupLevel,
          adventuringXpLimit,
          adventuringDayXpStart,
        };
      });
      return campaigns.value;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      campaigns.value = []; // Reset to an empty array on error
      return [];
    }
  };

  return {
    campaigns,
    addCampaign,
    fetchCampaigns,
  };
}
