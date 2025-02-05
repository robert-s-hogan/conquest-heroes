import { ref } from 'vue'
import {
  fbfetchEncounters,
  fbAddEncounter,
  fbUpdateEncounter,
  fbDeleteEncounter,
  fbFetchEncounterById,
} from '@/services/Encounter/encounterService'
import { calculateEncounterFields } from '@/utils/calculateEncounterFields'

export function useEncounters() {
  const encounters = ref([])
  const currentEncounter = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Fetch encounters for a campaign
  async function fetchEncounters(campaignId, campaignData) {
    loading.value = true
    error.value = null
    try {
      const rawData = await fbfetchEncounters(campaignId)
      encounters.value = rawData.map((enc) => {
        const updated = calculateEncounterFields(enc, campaignData)
        return { ...enc, ...updated }
      })
      currentEncounter.value = encounters.value[0] || null
    } catch (err) {
      error.value = err
      console.error('Error fetching encounters:', err)
    } finally {
      loading.value = false
    }
  }

  // Add a new encounter
  async function addEncounter(baseEncounterData, campaignData) {
    loading.value = true
    error.value = null
    try {
      const derived = calculateEncounterFields(baseEncounterData, campaignData)
      const newEncounterData = {
        ...baseEncounterData,
        ...derived,
        createdAt: new Date().toISOString(),
        status: 'in-progress', // Encounter starts as "in-progress"
      }

      const doc = await fbAddEncounter(campaignData.id, newEncounterData)
      encounters.value.push(doc)
      currentEncounter.value = doc
    } catch (err) {
      error.value = err
      console.error('Error adding new encounter:', err)
    } finally {
      loading.value = false
    }
  }

  // Update an existing encounter
  async function updateEncounter(
    encounterId,
    updatedEncounterData,
    campaignData
  ) {
    if (!encounterId) {
      console.error('No encounterId provided to updateEncounter.')
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

  // Delete an encounter
  async function deleteEncounter(encounterId, campaignId) {
    if (!encounterId || !campaignId) {
      console.error('Invalid arguments to deleteEncounter:', {
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

  // Load a single encounter by ID
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
    encounters,
    currentEncounter,
    loading,
    error,
    fetchEncounters,
    addEncounter,
    updateEncounter,
    deleteEncounter,
    loadEncounterById,
  }
}
