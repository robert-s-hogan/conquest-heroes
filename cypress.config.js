import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // no additional setup needed
    },
    supportFile: "cypress/support/index.js",
  },
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
    // Specify the template path
    indexHtmlFile: "cypress/support/component-index.html",
    specPattern: "src/components/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1280,
    viewportHeight: 720,
    supportFile: "cypress/support/component.js",
  },
});
