<template>
  <BaseModal :isOpen="isOpen" title="Add New Encounter" @close="closeModal">
    <form @submit.prevent="handleSubmit">
      <InputField
        v-model="encounterDifficulty"
        label="Encounter Difficulty"
        placeholder="Enter encounter difficulty (e.g., Easy, Medium)"
      />
      <InputField
        v-model="groupExperienceEarned"
        label="Group Experience Earned"
        type="number"
        placeholder="Enter experience points"
      />
      <InputField
        v-model="goldEarned"
        label="Gold Earned"
        type="number"
        placeholder="Enter gold earned"
      />
      <InputField
        v-model="encounterAdjustedExperience"
        label="Adjusted Experience"
        type="number"
        placeholder="Enter adjusted experience"
      />
      <Button :loading="isSubmitting" variant="primary" class="w-full mt-4">
        Add Encounter
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
const encounterDifficulty = ref("");
const groupExperienceEarned = ref(0);
const goldEarned = ref(0);
const encounterAdjustedExperience = ref(0);

const closeModal = () => {
  emit("close");
  resetForm();
};

const resetForm = () => {
  encounterDifficulty.value = "";
  groupExperienceEarned.value = 0;
  goldEarned.value = 0;
  encounterAdjustedExperience.value = 0;
};

const handleSubmit = () => {
  isSubmitting.value = true;
  emit("submit", {
    encounterDifficulty: encounterDifficulty.value,
    groupExperienceEarned: groupExperienceEarned.value,
    goldEarned: goldEarned.value,
    encounterAdjustedExperience: encounterAdjustedExperience.value,
  });
  isSubmitting.value = false;
  closeModal();
};
</script>
