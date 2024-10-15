// src/composables/useEncounter.js
import { ref, watch } from "vue";
import {
  fetchEncounters as fetchEncountersFromService,
  addEncounter as addEncounterToService,
  deleteEncounter as deleteEncounterFromService,
  updateEncounter as updateEncounterInService,
} from "@/services/Encounter/encounterService";

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
      console.log("Fetched encounters:", encounters.value);
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
      const newEncounter = {
        ...encounterData,
        date: new Date().toISOString(),
      };

      const encounterWithId = await addEncounterToService(
        campaignIdRef.value,
        newEncounter
      );
      encounters.value.push(encounterWithId);
      console.log("Encounter added:", encounterWithId);

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

  // Watch the campaignIdRef and only fetch encounters if there's a valid ID
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
  };
}
