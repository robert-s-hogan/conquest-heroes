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
      adventuringDayXpLimit, // Use consistent naming based on xpTables
      adventuringDayXpStart,
    } = calculateXpFields(startXp);

    // Check for undefined fields and set defaults
    const newCampaign = {
      name,
      description,
      playerStartExperience: startXp,
      groupLevel,
      xpThresholds,
      adventuringDayXpLimit: adventuringDayXpLimit ?? 1700,
      adventuringDayXpStart: adventuringDayXpStart ?? 1700,
      shortRestCounter: 2, // Default to 2 on creation
      longRestNeeded: false,
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

  const calculateDerivedFields = (campaign) => {
    const adventuringDayXpRemaining = campaign.adventuringDayXpStart;
    const firstRestThreshold = 0.68 * campaign.adventuringDayXpLimit;
    const secondRestThreshold = 0.35 * campaign.adventuringDayXpLimit;

    const shortRestNeededFirst =
      adventuringDayXpRemaining <= firstRestThreshold;
    const shortRestNeededSecond =
      adventuringDayXpRemaining <= secondRestThreshold;
    const longRestNeeded =
      adventuringDayXpRemaining < campaign.xpThresholds.easy;

    // Adjust short rest counter if a rest is needed
    let shortRestCounter = campaign.shortRestCounter;
    if (shortRestNeededFirst || shortRestNeededSecond) {
      shortRestCounter = Math.max(0, shortRestCounter - 1);
    }

    return {
      shortRestNeededFirst,
      shortRestNeededSecond,
      longRestNeeded,
      shortRestCounter,
    };
  };

  const fetchCampaigns = async () => {
    try {
      const snapshot = await getDocs(campaignCollectionRef);
      campaigns.value = snapshot.docs.map((doc) => {
        const campaignData = doc.data();
        const { groupLevel, adventuringDayXpLimit, adventuringDayXpStart } =
          calculateXpFields(campaignData.playerStartExperience);

        const derivedFields = calculateDerivedFields({
          ...campaignData,
          adventuringDayXpLimit,
          adventuringDayXpStart,
          shortRestCounter: campaignData.shortRestCounter ?? 2,
        });

        return {
          id: doc.id,
          ...campaignData,
          groupLevel,
          adventuringDayXpLimit,
          adventuringDayXpStart,
          ...derivedFields,
        };
      });
      return campaigns.value;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      campaigns.value = [];
      return [];
    }
  };

  return {
    campaigns,
    addCampaign,
    fetchCampaigns,
  };
}
