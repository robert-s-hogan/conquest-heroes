<template>
  <p :class="textClass">{{ text }}</p>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  text: String,
  size: {
    type: String,
    default: "base", // Options could include 'sm', 'lg' for example
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
