// src/components/atoms/Button/Button.cy.js

import { mount } from "@cypress/vue";
import Button from "./Button.vue";

describe("Button Component", () => {
  it("renders correctly with primary variant", () => {
    mount(Button, {
      props: { variant: "primary" },
      slots: {
        default: "Primary Button",
      },
    });
    cy.get('[data-cy="button"]')
      .should("have.class", "bg-blue-500")
      .and("have.class", "text-white");
  });

  it("renders correctly with secondary variant", () => {
    mount(Button, {
      props: { variant: "secondary" },
      slots: {
        default: "Secondary Button",
      },
    });
    cy.get('[data-cy="button"]')
      .should("have.class", "bg-gray-500")
      .and("have.class", "text-white");
  });

  it("renders correctly with primaryOutlined variant", () => {
    mount(Button, {
      props: { variant: "primaryOutlined" },
      slots: {
        default: "Outlined Button",
      },
    });
    cy.get('[data-cy="button"]')
      .should("have.class", "border")
      .and("have.class", "text-blue-500");
  });

  it("displays spinner when loading is true", () => {
    mount(Button, {
      props: { loading: true, variant: "primary" },
      slots: {
        default: "Primary Button",
      },
    });
    cy.get('[data-cy="button"]').should("have.class", "opacity-70");
    cy.get("svg.animate-spin").should("exist");
    cy.get("span").should("not.exist"); // Text should be hidden when loading
  });

  it("emits click event when clicked", () => {
    mount(Button, {
      props: { loading: false },
      slots: {
        default: "Clickable Button",
      },
    }).then(({ wrapper }) => {
      cy.get('[data-cy="button"]')
        .click()
        .then(() => {
          const emittedEvents = wrapper.emitted("click");
          expect(emittedEvents).to.have.length(1); // Expecting exactly one click event to have been emitted
        });
    });
  });
});
