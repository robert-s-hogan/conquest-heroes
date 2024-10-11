// src/components/Atoms/Button/Button.cy.js

import Button from "./Button.vue";

describe("Button Component", () => {
  it("renders correctly with primary variant", () => {
    cy.mount(Button, {
      props: { variant: "primary" },
      slots: {
        default: "Primary Button",
      },
    });
    cy.get("button")
      .should("have.class", "bg-blue-500")
      .and("have.class", "text-white");
  });

  it("renders correctly with secondary variant", () => {
    cy.mount(Button, {
      props: { variant: "secondary" },
      slots: {
        default: "Secondary Button",
      },
    });
    cy.get("button")
      .should("have.class", "bg-gray-500")
      .and("have.class", "text-white");
  });

  it("renders correctly with primaryOutlined variant", () => {
    cy.mount(Button, {
      props: { variant: "primaryOutlined" },
      slots: {
        default: "Outlined Button",
      },
    });
    cy.get("button")
      .should("have.class", "border")
      .and("have.class", "text-blue-500");
  });

  it("emits click event when clicked", () => {
    cy.mount(Button, {
      props: {},
      slots: {
        default: "Clickable Button",
      },
    }).then(({ wrapper }) => {
      // Click the button
      cy.get("button")
        .click()
        .then(() => {
          // Assert the button emitted a click event
          const emittedEvents = wrapper.emitted("click");
          expect(emittedEvents).to.have.length(1); // Expecting exactly one click event to have been emitted
        });
    });
  });
});
