<template>
  <header class="bg-white p-4 flex justify-between items-center text-white">
    <div class="flex items-center space-x-4">
      <Link to="/" class="text-lg font-bold">
        <img
          src="@/assets/conquest-logo.jpg"
          class="h-auto max-w-full w-12 sm:w-16 hover:drop-shadow-lg transition duration-300 object-contain"
          alt="Vue logo"
      /></Link>
      <Navigation :isAuthenticated="isAuthenticated" />
    </div>
    <!-- Show Login Button if not authenticated -->
    <Button variant="primary" @click="handleLogin" v-if="!isAuthenticated">
      Login
    </Button>
    <!-- Show AuthButton component with logout option if authenticated -->
    <AuthButton
      :isAuthenticated="isAuthenticated"
      @logout="handleLogout"
      v-else
    />
  </header>
</template>

<script setup>
import { ref } from "vue";
import Button from "@/components/Atoms/Button/Button.vue";
import Navigation from "@/components/Molecules/Navigation/Navigation.vue";
import AuthButton from "@/components/Molecules/AuthButton/AuthButton.vue";
import Link from "@/components/Atoms/Link/Link.vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "vue-router";

const router = useRouter();
const isAuthenticated = ref(false);

// Listen to auth state changes to update the isAuthenticated status
onAuthStateChanged(auth, (user) => {
  isAuthenticated.value = !!user;
  if (!user) {
    // Redirect to /login if the user is not authenticated
    router.push("/login");
  }
});

const handleLogin = () => {
  router.push("/login");
};

const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};
</script>
