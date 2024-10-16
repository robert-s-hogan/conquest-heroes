// composables/useCampaignData.js
import { ref, watchEffect } from "vue";
import { useCampaign } from "./useCampaign";

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

      playerProgression.value = [
        { label: "Group Level", value: campaign.groupLevel, id: campaign.id },
        {
          label: "Adventuring Day XP Limit",
          value: campaign.adventuringDayXpLimit,
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
