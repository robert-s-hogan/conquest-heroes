// DashboardView.cy.js
import { mount } from "@cypress/vue";
import DashboardView from "./DashboardView.vue";

describe("Dashboard View", () => {
  beforeEach(() => {
    cy.mount(DashboardView);
  });

  it("renders the heading and player progression data", () => {
    // Check if the title exists
    cy.contains("Conquest of Heroes v2.5 Framework").should("exist");

    // Check the Player Progression items
    const items = [
      { label: "Level of Player Characters - Start", value: "1" },
      { label: "Player Experience - Start", value: "0" },
      { label: "XP Threshold Easy", value: "100" },
      { label: "XP Threshold Medium", value: "200" },
      { label: "XP Threshold Hard", value: "300" },
      { label: "XP Threshold Deadly", value: "400" },
    ];

    items.forEach((item) => {
      cy.contains(item.label).should("exist");
      cy.contains(item.value).should("exist");
    });
  });
});
