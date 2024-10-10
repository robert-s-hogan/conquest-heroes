<template>
  <header class="bg-gray-800 p-4 flex justify-between items-center text-white">
    <div class="flex items-center space-x-4">
      <span class="text-lg font-bold"
        ><router-link to="/" class="hover:underline">Home</router-link></span
      >
      <nav class="space-x-4">
        <router-link
          v-if="isAuthenticated"
          to="/dashboard"
          class="hover:underline"
          >Dashboard</router-link
        >
        <!-- <router-link
          v-if="isAuthenticated"
          to="/campaigns"
          class="hover:underline"
          >Campaigns</router-link
        > -->
        <!-- <router-link
          v-if="isAuthenticated"
          to="/encounter"
          class="hover:underline"
          >Encounter</router-link
        > -->
      </nav>
    </div>

    <div>
      <button
        v-if="isAuthenticated"
        @click="handleLogout"
        class="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
      <router-link
        v-else
        to="/login"
        class="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
      >
        Login
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { auth } from "@firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { logout } from "@services/authServices";
import { useRouter } from "vue-router";

const router = useRouter();
const isAuthenticated = ref(false);

onAuthStateChanged(auth, (user) => {
  isAuthenticated.value = !!user;
});

const handleLogout = async () => {
  try {
    await logout(auth);
    router.push("/"); // Redirect to home on successful logout
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};
</script>
