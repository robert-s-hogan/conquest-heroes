<template>
  <div
    class="home flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center"
  >
    <h1 class="text-4xl font-bold text-gray-800 mb-4">
      Welcome to the Home Page
    </h1>
    <p class="text-lg text-gray-600 max-w-md">
      This is a generic home page built with Vue 3 using the Composition API.
    </p>
    <div class="mt-8">
      <router-link
        to="/login"
        class="inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        Get Started
      </router-link>
    </div>
  </div>
</template>

<script setup></script>
