// Heading.cy.js
import { mount } from "@cypress/vue";
import Heading from "./Heading.vue";

describe("Heading Component", () => {
  beforeEach(() => {
    mount(Heading, { props: { title: "Test Title", level: "1" } });
  });

  it("renders the heading with the correct title", () => {
    cy.contains("Test Title").should("exist");
  });

  it("applies correct class based on level prop", () => {
    cy.get("h2")
      .should("have.class", "text-2xl")
      .and("have.class", "font-bold");
  });
});
