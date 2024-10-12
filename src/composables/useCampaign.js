// src/composables/useCampaign.js
import { ref } from "vue";
import { db } from "@/firebase/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { calculateXpFields } from "@/utils/xpTables";
import { deleteCampaign as deleteCampaignService } from "@/services/Campaign/campaignService";

export function useCampaign() {
  const campaigns = ref([]);
  const campaignCollectionRef = collection(db, "campaigns");

  const addCampaign = async (name, description, startXp) => {
    const {
      groupLevel,
      xpThresholds,
      adventuringDayXpLimit,
      currentAdventuringDayXp,
    } = calculateXpFields(Number(startXp)); // Convert startXp to a number

    // Correctly assign variables and ensure numeric types where needed
    const newCampaign = {
      name: String(name), // Ensure name is a string
      description: String(description), // Ensure description is a string
      playerStartExperience: Number(startXp), // Ensure numeric type for experience
      groupLevel,
      xpThresholds,
      adventuringDayXpLimit,
      currentAdventuringDayXp,
      shortRestCounter: 2, // Default to 2
      longRestNeeded: false,
      createdAt: new Date().toISOString(), // Store date as ISO string
      status: "ongoing",
      timeSpentResting: 0,
      deathPenaltyMultiplier: 0, // Initial value
    };

    try {
      const campaignRef = await addDoc(campaignCollectionRef, newCampaign);
      const campaignWithId = { id: campaignRef.id, ...newCampaign };
      campaigns.value.push(campaignWithId); // Store campaign with ID in local state
      console.log("Campaign added with fields:", campaignWithId);
    } catch (error) {
      console.error("Error adding campaign:", error);
    }
  };

  const calculateDerivedFields = (campaign) => {
    const adventuringDayXpRemaining =
      campaign.adventuringDayXpLimit - campaign.adventuringDayXpUsed;
    const percentAdventuringDayXpRemaining = (
      (adventuringDayXpRemaining / campaign.adventuringDayXpLimit) *
      100
    ).toFixed(0);

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
      percentAdventuringDayXpRemaining,
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

  const deleteCampaign = async (campaignId) => {
    try {
      if (!campaignId) {
        throw new Error("Invalid campaign ID");
      }
      await deleteCampaignService(db, campaignId); // Pass in the ID directly
      campaigns.value = campaigns.value.filter(
        (campaign) => campaign.id !== campaignId
      );
      console.log("Campaign deleted:", campaignId);
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  const addEncounter = async (campaignId, encounterData) => {
    try {
      const campaignIndex = campaigns.value.findIndex(
        (c) => c.id === campaignId
      );
      if (campaignIndex !== -1) {
        const campaign = campaigns.value[campaignIndex];
        const updatedAdventuringDayXp =
          campaign.currentAdventuringDayXp - encounterData.encounterExperience;

        // Ensure it does not go negative
        campaign.currentAdventuringDayXp = Math.max(0, updatedAdventuringDayXp);

        // Update campaign in Firebase and local data structure
        await updateCampaignInFirebase(campaignId, {
          currentAdventuringDayXp: campaign.currentAdventuringDayXp,
        });
        campaigns.value[campaignIndex].currentAdventuringDayXp =
          campaign.currentAdventuringDayXp;

        console.log("Encounter added and campaign updated:", campaign);
      }
    } catch (error) {
      console.error("Error adding encounter:", error);
    }
  };

  return {
    campaigns,
    addCampaign,
    fetchCampaigns,
    deleteCampaign,
    addEncounter,
  };
}
