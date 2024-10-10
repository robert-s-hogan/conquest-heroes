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
      "@/firebase": path.resolve(__dirname, "./src/firebase"),
      "@/layouts": path.resolve(__dirname, "./src/layouts"),
      "@/views": path.resolve(__dirname, "./src/views"),
      "@/services": path.resolve(__dirname, "./src/services"),
    },
  },
});
