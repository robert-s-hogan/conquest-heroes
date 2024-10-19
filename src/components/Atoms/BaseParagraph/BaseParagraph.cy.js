// Paragraph.cy.js
import { mount } from "@cypress/vue";
import Paragraph from "./Paragraph.vue";

describe("Paragraph Component", () => {
  beforeEach(() => {
    mount(Paragraph, {
      props: {
        text: "Sample text",
        size: "sm",
      },
    });
  });

  it("renders the paragraph with the correct text", () => {
    cy.contains("Sample text").should("exist");
  });

  it("applies correct class based on size prop", () => {
    cy.get("p").should("have.class", "text-sm");
  });
});
