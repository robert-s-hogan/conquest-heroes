// src/store/campaignStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  fetchCampaigns,
  addCampaign,
  deleteCampaign,
  updateCampaignInFirebase,
  fetchCampaignById,
} from '@/services/Campaign/campaignService'
import { calculateXpFields } from '@/utils/xpTables'
import { calculateDerivedFields } from '@/utils/derivedFields'

export const useCampaignStore = defineStore('campaign', () => {
  // State
  const campaigns = ref([])
  const currentCampaign = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Actions

  // Load all campaigns
  const loadCampaigns = async () => {
    loading.value = true
    error.value = null
    try {
      const rawCampaigns = await fetchCampaigns()
      campaigns.value = rawCampaigns.map((c) => {
        const xpInfo = calculateXpFields(Number(c.groupExperience || 0))
        const derivedFields = calculateDerivedFields({
          ...c,
          ...xpInfo,
        })
        return { ...c, ...xpInfo, ...derivedFields }
      })
      currentCampaign.value = campaigns.value[0] || null
    } catch (err) {
      console.error('Error loading campaigns:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Add a new campaign
  const addNewCampaign = async (campaignName, startXp) => {
    loading.value = true
    error.value = null
    try {
      const { groupLevel, xpThresholds, adventuringDayXpLimit } =
        calculateXpFields(Number(startXp))

      const newCampaign = {
        campaignName: String(campaignName),
        startDate: new Date().toISOString(),
        deathPenaltyMultiplier: 0,
        adventuringDayXpLimit,
        cumulativeGoldEarned: 0, // Initial gold
        groupExperience: Number(startXp),
        levelOfPlayerCharacters: groupLevel,
      }

      const derivedFields = calculateDerivedFields(newCampaign)
      const campaignData = { ...newCampaign, ...derivedFields }

      const addedCampaign = await addCampaign(campaignData)
      campaigns.value.push(addedCampaign)
      currentCampaign.value = addedCampaign // Optionally set as current
      console.log('Campaign added with fields:', addedCampaign)
    } catch (err) {
      console.error('Error adding campaign:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Edit an existing campaign
  const editExistingCampaign = async (updatedCampaign) => {
    loading.value = true
    error.value = null
    try {
      const derivedFields = calculateDerivedFields(updatedCampaign)
      const updatedData = { ...updatedCampaign, ...derivedFields }
      await updateCampaignInFirebase(updatedCampaign.id, updatedData)

      const index = campaigns.value.findIndex(
        (c) => c.id === updatedCampaign.id
      )
      if (index !== -1) {
        campaigns.value[index] = { ...campaigns.value[index], ...updatedData }
        if (currentCampaign.value?.id === updatedCampaign.id) {
          currentCampaign.value = campaigns.value[index]
        }
      }
      console.log('Campaign updated:', updatedCampaign.id)
    } catch (err) {
      console.error('Error editing campaign:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Delete a campaign
  const deleteExistingCampaign = async (campaignId) => {
    loading.value = true
    error.value = null
    try {
      await deleteCampaign(campaignId)
      campaigns.value = campaigns.value.filter((c) => c.id !== campaignId)
      if (currentCampaign.value?.id === campaignId) {
        currentCampaign.value = campaigns.value[0] || null
      }
      console.log('Campaign deleted:', campaignId)
    } catch (err) {
      console.error('Error deleting campaign:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Update specific fields of a campaign (used by Encounter Store)
  const updateCampaignField = async (campaignId, updatedFields) => {
    try {
      await updateCampaignInFirebase(campaignId, updatedFields)
      const index = campaigns.value.findIndex((c) => c.id === campaignId)
      if (index !== -1) {
        campaigns.value[index] = { ...campaigns.value[index], ...updatedFields }
        if (currentCampaign.value?.id === campaignId) {
          currentCampaign.value = campaigns.value[index]
        }
      }
    } catch (err) {
      console.error('Error updating campaign field:', err)
      error.value = err
    }
  }

  return {
    campaigns,
    currentCampaign,
    loading,
    error,
    loadCampaigns,
    addNewCampaign,
    editExistingCampaign,
    deleteExistingCampaign,
    updateCampaignField,
  }
})
