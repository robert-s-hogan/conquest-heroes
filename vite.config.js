import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin({
      // **Options**
      // Automatically fix linting errors during development and build
      fix: true,

      // Enable ESLint on build
      include: ['src/**/*.vue', 'src/**/*.js', 'src/**/*.ts'],

      // Exclude specific files or directories
      exclude: ['node_modules/**', 'dist/**'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/assets': path.resolve(__dirname, 'src/assets'),
      '@/composables': path.resolve(__dirname, 'src/composables'),
      '@/firebase': path.resolve(__dirname, 'src/firebase'),
      '@/layouts': path.resolve(__dirname, 'src/layouts'),
      '@/services': path.resolve(__dirname, 'src/services'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/views': path.resolve(__dirname, 'src/views'),
    },
  },
  server: {
    hmr: {
      overlay: false, // Disable overlay for ESLint warnings/errors
    },
  },
})
