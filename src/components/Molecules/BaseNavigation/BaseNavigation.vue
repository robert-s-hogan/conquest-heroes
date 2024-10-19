<template>
  <nav class="space-x-4">
    <Link v-if="isAuthenticated" to="/dashboard" class="text-black"
      >Dashboard</Link
    >
    <!-- Additional links can be added here -->
  </nav>
</template>

<script setup>
import Link from '@/components/Atoms/BaseLink/BaseLink.vue'

const props = defineProps({
  isAuthenticated: {
    type: Boolean,
    default: false,
  },
})
</script>
