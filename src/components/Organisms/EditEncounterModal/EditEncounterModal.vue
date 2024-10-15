<template>
  <Modal :isOpen="isOpen" title="Edit Encounter" @close="closeModal">
    <form @submit.prevent="handleSubmit">
      <!-- Add form fields for each encounter property you want to edit -->
      <Input
        v-model="encounterData.encounterDifficulty"
        label="Encounter Difficulty"
        placeholder="Enter difficulty"
      />
      <Input
        v-model="encounterData.encounterAdjustedExperience"
        label="Adjusted Experience"
        type="number"
        placeholder="Enter experience"
      />
      <Input
        v-model="encounterData.goldEarned"
        label="Gold Earned"
        type="number"
        placeholder="Enter gold earned"
      />
      <!-- Add more fields as needed -->

      <div class="flex justify-between mt-4">
        <Button
          type="button"
          variant="danger"
          @click="handleDelete"
          :loading="isDeleting"
        >
          Delete Encounter
        </Button>
        <Button type="submit" variant="primary" :loading="isSubmitting">
          Save Changes
        </Button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import Modal from "@/atoms/Modal/Modal.vue";
import Input from "@/atoms/Input/Input.vue";
import Button from "@/atoms/Button/Button.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  encounter: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "update", "delete"]);

const encounterData = ref({ ...props.encounter });
const isSubmitting = ref(false);
const isDeleting = ref(false);

watch(
  () => props.encounter,
  (newEncounter) => {
    encounterData.value = { ...newEncounter };
  }
);

const closeModal = () => {
  emit("close");
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  await emit("update", encounterData.value);
  isSubmitting.value = false;
  closeModal();
};

const handleDelete = async () => {
  isDeleting.value = true;
  await emit("delete", props.encounter.id);
  isDeleting.value = false;
  closeModal();
};
</script>
