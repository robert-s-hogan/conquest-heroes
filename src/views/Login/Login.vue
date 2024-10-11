<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-xs">
      <h1 class="text-2xl font-bold text-center text-gray-700 mb-6">Login</h1>
      <form
        @submit.prevent="handleSubmit"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="username"
          >
            Username
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            v-model="username"
            required
          />
        </div>
        <div class="mb-6">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
          >
            Password
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            v-model="password"
            required
          />
        </div>
        <div class="flex items-center justify-between">
          <Button variant="primary" type="submit" class="w-full">
            Login
          </Button>
        </div>

        <!-- Add this below the Back to Login link -->
        <div class="text-center mt-4">
          <router-link
            to="/reset-password"
            class="text-blue-500 hover:underline"
          >
            Forgot Password?
          </router-link>
        </div>

        <!-- Link to Register Page -->
        <div>
          <router-link to="/register" class="text-blue-500 hover:underline">
            Don't have an account? Register
          </router-link>
        </div>
      </form>

      <!-- Google Login Button -->
      <div class="text-center mt-4">
        <Button variant="secondary" @click="handleGoogleLogin" class="w-full">
          Login with Google
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@/firebase/firebaseConfig";
import { login, loginWithGoogle } from "@/services/Auth/authServices";
import Button from "@/components/atoms/Button/Button.vue"; // Import Button component

const router = useRouter();
const username = ref("");
const password = ref("");

// Function to handle login with email and password
const handleSubmit = async () => {
  try {
    await login(auth, username.value, password.value);
    router.push("/dashboard"); // Redirect to dashboard on successful login
  } catch (error) {
    console.error("Login error:", error.message);
  }
};

// Function to handle Google login
const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle(auth);
    router.push("/dashboard"); // Redirect to dashboard on successful Google login
  } catch (error) {
    console.error("Google login error:", error.message);
  }
};
</script>
