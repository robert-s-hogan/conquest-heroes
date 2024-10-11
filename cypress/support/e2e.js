// cypress/support/e2e.js

// Import custom commands
import "./commands";

// Catch unhandled exceptions
Cypress.on("uncaught:exception", (err, runnable) => {
  // Return false to prevent the test from failing
  return false;
});
