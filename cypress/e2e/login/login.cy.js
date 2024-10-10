describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("displays the login form", () => {
    cy.get("form").should("exist");
    cy.get("input#username").should("exist");
    cy.get("input#password").should("exist");
    cy.get('button[type="submit"]').should("contain", "Login");
  });

  it("logs in with valid credentials", () => {
    cy.get("input#username").type("testuser@example.com");
    cy.get("input#password").type("password123");
    cy.get('button[type="submit"]').click();

    // Redirects to the dashboard after successful login
    cy.url().should("include", "/dashboard");
  });

  it("shows an error for invalid credentials", () => {
    cy.get("input#username").type("invaliduser@example.com");
    cy.get("input#password").type("wrongpassword");
    cy.get('button[type="submit"]').click();

    // Display an error message
    cy.contains("Login error").should("be.visible");
  });
});
