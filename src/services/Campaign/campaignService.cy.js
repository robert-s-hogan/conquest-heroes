// src/services/campaignService.cy.js
import { fetchCampaigns } from "./campaignService";
import { mockFirestore, resetFirestoreMocks } from "./firebaseFirestoreMock";
import sinon from "sinon";

// Mock the Firestore module
const firestoreModule = await import("firebase/firestore");
sinon.stub(firestoreModule, "collection").callsFake(mockFirestore.collection);
sinon.stub(firestoreModule, "getDocs").callsFake(mockFirestore.getDocs);
// ... Repeat for other methods as needed

describe("Campaign Service Tests", () => {
  it("should fetch campaigns successfully", async () => {
    // Mock Firestore methods
    const mockGetDocs = cy.stub().resolves({
      docs: [
        { id: "1", data: () => ({ name: "Campaign 1" }) },
        { id: "2", data: () => ({ name: "Campaign 2" }) },
      ],
    });
    const mockCollection = cy.stub().returns("campaignsCollection");

    // Call the service function with mocks
    const campaigns = await fetchCampaigns(null, mockGetDocs, mockCollection);

    // Assertions
    expect(mockCollection).to.have.been.calledWith(null, "campaigns");
    expect(campaigns).to.deep.equal([
      { id: "1", name: "Campaign 1" },
      { id: "2", name: "Campaign 2" },
    ]);
  });
});

it("should add a campaign successfully", async () => {
  // Mock Firestore methods
  const mockAddDoc = cy.stub().resolves({ id: "newCampaignId" });
  const mockCollection = cy.stub().returns("campaignsCollection");

  const newCampaign = { name: "New Campaign" };

  // Call the service function with mocks
  const campaign = await addCampaign(
    null,
    newCampaign,
    mockAddDoc,
    mockCollection
  );

  // Assertions
  expect(mockCollection).to.have.been.calledWith(null, "campaigns");
  expect(mockAddDoc).to.have.been.calledWith(
    "campaignsCollection",
    newCampaign
  );
  expect(campaign).to.deep.equal({ id: "newCampaignId", name: "New Campaign" });
});

it("should update a campaign successfully", async () => {
  // Mock Firestore methods
  const mockDoc = cy.stub().returns("campaignDocRef");
  const mockUpdateDoc = cy.stub().resolves();
  const mockGetDoc = cy
    .stub()
    .resolves({ id: "1", data: () => ({ name: "Updated Campaign" }) });

  const campaignToUpdate = { id: "1", name: "Updated Campaign" };

  // Call the service function with mocks
  const updatedCampaign = await updateCampaign(
    null,
    campaignToUpdate,
    mockUpdateDoc,
    mockDoc,
    mockGetDoc
  );

  // Assertions
  expect(mockDoc).to.have.been.calledWith(null, "campaigns", "1");
  expect(mockUpdateDoc).to.have.been.calledWith("campaignDocRef", {
    name: "Updated Campaign",
  });
  expect(updatedCampaign).to.deep.equal({ id: "1", name: "Updated Campaign" });
});

it("should delete a campaign successfully", async () => {
  // Mock Firestore methods
  const mockDoc = cy.stub().returns("campaignDocRef");
  const mockDeleteDoc = cy.stub().resolves();

  const campaignIdToDelete = "1";

  // Call the service function with mocks
  await deleteCampaign(null, campaignIdToDelete, mockDeleteDoc, mockDoc);

  // Assertions
  expect(mockDoc).to.have.been.calledWith(null, "campaigns", "1");
  expect(mockDeleteDoc).to.have.been.calledWith("campaignDocRef");
});
