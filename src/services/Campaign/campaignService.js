// services/campaignService.js
export async function fetchCampaigns(
  db,
  getDocsFunc = getDocs,
  collectionFunc = collection
) {
  const campaignsCollection = collectionFunc(db, "campaigns");
  const snapshot = await getDocsFunc(campaignsCollection);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function addCampaign(
  db,
  campaign,
  addDocFunc = addDoc,
  collectionFunc = collection
) {
  const campaignsCollection = collectionFunc(db, "campaigns");
  const { id, ...data } = campaign;
  const docRef = await addDocFunc(campaignsCollection, data);
  return { id: docRef.id, ...data };
}

export async function updateCampaign(
  db,
  campaign,
  updateDocFunc = updateDoc,
  docFunc = doc,
  getDocFunc = getDoc
) {
  const docRef = docFunc(db, "campaigns", campaign.id);
  const { id, ...data } = campaign;
  await updateDocFunc(docRef, data);
  const docSnap = await getDocFunc(docRef);
  return { id: docSnap.id, ...docSnap.data() };
}

export async function deleteCampaign(
  db,
  campaignId,
  deleteDocFunc = deleteDoc,
  docFunc = doc
) {
  const docRef = docFunc(db, "campaigns", campaignId);
  await deleteDocFunc(docRef);
}
