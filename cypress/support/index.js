// cypress/support/index.js

// Set a base URL globally (useful for Vite with SPA routing)
Cypress.config("baseUrl", "http://localhost:5173");

// Catch unhandled exceptions that are not relevant to tests
Cypress.on("uncaught:exception", (err, runnable) => {
  // Returning false here prevents Cypress from failing the test due to these exceptions
  if (err.message.includes("specific error to ignore")) {
    return false;
  }
  // By default, let Cypress fail on other exceptions
});
console.log("Cypress support file loaded"); // Add this line

// Import custom commands if you create any in `cypress/support/commands.js`
import "./commands";
