// src/store/encounterStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  fetchEncounters,
  addEncounter,
  updateEncounter,
  deleteEncounter,
} from '@/services/Encounter/encounterService'
import {
  fetchCampaignById,
  updateCampaignInFirebase,
} from '@/services/Campaign/campaignService'
import { calculateRemainingAdventuringDayXP } from '@/utils/encounterUtils'
import { useCampaignStore } from './campaignStore'

export const useEncounterStore = defineStore('encounter', () => {
  // State
  const encounters = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Access the Campaign Store
  const campaignStore = useCampaignStore()

  // Actions

  // Fetch Encounters for the current campaign
  const fetchEncountersForCampaign = async (campaignId) => {
    if (!campaignId) {
      console.error('No campaignId provided to fetchEncounters.')
      encounters.value = []
      return
    }
    loading.value = true
    error.value = null
    try {
      const data = await fetchEncounters(campaignId)
      encounters.value = data
    } catch (err) {
      console.error('Error fetching encounters:', err)
      error.value = err
      encounters.value = []
    } finally {
      loading.value = false
    }
  }

  // Add a new Encounter
  const addNewEncounter = async (encounterData) => {
    console.log('🧩 store.addNewEncounter =>', encounterData)

    const campaignId = campaignStore.currentCampaign?.id
    console.log(`campaignId: ${campaignId}`)
    if (!campaignId) {
      console.error('No current campaign selected.')
      return
    }
    loading.value = true
    error.value = null
    try {
      const addedEncounter = await addEncounter(campaignId, encounterData)
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

  // Update an Encounter
  const updateExistingEncounter = async (encounterId, updatedData) => {
    const campaignId = campaignStore.currentCampaign?.id
    if (!campaignId || !encounterId) {
      console.error('Invalid campaignId or encounterId.')
      return
    }
    loading.value = true
    error.value = null
    try {
      await updateEncounter(campaignId, encounterId, updatedData)
      const index = encounters.value.findIndex((e) => e.id === encounterId)
      if (index !== -1) {
        encounters.value[index] = { ...encounters.value[index], ...updatedData }
      }
      console.log('Encounter updated:', encounterId)
    } catch (err) {
      console.error('Error updating encounter:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Delete an Encounter
  const deleteExistingEncounter = async (encounterId) => {
    const campaignId = campaignStore.currentCampaign?.id
    if (!campaignId || !encounterId) {
      console.error('Invalid campaignId or encounterId.')
      return
    }
    loading.value = true
    error.value = null
    try {
      await deleteEncounter(campaignId, encounterId)
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

  // Update Remaining Adventuring Day XP
  const updateRemainingAdventuringDayXP = async () => {
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

  return {
    encounters,
    loading,
    error,
    fetchEncountersForCampaign,
    addNewEncounter,
    updateExistingEncounter,
    deleteExistingEncounter,
    updateRemainingAdventuringDayXP,
  }
})
