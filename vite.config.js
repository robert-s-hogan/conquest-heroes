import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@/": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/atoms": path.resolve(__dirname, "./src/components/Atoms"),
      "@/molecules": path.resolve(__dirname, "./src/components/Molecules"),
      "@/organisms": path.resolve(__dirname, "./src/components/Organisms"),
      "@/composables": path.resolve(__dirname, "./src/composables"),
      "@/firebase": path.resolve(__dirname, "./src/firebase"),
      "@/layouts": path.resolve(__dirname, "./src/layouts"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/views": path.resolve(__dirname, "./src/views"),
    },
  },
});
