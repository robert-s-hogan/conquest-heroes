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
import { calculateEncounterFields } from '@/utils/calculateEncounterFields'
// or import { generateEncounterData } from '@/utils/encounterDataGenerator'

import { useCampaignStore } from './campaignStore'

export const useEncounterStore = defineStore('encounter', () => {
  // ===========================
  // State
  // ===========================
  const encounters = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Access the Campaign Store
  const campaignStore = useCampaignStore()

  // ===========================
  // Actions
  // ===========================

  /**
   * Fetch Encounters for the given campaign
   */
  async function fetchEncountersForCampaign(campaignId) {
    if (!campaignId) {
      console.error('No campaignId provided to fetchEncountersForCampaign.')
      encounters.value = []
      return
    }
    loading.value = true
    error.value = null
    try {
      const data = await fetchEncounters(campaignId)
      // If you want to transform each encounter:
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

  /**
   * Add a new encounter to the current campaign
   */
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
      // Merge derived fields
      const derived = calculateEncounterFields(encounterData, campaign)
      const finalData = {
        ...encounterData,
        ...derived,
        createdAt: new Date().toISOString(),
      }

      const addedEncounter = await addEncounter(campaignId, finalData)
      if (addedEncounter) {
        encounters.value.push(addedEncounter)
        console.log('Encounter added:', addedEncounter)
        // e.g. recalc Adventuring Day XP
        await updateRemainingAdventuringDayXP()
      }
    } catch (err) {
      console.error('Error adding encounter:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing encounter
   */
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
      // Derive fields again
      const derived = calculateEncounterFields(updatedData, campaign)
      const finalData = { ...updatedData, ...derived }

      await updateEncounter(campaignId, encounterId, finalData)

      // Update local state
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

  /**
   * Delete an encounter
   */
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
      await deleteEncounter(campaignId, encounterId)
      // Remove from local array
      encounters.value = encounters.value.filter((e) => e.id !== encounterId)
      console.log(`Encounter with ID ${encounterId} deleted successfully.`)
      // e.g. recalc Adventuring Day XP
      await updateRemainingAdventuringDayXP()
    } catch (err) {
      console.error('Error deleting encounter:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  /**
   * Recalc remaining Adventuring Day XP
   */
  async function updateRemainingAdventuringDayXP() {
    const campaignId = campaignStore.currentCampaign?.id
    if (!campaignId) return

    try {
      const campaign = await fetchCampaignById(campaignId)
      // The second parameter "usedXp" is questionable if it’s "campaignId" or actual XP usage
      // Possibly you want to sum up XP from all encounters or a different logic:
      const remainingXP = await calculateRemainingAdventuringDayXP(
        campaign.adventuringDayXpLimit,
        // If "usedXp" is your total XP used, you might pass something else here:
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

  // ===========================
  // Return from defineStore
  // ===========================
  return {
    // state
    encounters,
    loading,
    error,
    // actions
    fetchEncountersForCampaign,
    addNewEncounter,
    updateExistingEncounter,
    deleteExistingEncounter,
    updateRemainingAdventuringDayXP,
  }
})
