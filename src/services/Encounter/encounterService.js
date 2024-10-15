// src/services/encounterService.js
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export async function fetchEncounters(campaignId) {
  if (!campaignId) {
    console.error("No campaignId provided to fetchEncounters.");
    return [];
  }
  const encountersCollection = collection(
    db,
    "campaigns",
    campaignId,
    "encounters"
  );
  const snapshot = await getDocs(encountersCollection);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function addEncounter(campaignId, encounter) {
  if (!campaignId) {
    console.error("No campaignId provided to addEncounter.");
    return null;
  }
  const encountersCollection = collection(
    db,
    "campaigns",
    campaignId,
    "encounters"
  );
  const { id, ...data } = encounter; // Exclude `id` from data
  const docRef = await addDoc(encountersCollection, data);
  return { id: docRef.id, ...data };
}

export const updateEncounter = async (campaignId, encounterId, updatedData) => {
  try {
    const encounterDocRef = doc(
      db,
      "campaigns",
      campaignId,
      "encounters",
      encounterId
    );
    await updateDoc(encounterDocRef, updatedData);
  } catch (error) {
    console.error("Error updating encounter:", error);
    throw error;
  }
};

export async function deleteEncounter(campaignId, encounterId) {
  if (!campaignId) {
    console.error("No campaignId provided to deleteEncounter.");
    return;
  }
  const docRef = doc(db, "campaigns", campaignId, "encounters", encounterId);
  await deleteDoc(docRef);
}
