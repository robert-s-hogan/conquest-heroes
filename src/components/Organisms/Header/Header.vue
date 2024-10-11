<template>
  <header class="bg-gray-800 p-4 flex justify-between items-center text-white">
    <div class="flex items-center space-x-4">
      <Link to="/" class="text-lg font-bold">Home</Link>
      <Navigation :isAuthenticated="isAuthenticated" />
    </div>
    <AuthButton :isAuthenticated="isAuthenticated" />
  </header>
</template>

<script setup>
import { ref } from "vue";
import Navigation from "@/molecules/Navigation/Navigation.vue";
import AuthButton from "@/molecules/AuthButton/AuthButton.vue";
import Link from "@/atoms/Link/Link.vue";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

const isAuthenticated = ref(false);

onAuthStateChanged(auth, (user) => {
  isAuthenticated.value = !!user;
});
</script>
