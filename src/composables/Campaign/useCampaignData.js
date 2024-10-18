// composables/useCampaignData.js
import { ref, watchEffect } from "vue";
import { useCampaign } from "./useCampaign";
import { calculateXpFields } from "@/utils/xpTables"; // Import the XP calculation utility
import { fetchEncounters } from "@/services/Encounter/encounterService"; // Import encounter fetching

export function useCampaignData() {
  const {
    fetchCampaigns,
    addCampaign,
    updateCampaignInFirebase,
    deleteCampaign,
  } = useCampaign();

  const isModalOpen = ref(false);
  const isEditModalOpen = ref(false);
  const playerProgression = ref([]);
  const currentCampaign = ref(null);
  const isDeleting = ref(false);

  const loadCampaigns = async () => {
    const campaigns = await fetchCampaigns();
    if (campaigns.length > 0) {
      const campaign = campaigns[0];
      currentCampaign.value = campaign;

      // Calculate XP fields based on groupExperience
      const xpFields = calculateXpFields(campaign.groupExperience || 0);

      // Calculate remainingAdventuringDayXP
      const remainingAdventuringDayXP =
        await calculateRemainingAdventuringDayXP(
          campaign.adventuringDayXpLimit,
          campaign.id
        );

      currentCampaign.value = {
        ...campaign,
        ...xpFields,
        remainingAdventuringDayXP,
      };

      playerProgression.value = [
        { label: "Group Level", value: xpFields.groupLevel, id: campaign.id },
        {
          label: "Adventuring Day XP Limit",
          value: xpFields.adventuringDayXpLimit,
        },
        {
          label: "Remaining Adventuring Day XP",
          value: remainingAdventuringDayXP,
        },
        {
          label: "Death Penalty Multiplier",
          value: `${campaign.deathPenaltyMultiplier}%`,
        },
        {
          label: "Cumulative Gold Earned",
          value: campaign.cumulativeGoldEarned,
        },
        { label: "Current Group Experience", value: campaign.groupExperience },
      ];
    } else {
      currentCampaign.value = null;
    }
  };

  const calculateRemainingAdventuringDayXP = async (
    adventuringDayXpLimit,
    campaignId
  ) => {
    const encounters = await fetchEncounters(campaignId);
    const totalEncounterXp = encounters.reduce((total, encounter) => {
      return total + (encounter.encounterExperience || 0);
    }, 0);
    return Math.max(0, adventuringDayXpLimit - totalEncounterXp);
  };

  const handleAddCampaign = async ({ name, startXp }) => {
    await addCampaign(name, startXp);
    isModalOpen.value = false;
    await loadCampaigns();
  };

  const handleEditCampaign = async (updatedCampaign) => {
    await updateCampaignInFirebase(updatedCampaign.id, {
      campaignName: updatedCampaign.campaignName,
      deathPenaltyMultiplier: updatedCampaign.deathPenaltyMultiplier,
      groupExperience: updatedCampaign.groupExperience,
      cumulativeGoldEarned: updatedCampaign.cumulativeGoldEarned,
    });
    isEditModalOpen.value = false;
    await loadCampaigns();
  };

  const handleDeleteCampaign = async () => {
    if (currentCampaign.value) {
      const campaignId = currentCampaign.value.id;
      isDeleting.value = true;
      await deleteCampaign(campaignId);
      isDeleting.value = false;
      playerProgression.value = [];
      currentCampaign.value = null;
    }
  };

  return {
    isModalOpen,
    isEditModalOpen,
    playerProgression,
    currentCampaign,
    isDeleting,
    loadCampaigns,
    handleAddCampaign,
    handleEditCampaign,
    handleDeleteCampaign,
  };
}
