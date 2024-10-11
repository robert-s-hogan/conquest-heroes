// DataSection.cy.js
import { mount } from "@cypress/vue";
import DataSection from "./DataSection.vue";

describe("DataSection Component", () => {
  const items = [
    { label: "Player Level", value: "5" },
    { label: "Experience", value: "100" },
  ];

  beforeEach(() => {
    mount(DataSection, { props: { title: "Player Stats", items } });
  });

  it("renders section title", () => {
    cy.contains("Player Stats").should("exist");
  });

  it("renders each DataRow item", () => {
    items.forEach((item) => {
      cy.contains(item.label).should("exist");
      cy.contains(item.value).should("exist");
    });
  });
});
