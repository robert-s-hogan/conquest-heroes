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
        v-model="playerExperienceStart"
        label="Starting Experience"
        type="number"
        placeholder="0"
      />
      <Button :loading="isSubmitting" variant="primary" class="w-full mt-4"
        >Add Campaign</Button
      >
    </form>
  </BaseModal>
</template>

<script setup>
import { ref } from "vue";
import { useCampaign } from "../../composables/useCampaign";
import InputField from "../Atoms/InputField.vue";
import BaseModal from "../Atoms/BaseModal.vue";
import Button from "../Atoms/Button.vue"; // Assuming the Button component is in the Atoms folder

const { addCampaign } = useCampaign();

const isOpen = ref(false);
const isSubmitting = ref(false); // Add loading state for button
const name = ref("");
const description = ref("");
const playerExperienceStart = ref(0);

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  resetForm();
};

const resetForm = () => {
  name.value = "";
  description.value = "";
  playerExperienceStart.value = 0;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  await addCampaign(name.value, description.value, playerExperienceStart.value);
  isSubmitting.value = false;
  closeModal();
};
</script>
