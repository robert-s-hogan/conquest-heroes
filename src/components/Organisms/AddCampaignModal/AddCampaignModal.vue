<!-- AddCampaignModal.vue -->
<template>
  <BaseModal :isOpen="isOpen" title="Add New Campaign" @close="closeModal">
    <form @submit.prevent="handleSubmit">
      <InputField
        v-model="name"
        label="Campaign Name"
        placeholder="Enter campaign name"
      />
      <InputField
        v-model="description"
        label="Description"
        placeholder="Enter description"
      />
      <InputField
        v-model="startXp"
        label="Starting Experience"
        type="number"
        placeholder="0"
      />
      <Button :loading="isSubmitting" variant="primary" class="w-full mt-4">
        Add Campaign
      </Button>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import InputField from "@/atoms/Input/Input.vue";
import BaseModal from "@/atoms/Modal/Modal.vue";
import Button from "@/atoms/Button/Button.vue";

const emit = defineEmits(["close", "submit"]);

const isOpen = ref(false);
const isSubmitting = ref(false);
const name = ref("");
const description = ref("");
const startXp = ref(0); // Renamed to startXp

const closeModal = () => {
  emit("close");
  resetForm();
};

const resetForm = () => {
  name.value = "";
  description.value = "";
  startXp.value = 0;
};

const handleSubmit = () => {
  isSubmitting.value = true;
  emit("submit", {
    name: name.value,
    description: description.value,
    startXp: startXp.value, // Changed to startXp
  });
  isSubmitting.value = false;
  closeModal();
};
</script>
