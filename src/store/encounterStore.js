import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  fbfetchEncounters,
  fbAddEncounter,
  fbUpdateEncounter,
  fbDeleteEncounter,
} from '@/services/Encounter/encounterService'

import {
  fetchCampaignById,
  updateCampaignInFirebase,
} from '@/services/Campaign/campaignService'

import { calculateRemainingAdventuringDayXP } from '@/utils/encounterUtils'
import { calculateEncounterFields } from '@/utils/calculateEncounterFields'
import { useCampaignStore } from './campaignStore'

export const useEncounterStore = defineStore('encounter', () => {
  // State
  const encounters = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Access the Campaign Store
  const campaignStore = useCampaignStore()

  // Fetch Encounters for the given campaign
  async function fetchEncountersForCampaign(campaignId) {
    if (!campaignId) {
      console.error('No campaignId provided to fetchEncountersForCampaign.')
      encounters.value = []
      return
    }
    loading.value = true
    error.value = null
    try {
      const data = await fbfetchEncounters(campaignId)
      const campaign = campaignStore.currentCampaign
      encounters.value = data.map((enc) => {
        const derived = calculateEncounterFields(enc, campaign)
        return { ...enc, ...derived }
      })
    } catch (err) {
      console.error('Error fetching encounters:', err)
      error.value = err
      encounters.value = []
    } finally {
      loading.value = false
    }
  }

  // Add a new encounter to the current campaign
  // Add a new encounter without isSuccessful
  async function addNewEncounter(encounterData) {
    const campaignId = campaignStore.currentCampaign?.id
    if (!campaignId) {
      console.error('No current campaign selected in addNewEncounter.')
      return
    }
    loading.value = true
    error.value = null

    try {
      const campaign = campaignStore.currentCampaign
      const derived = calculateEncounterFields(encounterData, campaign)
      const finalData = {
        ...encounterData,
        ...derived,
        createdAt: new Date().toISOString(),
        status: 'in-progress', // Encounter starts as "in-progress"
      }
      const addedEncounter = await fbAddEncounter(campaignId, finalData)
      if (addedEncounter) {
        encounters.value.push(addedEncounter)
        console.log('Encounter added:', addedEncounter)
        await updateRemainingAdventuringDayXP()
      }
    } catch (err) {
      console.error('Error adding encounter:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Mark an encounter as complete (without isSuccessful)
  async function completeEncounter(encounterId) {
    const encounter = encounters.value.find((e) => e.id === encounterId)
    if (!encounter) {
      console.error(`Encounter with ID ${encounterId} not found.`)
      return
    }

    const updatedEncounter = {
      ...encounter,
      status: 'completed',
      completedAt: new Date().toISOString(),
    }
    await updateExistingEncounter(encounterId, updatedEncounter)

    // Calculate earned XP from this encounter.
    const xpEarned = updatedEncounter.encounterExperience || 0
    const campaign = campaignStore.currentCampaign.value
    if (campaign) {
      // Compute the new groupExperience without any recalculations.
      const newGroupExperience = (campaign.groupExperience || 0) + xpEarned
      // Update only the groupExperience field in Firestore.
      await updateCampaignInFirebase(campaign.id, {
        groupExperience: newGroupExperience,
      })
      // Refresh the local campaign data (so your UI gets the new value).
      await campaignStore.loadCampaignById(campaign.id)
    }

    await updateRemainingAdventuringDayXP()
  }

  // Mark an encounter as failed (without isSuccessful)
  async function failEncounter(encounterId) {
    const encounter = encounters.value.find((e) => e.id === encounterId)
    if (!encounter) {
      console.error(`Encounter with ID ${encounterId} not found.`)
      return
    }
    const updatedEncounter = {
      ...encounter,
      status: 'failed',
      completedAt: new Date().toISOString(),
    }
    await updateExistingEncounter(encounterId, updatedEncounter)
    await updateCampaignExperience()
  }

  // Update an existing encounter
  async function updateExistingEncounter(encounterId, updatedData) {
    const campaignId = campaignStore.currentCampaign?.id
    if (!campaignId || !encounterId) {
      console.error(
        'Invalid campaignId or encounterId in updateExistingEncounter.'
      )
      return
    }
    loading.value = true
    error.value = null
    try {
      const campaign = campaignStore.currentCampaign
      const derived = calculateEncounterFields(updatedData, campaign)
      const finalData = { ...updatedData, ...derived }
      await fbUpdateEncounter(campaignId, encounterId, finalData)
      const index = encounters.value.findIndex((e) => e.id === encounterId)
      if (index !== -1) {
        encounters.value[index] = { ...encounters.value[index], ...finalData }
      }
      console.log('Encounter updated:', encounterId)
    } catch (err) {
      console.error('Error updating encounter:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Delete an encounter
  async function deleteExistingEncounter(encounterId) {
    const campaignId = campaignStore.currentCampaign?.id
    if (!campaignId || !encounterId) {
      console.error(
        'Invalid campaignId or encounterId in deleteExistingEncounter.'
      )
      return
    }
    loading.value = true
    error.value = null
    try {
      await fbDeleteEncounter(campaignId, encounterId)
      encounters.value = encounters.value.filter((e) => e.id !== encounterId)
      console.log(`Encounter with ID ${encounterId} deleted successfully.`)
      await updateRemainingAdventuringDayXP()
    } catch (err) {
      console.error('Error deleting encounter:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Recalculate remaining Adventuring Day XP
  async function updateRemainingAdventuringDayXP() {
    const campaignId = campaignStore.currentCampaign?.id
    if (!campaignId) return
    try {
      const campaign = await fetchCampaignById(campaignId)
      const remainingXP = await calculateRemainingAdventuringDayXP(
        campaign.adventuringDayXpLimit,
        campaignId
      )
      await updateCampaignInFirebase(campaignId, {
        remainingAdventuringDayXP: remainingXP,
      })
    } catch (err) {
      console.error('Error updating remaining Adventuring Day XP:', err)
      error.value = err
    }
  }

  // Helper to recalc group experience
  async function updateCampaignExperience() {
    const campaign = campaignStore.currentCampaign
    if (!campaign) return
    const totalXp = encounters.value.reduce((sum, e) => {
      return e.status === 'completed' ? sum + (e.encounterExperience || 0) : sum
    }, 0)
    const updatedCampaign = { ...campaign, groupExperience: totalXp }
    await campaignStore.editExistingCampaign(updatedCampaign)
  }

  return {
    encounters,
    loading,
    error,
    fetchEncountersForCampaign,
    addNewEncounter,
    updateExistingEncounter,
    deleteExistingEncounter,
    updateRemainingAdventuringDayXP,
    completeEncounter,
    failEncounter,
  }
})
