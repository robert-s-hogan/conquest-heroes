// LabelText.cy.js
import { mount } from "@cypress/vue";
import LabelText from "./LabelText.vue";

describe("LabelText Component", () => {
  beforeEach(() => {
    mount(LabelText, { props: { text: "Label Example", size: "lg" } });
  });

  it("renders the label text correctly", () => {
    cy.contains("Label Example").should("exist");
  });

  it("applies correct class based on size prop", () => {
    cy.get("span").should("have.class", "text-lg");
  });
});
