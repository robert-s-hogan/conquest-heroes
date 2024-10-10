<template>
  <router-link :to="to" class="hover:underline">
    <slot />
  </router-link>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
});
</script>
