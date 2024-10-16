import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // Optional: Add specific aliases if needed, ensuring correct casing
      "@/components": path.resolve(__dirname, "src/components"),
      "@/assets": path.resolve(__dirname, "src/assets"),
      "@/composables": path.resolve(__dirname, "src/composables"),
      "@/firebase": path.resolve(__dirname, "src/firebase"),
      "@/layouts": path.resolve(__dirname, "src/layouts"),
      "@/services": path.resolve(__dirname, "src/services"),
      "@/utils": path.resolve(__dirname, "src/utils"),
      "@/views": path.resolve(__dirname, "src/views"),
    },
  },
});
