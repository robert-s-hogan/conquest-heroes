<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-xs">
      <h1 class="text-2xl font-bold text-center text-gray-700 mb-6">
        Register
      </h1>
      <form
        @submit.prevent="handleRegister"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            v-model="password"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@firebase/firebase";
import { register } from "@/services/authServices";

const router = useRouter();
const email = ref("");
const password = ref("");

const handleRegister = async () => {
  try {
    await register(auth, email.value, password.value);
    router.push("/dashboard"); // Redirect to dashboard on successful registration
  } catch (error) {
    console.error("Registration error:", error.message);
  }
};
</script>
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-xs">
      <h1 class="text-2xl font-bold text-center text-gray-700 mb-6">
        Register
      </h1>
      <form
        @submit.prevent="handleRegister"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            id="password"
            type="password"
            v-model="password"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Register
          </button>
        </div>
      </form>

      <!-- Google Register Button -->
      <div class="text-center mt-4">
        <button
          @click="handleGoogleRegister"
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Register with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@firebase/firebase";
import { register, loginWithGoogle } from "@services/authServices";

const router = useRouter();
const email = ref("");
const password = ref("");

const handleRegister = async () => {
  try {
    await register(auth, email.value, password.value);
    router.push("/dashboard"); // Redirect to dashboard on successful registration
  } catch (error) {
    console.error("Registration error:", error.message);
  }
};

const handleGoogleRegister = async () => {
  try {
    await loginWithGoogle(auth);
    router.push("/dashboard"); // Redirect to dashboard on successful Google login
  } catch (error) {
    console.error("Google registration error:", error.message);
  }
};
</script>
