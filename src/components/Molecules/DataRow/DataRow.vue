<template>
  <div class="flex justify-between p-2 border-b border-gray-200">
    <span class="font-semibold">{{ label }}</span>
    <span>{{ value }}</span>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  label: String,
  value: [String, Number, Boolean],
});
</script>
