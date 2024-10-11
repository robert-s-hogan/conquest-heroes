<template>
  <span :class="textClass">{{ text }}</span>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  text: String,
  size: {
    type: String,
    default: "base", // Other options could be 'sm', 'lg' for example
  },
});

const textClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "text-sm";
    case "lg":
      return "text-lg";
    default:
      return "text-base";
  }
});
</script>
