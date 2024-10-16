<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
    @click="closeModal"
  >
    <div class="bg-white p-4 rounded-lg max-w-md w-full relative" @click.stop>
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
const props = defineProps({
  isOpen: Boolean,
  title: String,
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>
