<template>
  <button :class="buttonClasses" @click="onClick">
    <slot />
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "secondary", "primaryOutlined"].includes(value),
  },
});

const emit = defineEmits(["click"]);

const onClick = () => {
  emit("click");
};

// Dynamic button classes based on the variant
const buttonClasses = computed(() => {
  switch (props.variant) {
    case "secondary":
      return "bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600";
    case "primaryOutlined":
      return "border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white";
    default:
      return "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600";
  }
});
</script>
