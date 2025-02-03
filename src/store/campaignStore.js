// store/campaignStore.js (After)

import { defineStore } from 'pinia'
import { useCampaigns } from '@/composables/useCampaigns'

export const useCampaignStore = defineStore('campaign', () => {
  // Pull the reactive refs + actions from the composable
  const {
    campaigns,
    currentCampaign,
    loading,
    error,
    loadCampaigns,
    addNewCampaign,
    editExistingCampaign,
    deleteExistingCampaign,
    loadCampaignById,
  } = useCampaigns()

  // Optionally, you can add additional store-specific logic here if needed

  // Expose state & actions
  return {
    campaigns,
    currentCampaign,
    loading,
    error,

    loadCampaigns,
    addNewCampaign,
    editExistingCampaign,
    deleteExistingCampaign,
    loadCampaignById,
  }
})
