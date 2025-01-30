// services/campaignService.js
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

// 1) fetchCampaigns
export async function fetchCampaigns(
  getDocsFunc = getDocs,
  collectionFunc = collection
) {
  const campaignsCollection = collectionFunc(db, 'campaigns')
  const snapshot = await getDocsFunc(campaignsCollection)
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }))
}

// 2) addCampaign
export async function addCampaign(
  campaign,
  addDocFunc = addDoc,
  collectionFunc = collection
) {
  const campaignsCollection = collectionFunc(db, 'campaigns')

  if (!campaign.campaignName) {
    throw new Error('Missing required fields')
  }

  const { id, ...data } = campaign
  const docRef = await addDocFunc(campaignsCollection, data)
  return { id: docRef.id, ...data }
}

// 3) updateCampaign
export async function updateCampaign(
  campaign,
  updateDocFunc = updateDoc,
  docFunc = doc,
  getDocFunc = getDocs
) {
  const docRef = docFunc(db, 'campaigns', campaign.id)
  const { id, ...data } = campaign
  await updateDocFunc(docRef, data)
  const docSnap = await getDocFunc(docRef)
  return { id: docSnap.id, ...docSnap.data() }
}

// 4) deleteCampaign
export async function deleteCampaign(
  campaignId,
  deleteDocFunc = deleteDoc,
  docFunc = doc
) {
  const docRef = docFunc(db, 'campaigns', campaignId)
  await deleteDocFunc(docRef)
}

// 5) fetchCampaignById (already uses 'db' directly inside)
export async function fetchCampaignById(campaignId) {
  try {
    const campaignRef = doc(db, 'campaigns', campaignId)
    const campaignSnap = await getDoc(campaignRef)
    if (campaignSnap.exists()) {
      return { id: campaignSnap.id, ...campaignSnap.data() }
    } else {
      throw new Error('Campaign not found')
    }
  } catch (error) {
    console.error('Error fetching campaign by ID:', error)
    throw error
  }
}

// 6) updateCampaignInFirebase
export async function updateCampaignInFirebase(campaignId, updatedData) {
  try {
    const campaignDocRef = doc(db, 'campaigns', campaignId)
    await updateDoc(campaignDocRef, updatedData)
  } catch (error) {
    console.error('Error updating campaign in Firebase:', error)
  }
}
