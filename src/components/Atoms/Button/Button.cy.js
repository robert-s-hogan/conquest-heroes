import Button from "./Button.vue";

describe("Button Component", () => {
  it("renders correctly with primary variant", () => {
    cy.mount(Button, { props: { variant: "primary" } });
    cy.get("button")
      .should("have.class", "bg-blue-500")
      .and("have.class", "text-white");
  });

  it("renders correctly with secondary variant", () => {
    cy.mount(Button, { props: { variant: "secondary" } });
    cy.get("button")
      .should("have.class", "bg-gray-500")
      .and("have.class", "text-white");
  });

  it("renders correctly with primaryOutlined variant", () => {
    cy.mount(Button, { props: { variant: "primaryOutlined" } });
    cy.get("button")
      .should("have.class", "border")
      .and("have.class", "text-blue-500");
  });

  it("emits click event when clicked", () => {
    const clickSpy = cy.spy().as("clickSpy");
    cy.mount(Button, {
      props: {
        onClick: clickSpy,
      },
    });

    cy.get("button")
      .click()
      .then(() => {
        cy.get("@clickSpy").should("have.been.calledOnce");
      });
  });
});
