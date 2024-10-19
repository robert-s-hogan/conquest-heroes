<template>
  <div class="mb-1">
    <label :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <select
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
    >
      <option disabled value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Number],
  label: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Please select an option',
  },
  id: {
    type: String,
    default: () => `select-${Math.random().toString(36).substr(2, 9)}`,
  },
})

const emit = defineEmits(['update:modelValue'])
</script>
