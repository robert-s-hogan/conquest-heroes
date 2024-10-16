<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
    @click="closeModal"
  >
    <div
      :class="['bg-white p-4 rounded-lg relative', modalSizeClass]"
      @click.stop
    >
      <button
        @click="closeModal"
        class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-3xl p-2"
      >
        &times;
      </button>
      <div class="mb-4">
        <h2 class="text-lg font-semibold">{{ title }}</h2>
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  isOpen: Boolean,
  title: String,
  size: {
    type: String,
    default: "default", // Default modal size
    validator: (value) => ["default", "large"].includes(value), // Only allow 'default' or 'large'
  },
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};

// Conditional class based on the size prop
const modalSizeClass = computed(() => {
  return props.size === "large"
    ? "max-w-[95vw] w-full max-h-[90vh]"
    : "max-w-md w-full";
});
</script>
