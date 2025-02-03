<!-- BaseModal.vue (After) -->
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
    @click="closeModal"
  >
    <div
      :class="[
        'bg-white p-4 rounded-lg relative overflow-y-auto',
        modalSizeClass,
      ]"
      @click.stop
    >
      <!-- Close Button -->
      <button
        @click="closeModal"
        class="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
      >
        &times;
      </button>

      <!-- Title -->
      <h2 v-if="title" class="mb-4 text-lg font-semibold">
        {{ title }}
      </h2>

      <!-- Scrollable Content Wrapper -->
      <div class="max-h-[70vh] overflow-y-auto">
        <slot />
      </div>

      <!-- Footer Slot -->
      <div class="mt-4">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: {
    type: String,
    default: 'default',
    validator: (val) => ['default', 'large'].includes(val),
  },
})
const emit = defineEmits(['close'])

function closeModal() {
  emit('close')
}

const modalSizeClass = computed(() => {
  return props.size === 'large'
    ? 'max-w-[95vw] w-full max-h-[90vh]'
    : 'max-w-md w-full'
})
</script>
