describe("Dashboard Page", () => {
  it("restricts access to unauthenticated users", () => {
    // Attempt to visit the dashboard without logging in
    cy.visit("/dashboard");

    // Verify that the user is redirected to the home page
    cy.url().should("not.include", "/dashboard");
    cy.url().should("include", "/");
  });

  describe("When logged in", () => {
    beforeEach(() => {
      // Perform login before each test in this block
      cy.visit("/login");
      cy.get("input#username").type("testuser@example.com");
      cy.get("input#password").type("password123");
      cy.get('button[type="submit"]').click();

      // Verify the user is redirected to the dashboard
      cy.url().should("include", "/dashboard");
    });

    it("displays the dashboard page", () => {
      // Check the main heading
      cy.get("h1").should("contain", "Dashboard");
      // Check for some common dashboard elements
      cy.get(".dashboard-stats").should("be.visible");
      cy.get(".recent-activity").should("be.visible");
    });

    it("shows user-specific data", () => {
      // Assuming there are user-specific elements, like stats or recent activity
      cy.get(".user-stats").should("be.visible");
      cy.get(".recent-activity").should("contain", "You recently logged in");
    });

    it("logs out the user and restricts access to the dashboard", () => {
      // Log out to test unauthenticated access
      cy.visit("/");
      cy.get("button").contains("Logout").click();

      // Attempt to access the dashboard page
      cy.visit("/dashboard");

      // Ensure the redirect to home page for unauthenticated access
      cy.url().should("not.include", "/dashboard");
      cy.url().should("include", "/");
    });
  });
});
