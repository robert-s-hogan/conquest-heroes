<template>
  <button :class="buttonClasses" @click="handleClick">
    <slot />
  </button>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
  },
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  emit("click"); // Emit click event here
};

const buttonClasses = computed(() => {
  switch (props.variant) {
    case "primary":
      return "bg-blue-500 text-white";
    case "secondary":
      return "bg-gray-500 text-white";
    case "primaryOutlined":
      return "border text-blue-500";
    default:
      return "";
  }
});
</script>
