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
          <Button variant="primary" type="submit" class="w-full"
            >Register</Button
          >
        </div>
      </form>

      <!-- Google Register Button -->
      <div class="text-center mt-4">
        <Button
          variant="secondary"
          @click="handleGoogleRegister"
          class="w-full"
        >
          Register with Google
        </Button>
      </div>

      <div class="text-center mt-4">
        <Button
          variant="primaryOutlined"
          @click="$router.push('/login')"
          class="w-full"
        >
          Back to Login
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/firebaseConfig'
import { register, loginWithGoogle } from '@/services/Auth/authServices'
import Button from '@/components/Atoms/BaseButton/BaseButton.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

// Function to handle registration
const handleRegister = async () => {
  error.value = '' // Clear previous errors

  try {
    await register(auth, email.value, password.value)
    router.push('/dashboard') // Redirect to dashboard on successful registration
  } catch (err) {
    error.value = err.message // Update UI with specific error message
  }
}

// Function to handle Google registration
const handleGoogleRegister = async () => {
  error.value = '' // Clear previous errors

  try {
    const user = await loginWithGoogle(auth)
    console.log('User registered with Google:', user)
    router.push('/dashboard') // Redirect to dashboard on successful registration
  } catch (err) {
    error.value = err.message // Update UI with specific error message
  }
}
</script>
