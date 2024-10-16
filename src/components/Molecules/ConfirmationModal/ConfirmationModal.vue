<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75"
  >
    <div class="bg-white p-6 rounded shadow-md w-96">
      <Heading :title="title" level="2" class="mb-4" />
      <Paragraph :text="message" class="mb-6" />
      <div class="flex justify-end space-x-4">
        <Button variant="secondary" @click="onCancel">Cancel</Button>
        <Button variant="danger" @click="onConfirm">Confirm</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "@/atoms/Button/Button.vue";
import Heading from "@/atoms/Heading/Heading.vue";
import Paragraph from "@/atoms/Paragraph/Paragraph.vue";

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: "Confirm Action" },
  message: { type: String, required: true },
});

const emit = defineEmits(["confirm", "cancel"]);

const onConfirm = () => {
  emit("confirm");
};

const onCancel = () => {
  emit("cancel");
};
</script>
