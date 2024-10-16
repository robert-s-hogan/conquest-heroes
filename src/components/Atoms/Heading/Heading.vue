<template>
  <h2 :class="headingClass">{{ title }}</h2>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  level: {
    type: String,
    default: "2", // Can accept '1', '2', '3', etc., for heading levels
  },
});

const headingClass = computed(() => {
  switch (props.level) {
    case "1":
      return "text-2xl font-bold mb-2";
    case "3":
      return "text-md font-semibold mb-1";
    default:
      return "text-lg font-bold mb-2";
  }
});
</script>
