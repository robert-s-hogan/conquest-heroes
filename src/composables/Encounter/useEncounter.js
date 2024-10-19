// src/composables/useEncounter.js
import { ref, watch } from "vue";
import {
  fetchEncounters as fetchEncountersFromService,
  addEncounter as addEncounterToService,
  deleteEncounter as deleteEncounterFromService,
  updateEncounter as updateEncounterInService,
} from "@/services/Encounter/encounterService";
import {
  updateCampaignInFirebase,
  fetchCampaignById,
} from "@/services/Campaign/campaignService";
import { calculateRemainingAdventuringDayXP } from "@/utils/encounterUtils";

export function useEncounter(campaignIdRef) {
  const encounters = ref([]);

  const fetchEncounters = async () => {
    if (!campaignIdRef?.value) {
      console.error("campaignId is not defined.");
      encounters.value = [];
      return;
    }
    try {
      const data = await fetchEncountersFromService(campaignIdRef.value);
      encounters.value = data;
    } catch (error) {
      console.error("Error fetching encounters:", error);
      encounters.value = [];
    }
  };

  const addEncounter = async (encounterData) => {
    if (!campaignIdRef?.value) {
      console.error("campaignId is not defined.");
      return;
    }

    try {
      // Determine the next ID for the new encounter
      const nextId =
        encounters.value.length > 0
          ? Math.max(...encounters.value.map((encounter) => encounter.id)) + 1
          : 1;

      // Create new encounter with the sequential ID
      const newEncounter = {
        ...encounterData,
        id: nextId,
      };

      // Check if players exist in the encounter data
      if (!newEncounter.players || newEncounter.players.length === 0) {
        throw new Error("Players field is invalid");
      }

      const encounterWithId = await addEncounterToService(
        campaignIdRef.value,
        newEncounter
      );
      encounters.value.push(encounterWithId);
      console.log("Encounter added:", encounterWithId);

      await updateRemainingAdventuringDayXP();
      await fetchEncounters(); // Refresh encounters after adding a new one
    } catch (error) {
      console.error("Error adding encounter:", error);
    }
  };

  const deleteEncounter = async (encounterId) => {
    if (!campaignIdRef?.value || !encounterId) {
      console.error("Invalid campaignId or encounterId.");
      return;
    }
    try {
      await deleteEncounterFromService(campaignIdRef.value, encounterId);
      encounters.value = encounters.value.filter(
        (encounter) => encounter.id !== encounterId
      );
      console.log("Encounter deleted:", encounterId);
      await updateRemainingAdventuringDayXP();

      await fetchEncounters(); // Refresh encounters after deletion
    } catch (error) {
      console.error("Error deleting encounter:", error);
    }
  };

  const updateEncounter = async (updatedEncounter) => {
    if (!campaignIdRef?.value || !updatedEncounter.id) {
      console.error("Invalid campaignId or encounterId.");
      return;
    }
    try {
      await updateEncounterInService(
        campaignIdRef.value,
        updatedEncounter.id,
        updatedEncounter
      );
      // Update the local encounters array
      const index = encounters.value.findIndex(
        (encounter) => encounter.id === updatedEncounter.id
      );
      if (index !== -1) {
        encounters.value[index] = { ...updatedEncounter };
      }

      console.log("Encounter updated:", updatedEncounter.id);
    } catch (error) {
      console.error("Error updating encounter:", error);
    }
  };

  const updateRemainingAdventuringDayXP = async () => {
    if (campaignIdRef.value) {
      const campaignId = campaignIdRef.value;
      const campaign = await fetchCampaignById(campaignId);
      const remainingXP = await calculateRemainingAdventuringDayXP(
        campaign.adventuringDayXpLimit,
        campaignId
      );

      // Update the campaign with the new remainingAdventuringDayXP
      await updateCampaignInFirebase(campaignId, {
        remainingAdventuringDayXP: remainingXP,
      });
    }
  };

  // Watch the campaignIdRef and fetch encounters when it changes
  watch(
    campaignIdRef,
    async (newCampaignId) => {
      if (newCampaignId) {
        await fetchEncounters();
      } else {
        encounters.value = [];
      }
    },
    { immediate: true }
  );

  return {
    encounters,
    fetchEncounters,
    addEncounter,
    deleteEncounter,
    updateEncounter,
    updateRemainingAdventuringDayXP,
  };
}
