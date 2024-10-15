// src/composables/useCampaign.js
import { ref } from "vue";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { calculateXpFields } from "@/utils/xpTables";
import { deleteCampaign as deleteCampaignService } from "@/services/Campaign/campaignService";

export function useCampaign() {
  const campaigns = ref([]);
  const campaignCollectionRef = collection(db, "campaigns");

  const addCampaign = async (campaignName, startXp) => {
    const { groupLevel, xpThresholds, adventuringDayXpLimit } =
      calculateXpFields(Number(startXp));

    const newCampaign = {
      campaignName: String(campaignName),
      startDate: new Date().toISOString(),
      deathPenaltyMultiplier: 0,
      adventuringDayXpLimit,
      cumulativeGoldEarned: 0, // Initial gold
      groupExperience: Number(startXp),
      levelOfPlayerCharacters: groupLevel,
    };

    const derivedFields = calculateDerivedFields(newCampaign);
    const campaignData = { ...newCampaign };

    try {
      const campaignRef = await addDoc(campaignCollectionRef, campaignData);
      const campaignWithId = { id: campaignRef.id, ...campaignData };
      campaigns.value.push(campaignWithId);
      console.log("Campaign added with fields:", campaignWithId);
    } catch (error) {
      console.error("Error adding campaign:", error);
    }
  };

  const calculateDerivedFields = (campaign) => {
    const adventuringDayXpRemaining = campaign.currentAdventuringDayXp;
    const percentAdventuringDayXpRemaining = (
      (adventuringDayXpRemaining / campaign.adventuringDayXpLimit) *
      100
    ).toFixed(0);

    const firstRestThreshold = 0.68 * campaign.adventuringDayXpLimit;
    const secondRestThreshold = 0.35 * campaign.adventuringDayXpLimit;

    // Safely check for `xpThresholds` and assign a default in case `easy` is undefined
    const easyThreshold = campaign.xpThresholds?.easy ?? 500;

    const shortRestNeededFirst =
      adventuringDayXpRemaining <= firstRestThreshold;
    const shortRestNeededSecond =
      adventuringDayXpRemaining <= secondRestThreshold;
    const longRestNeeded = adventuringDayXpRemaining < easyThreshold;

    return {
      shortRestNeededFirst,
      shortRestNeededSecond,
      longRestNeeded,
      percentAdventuringDayXpRemaining,
    };
  };

  const fetchCampaigns = async () => {
    try {
      const snapshot = await getDocs(campaignCollectionRef);
      campaigns.value = snapshot.docs.map((doc) => {
        const campaignData = doc.data();
        const { groupLevel, xpThresholds, adventuringDayXpLimit } =
          calculateXpFields(campaignData.groupExperience);

        const derivedFields = calculateDerivedFields({
          ...campaignData,
          xpThresholds,
          adventuringDayXpLimit,
        });

        return {
          id: doc.id,
          ...campaignData,
          groupLevel,
          xpThresholds,
          adventuringDayXpLimit,
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
      await deleteCampaignService(db, campaignId);
      campaigns.value = campaigns.value.filter(
        (campaign) => campaign.id !== campaignId
      );
      console.log("Campaign deleted:", campaignId);
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  const updateCampaignInFirebase = async (campaignId, updatedData) => {
    try {
      const campaignDocRef = doc(db, "campaigns", campaignId);
      await updateDoc(campaignDocRef, updatedData);
    } catch (error) {
      console.error("Error updating campaign in Firebase:", error);
    }
  };

  return {
    campaigns,
    addCampaign,
    fetchCampaigns,
    deleteCampaign,
    updateCampaignInFirebase,
  };
}
