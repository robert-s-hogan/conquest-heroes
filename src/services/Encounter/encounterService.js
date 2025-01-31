// src/services/encounterService.js (After)

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'

/**
 * Fetch all encounters for the given campaign.
 *
 * @param {string} campaignId - ID of the campaign in Firestore.
 * @returns {Promise<Array>} - Returns an array of encounters.
 */
export async function fbFetchEncountersForCampaign(campaignId) {
  if (!campaignId) {
    console.error('No campaignId provided to fbFetchEncountersForCampaign.')
    return []
  }

  const encountersCollection = collection(
    db,
    'campaigns',
    campaignId,
    'encounters'
  )

  const snapshot = await getDocs(encountersCollection)
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }))
}

/**
 * Fetch a single encounter by its ID.
 *
 * @param {string} campaignId - ID of the campaign in Firestore.
 * @param {string} encounterId - ID of the encounter in Firestore.
 * @returns {Promise<Object|null>} - Encounter data or null if not found.
 */
export async function fbFetchEncounterById(campaignId, encounterId) {
  if (!campaignId || !encounterId) {
    console.error('Invalid arguments to fbFetchEncounterById.')
    return null
  }

  const docRef = doc(db, 'campaigns', campaignId, 'encounters', encounterId)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    return null
  }
  return { id: docSnap.id, ...docSnap.data() }
}

/**
 * Add a new encounter to the given campaign.
 *
 * @param {string} campaignId - ID of the campaign in Firestore.
 * @param {Object} encounterData - Encounter object to be added.
 * @returns {Promise<Object>} - Returns the newly created encounter, including its new ID.
 */
export async function fbAddEncounter(campaignId, encounterData) {
  if (!campaignId) {
    console.error('No campaignId provided to fbAddEncounter.')
    return null
  }

  const encountersCollection = collection(
    db,
    'campaigns',
    campaignId,
    'encounters'
  )

  // Exclude `id` if it exists
  const { id, ...data } = encounterData
  const docRef = await addDoc(encountersCollection, data)

  return { id: docRef.id, ...data }
}

/**
 * Update an existing encounter.
 *
 * @param {string} campaignId - ID of the campaign in Firestore.
 * @param {string} encounterId - ID of the encounter in Firestore.
 * @param {Object} updatedData - Fields to update.
 * @returns {Promise<void>} - Resolves if successful; otherwise throws an error.
 */
export async function fbUpdateEncounter(campaignId, encounterId, updatedData) {
  if (!campaignId || !encounterId) {
    console.error('Invalid arguments to fbUpdateEncounter.')
    return
  }

  try {
    const encounterDocRef = doc(
      db,
      'campaigns',
      campaignId,
      'encounters',
      encounterId
    )
    await updateDoc(encounterDocRef, updatedData)
  } catch (error) {
    console.error('Error updating encounter:', error)
    throw error
  }
}

/**
 * Delete an encounter by ID from the given campaign.
 *
 * @param {string} campaignId - ID of the campaign in Firestore.
 * @param {string} encounterId - ID of the encounter in Firestore.
 * @returns {Promise<void>} - Resolves when deletion is complete.
 */
export async function fbDeleteEncounter(campaignId, encounterId) {
  if (!campaignId) {
    console.error('No campaignId provided to fbDeleteEncounter.')
    return
  }

  const docRef = doc(db, 'campaigns', campaignId, 'encounters', encounterId)
  await deleteDoc(docRef)
  console.log(`Encounter with ID ${encounterId} deleted successfully.`)
}
