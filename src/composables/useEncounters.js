// src/composables/useEncounters.js (Final)

import { ref } from 'vue'
import {
  fbFetchEncountersForCampaign,
  fbAddEncounter,
  fbUpdateEncounter,
  fbDeleteEncounter,
  fbFetchEncounterById,
} from '@/services/Encounter/encounterService'
import { calculateEncounterFields } from '@/utils/calculateEncounterFields'
// or: import { generateEncounterData } from '@/utils/encounterDataGenerator'

export function useEncounters() {
  // Reactive State
  const encounters = ref([])
  const currentEncounter = ref(null)
  const loading = ref(false)
  const error = ref(null)

  /**
   * 1) Fetch Encounters for a Campaign
   * Make sure to pass campaignData as the second arg if you need xpThresholds, etc.
   */
  async function fetchEncountersForCampaign(campaignId, campaignData) {
    loading.value = true
    error.value = null
    try {
      const rawData = await fbFetchEncountersForCampaign(campaignId)

      // If no campaignData is provided, we can skip or safely handle
      // e.g. if (!campaignData) { encounters.value = rawData; return; }

      // Map and derive
      encounters.value = rawData.map((enc) => {
        const updated = calculateEncounterFields(enc, campaignData)
        return { ...enc, ...updated }
      })

      // Optionally set first as current
      currentEncounter.value = encounters.value[0] || null
    } catch (err) {
      error.value = err
      console.error('Error fetching encounters:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 2) Add a New Encounter
   */
  async function addNewEncounter(baseEncounterData, campaignData) {
    loading.value = true
    error.value = null
    try {
      // If you need xpThresholds, ensure campaignData is passed in
      const derived = calculateEncounterFields(baseEncounterData, campaignData)
      const newEncounterData = {
        ...baseEncounterData,
        ...derived,
        createdAt: new Date().toISOString(),
      }

      // Firestore add: note signature is (campaignId, encounterData)
      const doc = await fbAddEncounter(campaignData.id, newEncounterData)

      // Local state
      encounters.value.push(doc)
      currentEncounter.value = doc
    } catch (err) {
      error.value = err
      console.error('Error adding new encounter:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 3) Edit/Update an Encounter
   */
  async function updateExistingEncounter(
    encounterId,
    updatedEncounterData,
    campaignData
  ) {
    if (!encounterId) {
      console.error('No encounterId provided to updateExistingEncounter.')
      return
    }
    loading.value = true
    error.value = null
    try {
      const derived = calculateEncounterFields(
        updatedEncounterData,
        campaignData
      )
      const finalData = { ...updatedEncounterData, ...derived }

      await fbUpdateEncounter(campaignData.id, encounterId, finalData)

      // Update local
      const index = encounters.value.findIndex((enc) => enc.id === encounterId)
      if (index !== -1) {
        encounters.value[index] = { ...encounters.value[index], ...finalData }
        if (currentEncounter.value?.id === encounterId) {
          currentEncounter.value = encounters.value[index]
        }
      }
    } catch (err) {
      error.value = err
      console.error('Error updating encounter:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 4) Delete an Encounter
   */
  async function deleteExistingEncounter(encounterId, campaignId) {
    if (!encounterId || !campaignId) {
      console.error('Invalid arguments to deleteExistingEncounter:', {
        encounterId,
        campaignId,
      })
      return
    }

    try {
      await fbDeleteEncounter(campaignId, encounterId)
      encounters.value = encounters.value.filter(
        (enc) => enc.id !== encounterId
      )
      console.log(`Successfully deleted encounter ${encounterId}`)
    } catch (err) {
      console.error('Error deleting encounter:', err)
    }
  }

  /**
   * 5) Fetch Single Encounter by ID
   */
  async function loadEncounterById(encounterId, campaignData) {
    loading.value = true
    error.value = null
    try {
      const doc = await fbFetchEncounterById(campaignData.id, encounterId)
      if (!doc) {
        error.value = new Error('Encounter not found')
        return
      }
      const derived = calculateEncounterFields(doc, campaignData)
      currentEncounter.value = { ...doc, ...derived }
    } catch (err) {
      error.value = err
      console.error('Error fetching encounter by ID:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    encounters,
    currentEncounter,
    loading,
    error,
    // Actions
    fetchEncountersForCampaign,
    addNewEncounter,
    updateExistingEncounter,
    deleteExistingEncounter,
    loadEncounterById,
  }
}
