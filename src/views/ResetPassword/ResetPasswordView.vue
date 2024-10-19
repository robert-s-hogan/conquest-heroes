<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-xs">
      <h1 class="text-2xl font-bold text-center text-gray-700 mb-6">
        Reset Password
      </h1>
      <form
        @submit.prevent="handlePasswordReset"
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
        <div class="flex items-center justify-between">
          <Button variant="primary" type="submit" class="w-full">
            Send Reset Link
          </Button>
        </div>
      </form>

      <!-- Message Section -->
      <div v-if="message" class="mt-4 text-center text-green-500">
        {{ message }}
      </div>
      <div v-if="error" class="mt-4 text-center text-red-500">
        {{ error }}
      </div>

      <div class="text-center mt-4">
        <router-link to="/login" class="text-blue-500 hover:underline">
          Back to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '@/firebase/firebaseConfig'
import { sendPasswordResetEmail } from 'firebase/auth'
import Button from '@/components/Atoms/BaseButton/BaseButton.vue'

const email = ref('')
const message = ref('')
const error = ref('')

// Function to handle password reset
const handlePasswordReset = async () => {
  message.value = '' // Clear any previous messages
  error.value = '' // Clear any previous errors

  try {
    await sendPasswordResetEmail(auth, email.value)
    message.value = 'Password reset link sent! Please check your email.'
  } catch (err) {
    console.error('Error sending password reset email:', err.message)
    error.value = 'Failed to send password reset email. Please try again.'
  }
}
</script>
