<template>
  <router-link :to="to" class="hover:underline">
    <slot />
  </router-link>
</template>

<script setup>
const props = defineProps({
  to: {
    type: String,
    required: true,
  },
});
</script>
