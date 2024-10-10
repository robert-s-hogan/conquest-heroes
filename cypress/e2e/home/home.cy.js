describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays the home page content", () => {
    // Check for the main title
    cy.get("h1").should("contain", "Welcome to the Home Page");

    // Check for the description text
    cy.get("p").should(
      "contain",
      "This is a generic home page built with Vue 3 using the Composition API"
    );

    // Check for the Get Started button
    cy.get("a")
      .should("contain", "Get Started")
      .should("have.attr", "href", "/login")
      .and("have.class", "bg-blue-500");
  });

  it("navigates to the login page when Get Started is clicked", () => {
    cy.get("a").contains("Get Started").click();

    // After clicking, it should go to the login page
    cy.url().should("include", "/login");
  });
});
