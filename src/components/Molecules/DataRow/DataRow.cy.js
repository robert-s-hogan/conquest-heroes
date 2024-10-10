// DataRow.cy.js
import { mount } from "@cypress/vue";
import DataRow from "./DataRow.vue";

describe("DataRow Component", () => {
  beforeEach(() => {
    mount(DataRow, { props: { label: "Player Level", value: "5" } });
  });

  it("renders label and value correctly", () => {
    cy.contains("Player Level").should("exist");
    cy.contains("5").should("exist");
  });
});
