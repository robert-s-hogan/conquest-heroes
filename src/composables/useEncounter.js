// src/composables/useEncounter.js
import { ref } from "vue";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useCampaign } from "@/composables/useCampaign";

export function useEncounter(campaignId) {
  const encounters = ref([]);
  const encountersCollectionRef = collection(
    db,
    "campaigns",
    campaignId,
    "encounters"
  );

  const addEncounter = async (encounterData) => {
    try {
      const newEncounter = {
        ...encounterData,
        date: new Date().toISOString(),
      };

      const encounterRef = await addDoc(encountersCollectionRef, newEncounter);
      const encounterWithId = { id: encounterRef.id, ...newEncounter };
      encounters.value.push(encounterWithId);
      console.log("Encounter added:", encounterWithId);

      // Update the campaign's cumulative fields
      const { campaigns, updateCampaignInFirebase } = useCampaign();
      const campaignIndex = campaigns.value.findIndex(
        (c) => c.id === campaignId
      );
      if (campaignIndex !== -1) {
        const campaign = campaigns.value[campaignIndex];

        // Update groupExperience and cumulativeGoldEarned
        const updatedGroupExperience =
          campaign.groupExperience +
          newEncounter.groupExperienceEarnedFromEncounter;
        const updatedCumulativeGoldEarned =
          campaign.cumulativeGoldEarned + newEncounter.goldEarnedFromEncounter;

        // Update currentAdventuringDayXp
        const updatedAdventuringDayXp =
          campaign.currentAdventuringDayXp -
          newEncounter.encounterAdjustedExperience;

        // Ensure currentAdventuringDayXp does not go negative
        const currentAdventuringDayXp = Math.max(0, updatedAdventuringDayXp);

        // Prepare updated data
        const updatedCampaignData = {
          groupExperience: updatedGroupExperience,
          cumulativeGoldEarned: updatedCumulativeGoldEarned,
          currentAdventuringDayXp,
        };

        // Update in Firebase
        await updateCampaignInFirebase(campaignId, updatedCampaignData);

        // Update local state
        campaigns.value[campaignIndex] = {
          ...campaign,
          ...updatedCampaignData,
        };
      }
    } catch (error) {
      console.error("Error adding encounter:", error);
    }
  };

  const fetchEncounters = async () => {
    try {
      const snapshot = await getDocs(encountersCollectionRef);
      encounters.value = snapshot.docs.map((doc) => {
        const encounterData = doc.data();
        return {
          id: doc.id,
          ...encounterData,
        };
      });
      return encounters.value;
    } catch (error) {
      console.error("Error fetching encounters:", error);
      encounters.value = [];
      return [];
    }
  };

  const deleteEncounter = async (encounterId) => {
    try {
      const encounterDocRef = doc(
        db,
        "campaigns",
        campaignId,
        "encounters",
        encounterId
      );
      await deleteDoc(encounterDocRef);
      encounters.value = encounters.value.filter(
        (encounter) => encounter.id !== encounterId
      );
      console.log("Encounter deleted:", encounterId);
    } catch (error) {
      console.error("Error deleting encounter:", error);
    }
  };

  return {
    encounters,
    addEncounter,
    fetchEncounters,
    deleteEncounter,
  };
}
