import { defineConfig } from "cypress";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
      viteConfigFile: path.resolve(__dirname, "vite.config.js"),
    },
    specPattern: [
      "src/components/**/**/*.cy.{js,jsx,ts,tsx}",
      "src/services/**/**/*.cy.{js,jsx,ts,tsx}",
    ],
    viewportWidth: 1280,
    viewportHeight: 720,
    supportFile: "cypress/support/component.js",
    browser: "edge",
  },
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/index.js",
  },
});
