<template>
  <nav class="space-x-4">
    <Link v-if="isAuthenticated" to="/dashboard">Dashboard</Link>
    <!-- Additional links can be added here -->
  </nav>
</template>

<script setup>
import Link from "@/atoms/Link/Link.vue";

const props = defineProps({
  isAuthenticated: {
    type: Boolean,
    default: false,
  },
});
</script>
