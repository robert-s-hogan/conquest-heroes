<template>
  <div class="flex items-center border-y border-black">
    <span class="flex-1 text-left p-1">{{ label }}</span>
    <!-- Darker Divider with consistent spacing -->
    <span class="w-px h-8 bg-black mx-4"></span>
    <span class="flex-1 text-right p-1">{{ value }}</span>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  label: String,
  value: [String, Number, Boolean],
});
</script>
