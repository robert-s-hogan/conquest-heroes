import { defineConfig } from "cypress";
import viteDevServer from "@cypress/vite-dev-server";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // Use Vite as the dev server for Cypress
      on("dev-server:start", (options) => viteDevServer(options));
    },
    supportFile: "cypress/support/index.js",
  },
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
    setupNodeEvents(on, config) {
      on("dev-server:start", (options) => viteDevServer(options));
    },
    specPattern: "src/components/**/*.cy.{js,jsx,ts,tsx}",
  },
});
