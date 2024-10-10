describe("Register Page", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("displays the registration form", () => {
    cy.get("h1").should("contain", "Register");
    cy.get("input#email").should("exist");
    cy.get("input#password").should("exist");
    cy.get('button[type="submit"]').should("contain", "Register");
    cy.get("button").contains("Register with Google").should("exist");
  });

  it("registers a new user with valid credentials", () => {
    const email = `testuser${Date.now()}@example.com`; // Unique email for testing
    const password = "password123";

    cy.get("input#email").type(email);
    cy.get("input#password").type(password);
    cy.get('button[type="submit"]').click();

    // Redirects to the dashboard after successful registration
    cy.url().should("include", "/dashboard");
  });

  it("shows an error for duplicate email registration", () => {
    const existingEmail = "existinguser@example.com"; // Replace with an existing email
    const password = "password123";

    cy.get("input#email").type(existingEmail);
    cy.get("input#password").type(password);
    cy.get('button[type="submit"]').click();

    // Check for error message (adjust to match your app’s specific error message)
    cy.contains("Registration error").should("be.visible");
  });
});
