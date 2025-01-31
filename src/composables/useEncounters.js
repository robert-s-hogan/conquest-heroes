// src/composables/useEncounters.js
import { storeToRefs } from 'pinia'
import { useEncounterStore } from '@/store/encounterStore'

export function useEncounters() {
  // Access the encounter store
  const encounterStore = useEncounterStore()

  // Destructure reactive state
  const { encounters, loading, error } = storeToRefs(encounterStore)

  // Destructure actions
  const {
    fetchEncountersForCampaign,
    addNewEncounter,
    updateExistingEncounter,
    deleteExistingEncounter,
    updateRemainingAdventuringDayXP,
  } = encounterStore

  // Return whichever properties you want to expose
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
}
