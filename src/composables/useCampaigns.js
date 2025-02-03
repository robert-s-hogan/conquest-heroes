// composables/useCampaigns.js (After)

import { ref } from 'vue'
import {
  fetchCampaigns as fbFetchCampaigns,
  addCampaign as fbAddCampaign,
  updateCampaign as fbUpdateCampaign,
  deleteCampaign as fbDeleteCampaign,
  fetchCampaignById as fbFetchCampaignById,
} from '@/services/Campaign/campaignService'

// Optional if you need derived XP or other calculations:
import { calculateXpFields } from '@/utils/xpTables'
import { calculateDerivedFields } from '@/utils/derivedFields'

// This composable focuses on CRUD & derived transformations:
export function useCampaigns() {
  const campaigns = ref([])
  const currentCampaign = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // ===========================
  // 1) Fetch All Campaigns
  // ===========================
  async function loadCampaigns() {
    loading.value = true
    error.value = null
    try {
      const rawData = await fbFetchCampaigns()
      campaigns.value = rawData.map((c) => {
        const xpInfo = calculateXpFields(c.groupExperience || 0)
        const derived = calculateDerivedFields({ ...c, ...xpInfo })
        return { ...c, ...xpInfo, ...derived }
      })
      // Optionally set first campaign as current
      currentCampaign.value = campaigns.value[0] || null
    } catch (err) {
      error.value = err
      console.error('Error loading campaigns:', err)
    } finally {
      loading.value = false
    }
  }

  // ===========================
  // 2) Add a New Campaign
  // ===========================
  async function addNewCampaign(campaignName, description, startXp) {
    loading.value = true
    error.value = null
    try {
      // If you do calculations on XP, keep them:
      const xpInfo = calculateXpFields(Number(startXp))
      const derived = calculateDerivedFields({
        campaignName,
        description, // keep the description
        groupExperience: Number(startXp),
        ...xpInfo,
      })
      // Now include description:
      const newCampaignData = {
        campaignName,
        description,
        groupExperience: Number(startXp),
        ...xpInfo,
        ...derived,
        startDate: new Date().toISOString(),
        deathPenaltyMultiplier: 0,
        cumulativeGoldEarned: 0,
      }

      const doc = await fbAddCampaign(newCampaignData)
      campaigns.value.push(doc)
      currentCampaign.value = doc
    } catch (err) {
      error.value = err
      console.error('Error adding campaign:', err)
    } finally {
      loading.value = false
    }
  }

  // ===========================
  // 3) Edit/Update a Campaign
  // ===========================
  async function editExistingCampaign(updated) {
    loading.value = true
    error.value = null
    try {
      const xpInfo = calculateXpFields(Number(updated.groupExperience || 0))
      const derived = calculateDerivedFields({ ...updated, ...xpInfo })
      const finalData = { ...updated, ...xpInfo, ...derived }

      // Make sure finalData has no nested Firestore references
      // or other objects that Firestore might interpret as queries.

      await fbUpdateCampaign(finalData) // from your campaignService

      // update local store
      const index = campaigns.value.findIndex((c) => c.id === updated.id)
      if (index !== -1) {
        campaigns.value[index] = { ...campaigns.value[index], ...finalData }
        if (currentCampaign.value?.id === updated.id) {
          currentCampaign.value = campaigns.value[index]
        }
      }
    } catch (err) {
      console.error('Error editing campaign:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // ===========================
  // 4) Delete a Campaign
  // ===========================
  async function deleteExistingCampaign(id) {
    loading.value = true
    error.value = null
    try {
      await fbDeleteCampaign(id)
      campaigns.value = campaigns.value.filter((c) => c.id !== id)
      if (currentCampaign.value?.id === id) {
        currentCampaign.value = campaigns.value[0] || null
      }
    } catch (err) {
      error.value = err
      console.error('Error deleting campaign:', err)
    } finally {
      loading.value = false
    }
  }

  // ===========================
  // 5) Fetch by ID
  // ===========================
  async function loadCampaignById(id) {
    loading.value = true
    error.value = null
    try {
      const doc = await fbFetchCampaignById(id)
      const xpInfo = calculateXpFields(doc.groupExperience || 0)
      const derived = calculateDerivedFields({ ...doc, ...xpInfo })
      currentCampaign.value = { ...doc, ...xpInfo, ...derived }
    } catch (err) {
      error.value = err
      console.error('Error fetching campaign by ID:', err)
    } finally {
      loading.value = false
    }
  }

  // Return Reactive State & Methods
  return {
    // state
    campaigns,
    currentCampaign,
    loading,
    error,
    // actions
    loadCampaigns,
    addNewCampaign,
    editExistingCampaign,
    deleteExistingCampaign,
    loadCampaignById,
  }
}
