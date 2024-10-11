<template>
  <div class="mb-4">
    <label v-if="label" class="block text-gray-700 text-sm font-bold mb-1">{{
      label
    }}</label>
    <input
      :type="type"
      :placeholder="placeholder"
      v-model="modelValue"
      @input="$emit('update:modelValue', modelValue)"
      class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
    />
    <p v-if="error" class="text-red-500 text-xs italic">{{ error }}</p>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: "text",
  },
  error: String,
});
</script>
